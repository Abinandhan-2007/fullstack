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
    
    private String password;
    private String role;
    private String year;
    private String semester;
    private String section;
    private String mentorName;
    private String bloodGroup;
    private String phone;
    private String status;
    private String batchYear;

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
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public String getMentorName() { return mentorName; }
    public void setMentorName(String mentorName) { this.mentorName = mentorName; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBatchYear() { return batchYear; }
    public void setBatchYear(String batchYear) { this.batchYear = batchYear; }
}