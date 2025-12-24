import { Timestamp } from 'firebase/firestore';

export type Role = 'super_admin' | 'org_admin' | 'safety_manager' | 'employee';

// *** התיקון: הוספת 'training' לרשימה ***
export type ModuleType = 'safety' | 'laser' | 'fire' | 'training';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  organizationId: string;
  avatarUrl?: string;
  createdAt: Timestamp | Date;
}

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  contactEmail?: string;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  maxUsers: number;
  createdAt: Timestamp | Date;
}

export interface Client {
  id: string;
  name: string;
  organizationId: string;
  logoUrl?: string;
  contactPerson?: {
    name: string;
    email: string;
    phone: string;
  };
  contractDetails?: {
    startDate: Timestamp | Date;
    endDate?: Timestamp | Date;
    activeModules: ModuleType[];
    status: 'active' | 'suspended' | 'expired';
    
    // שדות ה-SaaS (נשמרים מהעדכון הקודם)
    planName?: string;       
    maxUsers?: number;       
    maxSubClients?: number;  
    storageLimitGB?: number; 
  };
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'laser' | 'fire_extinguisher' | 'machine' | 'other';
  serialNumber?: string;
  model?: string;
  status: 'active' | 'maintenance' | 'retired' | 'storage';
  nextInspectionDate: Timestamp | Date | string;
  lastInspectionDate?: Timestamp | Date;
  organizationId: string;
  clientId: string;
  createdAt?: Timestamp | Date;
}
