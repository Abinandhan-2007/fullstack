package com.example.demo.service;

import com.example.demo.dto.BookIssueDTO;
import com.example.demo.model.Book;
import com.example.demo.model.BookIssue;
import com.example.demo.repository.BookIssueRepository;
import com.example.demo.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LibraryService {

    @Autowired
    private BookIssueRepository bookIssueRepository;

    @Autowired
    private BookRepository bookRepository;

    public List<BookIssueDTO> getIssuedBooks(String registerNumber) {
        List<BookIssue> issues = bookIssueRepository.findByRegisterNumber(registerNumber);

        return issues.stream().map(issue -> {
            BookIssueDTO dto = new BookIssueDTO();
            dto.setId(issue.getId());
            dto.setBookTitle(issue.getBookTitle());
            dto.setIssueDate(issue.getIssueDate());
            dto.setDueDate(issue.getDueDate());
            dto.setReturnDate(issue.getReturnDate());
            dto.setFinePaid(issue.getFine());

            // Fetch Author from Book entity if bookId is present
            if (issue.getBookId() != null) {
                bookRepository.findById(issue.getBookId()).ifPresent(book -> {
                    dto.setAuthor(book.getAuthor());
                });
            } else {
                dto.setAuthor("Unknown Author");
            }

            return dto;
        }).collect(Collectors.toList());
    }
}
