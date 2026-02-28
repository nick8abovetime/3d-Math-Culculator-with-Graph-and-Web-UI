describe('Vector UI', () => {
    let vecAX, vecAY, vecAZ, vecBX, vecBY, vecBZ, vectorOperation, resultOutput;
    let calculateVector;

    beforeEach(() => {
        document.body.innerHTML = `
            <input id="vec-a-x" />
            <input id="vec-a-y" />
            <input id="vec-a-z" />
            <input id="vec-b-x" />
            <input id="vec-b-y" />
            <input id="vec-b-z" />
            <select id="vector-operation">
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="dot">Dot Product</option>
                <option value="cross">Cross Product</option>
                <option value="magnitude">Magnitude</option>
                <option value="normalize">Normalize</option>
                <option value="distance">Distance</option>
                <option value="angle">Angle</option>
            </select>
            <output id="result-output"></output>
        `;
        
        vecAX = document.getElementById('vec-a-x');
        vecAY = document.getElementById('vec-a-y');
        vecAZ = document.getElementById('vec-a-z');
        vecBX = document.getElementById('vec-b-x');
        vecBY = document.getElementById('vec-b-y');
        vecBZ = document.getElementById('vec-b-z');
        vectorOperation = document.getElementById('vector-operation');
        resultOutput = document.getElementById('result-output');

        calculateVector = () => {
            const ax = parseFloat(vecAX.value) || 0;
            const ay = parseFloat(vecAY.value) || 0;
            const az = parseFloat(vecAZ.value) || 0;
            const bx = parseFloat(vecBX.value) || 0;
            const by = parseFloat(vecBY.value) || 0;
            const bz = parseFloat(vecBZ.value) || 0;
            const operation = vectorOperation.value;
            const vecA = { x: ax, y: ay, z: az };
            const vecB = { x: bx, y: by, z: bz };
            
            let result;
            switch (operation) {
                case 'add':
                    result = { x: vecA.x + vecB.x, y: vecA.y + vecB.y, z: vecA.z + vecB.z };
                    resultOutput.textContent = `(${result.x}, ${result.y}, ${result.z})`;
                    break;
                case 'subtract':
                    result = { x: vecA.x - vecB.x, y: vecA.y - vecB.y, z: vecA.z - vecB.z };
                    resultOutput.textContent = `(${result.x}, ${result.y}, ${result.z})`;
                    break;
                case 'dot':
                    result = vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
                    resultOutput.textContent = result.toFixed(4);
                    break;
                case 'cross':
                    result = { x: vecA.y * vecB.z - vecA.z * vecB.y, y: vecA.z * vecB.x - vecA.x * vecB.z, z: vecA.x * vecB.y - vecA.y * vecB.x };
                    resultOutput.textContent = `(${result.x}, ${result.y}, ${result.z})`;
                    break;
                case 'magnitude':
                    result = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z);
                    resultOutput.textContent = result.toFixed(4);
                    break;
                case 'normalize':
                    const mag = Math.sqrt(vecA.x * vecA.x + vecA.y * vecA.y + vecA.z * vecA.z);
                    if (mag === 0) resultOutput.textContent = '(0, 0, 0)';
                    else {
                        result = { x: vecA.x / mag, y: vecA.y / mag, z: vecA.z / mag };
                        resultOutput.textContent = `(${result.x.toFixed(4)}, ${result.y.toFixed(4)}, ${result.z.toFixed(4)})`;
                    }
                    break;
                case 'distance':
                    const dx = vecA.x - vecB.x, dy = vecA.y - vecB.y, dz = vecA.z - vecB.z;
                    result = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    resultOutput.textContent = result.toFixed(4);
                    break;
            }
        };
    });

    describe('Vector Addition', () => {
        test('adds two 3D vectors', () => {
            vecAX.value = '1'; vecAY.value = '2'; vecAZ.value = '3';
            vecBX.value = '4'; vecBY.value = '5'; vecBZ.value = '6';
            vectorOperation.value = 'add';
            calculateVector();
            expect(resultOutput.textContent).toBe('(5, 7, 9)');
        });

        test('adds vectors with negative components', () => {
            vecAX.value = '-1'; vecAY.value = '2'; vecAZ.value = '-3';
            vecBX.value = '4'; vecBY.value = '-5'; vecBZ.value = '6';
            vectorOperation.value = 'add';
            calculateVector();
            expect(resultOutput.textContent).toBe('(3, -3, 3)');
        });
    });

    describe('Vector Subtraction', () => {
        test('subtracts two 3D vectors', () => {
            vecAX.value = '5'; vecAY.value = '7'; vecAZ.value = '9';
            vecBX.value = '1'; vecBY.value = '2'; vecBZ.value = '3';
            vectorOperation.value = 'subtract';
            calculateVector();
            expect(resultOutput.textContent).toBe('(4, 5, 6)');
        });
    });

    describe('Dot Product', () => {
        test('calculates dot product of orthogonal vectors', () => {
            vecAX.value = '1'; vecAY.value = '0'; vecAZ.value = '0';
            vecBX.value = '0'; vecBY.value = '1'; vecBZ.value = '0';
            vectorOperation.value = 'dot';
            calculateVector();
            expect(resultOutput.textContent).toBe('0.0000');
        });

        test('calculates dot product of parallel vectors', () => {
            vecAX.value = '2'; vecAY.value = '3'; vecAZ.value = '4';
            vecBX.value = '2'; vecBY.value = '3'; vecBZ.value = '4';
            vectorOperation.value = 'dot';
            calculateVector();
            expect(resultOutput.textContent).toBe('29.0000');
        });
    });

    describe('Cross Product', () => {
        test('calculates cross product', () => {
            vecAX.value = '1'; vecAY.value = '0'; vecAZ.value = '0';
            vecBX.value = '0'; vecBY.value = '1'; vecBZ.value = '0';
            vectorOperation.value = 'cross';
            calculateVector();
            expect(resultOutput.textContent).toBe('(0, 0, 1)');
        });
    });

    describe('Magnitude', () => {
        test('calculates magnitude of vector', () => {
            vecAX.value = '3'; vecAY.value = '4'; vecAZ.value = '0';
            vectorOperation.value = 'magnitude';
            calculateVector();
            expect(resultOutput.textContent).toBe('5.0000');
        });

        test('returns 0 for zero vector', () => {
            vecAX.value = '0'; vecAY.value = '0'; vecAZ.value = '0';
            vectorOperation.value = 'magnitude';
            calculateVector();
            expect(resultOutput.textContent).toBe('0.0000');
        });
    });

    describe('Normalization', () => {
        test('normalizes unit vector', () => {
            vecAX.value = '0'; vecAY.value = '0'; vecAZ.value = '5';
            vectorOperation.value = 'normalize';
            calculateVector();
            expect(resultOutput.textContent).toBe('(0.0000, 0.0000, 1.0000)');
        });

        test('returns zero for zero vector', () => {
            vecAX.value = '0'; vecAY.value = '0'; vecAZ.value = '0';
            vectorOperation.value = 'normalize';
            calculateVector();
            expect(resultOutput.textContent).toBe('(0, 0, 0)');
        });
    });

    describe('Distance', () => {
        test('calculates distance between points', () => {
            vecAX.value = '0'; vecAY.value = '0'; vecAZ.value = '0';
            vecBX.value = '3'; vecBY.value = '4'; vecBZ.value = '0';
            vectorOperation.value = 'distance';
            calculateVector();
            expect(resultOutput.textContent).toBe('5.0000');
        });
    });
});