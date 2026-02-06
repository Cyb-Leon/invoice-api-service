package com.example.demo.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Invoice;
import com.example.demo.model.InvoiceStatus;

/**
 * Repository for Invoice entity operations.
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // Find by company
    List<Invoice> findByCompanyId(Long companyId);

    Page<Invoice> findByCompanyId(Long companyId, Pageable pageable);

    // Find by company and client
    List<Invoice> findByCompanyIdAndClientId(Long companyId, Long clientId);

    Page<Invoice> findByCompanyIdAndClientId(Long companyId, Long clientId, Pageable pageable);

    // Find by invoice number
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    Optional<Invoice> findByIdAndCompanyId(Long id, Long companyId);

    // Find by status
    List<Invoice> findByCompanyIdAndStatus(Long companyId, InvoiceStatus status);

    Page<Invoice> findByCompanyIdAndStatus(Long companyId, InvoiceStatus status, Pageable pageable);

    // Find overdue invoices
    @Query("SELECT i FROM Invoice i WHERE i.company.id = :companyId " +
           "AND i.dueDate < :today " +
           "AND i.status NOT IN ('PAID', 'CANCELLED', 'REFUNDED')")
    List<Invoice> findOverdueInvoices(@Param("companyId") Long companyId,
                                       @Param("today") LocalDate today);

    // Find invoices by date range
    @Query("SELECT i FROM Invoice i WHERE i.company.id = :companyId " +
           "AND i.issueDate BETWEEN :startDate AND :endDate")
    List<Invoice> findByDateRange(@Param("companyId") Long companyId,
                                   @Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate);

    // Search invoices
    @Query("SELECT i FROM Invoice i WHERE i.company.id = :companyId AND " +
           "(LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.client.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.referenceNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Invoice> searchInvoices(@Param("companyId") Long companyId,
                                  @Param("searchTerm") String searchTerm,
                                  Pageable pageable);

    // Get next invoice number
    @Query("SELECT MAX(CAST(SUBSTRING(i.invoiceNumber, LENGTH(:prefix) + 1) AS integer)) " +
           "FROM Invoice i WHERE i.company.id = :companyId AND i.invoiceNumber LIKE CONCAT(:prefix, '%')")
    Integer findMaxInvoiceNumber(@Param("companyId") Long companyId, @Param("prefix") String prefix);

    // Dashboard statistics
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.company.id = :companyId AND i.status = :status")
    long countByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") InvoiceStatus status);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i " +
           "WHERE i.company.id = :companyId AND i.status = 'PAID'")
    BigDecimal getTotalPaidAmount(@Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(i.balanceDue), 0) FROM Invoice i " +
           "WHERE i.company.id = :companyId AND i.status NOT IN ('PAID', 'CANCELLED', 'REFUNDED')")
    BigDecimal getTotalOutstandingAmount(@Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i " +
           "WHERE i.company.id = :companyId AND i.issueDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByDateRange(@Param("companyId") Long companyId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    // Monthly revenue for reports
    @Query("SELECT MONTH(i.issueDate) as month, COALESCE(SUM(i.totalAmount), 0) as total " +
           "FROM Invoice i WHERE i.company.id = :companyId " +
           "AND YEAR(i.issueDate) = :year AND i.status = 'PAID' " +
           "GROUP BY MONTH(i.issueDate) ORDER BY MONTH(i.issueDate)")
    List<Object[]> getMonthlyRevenue(@Param("companyId") Long companyId, @Param("year") int year);

    // Check if invoice number exists
    boolean existsByInvoiceNumber(String invoiceNumber);
}
