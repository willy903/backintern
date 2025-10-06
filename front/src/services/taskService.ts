import { apiService } from './api';

export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  projectId: number;
  assignedTo: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: number;
  assignedTo: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface UpdateTaskStatusRequest {
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export const taskService = {
  async getAllTasks(params?: { projectId?: number; userId?: number; status?: string }): Promise<TaskDTO[]> {
    const query = new URLSearchParams();
    if (params?.projectId) query.append('projectId', params.projectId.toString());
    if (params?.userId) query.append('userId', params.userId.toString());
    if (params?.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiService.get<TaskDTO[]>(`/tasks${queryString}`);
  },

  async getTaskById(id: number): Promise<TaskDTO> {
    return apiService.get<TaskDTO>(`/tasks/${id}`);
  },

  async createTask(request: CreateTaskRequest): Promise<TaskDTO> {
    return apiService.post<TaskDTO>('/tasks', request);
  },

  async updateTask(id: number, request: UpdateTaskRequest): Promise<TaskDTO> {
    return apiService.put<TaskDTO>(`/tasks/${id}`, request);
  },

  async updateTaskStatus(id: number, status: UpdateTaskStatusRequest): Promise<TaskDTO> {
    return apiService.patch<TaskDTO>(`/tasks/${id}/status`, status);
  },

  async deleteTask(id: number): Promise<void> {
    return apiService.delete<void>(`/tasks/${id}`);
  }
};
