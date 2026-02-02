/**
 * Clients API Module
 * Handles all client-related API calls
 */
import api from './client.js';

/**
 * Gets all clients for a company
 * @param {number} companyId - Company ID
 * @returns {Promise<Array>} List of clients
 */
export async function getClients(companyId) {
  return api.get(`/companies/${companyId}/clients`);
}

/**
 * Gets a client by ID
 * @param {number} companyId - Company ID
 * @param {number} clientId - Client ID
 * @returns {Promise<Object>} Client data
 */
export async function getClientById(companyId, clientId) {
  return api.get(`/companies/${companyId}/clients/${clientId}`);
}

/**
 * Gets active clients for a company
 * @param {number} companyId - Company ID
 * @returns {Promise<Array>} List of active clients
 */
export async function getActiveClients(companyId) {
  return api.get(`/companies/${companyId}/clients/active`);
}

/**
 * Searches clients by query
 * @param {number} companyId - Company ID
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching clients
 */
export async function searchClients(companyId, query) {
  return api.get(`/companies/${companyId}/clients/search`, { query });
}

/**
 * Creates a new client
 * @param {number} companyId - Company ID
 * @param {Object} clientData - Client data
 * @param {string} clientData.name - Client name
 * @param {string} clientData.contactPerson - Contact person name
 * @param {string} clientData.email - Email address
 * @param {string} clientData.phoneNumber - Phone number
 * @param {string} clientData.billingAddress - Billing address
 * @param {string} clientData.city - City
 * @param {string} clientData.province - Province
 * @param {string} clientData.postalCode - Postal code
 * @param {number} clientData.paymentTerms - Payment terms in days
 * @returns {Promise<Object>} Created client
 */
export async function createClient(companyId, clientData) {
  return api.post(`/companies/${companyId}/clients`, clientData);
}

/**
 * Updates a client
 * @param {number} companyId - Company ID
 * @param {number} clientId - Client ID
 * @param {Object} clientData - Updated client data
 * @returns {Promise<Object>} Updated client
 */
export async function updateClient(companyId, clientId, clientData) {
  return api.put(`/companies/${companyId}/clients/${clientId}`, clientData);
}

/**
 * Activates a client
 * @param {number} companyId - Company ID
 * @param {number} clientId - Client ID
 * @returns {Promise<Object>} Updated client
 */
export async function activateClient(companyId, clientId) {
  return api.patch(`/companies/${companyId}/clients/${clientId}/activate`);
}

/**
 * Deactivates a client
 * @param {number} companyId - Company ID
 * @param {number} clientId - Client ID
 * @returns {Promise<Object>} Updated client
 */
export async function deactivateClient(companyId, clientId) {
  return api.patch(`/companies/${companyId}/clients/${clientId}/deactivate`);
}

/**
 * Deletes a client
 * @param {number} companyId - Company ID
 * @param {number} clientId - Client ID
 * @returns {Promise<void>}
 */
export async function deleteClient(companyId, clientId) {
  return api.delete(`/companies/${companyId}/clients/${clientId}`);
}

export default {
  getClients,
  getClientById,
  getActiveClients,
  searchClients,
  createClient,
  updateClient,
  activateClient,
  deactivateClient,
  deleteClient,
};
