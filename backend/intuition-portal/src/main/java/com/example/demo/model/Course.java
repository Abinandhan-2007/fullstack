package com.example.demo.model; // Or package com.example.demo.course; if using the structure above

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Add this under your other fields
    @Column(nullable = false)
    private String department = "Unassigned";

    // Add these at the bottom
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    @Column(nullable = false)
    private String subjectName;
    
    @Column(nullable = false, unique = true)
    private String subjectCode;
    
    @Column(nullable = false)
    private int credits;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }
}