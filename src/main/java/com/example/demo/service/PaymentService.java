package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Invoice;
import com.example.demo.model.InvoiceStatus;
import com.example.demo.model.Payment;
import com.example.demo.model.PaymentMethod;
import com.example.demo.repository.PaymentRepository;

/**
 * Service for Payment business logic.
 */
@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceService invoiceService;

    public PaymentService(PaymentRepository paymentRepository, InvoiceService invoiceService) {
        this.paymentRepository = paymentRepository;
        this.invoiceService = invoiceService;
    }

    /**
     * Record a payment for an invoice.
     */
    public PaymentDTO recordPayment(PaymentDTO paymentDTO) {
        Invoice invoice = invoiceService.getInvoiceEntityById(paymentDTO.getInvoiceId());

        // Validate invoice can receive payments
        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BadRequestException("Invoice is already fully paid");
        }
        if (invoice.getStatus() == InvoiceStatus.CANCELLED) {
            throw new BadRequestException("Cannot record payment for a cancelled invoice");
        }
        if (invoice.getStatus() == InvoiceStatus.DRAFT) {
            throw new BadRequestException("Cannot record payment for a draft invoice. Send the invoice first.");
        }

        // Validate payment amount
        BigDecimal remainingBalance = invoice.getBalanceDue();
        if (paymentDTO.getAmount().compareTo(remainingBalance) > 0) {
            throw new BadRequestException("Payment amount (R" + paymentDTO.getAmount() +
                    ") exceeds remaining balance (R" + remainingBalance + ")");
        }

        Payment payment = Payment.builder()
                .invoice(invoice)
                .amount(paymentDTO.getAmount())
                .paymentDate(paymentDTO.getPaymentDate())
                .paymentMethod(paymentDTO.getPaymentMethod() != null ?
                        paymentDTO.getPaymentMethod() : PaymentMethod.EFT)
                .referenceNumber(paymentDTO.getReferenceNumber())
                .notes(paymentDTO.getNotes())
                .build();

        // Update invoice payment totals
        invoice.addPayment(payment);

        Payment savedPayment = paymentRepository.save(payment);
        return mapToDTO(savedPayment);
    }

    /**
     * Get payment by ID.
     */
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        return mapToDTO(payment);
    }

    /**
     * Get payments for an invoice.
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get payments for a company with pagination.
     */
    @Transactional(readOnly = true)
    public Page<PaymentDTO> getPaymentsByCompanyId(Long companyId, Pageable pageable) {
        return paymentRepository.findByCompanyId(companyId, pageable)
                .map(this::mapToDTO);
    }

    /**
     * Get payments by date range.
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> getPaymentsByDateRange(Long companyId, LocalDate startDate, LocalDate endDate) {
        return paymentRepository.findByDateRange(companyId, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get unreconciled payments.
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> getUnreconciledPayments(Long companyId) {
        return paymentRepository.findUnreconciledPayments(companyId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Mark payment as reconciled.
     */
    public PaymentDTO reconcilePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        payment.markAsReconciled();
        Payment updatedPayment = paymentRepository.save(payment);
        return mapToDTO(updatedPayment);
    }

    /**
     * Update payment.
     */
    public PaymentDTO updatePayment(Long id, PaymentDTO paymentDTO) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        if (payment.isReconciled()) {
            throw new BadRequestException("Cannot update a reconciled payment");
        }

        // Validate new amount doesn't exceed remaining balance
        Invoice invoice = payment.getInvoice();
        BigDecimal remainingBalance = invoice.getBalanceDue()
                .add(payment.getAmount()); // Add back current payment amount

        if (paymentDTO.getAmount().compareTo(remainingBalance) > 0) {
            throw new BadRequestException("Payment amount exceeds remaining balance");
        }

        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentDate(paymentDTO.getPaymentDate());
        if (paymentDTO.getPaymentMethod() != null) {
            payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        }
        payment.setReferenceNumber(paymentDTO.getReferenceNumber());
        payment.setNotes(paymentDTO.getNotes());

        // Recalculate invoice payments
        invoice.recalculatePayments();

        Payment updatedPayment = paymentRepository.save(payment);
        return mapToDTO(updatedPayment);
    }

    /**
     * Delete payment.
     */
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));

        if (payment.isReconciled()) {
            throw new BadRequestException("Cannot delete a reconciled payment");
        }

        Invoice invoice = payment.getInvoice();
        invoice.getPayments().remove(payment);
        invoice.recalculatePayments();

        paymentRepository.delete(payment);
    }

    /**
     * Get total payments by date range.
     */
    @Transactional(readOnly = true)
    public BigDecimal getTotalPaymentsByDateRange(Long companyId, LocalDate startDate, LocalDate endDate) {
        return paymentRepository.getTotalPaymentsByDateRange(companyId, startDate, endDate);
    }

    // Mapping methods
    private PaymentDTO mapToDTO(Payment payment) {
        return PaymentDTO.builder()
                .id(payment.getId())
                .invoiceId(payment.getInvoice().getId())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .referenceNumber(payment.getReferenceNumber())
                .notes(payment.getNotes())
                .reconciled(payment.isReconciled())
                .reconciledAt(payment.getReconciledAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
