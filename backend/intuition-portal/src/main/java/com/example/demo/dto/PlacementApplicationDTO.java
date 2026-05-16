package com.example.demo.dto;

public class PlacementApplicationDTO {
    private Long id;
    private String registerNumber;
    private String studentName;
    private Long companyId;
    private String companyName;
    private String appliedOn;
    private String status;
    private String packageOffered;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getAppliedOn() { return appliedOn; }
    public void setAppliedOn(String appliedOn) { this.appliedOn = appliedOn; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPackageOffered() { return packageOffered; }
    public void setPackageOffered(String packageOffered) { this.packageOffered = packageOffered; }
}
