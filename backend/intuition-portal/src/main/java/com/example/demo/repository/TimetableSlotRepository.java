package com.example.demo.repository;

import com.example.demo.model.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimetableSlotRepository extends JpaRepository<TimetableSlot, Long> {
    List<TimetableSlot> findByDayAndYearAndSection(String day, String year, String section);
    List<TimetableSlot> findByStaff_Id(Long staffId);
}
