package com.example.demo.service;

import com.example.demo.model.HostelRoom;
import com.example.demo.repository.HostelRoomRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HostelRoomService {
    @Autowired
    private HostelRoomRepository repository;

    public List<HostelRoom> getAll() { return repository.findAll(); }
    public HostelRoom getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("HostelRoom not found")); }
    public HostelRoom create(HostelRoom item) { return repository.save(item); }
    public HostelRoom update(Long id, HostelRoom item) {
        HostelRoom existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
