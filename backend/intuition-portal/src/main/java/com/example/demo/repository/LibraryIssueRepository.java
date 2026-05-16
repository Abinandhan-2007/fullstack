package com.example.demo.repository;

import com.example.demo.model.LibraryIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LibraryIssueRepository extends JpaRepository<LibraryIssue, Long> {
    List<LibraryIssue> findByStudent_RegisterNumber(String registerNumber);
    List<LibraryIssue> findByReturnDateIsNull();
}
