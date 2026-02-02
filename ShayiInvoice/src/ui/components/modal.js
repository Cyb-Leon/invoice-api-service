/**
 * Modal Component
 * Reusable modal dialog system
 */
import { gsap } from 'gsap';

const modalState = {
  isOpen: false,
  onClose: null,
};

/**
 * Opens a modal with the given content
 * @param {Object} options - Modal options
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal HTML content
 * @param {Function} options.onClose - Callback when modal closes
 * @param {Function} options.onSubmit - Form submit callback
 */
export function openModal(options) {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('modal-container');
  const content = document.getElementById('modal-content');
  
  if (!overlay || !container || !content) return;

  const { title = '', content: htmlContent = '', onClose, onSubmit } = options;

  // Set content
  content.innerHTML = `
    ${title ? `<h2 class="modal-title">${title}</h2>` : ''}
    ${htmlContent}
  `;

  // Store callbacks
  modalState.isOpen = true;
  modalState.onClose = onClose;

  // Handle form submission if onSubmit provided
  if (onSubmit) {
    const form = content.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
      });
    }
  }

  // Show modal with animation
  overlay.classList.remove('hidden');
  
  gsap.fromTo(container, 
    { scale: 0.9, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
  );
}

/**
 * Closes the modal
 */
export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  const container = document.getElementById('modal-container');
  
  if (!overlay || !container || !modalState.isOpen) return;

  gsap.to(container, {
    scale: 0.9,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      overlay.classList.add('hidden');
      modalState.isOpen = false;
      
      if (modalState.onClose) {
        modalState.onClose();
        modalState.onClose = null;
      }
    }
  });
}

/**
 * Initializes modal event listeners
 */
export function initModal() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalState.isOpen) {
      closeModal();
    }
  });
}

/**
 * Checks if modal is currently open
 * @returns {boolean}
 */
export function isModalOpen() {
  return modalState.isOpen;
}

export default {
  open: openModal,
  close: closeModal,
  init: initModal,
  isOpen: isModalOpen,
};
