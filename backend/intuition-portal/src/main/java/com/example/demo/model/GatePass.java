package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "gatepasss")
public class GatePass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String studentName;
    private String registerNumber;
    private String roomNumber;
    private String destination;
    private String reason;
    private String outDateTime;
    private String expectedReturn;
    private String actualReturn;
    private String approvedBy;
    private String status;
    private String appliedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getOutDateTime() { return outDateTime; }
    public void setOutDateTime(String outDateTime) { this.outDateTime = outDateTime; }
    public String getExpectedReturn() { return expectedReturn; }
    public void setExpectedReturn(String expectedReturn) { this.expectedReturn = expectedReturn; }
    public String getActualReturn() { return actualReturn; }
    public void setActualReturn(String actualReturn) { this.actualReturn = actualReturn; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getAppliedAt() { return appliedAt; }
    public void setAppliedAt(String appliedAt) { this.appliedAt = appliedAt; }
}
