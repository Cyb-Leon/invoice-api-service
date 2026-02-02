/**
 * Toast Notification Component
 * Displays temporary notification messages
 */

const TOAST_DURATION = 4000;
const TOAST_ANIMATION_DURATION = 300;

/**
 * Toast types with their respective icons
 */
const toastIcons = {
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <path d="M22 4L12 14.01l-3-3"/>
  </svg>`,
  error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M15 9l-6 6M9 9l6 6"/>
  </svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <path d="M12 9v4M12 17h.01"/>
  </svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4M12 8h.01"/>
  </svg>`,
};

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in ms (default: 4000)
 */
export function showToast(message, type = 'info', duration = TOAST_DURATION) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${toastIcons[type] || toastIcons.info}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, TOAST_ANIMATION_DURATION);
  }, duration);
}

/**
 * Convenience methods for different toast types
 */
export const toast = {
  success: (message, duration) => showToast(message, 'success', duration),
  error: (message, duration) => showToast(message, 'error', duration),
  warning: (message, duration) => showToast(message, 'warning', duration),
  info: (message, duration) => showToast(message, 'info', duration),
};

/**
 * Escapes HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default toast;
