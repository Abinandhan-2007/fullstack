package com.example.demo.service;

import com.example.demo.model.BookIssue;
import com.example.demo.repository.BookIssueRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookIssueService {
    @Autowired
    private BookIssueRepository repository;

    public List<BookIssue> getAll() { return repository.findAll(); }
    public BookIssue getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("BookIssue not found")); }
    public BookIssue create(BookIssue item) { return repository.save(item); }
    public BookIssue update(Long id, BookIssue item) {
        BookIssue existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
