package com.example.demo.dto;

public class TimetableSessionDTO {
    private Long id;
    private String day;
    private Integer period;
    private String subjectName;
    private String subjectCode;
    private String staffName;
    private String roomNumber;
    private String year;
    private String section;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
    public Integer getPeriod() { return period; }
    public void setPeriod(Integer period) { this.period = period; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
}
