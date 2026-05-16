package com.example.demo.service;

import com.example.demo.dto.BookIssueDTO;
import com.example.demo.model.LibraryIssue;
import com.example.demo.repository.LibraryIssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LibraryService {
    @Autowired
    private LibraryIssueRepository libraryIssueRepository;

    public Map<String, List<BookIssueDTO>> getIssuedBooks(String regNo) {
        try {
            List<LibraryIssue> allIssues = libraryIssueRepository.findByStudent_RegisterNumber(regNo);
            List<BookIssueDTO> borrowed = allIssues.stream()
                .filter(i -> i.getReturnDate() == null)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
            List<BookIssueDTO> history = allIssues.stream()
                .filter(i -> i.getReturnDate() != null)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
            
            Map<String, List<BookIssueDTO>> response = new HashMap<>();
            response.put("borrowed", borrowed);
            response.put("history", history);
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching library records: " + e.getMessage());
        }
    }

    private BookIssueDTO mapToDTO(LibraryIssue issue) {
        BookIssueDTO dto = new BookIssueDTO();
        dto.setId(issue.getId());
        if(issue.getBook() != null) {
            dto.setBookTitle(issue.getBook().getTitle());
            dto.setAuthor(issue.getBook().getAuthor());
            dto.setIsbn(issue.getBook().getIsbn());
        }
        dto.setIssueDate(issue.getIssueDate());
        dto.setDueDate(issue.getDueDate());
        dto.setReturnDate(issue.getReturnDate());
        dto.setFinePaid(issue.getFinePaid());
        dto.setStatus(issue.getReturnDate() == null ? "ISSUED" : "RETURNED");
        return dto;
    }
}
