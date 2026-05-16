package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class HallTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private ExamSchedule exam;

    private Boolean isReleased;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public ExamSchedule getExam() { return exam; }
    public void setExam(ExamSchedule exam) { this.exam = exam; }
    public Boolean getIsReleased() { return isReleased; }
    public void setIsReleased(Boolean isReleased) { this.isReleased = isReleased; }
}
