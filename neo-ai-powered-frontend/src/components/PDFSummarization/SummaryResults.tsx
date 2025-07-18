import React from 'react';
import { SummaryResult } from '../../types';

interface SummaryResultsProps {
  result: SummaryResult;
}

/**
 * Displays the AI-generated summary, key points, and word count.
 * Includes clipboard copy functionality for each section.
 */
const SummaryResults: React.FC<SummaryResultsProps> = ({ result }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="summary-results-container">
      <h4 className="summary-results-title">Document Summary</h4>

      <div className="summary-results-content">
        {/* Summary Text Section */}
        <div className="summary-text-container">
          <div className="summary-text-header">
            <h5 className="summary-text-label">Summary</h5>
            <button
              onClick={() => copyToClipboard(result.summary)}
              className="copy-to-clipboard-button"
              title="Copy summary"
            >
              📋
            </button>
          </div>
          <p className="summary-text-content">{result.summary}</p>
        </div>

        {/* Key Points Section */}
        <div className="summary-keypoints-container">
          <div className="summary-text-header">
            <h5 className="summary-text-label">Key Points</h5>
            <button
              onClick={() => copyToClipboard(result.keyPoints.join('\n• '))}
              className="copy-to-clipboard-button"
              title="Copy key points"
            >
              📋
            </button>
          </div>
          <ul className="summary-keypoints-list">
            {result.keyPoints.map((point, index) => (
              <li key={index} className="summary-keypoint-item">
                <span className="summary-keypoint-bullet">•</span>
                <span className="summary-keypoint-text">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Word Count Stats */}
        <div className="summary-stats-container">
          <div className="summary-stats-content">
            <span className="summary-stats-label">Document Statistics</span>
            <span className="summary-stats-value">
              Word count: <span className="summary-word-count">{result.wordCount.toLocaleString()}</span> words
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryResults;
