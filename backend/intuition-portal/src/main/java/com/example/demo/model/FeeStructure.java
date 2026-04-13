package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "feestructures")
public class FeeStructure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String department;
    private String batch;
    private String academicYear;
    private Double tuitionFee;
    private Double hostelFee;
    private Double examFee;
    private Double otherFee;
    private Double totalFee;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public Double getTuitionFee() { return tuitionFee; }
    public void setTuitionFee(Double tuitionFee) { this.tuitionFee = tuitionFee; }
    public Double getHostelFee() { return hostelFee; }
    public void setHostelFee(Double hostelFee) { this.hostelFee = hostelFee; }
    public Double getExamFee() { return examFee; }
    public void setExamFee(Double examFee) { this.examFee = examFee; }
    public Double getOtherFee() { return otherFee; }
    public void setOtherFee(Double otherFee) { this.otherFee = otherFee; }
    public Double getTotalFee() { return totalFee; }
    public void setTotalFee(Double totalFee) { this.totalFee = totalFee; }
}
