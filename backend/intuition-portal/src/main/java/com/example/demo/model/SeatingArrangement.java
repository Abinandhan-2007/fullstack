package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class SeatingArrangement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "exam_id")
    private ExamSchedule exam;

    private String hallName;
    private Integer rowNumber;
    private Integer columnNumber;
    private String seatNumber;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public ExamSchedule getExam() { return exam; }
    public void setExam(ExamSchedule exam) { this.exam = exam; }
    public String getHallName() { return hallName; }
    public void setHallName(String hallName) { this.hallName = hallName; }
    public Integer getRowNumber() { return rowNumber; }
    public void setRowNumber(Integer rowNumber) { this.rowNumber = rowNumber; }
    public Integer getColumnNumber() { return columnNumber; }
    public void setColumnNumber(Integer columnNumber) { this.columnNumber = columnNumber; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
}
