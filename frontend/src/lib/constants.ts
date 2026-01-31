export const APP_CONFIG = {
  SITE_NAME: 'SimuAI',
  DESCRIPTION: 'Revolutionize hiring with AI-powered skill assessments',
  BASE_URL: process.env.VITE_BASE_URL || 'http://localhost:3000',
  API_TIMEOUT: 30000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  SUPPORTED_DOC_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SIMULATIONS: '/simulations',
  CANDIDATES: '/candidates',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  MY_ASSESSMENTS: '/my-assessments',
}

export const USER_ROLES = {
  EMPLOYER: 'EMPLOYER',
  CANDIDATE: 'CANDIDATE',
  ADMIN: 'ADMIN',
} as const

export const SIMULATION_TYPES = {
  AI_CHAT: 'AI Chat',
  CODE_REVIEW: 'Code Review',
  DOCUMENT_ANALYSIS: 'Document Analysis',
  MULTIPLE_CHOICE: 'Multiple Choice',
} as const

export const INTEGRITY_FLAGS = {
  TAB_SWITCH: 'TAB_SWITCH',
  COPY_ATTEMPT: 'COPY_ATTEMPT',
  PASTE_ATTEMPT: 'PASTE_ATTEMPT',
  WINDOW_BLUR: 'WINDOW_BLUR',
} as const

export const STATUS_COLORS = {
  INVITED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  EXPIRED: 'bg-red-100 text-red-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  PUBLISHED: 'bg-purple-100 text-purple-800',
}

export const SCORE_COLORS = {
  EXCELLENT: 'bg-green-100 text-green-800',
  GOOD: 'bg-blue-100 text-blue-800',
  AVERAGE: 'bg-yellow-100 text-yellow-800',
  POOR: 'bg-red-100 text-red-800',
}

export const getScoreColor = (score: number): string => {
  if (score >= 90) return SCORE_COLORS.EXCELLENT
  if (score >= 75) return SCORE_COLORS.GOOD
  if (score >= 60) return SCORE_COLORS.AVERAGE
  return SCORE_COLORS.POOR
}