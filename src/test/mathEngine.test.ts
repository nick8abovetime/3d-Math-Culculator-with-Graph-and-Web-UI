import { describe, it, expect } from 'vitest';
import { evaluateExpression, evaluate2DPoints } from '../utils/mathEngine';

describe('mathEngine', () => {
  describe('evaluateExpression', () => {
    it('should evaluate basic arithmetic', () => {
      expect(evaluateExpression('2 + 2')).toEqual({ result: '4' });
      expect(evaluateExpression('10 - 3')).toEqual({ result: '7' });
      expect(evaluateExpression('4 * 5')).toEqual({ result: '20' });
      expect(evaluateExpression('10 / 2')).toEqual({ result: '5' });
    });

    it('should evaluate trigonometric functions', () => {
      const result = evaluateExpression('sin(0)');
      expect(result.result).toBe('0');
    });

    it('should handle exponents', () => {
      expect(evaluateExpression('2 ^ 3')).toEqual({ result: '8' });
    });

    it('should return error for invalid expressions', () => {
      const result = evaluateExpression('sin(');
      expect(result.error).toBeDefined();
    });
  });

  describe('evaluate2DPoints', () => {
    it('should generate points for sin(x)', () => {
      const points = evaluate2DPoints('sin(x)', -Math.PI, Math.PI, 10);
      expect(points.length).toBe(11);
      expect(points[0].x).toBeCloseTo(-Math.PI);
      expect(points[5].x).toBeCloseTo(0);
    });

    it('should generate points for x^2', () => {
      const points = evaluate2DPoints('x^2', -2, 2, 4);
      expect(points.length).toBe(5);
      expect(points[0].y).toBeCloseTo(4);
      expect(points[2].y).toBeCloseTo(0);
    });
  });
});