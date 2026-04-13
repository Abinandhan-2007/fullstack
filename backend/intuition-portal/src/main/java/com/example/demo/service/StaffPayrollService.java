package com.example.demo.service;

import com.example.demo.model.StaffPayroll;
import com.example.demo.repository.StaffPayrollRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StaffPayrollService {
    @Autowired
    private StaffPayrollRepository repository;

    public List<StaffPayroll> getAll() { return repository.findAll(); }
    public StaffPayroll getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("StaffPayroll not found")); }
    public StaffPayroll create(StaffPayroll item) { return repository.save(item); }
    public StaffPayroll update(Long id, StaffPayroll item) {
        StaffPayroll existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
