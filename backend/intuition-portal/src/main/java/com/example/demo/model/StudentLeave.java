package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class StudentLeave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private String leaveType;
    private String fromDate;
    private String toDate;
    private Integer days;
    private String reason;
    private String status;
    private String appliedOn;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
    public String getFromDate() { return fromDate; }
    public void setFromDate(String fromDate) { this.fromDate = fromDate; }
    public String getToDate() { return toDate; }
    public void setToDate(String toDate) { this.toDate = toDate; }
    public Integer getDays() { return days; }
    public void setDays(Integer days) { this.days = days; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAppliedOn() { return appliedOn; }
    public void setAppliedOn(String appliedOn) { this.appliedOn = appliedOn; }
}
