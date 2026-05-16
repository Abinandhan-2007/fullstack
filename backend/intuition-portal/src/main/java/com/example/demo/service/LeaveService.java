package com.example.demo.service;

import com.example.demo.dto.LeaveRequestDTO;
import com.example.demo.model.StaffLeave;
import com.example.demo.model.Staff;
import com.example.demo.repository.StaffLeaveRepository;
import com.example.demo.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
public class LeaveService {
    @Autowired
    private StaffLeaveRepository leaveRepository;
    @Autowired
    private StaffRepository staffRepository;

    public LeaveRequestDTO applyStaffLeave(LeaveRequestDTO dto) {
        try {
            Staff staff = staffRepository.findByStaffId(dto.getStaffId()).orElseThrow(()->new RuntimeException("Staff not found"));
            StaffLeave leave = new StaffLeave();
            leave.setStaff(staff);
            leave.setLeaveType(dto.getLeaveType());
            leave.setFromDate(dto.getFromDate());
            leave.setToDate(dto.getToDate());
            leave.setDays(dto.getDays());
            leave.setReason(dto.getReason());
            leave.setStatus("PENDING");
            leave.setAppliedOn(LocalDate.now().toString());
            leave = leaveRepository.save(leave);
            return mapToDTO(leave);
        } catch (Exception e) {
            throw new RuntimeException("Error applying leave: " + e.getMessage());
        }
    }

    public List<LeaveRequestDTO> getLeavesByStaff(String staffId) {
        try {
            return leaveRepository.findByStaff_StaffId(staffId).stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching leaves: " + e.getMessage());
        }
    }

    public List<LeaveRequestDTO> getAllPendingLeaves() {
        try {
            return leaveRepository.findByStatus("PENDING").stream().map(this::mapToDTO).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching leaves: " + e.getMessage());
        }
    }

    public LeaveRequestDTO approveLeave(Long id) {
        try {
            StaffLeave leave = leaveRepository.findById(id).orElseThrow();
            leave.setStatus("APPROVED");
            return mapToDTO(leaveRepository.save(leave));
        } catch (Exception e) {
            throw new RuntimeException("Error approving: " + e.getMessage());
        }
    }

    public LeaveRequestDTO rejectLeave(Long id, String reason) {
        try {
            StaffLeave leave = leaveRepository.findById(id).orElseThrow();
            leave.setStatus("REJECTED");
            leave.setRejectionReason(reason);
            return mapToDTO(leaveRepository.save(leave));
        } catch (Exception e) {
            throw new RuntimeException("Error rejecting: " + e.getMessage());
        }
    }

    private LeaveRequestDTO mapToDTO(StaffLeave leave) {
        LeaveRequestDTO dto = new LeaveRequestDTO();
        dto.setId(leave.getId());
        dto.setStaffId(leave.getStaff() != null ? leave.getStaff().getStaffId() : null);
        dto.setLeaveType(leave.getLeaveType());
        dto.setFromDate(leave.getFromDate());
        dto.setToDate(leave.getToDate());
        dto.setDays(leave.getDays());
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getStatus());
        dto.setAppliedOn(leave.getAppliedOn());
        dto.setRejectionReason(leave.getRejectionReason());
        return dto;
    }
}
