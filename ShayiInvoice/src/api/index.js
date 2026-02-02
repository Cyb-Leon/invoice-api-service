/**
 * API Module Index
 * Central export for all API modules
 */
import api, { ApiError } from './client.js';
import companiesApi from './companies.js';
import clientsApi from './clients.js';
import invoicesApi from './invoices.js';
import paymentsApi, { PaymentMethods } from './payments.js';

export {
  // Base client
  api,
  ApiError,
  
  // Companies
  companiesApi,
  
  // Clients
  clientsApi,
  
  // Invoices
  invoicesApi,
  
  // Payments
  paymentsApi,
  PaymentMethods,
};

export default {
  api,
  ApiError,
  companies: companiesApi,
  clients: clientsApi,
  invoices: invoicesApi,
  payments: paymentsApi,
  PaymentMethods,
};
