package com.example.demo.controller;

import com.example.demo.model.FeeStructure;
import com.example.demo.service.FeeStructureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class FeeStructureController {
    @Autowired
    private FeeStructureService service;

    @GetMapping("/all-feestructures")
    public ResponseEntity<List<FeeStructure>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-feestructure")
    public ResponseEntity<FeeStructure> create(@RequestBody FeeStructure item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-feestructure/{id}")
    public ResponseEntity<FeeStructure> update(@PathVariable Long id, @RequestBody FeeStructure item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-feestructure/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
