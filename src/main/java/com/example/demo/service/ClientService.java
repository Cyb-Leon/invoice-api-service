package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.ClientDTO;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Client;
import com.example.demo.model.Company;
import com.example.demo.repository.ClientRepository;

/**
 * Service for Client business logic.
 */
@Service
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final CompanyService companyService;

    public ClientService(ClientRepository clientRepository, CompanyService companyService) {
        this.clientRepository = clientRepository;
        this.companyService = companyService;
    }

    /**
     * Create a new client.
     */
    public ClientDTO createClient(ClientDTO clientDTO) {
        // Verify company exists
        Company company = companyService.getCompanyEntityById(clientDTO.getCompanyId());

        // Check for duplicate email within the company
        if (clientRepository.existsByEmailAndCompanyId(clientDTO.getEmail(), clientDTO.getCompanyId())) {
            throw new DuplicateResourceException("Client", "email", clientDTO.getEmail());
        }

        Client client = mapToEntity(clientDTO, company);
        Client savedClient = clientRepository.save(client);
        return mapToDTO(savedClient);
    }

    /**
     * Get client by ID.
     */
    @Transactional(readOnly = true)
    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        return mapToDTO(client);
    }

    /**
     * Get client by ID and company ID.
     */
    @Transactional(readOnly = true)
    public ClientDTO getClientByIdAndCompanyId(Long id, Long companyId) {
        Client client = clientRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        return mapToDTO(client);
    }

    /**
     * Get all clients for a company.
     */
    @Transactional(readOnly = true)
    public List<ClientDTO> getClientsByCompanyId(Long companyId) {
        return clientRepository.findByCompanyId(companyId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get clients by company with pagination.
     */
    @Transactional(readOnly = true)
    public Page<ClientDTO> getClientsByCompanyId(Long companyId, Pageable pageable) {
        return clientRepository.findByCompanyId(companyId, pageable)
                .map(this::mapToDTO);
    }

    /**
     * Get active clients for a company.
     */
    @Transactional(readOnly = true)
    public List<ClientDTO> getActiveClientsByCompanyId(Long companyId) {
        return clientRepository.findByCompanyIdAndActiveTrue(companyId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search clients.
     */
    @Transactional(readOnly = true)
    public Page<ClientDTO> searchClients(Long companyId, String searchTerm, Pageable pageable) {
        return clientRepository.searchClients(companyId, searchTerm, pageable)
                .map(this::mapToDTO);
    }

    /**
     * Update client.
     */
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findByIdAndCompanyId(id, clientDTO.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));

        // Check for duplicate email if changed
        if (!client.getEmail().equals(clientDTO.getEmail()) &&
            clientRepository.existsByEmailAndCompanyId(clientDTO.getEmail(), clientDTO.getCompanyId())) {
            throw new DuplicateResourceException("Client", "email", clientDTO.getEmail());
        }

        updateEntityFromDTO(client, clientDTO);
        Client updatedClient = clientRepository.save(client);
        return mapToDTO(updatedClient);
    }

    /**
     * Delete client.
     */
    public void deleteClient(Long id, Long companyId) {
        Client client = clientRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        clientRepository.delete(client);
    }

    /**
     * Deactivate client (soft delete).
     */
    public ClientDTO deactivateClient(Long id, Long companyId) {
        Client client = clientRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        client.setActive(false);
        Client updatedClient = clientRepository.save(client);
        return mapToDTO(updatedClient);
    }

    /**
     * Activate client.
     */
    public ClientDTO activateClient(Long id, Long companyId) {
        Client client = clientRepository.findByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        client.setActive(true);
        Client updatedClient = clientRepository.save(client);
        return mapToDTO(updatedClient);
    }

    /**
     * Get client entity by ID (for internal use).
     */
    @Transactional(readOnly = true)
    public Client getClientEntityById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
    }

    /**
     * Count active clients for a company.
     */
    @Transactional(readOnly = true)
    public long countActiveClients(Long companyId) {
        return clientRepository.countActiveClientsByCompanyId(companyId);
    }

    // Mapping methods
    private ClientDTO mapToDTO(Client client) {
        return ClientDTO.builder()
                .id(client.getId())
                .name(client.getName())
                .contactPerson(client.getContactPerson())
                .email(client.getEmail())
                .phoneNumber(client.getPhoneNumber())
                .vatNumber(client.getVatNumber())
                .registrationNumber(client.getRegistrationNumber())
                .billingAddress(client.getBillingAddress())
                .shippingAddress(client.getShippingAddress())
                .city(client.getCity())
                .province(client.getProvince())
                .postalCode(client.getPostalCode())
                .notes(client.getNotes())
                .active(client.isActive())
                .creditLimit(client.getCreditLimit())
                .paymentTerms(client.getPaymentTerms())
                .companyId(client.getCompany().getId())
                .build();
    }

    private Client mapToEntity(ClientDTO dto, Company company) {
        return Client.builder()
                .name(dto.getName())
                .contactPerson(dto.getContactPerson())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .vatNumber(dto.getVatNumber())
                .registrationNumber(dto.getRegistrationNumber())
                .billingAddress(dto.getBillingAddress())
                .shippingAddress(dto.getShippingAddress())
                .city(dto.getCity())
                .province(dto.getProvince())
                .postalCode(dto.getPostalCode())
                .notes(dto.getNotes())
                .active(dto.isActive())
                .creditLimit(dto.getCreditLimit())
                .paymentTerms(dto.getPaymentTerms() != null ? dto.getPaymentTerms() : 30)
                .company(company)
                .build();
    }

    private void updateEntityFromDTO(Client client, ClientDTO dto) {
        client.setName(dto.getName());
        client.setContactPerson(dto.getContactPerson());
        client.setEmail(dto.getEmail());
        client.setPhoneNumber(dto.getPhoneNumber());
        client.setVatNumber(dto.getVatNumber());
        client.setRegistrationNumber(dto.getRegistrationNumber());
        client.setBillingAddress(dto.getBillingAddress());
        client.setShippingAddress(dto.getShippingAddress());
        client.setCity(dto.getCity());
        client.setProvince(dto.getProvince());
        client.setPostalCode(dto.getPostalCode());
        client.setNotes(dto.getNotes());
        client.setActive(dto.isActive());
        client.setCreditLimit(dto.getCreditLimit());
        if (dto.getPaymentTerms() != null) {
            client.setPaymentTerms(dto.getPaymentTerms());
        }
    }
}
