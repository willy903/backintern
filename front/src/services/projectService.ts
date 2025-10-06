import { apiService } from './api';

export interface ProjectDTO {
  id: number;
  title: string;
  description: string;
  encadreurId: number;
  startDate: string;
  endDate: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  progress: number;
  department: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  encadreurId: number;
  startDate: string;
  endDate: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  progress: number;
  department: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  progress?: number;
}

export interface AssignInternsRequest {
  internIds: number[];
}

export const projectService = {
  async getAllProjects(params?: { encadreurId?: number; stagiaireId?: number }): Promise<ProjectDTO[]> {
    const query = new URLSearchParams();
    if (params?.encadreurId) query.append('encadreurId', params.encadreurId.toString());
    if (params?.stagiaireId) query.append('stagiaireId', params.stagiaireId.toString());

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiService.get<ProjectDTO[]>(`/projects${queryString}`);
  },

  async getProjectById(id: number): Promise<ProjectDTO> {
    return apiService.get<ProjectDTO>(`/projects/${id}`);
  },

  async createProject(request: CreateProjectRequest): Promise<ProjectDTO> {
    return apiService.post<ProjectDTO>('/projects', request);
  },

  async updateProject(id: number, request: UpdateProjectRequest): Promise<ProjectDTO> {
    return apiService.put<ProjectDTO>(`/projects/${id}`, request);
  },

  async assignInterns(id: number, request: AssignInternsRequest): Promise<ProjectDTO> {
    return apiService.post<ProjectDTO>(`/projects/${id}/assign-interns`, request);
  },

  async deleteProject(id: number): Promise<void> {
    return apiService.delete<void>(`/projects/${id}`);
  }
};
