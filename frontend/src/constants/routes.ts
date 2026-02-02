export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  PRICING: '/pricing',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  
  // Admin Routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SYSTEM_LOGS: '/admin/system-logs',
  ADMIN_VERIFICATION: '/admin/verification',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_REPORTS: '/admin/reports',
  
  // Employer Routes
  EMPLOYER_DASHBOARD: '/employer/dashboard',
  EMPLOYER_CREATE_SIMULATION: '/employer/create-simulation',
  EMPLOYER_CANDIDATES: '/employer/candidates',
  EMPLOYER_BILLING: '/employer/billing',
  EMPLOYER_INTERVIEWS: '/employer/interviews',
  EMPLOYER_TEMPLATES: '/employer/templates',
  
  // Candidate Routes
  CANDIDATE_DASHBOARD: '/candidate/dashboard',
  CANDIDATE_ASSESSMENT_ROOM: '/candidate/assessment/:id',
  CANDIDATE_MY_RESULTS: '/candidate/results',
  CANDIDATE_PROFILE: '/candidate/profile',
  CANDIDATE_PRACTICE: '/candidate/practice',
  CANDIDATE_JOBS: '/candidate/jobs',
  
  // Arena/Exam Routes
  ARENA: '/arena/:examId',
  
  // API Routes
  API: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
    },
    USERS: '/api/users',
    SIMULATIONS: '/api/simulations',
    CANDIDATES: '/api/candidates',
    PAYMENTS: '/api/payments',
    AI_CHAT: '/api/ai/chat',
    REPORTS: '/api/reports',
  }
};

export const PROTECTED_ROUTES = {
  ADMIN: [ROUTES.ADMIN, ROUTES.ADMIN_USERS, ROUTES.ADMIN_SYSTEM_LOGS],
  EMPLOYER: [ROUTES.EMPLOYER_DASHBOARD, ROUTES.EMPLOYER_CREATE_SIMULATION],
  CANDIDATE: [ROUTES.CANDIDATE_DASHBOARD, ROUTES.CANDIDATE_ASSESSMENT_ROOM],
};

export const getRouteWithParams = (route: string, params: Record<string, string>): string => {
  let result = route;
  Object.keys(params).forEach(key => {
    result = result.replace(`:${key}`, params[key]);
  });
  return result;
};