package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    private Double basicPay;
    private Double allowances;
    private Double deductions;
    private Double netPay;
    private String month;
    private String year;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }
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
