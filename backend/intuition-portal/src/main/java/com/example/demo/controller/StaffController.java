package com.example.demo.controller;

import com.example.demo.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class StaffController {
    @Autowired
    private StaffService staffService;

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/api/staff/profile")
    public ResponseEntity<?> getProfile(@RequestParam String staffId) {
        try {
            return ResponseEntity.ok(staffService.getProfile(staffId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/api/staff/subjects/{staffId}")
    public ResponseEntity<?> getAssignedSubjects(@PathVariable String staffId) {
        return ResponseEntity.ok(staffService.getAssignedSubjects(staffId));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/api/staff/students/{staffId}")
    public ResponseEntity<?> getAssignedStudents(@PathVariable String staffId) {
        return ResponseEntity.ok(staffService.getAssignedStudents(staffId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/staff")
    public ResponseEntity<?> getAllStaff() {
        return ResponseEntity.ok("All Staff");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/admin/staff")
    public ResponseEntity<?> addStaff() {
        return ResponseEntity.ok("Staff added");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/api/admin/staff/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id) {
        return ResponseEntity.ok("Staff updated");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/api/admin/staff/{id}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
        return ResponseEntity.ok("Staff deleted");
    }
}
