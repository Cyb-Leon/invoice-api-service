/**
 * Invoices API Module
 * Handles all invoice-related API calls
 */
import api from './client.js';

/**
 * Gets all invoices for a company
 * @param {number} companyId - Company ID
 * @returns {Promise<Array>} List of invoices
 */
export async function getInvoices(companyId) {
  return api.get(`/companies/${companyId}/invoices`);
}

/**
 * Gets an invoice by ID
 * @param {number} companyId - Company ID
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<Object>} Invoice data
 */
export async function getInvoiceById(companyId, invoiceId) {
  return api.get(`/companies/${companyId}/invoices/${invoiceId}`);
}

/**
 * Gets an invoice by invoice number
 * @param {number} companyId - Company ID
 * @param {string} invoiceNumber - Invoice number
 * @returns {Promise<Object>} Invoice data
 */
export async function getInvoiceByNumber(companyId, invoiceNumber) {
  return api.get(`/companies/${companyId}/invoices/number/${invoiceNumber}`);
}

/**
 * Gets invoices for a specific client
 * @param {number} companyId - Company ID
 * @param {number} clientId - Client ID
 * @returns {Promise<Array>} Client's invoices
 */
export async function getClientInvoices(companyId, clientId) {
  return api.get(`/companies/${companyId}/invoices/client/${clientId}`);
}

/**
 * Gets invoices by status
 * @param {number} companyId - Company ID
 * @param {string} status - Invoice status (DRAFT, PENDING, SENT, PAID, etc.)
 * @returns {Promise<Array>} Invoices with matching status
 */
export async function getInvoicesByStatus(companyId, status) {
  return api.get(`/companies/${companyId}/invoices/status/${status}`);
}

/**
 * Gets overdue invoices
 * @param {number} companyId - Company ID
 * @returns {Promise<Array>} Overdue invoices
 */
export async function getOverdueInvoices(companyId) {
  return api.get(`/companies/${companyId}/invoices/overdue`);
}

/**
 * Searches invoices
 * @param {number} companyId - Company ID
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching invoices
 */
export async function searchInvoices(companyId, query) {
  return api.get(`/companies/${companyId}/invoices/search`, { query });
}

/**
 * Gets invoices within a date range
 * @param {number} companyId - Company ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Invoices in date range
 */
export async function getInvoicesByDateRange(companyId, startDate, endDate) {
  return api.get(`/companies/${companyId}/invoices/date-range`, { startDate, endDate });
}

/**
 * Creates a new invoice
 * @param {number} companyId - Company ID
 * @param {Object} invoiceData - Invoice data
 * @param {number} invoiceData.clientId - Client ID
 * @param {string} invoiceData.issueDate - Issue date
 * @param {string} invoiceData.dueDate - Due date
 * @param {string} invoiceData.notes - Notes
 * @param {string} invoiceData.termsAndConditions - Terms
 * @param {Array} invoiceData.lineItems - Line items
 * @returns {Promise<Object>} Created invoice
 */
export async function createInvoice(companyId, invoiceData) {
  return api.post(`/companies/${companyId}/invoices`, invoiceData);
}

/**
 * Updates an invoice
 * @param {number} companyId - Company ID
 * @param {number} invoiceId - Invoice ID
 * @param {Object} invoiceData - Updated invoice data
 * @returns {Promise<Object>} Updated invoice
 */
export async function updateInvoice(companyId, invoiceId, invoiceData) {
  return api.put(`/companies/${companyId}/invoices/${invoiceId}`, invoiceData);
}

/**
 * Updates invoice status
 * @param {number} companyId - Company ID
 * @param {number} invoiceId - Invoice ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated invoice
 */
export async function updateInvoiceStatus(companyId, invoiceId, status) {
  return api.patch(`/companies/${companyId}/invoices/${invoiceId}/status`, { status });
}

/**
 * Marks an invoice as sent
 * @param {number} companyId - Company ID
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<Object>} Updated invoice
 */
export async function sendInvoice(companyId, invoiceId) {
  return api.post(`/companies/${companyId}/invoices/${invoiceId}/send`);
}

/**
 * Cancels an invoice
 * @param {number} companyId - Company ID
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<Object>} Cancelled invoice
 */
export async function cancelInvoice(companyId, invoiceId) {
  return api.post(`/companies/${companyId}/invoices/${invoiceId}/cancel`);
}

/**
 * Deletes a draft invoice
 * @param {number} companyId - Company ID
 * @param {number} invoiceId - Invoice ID
 * @returns {Promise<void>}
 */
export async function deleteInvoice(companyId, invoiceId) {
  return api.delete(`/companies/${companyId}/invoices/${invoiceId}`);
}

export default {
  getInvoices,
  getInvoiceById,
  getInvoiceByNumber,
  getClientInvoices,
  getInvoicesByStatus,
  getOverdueInvoices,
  searchInvoices,
  getInvoicesByDateRange,
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  sendInvoice,
  cancelInvoice,
  deleteInvoice,
};
