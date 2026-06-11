/**
 * Value Scaling and Adjustment Utility
 * Allows converting accurate values to display values with custom scaling
 * Example: 100% accuracy displayed as 75%
 */

/**
 * Scale a value from one range to another
 * @param {number} value - The actual value
 * @param {number} actualMin - Actual minimum value (default: 0)
 * @param {number} actualMax - Actual maximum value (default: 100)
 * @param {number} displayMin - Display minimum value (default: 0)
 * @param {number} displayMax - Display maximum value (default: 100)
 * @returns {number} - Scaled value
 */
export const scaleValue = (
  value,
  actualMin = 0,
  actualMax = 100,
  displayMin = 0,
  displayMax = 100
) => {
  if (actualMin === actualMax) return displayMin;
  
  const normalized = (value - actualMin) / (actualMax - actualMin);
  const scaled = displayMin + normalized * (displayMax - displayMin);
  
  return parseFloat(scaled.toFixed(2));
};

/**
 * Apply a percentage scale to a value
 * @param {number} value - The actual value
 * @param {number} scalePercentage - Percentage to scale (e.g., 75 for 75%)
 * @returns {number} - Scaled value
 */
export const applyPercentageScale = (value, scalePercentage = 100) => {
  return parseFloat(((value * scalePercentage) / 100).toFixed(2));
};

/**
 * Adjust value by a multiplier
 * @param {number} value - The actual value
 * @param {number} multiplier - Multiplier (e.g., 0.75 for 75%)
 * @returns {number} - Adjusted value
 */
export const adjustByMultiplier = (value, multiplier = 1) => {
  return parseFloat((value * multiplier).toFixed(2));
};

/**
 * Apply custom scaling with preset configurations
 * @param {number} value - The actual value
 * @param {string} preset - Preset type ('mild', 'moderate', 'aggressive')
 * @returns {number} - Scaled value
 */
export const applyPresetScale = (value, preset = 'moderate') => {
  const presets = {
    mild: 0.95,      // 95% of actual value
    moderate: 0.85,  // 85% of actual value
    aggressive: 0.75 // 75% of actual value
  };
  
  const multiplier = presets[preset] || presets.moderate;
  return adjustByMultiplier(value, multiplier);
};

/**
 * Format value for display with optional scaling
 * @param {number} value - The actual value
 * @param {number} scale - Scale percentage (0-100)
 * @param {number} decimals - Decimal places (default: 1)
 * @returns {string} - Formatted string with % symbol
 */
export const formatValueDisplay = (value, scale = 100, decimals = 1) => {
  const scaled = applyPercentageScale(value, scale);
  return `${scaled.toFixed(decimals)}%`;
};

/**
 * Create a scaling config object for consistency
 * @param {string} name - Config name
 * @param {number} scalePercentage - Scale percentage
 * @param {string} description - Description
 * @returns {object} - Config object
 */
export const createScalingConfig = (name, scalePercentage, description = '') => {
  return {
    name,
    scalePercentage,
    description,
    scale: (value) => applyPercentageScale(value, scalePercentage),
    format: (value) => formatValueDisplay(value, scalePercentage)
  };
};

// Predefined scaling configs
export const SCALING_CONFIGS = {
  DEVICE_DISPLAY: createScalingConfig(
    'Device Display',
    75,
    'Scale device accuracy from 100% to 75% for display'
  ),
  CONSERVATIVE: createScalingConfig(
    'Conservative',
    85,
    'Conservative scaling at 85%'
  ),
  MODERATE: createScalingConfig(
    'Moderate',
    80,
    'Moderate scaling at 80%'
  ),
  OPTIMISTIC: createScalingConfig(
    'Optimistic',
    90,
    'Optimistic scaling at 90%'
  )
};

// Export commonly used scaling function
export const getScaledDisplayValue = (actualValue, config = SCALING_CONFIGS.DEVICE_DISPLAY) => {
  return config.scale(actualValue);
};

export const getFormattedDisplayValue = (actualValue, config = SCALING_CONFIGS.DEVICE_DISPLAY) => {
  return config.format(actualValue);
};
