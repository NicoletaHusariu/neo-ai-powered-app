import React, { useState } from 'react';
import { TranslationResult, SUPPORTED_LANGUAGES } from '../../types';
import { useOpenAI } from '../../hooks/useOpenAI';
import LoadingSpinner from '../common/LoadingSpinner';
import TranslationResults from './TranslationResults';

const TextTranslation: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const { loading, translateText } = useOpenAI();

  const handleTranslate = async () => {
    const translationResult = await translateText(textInput, sourceLang, targetLang);
    if (translationResult) {
      setResult(translationResult);
    }
  };

  const handleClear = () => {
    setTextInput('');
    setResult(null);
  };

  const handleSwapLanguages = () => {
    if (sourceLang !== 'auto' && targetLang !== 'auto') {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      setResult(null);
    }
  };

  return (
    <div className="feature-card">
      <h3 className="feature-card-title">Text Translation</h3>
      
      <div className="feature-card-content">
        <div className="form-grid-container">
          <div className="form-grid-item">
            <label htmlFor="source-lang" className="form-label">
              Source Language
            </label>
            <select
              id="source-lang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="form-select"
              disabled={loading}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-grid-item-with-button">
            <div className="form-grid-item-flex">
              <label htmlFor="target-lang" className="form-label">
                Target Language
              </label>
              <select
                id="target-lang"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="form-select"
                disabled={loading}
              >
                {SUPPORTED_LANGUAGES.filter(lang => lang.code !== 'auto').map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleSwapLanguages}
              disabled={loading || sourceLang === 'auto'}
              className="swap-languages-button"
              title="Swap languages"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="form-field-container">
          <label htmlFor="text-input" className="form-label">
            Text to translate
          </label>
          <textarea
            id="text-input"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={4}
            className="form-textarea"
            placeholder="Enter text to translate..."
            disabled={loading}
          />
        </div>
        
        <div className="button-group">
          <button
            onClick={handleTranslate}
            disabled={loading || !textInput.trim()}
            className="translate-text-button"
          >
            {loading ? 'Translating...' : 'Translate Text'}
          </button>
          
          {(textInput || result) && (
            <button
              onClick={handleClear}
              disabled={loading}
              className="clear-form-button"
            >
              Clear
            </button>
          )}
        </div>

        {loading && <LoadingSpinner />}
        
        {result && <TranslationResults result={result} />}
      </div>
    </div>
  );
};

export default TextTranslation;