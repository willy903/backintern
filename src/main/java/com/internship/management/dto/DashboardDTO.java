package com.internship.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
public class DashboardDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardMetrics {
        private Long totalInterns;
        private Long activeProjects;
        private Long completedTasks;
        private Double successRate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentStats {
        private String department;
        private Long internCount;
        private Long projectCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectStatusStats {
        private Long todoCount;
        private Long inProgressCount;
        private Long doneCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaskStats {
        private Long totalTasks;
        private Long completedTasks;
        private Long pendingTasks;
        private Long overdueTasks;
        private Map<String, Long> tasksByPriority;
    }
}

