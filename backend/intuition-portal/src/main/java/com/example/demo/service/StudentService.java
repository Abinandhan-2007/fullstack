package com.example.demo.service;

import com.example.demo.dto.StudentProfileDTO;
import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public StudentProfileDTO getProfileByEmail(String email) {
        try {
            Student student = studentRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Student not found"));
            return mapToDTO(student);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching profile: " + e.getMessage());
        }
    }

    public StudentProfileDTO getProfileByRegisterNumber(String regNo) {
        try {
            Student student = studentRepository.findByRegisterNumber(regNo).orElseThrow(() -> new RuntimeException("Student not found"));
            return mapToDTO(student);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching profile: " + e.getMessage());
        }
    }

    private StudentProfileDTO mapToDTO(Student student) {
        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setRegisterNumber(student.getRegisterNumber());
        dto.setEmail(student.getEmail());
        dto.setDepartment(student.getDepartment());
        dto.setYear(student.getYear());
        dto.setSemester(student.getSemester());
        dto.setSection(student.getSection());
        dto.setMentorName(student.getMentorName());
        dto.setBloodGroup(student.getBloodGroup());
        dto.setPhone(student.getPhone());
        dto.setStatus(student.getStatus());
        dto.setBatchYear(student.getBatchYear());
        return dto;
    }
}
