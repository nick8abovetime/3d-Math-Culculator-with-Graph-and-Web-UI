describe('Expression Mode', () => {
    let expressionInput, calculateBtn, resultOutput, errorMessage;
    let calculateExpression;

    beforeEach(() => {
        document.body.innerHTML = `
            <input type="text" id="expression" placeholder="e.g., 2+2, sqrt(16), sin(pi/2)">
            <button id="calculate-btn">Calculate</button>
            <output id="result-output">-</output>
            <div id="error-message"></div>
        `;
        expressionInput = document.getElementById('expression');
        calculateBtn = document.getElementById('calculate-btn');
        resultOutput = document.getElementById('result-output');
        errorMessage = document.getElementById('error-message');

        calculateExpression = () => {
            const expr = expressionInput.value.trim();
            if (!expr) {
                resultOutput.textContent = '-';
                errorMessage.textContent = 'Please enter an expression';
                return;
            }
            try {
                const result = math.evaluate(expr);
                resultOutput.textContent = result;
                errorMessage.textContent = '';
            } catch (error) {
                resultOutput.textContent = '-';
                errorMessage.textContent = `Error: ${error.message}`;
            }
        };
    });

    describe('Basic Arithmetic', () => {
        test('evaluates addition', () => {
            expressionInput.value = '2 + 2';
            calculateExpression();
            expect(resultOutput.textContent).toBe('4');
        });

        test('evaluates subtraction', () => {
            expressionInput.value = '10 - 3';
            calculateExpression();
            expect(resultOutput.textContent).toBe('7');
        });

        test('evaluates multiplication', () => {
            expressionInput.value = '3 * 4';
            calculateExpression();
            expect(resultOutput.textContent).toBe('12');
        });

        test('evaluates division', () => {
            expressionInput.value = '10 / 2';
            calculateExpression();
            expect(resultOutput.textContent).toBe('5');
        });

        test('handles order of operations', () => {
            expressionInput.value = '2 + 3 * 4';
            calculateExpression();
            expect(resultOutput.textContent).toBe('14');
        });

        test('handles parentheses', () => {
            expressionInput.value = '(2 + 3) * 4';
            calculateExpression();
            expect(resultOutput.textContent).toBe('20');
        });
    });

    describe('Advanced Math', () => {
        test('evaluates sqrt', () => {
            expressionInput.value = 'sqrt(16)';
            calculateExpression();
            expect(resultOutput.textContent).toBe('4');
        });

        test('evaluates power', () => {
            expressionInput.value = '2^3';
            calculateExpression();
            expect(resultOutput.textContent).toBe('8');
        });

        test('evaluates trigonometric functions', () => {
            expressionInput.value = 'sin(0)';
            calculateExpression();
            expect(parseFloat(resultOutput.textContent)).toBeCloseTo(0);
        });

        test('evaluates pi', () => {
            expressionInput.value = 'pi';
            calculateExpression();
            expect(parseFloat(resultOutput.textContent)).toBeCloseTo(Math.PI);
        });

        test('evaluates e', () => {
            expressionInput.value = 'e';
            calculateExpression();
            expect(parseFloat(resultOutput.textContent)).toBeCloseTo(Math.E);
        });

        test('evaluates complex expression', () => {
            expressionInput.value = 'sqrt(16) + sin(pi/2)';
            calculateExpression();
            expect(resultOutput.textContent).toBe('5');
        });
    });

    describe('Error Handling', () => {
        test('shows error for empty expression', () => {
            expressionInput.value = '';
            calculateExpression();
            expect(errorMessage.textContent).toBe('Please enter an expression');
        });

        test('shows error for invalid expression', () => {
            expressionInput.value = '2 +';
            calculateExpression();
            expect(errorMessage.textContent).toContain('Error');
            expect(resultOutput.textContent).toBe('-');
        });

        test('shows error for undefined variable', () => {
            expressionInput.value = 'unknown_var';
            calculateExpression();
            expect(errorMessage.textContent).toContain('Error');
        });

        test('shows error for division by zero', () => {
            expressionInput.value = '1 / 0';
            calculateExpression();
            expect(errorMessage.textContent).toContain('Error');
        });
    });

    describe('Edge Cases', () => {
        test('handles negative numbers', () => {
            expressionInput.value = '-5 + 3';
            calculateExpression();
            expect(resultOutput.textContent).toBe('-2');
        });

        test('handles decimal numbers', () => {
            expressionInput.value = '3.14 * 2';
            calculateExpression();
            expect(parseFloat(resultOutput.textContent)).toBeCloseTo(6.28);
        });

        test('handles whitespace', () => {
            expressionInput.value = '  2 + 2  ';
            calculateExpression();
            expect(resultOutput.textContent).toBe('4');
        });
    });
});