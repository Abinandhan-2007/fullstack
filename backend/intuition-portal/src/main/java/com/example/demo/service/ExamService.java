package com.example.demo.service;

import com.example.demo.dto.ExamScheduleDTO;
import com.example.demo.model.ExamSchedule;
import com.example.demo.repository.ExamScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class ExamService {
    @Autowired
    private ExamScheduleRepository examScheduleRepository;

    public List<ExamScheduleDTO> getAllExamSchedules() {
        try {
            return examScheduleRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching exam schedules: " + e.getMessage());
        }
    }

    public List<ExamScheduleDTO> getUpcomingExams() {
        try {
            String today = LocalDate.now().toString();
            return examScheduleRepository.findByDateAfter(today).stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching upcoming exams: " + e.getMessage());
        }
    }

    private ExamScheduleDTO mapToDTO(ExamSchedule schedule) {
        ExamScheduleDTO dto = new ExamScheduleDTO();
        dto.setId(schedule.getId());
        dto.setSubjectName(schedule.getSubject() != null ? schedule.getSubject().getSubjectName() : null);
        dto.setSubjectCode(schedule.getSubject() != null ? schedule.getSubject().getSubjectCode() : null);
        dto.setExamType(schedule.getExamType());
        dto.setDate(schedule.getDate());
        dto.setTime(schedule.getTime());
        dto.setVenue(schedule.getVenue());
        dto.setMaxMarks(schedule.getMaxMarks());
        dto.setHallTicketReleased(schedule.getHallTicketReleased());
        return dto;
    }
}
