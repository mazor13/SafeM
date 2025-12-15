import { SafetyModule } from './organization.types';

/**
 * Base interface for all module records
 * Every record MUST have organizationId for multi-tenancy
 */
export interface BaseModuleRecord {
  id: string;
  organizationId: string; // Required for multi-tenancy isolation
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  status: RecordStatus;
}

/**
 * Record status
 */
export enum RecordStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

/**
 * Radiation module record
 */
export interface RadiationRecord extends BaseModuleRecord {
  module: SafetyModule.RADIATION;
  deviceName: string;
  deviceType: string;
  serialNumber: string;
  manufacturer: string;
  location: string;
  lastInspectionDate?: Date;
  nextInspectionDate: Date;
  inspectorId?: string;
  measurements: RadiationMeasurement[];
  notes?: string;
}

/**
 * Radiation measurement
 */
export interface RadiationMeasurement {
  date: Date;
  value: number;
  unit: string;
  inspectorId: string;
  location: string;
  withinLimits: boolean;
}

/**
 * Laser module record
 */
export interface LaserRecord extends BaseModuleRecord {
  module: SafetyModule.LASER;
  laserClass: string;
  deviceName: string;
  serialNumber: string;
  manufacturer: string;
  wavelength: number;
  power: number;
  location: string;
  lastInspectionDate?: Date;
  nextInspectionDate: Date;
  inspectorId?: string;
  safetyMeasures: string[];
  notes?: string;
}

/**
 * Fire safety module record
 */
export interface FireSafetyRecord extends BaseModuleRecord {
  module: SafetyModule.FIRE;
  equipmentType: 'extinguisher' | 'alarm' | 'sprinkler' | 'other';
  equipmentId: string;
  location: string;
  lastInspectionDate?: Date;
  nextInspectionDate: Date;
  inspectorId?: string;
  condition: 'good' | 'fair' | 'poor' | 'needs_replacement';
  notes?: string;
}

/**
 * Work safety module record
 */
export interface WorkSafetyRecord extends BaseModuleRecord {
  module: SafetyModule.WORK_SAFETY;
  inspectionType: string;
  area: string;
  hazards: string[];
  recommendations: string[];
  inspectorId: string;
  inspectionDate: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  notes?: string;
}

/**
 * Training module record
 */
export interface TrainingRecord extends BaseModuleRecord {
  module: SafetyModule.TRAINING;
  title: string;
  titleHebrew: string;
  description: string;
  trainingType: string;
  trainerId: string;
  participantIds: string[];
  scheduledDate: Date;
  completedDate?: Date;
  duration: number; // minutes
  materials?: string[];
  certificateIssued: boolean;
  notes?: string;
}

/**
 * Union type for all module records
 */
export type ModuleRecord =
  | RadiationRecord
  | LaserRecord
  | FireSafetyRecord
  | WorkSafetyRecord
  | TrainingRecord;
