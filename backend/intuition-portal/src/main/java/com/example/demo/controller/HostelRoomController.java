package com.example.demo.controller;

import com.example.demo.model.HostelRoom;
import com.example.demo.service.HostelRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class HostelRoomController {
    @Autowired
    private HostelRoomService service;

    @GetMapping("/all-hostelrooms")
    public ResponseEntity<List<HostelRoom>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-hostelroom")
    public ResponseEntity<HostelRoom> create(@RequestBody HostelRoom item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-hostelroom/{id}")
    public ResponseEntity<HostelRoom> update(@PathVariable Long id, @RequestBody HostelRoom item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-hostelroom/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
