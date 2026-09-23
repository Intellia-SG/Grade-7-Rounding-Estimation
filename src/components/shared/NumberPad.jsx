import React from 'react';
import { sounds } from '../../utils/audio';

export default function NumberPad({ onInput, onDelete, onClear, disabled = false, showDecimal = true }) {
  const handleDigit = (digit) => {
    if (disabled) return;
    sounds.click();
    if (onInput) onInput(digit);
  };

  const handleDelete = () => {
    if (disabled) return;
    sounds.click();
    if (onDelete) onDelete();
  };

  const handleClear = () => {
    if (disabled) return;
    sounds.click();
    if (onClear) onClear();
  };

  return (
    <div className="number-pad">
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
        <button
          key={digit}
          type="button"
          className="num-pad-btn"
          disabled={disabled}
          onClick={() => handleDigit(digit)}
        >
          {digit}
        </button>
      ))}
      {showDecimal ? (
        <button
          type="button"
          className="num-pad-btn"
          disabled={disabled}
          onClick={() => handleDigit('.')}
        >
          .
        </button>
      ) : (
        <button
          type="button"
          className="num-pad-btn action-btn"
          disabled={disabled}
          onClick={handleClear}
          title="Clear"
        >
          C
        </button>
      )}
      <button
        type="button"
        className="num-pad-btn"
        disabled={disabled}
        onClick={() => handleDigit('0')}
      >
        0
      </button>
      <button
        type="button"
        className="num-pad-btn action-btn"
        disabled={disabled}
        onClick={handleDelete}
        title="Backspace"
      >
        ⌫
      </button>
    </div>
  );
}
