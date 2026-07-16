package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/parent")
public class ParentController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private MarkService markService;

    @Autowired
    private FeeService feeService;

    @Autowired
    private FeePaymentRepository feePaymentRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/attendance")
    public ResponseEntity<?> getWardAttendance() {
        try {
            String regNo = getLinkedStudentRegNo();
            return ResponseEntity.ok(attendanceService.getAttendanceByStudent(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/marks")
    public ResponseEntity<?> getWardMarks() {
        try {
            String regNo = getLinkedStudentRegNo();
            return ResponseEntity.ok(markService.getMarksByStudent(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/fees")
    public ResponseEntity<?> getWardFees() {
        try {
            String regNo = getLinkedStudentRegNo();
            return ResponseEntity.ok(feeService.getFeesByStudent(regNo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PARENT')")
    @PostMapping("/fees/{feeId}/pay")
    public ResponseEntity<?> payWardFee(@PathVariable Long feeId) {
        try {
            FeePayment payment = feePaymentRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee record not found"));
            payment.setStatus("PAID");
            payment.setPaidDate(java.time.LocalDate.now().toString());
            payment.setReceiptNumber("RCP" + System.currentTimeMillis() % 10000000L);
            feePaymentRepository.save(payment);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('PARENT')")
    @GetMapping("/announcements")
    public ResponseEntity<?> getAnnouncements() {
        try {
            return ResponseEntity.ok(announcementRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String getLinkedStudentRegNo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Logged in user details not found"));
        if (user.getLinkedId() == null || user.getLinkedId().isEmpty()) {
            throw new RuntimeException("No ward linked to this parent account");
        }
        return user.getLinkedId();
    }
}
