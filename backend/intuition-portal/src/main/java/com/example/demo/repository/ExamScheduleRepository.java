package com.example.demo.repository;

import com.example.demo.model.ExamSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {
    List<ExamSchedule> findByDateAfter(String date);
}
