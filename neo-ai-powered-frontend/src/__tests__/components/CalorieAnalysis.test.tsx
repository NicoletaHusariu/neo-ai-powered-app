import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalorieAnalysis from '../../components/CalorieAnalysis/CalorieAnalysis';

// Mock the OpenAI hook
jest.mock('../../hooks/useOpenAI', () => ({
  useOpenAI: () => ({
    loading: false,
    error: null,
    analyzeCalories: jest.fn(),
    setError: jest.fn(),
  }),
}));

describe('CalorieAnalysis Component', () => {
  test('renders calorie analysis form', () => {
    render(<CalorieAnalysis />);
    
    expect(screen.getByText('Calorie Analysis')).toBeInTheDocument();
    expect(screen.getByText('Enter meal or ingredients')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., 2 slices of whole wheat bread/)).toBeInTheDocument();
    expect(screen.getByText('Analyze Calories')).toBeInTheDocument();
  });

  test('analyze button is disabled when input is empty', () => {
    render(<CalorieAnalysis />);
    
    const analyzeButton = screen.getByText('Analyze Calories');
    expect(analyzeButton).toBeDisabled();
  });

  test('analyze button is enabled when input has text', () => {
    render(<CalorieAnalysis />);
    
    const mealInput = screen.getByPlaceholderText(/e.g., 2 slices of whole wheat bread/);
    fireEvent.change(mealInput, { target: { value: 'banana' } });
    
    const analyzeButton = screen.getByText('Analyze Calories');
    expect(analyzeButton).toBeEnabled();
  });

  test('clear button appears when there is input', () => {
    render(<CalorieAnalysis />);
    
    const mealInput = screen.getByPlaceholderText(/e.g., 2 slices of whole wheat bread/);
    fireEvent.change(mealInput, { target: { value: 'banana' } });
    
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  test('clear button clears the input', () => {
    render(<CalorieAnalysis />);
    
    const mealInput = screen.getByPlaceholderText(/e.g., 2 slices of whole wheat bread/) as HTMLTextAreaElement;
    fireEvent.change(mealInput, { target: { value: 'banana' } });
    
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    
    expect(mealInput.value).toBe('');
  });

  test('shows loading state when analyzing', () => {
    // Mock loading state
    const mockUseOpenAI = require('../../hooks/useOpenAI').useOpenAI;
    mockUseOpenAI.mockReturnValue({
      loading: true,
      error: null,
      analyzeCalories: jest.fn(),
      setError: jest.fn(),
    });

    render(<CalorieAnalysis />);
    
    const mealInput = screen.getByPlaceholderText(/e.g., 2 slices of whole wheat bread/);
    expect(mealInput).toBeDisabled();
    
    const analyzeButton = screen.getByText('Analyzing...');
    expect(analyzeButton).toBeDisabled();
  });
});