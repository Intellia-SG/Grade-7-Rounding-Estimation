import React, { useState, useCallback, useEffect } from 'react';
import { stopNarration, setSoundEnabled } from './utils/audio';
import FloatingNumbers from './components/FloatingNumbers';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PlayPhase from './components/PlayPhase';
import ReflectPhase from './components/ReflectPhase';

const PHASES = ['intro', 'wonder', 'story', 'simulate', 'play', 'reflect'];

const JOURNEY_ITEMS = [
  { icon: '🤔', label: 'WONDER' },
  { icon: '📖', label: 'STORY' },
  { icon: '🧪', label: 'SIMULATE' },
  { icon: '🎯', label: 'PRACTICE' },
  { icon: '📓', label: 'REFLECT' },
];

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStats, setPlayStats] = useState(null);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => {
      const next = !prev;
      setSoundEnabled(next);
      return next;
    });
  }, []);

  const goHome = useCallback(() => {
    stopNarration();
    setPhase('intro');
    setPlayStats(null);
  }, []);

  const restart = useCallback(() => {
    stopNarration();
    setPhase('wonder');
    setPlayStats(null);
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => stopNarration();
  }, []);

  const phaseIndex = PHASES.indexOf(phase);
  const showJourney = phase !== 'intro';

  return (
    <>
      <FloatingNumbers />
      <div className="app-container">
        {/* Audio Toggle on Intro screen when capsule is not present */}
        {!showJourney && (
          <button
            className="audio-toggle-btn"
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
            aria-label={audioEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
          >
            {audioEnabled ? '🔊' : '🔇'}
          </button>
        )}

        {/* Home Button Top-Left */}
        {showJourney && (
          <button className="top-home-circle-btn" onClick={goHome} aria-label="Go to Home Screen" title="Home">
            🏠
          </button>
        )}

        {/* Floating Capsule Journey Bar */}
        {showJourney && (
          <div className="floating-journey-capsule">
            {JOURNEY_ITEMS.map((item, i) => {
              const stepPhaseIndex = i + 1; // wonder=1, story=2, etc.
              const isActive = phaseIndex === stepPhaseIndex;
              const isCompleted = phaseIndex > stepPhaseIndex;

              return (
                <div key={i} className="capsule-step-item">
                  <div className={`capsule-step-pill ${isActive ? 'active-pill' : ''} ${isCompleted ? 'completed-pill' : ''}`}>
                    <span className="capsule-step-icon">{item.icon}</span>
                    <span className="capsule-step-text">{item.label}</span>
                  </div>
                  {i < JOURNEY_ITEMS.length - 1 && (
                    <div className="capsule-step-divider" />
                  )}
                </div>
              );
            })}

            {/* Mute Button Placed Directly Next to Reflect */}
            <div className="capsule-step-divider" />
            <button
              className="capsule-audio-btn"
              onClick={toggleAudio}
              title={audioEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
              aria-label={audioEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        )}

        {/* Phase Content */}
        {phase === 'intro' && (
          <IntroScreen
            onStart={() => setPhase('wonder')}
            audioEnabled={audioEnabled}
            onToggleAudio={toggleAudio}
          />
        )}

        {phase === 'wonder' && (
          <WonderPhase
            onComplete={() => setPhase('story')}
            audioEnabled={audioEnabled}
          />
        )}

        {phase === 'story' && (
          <StoryPhase
            onComplete={() => setPhase('simulate')}
            audioEnabled={audioEnabled}
          />
        )}

        {phase === 'simulate' && (
          <SimulatePhase
            onComplete={() => setPhase('play')}
            audioEnabled={audioEnabled}
            onAddXP={(amt) => setXp(prev => prev + amt)}
          />
        )}

        {phase === 'play' && (
          <PlayPhase
            onComplete={(stats) => {
              setPlayStats(stats);
              setPhase('reflect');
            }}
            audioEnabled={audioEnabled}
          />
        )}

        {phase === 'reflect' && (
          <ReflectPhase
            stats={playStats}
            onRestart={restart}
            onGoHome={goHome}
            audioEnabled={audioEnabled}
          />
        )}

        {/* Bottom Persistent HUD Badges */}
        {showJourney && (
          <div className="bottom-persistent-hud">
            <div className="hud-mini-pill">
              <span style={{ color: 'var(--gold)' }}>⚡</span>
              <span>{playStats?.xp || 0} XP</span>
            </div>
            <div className="hud-mini-pill">
              <span>⭐</span>
              <span>0 Stars</span>
            </div>
            <div className="hud-mini-pill">
              <span style={{ color: 'var(--coral)' }}>🔥</span>
              <span>{playStats?.maxStreak || 0} Streak</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
