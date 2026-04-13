package com.example.demo.repository;

import com.example.demo.model.GatePass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GatePassRepository extends JpaRepository<GatePass, Long> {
}
