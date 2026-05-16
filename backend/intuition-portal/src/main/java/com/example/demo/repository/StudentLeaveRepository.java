package com.example.demo.repository;

import com.example.demo.model.StudentLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentLeaveRepository extends JpaRepository<StudentLeave, Long> {
    List<StudentLeave> findByStudent_RegisterNumber(String registerNumber);
}
