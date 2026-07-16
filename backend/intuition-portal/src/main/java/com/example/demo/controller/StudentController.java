package com.example.demo.controller;

import com.example.demo.dto.StudentProfileDTO;
import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class StudentController {
    @Autowired
    private StudentService studentService;

    @PreAuthorize("hasAnyRole('STUDENT', 'PARENT', 'ADMIN')")
    @GetMapping("/api/students/profile/{identifier}")
    public ResponseEntity<?> getProfile(@PathVariable String identifier) {
        try {
            if (identifier.contains("@")) {
                return ResponseEntity.ok(studentService.getProfileByEmail(identifier));
            } else {
                return ResponseEntity.ok(studentService.getProfileByRegisterNumber(identifier));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/api/students/by-subject/{code}")
    public ResponseEntity<?> getStudentsBySubject(@PathVariable String code) {
        // Dummy endpoint, typically would return a List
        return ResponseEntity.ok("Fetch students by subject");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok("All students");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/admin/students")
    public ResponseEntity<?> addStudent() {
        return ResponseEntity.ok("Student added");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/api/admin/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id) {
        return ResponseEntity.ok("Student updated");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/api/admin/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        return ResponseEntity.ok("Student deleted");
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PutMapping("/api/students/profile/{regNo}")
    public ResponseEntity<?> updateStudentProfile(@PathVariable String regNo, @RequestBody java.util.Map<String, String> body) {
        try {
            return ResponseEntity.ok(studentService.updateProfile(regNo, body));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
