/**
 * Organization entity for multi-tenancy
 * Every organization is isolated from others
 */
export interface Organization {
  id: string;
  name: string;
  nameHebrew: string; // Hebrew name for RTL support
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  settings: OrganizationSettings;
  modules: OrganizationModule[];
}

/**
 * Organization-specific settings
 */
export interface OrganizationSettings {
  language: 'he' | 'en';
  timezone: string;
  logo?: string;
  primaryColor?: string;
}

/**
 * Available safety modules
 */
export enum SafetyModule {
  RADIATION = 'radiation',
  LASER = 'laser',
  FIRE = 'fire',
  WORK_SAFETY = 'work_safety',
  TRAINING = 'training',
  CHEMICAL = 'chemical',
  ELECTRICAL = 'electrical',
}

/**
 * Module configuration for an organization
 */
export interface OrganizationModule {
  module: SafetyModule;
  enabled: boolean;
  settings?: Record<string, unknown>;
}

/**
 * Organization creation data
 */
export interface CreateOrganizationData {
  name: string;
  nameHebrew: string;
  email: string;
  phone: string;
  address: string;
  modules: SafetyModule[];
}
