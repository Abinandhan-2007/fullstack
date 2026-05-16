package com.example.demo.controller;

import com.example.demo.service.PlacementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class PlacementController {
    @Autowired
    private PlacementService placementService;

    @PreAuthorize("hasAnyRole('STUDENT', 'PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/drives")
    public ResponseEntity<?> getUpcomingDrives() {
        try {
            return ResponseEntity.ok(placementService.getUpcomingDrives());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/companies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            return ResponseEntity.ok(placementService.getAllCompanies());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @PostMapping("/api/placement/companies")
    public ResponseEntity<?> addCompany() {
        return ResponseEntity.ok("Company added");
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @PutMapping("/api/placement/companies/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id) {
        return ResponseEntity.ok("Company updated");
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/applications/{companyId}")
    public ResponseEntity<?> getApplicationsByCompany(@PathVariable Long companyId) {
        try {
            return ResponseEntity.ok(placementService.getApplicationsByCompany(companyId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @PutMapping("/api/placement/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            placementService.updateApplicationStatus(id, status);
            return ResponseEntity.ok("Status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(placementService.getStats());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/api/placement/apply/{companyId}")
    public ResponseEntity<?> applyToCompany(@PathVariable Long companyId, @RequestParam String regNo) {
        return ResponseEntity.ok("Applied successfully");
    }
}
