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
        List<FeePayment> payments = feePaymentRepository.findByRegisterNumber(regNo);
        return payments.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public FeePaymentDTO getReceipt(Long paymentId) {
        FeePayment payment = feePaymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapToDTO(payment);
    }

    private FeePaymentDTO mapToDTO(FeePayment payment) {
        FeePaymentDTO dto = new FeePaymentDTO();
        dto.setId(payment.getId());
        dto.setFeeType(payment.getAcademicYear() != null ? "Academic Fee - " + payment.getAcademicYear() : "General Fee");
        dto.setAmount(payment.getAmountPaid());
        dto.setDueDate("N/A"); // Default fallback since model lacks dueDate
        dto.setStatus(payment.getStatus());
        dto.setReceiptNumber(payment.getReceiptNumber());
        dto.setPaidDate(payment.getPaymentDate());
        return dto;
    }
}
