package com.example.demo.controller;

import com.example.demo.dto.AttendanceMarkRequestDTO;
import com.example.demo.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PostMapping("/api/attendance/mark")
    public ResponseEntity<?> markAttendance(@RequestBody List<AttendanceMarkRequestDTO> entries) {
        try {
            attendanceService.markAttendance(entries);
            return ResponseEntity.ok("Attendance marked");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'PARENT')")
    @GetMapping("/api/attendance/student/{regNo}")
    public ResponseEntity<?> getAttendanceByStudent(@PathVariable String regNo) {
        try {
            return ResponseEntity.ok(attendanceService.getAttendanceByStudent(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/attendance")
    public ResponseEntity<?> getAllAttendance() {
        return ResponseEntity.ok("All Attendance");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/attendance/defaulters")
    public ResponseEntity<?> getDefaulters() {
        return ResponseEntity.ok("Defaulters");
    }
}
