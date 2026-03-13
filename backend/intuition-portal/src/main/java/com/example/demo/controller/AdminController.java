package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Announcement;
import com.example.demo.model.Attendance;
import com.example.demo.model.Complaint;
import com.example.demo.model.Mark;
import com.example.demo.model.StaffMember;
import com.example.demo.model.Student;
import com.example.demo.model.Course; // Make sure you have this model!
import com.example.demo.model.Department;
import com.example.demo.repository.AnnouncementRepository;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.ComplaintRepository;
import com.example.demo.repository.MarkRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.CourseRepository; // Make sure you have this repository!

// THESE TWO LINES WERE MISSING!
@RestController
@RequestMapping("/api/host") 
public class AdminController {
    
    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private CourseRepository courseRepository; // Added for Courses

    // --- STATS ENDPOINT ---
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalStaff", staffRepository.count());
        return stats;
    }
    @PostMapping("/upload-mark")
    public Mark uploadMark(@RequestBody Mark mark) {
        return markRepository.save(mark);
    }

    // --- STAFF ENDPOINTS ---
    @GetMapping("/all-staff")
    public List<StaffMember> getAllStaff() {
        return staffRepository.findAll();
    }

    @PostMapping("/add-staff")
    public StaffMember addStaff(@RequestBody StaffMember staff) {
        return staffRepository.save(staff);
    }

    @DeleteMapping("/delete-staff/{id}")
    public String deleteStaff(@PathVariable Long id) {
        staffRepository.deleteById(id);
        return "Staff member deleted successfully";
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

    @DeleteMapping("/delete-student/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return "Student deleted successfully";
    }
    @Autowired
    private ComplaintRepository complaintRepository;

    @GetMapping("/all-complaints")
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderBySubmittedAtDesc();
    }

    // Host uses this to change status to RESOLVED
    @PostMapping("/update-complaint/{id}")
    public Complaint updateComplaintStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        complaint.setStatus(payload.get("status"));
        return complaintRepository.save(complaint);
    }

    @DeleteMapping("/delete-complaint/{id}")
    public String deleteComplaint(@PathVariable Long id) {
        complaintRepository.deleteById(id);
        return "Complaint removed";
    }
    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping("/all-departments")
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    @PostMapping("/add-department")
    public Department addDepartment(@RequestBody Department department) {
        return departmentRepository.save(department);
    }

    @DeleteMapping("/delete-department/{id}")
    public String deleteDepartment(@PathVariable Long id) {
        departmentRepository.deleteById(id);
        return "Department deleted";
    }

    // --- COURSE ENDPOINTS (ADDED) ---
    @GetMapping("/all-courses")
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @PostMapping("/add-course")
    public Course addCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    @DeleteMapping("/delete-course/{id}")
    public String deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
        return "Course deleted successfully";
    }

    // --- ATTENDANCE ENDPOINTS ---
    @PostMapping("/save-attendance")
    public ResponseEntity<?> saveAttendance(@RequestBody List<Attendance> attendanceRecords) {
        attendanceRepository.saveAll(attendanceRecords);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Attendance successfully locked.");
        return ResponseEntity.ok(response);
    }

    // --- ANNOUNCEMENT ENDPOINTS ---
    @GetMapping("/all-announcements")
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByPostedAtDesc();
    }

    @PostMapping("/post-announcement")
    public Announcement postAnnouncement(@RequestBody Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    @DeleteMapping("/delete-announcement/{id}")
    public String deleteAnnouncement(@PathVariable Long id) {
        announcementRepository.deleteById(id);
        return "Announcement removed";
    }

    // --- MARKS ENDPOINTS ---
    @GetMapping("/student-marks/{registerNumber}")
    public List<Mark> getStudentMarks(@PathVariable String registerNumber) {
        return markRepository.findByRegisterNumber(registerNumber);
    }
}