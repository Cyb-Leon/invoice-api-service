package com.example.demo.model;

/**
 * Enum representing payment methods commonly used in South Africa.
 */
public enum PaymentMethod {
    EFT,           // Electronic Funds Transfer (most common in SA)
    CASH,
    CREDIT_CARD,
    DEBIT_CARD,
    CHEQUE,
    SNAPSCAN,      // South African mobile payment
    ZAPPER,        // South African mobile payment
    PAYFAST,       // South African payment gateway
    OTHER
}
