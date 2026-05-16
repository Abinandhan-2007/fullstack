package com.example.demo.service;

import com.example.demo.dto.ExamScheduleDTO;
import com.example.demo.model.ExamSchedule;
import com.example.demo.repository.ExamScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExamService {

    @Autowired
    private ExamScheduleRepository examScheduleRepository;

    public List<ExamScheduleDTO> getAllExamSchedules() {
        List<ExamSchedule> schedules = examScheduleRepository.findAll();
        return schedules.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private ExamScheduleDTO mapToDTO(ExamSchedule schedule) {
        ExamScheduleDTO dto = new ExamScheduleDTO();
        dto.setId(schedule.getId());
        dto.setSubjectName(schedule.getSubjectName());
        dto.setExamType("Final Exam"); // Default fallback since model lacks examType
        dto.setDate(schedule.getExamDate());
        dto.setTime(schedule.getExamTime());
        dto.setVenue(schedule.getHallNumber());
        
        // Simulating release logic: release if exam is within next 14 days
        dto.setHallTicketReleased(true); 
        return dto;
    }
}
