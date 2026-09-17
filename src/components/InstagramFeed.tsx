import Image from "next/image";
import { FaInstagram, FaPlay, FaRegClone } from "react-icons/fa";
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

// The whole section, heading included, so that with no posts to show — no
// token, an API failure, an empty profile — nothing of it is left on the page.
export default async function InstagramFeed({ profileUrl }: { profileUrl: string }) {
  const posts = await getInstagramPosts(6);
  if (posts.length === 0) return null;

  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading label="Dal nostro Instagram" title="Prove fotografiche" anchor="instagram" />
        <Reveal>
          {/* Three across, like the profile grid this is a window onto. */}
          <ul className="grid grid-cols-3 gap-1 sm:gap-2 lg:grid-cols-6">
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
          <p className="mt-5 text-center sm:text-right">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest transition hover:text-accent"
            >
              <FaInstagram size={16} aria-hidden="true" /> Il resto è su @{instagramHandle(profileUrl)}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
