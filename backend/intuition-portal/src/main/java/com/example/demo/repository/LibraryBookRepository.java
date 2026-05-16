package com.example.demo.repository;

import com.example.demo.model.LibraryBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LibraryBookRepository extends JpaRepository<LibraryBook, Long> {
}
