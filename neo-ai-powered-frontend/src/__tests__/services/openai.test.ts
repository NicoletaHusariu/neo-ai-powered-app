import OpenAIService from '../../services/openai';
import { APIError } from '../../types';

// Mock fetch
global.fetch = jest.fn();

describe('OpenAIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_OPENAI_API_KEY = 'test-api-key';
  });

  describe('callOpenAI', () => {
    test('makes successful API call', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Test response' } }]
        })
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await OpenAIService.callOpenAI([
        { role: 'user', content: 'Test message' }
      ]);

      expect(result).toBe('Test response');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: 'Test message' }],
            max_tokens: 1000,
            temperature: 0.7
          })
        })
      );
    });

    test('handles API error response', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          error: { message: 'Invalid API key' }
        })
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      await expect(
        OpenAIService.callOpenAI([{ role: 'user', content: 'Test message' }])
      ).rejects.toThrow(APIError);
    });

    test('handles network error', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(
        OpenAIService.callOpenAI([{ role: 'user', content: 'Test message' }])
      ).rejects.toThrow(APIError);
    });
  });

  describe('analyzeCalories', () => {
    test('creates proper prompt for calorie analysis', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Test response' } }]
        })
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      await OpenAIService.analyzeCalories('banana');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          body: expect.stringContaining('banana')
        })
      );
    });
  });

  describe('translateText', () => {
    test('creates proper prompt for text translation', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Test response' } }]
        })
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      await OpenAIService.translateText('Hello', 'en', 'es');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          body: expect.stringContaining('Hello')
        })
      );
    });
  });

  describe('summarizePDF', () => {
    test('creates proper prompt for PDF summarization', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'Test response' } }]
        })
      };

      (fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

      await OpenAIService.summarizePDF('Test document content');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          body: expect.stringContaining('Test document content')
        })
      );
    });
  });
});