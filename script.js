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
            } else {
                expressionMode.style.display = 'none';
                vectorMode.style.display = 'block';
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
});
