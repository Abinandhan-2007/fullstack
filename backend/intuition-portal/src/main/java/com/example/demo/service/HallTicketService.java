package com.example.demo.service;

import com.example.demo.model.HallTicket;
import com.example.demo.repository.HallTicketRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HallTicketService {
    @Autowired
    private HallTicketRepository repository;

    public List<HallTicket> getAll() { return repository.findAll(); }
    public HallTicket getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("HallTicket not found")); }
    public HallTicket create(HallTicket item) { return repository.save(item); }
    public HallTicket update(Long id, HallTicket item) {
        HallTicket existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
