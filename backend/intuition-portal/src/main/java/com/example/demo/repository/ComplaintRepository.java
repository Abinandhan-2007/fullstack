package com.example.demo.repository;

import com.example.demo.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findAllByOrderBySubmittedAtDesc(); // Newest first
}