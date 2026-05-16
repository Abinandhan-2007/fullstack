package com.example.demo.repository;

import com.example.demo.model.HostelAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostelAllocationRepository extends JpaRepository<HostelAllocation, Long> {
    Optional<HostelAllocation> findByRegisterNumber(String registerNumber);
}
