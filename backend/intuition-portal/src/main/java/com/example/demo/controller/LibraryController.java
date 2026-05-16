package com.example.demo.controller;

import com.example.demo.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class LibraryController {
    @Autowired
    private LibraryService libraryService;

    @PreAuthorize("hasAnyRole('STUDENT', 'LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/student/{regNo}")
    public ResponseEntity<?> getIssuedBooks(@PathVariable String regNo) {
        try {
            return ResponseEntity.ok(libraryService.getIssuedBooks(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/books")
    public ResponseEntity<?> getBooks() {
        return ResponseEntity.ok("Books");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/books")
    public ResponseEntity<?> addBook() {
        return ResponseEntity.ok("Book added");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PutMapping("/api/library/books/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id) {
        return ResponseEntity.ok("Book updated");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @DeleteMapping("/api/library/books/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        return ResponseEntity.ok("Book deleted");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/issues")
    public ResponseEntity<?> getIssues() {
        return ResponseEntity.ok("Issues");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/issue")
    public ResponseEntity<?> issueBook() {
        return ResponseEntity.ok("Book issued");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/return")
    public ResponseEntity<?> returnBook() {
        return ResponseEntity.ok("Book returned");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/overdue")
    public ResponseEntity<?> getOverdue() {
        return ResponseEntity.ok("Overdue");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/reminder/{issueId}")
    public ResponseEntity<?> sendReminder(@PathVariable Long issueId) {
        return ResponseEntity.ok("Reminder sent");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok("Stats");
    }
}
