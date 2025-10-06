import { apiService } from './api';

export interface NotificationDTO {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export const notificationService = {
  async getUserNotifications(userId: number): Promise<NotificationDTO[]> {
    return apiService.get<NotificationDTO[]>(`/notifications/user/${userId}`);
  },

  async getUnreadNotifications(userId: number): Promise<NotificationDTO[]> {
    return apiService.get<NotificationDTO[]>(`/notifications/user/${userId}/unread`);
  },

  async getUnreadCount(userId: number): Promise<number> {
    return apiService.get<number>(`/notifications/user/${userId}/unread/count`);
  },

  async markAsRead(notificationId: number): Promise<void> {
    return apiService.patch<void>(`/notifications/${notificationId}/read`, {});
  },

  async markAllAsRead(userId: number): Promise<void> {
    return apiService.patch<void>(`/notifications/user/${userId}/read-all`, {});
  },

  async deleteNotification(notificationId: number): Promise<void> {
    return apiService.delete<void>(`/notifications/${notificationId}`);
  }
};
