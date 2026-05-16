package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StudentLeaveRequestDTO {
    private Long id;
    private String regNo;
    private String leaveType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer days;
    private String reason;
    private String status;
    private LocalDateTime appliedOn;
}
