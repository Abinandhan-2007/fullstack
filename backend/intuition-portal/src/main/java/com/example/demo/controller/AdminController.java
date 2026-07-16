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

    @Autowired
    private com.example.demo.repository.SecurityLogRepository securityLogRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping({"/api/admin/dashboard/stats", "/api/admin/stats"})
    public ResponseEntity<?> getDashboardStats() {
        try {
            return ResponseEntity.ok(adminService.getSystemStats());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/activity")
    public ResponseEntity<?> getRecentActivity() {
        try {
            // Get last 10 security logs and map them to {user, action, timestamp}
            java.util.List<com.example.demo.model.SecurityLog> logs = securityLogRepository.findAll();
            int size = logs.size();
            java.util.List<java.util.Map<String, Object>> activities = new java.util.ArrayList<>();
            for (int i = Math.max(0, size - 10); i < size; i++) {
                com.example.demo.model.SecurityLog log = logs.get(i);
                java.util.Map<String, Object> act = new java.util.HashMap<>();
                act.put("user", log.getUserEmail());
                act.put("action", log.getAction());
                act.put("timestamp", log.getTimestamp());
                activities.add(0, act); // prepend to have newest first
            }
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/system-health")
    public ResponseEntity<?> getSystemHealth() {
        return ResponseEntity.ok(java.util.Map.of("status", "UP"));
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