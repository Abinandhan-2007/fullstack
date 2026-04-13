package com.example.demo.controller;

import com.example.demo.model.HostelAllocation;
import com.example.demo.service.HostelAllocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class HostelAllocationController {
    @Autowired
    private HostelAllocationService service;

    @GetMapping("/all-hostelallocations")
    public ResponseEntity<List<HostelAllocation>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-hostelallocation")
    public ResponseEntity<HostelAllocation> create(@RequestBody HostelAllocation item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-hostelallocation/{id}")
    public ResponseEntity<HostelAllocation> update(@PathVariable Long id, @RequestBody HostelAllocation item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-hostelallocation/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
