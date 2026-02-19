/**
 * API Service - Centralized API calls to backend
 */

// Type definitions for API responses
interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    role: 'victim' | 'official';
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log(`🔗 API Base URL: ${API_BASE_URL}`);
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    let error: { error?: string } = { error: response.statusText };
    try {
      error = await response.json();
    } catch {
      // If JSON parsing fails, use default error
      error = { error: response.statusText };
    }
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

const handleFetchError = (error: unknown, _endpoint: string): Error => {
  // Network error (backend not running, CORS, etc.)
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    // In production, show user-friendly message; in dev, show detailed info
    if (import.meta.env.PROD) {
      return new Error('Unable to connect to server. Please try again later.');
    }
    
    // Extract port from API_BASE_URL for better error message
    const urlMatch = API_BASE_URL.match(/http:\/\/localhost:(\d+)/);
    const port = urlMatch ? urlMatch[1] : '5000';
    
    return new Error(
      `Cannot connect to backend server at ${API_BASE_URL}. ` +
      `Please ensure the backend is running on port ${port}. ` +
      `Check: 1) Backend server is started (cd backend && npm run dev), ` +
      `2) MongoDB is connected, 3) No firewall blocking the connection.`
    );
  }
  
  // Other fetch errors
  if (error instanceof Error) {
    return error;
  }
  
  // Unknown error
  return new Error(`Request failed: ${error && typeof error === 'object' && 'message' in error ? String(error.message) : 'Unknown error'}`);
};

// Generic fetch wrapper with error handling and retry logic
const apiFetch = async (
  url: string,
  options: RequestInit = {},
  endpoint: string = url,
  retries: number = 0
): Promise<unknown> => {
  const maxRetries = 2;
  const retryDelay = 1000; // 1 second

  try {
    const res = await fetch(url, {
      ...options,
      signal: options.signal || (typeof AbortController !== 'undefined' ? new AbortController().signal : undefined),
    });
    return await handleResponse(res);
  } catch (error: unknown) {
    // Retry on network errors (not 4xx/5xx status codes)
    if (retries < maxRetries && error instanceof TypeError && error.message === 'Failed to fetch') {
      await new Promise(resolve => setTimeout(resolve, retryDelay * (retries + 1)));
      return apiFetch(url, options, endpoint, retries + 1);
    }
    throw handleFetchError(error, endpoint);
  }
};

export const api = {
  // ==================== Authentication ====================
  async loginVictim(aadhaar: string, password: string): Promise<LoginResponse> {
    const data = await apiFetch(
      `${API_BASE_URL}/auth/victim/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar, password }),
      },
      '/auth/victim/login'
    ) as LoginResponse;
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async loginOfficial(officialId: string, password: string): Promise<LoginResponse> {
    const data = await apiFetch(
      `${API_BASE_URL}/auth/official/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officialId, password }),
      },
      '/auth/official/login'
    ) as LoginResponse;
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async getCurrentUser() {
    return apiFetch(
      `${API_BASE_URL}/auth/me`,
      { headers: getAuthHeaders() },
      '/auth/me'
    );
  },

  async getOfficials() {
    return apiFetch(
      `${API_BASE_URL}/auth/officials`,
      { headers: getAuthHeaders() },
      '/auth/officials'
    );
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // ==================== Applications ====================
  async getApplications(filters?: { status?: string; caseType?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.caseType) params.append('caseType', filters.caseType);
    if (filters?.search) params.append('search', filters.search);

    return apiFetch(
      `${API_BASE_URL}/applications?${params}`,
      { headers: getAuthHeaders() },
      '/applications'
    );
  },

  async getApplication(id: string) {
    return apiFetch(
      `${API_BASE_URL}/applications/${id}`,
      { headers: getAuthHeaders() },
      `/applications/${id}`
    );
  },

  async createApplication(data: any) {
    return apiFetch(
      `${API_BASE_URL}/applications`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      '/applications'
    );
  },

  async updateApplication(id: string, data: any) {
    return apiFetch(
      `${API_BASE_URL}/applications/${id}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      `/applications/${id}`
    );
  },

  async updateApplicationStatus(id: string, status: string) {
    return apiFetch(
      `${API_BASE_URL}/applications/${id}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
      `/applications/${id}/status`
    );
  },

  async getApplicationStats() {
    return apiFetch(
      `${API_BASE_URL}/applications/stats/overview`,
      { headers: getAuthHeaders() },
      '/applications/stats/overview'
    );
  },

  // ==================== Verification ====================
  async verifyApplication(id: string) {
    return apiFetch(
      `${API_BASE_URL}/verification/${id}/verify`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
      `/verification/${id}/verify`
    );
  },

  async disburseApplication(id: string) {
    return apiFetch(
      `${API_BASE_URL}/verification/${id}/disburse`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
      },
      `/verification/${id}/disburse`
    );
  },

  // ==================== Grievances ====================
  async getGrievances() {
    return apiFetch(
      `${API_BASE_URL}/grievances`,
      { headers: getAuthHeaders() },
      '/grievances'
    );
  },

  async getGrievance(id: string) {
    return apiFetch(
      `${API_BASE_URL}/grievances/${id}`,
      { headers: getAuthHeaders() },
      `/grievances/${id}`
    );
  },

  async createGrievance(data: { beneficiaryId: string; subject: string; description: string }) {
    return apiFetch(
      `${API_BASE_URL}/grievances`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      },
      '/grievances'
    );
  },

  async updateGrievanceStatus(id: string, status: string, resolution?: string) {
    return apiFetch(
      `${API_BASE_URL}/grievances/${id}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, resolution }),
      },
      `/grievances/${id}/status`
    );
  },

  async assignOfficerToGrievance(id: string, officerId: string) {
    return apiFetch(
      `${API_BASE_URL}/grievances/${id}/assign`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ officerId }),
      },
      `/grievances/${id}/assign`
    );
  },

  // ==================== Tracking ====================
  async getTracking(id: string) {
    return apiFetch(
      `${API_BASE_URL}/tracking/${id}`,
      { headers: getAuthHeaders() },
      `/tracking/${id}`
    );
  },

  // ==================== AI ====================
  async getLegalGuidance(query: string, history: { role: 'user' | 'ai'; text: string }[] = []) {
    return apiFetch(
      `${API_BASE_URL}/ai/guidance`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ query, history }),
      },
      '/ai/guidance'
    );
  },

  // ==================== File Uploads ====================
  async uploadDocuments(applicationId: string, files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('documents', file);
    });

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/uploads/application/${applicationId}`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type, let browser set it with boundary
        },
        body: formData,
      });
      return await handleResponse(res);
    } catch (error: any) {
      throw handleFetchError(error, `/uploads/application/${applicationId}`);
    }
  },

  async getDocuments(applicationId: string) {
    return apiFetch(
      `${API_BASE_URL}/uploads/application/${applicationId}`,
      { headers: getAuthHeaders() },
      `/uploads/application/${applicationId}`
    );
  },

  // ==================== Health Check ====================
  async checkBackendHealth() {
    try {
      const baseUrl = API_BASE_URL.replace('/api', '');
      const res = await fetch(`${baseUrl}/health`);
      if (res.ok) {
        return await res.json();
      }
      throw new Error(`Health check failed: ${res.status}`);
    } catch (error: any) {
      throw handleFetchError(error, '/health');
    }
  },
};

export default api;
