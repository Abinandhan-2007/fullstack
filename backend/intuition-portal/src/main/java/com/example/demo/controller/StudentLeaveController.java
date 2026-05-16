package com.example.demo.controller;

import com.example.demo.dto.StudentLeaveRequestDTO;
import com.example.demo.service.StudentLeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class StudentLeaveController {
    @Autowired
    private StudentLeaveService leaveService;

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/api/leave/student/apply")
    public ResponseEntity<?> applyLeave(@RequestBody StudentLeaveRequestDTO dto) {
        try {
            return ResponseEntity.ok(leaveService.applyLeave(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'STAFFADMIN', 'ADMIN', 'PARENT')")
    @GetMapping("/api/leave/student/{regNo}")
    public ResponseEntity<?> getLeaves(@PathVariable String regNo) {
        try {
            return ResponseEntity.ok(leaveService.getLeavesByStudent(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
