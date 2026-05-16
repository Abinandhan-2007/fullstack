package com.example.demo.dto;

public class ExamScheduleDTO {
    private Long id;
    private String subjectName;
    private String subjectCode;
    private String examType;
    private String date;
    private String time;
    private String venue;
    private Integer maxMarks;
    private Boolean hallTicketReleased;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public Integer getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Integer maxMarks) { this.maxMarks = maxMarks; }
    public Boolean getHallTicketReleased() { return hallTicketReleased; }
    public void setHallTicketReleased(Boolean hallTicketReleased) { this.hallTicketReleased = hallTicketReleased; }
}
