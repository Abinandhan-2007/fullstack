package com.example.demo.dto;

public class PayrollDTO {
    private Long id;
    private String staffId;
    private String staffName;
    private Double basicPay;
    private Double allowances;
    private Double deductions;
    private Double netPay;
    private String month;
    private String year;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }
    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
    public Double getBasicPay() { return basicPay; }
    public void setBasicPay(Double basicPay) { this.basicPay = basicPay; }
    public Double getAllowances() { return allowances; }
    public void setAllowances(Double allowances) { this.allowances = allowances; }
    public Double getDeductions() { return deductions; }
    public void setDeductions(Double deductions) { this.deductions = deductions; }
    public Double getNetPay() { return netPay; }
    public void setNetPay(Double netPay) { this.netPay = netPay; }
    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
