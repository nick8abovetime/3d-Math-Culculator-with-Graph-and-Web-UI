import { useState, useCallback } from 'react';
import { MathExpression } from '../types';
import { evaluateExpression } from '../utils/mathEngine';

export function useMath() {
  const [history, setHistory] = useState<MathExpression[]>([]);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluate = useCallback((expression: string) => {
    setError(null);
    
    const result = evaluateExpression(expression);
    
    if (result.error) {
      setError(result.error);
      const newEntry: MathExpression = {
        id: crypto.randomUUID(),
        expression,
        error: result.error,
        timestamp: Date.now(),
      };
      setHistory(prev => [newEntry, ...prev]);
      return;
    }

    setCurrentResult(result.result || null);
    const newEntry: MathExpression = {
      id: crypto.randomUUID(),
      expression,
      result: result.result,
      timestamp: Date.now(),
    };
    setHistory(prev => [newEntry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentResult(null);
    setError(null);
  }, []);

  return {
    history,
    currentResult,
    error,
    evaluate,
    clearHistory,
  };
}