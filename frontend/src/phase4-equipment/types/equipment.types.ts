/**
 * AEGIS Equipment Management Types
 * Types for equipment tracking and management
 */

import { SafetyDomain } from '../types/safety';

// ============================================
// 📦 Equipment Status
// ============================================

export type EquipmentStatus = 
  | 'active'           // פעיל - בשימוש
  | 'inactive'         // לא פעיל
  | 'maintenance'      // בתחזוקה
  | 'out_of_service'   // מושבת
  | 'pending_inspection' // ממתין לבדיקה
  | 'failed_inspection'  // נכשל בבדיקה
  | 'retired';         // הוצא משימוש

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, { he: string; en: string; color: string }> = {
  active: { he: 'פעיל', en: 'Active', color: 'green' },
  inactive: { he: 'לא פעיל', en: 'Inactive', color: 'gray' },
  maintenance: { he: 'בתחזוקה', en: 'In Maintenance', color: 'yellow' },
  out_of_service: { he: 'מושבת', en: 'Out of Service', color: 'red' },
  pending_inspection: { he: 'ממתין לבדיקה', en: 'Pending Inspection', color: 'orange' },
  failed_inspection: { he: 'נכשל בבדיקה', en: 'Failed Inspection', color: 'red' },
  retired: { he: 'הוצא משימוש', en: 'Retired', color: 'gray' },
};

// ============================================
// 🏭 Equipment Types by Domain
// ============================================

export interface EquipmentTypeDefinition {
  id: string;
  domain: SafetyDomain;
  name: string;
  nameEn: string;
  inspectionFrequency: number; // months
  requiresCertification: boolean;
  icon?: string;
}

export const EQUIPMENT_TYPES: EquipmentTypeDefinition[] = [
  // Laser
  { id: 'laser_class_4', domain: 'laser', name: 'לייזר Class 4', nameEn: 'Class 4 Laser', inspectionFrequency: 3, requiresCertification: true },
  { id: 'laser_class_3b', domain: 'laser', name: 'לייזר Class 3B', nameEn: 'Class 3B Laser', inspectionFrequency: 3, requiresCertification: true },
  { id: 'laser_class_3r', domain: 'laser', name: 'לייזר Class 3R', nameEn: 'Class 3R Laser', inspectionFrequency: 6, requiresCertification: false },
  { id: 'laser_medical', domain: 'laser', name: 'לייזר רפואי', nameEn: 'Medical Laser', inspectionFrequency: 3, requiresCertification: true },
  
  // Fire
  { id: 'extinguisher_powder', domain: 'fire', name: 'מטף אבקה', nameEn: 'Powder Extinguisher', inspectionFrequency: 12, requiresCertification: false },
  { id: 'extinguisher_co2', domain: 'fire', name: 'מטף CO2', nameEn: 'CO2 Extinguisher', inspectionFrequency: 12, requiresCertification: false },
  { id: 'extinguisher_foam', domain: 'fire', name: 'מטף קצף', nameEn: 'Foam Extinguisher', inspectionFrequency: 12, requiresCertification: false },
  { id: 'smoke_detector', domain: 'fire', name: 'גלאי עשן', nameEn: 'Smoke Detector', inspectionFrequency: 12, requiresCertification: false },
  { id: 'fire_panel', domain: 'fire', name: 'לוח גילוי אש', nameEn: 'Fire Detection Panel', inspectionFrequency: 12, requiresCertification: false },
  { id: 'sprinkler_system', domain: 'fire', name: 'מערכת ספרינקלרים', nameEn: 'Sprinkler System', inspectionFrequency: 12, requiresCertification: true },
  { id: 'fire_hose', domain: 'fire', name: 'גלגלון כיבוי', nameEn: 'Fire Hose Reel', inspectionFrequency: 12, requiresCertification: false },
  
  // Lifting
  { id: 'crane_overhead', domain: 'lifting', name: 'עגורן גשר', nameEn: 'Overhead Crane', inspectionFrequency: 14, requiresCertification: true },
  { id: 'crane_mobile', domain: 'lifting', name: 'עגורן נייד', nameEn: 'Mobile Crane', inspectionFrequency: 14, requiresCertification: true },
  { id: 'crane_tower', domain: 'lifting', name: 'עגורן צריח', nameEn: 'Tower Crane', inspectionFrequency: 14, requiresCertification: true },
  { id: 'forklift_electric', domain: 'lifting', name: 'מלגזה חשמלית', nameEn: 'Electric Forklift', inspectionFrequency: 14, requiresCertification: true },
  { id: 'forklift_lpg', domain: 'lifting', name: 'מלגזה גפ"מ', nameEn: 'LPG Forklift', inspectionFrequency: 14, requiresCertification: true },
  { id: 'forklift_diesel', domain: 'lifting', name: 'מלגזה דיזל', nameEn: 'Diesel Forklift', inspectionFrequency: 14, requiresCertification: true },
  { id: 'elevator_passenger', domain: 'lifting', name: 'מעלית נוסעים', nameEn: 'Passenger Elevator', inspectionFrequency: 6, requiresCertification: true },
  { id: 'elevator_freight', domain: 'lifting', name: 'מעלית משא', nameEn: 'Freight Elevator', inspectionFrequency: 6, requiresCertification: true },
  { id: 'hoist', domain: 'lifting', name: 'מכונת הרמה', nameEn: 'Hoist', inspectionFrequency: 14, requiresCertification: true },
  { id: 'lifting_platform', domain: 'lifting', name: 'במה מתרוממת', nameEn: 'Lifting Platform', inspectionFrequency: 14, requiresCertification: true },
  
  // Pressure
  { id: 'steam_boiler', domain: 'pressure', name: 'דוד קיטור', nameEn: 'Steam Boiler', inspectionFrequency: 14, requiresCertification: true },
  { id: 'air_receiver', domain: 'pressure', name: 'קולט אוויר', nameEn: 'Air Receiver', inspectionFrequency: 26, requiresCertification: true },
  { id: 'pressure_vessel', domain: 'pressure', name: 'מכל לחץ', nameEn: 'Pressure Vessel', inspectionFrequency: 26, requiresCertification: true },
  { id: 'compressor', domain: 'pressure', name: 'מדחס', nameEn: 'Compressor', inspectionFrequency: 12, requiresCertification: false },
  { id: 'autoclave', domain: 'pressure', name: 'אוטוקלב', nameEn: 'Autoclave', inspectionFrequency: 26, requiresCertification: true },
  
  // Electrical
  { id: 'electrical_panel', domain: 'electrical', name: 'לוח חשמל', nameEn: 'Electrical Panel', inspectionFrequency: 12, requiresCertification: false },
  { id: 'generator', domain: 'electrical', name: 'גנרטור', nameEn: 'Generator', inspectionFrequency: 12, requiresCertification: false },
  { id: 'ups', domain: 'electrical', name: 'אל-פסק', nameEn: 'UPS', inspectionFrequency: 12, requiresCertification: false },
  
  // Chemical
  { id: 'chemical_storage', domain: 'chemical', name: 'מחסן כימיקלים', nameEn: 'Chemical Storage', inspectionFrequency: 12, requiresCertification: false },
  { id: 'fume_hood', domain: 'chemical', name: 'מנדף', nameEn: 'Fume Hood', inspectionFrequency: 12, requiresCertification: false },
  { id: 'eye_wash', domain: 'chemical', name: 'מתקן שטיפת עיניים', nameEn: 'Eye Wash Station', inspectionFrequency: 1, requiresCertification: false },
  { id: 'safety_shower', domain: 'chemical', name: 'מקלחת חירום', nameEn: 'Safety Shower', inspectionFrequency: 1, requiresCertification: false },
];

// ============================================
// 📦 Equipment Entity
// ============================================

export interface Equipment {
  id: string;
  
  // Basic Info
  name: string;
  description?: string;
  equipmentTypeId: string;
  domain: SafetyDomain;
  
  // Identification
  serialNumber?: string;
  internalId?: string;
  registrationNumber?: string; // מספר רישום משרד העבודה
  
  // Manufacturer
  manufacturer?: string;
  model?: string;
  manufactureYear?: number;
  installationDate?: Date;
  
  // Technical Specs
  specifications?: Record<string, any>;
  
  // Location
  clientId: string;
  locationId?: string;
  locationDescription?: string;
  
  // Status
  status: EquipmentStatus;
  
  // Inspection
  lastInspectionDate?: Date;
  lastInspectionResult?: 'pass' | 'fail' | 'conditional';
  nextInspectionDate?: Date;
  inspectionFrequencyMonths: number;
  
  // Certification
  certificateNumber?: string;
  certificateExpiry?: Date;
  
  // Documents
  documents?: EquipmentDocument[];
  
  // Photos
  photos?: string[];
  
  // Notes
  notes?: string;
  
  // Metadata
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  isDeleted?: boolean;
}

export interface EquipmentDocument {
  id: string;
  name: string;
  type: 'certificate' | 'manual' | 'inspection_report' | 'other';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// ============================================
// 📍 Location Entity
// ============================================

export interface Location {
  id: string;
  clientId: string;
  
  // Hierarchy
  parentId?: string;
  level: 'site' | 'building' | 'floor' | 'room' | 'area';
  
  // Info
  name: string;
  code?: string;
  description?: string;
  
  // Address (for site level)
  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  
  // Contact
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  
  // Equipment count (computed)
  equipmentCount?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

// ============================================
// 🔍 Filters & Queries
// ============================================

export interface EquipmentFilters {
  clientId?: string;
  locationId?: string;
  domain?: SafetyDomain;
  equipmentTypeId?: string;
  status?: EquipmentStatus;
  searchTerm?: string;
  inspectionOverdue?: boolean;
  inspectionDueSoon?: number; // days
}

export interface LocationFilters {
  clientId?: string;
  parentId?: string;
  level?: Location['level'];
  searchTerm?: string;
}

// ============================================
// 📊 Statistics
// ============================================

export interface EquipmentStats {
  total: number;
  byStatus: Record<EquipmentStatus, number>;
  byDomain: Record<SafetyDomain, number>;
  inspectionOverdue: number;
  inspectionDueSoon: number; // within 30 days
  requireingCertification: number;
}

// ============================================
// 🛠️ Helper Functions
// ============================================

export function getEquipmentTypeById(id: string): EquipmentTypeDefinition | undefined {
  return EQUIPMENT_TYPES.find(t => t.id === id);
}

export function getEquipmentTypesByDomain(domain: SafetyDomain): EquipmentTypeDefinition[] {
  return EQUIPMENT_TYPES.filter(t => t.domain === domain);
}

export function calculateNextInspectionDate(
  lastInspection: Date,
  frequencyMonths: number
): Date {
  const next = new Date(lastInspection);
  next.setMonth(next.getMonth() + frequencyMonths);
  return next;
}

export function isInspectionOverdue(equipment: Equipment): boolean {
  if (!equipment.nextInspectionDate) return false;
  return new Date(equipment.nextInspectionDate) < new Date();
}

export function isInspectionDueSoon(equipment: Equipment, days: number = 30): boolean {
  if (!equipment.nextInspectionDate) return false;
  const dueDate = new Date(equipment.nextInspectionDate);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() + days);
  return dueDate <= threshold && dueDate >= new Date();
}

export function getStatusColor(status: EquipmentStatus): string {
  return EQUIPMENT_STATUS_LABELS[status]?.color || 'gray';
}

export function formatEquipmentId(equipment: Equipment): string {
  return equipment.internalId || equipment.serialNumber || equipment.id.slice(0, 8);
}
