package com.example.demo.controller;

import com.example.demo.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class TimetableController {
    @Autowired
    private TimetableService timetableService;

    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN')")
    @GetMapping("/api/timetable")
    public ResponseEntity<?> getTimetable() {
        try {
            return ResponseEntity.ok(timetableService.getFullTimetable());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/api/timetable/staff/{staffId}")
    public ResponseEntity<?> getStaffTimetable(@PathVariable Long staffId) {
        try {
            return ResponseEntity.ok(timetableService.getTimetableByStaff(staffId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/admin/timetable")
    public ResponseEntity<?> addTimetable() {
        return ResponseEntity.ok("Added timetable");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/api/admin/timetable/{id}")
    public ResponseEntity<?> updateTimetable(@PathVariable Long id) {
        return ResponseEntity.ok("Updated timetable");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/api/admin/timetable/{id}")
    public ResponseEntity<?> deleteTimetable(@PathVariable Long id) {
        return ResponseEntity.ok("Deleted timetable");
    }
}
