// ──────────────────────────────────────────────────
// Audio Engine — Rounding & Estimation
// Web Audio Sound Effects (Voice narration removed)
// ──────────────────────────────────────────────────

let soundEnabled = true;

export function setSoundEnabled(enabled) {
  soundEnabled = !!enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

// ─── Voice Narration Placeholders (No-Op) ─────────
// Preserved for compatibility with all phase components

export async function getAudioUrl() {
  return null;
}

export function speak() {
  return Promise.resolve();
}

export function stopNarration() {
  // Voice narration removed
}

export function preloadNarration() {
  // Voice narration removed
}

export function narrate() {
  return {
    cancel: () => {},
    promise: Promise.resolve()
  };
}

// ─── Narration Segment Types (Data Only) ──────────
export function seg(text, style = 'statement', pause = 0) {
  return { text, style, pause };
}

export const say = (text, pause = 0) => seg(text, 'statement', pause);
export const ask = (text, pause = 0) => seg(text, 'question', pause);
export const cheer = (text, pause = 0) => seg(text, 'encouragement', pause);
export const emphasize = (text, pause = 0) => seg(text, 'emphasis', pause);
export const think = (text, pause = 0) => seg(text, 'thinking', pause);
export const celebrate = (text, pause = 0) => seg(text, 'celebration', pause);
export const instruct = (text, pause = 0) => seg(text, 'instruction', pause);
export const pause = (ms = 0) => seg('', 'statement', ms);

// ─── Web Audio Tone Sound Effects ───────────────
let audioCtx = null;
function getCtx() {
  if (!soundEnabled) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTone(frequency, duration = 200, type = 'sine', gainVal = 0.15) {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch (e) { }
}

export const sounds = {
  click: () => playTone(600, 50, 'triangle', 0.08),
  snap: () => {
    playTone(520, 80, 'sine', 0.15);
    setTimeout(() => playTone(650, 100, 'triangle', 0.12), 40);
  },
  correct: () => {
    playTone(523.25, 120, 'sine', 0.18); // C5
    setTimeout(() => playTone(659.25, 120, 'sine', 0.18), 100); // E5
    setTimeout(() => playTone(783.99, 220, 'triangle', 0.22), 200); // G5
  },
  wrong: () => {
    playTone(330, 150, 'sawtooth', 0.12);
    setTimeout(() => playTone(260, 220, 'sawtooth', 0.14), 120);
  },
  streak: () => {
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 120, 'triangle', 0.15), i * 70);
    });
  },
  badge: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 160, 'sine', 0.2), i * 90);
    });
  },
  whoosh: () => {
    if (!soundEnabled) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) { }
  }
};
