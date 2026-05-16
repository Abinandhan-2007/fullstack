package com.example.demo.repository;

import com.example.demo.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByMonthAndYear(String month, String year);
}
