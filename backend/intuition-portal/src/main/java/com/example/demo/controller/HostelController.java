package com.example.demo.controller;

import com.example.demo.service.HostelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class HostelController {
    @Autowired
    private HostelService hostelService;

    @PreAuthorize("hasAnyRole('STUDENT', 'HOSTEL', 'ADMIN')")
    @GetMapping("/api/hostel/student/{regNo}")
    public ResponseEntity<?> getHostelDetails(@PathVariable String regNo) {
        try {
            return ResponseEntity.ok(hostelService.getHostelDetails(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    @PostMapping("/api/hostel/complaints")
    public ResponseEntity<?> submitComplaint(@RequestParam String regNo, @RequestParam String description) {
        try {
            return ResponseEntity.ok(hostelService.submitComplaint(regNo, description));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'HOSTEL', 'ADMIN')")
    @GetMapping("/api/hostel/complaints/student/{regNo}")
    public ResponseEntity<?> getStudentComplaints(@PathVariable String regNo) {
        try {
            return ResponseEntity.ok(hostelService.getComplaints(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN')")
    @GetMapping("/api/hostel/rooms")
    public ResponseEntity<?> getRooms() {
        return ResponseEntity.ok("Rooms");
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN')")
    @PostMapping("/api/hostel/allocate")
    public ResponseEntity<?> allocate() {
        return ResponseEntity.ok("Allocated");
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN')")
    @PutMapping("/api/hostel/allocate/{id}")
    public ResponseEntity<?> updateAllocation(@PathVariable Long id) {
        return ResponseEntity.ok("Allocation updated");
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN')")
    @DeleteMapping("/api/hostel/allocate/{id}")
    public ResponseEntity<?> deallocate(@PathVariable Long id) {
        return ResponseEntity.ok("Deallocated");
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN')")
    @GetMapping("/api/hostel/complaints")
    public ResponseEntity<?> getAllComplaints() {
        return ResponseEntity.ok("All Complaints");
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN')")
    @PutMapping("/api/hostel/complaints/{id}")
    public ResponseEntity<?> updateComplaint(@PathVariable Long id) {
        return ResponseEntity.ok("Complaint updated");
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN', 'STUDENT')")
    @GetMapping("/api/hostel/mess-menu")
    public ResponseEntity<?> getMessMenu() {
        return ResponseEntity.ok("Mess Menu");
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN')")
    @PutMapping("/api/hostel/mess-menu")
    public ResponseEntity<?> updateMessMenu() {
        return ResponseEntity.ok("Mess Menu updated");
    }

    @PreAuthorize("hasAnyRole('HOSTEL', 'ADMIN')")
    @GetMapping("/api/hostel/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok("Hostel Stats");
    }
}
