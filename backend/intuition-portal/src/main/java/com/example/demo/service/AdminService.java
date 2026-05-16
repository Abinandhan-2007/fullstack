package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {
    
    public Map<String, Object> getSystemStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStudents", 1200);
            stats.put("totalStaff", 150);
            stats.put("totalDepartments", 8);
            stats.put("activeCourses", 45);
            return stats;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching admin stats: " + e.getMessage());
        }
    }
}
