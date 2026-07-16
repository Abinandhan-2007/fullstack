package com.example.demo.controller;

import com.example.demo.service.MarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
public class MarkController {
    @Autowired
    private MarkService markService;

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN', 'COE')")
    @PostMapping({"/api/marks/upload", "/api/staff/marks/bulk"})
    public ResponseEntity<?> uploadMarksBulk(@RequestBody List<Map<String, Object>> entries) {
        try {
            markService.uploadMarksBulk(entries);
            return ResponseEntity.ok("Marks uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN', 'PARENT', 'COE')")
    @GetMapping("/api/marks/student/{regNo}")
    public ResponseEntity<?> getMarksByStudent(@PathVariable String regNo) {
        try {
            return ResponseEntity.ok(markService.getMarksByStudent(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/api/marks/staff/{staffId}/recent")
    public ResponseEntity<?> getRecentByStaff(@PathVariable String staffId) {
        try {
            return ResponseEntity.ok(markService.getRecentByStaff(staffId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'COE')")
    @GetMapping("/api/admin/marks")
    public ResponseEntity<?> getAllMarks() {
        return ResponseEntity.ok("All Marks");
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'COE')")
    @GetMapping("/api/admin/performance/top")
    public ResponseEntity<?> getTopPerformers() {
        return ResponseEntity.ok("Top Performers");
    }
}
