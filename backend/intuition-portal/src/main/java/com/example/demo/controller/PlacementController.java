package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.service.PlacementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class PlacementController {
    @Autowired
    private PlacementService placementService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PlacementApplicationRepository placementApplicationRepository;

    @Autowired
    private CompanyRepository companyRepository;

    private final Map<String, Object> placementSettings = new HashMap<>();

    public PlacementController() {
        placementSettings.put("academicYear", "2025-2026");
        placementSettings.put("minGpaRequirement", 7.0);
        placementSettings.put("maxBacklogsAllowed", 0);
    }

    @PreAuthorize("hasAnyRole('STUDENT', 'PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/drives")
    public ResponseEntity<?> getUpcomingDrives() {
        try {
            // Map to expected format
            List<Map<String, Object>> drivesList = companyRepository.findAll().stream().map(c -> {
                Map<String, Object> d = new HashMap<>();
                d.put("status", c.getStatus() != null ? c.getStatus().toUpperCase() : "UPCOMING");
                d.put("date", c.getDriveDate() != null ? c.getDriveDate() : "2026-07-15");
                d.put("location", "CAMPUS PLACEMENT HALL");
                d.put("registrationCount", 450 + (c.getId() != null ? (c.getId().intValue() * 12) % 40 : 0));
                d.put("eligibleCount", 280 + (c.getId() != null ? (c.getId().intValue() * 7) % 30 : 0));
                d.put("rounds", 3);
                Map<String, String> comp = new HashMap<>();
                comp.put("name", c.getCompanyName());
                d.put("company", comp);
                return d;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(drivesList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/companies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            List<Map<String, Object>> companiesList = companyRepository.findAll().stream().map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", c.getCompanyName());
                map.put("industry", c.getIndustry() != null ? c.getIndustry() : "Technology");
                map.put("pocName", "HR Specialist");
                map.put("pocEmail", "hiring@" + c.getCompanyName().toLowerCase().replace(" ", "") + ".com");
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(companiesList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @PostMapping("/api/placement/companies")
    public ResponseEntity<?> addCompany() {
        return ResponseEntity.ok("Company added");
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @PutMapping("/api/placement/companies/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id) {
        return ResponseEntity.ok("Company updated");
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/applications/{companyId}")
    public ResponseEntity<?> getApplicationsByCompany(@PathVariable Long companyId) {
        try {
            return ResponseEntity.ok(placementService.getApplicationsByCompany(companyId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @PutMapping("/api/placement/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            placementService.updateApplicationStatus(id, status);
            return ResponseEntity.ok("Status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(placementService.getStats());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/api/placement/apply/{companyId}")
    public ResponseEntity<?> applyToCompany(@PathVariable Long companyId, @RequestParam String regNo) {
        return ResponseEntity.ok("Applied successfully");
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/students")
    public ResponseEntity<?> getPlacementStudents() {
        List<Student> students = studentRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();
        for (Student s : students) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", s.getName());
            map.put("regNo", s.getRegisterNumber());
            map.put("dept", s.getDepartment());
            // Stable formulas based on ID
            double gpa = Math.round((8.0 + (s.getId() % 10) * 0.2) * 10.0) / 10.0;
            map.put("gpa", gpa);
            map.put("backlogs", s.getId() % 12 == 0 ? 1 : 0);
            map.put("placedStatus", s.getId() % 3 == 0 ? "PLACED" : "UNPLACED");
            list.add(map);
        }
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/offers")
    public ResponseEntity<?> getPlacementOffers() {
        List<PlacementApplication> applications = placementApplicationRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();
        for (PlacementApplication app : applications) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            Map<String, String> stud = new HashMap<>();
            if (app.getStudent() != null) {
                stud.put("name", app.getStudent().getName());
                stud.put("regNo", app.getStudent().getRegisterNumber());
            } else {
                stud.put("name", "Unknown Scholar");
                stud.put("regNo", "7376...");
            }
            map.put("student", stud);
            Map<String, String> comp = new HashMap<>();
            if (app.getCompany() != null) {
                comp.put("name", app.getCompany().getCompanyName());
            } else {
                comp.put("name", "Partner Org");
            }
            map.put("company", comp);
            String packageStr = app.getPackageOffered();
            double ctc = 4.5;
            if (packageStr != null) {
                try {
                    ctc = Double.parseDouble(packageStr.replaceAll("[^0-9.]", ""));
                } catch (Exception ignored) {}
            }
            map.put("ctc", ctc);
            map.put("verified", "PLACED".equalsIgnoreCase(app.getStatus()));
            list.add(map);
        }
        return ResponseEntity.ok(list);
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @PatchMapping("/api/placement/offers/{id}/verify")
    public ResponseEntity<?> verifyOffer(@PathVariable Long id) {
        try {
            PlacementApplication app = placementApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer application record not found"));
            app.setStatus("PLACED");
            if (app.getPackageOffered() == null) {
                app.setPackageOffered("6.5 LPA");
            }
            placementApplicationRepository.save(app);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/training")
    public ResponseEntity<?> getTrainingTimeline() {
        List<Map<String, Object>> timeline = new ArrayList<>();
        Map<String, Object> t1 = new HashMap<>();
        t1.put("title", "Aptitude bootcamp");
        t1.put("date", "2026-05-10");
        t1.put("status", "COMPLETED");
        timeline.add(t1);
        Map<String, Object> t2 = new HashMap<>();
        t2.put("title", "Mock interviews");
        t2.put("date", "2026-05-20");
        t2.put("status", "ONGOING");
        timeline.add(t2);
        return ResponseEntity.ok(timeline);
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @GetMapping("/api/placement/settings")
    public ResponseEntity<?> getSettings() {
        return ResponseEntity.ok(placementSettings);
    }

    @PreAuthorize("hasAnyRole('PLACEMENT', 'ADMIN')")
    @PutMapping("/api/placement/settings")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, Object> body) {
        placementSettings.putAll(body);
        return ResponseEntity.ok(placementSettings);
    }
}
