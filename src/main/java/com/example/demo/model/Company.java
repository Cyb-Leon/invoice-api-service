package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a company that issues invoices.
 * Contains South African specific fields like VAT number and company registration.
 */
@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company name is required")
    @Column(nullable = false)
    private String name;

    @Column(name = "trading_name")
    private String tradingName;

    /**
     * South African Company Registration Number (e.g., 2020/123456/07)
     */
    @Pattern(regexp = "^\\d{4}/\\d{6}/\\d{2}$", message = "Invalid SA company registration number format")
    @Column(name = "registration_number", unique = true)
    private String registrationNumber;

    /**
     * South African VAT Registration Number (e.g., 4123456789)
     */
    @Pattern(regexp = "^4\\d{9}$", message = "Invalid SA VAT number format (must start with 4 and be 10 digits)")
    @Column(name = "vat_number", unique = true)
    private String vatNumber;

    @Column(name = "is_vat_registered")
    private boolean vatRegistered;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String email;

    @Pattern(regexp = "^(\\+27|0)[1-9]\\d{8}$", message = "Invalid SA phone number format")
    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "physical_address", columnDefinition = "TEXT")
    private String physicalAddress;

    @Column(name = "postal_address", columnDefinition = "TEXT")
    private String postalAddress;

    private String city;

    private String province;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "bank_branch_code")
    private String bankBranchCode;

    @Column(name = "bank_account_type")
    private String bankAccountType;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "website")
    private String website;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Client> clients = new ArrayList<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Invoice> invoices = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Add a client to this company.
     */
    public void addClient(Client client) {
        clients.add(client);
        client.setCompany(this);
    }

    /**
     * Remove a client from this company.
     */
    public void removeClient(Client client) {
        clients.remove(client);
        client.setCompany(null);
    }
}
