package com.example.demo.controller;

import com.example.demo.model.PlacementApplication;
import com.example.demo.service.PlacementApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class PlacementApplicationController {
    @Autowired
    private PlacementApplicationService service;

    @GetMapping("/all-placementapplications")
    public ResponseEntity<List<PlacementApplication>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-placementapplication")
    public ResponseEntity<PlacementApplication> create(@RequestBody PlacementApplication item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-placementapplication/{id}")
    public ResponseEntity<PlacementApplication> update(@PathVariable Long id, @RequestBody PlacementApplication item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-placementapplication/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
