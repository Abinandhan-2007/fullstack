package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class LibraryIssue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private LibraryBook book;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private String issueDate;
    private String dueDate;
    private String returnDate;
    private Double finePaid;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LibraryBook getBook() { return book; }
    public void setBook(LibraryBook book) { this.book = book; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }
    public Double getFinePaid() { return finePaid; }
    public void setFinePaid(Double finePaid) { this.finePaid = finePaid; }
}
