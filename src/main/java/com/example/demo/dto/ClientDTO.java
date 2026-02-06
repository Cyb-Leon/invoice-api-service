package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Client entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {

    private Long id;

    @NotBlank(message = "Client name is required")
    private String name;

    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^(\\+27|0)[1-9]\\d{8}$", message = "Invalid SA phone number format")
    private String phoneNumber;

    @Pattern(regexp = "^4\\d{9}$", message = "Invalid SA VAT number format")
    private String vatNumber;

    private String registrationNumber;
    private String billingAddress;
    private String shippingAddress;
    private String city;
    private String province;
    private String postalCode;
    private String notes;
    private boolean active = true;
    private Double creditLimit;
    private Integer paymentTerms;

    @NotNull(message = "Company ID is required")
    private Long companyId;
}
