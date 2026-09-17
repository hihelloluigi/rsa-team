import Image from "next/image";
import { FaInstagram, FaPlay, FaRegClone } from "react-icons/fa";
import ButtonLink from "@/components/ButtonLink";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getInstagramPosts, type InstagramPost } from "@/lib/instagram";
import { instagramHandle, matchDateShort } from "@/lib/format";

// Captions run to paragraphs of hashtags; the first line is the part that
// describes the picture.
function altText(post: InstagramPost): string {
  const firstLine = post.caption.split("\n")[0].trim();
  if (!firstLine) return `Post Instagram del ${matchDateShort(post.timestamp)}`;
  return firstLine.length > 120 ? `${firstLine.slice(0, 119)}…` : firstLine;
}

const KIND_BADGES = {
  image: null,
  video: { Icon: FaPlay, label: "Video" },
  album: { Icon: FaRegClone, label: "Galleria" },
} as const;

// Everything the home page has to say about Instagram: the latest posts and
// the invitation to follow. The two used to be separate sections at opposite
// ends of the page. Only the grid depends on the API, so with no posts to show
// — no token, an API failure, an empty profile — the section falls back to the
// invitation alone, under a title that no longer promises pictures.
export default async function InstagramFeed({ profileUrl }: { profileUrl: string }) {
  const posts = await getInstagramPosts(6);
  const hasPosts = posts.length > 0;

  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          label="Dietro le quinte"
          title={hasPosts ? "Prove fotografiche" : "Seguici su Instagram"}
          anchor="instagram"
        />
        <Reveal>
          {hasPosts && (
            /* Three across, like the profile grid this is a window onto. */
            <ul className="mb-1 grid grid-cols-3 gap-1 sm:mb-2 sm:gap-2 lg:grid-cols-6">
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
                          third of the viewport below that. */}
                      <Image
                        src={post.image}
                        alt={altText(post)}
                        fill
                        sizes="(min-width: 1024px) 180px, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      {badge && (
                        <span className="absolute right-2 top-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          <badge.Icon size={14} aria-hidden="true" />
                          <span className="sr-only">{badge.label}</span>
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          {/* Sits a grid gap below the tiles so the two read as one block. */}
          <div className="flex flex-col items-center gap-8 border border-white/10 bg-surface px-6 py-10 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <FaInstagram className="shrink-0 text-accent" size={56} aria-hidden="true" />
              <div>
                <h3 className="font-display italic uppercase text-2xl sm:text-3xl leading-tight">
                  Non perderti un attimo della nostra «preparazione»
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-muted sm:mx-0">
                  Allenamenti (quando ci andiamo), terzi tempi (quelli mai saltati) e dietro le quinte
                  che nessuno ci ha chiesto. C&apos;è più aperitivo che tattica: è l&apos;unico modo per vederci correre.
                </p>
              </div>
            </div>
            <ButtonLink href={profileUrl} external>
              <FaInstagram size={18} aria-hidden="true" /> Seguici @{instagramHandle(profileUrl)}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
