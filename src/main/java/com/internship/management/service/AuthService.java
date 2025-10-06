package com.internship.management.service;

import com.internship.management.dto.AuthDTO;
import com.internship.management.dto.UserDTO;
import com.internship.management.dto.MessageCode;
import com.internship.management.entity.Encadreur;
import com.internship.management.entity.Intern;
import com.internship.management.entity.User;
import com.internship.management.repository.EncadreurRepository;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.UserRepository;
import com.internship.management.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EncadreurRepository encadreurRepository;
    private final InternRepository internRepository;

    @Transactional(readOnly = true)
    public AuthDTO.CheckEmailResponse checkEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return AuthDTO.CheckEmailResponse.builder()
                    .exists(false)
                    .hasPassword(false)
                    .message(MessageCode.USER_NOT_FOUND.name())
                    .build();
        }

        boolean hasPassword = user.getPassword() != null && !user.getPassword().isEmpty();

        return AuthDTO.CheckEmailResponse.builder()
                .exists(true)
                .hasPassword(hasPassword)
                .message(hasPassword ? MessageCode.LOGIN_SUCCESS.name() : MessageCode.ACCOUNT_NOT_ACTIVATED.name())
                .build();
    }

    @Transactional
    public AuthDTO.AuthResponse createPassword(AuthDTO.CreatePasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(MessageCode.USER_NOT_FOUND.name()));

        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            throw new RuntimeException(MessageCode.USER_EXIST.name());
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAccountStatus(User.AccountStatus.ACTIVE);
        userRepository.save(user);

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole().name()
        );

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .user(UserDTO.fromEntity(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            throw new RuntimeException(MessageCode.USER_NOT_FOUND.name());
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new RuntimeException(MessageCode.ACCOUNT_NOT_ACTIVATED.name());
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException(MessageCode.INCORRECT_PASSWORD.name());
        }

        if (user.getAccountStatus() != User.AccountStatus.ACTIVE) {
            throw new RuntimeException(MessageCode.ACCOUNT_DISABLED.name());
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole().name()
        );

        return AuthDTO.AuthResponse.builder()
                .token(token)
                .user(UserDTO.fromEntity(user))
                .build();
    }

    @Transactional
    public UserDTO createAdmin(AuthDTO.CreateAdminRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(MessageCode.USER_EXIST.name());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .phone(request.getPhone())
                .department(request.getDepartement())
                .role(User.Role.ADMIN)
                .accountStatus(User.AccountStatus.ACTIVE)
                .build();

        user = userRepository.save(user);
        return UserDTO.fromEntity(user);
    }

    @Transactional
    public UserDTO createEncadreur(AuthDTO.CreateEncadreurRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(MessageCode.USER_EXIST.name());
        }

        User user = User.builder()
                .email(request.getEmail())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .phone(request.getPhone())
                .department(request.getDepartement())
                .role(User.Role.ENCADREUR)
                .accountStatus(User.AccountStatus.PENDING)
                .build();

        user = userRepository.save(user);

        Encadreur encadreur = Encadreur.builder()
                .user(user)
                .department(request.getDepartement())
                .specialization(request.getSpecialization() != null ?
                        request.getSpecialization() : request.getDepartement())
                .build();

        encadreurRepository.save(encadreur);
        return UserDTO.fromEntity(user);
    }

    @Transactional
    public UserDTO createStagiaire(AuthDTO.CreateStagiaireRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(MessageCode.USER_EXIST.name());
        }

        User user = User.builder()
                .email(request.getEmail())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .phone(request.getPhone())
                .department(request.getDepartement())
                .role(User.Role.STAGIAIRE)
                .accountStatus(User.AccountStatus.PENDING)
                .build();

        user = userRepository.save(user);

        Encadreur encadreur = null;
        if (request.getEncadreurId() != null) {
            encadreur = encadreurRepository.findByUserId(request.getEncadreurId())
                    .orElseThrow(() -> new RuntimeException(MessageCode.USER_NOT_FOUND.name()));
        }

        Intern intern = Intern.builder()
                .user(user)
                .encadreur(encadreur)
                .school(request.getSchool())
                .department(request.getMajor())
                .startDate(request.getStartDate() != null ? LocalDate.parse(request.getStartDate()) : null)
                .endDate(request.getEndDate() != null ? LocalDate.parse(request.getEndDate()) : null)
                .status(Intern.InternshipStatus.PENDING)
                .build();

        internRepository.save(intern);
        return UserDTO.fromEntity(user);
    }

    @Transactional
    public UserDTO initializeDefaultAdmin() {
        String defaultEmail = "admin@internship.com";
        String defaultPassword = "Admin@2024";

        if (userRepository.existsByEmail(defaultEmail)) {
            throw new RuntimeException(MessageCode.USER_EXIST.name());
        }

        User user = User.builder()
                .email(defaultEmail)
                .password(passwordEncoder.encode(defaultPassword))
                .nom("Admin")
                .prenom("System")
                .phone("+212600000000")
                .department("IT")
                .role(User.Role.ADMIN)
                .accountStatus(User.AccountStatus.ACTIVE)
                .build();

        user = userRepository.save(user);
        return UserDTO.fromEntity(user);
    }
}
