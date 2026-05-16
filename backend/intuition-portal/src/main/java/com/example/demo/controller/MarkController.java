package com.example.demo.controller;

import com.example.demo.dto.MarkDTO;
import com.example.demo.model.Mark;
import com.example.demo.repository.MarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/marks")
public class MarkController {

    @Autowired
    private MarkRepository markRepository;

    @GetMapping("/student/{registerNumber}")
    @PreAuthorize("hasAnyRole('STUDENT', 'STAFF', 'ADMIN')")
    public ResponseEntity<List<MarkDTO>> getStudentMarks(@PathVariable String registerNumber) {
        List<Mark> marks = markRepository.findByStudent_RegisterNumber(registerNumber);
        
        List<MarkDTO> dtos = marks.stream().map(m -> {
            MarkDTO dto = new MarkDTO();
            dto.setId(m.getId());
            dto.setStudentRegisterNumber(m.getStudent().getRegisterNumber());
            dto.setCourseCode(m.getCourse().getSubjectCode());
            dto.setExamType(m.getExamType());
            dto.setScore(m.getScore());
            dto.setMaxScore(m.getMaxScore());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<String> uploadMarks(@RequestBody MarkDTO markDTO) {
        // Implementation for mapping DTO to Entity and saving
        return ResponseEntity.ok("Marks uploaded successfully");
    }
}
