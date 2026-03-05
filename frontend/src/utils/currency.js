/**
 * Currency Utility for Sri Lankan Rupees (LKR)
 * All prices in the system are stored and displayed in LKR
 */

// Currency configuration
export const CURRENCY = {
  code: "LKR",
  symbol: "Rs.",
  locale: "en-LK",
};

/**
 * Format amount as LKR currency string
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show Rs. prefix (default: true)
 * @returns {string} Formatted currency string (e.g., "Rs. 120,000")
 */
export const formatLKR = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? "Rs. 0" : "0";
  }

  const formatted = Math.round(amount).toLocaleString("en-US");
  return showSymbol ? `Rs. ${formatted}` : formatted;
};

/**
 * Format amount as LKR with decimal places
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string (e.g., "Rs. 120,000.00")
 */
export const formatLKRDecimal = (amount, decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Rs. 0.00";
  }

  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `Rs. ${formatted}`;
};

/**
 * Format amount as compact LKR (for large numbers)
 * @param {number} amount - The amount to format
 * @returns {string} Compact formatted string (e.g., "Rs. 1.2M")
 */
export const formatLKRCompact = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Rs. 0";
  }

  if (amount >= 1000000) {
    return `Rs. ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(1)}K`;
  }
  return `Rs. ${amount}`;
};

/**
 * Parse LKR string to number
 * @param {string} value - The currency string to parse
 * @returns {number} Parsed number
 */
export const parseLKR = (value) => {
  if (!value) return 0;
  // Remove Rs., commas, and whitespace
  const cleaned = String(value).replace(/Rs\.?|,|\s/g, "");
  return parseFloat(cleaned) || 0;
};

export default formatLKR;
