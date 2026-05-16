package com.example.demo.controller;

import com.example.demo.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class FeeController {
    @Autowired
    private FeeService feeService;

    @PreAuthorize("hasAnyRole('STUDENT', 'FINANCE', 'ADMIN', 'PARENT')")
    @GetMapping("/api/fees/student/{regNo}")
    public ResponseEntity<?> getFeesByStudent(@PathVariable String regNo) {
        try {
            return ResponseEntity.ok(feeService.getFeesByStudent(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'FINANCE', 'ADMIN')")
    @GetMapping("/api/fees/receipt/{paymentId}")
    public ResponseEntity<?> getReceipt(@PathVariable Long paymentId) {
        try {
            return ResponseEntity.ok(feeService.getReceipt(paymentId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/api/fees/all")
    public ResponseEntity<?> getAllFees() {
        return ResponseEntity.ok("All fees");
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/api/fees/structure")
    public ResponseEntity<?> getFeeStructure() {
        return ResponseEntity.ok("Fee structure");
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PutMapping("/api/fees/structure/{id}")
    public ResponseEntity<?> updateFeeStructure(@PathVariable Long id) {
        return ResponseEntity.ok("Updated structure");
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PostMapping("/api/fees/structure")
    public ResponseEntity<?> addFeeStructure() {
        return ResponseEntity.ok("Added structure");
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/api/fees/defaulters")
    public ResponseEntity<?> getDefaulters() {
        return ResponseEntity.ok("Defaulters list");
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PostMapping("/api/fees/reminder/{regNo}")
    public ResponseEntity<?> sendReminder(@PathVariable String regNo) {
        return ResponseEntity.ok("Reminder sent");
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/api/fees/stats")
    public ResponseEntity<?> getFeeStats() {
        return ResponseEntity.ok("Fee stats");
    }
}
