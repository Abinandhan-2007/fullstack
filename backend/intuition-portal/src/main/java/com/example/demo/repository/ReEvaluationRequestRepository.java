package com.example.demo.repository;

import com.example.demo.model.ReEvaluationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReEvaluationRequestRepository extends JpaRepository<ReEvaluationRequest, Long> {
}
