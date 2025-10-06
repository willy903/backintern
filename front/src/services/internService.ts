import { apiService } from './api';

export interface InternDTO {
  id: number;
  userId: number;
  email: string;
  nom: string;
  prenom: string;
  phone: string;
  school: string;
  department: string;
  startDate: string;
  endDate: string;
  status: string;
  encadreurId: number;
  encadreurNom?: string;
  encadreurPrenom?: string;
  projectId: number | null;
  cv: string | null;
  notes: string | null;
}

export interface CreateInternRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  school: string;
  department: string;
  startDate: string;
  endDate: string;
  encadreurId: number;
}

export interface UpdateInternRequest {
  phone?: string;
  school?: string;
  department?: string;
  startDate?: string;
  endDate?: string;
  encadreurId?: number;
}

export interface UpdateInternStatusRequest {
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export const internService = {
  async getAllInterns(params?: { encadreurId?: number; encadreurUserId?: number; department?: string; status?: string }): Promise<InternDTO[]> {
    const query = new URLSearchParams();
    if (params?.encadreurId) query.append('encadreurId', params.encadreurId.toString());
    if (params?.encadreurUserId) query.append('encadreurUserId', params.encadreurUserId.toString());
    if (params?.department) query.append('department', params.department);
    if (params?.status) query.append('status', params.status);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiService.get<InternDTO[]>(`/interns${queryString}`);
  },

  async getInternById(id: number): Promise<InternDTO> {
    return apiService.get<InternDTO>(`/interns/${id}`);
  },

  async createIntern(request: CreateInternRequest): Promise<InternDTO> {
    return apiService.post<InternDTO>('/interns', request);
  },

  async updateIntern(id: number, request: UpdateInternRequest): Promise<InternDTO> {
    return apiService.put<InternDTO>(`/interns/${id}`, request);
  },

  async updateInternStatus(id: number, status: UpdateInternStatusRequest): Promise<InternDTO> {
    return apiService.patch<InternDTO>(`/interns/${id}/status`, status);
  },

  async deleteIntern(id: number): Promise<void> {
    return apiService.delete<void>(`/interns/${id}`);
  }
};
