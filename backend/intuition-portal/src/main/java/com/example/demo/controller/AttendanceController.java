package com.example.demo.controller;

import com.example.demo.dto.AttendanceDTO;
import com.example.demo.model.Attendance;
import com.example.demo.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping("/student/{registerNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<AttendanceDTO>> getStudentAttendance(@PathVariable String registerNumber) {
        List<Attendance> attendances = attendanceRepository.findByStudent_RegisterNumber(registerNumber);
        
        List<AttendanceDTO> dtos = attendances.stream().map(a -> {
            AttendanceDTO dto = new AttendanceDTO();
            dto.setId(a.getId());
            dto.setStudentRegisterNumber(a.getStudent().getRegisterNumber());
            dto.setCourseCode(a.getCourse().getSubjectCode());
            dto.setDate(a.getDate());
            dto.setPresent(a.isPresent());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // Example POST endpoint for Staff to mark attendance
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<String> markAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        // In a real app, you'd fetch the Student and Course entities here and save the Attendance entity.
        // For now, this is the structured endpoint layout.
        return ResponseEntity.ok("Attendance marked successfully");
    }
}
