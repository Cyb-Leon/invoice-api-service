/**
 * UI Module Index
 * Central export for all UI components
 */
import toast, { showToast } from './components/toast.js';
import modal, { openModal, closeModal, initModal } from './components/modal.js';
import forms, { companyForm, clientForm, invoiceForm, paymentForm, lineItemRow } from './components/forms.js';
import cards, { companyCard, clientCard, invoiceRow, invoiceListItem, paymentCard, formatCurrency, formatDate } from './components/cards.js';

export {
  // Toast
  toast,
  showToast,
  
  // Modal
  modal,
  openModal,
  closeModal,
  initModal,
  
  // Forms
  forms,
  companyForm,
  clientForm,
  invoiceForm,
  paymentForm,
  lineItemRow,
  
  // Cards
  cards,
  companyCard,
  clientCard,
  invoiceRow,
  invoiceListItem,
  paymentCard,
  formatCurrency,
  formatDate,
};

export default {
  toast,
  modal,
  forms,
  cards,
};
