package com.example.demo.controller;

import com.example.demo.dto.ExamScheduleDTO;
import com.example.demo.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/exam-schedule")
public class ExamController {

    @Autowired
    private ExamService examService;

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<ExamScheduleDTO>> getAllExamSchedules() {
        List<ExamScheduleDTO> schedules = examService.getAllExamSchedules();
        return ResponseEntity.ok(schedules);
    }
}
