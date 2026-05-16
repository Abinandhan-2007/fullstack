package com.example.demo.service;

import com.example.demo.dto.TimetableSessionDTO;
import com.example.demo.model.TimetableSlot;
import com.example.demo.repository.TimetableSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimetableService {
    @Autowired
    private TimetableSlotRepository timetableRepository;

    public List<TimetableSessionDTO> getFullTimetable() {
        try {
            return timetableRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching timetable: " + e.getMessage());
        }
    }

    public List<TimetableSessionDTO> getTimetableByStaff(Long staffId) {
        try {
            return timetableRepository.findByStaff_Id(staffId).stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching staff timetable: " + e.getMessage());
        }
    }

    private TimetableSessionDTO mapToDTO(TimetableSlot slot) {
        TimetableSessionDTO dto = new TimetableSessionDTO();
        dto.setId(slot.getId());
        dto.setDay(slot.getDay());
        dto.setPeriod(slot.getPeriod());
        dto.setRoomNumber(slot.getRoomNumber());
        dto.setYear(slot.getYear());
        dto.setSection(slot.getSection());
        if(slot.getSubject() != null) {
            dto.setSubjectName(slot.getSubject().getSubjectName());
            dto.setSubjectCode(slot.getSubject().getSubjectCode());
        }
        if(slot.getStaff() != null) {
            dto.setStaffName(slot.getStaff().getName());
        }
        return dto;
    }
}
