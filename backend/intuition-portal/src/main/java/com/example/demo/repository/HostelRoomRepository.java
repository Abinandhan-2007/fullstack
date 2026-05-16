package com.example.demo.repository;

import com.example.demo.model.HostelRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HostelRoomRepository extends JpaRepository<HostelRoom, Long> {
    List<HostelRoom> findByBlock(String block);
}
