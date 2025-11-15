/**
 * API Client for Axxiom Platform
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Type-safe API functions

export interface Valuation {
  valuationId: string;
  propertyId: string;
  valuationDate: string;
  approach: 'sales_comparison' | 'income' | 'cost' | 'reconciled';
  valueAmount: number;
  valueRangeLow: number;
  valueRangeHigh: number;
  confidenceScore: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const valuationsApi = {
  list: (params?: { page?: number; limit?: number; status?: string }) =>
    apiClient.get<PaginatedResponse<Valuation>>('/valuations', { params }),

  get: (id: string) => apiClient.get<{ success: boolean; data: Valuation }>(`/valuations/${id}`),

  create: (data: Partial<Valuation>) =>
    apiClient.post<{ success: boolean; data: Valuation }>('/valuations', data),

  update: (id: string, data: Partial<Valuation>) =>
    apiClient.patch<{ success: boolean; data: Valuation }>(`/valuations/${id}`, data),

  delete: (id: string) => apiClient.delete(`/valuations/${id}`),

  approve: (id: string, notes?: string) =>
    apiClient.post<{ success: boolean; data: Valuation }>(`/valuations/${id}/approve`, { notes }),
};
