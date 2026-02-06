package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.InvoiceDTO;
import com.example.demo.model.InvoiceStatus;
import com.example.demo.service.InvoiceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * REST Controller for Invoice management.
 */
@RestController
@RequestMapping("/api/v1/companies/{companyId}/invoices")
@Tag(name = "Invoice", description = "Invoice management endpoints")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    @Operation(summary = "Create a new invoice")
    public ResponseEntity<ApiResponse<InvoiceDTO>> createInvoice(
            @PathVariable Long companyId,
            @Valid @RequestBody InvoiceDTO invoiceDTO) {
        invoiceDTO.setCompanyId(companyId);
        InvoiceDTO createdInvoice = invoiceService.createInvoice(invoiceDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Invoice created successfully", createdInvoice),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get invoice by ID")
    public ResponseEntity<ApiResponse<InvoiceDTO>> getInvoiceById(
            @PathVariable Long companyId,
            @PathVariable Long id) {
        InvoiceDTO invoice = invoiceService.getInvoiceByIdAndCompanyId(id, companyId);
        return ResponseEntity.ok(ApiResponse.success(invoice));
    }

    @GetMapping("/number/{invoiceNumber}")
    @Operation(summary = "Get invoice by invoice number")
    public ResponseEntity<ApiResponse<InvoiceDTO>> getInvoiceByNumber(
            @PathVariable Long companyId,
            @PathVariable String invoiceNumber) {
        InvoiceDTO invoice = invoiceService.getInvoiceByNumber(invoiceNumber);
        return ResponseEntity.ok(ApiResponse.success(invoice));
    }

    @GetMapping
    @Operation(summary = "Get all invoices for a company with pagination")
    public ResponseEntity<ApiResponse<Page<InvoiceDTO>>> getInvoicesByCompany(
            @PathVariable Long companyId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<InvoiceDTO> invoices = invoiceService.getInvoicesByCompanyId(companyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Get invoices for a specific client")
    public ResponseEntity<ApiResponse<Page<InvoiceDTO>>> getInvoicesByClient(
            @PathVariable Long companyId,
            @PathVariable Long clientId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<InvoiceDTO> invoices = invoiceService.getInvoicesByCompanyAndClient(
                companyId, clientId, pageable);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get invoices by status")
    public ResponseEntity<ApiResponse<Page<InvoiceDTO>>> getInvoicesByStatus(
            @PathVariable Long companyId,
            @PathVariable InvoiceStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<InvoiceDTO> invoices = invoiceService.getInvoicesByStatus(companyId, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue invoices")
    public ResponseEntity<ApiResponse<List<InvoiceDTO>>> getOverdueInvoices(
            @PathVariable Long companyId) {
        List<InvoiceDTO> invoices = invoiceService.getOverdueInvoices(companyId);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @GetMapping("/search")
    @Operation(summary = "Search invoices")
    public ResponseEntity<ApiResponse<Page<InvoiceDTO>>> searchInvoices(
            @PathVariable Long companyId,
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<InvoiceDTO> invoices = invoiceService.searchInvoices(companyId, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get invoices by date range")
    public ResponseEntity<ApiResponse<List<InvoiceDTO>>> getInvoicesByDateRange(
            @PathVariable Long companyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<InvoiceDTO> invoices = invoiceService.getInvoicesByDateRange(companyId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(invoices));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update invoice")
    public ResponseEntity<ApiResponse<InvoiceDTO>> updateInvoice(
            @PathVariable Long companyId,
            @PathVariable Long id,
            @Valid @RequestBody InvoiceDTO invoiceDTO) {
        invoiceDTO.setCompanyId(companyId);
        InvoiceDTO updatedInvoice = invoiceService.updateInvoice(id, invoiceDTO);
        return ResponseEntity.ok(
                ApiResponse.success("Invoice updated successfully", updatedInvoice)
        );
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update invoice status")
    public ResponseEntity<ApiResponse<InvoiceDTO>> updateInvoiceStatus(
            @PathVariable Long companyId,
            @PathVariable Long id,
            @RequestParam InvoiceStatus status) {
        InvoiceDTO updatedInvoice = invoiceService.updateInvoiceStatus(id, companyId, status);
        return ResponseEntity.ok(
                ApiResponse.success("Invoice status updated successfully", updatedInvoice)
        );
    }

    @PostMapping("/{id}/send")
    @Operation(summary = "Mark invoice as sent")
    public ResponseEntity<ApiResponse<InvoiceDTO>> sendInvoice(
            @PathVariable Long companyId,
            @PathVariable Long id) {
        InvoiceDTO sentInvoice = invoiceService.sendInvoice(id, companyId);
        return ResponseEntity.ok(
                ApiResponse.success("Invoice sent successfully", sentInvoice)
        );
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel invoice")
    public ResponseEntity<ApiResponse<InvoiceDTO>> cancelInvoice(
            @PathVariable Long companyId,
            @PathVariable Long id) {
        InvoiceDTO cancelledInvoice = invoiceService.cancelInvoice(id, companyId);
        return ResponseEntity.ok(
                ApiResponse.success("Invoice cancelled successfully", cancelledInvoice)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete draft invoice")
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(
            @PathVariable Long companyId,
            @PathVariable Long id) {
        invoiceService.deleteInvoice(id, companyId);
        return ResponseEntity.ok(ApiResponse.success("Invoice deleted successfully", null));
    }
}
