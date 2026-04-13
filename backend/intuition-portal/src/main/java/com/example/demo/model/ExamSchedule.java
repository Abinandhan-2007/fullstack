package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "examschedules")
public class ExamSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subjectName;
    private String subjectCode;
    private String department;
    private String batch;
    private String examDate;
    private String examTime;
    private String hallNumber;
    private String duration;
    private String createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
    public String getExamDate() { return examDate; }
    public void setExamDate(String examDate) { this.examDate = examDate; }
    public String getExamTime() { return examTime; }
    public void setExamTime(String examTime) { this.examTime = examTime; }
    public String getHallNumber() { return hallNumber; }
    public void setHallNumber(String hallNumber) { this.hallNumber = hallNumber; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
