package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.PaymentDTO;
import com.example.demo.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Payment management.
 */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Payment", description = "Payment management endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/invoices/{invoiceId}/payments")
    @Operation(summary = "Record a payment for an invoice")
    public ResponseEntity<ApiResponse<PaymentDTO>> recordPayment(
            @PathVariable Long invoiceId,
            @Valid @RequestBody PaymentDTO paymentDTO) {
        paymentDTO.setInvoiceId(invoiceId);
        PaymentDTO createdPayment = paymentService.recordPayment(paymentDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Payment recorded successfully", createdPayment),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/invoices/{invoiceId}/payments")
    @Operation(summary = "Get all payments for an invoice")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentsByInvoice(
            @PathVariable Long invoiceId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByInvoiceId(invoiceId);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/payments/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentById(@PathVariable Long id) {
        PaymentDTO payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    @GetMapping("/companies/{companyId}/payments")
    @Operation(summary = "Get all payments for a company with pagination")
    public ResponseEntity<ApiResponse<Page<PaymentDTO>>> getPaymentsByCompany(
            @PathVariable Long companyId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PaymentDTO> payments = paymentService.getPaymentsByCompanyId(companyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/companies/{companyId}/payments/date-range")
    @Operation(summary = "Get payments by date range")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getPaymentsByDateRange(
            @PathVariable Long companyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PaymentDTO> payments = paymentService.getPaymentsByDateRange(companyId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/companies/{companyId}/payments/unreconciled")
    @Operation(summary = "Get unreconciled payments")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getUnreconciledPayments(
            @PathVariable Long companyId) {
        List<PaymentDTO> payments = paymentService.getUnreconciledPayments(companyId);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @GetMapping("/companies/{companyId}/payments/total")
    @Operation(summary = "Get total payments by date range")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalPayments(
            @PathVariable Long companyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        BigDecimal total = paymentService.getTotalPaymentsByDateRange(companyId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(total));
    }

    @PutMapping("/payments/{id}")
    @Operation(summary = "Update payment")
    public ResponseEntity<ApiResponse<PaymentDTO>> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentDTO paymentDTO) {
        PaymentDTO updatedPayment = paymentService.updatePayment(id, paymentDTO);
        return ResponseEntity.ok(
                ApiResponse.success("Payment updated successfully", updatedPayment)
        );
    }

    @PostMapping("/payments/{id}/reconcile")
    @Operation(summary = "Mark payment as reconciled")
    public ResponseEntity<ApiResponse<PaymentDTO>> reconcilePayment(@PathVariable Long id) {
        PaymentDTO reconciledPayment = paymentService.reconcilePayment(id);
        return ResponseEntity.ok(
                ApiResponse.success("Payment reconciled successfully", reconciledPayment)
        );
    }

    @DeleteMapping("/payments/{id}")
    @Operation(summary = "Delete payment (only non-reconciled)")
    public ResponseEntity<ApiResponse<Void>> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok(ApiResponse.success("Payment deleted successfully", null));
    }
}
