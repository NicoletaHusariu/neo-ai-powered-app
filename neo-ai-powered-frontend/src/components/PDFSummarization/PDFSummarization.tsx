import React, { useState, useRef } from 'react';
import { SummaryResult } from '../../types';
import { useOpenAI } from '../../hooks/useOpenAI';
import LoadingSpinner from '../common/LoadingSpinner';
import SummaryResults from './SummaryResults';

/**
 * This component handles PDF and TXT file uploads,
 * extracts content, and uses AI to summarize it.
 */
const PDFSummarization: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const { loading, summarizePDF, setError } = useOpenAI();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Accepts PDF or TXT files and resets result on change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      setPdfFile(file);
      setResult(null);
      setError(null);
    } else {
      setError('Please select a valid PDF or TXT file.');
    }
  };

  // Naive text extraction (placeholder) from PDF or TXT
  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;

        if (file.type === 'application/pdf' && (content.startsWith('%PDF') || content.includes('stream'))) {
          // Simulate extracted text for demo purposes
          resolve(`Sample PDF content for summarization.

(Replace this with actual parsing logic)`);
        } else {
          resolve(content);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Sends extracted text to OpenAI and stores result
  const handleSummarize = async () => {
    if (!pdfFile) return;
    try {
      setError(null);
      const fileText = await extractTextFromFile(pdfFile);

      if (!fileText || fileText.trim().length < 50) {
        setError('File is empty or too short.');
        return;
      }

      const summaryResult = await summarizePDF(fileText);
      if (summaryResult) setResult(summaryResult);
    } catch (error) {
      console.error('PDF processing error:', error);
      setError('Could not process file.');
    }
  };

  const handleClear = () => {
    setPdfFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      setPdfFile(file);
      setResult(null);
      setError(null);
    } else {
      setError('Invalid file type.');
    }
  };

  return (
    <div className="feature-card">
      <h3 className="feature-card-title">PDF Summarization</h3>
      <div className="feature-card-content">
        {/* File input field */}
        <div className="form-field-container">
          <label htmlFor="pdf-upload" className="form-label">Upload PDF or TXT</label>
          <div className="file-upload-container" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <div className="file-upload-content">
              <label htmlFor="pdf-upload" className="file-upload-button-text">
                <span>Upload a file</span>
                <input
                  ref={fileInputRef}
                  id="pdf-upload"
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="screen-reader-only"
                  disabled={loading}
                />
              </label>
              <p className="file-upload-drag-text">or drag and drop</p>
              <p className="file-upload-size-hint">Max 10MB</p>
            </div>
          </div>

          {/* Show file name if uploaded */}
          {pdfFile && (
            <div className="uploaded-file-display">
              <div className="uploaded-file-info">
                <span className="uploaded-file-name">{pdfFile.name}</span>
                <span className="uploaded-file-size">({(pdfFile.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button onClick={handleClear} className="remove-file-button" disabled={loading} title="Remove">
                ×
              </button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button onClick={handleSummarize} disabled={loading || !pdfFile} className="summarize-pdf-button">
            {loading ? 'Summarizing...' : 'Summarize Document'}
          </button>
          {(pdfFile || result) && (
            <button onClick={handleClear} disabled={loading} className="clear-form-button">Clear</button>
          )}
        </div>

        {/* Loading + Result */}
        {loading && <LoadingSpinner />}
        {result && <SummaryResults result={result} />}
      </div>
    </div>
  );
};

export default PDFSummarization;
