package com.example.demo.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String registerNumber;
    @Column(nullable = false)
    private String batch = "Unassigned";

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    // Getters and Setters
    @Column(nullable = false)
    private String department = "Unassigned";

    // Add these Getters and Setters at the bottom
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
}