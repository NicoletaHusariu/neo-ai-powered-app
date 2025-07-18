import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PDFSummarization from '../../components/PDFSummarization/PDFSummarization';

// Mock the OpenAI hook
jest.mock('../../hooks/useOpenAI', () => ({
  useOpenAI: () => ({
    loading: false,
    error: null,
    summarizePDF: jest.fn(),
    setError: jest.fn(),
  }),
}));

describe('PDFSummarization Component', () => {
  test('renders PDF summarization form', () => {
    render(<PDFSummarization />);
    
    expect(screen.getByText('PDF Summarization')).toBeInTheDocument();
    expect(screen.getByText('Upload PDF file')).toBeInTheDocument();
    expect(screen.getByText('Upload a PDF file')).toBeInTheDocument();
    expect(screen.getByText('Summarize PDF')).toBeInTheDocument();
  });

  test('summarize button is disabled when no file is selected', () => {
    render(<PDFSummarization />);
    
    const summarizeButton = screen.getByText('Summarize PDF');
    expect(summarizeButton).toBeDisabled();
  });

  test('accepts PDF file upload', () => {
    render(<PDFSummarization />);
    
    const fileInput = screen.getByLabelText('Upload a PDF file');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  test('summarize button is enabled when PDF file is selected', () => {
    render(<PDFSummarization />);
    
    const fileInput = screen.getByLabelText('Upload a PDF file');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const summarizeButton = screen.getByText('Summarize PDF');
    expect(summarizeButton).toBeEnabled();
  });

  test('clear button appears when file is selected', () => {
    render(<PDFSummarization />);
    
    const fileInput = screen.getByLabelText('Upload a PDF file');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  test('clear button removes selected file', () => {
    render(<PDFSummarization />);
    
    const fileInput = screen.getByLabelText('Upload a PDF file');
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    
    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
  });

  test('shows error for non-PDF files', () => {
    const mockSetError = jest.fn();
    const mockUseOpenAI = require('../../hooks/useOpenAI').useOpenAI;
    mockUseOpenAI.mockReturnValue({
      loading: false,
      error: null,
      summarizePDF: jest.fn(),
      setError: mockSetError,
    });

    render(<PDFSummarization />);
    
    const fileInput = screen.getByLabelText('Upload a PDF file');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(mockSetError).toHaveBeenCalledWith('Please select a valid PDF file.');
  });
});