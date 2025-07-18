import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the OpenAI service
jest.mock('../services/openai', () => ({
  __esModule: true,
  default: {
    analyzeCalories: jest.fn(),
    translateText: jest.fn(),
    summarizePDF: jest.fn(),
  },
}));

// Mock environment variables
process.env.REACT_APP_OPENAI_API_KEY = 'test-api-key';

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the main app title', () => {
    render(<App />);
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  test('renders hero section content', () => {
    render(<App />);
    expect(screen.getByText('AI-Powered')).toBeInTheDocument();
    expect(screen.getByText('Assistant')).toBeInTheDocument();
    expect(screen.getByText(/Get instant calorie analysis/)).toBeInTheDocument();
  });

  test('renders all navigation tabs', () => {
    render(<App />);
    expect(screen.getByText('Calorie Analysis')).toBeInTheDocument();
    expect(screen.getByText('Text Translation')).toBeInTheDocument();
    expect(screen.getByText('PDF Summary')).toBeInTheDocument();
  });

  test('starts with calorie analysis tab active', () => {
    render(<App />);
    expect(screen.getByText('Enter meal or ingredients')).toBeInTheDocument();
  });

  test('can switch between tabs', () => {
    render(<App />);
    
    // Click on Text Translation tab
    fireEvent.click(screen.getByText('Text Translation'));
    expect(screen.getByText('Text to translate')).toBeInTheDocument();
    
    // Click on PDF Summary tab
    fireEvent.click(screen.getByText('PDF Summary'));
    expect(screen.getByText('Upload PDF file')).toBeInTheDocument();
    
    // Click back to Calorie Analysis tab
    fireEvent.click(screen.getByText('Calorie Analysis'));
    expect(screen.getByText('Enter meal or ingredients')).toBeInTheDocument();
  });

  test('renders footer with security note', () => {
    render(<App />);
    expect(screen.getByText('Built with React TypeScript and powered by GPT-4')).toBeInTheDocument();
    expect(screen.getByText(/Security Note:/)).toBeInTheDocument();
  });

  test('displays error message when error occurs', async () => {
    render(<App />);
    
    // Switch to calorie analysis tab
    fireEvent.click(screen.getByText('Calorie Analysis'));
    
    // Enter meal input
    const mealInput = screen.getByPlaceholderText(/e.g., 2 slices of whole wheat bread/);
    fireEvent.change(mealInput, { target: { value: 'test meal' } });
    
    // Mock OpenAI service to throw error
    const openAIService = require('../services/openai').default;
    openAIService.analyzeCalories.mockRejectedValueOnce(new Error('API Error'));
    
    // Click analyze button
    const analyzeButton = screen.getByText('Analyze Calories');
    fireEvent.click(analyzeButton);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });
});