/**
 * User Roles in the system hierarchy
 * SuperAdmin -> OrgAdmin -> Inspector -> Client
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ORG_ADMIN = 'org_admin',
  INSPECTOR = 'inspector',
  CLIENT = 'client',
}

/**
 * Role hierarchy levels - higher number = more permissions
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 4,
  [UserRole.ORG_ADMIN]: 3,
  [UserRole.INSPECTOR]: 2,
  [UserRole.CLIENT]: 1,
};

/**
 * User interface with organization association
 */
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  organizationId: string; // Multi-tenancy: every user belongs to an organization
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/**
 * User creation data
 */
export interface CreateUserData {
  email: string;
  displayName: string;
  role: UserRole;
  organizationId: string;
  password: string;
}

/**
 * User update data
 */
export interface UpdateUserData {
  displayName?: string;
  role?: UserRole;
  isActive?: boolean;
}
