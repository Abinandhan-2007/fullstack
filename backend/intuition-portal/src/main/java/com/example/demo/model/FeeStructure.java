package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class FeeStructure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String feeType;
    private String department;
    private String year;
    private Double amount;
    private String dueDate;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFeeType() { return feeType; }
    public void setFeeType(String feeType) { this.feeType = feeType; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
