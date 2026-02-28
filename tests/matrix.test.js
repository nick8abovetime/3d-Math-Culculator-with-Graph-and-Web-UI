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

function adjoint(m) {
  const n = m.length;
  if (n === 1) return [[1]];
  
  const cofactorMatrix = [];
  for (let i = 0; i < n; i++) {
    cofactorMatrix[i] = [];
    for (let j = 0; j < n; j++) {
      const submatrix = m.filter((_, rowIdx) => rowIdx !== i)
        .map(row => row.filter((_, colIdx) => colIdx !== j));
      cofactorMatrix[i][j] = Math.pow(-1, i + j) * determinant(submatrix);
    }
  }
  return transpose(cofactorMatrix);
}

function inverse(m) {
  const det = determinant(m);
  if (Math.abs(det) < 1e-10) return null;
  
  const n = m.length;
  if (n === 1) return [[1 / m[0][0]]];
  if (n === 2) {
    const [[a, b], [c, d]] = m;
    const invDet = 1 / (a * d - b * c);
    return [[d * invDet, -b * invDet], [-c * invDet, a * invDet]];
  }
  
  const adj = adjoint(m);
  return adj.map(row => row.map(val => val / det));
}

function scaleMatrix(m, scalar) {
  return m.map(row => row.map(val => val * scalar));
}

const TEST_CASES = {
  add: {
    matrices: [
      [[1, 2], [3, 4]],
      [[5, 6], [7, 8]]
    ],
    expected: [[6, 8], [10, 12]]
  },
  subtract: {
    matrices: [
      [[5, 6], [7, 8]],
      [[1, 2], [3, 4]]
    ],
    expected: [[4, 4], [4, 4]]
  },
  multiply: {
    matrices: [
      [[1, 2], [3, 4]],
      [[5, 6], [7, 8]]
    ],
    expected: [[19, 22], [43, 50]]
  },
  determinant2x2: {
    matrices: [
      [[1, 2], [3, 4]]
    ],
    expected: -2
  },
  determinant3x3: {
    matrices: [
      [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    ],
    expected: 0
  },
  transpose: {
    matrices: [
      [[1, 2, 3], [4, 5, 6]]
    ],
    expected: [[1, 4], [2, 5], [3, 6]]
  },
  inverse: {
    matrices: [
      [[4, 7], [2, 6]]
    ],
    expected: [[0.6, -0.7], [-0.2, 0.4]]
  },
  scale: {
    matrices: [
      [[1, 2], [3, 4]],
      2
    ],
    expected: [[2, 4], [6, 8]]
  }
};

function arraysEqual(a, b, tolerance = 1e-6) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (Array.isArray(a[i]) && Array.isArray(b[i])) {
      if (!arraysEqual(a[i], b[i], tolerance)) return false;
    } else if (Math.abs(a[i] - b[i]) > tolerance) {
      return false;
    }
  }
  return true;
}

function runTests() {
  const results = [];
  
  results.push({
    name: 'addMatrices 2x2',
    passed: arraysEqual(
      addMatrices(TEST_CASES.add.matrices[0], TEST_CASES.add.matrices[1]),
      TEST_CASES.add.expected
    )
  });
  
  results.push({
    name: 'subtractMatrices 2x2',
    passed: arraysEqual(
      subtractMatrices(TEST_CASES.subtract.matrices[0], TEST_CASES.subtract.matrices[1]),
      TEST_CASES.subtract.expected
    )
  });
  
  results.push({
    name: 'multiplyMatrices 2x2',
    passed: arraysEqual(
      multiplyMatrices(TEST_CASES.multiply.matrices[0], TEST_CASES.multiply.matrices[1]),
      TEST_CASES.multiply.expected
    )
  });
  
  results.push({
    name: 'determinant 2x2',
    passed: Math.abs(
      determinant(TEST_CASES.determinant2x2.matrices[0]) - TEST_CASES.determinant2x2.expected
    ) < 1e-6
  });
  
  results.push({
    name: 'determinant 3x3',
    passed: Math.abs(
      determinant(TEST_CASES.determinant3x3.matrices[0]) - TEST_CASES.determinant3x3.expected
    ) < 1e-6
  });
  
  results.push({
    name: 'transpose 2x3',
    passed: arraysEqual(
      transpose(TEST_CASES.transpose.matrices[0]),
      TEST_CASES.transpose.expected
    )
  });
  
  results.push({
    name: 'inverse 2x2',
    passed: arraysEqual(
      inverse(TEST_CASES.inverse.matrices[0]),
      TEST_CASES.inverse.expected
    )
  });
  
  results.push({
    name: 'scaleMatrix',
    passed: arraysEqual(
      scaleMatrix(TEST_CASES.scale.matrices[0], TEST_CASES.scale.matrices[1]),
      TEST_CASES.scale.expected
    )
  });
  
  return results;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests, arraysEqual, TEST_CASES, addMatrices, subtractMatrices, multiplyMatrices, determinant, transpose, inverse, scaleMatrix };
}