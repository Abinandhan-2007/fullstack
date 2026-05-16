package com.example.demo.repository;

import com.example.demo.model.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarkRepository extends JpaRepository<Mark, Long> {
    // We will need this later to load a specific student's report card!
    List<Mark> findByStudent_RegisterNumber(String registerNumber);
}