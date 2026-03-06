package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.model.SubjectMark;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.SubjectMarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/academic")
@CrossOrigin(origins = "*") 
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectMarkRepository subjectMarkRepository;

    // Existing endpoint for dashboard
    @GetMapping("/{rollNo}")
    public Student getStudentAcademicData(@PathVariable String rollNo) {
        return studentRepository.findById(rollNo).orElse(null);
    }

    // NEW ENDPOINT: Fetch specific semester detailed marks
    @GetMapping("/{rollNo}/semester/{semesterName}")
    public List<SubjectMark> getSemesterDetails(@PathVariable String rollNo, @PathVariable String semesterName) {
        return subjectMarkRepository.findByRollNoAndSemesterName(rollNo, semesterName);
    }
}