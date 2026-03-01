(function() {
    'use strict';

    const IntentParser = {
        parse: function(input) {
            const normalized = input.toLowerCase().trim();
            
            const patterns = [
                { 
                    regex: /^plot\s+(.+?)\s+(?:from\s+)?(\w+)\s*=\s*([-\d.]+)\s+(?:to\s+)?(\w+)\s*=\s*([-\d.]+)$/i,
                    type: 'plot_2d',
                    extract: (match) => ({
                        function: match[1],
                        var1: match[2],
                        min1: parseFloat(match[3]),
                        var2: match[4],
                        max1: parseFloat(match[5])
                    })
                },
                { 
                    regex: /^plot\s+(.+)$/i,
                    type: 'plot_2d',
                    extract: (match) => ({
                        function: match[1],
                        var1: 'x',
                        min1: -10,
                        var2: 'x', 
                        max1: 10
                    })
                },
                {
                    regex: /^graph\s+(.+?)\s+(?:from\s+)?(\w+)\s*=\s*([-\d.]+)\s+(?:to\s+)?(\w+)\s*=\s*([-\d.]+)$/i,
                    type: 'plot_2d',
                    extract: (match) => ({
                        function: match[1],
                        var1: match[2],
                        min1: parseFloat(match[3]),
                        var2: match[4],
                        max1: parseFloat(match[5])
                    })
                },
                {
                    regex: /^graph\s+(.+)$/i,
                    type: 'plot_2d',
                    extract: (match) => ({
                        function: match[1],
                        var1: 'x',
                        min1: -10,
                        var2: 'x',
                        max1: 10
                    })
                },
                {
                    regex: /^surface\s+(.+)$/i,
                    type: 'plot_3d',
                    extract: (match) => ({
                        function: match[1]
                    })
                },
                {
                    regex: /^3d\s+(.+)$/i,
                    type: 'plot_3d',
                    extract: (match) => ({
                        function: match[1]
                    })
                },
                {
                    regex: /^dot\s*(?:product)?\s*(?:of)?\s*\[([-\d.,\s]+)\]\s*(?:and|×)?\s*\[([-\d.,\s]+)\]$/i,
                    type: 'vector_dot',
                    extract: (match) => ({
                        vectorA: match[1].split(',').map(n => parseFloat(n.trim())),
                        vectorB: match[2].split(',').map(n => parseFloat(n.trim()))
                    })
                },
                {
                    regex: /^cross\s*(?:product)?\s*(?:of)?\s*\[([-\d.,\s]+)\]\s*(?:and|×)?\s*\[([-\d.,\s]+)\]$/i,
                    type: 'vector_cross',
                    extract: (match) => ({
                        vectorA: match[1].split(',').map(n => parseFloat(n.trim())),
                        vectorB: match[2].split(',').map(n => parseFloat(n.trim()))
                    })
                },
                {
                    regex: /^(?:add|sum)\s+(?:vectors?\s+)?\[([-\d.,\s]+)\]\s+(?:and|plus)?\s*\[([-\d.,\s]+)\]$/i,
                    type: 'vector_add',
                    extract: (match) => ({
                        vectorA: match[1].split(',').map(n => parseFloat(n.trim())),
                        vectorB: match[2].split(',').map(n => parseFloat(n.trim()))
                    })
                },
                {
                    regex: /^(?:magnitude|norm|length)\s+of\s*\[([-\d.,\s]+)\]$/i,
                    type: 'vector_magnitude',
                    extract: (match) => ({
                        vector: match[1].split(',').map(n => parseFloat(n.trim()))
                    })
                },
                {
                    regex: /^normalize\s*\[([-\d.,\s]+)\]$/i,
                    type: 'vector_normalize',
                    extract: (match) => ({
                        vector: match[1].split(',').map(n => parseFloat(n.trim()))
                    })
                },
                {
                    regex: /^(?:distance|between)\s*\[([-\d.,\s]+)\]\s+(?:and|to)\s*\[([-\d.,\s]+)\]$/i,
                    type: 'vector_distance',
                    extract: (match) => ({
                        vectorA: match[1].split(',').map(n => parseFloat(n.trim())),
                        vectorB: match[2].split(',').map(n => parseFloat(n.trim()))
                    })
                },
                {
                    regex: /^angle\s+(?:between)?\s*\[([-\d.,\s]+)\]\s+(?:and|to)\s*\[([-\d.,\s]+)\]$/i,
                    type: 'vector_angle',
                    extract: (match) => ({
                        vectorA: match[1].split(',').map(n => parseFloat(n.trim())),
                        vectorB: match[2].split(',').map(n => parseFloat(n.trim()))
                    })
                },
                {
                    regex: /^det(?:erminant)?\s+(?:of\s+)?(?:matrix\s+)?(\d+)x(\d+)(?:\s+(.+))?$/i,
                    type: 'matrix_determinant',
                    extract: (match) => ({
                        rows: parseInt(match[1]),
                        cols: parseInt(match[2]),
                        data: match[3] ? match[3].split(',').map(n => parseFloat(n.trim())) : []
                    })
                },
                {
                    regex: /^inverse\s+(?:of\s+)?(?:matrix\s+)?(\d+)x(\d+)(?:\s+(.+))?$/i,
                    type: 'matrix_inverse',
                    extract: (match) => ({
                        rows: parseInt(match[1]),
                        cols: parseInt(match[2]),
                        data: match[3] ? match[3].split(',').map(n => parseFloat(n.trim())) : []
                    })
                },
                {
                    regex: /^transpose\s+(?:of\s+)?(?:matrix\s+)?(\d+)x(\d+)(?:\s+(.+))?$/i,
                    type: 'matrix_transpose',
                    extract: (match) => ({
                        rows: parseInt(match[1]),
                        cols: parseInt(match[2]),
                        data: match[3] ? match[3].split(',').map(n => parseFloat(n.trim())) : []
                    })
                },
                {
                    regex: /^(.+)$/,
                    type: 'expression',
                    extract: (match) => ({
                        expression: match[1]
                    })
                }
            ];

            for (const pattern of patterns) {
                const match = normalized.match(pattern.regex);
                if (match) {
                    return {
                        type: pattern.type,
                        ...pattern.extract(match),
                        raw: input
                    };
                }
            }

            return {
                type: 'unknown',
                raw: input
            };
        },

        execute: function(intent) {
            switch (intent.type) {
                case 'plot_2d':
                    return this.executePlot2D(intent);
                case 'plot_3d':
                    return this.executePlot3D(intent);
                case 'vector_dot':
                    return this.executeVectorDot(intent);
                case 'vector_cross':
                    return this.executeVectorCross(intent);
                case 'vector_add':
                    return this.executeVectorAdd(intent);
                case 'vector_magnitude':
                    return this.executeVectorMagnitude(intent);
                case 'vector_normalize':
                    return this.executeVectorNormalize(intent);
                case 'vector_distance':
                    return this.executeVectorDistance(intent);
                case 'vector_angle':
                    return this.executeVectorAngle(intent);
                case 'matrix_determinant':
                    return this.executeMatrixDeterminant(intent);
                case 'matrix_inverse':
                    return this.executeMatrixInverse(intent);
                case 'matrix_transpose':
                    return this.executeMatrixTranspose(intent);
                case 'expression':
                    return this.executeExpression(intent);
                default:
                    return { error: 'Unknown intent type' };
            }
        },

        executePlot2D: function(intent) {
            return {
                action: 'switch_mode',
                mode: 'graph',
                params: {
                    function: intent.function,
                    xMin: intent.min1,
                    xMax: intent.max1
                }
            };
        },

        executePlot3D: function(intent) {
            return {
                action: 'switch_mode',
                mode: 'surface',
                params: {
                    function: intent.function
                }
            };
        },

        executeVectorDot: function(intent) {
            const a = intent.vectorA;
            const b = intent.vectorB;
            const result = a[0] * b[0] + a[1] * b[1] + (a[2] || 0) * (b[2] || 0);
            return {
                action: 'result',
                result: result.toFixed(4),
                details: `Dot product of [${a}] and [${b}]`
            };
        },

        executeVectorCross: function(intent) {
            const a = intent.vectorA;
            const b = intent.vectorB;
            const result = {
                x: a[1] * b[2] - a[2] * b[1],
                y: a[2] * b[0] - a[0] * b[2],
                z: a[0] * b[1] - a[1] * b[0]
            };
            return {
                action: 'result',
                result: `(${result.x.toFixed(4)}, ${result.y.toFixed(4)}, ${result.z.toFixed(4)})`,
                details: `Cross product of [${a}] and [${b}]`
            };
        },

        executeVectorAdd: function(intent) {
            const a = intent.vectorA;
            const b = intent.vectorB;
            const result = [
                a[0] + b[0],
                a[1] + b[1],
                (a[2] || 0) + (b[2] || 0)
            ];
            return {
                action: 'result',
                result: `(${result[0]}, ${result[1]}, ${result[2]})`,
                details: `[${a}] + [${b}]`
            };
        },

        executeVectorMagnitude: function(intent) {
            const v = intent.vector;
            const result = Math.sqrt(v[0] * v[0] + v[1] * v[1] + (v[2] || 0) * (v[2] || 0));
            return {
                action: 'result',
                result: result.toFixed(4),
                details: `Magnitude of [${v}]`
            };
        },

        executeVectorNormalize: function(intent) {
            const v = intent.vector;
            const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1] + (v[2] || 0) * (v[2] || 0));
            if (mag === 0) {
                return {
                    action: 'result',
                    result: '(0, 0, 0)',
                    details: 'Normalized zero vector'
                };
            }
            const result = [
                v[0] / mag,
                v[1] / mag,
                (v[2] || 0) / mag
            ];
            return {
                action: 'result',
                result: `(${result[0].toFixed(4)}, ${result[1].toFixed(4)}, ${result[2].toFixed(4)})`,
                details: `Normalized [${v}]`
            };
        },

        executeVectorDistance: function(intent) {
            const a = intent.vectorA;
            const b = intent.vectorB;
            const dx = b[0] - a[0];
            const dy = b[1] - a[1];
            const dz = (b[2] || 0) - (a[2] || 0);
            const result = Math.sqrt(dx * dx + dy * dy + dz * dz);
            return {
                action: 'result',
                result: result.toFixed(4),
                details: `Distance between [${a}] and [${b}]`
            };
        },

        executeVectorAngle: function(intent) {
            const a = intent.vectorA;
            const b = intent.vectorB;
            const dot = a[0] * b[0] + a[1] * b[1] + (a[2] || 0) * (b[2] || 0);
            const magA = Math.sqrt(a[0] * a[0] + a[1] * a[1] + (a[2] || 0) * (a[2] || 0));
            const magB = Math.sqrt(b[0] * b[0] + b[1] * b[1] + (b[2] || 0) * (b[2] || 0));
            if (magA === 0 || magB === 0) {
                return {
                    action: 'result',
                    result: 'undefined (zero vector)',
                    details: 'Cannot compute angle with zero vector'
                };
            }
            const cosAngle = Math.max(-1, Math.min(1, dot / (magA * magB)));
            const result = Math.acos(cosAngle) * (180 / Math.PI);
            return {
                action: 'result',
                result: result.toFixed(2) + '°',
                details: `Angle between [${a}] and [${b}]`
            };
        },

        executeMatrixDeterminant: function(intent) {
            const size = intent.rows;
            const data = intent.data;
            
            if (data.length !== size * size) {
                return { error: `Expected ${size * size} values for ${size}x${size} matrix` };
            }

            const matrix = [];
            for (let i = 0; i < size; i++) {
                matrix.push(data.slice(i * size, (i + 1) * size));
            }

            const det = this._determinant(matrix);
            return {
                action: 'result',
                result: det.toFixed(4),
                details: `Determinant of ${size}x${size} matrix`
            };
        },

        executeMatrixInverse: function(intent) {
            const size = intent.rows;
            const data = intent.data;
            
            if (data.length !== size * size) {
                return { error: `Expected ${size * size} values for ${size}x${size} matrix` };
            }

            const matrix = [];
            for (let i = 0; i < size; i++) {
                matrix.push(data.slice(i * size, (i + 1) * size));
            }

            const det = this._determinant(matrix);
            if (Math.abs(det) < 1e-10) {
                return { error: 'Matrix is singular (determinant = 0)' };
            }

            const inverse = this._inverse(matrix);
            return {
                action: 'result',
                result: this._formatMatrix(inverse),
                details: `Inverse of ${size}x${size} matrix`
            };
        },

        executeMatrixTranspose: function(intent) {
            const size = intent.rows;
            const data = intent.data;
            
            if (data.length !== size * size) {
                return { error: `Expected ${size * size} values for ${size}x${size} matrix` };
            }

            const matrix = [];
            for (let i = 0; i < size; i++) {
                matrix.push(data.slice(i * size, (i + 1) * size));
            }

            const transpose = matrix[0].map((_, j) => matrix.map(row => row[j]));
            return {
                action: 'result',
                result: this._formatMatrix(transpose),
                details: `Transpose of ${size}x${size} matrix`
            };
        },

        executeExpression: function(intent) {
            try {
                const result = math.evaluate(intent.expression);
                const formatted = typeof result === 'number' ? result : 
                                 result.valueOf ? result.valueOf() : result;
                return {
                    action: 'result',
                    result: formatted,
                    details: `Evaluated: ${intent.expression}`
                };
            } catch (error) {
                return { error: error.message };
            }
        },

        _determinant: function(m) {
            const n = m.length;
            if (n === 1) return m[0][0];
            if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
            
            let det = 0;
            for (let j = 0; j < n; j++) {
                const submatrix = m.slice(1).map(row => row.filter((_, colIdx) => colIdx !== j));
                det += Math.pow(-1, j) * m[0][j] * this._determinant(submatrix);
            }
            return det;
        },

        _inverse: function(m) {
            const det = this._determinant(m);
            const n = m.length;
            if (n === 1) return [[1 / m[0][0]]];
            if (n === 2) {
                const [[a, b], [c, d]] = m;
                const invDet = 1 / (a * d - b * c);
                return [[d * invDet, -b * invDet], [-c * invDet, a * invDet]];
            }
            
            const adj = this._adjoint(m);
            return adj.map(row => row.map(val => val / det));
        },

        _adjoint: function(m) {
            const n = m.length;
            if (n === 1) return [[1]];
            
            const cofactorMatrix = [];
            for (let i = 0; i < n; i++) {
                cofactorMatrix[i] = [];
                for (let j = 0; j < n; j++) {
                    const submatrix = m.filter((_, rowIdx) => rowIdx !== i)
                        .map(row => row.filter((_, colIdx) => colIdx !== j));
                    cofactorMatrix[i][j] = Math.pow(-1, i + j) * this._determinant(submatrix);
                }
            }
            return cofactorMatrix[0].map((_, j) => cofactorMatrix.map(row => row[j]));
        },

        _formatMatrix: function(m) {
            let html = '<div class="matrix-result"><table>';
            m.forEach(row => {
                html += '<tr>';
                row.forEach(val => {
                    html += `<td>${typeof val === 'number' ? val.toFixed(4) : val}</td>`;
                });
                html += '</tr>';
            });
            html += '</table></div>';
            return html;
        }
    };

    if (typeof window !== 'undefined') {
        window.IntentParser = IntentParser;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = IntentParser;
    }
})();