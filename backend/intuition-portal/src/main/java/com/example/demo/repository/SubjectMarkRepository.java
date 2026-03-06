package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.SubjectMark;

@Repository
public interface SubjectMarkRepository extends JpaRepository<SubjectMark, Integer> {
    
    // Explicitly telling Spring Boot exactly how to search the database
    @Query("SELECT s FROM SubjectMark s WHERE s.rollNo = :rollNo AND s.semesterName = :semesterName")
    List<SubjectMark> findByRollNoAndSemesterName(
        @Param("rollNo") String rollNo, 
        @Param("semesterName") String semesterName
    );
}