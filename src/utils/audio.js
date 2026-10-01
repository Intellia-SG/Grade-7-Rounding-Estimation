// ──────────────────────────────────────────────────
// Enhanced Audio Narration Engine — Rounding & Estimation
// ElevenLabs Alice Voice + Robust Browser Speech Synthesis Fallback
// + Web Audio Sound Effects
// ──────────────────────────────────────────────────

import { audioMap } from './audioMap.js';

let currentQueue = null;
let isSpeaking = false;
let currentAudio = null;
let playId = 0;
const elevenLabsCache = new Map();

const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice

// ─── Robust Speech Synthesis Fallback Engine ──────
// Retains utterance references to prevent Chromium garbage collection bug
const activeUtterances = new Set();
let keepAliveTimer = null;
let cachedVoices = [];

function updateVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      cachedVoices = voices;
    }
  } catch (e) {
    // Ignore speech voice access errors
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  updateVoices();
  if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

/**
 * Finds the highest quality English female/friendly voice to match the Alice persona.
 */
function getBestVoice() {
  const voices = cachedVoices.length > 0 ? cachedVoices : updateVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Preferred high-quality natural/online voices
  const preferredNames = [
    'Microsoft Jenny Online (Natural)',
    'Microsoft Aria Online (Natural)',
    'Google US English',
    'Google UK English Female',
    'Microsoft Zira',
    'Samantha',
    'Victoria',
    'Karen',
    'Moira',
    'Fiona',
    'Alice'
  ];

  for (const name of preferredNames) {
    const match = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
    if (match) return match;
  }

  // 2. Any English voice that sounds female or natural
  const femaleEn = voices.find(v =>
    v.lang.startsWith('en') &&
    (v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('woman'))
  );
  if (femaleEn) return femaleEn;

  // 3. Standard English voices
  const enUS = voices.find(v => v.lang === 'en-US');
  if (enUS) return enUS;

  const anyEn = voices.find(v => v.lang.startsWith('en'));
  if (anyEn) return anyEn;

  // 4. Default voice
  return voices.find(v => v.default) || voices[0] || null;
}

/**
 * Chromium Bug Fix: SpeechSynthesis randomly pauses itself mid-sentence or stays in paused state.
 * Heartbeat periodically resumes synthesis while utterances are active.
 */
function startKeepAlive() {
  if (keepAliveTimer) return;
  keepAliveTimer = setInterval(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  }, 800);
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

/**
 * Normalizes math symbols, currencies, and markdown for natural speech.
 */
function cleanSpeechText(rawText) {
  if (!rawText) return '';
  return rawText
    // Remove markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Remove emojis that may cause odd pronunciations
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // Normalize math symbols into natural English words
    .replace(/≈/g, ' approximately ')
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/≥/g, ' greater than or equal to ')
    .replace(/≤/g, ' less than or equal to ')
    .replace(/≠/g, ' not equal to ')
    .replace(/\$/g, ' dollars ')
    .replace(/%/g, ' percent ')
    .replace(/\+/g, ' plus ')
    .replace(/=/g, ' equals ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Robust fallback speech using browser SpeechSynthesis.
 * Guaranteed to never hang or freeze lesson progression.
 */
function fallbackSpeech(text, style = 'statement', expectedPlayId) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      isSpeaking = false;
      resolve();
      return;
    }

    if (expectedPlayId !== undefined && expectedPlayId !== playId) {
      resolve();
      return;
    }

    const spokenText = cleanSpeechText(text);
    if (!spokenText) {
      if (expectedPlayId === undefined || expectedPlayId === playId) {
        isSpeaking = false;
      }
      resolve();
      return;
    }

    let settled = false;
    let timeoutId = null;
    let utterance = null;

    const finalize = () => {
      if (settled) return;
      settled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (utterance) {
        activeUtterances.delete(utterance);
      }

      if (activeUtterances.size === 0) {
        stopKeepAlive();
      }

      if (expectedPlayId === undefined || expectedPlayId === playId) {
        isSpeaking = false;
      }
      resolve();
    };

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();

      utterance = new SpeechSynthesisUtterance(spokenText);
      const voice = getBestVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      // Emotional cadence modulation
      switch (style) {
        case 'celebration':
          utterance.rate = 1.05;
          utterance.pitch = 1.15;
          break;
        case 'encouragement':
          utterance.rate = 1.0;
          utterance.pitch = 1.1;
          break;
        case 'question':
          utterance.rate = 0.95;
          utterance.pitch = 1.05;
          break;
        case 'thinking':
          utterance.rate = 0.92;
          utterance.pitch = 0.95;
          break;
        case 'emphasis':
          utterance.rate = 0.95;
          utterance.pitch = 1.05;
          break;
        default:
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
      }

      utterance.onend = finalize;
      utterance.onerror = finalize;

      // Retain reference to prevent garbage collection during playback
      activeUtterances.add(utterance);
      startKeepAlive();

      // Watchdog timer: If browser engine stalls, resolve safely without blocking UI
      const words = spokenText.split(/\s+/).filter(Boolean).length;
      const timeoutMs = Math.max(3500, (words / 1.6) * 1000 + 3500);
      timeoutId = setTimeout(finalize, timeoutMs);

      // Defer slightly (15ms) to prevent cancel() from cancelling the new utterance
      setTimeout(() => {
        if (settled) return;
        if (expectedPlayId !== undefined && expectedPlayId !== playId) {
          finalize();
          return;
        }
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          finalize();
        }
      }, 15);
    } catch (e) {
      finalize();
    }
  });
}

function stopFallbackSpeech() {
  activeUtterances.clear();
  stopKeepAlive();
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {}
  }
}

// ─── ElevenLabs Voice Settings ───────────────────
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

  const trimmed = text?.trim();
  if (trimmed && audioMap && audioMap[trimmed]) {
    return audioMap[trimmed];
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
      // Fallback: Use browser speech synthesis
      return null;
    }
  })();

  elevenLabsCache.set(cacheKey, fetchPromise);
  fetchPromise.catch(() => elevenLabsCache.delete(cacheKey));
  return fetchPromise;
}

export function speak(text, enabled = true, style = 'statement') {
  return new Promise(async (resolve) => {
    if (!enabled || !text || !text.trim()) {
      resolve();
      return;
    }

    playId++;
    const currentPlayId = playId;

    // Stop ongoing audio
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {}
      currentAudio = null;
    }

    // Cancel speech synthesis
    stopFallbackSpeech();
    isSpeaking = true;

    try {
      const audioUrl = await getAudioUrl(text, style);
      if (currentPlayId !== playId) {
        resolve();
        return;
      }

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        currentAudio = audio;

        let handled = false;
        const handleDone = () => {
          if (handled) return;
          handled = true;
          if (currentAudio === audio) {
            currentAudio = null;
          }
          if (currentPlayId === playId) {
            isSpeaking = false;
          }
          resolve();
        };

        audio.onended = handleDone;
        audio.onerror = () => {
          if (handled) return;
          handled = true;
          if (currentPlayId === playId) {
            fallbackSpeech(text, style, currentPlayId).then(resolve);
          } else {
            resolve();
          }
        };

        try {
          await audio.play();
        } catch (playErr) {
          // Autoplay blocked or interrupted
          if (handled) return;
          handled = true;
          if (currentPlayId === playId) {
            await fallbackSpeech(text, style, currentPlayId);
          }
          resolve();
        }
        return;
      } else {
        await fallbackSpeech(text, style, currentPlayId);
        resolve();
      }
    } catch (error) {
      if (currentPlayId === playId) {
        await fallbackSpeech(text, style, currentPlayId);
      }
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
    playId++; // Invalidate pending fetches and speaks immediately
    if (currentQueue === queueId) {
      currentQueue = null;
      stopFallbackSpeech();
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        } catch (e) {}
        currentAudio = null;
      }
      isSpeaking = false;
    }
  };

  const promise = (async () => {
    if (!enabled || !segments || segments.length === 0) return;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (cancelled || currentQueue !== queueId) return;

      // Preload next segment audio if available
      if (i + 1 < segments.length) {
        const nextSeg = segments[i + 1];
        if (nextSeg && nextSeg.text && nextSeg.text.trim()) {
          getAudioUrl(nextSeg.text, nextSeg.style).catch(() => {});
        }
      }

      if (segment.text && segment.text.trim()) {
        await speak(segment.text, true, segment.style);
      }

      if (cancelled || currentQueue !== queueId) return;

      if (segment.pause > 0) {
        await new Promise(r => setTimeout(r, segment.pause));
      }
    }
  })();

  return { cancel, promise };
}

export function stopNarration() {
  playId++;
  currentQueue = null;
  stopFallbackSpeech();
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
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
