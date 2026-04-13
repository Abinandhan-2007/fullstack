package com.example.demo.service;

import com.example.demo.model.FeeStructure;
import com.example.demo.repository.FeeStructureRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeeStructureService {
    @Autowired
    private FeeStructureRepository repository;

    public List<FeeStructure> getAll() { return repository.findAll(); }
    public FeeStructure getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("FeeStructure not found")); }
    public FeeStructure create(FeeStructure item) { return repository.save(item); }
    public FeeStructure update(Long id, FeeStructure item) {
        FeeStructure existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
