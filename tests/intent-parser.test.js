function runIntentParserTests() {
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

    console.log('=== Intent Parser Tests ===\n');

    // Test parsing expressions
    const testExpr1 = IntentParser.parse('2 + 2');
    assert(testExpr1.type === 'expression', 'Parses simple expression');
    assertEqual(testExpr1.expression, '2 + 2', 'Expression is correct');

    // Test parsing 2D plot commands
    const testPlot1 = IntentParser.parse('plot sin(x)');
    assert(testPlot1.type === 'plot_2d', 'Parses plot command');
    assertEqual(testPlot1.function, 'sin(x)', 'Plot function is correct');

    const testPlot2 = IntentParser.parse('plot x^2 from x=-5 to x=5');
    assert(testPlot2.type === 'plot_2d', 'Parses plot with range');
    assertEqual(testPlot2.min1, -5, 'Min range is correct');
    assertEqual(testPlot2.max1, 5, 'Max range is correct');

    // Test parsing 3D surface commands
    const testSurf1 = IntentParser.parse('surface sin(x)*cos(y)');
    assert(testSurf1.type === 'plot_3d', 'Parses surface command');
    assertEqual(testSurf1.function, 'sin(x)*cos(y)', 'Surface function is correct');

    // Test vector operations
    const testDot = IntentParser.parse('dot [1,2,3] and [4,5,6]');
    assert(testDot.type === 'vector_dot', 'Parses dot product');
    assertEqual(testDot.vectorA[0], 1, 'Dot vector A first element');
    assertEqual(testDot.vectorB[0], 4, 'Dot vector B first element');

    const testCross = IntentParser.parse('cross [1,0,0] and [0,1,0]');
    assert(testCross.type === 'vector_cross', 'Parses cross product');

    const testAdd = IntentParser.parse('add [1,2] and [3,4]');
    assert(testAdd.type === 'vector_add', 'Parses vector add');

    const testMag = IntentParser.parse('magnitude of [3,4,0]');
    assert(testMag.type === 'vector_magnitude', 'Parses magnitude');

    const testNorm = IntentParser.parse('normalize [1,1,1]');
    assert(testNorm.type === 'vector_normalize', 'Parses normalize');

    const testDist = IntentParser.parse('distance [0,0,0] and [3,4,0]');
    assert(testDist.type === 'vector_distance', 'Parses distance');

    const testAngle = IntentParser.parse('angle [1,0] and [0,1]');
    assert(testAngle.type === 'vector_angle', 'Parses angle');

    // Test matrix operations
    const testDet = IntentParser.parse('det 3x3 1,0,0,0,1,0,0,0,1');
    assert(testDet.type === 'matrix_determinant', 'Parses determinant');
    assertEqual(testDet.rows, 3, 'Matrix rows');

    // Test execution
    console.log('\n--- Execution Tests ---');

    const execDot = IntentParser.execute({ type: 'vector_dot', vectorA: [1, 2, 3], vectorB: [4, 5, 6] });
    assertEqual(execDot.result, '32.0000', 'Dot product execution');

    const execCross = IntentParser.execute({ type: 'vector_cross', vectorA: [1, 0, 0], vectorB: [0, 1, 0] });
    assert(execCross.result.includes('0'), 'Cross product execution');

    const execMag = IntentParser.execute({ type: 'vector_magnitude', vector: [3, 4, 0] });
    assertEqual(execMag.result, '5.0000', 'Magnitude execution');

    const execNorm = IntentParser.execute({ type: 'vector_normalize', vector: [1, 1, 1] });
    assert(execNorm.result.includes('0.577'), 'Normalize execution');

    const execDist = IntentParser.execute({ type: 'vector_distance', vectorA: [0, 0, 0], vectorB: [3, 4, 0] });
    assertEqual(execDist.result, '5.0000', 'Distance execution');

    const execAngle = IntentParser.execute({ type: 'vector_angle', vectorA: [1, 0], vectorB: [0, 1] });
    assertEqual(execAngle.result, '90.00°', 'Angle execution');

    const execDet = IntentParser.execute({ type: 'matrix_determinant', rows: 3, cols: 3, data: [1, 0, 0, 0, 1, 0, 0, 0, 1] });
    assertEqual(execDet.result, '1.0000', 'Determinant of identity');

    const execTrans = IntentParser.execute({ type: 'matrix_transpose', rows: 2, cols: 2, data: [1, 2, 3, 4] });
    assert(execTrans.result.includes('<td>1</td>'), 'Transpose execution');

    const execExpr = IntentParser.execute({ type: 'expression', expression: '2 + 2' });
    assertEqual(execExpr.result, '4', 'Expression execution');

    console.log('\n=== Test Results ===');
    console.log(`Total: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);

    return testResults;
}

if (typeof window !== 'undefined') {
    window.runIntentParserTests = runIntentParserTests;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runIntentParserTests };
}