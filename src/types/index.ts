export interface MathExpression {
  id: string;
  expression: string;
  result?: string;
  error?: string;
  timestamp: number;
}

export interface ViewportState {
  mode: '2d' | '3d';
}

export type MathError = {
  type: 'syntax' | 'evaluation' | 'unknown';
  message: string;
};