package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mark_id")
    private Mark mark;

    private Boolean isPublished;
    private String publishedOn;
    private String publishedBy;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Mark getMark() { return mark; }
    public void setMark(Mark mark) { this.mark = mark; }
    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }
    public String getPublishedOn() { return publishedOn; }
    public void setPublishedOn(String publishedOn) { this.publishedOn = publishedOn; }
    public String getPublishedBy() { return publishedBy; }
    public void setPublishedBy(String publishedBy) { this.publishedBy = publishedBy; }
}
