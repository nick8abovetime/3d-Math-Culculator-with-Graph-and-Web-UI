# Testing Guide

## Python (Primary - Works without Node.js)

### Install Dependencies

```bash
pip install playwright pytest pytest-playwright
playwright install chromium
```

### Run Tests

Start a local server (in a separate terminal):
```bash
python3 -m http.server 8080
```

Run tests:
```bash
pytest tests/test_calculator.py -v
```

Run with UI:
```bash
pytest tests/test_calculator.py -v --headed
```

## Node.js (Alternative - Requires Node.js)

If Node.js is available, you can use the Playwright JavaScript API instead:

```bash
npm install
npm run test
```

Note: The Node.js setup requires a separate `serve` command to be installed globally.