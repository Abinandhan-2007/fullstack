package com.example.demo.dto;

public class BookIssueDTO {
    private Long id;
    private String bookTitle;
    private String author;
    private String issueDate;
    private String dueDate;
    private String returnDate;
    private Double finePaid;

    public BookIssueDTO() {
    }

    public BookIssueDTO(Long id, String bookTitle, String author, String issueDate, String dueDate, String returnDate, Double finePaid) {
        this.id = id;
        this.bookTitle = bookTitle;
        this.author = author;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.finePaid = finePaid;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
    
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    
    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }
    
    public Double getFinePaid() { return finePaid; }
    public void setFinePaid(Double finePaid) { this.finePaid = finePaid; }
}
