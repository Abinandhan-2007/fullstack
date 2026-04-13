package com.example.demo.controller;

import com.example.demo.model.StaffPayroll;
import com.example.demo.service.StaffPayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class StaffPayrollController {
    @Autowired
    private StaffPayrollService service;

    @GetMapping("/all-staffpayrolls")
    public ResponseEntity<List<StaffPayroll>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-staffpayroll")
    public ResponseEntity<StaffPayroll> create(@RequestBody StaffPayroll item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-staffpayroll/{id}")
    public ResponseEntity<StaffPayroll> update(@PathVariable Long id, @RequestBody StaffPayroll item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-staffpayroll/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
