package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.DashboardDTO;
import com.example.demo.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Dashboard statistics.
 */
@RestController
@RequestMapping("/api/v1/companies/{companyId}/dashboard")
@Tag(name = "Dashboard", description = "Dashboard and reporting endpoints")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @Operation(summary = "Get dashboard statistics for a company")
    public ResponseEntity<ApiResponse<DashboardDTO>> getDashboardStats(
            @PathVariable Long companyId) {
        DashboardDTO dashboardStats = dashboardService.getDashboardStats(companyId);
        return ResponseEntity.ok(ApiResponse.success(dashboardStats));
    }
}
