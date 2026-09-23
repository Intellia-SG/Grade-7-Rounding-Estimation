import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';

export default function NumberLine({
  min = 0,
  max = 100,
  target = 50,
  currentValue = null,
  place = 'ten',
  step = 10,
  interactive = false,
  onValueChange = null,
  showDistances = true,
  snappedTick = null,
  ticks = null,
  height = 120,
}) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generate ticks if not provided
  const tickList = ticks || (() => {
    const list = [];
    const actualStep = step > 0 ? step : (max - min) / 4;
    for (let v = min; v <= max + 0.0001; v += actualStep) {
      list.push(Number(v.toFixed(place === 'hundredth' ? 2 : place === 'tenth' ? 1 : 0)));
    }
    return list;
  })();

  const midpoint = (min + max) / 2;
  const activeValue = currentValue !== null ? currentValue : target;

  const getPercentage = (val) => {
    if (max === min) return 50;
    return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  };

  const targetPct = getPercentage(target);
  const activePct = getPercentage(activeValue);
  const midPct = getPercentage(midpoint);

  // Handle drag / click interaction
  const handlePointerMove = (e) => {
    if (!interactive || (!isDragging && e.type !== 'click')) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const pct = clickX / rect.width;
    const rawVal = min + pct * (max - min);

    // Find nearest tick
    let closestTick = tickList[0];
    let minDiff = Math.abs(rawVal - tickList[0]);
    tickList.forEach(t => {
      const diff = Math.abs(rawVal - t);
      if (diff < minDiff) {
        minDiff = diff;
        closestTick = t;
      }
    });

    if (onValueChange && closestTick !== currentValue) {
      sounds.click();
      onValueChange(closestTick);
    }
  };

  const handlePointerDown = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      sounds.snap();
    }
  };

  useEffect(() => {
    const onUp = () => setIsDragging(false);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  const distToMin = Math.abs(target - min);
  const distToMax = Math.abs(target - max);

  return (
    <div className="number-line-container" style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={isDragging ? handlePointerMove : undefined}
        onClick={handlePointerMove}
        style={{ width: '100%', cursor: interactive ? 'pointer' : 'default', touchAction: 'none' }}
      >
        <svg viewBox="0 0 800 120" className="number-line-svg" style={{ overflow: 'visible' }}>
          {/* Defs / Gradients */}
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c5cbf" />
              <stop offset="50%" stopColor="#ffc107" />
              <stop offset="100%" stopColor="#4caf50" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Axis Track */}
          <rect x="40" y="56" width="720" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
          <rect x="40" y="58" width="720" height="4" rx="2" fill="url(#lineGrad)" />

          {/* End Arrows */}
          <polygon points="35,60 45,54 45,66" fill="#7c5cbf" />
          <polygon points="765,60 755,54 755,66" fill="#4caf50" />

          {/* Midpoint Tick & Dashed Guide */}
          <line
            x1={40 + (midPct / 100) * 720}
            y1="35"
            x2={40 + (midPct / 100) * 720}
            y2="75"
            stroke="rgba(255,255,255,0.4)"
            strokeDasharray="4,4"
            strokeWidth="2"
          />
          <text
            x={40 + (midPct / 100) * 720}
            y="28"
            textAnchor="middle"
            fill="var(--gold-light)"
            fontSize="12"
            fontFamily="Fredoka"
            fontWeight="500"
          >
            Midpoint ({midpoint.toLocaleString()})
          </text>

          {/* Benchmark Ticks & Labels */}
          {tickList.map((tickVal, idx) => {
            const pct = getPercentage(tickVal);
            const x = 40 + (pct / 100) * 720;
            const isSnapped = snappedTick !== null && snappedTick === tickVal;
            const isHoverOrActive = currentValue === tickVal;

            return (
              <g
                key={idx}
                className="benchmark-tick-btn"
                onClick={(e) => {
                  if (interactive && onValueChange) {
                    e.stopPropagation();
                    sounds.click();
                    onValueChange(tickVal);
                  }
                }}
              >
                {/* Tick bar */}
                <rect
                  x={x - 2}
                  y="46"
                  width="4"
                  height="28"
                  rx="2"
                  fill={isSnapped ? '#4caf50' : isHoverOrActive ? '#ffc107' : 'white'}
                  filter={isHoverOrActive ? 'url(#glow)' : undefined}
                />
                {/* Tick label */}
                <text
                  x={x}
                  y="96"
                  textAnchor="middle"
                  fill={isSnapped ? 'var(--green-light)' : isHoverOrActive ? 'var(--gold)' : 'white'}
                  fontSize="14"
                  fontFamily="Fredoka"
                  fontWeight="600"
                >
                  {tickVal.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Target Value Fixed Indicator */}
          <g transform={`translate(${40 + (targetPct / 100) * 720}, 60)`}>
            <circle r="9" fill="#ff7043" filter="url(#glow)" />
            <circle r="5" fill="white" />
            <text
              y="-18"
              textAnchor="middle"
              fill="#ff7043"
              fontSize="14"
              fontFamily="Fredoka"
              fontWeight="700"
            >
              Exact: {target.toLocaleString()}
            </text>
          </g>

          {/* Interactive/Active Selected Marker */}
          {currentValue !== null && currentValue !== target && (
            <g
              transform={`translate(${40 + (activePct / 100) * 720}, 60)`}
              style={{ transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              <circle r="14" fill="rgba(255, 193, 7, 0.3)" />
              <circle r="9" fill="#ffc107" filter="url(#glow)" />
              <circle r="4" fill="#1a1a2e" />
              <text
                y="36"
                textAnchor="middle"
                fill="var(--gold)"
                fontSize="13"
                fontFamily="Fredoka"
                fontWeight="700"
              >
                Rounded: {currentValue.toLocaleString()}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Distance readout badges */}
      {showDistances && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 8px' }}>
          <span className="distance-badge">
            ⬅ Distance to {min.toLocaleString()}: <strong>{Number(distToMin.toFixed(2)).toLocaleString()}</strong>
          </span>
          <span className="distance-badge">
            Distance to {max.toLocaleString()}: <strong>{Number(distToMax.toFixed(2)).toLocaleString()}</strong> ➡
          </span>
        </div>
      )}
    </div>
  );
}
