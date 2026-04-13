package com.example.demo.repository;

import com.example.demo.model.HostelRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostelRoomRepository extends JpaRepository<HostelRoom, Long> {
}
