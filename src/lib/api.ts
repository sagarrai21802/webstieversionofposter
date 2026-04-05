import axios, { AxiosError, AxiosResponse, AxiosRequestHeaders, AxiosRequestConfig } from 'axios';
import { API_CONFIG } from './api-config';

let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string): void {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function clearAccessToken(): void {
  inMemoryAccessToken = null;
}

interface ApiException {
  message: string;
  statusCode?: number;
}

class ApiClient {
  private client;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;
  private failedRequests: Array<() => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token && config.headers) {
          (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshed = await this.refreshTokens();
            if (refreshed) {
              return this.client(originalRequest);
            } else {
              clearAccessToken();
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/signin';
              }
            }
          } catch {
            clearAccessToken();
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/signin';
            }
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  getAccessToken(): string | null {
    return inMemoryAccessToken;
  }

  setAccessTokenOnly(accessToken: string) {
    inMemoryAccessToken = accessToken;
  }

  clearTokens() {
    inMemoryAccessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async refreshTokens(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await axios.post(
          API_CONFIG.refresh,
          {},
          { withCredentials: true }
        );

        const { access_token } = response.data;
        inMemoryAccessToken = access_token;
        return true;
      } catch {
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async get<T>(url: string, requiresAuth = true): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, requiresAuth = true): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, requiresAuth = true): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string, requiresAuth = true): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  async postMultipart<T>(url: string, formData: FormData, requiresAuth = true): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!inMemoryAccessToken;
  }
}

export const apiClient = new ApiClient();
export default apiClient;