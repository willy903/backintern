package com.internship.management.service;

import com.internship.management.dto.TaskDTO;
import com.internship.management.entity.Project;
import com.internship.management.entity.Task;
import com.internship.management.entity.User;
import com.internship.management.repository.ProjectRepository;
import com.internship.management.repository.TaskRepository;
import com.internship.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository; // ✅ remplace InternRepository
    private final ProjectRepository projectRepository;

    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskDTO::fromEntity) // ✅ utilise la méthode statique déjà faite
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByUser(Long userId) { // ✅ renommé (assignedTo est un User)
        return taskRepository.findByAssignedToId(userId).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTasksByStatus(String status) { // ✅ String → Enum
        Task.TaskStatus enumStatus = Task.TaskStatus.valueOf(status);
        return taskRepository.findByStatus(enumStatus).stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return TaskDTO.fromEntity(task);
    }

    @Transactional
    public TaskDTO createTask(TaskDTO taskDTO) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus() != null ?
                Task.TaskStatus.valueOf(taskDTO.getStatus()) : Task.TaskStatus.TODO);
        task.setPriority(taskDTO.getPriority() != null ?
                Task.TaskPriority.valueOf(taskDTO.getPriority()) : Task.TaskPriority.MEDIUM);
        task.setDueDate(taskDTO.getDueDate());

        if (taskDTO.getProjectId() != null) {
            Project project = projectRepository.findById(taskDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            task.setProject(project);
        }

        if (taskDTO.getAssignedToId() != null) {
            User user = userRepository.findById(taskDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(user);
        }

        Task savedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(savedTask);
    }

    @Transactional
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (taskDTO.getTitle() != null) task.setTitle(taskDTO.getTitle());
        if (taskDTO.getDescription() != null) task.setDescription(taskDTO.getDescription());
        if (taskDTO.getStatus() != null) task.setStatus(Task.TaskStatus.valueOf(taskDTO.getStatus()));
        if (taskDTO.getPriority() != null) task.setPriority(Task.TaskPriority.valueOf(taskDTO.getPriority()));
        if (taskDTO.getDueDate() != null) task.setDueDate(taskDTO.getDueDate());

        if (taskDTO.getProjectId() != null) {
            Project project = projectRepository.findById(taskDTO.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            task.setProject(project);
        }

        if (taskDTO.getAssignedToId() != null) {
            User user = userRepository.findById(taskDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(user);
        }

        Task updatedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        taskRepository.deleteById(id);
    }

    @Transactional
    public TaskDTO updateTaskStatus(Long id, String status) { // ✅ String → Enum
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(Task.TaskStatus.valueOf(status));
        Task updatedTask = taskRepository.save(task);
        return TaskDTO.fromEntity(updatedTask);
    }
}
