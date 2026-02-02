/**
 * Helper Utilities
 * Common utility functions
 */

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Formats a number as currency (ZAR)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount || 0);
}

/**
 * Formats a date string
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return '-';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Date(date).toLocaleDateString('en-ZA', defaultOptions);
}

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clones an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Checks if a value is empty (null, undefined, empty string, or empty array/object)
 * @param {any} value - Value to check
 * @returns {boolean} Whether the value is empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Validates SA VAT number format
 * @param {string} vatNumber - VAT number to validate
 * @returns {boolean} Whether the VAT number is valid
 */
export function isValidVatNumber(vatNumber) {
  if (!vatNumber) return false;
  return /^4\d{9}$/.test(vatNumber);
}

/**
 * Validates SA company registration number format
 * @param {string} regNumber - Registration number to validate
 * @returns {boolean} Whether the registration number is valid
 */
export function isValidRegistrationNumber(regNumber) {
  if (!regNumber) return false;
  return /^\d{4}\/\d{6}\/\d{2}$/.test(regNumber);
}

/**
 * Validates SA phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
export function isValidPhoneNumber(phoneNumber) {
  if (!phoneNumber) return false;
  // Accepts +27... or 0...
  return /^(\+27|0)\d{9}$/.test(phoneNumber.replace(/\s/g, ''));
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Gets the current theme from localStorage or system preference
 * @returns {string} 'dark' or 'light'
 */
export function getTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Sets the theme and persists to localStorage
 * @param {string} theme - 'dark' or 'light'
 */
export function setTheme(theme) {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Toggles between dark and light theme
 * @returns {string} The new theme
 */
export function toggleTheme() {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

/**
 * Stores data in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

/**
 * Retrieves data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} Stored value or default
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn('Failed to read from localStorage:', e);
    return defaultValue;
  }
}

export default {
  debounce,
  throttle,
  formatCurrency,
  formatDate,
  generateId,
  deepClone,
  isEmpty,
  capitalize,
  isValidVatNumber,
  isValidRegistrationNumber,
  isValidPhoneNumber,
  isValidEmail,
  getTheme,
  setTheme,
  toggleTheme,
  setStorageItem,
  getStorageItem,
};
