package com.example.demo.service;

import com.example.demo.dto.FeePaymentDTO;
import com.example.demo.model.FeePayment;
import com.example.demo.repository.FeePaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeeService {
    @Autowired
    private FeePaymentRepository feePaymentRepository;

    public List<FeePaymentDTO> getFeesByStudent(String regNo) {
        try {
            return feePaymentRepository.findByStudent_RegisterNumber(regNo).stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching fees: " + e.getMessage());
        }
    }

    public FeePaymentDTO getReceipt(Long paymentId) {
        try {
            FeePayment payment = feePaymentRepository.findById(paymentId).orElseThrow(() -> new RuntimeException("Receipt not found"));
            return mapToDTO(payment);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching receipt: " + e.getMessage());
        }
    }

    private FeePaymentDTO mapToDTO(FeePayment fee) {
        FeePaymentDTO dto = new FeePaymentDTO();
        dto.setId(fee.getId());
        dto.setFeeType(fee.getFeeType());
        dto.setAmount(fee.getAmount());
        dto.setDueDate(fee.getDueDate());
        dto.setStatus(fee.getStatus());
        dto.setReceiptNumber(fee.getReceiptNumber());
        dto.setPaidDate(fee.getPaidDate());
        return dto;
    }
}
