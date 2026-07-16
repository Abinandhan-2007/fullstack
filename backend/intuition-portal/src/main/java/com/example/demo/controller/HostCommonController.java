package com.example.demo.controller;

import com.example.demo.model.Session;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/host")
public class HostCommonController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @GetMapping("/all-students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @GetMapping("/all-staff")
    public ResponseEntity<?> getAllStaff() {
        return ResponseEntity.ok(staffRepository.findAll());
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @GetMapping("/all-departments")
    public ResponseEntity<?> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @GetMapping("/all-courses")
    public ResponseEntity<?> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @GetMapping("/timetable")
    public ResponseEntity<?> getTimetable() {
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @PostMapping("/timetable")
    public ResponseEntity<?> addTimetable(@RequestBody Session session) {
        try {
            return ResponseEntity.ok(sessionRepository.save(session));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @DeleteMapping("/timetable/{id}")
    public ResponseEntity<?> deleteTimetable(@PathVariable Long id) {
        try {
            sessionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
