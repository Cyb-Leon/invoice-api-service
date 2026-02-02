package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Entity representing a line item on an invoice.
 */
@Entity
@Table(name = "line_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "item_code")
    private String itemCode;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "unit_of_measure")
    @Builder.Default
    private String unitOfMeasure = "each";

    /**
     * Unit price in ZAR (excluding VAT)
     */
    @NotNull(message = "Unit price is required")
    @Column(name = "unit_price", precision = 15, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    /**
     * Discount percentage for this line item
     */
    @Column(name = "discount_percentage", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercentage = BigDecimal.ZERO;

    /**
     * Line total (quantity × unit price - discount) in ZAR
     */
    @Column(name = "line_total", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal lineTotal = BigDecimal.ZERO;

    /**
     * Optional: VAT inclusive flag (if prices include VAT)
     */
    @Column(name = "vat_inclusive")
    @Builder.Default
    private boolean vatInclusive = false;

    /**
     * Sort order for display
     */
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    @PrePersist
    @PreUpdate
    protected void calculateLineTotal() {
        if (unitPrice != null && quantity != null) {
            BigDecimal gross = unitPrice.multiply(BigDecimal.valueOf(quantity));
            
            if (discountPercentage != null && discountPercentage.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal discount = gross.multiply(discountPercentage)
                        .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                this.lineTotal = gross.subtract(discount);
            } else {
                this.lineTotal = gross;
            }
        }
    }

    /**
     * Get the line total after any discounts.
     */
    public BigDecimal getLineTotal() {
        calculateLineTotal();
        return lineTotal;
    }

    /**
     * Get the discount amount for this line item.
     */
    public BigDecimal getDiscountAmount() {
        if (discountPercentage == null || discountPercentage.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal gross = unitPrice.multiply(BigDecimal.valueOf(quantity));
        return gross.multiply(discountPercentage)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
    }
}
