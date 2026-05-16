package com.example.demo.repository;

import com.example.demo.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    // Custom query to find attendance for a specific student
    List<Attendance> findByStudent_RegisterNumber(String registerNumber);
}