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
