package com.example.demo.dto;

public class SeatingDTO {
    private Long id;
    private String registerNumber;
    private String studentName;
    private String hallName;
    private Integer rowNumber;
    private Integer columnNumber;
    private String seatNumber;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getHallName() { return hallName; }
    public void setHallName(String hallName) { this.hallName = hallName; }
    public Integer getRowNumber() { return rowNumber; }
    public void setRowNumber(Integer rowNumber) { this.rowNumber = rowNumber; }
    public Integer getColumnNumber() { return columnNumber; }
    public void setColumnNumber(Integer columnNumber) { this.columnNumber = columnNumber; }
    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
}
