package com.example.demo.repository;

import com.example.demo.model.StudentLeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentLeaveRequestRepository extends JpaRepository<StudentLeaveRequest, Long> {
    List<StudentLeaveRequest> findByRegisterNumberOrderByAppliedOnDesc(String registerNumber);
}
