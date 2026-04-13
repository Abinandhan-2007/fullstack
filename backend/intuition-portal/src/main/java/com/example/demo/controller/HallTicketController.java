package com.example.demo.controller;

import com.example.demo.model.HallTicket;
import com.example.demo.service.HallTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class HallTicketController {
    @Autowired
    private HallTicketService service;

    @GetMapping("/all-halltickets")
    public ResponseEntity<List<HallTicket>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-hallticket")
    public ResponseEntity<HallTicket> create(@RequestBody HallTicket item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-hallticket/{id}")
    public ResponseEntity<HallTicket> update(@PathVariable Long id, @RequestBody HallTicket item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-hallticket/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
