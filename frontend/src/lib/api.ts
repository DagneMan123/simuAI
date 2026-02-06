import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/** 
 * --- Types and Interfaces --- 
 */
export type UserRole = 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';

export interface RegisterData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
}

/** 
 * --- Axios Instance Configuration --- 
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Request Interceptor: Attach Authorization Token
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor: Global Error Handling (401, 403, 500)
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Unauthorized: Clear session and redirect to login
      localStorage.clear();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    } else if (status === 403) {
      console.error('Permission denied: You do not have access to this resource.');
    } else if (status >= 500) {
      console.error('Server error: Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

/** 
 * --- 1. Auth & Profile Management API --- 
 */
export const authApi = {
  login: (email: string, password: string, role?: UserRole) => 
    api.post('/auth/login', { email, password, role }),
    
  register: (data: RegisterData) => 
    api.post('/auth/register', data),
    
  getProfile: () => api.get('/auth/profile'),
  
  updateProfile: (data: any) => api.patch('/auth/profile', data),
  
  uploadFile: (formData: FormData) => api.post('/auth/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, data: any) => api.post(`/auth/reset-password/${token}`, data),
  
  changePassword: (data: any) => api.patch('/auth/change-password', data),
  
  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  }
};

/** 
 * --- 2. Candidate (Job Seeker) API --- 
 */
export const candidateApi = {
  getSimulations: (params?: any) => api.get('/candidate/simulations', { params }),
  
  getSimulationById: (id: string) => api.get(`/candidate/simulations/${id}`),
  
  startSimulation: (id: string) => api.post(`/candidate/simulations/${id}/start`),
  
  submitStep: (simId: string, stepId: string, content: any) => 
    api.post(`/candidate/simulations/${simId}/steps/${stepId}/submit`, { content }),
    
  reportCheat: (simId: string, type: 'TAB_SWITCH' | 'COPY_PASTE' | 'UNEXPECTED_EXIT') => 
    api.post(`/candidate/simulations/${simId}/report-cheat`, { type }),
    
  completeSimulation: (id: string) => api.post(`/candidate/simulations/${id}/complete`),
  
  getResults: (id: string) => api.get(`/candidate/simulations/${id}/results`),
  
  getStats: () => api.get('/candidate/stats'),
  
  getInvitations: () => api.get('/candidate/invitations'),
  
  acceptInvitation: (id: string) => api.post(`/candidate/invitations/${id}/accept`),
  
  downloadCertificate: (simId: string) => api.get(`/candidate/simulations/${simId}/certificate`, { 
    responseType: 'blob' 
  }),
};

/** 
 * --- 3. Employer (Recruiter) API --- 
 */
export const employerApi = {
  // Simulation management
  getSimulations: () => api.get('/employer/simulations'),
  getSimulationDetails: (id: string) => api.get(`/employer/simulations/${id}`),
  createSimulation: (data: any) => api.post('/employer/simulations', data),
  updateSimulation: (id: string, data: any) => api.put(`/employer/simulations/${id}`, data),
  deleteSimulation: (id: string) => api.delete(`/employer/simulations/${id}`),
  
  // Submission management
  getSubmissions: (simId: string) => api.get(`/employer/simulations/${simId}/submissions`),
  getSubmissionDetails: (subId: string) => api.get(`/employer/submissions/${subId}`),
  updateSubmissionStatus: (subId: string, status: 'shortlisted' | 'rejected' | 'reviewed') => 
    api.patch(`/employer/submissions/${subId}/status`, { status }),
  sendFeedback: (subId: string, feedback: string) => 
    api.post(`/employer/submissions/${subId}/feedback`, { feedback }),
  
  // Invitation management
  inviteCandidates: (simId: string, emails: string[]) => 
    api.post(`/employer/simulations/${simId}/invite`, { emails }),
  getInvitations: (simulationId: string) => 
    api.get(`/employer/simulations/${simulationId}/invitations`),
  resendInvitation: (invitationId: string) => 
    api.post(`/employer/invitations/${invitationId}/resend`),
  deleteInvitation: (invitationId: string) => 
    api.delete(`/employer/invitations/${invitationId}`),
  
  // Stats and exports
  getEmployerStats: () => api.get('/employer/stats'),
  exportResults: (simId: string) => api.get(`/employer/simulations/${simId}/export`, { 
    responseType: 'blob' 
  }),
};

/** 
 * --- FIXED simulationApi --- 
 * This object maps employer methods to simulationApi to fix component errors.
 */
export const simulationApi = {
  // TalentAnalytics uses getSimulations()
  getSimulations: () => employerApi.getSimulations(),
  
  // Dashboard & Builder uses these:
  get: (id: string) => employerApi.getSimulationDetails(id),
  create: (data: any) => employerApi.createSimulation(data),
  update: (id: string, data: any) => employerApi.updateSimulation(id, data),
  delete: (id: string) => employerApi.deleteSimulation(id),
  
  // Submissions & Invitations
  getSubmissions: (simId: string) => employerApi.getSubmissions(simId),
  getSubmissionDetails: (subId: string) => employerApi.getSubmissionDetails(subId),
  getInvitations: (simId: string) => employerApi.getInvitations(simId),
  inviteCandidates: (simId: string, emails: string[]) => employerApi.inviteCandidates(simId, emails),
  resendInvitation: (invId: string) => employerApi.resendInvitation(invId),
  deleteInvitation: (invId: string) => employerApi.deleteInvitation(invId),
  
  // Stats
  getStats: () => employerApi.getEmployerStats(),
  exportResults: (simId: string) => employerApi.exportResults(simId),
};

/** 
 * --- 4. Payment API (Chapa Integration) --- 
 */
export const paymentApi = {
  initiatePayment: (data: { amount: number; currency: string; simulationId?: string }) => 
    api.post('/payments/initialize', data),
  verifyPayment: (tx_ref: string) => api.get(`/payments/verify/${tx_ref}`),
  getPaymentHistory: () => api.get('/payments/history'),
};

/** 
 * --- 5. AI Engine API --- 
 */
export const aiApi = {
  evaluate: (data: { submission: any; rubric: any; expectedOutput?: any }) => 
    api.post('/ai/evaluate', data),
  getCareerAdvice: (profileData: any) => api.post('/ai/career-advice', profileData),
  generateSimulationQuestions: (jobTitle: string, difficulty: string) => 
    api.post('/ai/generate-questions', { jobTitle, difficulty }),
  analyzeMockInterview: (audioBlob: Blob) => {
    const fd = new FormData();
    fd.append('audio', audioBlob);
    return api.post('/ai/analyze-interview', fd, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
  },
};

/** 
 * --- 6. System & Notifications API --- 
 */
export const systemApi = {
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/notifications/read-all'),
  getLandingPageStats: () => api.get('/public/stats'),
};

/** 
 * --- 7. Admin Panel API --- 
 */
export const adminApi = {
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => 
    api.patch(`/admin/users/${userId}/status`, { status }),
  getSystemLogs: () => api.get('/admin/logs'),
  getAdminStats: () => api.get('/admin/stats'),
  
  // Admin invitation management
  getAllInvitations: (params?: any) => api.get('/admin/invitations', { params }),
  resendAdminInvitation: (invitationId: string) => 
    api.post(`/admin/invitations/${invitationId}/resend`),
  deleteAdminInvitation: (invitationId: string) => 
    api.delete(`/admin/invitations/${invitationId}`),
};

/** 
 * --- Helper Exports --- 
 */
export const apiHelpers = {
  setToken: (token: string) => localStorage.setItem('accessToken', token),
  getToken: () => localStorage.getItem('accessToken'),
  clearSession: () => localStorage.clear(),
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
  
  getUserRole: (): UserRole | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  },
};

export default api;