import React, { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: "42,187 people are at a stadium in Rio de Janeiro. Sarah needs to tell her friend about how many people were there without counting every single one. What should she say?",
    subtext: "When numbers are huge or exact counts take too long, rounding and estimation give us fast, smart answers!",
    emoji: "🏟️",
    bgEmojis: ["🏟️", "🔢", "✨", "🌍", "🎯"],
  },
  {
    question: "Mike is at a New York grocery checkout with 12 items. Can he estimate his total in 5 seconds before the cashier scans the final item?",
    subtext: "Rounding each price to friendly dollar benchmarks makes mental addition lighting fast!",
    emoji: "🛒",
    bgEmojis: ["🛒", "💵", "⚡", "🗽", "✨"],
  },
  {
    question: "A passenger train in Mumbai has 3,912 seats. How can Priya quickly explain its capacity to tourists?",
    subtext: "Rounding to the nearest thousand turns complex numbers into easy benchmarks!",
    emoji: "🚆",
    bgEmojis: ["🚆", "🎫", "💡", "🔢", "⭐"],
  },
];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [wonder] = useState(() => WONDER_QUESTIONS[0]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);
  const narrationRef = useRef(null);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrationRef.current = narrate(
        wonderNarration(wonder.question, wonder.subtext),
        true
      );
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [stage, wonder.question, wonder.subtext, audioEnabled]);

  const handleDiscover = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    if (audioEnabled) {
      const n = narrate(wonderDiscoverNarration(), true);
      n.promise.then(() => onComplete());
      setTimeout(() => onComplete(), 2800);
    } else {
      setTimeout(() => onComplete(), 500);
    }
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map(p => (
          <span
            key={p.id}
            className="wonder-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}rem`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <div className="wonder-content">
        <div className="wonder-qmark revealed">
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>

        <div className="wonder-mascot visible">
          <div className="mascot thinking">🤖</div>
          <div className="speech-bubble wonder-bubble">Hmm... I wonder... 🤔</div>
        </div>

        <div className="wonder-question-card visible">
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>

        {/* Big Golden Action Button - Always Visibly Positioned */}
        <button
          className="btn btn-wonder"
          onClick={handleDiscover}
          id="discover-btn"
          aria-label="Let's Discover!"
        >
          <span className="wonder-btn-sparkle">✨</span>
          🚀 Let's Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
