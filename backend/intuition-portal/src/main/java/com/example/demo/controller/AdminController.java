package com.example.demo.controller;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.StaffMember;
import com.example.demo.model.Student;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.model.Admin;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") 
public class AdminController {
    @Autowired
private AdminRepository courseRepository;

// Add these endpoints inside the class
@GetMapping("/all-courses")
public List<Admin> getAllCourses() {
    return courseRepository.findAll();
}

@PostMapping("/add-course")
public Admin addCourse(@RequestBody Admin course) {
    return courseRepository.save(course);
}

@DeleteMapping("/delete-course/{id}")
public String deleteCourse(@PathVariable Long id) {
    courseRepository.deleteById(id);
    return "Course deleted";
}

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private StudentRepository studentRepository;

    // --- STAFF ENDPOINTS ---
    @GetMapping("/all-staff")
    public List<StaffMember> getAllStaff() {
        return staffRepository.findAll();
    }

    @PostMapping("/add-staff")
    public StaffMember addStaff(@RequestBody StaffMember staff) {
        return staffRepository.save(staff);
    }

    // --- STUDENT ENDPOINTS ---
    @GetMapping("/all-students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping("/add-student")
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }
    // Inside HostController.java

// DELETE STAFF
@DeleteMapping("/delete-staff/{id}")
public String deleteStaff(@PathVariable Long id) {
    staffRepository.deleteById(id);
    return "Staff member deleted successfully";
}

// DELETE STUDENT
@DeleteMapping("/delete-student/{id}")
public String deleteStudent(@PathVariable Long id) {
    studentRepository.deleteById(id);
    return "Student deleted successfully";
}
@GetMapping("/stats")
public Map<String, Long> getStats() {
    Map<String, Long> stats = new HashMap<>();
    stats.put("totalStudents", studentRepository.count());
    stats.put("totalStaff", staffRepository.count());
    return stats;
}
}