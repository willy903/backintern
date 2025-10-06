package com.internship.management.service;

import com.internship.management.dto.ProjectDTO;
import com.internship.management.entity.Encadreur;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Project;
import com.internship.management.repository.EncadreurRepository;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final InternRepository internRepository;
    private final EncadreurRepository encadreurRepository;

    @Transactional(readOnly = true)
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByEncadreur(Long encadreurId) {
        Encadreur encadreur = encadreurRepository.findById(encadreurId)
                .orElseThrow(() -> new RuntimeException("ENCADREUR_NOT_FOUND"));

        return projectRepository.findByEncadreur(encadreur).stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectDTO> getProjectsByStagiaire(Long stagiaireId) {
        Intern intern = internRepository.findById(stagiaireId)
                .orElseThrow(() -> new RuntimeException("INTERN_NOT_FOUND"));

        return projectRepository.findByInternsContaining(intern.getId()).stream()
                .map(ProjectDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PROJECT_NOT_FOUND"));
        return ProjectDTO.fromEntity(project);
    }

    @Transactional
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Project project = new Project();
        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());
        project.setStartDate(projectDTO.getStartDate());
        project.setEndDate(projectDTO.getEndDate());
        project.setDepartment(projectDTO.getDepartment());
        project.setProgress(projectDTO.getProgress() != null ? projectDTO.getProgress() : 0);
        project.setStatus(projectDTO.getStatus() != null ?
                Project.ProjectStatus.valueOf(projectDTO.getStatus()) : Project.ProjectStatus.PLANNING);

        if (projectDTO.getEncadreurId() != null) {
            Encadreur encadreur = encadreurRepository.findById(projectDTO.getEncadreurId())
                    .orElseThrow(() -> new RuntimeException("ENCADREUR_NOT_FOUND"));
            project.setEncadreur(encadreur);
        }

        if (projectDTO.getAssignedInternIds() != null) {
            List<Intern> interns = internRepository.findAllById(projectDTO.getAssignedInternIds());
            project.setInterns(interns);
        }

        Project savedProject = projectRepository.save(project);
        return ProjectDTO.fromEntity(savedProject);
    }

    @Transactional
    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PROJECT_NOT_FOUND"));

        if (projectDTO.getTitle() != null) project.setTitle(projectDTO.getTitle());
        if (projectDTO.getDescription() != null) project.setDescription(projectDTO.getDescription());
        if (projectDTO.getStartDate() != null) project.setStartDate(projectDTO.getStartDate());
        if (projectDTO.getEndDate() != null) project.setEndDate(projectDTO.getEndDate());
        if (projectDTO.getDepartment() != null) project.setDepartment(projectDTO.getDepartment());
        if (projectDTO.getProgress() != null) project.setProgress(projectDTO.getProgress());
        if (projectDTO.getStatus() != null)
            project.setStatus(Project.ProjectStatus.valueOf(projectDTO.getStatus()));

        if (projectDTO.getEncadreurId() != null) {
            Encadreur encadreur = encadreurRepository.findById(projectDTO.getEncadreurId())
                    .orElseThrow(() -> new RuntimeException("ENCADREUR_NOT_FOUND"));
            project.setEncadreur(encadreur);
        }

        if (projectDTO.getAssignedInternIds() != null) {
            List<Intern> interns = internRepository.findAllById(projectDTO.getAssignedInternIds());
            project.setInterns(interns);
        }

        Project updatedProject = projectRepository.save(project);
        return ProjectDTO.fromEntity(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("PROJECT_NOT_FOUND");
        }
        projectRepository.deleteById(id);
    }

    @Transactional
    public ProjectDTO assignInterns(Long projectId, List<Long> internIds) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("PROJECT_NOT_FOUND"));

        List<Intern> interns = internRepository.findAllById(internIds);
        if (interns.size() != internIds.size()) {
            throw new RuntimeException("INTERN_NOT_FOUND");
        }

        project.setInterns(interns);
        Project updatedProject = projectRepository.save(project);

        return ProjectDTO.fromEntity(updatedProject);
    }
}
