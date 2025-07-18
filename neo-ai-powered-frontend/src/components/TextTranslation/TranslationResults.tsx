import React from 'react';
import { TranslationResult } from '../../types';

interface TranslationResultsProps {
  result: TranslationResult;
}

const TranslationResults: React.FC<TranslationResultsProps> = ({ result }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="translation-results-container">
      <h4 className="translation-results-title">Translation Result</h4>
      
      <div className="translation-results-grid">
        <div className="translation-original-container">
          <div className="translation-text-header">
            <h5 className="translation-text-label">Original ({result.sourceLang})</h5>
            <button
              onClick={() => copyToClipboard(result.originalText)}
              className="copy-to-clipboard-button"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="translation-text-content">{result.originalText}</p>
        </div>
        
        <div className="translation-result-container">
          <div className="translation-text-header">
            <h5 className="translation-text-label">Translation ({result.targetLang})</h5>
            <button
              onClick={() => copyToClipboard(result.translatedText)}
              className="copy-to-clipboard-button"
              title="Copy to clipboard"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="translation-text-content">{result.translatedText}</p>
        </div>
      </div>
    </div>
  );
};

export default TranslationResults;