package com.example.demo.config;

import com.example.demo.model.Staff;
import com.example.demo.model.Student;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String defaultPassword = passwordEncoder.encode("password123");

        // 1. Create Default Student
        if (studentRepository.findByEmail("student@apex.edu") == null) {
            Student student = new Student();
            student.setName("Demo Student");
            student.setEmail("student@apex.edu");
            student.setPassword(defaultPassword);
            student.setRole("STUDENT");
            student.setDepartment("CSE");
            student.setRegisterNumber("REG2024001");
            studentRepository.save(student);
        }

        // Helper to define staff easily
        String[][] defaultStaff = {
            {"Demo Admin", "admin@apex.edu", "ADMIN", "Admin", "EMP001"},
            {"Demo Staff", "staff@apex.edu", "STAFF", "CSE", "EMP002"},
            {"Demo Parent", "parent@apex.edu", "PARENT", "General", "EMP003"},
            {"Demo COE", "coe@apex.edu", "COE", "Examinations", "EMP004"},
            {"Demo Finance", "finance@apex.edu", "FINANCE", "Accounts", "EMP005"},
            {"Demo Warden", "warden@apex.edu", "WARDEN", "Hostels", "EMP006"},
            {"Demo Librarian", "librarian@apex.edu", "LIBRARIAN", "Library", "EMP007"},
            {"Demo Placement", "placement@apex.edu", "PLACEMENT", "Corporate Relations", "EMP008"}
        };

        for (String[] st : defaultStaff) {
            if (staffRepository.findByEmail(st[1]).isEmpty()) {
                Staff staff = new Staff();
                staff.setName(st[0]);
                staff.setEmail(st[1]);
                staff.setPassword(defaultPassword);
                staff.setRole(st[2]);
                staff.setDepartment(st[3]);
                staff.setEmployeeId(st[4]);
                staffRepository.save(staff);
            }
        }

        System.out.println("=========================================================");
        System.out.println("DEMO USERS LOADED.");
        System.out.println("Use the suffix @apex.edu (e.g. admin@apex.edu, finance@apex.edu)");
        System.out.println("Password for all accounts: password123");
        System.out.println("=========================================================");
    }
}
