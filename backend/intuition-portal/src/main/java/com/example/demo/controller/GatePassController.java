package com.example.demo.controller;

import com.example.demo.model.GatePass;
import com.example.demo.service.GatePassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class GatePassController {
    @Autowired
    private GatePassService service;

    @GetMapping("/all-gatepasss")
    public ResponseEntity<List<GatePass>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-gatepass")
    public ResponseEntity<GatePass> create(@RequestBody GatePass item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-gatepass/{id}")
    public ResponseEntity<GatePass> update(@PathVariable Long id, @RequestBody GatePass item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-gatepass/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
