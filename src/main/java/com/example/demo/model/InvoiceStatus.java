package com.example.demo.model;

/**
 * Enum representing the possible statuses of an invoice.
 */
public enum InvoiceStatus {
    DRAFT,
    PENDING,
    SENT,
    PAID,
    PARTIALLY_PAID,
    OVERDUE,
    CANCELLED,
    REFUNDED
}
