package com.example.demo.service;

import com.example.demo.model.HostelAllocation;
import com.example.demo.repository.HostelAllocationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HostelAllocationService {
    @Autowired
    private HostelAllocationRepository repository;

    public List<HostelAllocation> getAll() { return repository.findAll(); }
    public HostelAllocation getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("HostelAllocation not found")); }
    public HostelAllocation create(HostelAllocation item) { return repository.save(item); }
    public HostelAllocation update(Long id, HostelAllocation item) {
        HostelAllocation existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
