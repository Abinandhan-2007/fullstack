package com.example.demo.controller;

import com.example.demo.model.BookIssue;
import com.example.demo.service.BookIssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class BookIssueController {
    @Autowired
    private BookIssueService service;

    @GetMapping("/all-bookissues")
    public ResponseEntity<List<BookIssue>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-bookissue")
    public ResponseEntity<BookIssue> create(@RequestBody BookIssue item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-bookissue/{id}")
    public ResponseEntity<BookIssue> update(@PathVariable Long id, @RequestBody BookIssue item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-bookissue/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
