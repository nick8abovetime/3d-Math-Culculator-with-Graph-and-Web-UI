import { MathExpression } from '../../types';
import { MathInput } from '../MathInput/MathInput';
import { History } from '../History/History';
import './InputPanel.css';

interface InputPanelProps {
  onCalculate: (expression: string) => void;
  history: MathExpression[];
  error?: string | null;
  result?: string | null;
}

export function InputPanel({ onCalculate, history, error, result }: InputPanelProps) {
  return (
    <div className="input-panel">
      <MathInput onCalculate={onCalculate} error={error} result={result} />
      <History history={history} onSelect={onCalculate} />
    </div>
  );
}