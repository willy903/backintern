package com.internship.management.controller;

import com.internship.management.dto.ApiResponse;
import com.internship.management.dto.DashboardDTO;
import com.internship.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<DashboardDTO.DashboardMetrics>> getMetrics(
            @RequestParam Long userId
    ) {
        try {
            DashboardDTO.DashboardMetrics metrics = dashboardService.getMetrics(userId);
            return ResponseEntity.ok(ApiResponse.success("METRICS_FETCHED", metrics));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DashboardDTO.DepartmentStats>>> getDepartmentStats() {
        try {
            return ResponseEntity.ok(ApiResponse.success("DEPARTMENT_STATS_FETCHED", dashboardService.getDepartmentStats()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/project-status")
    public ResponseEntity<ApiResponse<DashboardDTO.ProjectStatusStats>> getProjectStatusStats() {
        try {
            return ResponseEntity.ok(ApiResponse.success("PROJECT_STATUS_FETCHED", dashboardService.getProjectStatusStats()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/task-stats")
    public ResponseEntity<ApiResponse<DashboardDTO.TaskStats>> getTaskStats() {
        try {
            return ResponseEntity.ok(ApiResponse.success("TASK_STATS_FETCHED", dashboardService.getTaskStats()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
