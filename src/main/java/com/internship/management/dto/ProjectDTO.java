package com.internship.management.dto;

import com.internship.management.entity.Project;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Integer progress;
    private String department;
    private Long encadreurId;
    private String encadreurName;
    private List<Long> assignedInternIds;

    public static ProjectDTO fromEntity(Project project) {
        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus() != null ? project.getStatus().name() : null)
                .progress(project.getProgress())
                .department(project.getDepartment())
                .encadreurId(project.getEncadreur() != null ? project.getEncadreur().getId() : null)
                .encadreurName(project.getEncadreur() != null ?
                        project.getEncadreur().getUser().getPrenom() + " " +
                                project.getEncadreur().getUser().getNom() : null)
                .assignedInternIds(project.getInterns() != null ?
                        project.getInterns().stream().map(i -> i.getId()).collect(Collectors.toList()) : null)
                .build();
    }
}
