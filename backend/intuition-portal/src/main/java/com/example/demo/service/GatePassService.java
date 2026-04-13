package com.example.demo.service;

import com.example.demo.model.GatePass;
import com.example.demo.repository.GatePassRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GatePassService {
    @Autowired
    private GatePassRepository repository;

    public List<GatePass> getAll() { return repository.findAll(); }
    public GatePass getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("GatePass not found")); }
    public GatePass create(GatePass item) { return repository.save(item); }
    public GatePass update(Long id, GatePass item) {
        GatePass existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
