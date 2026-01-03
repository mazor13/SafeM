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
  exportInspectionHistory,
  exportFindingsList,
  exportClientsList,
  exportSchedule,
  exportComplianceReport,
  exportFullReport,
  ExportButton,
  ExcelExportStyles,
  EXPORT_CONFIGS,
} from './services/ExcelExport';
export type {
  ExportColumn,
  ExportOptions,
  MultiSheetExport,
  FullReportData,
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

export {
  ClientPortal,
  ClientPortalStyles,
} from './components/ClientPortal';
export type {
  ClientPortalData,
  ClientEquipmentItem,
  ClientInspectionItem,
  ClientFindingItem,
  ClientUpcomingItem,
  ClientDocument,
} from './components/ClientPortal';

// Excel Export Utilities
export {
  exportToExcel,
  exportToCSV,
  downloadCSV,
  exportEquipmentList,
  exportInspectionsList,
  exportFindingsList,
  exportClientsList,
  exportAnalyticsReport,
  generateExportFilename,
  getEquipmentExportConfig,
  getInspectionsExportConfig,
  getFindingsExportConfig,
  getClientsExportConfig,
  getAnalyticsSummaryExportConfig,
} from './utils/excelExport';
export type {
  ExcelColumn,
  ExcelSheet,
  ExcelStyle,
  ExcelExportOptions,
} from './utils/excelExport';
