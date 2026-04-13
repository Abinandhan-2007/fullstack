package com.example.demo.repository;

import com.example.demo.model.StaffPayroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffPayrollRepository extends JpaRepository<StaffPayroll, Long> {
}
