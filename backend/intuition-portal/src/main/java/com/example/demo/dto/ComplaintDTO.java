package com.example.demo.dto;

import java.time.LocalDateTime;

public class ComplaintDTO {
    private Long id;
    private String description;
    private String status;
    private LocalDateTime date;

    public ComplaintDTO() {}

    public ComplaintDTO(Long id, String description, String status, LocalDateTime date) {
        this.id = id;
        this.description = description;
        this.status = status;
        this.date = date;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}
