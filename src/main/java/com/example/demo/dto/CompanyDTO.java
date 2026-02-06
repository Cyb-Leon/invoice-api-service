package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Company entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDTO {

    private Long id;

    @NotBlank(message = "Company name is required")
    private String name;

    private String tradingName;

    @Pattern(regexp = "^\\d{4}/\\d{6}/\\d{2}$", message = "Invalid SA company registration number format (e.g., 2020/123456/07)")
    private String registrationNumber;

    @Pattern(regexp = "^4\\d{9}$", message = "Invalid SA VAT number format (must start with 4 and be 10 digits)")
    private String vatNumber;

    private boolean vatRegistered;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^(\\+27|0)[1-9]\\d{8}$", message = "Invalid SA phone number format")
    private String phoneNumber;

    private String physicalAddress;
    private String postalAddress;
    private String city;
    private String province;
    private String postalCode;
    private String bankName;
    private String bankAccountNumber;
    private String bankBranchCode;
    private String bankAccountType;
    private String logoUrl;
    private String website;
}
