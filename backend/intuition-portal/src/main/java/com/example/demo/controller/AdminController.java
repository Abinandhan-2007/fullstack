package com.example.demo.controller;

import com.example.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            return ResponseEntity.ok(adminService.getSystemStats());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/settings")
    public ResponseEntity<?> getSystemSettings() {
        return ResponseEntity.ok("System Settings");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/api/admin/settings")
    public ResponseEntity<?> updateSystemSettings() {
        return ResponseEntity.ok("Settings updated");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/security/logs")
    public ResponseEntity<?> getSecurityLogs() {
        return ResponseEntity.ok("Security logs");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/announcements")
    public ResponseEntity<?> getAnnouncements() {
        return ResponseEntity.ok("Announcements");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/admin/announcements")
    public ResponseEntity<?> createAnnouncement() {
        return ResponseEntity.ok("Announcement created");
    }
}