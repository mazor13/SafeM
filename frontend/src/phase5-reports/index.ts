/**
 * AEGIS Phase 5 - Reports & Analytics Module
 * דוחות ואנליטיקה
 */

// Types
export * from './types/safety';

// Components
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

export { 
  InspectionHistory, 
  InspectionHistoryStyles,
} from './components/InspectionHistory';
export type {
  InspectionHistoryItem,
  HistoryFilters,
  HistoryStats,
} from './components/InspectionHistory';

export { 
  AnalyticsDashboard, 
  AnalyticsDashboardStyles,
} from './components/AnalyticsDashboard';
export type {
  AnalyticsData,
  DateRange,
} from './components/AnalyticsDashboard';
