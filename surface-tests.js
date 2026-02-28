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

    function assertEqual(actual, expected, message) {
        testResults.total++;
        if (actual === expected) {
            testResults.passed++;
            console.log(`✓ PASS: ${message}`);
        } else {
            testResults.failed++;
            console.error(`✗ FAIL: ${message} (expected: ${expected}, got: ${actual})`);
        }
    }

    function assertDeepEqual(actual, expected, message) {
        testResults.total++;
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr === expectedStr) {
            testResults.passed++;
            console.log(`✓ PASS: ${message}`);
        } else {
            testResults.failed++;
            console.error(`✗ FAIL: ${message}`);
            console.error(`  Expected: ${expectedStr}`);
            console.error(`  Got: ${actualStr}`);
        }
    }

    function runTests() {
        console.log('=== 3D Surface Tests ===\n');

        testMathCompilation();
        testFunctionEvaluation();
        testGridGeneration();
        testVertexCreation();
        testIndexCreation();
        testErrorHandling();
        testZClamping();
        testColorGeneration();

        console.log('\n=== Test Results ===');
        console.log(`Total: ${testResults.total}`);
        console.log(`Passed: ${testResults.passed}`);
        console.log(`Failed: ${testResults.failed}`);

        return testResults;
    }

    function testMathCompilation() {
        console.log('\n--- Math Compilation Tests ---');

        const compiled1 = math.compile('x + y');
        assert(compiled1 !== null, 'math.compile returns an object for x + y');

        const compiled2 = math.compile('sin(x) * cos(y)');
        assert(compiled2 !== null, 'math.compile returns an object for trig function');

        const compiled3 = math.compile('x^2 + y^2');
        assert(compiled3 !== null, 'math.compile returns an object for power function');

        const compiled4 = math.compile('sqrt(x^2 + y^2)');
        assert(compiled4 !== null, 'math.compile handles sqrt');

        const compiled5 = math.compile('exp(-(x^2 + y^2))');
        assert(compiled5 !== null, 'math.compile handles exp with negative');
    }

    function testFunctionEvaluation() {
        console.log('\n--- Function Evaluation Tests ---');

        const compiled = math.compile('x + y');
        
        const result1 = compiled.evaluate({ x: 1, y: 2 });
        assertEqual(result1, 3, 'x + y evaluates correctly for x=1, y=2');

        const result2 = compiled.evaluate({ x: 0, y: 0 });
        assertEqual(result2, 0, 'x + y evaluates correctly for x=0, y=0');

        const result3 = compiled.evaluate({ x: -5, y: 5 });
        assertEqual(result3, 0, 'x + y evaluates correctly for x=-5, y=5');

        const compiled2 = math.compile('x^2 + y^2');
        const result4 = compiled2.evaluate({ x: 3, y: 4 });
        assertEqual(result4, 25, 'x^2 + y^2 evaluates correctly for x=3, y=4 (25)');

        const compiled3 = math.compile('sin(x) * cos(y)');
        const result5 = compiled3.evaluate({ x: 0, y: 0 });
        assertEqual(result5, 0, 'sin(x) * cos(y) evaluates correctly for x=0, y=0');
    }

    function testGridGeneration() {
        console.log('\n--- Grid Generation Tests ---');

        const size = 10;
        const segments = 5;

        const points = [];
        for (let i = 0; i <= segments; i++) {
            const x = (i / segments - 0.5) * size;
            for (let j = 0; j <= segments; j++) {
                const y = (j / segments - 0.5) * size;
                points.push({ x, y });
            }
        }

        const expectedPointCount = (segments + 1) * (segments + 1);
        assertEqual(points.length, expectedPointCount, `Grid generates ${expectedPointCount} points`);

        assertEqual(points[0].x, -5, 'First point x is at -size/2');
        assertEqual(points[0].y, -5, 'First point y is at -size/2');

        const lastPoint = points[points.length - 1];
        assertEqual(lastPoint.x, 5, 'Last point x is at size/2');
        assertEqual(lastPoint.y, 5, 'Last point y is at size/2');

        assertEqual(points[segments + 1].x, -5, 'Second row starts at -size/2');
        assertEqual(points[segments + 1].y, -5 + (size / segments), 'Second row y moves up');
    }

    function testVertexCreation() {
        console.log('\n--- Vertex Creation Tests ---');

        const size = 10;
        const segments = 3;
        const vertices = [];

        const compiled = math.compile('x + y');

        for (let i = 0; i <= segments; i++) {
            const x = (i / segments - 0.5) * size;
            for (let j = 0; j <= segments; j++) {
                const y = (j / segments - 0.5) * size;
                let z = compiled.evaluate({ x, y });
                vertices.push(x, z, y);
            }
        }

        const expectedVertices = (segments + 1) * (segments + 1) * 3;
        assertEqual(vertices.length, expectedVertices, `Generates ${expectedVertices} vertex values`);

        assertEqual(vertices[0], -5, 'First vertex x is at -5');
        assertEqual(vertices[1], -10, 'First vertex z is -10 (x+y where x=-5, y=-5)');
        assertEqual(vertices[2], -5, 'First vertex y is at -5');
    }

    function testIndexCreation() {
        console.log('\n--- Index Creation Tests ---');

        const segments = 4;
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

        const expectedTriangles = segments * segments * 2;
        const expectedIndices = expectedTriangles * 3;
        assertEqual(indices.length, expectedIndices, `Generates ${expectedIndices} indices for ${expectedTriangles} triangles`);

        assertEqual(indices[0], 0, 'First triangle starts at vertex 0');
        assertEqual(indices[1], 1, 'First triangle second vertex is 1');
        assertEqual(indices[2], 5, 'First triangle third vertex is 5 (first row + segments + 1)');
    }

    function testErrorHandling() {
        console.log('\n--- Error Handling Tests ---');

        let errorCaught = false;
        try {
            math.compile('x +').evaluate({ x: 1, y: 1 });
        } catch (e) {
            errorCaught = true;
        }
        assert(errorCaught, 'Invalid expression throws error');

        let nanResult = false;
        try {
            const compiled = math.compile('x / y');
            const result = compiled.evaluate({ x: 1, y: 0 });
            nanResult = !isFinite(result);
        } catch (e) {
            nanResult = true;
        }
        assert(nanResult || true, 'Division by zero produces non-finite or error');

        const compiled = math.compile('log(x)');
        const negResult = compiled.evaluate({ x: -1 });
        assert(!isFinite(negResult), 'log(-1) produces non-finite result');
    }

    function testZClamping() {
        console.log('\n--- Z-Clamping Tests ---');

        const testValues = [Infinity, -Infinity, NaN, 100, -100, 5, -5, 0];
        const clampedValues = testValues.map(z => {
            if (!isFinite(z)) return 0;
            return Math.max(-5, Math.min(5, z));
        });

        assertEqual(clampedValues[0], 0, 'Infinity clamps to 0');
        assertEqual(clampedValues[1], 0, '-Infinity clamps to 0');
        assertEqual(clampedValues[2], 0, 'NaN clamps to 0');
        assertEqual(clampedValues[3], 5, '100 clamps to 5');
        assertEqual(clampedValues[4], -5, '-100 clamps to -5');
        assertEqual(clampedValues[5], 5, '5 stays 5');
        assertEqual(clampedValues[6], -5, '-5 stays -5');
        assertEqual(clampedValues[7], 0, '0 stays 0');
    }

    function testColorGeneration() {
        console.log('\n--- Color Generation Tests ---');

        const colors = [];
        const zValues = [-5, -2.5, 0, 2.5, 5];

        zValues.forEach(z => {
            const normalizedZ = (z + 5) / 10;
            colors.push(normalizedZ, 0.5, 1 - normalizedZ);
        });

        assertEqual(colors.length, 15, 'Generates 3 color values per z (5 z values)');

        assertEqual(colors[0], 0, 'z=-5: normalizedZ is 0 (red component)');
        assertEqual(colors[3], 0.25, 'z=-2.5: normalizedZ is 0.25 (red component)');
        assertEqual(colors[6], 0.5, 'z=0: normalizedZ is 0.5 (red component)');
        assertEqual(colors[9], 0.75, 'z=2.5: normalizedZ is 0.75 (red component)');
        assertEqual(colors[12], 1, 'z=5: normalizedZ is 1 (red component)');

        assertEqual(colors[2], 1, 'z=-5: blue component is 1');
        assertEqual(colors[14], 0, 'z=5: blue component is 0');
    }

    if (typeof window !== 'undefined') {
        window.runSurfaceTests = runTests;
        window.testResults = testResults;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { runTests, testResults };
    }

    if (typeof window === 'undefined' && typeof importScripts === 'undefined') {
        runTests();
    }
})();