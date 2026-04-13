package com.example.demo.controller;

import com.example.demo.model.ExamSchedule;
import com.example.demo.service.ExamScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class ExamScheduleController {
    @Autowired
    private ExamScheduleService service;

    @GetMapping("/all-examschedules")
    public ResponseEntity<List<ExamSchedule>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-examschedule")
    public ResponseEntity<ExamSchedule> create(@RequestBody ExamSchedule item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-examschedule/{id}")
    public ResponseEntity<ExamSchedule> update(@PathVariable Long id, @RequestBody ExamSchedule item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-examschedule/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
