package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Company;

/**
 * Repository for Company entity operations.
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByEmail(String email);

    Optional<Company> findByVatNumber(String vatNumber);

    Optional<Company> findByRegistrationNumber(String registrationNumber);

    boolean existsByEmail(String email);

    boolean existsByVatNumber(String vatNumber);

    boolean existsByRegistrationNumber(String registrationNumber);
}
