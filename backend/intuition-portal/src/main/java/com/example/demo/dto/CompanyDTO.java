package com.example.demo.dto;

public class CompanyDTO {
    private Long id;
    private String companyName;
    private String industry;
    private String driveDate;
    private Double minCGPA;
    private Boolean backlogAllowed;
    private String rolesOffered;
    private String packageRange;
    private String description;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getDriveDate() { return driveDate; }
    public void setDriveDate(String driveDate) { this.driveDate = driveDate; }
    public Double getMinCGPA() { return minCGPA; }
    public void setMinCGPA(Double minCGPA) { this.minCGPA = minCGPA; }
    public Boolean getBacklogAllowed() { return backlogAllowed; }
    public void setBacklogAllowed(Boolean backlogAllowed) { this.backlogAllowed = backlogAllowed; }
    public String getRolesOffered() { return rolesOffered; }
    public void setRolesOffered(String rolesOffered) { this.rolesOffered = rolesOffered; }
    public String getPackageRange() { return packageRange; }
    public void setPackageRange(String packageRange) { this.packageRange = packageRange; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
