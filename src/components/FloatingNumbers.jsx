import React from 'react';

const FLOATING_ITEMS = [
  { text: '≈', top: '8%', left: '12%', rot: '-12deg', size: '3.8rem', anim: 'float-drift', dur: '14s', delay: '0s', color: 'rgba(255, 215, 0, 0.12)' },
  { text: '42,187', top: '16%', right: '14%', rot: '15deg', size: '2.8rem', anim: 'float-bob1', dur: '12s', delay: '1s', color: 'rgba(99, 102, 241, 0.14)' },
  { text: '100', top: '28%', left: '6%', rot: '-20deg', size: '3.2rem', anim: 'float-bob2', dur: '16s', delay: '2s', color: 'rgba(236, 72, 153, 0.11)' },
  { text: '$18.75', top: '22%', right: '28%', rot: '-8deg', size: '2.4rem', anim: 'float-drift', dur: '18s', delay: '3s', color: 'rgba(16, 185, 129, 0.12)' },
  { text: '±', top: '38%', left: '22%', rot: '10deg', size: '3.0rem', anim: 'float-bob1', dur: '13s', delay: '0.5s', color: 'rgba(255, 255, 255, 0.09)' },
  { text: '3,912', top: '46%', right: '8%', rot: '-18deg', size: '3.4rem', anim: 'float-bob2', dur: '15s', delay: '2.5s', color: 'rgba(56, 189, 248, 0.13)' },
  { text: '400 × 20', top: '62%', left: '8%', rot: '14deg', size: '2.6rem', anim: 'float-drift', dur: '17s', delay: '1.5s', color: 'rgba(251, 191, 36, 0.13)' },
  { text: '8,000', top: '74%', left: '24%', rot: '-10deg', size: '3.6rem', anim: 'float-bob1', dur: '14s', delay: '3.5s', color: 'rgba(168, 85, 247, 0.14)' },
  { text: '1,000', top: '66%', right: '22%', rot: '22deg', size: '3.2rem', anim: 'float-bob2', dur: '13s', delay: '0.8s', color: 'rgba(255, 255, 255, 0.1)' },
  { text: '3.14', top: '84%', right: '12%', rot: '-15deg', size: '2.9rem', anim: 'float-drift', dur: '19s', delay: '2.2s', color: 'rgba(244, 114, 182, 0.12)' },
  { text: '≈ $36', top: '88%', left: '48%', rot: '8deg', size: '2.5rem', anim: 'float-bob1', dur: '15s', delay: '4s', color: 'rgba(52, 211, 153, 0.12)' },
  { text: '500', top: '10%', left: '45%', rot: '-5deg', size: '2.4rem', anim: 'float-bob2', dur: '11s', delay: '1.2s', color: 'rgba(255, 255, 255, 0.08)' },
  { text: '÷ 10', top: '52%', left: '42%', rot: '12deg', size: '2.2rem', anim: 'float-drift', dur: '16s', delay: '3.2s', color: 'rgba(129, 140, 248, 0.11)' },
  { text: '99', top: '78%', right: '38%', rot: '-25deg', size: '2.6rem', anim: 'float-bob1', dur: '12s', delay: '0.4s', color: 'rgba(251, 146, 60, 0.12)' },
];

export default function FloatingNumbers() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {FLOATING_ITEMS.map((item, i) => (
        <span
          key={i}
          className={`floating-static-number ${item.anim}`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            fontSize: item.size,
            color: item.color,
            animationDuration: item.dur,
            animationDelay: item.delay,
            '--rot': item.rot,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
