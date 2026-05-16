package com.example.demo.dto;

public class AttendanceMarkRequestDTO {
    private String studentRegNo;
    private String subjectCode;
    private String date;
    private Boolean isPresent;

    public String getStudentRegNo() { return studentRegNo; }
    public void setStudentRegNo(String studentRegNo) { this.studentRegNo = studentRegNo; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public Boolean getIsPresent() { return isPresent; }
    public void setIsPresent(Boolean isPresent) { this.isPresent = isPresent; }
}
