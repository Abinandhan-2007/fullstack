package com.example.demo.controller;

import com.example.demo.dto.StudentLeaveRequestDTO;
import com.example.demo.service.StudentLeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave/student")
@CrossOrigin(origins = "*") // Adjust according to your existing CORS config
public class StudentLeaveController {

    @Autowired
    private StudentLeaveService leaveService;

    @PostMapping("/apply")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<StudentLeaveRequestDTO> applyLeave(@RequestBody StudentLeaveRequestDTO dto) {
        StudentLeaveRequestDTO savedLeave = leaveService.applyLeave(dto);
        return ResponseEntity.ok(savedLeave);
    }

    @GetMapping("/{regNo}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<StudentLeaveRequestDTO>> getLeavesByStudent(@PathVariable String regNo) {
        List<StudentLeaveRequestDTO> leaves = leaveService.getLeavesByStudent(regNo);
        return ResponseEntity.ok(leaves);
    }
}
