package com.example.demo.dto;

public class MarkUploadRequestDTO {
    private String studentRegNo;
    private String subjectCode;
    private String examType;
    private Integer score;
    private Integer maxScore;
    private String semester;

    public String getStudentRegNo() { return studentRegNo; }
    public void setStudentRegNo(String studentRegNo) { this.studentRegNo = studentRegNo; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
}
