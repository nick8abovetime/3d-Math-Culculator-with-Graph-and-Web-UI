import { useState, KeyboardEvent } from 'react';
import './MathInput.css';

interface MathInputProps {
  onCalculate: (expression: string) => void;
  error?: string | null;
  result?: string | null;
}

export function MathInput({ onCalculate, error, result }: MathInputProps) {
  const [expression, setExpression] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && expression.trim()) {
      onCalculate(expression.trim());
    }
  };

  const handleSubmit = () => {
    if (expression.trim()) {
      onCalculate(expression.trim());
    }
  };

  return (
    <div className="math-input">
      <div className="input-row">
        <span className="function-label">f(x) = </span>
        <input
          type="text"
          className="expression-input"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter expression (e.g., sin(x), x^2)"
        />
        <button className="calculate-btn" onClick={handleSubmit}>
          Calculate
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {result && !error && <div className="result-display">= {result}</div>}
    </div>
  );
}