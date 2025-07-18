import { OpenAIMessage, OpenAIResponse, APIError } from '../types';

class OpenAIService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1/chat/completions';
  private useMockData = false;

  constructor() {
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key is not configured, using mock data');
      this.useMockData = true;
    }
  }

  private async getMockResponse(messages: OpenAIMessage[]): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    
    console.log('Mock service - System message:', systemMessage);
    console.log('Mock service - User message:', userMessage);
    
    // Determine response type based on the system message and user content
    if (systemMessage.includes('nutrition expert') || userMessage.includes('calorie') || userMessage.includes('meal') || userMessage.includes('food')) {
      console.log('Returning calorie analysis mock data');
      return JSON.stringify({
        "totalCalories": 456,
        "breakdown": [
          {
            "food": "Banana (1 medium)",
            "calories": 105,
            "details": "Natural sugars, potassium, vitamin C"
          },
          {
            "food": "Whole wheat bread (2 slices)",
            "calories": 160,
            "details": "Standard serving size, good source of fiber"
          },
          {
            "food": "Oatmeal (1 cup cooked)",
            "calories": 191,
            "details": "Steel-cut oats, high in fiber and protein"
          }
        ]
      });
    } else if (systemMessage.includes('translator') || userMessage.includes('translate') || userMessage.includes('Translate')) {
      console.log('Returning translation mock data');
      return JSON.stringify({
        "originalText": "Hello, how are you?",
        "translatedText": "Hola, ¿cómo estás?",
        "sourceLang": "English",
        "targetLang": "Spanish"
      });
    } else if (systemMessage.includes('document analyst') || userMessage.includes('summarize') || userMessage.includes('document')) {
      console.log('Returning summary mock data');
      return JSON.stringify({
        "summary": "This document provides a comprehensive overview of an AI Assistant application that offers three main features: calorie analysis, text translation, and PDF summarization. The application is built using modern web technologies including React with TypeScript and Tailwind CSS, powered by OpenAI's GPT-4 for AI processing. It serves as a powerful productivity tool for personal, educational, and professional use cases.",
        "keyPoints": [
          "AI Assistant provides three core functionalities: calorie analysis, text translation, and PDF summarization",
          "Built with React TypeScript and Tailwind CSS for modern web experience",
          "Powered by OpenAI GPT-4 for accurate AI processing",
          "Features responsive design and professional user interface",
          "Designed for scalability with potential for future AI-powered enhancements"
        ],
        "wordCount": 485
      });
    }

    console.log('Returning default mock response');
    return JSON.stringify({ message: "Mock response for demonstration" });
  }

  async callOpenAI(messages: OpenAIMessage[], maxTokens: number = 1000): Promise<string> {
    // Use mock data if API key is not available or quota exceeded
    if (this.useMockData) {
      console.log('Using mock OpenAI response for demonstration');
      return this.getMockResponse(messages);
    }

    try {
      console.log('Making OpenAI API call with messages:', messages);
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Use gpt-3.5-turbo instead of gpt-4
          messages: messages,
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });

      console.log('OpenAI API response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }
        
        // If quota exceeded or model not found, fall back to mock data
        if (errorData.error?.code === 'insufficient_quota' || errorData.error?.code === 'model_not_found') {
          console.warn('OpenAI API quota exceeded or model unavailable, falling back to mock data');
          this.useMockData = true;
          return this.getMockResponse(messages);
        }
        
        throw new APIError(
          `OpenAI API error: ${response.status} ${response.statusText}`,
          response.status.toString(),
          errorData.error?.message || 'Unknown error'
        );
      }

      const data: OpenAIResponse = await response.json();
      console.log('OpenAI API response data:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new APIError('Invalid response format from OpenAI API', 'INVALID_RESPONSE');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Fall back to mock data on any error
      if (error instanceof APIError && (
        error.code === 'insufficient_quota' || 
        error.code === 'model_not_found' ||
        error.code === 'NETWORK_ERROR'
      )) {
        console.warn('OpenAI API error, falling back to mock data:', error.message);
        this.useMockData = true;
        return this.getMockResponse(messages);
      }
      
      throw error;
    }
  }

  async analyzeCalories(mealInput: string): Promise<string> {
    const prompt = `Analyze the following meal/ingredients for calorie content: "${mealInput}"

Please provide a detailed breakdown in the following JSON format (make sure it's valid JSON):
{
  "totalCalories": number,
  "breakdown": [
    {
      "food": "food name",
      "calories": number,
      "details": "portion size and nutritional notes"
    }
  ]
}

Be as accurate as possible with calorie estimates. Only return the JSON, no additional text.`;

    return this.callOpenAI([
      { role: 'system', content: 'You are a nutrition expert. Provide accurate calorie information in valid JSON format only. Do not include any text before or after the JSON.' },
      { role: 'user', content: prompt }
    ]);
  }

  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    const langNames: Record<string, string> = {
      'auto': 'Auto-detect',
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese'
    };

    const sourceLanguage = sourceLang === 'auto' ? 'auto-detect the source language and translate to' : `from ${langNames[sourceLang]} to`;
    const targetLanguage = langNames[targetLang];

    const prompt = `Translate the following text ${sourceLanguage} ${targetLanguage}:

"${text}"

Please provide the response in the following JSON format (make sure it's valid JSON):
{
  "originalText": "${text.replace(/"/g, '\\"')}",
  "translatedText": "translated text here",
  "sourceLang": "detected or specified source language name",
  "targetLang": "${targetLanguage}"
}

Only return the JSON, no additional text.`;

    return this.callOpenAI([
      { role: 'system', content: 'You are a professional translator. Provide accurate translations in valid JSON format only. Do not include any text before or after the JSON.' },
      { role: 'user', content: prompt }
    ]);
  }

  async summarizePDF(fileText: string): Promise<string> {
    const truncatedText = fileText.slice(0, 4000);
    const wordCount = fileText.split(/\s+/).filter(word => word.length > 0).length;

    const prompt = `Please summarize the following document content:

${truncatedText}${fileText.length > 4000 ? '\n\n[Document continues...]' : ''}

Provide a response in the following JSON format (make sure it's valid JSON):
{
  "summary": "comprehensive summary of the document",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "wordCount": ${wordCount}
}

Only return the JSON, no additional text.`;

    return this.callOpenAI([
      { role: 'system', content: 'You are a document analyst. Provide concise but comprehensive summaries in valid JSON format only. Do not include any text before or after the JSON.' },
      { role: 'user', content: prompt }
    ], 1500);
  }
}

export default new OpenAIService();