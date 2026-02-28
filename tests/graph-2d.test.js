(function() {
    'use strict';

    const testResults = {
        passed: 0,
        failed: 0,
        total: 0
    };

    function assert(condition, message) {
        testResults.total++;
        if (condition) {
            testResults.passed++;
            console.log(`✓ PASS: ${message}`);
        } else {
            testResults.failed++;
            console.error(`✗ FAIL: ${message}`);
        }
    }

    function assertEqual(actual, expected, message, tolerance = 0) {
        testResults.total++;
        const diff = Math.abs(actual - expected);
        if (diff <= tolerance) {
            testResults.passed++;
            console.log(`✓ PASS: ${message}`);
        } else {
            testResults.failed++;
            console.error(`✗ FAIL: ${message} (expected: ${expected}, got: ${actual}, diff: ${diff})`);
        }
    }

    function runTests() {
        console.log('=== 2D Graph Tests ===\n');

        testGraphTabUI();
        testExpressionParsing();
        testRangeInputValidation();
        testYMinMaxCalculation();
        testCanvasRendering();
        testErrorHandling();

        console.log('\n=== Test Results ===');
        console.log(`Total: ${testResults.total}`);
        console.log(`Passed: ${testResults.passed}`);
        console.log(`Failed: ${testResults.failed}`);

        return testResults;
    }

    function testGraphTabUI() {
        console.log('\n--- Graph Tab UI Tests ---');

        if (typeof document !== 'undefined') {
            const graphTab = document.querySelector('.mode-tab[data-mode="graph"]');
            assert(graphTab !== null, 'Graph tab button exists in DOM');

            const graphMode = document.querySelector('.graph-mode');
            assert(graphMode !== null, 'Graph mode container exists');

            const graphFunctionInput = document.getElementById('graph-function');
            assert(graphFunctionInput !== null, 'Graph function input exists');

            const xMinInput = document.getElementById('x-min');
            assert(xMinInput !== null, 'X Min input exists');

            const xMaxInput = document.getElementById('x-max');
            assert(xMaxInput !== null, 'X Max input exists');

            const graphCanvas = document.getElementById('graph-canvas');
            assert(graphCanvas !== null, 'Graph canvas exists');

            const graphError = document.getElementById('graph-error');
            assert(graphError !== null, 'Graph error element exists');
        } else {
            console.log('  (Browser-only tests skipped in Node.js)');
        }
    }

    function testExpressionParsing() {
        console.log('\n--- Math Expression Parsing Tests ---');

        if (typeof math === 'undefined') {
            console.log('  (math.js not loaded - skipping)');
            return;
        }

        const expressions = [
            'x',
            'x + 1',
            'x * 2',
            'x^2',
            'sin(x)',
            'cos(x)',
            'tan(x)',
            'sqrt(x)',
            'abs(x)',
            'log(x)',
            'exp(x)',
            'x^2 + 2*x + 1',
            'sin(x) * cos(x)',
            'sqrt(x^2 + 1)'
        ];

        expressions.forEach(expr => {
            const compiled = math.compile(expr);
            assert(compiled !== null && typeof compiled === 'object', `Compiles: ${expr}`);
        });

        const result = math.compile('x + 1').evaluate({ x: 3 });
        assertEqual(result, 4, 'x + 1 = 4 when x=3');

        const result2 = math.compile('x^2').evaluate({ x: 5 });
        assertEqual(result2, 25, 'x^2 = 25 when x=5', 0.001);

        const result3 = math.compile('sin(x)').evaluate({ x: Math.PI / 2 });
        assertEqual(result3, 1, 'sin(pi/2) = 1', 0.001);

        const result4 = math.compile('sqrt(x)').evaluate({ x: 16 });
        assertEqual(result4, 4, 'sqrt(16) = 4', 0.001);
    }

    function testRangeInputValidation() {
        console.log('\n--- Range Input Validation Tests ---');

        function validateRange(xMin, xMax) {
            if (isNaN(xMin) || isNaN(xMax)) {
                return { valid: false, error: 'Invalid number' };
            }
            if (xMin >= xMax) {
                return { valid: false, error: 'X Min must be less than X Max' };
            }
            return { valid: true, error: null };
        }

        const validRange = validateRange(-10, 10);
        assert(validRange.valid, 'Valid range [-10, 10] passes');

        const invalidRange1 = validateRange(10, -10);
        assert(!invalidRange1.valid, 'Inverted range [-10, 10] fails');
        assert(invalidRange1.error.includes('less than'), 'Error mentions "less than"');

        const invalidRange2 = validateRange(5, 5);
        assert(!invalidRange2.valid, 'Equal range [5, 5] fails');

        const nanRange = validateRange(NaN, 10);
        assert(!nanRange.valid, 'NaN min fails');
    }

    function testYMinMaxCalculation() {
        console.log('\n--- Y Min/Max Calculation Tests ---');

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

        if (typeof math === 'undefined') {
            console.log('  (math.js not loaded - skipping)');
            return;
        }

        assertEqual(getYMin('x', -5, 5), -5, 'y = x min is -5 on [-5, 5]', 0.1);
        assertEqual(getYMax('x', -5, 5), 5, 'y = x max is 5 on [-5, 5]', 0.1);

        assertEqual(getYMin('x^2', -3, 3), 0, 'y = x^2 min is 0 on [-3, 3]', 0.1);
        assertEqual(getYMax('x^2', -3, 3), 9, 'y = x^2 max is 9 on [-3, 3]', 0.1);

        assertEqual(getYMin('sin(x)', 0, Math.PI * 2), -1, 'y = sin(x) min is -1', 0.1);
        assertEqual(getYMax('sin(x)', 0, Math.PI * 2), 1, 'y = sin(x) max is 1', 0.1);

        assertEqual(getYMin('5', -10, 10), 5, 'y = 5 constant is 5');
        assertEqual(getYMax('5', -10, 10), 5, 'y = 5 constant is 5');

        assertEqual(getYMin('abs(x)', -5, 5), 0, 'y = |x| min is 0 on [-5, 5]', 0.1);
    }

    function testCanvasRendering() {
        console.log('\n--- Canvas Rendering Tests ---');

        if (typeof document === 'undefined') {
            console.log('  (Browser-only tests skipped in Node.js)');
            return;
        }

        const canvas = document.getElementById('graph-canvas');
        if (!canvas) {
            console.log('  (Canvas not found - skipping)');
            return;
        }

        const ctx = canvas.getContext('2d');
        assert(ctx !== null, 'Canvas context exists');

        assertEqual(canvas.width, 600, 'Canvas width is 600');
        assertEqual(canvas.height, 400, 'Canvas height is 400');

        const padding = 40;
        const graphWidth = canvas.width - 2 * padding;
        const graphHeight = canvas.height - 2 * padding;
        assertEqual(graphWidth, 520, 'Graph width with padding is 520');
        assertEqual(graphHeight, 320, 'Graph height with padding is 320');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        assert(imageData.data.length > 0, 'Canvas can generate image data');

        function calculatePointX(px, padding, graphWidth, xMin, xMax) {
            return xMin + (px - padding) / graphWidth * (xMax - xMin);
        }

        const xVal = calculatePointX(40, 40, 520, -10, 10);
        assertEqual(xVal, -10, 'Pixel at left padding is xMin (-10)');
        
        const xVal2 = calculatePointX(560, 40, 520, -10, 10);
        assertEqual(xVal2, 10, 'Pixel at right padding is xMax (10)');
    }

    function testErrorHandling() {
        console.log('\n--- Error Handling Tests ---');

        if (typeof math === 'undefined') {
            console.log('  (math.js not loaded - skipping)');
            return;
        }

        let invalidExprCaught = false;
        try {
            math.compile('x +').evaluate({ x: 1 });
        } catch (e) {
            invalidExprCaught = true;
        }
        assert(invalidExprCaught, 'Invalid expression throws error');

        let divByZeroResult = false;
        try {
            const compiled = math.compile('x / y');
            const result = compiled.evaluate({ x: 1, y: 0 });
            divByZeroResult = !isFinite(result);
        } catch (e) {
            divByZeroResult = true;
        }
        assert(divByZeroResult, 'Division by zero produces non-finite or error');

        const negLog = math.compile('log(x)').evaluate({ x: -1 });
        assert(!isFinite(negLog), 'log(-1) produces non-finite result');

        const unknownFunc = math.compile('unknown_func(x)');
        let unknownResult = false;
        try {
            unknownFunc.evaluate({ x: 1 });
        } catch (e) {
            unknownResult = true;
        }
        assert(unknownResult, 'Unknown function throws error');

        const sqrtNeg = math.compile('sqrt(x)').evaluate({ x: -4 });
        assert(!isFinite(sqrtNeg) || sqrtNeg === null, 'sqrt(-4) produces non-finite result');
    }

    if (typeof window !== 'undefined') {
        window.runGraph2DTests = runTests;
        window.graph2DTestResults = testResults;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { runTests, testResults };
    }

    if (typeof window === 'undefined' && typeof importScripts === 'undefined') {
        runTests();
    }
})();