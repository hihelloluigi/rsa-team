import Image from "next/image";
import { FaInstagram, FaPlay, FaRegClone } from "react-icons/fa";
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

const KIND_BADGES = {
  image: null,
  video: { Icon: FaPlay, label: "video" },
  album: { Icon: FaRegClone, label: "album" },
} as const;

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
            /* Two across on a phone: at three the tiles were thumbnails, smaller
               than the follow card beneath them, and the pictures are the
               point of the section. Three from sm, one row of six from lg. */
            <ul className="mb-1 grid grid-cols-2 gap-1 sm:mb-2 sm:grid-cols-3 sm:gap-2 lg:grid-cols-6">
              {posts.map((post) => {
                const badge = KIND_BADGES[post.kind];
                return (
                  <li key={post.id}>
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-square overflow-hidden border border-white/10 bg-surface transition hover:border-accent"
                    >
                      {/* Six across from lg up inside the max-w-6xl column, a
                          third of the viewport from sm, half below that. */}
                      <Image
                        src={post.image}
                        alt={altText(post, t.instagram.postAlt(matchDateShort(post.timestamp, lang)))}
                        fill
                        sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      {badge && (
                        <span className="absolute right-2 top-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          <badge.Icon size={14} aria-hidden="true" />
                          <span className="sr-only">{t.instagram[badge.label]}</span>
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          {/* Sits a grid gap below the tiles so the two read as one block. */}
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
