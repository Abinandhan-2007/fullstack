package com.example.demo.controller;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Attendance;
import com.example.demo.model.Mark;
import com.example.demo.model.StaffMember;
import com.example.demo.model.Student;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.MarkRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StudentRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "https://fullstack-five-sage.vercel.app"}) 
public class AdminController {
    

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
    @Autowired
    private AttendanceRepository attendanceRepository;

    // Add this endpoint to accept the array of attendance data
    @PostMapping("/save-attendance")
    public ResponseEntity<?> saveAttendance(@RequestBody List<Attendance> attendanceRecords) {
        // saveAll() takes the entire list and saves it to MySQL in one quick batch
        attendanceRepository.saveAll(attendanceRecords);
        
        // Return a success message back to React
        Map<String, String> response = new HashMap<>();
        response.put("message", "Attendance successfully locked.");
        return ResponseEntity.ok(response);
    }
  @Autowired
    private MarkRepository markRepository;

    // The Host will use this to view a student's report card
    @GetMapping("/student-marks/{registerNumber}")
    public List<Mark> getStudentMarks(@PathVariable String registerNumber) {
        return markRepository.findByRegisterNumber(registerNumber);
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