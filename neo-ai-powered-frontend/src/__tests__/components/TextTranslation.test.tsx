import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextTranslation from '../../components/TextTranslation/TextTranslation';

// Mock the OpenAI hook
jest.mock('../../hooks/useOpenAI', () => ({
  useOpenAI: () => ({
    loading: false,
    error: null,
    translateText: jest.fn(),
    setError: jest.fn(),
  }),
}));

describe('TextTranslation Component', () => {
  test('renders text translation form', () => {
    render(<TextTranslation />);
    
    expect(screen.getByText('Text Translation')).toBeInTheDocument();
    expect(screen.getByText('Source Language')).toBeInTheDocument();
    expect(screen.getByText('Target Language')).toBeInTheDocument();
    expect(screen.getByText('Text to translate')).toBeInTheDocument();
    expect(screen.getByText('Translate Text')).toBeInTheDocument();
  });

  test('has default language selections', () => {
    render(<TextTranslation />);
    
    const sourceSelect = screen.getByLabelText('Source Language') as HTMLSelectElement;
    const targetSelect = screen.getByLabelText('Target Language') as HTMLSelectElement;
    
    expect(sourceSelect.value).toBe('auto');
    expect(targetSelect.value).toBe('es');
  });

  test('translate button is disabled when input is empty', () => {
    render(<TextTranslation />);
    
    const translateButton = screen.getByText('Translate Text');
    expect(translateButton).toBeDisabled();
  });

  test('translate button is enabled when input has text', () => {
    render(<TextTranslation />);
    
    const textInput = screen.getByPlaceholderText('Enter text to translate...');
    fireEvent.change(textInput, { target: { value: 'Hello world' } });
    
    const translateButton = screen.getByText('Translate Text');
    expect(translateButton).toBeEnabled();
  });

  test('can change source and target languages', () => {
    render(<TextTranslation />);
    
    const sourceSelect = screen.getByLabelText('Source Language') as HTMLSelectElement;
    const targetSelect = screen.getByLabelText('Target Language') as HTMLSelectElement;
    
    fireEvent.change(sourceSelect, { target: { value: 'en' } });
    fireEvent.change(targetSelect, { target: { value: 'fr' } });
    
    expect(sourceSelect.value).toBe('en');
    expect(targetSelect.value).toBe('fr');
  });

  test('swap languages button is disabled when source is auto', () => {
    render(<TextTranslation />);
    
    const swapButton = screen.getByTitle('Swap languages');
    expect(swapButton).toBeDisabled();
  });

  test('swap languages button works when source is not auto', () => {
    render(<TextTranslation />);
    
    const sourceSelect = screen.getByLabelText('Source Language') as HTMLSelectElement;
    const targetSelect = screen.getByLabelText('Target Language') as HTMLSelectElement;
    
    // Set source to English
    fireEvent.change(sourceSelect, { target: { value: 'en' } });
    
    const swapButton = screen.getByTitle('Swap languages');
    expect(swapButton).toBeEnabled();
    
    // Click swap button
    fireEvent.click(swapButton);
    
    expect(sourceSelect.value).toBe('es');
    expect(targetSelect.value).toBe('en');
  });

  test('clear button appears when there is input', () => {
    render(<TextTranslation />);
    
    const textInput = screen.getByPlaceholderText('Enter text to translate...');
    fireEvent.change(textInput, { target: { value: 'Hello world' } });
    
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });
});