package com.example.demo.repository;

import com.example.demo.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    // Orders announcements from newest to oldest
    List<Announcement> findAllByOrderByPostedAtDesc();
}