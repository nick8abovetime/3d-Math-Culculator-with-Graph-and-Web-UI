class ChatInterface {
    constructor() {
        this.messages = [];
        this.inputElement = null;
        this.containerElement = null;
        this.sendButton = null;
        this.clearButton = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        
        this.inputElement = document.getElementById('chat-input');
        this.containerElement = document.getElementById('chat-messages');
        this.sendButton = document.getElementById('chat-send-btn');
        this.clearButton = document.getElementById('clear-chat-btn');
        
        this.bindEvents();
        this.addWelcomeMessage();
        this.isInitialized = true;
    }

    bindEvents() {
        this.sendButton.addEventListener('click', () => this.handleSend());
        
        this.inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSend();
            }
        });

        this.clearButton.addEventListener('click', () => this.clearChat());
    }

    addWelcomeMessage() {
        if (this.messages.length === 0) {
            this.addAssistantMessage("Hi! I'm your math assistant. Ask me anything like:\n• 'what is sin(pi/2)'\n• 'plot x^2'\n• 'dot [1,2,3] and [4,5,6]'\n• 'surface sin(x)*cos(y)'\n\nOr type 'help' for more examples.", 'text');
        }
    }

    handleSend() {
        const text = this.inputElement.value.trim();
        if (!text) return;
        
        this.addUserMessage(text);
        this.inputElement.value = '';
        this.processInput(text);
    }

    addUserMessage(text) {
        const message = { role: 'user', content: text };
        this.messages.push(message);
        this.renderMessage(message);
    }

    addAssistantMessage(content, type = 'text') {
        const message = { role: 'assistant', content, type };
        this.messages.push(message);
        this.renderMessage(message);
    }

    renderMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.role}`;
        
        const contentEl = document.createElement('div');
        contentEl.className = 'message-content';
        
        if (message.type === 'error') {
            contentEl.classList.add('error-message');
        }
        
        if (message.type === 'graph') {
            contentEl.innerHTML = `<div class="result-label">Result:</div><canvas id="chat-graph-canvas" width="500" height="300"></canvas>`;
        } else if (message.type === 'surface') {
            contentEl.innerHTML = `<div class="result-label">3D Surface:</div><div id="chat-surface-container"></div>`;
        } else {
            contentEl.textContent = message.content;
        }
        
        messageEl.appendChild(contentEl);
        this.containerElement.appendChild(messageEl);
        this.scrollToBottom();
        
        if (message.type === 'graph' && message.graphData) {
            this.renderChatGraph(message.graphData);
        }
    }

    scrollToBottom() {
        this.containerElement.scrollTop = this.containerElement.scrollHeight;
    }

    processInput(text) {
        const lowerText = text.toLowerCase().trim();
        
        if (lowerText === 'help' || lowerText === '?') {
            this.addAssistantMessage(`Here are some things you can ask me:

<b>Expressions:</b>
• "calculate 2+2"
• "what is sqrt(16)"
• "sin(pi/2)"

<b>2D Graphs:</b>
• "plot sin(x)"
• "graph x^2 from -5 to 5"

<b>3D Surfaces:</b>
• "surface x^2 + y^2"
• "3d sin(x)*cos(y)"

<b>Vectors:</b>
• "dot [1,2,3] and [4,5,6]"
• "cross [1,0,0] and [0,1,0]"
• "magnitude of [3,4,0]"
• "normalize [1,1,1]"

<b>Matrices:</b>
• "det [[1,2],[3,4]]"
• "inverse [[1,0],[0,1]]"

<b>More:</b>
• "distance [0,0,0] and [3,4,0]"
• "angle [1,0] and [0,1]"`, 'text');
            return;
        }

        if (lowerText === 'clear') {
            this.clearChat();
            return;
        }

        if (window.parseIntent) {
            const intent = window.parseIntent(text);
            this.handleIntent(intent, text);
        } else {
            this.fallbackParse(text);
        }
    }

    handleIntent(intent, originalText) {
        if (!intent || !intent.action) {
            this.addAssistantMessage(`I didn't understand "${originalText}". Type 'help' for examples.`, 'error');
            return;
        }

        try {
            switch (intent.action) {
                case 'expression':
                    const result = math.evaluate(intent.expression);
                    const formatted = typeof result === 'number' ? 
                        (Number.isInteger(result) ? result : result.toFixed(6).replace(/\.?0+$/, '')) :
                        (result.valueOf ? result.valueOf() : result);
                    this.addAssistantMessage(`Result: ${formatted}`, 'text');
                    break;

                case 'plot':
                    this.renderGraphIntent(intent);
                    break;

                case 'surface':
                    this.renderSurfaceIntent(intent);
                    break;

                case 'vector':
                    this.handleVectorIntent(intent);
                    break;

                case 'matrix':
                    this.handleMatrixIntent(intent);
                    break;

                default:
                    this.addAssistantMessage(`I understood "${intent.action}" but couldn't process it. Try 'help' for examples.`, 'error');
            }
        } catch (error) {
            this.addAssistantMessage(`Error: ${error.message}. Try 'help' for examples.`, 'error');
        }
    }

    renderGraphIntent(intent) {
        this.addAssistantMessage('', 'graph');
        
        setTimeout(() => {
            const canvas = document.getElementById('chat-graph-canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const expr = intent.expression || 'sin(x)';
            const xMin = intent.xMin || -10;
            const xMax = intent.xMax || 10;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f5f5f5';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const yMin = -5, yMax = 5;
            let firstPoint = true;
            
            for (let px = 0; px < canvas.width; px++) {
                const x = xMin + (px / canvas.width) * (xMax - xMin);
                try {
                    const y = math.evaluate(expr, { x });
                    if (isFinite(y)) {
                        const py = canvas.height - ((y - yMin) / (yMax - yMin)) * canvas.height;
                        if (firstPoint) {
                            ctx.moveTo(px, py);
                            firstPoint = false;
                        } else {
                            ctx.lineTo(px, py);
                        }
                    }
                } catch (e) {}
            }
            ctx.stroke();
            
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
        }, 100);
    }

    renderSurfaceIntent(intent) {
        this.addAssistantMessage('Rendering 3D surface...', 'text');
        
        setTimeout(() => {
            const container = document.getElementById('chat-surface-container');
            if (!container) return;
            
            container.innerHTML = '';
            container.style.width = '100%';
            container.style.height = '300px';
            
            if (typeof THREE !== 'undefined') {
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(renderer.domElement);
                
                const expr = intent.expression || 'sin(x) * cos(y)';
                const geometry = new THREE.ParametricGeometry((u, v, target) => {
                    const x = (u - 0.5) * 10;
                    const y = (v - 0.5) * 10;
                    try {
                        const z = math.evaluate(expr, { x, y });
                        target.set(x, z, y);
                    } catch (e) {
                        target.set(x, 0, y);
                    }
                }, 20, 20);
                
                const material = new THREE.MeshPhongMaterial({ 
                    color: 0x667eea, 
                    side: THREE.DoubleSide,
                    wireframe: false
                });
                const mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                
                const wireframeMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff, 
                    wireframe: true, 
                    transparent: true, 
                    opacity: 0.3 
                });
                const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
                scene.add(wireframe);
                
                const light = new THREE.AmbientLight(0xffffff, 0.8);
                scene.add(light);
                const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
                dirLight.position.set(5, 10, 5);
                scene.add(dirLight);
                
                camera.position.set(8, 8, 8);
                camera.lookAt(0, 0, 0);
                
                function animate() {
                    requestAnimationFrame(animate);
                    mesh.rotation.y += 0.005;
                    wireframe.rotation.y += 0.005;
                    renderer.render(scene, camera);
                }
                animate();
            } else {
                container.innerHTML = '<p style="color: #888; text-align: center;">Three.js not loaded</p>';
            }
        }, 100);
    }

    handleVectorIntent(intent) {
        const op = intent.operation;
        const a = intent.vectorA;
        const b = intent.vectorB;
        
        let result;
        
        switch (op) {
            case 'dot':
                result = a.x * b.x + a.y * b.y + a.z * b.z;
                this.addAssistantMessage(`Dot product: ${result}`, 'text');
                break;
            case 'cross':
                const cx = a.y * b.z - a.z * b.y;
                const cy = a.z * b.x - a.x * b.z;
                const cz = a.x * b.y - a.y * b.x;
                this.addAssistantMessage(`Cross product: [${cx}, ${cy}, ${cz}]`, 'text');
                break;
            case 'magnitude':
                result = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
                this.addAssistantMessage(`Magnitude: ${result.toFixed(4)}`, 'text');
                break;
            case 'normalize':
                const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
                const nx = a.x / mag;
                const ny = a.y / mag;
                const nz = a.z / mag;
                this.addAssistantMessage(`Normalized: [${nx.toFixed(4)}, ${ny.toFixed(4)}, ${nz.toFixed(4)}]`, 'text');
                break;
            case 'add':
                this.addAssistantMessage(`Sum: [${a.x + b.x}, ${a.y + b.y}, ${a.z + b.z}]`, 'text');
                break;
            case 'subtract':
                this.addAssistantMessage(`Difference: [${a.x - b.x}, ${a.y - b.y}, ${a.z - b.z}]`, 'text');
                break;
            default:
                this.addAssistantMessage(`Unknown vector operation: ${op}`, 'error');
        }
    }

    handleMatrixIntent(intent) {
        const op = intent.operation;
        const matrix = intent.matrix;
        
        try {
            switch (op) {
                case 'determinant':
                    const det = math.det(matrix);
                    this.addAssistantMessage(`Determinant: ${det}`, 'text');
                    break;
                case 'inverse':
                    const inv = math.inv(matrix);
                    this.addAssistantMessage(`Inverse:\n${this.formatMatrix(inv)}`, 'text');
                    break;
                case 'transpose':
                    const trans = math.transpose(matrix);
                    this.addAssistantMessage(`Transpose:\n${this.formatMatrix(trans)}`, 'text');
                    break;
                default:
                    this.addAssistantMessage(`Unknown matrix operation: ${op}`, 'error');
            }
        } catch (error) {
            this.addAssistantMessage(`Error: ${error.message}`, 'error');
        }
    }

    formatMatrix(m) {
        return m.map(row => '[' + row.map(v => v.toFixed(2)).join(', ') + ']').join('\n');
    }

    fallbackParse(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.startsWith('plot ') || lowerText.startsWith('graph ')) {
            const expr = text.replace(/^(plot|graph)\s+/i, '');
            this.renderGraphIntent({ expression: expr });
        } else if (lowerText.startsWith('surface ') || lowerText.startsWith('3d ')) {
            const expr = text.replace(/^(surface|3d)\s+/i, '');
            this.renderSurfaceIntent({ expression: expr });
        } else if (lowerText.startsWith('what is ') || lowerText.startsWith('calculate ') || /[\d\+\-\*\/\%\^\(\)]/.test(text)) {
            try {
                const result = math.evaluate(text.replace(/^(what is|calculate)\s+/i, ''));
                this.addAssistantMessage(`Result: ${result}`, 'text');
            } catch (e) {
                this.addAssistantMessage(`Error: ${e.message}. Try 'help' for examples.`, 'error');
            }
        } else {
            this.addAssistantMessage(`I didn't understand "${text}". Type 'help' for examples.`, 'error');
        }
    }

    clearChat() {
        this.messages = [];
        this.containerElement.innerHTML = '';
        this.addWelcomeMessage();
    }
}

const chatInterface = new ChatInterface();