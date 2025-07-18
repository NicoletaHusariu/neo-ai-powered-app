import { renderHook, act } from '@testing-library/react';
import { useOpenAI } from '../../hooks/useOpenAI';

// Mock the OpenAI service
jest.mock('../../services/openai', () => ({
  __esModule: true,
  default: {
    analyzeCalories: jest.fn(),
    translateText: jest.fn(),
    summarizePDF: jest.fn(),
  },
}));

describe('useOpenAI Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state is correct', () => {
    const { result } = renderHook(() => useOpenAI());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.analyzeCalories).toBe('function');
    expect(typeof result.current.translateText).toBe('function');
    expect(typeof result.current.summarizePDF).toBe('function');
  });

  test('analyzeCalories sets loading state correctly', async () => {
    const openAIService = require('../../services/openai').default;
    openAIService.analyzeCalories.mockResolvedValueOnce(
      JSON.stringify({ totalCalories: 100, breakdown: [] })
    );

    const { result } = renderHook(() => useOpenAI());

    act(() => {
      result.current.analyzeCalories('banana');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await result.current.analyzeCalories('banana');
    });

    expect(result.current.loading).toBe(false);
  });

  test('analyzeCalories handles successful response', async () => {
    const mockResult = { totalCalories: 100, breakdown: [] };
    const openAIService = require('../../services/openai').default;
    openAIService.analyzeCalories.mockResolvedValueOnce(JSON.stringify(mockResult));

    const { result } = renderHook(() => useOpenAI());

    let calorieResult;
    await act(async () => {
      calorieResult = await result.current.analyzeCalories('banana');
    });

    expect(calorieResult).toEqual(mockResult);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test('analyzeCalories handles error', async () => {
    const openAIService = require('../../services/openai').default;
    openAIService.analyzeCalories.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useOpenAI());

    let calorieResult;
    await act(async () => {
      calorieResult = await result.current.analyzeCalories('banana');
    });

    expect(calorieResult).toBe(null);
    expect(result.current.error).toBe('API Error');
    expect(result.current.loading).toBe(false);
  });

  test('translateText handles successful response', async () => {
    const mockResult = { 
      originalText: 'Hello', 
      translatedText: 'Hola', 
      sourceLang: 'English', 
      targetLang: 'Spanish' 
    };
    const openAIService = require('../../services/openai').default;
    openAIService.translateText.mockResolvedValueOnce(JSON.stringify(mockResult));

    const { result } = renderHook(() => useOpenAI());

    let translationResult;
    await act(async () => {
      translationResult = await result.current.translateText('Hello', 'en', 'es');
    });

    expect(translationResult).toEqual(mockResult);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test('summarizePDF handles successful response', async () => {
    const mockResult = { 
      summary: 'Test summary', 
      keyPoints: ['Point 1', 'Point 2'], 
      wordCount: 100 
    };
    const openAIService = require('../../services/openai').default;
    openAIService.summarizePDF.mockResolvedValueOnce(JSON.stringify(mockResult));

    const { result } = renderHook(() => useOpenAI());

    let summaryResult;
    await act(async () => {
      summaryResult = await result.current.summarizePDF('Test document content');
    });

    expect(summaryResult).toEqual(mockResult);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test('setError updates error state', () => {
    const { result } = renderHook(() => useOpenAI());

    act(() => {
      result.current.setError('Test error');
    });

    expect(result.current.error).toBe('Test error');
  });

  test('returns null for empty input', async () => {
    const { result } = renderHook(() => useOpenAI());

    let calorieResult;
    await act(async () => {
      calorieResult = await result.current.analyzeCalories('');
    });

    expect(calorieResult).toBe(null);
  });
});