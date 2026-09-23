import React, { useState, useEffect, useRef } from 'react';
import { narrate, sounds, celebrate, cheer, think } from '../utils/audio';
import { simulateStation1Intro, simulateStation2Intro, simulateStation3Intro } from '../utils/narration';
import NumberLine from './shared/NumberLine';
import NumberPad from './shared/NumberPad';
import EstimateCompareBar from './shared/EstimateCompareBar';

const STATIONS = [
  { id: 0, title: 'Number Line Lab', subtitle: 'Concrete & Gravitational Snapping', icon: '🧲' },
  { id: 1, title: 'Estimator Duel', subtitle: 'Speed & Precision Showdown', icon: '⚡' },
  { id: 2, title: 'Compatible Matrix', subtitle: 'Abstract Mental Superpowers', icon: '🧮' },
];

// ═══════════════════════════════════════════════════
// STATION 1: Cosmic Gravitron & Number Line Sandbox
// ═══════════════════════════════════════════════════
const GUIDED_ROUNDS = [
  {
    id: 1,
    title: '🏟️ Rio Stadium Mystery',
    target: 42187,
    min: 42000,
    max: 43000,
    step: 250,
    place: 'thousand',
    prompt: 'Round 42,187 stadium fans to the nearest thousand.',
    correctVal: 42000,
    lowerBenchmark: 42000,
    upperBenchmark: 43000,
    explanation: '42,187 is closer to 42,000 because 187 is less than the halfway mark of 500!',
  },
  {
    id: 2,
    title: '🚆 Mumbai Express Seats',
    target: 3912,
    min: 3000,
    max: 4000,
    step: 250,
    place: 'thousand',
    prompt: 'Round 3,912 passenger seats to the nearest thousand.',
    correctVal: 4000,
    lowerBenchmark: 3000,
    upperBenchmark: 4000,
    explanation: '3,912 has a 9 in the hundreds place (≥ 500), magnetically snapping up to 4,000!',
  },
  {
    id: 3,
    title: '💎 Royal Diamond Weight',
    target: 7.86,
    min: 7.80,
    max: 7.90,
    step: 0.025,
    place: 'tenth',
    prompt: 'Round 7.86 carats to the nearest tenth.',
    correctVal: 7.90,
    lowerBenchmark: 7.80,
    upperBenchmark: 7.90,
    explanation: '7.86 is closer to 7.90 than 7.80 because the hundredths digit is 6 (≥ 5).',
  },
  {
    id: 4,
    title: '🚀 Deep Space Rocket (Midpoint Rule)',
    target: 19500,
    min: 19000,
    max: 20000,
    step: 250,
    place: 'thousand',
    prompt: 'Round 19,500 km/h to the nearest thousand (Midpoint Rule).',
    correctVal: 20000,
    lowerBenchmark: 19000,
    upperBenchmark: 20000,
    explanation: '19,500 lands exactly on the midpoint (500). Standard mathematical convention rounds UP to 20,000!',
  },
];

function Station1({ audioEnabled, onUnlockBadge, onGainXP, onNext }) {
  const [mode, setMode] = useState('guided'); // 'guided' | 'sandbox'
  const [round, setRound] = useState(0);
  const [selectedValue, setSelectedValue] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Sandbox state
  const [sandboxPlace, setSandboxPlace] = useState('ten'); // 'tenth' | 'one' | 'ten' | 'hundred' | 'thousand'
  const [sandboxVal, setSandboxVal] = useState(365);
  const [sandboxSnapped, setSandboxSnapped] = useState(null);
  const [isMagnetActive, setIsMagnetActive] = useState(false);
  const narRef = useRef(null);

  const cur = GUIDED_ROUNDS[round];

  useEffect(() => {
    setSelectedValue(null);
    setSubmitted(false);
    setIsCorrect(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation1Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  // Compute sandbox bounds
  const getSandboxConfig = () => {
    switch (sandboxPlace) {
      case 'tenth': {
        const base = Math.floor(sandboxVal * 10) / 10;
        const min = Number((base - 0.1).toFixed(2));
        const max = Number((base + 0.1).toFixed(2));
        const step = 0.05;
        const lower = Number(base.toFixed(2));
        const upper = Number((base + 0.1).toFixed(2));
        const midpoint = Number(((lower + upper) / 2).toFixed(2));
        const rounded = (sandboxVal - lower) >= (upper - sandboxVal) ? upper : lower;
        return { min, max, step, lower, upper, midpoint, rounded, place: 'hundredth' };
      }
      case 'one': {
        const lower = Math.floor(sandboxVal);
        const upper = lower + 1;
        const min = Math.max(0, lower - 1);
        const max = upper + 1;
        const step = 0.5;
        const midpoint = lower + 0.5;
        const rounded = (sandboxVal - lower) >= 0.5 ? upper : lower;
        return { min, max, step, lower, upper, midpoint, rounded, place: 'tenth' };
      }
      case 'hundred': {
        const lower = Math.floor(sandboxVal / 100) * 100;
        const upper = lower + 100;
        const min = Math.max(0, lower - 100);
        const max = upper + 100;
        const step = 50;
        const midpoint = lower + 50;
        const rounded = (sandboxVal - lower) >= 50 ? upper : lower;
        return { min, max, step, lower, upper, midpoint, rounded, place: 'ten' };
      }
      case 'thousand': {
        const lower = Math.floor(sandboxVal / 1000) * 1000;
        const upper = lower + 1000;
        const min = Math.max(0, lower - 1000);
        const max = upper + 1000;
        const step = 500;
        const midpoint = lower + 500;
        const rounded = (sandboxVal - lower) >= 500 ? upper : lower;
        return { min, max, step, lower, upper, midpoint, rounded, place: 'hundred' };
      }
      case 'ten':
      default: {
        const lower = Math.floor(sandboxVal / 10) * 10;
        const upper = lower + 10;
        const min = Math.max(0, lower - 10);
        const max = upper + 10;
        const step = 5;
        const midpoint = lower + 5;
        const rounded = (sandboxVal - lower) >= 5 ? upper : lower;
        return { min, max, step, lower, upper, midpoint, rounded, place: 'one' };
      }
    }
  };

  const sb = getSandboxConfig();

  const handleSnap = (val) => {
    if (submitted) return;
    setSelectedValue(val);
  };

  const handleSubmit = () => {
    if (selectedValue === null) return;
    const correct = Math.abs(selectedValue - cur.correctVal) < 0.001;
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      sounds.correct();
      onGainXP(25);
      if (round === GUIDED_ROUNDS.length - 1) {
        onUnlockBadge('🧲 Magnet Master');
      }
      if (audioEnabled) {
        narRef.current = narrate([
          celebrate("Perfect snap! You found the exact benchmark!"),
          cheer(cur.explanation)
        ], true);
      }
    } else {
      sounds.wrong();
      if (audioEnabled) {
        narRef.current = narrate([
          think("Look closely at the distances from the midpoint.")
        ], true);
      }
    }
  };

  const triggerMagnetSnap = () => {
    sounds.whoosh();
    setIsMagnetActive(true);
    setTimeout(() => {
      setSandboxSnapped(sb.rounded);
      sounds.snap();
      setIsMagnetActive(false);
      onUnlockBadge('🧲 Graviton Explorer');
      onGainXP(15);
    }, 450);
  };

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 760 }}>
      {/* Mode Switcher Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        <button
          className={`sim-subtab-btn ${mode === 'guided' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setMode('guided'); }}
        >
          🎯 Mystery Missions ({round + 1}/{GUIDED_ROUNDS.length})
        </button>
        <button
          className={`sim-subtab-btn ${mode === 'sandbox' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setMode('sandbox'); }}
        >
          🧪 Free Graviton Sandbox
        </button>
      </div>

      {mode === 'guided' ? (
        <div>
          <div className="station-header">
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span>{cur.title}</span>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: '1.15rem', fontWeight: 600 }}>
            {cur.prompt}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--gold)', marginBottom: 16 }}>
            👉 Tap or drag along the number line to snap the marker to the closest benchmark!
          </p>

          <NumberLine
            min={cur.min}
            max={cur.max}
            target={cur.target}
            currentValue={selectedValue}
            place={cur.place}
            step={cur.step}
            interactive={!submitted}
            onValueChange={handleSnap}
            snappedTick={submitted && isCorrect ? selectedValue : null}
            showDistances={true}
          />

          {!submitted ? (
            <div style={{ marginTop: 18 }}>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={selectedValue === null}
                style={{ opacity: selectedValue === null ? 0.5 : 1, padding: '14px 36px', fontSize: '1.1rem' }}
              >
                ⚡ Lock In My Rounding →
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 20, animation: 'bounceIn 0.5s ease' }}>
              <div style={{
                background: isCorrect ? 'rgba(76, 175, 80, 0.15)' : 'rgba(239, 83, 80, 0.15)',
                border: `2px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`,
                borderRadius: 16,
                padding: '16px 20px',
                marginBottom: 16,
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: isCorrect ? 'var(--green-light)' : 'var(--red-light)' }}>
                  {isCorrect ? '🎉 Phenomenal Precision!' : '❌ Not Quite Right'}
                </div>
                <div style={{ fontSize: '1rem', color: 'white', marginTop: 6, lineHeight: 1.5 }}>
                  {cur.explanation}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                {round < GUIDED_ROUNDS.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setRound(r => r + 1)}
                  >
                    Next Mystery Mission →
                  </button>
                ) : (
                  <button
                    className="btn btn-green"
                    onClick={onNext}
                  >
                    🚀 Advance to Station B →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Free Sandbox Mode */
        <div className="sandbox-panel" style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
            border: '1.5px solid rgba(168, 85, 247, 0.4)',
            borderRadius: 20,
            padding: '20px 24px',
            marginBottom: 20,
          }}>
            <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8 }}>
              🧪 Interactive Gravitational Force Field
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: 0 }}>
              Test any custom number, switch place values, and watch the Midpoint Rule pull the number to its nearest benchmark!
            </p>
          </div>

          {/* Place Value Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[
              { id: 'tenth', label: 'Tenths (0.1)', icon: '🔬' },
              { id: 'one', label: 'Ones (1)', icon: '🪙' },
              { id: 'ten', label: 'Tens (10)', icon: '🔟' },
              { id: 'hundred', label: 'Hundreds (100)', icon: '💯' },
              { id: 'thousand', label: 'Thousands (1k)', icon: '🚀' },
            ].map(p => (
              <button
                key={p.id}
                className={`place-pill-btn ${sandboxPlace === p.id ? 'active' : ''}`}
                onClick={() => {
                  sounds.click();
                  setSandboxPlace(p.id);
                  setSandboxSnapped(null);
                  if (p.id === 'tenth') setSandboxVal(7.84);
                  else if (p.id === 'one') setSandboxVal(14.6);
                  else if (p.id === 'hundred') setSandboxVal(468);
                  else if (p.id === 'thousand') setSandboxVal(3850);
                  else setSandboxVal(73);
                }}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Interactive Number Slider */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600 }}>
                Adjust Target Number:
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--gold)',
                background: 'rgba(255, 193, 7, 0.15)',
                padding: '4px 16px',
                borderRadius: 12,
                border: '1px solid var(--gold)',
              }}>
                {sandboxVal}
              </span>
            </div>

            <input
              type="range"
              min={sandboxPlace === 'tenth' ? 7.0 : sandboxPlace === 'one' ? 10 : sandboxPlace === 'hundred' ? 100 : sandboxPlace === 'thousand' ? 1000 : 10}
              max={sandboxPlace === 'tenth' ? 9.0 : sandboxPlace === 'one' ? 30 : sandboxPlace === 'hundred' ? 900 : sandboxPlace === 'thousand' ? 9000 : 100}
              step={sandboxPlace === 'tenth' ? 0.01 : sandboxPlace === 'one' ? 0.1 : sandboxPlace === 'hundred' ? 1 : sandboxPlace === 'thousand' ? 10 : 1}
              value={sandboxVal}
              onChange={(e) => {
                setSandboxVal(Number(e.target.value));
                setSandboxSnapped(null);
              }}
              style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer', height: 8 }}
            />
          </div>

          {/* Dynamic Number Line */}
          <NumberLine
            min={sb.min}
            max={sb.max}
            target={sandboxVal}
            currentValue={sandboxSnapped}
            place={sb.place}
            step={sb.step}
            interactive={true}
            onValueChange={(val) => {
              setSandboxSnapped(val);
              sounds.snap();
            }}
            snappedTick={sandboxSnapped}
            showDistances={true}
          />

          {/* Magnetic Pull Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 18 }}>
            <button
              className={`btn btn-primary ${isMagnetActive ? 'pulsing' : ''}`}
              onClick={triggerMagnetSnap}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: 'white',
                border: 'none',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
                fontSize: '1.05rem',
                fontWeight: 700,
              }}
            >
              🧲 Release Magnetic Snap!
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                sounds.click();
                setSandboxSnapped(null);
              }}
            >
              🔄 Reset Marker
            </button>
          </div>

          {/* Live Physics Breakdown Pill */}
          {sandboxSnapped !== null && (
            <div style={{
              marginTop: 16,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid #10b981',
              borderRadius: 16,
              padding: '14px 20px',
              animation: 'bounceIn 0.4s ease',
            }}>
              <div style={{ color: '#6ee7b7', fontWeight: 700, fontSize: '1.1rem' }}>
                🧲 Gravitational Snap: {sandboxVal} → {sandboxSnapped}!
              </div>
              <div style={{ color: 'white', fontSize: '0.9rem', marginTop: 4 }}>
                Distance to {sb.lower}: {Number(Math.abs(sandboxVal - sb.lower).toFixed(2))} | Distance to {sb.upper}: {Number(Math.abs(sb.upper - sandboxVal).toFixed(2))}
                {sandboxVal >= sb.midpoint ? ' (≥ Midpoint Rule pulls upward!)' : ' (< Midpoint pulls downward!)'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 2: Estimator vs Calculator Showdown (Speed Duel)
// ═══════════════════════════════════════════════════
const DUEL_CHALLENGES = [
  {
    id: 1,
    category: '🥐 Paris Bakery Checkout',
    items: [
      { name: 'Artisan Croissant', price: 3.85, rounded: 4 },
      { name: 'Fresh Baguette', price: 2.15, rounded: 2 },
      { name: 'Fruit Tartlet', price: 6.90, rounded: 7 },
      { name: 'Hot Cocoa', price: 4.20, rounded: 4 },
    ],
    exactTotal: 17.10,
    benchmarkEstimate: 17.00,
    hint: 'Round each pastry to the nearest euro benchmark ($4 + $2 + $7 + $4)!',
    sliderMin: 10,
    sliderMax: 30,
    sliderStep: 1,
    unit: '$',
  },
  {
    id: 2,
    category: '🏃 Tokyo Marathon Waves',
    items: [
      { name: 'Wave 1 Runners', price: 9820, rounded: 10000 },
      { name: 'Wave 2 Runners', price: 11150, rounded: 11000 },
      { name: 'Wave 3 Runners', price: 8940, rounded: 9000 },
    ],
    exactTotal: 29910,
    benchmarkEstimate: 30000,
    hint: 'Round each wave to the nearest thousand (10,000 + 11,000 + 9,000)!',
    sliderMin: 20000,
    sliderMax: 40000,
    sliderStep: 500,
    unit: 'runners',
  },
  {
    id: 3,
    category: '⚡ Solar Panel Energy Array',
    items: [
      { name: 'Day 1 Power', price: 395, rounded: 400 },
      { name: 'Days in Cycle', price: 21, rounded: 20 },
    ],
    exactTotal: 8295,
    benchmarkEstimate: 8000,
    hint: 'Use compatible numbers: 400 kWh × 20 days ≈ 8,000 kWh!',
    sliderMin: 5000,
    sliderMax: 12000,
    sliderStep: 250,
    unit: 'kWh',
  },
];

const REASONABLE_CARDS_ROUNDS = [
  {
    title: 'Round 1 · Real-World Judgment Filter',
    instruction: 'Tap all cards that show a REASONABLE, trustworthy estimate!',
    cards: [
      { id: 'c1', icon: '🪙', exact: '482 coins in a jar', estimate: 'About 500 coins', reasonable: true, reason: '482 rounds smoothly to 500.' },
      { id: 'c2', icon: '🏟️', exact: '39,120 fans in stadium', estimate: 'About 40,000 fans', reasonable: true, reason: '39,120 rounds up to 40,000.' },
      { id: 'c3', icon: '🏃', exact: '82 runners in park', estimate: 'About 200 runners', reasonable: false, reason: '200 is more than double the real count!' },
      { id: 'c4', icon: '📚', exact: '298 library books', estimate: 'Exactly 298.42 books', reasonable: false, reason: 'An estimate should be friendly & fast, not falsely precise with fractions!' },
    ],
  },
  {
    title: 'Round 2 · Operations & Calculations',
    instruction: 'Tap all cards that show a mathematically sound estimate!',
    cards: [
      { id: 'c5', icon: '➕', exact: '218 + 396 = 614', estimate: '200 + 400 ≈ 600', reasonable: true, reason: '200 + 400 = 600 is 98% accurate.' },
      { id: 'c6', icon: '✖️', exact: '39 × 21 = 819', estimate: '40 × 20 ≈ 800', reasonable: true, reason: '40 × 20 = 800 is within 2% error.' },
      { id: 'c7', icon: '➗', exact: '396 ÷ 19 = 20.8', estimate: '400 ÷ 20 ≈ 200', reasonable: false, reason: '400 ÷ 20 = 20, NOT 200 (extra zero error!).' },
      { id: 'c8', icon: '➖', exact: '895 − 412 = 483', estimate: '900 − 400 ≈ 500', reasonable: true, reason: '900 − 400 = 500 is very close to 483.' },
    ],
  },
];

function Station2({ audioEnabled, onUnlockBadge, onGainXP, onNext }) {
  const [subTab, setSubTab] = useState('duel'); // 'duel' | 'inspector'
  const [duelIndex, setDuelIndex] = useState(0);
  const [userEstimate, setUserEstimate] = useState(15);
  const [duelRevealed, setDuelRevealed] = useState(false);

  // Inspector state
  const [inspRound, setInspRound] = useState(0);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [inspSubmitted, setInspSubmitted] = useState(false);

  const narRef = useRef(null);
  const curDuel = DUEL_CHALLENGES[duelIndex];
  const curInsp = REASONABLE_CARDS_ROUNDS[inspRound];

  useEffect(() => {
    setUserEstimate(curDuel.sliderMin + (curDuel.sliderMax - curDuel.sliderMin) / 2);
    setDuelRevealed(false);
  }, [duelIndex]);

  useEffect(() => {
    setSelectedCardIds([]);
    setInspSubmitted(false);
  }, [inspRound]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  // Compute accuracy
  const errorDiff = Math.abs(userEstimate - curDuel.exactTotal);
  const accuracyPct = Math.max(0, Math.min(100, (1 - errorDiff / curDuel.exactTotal) * 100));

  const handleRevealDuel = () => {
    sounds.correct();
    setDuelRevealed(true);
    onGainXP(30);
    if (accuracyPct >= 95) {
      onUnlockBadge('🎯 Precision Sniper');
    }
  };

  const handleToggleCard = (id) => {
    if (inspSubmitted) return;
    sounds.click();
    setSelectedCardIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCheckInspector = () => {
    setInspSubmitted(true);
    const correctCards = curInsp.cards.filter(c => c.reasonable).map(c => c.id);
    const allRight = correctCards.every(id => selectedCardIds.includes(id)) &&
                     selectedCardIds.every(id => correctCards.includes(id));

    if (allRight) {
      sounds.correct();
      onGainXP(25);
      onUnlockBadge('🔍 Estimator Inspector');
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 760 }}>
      {/* Sub-Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        <button
          className={`sim-subtab-btn ${subTab === 'duel' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setSubTab('duel'); }}
        >
          ⚡ Speed Duel ({duelIndex + 1}/{DUEL_CHALLENGES.length})
        </button>
        <button
          className={`sim-subtab-btn ${subTab === 'inspector' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setSubTab('inspector'); }}
        >
          🔍 Reasonable vs Ridiculous
        </button>
      </div>

      {subTab === 'duel' ? (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="station-header">
            <h2>{curDuel.category}</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 14, fontSize: '1.05rem' }}>
            {curDuel.hint}
          </p>

          {/* Receipt / Items Preview Box */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 10,
            marginBottom: 18,
          }}>
            {curDuel.items.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '12px 10px',
                textAlign: 'center',
              }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>
                  {item.name}
                </div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                  {curDuel.unit === '$' ? `$${item.price.toFixed(2)}` : `${item.price.toLocaleString()} ${curDuel.unit}`}
                </div>
                <div style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600, marginTop: 4 }}>
                  ≈ {curDuel.unit === '$' ? `$${item.rounded}` : `${item.rounded.toLocaleString()}`}
                </div>
              </div>
            ))}
          </div>

          {/* User Estimate Slider Control */}
          <div style={{
            background: 'rgba(18, 18, 55, 0.9)',
            border: '1.5px solid rgba(255, 193, 7, 0.3)',
            borderRadius: 20,
            padding: '20px 24px',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                Your Fast Mental Estimate:
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#ffc107',
                background: 'rgba(255, 193, 7, 0.15)',
                padding: '4px 20px',
                borderRadius: 14,
                border: '1.5px solid #ffc107',
              }}>
                {curDuel.unit === '$' ? `$${userEstimate.toLocaleString()}` : `${userEstimate.toLocaleString()} ${curDuel.unit}`}
              </span>
            </div>

            <input
              type="range"
              min={curDuel.sliderMin}
              max={curDuel.sliderMax}
              step={curDuel.sliderStep}
              value={userEstimate}
              disabled={duelRevealed}
              onChange={(e) => {
                sounds.click();
                setUserEstimate(Number(e.target.value));
              }}
              style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer', height: 10 }}
            />
          </div>

          {!duelRevealed ? (
            <button
              className="btn btn-primary"
              onClick={handleRevealDuel}
              style={{ padding: '14px 36px', fontSize: '1.1rem' }}
            >
              ⚡ Reveal Exact & Test Precision →
            </button>
          ) : (
            <div style={{ animation: 'bounceIn 0.4s ease' }}>
              {/* Precision Gauge Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(56, 189, 248, 0.15))',
                border: '2px solid #4caf50',
                borderRadius: 20,
                padding: '20px',
                marginBottom: 18,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Exact Calculation</div>
                    <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                      {curDuel.unit === '$' ? `$${curDuel.exactTotal.toFixed(2)}` : `${curDuel.exactTotal.toLocaleString()}`}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '8px 20px',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}>
                    <div style={{ color: '#4caf50', fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                      {accuracyPct.toFixed(1)}% Accuracy!
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                      Difference: {curDuel.unit === '$' ? `$${errorDiff.toFixed(2)}` : errorDiff.toFixed(0)}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your Estimate</div>
                    <div style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                      {curDuel.unit === '$' ? `$${userEstimate.toLocaleString()}` : `${userEstimate.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                {duelIndex < DUEL_CHALLENGES.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setDuelIndex(i => i + 1)}
                  >
                    Next Duel Challenge →
                  </button>
                ) : (
                  <button
                    className="btn btn-green"
                    onClick={onNext}
                  >
                    🚀 Advance to Station C →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Reasonable vs Ridiculous Inspector */
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="station-header">
            <h2>{curInsp.title}</h2>
          </div>
          <p style={{ color: 'var(--gold)', marginBottom: 18, fontSize: '1.05rem', fontWeight: 600 }}>
            {curInsp.instruction}
          </p>

          <div className="estimate-cards-grid">
            {curInsp.cards.map((c) => {
              const isSelected = selectedCardIds.includes(c.id);
              let cls = 'estimate-card';
              if (isSelected && !inspSubmitted) cls += ' selected';
              if (inspSubmitted) {
                if (c.reasonable) cls += ' correct-reveal';
                else if (isSelected && !c.reasonable) cls += ' wrong-reveal';
              }

              return (
                <div key={c.id} className={cls} onClick={() => handleToggleCard(c.id)}>
                  <div className="estimate-card-icon">{c.icon}</div>
                  <div className="estimate-card-caption">{c.estimate}</div>
                  <div className="estimate-card-sub">{c.exact}</div>
                  {inspSubmitted && (
                    <div style={{
                      fontSize: '0.85rem',
                      marginTop: 8,
                      color: c.reasonable ? 'var(--green-light)' : 'var(--red-light)',
                      fontWeight: 600,
                    }}>
                      {c.reasonable ? '✅ Reasonable' : '❌ Unreasonable'}: {c.reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!inspSubmitted ? (
            <button
              className="btn btn-primary"
              onClick={handleCheckInspector}
              disabled={selectedCardIds.length === 0}
              style={{ marginTop: 16, opacity: selectedCardIds.length === 0 ? 0.5 : 1 }}
            >
              Check Inspector Selections →
            </button>
          ) : (
            <div style={{ marginTop: 20 }}>
              {inspRound < REASONABLE_CARDS_ROUNDS.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setInspRound(r => r + 1)}
                >
                  Next Inspector Round →
                </button>
              ) : (
                <button
                  className="btn btn-green"
                  onClick={onNext}
                >
                  🚀 Advance to Station C →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// STATION 3: The Magic Compatible Numbers Matrix (Abstract)
// ═══════════════════════════════════════════════════
const COMPATIBLE_PROBLEMS = [
  {
    id: 1,
    expression: '396 × 21',
    exact: 8316,
    exactTime: '🐢 15–30 sec (Paper required)',
    standardRounding: '400 × 21 = 8,400',
    compatibleNumbers: '400 × 20 = 8,000',
    accuracy: '96.2% Accurate',
    explanation: '400 and 20 are super compatible! Mental multiplication takes less than 2 seconds.',
  },
  {
    id: 2,
    expression: '418 ÷ 19',
    exact: 22.0,
    exactTime: '🐢 20–40 sec (Long division)',
    standardRounding: '420 ÷ 20 = 21',
    compatibleNumbers: '400 ÷ 20 = 20',
    accuracy: '90.9% Accurate',
    explanation: '400 ÷ 20 = 20 gives an instant sanity check before diving into long division.',
  },
  {
    id: 3,
    expression: '895 − 412',
    exact: 483,
    exactTime: '🐢 10–15 sec (Borrowing required)',
    standardRounding: '900 − 410 = 490',
    compatibleNumbers: '900 − 400 = 500',
    accuracy: '96.5% Accurate',
    explanation: '900 − 400 = 500 lets you immediately verify reasonable change or budget estimates.',
  },
];

const EQUATION_ROUNDS = [
  {
    prompt: 'Complete the compatible multiplication:',
    part1: '396 × 21',
    op: '≈ 400 × 20 =',
    part2: '',
    blankLabel: 'Product',
    correctAnswer: '8000',
    explanation: '400 × 20 = 8,000.',
  },
  {
    prompt: 'Complete the compatible division:',
    part1: '418 ÷ 19',
    op: '≈ 400 ÷ 20 =',
    part2: '',
    blankLabel: 'Quotient',
    correctAnswer: '20',
    explanation: '400 ÷ 20 = 20.',
  },
  {
    prompt: 'Estimate the decimal sum to the nearest dollar:',
    part1: '$18.75 + $11.20',
    op: '≈ $19 + $11 =',
    part2: '',
    blankLabel: 'Sum',
    correctAnswer: '30',
    explanation: '$19 + $11 = $30.',
  },
];

function Station3({ audioEnabled, onUnlockBadge, onGainXP, onNext }) {
  const [subTab, setSubTab] = useState('matrix'); // 'matrix' | 'builder'
  const [matrixIndex, setMatrixIndex] = useState(0);

  // Equation Builder state
  const [eqRound, setEqRound] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const narRef = useRef(null);

  const curProblem = COMPATIBLE_PROBLEMS[matrixIndex];
  const curEq = EQUATION_ROUNDS[eqRound];

  useEffect(() => {
    setInputVal('');
    setSubmitted(false);
    setIsCorrect(false);
  }, [eqRound]);

  useEffect(() => {
    if (audioEnabled) {
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => { narRef.current?.cancel(); };
  }, [audioEnabled]);

  const handleDigit = (d) => {
    if (submitted) return;
    if (inputVal.length >= 6) return;
    setInputVal(prev => prev + d);
  };

  const handleDelete = () => {
    if (submitted) return;
    setInputVal(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (submitted) return;
    setInputVal('');
  };

  const handleSubmitEq = () => {
    if (!inputVal) return;
    const correct = inputVal.trim() === curEq.correctAnswer.trim();
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      sounds.correct();
      onGainXP(30);
      onUnlockBadge('💡 Compatible Wizard');
      if (audioEnabled) {
        narRef.current = narrate([
          celebrate("Great math! You completed the compatible equation!"),
          cheer(curEq.explanation)
        ], true);
      }
    } else {
      sounds.wrong();
      if (audioEnabled) {
        narRef.current = narrate([
          think(`The correct answer is ${curEq.correctAnswer}. ${curEq.explanation}`)
        ], true);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 760 }}>
      {/* Sub-Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
        <button
          className={`sim-subtab-btn ${subTab === 'matrix' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setSubTab('matrix'); }}
        >
          🧮 Strategy Power-Matrix ({matrixIndex + 1}/{COMPATIBLE_PROBLEMS.length})
        </button>
        <button
          className={`sim-subtab-btn ${subTab === 'builder' ? 'active' : ''}`}
          onClick={() => { sounds.click(); setSubTab('builder'); }}
        >
          📝 Touch Keypad Builder ({eqRound + 1}/{EQUATION_ROUNDS.length})
        </button>
      </div>

      {subTab === 'matrix' ? (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="station-header">
            <h2>Mental Math Strategy Comparator</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '1.05rem' }}>
            Compare how different rounding strategies balance speed vs precision!
          </p>

          {/* Problem Display Banner */}
          <div style={{
            background: 'rgba(255, 193, 7, 0.12)',
            border: '2px solid var(--gold)',
            borderRadius: 18,
            padding: '16px',
            marginBottom: 20,
          }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Target Operation</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'white' }}>
              {curProblem.expression}
            </div>
          </div>

          {/* 3 Strategies Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
            {/* Strategy 1: Exact */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16,
              padding: '18px 14px',
              textAlign: 'left',
            }}>
              <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>
                📝 Exact Calculation
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>
                {curProblem.exact}
              </div>
              <div style={{ color: '#f87171', fontSize: '0.85rem', marginTop: 8 }}>
                Speed: {curProblem.exactTime}
              </div>
              <div style={{ color: '#38bdf8', fontSize: '0.85rem', marginTop: 4 }}>
                Precision: 100% Exact
              </div>
            </div>

            {/* Strategy 2: Standard Rounding */}
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 16,
              padding: '18px 14px',
              textAlign: 'left',
            }}>
              <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>
                📏 Standard Rounding
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)' }}>
                {curProblem.standardRounding}
              </div>
              <div style={{ color: '#fbbf24', fontSize: '0.85rem', marginTop: 8 }}>
                Speed: ⚡ 5–10 seconds
              </div>
              <div style={{ color: '#34d399', fontSize: '0.85rem', marginTop: 4 }}>
                Precision: ~98% Accurate
              </div>
            </div>

            {/* Strategy 3: Compatible Numbers */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(6, 182, 212, 0.18))',
              border: '2px solid #10b981',
              borderRadius: 16,
              padding: '18px 14px',
              textAlign: 'left',
            }}>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>
                💡 Compatible Shortcut
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#6ee7b7', fontFamily: 'var(--font-display)' }}>
                {curProblem.compatibleNumbers}
              </div>
              <div style={{ color: '#34d399', fontSize: '0.85rem', marginTop: 8 }}>
                Speed: ⚡⚡ &lt; 2 seconds!
              </div>
              <div style={{ color: '#67e8f9', fontSize: '0.85rem', marginTop: 4 }}>
                Precision: {curProblem.accuracy}
              </div>
            </div>
          </div>

          {/* Explanation Box */}
          <div style={{
            background: 'rgba(168, 85, 247, 0.12)',
            border: '1.5px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 16,
            padding: '14px 18px',
            marginBottom: 20,
            fontSize: '0.95rem',
            color: 'white',
          }}>
            💡 {curProblem.explanation}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            {matrixIndex < COMPATIBLE_PROBLEMS.length - 1 ? (
              <button
                className="btn btn-primary"
                onClick={() => { sounds.click(); setMatrixIndex(i => i + 1); onGainXP(15); }}
              >
                Next Strategy Comparison →
              </button>
            ) : (
              <button
                className="btn btn-green"
                onClick={onNext}
              >
                🚀 Complete Simulation Phase!
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Equation Builder */
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="station-header">
            <h2>📝 Touch Equation Builder</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: '1.1rem' }}>
            {curEq.prompt}
          </p>

          <div className="equation-builder-row">
            {curEq.part1 && <span style={{ color: 'white' }}>{curEq.part1}</span>}
            {curEq.op && <span style={{ color: 'var(--gold)', margin: '0 8px' }}>{curEq.op}</span>}
            {curEq.part2 && <span style={{ color: 'white' }}>{curEq.part2}</span>}
            <div className={`blank-slot ${inputVal ? 'filled' : ''} ${submitted ? (isCorrect ? 'correct' : 'wrong-reveal') : ''}`}>
              {inputVal || '?'}
            </div>
          </div>

          {/* Touch Number Pad */}
          <NumberPad
            onInput={handleDigit}
            onDelete={handleDelete}
            onClear={handleClear}
            disabled={submitted}
            showDecimal={true}
          />

          {!submitted ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmitEq}
              disabled={!inputVal}
              style={{ marginTop: 16, opacity: !inputVal ? 0.5 : 1 }}
            >
              Check Equation →
            </button>
          ) : (
            <div style={{ marginTop: 20, animation: 'bounceIn 0.5s ease' }}>
              <div style={{
                background: isCorrect ? 'rgba(76, 175, 80, 0.15)' : 'rgba(239, 83, 80, 0.15)',
                border: `2px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`,
                borderRadius: 16,
                padding: '16px 20px',
                marginBottom: 16,
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: isCorrect ? 'var(--green-light)' : 'var(--red-light)' }}>
                  {isCorrect ? '🎉 Correct Equation!' : `Correct Answer: ${curEq.correctAnswer}`}
                </div>
                <div style={{ fontSize: '0.95rem', color: 'white', marginTop: 4 }}>
                  {curEq.explanation}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                {eqRound < EQUATION_ROUNDS.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setEqRound(r => r + 1)}
                  >
                    Next Round →
                  </button>
                ) : (
                  <button
                    className="btn btn-green"
                    onClick={onNext}
                  >
                    🚀 Proceed to Practice Phase!
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN SIMULATION PHASE CONTROLLER
// ═══════════════════════════════════════════════════
export default function SimulatePhase({ onComplete, audioEnabled, onAddXP }) {
  const [activeStation, setActiveStation] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [recentToast, setRecentToast] = useState(null);

  const handleUnlockBadge = (badgeName) => {
    if (!unlockedBadges.includes(badgeName)) {
      setUnlockedBadges(prev => [...prev, badgeName]);
      sounds.badge();
      setRecentToast(`🎖️ Unlocked: ${badgeName}!`);
      setTimeout(() => setRecentToast(null), 3500);
    }
  };

  const handleGainXP = (xp = 25) => {
    if (onAddXP) onAddXP(xp);
  };

  const handleNextStation = () => {
    if (activeStation < STATIONS.length - 1) {
      sounds.snap();
      setActiveStation(s => s + 1);
    } else {
      sounds.correct();
      onComplete();
    }
  };

  return (
    <div className="simulate-phase">
      {/* Toast Notification */}
      {recentToast && (
        <div className="sim-toast-badge">
          {recentToast}
        </div>
      )}

      {/* Header */}
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Phase 3: Interactive Simulation Lab</h3>
        <p className="simulate-sublabel">Engage in tactile physics, live precision duels, and compatible mental math!</p>
      </div>

      {/* 3-Station Glowing Capsule Navigation */}
      <div className="sim-station-capsule-row">
        {STATIONS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => { sounds.click(); setActiveStation(idx); }}
            className={`sim-station-capsule-btn ${activeStation === idx ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.title}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{s.subtitle}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Glass Simulation Stage */}
      <div className="glass-card" style={{ width: '100%', maxWidth: 840, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        {activeStation === 0 && (
          <Station1
            audioEnabled={audioEnabled}
            onUnlockBadge={handleUnlockBadge}
            onGainXP={handleGainXP}
            onNext={handleNextStation}
          />
        )}
        {activeStation === 1 && (
          <Station2
            audioEnabled={audioEnabled}
            onUnlockBadge={handleUnlockBadge}
            onGainXP={handleGainXP}
            onNext={handleNextStation}
          />
        )}
        {activeStation === 2 && (
          <Station3
            audioEnabled={audioEnabled}
            onUnlockBadge={handleUnlockBadge}
            onGainXP={handleGainXP}
            onNext={handleNextStation}
          />
        )}
      </div>

      {/* Unlocked Badges Bar */}
      {unlockedBadges.length > 0 && (
        <div style={{
          marginTop: 20,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <span style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 700 }}>🏆 Lab Discoveries:</span>
          {unlockedBadges.map((b, i) => (
            <span key={i} className="sim-badge-pill">
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
