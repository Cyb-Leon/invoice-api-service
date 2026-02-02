/**
 * Companies API Module
 * Handles all company-related API calls
 */
import api from './client.js';

const COMPANIES_ENDPOINT = '/companies';

/**
 * Gets all companies
 * @returns {Promise<Array>} List of companies
 */
export async function getAllCompanies() {
  return api.get(COMPANIES_ENDPOINT);
}

/**
 * Gets a company by ID
 * @param {number} id - Company ID
 * @returns {Promise<Object>} Company data
 */
export async function getCompanyById(id) {
  return api.get(`${COMPANIES_ENDPOINT}/${id}`);
}

/**
 * Creates a new company
 * @param {Object} companyData - Company data
 * @param {string} companyData.name - Company name
 * @param {string} companyData.tradingName - Trading name
 * @param {string} companyData.registrationNumber - SA registration number
 * @param {string} companyData.vatNumber - VAT number
 * @param {boolean} companyData.vatRegistered - VAT registration status
 * @param {string} companyData.email - Email address
 * @param {string} companyData.phoneNumber - Phone number
 * @param {string} companyData.physicalAddress - Physical address
 * @param {string} companyData.city - City
 * @param {string} companyData.province - Province
 * @param {string} companyData.postalCode - Postal code
 * @param {string} companyData.bankName - Bank name
 * @param {string} companyData.bankAccountNumber - Bank account number
 * @param {string} companyData.bankBranchCode - Branch code
 * @param {string} companyData.bankAccountType - Account type
 * @returns {Promise<Object>} Created company
 */
export async function createCompany(companyData) {
  return api.post(COMPANIES_ENDPOINT, companyData);
}

/**
 * Updates a company
 * @param {number} id - Company ID
 * @param {Object} companyData - Updated company data
 * @returns {Promise<Object>} Updated company
 */
export async function updateCompany(id, companyData) {
  return api.put(`${COMPANIES_ENDPOINT}/${id}`, companyData);
}

/**
 * Deletes a company
 * @param {number} id - Company ID
 * @returns {Promise<void>}
 */
export async function deleteCompany(id) {
  return api.delete(`${COMPANIES_ENDPOINT}/${id}`);
}

/**
 * Gets dashboard statistics for a company
 * @param {number} companyId - Company ID
 * @returns {Promise<Object>} Dashboard statistics
 */
export async function getDashboardStats(companyId) {
  return api.get(`${COMPANIES_ENDPOINT}/${companyId}/dashboard`);
}

export default {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getDashboardStats,
};
