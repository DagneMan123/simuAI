import axios, { InternalAxiosRequestConfig } from 'axios';

// --- Types and Interfaces ---
export type UserRole = 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
}

export interface SimulationSubmission {
  stepId: string;
  content: unknown;
  metadata?: Record<string, unknown>;
}

// --- Axios Configuration ---

// 1. እዚህ ጋር 'export' መጨመርህን እና space ማጥፋትህን አረጋግጥ
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request Interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- 1. Auth API ---
export const authApi = {
  login: (email: string, password: string, role?: UserRole) => 
    api.post('/auth/login', { email, password, role }),
    
  register: (data: RegisterData) => 
    api.post('/auth/register', data),
    
  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  }
};

// --- 2. Candidate API ---
export const candidateApi = {
  getSimulations: () => api.get('/candidate/simulations'),
  startSimulation: (id: string) => api.post(`/candidate/simulations/${id}/start`),
  sendChatMessage: (simulationId: string, message: string) =>
    api.post(`/candidate/simulations/${simulationId}/chat`, { message }),
  reportTabSwitch: (simulationId: string) =>
    api.post(`/candidate/simulations/${simulationId}/report-cheat`, { type: 'TAB_SWITCH' }),
  submitStep: (simulationId: string, stepId: string, data: SimulationSubmission) =>
    api.post(`/candidate/simulations/${simulationId}/steps/${stepId}/submit`, data),
  completeSimulation: (id: string) => api.post(`/candidate/simulations/${id}/complete`),
  getSimulationResults: (id: string) => api.get(`/candidate/simulations/${id}/results`),
  getInvitations: () => api.get('/candidate/invitations'),
  acceptInvitation: (token: string) => api.post(`/candidate/invitations/${token}/accept`),
  getPerformanceStats: () => api.get('/candidate/stats'),
  requestFeedback: (simulationId: string) =>
    api.post(`/candidate/simulations/${simulationId}/request-feedback`),
  downloadCertificate: (simulationId: string) =>
    api.get(`/candidate/simulations/${simulationId}/certificate`, { responseType: 'blob' }),
};

// --- 3. Employer API (and simulationApi for compatibility) ---
export const employerApi = {
  createSimulation: (data: unknown) => api.post('/employer/simulations', data),
  getSimulations: () => api.get('/employer/simulations'),
  getSimulationDetails: (id: string) => api.get(`/employer/simulations/${id}`),
  inviteCandidates: (simulationId: string, emails: string[]) => 
    api.post(`/employer/simulations/${simulationId}/invite`, { emails }),
  getCandidateResults: (simulationId: string) => api.get(`/employer/simulations/${simulationId}/results`),
  getAIReport: (candidateId: string, simulationId: string) =>
    api.get(`/employer/reports/${candidateId}/${simulationId}`),
};

// ሌሎች ፋይሎች 'simulationApi' ብለው ስለሚጠሩት ይህ መስመር እንዳይጠፋ
export const simulationApi = employerApi;

// --- 4. Admin API ---
export const adminApi = {
  getAllUsers: () => api.get('/admin/users'),
  updateUserStatus: (userId: string, status: 'active' | 'suspended') =>
    api.patch(`/admin/users/${userId}/status`, { status }),
  getSystemStats: () => api.get('/admin/stats'),
  approveSimulationTemplate: (id: string) => api.post(`/admin/simulations/${id}/approve`),
  getSystemLogs: () => api.get('/admin/logs'),
};

// Default export (optional, but keep it for safety)
export default api;