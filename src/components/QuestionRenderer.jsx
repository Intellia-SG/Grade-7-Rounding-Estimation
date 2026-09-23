import React, { useState, useCallback } from 'react';
import NumberLine from './shared/NumberLine';
import EstimateCompareBar from './shared/EstimateCompareBar';
import { getBenchmarkTicks } from '../utils/roundingMath';

function QuestionVisual({ question }) {
  if (!question.visual) return null;

  if (question.visual === 'numberLine' && question.exactValue !== undefined) {
    const val = question.exactValue;
    const place = question.place || 'ten';
    const ticks = getBenchmarkTicks(val, place, 5);
    const min = ticks[0];
    const max = ticks[ticks.length - 1];

    return (
      <div style={{ margin: '16px 0' }}>
        <NumberLine
          min={min}
          max={max}
          target={val}
          place={place}
          ticks={ticks}
          interactive={false}
          showDistances={true}
        />
      </div>
    );
  }

  if (question.visual === 'compareBar' && (question.operandA || question.operandB || question.characterName)) {
    return (
      <div style={{ margin: '16px 0' }}>
        <EstimateCompareBar
          exactLabel="Exact Amount"
          exactValue={question.operandA && question.operandB ? Number((question.operandA + question.operandB).toFixed(2)) : 25}
          estimateLabel="Estimated Value"
          estimateValue={question.operandA && question.operandB ? Math.round(question.operandA + question.operandB) : 25}
          unit={typeof question.correctAnswer === 'string' && question.correctAnswer.startsWith('$') ? '$' : ''}
        />
      </div>
    );
  }

  if (question.visual === 'sentence' && question.operandA !== undefined && question.operandB !== undefined) {
    const opSym = question.operation === 'multiply' ? '×' : question.operation === 'divide' ? '÷' : question.operation === 'subtract' ? '−' : '+';
    return (
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: '16px 24px',
        margin: '16px auto',
        maxWidth: 400,
        fontFamily: 'var(--font-display)',
        fontSize: '1.8rem',
        fontWeight: 700,
        color: 'var(--gold)',
      }}>
        {question.operandA} {opSym} {question.operandB} ≈ ?
      </div>
    );
  }

  return null;
}

export default function QuestionRenderer({
  question,
  onAnswer,
  disabled = false,
  attempt = 1,
  worldName = 'Estimation Arena',
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const handleOptionClick = useCallback((option) => {
    if (disabled) return;
    setSelectedOption(option);
    const isCorrect = String(option).trim() === String(question.correctAnswer).trim();
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
    }, 600);
  }, [disabled, question.correctAnswer, onAnswer]);

  return (
    <div>
      {/* Category / World Badge */}
      <div style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, var(--blue-mid), var(--purple-mid))',
        color: 'white',
        padding: '4px 16px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 700,
        marginBottom: 12,
        letterSpacing: '0.5px',
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        🌍 {worldName}
      </div>

      <p className="question-text">{question.questionText}</p>

      {/* Visual Diagram */}
      <QuestionVisual question={question} />

      {/* Options Grid */}
      {question.options && (
        <div className={`options-grid ${question.options.length === 2 ? 'true-false-grid' : ''}`}>
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt).trim() === String(question.correctAnswer).trim() ? ' correct' : ' wrong';
            } else if (disabled && String(opt).trim() === String(question.correctAnswer).trim()) {
              cls += ' correct';
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleOptionClick(opt)}
                disabled={disabled}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* Hint toggle & display */}
      {attempt >= 2 && question.hint1 && (
        <div style={{ marginTop: 12 }}>
          <button
            type="button"
            className="skip-link"
            onClick={() => setShowHint(!showHint)}
            style={{ color: 'var(--gold)', fontSize: '0.85rem' }}
          >
            💡 {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          {showHint && (
            <div className="hint-text">
              <span>💡 {attempt === 2 ? question.hint1 : question.hint2 || question.hint1}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
