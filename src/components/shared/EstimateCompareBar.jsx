import React from 'react';

export default function EstimateCompareBar({
  exactLabel = "Exact Total",
  exactValue = 100,
  estimateLabel = "Estimated Total",
  estimateValue = 100,
  unit = "",
  items = null,
}) {
  const maxVal = Math.max(exactValue, estimateValue, 1) * 1.15;
  const exactPct = Math.min(100, (exactValue / maxVal) * 100);
  const estimatePct = Math.min(100, (estimateValue / maxVal) * 100);

  const diff = Number((estimateValue - exactValue).toFixed(2));
  const isOver = diff > 0;
  const isExact = diff === 0;

  return (
    <div className="compare-bar-container">
      {/* Itemized List if available */}
      {items && items.length > 0 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {items.map((it, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.06)',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.85rem',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>{it.name}: </span>
              <strong>{unit}{it.price}</strong> → <strong style={{ color: 'var(--gold)' }}>{unit}{it.rounded}</strong>
            </div>
          ))}
        </div>
      )}

      {/* Bar 1: Exact Value */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{exactLabel}</span>
          <strong style={{ color: '#ff7043' }}>{unit}{exactValue.toLocaleString()}</strong>
        </div>
        <div style={{ width: '100%', height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
          <div
            style={{
              width: `${exactPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ff7043, #ff8a65)',
              borderRadius: 8,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Bar 2: Estimated Value */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{estimateLabel}</span>
          <strong style={{ color: 'var(--gold)' }}>≈ {unit}{estimateValue.toLocaleString()}</strong>
        </div>
        <div style={{ width: '100%', height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
          <div
            style={{
              width: `${estimatePct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #7c5cbf, #ffc107)',
              borderRadius: 8,
              transition: 'width 0.6s ease',
            }}
          />
        </div>
      </div>

      {/* Reasonableness Note */}
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8 }}>
        {isExact ? (
          <span style={{ color: 'var(--green-light)' }}>🎯 Exact Match!</span>
        ) : isOver ? (
          <span>Estimate is an <strong>overestimate</strong> by +{unit}{Math.abs(diff)}</span>
        ) : (
          <span>Estimate is an <strong>underestimate</strong> by −{unit}{Math.abs(diff)}</span>
        )}
      </div>
    </div>
  );
}
