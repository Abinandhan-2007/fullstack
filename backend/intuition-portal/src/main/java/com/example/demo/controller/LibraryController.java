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
        return ResponseEntity.ok(libraryService.getAllBooks());
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/books")
    public ResponseEntity<?> addBook(@RequestBody com.example.demo.model.LibraryBook book) {
        try {
            return ResponseEntity.ok(libraryService.addBook(book));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PutMapping("/api/library/books/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Long id, @RequestBody com.example.demo.model.LibraryBook details) {
        try {
            return ResponseEntity.ok(libraryService.updateBook(id, details));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @DeleteMapping("/api/library/books/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            libraryService.deleteBook(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/issues")
    public ResponseEntity<?> getIssues() {
        return ResponseEntity.ok(libraryService.getAllIssues());
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/recent-transactions")
    public ResponseEntity<?> getRecentTransactions() {
        try {
            java.util.List<com.example.demo.model.LibraryIssue> issues = libraryService.getAllIssues();
            int size = issues.size();
            java.util.List<java.util.Map<String, Object>> txns = new java.util.ArrayList<>();
            for (int i = Math.max(0, size - 20); i < size; i++) {
                com.example.demo.model.LibraryIssue issue = issues.get(i);
                java.util.Map<String, Object> txn = new java.util.HashMap<>();
                txn.put("id", issue.getId());
                txn.put("studentName", issue.getStudent() != null ? issue.getStudent().getName() : "Unknown");
                txn.put("studentId", issue.getStudent() != null ? issue.getStudent().getRegisterNumber() : "");
                txn.put("bookTitle", issue.getBook() != null ? issue.getBook().getTitle() : "Unknown");
                txn.put("type", issue.getReturnDate() == null ? "ISSUE" : "RETURN");
                txns.add(0, txn);
            }
            return ResponseEntity.ok(txns);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/issue")
    public ResponseEntity<?> issueBook(@RequestBody java.util.Map<String, String> body) {
        try {
            String regNo = body.get("studentRegNo");
            String isbn = body.get("bookIsbn");
            return ResponseEntity.ok(libraryService.issueBook(regNo, isbn));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/return")
    public ResponseEntity<?> returnBook(@RequestBody java.util.Map<String, String> body) {
        try {
            String isbn = body.get("isbn");
            libraryService.returnBook(isbn);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/overdue")
    public ResponseEntity<?> getOverdue() {
        return ResponseEntity.ok(libraryService.getOverdueIssues());
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/overdue/{id}/clear")
    public ResponseEntity<?> clearFine(@PathVariable Long id) {
        try {
            libraryService.clearFine(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/overdue/{id}/notify")
    public ResponseEntity<?> notifyOverdue(@PathVariable Long id) {
        // Mock overdue notification trigger
        System.out.println("Triggered overdue reminder notification for library issue ID: " + id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/reminder/{issueId}")
    public ResponseEntity<?> sendReminder(@PathVariable Long issueId) {
        System.out.println("Triggered reminder for issue ID: " + issueId);
        return ResponseEntity.ok("Reminder sent");
    }

    @PreAuthorize("hasAnyRole('LIBRARY', 'ADMIN')")
    @GetMapping("/api/library/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(libraryService.getLibraryStats());
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'LIBRARY', 'ADMIN')")
    @PostMapping("/api/library/issue/{id}/renew")
    public ResponseEntity<?> renewBook(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(libraryService.renewBook(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
