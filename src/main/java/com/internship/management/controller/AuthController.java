package com.internship.management.controller;

import com.internship.management.dto.ApiResponse;
import com.internship.management.dto.AuthDTO;
import com.internship.management.dto.UserDTO;
import com.internship.management.dto.MessageCode;
import com.internship.management.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/check-email")
    public ResponseEntity<ApiResponse<AuthDTO.CheckEmailResponse>> checkEmail(
            @RequestBody AuthDTO.CheckEmailRequest request) {
        try {
            AuthDTO.CheckEmailResponse response = authService.checkEmail(request.getEmail());
            return ResponseEntity.ok(ApiResponse.success(MessageCode.EMAIL_CHECKED.name(), response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/create-password")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> createPassword(
            @RequestBody AuthDTO.CreatePasswordRequest request) {
        try {
            AuthDTO.AuthResponse response = authService.createPassword(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(MessageCode.PASSWORD_CREATED.name(), response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> login(
            @RequestBody AuthDTO.LoginRequest request) {
        try {
            AuthDTO.AuthResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success(MessageCode.LOGIN_SUCCESS.name(), response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse<UserDTO>> createAdmin(@RequestBody AuthDTO.CreateAdminRequest request) {
        try {
            UserDTO user = authService.createAdmin(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(MessageCode.ADMIN_CREATED.name(), user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/init-admin")
    public ResponseEntity<ApiResponse<UserDTO>> initializeAdmin() {
        try {
            UserDTO user = authService.initializeDefaultAdmin();
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(MessageCode.DEFAULT_ADMIN_CREATED.name(), user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register/encadreur")
    public ResponseEntity<ApiResponse<UserDTO>> createEncadreur(@RequestBody AuthDTO.CreateEncadreurRequest request) {
        try {
            UserDTO user = authService.createEncadreur(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(MessageCode.ENCADREUR_CREATED.name(), user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register/stagiaire")
    public ResponseEntity<ApiResponse<UserDTO>> createStagiaire(@RequestBody AuthDTO.CreateStagiaireRequest request) {
        try {
            UserDTO user = authService.createStagiaire(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(MessageCode.STAGIAIRE_CREATED.name(), user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Déconnexion réussie", null));
    }
}
