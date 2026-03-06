package com.example.demo.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_academic")
public class Student {
    
    @Id
    @Column(name = "roll_no")
    private String rollNo;
    private String name;
    private String department;
    private String currentSemester;
    private Double cgpa;
    private Integer totalCredits;
    private Integer arrearCount;
    private String feesDue;
    private String placementFa;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "roll_no", referencedColumnName = "roll_no")
    private List<SemesterGpa> semesterRecords;

    // Getters and Setters
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(String currentSemester) { this.currentSemester = currentSemester; }
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public Integer getTotalCredits() { return totalCredits; }
    public void setTotalCredits(Integer totalCredits) { this.totalCredits = totalCredits; }
    public Integer getArrearCount() { return arrearCount; }
    public void setArrearCount(Integer arrearCount) { this.arrearCount = arrearCount; }
    public String getFeesDue() { return feesDue; }
    public void setFeesDue(String feesDue) { this.feesDue = feesDue; }
    public String getPlacementFa() { return placementFa; }
    public void setPlacementFa(String placementFa) { this.placementFa = placementFa; }
    public List<SemesterGpa> getSemesterRecords() { return semesterRecords; }
    public void setSemesterRecords(List<SemesterGpa> semesterRecords) { this.semesterRecords = semesterRecords; }
}