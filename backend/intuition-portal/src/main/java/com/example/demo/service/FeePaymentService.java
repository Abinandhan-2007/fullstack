package com.example.demo.service;

import com.example.demo.model.FeePayment;
import com.example.demo.repository.FeePaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeePaymentService {
    @Autowired
    private FeePaymentRepository repository;

    public List<FeePayment> getAll() { return repository.findAll(); }
    public FeePayment getById(Long id) { return repository.findById(id).orElseThrow(() -> new EntityNotFoundException("FeePayment not found")); }
    public FeePayment create(FeePayment item) { return repository.save(item); }
    public FeePayment update(Long id, FeePayment item) {
        FeePayment existing = getById(id);
        item.setId(id);
        return repository.save(item);
    }
    public void delete(Long id) { repository.deleteById(id); }
}
