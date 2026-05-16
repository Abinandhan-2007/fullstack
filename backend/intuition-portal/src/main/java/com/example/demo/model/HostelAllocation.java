package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class HostelAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private HostelRoom room;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private String bedNumber;
    private String allocatedOn;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HostelRoom getRoom() { return room; }
    public void setRoom(HostelRoom room) { this.room = room; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public String getBedNumber() { return bedNumber; }
    public void setBedNumber(String bedNumber) { this.bedNumber = bedNumber; }
    public String getAllocatedOn() { return allocatedOn; }
    public void setAllocatedOn(String allocatedOn) { this.allocatedOn = allocatedOn; }
}
