package com.example.demo.service;

import com.example.demo.model.PlacementApplication;
import com.example.demo.repository.PlacementApplicationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PlacementApplicationService {
    @Autowired
    private PlacementApplicationRepository repository;

    public List<PlacementApplication> getAll() { return repository.findAll(); }
    public PlacementApplication getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("PlacementApplication not found")); }
    public PlacementApplication create(PlacementApplication item) { return repository.save(item); }
    public PlacementApplication update(Long id, PlacementApplication item) {
        PlacementApplication existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
