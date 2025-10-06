package com.internship.management.controller;

import com.internship.management.dto.ApiResponse;
import com.internship.management.dto.CreateInternRequest;
import com.internship.management.dto.InternDTO;
import com.internship.management.entity.Intern;
import com.internship.management.service.InternService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interns")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InternController {

    private final InternService internService;

    @PostMapping
    public ResponseEntity<ApiResponse<InternDTO>> createIntern(@RequestBody CreateInternRequest request) {
        try {
            System.out.println("=== CONTROLLER: Received CreateInternRequest ===");
            System.out.println("Raw encadreurId from request: " + request.getEncadreurId());
            System.out.println("Request toString: " + request.toString());

            InternDTO intern = internService.createIntern(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("INTERN_CREATED", intern));
        } catch (RuntimeException e) {
            System.out.println("ERROR in controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InternDTO>>> getAllInterns(
            @RequestParam(required = false) Long encadreurId,
            @RequestParam(required = false) Long encadreurUserId,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status
    ) {
        if (encadreurId != null) {
            return ResponseEntity.ok(ApiResponse.success("INTERN_LIST_BY_ENCADREUR", internService.getInternsByEncadreur(encadreurId)));
        }
        if (encadreurUserId != null) {
            return ResponseEntity.ok(ApiResponse.success("INTERN_LIST_BY_ENCADREUR_USER", internService.getInternsByEncadreurUserId(encadreurUserId)));
        }
        if (department != null) {
            return ResponseEntity.ok(ApiResponse.success("INTERN_LIST_BY_DEPARTMENT", internService.getInternsByDepartment(department)));
        }
        if (status != null) {
            Intern.InternshipStatus internStatus = Intern.InternshipStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(ApiResponse.success("INTERN_LIST_BY_STATUS", internService.getInternsByStatus(internStatus)));
        }
        return ResponseEntity.ok(ApiResponse.success("INTERN_LIST", internService.getAllInterns()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InternDTO>> getInternById(@PathVariable Long id) {
        try {
            InternDTO intern = internService.getInternById(id);
            return ResponseEntity.ok(ApiResponse.success("INTERN_FOUND", intern));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InternDTO>> updateIntern(
            @PathVariable Long id,
            @RequestBody CreateInternRequest request
    ) {
        try {
            InternDTO intern = internService.updateIntern(id, request);
            return ResponseEntity.ok(ApiResponse.success("INTERN_UPDATED", intern));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<InternDTO>> updateInternStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        try {
            String statusStr = request.get("status");
            Intern.InternshipStatus status = Intern.InternshipStatus.valueOf(statusStr.toUpperCase());
            InternDTO intern = internService.updateInternStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("INTERN_STATUS_UPDATED", intern));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIntern(@PathVariable Long id) {
        try {
            internService.deleteIntern(id);
            return ResponseEntity.ok(ApiResponse.success("INTERN_DELETED", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(e.getMessage()));
        }
    }
}
