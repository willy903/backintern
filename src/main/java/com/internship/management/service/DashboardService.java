package com.internship.management.service;

import com.internship.management.dto.DashboardDTO;
import com.internship.management.entity.Intern;
import com.internship.management.entity.Project;
import com.internship.management.entity.Task;
import com.internship.management.entity.User;
import com.internship.management.repository.InternRepository;
import com.internship.management.repository.ProjectRepository;
import com.internship.management.repository.TaskRepository;
import com.internship.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InternRepository internRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardDTO.DashboardMetrics getMetrics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("USER_NOT_FOUND"));

        switch (user.getRole()) {
            case ADMIN:
                return getRHMetrics();
            case ENCADREUR:
                return getEncadreurMetrics(userId);
            case STAGIAIRE:
                return getStagiaireMetrics(userId);
            default:
                throw new RuntimeException("INVALID_ROLE");
        }
    }

    private DashboardDTO.DashboardMetrics getRHMetrics() {
        long totalInterns = internRepository.count();
        long activeProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.IN_PROGRESS)
                .count();
        long completedTasks = taskRepository.findAll().stream()
                .filter(t -> t.getStatus() == Task.TaskStatus.DONE)
                .count();

        long totalProjects = projectRepository.count();
        long completedProjects = projectRepository.findAll().stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED)
                .count();
        double successRate = totalProjects > 0 ? (completedProjects * 100.0 / totalProjects) : 0.0;

        return DashboardDTO.DashboardMetrics.builder()
                .totalInterns(totalInterns)
                .activeProjects(activeProjects)
                .completedTasks(completedTasks)
                .successRate(successRate)
                .build();
    }

    private DashboardDTO.DashboardMetrics getEncadreurMetrics(Long encadreurId) {
        List<Intern> myInterns = internRepository.findByEncadreurId(encadreurId);
        List<Long> internIds = myInterns.stream().map(Intern::getId).collect(Collectors.toList());

        long totalInterns = myInterns.size();
        long activeProjects = projectRepository.findAll().stream()
                .filter(p -> p.getInterns().stream().map(Intern::getId).anyMatch(internIds::contains))
                .filter(p -> p.getStatus() == Project.ProjectStatus.IN_PROGRESS)
                .count();

        long myProjects = projectRepository.findAll().stream()
                .filter(p -> p.getInterns().stream().map(Intern::getId).anyMatch(internIds::contains))
                .count();
        long completedProjects = projectRepository.findAll().stream()
                .filter(p -> p.getInterns().stream().map(Intern::getId).anyMatch(internIds::contains))
                .filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED)
                .count();

        double successRate = myProjects > 0 ? (completedProjects * 100.0 / myProjects) : 0.0;

        return DashboardDTO.DashboardMetrics.builder()
                .totalInterns(totalInterns)
                .activeProjects(activeProjects)
                .completedTasks(completedProjects)
                .successRate(successRate)
                .build();
    }

    private DashboardDTO.DashboardMetrics getStagiaireMetrics(Long userId) {
        Intern intern = internRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("INTERN_NOT_FOUND"));

        List<Project> myProjects = projectRepository.findByInternId(intern.getId());

        long totalProjects = myProjects.size();
        long activeProjects = myProjects.stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.IN_PROGRESS)
                .count();
        long completedProjects = myProjects.stream()
                .filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED)
                .count();

        double avgProgress = myProjects.stream()
                .mapToInt(p -> p.getProgress() != null ? p.getProgress() : 0)
                .average()
                .orElse(0.0);

        return DashboardDTO.DashboardMetrics.builder()
                .totalInterns(totalProjects)
                .activeProjects(activeProjects)
                .completedTasks(completedProjects)
                .successRate(avgProgress)
                .build();
    }

    @Transactional(readOnly = true)
    public List<DashboardDTO.DepartmentStats> getDepartmentStats() {
        List<User> users = userRepository.findAll();
        Map<String, Long> internsByDept = users.stream()
                .filter(u -> u.getRole() == User.Role.STAGIAIRE)
                .collect(Collectors.groupingBy(User::getDepartment, Collectors.counting()));

        List<Project> projects = projectRepository.findAll();
        Map<String, Long> projectsByDept = new HashMap<>();

        for (Project project : projects) {
            for (Intern intern : project.getInterns()) {
                String dept = intern.getUser().getDepartment();
                projectsByDept.merge(dept, 1L, Long::sum);
            }
        }

        Set<String> allDepartments = new HashSet<>();
        allDepartments.addAll(internsByDept.keySet());
        allDepartments.addAll(projectsByDept.keySet());

        return allDepartments.stream()
                .map(dept -> DashboardDTO.DepartmentStats.builder()
                        .department(dept)
                        .internCount(internsByDept.getOrDefault(dept, 0L))
                        .projectCount(projectsByDept.getOrDefault(dept, 0L))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardDTO.ProjectStatusStats getProjectStatusStats() {
        List<Project> projects = projectRepository.findAll();

        long todoCount = projects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.PLANNING).count();
        long inProgressCount = projects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.IN_PROGRESS).count();
        long doneCount = projects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED).count();

        return DashboardDTO.ProjectStatusStats.builder()
                .todoCount(todoCount)
                .inProgressCount(inProgressCount)
                .doneCount(doneCount)
                .build();
    }

    @Transactional(readOnly = true)
    public DashboardDTO.TaskStats getTaskStats() {
        List<Task> tasks = taskRepository.findAll();

        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.DONE).count();
        long pendingTasks = tasks.stream().filter(t -> t.getStatus() != Task.TaskStatus.DONE).count();

        LocalDate today = LocalDate.now();
        long overdueTasks = tasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(today))
                .filter(t -> t.getStatus() != Task.TaskStatus.DONE)
                .count();

        Map<String, Long> tasksByPriority = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getPriority().name(), Collectors.counting()));

        return DashboardDTO.TaskStats.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .pendingTasks(pendingTasks)
                .overdueTasks(overdueTasks)
                .tasksByPriority(tasksByPriority)
                .build();
    }
}
