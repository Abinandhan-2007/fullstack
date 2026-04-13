package com.example.demo.controller;

import com.example.demo.model.Staff;
import com.example.demo.model.Student;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public record LoginRequest(String email, String password, String role) {}
    public record RegisterRequest(String name, String email, String password, String role, String department, String registerNumber, String employeeId) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String role = request.role().toUpperCase();
        
        if ("STUDENT".equals(role)) {
            Student student = studentRepository.findByEmail(request.email());
            if (student != null && passwordEncoder.matches(request.password(), student.getPassword())) {
                String token = jwtUtil.generateToken(student.getEmail(), role);
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("role", role);
                response.put("email", student.getEmail());
                response.put("name", student.getName());
                response.put("id", student.getId());
                return ResponseEntity.ok(response);
            }
        } else {
            Optional<Staff> staffOpt = staffRepository.findByEmail(request.email());
            if (staffOpt.isPresent()) {
                Staff staff = staffOpt.get();
                if (passwordEncoder.matches(request.password(), staff.getPassword()) && staff.getRole().equalsIgnoreCase(role)) {
                    String token = jwtUtil.generateToken(staff.getEmail(), role);
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("role", role);
                    response.put("email", staff.getEmail());
                    response.put("name", staff.getName());
                    response.put("id", staff.getId());
                    return ResponseEntity.ok(response);
                }
            }
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String role = request.role().toUpperCase();
        
        if ("STUDENT".equals(role)) {
            if (studentRepository.findByEmail(request.email()) != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
            }
            Student student = new Student();
            student.setName(request.name());
            student.setEmail(request.email());
            student.setPassword(passwordEncoder.encode(request.password()));
            student.setRole(role);
            student.setDepartment(request.department());
            student.setRegisterNumber(request.registerNumber());
            studentRepository.save(student);
            return ResponseEntity.status(HttpStatus.CREATED).body("Student registered successfully");
        } else {
            if (staffRepository.findByEmail(request.email()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
            }
            Staff staff = new Staff();
            staff.setName(request.name());
            staff.setEmail(request.email());
            staff.setPassword(passwordEncoder.encode(request.password()));
            staff.setRole(role);
            staff.setDepartment(request.department());
            staff.setEmployeeId(request.employeeId() != null ? request.employeeId() : request.registerNumber());
            staffRepository.save(staff);
            return ResponseEntity.status(HttpStatus.CREATED).body("Staff registered successfully");
        }
    }
}
