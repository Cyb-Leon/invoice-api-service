package com.example.demo.dto;

import com.example.demo.model.InvoiceStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for Invoice entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDTO {

    private Long id;
    private String invoiceNumber;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    private String companyName;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    private String clientName;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private InvoiceStatus status;
    private BigDecimal subtotal;
    private BigDecimal vatRate;
    private BigDecimal vatAmount;
    private BigDecimal discountPercentage;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private BigDecimal amountPaid;
    private BigDecimal balanceDue;
    private String currency;
    private String notes;
    private String termsAndConditions;
    private String referenceNumber;
    private String purchaseOrderNumber;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
    private LocalDateTime paidAt;

    @Valid
    @Builder.Default
    private List<LineItemDTO> lineItems = new ArrayList<>();

    @Builder.Default
    private List<PaymentDTO> payments = new ArrayList<>();
}
