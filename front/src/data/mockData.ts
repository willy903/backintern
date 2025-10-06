import data from './data.json';
import { Intern, Project, Task, Activity, DashboardMetrics } from '../types';
import { UserRole, UserProfile } from '../types/auth';

export const mockMetrics: DashboardMetrics = data.metrics;
export const mockInterns: Intern[] = data.interns;
export const mockProjects: Project[] = data.projects;
export const mockTasks: Task[] = data.tasks;
export const mockActivities: Activity[] = data.activities;
export const mockNotifications = data.notifications;
export const progressData = data.progressData;
export const projectStatusData = data.projectStatusData;
export const departmentData = data.departmentData;

export interface MockUser {
  id: string;
  email: string;
  password: string;
  profile: UserProfile;
  role: UserRole;
  encadreurId?: string;
  stagiaires?: string[];
}

export const mockUsers: MockUser[] = [
  {
    id: 'rh-001',
    email: 'rh@company.com',
    password: 'password123',
    role: 'responsable_rh',
    profile: {
      id: 'rh-001',
      email: 'rh@company.com',
      nom: 'Martin',
      prenom: 'Sophie',
      departement: 'Ressources Humaines',
      phone: '+33 6 12 34 56 78',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 'enc-001',
    email: 'encadreur@company.com',
    password: 'password123',
    role: 'encadreur',
    profile: {
      id: 'enc-001',
      email: 'encadreur@company.com',
      nom: 'Dubois',
      prenom: 'Jean',
      departement: 'Informatique',
      phone: '+33 6 23 45 67 89',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    stagiaires: ['stg-001', 'stg-002'],
  },
  {
    id: 'enc-002',
    email: 'encadreur2@company.com',
    password: 'password123',
    role: 'encadreur',
    profile: {
      id: 'enc-002',
      email: 'encadreur2@company.com',
      nom: 'Bernard',
      prenom: 'Marie',
      departement: 'Marketing',
      phone: '+33 6 34 56 78 90',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    stagiaires: ['stg-003'],
  },
  {
    id: 'stg-001',
    email: 'stagiaire@company.com',
    password: 'password123',
    role: 'stagiaire',
    profile: {
      id: 'stg-001',
      email: 'stagiaire@company.com',
      nom: 'Lefebvre',
      prenom: 'Marie',
      departement: 'Informatique',
      phone: '+33 6 34 56 78 90',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    encadreurId: 'enc-001',
  },
  {
    id: 'stg-002',
    email: 'stagiaire2@company.com',
    password: 'password123',
    role: 'stagiaire',
    profile: {
      id: 'stg-002',
      email: 'stagiaire2@company.com',
      nom: 'Moreau',
      prenom: 'Thomas',
      departement: 'Informatique',
      phone: '+33 6 45 67 89 01',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    encadreurId: 'enc-001',
  },
  {
    id: 'stg-003',
    email: 'stagiaire3@company.com',
    password: 'password123',
    role: 'stagiaire',
    profile: {
      id: 'stg-003',
      email: 'stagiaire3@company.com',
      nom: 'Petit',
      prenom: 'Lucas',
      departement: 'Marketing',
      phone: '+33 6 56 78 90 12',
      avatar_url: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    encadreurId: 'enc-002',
  },
];