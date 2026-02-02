// Environment Configuration
const ENV = {
  MODE: import.meta.env.MODE || 'development',
  DEV: import.meta.env.DEV || false,
  PROD: import.meta.env.PROD || false,
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Payment Configuration (Chapa)
export const PAYMENT_CONFIG = {
  CHAPA_PUBLIC_KEY: import.meta.env.VITE_CHAPA_PUBLIC_KEY || '',
  CHAPA_SECRET_KEY: import.meta.env.VITE_CHAPA_SECRET_KEY || '',
  CHAPA_BASE_URL: 'https://api.chapa.co/v1',
  CURRENCY: 'ETB',
  SUCCESS_URL: `${window.location.origin}/payment/success`,
  FAILURE_URL: `${window.location.origin}/payment/failed`,
};

// AI Configuration
export const AI_CONFIG = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  CLAUDE_API_KEY: import.meta.env.VITE_CLAUDE_API_KEY || '',
  AI_MODEL: import.meta.env.VITE_AI_MODEL || 'gpt-4',
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
};

// Application Configuration
export const APP_CONFIG = {
  APP_NAME: 'SimuAI',
  APP_VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@simuai.com',
  COMPANY_NAME: 'SimuAI Technologies',
  COMPANY_ADDRESS: 'Addis Ababa, Ethiopia',
  
  // Features
  ENABLE_PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
  ENABLE_AI_CHAT: import.meta.env.VITE_ENABLE_AI_CHAT === 'true',
  ENABLE_EMAIL_NOTIFICATIONS: import.meta.env.VITE_ENABLE_EMAIL_NOTIFICATIONS === 'true',
  
  // Limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour in milliseconds
};

// URLs
export const URLS = {
  WEBSITE: 'https://simuai.com',
  DOCUMENTATION: 'https://docs.simuai.com',
  API_DOCS: 'https://api.simuai.com/docs',
  GITHUB: 'https://github.com/simuai',
  LINKEDIN: 'https://linkedin.com/company/simuai',
  TWITTER: 'https://twitter.com/simuai',
};

export default {
  ENV,
  API_CONFIG,
  PAYMENT_CONFIG,
  AI_CONFIG,
  APP_CONFIG,
  URLS
};