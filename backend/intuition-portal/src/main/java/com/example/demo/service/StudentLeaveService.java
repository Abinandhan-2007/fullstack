package com.example.demo.service;

import com.example.demo.dto.StudentLeaveRequestDTO;
import com.example.demo.model.StudentLeave;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentLeaveRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class StudentLeaveService {
    @Autowired
    private StudentLeaveRepository leaveRepository;
    @Autowired
    private StudentRepository studentRepository;

    public StudentLeaveRequestDTO applyLeave(StudentLeaveRequestDTO dto) {
        try {
            Student student = studentRepository.findByRegisterNumber(dto.getRegisterNumber()).orElseThrow(()->new RuntimeException("Student not found"));
            StudentLeave leave = new StudentLeave();
            leave.setStudent(student);
            leave.setLeaveType(dto.getLeaveType());
            leave.setFromDate(dto.getFromDate());
            leave.setToDate(dto.getToDate());
            leave.setDays(dto.getDays());
            leave.setReason(dto.getReason());
            leave.setStatus("PENDING");
            leave.setAppliedOn(LocalDate.now().toString());
            leave = leaveRepository.save(leave);
            return mapToDTO(leave);
        } catch (Exception e) {
            throw new RuntimeException("Error applying leave: " + e.getMessage());
        }
    }

    public List<StudentLeaveRequestDTO> getLeavesByStudent(String regNo) {
        try {
            return leaveRepository.findByStudent_RegisterNumber(regNo).stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching leaves: " + e.getMessage());
        }
    }

    private StudentLeaveRequestDTO mapToDTO(StudentLeave leave) {
        StudentLeaveRequestDTO dto = new StudentLeaveRequestDTO();
        dto.setId(leave.getId());
        dto.setRegisterNumber(leave.getStudent() != null ? leave.getStudent().getRegisterNumber() : null);
        dto.setLeaveType(leave.getLeaveType());
        dto.setFromDate(leave.getFromDate());
        dto.setToDate(leave.getToDate());
        dto.setDays(leave.getDays());
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getStatus());
        dto.setAppliedOn(leave.getAppliedOn());
        return dto;
    }
}
