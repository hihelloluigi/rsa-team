"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { playCheer } from "@/lib/sounds";

// Fires a one-shot magenta confetti burst and a crowd cheer on mount (used on
// won matches). Respects prefers-reduced-motion.
export default function WinCelebration() {
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const stopCheer = playCheer();

    const colors = ["#ff2077", "#ffffff", "#ff77a9"];
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.65 },
        colors,
        disableForReducedMotion: true,
        particleCount: Math.floor(200 * particleRatio),
        ...opts,
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Navigating away unmounts this: stop the cheer and clear any in-flight confetti.
    return () => {
      stopCheer();
      confetti.reset();
    };
  }, []);

  return null;
}
