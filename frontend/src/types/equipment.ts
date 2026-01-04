import { Timestamp } from 'firebase/firestore';
import { ApprovalStatus } from '../config/equipmentTypes';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  location?: string;
  status: 'active' | 'maintenance' | 'retired';
  nextInspectionDate?: Date | Timestamp;
  lastInspectionDate?: Date | Timestamp;
  tco?: number;
  
  // שדות קריטיות ואישור
  isCritical: boolean;
  approvalStatus: ApprovalStatus;
  approvalDate?: Timestamp;
  approvedBy?: string;
  rejectionReason?: string;
  
  // מי הוסיף
  addedBy?: string;
  addedByRole?: 'consultant' | 'client';
  
  // תאריכים
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  
  // היסטוריה
  historyLog?: EquipmentHistoryEntry[];
}

export interface EquipmentHistoryEntry {
  id: string;
  date: string;
  type: 'inspection' | 'calibration' | 'repair' | 'maintenance';
  description?: string;
  providerName?: string;
  cost?: number;
}

export interface EquipmentPolicy {
  allowClientToAddEquipment: boolean;
  criticalTypes: string[];
  requireApprovalForTypes: string[];
  clientCanAddTypes: string[] | null; // null = all types
  notifyOnNewEquipment: boolean;
  notifyEmail?: string;
}
