package com.example.demo.dto;

public class TransactionDTO {
    private Long id;
    private String transactionId;
    private String relatedTo; // REG NO or STAFF ID
    private String type; // FEE, PAYROLL, REFUND
    private Double amount;
    private String date;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getRelatedTo() { return relatedTo; }
    public void setRelatedTo(String relatedTo) { this.relatedTo = relatedTo; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
