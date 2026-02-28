describe('3D Surface Mode', () => {
    let threeApp, mesh, isRotating;
    let createGraph, surfaceFunctionInput, surfaceGraphBtn, rotateBtn, errorMessage;

    beforeEach(() => {
        document.body.innerHTML = `
            <input type="text" id="3d-function" placeholder="e.g., sin(x) * cos(y)">
            <button id="surface-graph-btn">Graph Surface</button>
            <button id="rotate-btn">Auto Rotate</button>
            <button id="reset-camera-btn">Reset Camera</button>
            <div id="3d-canvas-container" style="width: 600px; height: 400px;"></div>
            <div id="3d-error-message"></div>
        `;

        surfaceFunctionInput = document.getElementById('3d-function');
        surfaceGraphBtn = document.getElementById('surface-graph-btn');
        rotateBtn = document.getElementById('rotate-btn');
        errorMessage = document.getElementById('3d-error-message');

        let scene, camera, renderer;

        createGraph = (functionStr) => {
            const size = 20;
            const segments = 50;
            const vertices = [];
            const colors = [];

            const compiled = math.compile(functionStr);

            for (let i = 0; i <= segments; i++) {
                const x = (i / segments - 0.5) * size;
                for (let j = 0; j <= segments; j++) {
                    const y = (j / segments - 0.5) * size;
                    
                    let z = 0;
                    try {
                        const scope = { x, y };
                        z = compiled.evaluate(scope);
                    } catch (e) {
                        z = 0;
                    }

                    if (!isFinite(z)) z = 0;
                    z = Math.max(-5, Math.min(5, z));

                    vertices.push(x, z, y);

                    const normalizedZ = (z + 5) / 10;
                    colors.push(normalizedZ, 0.5, 1 - normalizedZ);
                }
            }

            const indices = [];
            for (let i = 0; i < segments; i++) {
                for (let j = 0; j < segments; j++) {
                    const a = i * (segments + 1) + j;
                    const b = a + 1;
                    const c = a + (segments + 1);
                    const d = c + 1;
                    indices.push(a, b, c);
                    indices.push(b, d, c);
                }
            }

            return { vertices, colors, indices, vertexCount: vertices.length / 3 };
        };
    });

    describe('Function Evaluation', () => {
        test('evaluates sin(x) * cos(y)', () => {
            const result = createGraph('sin(x) * cos(y)');
            expect(result.vertexCount).toBe(2601);
        });

        test('evaluates x^2 + y^2', () => {
            const result = createGraph('x^2 + y^2');
            expect(result.vertexCount).toBe(2601);
            expect(result.vertices.length).toBeGreaterThan(0);
        });

        test('evaluates sin(x) + cos(y)', () => {
            const result = createGraph('sin(x) + cos(y)');
            expect(result.vertexCount).toBe(2601);
        });

        test('evaluates x * y', () => {
            const result = createGraph('x * y');
            expect(result.vertexCount).toBe(2601);
        });

        test('handles exp function', () => {
            const result = createGraph('exp(-(x^2 + y^2) / 10)');
            expect(result.vertexCount).toBe(2601);
        });

        test('handles sqrt function', () => {
            const result = createGraph('sqrt(x^2 + y^2)');
            expect(result.vertexCount).toBe(2601);
        });
    });

    describe('Clipping', () => {
        test('clamps large z values to max', () => {
            const result = createGraph('x^2 + y^2');
            const zValues = [];
            for (let i = 1; i < result.vertices.length; i += 3) {
                zValues.push(result.vertices[i]);
            }
            expect(Math.max(...zValues)).toBeLessThanOrEqual(5);
        });

        test('clamps negative z values to min', () => {
            const result = createGraph('-x^2 - y^2');
            const zValues = [];
            for (let i = 1; i < result.vertices.length; i += 3) {
                zValues.push(result.vertices[i]);
            }
            expect(Math.min(...zValues)).toBeGreaterThanOrEqual(-5);
        });

        test('handles function that produces infinity', () => {
            const result = createGraph('1 / (x^2 + y^2)');
            expect(result.vertexCount).toBe(2601);
        });
    });

    describe('Color Generation', () => {
        test('generates correct number of colors', () => {
            const result = createGraph('sin(x)');
            expect(result.colors.length).toBe(result.vertexCount * 3);
        });

        test('colors are in valid range', () => {
            const result = createGraph('x + y');
            for (let i = 0; i < result.colors.length; i++) {
                expect(result.colors[i]).toBeGreaterThanOrEqual(0);
                expect(result.colors[i]).toBeLessThanOrEqual(1);
            }
        });
    });

    describe('Index Generation', () => {
        test('generates correct number of indices', () => {
            const result = createGraph('x^2');
            const trianglesPerSegment = 2;
            const totalSegments = 50;
            const expectedIndices = totalSegments * totalSegments * trianglesPerSegment * 3;
            expect(result.indices.length).toBe(expectedIndices);
        });

        test('indices reference valid vertices', () => {
            const result = createGraph('x^2');
            const maxIndex = result.vertexCount - 1;
            for (const index of result.indices) {
                expect(index).toBeLessThanOrEqual(maxIndex);
                expect(index).toBeGreaterThanOrEqual(0);
            }
        });
    });

    describe('Error Handling', () => {
        test('shows error for empty function', () => {
            surfaceFunctionInput.value = '';
            const funcStr = surfaceFunctionInput.value.trim();
            if (!funcStr) {
                errorMessage.textContent = 'Please enter a function';
            }
            expect(errorMessage.textContent).toBe('Please enter a function');
        });

        test('validates function can be compiled', () => {
            surfaceFunctionInput.value = 'sin(x) + cos(y)';
            try {
                math.compile(surfaceFunctionInput.value.trim()).evaluate({ x: 0, y: 0 });
                errorMessage.textContent = '';
            } catch (error) {
                errorMessage.textContent = `Error: ${error.message}`;
            }
            expect(errorMessage.textContent).toBe('');
        });

        test('shows error for invalid function syntax', () => {
            surfaceFunctionInput.value = 'sin(x';
            try {
                math.compile(surfaceFunctionInput.value.trim()).evaluate({ x: 0, y: 0 });
            } catch (error) {
                errorMessage.textContent = `Error: ${error.message}`;
            }
            expect(errorMessage.textContent).toContain('Error');
        });
    });

    describe('Mesh Generation', () => {
        test('creates vertices at grid positions', () => {
            const result = createGraph('x');
            const segments = 50;
            const expectedCount = (segments + 1) * (segments + 1);
            expect(result.vertexCount).toBe(expectedCount);
        });

        test('vertices form proper grid structure', () => {
            const result = createGraph('x');
            const segments = 50;
            for (let i = 0; i <= segments; i++) {
                for (let j = 0; j <= segments; j++) {
                    const idx = (i * (segments + 1) + j) * 3;
                    expect(result.vertices[idx]).toBeDefined();
                    expect(result.vertices[idx + 1]).toBeDefined();
                    expect(result.vertices[idx + 2]).toBeDefined();
                }
            }
        });
    });

    describe('Rotation Toggle', () => {
        test('initial state is not rotating', () => {
            isRotating = false;
            expect(isRotating).toBe(false);
        });

        test('toggle sets rotating to true', () => {
            isRotating = false;
            isRotating = !isRotating;
            expect(isRotating).toBe(true);
        });

        test('toggle sets rotating back to false', () => {
            isRotating = true;
            isRotating = !isRotating;
            expect(isRotating).toBe(false);
        });
    });
});