// ──────────────────────────────────────────────────
// Enhanced Audio Narration Engine — Rounding & Estimation
// ElevenLabs Alice Voice + Web Audio Sound Effects
// ──────────────────────────────────────────────────

let currentQueue = null;
let isSpeaking = false;
let currentAudio = null;
let playId = 0;
const elevenLabsCache = new Map();

const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice

let audioMap = {};
try {
  import('./audioMap.js').then(module => {
    audioMap = module.audioMap || {};
  }).catch(() => {});
} catch (e) { }

const getElevenLabsSettings = (speechStyle) => {
  switch (speechStyle) {
    case 'celebration':
      return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement':
      return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
    case 'question':
      return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':
      return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
    case 'thinking':
      return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
    default:
      return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
  }
};

export async function getAudioUrl(text, style) {
  if (audioMap && audioMap[text]) {
    return audioMap[text];
  }

  const cacheKey = `${text}_${style}`;
  if (elevenLabsCache.has(cacheKey)) {
    return elevenLabsCache.get(cacheKey);
  }

  const fetchPromise = (async () => {
    const localApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceSettings = getElevenLabsSettings(style);

    try {
      let response = await fetch(`/api/elevenlabs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: ELEVENLABS_VOICE_ID, voiceSettings })
      });

      const isHtmlFallback = (response.headers.get('content-type') || '').includes('text/html');

      if ((!response.ok || isHtmlFallback) && localApiKey) {
        response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': localApiKey },
          body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: voiceSettings })
        });
      }

      if (!response.ok || isHtmlFallback) {
        throw new Error("Failed to fetch ElevenLabs audio.");
      }

      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      // Fallback: Use browser speech synthesis if available
      return null;
    }
  })();

  elevenLabsCache.set(cacheKey, fetchPromise);
  fetchPromise.catch(() => elevenLabsCache.delete(cacheKey));
  return fetchPromise;
}

export function speak(text, enabled = true, style = 'statement') {
  return new Promise(async (resolve) => {
    if (!enabled || !text) { resolve(); return; }

    playId++;
    const currentPlayId = playId;
    window.speechSynthesis?.cancel();
    isSpeaking = true;

    try {
      const audioUrl = await getAudioUrl(text, style);
      if (currentPlayId !== playId) { isSpeaking = false; resolve(); return; }

      if (audioUrl) {
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        currentAudio = new Audio(audioUrl);
        currentAudio.onended = () => { isSpeaking = false; resolve(); };
        currentAudio.onerror = () => {
          fallbackSpeech(text, style).then(resolve);
        };
        await currentAudio.play();
        return;
      } else {
        await fallbackSpeech(text, style);
        resolve();
      }
    } catch (error) {
      await fallbackSpeech(text, style);
      resolve();
    }
  });
}

function fallbackSpeech(text, style) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { isSpeaking = false; resolve(); return; }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = style === 'celebration' ? 1.05 : style === 'question' ? 0.95 : 1.0;
      utterance.pitch = style === 'celebration' ? 1.2 : style === 'thinking' ? 0.9 : 1.05;
      utterance.onend = () => { isSpeaking = false; resolve(); };
      utterance.onerror = () => { isSpeaking = false; resolve(); };
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      isSpeaking = false;
      resolve();
    }
  });
}

// ─── Narration Segment Types ────────────────────
export function seg(text, style = 'statement', pause = 400) {
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

export function preloadNarration(segments) {
  if (!segments) return;
  segments.forEach(segItem => {
    if (segItem.text && segItem.text.trim()) {
      getAudioUrl(segItem.text, segItem.style).catch(() => {});
    }
  });
}

export function narrate(segments, enabled = true) {
  const queueId = Symbol('narration');
  currentQueue = queueId;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (currentQueue === queueId) {
      window.speechSynthesis?.cancel();
      if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
      isSpeaking = false;
      currentQueue = null;
    }
  };

  const promise = (async () => {
    if (!enabled || !segments || segments.length === 0) return;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (cancelled || currentQueue !== queueId) return;

      if (i + 1 < segments.length) {
        const nextSeg = segments[i + 1];
        if (nextSeg.text && nextSeg.text.trim()) {
          getAudioUrl(nextSeg.text, nextSeg.style).catch(() => {});
        }
      }

      if (segment.text && segment.text.trim()) {
        await speak(segment.text, true, segment.style);
      }

      if (segment.pause > 0 && !cancelled && currentQueue === queueId) {
        await new Promise(r => setTimeout(r, segment.pause));
      }
    }
  })();

  return { cancel, promise };
}

export function stopNarration() {
  playId++;
  currentQueue = null;
  window.speechSynthesis?.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  isSpeaking = false;
}

// ─── Web Audio Tone Sound Effects ───────────────
let audioCtx = null;
function getCtx() {
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
