"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaInstagram, FaPlay, FaRegClone, FaXmark } from "react-icons/fa6";
import type { InstagramSlide } from "@/lib/instagram";

export type GalleryPost = {
  id: string;
  kind: "image" | "video" | "album";
  image: string;
  slides: InstagramSlide[];
  permalink: string;
  caption: string;
  // Worked out on the server, in the page's language.
  alt: string;
  date: string;
};

export type GalleryLabels = {
  video: string;
  album: string;
  open: string;
  close: string;
  previous: string;
  next: string;
  openOnInstagram: string;
};

const KIND_ICONS = { image: null, video: FaPlay, album: FaRegClone } as const;

// The grid of tiles and the preview they open. A tile is still a link to the
// post — that is what it does without JavaScript, and on a middle-click — but
// a plain click opens the post here first: the photo large, the video playing,
// a carousel slide by slide, with the way on to Instagram underneath.
export default function InstagramGallery({
  posts,
  labels,
}: {
  posts: GalleryPost[];
  labels: GalleryLabels;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<{ post: number; slide: number } | null>(null);

  const post = current ? posts[current.post] : null;
  const slide = post && current ? post.slides[current.slide] : null;

  // A native <dialog>: showModal() brings the focus trap, the Esc key and the
  // inert page behind it, none of which have to be rebuilt here.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (current && !el.open) el.showModal();
    if (!current && el.open) el.close();
  }, [current]);

  const step = (by: number) =>
    setCurrent((c) => {
      if (!c) return c;
      const count = posts[c.post].slides.length;
      return { ...c, slide: (c.slide + by + count) % count };
    });

  return (
    <>
      {/* Two across on a phone: at three the tiles were thumbnails, smaller
          than the follow card beneath them, and the pictures are the point of
          the section. Three from sm, one row of six from lg. */}
      <ul className="mb-1 grid grid-cols-2 gap-1 sm:mb-2 sm:grid-cols-3 sm:gap-2 lg:grid-cols-6">
        {posts.map((p, i) => {
          const Icon = KIND_ICONS[p.kind];
          return (
            <li key={p.id}>
              <a
                href={p.permalink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${labels.open}: ${p.alt}`}
                onClick={(e) => {
                  // Leave modified clicks alone: a new tab should be the post.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  setCurrent({ post: i, slide: 0 });
                }}
                className="group relative block aspect-square overflow-hidden border border-white/10 bg-surface transition hover:border-accent"
              >
                {/* Six across from lg up inside the max-w-6xl column, a third
                    of the viewport from sm, half below that. */}
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                {Icon && (
                  <span className="absolute right-2 top-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <Icon size={14} aria-hidden="true" />
                    <span className="sr-only">{labels[p.kind as "video" | "album"]}</span>
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setCurrent(null)}
        // A click on the backdrop lands on the dialog element itself; anything
        // inside it lands on a child.
        onClick={(e) => e.target === e.currentTarget && setCurrent(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        aria-label={post?.alt}
        className="m-auto w-[min(100vw-1.5rem,34rem)] max-w-none border border-white/15 bg-surface p-0 text-fg backdrop:bg-black/85"
      >
        {post && slide && current && (
          <div>
            <div className="relative h-[min(70vh,34rem)] bg-black">
              {slide.video ? (
                // Keyed so moving between slides swaps the element rather than
                // leaving the previous clip playing under a new poster. The
                // file comes straight from Instagram's CDN, and only now, on
                // the visitor's own click — see the privacy notice.
                <video
                  key={slide.video}
                  src={slide.video}
                  poster={slide.image}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (
                <Image
                  key={slide.image}
                  src={slide.image}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 640px) 544px, 100vw"
                  className="object-contain"
                />
              )}

              {post.slides.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label={labels.previous} className={`${ARROW} left-2`}>
                    <FaChevronLeft size={14} aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label={labels.next} className={`${ARROW} right-2`}>
                    <FaChevronRight size={14} aria-hidden="true" />
                  </button>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-2 py-1 text-[11px] font-extrabold tracking-widest">
                    {current.slide + 1} / {post.slides.length}
                  </span>
                </>
              )}

              <button
                type="button"
                onClick={() => setCurrent(null)}
                aria-label={labels.close}
                className="absolute right-2 top-2 bg-black/70 p-2 text-white transition hover:text-accent"
              >
                <FaXmark size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-eyebrow text-muted">{post.date}</p>
              {post.caption && (
                <p className="max-h-28 overflow-y-auto whitespace-pre-line text-sm text-muted">{post.caption}</p>
              )}
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest transition hover:text-accent"
              >
                <FaInstagram size={16} aria-hidden="true" /> {labels.openOnInstagram}
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

const ARROW =
  "absolute top-1/2 -translate-y-1/2 bg-black/70 p-3 text-white transition hover:text-accent";
