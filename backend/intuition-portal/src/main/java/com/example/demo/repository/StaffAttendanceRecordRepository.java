package com.example.demo.repository;

import com.example.demo.model.StaffAttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StaffAttendanceRecordRepository extends JpaRepository<StaffAttendanceRecord, Long> {
    List<StaffAttendanceRecord> findByDate(String date);
}
