package com.example.demo.controller;

import com.example.demo.dto.BookIssueDTO;
import com.example.demo.service.LibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    @Autowired
    private LibraryService libraryService;

    @GetMapping("/student/{regNo}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<BookIssueDTO>> getStudentLibraryRecords(@PathVariable String regNo) {
        List<BookIssueDTO> records = libraryService.getIssuedBooks(regNo);
        return ResponseEntity.ok(records);
    }
}
