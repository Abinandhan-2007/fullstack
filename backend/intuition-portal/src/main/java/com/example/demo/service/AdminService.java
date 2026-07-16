package com.example.demo.service;

import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;
    
    public Map<String, Object> getSystemStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStudents", studentRepository.count());
            stats.put("totalStaff", staffRepository.count());
            stats.put("totalDepartments", departmentRepository.count());
            stats.put("activeCourses", courseRepository.count());
            return stats;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching admin stats: " + e.getMessage());
        }
    }
}
