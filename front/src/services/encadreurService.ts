import { apiService } from './api';
import { InternDTO } from './internService';

export interface EncadreurDTO {
  id: number;
  encadreurId: number;
  email: string;
  nom: string;
  prenom: string;
  phone: string;
  department: string;
  role: string;
  accountStatus: string;
  avatar: string | null;
  internCount?: number;
}

export interface UpdateEncadreurRequest {
  nom?: string;
  prenom?: string;
  phone?: string;
  department?: string;
}

export const encadreurService = {
  async getAllEncadreurs(): Promise<EncadreurDTO[]> {
    return apiService.get<EncadreurDTO[]>('/encadreurs');
  },

  async getEncadreurById(id: number): Promise<EncadreurDTO> {
    return apiService.get<EncadreurDTO>(`/encadreurs/${id}`);
  },

  async getEncadreurByUserId(userId: number): Promise<EncadreurDTO> {
    return apiService.get<EncadreurDTO>(`/encadreurs/by-user/${userId}`);
  },

  async getEncadreurInterns(id: number): Promise<InternDTO[]> {
    return apiService.get<InternDTO[]>(`/encadreurs/${id}/interns`);
  },

  async getEncadreurInternCount(id: number): Promise<number> {
    return apiService.get<number>(`/encadreurs/${id}/intern-count`);
  },

  async updateEncadreur(id: number, request: UpdateEncadreurRequest): Promise<EncadreurDTO> {
    return apiService.put<EncadreurDTO>(`/encadreurs/${id}`, request);
  },

  async deleteEncadreur(id: number): Promise<void> {
    return apiService.delete<void>(`/encadreurs/${id}`);
  }
};
