package com.example.demo.repository;

import com.example.demo.model.PlacementApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlacementApplicationRepository extends JpaRepository<PlacementApplication, Long> {
    List<PlacementApplication> findByCompany_IdAndStatus(Long companyId, String status);
}
