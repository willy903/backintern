package com.internship.management.service;

import com.internship.management.dto.InternDTO;
import com.internship.management.dto.UserDTO;
import com.internship.management.entity.Encadreur;
import com.internship.management.entity.Intern;
import com.internship.management.entity.User;
import com.internship.management.repository.EncadreurRepository;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EncadreurService {

    private final EncadreurRepository encadreurRepository;
    private final InternRepository internRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserDTO> getAllEncadreurs() {
        List<User> encadreurs = userRepository.findByRole(User.Role.ENCADREUR);
        return encadreurs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDTO getEncadreurById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ENCADREUR_NOT_FOUND"));

        if (user.getRole() != User.Role.ENCADREUR) {
            throw new RuntimeException("NOT_AN_ENCADREUR");
        }

        return convertToDTO(user);
    }

    @Transactional(readOnly = true)
    public UserDTO getEncadreurByUserId(Long userId) {
        Encadreur encadreur = encadreurRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("ENCADREUR_NOT_FOUND"));

        return convertToDTOWithEncadreurId(encadreur.getUser(), encadreur.getId());
    }

    @Transactional(readOnly = true)
    public List<InternDTO> getEncadreurInterns(Long encadreurId) {
        List<Intern> interns = internRepository.findByEncadreurId(encadreurId);
        return interns.stream()
                .map(this::convertInternToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO createEncadreur(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("EMAIL_EXISTS");
        }

        if (userDTO.getDepartment() == null || userDTO.getDepartment().isEmpty()) {
            throw new RuntimeException("DEPARTMENT_REQUIRED");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setNom(userDTO.getNom());
        user.setPrenom(userDTO.getPrenom());
        user.setDepartment(userDTO.getDepartment());
        user.setPhone(userDTO.getPhone());
        user.setRole(User.Role.ENCADREUR);
        user.setAccountStatus(User.AccountStatus.PENDING);

        User savedUser = userRepository.save(user);

        Encadreur encadreur = new Encadreur();
        encadreur.setUser(savedUser);
        encadreur.setDepartment(userDTO.getDepartment());
        encadreur.setSpecialization(userDTO.getDepartment()); // Optional
        encadreurRepository.save(encadreur);

        return convertToDTO(savedUser);
    }

    @Transactional
    public UserDTO updateEncadreur(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ENCADREUR_NOT_FOUND"));

        if (user.getRole() != User.Role.ENCADREUR) {
            throw new RuntimeException("NOT_AN_ENCADREUR");
        }

        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                throw new RuntimeException("EMAIL_EXISTS");
            }
            user.setEmail(userDTO.getEmail());
        }

        if (userDTO.getNom() != null) user.setNom(userDTO.getNom());
        if (userDTO.getPrenom() != null) user.setPrenom(userDTO.getPrenom());
        if (userDTO.getDepartment() != null) user.setDepartment(userDTO.getDepartment());
        if (userDTO.getPhone() != null) user.setPhone(userDTO.getPhone());

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Transactional
    public void deleteEncadreur(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ENCADREUR_NOT_FOUND"));

        if (user.getRole() != User.Role.ENCADREUR) {
            throw new RuntimeException("NOT_AN_ENCADREUR");
        }

        List<Intern> assignedInterns = internRepository.findByEncadreurId(id);
        if (!assignedInterns.isEmpty()) {
            throw new RuntimeException("HAS_ASSIGNED_INTERNS");
        }

        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public Long getEncadreurInternCount(Long encadreurId) {
        return (long) internRepository.findByEncadreurId(encadreurId).size();
    }

    private UserDTO convertToDTO(User user) {
        Encadreur encadreur = encadreurRepository.findByUserId(user.getId()).orElse(null);
        Long encadreurId = encadreur != null ? encadreur.getId() : null;
        Long internCount = encadreurId != null ? (long) internRepository.findByEncadreurId(encadreurId).size() : 0L;

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .department(user.getDepartment())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .accountStatus(user.getAccountStatus().name())
                .internCount(internCount)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private UserDTO convertToDTOWithEncadreurId(User user, Long encadreurId) {
        Long internCount = encadreurId != null ? (long) internRepository.findByEncadreurId(encadreurId).size() : 0L;

        return UserDTO.builder()
                .id(encadreurId)
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .department(user.getDepartment())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .accountStatus(user.getAccountStatus().name())
                .internCount(internCount)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private InternDTO convertInternToDTO(Intern intern) {
        return InternDTO.builder()
                .id(intern.getId())
                .userId(intern.getUser().getId())
                .encadreurId(intern.getEncadreur() != null ? intern.getEncadreur().getId() : null)
                .school(intern.getSchool())
                .department(intern.getDepartment())
                .startDate(intern.getStartDate())
                .endDate(intern.getEndDate())
                .status(intern.getStatus().name())
                .build();
    }
}
