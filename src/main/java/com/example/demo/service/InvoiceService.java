package com.example.demo.service;

import com.example.demo.dto.InvoiceDTO;
import com.example.demo.dto.LineItemDTO;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.repository.LineItemRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Invoice business logic.
 */
@Service
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final LineItemRepository lineItemRepository;
    private final CompanyService companyService;
    private final ClientService clientService;

    @Value("${invoice.number.prefix:INV}")
    private String invoiceNumberPrefix;

    @Value("${invoice.vat.rate:15.0}")
    private BigDecimal defaultVatRate;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          LineItemRepository lineItemRepository,
                          CompanyService companyService,
                          ClientService clientService) {
        this.invoiceRepository = invoiceRepository;
        this.lineItemRepository = lineItemRepository;
        this.companyService = companyService;
        this.clientService = clientService;
    }

    /**
     * Create a new invoice.
     */
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        Company company = companyService.getCompanyEntityById(invoiceDTO.getCompanyId());
        Client client = clientService.getClientEntityById(invoiceDTO.getClientId());

        // Verify client belongs to company
        if (!client.getCompany().getId().equals(company.getId())) {
            throw new BadRequestException("Client does not belong to the specified company");
        }

        // Generate invoice number
        String invoiceNumber = generateInvoiceNumber(company.getId());

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .company(company)
                .client(client)
                .issueDate(invoiceDTO.getIssueDate())
                .dueDate(invoiceDTO.getDueDate())
                .status(InvoiceStatus.DRAFT)
                .vatRate(invoiceDTO.getVatRate() != null ? invoiceDTO.getVatRate() : defaultVatRate)
                .discountPercentage(invoiceDTO.getDiscountPercentage() != null ? 
                        invoiceDTO.getDiscountPercentage() : BigDecimal.ZERO)
                .currency("ZAR")
                .notes(invoiceDTO.getNotes())
                .termsAndConditions(invoiceDTO.getTermsAndConditions())
                .referenceNumber(invoiceDTO.getReferenceNumber())
                .purchaseOrderNumber(invoiceDTO.getPurchaseOrderNumber())
                .build();

        // Add line items
        if (invoiceDTO.getLineItems() != null && !invoiceDTO.getLineItems().isEmpty()) {
            for (int i = 0; i < invoiceDTO.getLineItems().size(); i++) {
                LineItemDTO lineItemDTO = invoiceDTO.getLineItems().get(i);
                LineItem lineItem = mapToLineItemEntity(lineItemDTO);
                lineItem.setSortOrder(i);
                invoice.addLineItem(lineItem);
            }
        }

        // Calculate totals
        invoice.recalculateTotals();

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(savedInvoice);
    }

    /**
     * Get invoice by ID.
     */
    @Transactional(readOnly = true)
    public InvoiceDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
        return mapToDTO(invoice);
    }

    /**
     * Get invoice by ID and company ID.
     */
    @Transactional(readOnly = true)
    public InvoiceDTO getInvoiceByIdAndCompanyId(Long id, Long companyId) {
        Invoice invoice = invoiceRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
        return mapToDTO(invoice);
    }

    /**
     * Get invoice by invoice number.
     */
    @Transactional(readOnly = true)
    public InvoiceDTO getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "invoiceNumber", invoiceNumber));
        return mapToDTO(invoice);
    }

    /**
     * Get all invoices for a company.
     */
    @Transactional(readOnly = true)
    public Page<InvoiceDTO> getInvoicesByCompanyId(Long companyId, Pageable pageable) {
        return invoiceRepository.findByCompanyId(companyId, pageable)
                .map(this::mapToDTO);
    }

    /**
     * Get invoices by company and client.
     */
    @Transactional(readOnly = true)
    public Page<InvoiceDTO> getInvoicesByCompanyAndClient(Long companyId, Long clientId, Pageable pageable) {
        return invoiceRepository.findByCompanyIdAndClientId(companyId, clientId, pageable)
                .map(this::mapToDTO);
    }

    /**
     * Get invoices by status.
     */
    @Transactional(readOnly = true)
    public Page<InvoiceDTO> getInvoicesByStatus(Long companyId, InvoiceStatus status, Pageable pageable) {
        return invoiceRepository.findByCompanyIdAndStatus(companyId, status, pageable)
                .map(this::mapToDTO);
    }

    /**
     * Get overdue invoices.
     */
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getOverdueInvoices(Long companyId) {
        return invoiceRepository.findOverdueInvoices(companyId, LocalDate.now()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search invoices.
     */
    @Transactional(readOnly = true)
    public Page<InvoiceDTO> searchInvoices(Long companyId, String searchTerm, Pageable pageable) {
        return invoiceRepository.searchInvoices(companyId, searchTerm, pageable)
                .map(this::mapToDTO);
    }

    /**
     * Get invoices by date range.
     */
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoicesByDateRange(Long companyId, LocalDate startDate, LocalDate endDate) {
        return invoiceRepository.findByDateRange(companyId, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update invoice.
     */
    public InvoiceDTO updateInvoice(Long id, InvoiceDTO invoiceDTO) {
        Invoice invoice = invoiceRepository.findByIdAndCompanyId(id, invoiceDTO.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        // Cannot update paid or cancelled invoices
        if (invoice.getStatus() == InvoiceStatus.PAID || 
            invoice.getStatus() == InvoiceStatus.CANCELLED) {
            throw new BadRequestException("Cannot update a " + invoice.getStatus().name().toLowerCase() + " invoice");
        }

        // Update basic fields
        invoice.setIssueDate(invoiceDTO.getIssueDate());
        invoice.setDueDate(invoiceDTO.getDueDate());
        invoice.setNotes(invoiceDTO.getNotes());
        invoice.setTermsAndConditions(invoiceDTO.getTermsAndConditions());
        invoice.setReferenceNumber(invoiceDTO.getReferenceNumber());
        invoice.setPurchaseOrderNumber(invoiceDTO.getPurchaseOrderNumber());
        
        if (invoiceDTO.getVatRate() != null) {
            invoice.setVatRate(invoiceDTO.getVatRate());
        }
        if (invoiceDTO.getDiscountPercentage() != null) {
            invoice.setDiscountPercentage(invoiceDTO.getDiscountPercentage());
        }

        // Update line items if provided
        if (invoiceDTO.getLineItems() != null) {
            // Clear existing line items
            invoice.getLineItems().clear();
            
            // Add new line items
            for (int i = 0; i < invoiceDTO.getLineItems().size(); i++) {
                LineItemDTO lineItemDTO = invoiceDTO.getLineItems().get(i);
                LineItem lineItem = mapToLineItemEntity(lineItemDTO);
                lineItem.setSortOrder(i);
                invoice.addLineItem(lineItem);
            }
        }

        // Recalculate totals
        invoice.recalculateTotals();

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    /**
     * Update invoice status.
     */
    public InvoiceDTO updateInvoiceStatus(Long id, Long companyId, InvoiceStatus newStatus) {
        Invoice invoice = invoiceRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        // Validate status transition
        validateStatusTransition(invoice.getStatus(), newStatus);

        invoice.setStatus(newStatus);
        
        if (newStatus == InvoiceStatus.SENT) {
            invoice.markAsSent();
        }

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    /**
     * Send invoice (mark as sent).
     */
    public InvoiceDTO sendInvoice(Long id, Long companyId) {
        Invoice invoice = invoiceRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        if (invoice.getStatus() != InvoiceStatus.DRAFT && 
            invoice.getStatus() != InvoiceStatus.PENDING) {
            throw new BadRequestException("Only draft or pending invoices can be sent");
        }

        invoice.markAsSent();
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    /**
     * Cancel invoice.
     */
    public InvoiceDTO cancelInvoice(Long id, Long companyId) {
        Invoice invoice = invoiceRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BadRequestException("Cannot cancel a paid invoice");
        }

        invoice.setStatus(InvoiceStatus.CANCELLED);
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    /**
     * Delete invoice (only drafts).
     */
    public void deleteInvoice(Long id, Long companyId) {
        Invoice invoice = invoiceRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        if (invoice.getStatus() != InvoiceStatus.DRAFT) {
            throw new BadRequestException("Only draft invoices can be deleted");
        }

        invoiceRepository.delete(invoice);
    }

    /**
     * Get invoice entity by ID (for internal use).
     */
    @Transactional(readOnly = true)
    public Invoice getInvoiceEntityById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
    }

    /**
     * Generate next invoice number.
     */
    private String generateInvoiceNumber(Long companyId) {
        String prefix = invoiceNumberPrefix + "-" + Year.now().getValue() + "-";
        Integer maxNumber = invoiceRepository.findMaxInvoiceNumber(companyId, prefix);
        int nextNumber = (maxNumber != null ? maxNumber : 0) + 1;
        return String.format("%s%05d", prefix, nextNumber);
    }

    /**
     * Validate status transitions.
     */
    private void validateStatusTransition(InvoiceStatus currentStatus, InvoiceStatus newStatus) {
        // Define valid transitions
        if (currentStatus == InvoiceStatus.PAID || currentStatus == InvoiceStatus.CANCELLED) {
            throw new BadRequestException("Cannot change status of a " + 
                    currentStatus.name().toLowerCase() + " invoice");
        }
        if (currentStatus == InvoiceStatus.REFUNDED) {
            throw new BadRequestException("Cannot change status of a refunded invoice");
        }
    }

    // Mapping methods
    private InvoiceDTO mapToDTO(Invoice invoice) {
        List<LineItemDTO> lineItemDTOs = invoice.getLineItems().stream()
                .map(this::mapToLineItemDTO)
                .collect(Collectors.toList());

        return InvoiceDTO.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .companyId(invoice.getCompany().getId())
                .companyName(invoice.getCompany().getName())
                .clientId(invoice.getClient().getId())
                .clientName(invoice.getClient().getName())
                .issueDate(invoice.getIssueDate())
                .dueDate(invoice.getDueDate())
                .status(invoice.getStatus())
                .subtotal(invoice.getSubtotal())
                .vatRate(invoice.getVatRate())
                .vatAmount(invoice.getVatAmount())
                .discountPercentage(invoice.getDiscountPercentage())
                .discountAmount(invoice.getDiscountAmount())
                .totalAmount(invoice.getTotalAmount())
                .amountPaid(invoice.getAmountPaid())
                .balanceDue(invoice.getBalanceDue())
                .currency(invoice.getCurrency())
                .notes(invoice.getNotes())
                .termsAndConditions(invoice.getTermsAndConditions())
                .referenceNumber(invoice.getReferenceNumber())
                .purchaseOrderNumber(invoice.getPurchaseOrderNumber())
                .lineItems(lineItemDTOs)
                .createdAt(invoice.getCreatedAt())
                .sentAt(invoice.getSentAt())
                .paidAt(invoice.getPaidAt())
                .build();
    }

    private LineItemDTO mapToLineItemDTO(LineItem lineItem) {
        return LineItemDTO.builder()
                .id(lineItem.getId())
                .description(lineItem.getDescription())
                .itemCode(lineItem.getItemCode())
                .quantity(lineItem.getQuantity())
                .unitOfMeasure(lineItem.getUnitOfMeasure())
                .unitPrice(lineItem.getUnitPrice())
                .discountPercentage(lineItem.getDiscountPercentage())
                .lineTotal(lineItem.getLineTotal())
                .vatInclusive(lineItem.isVatInclusive())
                .sortOrder(lineItem.getSortOrder())
                .build();
    }

    private LineItem mapToLineItemEntity(LineItemDTO dto) {
        return LineItem.builder()
                .description(dto.getDescription())
                .itemCode(dto.getItemCode())
                .quantity(dto.getQuantity())
                .unitOfMeasure(dto.getUnitOfMeasure() != null ? dto.getUnitOfMeasure() : "each")
                .unitPrice(dto.getUnitPrice())
                .discountPercentage(dto.getDiscountPercentage() != null ? 
                        dto.getDiscountPercentage() : BigDecimal.ZERO)
                .vatInclusive(dto.isVatInclusive())
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .build();
    }

    // Statistics methods
    @Transactional(readOnly = true)
    public long countInvoicesByStatus(Long companyId, InvoiceStatus status) {
        return invoiceRepository.countByCompanyIdAndStatus(companyId, status);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalPaidAmount(Long companyId) {
        return invoiceRepository.getTotalPaidAmount(companyId);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalOutstandingAmount(Long companyId) {
        return invoiceRepository.getTotalOutstandingAmount(companyId);
    }

    @Transactional(readOnly = true)
    public BigDecimal getRevenueByDateRange(Long companyId, LocalDate startDate, LocalDate endDate) {
        return invoiceRepository.getTotalRevenueByDateRange(companyId, startDate, endDate);
    }
}
