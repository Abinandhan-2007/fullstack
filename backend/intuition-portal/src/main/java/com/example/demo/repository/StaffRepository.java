package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.StaffMember;

@Repository
public interface StaffRepository extends JpaRepository<StaffMember, Long> {
    // Finds a staff member by their Google Email
    StaffMember findByEmail(String email);
}