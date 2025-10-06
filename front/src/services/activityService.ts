import { apiService } from './api';

export interface ActivityHistoryDTO {
  id: number;
  userId: number;
  action: string;
  entityType?: string;
  entityId?: number;
  description: string;
  metadata?: string;
  createdAt: string;
}

export const activityService = {
  async getUserActivities(userId: number): Promise<ActivityHistoryDTO[]> {
    return apiService.get<ActivityHistoryDTO[]>(`/activities/user/${userId}`);
  },

  async getRecentActivities(): Promise<ActivityHistoryDTO[]> {
    return apiService.get<ActivityHistoryDTO[]>('/activities/recent');
  },

  async getEntityActivities(entityType: string, entityId: number): Promise<ActivityHistoryDTO[]> {
    return apiService.get<ActivityHistoryDTO[]>(`/activities/entity?entityType=${entityType}&entityId=${entityId}`);
  },

  async logActivity(activity: Omit<ActivityHistoryDTO, 'id' | 'createdAt'>): Promise<ActivityHistoryDTO> {
    return apiService.post<ActivityHistoryDTO>('/activities', activity);
  }
};
