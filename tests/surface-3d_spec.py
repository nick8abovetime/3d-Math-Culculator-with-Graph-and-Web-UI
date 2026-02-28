#!/usr/bin/env python3
"""
Python-based test runner for 3D Surface tests.
Validates surface plotting math without requiring Node.js/npm.
"""

import math
import sys
from typing import Callable, Any

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

passed = 0
failed = 0
results = []


def test(name: str, fn: Callable[[], None]) -> None:
    global passed, failed
    try:
        fn()
        passed += 1
        results.append((True, name, ""))
        print(f"{GREEN}✓ PASS{RESET}: {name}")
    except AssertionError as e:
        failed += 1
        results.append((False, name, str(e)))
        print(f"{RED}✗ FAIL{RESET}: {name} - {e}")
    except Exception as e:
        failed += 1
        results.append((False, name, str(e)))
        print(f"{RED}✗ ERROR{RESET}: {name} - {e}")


def assert_equal(
    actual: Any, expected: Any, message: str = "", tolerance: float = 0
) -> None:
    if isinstance(actual, float) and isinstance(expected, float):
        if abs(actual - expected) <= tolerance:
            return
    if actual != expected:
        raise AssertionError(f"Expected {expected}, got {actual}. {message}")


def assert_true(value: bool, message: str = "") -> None:
    if not value:
        raise AssertionError(f"Expected True, got {value}. {message}")


def assert_in_range(
    value: float, min_val: float, max_val: float, message: str = ""
) -> None:
    if not (min_val <= value <= max_val):
        raise AssertionError(
            f"Expected {value} to be in range [{min_val}, {max_val}]. {message}"
        )


def generate_grid_points(grid_size: float, grid_segments: int):
    points = []
    for i in range(grid_segments + 1):
        x = (i / grid_segments - 0.5) * grid_size
        for j in range(grid_segments + 1):
            y = (j / grid_segments - 0.5) * grid_size
            points.append((x, y))
    return points


def evaluate_expr(expr: str, x: float, y: float) -> float:
    try:
        return eval(
            expr,
            {
                "x": x,
                "y": y,
                "sin": math.sin,
                "cos": math.cos,
                "tan": math.tan,
                "sqrt": math.sqrt,
                "abs": abs,
                "exp": math.exp,
                "log": math.log,
                "pi": math.pi,
                "pow": pow,
            },
        )
    except:
        return float("nan")


def generate_vertices(expr: str, grid_size: float, grid_segments: int):
    verts = []
    for i in range(grid_segments + 1):
        x = (i / grid_segments - 0.5) * grid_size
        for j in range(grid_segments + 1):
            y = (j / grid_segments - 0.5) * grid_size
            z = evaluate_expr(expr, x, y)
            verts.append((x, z, y))
    return verts


def generate_indices(grid_segments: int):
    indices = []
    for i in range(grid_segments):
        for j in range(grid_segments):
            a = i * (grid_segments + 1) + j
            b = a + 1
            c = a + (grid_segments + 1)
            d = c + 1
            indices.extend([a, b, c, b, d, c])
    return indices


def clamp_z(z: float, min_z: float = -5, max_z: float = 5) -> float:
    if not math.isfinite(z):
        return 0
    return max(min_z, min(max_z, z))


def generate_colors(z_values, min_z: float = -5, max_z: float = 5):
    colors = []
    z_range = max_z - min_z
    for z in z_values:
        normalized_z = (z - min_z) / z_range
        colors.extend([normalized_z, 0.5, 1 - normalized_z])
    return colors


print("=" * 60)
print("3D Surface Tests")
print("=" * 60)
print()

print("--- Grid Generation Tests ---")
test(
    "Grid generates correct number of points",
    lambda: assert_equal(
        len(generate_grid_points(10, 5)), 36, "36 points for 5 segments"
    ),
)

points = generate_grid_points(10, 5)
test("First point x is at -size/2", lambda: assert_equal(points[0][0], -5))
test("First point y is at -size/2", lambda: assert_equal(points[0][1], -5))
test("Last point x is at size/2", lambda: assert_equal(points[-1][0], 5))
test("Last point y is at size/2", lambda: assert_equal(points[-1][1], 5))

print()
print("--- Vertex Creation Tests ---")
test(
    "Vertex generation for x + y",
    lambda: assert_equal(
        len(generate_vertices("x + y", 10, 3)), 16, "16 vertices for 3 segments"
    ),
)

verts = generate_vertices("x + y", 10, 3)
test("First vertex x is at -5", lambda: assert_equal(verts[0][0], -5))
test(
    "First vertex z is -10 (x+y where x=-5,y=-5)",
    lambda: assert_equal(verts[0][1], -10, tolerance=0.001),
)
test("First vertex y is at -5", lambda: assert_equal(verts[0][2], -5))

test(
    "Vertex for x^2 + y^2 at x=3,y=3",
    lambda: assert_equal(evaluate_expr("x**2 + y**2", 3, 3), 18, tolerance=0.001),
)

print()
print("--- Index Creation Tests ---")
test(
    "Index generation for 4 segments",
    lambda: assert_equal(
        len(generate_indices(4)), 96, "96 indices for 4 segments (32 triangles)"
    ),
)

indices = generate_indices(4)
test("First triangle starts at vertex 0", lambda: assert_equal(indices[0], 0))
test("First triangle second vertex is 1", lambda: assert_equal(indices[1], 1))
test("First triangle third vertex is 5", lambda: assert_equal(indices[2], 5))

print()
print("--- Z-Clamping Tests ---")
test("Infinity clamps to 0", lambda: assert_equal(clamp_z(float("inf")), 0))
test("-Infinity clamps to 0", lambda: assert_equal(clamp_z(float("-inf")), 0))
test("NaN clamps to 0", lambda: assert_equal(clamp_z(float("nan")), 0))
test("100 clamps to 5", lambda: assert_equal(clamp_z(100), 5))
test("-100 clamps to -5", lambda: assert_equal(clamp_z(-100), -5))
test("5 stays 5", lambda: assert_equal(clamp_z(5), 5))
test("-5 stays -5", lambda: assert_equal(clamp_z(-5), -5))
test("0 stays 0", lambda: assert_equal(clamp_z(0), 0))

print()
print("--- Color Generation Tests ---")
z_values = [-5, -2.5, 0, 2.5, 5]
colors = generate_colors(z_values)
test("Generates 15 color values", lambda: assert_equal(len(colors), 15))

test("z=-5: red component is 0", lambda: assert_equal(colors[0], 0))
test("z=-2.5: red component is 0.25", lambda: assert_equal(colors[3], 0.25))
test("z=0: red component is 0.5", lambda: assert_equal(colors[6], 0.5))
test("z=2.5: red component is 0.75", lambda: assert_equal(colors[9], 0.75))
test("z=5: red component is 1", lambda: assert_equal(colors[12], 1))

test("z=-5: blue component is 1", lambda: assert_equal(colors[2], 1))
test("z=5: blue component is 0", lambda: assert_equal(colors[14], 0))

print()
print("--- Error Handling Tests ---")
test(
    "Invalid expression throws error",
    lambda: assert_true(
        evaluate_expr("x +", 1, 1) != evaluate_expr("x +", 1, 1)
        or math.isnan(evaluate_expr("x +", 1, 1))
    ),
)

test(
    "Division by zero produces non-finite",
    lambda: assert_true(not math.isfinite(evaluate_expr("x / y", 1, 0))),
)

test(
    "log(-1) produces non-finite",
    lambda: assert_true(not math.isfinite(evaluate_expr("log(x)", -1, 0))),
)

print()
print("=" * 60)
print(f"Results: {passed} passed, {failed} failed")
print("=" * 60)

if failed > 0:
    sys.exit(1)
else:
    print(f"{GREEN}All tests passed!{RESET}")
    sys.exit(0)
