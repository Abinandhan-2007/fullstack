package com.example.demo.service;

import com.example.demo.model.Book;
import com.example.demo.repository.BookRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository repository;

    public List<Book> getAll() { return repository.findAll(); }
    public Book getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("Book not found")); }
    public Book create(Book item) { return repository.save(item); }
    public Book update(Long id, Book item) {
        Book existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
