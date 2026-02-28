# 2D Graph Tests

This directory contains tests for the 2D Graph functionality in the math_3d project.

## Test Files

- `test-runner.html` - Browser-based test runner that runs tests in the browser
- `test_spec.py` - Python-based test runner for CI/CD pipelines

## Running Tests

### Browser-based Tests

Open `test-runner.html` in a web browser to run the tests interactively.

```bash
# Or serve the files with a local server
python3 -m http.server 8000
# Then open http://localhost:8000/tests/test-runner.html
```

### Python-based Tests

Run the Python test runner:

```bash
python3 tests/test_spec.py
```

## Test Coverage

The 2D Graph tests cover:

1. **Linear Functions**: Testing y = x
2. **Quadratic Functions**: Testing y = x^2
3. **Trigonometric Functions**: Testing y = sin(x), y = cos(x)
4. **Constant Functions**: Testing y = c
5. **Absolute Value**: Testing y = abs(x)
6. **Square Root**: Testing y = sqrt(x)
7. **Exponential Functions**: Testing y = exp(x)
8. **Combined Functions**: Testing y = sin(x) + cos(x)
9. **Invalid Expression Handling**: Testing error cases
10. **Edge Cases**: Testing small ranges and boundary conditions

## Implementation Details

The 2D Graph functionality consists of:

- `drawGraph()` - Main function that draws the graph on canvas
- `getYMin()` - Calculates the minimum Y value for a given function and X range
- `getYMax()` - Calculates the maximum Y value for a given function and X range

The tests focus on the pure functions `getYMin` and `getYMax` as these can be tested without DOM manipulation.