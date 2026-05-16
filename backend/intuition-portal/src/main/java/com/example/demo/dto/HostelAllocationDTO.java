package com.example.demo.dto;

public class HostelAllocationDTO {
    private String block;
    private String floor;
    private String roomNumber;
    private String bedNumber;

    public HostelAllocationDTO() {
    }

    public HostelAllocationDTO(String block, String floor, String roomNumber, String bedNumber) {
        this.block = block;
        this.floor = floor;
        this.roomNumber = roomNumber;
        this.bedNumber = bedNumber;
    }

    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }

    public String getFloor() { return floor; }
    public void setFloor(String floor) { this.floor = floor; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getBedNumber() { return bedNumber; }
    public void setBedNumber(String bedNumber) { this.bedNumber = bedNumber; }
}
