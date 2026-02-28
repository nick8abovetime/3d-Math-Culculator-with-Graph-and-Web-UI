import { useRef, useEffect, useMemo } from 'react';
import { evaluate2DPoints } from '../../utils/mathEngine';
import './Viewport2D.css';

interface Viewport2DProps {
  expression?: string;
}

export function Viewport2D({ expression }: Viewport2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const points = useMemo(() => {
    if (!expression) return [];
    return evaluate2DPoints(expression, -10, 10, 200);
  }, [expression]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 20;

    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let i = 0; i <= width; i += scale) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
    }
    for (let i = 0; i <= height; i += scale) {
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
    }
    ctx.stroke();

    ctx.strokeStyle = '#666';
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    if (points.length > 1) {
      ctx.strokeStyle = '#e94560';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const firstPoint = points[0];
      ctx.moveTo(
        width / 2 + firstPoint.x * scale,
        height / 2 - firstPoint.y * scale
      );

      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        ctx.lineTo(
          width / 2 + point.x * scale,
          height / 2 - point.y * scale
        );
      }
      ctx.stroke();
    }
  }, [points]);

  return (
    <div className="viewport2d">
      <canvas ref={canvasRef} width={600} height={400} />
      {!expression && (
        <div className="viewport-placeholder">
          Enter an expression to visualize
        </div>
      )}
    </div>
  );
}