package com.example.demo.dto;

public class HallTicketDTO {
    private Long id;
    private String registerNumber;
    private String studentName;
    private String department;
    private String year;
    private String examName;
    private String examDate;
    private String venue;
    private Boolean isReleased;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getExamName() { return examName; }
    public void setExamName(String examName) { this.examName = examName; }
    public String getExamDate() { return examDate; }
    public void setExamDate(String examDate) { this.examDate = examDate; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public Boolean getIsReleased() { return isReleased; }
    public void setIsReleased(Boolean isReleased) { this.isReleased = isReleased; }
}
