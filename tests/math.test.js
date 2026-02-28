describe('Matrix Operations', () => {
  function addMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  }

  function subtractMatrices(a, b) {
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  }

  function multiplyMatrices(a, b) {
    const size = a.length;
    const result = [];
    for (let i = 0; i < size; i++) {
      result[i] = [];
      for (let j = 0; j < size; j++) {
        let sum = 0;
        for (let k = 0; k < size; k++) {
          sum += a[i][k] * b[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  function determinant(m) {
    const n = m.length;
    if (n === 1) return m[0][0];
    if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];

    let det = 0;
    for (let j = 0; j < n; j++) {
      const submatrix = m.slice(1).map(row => row.filter((_, colIdx) => colIdx !== j));
      det += Math.pow(-1, j) * m[0][j] * determinant(submatrix);
    }
    return det;
  }

  function transpose(m) {
    return m[0].map((_, j) => m.map(row => row[j]));
  }

  function scaleMatrix(m, scalar) {
    return m.map(row => row.map(val => val * scalar));
  }

  describe('addMatrices', () => {
    test('adds two 2x2 matrices', () => {
      const a = [[1, 2], [3, 4]];
      const b = [[5, 6], [7, 8]];
      const result = addMatrices(a, b);
      expect(result).toEqual([[6, 8], [10, 12]]);
    });

    test('adds two 3x3 matrices', () => {
      const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      const b = [[9, 8, 7], [6, 5, 4], [3, 2, 1]];
      const result = addMatrices(a, b);
      expect(result).toEqual([[10, 10, 10], [10, 10, 10], [10, 10, 10]]);
    });

    test('handles negative numbers', () => {
      const a = [[-1, 2], [3, -4]];
      const b = [[5, -6], [-7, 8]];
      const result = addMatrices(a, b);
      expect(result).toEqual([[4, -4], [-4, 4]]);
    });

    test('handles zeros', () => {
      const a = [[0, 0], [0, 0]];
      const b = [[1, 2], [3, 4]];
      const result = addMatrices(a, b);
      expect(result).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('subtractMatrices', () => {
    test('subtracts two 2x2 matrices', () => {
      const a = [[5, 6], [7, 8]];
      const b = [[1, 2], [3, 4]];
      const result = subtractMatrices(a, b);
      expect(result).toEqual([[4, 4], [4, 4]]);
    });

    test('subtracts two 3x3 matrices', () => {
      const a = [[10, 10, 10], [10, 10, 10], [10, 10, 10]];
      const b = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      const result = subtractMatrices(a, b);
      expect(result).toEqual([[9, 8, 7], [6, 5, 4], [3, 2, 1]]);
    });

    test('handles negative results', () => {
      const a = [[1, 2], [3, 4]];
      const b = [[5, 6], [7, 8]];
      const result = subtractMatrices(a, b);
      expect(result).toEqual([[-4, -4], [-4, -4]]);
    });
  });

  describe('multiplyMatrices', () => {
    test('multiplies two 2x2 matrices', () => {
      const a = [[1, 2], [3, 4]];
      const b = [[5, 6], [7, 8]];
      const result = multiplyMatrices(a, b);
      expect(result).toEqual([[19, 22], [43, 50]]);
    });

    test('multiplies two 3x3 matrices', () => {
      const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      const b = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      const result = multiplyMatrices(a, b);
      expect(result).toEqual(a);
    });

    test('multiplies with identity matrix', () => {
      const a = [[1, 2], [3, 4]];
      const identity = [[1, 0], [0, 1]];
      const result = multiplyMatrices(a, identity);
      expect(result).toEqual(a);
    });

    test('multiplies with zero matrix', () => {
      const a = [[1, 2], [3, 4]];
      const zero = [[0, 0], [0, 0]];
      const result = multiplyMatrices(a, zero);
      expect(result).toEqual([[0, 0], [0, 0]]);
    });
  });

  describe('determinant', () => {
    test('1x1 matrix', () => {
      expect(determinant([[5]])).toBe(5);
      expect(determinant([[-3]])).toBe(-3);
      expect(determinant([[0]])).toBe(0);
    });

    test('2x2 matrix', () => {
      expect(determinant([[1, 2], [3, 4]])).toBe(-2);
      expect(determinant([[4, 3], [2, 1]])).toBe(-2);
      expect(determinant([[1, 0], [0, 1]])).toBe(1);
    });

    test('3x3 matrix', () => {
      const m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      expect(determinant(m)).toBe(0);
    });

    test('singular matrix returns 0', () => {
      const m = [[2, 4, 6], [1, 2, 3], [3, 6, 9]];
      expect(determinant(m)).toBe(0);
    });

    test('non-singular 3x3 matrix', () => {
      const m = [[1, 0, 1], [2, 1, 0], [0, 1, 1]];
      expect(determinant(m)).toBe(3);
    });
  });

  describe('transpose', () => {
    test('transposes 2x2 matrix', () => {
      const m = [[1, 2], [3, 4]];
      expect(transpose(m)).toEqual([[1, 3], [2, 4]]);
    });

    test('transposes 3x3 matrix', () => {
      const m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      expect(transpose(m)).toEqual([[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
    });

    test('transposes non-square matrix (2x3)', () => {
      const m = [[1, 2, 3], [4, 5, 6]];
      expect(transpose(m)).toEqual([[1, 4], [2, 5], [3, 6]]);
    });

    test('transpose of identity is identity', () => {
      const identity = [[1, 0], [0, 1]];
      expect(transpose(identity)).toEqual(identity);
    });
  });

  describe('scaleMatrix', () => {
    test('scales by positive scalar', () => {
      const m = [[1, 2], [3, 4]];
      expect(scaleMatrix(m, 2)).toEqual([[2, 4], [6, 8]]);
    });

    test('scales by negative scalar', () => {
      const m = [[1, 2], [3, 4]];
      expect(scaleMatrix(m, -1)).toEqual([[-1, -2], [-3, -4]]);
    });

    test('scales by zero', () => {
      const m = [[1, 2], [3, 4]];
      expect(scaleMatrix(m, 0)).toEqual([[0, 0], [0, 0]]);
    });

    test('scales by fraction', () => {
      const m = [[1, 2], [3, 4]];
      expect(scaleMatrix(m, 0.5)).toEqual([[0.5, 1], [1.5, 2]]);
    });
  });
});

describe('Vector Operations', () => {
  function addVectors(vecA, vecB) {
    return {
      x: vecA.x + vecB.x,
      y: vecA.y + vecB.y,
      z: vecA.z + vecB.z
    };
  }

  function subtractVectors(vecA, vecB) {
    return {
      x: vecA.x - vecB.x,
      y: vecA.y - vecB.y,
      z: vecA.z - vecB.z
    };
  }

  function dotProduct(vecA, vecB) {
    return vecA.x * vecB.x + vecA.y * vecB.y + vecA.z * vecB.z;
  }

  function crossProduct(vecA, vecB) {
    return {
      x: vecA.y * vecB.z - vecA.z * vecB.y,
      y: vecA.z * vecB.x - vecA.x * vecB.z,
      z: vecA.x * vecB.y - vecA.y * vecB.x
    };
  }

  function magnitude(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
  }

  function normalize(vec) {
    const mag = magnitude(vec);
    if (mag === 0) return { x: 0, y: 0, z: 0 };
    return {
      x: vec.x / mag,
      y: vec.y / mag,
      z: vec.z / mag
    };
  }

  function distance(vecA, vecB) {
    const dx = vecA.x - vecB.x;
    const dy = vecA.y - vecB.y;
    const dz = vecA.z - vecB.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function angleBetween(vecA, vecB) {
    const dot = dotProduct(vecA, vecB);
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);
    if (magA === 0 || magB === 0) return null;
    const cosAngle = Math.max(-1, Math.min(1, dot / (magA * magB)));
    return Math.acos(cosAngle) * (180 / Math.PI);
  }

  describe('addVectors', () => {
    test('adds two 3D vectors', () => {
      const a = { x: 1, y: 2, z: 3 };
      const b = { x: 4, y: 5, z: 6 };
      const result = addVectors(a, b);
      expect(result).toEqual({ x: 5, y: 7, z: 9 });
    });

    test('handles negative vectors', () => {
      const a = { x: -1, y: 2, z: -3 };
      const b = { x: 4, y: -5, z: 6 };
      const result = addVectors(a, b);
      expect(result).toEqual({ x: 3, y: -3, z: 3 });
    });
  });

  describe('subtractVectors', () => {
    test('subtracts two 3D vectors', () => {
      const a = { x: 4, y: 5, z: 6 };
      const b = { x: 1, y: 2, z: 3 };
      const result = subtractVectors(a, b);
      expect(result).toEqual({ x: 3, y: 3, z: 3 });
    });
  });

  describe('dotProduct', () => {
    test('computes dot product', () => {
      const a = { x: 1, y: 2, z: 3 };
      const b = { x: 4, y: 5, z: 6 };
      expect(dotProduct(a, b)).toBe(32);
    });

    test('orthogonal vectors return 0', () => {
      const a = { x: 1, y: 0, z: 0 };
      const b = { x: 0, y: 1, z: 0 };
      expect(dotProduct(a, b)).toBe(0);
    });

    test('parallel vectors', () => {
      const a = { x: 1, y: 1, z: 1 };
      const b = { x: 2, y: 2, z: 2 };
      expect(dotProduct(a, b)).toBe(6);
    });
  });

  describe('crossProduct', () => {
    test('computes cross product', () => {
      const a = { x: 1, y: 0, z: 0 };
      const b = { x: 0, y: 1, z: 0 };
      const result = crossProduct(a, b);
      expect(result).toEqual({ x: 0, y: 0, z: 1 });
    });

    test('cross product of parallel vectors is zero', () => {
      const a = { x: 1, y: 1, z: 1 };
      const b = { x: 2, y: 2, z: 2 };
      const result = crossProduct(a, b);
      expect(result).toEqual({ x: 0, y: 0, z: 0 });
    });

    test('cross product order matters', () => {
      const a = { x: 1, y: 2, z: 3 };
      const b = { x: 4, y: 5, z: 6 };
      const ab = crossProduct(a, b);
      const ba = crossProduct(b, a);
      expect(ab.x).toBe(-ba.x);
      expect(ab.y).toBe(-ba.y);
      expect(ab.z).toBe(-ba.z);
    });
  });

  describe('magnitude', () => {
    test('computes magnitude', () => {
      const v = { x: 3, y: 4, z: 0 };
      expect(magnitude(v)).toBe(5);
    });

    test('magnitude of zero vector is 0', () => {
      const v = { x: 0, y: 0, z: 0 };
      expect(magnitude(v)).toBe(0);
    });

    test('3D magnitude', () => {
      const v = { x: 1, y: 2, z: 2 };
      expect(magnitude(v)).toBe(3);
    });
  });

  describe('normalize', () => {
    test('normalizes non-zero vector', () => {
      const v = { x: 3, y: 4, z: 0 };
      const result = normalize(v);
      expect(result.x).toBeCloseTo(0.6);
      expect(result.y).toBeCloseTo(0.8);
      expect(result.z).toBe(0);
    });

    test('zero vector normalizes to zero', () => {
      const v = { x: 0, y: 0, z: 0 };
      const result = normalize(v);
      expect(result).toEqual({ x: 0, y: 0, z: 0 });
    });
  });

  describe('distance', () => {
    test('computes distance between points', () => {
      const a = { x: 0, y: 0, z: 0 };
      const b = { x: 3, y: 4, z: 0 };
      expect(distance(a, b)).toBe(5);
    });

    test('distance is always positive', () => {
      const a = { x: 5, y: 5, z: 5 };
      const b = { x: 2, y: 2, z: 2 };
      expect(distance(a, b)).toBe(distance(b, a));
    });
  });

  describe('angleBetween', () => {
    test('angle between parallel vectors is 0', () => {
      const a = { x: 1, y: 0, z: 0 };
      const b = { x: 2, y: 0, z: 0 };
      expect(angleBetween(a, b)).toBe(0);
    });

    test('angle between orthogonal vectors is 90', () => {
      const a = { x: 1, y: 0, z: 0 };
      const b = { x: 0, y: 1, z: 0 };
      expect(angleBetween(a, b)).toBe(90);
    });

    test('returns null for zero vector', () => {
      const a = { x: 0, y: 0, z: 0 };
      const b = { x: 1, y: 1, z: 1 };
      expect(angleBetween(a, b)).toBeNull();
    });

    test('45 degree angle', () => {
      const a = { x: 1, y: 0, z: 0 };
      const b = { x: 1, y: 1, z: 0 };
      expect(angleBetween(a, b)).toBeCloseTo(45);
    });
  });
});

describe('Expression Evaluation', () => {
  test('evaluates basic arithmetic', () => {
    expect(math.evaluate('2 + 2')).toBe(4);
    expect(math.evaluate('10 - 3')).toBe(7);
    expect(math.evaluate('3 * 4')).toBe(12);
    expect(math.evaluate('10 / 2')).toBe(5);
  });

  test('evaluates exponentiation', () => {
    expect(math.evaluate('2^3')).toBe(8);
    expect(math.evaluate('3^2')).toBe(9);
  });

  test('evaluates trigonometric functions', () => {
    expect(math.evaluate('sin(0)')).toBeCloseTo(0);
    expect(math.evaluate('cos(0)')).toBeCloseTo(1);
    expect(math.evaluate('tan(0)')).toBeCloseTo(0);
  });

  test('evaluates complex expressions', () => {
    expect(math.evaluate('2 + 3 * 4')).toBe(14);
    expect(math.evaluate('(2 + 3) * 4')).toBe(20);
    expect(math.evaluate('sqrt(16)')).toBe(4);
  });

  test('throws on invalid expression', () => {
    expect(() => math.evaluate('2 +')).toThrow();
    expect(() => math.evaluate('sqrt()')).toThrow();
  });
});