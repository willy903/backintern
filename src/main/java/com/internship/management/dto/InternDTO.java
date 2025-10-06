package com.internship.management.dto;

import com.internship.management.entity.Intern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternDTO {
    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String school;
    private String department;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String phone;
    private String cv;
    private String notes;
    private Long encadreurId;
    private String encadreurName;
    private Long projectId;
    private String projectTitle;

    public static InternDTO fromEntity(Intern intern) {
        return InternDTO.builder()
                .id(intern.getId())
                .userId(intern.getUser().getId())
                .email(intern.getUser().getEmail())
                .firstName(intern.getUser().getNom())
                .lastName(intern.getUser().getPrenom())
                .school(intern.getSchool())
                .department(intern.getDepartment())
                .startDate(intern.getStartDate())
                .endDate(intern.getEndDate())
                .status(intern.getStatus().name())
                .phone(intern.getUser().getPhone())
                .cv(intern.getCv())
                .notes(intern.getNotes())
                .encadreurId(intern.getEncadreur() != null ? intern.getEncadreur().getId() : null)
                .encadreurName(intern.getEncadreur() != null ?
                    intern.getEncadreur().getUser().getNom() + " " +
                    intern.getEncadreur().getUser().getPrenom() : null)
                .projectId(intern.getProject() != null ? intern.getProject().getId() : null)
                .projectTitle(intern.getProject() != null ? intern.getProject().getTitle() : null)
                .build();
    }
}
