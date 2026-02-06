package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.LineItem;

/**
 * Repository for LineItem entity operations.
 */
@Repository
public interface LineItemRepository extends JpaRepository<LineItem, Long> {

    List<LineItem> findByInvoiceId(Long invoiceId);

    List<LineItem> findByInvoiceIdOrderBySortOrderAsc(Long invoiceId);

    void deleteByInvoiceId(Long invoiceId);

    int countByInvoiceId(Long invoiceId);
}
