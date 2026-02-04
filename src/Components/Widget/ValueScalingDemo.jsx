import React, { useState } from 'react';
import {
  scaleValue,
  applyPercentageScale,
  adjustByMultiplier,
  applyPresetScale,
  formatValueDisplay,
  SCALING_CONFIGS,
  getFormattedDisplayValue
} from '@/_helper/valueScaling';
import './ValueScaling.css';

const ValueScalingDemo = () => {
  const [actualValue, setActualValue] = useState(100);
  const [scalePercentage, setScalePercentage] = useState(75);
  const [selectedPreset, setSelectedPreset] = useState('moderate');

  // Calculate different scaling options
  const scaledValue = applyPercentageScale(actualValue, scalePercentage);
  const presetValue = applyPresetScale(actualValue, selectedPreset);
  const formattedValue = formatValueDisplay(actualValue, scalePercentage);
  const customScaled = scaleValue(actualValue, 0, 100, 0, 75);

  return (
    <div className="value-scaling-container">
      <div className="scaling-card">
        <h2>Value Scaling & Adjustment Demo</h2>
        <p className="subtitle">Scale device values, accuracy percentages, or any metric for display</p>

        {/* Input Section */}
        <div className="scaling-section input-section">
          <h3>Configuration</h3>
          
          <div className="input-group">
            <label>Actual Device Value / Accuracy (%)</label>
            <div className="input-control">
              <input
                type="range"
                min="0"
                max="100"
                value={actualValue}
                onChange={(e) => setActualValue(Number(e.target.value))}
                className="slider"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={actualValue}
                onChange={(e) => setActualValue(Number(e.target.value))}
                className="number-input"
              />
            </div>
            <small>Current Actual Value: {actualValue}%</small>
          </div>

          <div className="input-group">
            <label>Display Scale Percentage (%)</label>
            <div className="input-control">
              <input
                type="range"
                min="0"
                max="100"
                value={scalePercentage}
                onChange={(e) => setScalePercentage(Number(e.target.value))}
                className="slider"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={scalePercentage}
                onChange={(e) => setScalePercentage(Number(e.target.value))}
                className="number-input"
              />
            </div>
            <small>Scale to display at: {scalePercentage}%</small>
          </div>

          <div className="input-group">
            <label>Preset Scaling</label>
            <div className="preset-buttons">
              {[
                { id: 'mild', label: 'Mild (95%)', color: '#28a745' },
                { id: 'moderate', label: 'Moderate (85%)', color: '#ffc107' },
                { id: 'aggressive', label: 'Aggressive (75%)', color: '#dc3545' }
              ].map(preset => (
                <button
                  key={preset.id}
                  className={`preset-btn ${selectedPreset === preset.id ? 'active' : ''}`}
                  style={selectedPreset === preset.id ? { borderColor: preset.color, color: preset.color } : {}}
                  onClick={() => setSelectedPreset(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="scaling-section results-section">
          <h3>Scaling Results</h3>

          <div className="result-card">
            <div className="result-row">
              <span className="label">Actual Value:</span>
              <span className="value actual">{actualValue}%</span>
            </div>
          </div>

          <div className="result-card primary">
            <div className="result-row">
              <span className="label">Scaled by {scalePercentage}%:</span>
              <span className="value scaled">{scaledValue}%</span>
            </div>
            <div className="result-row">
              <span className="label">Formatted:</span>
              <span className="value formatted">{formattedValue}</span>
            </div>
            <div className="progress-demo">
              <div className="progress-bar" style={{ width: `${scaledValue}%` }}></div>
            </div>
          </div>

          <div className="result-card preset">
            <div className="result-row">
              <span className="label">Preset ({selectedPreset}):</span>
              <span className="value preset-value">{presetValue}%</span>
            </div>
            <div className="progress-demo">
              <div className="progress-bar preset" style={{ width: `${presetValue}%` }}></div>
            </div>
          </div>

          <div className="result-card custom">
            <div className="result-row">
              <span className="label">Range Scaling (0-100 → 0-75):</span>
              <span className="value custom-value">{customScaled}%</span>
            </div>
            <div className="progress-demo">
              <div className="progress-bar custom" style={{ width: `${customScaled}%` }}></div>
            </div>
          </div>
        </div>

        {/* Predefined Configs Section */}
        <div className="scaling-section configs-section">
          <h3>Predefined Scaling Configurations</h3>
          <div className="configs-grid">
            {Object.entries(SCALING_CONFIGS).map(([key, config]) => (
              <div key={key} className="config-card">
                <h4>{config.name}</h4>
                <p className="config-description">{config.description}</p>
                <div className="config-value">
                  <span className="label">Value at {config.scalePercentage}%:</span>
                  <span className="value">{config.format(actualValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Examples */}
        <div className="scaling-section examples-section">
          <h3>Code Examples</h3>
          <div className="code-examples">
            <div className="code-example">
              <h5>Example 1: Simple Percentage Scaling</h5>
              <pre><code>{`import { applyPercentageScale } from '@/_helper/valueScaling';

// Scale 100% to 75%
const displayValue = applyPercentageScale(100, 75);
console.log(displayValue); // 75`}</code></pre>
            </div>

            <div className="code-example">
              <h5>Example 2: Using Preset Scales</h5>
              <pre><code>{`import { applyPresetScale } from '@/_helper/valueScaling';

// Apply moderate scaling (85%)
const value = applyPresetScale(100, 'moderate');
console.log(value); // 85`}</code></pre>
            </div>

            <div className="code-example">
              <h5>Example 3: Format for Display</h5>
              <pre><code>{`import { formatValueDisplay } from '@/_helper/valueScaling';

// Format with custom scale
const display = formatValueDisplay(100, 75);
console.log(display); // "75%"`}</code></pre>
            </div>

            <div className="code-example">
              <h5>Example 4: Range Scaling</h5>
              <pre><code>{`import { scaleValue } from '@/_helper/valueScaling';

// Scale from 0-100 range to 0-75 range
const scaled = scaleValue(100, 0, 100, 0, 75);
console.log(scaled); // 75`}</code></pre>
            </div>

            <div className="code-example">
              <h5>Example 5: Device Accuracy Display</h5>
              <pre><code>{`import { getFormattedDisplayValue, SCALING_CONFIGS } from '@/_helper/valueScaling';

// Display device accuracy scaled down
const accuracy = getFormattedDisplayValue(100, SCALING_CONFIGS.DEVICE_DISPLAY);
console.log(accuracy); // "75%"`}</code></pre>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <h4>When to Use Value Scaling:</h4>
          <ul>
            <li><strong>Device Metrics:</strong> Display device accuracy or performance at a scaled percentage</li>
            <li><strong>Analytics:</strong> Show adjusted metrics for better UX presentation</li>
            <li><strong>Progress Bars:</strong> Display realistic progress that accounts for system overhead</li>
            <li><strong>Performance Metrics:</strong> Show achievable performance vs theoretical maximum</li>
            <li><strong>Battery/Storage:</strong> Display usable capacity instead of raw capacity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValueScalingDemo;
