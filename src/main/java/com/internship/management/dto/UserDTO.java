package com.internship.management.dto;

import com.internship.management.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private Long encadreurId;
    private String email;
    private String prenom;
    private String nom;
    private String role;
    private String accountStatus;
    private String department;
    private Long internCount;
    private LocalDateTime updatedAt;

    private String phone;
    private String avatar;
    private LocalDateTime createdAt;

    public static UserDTO fromEntity(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .prenom(user.getPrenom())
                .nom(user.getNom())
                .role(user.getRole().name())
                .accountStatus(user.getAccountStatus().name())
                .department(user.getDepartment())
                .phone(user.getPhone())
                .avatar(user.getAvatar())
                .createdAt(user.getCreatedAt())

                .build();
    }
}
