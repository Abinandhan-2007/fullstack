package com.example.demo.controller;

import com.example.demo.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class ResultController {
    @Autowired
    private ResultService resultService;

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @GetMapping("/api/results")
    public ResponseEntity<?> getResults(@RequestParam(required = false) String dept, 
                                        @RequestParam(required = false) String examType, 
                                        @RequestParam(required = false) String year) {
        try {
            return ResponseEntity.ok(resultService.getResults(dept, examType, year));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('COE', 'ADMIN')")
    @PostMapping("/api/results/publish")
    public ResponseEntity<?> publishResults(@RequestParam(required = false) String examType, 
                                            @RequestParam(required = false) String dept) {
        try {
            resultService.publishResults(examType, dept);
            return ResponseEntity.ok("Results published");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
