import React, { useState, useCallback, useEffect, useRef } from 'react';
import { WORLDS, generateSessionQuestions } from '../data/questionBank';
import { narrate, stopNarration, sounds } from '../utils/audio';
import {
  playWorldIntro,
  playReadQuestion,
  playCorrectNarration,
  playWrongNarration,
  playWorldComplete,
} from '../utils/narration';
import QuestionRenderer from './QuestionRenderer';

function calcXP(attempt, streak) {
  const base = attempt === 1 ? 10 : attempt === 2 ? 7 : 5;
  return base + (streak >= 5 ? 5 : 0);
}

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [currentWorld, setCurrentWorld] = useState(-1);
  const [worldResults, setWorldResults] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [worldComplete, setWorldComplete] = useState(false);
  const [attempt, setAttempt] = useState(1);
  const narrationRef = useRef(null);
  const [worldQuestions, setWorldQuestions] = useState([]);

  const q = worldQuestions[qIndex];

  useEffect(() => {
    if (audioEnabled && q && !worldComplete && !feedback && currentWorld >= 0) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(playReadQuestion(q.questionText), true);
      }, 300);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
      };
    }
  }, [qIndex, audioEnabled, q, worldComplete, feedback, currentWorld]);

  const startWorld = useCallback((worldId) => {
    const bank = generateSessionQuestions();
    const filtered = bank.filter(item => item.world === worldId);
    setWorldQuestions(filtered);
    setCurrentWorld(worldId);
    setQIndex(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setAttempt(1);
    setWorldComplete(false);
    setFeedback(null);
    setAnswered(false);
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrationRef.current = narrate(playWorldIntro(WORLDS[worldId].name), true);
    }
  }, [audioEnabled]);

  const finishWorld = useCallback(() => {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    sounds.badge();
    setWorldResults(prev => ({
      ...prev,
      [currentWorld]: { score, total: worldQuestions.length, stars }
    }));
    setWorldComplete(true);
    narrationRef.current?.cancel();
    if (audioEnabled) {
      narrationRef.current = narrate(playWorldComplete(w.name, score, worldQuestions.length), true);
    }
  }, [currentWorld, score, audioEnabled, worldQuestions.length]);

  const backToMap = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    setCurrentWorld(-1);
    setWorldComplete(false);
    setFeedback(null);
  }, []);

  const handleAllComplete = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    const totalScore = Object.values(worldResults).reduce((a, r) => a + r.score, 0) + (worldComplete ? 0 : score);
    const totalQ = Object.values(worldResults).reduce((a, r) => a + r.total, 0) + (worldComplete ? 0 : worldQuestions.length);
    onComplete({
      score: totalScore,
      xp: totalXP,
      maxStreak,
      totalAnswered: totalQ || 10,
      worldResults: {
        ...worldResults,
        ...(currentWorld >= 0 ? { [currentWorld]: { score, total: worldQuestions.length, stars: calcStars(score, worldQuestions.length) } } : {})
      },
    });
  }, [worldResults, score, totalXP, maxStreak, worldQuestions, currentWorld, worldComplete, onComplete]);

  const advance = useCallback(() => {
    setFeedback(null);
    setAnswered(false);
    setAttempt(1);
    if (qIndex + 1 < worldQuestions.length && lives > 0) {
      setQIndex(i => i + 1);
    } else {
      finishWorld();
    }
  }, [qIndex, worldQuestions.length, lives, finishWorld]);

  const handleAnswer = useCallback((isCorrect) => {
    setAnswered(true);
    narrationRef.current?.cancel();

    if (isCorrect) {
      const ns = streak + 1;
      const earned = calcXP(attempt, ns);
      setScore(s => s + 1);
      setStreak(ns);
      setMaxStreak(ms => Math.max(ms, ns));
      setTotalXP(x => x + earned);
      sounds.correct();
      if (ns >= 5 && ns % 5 === 0) sounds.streak();
      setXpPopup(`+${earned} XP`);
      setTimeout(() => setXpPopup(null), 1500);
      setFeedback({
        type: 'correct',
        message: ns >= 5 ? `🔥 ${ns} Streak!` : 'Correct Estimate! 🎉',
        sub: q.explanation
      });
      if (audioEnabled) {
        narrationRef.current = narrate(playCorrectNarration(ns), true);
      }
      setTimeout(advance, 1800);
    } else {
      setStreak(0);
      setLives(l => Math.max(0, l - 1));
      sounds.wrong();
      setFeedback({
        type: 'wrong',
        message: 'Not quite!',
        sub: q.explanation
      });
      if (audioEnabled) {
        narrationRef.current = narrate(playWrongNarration(), true);
      }
      if (lives - 1 <= 0) {
        setTimeout(finishWorld, 2000);
      } else {
        setTimeout(advance, 2000);
      }
    }
  }, [streak, q, attempt, advance, lives, finishWorld, audioEnabled]);

  // View: World Map
  if (currentWorld < 0) {
    const completedCount = Object.keys(worldResults).length;
    return (
      <div className="play-phase">
        <div className="play-header">
          <h2 className="play-title">🎮 Practice — Global Landmark Map</h2>
          <p className="play-subtitle">Solve estimation quests across 10 global cities to earn stars and unlock all landmarks!</p>
          {totalXP > 0 && <div className="play-xp-badge">⭐ {totalXP} Total XP</div>}
        </div>

        <div className="world-map">
          {WORLDS.map((w, i) => {
            // World 0 is open; others require >=1 star (>=5/10) in previous world
            const unlocked = i === 0 || (worldResults[i - 1] && worldResults[i - 1].stars >= 1);
            const completed = worldResults[i];

            return (
              <div
                key={w.id}
                className={`world-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => unlocked && startWorld(i)}
                style={{ '--world-color': w.color }}
              >
                {!unlocked && <div className="world-lock">🔒</div>}
                <div className="world-icon">{w.icon}</div>
                <div className="world-name">{w.name}</div>
                <div className="world-desc">{w.desc}</div>

                {completed && (
                  <div className="world-stars">
                    {[1, 2, 3].map(s => (
                      <span key={s} style={{ opacity: s <= completed.stars ? 1 : 0.2 }}>⭐</span>
                    ))}
                    <span className="world-score">{completed.score}/{completed.total}</span>
                  </div>
                )}

                {unlocked && !completed && <div className="world-play-btn">▶ PRACTICE</div>}
              </div>
            );
          })}
        </div>

        {completedCount >= 1 && (
          <button
            className="btn btn-green btn-lg"
            onClick={handleAllComplete}
            style={{ marginTop: 28, animation: 'bounceIn 0.5s ease' }}
          >
            🏆 Finish Practice &amp; Reflect ({completedCount}/10 Worlds Completed)
          </button>
        )}
      </div>
    );
  }

  // View: World Complete Modal
  if (worldComplete) {
    const w = WORLDS[currentWorld];
    const stars = calcStars(score, worldQuestions.length);
    const isLastWorld = currentWorld === WORLDS.length - 1;

    return (
      <div className="play-phase">
        <div className="world-complete-card">
          <div className="world-complete-icon">{w.icon}</div>
          <h2 className="world-complete-title">{w.name} Complete!</h2>
          <div className="world-complete-score">{score} / {worldQuestions.length}</div>

          <div className="world-complete-stars">
            {[1, 2, 3].map(s => (
              <span
                key={s}
                className={`world-star ${s <= stars ? 'earned' : ''}`}
                style={{ animationDelay: `${s * 0.2}s` }}
              >
                ⭐
              </span>
            ))}
          </div>

          <div className="world-complete-xp">
            {stars >= 1 ? `🎉 World Unlocked! Earned Stars!` : `Practice more to earn stars!`}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={backToMap}>
              🗺️ World Map
            </button>
            {!isLastWorld && stars >= 1 && (
              <button className="btn btn-primary" onClick={() => startWorld(currentWorld + 1)}>
                Next World →
              </button>
            )}
            <button className="btn btn-green" onClick={handleAllComplete}>
              🏆 Complete Lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View: Question Active
  const w = WORLDS[currentWorld];

  return (
    <div className="play-phase">
      {/* XP Popup Animation */}
      {xpPopup && <div className="xp-popup">{xpPopup}</div>}

      {/* Heads-up Display */}
      <div className="hud">
        <button
          className="btn btn-outline btn-sm"
          onClick={backToMap}
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}
        >
          🗺️ Map
        </button>

        <div className="hud-item">
          <span>⭐</span>
          <span>{totalXP} XP</span>
        </div>

        {streak > 1 && (
          <div className="hud-item streak-fire" style={{ color: 'var(--coral)' }}>
            <span>🔥</span>
            <span>{streak} Streak</span>
          </div>
        )}

        <div className="hearts">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
          ))}
        </div>
      </div>

      {/* Progress Bar within World */}
      <div style={{ width: '100%', maxWidth: 720, marginBottom: 16 }}>
        <div className="progress-bar-container">
          <div className="progress-bar-label">
            <span>{w.name}</span>
            <span>Question {qIndex + 1} / {worldQuestions.length}</span>
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${((qIndex + 1) / worldQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        {q && (
          <QuestionRenderer
            question={q}
            onAnswer={handleAnswer}
            disabled={answered}
            attempt={attempt}
            worldName={w.name}
          />
        )}
      </div>

      {/* Feedback Overlay */}
      {feedback && (
        <div className="feedback-overlay">
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">{feedback.type === 'correct' ? '🎉' : '💡'}</div>
            <div className="feedback-message">{feedback.message}</div>
            <div className="feedback-sub">{feedback.sub}</div>
          </div>
        </div>
      )}
    </div>
  );
}
