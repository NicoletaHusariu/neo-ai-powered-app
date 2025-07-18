import React from 'react';
import { CalorieResult } from '../../types';

interface CalorieResultsProps {
  result: CalorieResult;
}

const CalorieResults: React.FC<CalorieResultsProps> = ({ result }) => {
  return (
    <div className="results-container">
      <div className="results-header">
        <h4 className="results-title">
          Total Calories: {result.totalCalories}
        </h4>
        <div className="results-badge">
          {result.breakdown.length} items
        </div>
      </div>
      
      <div className="results-content">
        {result.breakdown.map((item, index) => (
          <div key={index} className="result-item">
            <div className="result-item-header">
              <h5 className="result-item-title">{item.food}</h5>
              <span className="result-item-value">
                {item.calories} cal
              </span>
            </div>
            <p className="result-item-details">{item.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalorieResults;