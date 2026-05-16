package com.example.demo.dto;

public class BookIssueDTO {
    private Long id;
    private String bookTitle;
    private String author;
    private String isbn;
    private String issueDate;
    private String dueDate;
    private String returnDate;
    private Double finePaid;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBookTitle() { return bookTitle; }
    public void setBookTitle(String bookTitle) { this.bookTitle = bookTitle; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }
    public Double getFinePaid() { return finePaid; }
    public void setFinePaid(Double finePaid) { this.finePaid = finePaid; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
