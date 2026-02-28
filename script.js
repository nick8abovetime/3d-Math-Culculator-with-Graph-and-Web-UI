document.addEventListener('DOMContentLoaded', () => {
    const expressionInput = document.getElementById('expression');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultOutput = document.getElementById('result-output');
    const errorMessage = document.getElementById('error-message');
    const modeTabs = document.querySelectorAll('.mode-tab');
    const expressionMode = document.querySelector('.expression-mode');
    const vectorMode = document.querySelector('.vector-mode');

    let currentMode = 'expression';

    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMode = tab.dataset.mode;
            
            if (currentMode === 'expression') {
                expressionMode.style.display = 'flex';
                vectorMode.style.display = 'none';
                visualizeMode.style.display = 'none';
            } else if (currentMode === 'vector') {
                expressionMode.style.display = 'none';
                vectorMode.style.display = 'block';
                visualizeMode.style.display = 'none';
            } else {
                expressionMode.style.display = 'none';
                vectorMode.style.display = 'none';
                visualizeMode.style.display = 'block';
                drawVisualization();
            }
            resultOutput.textContent = '-';
            errorMessage.textContent = '';
        });
    });

    function calculate() {
        if (currentMode === 'expression') {
            calculateExpression();
        } else {
            calculateVector();
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
            resultOutput.textContent = result;
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

    calculateBtn.addEventListener('click', calculate);

    expressionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });

    expressionInput.focus();

    const graphFunctionInput = document.getElementById('graph-function');
    const xMinInput = document.getElementById('x-min');
    const xMaxInput = document.getElementById('x-max');
    const graphBtn = document.getElementById('graph-btn');
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

    graphBtn.addEventListener('click', drawGraph);
    
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

    const visualizeMode = document.querySelector('.visualize-mode');
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
});
