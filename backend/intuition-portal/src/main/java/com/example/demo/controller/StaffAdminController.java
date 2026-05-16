package com.example.demo.controller;

import com.example.demo.service.StaffService;
import com.example.demo.service.AttendanceService;
import com.example.demo.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class StaffAdminController {
    @Autowired
    private StaffService staffService;
    @Autowired
    private AttendanceService attendanceService;
    @Autowired
    private LeaveService leaveService;

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @GetMapping("/api/staffadmin/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok("Staff Admin Dashboard Stats");
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @GetMapping("/api/staffadmin/attendance/{date}")
    public ResponseEntity<?> getStaffAttendanceByDate(@PathVariable String date) {
        return ResponseEntity.ok("Staff Attendance for " + date);
    }
}
