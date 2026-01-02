/**
 * AEGIS Phase 4 - Equipment Management Module
 * ניהול ציוד ומתקנים
 */

// Types
export * from './types/equipment.types';
export * from './types/safety';

// Components
export { EquipmentList, EquipmentListStyles } from './components/EquipmentList';
export { EquipmentForm, EquipmentFormStyles } from './components/EquipmentForm';
export { 
  LocationTree, 
  LocationForm, 
  LocationBreadcrumb,
  LocationStyles,
  LOCATION_LEVELS,
} from './components/LocationManager';
export { 
  InspectionDashboard, 
  InspectionDashboardStyles 
} from './components/InspectionDashboard';
export {
  FindingList,
  FindingForm,
  FindingStyles,
  SEVERITY_CONFIG,
  STATUS_CONFIG,
  FINDING_CATEGORIES,
  calculateFindingStats,
  isOverdue,
  sortFindings,
} from './components/FindingTracker';
export type {
  Finding,
  FindingSeverity,
  FindingStatus,
  FindingFilters,
  FindingStats,
} from './components/FindingTracker';

// Services
export * from './services/inspectionScheduler';

// Hooks
export { useEquipment, useLocations, useEquipmentStats } from './hooks/useEquipment';
export { useFindings, useFindingStats } from './hooks/useFindings';
