package com.example.demo.repository;

import com.example.demo.model.SeatingArrangement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatingArrangementRepository extends JpaRepository<SeatingArrangement, Long> {
    List<SeatingArrangement> findByExam_Id(Long examId);
}
