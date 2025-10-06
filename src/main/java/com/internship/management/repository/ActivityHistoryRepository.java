package com.internship.management.repository;

import com.internship.management.entity.ActivityHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityHistoryRepository extends JpaRepository<ActivityHistory, Long> {
    List<ActivityHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ActivityHistory> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, Long entityId);
    List<ActivityHistory> findTop20ByOrderByCreatedAtDesc();
}
