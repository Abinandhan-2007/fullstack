package com.example.demo.dto;

import java.util.List;

public class HostelAllocationDTO {
    private Long id;
    private String roomNumber;
    private String block;
    private Integer floor;
    private String bedNumber;
    private List<String> roommateNames;
    private String allocatedOn;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }
    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public String getBedNumber() { return bedNumber; }
    public void setBedNumber(String bedNumber) { this.bedNumber = bedNumber; }
    public List<String> getRoommateNames() { return roommateNames; }
    public void setRoommateNames(List<String> roommateNames) { this.roommateNames = roommateNames; }
    public String getAllocatedOn() { return allocatedOn; }
    public void setAllocatedOn(String allocatedOn) { this.allocatedOn = allocatedOn; }
}
