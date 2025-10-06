package com.internship.management.service;

import com.internship.management.dto.ActivityHistoryDTO;
import com.internship.management.entity.ActivityHistory;
import com.internship.management.entity.User;
import com.internship.management.repository.ActivityHistoryRepository;
import com.internship.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityHistoryService {

    private final ActivityHistoryRepository activityHistoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ActivityHistoryDTO> getUserActivities(Long userId) {
        return activityHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ActivityHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityHistoryDTO> getRecentActivities() {
        return activityHistoryRepository.findTop20ByOrderByCreatedAtDesc().stream()
                .map(ActivityHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityHistoryDTO> getEntityActivities(String entityType, Long entityId) {
        return activityHistoryRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId).stream()
                .map(ActivityHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ActivityHistoryDTO logActivity(ActivityHistoryDTO activityDTO) {
        User user = userRepository.findById(activityDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        ActivityHistory activity = ActivityHistory.builder()
                .user(user)
                .action(activityDTO.getAction())
                .entityType(activityDTO.getEntityType())
                .entityId(activityDTO.getEntityId())
                .description(activityDTO.getDescription())
                .metadata(activityDTO.getMetadata())
                .build();

        ActivityHistory saved = activityHistoryRepository.save(activity);
        return ActivityHistoryDTO.fromEntity(saved);
    }
}
