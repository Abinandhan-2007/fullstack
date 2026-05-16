package com.example.demo.controller;

import com.example.demo.dto.SeatingDTO;
import com.example.demo.service.SeatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class SeatingController {
    @Autowired
    private SeatingService seatingService;

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @GetMapping("/api/admin/seating/{examId}")
    public ResponseEntity<?> getSeating(@PathVariable Long examId) {
        try {
            return ResponseEntity.ok(seatingService.getSeatingByExam(examId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PostMapping("/api/admin/seating/generate")
    public ResponseEntity<?> generateSeating(@RequestParam Long examId) {
        try {
            return ResponseEntity.ok(seatingService.generateSeating(examId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PutMapping("/api/admin/seating/{id}")
    public ResponseEntity<?> updateSeat(@PathVariable Long id, @RequestBody SeatingDTO dto) {
        try {
            seatingService.updateSeat(id, dto);
            return ResponseEntity.ok("Seat updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
