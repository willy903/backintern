export interface Intern {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
  status: 'active' | 'inactive';
  startDate: string;
  progress: number;
}

export interface Project {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assignedInterns: string[];
  completion: number;
  dueDate: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done' | 'bug';
  assignedTo: string;
  projectId: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  labels?: string[];
}

export interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
  type: 'project' | 'task' | 'intern';
}

export interface DashboardMetrics {
  totalInterns: number;
  activeProjects: number;
  completedTasks: number;
  successRate: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}