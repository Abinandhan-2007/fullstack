package com.example.demo.service;

import com.example.demo.dto.MarkUploadRequestDTO;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarkService {

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    public void uploadMarks(List<MarkUploadRequestDTO> entries) {
        try {
            for (MarkUploadRequestDTO entry : entries) {
                Student student = studentRepository.findByRegisterNumber(entry.getStudentRegNo())
                    .orElseThrow(() -> new RuntimeException("Student not found: " + entry.getStudentRegNo()));
                Course course = courseRepository.findBySubjectCode(entry.getSubjectCode())
                    .orElseThrow(() -> new RuntimeException("Course not found: " + entry.getSubjectCode()));

                Mark mark = new Mark();
                mark.setStudent(student);
                mark.setCourse(course);
                mark.setExamType(entry.getExamType());
                mark.setScore(entry.getScore());
                mark.setMaxScore(entry.getMaxScore());
                markRepository.save(mark);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error uploading marks: " + e.getMessage());
        }
    }

    public void uploadMarksBulk(List<Map<String, Object>> entries) {
        try {
            for (Map<String, Object> entry : entries) {
                Student student = null;
                if (entry.containsKey("studentId")) {
                    Long studentId = Long.valueOf(entry.get("studentId").toString());
                    student = studentRepository.findById(studentId).orElse(null);
                } else if (entry.containsKey("studentRegNo")) {
                    student = studentRepository.findByRegisterNumber(entry.get("studentRegNo").toString()).orElse(null);
                }

                Course course = null;
                if (entry.containsKey("courseId")) {
                    Long courseId = Long.valueOf(entry.get("courseId").toString());
                    course = courseRepository.findById(courseId).orElse(null);
                } else if (entry.containsKey("subjectCode")) {
                    course = courseRepository.findBySubjectCode(entry.get("subjectCode").toString()).orElse(null);
                }

                if (student == null || course == null) continue;

                String examType = entry.getOrDefault("examType", "INTERNAL_1").toString();
                int score = entry.containsKey("marksObtained") ? Integer.parseInt(entry.get("marksObtained").toString()) : (entry.containsKey("score") ? Integer.parseInt(entry.get("score").toString()) : 0);
                int maxScore = entry.containsKey("maxMarks") ? Integer.parseInt(entry.get("maxMarks").toString()) : (entry.containsKey("maxScore") ? Integer.parseInt(entry.get("maxScore").toString()) : 100);

                Mark mark = new Mark();
                mark.setStudent(student);
                mark.setCourse(course);
                mark.setExamType(examType);
                mark.setScore(score);
                mark.setMaxScore(maxScore);
                markRepository.save(mark);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error uploading marks bulk: " + e.getMessage());
        }
    }

    public List<Map<String, Object>> getMarksByStudent(String regNo) {
        try {
            Student student = studentRepository.findByRegisterNumber(regNo)
                .orElseThrow(() -> new RuntimeException("Student not found: " + regNo));
            List<Mark> marks = markRepository.findByStudent_RegisterNumber(regNo);
            
            List<Map<String, Object>> list = new ArrayList<>();
            for (Mark m : marks) {
                Map<String, Object> map = new HashMap<>();
                map.put("subjectName", m.getCourse().getSubjectName());
                map.put("courseCode", m.getCourse().getSubjectCode());
                map.put("examType", m.getExamType());
                map.put("score", m.getScore());
                map.put("maxScore", m.getMaxScore());
                map.put("semester", student.getSemester() != null ? student.getSemester() : "1");
                list.add(map);
            }
            return list;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching marks: " + e.getMessage());
        }
    }

    public List<Map<String, Object>> getRecentByStaff(String staffId) {
        try {
            List<Mark> allMarks = markRepository.findAll();
            // Just return top 10 recent marks formatted
            List<Map<String, Object>> list = new ArrayList<>();
            for (Mark m : allMarks) {
                Map<String, Object> map = new HashMap<>();
                map.put("studentName", m.getStudent().getName());
                map.put("studentRegNo", m.getStudent().getRegisterNumber());
                map.put("subjectName", m.getCourse().getSubjectName());
                map.put("examType", m.getExamType());
                map.put("score", m.getScore());
                list.add(map);
            }
            list.sort((a, b) -> b.get("studentRegNo").toString().compareTo(a.get("studentRegNo").toString()));
            return list.stream().limit(10).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching recent marks: " + e.getMessage());
        }
    }
}
