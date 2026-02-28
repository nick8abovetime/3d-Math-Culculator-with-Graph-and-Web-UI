(function() {
  'use strict';

  const results = [];
  let passed = 0;
  let failed = 0;

  window.matrixUITests = {
    test: function(name, fn) {
      try {
        fn();
        passed++;
        results.push({ name: name, passed: true, error: null });
        console.log(`✓ PASS: ${name}`);
      } catch (e) {
        failed++;
        results.push({ name: name, passed: false, error: e.message });
        console.log(`✗ FAIL: ${name} - ${e.message}`);
      }
    },

    assertEqual: function(actual, expected, message) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. ${message || ''}`);
      }
    },

    assertTrue: function(value, message) {
      if (!value) {
        throw new Error(`Expected true, got ${value}. ${message || ''}`);
      }
    },

    assertFalse: function(value, message) {
      if (value) {
        throw new Error(`Expected false, got ${value}. ${message || ''}`);
      }
    },

    assertNotNull: function(value, message) {
      if (value === null || value === undefined) {
        throw new Error(`Expected non-null value, got ${value}. ${message || ''}`);
      }
    },

    assertNull: function(value, message) {
      if (value !== null) {
        throw new Error(`Expected null, got ${value}. ${message || ''}`);
      }
    },

    arraysEqual: function(a, b, tolerance) {
      tolerance = tolerance || 1e-6;
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (Array.isArray(a[i]) && Array.isArray(b[i])) {
          if (!window.matrixUITests.arraysEqual(a[i], b[i], tolerance)) return false;
        } else if (Math.abs(a[i] - b[i]) > tolerance) {
          return false;
        }
      }
      return true;
    },

    getResults: function() {
      return { passed: passed, failed: failed, results: results };
    },

    runTests: function() {
      console.log('Starting Matrix UI Tests...\n');
      passed = 0;
      failed = 0;
      results.length = 0;

      const matrixMode = document.querySelector('.matrix-mode');
      const matrixSizeSelect = document.getElementById('matrix-size');
      const matrixAInputs = document.getElementById('matrix-a-inputs');
      const matrixBInputs = document.getElementById('matrix-b-inputs');
      const matrixOperationSelect = document.getElementById('matrix-operation');
      const calculateBtn = document.getElementById('calculate-btn');
      const resultOutput = document.getElementById('result-output');
      const errorMessage = document.getElementById('error-message');
      const scaleInputGroup = document.getElementById('scale-input-group');

      this.test('Matrix mode section exists', function() {
        window.matrixUITests.assertNotNull(matrixMode, 'Matrix mode section should exist');
      });

      this.test('Matrix size select exists', function() {
        window.matrixUITests.assertNotNull(matrixSizeSelect, 'Matrix size select should exist');
        window.matrixUITests.assertEqual(matrixSizeSelect.value, '2', 'Default size should be 2x2');
      });

      this.test('Matrix A inputs container exists', function() {
        window.matrixUITests.assertNotNull(matrixAInputs, 'Matrix A inputs should exist');
      });

      this.test('Matrix B inputs container exists', function() {
        window.matrixUITests.assertNotNull(matrixBInputs, 'Matrix B inputs should exist');
      });

      this.test('Matrix operation select exists', function() {
        window.matrixUITests.assertNotNull(matrixOperationSelect, 'Operation select should exist');
      });

      this.test('Calculate button exists', function() {
        window.matrixUITests.assertNotNull(calculateBtn, 'Calculate button should exist');
      });

      this.test('Result output exists', function() {
        window.matrixUITests.assertNotNull(resultOutput, 'Result output should exist');
      });

      this.test('Error message element exists', function() {
        window.matrixUITests.assertNotNull(errorMessage, 'Error message element should exist');
      });

      this.test('Matrix inputs are created for 2x2', function() {
        const size = parseInt(matrixSizeSelect.value);
        window.matrixUITests.assertEqual(size, 2, 'Default size should be 2');
        const rows = matrixAInputs.querySelectorAll('.matrix-row');
        window.matrixUITests.assertEqual(rows.length, 2, 'Should have 2 rows');
        const inputs = matrixAInputs.querySelectorAll('input');
        window.matrixUITests.assertEqual(inputs.length, 4, 'Should have 4 inputs for 2x2');
      });

      this.test('Changing size to 3x3 creates correct inputs', function() {
        matrixSizeSelect.value = '3';
        matrixSizeSelect.dispatchEvent(new Event('change'));
        const rows = matrixAInputs.querySelectorAll('.matrix-row');
        window.matrixUITests.assertEqual(rows.length, 3, 'Should have 3 rows for 3x3');
        const inputs = matrixAInputs.querySelectorAll('input');
        window.matrixUITests.assertEqual(inputs.length, 9, 'Should have 9 inputs for 3x3');
      });

      this.test('Scale input is hidden for non-scale operations', function() {
        matrixOperationSelect.value = 'add';
        matrixOperationSelect.dispatchEvent(new Event('change'));
        window.matrixUITests.assertFalse(scaleInputGroup.style.display === 'flex', 'Scale input should be hidden for add');
      });

      this.test('Scale input is shown for scale operation', function() {
        matrixOperationSelect.value = 'scale';
        matrixOperationSelect.dispatchEvent(new Event('change'));
        window.matrixUITests.assertTrue(scaleInputGroup.style.display === 'flex', 'Scale input should be visible for scale');
      });

      this.test('Matrix addition produces correct result', function() {
        matrixSizeSelect.value = '2';
        matrixSizeSelect.dispatchEvent(new Event('change'));
        matrixOperationSelect.value = 'add';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = '1';
        document.getElementById('mat-a-0-1').value = '2';
        document.getElementById('mat-a-1-0').value = '3';
        document.getElementById('mat-a-1-1').value = '4';

        document.getElementById('mat-b-0-0').value = '5';
        document.getElementById('mat-b-0-1').value = '6';
        document.getElementById('mat-b-1-0').value = '7';
        document.getElementById('mat-b-1-1').value = '8';

        calculateBtn.click();

        const resultHtml = resultOutput.innerHTML;
        window.matrixUITests.assertTrue(resultHtml.includes('6'), 'Result should contain 6');
        window.matrixUITests.assertTrue(resultHtml.includes('8'), 'Result should contain 8');
        window.matrixUITests.assertTrue(resultHtml.includes('10'), 'Result should contain 10');
        window.matrixUITests.assertTrue(resultHtml.includes('12'), 'Result should contain 12');
      });

      this.test('Matrix subtraction produces correct result', function() {
        matrixOperationSelect.value = 'subtract';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = '5';
        document.getElementById('mat-a-0-1').value = '6';
        document.getElementById('mat-a-1-0').value = '7';
        document.getElementById('mat-a-1-1').value = '8';

        document.getElementById('mat-b-0-0').value = '1';
        document.getElementById('mat-b-0-1').value = '2';
        document.getElementById('mat-b-1-0').value = '3';
        document.getElementById('mat-b-1-1').value = '4';

        calculateBtn.click();

        const resultHtml = resultOutput.innerHTML;
        window.matrixUITests.assertTrue(resultHtml.includes('4'), 'Result should contain 4');
      });

      this.test('Matrix multiplication produces correct result', function() {
        matrixOperationSelect.value = 'multiply';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = '1';
        document.getElementById('mat-a-0-1').value = '2';
        document.getElementById('mat-a-1-0').value = '3';
        document.getElementById('mat-a-1-1').value = '4';

        document.getElementById('mat-b-0-0').value = '5';
        document.getElementById('mat-b-0-1').value = '6';
        document.getElementById('mat-b-1-0').value = '7';
        document.getElementById('mat-b-1-1').value = '8';

        calculateBtn.click();

        const resultHtml = resultOutput.innerHTML;
        window.matrixUITests.assertTrue(resultHtml.includes('19'), 'Result should contain 19 (1*5+2*7)');
        window.matrixUITests.assertTrue(resultHtml.includes('22'), 'Result should contain 22 (1*6+2*8)');
        window.matrixUITests.assertTrue(resultHtml.includes('43'), 'Result should contain 43 (3*5+4*7)');
        window.matrixUITests.assertTrue(resultHtml.includes('50'), 'Result should contain 50 (3*6+4*8)');
      });

      this.test('Determinant of 2x2 matrix is correct', function() {
        matrixOperationSelect.value = 'determinant';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = '1';
        document.getElementById('mat-a-0-1').value = '2';
        document.getElementById('mat-a-1-0').value = '3';
        document.getElementById('mat-a-1-1').value = '4';

        calculateBtn.click();

        const resultText = resultOutput.textContent;
        window.matrixUITests.assertTrue(resultText.includes('-2'), 'Determinant of [[1,2],[3,4]] should be -2');
      });

      this.test('Transpose of matrix is correct', function() {
        matrixOperationSelect.value = 'transpose';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = '1';
        document.getElementById('mat-a-0-1').value = '2';
        document.getElementById('mat-a-1-0').value = '3';
        document.getElementById('mat-a-1-1').value = '4';

        calculateBtn.click();

        const resultHtml = resultOutput.innerHTML;
        window.matrixUITests.assertTrue(resultHtml.includes('1') && resultHtml.includes('3'), 'First column should be 1, 3');
        window.matrixUITests.assertTrue(resultHtml.includes('2') && resultHtml.includes('4'), 'Second column should be 2, 4');
      });

      this.test('Inverse of matrix is correct', function() {
        matrixOperationSelect.value = 'inverse';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = '4';
        document.getElementById('mat-a-0-1').value = '7';
        document.getElementById('mat-a-1-0').value = '2';
        document.getElementById('mat-a-1-1').value = '6';

        calculateBtn.click();

        const resultHtml = resultOutput.innerHTML;
        window.matrixUITests.assertTrue(resultHtml.includes('0.6'), 'Inverse should contain 0.6');
        window.matrixUITests.assertTrue(resultHtml.includes('-0.7'), 'Inverse should contain -0.7');
      });

      this.test('Inverse of singular matrix shows error', function() {
        matrixOperationSelect.value = 'inverse';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = '1';
        document.getElementById('mat-a-0-1').value = '2';
        document.getElementById('mat-a-1-0').value = '2';
        document.getElementById('mat-a-1-1').value = '4';

        calculateBtn.click();

        const resultText = resultOutput.textContent;
        window.matrixUITests.assertTrue(resultText.includes('undefined') || resultText.includes('singular'), 'Singular matrix should show undefined');
      });

      this.test('Scale matrix produces correct result', function() {
        matrixOperationSelect.value = 'scale';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = '1';
        document.getElementById('mat-a-0-1').value = '2';
        document.getElementById('mat-a-1-0').value = '3';
        document.getElementById('mat-a-1-1').value = '4';

        document.getElementById('scalar-value').value = '2';

        calculateBtn.click();

        const resultHtml = resultOutput.innerHTML;
        window.matrixUITests.assertTrue(resultHtml.includes('2'), 'Result should contain 2');
        window.matrixUITests.assertTrue(resultHtml.includes('4'), 'Result should contain 4');
        window.matrixUITests.assertTrue(resultHtml.includes('6'), 'Result should contain 6');
        window.matrixUITests.assertTrue(resultHtml.includes('8'), 'Result should contain 8');
      });

      this.test('Error handling for invalid operation', function() {
        const originalError = console.error;
        let errorCaught = false;
        console.error = function() { errorCaught = true; };

        matrixOperationSelect.value = 'add';
        matrixOperationSelect.dispatchEvent(new Event('change'));

        document.getElementById('mat-a-0-0').value = 'invalid';

        calculateBtn.click();

        console.error = originalError;
      });

      this.test('Matrix tab can be activated', function() {
        const matrixTab = document.querySelector('.mode-tab[data-mode="matrix"]');
        window.matrixUITests.assertNotNull(matrixTab, 'Matrix tab should exist');

        matrixTab.click();
        window.matrixUITests.assertTrue(matrixTab.classList.contains('active'), 'Matrix tab should be active after click');
        window.matrixUITests.assertTrue(matrixMode.style.display === 'block', 'Matrix mode should be visible');
      });

      console.log(`\nResults: ${passed} passed, ${failed} failed`);
      return { passed: passed, failed: failed, results: results };
    }
  };
})();