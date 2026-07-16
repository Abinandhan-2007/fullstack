package com.example.demo.service;

import com.example.demo.dto.HostelAllocationDTO;
import com.example.demo.dto.HostelComplaintDTO;
import com.example.demo.model.HostelAllocation;
import com.example.demo.model.HostelComplaint;
import com.example.demo.model.Student;
import com.example.demo.repository.HostelAllocationRepository;
import com.example.demo.repository.HostelComplaintRepository;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class HostelService {
    @Autowired
    private HostelAllocationRepository allocationRepository;
    @Autowired
    private HostelComplaintRepository complaintRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private com.example.demo.repository.HostelRoomRepository hostelRoomRepository;
    @Autowired
    private com.example.demo.repository.MessMenuRepository messMenuRepository;

    public List<com.example.demo.model.HostelRoom> getAllRooms() {
        return hostelRoomRepository.findAll();
    }

    public List<HostelComplaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public void updateComplaintStatus(Long id, String status) {
        HostelComplaint complaint = complaintRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        if ("RESOLVED".equalsIgnoreCase(status)) {
            complaint.setResolvedAt(LocalDate.now().toString());
        }
        complaintRepository.save(complaint);
    }

    public List<com.example.demo.model.MessMenu> getMessMenu() {
        return messMenuRepository.findAll();
    }

    public java.util.Map<String, Object> getHostelStats() {
        List<com.example.demo.model.HostelRoom> rooms = hostelRoomRepository.findAll();
        List<HostelComplaint> complaints = complaintRepository.findAll();

        long occupied = rooms.stream().filter(r -> "OCCUPIED".equalsIgnoreCase(r.getStatus())).count();
        long available = rooms.size() - occupied;
        long pending = complaints.stream().filter(c -> "OPEN".equalsIgnoreCase(c.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(c.getStatus())).count();
        double pct = rooms.isEmpty() ? 0.0 : ((double) occupied / rooms.size()) * 100.0;

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("metrics", java.util.Map.of(
            "occupancy", String.format("%.0f%%", pct),
            "pendingComplaints", pending,
            "stockAlerts", 3,
            "todayVisitors", 28
        ));
        stats.put("occupancyStats", java.util.Map.of(
            "occupied", occupied,
            "available", available
        ));
        return stats;
    }

    public HostelAllocationDTO getHostelDetails(String regNo) {
        try {
            List<HostelAllocation> allocs = allocationRepository.findByStudent_RegisterNumber(regNo);
            if(allocs.isEmpty()) return null;
            return mapToAllocationDTO(allocs.get(0));
        } catch (Exception e) {
            throw new RuntimeException("Error fetching hostel details: " + e.getMessage());
        }
    }

    public List<HostelComplaintDTO> getComplaints(String regNo) {
        try {
            return complaintRepository.findByStudent_RegisterNumber(regNo).stream().map(this::mapToComplaintDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching hostel complaints: " + e.getMessage());
        }
    }

    public HostelComplaintDTO submitComplaint(String regNo, String description) {
        try {
            Student student = studentRepository.findByRegisterNumber(regNo).orElseThrow(()->new RuntimeException("Student not found"));
            HostelComplaint complaint = new HostelComplaint();
            complaint.setStudent(student);
            complaint.setDescription(description);
            complaint.setStatus("OPEN");
            complaint.setCreatedAt(LocalDate.now().toString());
            complaint = complaintRepository.save(complaint);
            return mapToComplaintDTO(complaint);
        } catch (Exception e) {
            throw new RuntimeException("Error submitting complaint: " + e.getMessage());
        }
    }

    private HostelAllocationDTO mapToAllocationDTO(HostelAllocation alloc) {
        HostelAllocationDTO dto = new HostelAllocationDTO();
        dto.setId(alloc.getId());
        if(alloc.getRoom() != null) {
            dto.setRoomNumber(alloc.getRoom().getRoomNumber());
            dto.setBlock(alloc.getRoom().getBlock());
            dto.setFloor(alloc.getRoom().getFloor());
        }
        dto.setBedNumber(alloc.getBedNumber());
        dto.setAllocatedOn(alloc.getAllocatedOn());
        dto.setRoommateNames(new ArrayList<>());
        return dto;
    }

    private HostelComplaintDTO mapToComplaintDTO(HostelComplaint complaint) {
        HostelComplaintDTO dto = new HostelComplaintDTO();
        dto.setId(complaint.getId());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus());
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setResolvedAt(complaint.getResolvedAt());
        return dto;
    }
}
