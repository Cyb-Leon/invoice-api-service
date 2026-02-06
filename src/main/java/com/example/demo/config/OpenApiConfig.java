package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

/**
 * OpenAPI/Swagger configuration.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("South African Invoice API")
                        .version("1.0.0")
                        .description("""
                                A comprehensive Invoice Management API designed for South African businesses.

                                Features:
                                - Company and client management
                                - Invoice creation with line items
                                - South African VAT (15%) calculations
                                - ZAR currency support
                                - Payment tracking and reconciliation
                                - Dashboard statistics and reporting

                                South African specific features:
                                - VAT registration number validation
                                - Company registration number validation
                                - SA phone number format support
                                - Popular SA payment methods (EFT, SnapScan, Zapper, PayFast)
                                """)
                        .contact(new Contact()
                                .name("Invoice API Support")
                                .email("support@invoiceapi.co.za"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server")
                ));
    }
}
