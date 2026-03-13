package com.example.demo.repository;

import com.example.demo.model.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarkRepository extends JpaRepository<Mark, Long> {
    List<Mark> findByRegisterNumber(String registerNumber);
}