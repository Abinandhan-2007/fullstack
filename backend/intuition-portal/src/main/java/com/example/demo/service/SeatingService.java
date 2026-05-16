package com.example.demo.service;

import com.example.demo.dto.SeatingDTO;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SeatingService {

    public List<SeatingDTO> getSeatingByExam(Long examId) {
        try {
            return List.of();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching seating: " + e.getMessage());
        }
    }

    public List<SeatingDTO> generateSeating(Long examId) {
        try {
            return List.of();
        } catch (Exception e) {
            throw new RuntimeException("Error generating seating: " + e.getMessage());
        }
    }

    public void updateSeat(Long id, SeatingDTO dto) {
        try {
            // Update seat logic
        } catch (Exception e) {
            throw new RuntimeException("Error updating seat: " + e.getMessage());
        }
    }
}
