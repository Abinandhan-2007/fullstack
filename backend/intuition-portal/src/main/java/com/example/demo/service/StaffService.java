package com.example.demo.service;

import com.example.demo.dto.StaffProfileDTO;
import com.example.demo.dto.SubjectDTO;
import com.example.demo.dto.StudentProfileDTO;
import com.example.demo.model.Staff;
import com.example.demo.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StaffService {
    @Autowired
    private StaffRepository staffRepository;

    public StaffProfileDTO getProfile(String staffId) {
        try {
            Staff staff = staffRepository.findByStaffId(staffId).orElseThrow(() -> new RuntimeException("Staff not found"));
            return mapToDTO(staff);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching profile: " + e.getMessage());
        }
    }

    public StaffProfileDTO getProfileByEmail(String email) {
        try {
            Staff staff = staffRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Staff not found"));
            return mapToDTO(staff);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching profile: " + e.getMessage());
        }
    }

    public List<SubjectDTO> getAssignedSubjects(String staffId) {
        // Dummy implementation
        return List.of();
    }

    public List<StudentProfileDTO> getAssignedStudents(String staffId) {
        // Dummy implementation
        return List.of();
    }

    private StaffProfileDTO mapToDTO(Staff staff) {
        StaffProfileDTO dto = new StaffProfileDTO();
        dto.setId(staff.getId());
        dto.setName(staff.getName());
        dto.setStaffId(staff.getStaffId());
        dto.setEmail(staff.getEmail());
        dto.setDepartment(staff.getDepartment());
        dto.setDesignation(staff.getDesignation());
        dto.setPhone(staff.getPhone());
        return dto;
    }
}
