package com.example.demo.repository;

import com.example.demo.model.StaffLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffLeaveRepository extends JpaRepository<StaffLeave, Long> {
    List<StaffLeave> findByStaff_StaffId(String staffId);
    List<StaffLeave> findByStatus(String status);
}
