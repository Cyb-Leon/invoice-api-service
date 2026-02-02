/**
 * Payments API Module
 * Handles all payment-related API calls
 */
import api from './client.js';

/**
 * Gets all payments for an invoice
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<Array>} List of payments
 */
export async function getInvoicePayments(invoiceId) {
  return api.get(`/invoices/${invoiceId}/payments`);
}

/**
 * Gets a payment by ID
 * @param {number} paymentId - Payment ID
 * @returns {Promise<Object>} Payment data
 */
export async function getPaymentById(paymentId) {
  return api.get(`/payments/${paymentId}`);
}

/**
 * Gets all payments for a company
 * @param {number} companyId - Company ID
 * @returns {Promise<Array>} List of payments
 */
export async function getCompanyPayments(companyId) {
  return api.get(`/companies/${companyId}/payments`);
}

/**
 * Gets payments within a date range
 * @param {number} companyId - Company ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Payments in date range
 */
export async function getPaymentsByDateRange(companyId, startDate, endDate) {
  return api.get(`/companies/${companyId}/payments/date-range`, { startDate, endDate });
}

/**
 * Gets unreconciled payments
 * @param {number} companyId - Company ID
 * @returns {Promise<Array>} Unreconciled payments
 */
export async function getUnreconciledPayments(companyId) {
  return api.get(`/companies/${companyId}/payments/unreconciled`);
}

/**
 * Records a payment for an invoice
 * @param {number} invoiceId - Invoice ID
 * @param {Object} paymentData - Payment data
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.paymentDate - Payment date
 * @param {string} paymentData.paymentMethod - Payment method (EFT, SnapScan, etc.)
 * @param {string} paymentData.referenceNumber - Reference number
 * @returns {Promise<Object>} Created payment
 */
export async function recordPayment(invoiceId, paymentData) {
  return api.post(`/invoices/${invoiceId}/payments`, paymentData);
}

/**
 * Updates a payment
 * @param {number} paymentId - Payment ID
 * @param {Object} paymentData - Updated payment data
 * @returns {Promise<Object>} Updated payment
 */
export async function updatePayment(paymentId, paymentData) {
  return api.put(`/payments/${paymentId}`, paymentData);
}

/**
 * Marks a payment as reconciled
 * @param {number} paymentId - Payment ID
 * @returns {Promise<Object>} Reconciled payment
 */
export async function reconcilePayment(paymentId) {
  return api.post(`/payments/${paymentId}/reconcile`);
}

/**
 * Deletes a payment
 * @param {number} paymentId - Payment ID
 * @returns {Promise<void>}
 */
export async function deletePayment(paymentId) {
  return api.delete(`/payments/${paymentId}`);
}

/**
 * Available payment methods in South Africa
 */
export const PaymentMethods = {
  EFT: 'EFT',
  SNAPSCAN: 'SnapScan',
  ZAPPER: 'Zapper',
  PAYFAST: 'PayFast',
  CARD: 'Credit/Debit Card',
  CASH: 'Cash',
  CHEQUE: 'Cheque',
};

export default {
  getInvoicePayments,
  getPaymentById,
  getCompanyPayments,
  getPaymentsByDateRange,
  getUnreconciledPayments,
  recordPayment,
  updatePayment,
  reconcilePayment,
  deletePayment,
  PaymentMethods,
};
