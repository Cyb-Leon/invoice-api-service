package com.example.demo.repository;

import com.example.demo.model.Payment;
import com.example.demo.model.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Payment entity operations.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByInvoiceId(Long invoiceId);

    Page<Payment> findByInvoiceId(Long invoiceId, Pageable pageable);

    // Find payments by company (through invoice)
    @Query("SELECT p FROM Payment p WHERE p.invoice.company.id = :companyId")
    List<Payment> findByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT p FROM Payment p WHERE p.invoice.company.id = :companyId")
    Page<Payment> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    // Find payments by date range
    @Query("SELECT p FROM Payment p WHERE p.invoice.company.id = :companyId " +
           "AND p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findByDateRange(@Param("companyId") Long companyId,
                                   @Param("startDate") LocalDate startDate,
                                   @Param("endDate") LocalDate endDate);

    // Find unreconciled payments
    @Query("SELECT p FROM Payment p WHERE p.invoice.company.id = :companyId AND p.reconciled = false")
    List<Payment> findUnreconciledPayments(@Param("companyId") Long companyId);

    // Get total payments for a date range
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p " +
           "WHERE p.invoice.company.id = :companyId " +
           "AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalPaymentsByDateRange(@Param("companyId") Long companyId,
                                            @Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

    // Payments by method
    @Query("SELECT p.paymentMethod, COUNT(p), COALESCE(SUM(p.amount), 0) " +
           "FROM Payment p WHERE p.invoice.company.id = :companyId " +
           "GROUP BY p.paymentMethod")
    List<Object[]> getPaymentsByMethod(@Param("companyId") Long companyId);

    // Total amount paid for an invoice
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.invoice.id = :invoiceId")
    BigDecimal getTotalPaidForInvoice(@Param("invoiceId") Long invoiceId);
}
