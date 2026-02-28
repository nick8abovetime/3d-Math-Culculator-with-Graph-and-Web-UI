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
        console.log('=== 3D Surface Tests ===\n');

        testSurfaceTabControls();
        testMathExpressionParsing();
        testGridGeneration();
        testVertexCreation();
        testIndexCreation();
        testZClamping();
        testColorGeneration();
        testErrorHandling();

        console.log('\n=== Test Results ===');
        console.log(`Total: ${testResults.total}`);
        console.log(`Passed: ${testResults.passed}`);
        console.log(`Failed: ${testResults.failed}`);

        return testResults;
    }

    function testSurfaceTabControls() {
        console.log('\n--- Surface Tab UI Tests ---');

        if (typeof document !== 'undefined') {
            const surfaceTab = document.querySelector('.mode-tab[data-mode="surface"]');
            assert(surfaceTab !== null, 'Surface tab button exists in DOM');

            const surfaceMode = document.querySelector('.surface-mode');
            assert(surfaceMode !== null, 'Surface mode container exists');

            const graphBtn = document.getElementById('surface-graph-btn');
            assert(graphBtn !== null, 'Generate Surface button exists');
        } else {
            console.log('  (Browser-only tests skipped in Node.js)');
        }
    }

    function testMathExpressionParsing() {
        console.log('\n--- Math Expression Parsing Tests ---');

        if (typeof math === 'undefined') {
            console.log('  (math.js not loaded - skipping)');
            return;
        }

        const expressions = [
            'x + y',
            'x - y',
            'x * y',
            'x / y',
            'x^2 + y^2',
            'sin(x) * cos(y)',
            'sqrt(x^2 + y^2)',
            'exp(-(x^2 + y^2))',
            'sin(x) + cos(y)',
            'x * y^2'
        ];

        expressions.forEach(expr => {
            const compiled = math.compile(expr);
            assert(compiled !== null && typeof compiled === 'object', `Compiles: ${expr}`);
        });

        const result = math.compile('x + y').evaluate({ x: 3, y: 4 });
        assertEqual(result, 7, 'x + y = 7 when x=3, y=4');

        const result2 = math.compile('x^2 + y^2').evaluate({ x: 3, y: 4 });
        assertEqual(result2, 25, 'x^2 + y^2 = 25 when x=3, y=4', 0.001);

        const result3 = math.compile('sin(x) * cos(y)').evaluate({ x: 0, y: 0 });
        assertEqual(result3, 0, 'sin(0) * cos(0) = 0', 0.001);
    }

    function testGridGeneration() {
        console.log('\n--- Grid Generation Tests ---');

        const size = 10;
        const segments = 5;

        function generateGridPoints(gridSize, gridSegments) {
            const points = [];
            for (let i = 0; i <= gridSegments; i++) {
                const x = (i / gridSegments - 0.5) * gridSize;
                for (let j = 0; j <= gridSegments; j++) {
                    const y = (j / gridSegments - 0.5) * gridSize;
                    points.push({ x, y });
                }
            }
            return points;
        }

        const points = generateGridPoints(size, segments);
        const expectedCount = (segments + 1) * (segments + 1);
        assertEqual(points.length, expectedCount, `Generates ${expectedCount} grid points for ${segments} segments`);

        assertEqual(points[0].x, -size / 2, 'First point x is at -size/2');
        assertEqual(points[0].y, -size / 2, 'First point y is at -size/2');

        const lastPoint = points[points.length - 1];
        assertEqual(lastPoint.x, size / 2, 'Last point x is at size/2');
        assertEqual(lastPoint.y, size / 2, 'Last point y is at size/2');

        const midIndex = Math.floor(points.length / 2);
        assertEqual(points[midIndex].x, 0, 'Middle point x is at 0');
        assertEqual(points[midIndex].y, 0, 'Middle point y is at 0');

        const rowLength = segments + 1;
        assertEqual(points[rowLength].x, -size / 2, 'Second row starts at -size/2');
        assertEqual(points[rowLength].y, -size / 2 + (size / segments), 'Second row y moves up by size/segments');
    }

    function testVertexCreation() {
        console.log('\n--- Vertex Creation Tests ---');

        if (typeof math === 'undefined') {
            console.log('  (math.js not loaded - skipping)');
            return;
        }

        const size = 10;
        const segments = 3;
        const compiled = math.compile('x + y');
        const vertices = [];

        function generateVertices(expr, gridSize, gridSegments) {
            const verts = [];
            for (let i = 0; i <= gridSegments; i++) {
                const x = (i / gridSegments - 0.5) * gridSize;
                for (let j = 0; j <= gridSegments; j++) {
                    const y = (j / gridSegments - 0.5) * gridSize;
                    let z = expr.evaluate({ x, y });
                    verts.push(x, z, y);
                }
            }
            return verts;
        }

        const vertices1 = generateVertices(compiled, size, segments);
        const expectedVertCount = (segments + 1) * (segments + 1) * 3;
        assertEqual(vertices1.length, expectedVertCount, `Generates ${expectedVertCount} vertex values`);

        assertEqual(vertices1[0], -5, 'First vertex x is at -5');
        assertEqual(vertices1[1], -10, 'First vertex z is -10 (x+y where x=-5, y=-5)');
        assertEqual(vertices1[2], -5, 'First vertex y is at -5');

        const compiled2 = math.compile('x^2 + y^2');
        const vertices2 = generateVertices(compiled2, 6, 2);
        assertEqual(vertices2[1], 50, 'x^2+y^2 = 50 at x=-3,y=-3');
    }

    function testIndexCreation() {
        console.log('\n--- Index Creation Tests ---');

        function generateIndices(gridSegments) {
            const indices = [];
            for (let i = 0; i < gridSegments; i++) {
                for (let j = 0; j < gridSegments; j++) {
                    const a = i * (gridSegments + 1) + j;
                    const b = a + 1;
                    const c = a + (gridSegments + 1);
                    const d = c + 1;
                    indices.push(a, b, c);
                    indices.push(b, d, c);
                }
            }
            return indices;
        }

        const segments = 4;
        const indices = generateIndices(segments);
        const expectedTriangles = segments * segments;
        const expectedIndices = expectedTriangles * 3;
        assertEqual(indices.length, expectedIndices, `Generates ${expectedIndices} indices for ${expectedTriangles} triangles`);

        assertEqual(indices[0], 0, 'First triangle starts at vertex 0');
        assertEqual(indices[1], 1, 'First triangle second vertex is 1');
        assertEqual(indices[2], segments + 1, 'First triangle third vertex is segments+1');

        const indices2 = generateIndices(2);
        assertEqual(indices2.length, 24, '2x2 grid generates 24 indices for 4 triangles');

        assertEqual(indices2[6], 4, 'Second row first triangle starts at vertex 4');
    }

    function testZClamping() {
        console.log('\n--- Z-Clamping Tests ---');

        function clampZ(z, minZ = -5, maxZ = 5) {
            if (!isFinite(z)) return 0;
            return Math.max(minZ, Math.min(maxZ, z));
        }

        const testCases = [
            { input: Infinity, expected: 0 },
            { input: -Infinity, expected: 0 },
            { input: NaN, expected: 0 },
            { input: 100, expected: 5 },
            { input: -100, expected: -5 },
            { input: 5, expected: 5 },
            { input: -5, expected: -5 },
            { input: 0, expected: 0 },
            { input: 2.5, expected: 2.5 },
            { input: -2.5, expected: -2.5 }
        ];

        testCases.forEach(tc => {
            const result = clampZ(tc.input);
            assertEqual(result, tc.expected, `clampZ(${tc.input}) = ${tc.expected}`);
        });
    }

    function testColorGeneration() {
        console.log('\n--- Color Generation Tests ---');

        function generateColors(zValues, minZ = -5, maxZ = 5) {
            const colors = [];
            const range = maxZ - minZ;
            zValues.forEach(z => {
                const normalizedZ = (z - minZ) / range;
                colors.push(normalizedZ, 0.5, 1 - normalizedZ);
            });
            return colors;
        }

        const zValues = [-5, -2.5, 0, 2.5, 5];
        const colors = generateColors(zValues);

        assertEqual(colors.length, 15, 'Generates 15 color values (3 per z for 5 z values)');

        assertEqual(colors[0], 0, 'z=-5: normalizedZ is 0 (red component)');
        assertEqual(colors[3], 0.25, 'z=-2.5: normalizedZ is 0.25 (red component)');
        assertEqual(colors[6], 0.5, 'z=0: normalizedZ is 0.5 (red component)');
        assertEqual(colors[9], 0.75, 'z=2.5: normalizedZ is 0.75 (red component)');
        assertEqual(colors[12], 1, 'z=5: normalizedZ is 1 (red component)');

        assertEqual(colors[2], 1, 'z=-5: blue component is 1');
        assertEqual(colors[5], 0.5, 'z=-2.5: blue component is 0.5');
        assertEqual(colors[8], 0.5, 'z=0: blue component is 0.5');
        assertEqual(colors[11], 0.5, 'z=2.5: blue component is 0.5');
        assertEqual(colors[14], 0, 'z=5: blue component is 0');

        assertEqual(colors[1], 0.5, 'All green components are 0.5');
        assertEqual(colors[4], 0.5, 'All green components are 0.5');
        assertEqual(colors[7], 0.5, 'All green components are 0.5');
    }

    function testErrorHandling() {
        console.log('\n--- Error Handling Tests ---');

        if (typeof math === 'undefined') {
            console.log('  (math.js not loaded - skipping)');
            return;
        }

        let invalidExprCaught = false;
        try {
            math.compile('x +').evaluate({ x: 1, y: 1 });
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
    }

    if (typeof window !== 'undefined') {
        window.runSurface3DTests = runTests;
        window.surface3DTestResults = testResults;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { runTests, testResults };
    }

    if (typeof window === 'undefined' && typeof importScripts === 'undefined') {
        runTests();
    }
})();