package com.example.demo.repository;

import com.example.demo.model.HostelComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HostelComplaintRepository extends JpaRepository<HostelComplaint, Long> {
    List<HostelComplaint> findByStudent_RegisterNumber(String registerNumber);
}
