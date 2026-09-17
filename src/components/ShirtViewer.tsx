"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { FaHandPointer, FaMinus, FaPlus } from "react-icons/fa6";
import type { ReactNode } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

// The GLB is self-contained (textures embedded), metres, Y-up, front facing
// +Z. The poster is the same model rendered at the opening orbit on a
// transparent background, so the hand-off to the live model is seamless and
// it sits on whatever surface the card gives it.
const MODEL = "/shirt/rsa-team-shirt.glb";
const POSTER = "/shirt/rsa-team-shirt-poster.webp";

const OPENING_ORBIT = "18deg 82deg 1.9m";
// Camera distance limits for wheel, pinch and the +/- buttons: close enough to
// read the crest, far enough that the shirt never clips the frame.
const NEAREST = 1.3;
const FARTHEST = 2.8;
const ZOOM_STEP = 1.25;
// Yaw of each view, in degrees, with the shirt un-turned.
const FRONT = 0;
const BACK = 180;

export default function ShirtViewer({
  labels,
}: {
  labels: {
    alt: string;
    dragHint: string;
    viewsLabel: string;
    front: string;
    back: string;
    rotate: string;
    zoomOut: string;
    zoomIn: string;
  };
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const viewer = useRef<ModelViewerElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [spinning, setSpinning] = useState(true);
  const [hint, setHint] = useState(false);
  // Where the +/- buttons are sending the camera. The live distance lags
  // behind it while the camera glides, so a quick second press steps from the
  // target, not from wherever the glide has got to. Cleared by wheel/pinch so
  // the next press resumes from what the user chose.
  const zoomTarget = useRef<number | null>(null);

  // The viewer bundles three.js, so it is fetched only once the shirt scrolls
  // near — the home page's first paint pays nothing for it. Until then the
  // <model-viewer> tag is an unknown element and simply shows the poster child.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("@google/model-viewer").then(() => setReady(true));
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The drag hint appears once the model is in AND the viewer is
  // actually on screen (the model preloads well before that), and slips away
  // on its own a few seconds later — sooner if the shirt is dragged
  // (camera-change from the user) or a button is pressed.
  useEffect(() => {
    const mv = viewer.current;
    if (!ready || !mv) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timers.push(window.setTimeout(() => setHint(true), 1200));
        timers.push(window.setTimeout(() => setHint(false), 5000));
      },
      { threshold: 0.5 },
    );
    const onLoad = () => io.observe(mv);
    const onCamera = (e: Event) => {
      if (
        (e as CustomEvent<{ source: string }>).detail.source !==
        "user-interaction"
      )
        return;
      setHint(false);
      zoomTarget.current = null;
    };
    if (mv.loaded) onLoad();
    else mv.addEventListener("load", onLoad, { once: true });
    mv.addEventListener("camera-change", onCamera);
    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
      mv.removeEventListener("load", onLoad);
      mv.removeEventListener("camera-change", onCamera);
    };
  }, [ready]);

  const spin = spinning && !reduce;

  // Auto-rotate turns the shirt on a turntable that the camera orbit knows
  // nothing about, so a fixed "0deg" would face the camera at wherever the
  // spin happened to leave the shirt. Aim past the turntable instead: the
  // camera glides there and the shirt never snaps.
  const look = (yaw: number) => {
    setHint(false);
    setSpinning(false);
    const mv = viewer.current;
    if (!mv) return;
    const turned = (mv.turntableRotation * 180) / Math.PI;
    mv.cameraOrbit = `${yaw + turned}deg 90deg ${mv.getCameraOrbit().radius}m`;
  };

  // Steps the camera distance (a factor below 1 brings it closer), keeping
  // the current angle. The limits match the min/max-camera-orbit attributes
  // so a button can never go where a pinch could not.
  const zoom = (factor: number) => {
    setHint(false);
    const mv = viewer.current;
    if (!mv) return;
    const { theta, phi, radius } = mv.getCameraOrbit();
    const from = zoomTarget.current ?? radius;
    const next = Math.min(FARTHEST, Math.max(NEAREST, from * factor));
    zoomTarget.current = next;
    mv.cameraOrbit = `${theta}rad ${phi}rad ${next}m`;
  };

  return (
    <div ref={wrap}>
      <div className="relative">
        <model-viewer
          ref={viewer}
          src={MODEL}
          alt={labels.alt}
          loading="eager"
          camera-controls
          auto-rotate={spin}
          rotation-per-second="12deg"
          camera-orbit={OPENING_ORBIT}
          field-of-view="30deg"
          interpolation-decay="200"
          shadow-intensity="0.65"
          exposure="1"
          // The built-in prompt swings the camera left and back until the
          // first drag, which fights the auto-rotation and looks like a
          // stutter. The hint overlay below does that job instead.
          interaction-prompt="none"
          // One finger still scrolls the page; two fingers (or the wheel) zoom.
          touch-action="pan-y"
          min-camera-orbit={`auto auto ${NEAREST}m`}
          max-camera-orbit={`auto auto ${FARTHEST}m`}
          disable-pan
          // h-auto matters: the element's own :host style is height:150px, and
          // aspect-ratio only applies once that is cleared.
          className="relative block aspect-[7/8] h-auto max-h-[70vh] w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            slot="poster"
            src={POSTER}
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
          />
        </model-viewer>
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-700 ${hint ? "opacity-100" : "opacity-0"}`}
          aria-hidden={!hint}
        >
          <div className="hint__nudge flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-eyebrow text-muted">
            <FaHandPointer className="text-accent/80" aria-hidden="true" />
            {labels.dragHint}
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap justify-center gap-2 border-t border-white/10 px-5 py-4"
        role="group"
        aria-label={labels.viewsLabel}
      >
        <ViewButton disabled={!ready} onClick={() => look(FRONT)}>
          {labels.front}
        </ViewButton>
        <ViewButton disabled={!ready} onClick={() => look(BACK)}>
          {labels.back}
        </ViewButton>
        <ViewButton
          disabled={!ready}
          pressed={spin}
          onClick={() => {
            setHint(false);
            setSpinning((s) => !s);
          }}
        >
          {labels.rotate}
        </ViewButton>
        <span
          className="mx-1 hidden self-stretch border-l border-white/10 sm:block"
          aria-hidden="true"
        />
        <ViewButton
          disabled={!ready}
          label={labels.zoomOut}
          onClick={() => zoom(ZOOM_STEP)}
        >
          <FaMinus aria-hidden="true" />
        </ViewButton>
        <ViewButton
          disabled={!ready}
          label={labels.zoomIn}
          onClick={() => zoom(1 / ZOOM_STEP)}
        >
          <FaPlus aria-hidden="true" />
        </ViewButton>
      </div>
    </div>
  );
}

function ViewButton({
  children,
  onClick,
  disabled,
  pressed,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  pressed?: boolean;
  // For icon-only buttons.
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      aria-label={label}
      className={`border px-4 py-2 text-xs font-extrabold uppercase tracking-widest transition disabled:opacity-40 ${
        pressed
          ? "border-accent text-accent"
          : "border-white/20 hover:border-accent"
      }`}
    >
      {children}
    </button>
  );
}
