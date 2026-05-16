package com.example.demo.repository;

import com.example.demo.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmail(String email);
    Optional<Staff> findByEmployeeId(String employeeId);
    Optional<Staff> findByStaffId(String staffId);
}