package com.internship.management.dto;

import com.internship.management.entity.ActivityHistory;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityHistoryDTO {
    private Long id;
    private Long userId;
    private String action;
    private String entityType;
    private Long entityId;
    private String description;
    private String metadata;
    private LocalDateTime createdAt;

    public static ActivityHistoryDTO fromEntity(ActivityHistory activity) {
        return ActivityHistoryDTO.builder()
                .id(activity.getId())
                .userId(activity.getUser().getId())
                .action(activity.getAction())
                .entityType(activity.getEntityType())
                .entityId(activity.getEntityId())
                .description(activity.getDescription())
                .metadata(activity.getMetadata())
                .createdAt(activity.getCreatedAt())
                .build();
    }
}
