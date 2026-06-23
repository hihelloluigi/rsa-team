// Browser-only one-shot sound helpers for match reactions. Each no-ops on the
// server, when the file is missing, or when autoplay is blocked (the play()
// promise rejects) — so they're always safe to call from an effect.

function fadeOut(audio: HTMLAudioElement) {
  const step = () => {
    if (audio.volume > 0.05) {
      audio.volume = Math.max(0, audio.volume - 0.05);
      window.setTimeout(step, 40);
    } else {
      audio.pause();
    }
  };
  step();
}

// Returns a stop() that halts playback — call it on unmount so the sound
// doesn't keep going after you navigate away.
function play(src: string, volume: number, fadeAfterMs?: number): () => void {
  if (typeof window === "undefined") return () => {};
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play().catch(() => {});
  const fadeTimer = fadeAfterMs ? window.setTimeout(() => fadeOut(audio), fadeAfterMs) : undefined;
  return () => {
    if (fadeTimer) window.clearTimeout(fadeTimer);
    audio.pause();
    audio.currentTime = 0;
  };
}

// Crowd cheer on a win. The source clip is long, so fade it out after ~5s.
export function playCheer(): () => void {
  return play("/sounds/cheer.mp3", 0.5, 5000);
}

// A short, dignified fart on a loss.
export function playFart(): () => void {
  return play("/sounds/fart.wav", 0.7);
}
