package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String registerNumber; // Links to the Student

    @Column(nullable = false)
    private String subjectCode; // Links to the Course

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private boolean isPresent;

    // Standard Getters and Setters here...
}