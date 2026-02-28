document.addEventListener('DOMContentLoaded', () => {
    const expressionInput = document.getElementById('expression');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultOutput = document.getElementById('result-output');
    const errorMessage = document.getElementById('error-message');

    function calculate() {
        const expression = expressionInput.value.trim();
        
        if (!expression) {
            resultOutput.textContent = '-';
            errorMessage.textContent = 'Please enter an expression';
            return;
        }

        try {
            const result = math.evaluate(expression);
            resultOutput.textContent = result;
            errorMessage.textContent = '';
        } catch (error) {
            resultOutput.textContent = '-';
            errorMessage.textContent = `Error: ${error.message}`;
        }
    }

    calculateBtn.addEventListener('click', calculate);

    expressionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });

    expressionInput.focus();
});
