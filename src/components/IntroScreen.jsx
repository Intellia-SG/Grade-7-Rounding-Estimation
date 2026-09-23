import React, { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_CARDS = [
  { icon: '🤔', label: 'Wonder', desc: 'A math mystery!' },
  { icon: '📖', label: 'Story', desc: 'The squad in action' },
  { icon: '🧪', label: 'Simulate', desc: '3 Station Sandbox' },
  { icon: '🎮', label: 'Practice', desc: '100 challenges' },
  { icon: '📓', label: 'Reflect', desc: 'Quiz & review' },
];

export default function IntroScreen({ onStart, audioEnabled }) {
  const narrationRef = useRef(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(introNarration(), true);
      }, 300);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
        stopNarration();
      };
    }
  }, [audioEnabled]);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onStart();
  };

  return (
    <div className="home-hero-container">
      {/* Top Grade Badge */}
      <div className="home-grade-badge">
        ✨ Grade 7 Math
      </div>

      {/* Main Title */}
      <h1 className="home-main-title">
        Rounding &amp; Estimation
      </h1>

      {/* Subtitle */}
      <div className="home-subtitle">
        Number Sense, Benchmarks &amp; Reasonable Answers!
      </div>

      {/* Description Capsule */}
      <div className="home-desc-capsule">
        Let's master rounding whole numbers, decimals, compatible numbers, and estimating calculations! 🌍
      </div>

      {/* 5 Journey Cards in a row */}
      <div className="home-journey-cards">
        {JOURNEY_CARDS.map((card, i) => (
          <div key={i} className="home-journey-card">
            <div className="home-journey-icon">{card.icon}</div>
            <div className="home-journey-label">{card.label}</div>
            <div className="home-journey-desc">{card.desc}</div>
          </div>
        ))}
      </div>

      {/* Big Yellow-Orange Pill CTA Button */}
      <button
        className="home-cta-btn"
        onClick={handleStart}
        id="start-journey-btn"
      >
        🚀 Begin Your Journey!
      </button>

      {/* 3 Bottom Feature Pills */}
      <div className="home-feature-pills">
        <div className="home-pill">
          <span>🎯</span>
          <span>100 Questions</span>
        </div>
        <div className="home-pill">
          <span>🔢</span>
          <span>Rounding &amp; Estimation</span>
        </div>
        <div className="home-pill">
          <span>🏆</span>
          <span>Badges &amp; XP</span>
        </div>
      </div>
    </div>
  );
}
