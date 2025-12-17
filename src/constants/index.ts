import { IconName } from "@/components/ui/SvgIcon";

export const APP_CONFIG = {
  name: 'Owners Global Login',
  description: 'Global authentication system for business owners',
  version: '1.0.0',
  author: 'Muhammad Maaz Khurshid',
  supportEmail: 'support@ownersglobal.com'
};

export const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_API_BASE_URL : process.env.NEXT_PUBLIC_API_PROD_BASE_URL,
  timeout: 10000,
  retryAttempts: 3
};

export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'user_data',
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  rememberMeTimeout: 30 * 24 * 60 * 60 * 1000 // 30 days
};


export const ROUTES = {
  HOME: '/',
  LOGIN: '/login?app=OG',
  CREATE_ORGANIZATION: "/create-organization",
  REGISTER: '/sign-up',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  DASHBOARD: '/',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const;

export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const THEME_COLORS = {
  light: {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b'
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#94a3b8',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9'
  }
} as const;

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    message: 'Password must contain at least 8 characters with uppercase, lowercase, numbers, and special characters'
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must contain only letters and spaces'
  }
} as const;

export const PRODUCTS = [
  {
    id: "inventory",
    name: "OI",
    fullname: "Owners Inventory",
    isDisabled: false,
    icon: "OI" as IconName,
  },
  {
    id: "marketplace",
    name: "OM",
    fullname: "Owners Marketplace",
    isDisabled: true,
    icon: "OM" as IconName,
  },
  {
    id: "analytics",
    name: "OA",
    fullname: "Owners Analytics",
    isDisabled: true,
    icon: "OA" as IconName,
  },
  {
    id: "jungle",
    name: "OJ",
    fullname: "Owners Jungle",
    isDisabled: true,
    icon: "OJ" as IconName,
  },
];