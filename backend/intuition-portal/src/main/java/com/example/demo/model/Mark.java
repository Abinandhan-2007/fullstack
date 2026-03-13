package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marks")
public class Mark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String registerNumber;

    @Column(nullable = false)
    private String subjectCode;

    @Column(nullable = false)
    private String examType; // e.g., "Internal 1", "Semester"

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int maxScore;

    // Standard Getters and Setters...
}