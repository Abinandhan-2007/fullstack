package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "halltickets")
public class HallTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String studentName;
    private String registerNumber;
    private String department;
    private String batch;
    private Long examScheduleId;
    private String seatNumber;
    private Boolean isGenerated;
    private String generatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
    public Long getExamScheduleId() { return examScheduleId; }
    public void setExamScheduleId(Long examScheduleId) { this.examScheduleId = examScheduleId; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public Boolean getIsGenerated() { return isGenerated; }
    public void setIsGenerated(Boolean isGenerated) { this.isGenerated = isGenerated; }
    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }
}
