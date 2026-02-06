package com.example.demo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.DashboardDTO;
import com.example.demo.dto.DashboardDTO.MonthlyRevenueDTO;
import com.example.demo.dto.DashboardDTO.OverdueInvoiceDTO;
import com.example.demo.dto.DashboardDTO.RecentInvoiceDTO;
import com.example.demo.model.Invoice;
import com.example.demo.model.InvoiceStatus;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.InvoiceRepository;

/**
 * Service for dashboard statistics and reporting.
 */
@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final InvoiceRepository invoiceRepository;
    private final ClientRepository clientRepository;

    public DashboardService(InvoiceRepository invoiceRepository, ClientRepository clientRepository) {
        this.invoiceRepository = invoiceRepository;
        this.clientRepository = clientRepository;
    }

    /**
     * Get comprehensive dashboard statistics for a company.
     */
    public DashboardDTO getDashboardStats(Long companyId) {
        // Invoice counts by status
        long totalInvoices = invoiceRepository.findByCompanyId(companyId).size();
        long draftInvoices = invoiceRepository.countByCompanyIdAndStatus(companyId, InvoiceStatus.DRAFT);
        long pendingInvoices = invoiceRepository.countByCompanyIdAndStatus(companyId, InvoiceStatus.PENDING) +
                               invoiceRepository.countByCompanyIdAndStatus(companyId, InvoiceStatus.SENT);
        long paidInvoices = invoiceRepository.countByCompanyIdAndStatus(companyId, InvoiceStatus.PAID);

        // Overdue invoices
        List<Invoice> overdueInvoices = invoiceRepository.findOverdueInvoices(companyId, LocalDate.now());
        long overdueCount = overdueInvoices.size();

        // Client counts
        long totalClients = clientRepository.findByCompanyId(companyId).size();
        long activeClients = clientRepository.countActiveClientsByCompanyId(companyId);

        // Financial totals
        BigDecimal totalPaid = invoiceRepository.getTotalPaidAmount(companyId);
        BigDecimal totalOutstanding = invoiceRepository.getTotalOutstandingAmount(companyId);

        // Monthly revenue (current month)
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        BigDecimal monthlyRevenue = invoiceRepository.getTotalRevenueByDateRange(
                companyId, startOfMonth, endOfMonth);

        // Total revenue (all time)
        LocalDate startOfYear = LocalDate.now().withDayOfYear(1);
        BigDecimal totalRevenue = invoiceRepository.getTotalRevenueByDateRange(
                companyId, startOfYear, LocalDate.now());

        // Monthly revenue data for chart
        List<MonthlyRevenueDTO> monthlyRevenueData = getMonthlyRevenueData(companyId);

        // Recent invoices
        List<RecentInvoiceDTO> recentInvoices = getRecentInvoices(companyId, 5);

        // Overdue invoices list
        List<OverdueInvoiceDTO> overdueInvoicesList = overdueInvoices.stream()
                .map(this::mapToOverdueDTO)
                .collect(Collectors.toList());

        return DashboardDTO.builder()
                .totalInvoices(totalInvoices)
                .draftInvoices(draftInvoices)
                .pendingInvoices(pendingInvoices)
                .paidInvoices(paidInvoices)
                .overdueInvoices(overdueCount)
                .totalClients(totalClients)
                .activeClients(activeClients)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalOutstanding(totalOutstanding != null ? totalOutstanding : BigDecimal.ZERO)
                .totalPaid(totalPaid != null ? totalPaid : BigDecimal.ZERO)
                .monthlyRevenue(monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO)
                .monthlyRevenueData(monthlyRevenueData)
                .recentInvoices(recentInvoices)
                .overdueInvoicesList(overdueInvoicesList)
                .build();
    }

    /**
     * Get monthly revenue data for current year.
     */
    private List<MonthlyRevenueDTO> getMonthlyRevenueData(Long companyId) {
        int currentYear = Year.now().getValue();
        List<Object[]> monthlyData = invoiceRepository.getMonthlyRevenue(companyId, currentYear);

        return monthlyData.stream()
                .map(row -> {
                    int month = ((Number) row[0]).intValue();
                    BigDecimal amount = (BigDecimal) row[1];
                    String monthName = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
                    return MonthlyRevenueDTO.builder()
                            .month(month)
                            .monthName(monthName)
                            .amount(amount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Get recent invoices.
     */
    private List<RecentInvoiceDTO> getRecentInvoices(Long companyId, int limit) {
        PageRequest pageRequest = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return invoiceRepository.findByCompanyId(companyId, pageRequest)
                .map(invoice -> RecentInvoiceDTO.builder()
                        .id(invoice.getId())
                        .invoiceNumber(invoice.getInvoiceNumber())
                        .clientName(invoice.getClient().getName())
                        .amount(invoice.getTotalAmount())
                        .status(invoice.getStatus().name())
                        .build())
                .getContent();
    }

    /**
     * Map invoice to overdue DTO.
     */
    private OverdueInvoiceDTO mapToOverdueDTO(Invoice invoice) {
        long daysOverdue = ChronoUnit.DAYS.between(invoice.getDueDate(), LocalDate.now());
        return OverdueInvoiceDTO.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .clientName(invoice.getClient().getName())
                .balanceDue(invoice.getBalanceDue())
                .daysOverdue(daysOverdue)
                .build();
    }
}
