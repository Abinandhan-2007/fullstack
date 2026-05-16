package com.example.demo.repository;

import com.example.demo.model.SecurityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SecurityLogRepository extends JpaRepository<SecurityLog, Long> {
    List<SecurityLog> findByStatus(String status);
}
