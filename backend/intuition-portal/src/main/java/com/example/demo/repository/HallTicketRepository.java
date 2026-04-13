package com.example.demo.repository;

import com.example.demo.model.HallTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HallTicketRepository extends JpaRepository<HallTicket, Long> {
}
