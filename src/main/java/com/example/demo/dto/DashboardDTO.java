package com.example.demo.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for dashboard statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {

    private long totalInvoices;
    private long draftInvoices;
    private long pendingInvoices;
    private long paidInvoices;
    private long overdueInvoices;
    private long totalClients;
    private long activeClients;

    private BigDecimal totalRevenue;
    private BigDecimal totalOutstanding;
    private BigDecimal totalPaid;
    private BigDecimal monthlyRevenue;

    private List<MonthlyRevenueDTO> monthlyRevenueData;
    private List<RecentInvoiceDTO> recentInvoices;
    private List<OverdueInvoiceDTO> overdueInvoicesList;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyRevenueDTO {
        private int month;
        private String monthName;
        private BigDecimal amount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentInvoiceDTO {
        private Long id;
        private String invoiceNumber;
        private String clientName;
        private BigDecimal amount;
        private String status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OverdueInvoiceDTO {
        private Long id;
        private String invoiceNumber;
        private String clientName;
        private BigDecimal balanceDue;
        private long daysOverdue;
    }
}
