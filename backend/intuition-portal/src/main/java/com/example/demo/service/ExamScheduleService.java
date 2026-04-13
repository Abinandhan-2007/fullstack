package com.example.demo.service;

import com.example.demo.model.ExamSchedule;
import com.example.demo.repository.ExamScheduleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExamScheduleService {
    @Autowired
    private ExamScheduleRepository repository;

    public List<ExamSchedule> getAll() { return repository.findAll(); }
    public ExamSchedule getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("ExamSchedule not found")); }
    public ExamSchedule create(ExamSchedule item) { return repository.save(item); }
    public ExamSchedule update(Long id, ExamSchedule item) {
        ExamSchedule existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
