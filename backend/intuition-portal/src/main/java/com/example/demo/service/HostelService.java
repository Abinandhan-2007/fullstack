package com.example.demo.service;

import com.example.demo.dto.ComplaintDTO;
import com.example.demo.dto.HostelAllocationDTO;
import com.example.demo.model.Complaint;
import com.example.demo.model.HostelAllocation;
import com.example.demo.repository.ComplaintRepository;
import com.example.demo.repository.HostelAllocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HostelService {

    @Autowired
    private HostelAllocationRepository hostelAllocationRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    public HostelAllocationDTO getHostelAllocation(String registerNumber) {
        Optional<HostelAllocation> allocationOpt = hostelAllocationRepository.findByRegisterNumber(registerNumber);
        
        if (allocationOpt.isPresent()) {
            HostelAllocation allocation = allocationOpt.get();
            HostelAllocationDTO dto = new HostelAllocationDTO();
            dto.setBlock(allocation.getBlock() != null ? allocation.getBlock() : "N/A");
            
            // Extracting floor from room number if not available (e.g., room 304 -> 3rd Floor)
            String room = allocation.getRoomNumber();
            dto.setRoomNumber(room != null ? room : "N/A");
            
            if (room != null && room.length() >= 3 && Character.isDigit(room.charAt(0))) {
                dto.setFloor(room.charAt(0) + " Floor");
            } else {
                dto.setFloor("Ground Floor");
            }
            
            dto.setBedNumber("A1"); // Defaults since HostelAllocation doesn't store bed numbers yet
            return dto;
        }
        
        return null;
    }

    public List<ComplaintDTO> getComplaints(String registerNumber) {
        List<Complaint> complaints = complaintRepository.findByRaisedByOrderBySubmittedAtDesc(registerNumber);
        return complaints.stream().map(c -> new ComplaintDTO(
                c.getId(),
                c.getDescription(),
                c.getStatus(),
                c.getSubmittedAt()
        )).collect(Collectors.toList());
    }

    public ComplaintDTO submitComplaint(String registerNumber, String description) {
        Complaint complaint = new Complaint();
        complaint.setSubject("Hostel Maintenance Request");
        complaint.setDescription(description);
        complaint.setRaisedBy(registerNumber);
        complaint.setUserRole("STUDENT");
        complaint.setStatus("PENDING");
        
        Complaint saved = complaintRepository.save(complaint);
        return new ComplaintDTO(saved.getId(), saved.getDescription(), saved.getStatus(), saved.getSubmittedAt());
    }
}
