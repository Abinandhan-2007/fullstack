package com.example.demo.repository;

import com.example.demo.model.HostelAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HostelAllocationRepository extends JpaRepository<HostelAllocation, Long> {
    List<HostelAllocation> findByStudent_RegisterNumber(String registerNumber);
    List<HostelAllocation> findByRoom_Id(Long roomId);
}
