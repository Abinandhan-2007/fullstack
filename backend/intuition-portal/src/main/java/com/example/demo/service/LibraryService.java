package com.example.demo.service;

import com.example.demo.dto.BookIssueDTO;
import com.example.demo.model.LibraryBook;
import com.example.demo.model.LibraryIssue;
import com.example.demo.model.Student;
import com.example.demo.repository.LibraryBookRepository;
import com.example.demo.repository.LibraryIssueRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LibraryService {
    @Autowired
    private LibraryIssueRepository libraryIssueRepository;

    @Autowired
    private LibraryBookRepository libraryBookRepository;

    @Autowired
    private StudentRepository studentRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public List<BookIssueDTO> getIssuedBooks(String regNo) {
        try {
            return libraryIssueRepository.findByStudent_RegisterNumber(regNo).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching library records: " + e.getMessage());
        }
    }

    public List<LibraryBook> getAllBooks() {
        return libraryBookRepository.findAll();
    }

    public LibraryBook addBook(LibraryBook book) {
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        return libraryBookRepository.save(book);
    }

    public LibraryBook updateBook(Long id, LibraryBook details) {
        LibraryBook book = libraryBookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setTitle(details.getTitle());
        book.setAuthor(details.getAuthor());
        book.setIsbn(details.getIsbn());
        book.setCategory(details.getCategory());
        book.setTotalCopies(details.getTotalCopies());
        book.setAvailableCopies(details.getAvailableCopies());
        book.setLocation(details.getLocation());
        return libraryBookRepository.save(book);
    }

    public void deleteBook(Long id) {
        libraryBookRepository.deleteById(id);
    }

    public List<LibraryIssue> getAllIssues() {
        return libraryIssueRepository.findAll();
    }

    public LibraryIssue issueBook(String regNo, String isbn) {
        Student student = studentRepository.findByRegisterNumber(regNo)
            .orElseThrow(() -> new RuntimeException("Student not found with Register Number: " + regNo));
        LibraryBook book = libraryBookRepository.findByIsbn(isbn)
            .orElseThrow(() -> new RuntimeException("Book not found with ISBN: " + isbn));

        if (book.getAvailableCopies() != null && book.getAvailableCopies() <= 0) {
            throw new RuntimeException("No copies available for issue");
        }

        LibraryIssue issue = new LibraryIssue();
        issue.setStudent(student);
        issue.setBook(book);
        issue.setIssueDate(LocalDate.now().format(FORMATTER));
        issue.setDueDate(LocalDate.now().plusDays(14).format(FORMATTER));
        issue.setReturnDate(null);
        issue.setFinePaid(0.0);

        book.setAvailableCopies((book.getAvailableCopies() != null ? book.getAvailableCopies() : book.getTotalCopies()) - 1);
        libraryBookRepository.save(book);

        return libraryIssueRepository.save(issue);
    }

    public void returnBook(String isbn) {
        LibraryBook book = libraryBookRepository.findByIsbn(isbn)
            .orElseThrow(() -> new RuntimeException("Book not found with ISBN: " + isbn));

        List<LibraryIssue> activeIssues = libraryIssueRepository.findAll().stream()
            .filter(i -> i.getBook() != null && i.getBook().getId().equals(book.getId()) && i.getReturnDate() == null)
            .collect(Collectors.toList());

        if (activeIssues.isEmpty()) {
            throw new RuntimeException("No active issues found for ISBN: " + isbn);
        }

        LibraryIssue issue = activeIssues.get(0);
        issue.setReturnDate(LocalDate.now().format(FORMATTER));
        libraryIssueRepository.save(issue);

        book.setAvailableCopies((book.getAvailableCopies() != null ? book.getAvailableCopies() : 0) + 1);
        libraryBookRepository.save(book);
    }

    public List<LibraryIssue> getOverdueIssues() {
        String today = LocalDate.now().format(FORMATTER);
        return libraryIssueRepository.findAll().stream()
            .filter(i -> i.getReturnDate() == null && i.getDueDate() != null && i.getDueDate().compareTo(today) < 0)
            .collect(Collectors.toList());
    }

    public void clearFine(Long issueId) {
        LibraryIssue issue = libraryIssueRepository.findById(issueId)
            .orElseThrow(() -> new RuntimeException("Issue not found"));
        issue.setFinePaid(0.0);
        libraryIssueRepository.save(issue);
    }

    public Map<String, Object> getLibraryStats() {
        List<LibraryBook> books = libraryBookRepository.findAll();
        List<LibraryIssue> issues = libraryIssueRepository.findAll();
        long totalCopies = books.stream().mapToLong(b -> b.getTotalCopies() != null ? b.getTotalCopies() : 0).sum();
        long booksIssued = issues.stream().filter(i -> i.getReturnDate() == null).count();
        String today = LocalDate.now().format(FORMATTER);
        long overdueCount = issues.stream().filter(i -> i.getReturnDate() == null && i.getDueDate() != null && i.getDueDate().compareTo(today) < 0).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBooks", String.valueOf(totalCopies));
        stats.put("booksIssued", booksIssued);
        stats.put("overdueCount", overdueCount);
        stats.put("finesToday", "₹0");
        return stats;
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

    public LibraryIssue renewBook(Long id) {
        LibraryIssue issue = libraryIssueRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Issue record not found"));
        if (issue.getReturnDate() != null) {
            throw new RuntimeException("Cannot renew an already returned book");
        }
        LocalDate due = LocalDate.parse(issue.getDueDate(), FORMATTER);
        issue.setDueDate(due.plusDays(14).format(FORMATTER));
        return libraryIssueRepository.save(issue);
    }
}
