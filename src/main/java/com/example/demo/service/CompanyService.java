package com.example.demo.service;

import com.example.demo.dto.CompanyDTO;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Company;
import com.example.demo.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Company business logic.
 */
@Service
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    /**
     * Create a new company.
     */
    public CompanyDTO createCompany(CompanyDTO companyDTO) {
        // Check for duplicates
        if (companyRepository.existsByEmail(companyDTO.getEmail())) {
            throw new DuplicateResourceException("Company", "email", companyDTO.getEmail());
        }
        if (companyDTO.getVatNumber() != null && 
            companyRepository.existsByVatNumber(companyDTO.getVatNumber())) {
            throw new DuplicateResourceException("Company", "vatNumber", companyDTO.getVatNumber());
        }
        if (companyDTO.getRegistrationNumber() != null && 
            companyRepository.existsByRegistrationNumber(companyDTO.getRegistrationNumber())) {
            throw new DuplicateResourceException("Company", "registrationNumber", companyDTO.getRegistrationNumber());
        }

        Company company = mapToEntity(companyDTO);
        Company savedCompany = companyRepository.save(company);
        return mapToDTO(savedCompany);
    }

    /**
     * Get company by ID.
     */
    @Transactional(readOnly = true)
    public CompanyDTO getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        return mapToDTO(company);
    }

    /**
     * Get all companies.
     */
    @Transactional(readOnly = true)
    public List<CompanyDTO> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update company.
     */
    public CompanyDTO updateCompany(Long id, CompanyDTO companyDTO) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));

        // Check for duplicate email if changed
        if (!company.getEmail().equals(companyDTO.getEmail()) && 
            companyRepository.existsByEmail(companyDTO.getEmail())) {
            throw new DuplicateResourceException("Company", "email", companyDTO.getEmail());
        }

        updateEntityFromDTO(company, companyDTO);
        Company updatedCompany = companyRepository.save(company);
        return mapToDTO(updatedCompany);
    }

    /**
     * Delete company.
     */
    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        companyRepository.delete(company);
    }

    /**
     * Get company entity by ID (for internal use).
     */
    @Transactional(readOnly = true)
    public Company getCompanyEntityById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
    }

    // Mapping methods
    private CompanyDTO mapToDTO(Company company) {
        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .tradingName(company.getTradingName())
                .registrationNumber(company.getRegistrationNumber())
                .vatNumber(company.getVatNumber())
                .vatRegistered(company.isVatRegistered())
                .email(company.getEmail())
                .phoneNumber(company.getPhoneNumber())
                .physicalAddress(company.getPhysicalAddress())
                .postalAddress(company.getPostalAddress())
                .city(company.getCity())
                .province(company.getProvince())
                .postalCode(company.getPostalCode())
                .bankName(company.getBankName())
                .bankAccountNumber(company.getBankAccountNumber())
                .bankBranchCode(company.getBankBranchCode())
                .bankAccountType(company.getBankAccountType())
                .logoUrl(company.getLogoUrl())
                .website(company.getWebsite())
                .build();
    }

    private Company mapToEntity(CompanyDTO dto) {
        return Company.builder()
                .name(dto.getName())
                .tradingName(dto.getTradingName())
                .registrationNumber(dto.getRegistrationNumber())
                .vatNumber(dto.getVatNumber())
                .vatRegistered(dto.isVatRegistered())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .physicalAddress(dto.getPhysicalAddress())
                .postalAddress(dto.getPostalAddress())
                .city(dto.getCity())
                .province(dto.getProvince())
                .postalCode(dto.getPostalCode())
                .bankName(dto.getBankName())
                .bankAccountNumber(dto.getBankAccountNumber())
                .bankBranchCode(dto.getBankBranchCode())
                .bankAccountType(dto.getBankAccountType())
                .logoUrl(dto.getLogoUrl())
                .website(dto.getWebsite())
                .build();
    }

    private void updateEntityFromDTO(Company company, CompanyDTO dto) {
        company.setName(dto.getName());
        company.setTradingName(dto.getTradingName());
        company.setRegistrationNumber(dto.getRegistrationNumber());
        company.setVatNumber(dto.getVatNumber());
        company.setVatRegistered(dto.isVatRegistered());
        company.setEmail(dto.getEmail());
        company.setPhoneNumber(dto.getPhoneNumber());
        company.setPhysicalAddress(dto.getPhysicalAddress());
        company.setPostalAddress(dto.getPostalAddress());
        company.setCity(dto.getCity());
        company.setProvince(dto.getProvince());
        company.setPostalCode(dto.getPostalCode());
        company.setBankName(dto.getBankName());
        company.setBankAccountNumber(dto.getBankAccountNumber());
        company.setBankBranchCode(dto.getBankBranchCode());
        company.setBankAccountType(dto.getBankAccountType());
        company.setLogoUrl(dto.getLogoUrl());
        company.setWebsite(dto.getWebsite());
    }
}
