package com.example.demo.repository;

import com.example.demo.model.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByStudent_RegisterNumber(String registerNumber);
}
