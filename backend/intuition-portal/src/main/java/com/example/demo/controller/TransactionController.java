package com.example.demo.controller;

import com.example.demo.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @PreAuthorize("hasAnyRole('FINANCE', 'ADMIN')")
    @GetMapping("/api/finance/transactions")
    public ResponseEntity<?> getRecentTransactions() {
        try {
            return ResponseEntity.ok(transactionService.getRecentTransactions());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
