import { Timestamp } from 'firebase/firestore';
import { SafetyDomain } from './equipment.types';

export type SiteType = 
  | 'campus' | 'building' | 'factory' | 'warehouse' | 'office' 
  | 'retail' | 'educational' | 'healthcare' | 'residential' 
  | 'outdoor' | 'mixed_use';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SiteContact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export interface Site {
  id: string;
  tenantId: string;
  clientId: string;
  name: string;
  nameEn?: string;
  code?: string;
  type: SiteType;
  description?: string;
  image?: string;
  
  address: {
    street: string;
    city: string;
    postalCode?: string;
    country: string;
    fullAddress?: string;
  };
  
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  primaryContact: SiteContact;
  secondaryContact?: SiteContact;
  emergencyContact?: {
    name: string;
    phone: string;
    available24h: boolean;
  };
  
  safetyDomains: SafetyDomain[];
  riskLevel: RiskLevel;
  occupancy?: number;
  
  stats: {
    buildingsCount: number;
    equipmentCount: number;
    lastInspectionDate?: Timestamp;
    nextInspectionDate?: Timestamp;
    openFindingsCount: number;
    complianceScore: number;
  };
  
  status: 'active' | 'inactive' | 'suspended' | 'archived';
  
  createdAt: Timestamp;
  createdBy?: string;
  updatedAt: Timestamp;
  updatedBy?: string;
}

export interface Building {
  id: string;
  siteId: string;
  name: string;
  floors: number;
  description?: string;
  stats?: {
    equipmentCount: number;
    locationsCount: number;
  };
}

export interface SiteArea {
  id: string;
  buildingId: string;
  siteId: string;
  name: string;
  floor?: string;
  accessCode?: string;
  riskLevel?: RiskLevel;
  type: 'room' | 'corridor' | 'roof' | 'parking' | 'outdoor' | 'other';
}
