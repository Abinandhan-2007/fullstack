package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class PlacementApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private String appliedOn;
    private String status;
    private String packageOffered;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public String getAppliedOn() { return appliedOn; }
    public void setAppliedOn(String appliedOn) { this.appliedOn = appliedOn; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPackageOffered() { return packageOffered; }
    public void setPackageOffered(String packageOffered) { this.packageOffered = packageOffered; }
}
