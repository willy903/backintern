const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiError {
  message: string;
  status?: number;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'Une erreur est survenue';

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = `Erreur ${response.status}: ${response.statusText}`;
      }

      if (response.status === 401) {
        this.setToken(null);
        window.location.href = '/';
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
      };
      throw error;
    }

    try {
      const jsonResponse = await response.json();

      if (jsonResponse && typeof jsonResponse === 'object' && 'success' in jsonResponse && 'data' in jsonResponse) {
        if (!jsonResponse.success && jsonResponse.error) {
          const error: ApiError = {
            message: jsonResponse.error,
            status: response.status,
          };
          throw error;
        }
        return jsonResponse.data;
      }

      return jsonResponse;
    } catch (error) {
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }
      return {} as T;
    }
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(includeAuth),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(includeAuth),
        body: data ? JSON.stringify(data) : undefined,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(includeAuth),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  }
}

export const apiService = new ApiService(API_URL);
