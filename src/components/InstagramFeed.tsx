import { FaInstagram } from "react-icons/fa";
import InstagramGallery from "@/components/InstagramGallery";
import ButtonLink from "@/components/ButtonLink";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getInstagramPosts, type InstagramPost } from "@/lib/instagram";
import { instagramHandle, matchDateShort } from "@/lib/format";
import { getI18n } from "@/i18n/server";

// Captions run to paragraphs of hashtags; the first line is the part that
// describes the picture. Captions are the club's own words and stay as posted.
function altText(post: InstagramPost, fallback: string): string {
  const firstLine = post.caption.split("\n")[0].trim();
  if (!firstLine) return fallback;
  return firstLine.length > 120 ? `${firstLine.slice(0, 119)}…` : firstLine;
}

// Everything the home page has to say about Instagram: the latest posts and
// the invitation to follow. The two used to be separate sections at opposite
// ends of the page. Only the grid depends on the API, so with no posts to show
// — no token, an API failure, an empty profile — the section falls back to the
// invitation alone, under a title that no longer promises pictures.
export default async function InstagramFeed({ profileUrl }: { profileUrl: string }) {
  const { t, lang } = await getI18n();
  const posts = await getInstagramPosts(6);
  const hasPosts = posts.length > 0;

  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          label={t.instagram.label}
          title={hasPosts ? t.instagram.titleWithPosts : t.instagram.titleWithoutPosts}
          anchor="instagram"
        />
        <Reveal>
          {hasPosts && (
            <InstagramGallery
              posts={posts.map((post) => {
                const date = matchDateShort(post.timestamp, lang);
                return { ...post, date, alt: altText(post, t.instagram.postAlt(date)) };
              })}
              labels={{
                video: t.instagram.video,
                album: t.instagram.album,
                open: t.instagram.open,
                close: t.instagram.close,
                previous: t.instagram.previous,
                next: t.instagram.next,
                openOnInstagram: t.instagram.openOnInstagram,
              }}
            />
          )}
          {/* Kept short on a phone — smaller type, tighter padding, no big icon
              (the button carries one) — so it reads as the caption to the
              pictures rather than outweighing them. */}
          <div className="flex flex-col items-center gap-5 border border-white/10 bg-surface px-5 py-6 text-center sm:flex-row sm:justify-between sm:gap-6 sm:px-6 sm:py-10 sm:text-left">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <FaInstagram className="hidden shrink-0 text-accent sm:block" size={56} aria-hidden="true" />
              <div>
                <h3 className="font-display italic uppercase text-xl sm:text-3xl leading-tight">
                  {t.instagram.pitchTitle}
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm text-muted sm:mx-0 sm:mt-3 sm:text-base">{t.instagram.pitchBody}</p>
              </div>
            </div>
            <ButtonLink href={profileUrl} external>
              <FaInstagram size={18} aria-hidden="true" /> {t.instagram.follow(instagramHandle(profileUrl))}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
