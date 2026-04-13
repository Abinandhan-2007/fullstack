package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "placementapplications")
public class PlacementApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long driveId;
    private String companyName;
    private String studentName;
    private String registerNumber;
    private String department;
    private Double cgpa;
    private String round;
    private String status;
    private String appliedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public String getRound() { return round; }
    public void setRound(String round) { this.round = round; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAppliedAt() { return appliedAt; }
    public void setAppliedAt(String appliedAt) { this.appliedAt = appliedAt; }
}
