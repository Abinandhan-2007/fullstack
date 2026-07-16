package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/coe")
public class COEController {

    @Autowired
    private ExamScheduleService examScheduleService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private MarkService markService;

    private boolean hallTicketsReleased = false;
    private final Map<String, Object> coeSettings = new HashMap<>();

    public COEController() {
        coeSettings.put("examCycle", "May-June 2026");
        coeSettings.put("registrationDeadline", "2026-05-10");
        coeSettings.put("minAttendance", 75);
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN', 'STUDENT')")
    @GetMapping("/exams")
    public ResponseEntity<?> getExams() {
        return ResponseEntity.ok(examScheduleService.getAll());
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PostMapping("/exams")
    public ResponseEntity<?> createExam(@RequestBody ExamSchedule exam) {
        try {
            if (exam.getSubject() != null && exam.getSubject().getId() != null) {
                Course course = courseRepository.findById(exam.getSubject().getId()).orElse(null);
                exam.setSubject(course);
            }
            return ResponseEntity.ok(examScheduleService.create(exam));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PutMapping("/exams/{id}")
    public ResponseEntity<?> updateExam(@PathVariable Long id, @RequestBody ExamSchedule exam) {
        try {
            if (exam.getSubject() != null && exam.getSubject().getId() != null) {
                Course course = courseRepository.findById(exam.getSubject().getId()).orElse(null);
                exam.setSubject(course);
            }
            return ResponseEntity.ok(examScheduleService.update(id, exam));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @DeleteMapping("/exams/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        try {
            examScheduleService.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @GetMapping("/hall-tickets")
    public ResponseEntity<?> getHallTickets() {
        List<Student> students = studentRepository.findAll();
        List<Map<String, Object>> res = new ArrayList<>();
        for (Student s : students) {
            Map<String, Object> map = new HashMap<>();
            Map<String, Object> stud = new HashMap<>();
            stud.put("name", s.getName());
            stud.put("regNo", s.getRegisterNumber());
            Map<String, String> dept = new HashMap<>();
            dept.put("shortForm", s.getDepartment());
            stud.put("department", dept);
            map.put("student", stud);
            map.put("status", hallTicketsReleased ? "RELEASED" : (s.getId() % 5 == 0 ? "PENDING" : "RELEASED"));
            res.add(map);
        }
        return ResponseEntity.ok(res);
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PostMapping("/hall-tickets/release-all")
    public ResponseEntity<?> releaseAllHallTickets() {
        hallTicketsReleased = true;
        return ResponseEntity.ok("Released successfully");
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @GetMapping("/seating")
    public ResponseEntity<?> getSeating() {
        List<Student> students = studentRepository.findAll();
        List<Map<String, Object>> seating = new ArrayList<>();
        for (int i = 0; i < students.size(); i++) {
            Student s = students.get(i);
            Map<String, Object> seat = new HashMap<>();
            seat.put("roomNumber", "10" + ((i / 15) + 1));
            seat.put("seatNumber", "Seat " + ((i % 15) + 1));
            Map<String, Object> stud = new HashMap<>();
            stud.put("regNo", s.getRegisterNumber());
            Map<String, String> dept = new HashMap<>();
            dept.put("shortForm", s.getDepartment());
            stud.put("department", dept);
            seat.put("student", stud);
            seating.add(seat);
        }
        return ResponseEntity.ok(seating);
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @GetMapping("/results")
    public ResponseEntity<?> getResults() {
        List<Map<String, Object>> resList = new ArrayList<>();
        List<Student> students = studentRepository.findAll();
        for (Student s : students) {
            Map<String, Object> res = new HashMap<>();
            res.put("studentName", s.getName());
            res.put("studentRegNo", s.getRegisterNumber());
            res.put("department", s.getDepartment());
            res.put("status", s.getId() % 10 == 0 ? "WITHHELD" : "PUBLISHED");
            resList.add(res);
        }
        return ResponseEntity.ok(resList);
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PostMapping("/results/toggle-publish")
    public ResponseEntity<?> togglePublish(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok("Toggled publish status");
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @GetMapping("/settings")
    public ResponseEntity<?> getSettings() {
        return ResponseEntity.ok(coeSettings);
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, Object> body) {
        coeSettings.putAll(body);
        return ResponseEntity.ok(coeSettings);
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @GetMapping("/reports/student/{regNo}")
    public ResponseEntity<?> getStudentReport(@PathVariable String regNo) {
        try {
            return ResponseEntity.ok(markService.getMarksByStudent(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
