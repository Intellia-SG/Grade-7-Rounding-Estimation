import React, { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import {
  reflectIntroNarration,
  reflectCorrectNarration,
  reflectWrongNarration,
  reflectConfidenceNarration,
  reflectCertificateNarration,
} from '../utils/narration';

const REFLECT_QUESTIONS = [
  {
    q: "When a number ends in exactly 5 at the rounding place value, what is the standard rounding rule?",
    options: [
      { text: "Round UP to the next benchmark", correct: true, emoji: "⬆️" },
      { text: "Always round down to zero", correct: false, emoji: "⬇️" },
      { text: "Leave the number unchanged", correct: false, emoji: "❓" },
    ],
  },
  {
    q: "Why are 'compatible numbers' so useful for estimating division like 396 ÷ 21?",
    options: [
      { text: "They divide cleanly without remainders (400 ÷ 20 = 20)", correct: true, emoji: "🎯" },
      { text: "They make the calculation 100% exact", correct: false, emoji: "❌" },
      { text: "They only work on even numbers", correct: false, emoji: "❓" },
    ],
  },
  {
    q: "When budgeting for a grocery trip, why is it smart to round item prices UP?",
    options: [
      { text: "To guarantee an overestimate so you don't run out of cash", correct: true, emoji: "🛒" },
      { text: "To pay lower taxes at the register", correct: false, emoji: "❌" },
      { text: "To make the cashier scan items faster", correct: false, emoji: "❓" },
    ],
  },
];

const CONFIDENCE_LEVELS = [
  { emoji: '😊', label: "I'm an Estimation Champion!", color: '#4caf50' },
  { emoji: '🙂', label: "I can solve most estimation problems!", color: '#ff9800' },
  { emoji: '😐', label: "I'm still learning and practicing!", color: '#42a5f5' },
];

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }) {
  const [step, setStep] = useState(0);
  const [teachIdx, setTeachIdx] = useState(0);
  const [teachAnswered, setTeachAnswered] = useState(false);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const narrationRef = useRef(null);

  const { score = 0, totalAnswered = 0, xp = 0, maxStreak = 0, worldResults = {} } = stats || {};
  const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 100;
  const totalStars = Object.values(worldResults).reduce((a, r) => a + (r.stars || 0), 0);

  useEffect(() => {
    if (step === 0 && audioEnabled) {
      narrationRef.current = narrate(reflectIntroNarration(), true);
    }
    return () => { narrationRef.current?.cancel(); };
  }, [step, audioEnabled]);

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: ['#ffc107', '#ff7043', '#4caf50', '#00e5ff', '#ab47bc', '#e91e63'][i % 6],
        size: 6 + Math.random() * 10,
        duration: 2.5 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  const handleTeachAnswer = useCallback((option) => {
    if (teachAnswered) return;
    setTeachAnswered(true);
    narrationRef.current?.cancel();

    if (option.correct) {
      setTeachCorrect(c => c + 1);
      sounds.correct();
      if (audioEnabled) narrationRef.current = narrate(reflectCorrectNarration(), true);
    } else {
      sounds.wrong();
      if (audioEnabled) narrationRef.current = narrate(reflectWrongNarration(), true);
    }

    setTimeout(() => {
      setTeachAnswered(false);
      if (teachIdx + 1 < REFLECT_QUESTIONS.length) {
        setTeachIdx(i => i + 1);
      } else {
        setStep(1);
      }
    }, 1500);
  }, [teachAnswered, teachIdx, audioEnabled]);

  const handleConfidenceSelect = useCallback((idx) => {
    setConfidence(idx);
    sounds.badge();
    setShowConfetti(true);
    narrationRef.current?.cancel();
    if (audioEnabled) narrationRef.current = narrate(reflectCertificateNarration(pct), true);
    setTimeout(() => setStep(2), 1000);
  }, [audioEnabled, pct]);

  useEffect(() => {
    if (step === 1 && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(reflectConfidenceNarration(), true);
    }
  }, [step, audioEnabled]);

  useEffect(() => {
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, []);

  // Step 0: Teach the Mascot
  if (step === 0) {
    const rq = REFLECT_QUESTIONS[teachIdx];
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <h3 className="reflect-label">📓 Phase 5: Reflect &amp; Teach</h3>
          <p className="reflect-sublabel">Help teach Rounder the superpowers of estimation!</p>
        </div>
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot thinking" style={{ width: 70, height: 70, fontSize: '2rem' }}>🤖</div>
            <div className="speech-bubble" style={{ maxWidth: 300 }}>
              Can you teach me? {rq.q}
            </div>
          </div>
          <div className="reflect-options">
            {rq.options.map((opt, i) => (
              <button
                key={i}
                className={`reflect-option ${teachAnswered ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleTeachAnswer(opt)}
                disabled={teachAnswered}
              >
                <span className="reflect-option-emoji">{opt.emoji}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          <div className="reflect-progress">
            {REFLECT_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`reflect-dot ${i === teachIdx ? 'active' : i < teachIdx ? 'done' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Confidence
  if (step === 1) {
    return (
      <div className="reflect-phase">
        <div className="reflect-card">
          <h3 className="reflect-card-title">How do you feel about rounding and estimation?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Be proud of your effort — every step counts!</p>
          <div className="confidence-grid">
            {CONFIDENCE_LEVELS.map((c, i) => (
              <button
                key={i}
                className={`confidence-btn ${confidence === i ? 'selected' : ''}`}
                onClick={() => handleConfidenceSelect(i)}
                style={{ '--conf-color': c.color }}
              >
                <span className="confidence-emoji">{c.emoji}</span>
                <span className="confidence-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Journey Certificate
  return (
    <div className="reflect-phase">
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map(p => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                left: `${p.x}%`,
                animationDelay: `${p.delay}s`,
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title">Estimation Squad Champion!</h2>
        <p className="cert-subtitle">Grade 7 Mathematics · Rounding &amp; Estimation</p>

        <div className="score-circle">
          <span className="score-number">{pct}%</span>
          <span className="score-label">{score}/{totalAnswered} Correct</span>
        </div>

        <div style={{ fontSize: '2rem', display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
          {[1, 2, 3].map(i => (
            <span key={i} style={{ opacity: i <= Math.max(1, Math.ceil(totalStars / 3)) ? 1 : 0.2 }}>⭐</span>
          ))}
        </div>

        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{xp}</div>
            <div className="cert-stat-label">XP Earned</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--coral)' }}>🔥 {maxStreak}</div>
            <div className="cert-stat-label">Max Streak</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--green-light)' }}>
              {teachCorrect}/{REFLECT_QUESTIONS.length}
            </div>
            <div className="cert-stat-label">Teaching Score</div>
          </div>
        </div>

        <div className="mascot-container" style={{ marginTop: 16 }}>
          <div className="mascot happy" style={{ width: 80, height: 80, fontSize: '2rem' }}>🤖</div>
          <div className="speech-bubble">
            {pct >= 80
              ? 'Incredible! You are a certified Estimation Squad Master! 🏆'
              : pct >= 50
              ? 'Great work! Keep applying estimation in everyday life! 💪'
              : 'Good start! Try another run to boost your score! 📚'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              narrationRef.current?.cancel();
              stopNarration();
              onRestart();
            }}
          >
            🔄 Play Again
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              narrationRef.current?.cancel();
              stopNarration();
              onGoHome();
            }}
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
