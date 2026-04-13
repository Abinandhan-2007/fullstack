package com.example.demo.controller;

import com.example.demo.model.ReEvaluationRequest;
import com.example.demo.service.ReEvaluationRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class ReEvaluationRequestController {
    @Autowired
    private ReEvaluationRequestService service;

    @GetMapping("/all-reevaluationrequests")
    public ResponseEntity<List<ReEvaluationRequest>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-reevaluationrequest")
    public ResponseEntity<ReEvaluationRequest> create(@RequestBody ReEvaluationRequest item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-reevaluationrequest/{id}")
    public ResponseEntity<ReEvaluationRequest> update(@PathVariable Long id, @RequestBody ReEvaluationRequest item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-reevaluationrequest/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
