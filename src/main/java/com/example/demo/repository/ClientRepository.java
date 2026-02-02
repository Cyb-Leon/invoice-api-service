package com.example.demo.repository;

import com.example.demo.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Client entity operations.
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    List<Client> findByCompanyId(Long companyId);

    Page<Client> findByCompanyId(Long companyId, Pageable pageable);

    Optional<Client> findByIdAndCompanyId(Long id, Long companyId);

    List<Client> findByCompanyIdAndActiveTrue(Long companyId);

    @Query("SELECT c FROM Client c WHERE c.company.id = :companyId AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.contactPerson) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Client> searchClients(@Param("companyId") Long companyId, 
                               @Param("searchTerm") String searchTerm, 
                               Pageable pageable);

    boolean existsByEmailAndCompanyId(String email, Long companyId);

    @Query("SELECT COUNT(c) FROM Client c WHERE c.company.id = :companyId AND c.active = true")
    long countActiveClientsByCompanyId(@Param("companyId") Long companyId);
}
