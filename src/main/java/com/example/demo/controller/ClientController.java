package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.ClientDTO;
import com.example.demo.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Client management.
 */
@RestController
@RequestMapping("/api/v1/companies/{companyId}/clients")
@Tag(name = "Client", description = "Client management endpoints")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    @Operation(summary = "Create a new client for a company")
    public ResponseEntity<ApiResponse<ClientDTO>> createClient(
            @PathVariable Long companyId,
            @Valid @RequestBody ClientDTO clientDTO) {
        clientDTO.setCompanyId(companyId);
        ClientDTO createdClient = clientService.createClient(clientDTO);
        return new ResponseEntity<>(
                ApiResponse.success("Client created successfully", createdClient),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get client by ID")
    public ResponseEntity<ApiResponse<ClientDTO>> getClientById(
            @PathVariable Long companyId,
            @PathVariable Long id) {
        ClientDTO client = clientService.getClientByIdAndCompanyId(id, companyId);
        return ResponseEntity.ok(ApiResponse.success(client));
    }

    @GetMapping
    @Operation(summary = "Get all clients for a company with pagination")
    public ResponseEntity<ApiResponse<Page<ClientDTO>>> getClientsByCompany(
            @PathVariable Long companyId,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ClientDTO> clients = clientService.getClientsByCompanyId(companyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(clients));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active clients for a company")
    public ResponseEntity<ApiResponse<List<ClientDTO>>> getActiveClients(
            @PathVariable Long companyId) {
        List<ClientDTO> clients = clientService.getActiveClientsByCompanyId(companyId);
        return ResponseEntity.ok(ApiResponse.success(clients));
    }

    @GetMapping("/search")
    @Operation(summary = "Search clients")
    public ResponseEntity<ApiResponse<Page<ClientDTO>>> searchClients(
            @PathVariable Long companyId,
            @RequestParam String query,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ClientDTO> clients = clientService.searchClients(companyId, query, pageable);
        return ResponseEntity.ok(ApiResponse.success(clients));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update client")
    public ResponseEntity<ApiResponse<ClientDTO>> updateClient(
            @PathVariable Long companyId,
            @PathVariable Long id,
            @Valid @RequestBody ClientDTO clientDTO) {
        clientDTO.setCompanyId(companyId);
        ClientDTO updatedClient = clientService.updateClient(id, clientDTO);
        return ResponseEntity.ok(
                ApiResponse.success("Client updated successfully", updatedClient)
        );
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate client (soft delete)")
    public ResponseEntity<ApiResponse<ClientDTO>> deactivateClient(
            @PathVariable Long companyId,
            @PathVariable Long id) {
        ClientDTO client = clientService.deactivateClient(id, companyId);
        return ResponseEntity.ok(
                ApiResponse.success("Client deactivated successfully", client)
        );
    }

    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate client")
    public ResponseEntity<ApiResponse<ClientDTO>> activateClient(
            @PathVariable Long companyId,
            @PathVariable Long id) {
        ClientDTO client = clientService.activateClient(id, companyId);
        return ResponseEntity.ok(
                ApiResponse.success("Client activated successfully", client)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete client permanently")
    public ResponseEntity<ApiResponse<Void>> deleteClient(
            @PathVariable Long companyId,
            @PathVariable Long id) {
        clientService.deleteClient(id, companyId);
        return ResponseEntity.ok(ApiResponse.success("Client deleted successfully", null));
    }
}
