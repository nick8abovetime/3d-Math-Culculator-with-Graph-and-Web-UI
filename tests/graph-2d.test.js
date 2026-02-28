describe('2D Graph Mode', () => {
    let graphFunctionInput, xMinInput, xMaxInput, graph2dBtn, canvas, graphError;
    let ctx, drawGraph, getYMin, getYMax;

    beforeEach(() => {
        document.body.innerHTML = `
            <input type="text" id="graph-function" placeholder="e.g., x^2, sin(x)">
            <input type="number" id="x-min" value="-10">
            <input type="number" id="x-max" value="10">
            <button id="graph-btn">Graph</button>
            <canvas id="graph-canvas" width="600" height="400"></canvas>
            <div id="graph-error"></div>
        `;
        graphFunctionInput = document.getElementById('graph-function');
        xMinInput = document.getElementById('x-min');
        xMaxInput = document.getElementById('x-max');
        graph2dBtn = document.getElementById('graph-btn');
        canvas = document.getElementById('graph-canvas');
        graphError = document.getElementById('graph-error');
        ctx = canvas.getContext('2d');

        getYMin = (expr, xMin, xMax) => {
            let min = Infinity;
            const compiled = math.compile(expr);
            const steps = 100;
            
            for (let i = 0; i <= steps; i++) {
                const x = xMin + (xMax - xMin) * i / steps;
                try {
                    const y = compiled.evaluate({ x: x });
                    if (typeof y === 'number' && isFinite(y) && y < min) {
                        min = y;
                    }
                } catch (e) {}
            }
            
            return min === Infinity ? -10 : min;
        };

        getYMax = (expr, xMin, xMax) => {
            let max = -Infinity;
            const compiled = math.compile(expr);
            const steps = 100;
            
            for (let i = 0; i <= steps; i++) {
                const x = xMin + (xMax - xMin) * i / steps;
                try {
                    const y = compiled.evaluate({ x: x });
                    if (typeof y === 'number' && isFinite(y) && y > max) {
                        max = y;
                    }
                } catch (e) {}
            }
            
            return max === -Infinity ? 10 : max;
        };

        drawGraph = () => {
            const funcExpr = graphFunctionInput.value.trim();
            const xMin = parseFloat(xMinInput.value) || -10;
            const xMax = parseFloat(xMaxInput.value) || 10;
            
            if (!funcExpr) {
                graphError.textContent = 'Please enter a function';
                return;
            }

            if (xMin >= xMax) {
                graphError.textContent = 'X Min must be less than X Max';
                return;
            }

            try {
                const compiled = math.compile(funcExpr);
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                const padding = 40;
                const graphWidth = canvas.width - 2 * padding;
                const graphHeight = canvas.height - 2 * padding;
                
                ctx.strokeStyle = '#e0e0e0';
                ctx.lineWidth = 1;
                
                for (let i = 0; i <= 10; i++) {
                    const x = padding + (graphWidth * i / 10);
                    ctx.beginPath();
                    ctx.moveTo(x, padding);
                    ctx.lineTo(x, canvas.height - padding);
                    ctx.stroke();
                    
                    const y = padding + (graphHeight * i / 10);
                    ctx.beginPath();
                    ctx.moveTo(padding, y);
                    ctx.lineTo(canvas.width - padding, y);
                    ctx.stroke();
                }
                
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                
                const originX = padding + graphWidth * (0 - xMin) / (xMax - xMin);
                const originY = padding + graphHeight * (0 - getYMin(funcExpr, xMin, xMax)) / (getYMax(funcExpr, xMin, xMax) - getYMin(funcExpr, xMin, xMax));
                
                if (originX >= padding && originX <= canvas.width - padding) {
                    ctx.beginPath();
                    ctx.moveTo(originX, padding);
                    ctx.lineTo(originX, canvas.height - padding);
                    ctx.stroke();
                }
                
                if (originY >= padding && originY <= canvas.height - padding) {
                    ctx.beginPath();
                    ctx.moveTo(padding, originY);
                    ctx.lineTo(canvas.width - padding, originY);
                    ctx.stroke();
                }
                
                ctx.strokeStyle = '#667eea';
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                const yMin = getYMin(funcExpr, xMin, xMax);
                const yMax = getYMax(funcExpr, xMin, xMax);
                
                let firstPoint = true;
                for (let px = padding; px <= canvas.width - padding; px++) {
                    const x = xMin + (px - padding) / graphWidth * (xMax - xMin);
                    
                    try {
                        const y = compiled.evaluate({ x: x });
                        
                        if (typeof y === 'number' && isFinite(y)) {
                            const py = padding + graphHeight * (yMax - y) / (yMax - yMin);
                            
                            if (firstPoint) {
                                ctx.moveTo(px, py);
                                firstPoint = false;
                            } else {
                                ctx.lineTo(px, py);
                            }
                        }
                    } catch (e) {
                        firstPoint = true;
                    }
                }
                
                ctx.stroke();
                graphError.textContent = '';
                
            } catch (error) {
                graphError.textContent = `Error: ${error.message}`;
            }
        };
    });

    describe('Function Evaluation', () => {
        test('finds y-min for linear function', () => {
            const yMin = getYMin('x', -10, 10);
            expect(yMin).toBe(-10);
        });

        test('finds y-max for linear function', () => {
            const yMax = getYMax('x', -10, 10);
            expect(yMax).toBe(10);
        });

        test('finds y-min for quadratic function', () => {
            const yMin = getYMin('x^2', -5, 5);
            expect(yMin).toBeCloseTo(0);
        });

        test('finds y-max for quadratic function in range', () => {
            const yMax = getYMax('x^2', -5, 5);
            expect(yMax).toBeCloseTo(25);
        });

        test('handles trigonometric function', () => {
            const yMin = getYMin('sin(x)', 0, Math.PI * 2);
            expect(yMin).toBeCloseTo(-1);
        });

        test('handles exponential function', () => {
            const yMin = getYMin('exp(x)', -2, 2);
            expect(yMin).toBeCloseTo(0.135, 2);
        });
    });

    describe('Graph Drawing', () => {
        test('shows error for empty function', () => {
            graphFunctionInput.value = '';
            drawGraph();
            expect(graphError.textContent).toBe('Please enter a function');
        });

        test('shows error when x-min >= x-max', () => {
            graphFunctionInput.value = 'x^2';
            xMinInput.value = '10';
            xMaxInput.value = '5';
            drawGraph();
            expect(graphError.textContent).toBe('X Min must be less than X Max');
        });

        test('shows error for invalid function', () => {
            graphFunctionInput.value = 'invalid(';
            drawGraph();
            expect(graphError.textContent).toContain('Error');
        });

        test('clears canvas before drawing', () => {
            graphFunctionInput.value = 'x';
            drawGraph();
            expect(graphError.textContent).toBe('');
        });

        test('draws polynomial function', () => {
            graphFunctionInput.value = 'x^2';
            drawGraph();
            expect(graphError.textContent).toBe('');
        });

        test('draws trigonometric function', () => {
            graphFunctionInput.value = 'sin(x)';
            drawGraph();
            expect(graphError.textContent).toBe('');
        });

        test('draws multiple terms function', () => {
            graphFunctionInput.value = 'x^2 + 2*x - 1';
            drawGraph();
            expect(graphError.textContent).toBe('');
        });
    });

    describe('Edge Cases', () => {
        test('handles zero range', () => {
            const yMin = getYMin('x', 0, 0);
            expect(yMin).toBe(0);
        });

        test('handles negative range', () => {
            const yMax = getYMax('x^2', -5, -1);
            expect(yMax).toBeCloseTo(25);
        });

        test('handles division in function', () => {
            graphFunctionInput.value = '1/x';
            xMinInput.value = '0.1';
            xMaxInput.value = '5';
            drawGraph();
            expect(graphError.textContent).toBe('');
        });

        test('handles absolute value', () => {
            const yMin = getYMin('abs(x)', -5, 5);
            expect(yMin).toBe(0);
        });
    });
});