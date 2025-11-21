'use client'
import { supabase } from './supabase'

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private async getAuthHeader(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ? {
      'Authorization': `Bearer ${session.access_token}`
    } : {}
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any = undefined;
    try {
      data = await response.json();
    } catch (e) {
      // ignore JSON parse error
    }
    if (!response.ok) {
      return {
        ok: false,
        error: data?.error || response.statusText || 'Unknown error',
        status: response.status,
        data,
      }
    }
    return {
      ok: true,
      data,
      status: response.status,
    }
  }

  async uploadDocument(file: File): Promise<ApiResponse<Record<string, unknown>>> {
    const formData = new FormData()
    formData.append('file', file)
    const headers = await this.getAuthHeader()
    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      headers,
      body: formData
    })
    return this.handleResponse(response)
  }

  async getDocuments(params: Record<string, string> = {}): Promise<ApiResponse<Record<string, unknown>>> {
    const headers = await this.getAuthHeader()
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`/api/documents?${query}`, {
      headers
    })
    return this.handleResponse(response)
  }

  async getDocument(id: string): Promise<ApiResponse<Record<string, unknown>>> {
    const headers = await this.getAuthHeader()
    const response = await fetch(`/api/documents/${id}`, {
      headers
    })
    return this.handleResponse(response)
  }

  async getDashboardMetrics(): Promise<ApiResponse<Record<string, unknown>>> {
    const headers = await this.getAuthHeader()
    const response = await fetch('/api/dashboard/metrics', {
      headers
    })
    return this.handleResponse(response)
  }

  async updateDocument(id: string, updates: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> {
    const headers = await this.getAuthHeader()
    const response = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    })
    return this.handleResponse(response)
  }
}

export const apiClient = new ApiClient()
