import React, { useState } from 'react';
import { CalorieResult } from '../../types';
import { useOpenAI } from '../../hooks/useOpenAI';
import LoadingSpinner from '../common/LoadingSpinner';
import CalorieResults from './CalorieResults';

const CalorieAnalysis: React.FC = () => {
  const [mealInput, setMealInput] = useState('');
  const [result, setResult] = useState<CalorieResult | null>(null);
  const { loading, analyzeCalories } = useOpenAI();

  const handleAnalyze = async () => {
    const calorieResult = await analyzeCalories(mealInput);
    if (calorieResult) {
      setResult(calorieResult);
    }
  };

  const handleClear = () => {
    setMealInput('');
    setResult(null);
  };

  return (
    <div className="feature-card">
      <h3 className="feature-card-title">Calorie Analysis</h3>
      
      <div className="feature-card-content">
        <div className="form-field-container">
          <label htmlFor="meal-input" className="form-label">
            Enter meal or ingredients
          </label>
          <textarea
            id="meal-input"
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            rows={3}
            className="form-textarea"
            placeholder="e.g., 2 slices of whole wheat bread, 1 banana, 1 cup of oatmeal"
            disabled={loading}
          />
        </div>

        <div className="button-group">
          <button
            onClick={handleAnalyze}
            disabled={loading || !mealInput.trim()}
            className="analyze-calories-button"
          >
            {loading ? 'Analyzing...' : 'Analyze Calories'}
          </button>
          
          {(mealInput || result) && (
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
        
        {result && <CalorieResults result={result} />}
      </div>
    </div>
  );
};

export default CalorieAnalysis;