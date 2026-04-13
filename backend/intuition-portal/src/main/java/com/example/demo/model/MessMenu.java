package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "messmenus")
public class MessMenu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dayOfWeek;
    private String breakfast;
    private String lunch;
    private String dinner;
    private String snacks;
    private Integer weekNumber;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
    public String getBreakfast() { return breakfast; }
    public void setBreakfast(String breakfast) { this.breakfast = breakfast; }
    public String getLunch() { return lunch; }
    public void setLunch(String lunch) { this.lunch = lunch; }
    public String getDinner() { return dinner; }
    public void setDinner(String dinner) { this.dinner = dinner; }
    public String getSnacks() { return snacks; }
    public void setSnacks(String snacks) { this.snacks = snacks; }
    public Integer getWeekNumber() { return weekNumber; }
    public void setWeekNumber(Integer weekNumber) { this.weekNumber = weekNumber; }
}
