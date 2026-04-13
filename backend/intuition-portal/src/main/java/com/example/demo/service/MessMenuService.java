package com.example.demo.service;

import com.example.demo.model.MessMenu;
import com.example.demo.repository.MessMenuRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MessMenuService {
    @Autowired
    private MessMenuRepository repository;

    public List<MessMenu> getAll() { return repository.findAll(); }
    public MessMenu getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("MessMenu not found")); }
    public MessMenu create(MessMenu item) { return repository.save(item); }
    public MessMenu update(Long id, MessMenu item) {
        MessMenu existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
