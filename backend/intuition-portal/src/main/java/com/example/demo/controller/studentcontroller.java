package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Student;
import com.example.demo.model.SubjectMark;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.SubjectMarkRepository;

@RestController
@RequestMapping("/api/academic")
@CrossOrigin(origins = "*") 
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectMarkRepository subjectMarkRepository;

    // Student View: Get one record
    @GetMapping("/{rollNo}")
    public Student getStudentAcademicData(@PathVariable String rollNo) {
        return studentRepository.findById(rollNo).orElse(null);
    }

    // Student View: Get semester marks
    @GetMapping("/{rollNo}/semester/{semesterName}")
    public List<SubjectMark> getSemesterDetails(@PathVariable String rollNo, @PathVariable String semesterName) {
        return subjectMarkRepository.findByRollNoAndSemesterName(rollNo, semesterName);
    }

    // Host View: Get all records
    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Host Action: Add/Update Student
    @PostMapping("/add")
    public Student addOrUpdateStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    // Host Action: Delete Student
    @DeleteMapping("/delete/{rollNo}")
    public void deleteStudent(@PathVariable String rollNo) {
        studentRepository.deleteById(rollNo);
    }
}