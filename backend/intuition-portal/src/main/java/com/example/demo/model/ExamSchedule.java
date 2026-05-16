package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class ExamSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course subject;

    private String examType;
    private String date;
    private String time;
    private String venue;
    private Integer maxMarks;
    private Boolean hallTicketReleased;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Course getSubject() { return subject; }
    public void setSubject(Course subject) { this.subject = subject; }
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
