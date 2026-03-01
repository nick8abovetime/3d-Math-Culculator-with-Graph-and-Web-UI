#!/usr/bin/env python3
"""
Python-based test runner for 2D Graph tests.
This validates the test cases without requiring Node.js/npm.
"""

import math
import sys
from typing import Callable, Any

# Colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

passed = 0
failed = 0
results = []


def test(name: str, fn: Callable[[], None]) -> None:
    """Run a test and record the result."""
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


def assert_equal(actual: Any, expected: Any, message: str = "") -> None:
    """Assert that actual equals expected."""
    if actual != expected:
        raise AssertionError(f"Expected {expected}, got {actual}. {message}")


def assert_true(value: bool, message: str = "") -> None:
    """Assert that value is True."""
    if not value:
        raise AssertionError(f"Expected True, got {value}. {message}")


def assert_false(value: bool, message: str = "") -> None:
    """Assert that value is False."""
    if value:
        raise AssertionError(f"Expected False, got {value}. {message}")


def assert_in_range(
    value: float, min_val: float, max_val: float, message: str = ""
) -> None:
    """Assert that value is within range [min_val, max_val]."""
    if not (min_val <= value <= max_val):
        raise AssertionError(
            f"Expected {value} to be in range [{min_val}, {max_val}]. {message}"
        )


# Python implementations of getYMin and getYMax (equivalent to JS versions)
def get_y_min(expr: str, x_min: float, x_max: float) -> float:
    """Calculate minimum Y value for a function expression."""
    min_val = float("inf")
    steps = 100

    for i in range(steps + 1):
        x = x_min + (x_max - x_min) * i / steps
        try:
            y = eval(
                expr,
                {
                    "x": x,
                    "sin": math.sin,
                    "cos": math.cos,
                    "sqrt": math.sqrt,
                    "abs": abs,
                    "exp": math.exp,
                    "pi": math.pi,
                },
            )
            if isinstance(y, (int, float)) and math.isfinite(y) and y < min_val:
                min_val = y
        except:
            pass

    return min_val if min_val != float("inf") else -10


def get_y_max(expr: str, x_min: float, x_max: float) -> float:
    """Calculate maximum Y value for a function expression."""
    max_val = float("-inf")
    steps = 100

    for i in range(steps + 1):
        x = x_min + (x_max - x_min) * i / steps
        try:
            y = eval(
                expr,
                {
                    "x": x,
                    "sin": math.sin,
                    "cos": math.cos,
                    "sqrt": math.sqrt,
                    "abs": abs,
                    "exp": math.exp,
                    "pi": math.pi,
                },
            )
            if isinstance(y, (int, float)) and math.isfinite(y) and y > max_val:
                max_val = y
        except:
            pass

    return max_val if max_val != float("-inf") else 10


if __name__ == "__main__":
    # Test cases
    print("=" * 60)
    print("2D Graph Tests")
    print("=" * 60)
    print()

    # Test 1: Linear function y = x
    test(
        "getYMin: Linear function y = x on [-5, 5]",
        lambda: assert_in_range(get_y_min("x", -5, 5), -5.1, -4.9),
    )

    test(
        "getYMax: Linear function y = x on [-5, 5]",
        lambda: assert_in_range(get_y_max("x", -5, 5), 4.9, 5.1),
    )

    # Test 2: Quadratic function y = x^2
    test(
        "getYMin: Quadratic y = x^2 on [-3, 3]",
        lambda: assert_in_range(get_y_min("x**2", -3, 3), -0.1, 0.1),
    )

    test(
        "getYMax: Quadratic y = x^2 on [-3, 3]",
        lambda: assert_in_range(get_y_max("x**2", -3, 3), 8.9, 9.1),
    )

    # Test 3: Sin function y = sin(x)
    test(
        "getYMin: Sin function y = sin(x) on [0, 2*pi]",
        lambda: assert_in_range(get_y_min("sin(x)", 0, 2 * math.pi), -1.1, -0.9),
    )

    test(
        "getYMax: Sin function y = sin(x) on [0, 2*pi]",
        lambda: assert_in_range(get_y_max("sin(x)", 0, 2 * math.pi), 0.9, 1.1),
    )

    # Test 4: Constant function y = 5
    test("getYMin: Constant y = 5", lambda: assert_equal(get_y_min("5", -10, 10), 5))

    test("getYMax: Constant y = 5", lambda: assert_equal(get_y_max("5", -10, 10), 5))

    # Test 5: Absolute value y = abs(x)
    test(
        "getYMin: Absolute value y = abs(x) on [-5, 5]",
        lambda: assert_in_range(get_y_min("abs(x)", -5, 5), -0.1, 0.1),
    )

    # Test 6: Square root y = sqrt(x)
    test(
        "getYMin: Square root y = sqrt(x) on [0, 9]",
        lambda: assert_in_range(get_y_min("sqrt(x)", 0, 9), -0.1, 0.1),
    )

    test(
        "getYMax: Square root y = sqrt(x) on [0, 9]",
        lambda: assert_in_range(get_y_max("sqrt(x)", 0, 9), 2.9, 3.1),
    )

    # Test 7: Invalid expression handling
    test(
        "getYMin: Invalid expression returns default",
        lambda: assert_equal(get_y_min("invalid_func(x)", -5, 5), -10),
    )

    test(
        "getYMax: Invalid expression returns default",
        lambda: assert_equal(get_y_max("invalid_func(x)", -5, 5), 10),
    )

    # Test 8: Exponential function y = exp(x)
    test(
        "getYMin: Exponential y = exp(x) on [0, 2]",
        lambda: assert_in_range(get_y_min("exp(x)", 0, 2), 0.9, 1.1),
    )

    test(
        "getYMax: Exponential y = exp(x) on [0, 2]",
        lambda: assert_in_range(get_y_max("exp(x)", 0, 2), 7.2, 7.5),
    )

    # Test 9: Combined function y = sin(x) + cos(x)
    test(
        "getYMin: Combined sin(x) + cos(x) on [0, 2*pi]",
        lambda: assert_in_range(
            get_y_min("sin(x) + cos(x)", 0, 2 * math.pi), -1.5, -1.3
        ),
    )

    # Test 10: Edge case - very small range
    test(
        "getYMin: Small range [-0.1, 0.1] with x^2",
        lambda: assert_in_range(get_y_min("x**2", -0.1, 0.1), -0.01, 0.01),
    )

    # Summary
    print()
    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 60)

    if failed > 0:
        sys.exit(1)
    else:
        print(f"{GREEN}All tests passed!{RESET}")
        sys.exit(0)
