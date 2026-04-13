package com.example.demo.repository;

import com.example.demo.model.HostelAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostelAllocationRepository extends JpaRepository<HostelAllocation, Long> {
}
