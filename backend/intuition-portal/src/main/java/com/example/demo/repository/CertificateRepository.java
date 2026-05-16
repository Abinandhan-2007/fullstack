package com.example.demo.repository;

import com.example.demo.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudent_RegisterNumber(String registerNumber);
}
