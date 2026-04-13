package com.example.demo.service;

import com.example.demo.model.ReEvaluationRequest;
import com.example.demo.repository.ReEvaluationRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReEvaluationRequestService {
    @Autowired
    private ReEvaluationRequestRepository repository;

    public List<ReEvaluationRequest> getAll() { return repository.findAll(); }
    public ReEvaluationRequest getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("ReEvaluationRequest not found")); }
    public ReEvaluationRequest create(ReEvaluationRequest item) { return repository.save(item); }
    public ReEvaluationRequest update(Long id, ReEvaluationRequest item) {
        ReEvaluationRequest existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
