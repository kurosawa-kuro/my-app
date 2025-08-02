const AVAILABLE_MODELS = {
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    description: 'Fast and cost-effective model',
    price: '$0.0015 / 1K input tokens, $0.002 / 1K output tokens', 
    provider: 'openai'
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    description: 'More capable model with better reasoning',
    price: '$0.00015 / 1K input tokens, $0.0006 / 1K output tokens',
    provider: 'openai'
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    description: 'Fast and efficient model',
    price: '$0.00025 / 1K input tokens, $0.00125 / 1K output tokens',
    provider: 'claude'
  },
  'claude-3-sonnet-20240229': {
    name: 'Claude 3 Sonnet', 
    description: 'Balanced performance and capability',
    price: '$0.003 / 1K input tokens, $0.015 / 1K output tokens',
    provider: 'claude'
  },
  'deepseek-chat': {
    name: 'DeepSeek Chat',
    description: 'General purpose model',
    price: '$0.00014 / 1K input tokens, $0.00028 / 1K output tokens',
    provider: 'deepseek'
  },
  'deepseek-coder': {
    name: 'DeepSeek Coder',
    description: 'Specialized for coding tasks', 
    price: '$0.00014 / 1K input tokens, $0.00028 / 1K output tokens',
    provider: 'deepseek'
  }
};

class AIChatService {
  constructor() {
    this.models = AVAILABLE_MODELS;
  }

  getAvailableModels() {
    return this.models;
  }

  validateInput(prompt, model) {
    if (!prompt || prompt.trim() === '') {
      return { error: 'Prompt is required' };
    }
    
    if (prompt.length > 10000) {
      return { error: 'Prompt exceeds maximum length of 10000 characters' };
    }
    
    if (!model || !this.models[model]) {
      return { error: 'Invalid model selected' };
    }
    
    return { valid: true };
  }

  sanitizePrompt(prompt) {
    let sanitized = prompt.trim();
    return sanitized;
  }

  async generateOpenAIResponse(prompt, model) {
    // 環境変数からAPIキーを取得
    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Please check your .env.local file.');
    }
    
    const sanitizedPrompt = this.sanitizePrompt(prompt);
    
    const requestBody = {
      model,
      messages: [{
        role: 'user',
        content: sanitizedPrompt
      }]
    };
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('OpenAI API returned empty response');
    }
    
    return data.choices[0].message.content;
  }

  async generateClaudeResponse(prompt, model) {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API key not configured');
    }
    
    const sanitizedPrompt = this.sanitizePrompt(prompt);
    
    const requestBody = {
      model,
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: sanitizedPrompt
      }]
    };
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Claude API error: ${data.error.message}`);
    }
    
    if (!data.content || data.content.length === 0) {
      throw new Error('Claude API returned empty response');
    }
    
    return data.content[0].text;
  }

  async generateDeepSeekResponse(prompt, model) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DeepSeek API key not configured');
    }
    
    const sanitizedPrompt = this.sanitizePrompt(prompt);
    
    const requestBody = {
      model,
      messages: [{
        role: 'user',
        content: sanitizedPrompt
      }]
    };
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`DeepSeek API error: ${data.error.message}`);
    }
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('DeepSeek API returned empty response');
    }
    
    return data.choices[0].message.content;
  }

  async generateResponse(prompt, model = 'gpt-3.5-turbo') {
    const validation = this.validateInput(prompt, model);
    if (validation.error) {
      throw new Error(validation.error);
    }
    
    const modelInfo = this.models[model];
    let response;
    
    switch (modelInfo.provider) {
      case 'openai':
        response = await this.generateOpenAIResponse(prompt, model);
        break;
      case 'claude':
        response = await this.generateClaudeResponse(prompt, model);
        break;
      case 'deepseek':
        response = await this.generateDeepSeekResponse(prompt, model);
        break;
      default:
        throw new Error('Unsupported provider');
    }
    
    return {
      response,
      model,
      provider: modelInfo.provider
    };
  }
}

module.exports = new AIChatService(); 