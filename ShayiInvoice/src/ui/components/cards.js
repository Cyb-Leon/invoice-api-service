/**
 * Cards Component
 * Card templates for displaying data
 */

/**
 * Status badge colors mapping
 */
const STATUS_BADGES = {
  DRAFT: 'badge-default',
  PENDING: 'badge-info',
  SENT: 'badge-info',
  PAID: 'badge-success',
  PARTIALLY_PAID: 'badge-warning',
  OVERDUE: 'badge-error',
  CANCELLED: 'badge-default',
  REFUNDED: 'badge-warning',
};

/**
 * Formats currency in ZAR
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

/**
 * Formats a date string
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generates a company card
 * @param {Object} company - Company data
 * @returns {string} Company card HTML
 */
export function companyCard(company) {
  return `
    <div class="card glass-panel" data-company-id="${company.id}">
      <div class="card-header">
        <div>
          <h3 class="card-title">${escapeHtml(company.name)}</h3>
          ${company.tradingName ? `<p class="card-subtitle">Trading as: ${escapeHtml(company.tradingName)}</p>` : ''}
        </div>
        ${company.vatRegistered ? '<span class="badge badge-success">VAT Registered</span>' : ''}
      </div>
      <div class="card-body">
        <p><strong>Email:</strong> ${escapeHtml(company.email)}</p>
        ${company.phoneNumber ? `<p><strong>Phone:</strong> ${escapeHtml(company.phoneNumber)}</p>` : ''}
        ${company.city ? `<p><strong>Location:</strong> ${escapeHtml(company.city)}, ${escapeHtml(company.province || '')}</p>` : ''}
        ${company.registrationNumber ? `<p><strong>Reg No:</strong> ${escapeHtml(company.registrationNumber)}</p>` : ''}
      </div>
      <div class="card-footer">
        <button class="glass-btn" onclick="window.app.editCompany(${company.id})">Edit</button>
        <button class="glass-btn" onclick="window.app.selectCompany(${company.id})">Select</button>
      </div>
    </div>
  `;
}

/**
 * Generates a client card
 * @param {Object} client - Client data
 * @returns {string} Client card HTML
 */
export function clientCard(client) {
  return `
    <div class="card glass-panel" data-client-id="${client.id}">
      <div class="card-header">
        <div>
          <h3 class="card-title">${escapeHtml(client.name)}</h3>
          ${client.contactPerson ? `<p class="card-subtitle">${escapeHtml(client.contactPerson)}</p>` : ''}
        </div>
        <span class="badge ${client.active ? 'badge-success' : 'badge-default'}">${client.active ? 'Active' : 'Inactive'}</span>
      </div>
      <div class="card-body">
        <p><strong>Email:</strong> ${escapeHtml(client.email)}</p>
        ${client.phoneNumber ? `<p><strong>Phone:</strong> ${escapeHtml(client.phoneNumber)}</p>` : ''}
        ${client.city ? `<p><strong>Location:</strong> ${escapeHtml(client.city)}</p>` : ''}
        <p><strong>Payment Terms:</strong> ${client.paymentTerms || 30} days</p>
      </div>
      <div class="card-footer">
        <button class="glass-btn" onclick="window.app.editClient(${client.id})">Edit</button>
        <button class="glass-btn" onclick="window.app.viewClientInvoices(${client.id})">Invoices</button>
      </div>
    </div>
  `;
}

/**
 * Generates an invoice row for table
 * @param {Object} invoice - Invoice data
 * @returns {string} Invoice table row HTML
 */
export function invoiceRow(invoice) {
  const statusClass = STATUS_BADGES[invoice.status] || 'badge-default';
  
  return `
    <tr class="invoice-row" data-invoice-id="${invoice.id}">
      <td><strong>${escapeHtml(invoice.invoiceNumber || '-')}</strong></td>
      <td>${escapeHtml(invoice.clientName || '-')}</td>
      <td>${formatDate(invoice.issueDate)}</td>
      <td>${formatDate(invoice.dueDate)}</td>
      <td class="amount">${formatCurrency(invoice.totalAmount)}</td>
      <td><span class="badge ${statusClass}">${invoice.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="icon-btn" onclick="window.app.viewInvoice(${invoice.id})" title="View">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          ${invoice.status === 'DRAFT' ? `
            <button class="icon-btn" onclick="window.app.editInvoice(${invoice.id})" title="Edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          ` : ''}
          ${['SENT', 'PARTIALLY_PAID'].includes(invoice.status) ? `
            <button class="icon-btn" onclick="window.app.recordPayment(${invoice.id})" title="Record Payment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </button>
          ` : ''}
        </div>
      </td>
    </tr>
  `;
}

/**
 * Generates invoice list item for dashboard
 * @param {Object} invoice - Invoice data
 * @returns {string} Invoice list item HTML
 */
export function invoiceListItem(invoice) {
  const statusClass = STATUS_BADGES[invoice.status] || 'badge-default';
  
  return `
    <div class="invoice-list-item" onclick="window.app.viewInvoice(${invoice.id})">
      <div class="invoice-info">
        <span class="invoice-number">${escapeHtml(invoice.invoiceNumber || '-')}</span>
        <span class="invoice-client">${escapeHtml(invoice.clientName || '-')}</span>
      </div>
      <div class="invoice-meta">
        <span class="invoice-amount">${formatCurrency(invoice.totalAmount)}</span>
        <span class="badge ${statusClass}">${invoice.status}</span>
      </div>
    </div>
  `;
}

/**
 * Generates a payment card
 * @param {Object} payment - Payment data
 * @returns {string} Payment card HTML
 */
export function paymentCard(payment) {
  return `
    <div class="card glass-panel" data-payment-id="${payment.id}">
      <div class="card-header">
        <div>
          <h3 class="card-title">${formatCurrency(payment.amount)}</h3>
          <p class="card-subtitle">${formatDate(payment.paymentDate)}</p>
        </div>
        <span class="badge ${payment.reconciled ? 'badge-success' : 'badge-warning'}">
          ${payment.reconciled ? 'Reconciled' : 'Unreconciled'}
        </span>
      </div>
      <div class="card-body">
        <p><strong>Method:</strong> ${escapeHtml(payment.paymentMethod)}</p>
        ${payment.referenceNumber ? `<p><strong>Reference:</strong> ${escapeHtml(payment.referenceNumber)}</p>` : ''}
        ${payment.invoiceNumber ? `<p><strong>Invoice:</strong> ${escapeHtml(payment.invoiceNumber)}</p>` : ''}
      </div>
      <div class="card-footer">
        ${!payment.reconciled ? `
          <button class="glass-btn" onclick="window.app.reconcilePayment(${payment.id})">Reconcile</button>
        ` : ''}
        <button class="glass-btn" onclick="window.app.editPayment(${payment.id})">Edit</button>
      </div>
    </div>
  `;
}

/**
 * Escapes HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export default {
  companyCard,
  clientCard,
  invoiceRow,
  invoiceListItem,
  paymentCard,
  formatCurrency,
  formatDate,
};
