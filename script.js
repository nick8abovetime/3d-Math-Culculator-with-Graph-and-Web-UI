document.addEventListener('DOMContentLoaded', () => {
    const expressionInput = document.getElementById('expression');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultOutput = document.getElementById('result-output');
    const errorMessage = document.getElementById('error-message');
    const modeTabs = document.querySelectorAll('.mode-tab');
    const expressionMode = document.querySelector('.expression-mode');
    const vectorMode = document.querySelector('.vector-mode');
    const graphMode = document.querySelector('.graph-mode');
    const surfaceMode = document.querySelector('.surface-mode');
    const visualizeMode = document.querySelector('.visualize-mode');
    const intentMode = document.querySelector('.intent-mode');
    const chatMode = document.querySelector('.chat-mode');

    let currentMode = 'expression';
    let chatClient = null;
    let chatMessages = [];

    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMode = tab.dataset.mode;
            
            expressionMode.style.display = 'none';
            vectorMode.style.display = 'none';
            graphMode.style.display = 'none';
            surfaceMode.style.display = 'none';
            document.querySelector('.matrix-mode').style.display = 'none';
            visualizeMode.style.display = 'none';
            intentMode.style.display = 'none';
            
            if (currentMode === 'expression') {
                expressionMode.style.display = 'flex';
            } else if (currentMode === 'vector') {
                vectorMode.style.display = 'block';
            } else if (currentMode === 'graph') {
                graphMode.style.display = 'block';
            } else if (currentMode === 'surface') {
                surfaceMode.style.display = 'block';
                if (!threeApp) initThreeJS();
            } else if (currentMode === 'visualize') {
                visualizeMode.style.display = 'block';
                drawVisualization();
            } else if (currentMode === 'matrix') {
                document.querySelector('.matrix-mode').style.display = 'block';
                initMatrixInputs();
            } else if (currentMode === 'intent') {
                intentMode.style.display = 'block';
            } else if (currentMode === 'chat') {
                chatMode.style.display = 'block';
            }
            resultOutput.textContent = '-';
            errorMessage.textContent = '';
        });
    });

    function calculate() {
        if (currentMode === 'expression') {
            calculateExpression();
        } else if (currentMode === 'vector') {
            calculateVector();
        } else if (currentMode === 'graph') {
            drawGraph();
        } else if (currentMode === 'intent') {
            calculateIntent();
        }
    }

    function calculateExpression() {
        const expression = expressionInput.value.trim();
        
        if (!expression) {
            resultOutput.textContent = '-';
            errorMessage.textContent = 'Please enter an expression';
            return;
        }

        try {
            const result = math.evaluate(expression);
            const formatted = typeof result === 'number' ? result : 
                             result.valueOf ? result.valueOf() : result;
            resultOutput.textContent = formatted;
            errorMessage.textContent = '';
        } catch (error) {
            resultOutput.textContent = '-';
            errorMessage.textContent = `Error: ${error.message}`;
        }
    }

    function calculateVector() {
        const ax = parseFloat(document.getElementById('vec-a-x').value) || 0;
        const ay = parseFloat(document.getElementById('vec-a-y').value) || 0;
        const az = parseFloat(document.getElementById('vec-a-z').value) || 0;
        const bx = parseFloat(document.getElementById('vec-b-x').value) || 0;
        const by = parseFloat(document.getElementById('vec-b-y').value) || 0;
        const bz = parseFloat(document.getElementById('vec-b-z').value) || 0;
        
        const operation = document.getElementById('vector-operation').value;
        
        const vecA = { x: ax, y: ay, z: az };
        const vecB = { x: bx, y: by, z: bz };
        
        try {
            let result;
            
            switch (operation) {
                case 'add':
                    result = {
                        x: vecA.x + vecB.x,
                        y: vecA.y + vecB.y,
                        z: vecA.z + vecB.z
                    };
                    resultOutput.textContent = `(${result.x}, ${result.y}, ${result.z})`;
                    break;
                    
                case 'subtract':
                    result = {
                        x: vecA.x - vecB.x,
                        y: vecA.y - vecB.y,
                        z: vecA.z - vecB.z
                    };
                    resultOutput.textContent = `(${result.x}, ${result.y}, ${result.z})`;
                    break;
                    
                case 'dot':
                    result = vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
                    resultOutput.textContent = result.toFixed(4);
                    break;
                    
                case 'cross':
                    result = {
                        x: vecA.y * vecB.z - vecA.z * vecB.y,
                        y: vecA.z * vecB.x - vecA.x * vecB.z,
                        z: vecA.x * vecB.y - vecA.y * vecB.x
                    };
                    resultOutput.textContent = `(${result.x}, ${result.y}, ${result.z})`;
                    break;
                    
                case 'magnitude':
                    result = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z);
                    resultOutput.textContent = result.toFixed(4);
                    break;
                    
                case 'normalize':
                    const mag = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z);
                    if (mag === 0) {
                        resultOutput.textContent = '(0, 0, 0)';
                    } else {
                        result = {
                            x: vecA.x / mag,
                            y: vecA.y / mag,
                            z: vecA.z / mag
                        };
                        resultOutput.textContent = `(${result.x.toFixed(4)}, ${result.y.toFixed(4)}, ${result.z.toFixed(4)})`;
                    }
                    break;
                    
                case 'distance':
                    const dx = vecA.x - vecB.x;
                    const dy = vecA.y - vecB.y;
                    const dz = vecA.z - vecB.z;
                    result = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    resultOutput.textContent = result.toFixed(4);
                    break;
                    
                case 'angle':
                    const dot = vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
                    const magA = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z);
                    const magB = Math.sqrt(vecB.x * vecB.x + vecB.y * vecB.y + vecB.z * vecB.z);
                    if (magA === 0 || magB === 0) {
                        resultOutput.textContent = 'undefined (zero vector)';
                    } else {
                        const cosAngle = Math.max(-1, Math.min(1, dot / (magA * magB)));
                        result = Math.acos(cosAngle) * (180 / Math.PI);
                        resultOutput.textContent = result.toFixed(2) + '°';
                    }
                    break;
            }
            errorMessage.textContent = '';
        } catch (error) {
            resultOutput.textContent = '-';
            errorMessage.textContent = `Error: ${error.message}`;
        }
    }

    function calculateIntent() {
        const intentInput = document.getElementById('intent-input');
        const expression = intentInput.value.trim();
        
        if (!expression) {
            resultOutput.textContent = '-';
            errorMessage.textContent = 'Please enter an intent';
            return;
        }

        try {
            const intent = IntentParser.parse(expression);
            const result = IntentParser.execute(intent);

            if (result.error) {
                resultOutput.textContent = '-';
                errorMessage.textContent = `Error: ${result.error}`;
                return;
            }

            if (result.action === 'switch_mode') {
                if (result.mode === 'graph') {
                    document.getElementById('graph-function').value = result.params.function;
                    document.getElementById('x-min').value = result.params.xMin;
                    document.getElementById('x-max').value = result.params.xMax;
                    
                    modeTabs.forEach(t => t.classList.remove('active'));
                    document.querySelector('[data-mode="graph"]').classList.add('active');
                    currentMode = 'graph';
                    expressionMode.style.display = 'none';
                    vectorMode.style.display = 'none';
                    graphMode.style.display = 'block';
                    surfaceMode.style.display = 'none';
                    visualizeMode.style.display = 'none';
                    document.querySelector('.matrix-mode').style.display = 'none';
                    intentMode.style.display = 'none';
                    
                    drawGraph();
                    resultOutput.textContent = 'Switched to graph mode';
                    errorMessage.textContent = '';
                } else if (result.mode === 'surface') {
                    document.getElementById('3d-function').value = result.params.function;
                    
                    modeTabs.forEach(t => t.classList.remove('active'));
                    document.querySelector('[data-mode="surface"]').classList.add('active');
                    currentMode = 'surface';
                    expressionMode.style.display = 'none';
                    vectorMode.style.display = 'none';
                    graphMode.style.display = 'none';
                    surfaceMode.style.display = 'block';
                    visualizeMode.style.display = 'none';
                    document.querySelector('.matrix-mode').style.display = 'none';
                    intentMode.style.display = 'none';
                    
                    if (!threeApp) initThreeJS();
                    document.getElementById('surface-graph-btn').click();
                    resultOutput.textContent = 'Switched to surface mode';
                    errorMessage.textContent = '';
                }
            } else if (result.action === 'result') {
                if (typeof result.result === 'string' && result.result.includes('<table>')) {
                    resultOutput.innerHTML = result.result;
                } else {
                    resultOutput.textContent = result.result;
                }
                errorMessage.textContent = '';
            }
        } catch (error) {
            resultOutput.textContent = '-';
            errorMessage.textContent = `Error: ${error.message}`;
        }
    }

    calculateBtn.addEventListener('click', calculate);

    expressionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });

    const intentInput = document.getElementById('intent-input');
    intentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });

    expressionInput.focus();

    const matrixSizeSelect = document.getElementById('matrix-size');
    const matrixAInputs = document.getElementById('matrix-a-inputs');
    const matrixBInputs = document.getElementById('matrix-b-inputs');
    const matrixOperationSelect = document.getElementById('matrix-operation');
    const scaleInputGroup = document.getElementById('scale-input-group');

    function initMatrixInputs() {
        const size = parseInt(matrixSizeSelect.value);
        renderMatrixInputs(matrixAInputs, size, 'a');
        renderMatrixInputs(matrixBInputs, size, 'b');
    }

    function renderMatrixInputs(container, size, prefix) {
        container.innerHTML = '';
        for (let i = 0; i < size; i++) {
            const row = document.createElement('div');
            row.className = 'matrix-row';
            for (let j = 0; j < size; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.placeholder = '0';
                input.step = 'any';
                input.id = `mat-${prefix}-${i}-${j}`;
                row.appendChild(input);
            }
            container.appendChild(row);
        }
    }

    function getMatrixValues(container, size) {
        const matrix = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                const input = document.getElementById(`mat-${container}-${i}-${j}`);
                row.push(parseFloat(input.value) || 0);
            }
            matrix.push(row);
        }
        return matrix;
    }

    function calculateMatrix() {
        const size = parseInt(matrixSizeSelect.value);
        const operation = matrixOperationSelect.value;
        
        const matA = getMatrixValues('a', size);
        let matB = null;
        if (operation !== 'determinant' && operation !== 'transpose' && operation !== 'inverse' && operation !== 'scale') {
            matB = getMatrixValues('b', size);
        }

        try {
            let result;
            
            switch (operation) {
                case 'add':
                    result = addMatrices(matA, matB);
                    resultOutput.innerHTML = formatMatrixResult(result);
                    break;
                    
                case 'subtract':
                    result = subtractMatrices(matA, matB);
                    resultOutput.innerHTML = formatMatrixResult(result);
                    break;
                    
                case 'multiply':
                    result = multiplyMatrices(matA, matB);
                    resultOutput.innerHTML = formatMatrixResult(result);
                    break;
                    
                case 'determinant':
                    const det = determinant(matA);
                    resultOutput.textContent = det.toFixed(4);
                    break;
                    
                case 'transpose':
                    result = transpose(matA);
                    resultOutput.innerHTML = formatMatrixResult(result);
                    break;
                    
                case 'inverse':
                    result = inverse(matA);
                    if (result) {
                        resultOutput.innerHTML = formatMatrixResult(result);
                    } else {
                        resultOutput.textContent = 'undefined (singular matrix)';
                    }
                    break;
                    
                case 'scale':
                    const scalar = parseFloat(document.getElementById('scalar-value').value) || 1;
                    result = scaleMatrix(matA, scalar);
                    resultOutput.innerHTML = formatMatrixResult(result);
                    break;
            }
            errorMessage.textContent = '';
        } catch (error) {
            resultOutput.textContent = '-';
            errorMessage.textContent = `Error: ${error.message}`;
        }
    }

    function addMatrices(a, b) {
        return a.map((row, i) => row.map((val, j) => val + b[i][j]));
    }

    function subtractMatrices(a, b) {
        return a.map((row, i) => row.map((val, j) => val - b[i][j]));
    }

    function multiplyMatrices(a, b) {
        const size = a.length;
        const result = [];
        for (let i = 0; i < size; i++) {
            result[i] = [];
            for (let j = 0; j < size; j++) {
                let sum = 0;
                for (let k = 0; k < size; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    function determinant(m) {
        const n = m.length;
        if (n === 1) return m[0][0];
        if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
        
        let det = 0;
        for (let j = 0; j < n; j++) {
            const submatrix = m.slice(1).map(row => row.filter((_, colIdx) => colIdx !== j));
            det += Math.pow(-1, j) * m[0][j] * determinant(submatrix);
        }
        return det;
    }

    function transpose(m) {
        return m[0].map((_, j) => m.map(row => row[j]));
    }

    function inverse(m) {
        const det = determinant(m);
        if (Math.abs(det) < 1e-10) return null;
        
        const n = m.length;
        if (n === 1) return [[1 / m[0][0]]];
        if (n === 2) {
            const [[a, b], [c, d]] = m;
            const invDet = 1 / (a * d - b * c);
            return [[d * invDet, -b * invDet], [-c * invDet, a * invDet]];
        }
        
        const adj = adjoint(m);
        return adj.map(row => row.map(val => val / det));
    }

    function adjoint(m) {
        const n = m.length;
        if (n === 1) return [[1]];
        
        const cofactorMatrix = [];
        for (let i = 0; i < n; i++) {
            cofactorMatrix[i] = [];
            for (let j = 0; j < n; j++) {
                const submatrix = m.filter((_, rowIdx) => rowIdx !== i)
                    .map(row => row.filter((_, colIdx) => colIdx !== j));
                cofactorMatrix[i][j] = Math.pow(-1, i + j) * determinant(submatrix);
            }
        }
        return transpose(cofactorMatrix);
    }

    function scaleMatrix(m, scalar) {
        return m.map(row => row.map(val => val * scalar));
    }

    function formatMatrixResult(m) {
        let html = '<div class="matrix-result"><table>';
        m.forEach(row => {
            html += '<tr>';
            row.forEach(val => {
                html += `<td>${typeof val === 'number' ? val.toFixed(4) : val}</td>`;
            });
            html += '</tr>';
        });
        html += '</table></div>';
        return html;
    }

    matrixSizeSelect.addEventListener('change', initMatrixInputs);
    
    matrixOperationSelect.addEventListener('change', () => {
        const op = matrixOperationSelect.value;
        scaleInputGroup.style.display = op === 'scale' ? 'flex' : 'none';
    });

    document.getElementById('calculate-btn').addEventListener('click', () => {
        if (currentMode === 'matrix') {
            calculateMatrix();
        } else {
            calculate();
        }
    });

    const graphFunctionInput = document.getElementById('graph-function');
    const xMinInput = document.getElementById('x-min');
    const xMaxInput = document.getElementById('x-max');
    const canvas = document.getElementById('graph-canvas');
    const graphError = document.getElementById('graph-error');
    const ctx = canvas.getContext('2d');

    function drawGraph() {
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
            compiled.evaluate({ x: 0 });
            
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
    }

    function getYMin(expr, xMin, xMax) {
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
    }

    function getYMax(expr, xMin, xMax) {
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
    }

    graphFunctionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            drawGraph();
        }
    });
    
    xMinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            drawGraph();
        }
    });
    
    xMaxInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            drawGraph();
        }
    });

    let threeApp = null;

    function initThreeJS() {
        const container = document.getElementById('3d-canvas-container');
        const surfaceGraphBtn = document.getElementById('surface-graph-btn');
        const refreshSurfaceBtn = document.getElementById('refresh-surface-btn');
        const rotateBtn = document.getElementById('rotate-btn');
        const resetCameraBtn = document.getElementById('reset-camera-btn');
        const errorMessage = document.getElementById('3d-error-message');
        
        let currentSurfaceFunction = null;

        const width = container.clientWidth || 718;
        const height = container.clientHeight || 400;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-5, 8, 5);
        scene.add(pointLight);
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

        let mesh = null;
        let isRotating = false;

        function createGraph(functionStr) {
            if (mesh) {
                scene.remove(mesh);
                mesh.geometry.dispose();
                mesh.material.dispose();
            }

            const size = 20;
            const segments = 50;
            const geometry = new THREE.BufferGeometry();
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

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.setIndex(indices);

            const material = new THREE.MeshPhongMaterial({ 
                vertexColors: true,
                side: THREE.DoubleSide,
                flatShading: false,
                shininess: 80,
                specular: 0x444444
            });

            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        }

        surfaceGraphBtn.addEventListener('click', () => {
            const funcStr = document.getElementById('3d-function').value.trim();
            if (!funcStr) {
                errorMessage.textContent = 'Please enter a function';
                return;
            }
            try {
                math.compile(funcStr).evaluate({ x: 0, y: 0 });
                currentSurfaceFunction = funcStr;
                createGraph(funcStr);
                errorMessage.textContent = '';
            } catch (error) {
                errorMessage.textContent = `Error: ${error.message}`;
            }
        });

        refreshSurfaceBtn.addEventListener('click', () => {
            if (!currentSurfaceFunction) {
                errorMessage.textContent = 'No surface to refresh. Generate a surface first.';
                return;
            }
            try {
                createGraph(currentSurfaceFunction);
                errorMessage.textContent = '';
            } catch (error) {
                errorMessage.textContent = `Error: ${error.message}`;
            }
        });

        rotateBtn.addEventListener('click', () => {
            isRotating = !isRotating;
            rotateBtn.textContent = isRotating ? 'Stop Rotation' : 'Auto Rotate';
        });

        resetCameraBtn.addEventListener('click', () => {
            camera.position.set(5, 5, 5);
            camera.lookAt(0, 0, 0);
        });

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        renderer.domElement.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            const spherical = new THREE.Spherical();
            spherical.setFromVector3(camera.position);
            spherical.theta -= deltaX * 0.01;
            spherical.phi -= deltaY * 0.01;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

            camera.position.setFromSpherical(spherical);
            camera.lookAt(0, 0, 0);

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });

        renderer.domElement.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        function animate() {
            requestAnimationFrame(animate);

            if (isRotating) {
                const x = camera.position.x;
                const z = camera.position.z;
                const angle = 0.01;
                camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
                camera.position.z = x * Math.sin(angle) + z * Math.cos(angle);
                camera.lookAt(0, 0, 0);
            }

            renderer.render(scene, camera);
        }

        animate();

        threeApp = { scene, camera, renderer };
    }

    const vizCanvas = document.getElementById('viz-canvas');
    const vizCtx = vizCanvas.getContext('2d');
    const updateVizBtn = document.getElementById('update-viz-btn');

    let rotationX = 0.3;
    let rotationY = 0.5;
    let zoom = 40;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    function project(x, y, z) {
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        let y1 = y * cosX - z * sinX;
        let z1 = y * sinX + z * cosX;
        let x1 = x * cosY - z1 * sinY;
        let z2 = x * sinY + z1 * cosY;

        const scale = zoom;
        return {
            x: vizCanvas.width / 2 + x1 * scale,
            y: vizCanvas.height / 2 - y1 * scale,
            z: z2
        };
    }

    function drawAxis() {
        const axisLength = 5;
        const origin = { x: 0, y: 0, z: 0 };

        vizCtx.lineWidth = 1;

        const xEnd = project(axisLength, 0, 0);
        vizCtx.strokeStyle = '#e74c3c';
        vizCtx.beginPath();
        vizCtx.moveTo(origin.x, origin.y);
        vizCtx.lineTo(xEnd.x, xEnd.y);
        vizCtx.stroke();
        vizCtx.fillStyle = '#e74c3c';
        vizCtx.fillText('X', xEnd.x + 5, xEnd.y);

        const yEnd = project(0, axisLength, 0);
        vizCtx.strokeStyle = '#27ae60';
        vizCtx.beginPath();
        vizCtx.moveTo(origin.x, origin.y);
        vizCtx.lineTo(yEnd.x, yEnd.y);
        vizCtx.stroke();
        vizCtx.fillStyle = '#27ae60';
        vizCtx.fillText('Y', yEnd.x + 5, yEnd.y);

        const zEnd = project(0, 0, axisLength);
        vizCtx.strokeStyle = '#3498db';
        vizCtx.beginPath();
        vizCtx.moveTo(origin.x, origin.y);
        vizCtx.lineTo(zEnd.x, zEnd.y);
        vizCtx.stroke();
        vizCtx.fillStyle = '#3498db';
        vizCtx.fillText('Z', zEnd.x + 5, zEnd.y);
    }

    function drawVector(x, y, z, color, label) {
        const origin = project(0, 0, 0);
        const end = project(x, y, z);

        vizCtx.strokeStyle = color;
        vizCtx.lineWidth = 3;
        vizCtx.beginPath();
        vizCtx.moveTo(origin.x, origin.y);
        vizCtx.lineTo(end.x, end.y);
        vizCtx.stroke();

        const angle = Math.atan2(end.y - origin.y, end.x - origin.x);
        const arrowSize = 10;
        vizCtx.beginPath();
        vizCtx.moveTo(end.x, end.y);
        vizCtx.lineTo(
            end.x - arrowSize * Math.cos(angle - Math.PI / 6),
            end.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        vizCtx.lineTo(
            end.x - arrowSize * Math.cos(angle + Math.PI / 6),
            end.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        vizCtx.closePath();
        vizCtx.fillStyle = color;
        vizCtx.fill();

        vizCtx.fillStyle = color;
        vizCtx.font = '14px sans-serif';
        vizCtx.fillText(label, end.x + 8, end.y);
    }

    function drawGrid() {
        vizCtx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        vizCtx.lineWidth = 1;

        for (let i = -5; i <= 5; i++) {
            const start = project(i, 0, -5);
            const end = project(i, 0, 5);
            vizCtx.beginPath();
            vizCtx.moveTo(start.x, start.y);
            vizCtx.lineTo(end.x, end.y);
            vizCtx.stroke();

            const startY = project(-5, 0, i);
            const endY = project(5, 0, i);
            vizCtx.beginPath();
            vizCtx.moveTo(startY.x, startY.y);
            vizCtx.lineTo(endY.x, endY.y);
            vizCtx.stroke();
        }
    }

    function drawVisualization() {
        const ax = parseFloat(document.getElementById('viz-vec-a-x').value) || 0;
        const ay = parseFloat(document.getElementById('viz-vec-a-y').value) || 0;
        const az = parseFloat(document.getElementById('viz-vec-a-z').value) || 0;
        const bx = parseFloat(document.getElementById('viz-vec-b-x').value) || 0;
        const by = parseFloat(document.getElementById('viz-vec-b-y').value) || 0;
        const bz = parseFloat(document.getElementById('viz-vec-b-z').value) || 0;

        vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
        drawGrid();
        drawAxis();
        drawVector(ax, ay, az, '#667eea', 'A');
        if (bx !== 0 || by !== 0 || bz !== 0) {
            drawVector(bx, by, bz, '#f5576c', 'B');
        }
    }

    vizCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    vizCanvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - lastMouseX;
            const deltaY = e.clientY - lastMouseY;
            rotationY += deltaX * 0.01;
            rotationX += deltaY * 0.01;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
            drawVisualization();
        }
    });

    vizCanvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    vizCanvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    vizCanvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        zoom += e.deltaY * -0.05;
        zoom = Math.max(10, Math.min(100, zoom));
        drawVisualization();
    });

    updateVizBtn.addEventListener('click', drawVisualization);

    drawVisualization();

    const chatProviderSelect = document.getElementById('chat-provider');
    const chatModelSelect = document.getElementById('chat-model');
    const chatApiKeyInput = document.getElementById('chat-api-key');
    const chatConnectBtn = document.getElementById('chat-connect-btn');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatStatus = document.getElementById('chat-status');

    chatProviderSelect.addEventListener('change', () => {
        const provider = chatProviderSelect.value;
        chatModelSelect.innerHTML = '';
        
        if (provider === 'openai') {
            chatModelSelect.innerHTML = `
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            `;
        } else {
            chatModelSelect.innerHTML = `
                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
            `;
        }
    });

    chatConnectBtn.addEventListener('click', () => {
        const provider = chatProviderSelect.value;
        const model = chatModelSelect.value;
        const apiKey = chatApiKeyInput.value.trim();

        if (!apiKey) {
            chatStatus.textContent = 'Please enter an API key';
            chatStatus.className = 'chat-status error';
            return;
        }

        try {
            chatClient = createClient(provider, {
                apiKey: apiKey,
                model: model
            });

            chatClient.apiKey = apiKey;
            chatClient.setModel(model);

            chatConnectBtn.textContent = 'Connected';
            chatConnectBtn.classList.add('connected');
            chatStatus.textContent = `Connected to ${model}`;
            chatStatus.className = 'chat-status connected';
            chatApiKeyInput.disabled = true;
            chatProviderSelect.disabled = true;
            chatModelSelect.disabled = true;
        } catch (error) {
            chatStatus.textContent = `Connection failed: ${error.message}`;
            chatStatus.className = 'chat-status error';
        }
    });

    function addChatMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.innerHTML = `<span class="message-content">${content}</span>`;
        chatMessagesContainer.appendChild(messageDiv);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    async function processChatMessage(message) {
        const trimmed = message.trim();
        
        if (!trimmed) {
            return;
        }

        addChatMessage(trimmed, 'user');
        chatInput.disabled = true;
        chatSendBtn.disabled = true;

        try {
            const intent = IntentParser.parse(trimmed);
            
            if (intent.type !== 'expression' && intent.type !== 'unknown') {
                const result = IntentParser.execute(intent);
                
                if (result.error) {
                    addChatMessage(`Error: ${result.error}`, 'error');
                } else if (result.action === 'switch_mode') {
                    let response = `Switched to ${result.mode} mode. `;
                    if (result.params && result.params.function) {
                        response += `Function: ${result.params.function}`;
                    }
                    addChatMessage(response, 'system');
                } else if (result.action === 'result') {
                    let response = '';
                    if (result.details) {
                        response = `${result.details}\n`;
                    }
                    response += `Result: ${result.result}`;
                    addChatMessage(response, 'system');
                }
            } else if (chatClient) {
                const systemPrompt = `You are a helpful math assistant. You can:
- Evaluate mathematical expressions
- Explain math concepts
- Help with calculus, algebra, geometry, statistics
- Create graphs and visualizations when asked

When the user asks to plot or graph something, respond that you can help switch to the appropriate mode.`;

                chatMessages.push({ role: 'system', content: systemPrompt });
                chatMessages.push({ role: 'user', content: trimmed });

                const response = await chatClient.chat(chatMessages);
                
                chatMessages.push({ role: 'assistant', content: response });
                addChatMessage(response, 'system');
            } else {
                try {
                    const result = math.evaluate(trimmed);
                    const formatted = typeof result === 'number' ? result : 
                                     result.valueOf ? result.valueOf() : result;
                    addChatMessage(`Result: ${formatted}`, 'system');
                } catch (evalError) {
                    addChatMessage('Please connect to an LLM provider or enter a valid math expression.', 'error');
                }
            }
        } catch (error) {
            addChatMessage(`Error: ${error.message}`, 'error');
        }

        chatInput.disabled = false;
        chatSendBtn.disabled = false;
        chatInput.focus();
    }

    chatSendBtn.addEventListener('click', () => {
        const message = chatInput.value;
        if (message) {
            processChatMessage(message);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = chatInput.value;
            if (message) {
                processChatMessage(message);
                chatInput.value = '';
            }
        }
    });
});
