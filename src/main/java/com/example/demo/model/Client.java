package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a client/customer that receives invoices.
 */
@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Client name is required")
    @Column(nullable = false)
    private String name;

    @Column(name = "contact_person")
    private String contactPerson;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false)
    private String email;

    @Pattern(regexp = "^(\\+27|0)[1-9]\\d{8}$", message = "Invalid SA phone number format")
    @Column(name = "phone_number")
    private String phoneNumber;

    /**
     * South African VAT Registration Number (optional for clients)
     */
    @Pattern(regexp = "^4\\d{9}$", message = "Invalid SA VAT number format")
    @Column(name = "vat_number")
    private String vatNumber;

    /**
     * South African Company Registration Number (optional)
     */
    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "billing_address", columnDefinition = "TEXT")
    private String billingAddress;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    private String city;

    private String province;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

    @Column(name = "credit_limit")
    private Double creditLimit;

    @Column(name = "payment_terms")
    @Builder.Default
    private Integer paymentTerms = 30; // Default 30 days

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Invoice> invoices = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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
     * Get the full address as a formatted string.
     */
    public String getFullBillingAddress() {
        StringBuilder address = new StringBuilder();
        if (billingAddress != null) address.append(billingAddress);
        if (city != null) address.append(", ").append(city);
        if (province != null) address.append(", ").append(province);
        if (postalCode != null) address.append(", ").append(postalCode);
        return address.toString();
    }
}
