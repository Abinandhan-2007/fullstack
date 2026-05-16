package com.example.demo.repository;

import com.example.demo.model.HallTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HallTicketRepository extends JpaRepository<HallTicket, Long> {
    List<HallTicket> findByExam_Id(Long examId);
}
