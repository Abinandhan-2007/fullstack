package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.StaffMember;
import com.example.demo.repository.StaffRepository;

@RestController
@RequestMapping("/api/host")
@CrossOrigin(origins = "*") 
public class HostController {

    @Autowired
    private StaffRepository staffRepository;

    @GetMapping("/all-staff")
    public List<StaffMember> getAllStaff() {
        return staffRepository.findAll();
    }

    @PostMapping("/add-staff")
    public StaffMember addStaff(@RequestBody StaffMember staff) {
        return staffRepository.save(staff);
    }
}