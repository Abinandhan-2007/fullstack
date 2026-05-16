package com.example.demo.controller;

import com.example.demo.service.HallTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class HallTicketController {
    @Autowired
    private HallTicketService hallTicketService;

    @PreAuthorize("hasAnyRole('COE', 'ADMIN', 'STUDENT')")
    @GetMapping("/api/hall-tickets")
    public ResponseEntity<?> getHallTickets(@RequestParam(required = false) String examId, 
                                            @RequestParam(required = false) String dept) {
        try {
            return ResponseEntity.ok(hallTicketService.getHallTickets(examId, dept));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PostMapping("/api/hall-tickets/release")
    public ResponseEntity<?> releaseHallTickets(@RequestParam(required = false) String examId, 
                                                @RequestParam(required = false) String dept) {
        try {
            hallTicketService.releaseHallTickets(examId, dept);
            return ResponseEntity.ok("Hall tickets released");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
