package com.example.demo.dto;

public class StudentLeaveRequestDTO {
    private Long id;
    private String registerNumber;
    private String leaveType;
    private String fromDate;
    private String toDate;
    private Integer days;
    private String reason;
    private String status;
    private String appliedOn;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
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
