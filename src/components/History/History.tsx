import { MathExpression } from '../../types';
import './History.css';

interface HistoryProps {
  history: MathExpression[];
  onSelect: (expression: string) => void;
}

export function History({ history, onSelect }: HistoryProps) {
  if (history.length === 0) {
    return (
      <div className="history">
        <h3 className="history-title">History</h3>
        <p className="history-empty">No calculations yet</p>
      </div>
    );
  }

  return (
    <div className="history">
      <h3 className="history-title">History</h3>
      <ul className="history-list">
        {history.map((item) => (
          <li
            key={item.id}
            className={`history-item ${item.error ? 'error' : ''}`}
            onClick={() => onSelect(item.expression)}
          >
            <span className="history-expression">{item.expression}</span>
            <span className="history-result">
              {item.error ? `Error: ${item.error}` : `= ${item.result}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}