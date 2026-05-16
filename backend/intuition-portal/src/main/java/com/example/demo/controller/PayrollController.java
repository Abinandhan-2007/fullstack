package com.example.demo.controller;

import com.example.demo.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class PayrollController {
    @Autowired
    private PayrollService payrollService;

    @PreAuthorize("hasAnyRole('FINANCE', 'STAFFADMIN', 'ADMIN')")
    @GetMapping("/api/finance/payroll")
    public ResponseEntity<?> getPayroll(@RequestParam String month, @RequestParam String year) {
        try {
            return ResponseEntity.ok(payrollService.getPayrollRecords(month, year));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @PostMapping("/api/finance/payroll/generate")
    public ResponseEntity<?> generatePayroll(@RequestParam String month, @RequestParam String year) {
        try {
            payrollService.generatePayroll(month, year);
            return ResponseEntity.ok("Payroll generated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
