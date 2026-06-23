"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { playFart } from "@/lib/sounds";

// Fixed layout (no Math.random) to avoid a hydration mismatch. Each drop is a
// big 💩 that falls slowly from above the top edge to below the bottom, with a
// little sway and rotation so the rain reads clearly.
const DROPS = [
  { left: "6%", size: "2.2rem", delay: 0.0, duration: 3.4, drift: 18, rotate: 22 },
  { left: "16%", size: "3.0rem", delay: 0.5, duration: 3.0, drift: -14, rotate: -28 },
  { left: "24%", size: "1.9rem", delay: 1.1, duration: 3.8, drift: 10, rotate: 18 },
  { left: "33%", size: "2.6rem", delay: 0.2, duration: 3.2, drift: -20, rotate: -16 },
  { left: "41%", size: "3.3rem", delay: 0.8, duration: 2.9, drift: 16, rotate: 30 },
  { left: "49%", size: "2.1rem", delay: 1.4, duration: 3.6, drift: -8, rotate: -24 },
  { left: "57%", size: "2.8rem", delay: 0.35, duration: 3.1, drift: 22, rotate: 20 },
  { left: "65%", size: "2.0rem", delay: 0.95, duration: 3.9, drift: -16, rotate: -32 },
  { left: "72%", size: "3.1rem", delay: 0.15, duration: 3.0, drift: 12, rotate: 26 },
  { left: "80%", size: "2.3rem", delay: 0.7, duration: 3.5, drift: -18, rotate: -18 },
  { left: "88%", size: "2.7rem", delay: 1.2, duration: 3.2, drift: 14, rotate: 28 },
  { left: "12%", size: "2.4rem", delay: 1.7, duration: 3.3, drift: -12, rotate: -22 },
  { left: "45%", size: "2.0rem", delay: 2.0, duration: 3.7, drift: 18, rotate: 16 },
  { left: "60%", size: "3.0rem", delay: 1.9, duration: 2.8, drift: -22, rotate: -30 },
  { left: "92%", size: "2.1rem", delay: 0.55, duration: 3.6, drift: -10, rotate: 24 },
  { left: "4%", size: "2.9rem", delay: 1.5, duration: 3.1, drift: 16, rotate: -20 },
];

// Plays a fart and rains 💩 down the screen on a lost match. Respects
// prefers-reduced-motion (no sound, no rain) and unmounts when finished.
export default function LossReaction() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const stopFart = playFart();
    const t = window.setTimeout(() => setDone(true), 6000);
    // Navigating away unmounts this: stop the fart (the 💩 rain unmounts with the DOM).
    return () => {
      stopFart();
      window.clearTimeout(t);
    };
  }, [reduce]);

  if (reduce || done) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {DROPS.map((d, i) => (
        <motion.span
          key={i}
          className="absolute top-0 select-none"
          style={{ left: d.left, fontSize: d.size }}
          initial={{ y: "-15vh", x: 0, opacity: 0, rotate: -d.rotate }}
          animate={{ y: "115vh", x: d.drift, opacity: [0, 1, 1, 1], rotate: d.rotate }}
          transition={{ duration: d.duration, delay: d.delay, ease: "easeIn" }}
        >
          💩
        </motion.span>
      ))}
    </div>
  );
}
