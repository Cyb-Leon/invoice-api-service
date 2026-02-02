package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

/**
 * DTO for LineItem entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineItemDTO {

    private Long id;

    @NotBlank(message = "Description is required")
    private String description;

    private String itemCode;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String unitOfMeasure;

    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;

    private BigDecimal discountPercentage;
    private BigDecimal lineTotal;
    private boolean vatInclusive;
    private Integer sortOrder;
}
