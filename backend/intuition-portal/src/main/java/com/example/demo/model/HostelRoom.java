package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hostelrooms")
public class HostelRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roomNumber;
    private String block;
    private String floor;
    private Integer capacity;
    private Integer occupiedCount;
    private String roomType;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }
    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getOccupiedCount() { return occupiedCount; }
    public void setOccupiedCount(Integer occupiedCount) { this.occupiedCount = occupiedCount; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
