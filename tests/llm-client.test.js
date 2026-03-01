(function() {
    'use strict';

    const testResults = {
        passed: 0,
        failed: 0,
        total: 0
    };

    function assert(condition, message) {
        testResults.total++;
        if (condition) {
            testResults.passed++;
            console.log(`✓ PASS: ${message}`);
        } else {
            testResults.failed++;
            console.error(`✗ FAIL: ${message}`);
        }
    }

    function assertEqual(actual, expected, message) {
        testResults.total++;
        if (actual === expected) {
            testResults.passed++;
            console.log(`✓ PASS: ${message}`);
        } else {
            testResults.failed++;
            console.error(`✗ FAIL: ${message} (expected: ${expected}, got: ${actual})`);
        }
    }

    function assertThrows(fn, expectedMessage, message) {
        testResults.total++;
        try {
            fn();
            testResults.failed++;
            console.error(`✗ FAIL: ${message} (no error thrown)`);
        } catch (e) {
            if (expectedMessage && e.message.includes(expectedMessage)) {
                testResults.passed++;
                console.log(`✓ PASS: ${message}`);
            } else if (!expectedMessage) {
                testResults.passed++;
                console.log(`✓ PASS: ${message}`);
            } else {
                testResults.failed++;
                console.error(`✗ FAIL: ${message} (expected: ${expectedMessage}, got: ${e.message})`);
            }
        }
    }

    function runTests() {
        console.log('=== LLM Client Tests ===\n');

        testLLMClientConstructor();
        testLLMClientComplete();
        testLLMClientChat();
        testLLMClientSetMethods();
        testAnthropicClient();
        testCreateClient();

        console.log(`\nResults: ${testResults.passed} passed, ${testResults.failed} failed`);
        if (testResults.failed === 0) {
            console.log('All tests passed!');
        }
        return testResults;
    }

    function testLLMClientConstructor() {
        console.log('--- LLMClient Constructor ---');
        
        const client = new LLMClient();
        assertEqual(client.apiKey, '', 'Default apiKey is empty');
        assertEqual(client.baseUrl, 'https://api.openai.com/v1', 'Default baseUrl is OpenAI');
        assertEqual(client.model, 'gpt-4', 'Default model is gpt-4');
        assertEqual(client.defaultTemperature, 0.7, 'Default temperature is 0.7');
        assertEqual(client.maxTokens, 1000, 'Default maxTokens is 1000');

        const customClient = new LLMClient({
            apiKey: 'test-key',
            baseUrl: 'https://custom.api.com',
            model: 'gpt-3.5-turbo',
            temperature: 0.5,
            maxTokens: 500
        });
        assertEqual(customClient.apiKey, 'test-key', 'Custom apiKey is set');
        assertEqual(customClient.baseUrl, 'https://custom.api.com', 'Custom baseUrl is set');
        assertEqual(customClient.model, 'gpt-3.5-turbo', 'Custom model is set');
        assertEqual(customClient.defaultTemperature, 0.5, 'Custom temperature is set');
        assertEqual(customClient.maxTokens, 500, 'Custom maxTokens is set');
    }

    function testLLMClientComplete() {
        console.log('--- LLMClient.complete ---');
        
        const client = new LLMClient({ apiKey: 'test-key' });
        
        assertThrows(
            () => { client.complete('Hello') },
            'API key not configured',
            'Throws error without apiKey in config'
        );
    }

    function testLLMClientChat() {
        console.log('--- LLMClient.chat ---');
        
        const client = new LLMClient({ apiKey: 'test-key' });
        
        assertThrows(
            () => { client.chat([{ role: 'user', content: 'Hi' }]) },
            'API key not configured',
            'Throws error without apiKey in config'
        );
    }

    function testLLMClientSetMethods() {
        console.log('--- LLMClient setters ---');
        
        const client = new LLMClient();
        
        client.setApiKey('new-key');
        assertEqual(client.apiKey, 'new-key', 'setApiKey works');
        
        client.setModel('gpt-3.5-turbo');
        assertEqual(client.model, 'gpt-3.5-turbo', 'setModel works');
        
        client.setTemperature(0.9);
        assertEqual(client.defaultTemperature, 0.9, 'setTemperature works');
    }

    function testAnthropicClient() {
        console.log('--- AnthropicClient ---');
        
        const client = new AnthropicClient();
        assertEqual(client.baseUrl, 'https://api.anthropic.com/v1', 'Default baseUrl is Anthropic');
        assertEqual(client.model, 'claude-3-opus-20240229', 'Default model is Claude 3 Opus');
        assertEqual(client.apiVersion, '2023-06-01', 'Default API version is set');

        const customClient = new AnthropicClient({
            apiKey: 'anthropic-key',
            model: 'claude-3-sonnet-20240229',
            apiVersion: '2024-01-01'
        });
        assertEqual(customClient.apiKey, 'anthropic-key', 'Custom apiKey is set');
        assertEqual(customClient.model, 'claude-3-sonnet-20240229', 'Custom model is set');
        assertEqual(customClient.apiVersion, '2024-01-01', 'Custom API version is set');

        assertThrows(
            () => { client.complete('test') },
            'API key not configured',
            'AnthropicClient throws without apiKey'
        );
    }

    function testCreateClient() {
        console.log('--- createClient factory ---');
        
        const openaiClient = createClient('openai', { apiKey: 'key' });
        assert(openaiClient instanceof LLMClient, 'Returns LLMClient for openai');

        const anthropicClient = createClient('anthropic', { apiKey: 'key' });
        assert(anthropicClient instanceof AnthropicClient, 'Returns AnthropicClient for anthropic');

        const defaultClient = createClient('unknown', { apiKey: 'key' });
        assert(defaultClient instanceof LLMClient, 'Returns LLMClient for unknown provider');

        const lowerClient = createClient('OPENAI', { apiKey: 'key' });
        assert(lowerClient instanceof LLMClient, 'Handles uppercase provider name');
    }

    if (typeof window !== 'undefined') {
        window.runLLMClientTests = runTests;
    } else {
        runTests();
    }
})();