package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class TimetableSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course subject;

    private String day;
    private Integer period;
    private String roomNumber;
    private String year;
    private String section;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }
    public Course getSubject() { return subject; }
    public void setSubject(Course subject) { this.subject = subject; }
    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
    public Integer getPeriod() { return period; }
    public void setPeriod(Integer period) { this.period = period; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
}
