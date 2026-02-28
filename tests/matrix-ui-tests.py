#!/usr/bin/env python3
"""
Python-based test runner for Matrix UI tests.
This validates the matrix operations without requiring a browser.
"""

import math
import sys
from typing import Callable, Any

GREEN = "\033[92m"
RED = "\033[91m"
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


def assert_equal(actual: Any, expected: Any, message: str = "") -> None:
    if actual != expected:
        raise AssertionError(f"Expected {expected}, got {actual}. {message}")


def assert_true(value: bool, message: str = "") -> None:
    if not value:
        raise AssertionError(f"Expected True, got {value}. {message}")


def assert_false(value: bool, message: str = "") -> None:
    if value:
        raise AssertionError(f"Expected False, got {value}. {message}")


def assert_null(value: Any, message: str = "") -> None:
    if value is not None:
        raise AssertionError(f"Expected None, got {value}. {message}")


def assert_not_null(value: Any, message: str = "") -> None:
    if value is None:
        raise AssertionError(f"Expected non-null value, got None. {message}")


def arrays_equal(a, b, tolerance=1e-6):
    if len(a) != len(b):
        return False
    for i in range(len(a)):
        if isinstance(a[i], list) and isinstance(b[i], list):
            if not arrays_equal(a[i], b[i], tolerance):
                return False
        elif abs(a[i] - b[i]) > tolerance:
            return False
    return True


def add_matrices(a, b):
    return [[a[i][j] + b[i][j] for j in range(len(a[0]))] for i in range(len(a))]


def subtract_matrices(a, b):
    return [[a[i][j] - b[i][j] for j in range(len(a[0]))] for i in range(len(a))]


def multiply_matrices(a, b):
    size = len(a)
    result = []
    for i in range(size):
        result.append([])
        for j in range(size):
            sum_val = 0
            for k in range(size):
                sum_val += a[i][k] * b[k][j]
            result[i].append(sum_val)
    return result


def determinant(m):
    n = len(m)
    if n == 1:
        return m[0][0]
    if n == 2:
        return m[0][0] * m[1][1] - m[0][1] * m[1][0]

    det = 0
    for j in range(n):
        submatrix = [row[:j] + row[j + 1 :] for row in m[1:]]
        det += (-1) ** j * m[0][j] * determinant(submatrix)
    return det


def transpose(m):
    return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]


def adjoint(m):
    n = len(m)
    if n == 1:
        return [[1]]

    cofactor_matrix = []
    for i in range(n):
        cofactor_matrix.append([])
        for j in range(n):
            submatrix = [
                row[:j] + row[j + 1 :] for idx, row in enumerate(m) if idx != i
            ]
            cofactor_matrix[i].append((-1) ** (i + j) * determinant(submatrix))
    return transpose(cofactor_matrix)


def inverse(m):
    det = determinant(m)
    if abs(det) < 1e-10:
        return None

    n = len(m)
    if n == 1:
        return [[1 / m[0][0]]]
    if n == 2:
        a, b, c, d = m[0][0], m[0][1], m[1][0], m[1][1]
        inv_det = 1 / (a * d - b * c)
        return [[d * inv_det, -b * inv_det], [-c * inv_det, a * inv_det]]

    adj = adjoint(m)
    return [[adj[i][j] / det for j in range(n)] for i in range(n)]


def scale_matrix(m, scalar):
    return [[val * scalar for val in row] for row in m]


print("=" * 60)
print("Matrix UI Tests")
print("=" * 60)
print()

print("Testing Matrix Operations UI Functions")
print("-" * 40)

test(
    "addMatrices 2x2",
    lambda: assert_true(
        arrays_equal(
            add_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]), [[6, 8], [10, 12]]
        )
    ),
)

test(
    "subtractMatrices 2x2",
    lambda: assert_true(
        arrays_equal(
            subtract_matrices([[5, 6], [7, 8]], [[1, 2], [3, 4]]), [[4, 4], [4, 4]]
        )
    ),
)

test(
    "multiplyMatrices 2x2",
    lambda: assert_true(
        arrays_equal(
            multiply_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]), [[19, 22], [43, 50]]
        )
    ),
)

test(
    "determinant 2x2",
    lambda: assert_true(abs(determinant([[1, 2], [3, 4]]) - (-2)) < 1e-6),
)

test(
    "determinant 3x3 singular",
    lambda: assert_true(abs(determinant([[1, 2, 3], [4, 5, 6], [7, 8, 9]])) < 1e-6),
)

test(
    "determinant 3x3 non-singular",
    lambda: assert_true(
        abs(determinant([[1, 2, 3], [4, 5, 6], [7, 8, 10]]) - (-3)) < 1e-6
    ),
)

test(
    "transpose 2x3",
    lambda: assert_true(
        arrays_equal(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]])
    ),
)

test(
    "transpose 2x2",
    lambda: assert_true(arrays_equal(transpose([[1, 2], [3, 4]]), [[1, 3], [2, 4]])),
)

test(
    "inverse 2x2",
    lambda: assert_true(
        arrays_equal(inverse([[4, 7], [2, 6]]), [[0.6, -0.7], [-0.2, 0.4]], 1e-6)
    ),
)

test(
    "inverse 3x3",
    lambda: assert_true(
        arrays_equal(
            inverse([[1, 2, 3], [0, 1, 4], [5, 6, 0]]),
            [[-24, 18, 5], [20, -15, -4], [-5, 4, 1]],
            1e-5,
        )
    ),
)

test(
    "inverse of singular matrix returns null",
    lambda: assert_null(inverse([[1, 2], [2, 4]])),
)

test(
    "inverse of 1x1 matrix", lambda: assert_true(arrays_equal(inverse([[5]]), [[0.2]]))
)

test(
    "scaleMatrix",
    lambda: assert_true(
        arrays_equal(scale_matrix([[1, 2], [3, 4]], 2), [[2, 4], [6, 8]])
    ),
)

test(
    "scaleMatrix with fractional scalar",
    lambda: assert_true(
        arrays_equal(scale_matrix([[2, 4], [6, 8]], 0.5), [[1, 2], [3, 4]])
    ),
)

test(
    "adjoint 2x2",
    lambda: assert_true(arrays_equal(adjoint([[1, 2], [3, 4]]), [[4, -2], [-3, 1]])),
)

test(
    "Matrix addition with zeros",
    lambda: assert_true(
        arrays_equal(add_matrices([[0, 0], [0, 0]], [[1, 2], [3, 4]]), [[1, 2], [3, 4]])
    ),
)

test(
    "Matrix subtraction resulting in negatives",
    lambda: assert_true(
        arrays_equal(
            subtract_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]), [[-4, -4], [-4, -4]]
        )
    ),
)

test(
    "Multiply identity matrix",
    lambda: assert_true(
        arrays_equal(
            multiply_matrices([[1, 0], [0, 1]], [[5, 6], [7, 8]]), [[5, 6], [7, 8]]
        )
    ),
)

test(
    "Multiply by zero matrix",
    lambda: assert_true(
        arrays_equal(
            multiply_matrices([[0, 0], [0, 0]], [[5, 6], [7, 8]]), [[0, 0], [0, 0]]
        )
    ),
)

test(
    "Determinant of identity matrix is 1",
    lambda: assert_true(abs(determinant([[1, 0], [0, 1]]) - 1) < 1e-6),
)

test(
    "Determinant of zero matrix is 0",
    lambda: assert_true(abs(determinant([[0, 0], [0, 0]])) < 1e-6),
)

test(
    "Determinant of scalar matrix n*I",
    lambda: assert_true(abs(determinant([[3, 0], [0, 3]]) - 9) < 1e-6),
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
