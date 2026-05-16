package com.example.demo.service;

import com.example.demo.dto.StudentLeaveRequestDTO;
import com.example.demo.model.StudentLeaveRequest;
import com.example.demo.repository.StudentLeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentLeaveService {

    @Autowired
    private StudentLeaveRequestRepository leaveRequestRepository;

    public StudentLeaveRequestDTO applyLeave(StudentLeaveRequestDTO dto) {
        StudentLeaveRequest entity = new StudentLeaveRequest();
        entity.setRegisterNumber(dto.getRegNo());
        entity.setLeaveType(dto.getLeaveType());
        // Handling the strings in the entity
        entity.setFromDate(dto.getFromDate().toString());
        entity.setToDate(dto.getToDate().toString());
        entity.setDays(dto.getDays());
        entity.setReason(dto.getReason());
        entity.setStatus("PENDING");

        StudentLeaveRequest saved = leaveRequestRepository.save(entity);
        return mapToDTO(saved);
    }

    public List<StudentLeaveRequestDTO> getLeavesByStudent(String regNo) {
        return leaveRequestRepository.findByRegisterNumberOrderByAppliedOnDesc(regNo)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private StudentLeaveRequestDTO mapToDTO(StudentLeaveRequest entity) {
        StudentLeaveRequestDTO dto = new StudentLeaveRequestDTO();
        dto.setId(entity.getId());
        dto.setRegNo(entity.getRegisterNumber());
        dto.setLeaveType(entity.getLeaveType());
        dto.setFromDate(java.time.LocalDate.parse(entity.getFromDate()));
        dto.setToDate(java.time.LocalDate.parse(entity.getToDate()));
        dto.setDays(entity.getDays());
        dto.setReason(entity.getReason());
        dto.setStatus(entity.getStatus());
        dto.setAppliedOn(entity.getAppliedOn());
        return dto;
    }
}
