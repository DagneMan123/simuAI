export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYER = 'EMPLOYER',
  CANDIDATE = 'CANDIDATE'
}

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canManageUsers: true,
    canViewAllData: true,
    canManageSystem: true,
    canCreateSimulations: false,
    canTakeTests: false,
    dashboardRoute: '/admin'
  },
  [UserRole.EMPLOYER]: {
    canManageUsers: false,
    canViewAllData: false,
    canManageSystem: false,
    canCreateSimulations: true,
    canTakeTests: false,
    dashboardRoute: '/employer/dashboard'
  },
  [UserRole.CANDIDATE]: {
    canManageUsers: false,
    canViewAllData: false,
    canManageSystem: false,
    canCreateSimulations: false,
    canTakeTests: true,
    dashboardRoute: '/candidate/dashboard'
  }
};

export const ROLE_LABELS = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.EMPLOYER]: 'Employer',
  [UserRole.CANDIDATE]: 'Candidate'
};

export const ROLE_COLORS = {
  [UserRole.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
  [UserRole.EMPLOYER]: 'bg-blue-100 text-blue-800 border-blue-200',
  [UserRole.CANDIDATE]: 'bg-green-100 text-green-800 border-green-200'
};