import { create, all, MathJsStatic } from 'mathjs';

const math: MathJsStatic = create(all, {});

export function evaluateExpression(expression: string): { result: string; error?: never } | { result?: never; error: string } {
  try {
    const result = math.evaluate(expression);
    return { result: result.toString() };
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    return { error };
  }
}

export function evaluate2DPoints(expression: string, xMin: number, xMax: number, steps: number = 100): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const stepSize = (xMax - xMin) / steps;

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * stepSize;
    try {
      const scope = { x };
      const y = math.evaluate(expression, scope);
      if (typeof y === 'number' && isFinite(y)) {
        points.push({ x, y });
      }
    } catch {
      // Skip invalid points
    }
  }

  return points;
}

export function evaluate3DSurface(
  expression: string,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  steps: number = 30
): { x: number; y: number; z: number }[] {
  const points: { x: number; y: number; z: number }[] = [];
  const stepX = (xMax - xMin) / steps;
  const stepY = (yMax - yMin) / steps;

  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const x = xMin + i * stepX;
      const y = yMin + j * stepY;
      try {
        const scope = { x, y };
        const z = math.evaluate(expression, scope);
        if (typeof z === 'number' && isFinite(z)) {
          points.push({ x, y, z });
        }
      } catch {
        // Skip invalid points
      }
    }
  }

  return points;
}

export default math;