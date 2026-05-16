package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class HostelRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomNumber;
    private String block;
    private Integer floor;
    private Integer totalBeds;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }
    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public Integer getTotalBeds() { return totalBeds; }
    public void setTotalBeds(Integer totalBeds) { this.totalBeds = totalBeds; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
