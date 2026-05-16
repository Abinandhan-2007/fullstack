package com.example.demo.dto;

public class SubjectDTO {
    private Long id;
    private String subjectCode;
    private String subjectName;
    private String department;
    private String year;
    private String section;
    private Integer credits;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }
}
