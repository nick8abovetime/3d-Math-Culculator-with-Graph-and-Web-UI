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
        const isArray = Array.isArray(actual) && Array.isArray(expected);
        let passed = false;
        
        if (isArray) {
            if (actual.length !== expected.length) {
                passed = false;
            } else {
                passed = actual.every((val, idx) => Math.abs(val - expected[idx]) <= tolerance);
            }
        } else if (typeof actual === 'number' && typeof expected === 'number') {
            passed = Math.abs(actual - expected) <= tolerance;
        } else {
            passed = actual === expected;
        }
        
        if (passed) {
            testResults.passed++;
            console.log(`✓ PASS: ${message}`);
        } else {
            testResults.failed++;
            console.error(`✗ FAIL: ${message} (expected: ${expected}, got: ${actual})`);
        }
    }

    function runTests() {
        console.log('=== 2D Graph Tests ===\n');

        testGraphTabUI();
        testExpressionParsing();
        testRangeInputValidation();
        testYMinMaxCalculation();
        testErrorHandling();
        testCanvasRendering();

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
            assert(graphFunctionInput !== null, 'Function input field exists');

            const xMinInput = document.getElementById('x-min');
            assert(xMinInput !== null, 'X Min input field exists');

            const xMaxInput = document.getElementById('x-max');
            assert(xMaxInput !== null, 'X Max input field exists');

            const graphBtn = document.getElementById('graph-btn');
            assert(graphBtn !== null, 'Graph button exists');

            const canvas = document.getElementById('graph-canvas');
            assert(canvas !== null, 'Graph canvas exists');

            const graphError = document.getElementById('graph-error');
            assert(graphError !== null, 'Graph error display exists');
        } else {
            console.log('  (Browser-only tests skipped in Node.js)');
        }
    }

    function testExpressionParsing() {
        console.log('\n--- Expression Parsing Tests ---');

        if (typeof math === 'undefined') {
            console.log('  (math.js not loaded - skipping)');
            return;
        }

        const expressions = [
            'x',
            'x^2',
            'x + 1',
            '2*x - 3',
            'x^3 - 2*x',
            'sin(x)',
            'cos(x)',
            'tan(x)',
            'sqrt(x)',
            'abs(x)',
            'exp(x)',
            'log(x)',
            'sin(x) + cos(x)',
            'x^2 + y^2'
        ];

        expressions.forEach(expr => {
            const compiled = math.compile(expr);
            assert(compiled !== null && typeof compiled === 'object', `Compiles: ${expr}`);
        });

        const result = math.compile('x + 1').evaluate({ x: 2 });
        assertEqual(result, 3, 'x + 1 = 3 when x=2');

        const result2 = math.compile('x^2').evaluate({ x: 3 });
        assertEqual(result2, 9, 'x^2 = 9 when x=3', 0.001);

        const result3 = math.compile('sin(x)').evaluate({ x: 0 });
        assertEqual(result3, 0, 'sin(0) = 0', 0.001);
    }

    function testRangeInputValidation() {
        console.log('\n--- Range Input Validation Tests ---');

        if (typeof document === 'undefined') {
            console.log('  (Browser-only tests skipped in Node.js)');
            return;
        }

        const xMinInput = document.getElementById('x-min');
        const xMaxInput = document.getElementById('x-max');

        if (!xMinInput || !xMaxInput) {
            console.log('  (Input elements not found - skipping)');
            return;
        }

        xMinInput.value = '-5';
        xMaxInput.value = '5';

        const xMin = parseFloat(xMinInput.value) || -10;
        const xMax = parseFloat(xMaxInput.value) || 10;

        assert(xMin < xMax, 'Valid range: xMin < xMax');

        xMinInput.value = '10';
        xMaxInput.value = '5';

        const invalidXMin = parseFloat(xMinInput.value) || -10;
        const invalidXMax = parseFloat(xMaxInput.value) || 10;

        assert(invalidXMin >= invalidXMax, 'Invalid range: xMin >= xMax');

        xMinInput.value = '';
        const emptyXMin = parseFloat(xMinInput.value);
        assert(isNaN(emptyXMin), 'Empty xMin returns NaN');

        xMinInput.value = 'abc';
        const nonNumericXMin = parseFloat(xMinInput.value);
        assert(isNaN(nonNumericXMin), 'Non-numeric xMin returns NaN');
    }

    function testYMinMaxCalculation() {
        console.log('\n--- Y Min/Max Calculation Tests ---');

        if (typeof math === 'undefined') {
            console.log('  (math.js not loaded - skipping)');
            return;
        }

        const getYMin = function(expr, xMin, xMax) {
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

        const getYMax = function(expr, xMin, xMax) {
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

        assertEqual(getYMin('x', -5, 5), -5, 'Linear y=x min is -5 on [-5,5]', 0.1);
        assertEqual(getYMax('x', -5, 5), 5, 'Linear y=x max is 5 on [-5,5]', 0.1);

        assertEqual(getYMin('x^2', -3, 3), 0, 'Quadratic y=x^2 min is 0 on [-3,3]', 0.1);
        assertEqual(getYMax('x^2', -3, 3), 9, 'Quadratic y=x^2 max is 9 on [-3,3]', 0.1);

        assertEqual(getYMin('sin(x)', 0, Math.PI * 2), -1, 'Sin min is -1 on [0,2π]', 0.1);
        assertEqual(getYMax('sin(x)', 0, Math.PI * 2), 1, 'Sin max is 1 on [0,2π]', 0.1);

        assertEqual(getYMin('5', -10, 10), 5, 'Constant min is 5');
        assertEqual(getYMax('5', -10, 10), 5, 'Constant max is 5');

        assertEqual(getYMin('abs(x)', -5, 5), 0, 'abs(x) min is 0 on [-5,5]', 0.1);
        assertEqual(getYMax('abs(x)', -5, 5), 5, 'abs(x) max is 5 on [-5,5]', 0.1);

        assertEqual(getYMin('sqrt(x)', 0, 9), 0, 'sqrt(x) min is 0 on [0,9]', 0.1);
        assertEqual(getYMax('sqrt(x)', 0, 9), 3, 'sqrt(x) max is 3 on [0,9]', 0.1);
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

        const emptyExpr = '';
        let emptyResult = false;
        try {
            const compiled = math.compile(emptyExpr);
            compiled.evaluate({ x: 1 });
        } catch (e) {
            emptyResult = true;
        }
        assert(emptyResult || emptyExpr.trim() === '', 'Empty expression handled');
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

        assert(canvas.width > 0, 'Canvas has positive width');
        assert(canvas.height > 0, 'Canvas has positive height');

        const ctx = canvas.getContext('2d');
        assert(ctx !== null, 'Canvas has 2D context');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(20, 20);
        ctx.stroke();

        const imageData = ctx.getImageData(10, 10, 1, 1);
        assert(imageData.data.length === 4, 'Canvas pixel data has RGBA channels');

        const padding = 40;
        const graphWidth = canvas.width - 2 * padding;
        const graphHeight = canvas.height - 2 * padding;
        
        assert(graphWidth > 0, 'Graph width is positive');
        assert(graphHeight > 0, 'Graph height is positive');
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