package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 1000)
    private String description;
    
    private String date;
    private String type;
    private Boolean notifyAll;
    private String createdBy;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Boolean getNotifyAll() { return notifyAll; }
    public void setNotifyAll(Boolean notifyAll) { this.notifyAll = notifyAll; }
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
}
