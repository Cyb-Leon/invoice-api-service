/**
 * ShayiInvoice - Main Entry Point
 * A stunning Three.js frontend for the South African Invoice API
 */
import { gsap } from 'gsap';

// Three.js modules
import { initThreeJS, updateTheme as updateThreeTheme } from './three/index.js';

// API modules
import { companiesApi, clientsApi, invoicesApi, paymentsApi, ApiError } from './api/index.js';

// UI modules
import { 
  toast, 
  modal, 
  initModal, 
  openModal, 
  closeModal,
  companyForm,
  clientForm,
  invoiceForm,
  paymentForm,
  lineItemRow,
  companyCard,
  clientCard,
  invoiceRow,
  invoiceListItem,
  paymentCard,
  formatCurrency,
} from './ui/index.js';

// Utilities
import { 
  getTheme, 
  setTheme, 
  toggleTheme, 
  getStorageItem, 
  setStorageItem,
  debounce,
} from './utils/helpers.js';

/**
 * Application State
 */
const state = {
  companies: [],
  selectedCompanyId: null,
  clients: [],
  invoices: [],
  payments: [],
  currentView: 'dashboard',
  isLoading: true,
  dashboardStats: null,
};

/**
 * DOM Elements
 */
const elements = {
  loadingScreen: null,
  mainNav: null,
  mainContent: null,
  canvasContainer: null,
};

/**
 * Initialize the application
 */
async function init() {
  console.log('🚀 Initializing ShayiInvoice...');
  
  // Cache DOM elements
  cacheElements();
  
  // Initialize theme
  initTheme();
  
  // Initialize Three.js background
  initThreeJS(elements.canvasContainer);
  
  // Initialize UI components
  initModal();
  
  // Set up event listeners
  setupEventListeners();
  
  // Expose global functions
  exposeGlobalFunctions();
  
  // Load initial data
  await loadInitialData();
  
  // Hide loading screen
  hideLoadingScreen();
  
  console.log('✅ ShayiInvoice initialized successfully');
}

/**
 * Cache DOM element references
 */
function cacheElements() {
  elements.loadingScreen = document.getElementById('loading-screen');
  elements.mainNav = document.getElementById('main-nav');
  elements.mainContent = document.getElementById('main-content');
  elements.canvasContainer = document.getElementById('canvas-container');
}

/**
 * Initialize theme
 */
function initTheme() {
  const theme = getTheme();
  setTheme(theme);
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = e.target.dataset.view;
      if (view) navigateTo(view);
    });
  });
  
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', handleThemeToggle);
  }
  
  // Company selector
  const companyBtn = document.querySelector('.company-btn');
  if (companyBtn) {
    companyBtn.addEventListener('click', toggleCompanyDropdown);
  }
  
  // Add company button
  const addCompanyBtn = document.getElementById('btn-add-company');
  if (addCompanyBtn) {
    addCompanyBtn.addEventListener('click', () => showCompanyForm());
  }
  
  // Add client button
  const addClientBtn = document.getElementById('btn-add-client');
  if (addClientBtn) {
    addClientBtn.addEventListener('click', () => showClientForm());
  }
  
  // Add invoice button
  const addInvoiceBtn = document.getElementById('btn-add-invoice');
  if (addInvoiceBtn) {
    addInvoiceBtn.addEventListener('click', () => showInvoiceForm());
  }
  
  // Invoice search
  const invoiceSearch = document.getElementById('invoice-search');
  if (invoiceSearch) {
    invoiceSearch.addEventListener('input', debounce(handleInvoiceSearch, 300));
  }
  
  // Invoice status filter
  const statusFilter = document.getElementById('invoice-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', handleStatusFilter);
  }
  
  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const selector = document.getElementById('company-selector');
    if (selector && !selector.contains(e.target)) {
      selector.classList.remove('open');
    }
  });
}

/**
 * Expose functions to global scope for onclick handlers
 */
function exposeGlobalFunctions() {
  window.app = {
    selectCompany,
    editCompany,
    editClient,
    viewClientInvoices,
    viewInvoice,
    editInvoice,
    recordPayment,
    reconcilePayment,
    editPayment,
  };
  
  window.modal = { close: closeModal };
  window.addLineItem = addLineItem;
  window.removeLineItem = removeLineItem;
}

/**
 * Load initial data
 */
async function loadInitialData() {
  try {
    // Load companies
    state.companies = await companiesApi.getAllCompanies();
    
    // Check for stored company selection
    const storedCompanyId = getStorageItem('selectedCompanyId');
    if (storedCompanyId && state.companies.find(c => c.id === storedCompanyId)) {
      await selectCompany(storedCompanyId, false);
    }
    
    // Update company dropdown
    updateCompanyDropdown();
    
  } catch (error) {
    console.error('Failed to load initial data:', error);
    if (error instanceof ApiError && error.status === 0) {
      toast.error('Cannot connect to API server. Make sure it\'s running on port 8080.');
    } else {
      toast.error('Failed to load data. Please refresh the page.');
    }
  }
}

/**
 * Hide loading screen with animation
 */
function hideLoadingScreen() {
  state.isLoading = false;
  
  gsap.to(elements.loadingScreen, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      elements.loadingScreen.classList.add('hidden');
    }
  });
  
  // Show navigation and content
  elements.mainNav.classList.remove('hidden');
  elements.mainContent.classList.remove('hidden');
  
  gsap.from(elements.mainNav, {
    y: -30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  });
  
  gsap.from(elements.mainContent, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power3.out',
  });
}

/**
 * Navigate to a view
 * @param {string} view - View name
 */
function navigateTo(view) {
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === view);
  });
  
  // Hide all views, show target
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
  });
  
  const targetView = document.getElementById(`view-${view}`);
  if (targetView) {
    targetView.classList.add('active');
  }
  
  state.currentView = view;
  
  // Load view-specific data
  loadViewData(view);
}

/**
 * Load data for a specific view
 * @param {string} view - View name
 */
async function loadViewData(view) {
  if (!state.selectedCompanyId && view !== 'companies') {
    return;
  }
  
  try {
    switch (view) {
      case 'dashboard':
        await loadDashboard();
        break;
      case 'companies':
        renderCompanies();
        break;
      case 'clients':
        await loadClients();
        break;
      case 'invoices':
        await loadInvoices();
        break;
      case 'payments':
        await loadPayments();
        break;
    }
  } catch (error) {
    console.error(`Failed to load ${view} data:`, error);
    toast.error(`Failed to load ${view} data`);
  }
}

/**
 * Load dashboard data
 */
async function loadDashboard() {
  if (!state.selectedCompanyId) return;
  
  try {
    const stats = await companiesApi.getDashboardStats(state.selectedCompanyId);
    state.dashboardStats = stats;
    renderDashboard(stats);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

/**
 * Render dashboard
 * @param {Object} stats - Dashboard statistics
 */
function renderDashboard(stats) {
  // Update stat cards
  document.getElementById('stat-revenue').textContent = formatCurrency(stats?.totalRevenue || 0);
  document.getElementById('stat-outstanding').textContent = formatCurrency(stats?.totalOutstanding || 0);
  document.getElementById('stat-invoices').textContent = stats?.totalInvoices || 0;
  document.getElementById('stat-clients').textContent = stats?.activeClients || 0;
  
  // Animate stat cards
  gsap.from('.stat-card', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power2.out',
  });
  
  // Render recent invoices
  const recentList = document.getElementById('recent-invoices-list');
  if (stats?.recentInvoices?.length) {
    recentList.innerHTML = stats.recentInvoices.map(invoiceListItem).join('');
  } else {
    recentList.innerHTML = '<p class="empty-state">No recent invoices</p>';
  }
  
  // Render overdue invoices
  const overdueList = document.getElementById('overdue-invoices-list');
  if (stats?.overdueInvoices?.length) {
    overdueList.innerHTML = stats.overdueInvoices.map(invoiceListItem).join('');
  } else {
    overdueList.innerHTML = '<p class="empty-state">No overdue invoices</p>';
  }
}

/**
 * Render companies list
 */
function renderCompanies() {
  const container = document.getElementById('companies-list');
  
  if (state.companies.length === 0) {
    container.innerHTML = '<p class="empty-state">No companies found. Create your first company to get started.</p>';
    return;
  }
  
  container.innerHTML = state.companies.map(companyCard).join('');
  
  // Animate cards
  gsap.from('.card', {
    y: 30,
    opacity: 0,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power2.out',
  });
}

/**
 * Load clients
 */
async function loadClients() {
  if (!state.selectedCompanyId) {
    document.getElementById('clients-list').innerHTML = 
      '<p class="empty-state">Select a company to view clients</p>';
    return;
  }
  
  try {
    state.clients = await clientsApi.getClients(state.selectedCompanyId);
    renderClients();
  } catch (error) {
    console.error('Failed to load clients:', error);
    toast.error('Failed to load clients');
  }
}

/**
 * Render clients list
 */
function renderClients() {
  const container = document.getElementById('clients-list');
  
  if (state.clients.length === 0) {
    container.innerHTML = '<p class="empty-state">No clients found. Add your first client.</p>';
    return;
  }
  
  container.innerHTML = state.clients.map(clientCard).join('');
  
  gsap.from('.card', {
    y: 30,
    opacity: 0,
    duration: 0.4,
    stagger: 0.08,
    ease: 'power2.out',
  });
}

/**
 * Load invoices
 */
async function loadInvoices() {
  if (!state.selectedCompanyId) {
    document.getElementById('invoices-list').innerHTML = 
      '<p class="empty-state">Select a company to view invoices</p>';
    return;
  }
  
  try {
    state.invoices = await invoicesApi.getInvoices(state.selectedCompanyId);
    renderInvoices();
  } catch (error) {
    console.error('Failed to load invoices:', error);
    toast.error('Failed to load invoices');
  }
}

/**
 * Render invoices table
 */
function renderInvoices(invoices = state.invoices) {
  const container = document.getElementById('invoices-list');
  
  if (invoices.length === 0) {
    container.innerHTML = '<p class="empty-state">No invoices found. Create your first invoice.</p>';
    return;
  }
  
  container.innerHTML = `
    <table class="invoice-table glass-panel">
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Client</th>
          <th>Issue Date</th>
          <th>Due Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${invoices.map(invoiceRow).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Load payments
 */
async function loadPayments() {
  if (!state.selectedCompanyId) {
    document.getElementById('payments-list').innerHTML = 
      '<p class="empty-state">Select a company to view payments</p>';
    return;
  }
  
  try {
    state.payments = await paymentsApi.getCompanyPayments(state.selectedCompanyId);
    renderPayments();
  } catch (error) {
    console.error('Failed to load payments:', error);
    toast.error('Failed to load payments');
  }
}

/**
 * Render payments list
 */
function renderPayments() {
  const container = document.getElementById('payments-list');
  
  if (state.payments.length === 0) {
    container.innerHTML = '<p class="empty-state">No payments recorded yet.</p>';
    return;
  }
  
  container.innerHTML = state.payments.map(paymentCard).join('');
  
  gsap.from('.card', {
    y: 30,
    opacity: 0,
    duration: 0.4,
    stagger: 0.08,
    ease: 'power2.out',
  });
}

/**
 * Handle theme toggle
 */
function handleThemeToggle() {
  const newTheme = toggleTheme();
  updateThreeTheme(newTheme);
  toast.info(`Switched to ${newTheme} mode`);
}

/**
 * Toggle company dropdown
 */
function toggleCompanyDropdown() {
  const selector = document.getElementById('company-selector');
  selector.classList.toggle('open');
}

/**
 * Update company dropdown options
 */
function updateCompanyDropdown() {
  const dropdown = document.querySelector('.company-dropdown');
  const btn = document.querySelector('.company-btn span');
  
  if (state.companies.length === 0) {
    dropdown.innerHTML = '<p class="empty-state">No companies</p>';
    return;
  }
  
  dropdown.innerHTML = state.companies.map(company => `
    <button class="company-option ${company.id === state.selectedCompanyId ? 'selected' : ''}"
      onclick="window.app.selectCompany(${company.id})">
      ${company.name}
    </button>
  `).join('');
  
  // Update button text
  const selected = state.companies.find(c => c.id === state.selectedCompanyId);
  btn.textContent = selected ? selected.name : 'Select Company';
}

/**
 * Select a company
 * @param {number} companyId - Company ID
 * @param {boolean} showToast - Whether to show toast notification
 */
async function selectCompany(companyId, showToast = true) {
  state.selectedCompanyId = companyId;
  setStorageItem('selectedCompanyId', companyId);
  
  // Close dropdown
  document.getElementById('company-selector')?.classList.remove('open');
  
  // Update dropdown
  updateCompanyDropdown();
  
  // Load data for current view
  await loadViewData(state.currentView);
  
  if (showToast) {
    const company = state.companies.find(c => c.id === companyId);
    toast.success(`Selected: ${company?.name}`);
  }
}

/**
 * Show company form
 * @param {Object} company - Existing company data (for editing)
 */
function showCompanyForm(company = null) {
  openModal({
    title: company ? 'Edit Company' : 'Create Company',
    content: companyForm(company || {}),
    onSubmit: async (data) => {
      try {
        // Convert vatRegistered to boolean
        data.vatRegistered = data.vatRegistered === 'true';
        
        if (company?.id) {
          await companiesApi.updateCompany(company.id, data);
          toast.success('Company updated successfully');
        } else {
          const newCompany = await companiesApi.createCompany(data);
          state.companies.push(newCompany);
          toast.success('Company created successfully');
        }
        
        closeModal();
        state.companies = await companiesApi.getAllCompanies();
        updateCompanyDropdown();
        if (state.currentView === 'companies') renderCompanies();
        
      } catch (error) {
        toast.error(error.message || 'Failed to save company');
      }
    },
  });
}

/**
 * Edit company
 * @param {number} companyId - Company ID
 */
async function editCompany(companyId) {
  try {
    const company = await companiesApi.getCompanyById(companyId);
    showCompanyForm(company);
  } catch (error) {
    toast.error('Failed to load company details');
  }
}

/**
 * Show client form
 * @param {Object} client - Existing client data (for editing)
 */
function showClientForm(client = null) {
  if (!state.selectedCompanyId) {
    toast.warning('Please select a company first');
    return;
  }
  
  openModal({
    title: client ? 'Edit Client' : 'Add Client',
    content: clientForm(client || {}),
    onSubmit: async (data) => {
      try {
        // Convert paymentTerms to number
        data.paymentTerms = parseInt(data.paymentTerms) || 30;
        
        if (client?.id) {
          await clientsApi.updateClient(state.selectedCompanyId, client.id, data);
          toast.success('Client updated successfully');
        } else {
          await clientsApi.createClient(state.selectedCompanyId, data);
          toast.success('Client created successfully');
        }
        
        closeModal();
        await loadClients();
        
      } catch (error) {
        toast.error(error.message || 'Failed to save client');
      }
    },
  });
}

/**
 * Edit client
 * @param {number} clientId - Client ID
 */
async function editClient(clientId) {
  try {
    const client = await clientsApi.getClientById(state.selectedCompanyId, clientId);
    showClientForm(client);
  } catch (error) {
    toast.error('Failed to load client details');
  }
}

/**
 * View client invoices
 * @param {number} clientId - Client ID
 */
async function viewClientInvoices(clientId) {
  navigateTo('invoices');
  
  try {
    const invoices = await invoicesApi.getClientInvoices(state.selectedCompanyId, clientId);
    renderInvoices(invoices);
  } catch (error) {
    toast.error('Failed to load client invoices');
  }
}

/**
 * Show invoice form
 * @param {Object} invoice - Existing invoice data (for editing)
 */
async function showInvoiceForm(invoice = null) {
  if (!state.selectedCompanyId) {
    toast.warning('Please select a company first');
    return;
  }
  
  // Load clients for dropdown
  if (state.clients.length === 0) {
    try {
      state.clients = await clientsApi.getClients(state.selectedCompanyId);
    } catch (error) {
      toast.error('Failed to load clients');
      return;
    }
  }
  
  if (state.clients.length === 0) {
    toast.warning('Please add a client first');
    return;
  }
  
  openModal({
    title: invoice ? 'Edit Invoice' : 'Create Invoice',
    content: invoiceForm(state.clients, invoice || {}),
    onSubmit: async (data) => {
      try {
        // Process line items
        const lineItems = [];
        const formData = new FormData(document.getElementById('invoice-form'));
        
        let i = 0;
        while (formData.get(`lineItems[${i}].description`) !== null) {
          lineItems.push({
            description: formData.get(`lineItems[${i}].description`),
            quantity: parseFloat(formData.get(`lineItems[${i}].quantity`)),
            unitOfMeasure: formData.get(`lineItems[${i}].unitOfMeasure`),
            unitPrice: parseFloat(formData.get(`lineItems[${i}].unitPrice`)),
          });
          i++;
        }
        
        const invoiceData = {
          clientId: parseInt(data.clientId),
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          notes: data.notes,
          termsAndConditions: data.termsAndConditions,
          lineItems,
        };
        
        if (invoice?.id) {
          await invoicesApi.updateInvoice(state.selectedCompanyId, invoice.id, invoiceData);
          toast.success('Invoice updated successfully');
        } else {
          await invoicesApi.createInvoice(state.selectedCompanyId, invoiceData);
          toast.success('Invoice created successfully');
        }
        
        closeModal();
        await loadInvoices();
        
      } catch (error) {
        toast.error(error.message || 'Failed to save invoice');
      }
    },
  });
}

/**
 * Add line item to invoice form
 */
function addLineItem() {
  const container = document.getElementById('line-items-container');
  const index = container.querySelectorAll('.line-item-row').length;
  container.insertAdjacentHTML('beforeend', lineItemRow({}, index));
}

/**
 * Remove line item from invoice form
 * @param {number} index - Line item index
 */
function removeLineItem(index) {
  const row = document.querySelector(`.line-item-row[data-index="${index}"]`);
  if (row) {
    gsap.to(row, {
      height: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => row.remove(),
    });
  }
}

/**
 * View invoice details
 * @param {number} invoiceId - Invoice ID
 */
async function viewInvoice(invoiceId) {
  try {
    const invoice = await invoicesApi.getInvoiceById(state.selectedCompanyId, invoiceId);
    
    openModal({
      title: `Invoice ${invoice.invoiceNumber}`,
      content: `
        <div class="invoice-details">
          <div class="detail-row">
            <span class="label">Client:</span>
            <span class="value">${invoice.clientName || '-'}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="badge badge-info">${invoice.status}</span>
          </div>
          <div class="detail-row">
            <span class="label">Issue Date:</span>
            <span class="value">${invoice.issueDate}</span>
          </div>
          <div class="detail-row">
            <span class="label">Due Date:</span>
            <span class="value">${invoice.dueDate}</span>
          </div>
          <hr>
          <h4>Line Items</h4>
          ${invoice.lineItems?.map(item => `
            <div class="line-item-detail">
              <span>${item.description}</span>
              <span>${item.quantity} x ${formatCurrency(item.unitPrice)} = ${formatCurrency(item.lineTotal)}</span>
            </div>
          `).join('') || '<p>No line items</p>'}
          <hr>
          <div class="detail-row">
            <span class="label">Subtotal:</span>
            <span class="value">${formatCurrency(invoice.subtotal)}</span>
          </div>
          <div class="detail-row">
            <span class="label">VAT (15%):</span>
            <span class="value">${formatCurrency(invoice.vatAmount)}</span>
          </div>
          <div class="detail-row total">
            <span class="label">Total:</span>
            <span class="value">${formatCurrency(invoice.totalAmount)}</span>
          </div>
          ${invoice.notes ? `<p class="notes"><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        </div>
      `,
    });
  } catch (error) {
    toast.error('Failed to load invoice details');
  }
}

/**
 * Edit invoice
 * @param {number} invoiceId - Invoice ID
 */
async function editInvoice(invoiceId) {
  try {
    const invoice = await invoicesApi.getInvoiceById(state.selectedCompanyId, invoiceId);
    showInvoiceForm(invoice);
  } catch (error) {
    toast.error('Failed to load invoice details');
  }
}

/**
 * Record payment for invoice
 * @param {number} invoiceId - Invoice ID
 */
function recordPayment(invoiceId) {
  openModal({
    title: 'Record Payment',
    content: paymentForm({}),
    onSubmit: async (data) => {
      try {
        data.amount = parseFloat(data.amount);
        
        await paymentsApi.recordPayment(invoiceId, data);
        toast.success('Payment recorded successfully');
        
        closeModal();
        await loadInvoices();
        
      } catch (error) {
        toast.error(error.message || 'Failed to record payment');
      }
    },
  });
}

/**
 * Reconcile a payment
 * @param {number} paymentId - Payment ID
 */
async function reconcilePayment(paymentId) {
  try {
    await paymentsApi.reconcilePayment(paymentId);
    toast.success('Payment reconciled');
    await loadPayments();
  } catch (error) {
    toast.error('Failed to reconcile payment');
  }
}

/**
 * Edit payment
 * @param {number} paymentId - Payment ID
 */
async function editPayment(paymentId) {
  try {
    const payment = await paymentsApi.getPaymentById(paymentId);
    
    openModal({
      title: 'Edit Payment',
      content: paymentForm(payment),
      onSubmit: async (data) => {
        try {
          data.amount = parseFloat(data.amount);
          
          await paymentsApi.updatePayment(paymentId, data);
          toast.success('Payment updated successfully');
          
          closeModal();
          await loadPayments();
          
        } catch (error) {
          toast.error(error.message || 'Failed to update payment');
        }
      },
    });
  } catch (error) {
    toast.error('Failed to load payment details');
  }
}

/**
 * Handle invoice search
 * @param {Event} e - Input event
 */
async function handleInvoiceSearch(e) {
  const query = e.target.value.trim();
  
  if (!query) {
    renderInvoices();
    return;
  }
  
  try {
    const results = await invoicesApi.searchInvoices(state.selectedCompanyId, query);
    renderInvoices(results);
  } catch (error) {
    console.error('Search failed:', error);
  }
}

/**
 * Handle status filter
 * @param {Event} e - Change event
 */
async function handleStatusFilter(e) {
  const status = e.target.value;
  
  if (!status) {
    renderInvoices();
    return;
  }
  
  try {
    const results = await invoicesApi.getInvoicesByStatus(state.selectedCompanyId, status);
    renderInvoices(results);
  } catch (error) {
    console.error('Filter failed:', error);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

export default { state };
