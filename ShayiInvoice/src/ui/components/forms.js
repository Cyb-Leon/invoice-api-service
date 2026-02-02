/**
 * Forms Component
 * Form templates and validation utilities
 */

/**
 * South African provinces
 */
export const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape',
  'Western Cape',
];

/**
 * Payment methods
 */
export const PAYMENT_METHODS = [
  { value: 'EFT', label: 'EFT (Electronic Funds Transfer)' },
  { value: 'SnapScan', label: 'SnapScan' },
  { value: 'Zapper', label: 'Zapper' },
  { value: 'PayFast', label: 'PayFast' },
  { value: 'Credit/Debit Card', label: 'Credit/Debit Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
];

/**
 * Generates company form HTML
 * @param {Object} company - Existing company data (for editing)
 * @returns {string} Form HTML
 */
export function companyForm(company = {}) {
  return `
    <form id="company-form" class="modal-form">
      <div class="form-section">
        <h3>Business Information</h3>
        <div class="form-group">
          <label class="form-label" for="name">Company Name *</label>
          <input type="text" id="name" name="name" class="glass-input" required
            value="${company.name || ''}" placeholder="e.g., Acme Solutions (Pty) Ltd">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="tradingName">Trading Name</label>
            <input type="text" id="tradingName" name="tradingName" class="glass-input"
              value="${company.tradingName || ''}" placeholder="e.g., Acme Solutions">
          </div>
          <div class="form-group">
            <label class="form-label" for="registrationNumber">Registration Number</label>
            <input type="text" id="registrationNumber" name="registrationNumber" class="glass-input"
              value="${company.registrationNumber || ''}" placeholder="YYYY/NNNNNN/NN">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="vatNumber">VAT Number</label>
            <input type="text" id="vatNumber" name="vatNumber" class="glass-input"
              value="${company.vatNumber || ''}" placeholder="4xxxxxxxxx">
          </div>
          <div class="form-group">
            <label class="form-label" for="vatRegistered">VAT Registered</label>
            <select id="vatRegistered" name="vatRegistered" class="glass-select">
              <option value="false" ${!company.vatRegistered ? 'selected' : ''}>No</option>
              <option value="true" ${company.vatRegistered ? 'selected' : ''}>Yes</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Contact Information</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="email">Email *</label>
            <input type="email" id="email" name="email" class="glass-input" required
              value="${company.email || ''}" placeholder="info@company.co.za">
          </div>
          <div class="form-group">
            <label class="form-label" for="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" class="glass-input"
              value="${company.phoneNumber || ''}" placeholder="+27 or 0...">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="physicalAddress">Physical Address</label>
          <input type="text" id="physicalAddress" name="physicalAddress" class="glass-input"
            value="${company.physicalAddress || ''}" placeholder="Street address">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="city">City</label>
            <input type="text" id="city" name="city" class="glass-input"
              value="${company.city || ''}" placeholder="City">
          </div>
          <div class="form-group">
            <label class="form-label" for="province">Province</label>
            <select id="province" name="province" class="glass-select">
              <option value="">Select Province</option>
              ${SA_PROVINCES.map(p => `<option value="${p}" ${company.province === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="postalCode">Postal Code</label>
            <input type="text" id="postalCode" name="postalCode" class="glass-input"
              value="${company.postalCode || ''}" placeholder="0000">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Banking Details</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="bankName">Bank Name</label>
            <input type="text" id="bankName" name="bankName" class="glass-input"
              value="${company.bankName || ''}" placeholder="e.g., FNB, Standard Bank">
          </div>
          <div class="form-group">
            <label class="form-label" for="bankAccountType">Account Type</label>
            <select id="bankAccountType" name="bankAccountType" class="glass-select">
              <option value="">Select Type</option>
              <option value="Cheque" ${company.bankAccountType === 'Cheque' ? 'selected' : ''}>Cheque</option>
              <option value="Savings" ${company.bankAccountType === 'Savings' ? 'selected' : ''}>Savings</option>
              <option value="Transmission" ${company.bankAccountType === 'Transmission' ? 'selected' : ''}>Transmission</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="bankAccountNumber">Account Number</label>
            <input type="text" id="bankAccountNumber" name="bankAccountNumber" class="glass-input"
              value="${company.bankAccountNumber || ''}" placeholder="Account number">
          </div>
          <div class="form-group">
            <label class="form-label" for="bankBranchCode">Branch Code</label>
            <input type="text" id="bankBranchCode" name="bankBranchCode" class="glass-input"
              value="${company.bankBranchCode || ''}" placeholder="Branch code">
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="glass-btn" onclick="window.modal.close()">Cancel</button>
        <button type="submit" class="primary-btn glass-btn">${company.id ? 'Update' : 'Create'} Company</button>
      </div>
    </form>
  `;
}

/**
 * Generates client form HTML
 * @param {Object} client - Existing client data (for editing)
 * @returns {string} Form HTML
 */
export function clientForm(client = {}) {
  return `
    <form id="client-form" class="modal-form">
      <div class="form-section">
        <h3>Client Information</h3>
        <div class="form-group">
          <label class="form-label" for="name">Client/Company Name *</label>
          <input type="text" id="name" name="name" class="glass-input" required
            value="${client.name || ''}" placeholder="Client or company name">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="contactPerson">Contact Person</label>
            <input type="text" id="contactPerson" name="contactPerson" class="glass-input"
              value="${client.contactPerson || ''}" placeholder="Contact person name">
          </div>
          <div class="form-group">
            <label class="form-label" for="paymentTerms">Payment Terms (days)</label>
            <input type="number" id="paymentTerms" name="paymentTerms" class="glass-input"
              value="${client.paymentTerms || 30}" min="0" max="365">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Contact Details</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="email">Email *</label>
            <input type="email" id="email" name="email" class="glass-input" required
              value="${client.email || ''}" placeholder="email@example.co.za">
          </div>
          <div class="form-group">
            <label class="form-label" for="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" class="glass-input"
              value="${client.phoneNumber || ''}" placeholder="+27 or 0...">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Billing Address</h3>
        <div class="form-group">
          <label class="form-label" for="billingAddress">Street Address</label>
          <input type="text" id="billingAddress" name="billingAddress" class="glass-input"
            value="${client.billingAddress || ''}" placeholder="Street address">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="city">City</label>
            <input type="text" id="city" name="city" class="glass-input"
              value="${client.city || ''}" placeholder="City">
          </div>
          <div class="form-group">
            <label class="form-label" for="province">Province</label>
            <select id="province" name="province" class="glass-select">
              <option value="">Select Province</option>
              ${SA_PROVINCES.map(p => `<option value="${p}" ${client.province === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="postalCode">Postal Code</label>
            <input type="text" id="postalCode" name="postalCode" class="glass-input"
              value="${client.postalCode || ''}" placeholder="0000">
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="glass-btn" onclick="window.modal.close()">Cancel</button>
        <button type="submit" class="primary-btn glass-btn">${client.id ? 'Update' : 'Create'} Client</button>
      </div>
    </form>
  `;
}

/**
 * Generates invoice form HTML
 * @param {Array} clients - Available clients
 * @param {Object} invoice - Existing invoice data (for editing)
 * @returns {string} Form HTML
 */
export function invoiceForm(clients = [], invoice = {}) {
  const today = new Date().toISOString().split('T')[0];
  const dueDate = invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return `
    <form id="invoice-form" class="modal-form">
      <div class="form-section">
        <h3>Invoice Details</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="clientId">Client *</label>
            <select id="clientId" name="clientId" class="glass-select" required>
              <option value="">Select Client</option>
              ${clients.map(c => `<option value="${c.id}" ${invoice.clientId === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="issueDate">Issue Date *</label>
            <input type="date" id="issueDate" name="issueDate" class="glass-input" required
              value="${invoice.issueDate || today}">
          </div>
          <div class="form-group">
            <label class="form-label" for="dueDate">Due Date *</label>
            <input type="date" id="dueDate" name="dueDate" class="glass-input" required
              value="${dueDate}">
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Line Items</h3>
        <div id="line-items-container">
          ${(invoice.lineItems || [{ description: '', quantity: 1, unitOfMeasure: 'each', unitPrice: 0 }])
            .map((item, index) => lineItemRow(item, index)).join('')}
        </div>
        <button type="button" class="glass-btn mt-md" onclick="window.addLineItem()">
          + Add Line Item
        </button>
      </div>

      <div class="form-section">
        <h3>Notes & Terms</h3>
        <div class="form-group">
          <label class="form-label" for="notes">Notes</label>
          <textarea id="notes" name="notes" class="glass-input glass-textarea" rows="2"
            placeholder="Thank you for your business!">${invoice.notes || ''}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label" for="termsAndConditions">Terms & Conditions</label>
          <textarea id="termsAndConditions" name="termsAndConditions" class="glass-input glass-textarea" rows="2"
            placeholder="Payment due within 30 days">${invoice.termsAndConditions || ''}</textarea>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="glass-btn" onclick="window.modal.close()">Cancel</button>
        <button type="submit" class="primary-btn glass-btn">${invoice.id ? 'Update' : 'Create'} Invoice</button>
      </div>
    </form>
  `;
}

/**
 * Generates a single line item row
 * @param {Object} item - Line item data
 * @param {number} index - Item index
 * @returns {string} Line item HTML
 */
export function lineItemRow(item = {}, index = 0) {
  return `
    <div class="line-item-row" data-index="${index}">
      <div class="form-row">
        <div class="form-group" style="flex: 2;">
          <label class="form-label">Description *</label>
          <input type="text" name="lineItems[${index}].description" class="glass-input" required
            value="${item.description || ''}" placeholder="Service or product description">
        </div>
        <div class="form-group">
          <label class="form-label">Qty *</label>
          <input type="number" name="lineItems[${index}].quantity" class="glass-input" required
            value="${item.quantity || 1}" min="0.01" step="0.01">
        </div>
        <div class="form-group">
          <label class="form-label">Unit</label>
          <select name="lineItems[${index}].unitOfMeasure" class="glass-select">
            <option value="each" ${item.unitOfMeasure === 'each' ? 'selected' : ''}>Each</option>
            <option value="hours" ${item.unitOfMeasure === 'hours' ? 'selected' : ''}>Hours</option>
            <option value="days" ${item.unitOfMeasure === 'days' ? 'selected' : ''}>Days</option>
            <option value="units" ${item.unitOfMeasure === 'units' ? 'selected' : ''}>Units</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Unit Price (R) *</label>
          <input type="number" name="lineItems[${index}].unitPrice" class="glass-input" required
            value="${item.unitPrice || 0}" min="0" step="0.01">
        </div>
        <button type="button" class="icon-btn remove-line-item" onclick="window.removeLineItem(${index})" 
          ${index === 0 ? 'style="visibility: hidden;"' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

/**
 * Generates payment form HTML
 * @param {Object} payment - Existing payment data (for editing)
 * @returns {string} Form HTML
 */
export function paymentForm(payment = {}) {
  const today = new Date().toISOString().split('T')[0];
  
  return `
    <form id="payment-form" class="modal-form">
      <div class="form-section">
        <h3>Payment Details</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="amount">Amount (R) *</label>
            <input type="number" id="amount" name="amount" class="glass-input" required
              value="${payment.amount || ''}" min="0.01" step="0.01" placeholder="0.00">
          </div>
          <div class="form-group">
            <label class="form-label" for="paymentDate">Payment Date *</label>
            <input type="date" id="paymentDate" name="paymentDate" class="glass-input" required
              value="${payment.paymentDate || today}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="paymentMethod">Payment Method *</label>
            <select id="paymentMethod" name="paymentMethod" class="glass-select" required>
              <option value="">Select Method</option>
              ${PAYMENT_METHODS.map(m => `<option value="${m.value}" ${payment.paymentMethod === m.value ? 'selected' : ''}>${m.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="referenceNumber">Reference Number</label>
            <input type="text" id="referenceNumber" name="referenceNumber" class="glass-input"
              value="${payment.referenceNumber || ''}" placeholder="Transaction reference">
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="glass-btn" onclick="window.modal.close()">Cancel</button>
        <button type="submit" class="primary-btn glass-btn">${payment.id ? 'Update' : 'Record'} Payment</button>
      </div>
    </form>
  `;
}

export default {
  companyForm,
  clientForm,
  invoiceForm,
  lineItemRow,
  paymentForm,
  SA_PROVINCES,
  PAYMENT_METHODS,
};
