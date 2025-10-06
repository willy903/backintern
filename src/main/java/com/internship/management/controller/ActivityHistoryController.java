package com.internship.management.controller;

import com.internship.management.dto.ActivityHistoryDTO;
import com.internship.management.dto.ApiResponse;
import com.internship.management.service.ActivityHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActivityHistoryController {

    private final ActivityHistoryService activityHistoryService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ActivityHistoryDTO>>> getUserActivities(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Activités utilisateur récupérées", activityHistoryService.getUserActivities(userId)));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<ActivityHistoryDTO>>> getRecentActivities() {
        return ResponseEntity.ok(ApiResponse.success("Activités récentes", activityHistoryService.getRecentActivities()));
    }

    @GetMapping("/entity")
    public ResponseEntity<ApiResponse<List<ActivityHistoryDTO>>> getEntityActivities(
            @RequestParam String entityType,
            @RequestParam Long entityId
    ) {
        return ResponseEntity.ok(ApiResponse.success("Activités de l'entité", activityHistoryService.getEntityActivities(entityType, entityId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ActivityHistoryDTO>> logActivity(@RequestBody ActivityHistoryDTO activityDTO) {
        try {
            ActivityHistoryDTO created = activityHistoryService.logActivity(activityDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Activité enregistrée", created));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
