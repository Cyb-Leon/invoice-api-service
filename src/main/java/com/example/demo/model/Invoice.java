package com.example.demo.model;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing an invoice.
 * Supports South African VAT calculations and ZAR currency.
 */
@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @NotNull(message = "Issue date is required")
    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @NotNull(message = "Due date is required")
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    /**
     * Subtotal before VAT (in ZAR)
     */
    @Column(name = "subtotal", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    /**
     * VAT rate (default 15% for South Africa)
     */
    @Column(name = "vat_rate", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal vatRate = new BigDecimal("15.00");

    /**
     * VAT amount (in ZAR)
     */
    @Column(name = "vat_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal vatAmount = BigDecimal.ZERO;

    /**
     * Discount percentage
     */
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    /**
     * Discount amount (in ZAR)
     */
    @Column(name = "discount_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    /**
     * Total amount including VAT (in ZAR)
     */
    @Column(name = "total_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    /**
     * Amount already paid (in ZAR)
     */
    @Column(name = "amount_paid", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal amountPaid = BigDecimal.ZERO;

    /**
     * Outstanding balance (in ZAR)
     */
    @Column(name = "balance_due", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal balanceDue = BigDecimal.ZERO;

    @Column(name = "currency")
    @Builder.Default
    private String currency = "ZAR";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    @Column(name = "reference_number")
    private String referenceNumber;

    @Column(name = "purchase_order_number")
    private String purchaseOrderNumber;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LineItem> lineItems = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Payment> payments = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Add a line item to this invoice.
     */
    public void addLineItem(LineItem lineItem) {
        lineItems.add(lineItem);
        lineItem.setInvoice(this);
        recalculateTotals();
    }

    /**
     * Remove a line item from this invoice.
     */
    public void removeLineItem(LineItem lineItem) {
        lineItems.remove(lineItem);
        lineItem.setInvoice(null);
        recalculateTotals();
    }

    /**
     * Add a payment to this invoice.
     */
    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.setInvoice(this);
        recalculatePayments();
    }

    /**
     * Recalculate all totals based on line items.
     */
    public void recalculateTotals() {
        // Calculate subtotal from line items
        this.subtotal = lineItems.stream()
                .map(LineItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate discount
        if (discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
            this.discountAmount = subtotal.multiply(discountPercentage)
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        }

        // Calculate subtotal after discount
        BigDecimal subtotalAfterDiscount = subtotal.subtract(discountAmount);

        // Calculate VAT (15% for South Africa)
        if (vatRate != null && vatRate.compareTo(BigDecimal.ZERO) > 0) {
            this.vatAmount = subtotalAfterDiscount.multiply(vatRate)
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        } else {
            this.vatAmount = BigDecimal.ZERO;
        }

        // Calculate total
        this.totalAmount = subtotalAfterDiscount.add(vatAmount);

        // Recalculate balance due
        recalculatePayments();
    }

    /**
     * Recalculate payment totals and balance.
     */
    public void recalculatePayments() {
        this.amountPaid = payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.balanceDue = totalAmount.subtract(amountPaid);

        // Update status based on payments
        if (balanceDue.compareTo(BigDecimal.ZERO) <= 0) {
            this.status = InvoiceStatus.PAID;
            this.paidAt = LocalDateTime.now();
        } else if (amountPaid.compareTo(BigDecimal.ZERO) > 0) {
            this.status = InvoiceStatus.PARTIALLY_PAID;
        }
    }

    /**
     * Check if the invoice is overdue.
     */
    public boolean isOverdue() {
        return dueDate.isBefore(LocalDate.now()) &&
               status != InvoiceStatus.PAID &&
               status != InvoiceStatus.CANCELLED;
    }

    /**
     * Mark invoice as sent.
     */
    public void markAsSent() {
        this.status = InvoiceStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }
}
