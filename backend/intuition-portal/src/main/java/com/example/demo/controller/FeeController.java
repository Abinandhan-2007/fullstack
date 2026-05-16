package com.example.demo.controller;

import com.example.demo.dto.FeePaymentDTO;
import com.example.demo.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
public class FeeController {

    @Autowired
    private FeeService feeService;

    @GetMapping("/student/{regNo}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<FeePaymentDTO>> getStudentFees(@PathVariable String regNo) {
        List<FeePaymentDTO> fees = feeService.getFeesByStudent(regNo);
        return ResponseEntity.ok(fees);
    }

    @GetMapping("/receipt/{paymentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<FeePaymentDTO> getFeeReceipt(@PathVariable Long paymentId) {
        FeePaymentDTO receipt = feeService.getReceipt(paymentId);
        return ResponseEntity.ok(receipt);
    }
}
