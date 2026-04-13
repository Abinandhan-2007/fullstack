package com.example.demo.controller;

import com.example.demo.model.MessMenu;
import com.example.demo.service.MessMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class MessMenuController {
    @Autowired
    private MessMenuService service;

    @GetMapping("/all-messmenus")
    public ResponseEntity<List<MessMenu>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-messmenu")
    public ResponseEntity<MessMenu> create(@RequestBody MessMenu item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-messmenu/{id}")
    public ResponseEntity<MessMenu> update(@PathVariable Long id, @RequestBody MessMenu item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-messmenu/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
