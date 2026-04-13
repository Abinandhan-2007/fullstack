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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping; // Ensure you have this model!
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Announcement;
import com.example.demo.model.Attendance;
import com.example.demo.model.Complaint;
import com.example.demo.model.Course;
import com.example.demo.model.Department;
import com.example.demo.model.Mark;
import com.example.demo.model.Session;
import com.example.demo.model.Staff; 
import com.example.demo.model.Student;
import com.example.demo.repository.AnnouncementRepository; // Added this!
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.ComplaintRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.MarkRepository;
import com.example.demo.repository.SessionRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.model.Placement;
import com.example.demo.model.SystemSetting;
import com.example.demo.model.SecurityLog;
import com.example.demo.repository.PlacementRepository;
import com.example.demo.repository.SystemSettingRepository;
import com.example.demo.repository.SecurityLogRepository;

@RestController
@RequestMapping("/api/host") 
@CrossOrigin(origins = {"https://ominicampus.vercel.app/", "http://localhost:5173"}, allowCredentials = "true")
public class AdminController {
    
    // ==========================================
    // DEPENDENCY INJECTIONS
    // ==========================================
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
    private CourseRepository courseRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SessionRepository timetableRepository; // Missing in your code, added here!

    @Autowired
    private PlacementRepository placementRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private SecurityLogRepository securityLogRepository;

    // ==========================================
    // STATS ENDPOINTS
    // ==========================================
    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalStaff", staffRepository.count());
        return stats;
    }

    // ==========================================
    // STAFF ENDPOINTS
    // ==========================================
    @GetMapping("/all-staff")
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @PostMapping("/add-staff")
    public Staff addStaff(@RequestBody Staff staff) {
        return staffRepository.save(staff);
    }

    @DeleteMapping("/delete-staff/{id}")
    public String deleteStaff(@PathVariable Long id) {
        staffRepository.deleteById(id);
        return "Staff member deleted successfully";
    }

    // ==========================================
    // STUDENT ENDPOINTS
    // ==========================================
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

    // ==========================================
    // COMPLAINT ENDPOINTS
    // ==========================================
    @GetMapping("/all-complaints")
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderBySubmittedAtDesc();
    }

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

    // ==========================================
    // DEPARTMENT ENDPOINTS
    // ==========================================
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

    // ==========================================
    // COURSE / SUBJECT ENDPOINTS
    // ==========================================
    // Added alias so React doesn't get a 404 error if it calls /all-subjects
    @GetMapping({"/all-courses", "/all-subjects"})
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

    // ==========================================
    // TIMETABLE ENDPOINTS
    // ==========================================
    @GetMapping("/timetable")
    public ResponseEntity<List<Session>> getTimetable() {
        return ResponseEntity.ok(timetableRepository.findAll());
    }

    @PostMapping("/timetable")
    public ResponseEntity<Session> addTimetableSession(@RequestBody Session session) {
        return ResponseEntity.ok(timetableRepository.save(session));
    }

    @DeleteMapping("/timetable/{id}")
    public ResponseEntity<?> deleteTimetableSession(@PathVariable Long id) {
        timetableRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Fixed the "Session" vs "TimetableSession" mixup here
    @PutMapping("/timetable/{id}")
    public ResponseEntity<Session> updateTimetableSession(@PathVariable Long id, @RequestBody Session updatedSession) {
        return timetableRepository.findById(id).map(session -> {
            session.setTimeSlot(updatedSession.getTimeSlot());
            return ResponseEntity.ok(timetableRepository.save(session));
        }).orElse(ResponseEntity.notFound().build());
    }
    

    // ==========================================
    // ATTENDANCE ENDPOINTS
    // ==========================================
    @PostMapping("/save-attendance")
    public ResponseEntity<?> saveAttendance(@RequestBody List<Attendance> attendanceRecords) {
        attendanceRepository.saveAll(attendanceRecords);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Attendance successfully locked.");
        return ResponseEntity.ok(response);
    }

    // ==========================================
    // ANNOUNCEMENT ENDPOINTS
    // ==========================================
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

    // ==========================================
    // MARKS ENDPOINTS
    // ==========================================
    @GetMapping("/student-marks/{registerNumber}")
    public List<Mark> getStudentMarks(@PathVariable String registerNumber) {
        return markRepository.findByRegisterNumber(registerNumber);
    }

    @PostMapping("/upload-mark")
    public Mark uploadMark(@RequestBody Mark mark) {
        return markRepository.save(mark);
    }

    // ==========================================
    // PLACEMENT ENDPOINTS
    // ==========================================
    @GetMapping("/all-placements")
    public List<Placement> getAllPlacements() {
        return placementRepository.findAll();
    }

    @PostMapping("/add-placement")
    public Placement addPlacement(@RequestBody Placement placement) {
        return placementRepository.save(placement);
    }

    @DeleteMapping("/delete-placement/{id}")
    public String deletePlacement(@PathVariable Long id) {
        placementRepository.deleteById(id);
        return "Placement removed";
    }

    // ==========================================
    // SYSTEM SETTINGS ENDPOINTS
    // ==========================================
    @GetMapping("/system-settings")
    public SystemSetting getSystemSettings() {
        List<SystemSetting> settings = systemSettingRepository.findAll();
        if (settings.isEmpty()) {
            SystemSetting defaultSettings = new SystemSetting();
            defaultSettings.setMaintenanceMode(false);
            defaultSettings.setRegistrationOpen(true);
            defaultSettings.setAcademicYear("2024-2025");
            defaultSettings.setCurrentSemester("ODD");
            return systemSettingRepository.save(defaultSettings);
        }
        return settings.get(0);
    }

    @PostMapping("/update-settings")
    public SystemSetting updateSystemSettings(@RequestBody SystemSetting updatedSetting) {
        systemSettingRepository.deleteAll(); // Keep only one setting object
        return systemSettingRepository.save(updatedSetting);
    }

    // ==========================================
    // SECURITY LOGS ENDPOINTS
    // ==========================================
    @GetMapping("/security-logs")
    public List<SecurityLog> getSecurityLogs() {
        return securityLogRepository.findAllByOrderByTimeDesc();
    }

    @PostMapping("/add-security-log")
    public SecurityLog addSecurityLog(@RequestBody SecurityLog log) {
        return securityLogRepository.save(log);
    }

}