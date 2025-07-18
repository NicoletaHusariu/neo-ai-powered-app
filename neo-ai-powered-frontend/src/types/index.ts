// Type definitions for the AI Assistant application

export interface CalorieResult {
  totalCalories: number;
  breakdown: CalorieBreakdownItem[];
}

export interface CalorieBreakdownItem {
  food: string;
  calories: number;
  details: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  wordCount: number;
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export type TabType = 'calories' | 'translate' | 'pdf';

export interface Language {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'auto', name: 'Auto-detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' }
];

export class APIError extends Error {
  public code?: string;
  public details?: string;

  constructor(message: string, code?: string, details?: string) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}