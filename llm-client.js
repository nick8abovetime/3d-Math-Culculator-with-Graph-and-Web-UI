class LLMClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || '';
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.model = config.model || 'gpt-4';
    this.defaultTemperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 1000;
  }

  async complete(prompt, options = {}) {
    const temperature = options.temperature ?? this.defaultTemperature;
    const maxTokens = options.maxTokens ?? this.maxTokens;
    const systemMessage = options.system || 'You are a helpful math assistant.';

    const messages = [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ];

    return this._makeRequest(messages, { temperature, maxTokens });
  }

  async chat(messages, options = {}) {
    const temperature = options.temperature ?? this.defaultTemperature;
    const maxTokens = options.maxTokens ?? this.maxTokens;

    return this._makeRequest(messages, { temperature, maxTokens });
  }

  async _makeRequest(messages, options) {
    if (!this.apiKey) {
      throw new Error('API key not configured. Set apiKey in LLMClient constructor.');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`LLM API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  setModel(model) {
    this.model = model;
  }

  setTemperature(temperature) {
    this.defaultTemperature = temperature;
  }
}

class AnthropicClient extends LLMClient {
  constructor(config = {}) {
    super({
      ...config,
      baseUrl: config.baseUrl || 'https://api.anthropic.com/v1',
      model: config.model || 'claude-3-opus-20240229'
    });
    this.apiVersion = config.apiVersion || '2023-06-01';
  }

  async _makeRequest(messages, options) {
    if (!this.apiKey) {
      throw new Error('API key not configured. Set apiKey in AnthropicClient constructor.');
    }

    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': this.apiVersion
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        system: systemMessage,
        messages: userMessages
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}

function createClient(provider = 'openai', config = {}) {
  switch (provider.toLowerCase()) {
    case 'anthropic':
      return new AnthropicClient(config);
    case 'openai':
    default:
      return new LLMClient(config);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LLMClient, AnthropicClient, createClient };
}