import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history on initial mount
  useEffect(() => {
    const saved = localStorage.getItem('bmi_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // Save history on changes
  const saveHistoryToStorage = (updatedHistory) => {
    setHistory(updatedHistory);
    localStorage.setItem('bmi_history', JSON.stringify(updatedHistory));
  };

  const getBMICategory = (val) => {
    if (val < 18.5) {
      return { label: 'Underweight', color: '#0284c7', bg: '#e0f2fe', desc: 'Below recommended body weight range.' };
    } else if (val >= 18.5 && val <= 24.9) {
      return { label: 'Normal weight', color: '#16a34a', bg: '#dcfce7', desc: 'Healthy body weight range.' };
    } else if (val >= 25 && val <= 29.9) {
      return { label: 'Overweight', color: '#d97706', bg: '#fef3c7', desc: 'Above recommended body weight range.' };
    } else {
      return { label: 'Obese', color: '#dc2626', bg: '#fee2e2', desc: 'Significantly above healthy range.' };
    }
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) return;

    const heightInMeters = h / 100;
    const bmiVal = parseFloat((w / (heightInMeters * heightInMeters)).toFixed(1));
    const cat = getBMICategory(bmiVal);

    setBmi(bmiVal);
    setCategory(cat);

    // Add to history log
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      height: h,
      weight: w,
      bmi: bmiVal,
      categoryLabel: cat.label,
      categoryColor: cat.color
    };

    const updated = [newEntry, ...history];
    saveHistoryToStorage(updated);
  };

  const deleteHistoryItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    saveHistoryToStorage(updated);
  };

  const clearHistory = () => {
    saveHistoryToStorage([]);
  };

  return (
    <div className="medical-app-container">
      <div className="bmi-card">
        <header className="bmi-header">
          <div className="header-icon">🩺</div>
          <div>
            <h1>BMI Calculator</h1>
            <p>Calculate your Body Mass Index & track history</p>
          </div>
        </header>

        <form onSubmit={calculateBMI} className="bmi-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="height-input">Height (cm)</label>
              <input
                id="height-input"
                type="number"
                min="50"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="weight-input">Weight (kg)</label>
              <input
                id="weight-input"
                type="number"
                min="20"
                max="300"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
                required
              />
            </div>
          </div>

          <button type="submit" className="calc-btn">
            Calculate BMI
          </button>
        </form>

        {/* BMI Result Display */}
        {bmi && category && (
          <div className="result-section" style={{ backgroundColor: category.bg, borderColor: category.color }}>
            <div className="result-header">
              <span className="result-title">Your Result</span>
              <span className="result-category" style={{ color: category.color, borderColor: category.color }}>
                {category.label}
              </span>
            </div>

            <div className="result-value" style={{ color: category.color }}>
              {bmi}
            </div>

            <p className="result-desc">{category.desc}</p>

            <div className="range-indicator">
              <div className="range-bar">
                <span className="segment seg-under">Under</span>
                <span className="segment seg-normal">Normal</span>
                <span className="segment seg-over">Over</span>
                <span className="segment seg-obese">Obese</span>
              </div>
            </div>
          </div>
        )}

        {/* History Log */}
        <div className="history-section">
          <div className="history-header">
            <h3>📜 History Log ({history.length})</h3>
            {history.length > 0 && (
              <button className="clear-btn" onClick={clearHistory}>
                Clear All
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="no-history">No calculations saved yet.</p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-info">
                    <span className="history-bmi">{item.bmi} BMI</span>
                    <span 
                      className="history-badge" 
                      style={{ color: item.categoryColor, backgroundColor: `${item.categoryColor}15` }}
                    >
                      {item.categoryLabel}
                    </span>
                  </div>
                  <div className="history-meta">
                    <span>{item.height} cm, {item.weight} kg</span>
                    <span className="history-date">• {item.date}</span>
                  </div>
                  <button 
                    className="delete-item-btn" 
                    onClick={() => deleteHistoryItem(item.id)}
                    title="Delete log"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
