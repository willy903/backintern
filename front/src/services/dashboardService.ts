import { apiService } from './api';

export interface DashboardMetrics {
  totalInterns: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
}

export interface DepartmentStats {
  department: string;
  count: number;
}

export interface ProjectStatusStats {
  planning: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
}

export interface TaskStats {
  todo: number;
  inProgress: number;
  done: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  departmentStats: DepartmentStats[];
  projectStatusStats: ProjectStatusStats;
  taskStats: TaskStats;
}

export const dashboardService = {
  async getDashboardMetrics(userId?: number): Promise<DashboardMetrics> {
    const query = userId ? `?userId=${userId}` : '';
    return apiService.get<DashboardMetrics>(`/dashboard/metrics${query}`);
  },

  async getDepartmentStats(): Promise<DepartmentStats[]> {
    return apiService.get<DepartmentStats[]>('/dashboard/departments');
  },

  async getProjectStatusStats(): Promise<ProjectStatusStats> {
    return apiService.get<ProjectStatusStats>('/dashboard/project-status');
  },

  async getTaskStats(): Promise<TaskStats> {
    return apiService.get<TaskStats>('/dashboard/task-stats');
  },

  async getDashboardData(userId?: number): Promise<DashboardData> {
    const [metrics, departmentStats, projectStatusStats, taskStats] = await Promise.all([
      this.getDashboardMetrics(userId),
      this.getDepartmentStats(),
      this.getProjectStatusStats(),
      this.getTaskStats()
    ]);

    return {
      metrics,
      departmentStats,
      projectStatusStats,
      taskStats
    };
  }
};
