/**
 * AEGIS Phase 5 - Reports & Analytics Module
 * דוחות ואנליטיקה
 */

// Types
export * from './types/safety';

// PDF Report Generator
export { 
  ReportPreview, 
  ReportPreviewStyles,
  printReport,
  generatePDFDataUrl,
  downloadPDF,
  generateReportFilename,
} from './components/PDFReportGenerator';
export type {
  ReportData,
  ReportSection,
  ReportFinding,
  ReportTemplate,
  PDFGeneratorOptions,
} from './components/PDFReportGenerator';

// Inspection History
export { 
  InspectionHistory, 
  InspectionHistoryStyles,
} from './components/InspectionHistory';
export type {
  InspectionHistoryItem,
  HistoryFilters,
  HistoryStats,
} from './components/InspectionHistory';

// Analytics Dashboard
export { 
  AnalyticsDashboard, 
  AnalyticsDashboardStyles,
} from './components/AnalyticsDashboard';
export type {
  AnalyticsData,
  DateRange,
} from './components/AnalyticsDashboard';

// Client Portal
export {
  ClientPortal,
  ClientPortalStyles,
} from './components/ClientPortal';
export type {
  ClientPortalData,
  ClientEquipment,
  ClientInspection,
  ClientFinding,
  ClientDocument,
  ScheduledInspection,
} from './components/ClientPortal';

// Excel Export
export {
  exportToExcel,
  exportMultiSheet,
  exportEquipmentList,
  exportInspectionsList,
  exportFindingsList,
  exportClientsList,
  ExportButton,
  EXPORT_CONFIGS,
} from './services/ExcelExport';
export type {
  ExportColumn,
  ExportOptions,
} from './services/ExcelExport';

// Compliance Report
export {
  ComplianceReport,
  ComplianceReportStyles,
} from './components/ComplianceReport';
export type {
  ComplianceReportData,
  DomainCompliance,
  ClientCompliance,
  ComplianceIssue,
  ComplianceDeadline,
  RegulatoryRequirement,
} from './components/ComplianceReport';
