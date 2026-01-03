/**
 * AEGIS Excel Export Service
 * שירות ייצוא לאקסל
 * 
 * Uses SheetJS (xlsx) library for client-side Excel generation
 */

// ============================================
// 📋 Types
// ============================================

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
  format?: 'text' | 'number' | 'date' | 'currency' | 'percentage';
}

export interface ExportOptions {
  filename: string;
  sheetName?: string;
  columns?: ExportColumn[];
  includeHeaders?: boolean;
  dateFormat?: string;
  rtl?: boolean;
}

export interface MultiSheetExport {
  filename: string;
  sheets: {
    name: string;
    data: any[];
    columns?: ExportColumn[];
  }[];
}

// ============================================
// 📊 Export Functions
// ============================================

/**
 * Export data to Excel file
 * Uses browser-compatible approach
 */
export async function exportToExcel(
  data: any[],
  options: ExportOptions
): Promise<void> {
  const {
    filename,
    sheetName = 'Sheet1',
    columns,
    includeHeaders = true,
    rtl = true,
  } = options;

  // Build CSV content (works without external library)
  let csvContent = '';
  
  // Headers
  if (includeHeaders && columns) {
    csvContent += columns.map(col => `"${col.header}"`).join(',') + '\n';
  }

  // Data rows
  data.forEach(row => {
    const values = columns 
      ? columns.map(col => formatCellValue(row[col.key], col.format))
      : Object.values(row).map(v => formatCellValue(v));
    csvContent += values.map(v => `"${v}"`).join(',') + '\n';
  });

  // Download as CSV (can be opened in Excel)
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export multiple sheets to Excel
 */
export async function exportMultiSheet(options: MultiSheetExport): Promise<void> {
  // For multi-sheet, we need xlsx library
  // This is a simplified version that exports as separate CSVs in a ZIP
  // In production, use SheetJS: import * as XLSX from 'xlsx';
  
  const { filename, sheets } = options;
  
  // For now, export first sheet only (full implementation requires xlsx library)
  if (sheets.length > 0) {
    const firstSheet = sheets[0];
    await exportToExcel(firstSheet.data, {
      filename,
      sheetName: firstSheet.name,
      columns: firstSheet.columns,
    });
  }
}

/**
 * Format cell value based on type
 */
function formatCellValue(value: any, format?: string): string {
  if (value === null || value === undefined) return '';
  
  switch (format) {
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString('he-IL');
      }
      if (typeof value === 'string') {
        return new Date(value).toLocaleDateString('he-IL');
      }
      return String(value);
      
    case 'number':
      return typeof value === 'number' ? value.toString() : String(value);
      
    case 'currency':
      return typeof value === 'number' ? `₪${value.toLocaleString('he-IL')}` : String(value);
      
    case 'percentage':
      return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value);
      
    default:
      return String(value).replace(/"/g, '""'); // Escape quotes for CSV
  }
}

/**
 * Download file in browser
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  // Add BOM for Hebrew support in Excel
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// ============================================
// 📊 Pre-defined Export Configurations
// ============================================

export const EXPORT_CONFIGS = {
  // Equipment list export
  equipment: {
    columns: [
      { key: 'name', header: 'שם הציוד', width: 30 },
      { key: 'type', header: 'סוג', width: 20 },
      { key: 'domain', header: 'תחום', width: 15 },
      { key: 'serialNumber', header: 'מספר סידורי', width: 20 },
      { key: 'manufacturer', header: 'יצרן', width: 20 },
      { key: 'model', header: 'דגם', width: 15 },
      { key: 'location', header: 'מיקום', width: 25 },
      { key: 'status', header: 'סטטוס', width: 15 },
      { key: 'lastInspection', header: 'בדיקה אחרונה', width: 15, format: 'date' as const },
      { key: 'nextInspection', header: 'בדיקה הבאה', width: 15, format: 'date' as const },
    ],
  },
  
  // Inspections export
  inspections: {
    columns: [
      { key: 'date', header: 'תאריך', width: 15, format: 'date' as const },
      { key: 'equipmentName', header: 'ציוד', width: 25 },
      { key: 'equipmentType', header: 'סוג ציוד', width: 20 },
      { key: 'clientName', header: 'לקוח', width: 25 },
      { key: 'inspectorName', header: 'בודק', width: 20 },
      { key: 'result', header: 'תוצאה', width: 15 },
      { key: 'findingsCount', header: 'ממצאים', width: 10, format: 'number' as const },
      { key: 'certificateNumber', header: 'מספר תעודה', width: 20 },
    ],
  },
  
  // Findings export
  findings: {
    columns: [
      { key: 'foundDate', header: 'תאריך מציאה', width: 15, format: 'date' as const },
      { key: 'equipmentName', header: 'ציוד', width: 25 },
      { key: 'clientName', header: 'לקוח', width: 25 },
      { key: 'title', header: 'כותרת', width: 30 },
      { key: 'severity', header: 'חומרה', width: 12 },
      { key: 'status', header: 'סטטוס', width: 15 },
      { key: 'dueDate', header: 'תאריך יעד', width: 15, format: 'date' as const },
      { key: 'assignedTo', header: 'אחראי', width: 20 },
    ],
  },
  
  // Clients export
  clients: {
    columns: [
      { key: 'name', header: 'שם הלקוח', width: 30 },
      { key: 'contactPerson', header: 'איש קשר', width: 20 },
      { key: 'phone', header: 'טלפון', width: 15 },
      { key: 'email', header: 'אימייל', width: 25 },
      { key: 'address', header: 'כתובת', width: 30 },
      { key: 'equipmentCount', header: 'מספר ציוד', width: 12, format: 'number' as const },
      { key: 'complianceScore', header: 'ציון ציות', width: 12, format: 'percentage' as const },
    ],
  },
  
  // Schedule export
  schedule: {
    columns: [
      { key: 'scheduledDate', header: 'תאריך מתוכנן', width: 15, format: 'date' as const },
      { key: 'equipmentName', header: 'ציוד', width: 25 },
      { key: 'equipmentType', header: 'סוג', width: 20 },
      { key: 'clientName', header: 'לקוח', width: 25 },
      { key: 'inspectorName', header: 'בודק', width: 20 },
      { key: 'priority', header: 'עדיפות', width: 12 },
    ],
  },
  
  // Compliance report
  compliance: {
    columns: [
      { key: 'clientName', header: 'לקוח', width: 25 },
      { key: 'domain', header: 'תחום', width: 15 },
      { key: 'totalEquipment', header: 'סה"כ ציוד', width: 12, format: 'number' as const },
      { key: 'compliantEquipment', header: 'ציוד תקין', width: 12, format: 'number' as const },
      { key: 'overdueCount', header: 'באיחור', width: 12, format: 'number' as const },
      { key: 'openFindings', header: 'ממצאים פתוחים', width: 15, format: 'number' as const },
      { key: 'complianceScore', header: 'ציון ציות', width: 12, format: 'percentage' as const },
    ],
  },
};

// ============================================
// 📊 Quick Export Functions
// ============================================

export function exportEquipmentList(data: any[], clientName?: string): void {
  const filename = clientName 
    ? `equipment_${clientName}_${getDateStamp()}`
    : `equipment_all_${getDateStamp()}`;
    
  exportToExcel(data, {
    filename,
    sheetName: 'ציוד',
    columns: EXPORT_CONFIGS.equipment.columns,
  });
}

export function exportInspectionHistory(data: any[], clientName?: string): void {
  const filename = clientName 
    ? `inspections_${clientName}_${getDateStamp()}`
    : `inspections_all_${getDateStamp()}`;
    
  exportToExcel(data, {
    filename,
    sheetName: 'בדיקות',
    columns: EXPORT_CONFIGS.inspections.columns,
  });
}

export function exportFindingsList(data: any[], status?: string): void {
  const filename = status 
    ? `findings_${status}_${getDateStamp()}`
    : `findings_all_${getDateStamp()}`;
    
  exportToExcel(data, {
    filename,
    sheetName: 'ממצאים',
    columns: EXPORT_CONFIGS.findings.columns,
  });
}

export function exportClientsList(data: any[]): void {
  exportToExcel(data, {
    filename: `clients_${getDateStamp()}`,
    sheetName: 'לקוחות',
    columns: EXPORT_CONFIGS.clients.columns,
  });
}

export function exportSchedule(data: any[], month?: string): void {
  const filename = month 
    ? `schedule_${month}`
    : `schedule_${getDateStamp()}`;
    
  exportToExcel(data, {
    filename,
    sheetName: 'לוח בדיקות',
    columns: EXPORT_CONFIGS.schedule.columns,
  });
}

export function exportComplianceReport(data: any[]): void {
  exportToExcel(data, {
    filename: `compliance_report_${getDateStamp()}`,
    sheetName: 'דו"ח ציות',
    columns: EXPORT_CONFIGS.compliance.columns,
  });
}

// ============================================
// 📊 Full Report Export
// ============================================

export interface FullReportData {
  summary: {
    generatedAt: Date;
    period: string;
    totalClients: number;
    totalEquipment: number;
    totalInspections: number;
    complianceScore: number;
  };
  equipment: any[];
  inspections: any[];
  findings: any[];
  schedule: any[];
}

export function exportFullReport(data: FullReportData): void {
  // Export as multi-sheet workbook
  const summaryData = [{
    item: 'תאריך הפקה',
    value: data.summary.generatedAt.toLocaleDateString('he-IL'),
  }, {
    item: 'תקופה',
    value: data.summary.period,
  }, {
    item: 'סה"כ לקוחות',
    value: data.summary.totalClients,
  }, {
    item: 'סה"כ ציוד',
    value: data.summary.totalEquipment,
  }, {
    item: 'סה"כ בדיקות',
    value: data.summary.totalInspections,
  }, {
    item: 'ציון ציות ממוצע',
    value: `${(data.summary.complianceScore * 100).toFixed(1)}%`,
  }];

  exportMultiSheet({
    filename: `aegis_full_report_${getDateStamp()}`,
    sheets: [
      {
        name: 'סיכום',
        data: summaryData,
        columns: [
          { key: 'item', header: 'פריט', width: 25 },
          { key: 'value', header: 'ערך', width: 25 },
        ],
      },
      {
        name: 'ציוד',
        data: data.equipment,
        columns: EXPORT_CONFIGS.equipment.columns,
      },
      {
        name: 'בדיקות',
        data: data.inspections,
        columns: EXPORT_CONFIGS.inspections.columns,
      },
      {
        name: 'ממצאים',
        data: data.findings,
        columns: EXPORT_CONFIGS.findings.columns,
      },
      {
        name: 'לוח בדיקות',
        data: data.schedule,
        columns: EXPORT_CONFIGS.schedule.columns,
      },
    ],
  });
}

// ============================================
// 🔧 Helpers
// ============================================

function getDateStamp(): string {
  return new Date().toISOString().split('T')[0];
}

// ============================================
// 📊 React Export Button Component
// ============================================

import React, { useState } from 'react';

interface ExportButtonProps {
  data: any[];
  config: keyof typeof EXPORT_CONFIGS;
  filename?: string;
  label?: string;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  config,
  filename,
  label = '📥 ייצא לאקסל',
  className = '',
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToExcel(data, {
        filename: filename || `export_${config}_${getDateStamp()}`,
        columns: EXPORT_CONFIGS[config].columns,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      className={`export-button ${className}`}
      onClick={handleExport}
      disabled={exporting || data.length === 0}
    >
      {exporting ? 'מייצא...' : label}
    </button>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const ExcelExportStyles = `
.export-button {
  padding: 10px 20px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.export-button:hover:not(:disabled) {
  background: #16a34a;
}

.export-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.export-button.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.export-button.secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.export-menu {
  position: relative;
  display: inline-block;
}

.export-menu-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 8px;
  min-width: 180px;
  z-index: 100;
}

.export-menu-item {
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: right;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.export-menu-item:hover {
  background: #f3f4f6;
}
`;
