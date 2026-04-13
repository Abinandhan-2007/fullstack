package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hostelallocations")
public class HostelAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String studentName;
    private String registerNumber;
    private String department;
    private String batch;
    private String roomNumber;
    private String block;
    private String allocationDate;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }
    public String getAllocationDate() { return allocationDate; }
    public void setAllocationDate(String allocationDate) { this.allocationDate = allocationDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
