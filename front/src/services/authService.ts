import { apiService } from './api';

export interface CheckEmailResponse {
  exists: boolean;
  hasPassword: boolean;
  message: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    phone: string;
    department: string;
    role: string;
    accountStatus: string;
    avatar: string | null;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePasswordRequest {
  email: string;
  password: string;
}

export interface CreateAdminRequest {
  email: string;
  nom: string;
  prenom: string;
  phone: string;
  departement: string;
  password: string;
}

export interface CreateEncadreurRequest {
  email: string;
  nom: string;
  prenom: string;
  phone: string;
  departement: string;
  specialization: string;
}

export interface CreateStagiaireRequest {
  email: string;
  nom: string;
  prenom: string;
  phone: string;
  departement: string;
  school: string;
  major: string;
  startDate: string;
  endDate: string;
  encadreurId: number;
}

export const authService = {
  async checkEmail(email: string): Promise<CheckEmailResponse> {
    return apiService.post<CheckEmailResponse>('/auth/check-email', { email }, false);
  },

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials, false);
    apiService.setToken(response.token);
    return response;
  },

  async createPassword(request: CreatePasswordRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/create-password', request, false);
    apiService.setToken(response.token);
    return response;
  },

  async createAdmin(request: CreateAdminRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register/admin', request, false);
  },

  async initializeAdmin(): Promise<any> {
    return apiService.post('/auth/init-admin', {}, false);
  },

  async createEncadreur(request: CreateEncadreurRequest): Promise<AuthResponse['user']> {
    return apiService.post<AuthResponse['user']>('/auth/register/encadreur', request);
  },

  async createStagiaire(request: CreateStagiaireRequest): Promise<AuthResponse['user']> {
    return apiService.post<AuthResponse['user']>('/auth/register/stagiaire', request);
  },

  logout() {
    apiService.setToken(null);
    localStorage.removeItem('auth_user');
  }
};
