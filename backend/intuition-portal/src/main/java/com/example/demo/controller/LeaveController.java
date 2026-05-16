package com.example.demo.controller;

import com.example.demo.dto.LeaveRequestDTO;
import com.example.demo.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class LeaveController {
    @Autowired
    private LeaveService leaveService;

    @PreAuthorize("hasRole('STAFF')")
    @PostMapping("/api/leave/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequestDTO dto) {
        try {
            return ResponseEntity.ok(leaveService.applyStaffLeave(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFF', 'STAFFADMIN', 'ADMIN')")
    @GetMapping("/api/leave/staff/{staffId}")
    public ResponseEntity<?> getLeavesByStaff(@PathVariable String staffId) {
        try {
            return ResponseEntity.ok(leaveService.getLeavesByStaff(staffId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @GetMapping("/api/staffadmin/leave-requests")
    public ResponseEntity<?> getPendingRequests() {
        try {
            return ResponseEntity.ok(leaveService.getAllPendingLeaves());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @PutMapping("/api/staffadmin/leave-requests/{id}/approve")
    public ResponseEntity<?> approveLeave(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(leaveService.approveLeave(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFFADMIN', 'ADMIN')")
    @PutMapping("/api/staffadmin/leave-requests/{id}/reject")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id, @RequestParam String reason) {
        try {
            return ResponseEntity.ok(leaveService.rejectLeave(id, reason));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
