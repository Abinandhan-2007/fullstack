package com.example.demo.controller;

import com.example.demo.model.Book;
import com.example.demo.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/host")
public class BookController {
    @Autowired
    private BookService service;

    @GetMapping("/all-books")
    public ResponseEntity<List<Book>> getAll() { return ResponseEntity.ok(service.getAll()); }

    @PostMapping("/add-book")
    public ResponseEntity<Book> create(@RequestBody Book item) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(item)); }

    @PutMapping("/update-book/{id}")
    public ResponseEntity<Book> update(@PathVariable Long id, @RequestBody Book item) { return ResponseEntity.ok(service.update(id, item)); }

    @DeleteMapping("/delete-book/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.ok().build(); }
}
