import { z } from "zod";

// The club's latest Instagram posts, read through the Instagram API with
// Instagram Login (the account has to be Professional — the API that served
// personal accounts was shut down in 2024). Unlike everything in data.ts this is
// not content in the repo: it is fetched at render time and can fail, so every
// failure ends in an empty list and the section simply is not drawn. A missing
// token is the same case, which is what a preview or a fresh clone gets.
const API = "https://graph.instagram.com";

// How often the home page re-reads the feed, pulled in two directions. The CDN
// URLs Instagram hands back are signed and expire after about four days, so a
// page cached for longer than that would show broken images. But every read
// returns freshly signed URLs, and each new URL is a new image to the optimiser
// — billed per transformation — so reading hourly would spend the quota
// re-optimising the same six pictures. Six hours is well inside the first limit
// and costs a few hundred transformations a month.
const REVALIDATE_SECONDS = 21600;

// One picture or clip inside a carousel. It has no caption or permalink of its
// own — those belong to the post.
const ChildSchema = z.object({
  media_type: z.enum(["IMAGE", "VIDEO"]),
  media_url: z.url().optional(),
  thumbnail_url: z.url().optional(),
});

const MediaSchema = z.object({
  id: z.string(),
  media_type: z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
  // Absent on a reel whose audio is copyrighted: the API withholds the file.
  media_url: z.url().optional(),
  // Videos only — the still to show in place of the file.
  thumbnail_url: z.url().optional(),
  permalink: z.url(),
  caption: z.string().optional(),
  timestamp: z.string(),
  // Carousels only. Parsed leniently, one by one, in toPosts.
  children: z.object({ data: z.array(z.unknown()) }).optional(),
});

const MediaListSchema = z.object({ data: z.array(z.unknown()) });

// What the on-site preview shows, one at a time: a still, and for a clip the
// file to play over it. A post that is not a carousel is a single slide.
export type InstagramSlide = { image: string; video?: string };

export type InstagramPost = {
  id: string;
  kind: "image" | "video" | "album";
  // Always a still image, whatever the kind: the tile in the grid.
  image: string;
  slides: InstagramSlide[];
  permalink: string;
  caption: string;
  timestamp: string;
};

const KINDS = { IMAGE: "image", VIDEO: "video", CAROUSEL_ALBUM: "album" } as const;

// A still and, for a video, its file. A video's media_url is the mp4, which an
// <img> cannot show, so its still is the thumbnail; with no thumbnail there is
// nothing to draw and the entry is dropped.
function toSlide(m: { media_type: string; media_url?: string; thumbnail_url?: string }): InstagramSlide | null {
  if (m.media_type === "VIDEO") {
    return m.thumbnail_url ? { image: m.thumbnail_url, video: m.media_url } : null;
  }
  return m.media_url ? { image: m.media_url } : null;
}

// Maps the API's list to what the grid draws. Entries are parsed one by one so
// that a single post in a shape we don't know (a new media type, say) drops out
// on its own instead of taking the whole feed with it. A post with no still to
// show is dropped too.
export function toPosts(payload: unknown, limit: number): InstagramPost[] {
  const list = MediaListSchema.safeParse(payload);
  if (!list.success) return [];

  const posts: InstagramPost[] = [];
  for (const entry of list.data.data) {
    const media = MediaSchema.safeParse(entry);
    if (!media.success) continue;
    const m = media.data;
    const cover = toSlide(m);
    if (!cover) continue;
    // A carousel's own media_url is only its first picture; the rest come as
    // children. A child in an unknown shape drops out alone, and a carousel
    // whose children cannot be read still previews as its cover.
    const children = (m.children?.data ?? [])
      .map((child) => ChildSchema.safeParse(child))
      .flatMap((child) => (child.success ? [toSlide(child.data)] : []))
      .filter((slide): slide is InstagramSlide => slide !== null);
    posts.push({
      id: m.id,
      kind: KINDS[m.media_type],
      image: cover.image,
      slides: children.length > 0 ? children : [cover],
      permalink: m.permalink,
      caption: m.caption ?? "",
      timestamp: m.timestamp,
    });
    if (posts.length === limit) break;
  }
  return posts;
}

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  const url = new URL(`${API}/me/media`);
  url.searchParams.set(
    "fields",
    "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,children{media_type,media_url,thumbnail_url}",
  );
  // Ask for more than we show: some posts are dropped for having no still.
  url.searchParams.set("limit", String(limit * 2));
  url.searchParams.set("access_token", token);

  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      console.error(`Instagram feed failed: ${res.status}`);
      return [];
    }
    return toPosts(await res.json(), limit);
  } catch (error) {
    console.error("Instagram feed failed:", error);
    return [];
  }
}

// Long-lived tokens last 60 days and can be extended any time after their first
// 24 hours, for another 60 from that moment. Returns the token the API answers
// with so the caller can tell whether it is still the one in the environment.
export async function refreshInstagramToken(
  token: string,
): Promise<{ token: string; expiresInDays: number }> {
  const url = new URL(`${API}/refresh_access_token`);
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", token);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Instagram token refresh failed: ${res.status}`);
  const body = z
    .object({ access_token: z.string(), expires_in: z.number() })
    .parse(await res.json());
  return { token: body.access_token, expiresInDays: Math.floor(body.expires_in / 86400) };
}
