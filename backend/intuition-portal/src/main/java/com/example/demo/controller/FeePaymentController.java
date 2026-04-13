package com.example.demo.controller;

import com.example.demo.model.FeePayment;
import com.example.demo.service.FeePaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class FeePaymentController {
    @Autowired
    private FeePaymentService service;

    @GetMapping("/all-feepayments")
    public ResponseEntity<List<FeePayment>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-feepayment")
    public ResponseEntity<FeePayment> create(@RequestBody FeePayment item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-feepayment/{id}")
    public ResponseEntity<FeePayment> update(@PathVariable Long id, @RequestBody FeePayment item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-feepayment/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
