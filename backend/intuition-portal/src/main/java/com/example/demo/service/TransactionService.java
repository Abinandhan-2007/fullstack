package com.example.demo.service;

import com.example.demo.dto.TransactionDTO;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {

    public List<TransactionDTO> getRecentTransactions() {
        try {
            return List.of();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching transactions: " + e.getMessage());
        }
    }
}
