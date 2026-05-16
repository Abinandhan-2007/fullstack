package com.example.demo.controller;

import com.example.demo.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class ExamController {
    @Autowired
    private ExamService examService;

    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'COE', 'ADMIN', 'PARENT')")
    @GetMapping("/api/exam-schedule")
    public ResponseEntity<?> getExamSchedule() {
        try {
            return ResponseEntity.ok(examService.getAllExamSchedules());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PostMapping("/api/exam-schedule")
    public ResponseEntity<?> addExamSchedule() {
        return ResponseEntity.ok("Exam scheduled added");
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PutMapping("/api/exam-schedule/{id}")
    public ResponseEntity<?> updateExamSchedule(@PathVariable Long id) {
        return ResponseEntity.ok("Exam schedule updated");
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @DeleteMapping("/api/exam-schedule/{id}")
    public ResponseEntity<?> deleteExamSchedule(@PathVariable Long id) {
        return ResponseEntity.ok("Exam schedule deleted");
    }
}
