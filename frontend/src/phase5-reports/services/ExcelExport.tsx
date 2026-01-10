/**
 * AEGIS Excel Export Service
 * שירות ייצוא לאקסל
 */
import * as XLSX from 'xlsx';
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

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
  rtl?: boolean;
}

// ============================================
// 📊 Export Functions
// ============================================

export async function exportToExcel(
  data: any[],
  options: ExportOptions
): Promise<void> {
  const {
    filename,
    sheetName = 'Sheet1',
    columns,
    includeHeaders = true,
  } = options;

  // Build worksheet data
  const wsData: any[][] = [];
  
  // Headers
  if (includeHeaders && columns) {
    wsData.push(columns.map(col => col.header));
  }

  // Data rows
  data.forEach(row => {
    const values = columns 
      ? columns.map(col => formatCellValue(row[col.key], col.format))
      : Object.values(row);
    wsData.push(values);
  });

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  if (columns) {
    ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));
  }

  // Set RTL
  ws['!dir'] = 'rtl';

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Download
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export async function exportMultiSheet(options: {
  filename: string;
  sheets: { name: string; data: any[]; columns?: ExportColumn[] }[];
}): Promise<void> {
  const { filename, sheets } = options;
  const wb = XLSX.utils.book_new();

  sheets.forEach(sheet => {
    const wsData: any[][] = [];
    
    if (sheet.columns) {
      wsData.push(sheet.columns.map(col => col.header));
    }

    sheet.data.forEach(row => {
      const values = sheet.columns 
        ? sheet.columns.map(col => formatCellValue(row[col.key], col.format))
        : Object.values(row);
      wsData.push(values);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    if (sheet.columns) {
      ws['!cols'] = sheet.columns.map(col => ({ wch: col.width || 15 }));
    }
    ws['!dir'] = 'rtl';
    
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

function formatCellValue(value: any, format?: string): any {
  if (value === null || value === undefined) return '';
  
  switch (format) {
    case 'date':
      if (value?.toDate) {
        return value.toDate().toLocaleDateString('he-IL');
      }
      if (value instanceof Date) {
        return value.toLocaleDateString('he-IL');
      }
      if (typeof value === 'string') {
        return new Date(value).toLocaleDateString('he-IL');
      }
      return String(value);
      
    case 'currency':
      return typeof value === 'number' ? `₪${value.toLocaleString('he-IL')}` : String(value);
      
    case 'percentage':
      return typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : String(value);
      
    default:
      return value;
  }
}

// ============================================
// 📊 Export Configurations
// ============================================

export const EXPORT_CONFIGS = {
  findings: {
    columns: [
      { key: 'title', header: 'כותרת', width: 30 },
      { key: 'description', header: 'תיאור', width: 40 },
      { key: 'severity', header: 'חומרה', width: 12 },
      { key: 'status', header: 'סטטוס', width: 15 },
      { key: 'clientName', header: 'לקוח', width: 25 },
      { key: 'siteName', header: 'אתר', width: 25 },
      { key: 'createdAt', header: 'תאריך יצירה', width: 15, format: 'date' as const },
      { key: 'dueDate', header: 'תאריך יעד', width: 15, format: 'date' as const },
    ],
  },
  
  equipment: {
    columns: [
      { key: 'name', header: 'שם הציוד', width: 30 },
      { key: 'type', header: 'סוג', width: 20 },
      { key: 'serialNumber', header: 'מספר סידורי', width: 20 },
      { key: 'manufacturer', header: 'יצרן', width: 20 },
      { key: 'location', header: 'מיקום', width: 25 },
      { key: 'status', header: 'סטטוס', width: 15 },
      { key: 'lastInspection', header: 'בדיקה אחרונה', width: 15, format: 'date' as const },
      { key: 'nextInspection', header: 'בדיקה הבאה', width: 15, format: 'date' as const },
    ],
  },
  
  inspections: {
    columns: [
      { key: 'templateName', header: 'סוג בדיקה', width: 25 },
      { key: 'clientName', header: 'לקוח', width: 25 },
      { key: 'siteName', header: 'אתר', width: 25 },
      { key: 'status', header: 'סטטוס', width: 15 },
      { key: 'score', header: 'ציון', width: 10, format: 'percentage' as const },
      { key: 'createdAt', header: 'תאריך', width: 15, format: 'date' as const },
    ],
  },
  
  clients: {
    columns: [
      { key: 'name', header: 'שם הלקוח', width: 30 },
      { key: 'contactPerson', header: 'איש קשר', width: 20 },
      { key: 'phone', header: 'טלפון', width: 15 },
      { key: 'email', header: 'אימייל', width: 25 },
      { key: 'address', header: 'כתובת', width: 30 },
    ],
  },
};

// ============================================
// 📊 Quick Export Functions
// ============================================

function getDateStamp(): string {
  return new Date().toISOString().split('T')[0];
}

const SEVERITY_TEXT: Record<string, string> = {
  critical: 'קריטי',
  major: 'משמעותי',
  minor: 'קל',
  observation: 'הערה',
};

const STATUS_TEXT: Record<string, string> = {
  open: 'פתוח',
  in_progress: 'בטיפול',
  resolved: 'טופל',
  closed: 'סגור',
  completed: 'הושלם',
  draft: 'טיוטא',
};

export function exportFindingsList(data: any[]): void {
  const formattedData = data.map(item => ({
    ...item,
    severity: SEVERITY_TEXT[item.severity] || item.severity,
    status: STATUS_TEXT[item.status] || item.status,
  }));
  
  exportToExcel(formattedData, {
    filename: `ממצאים_${getDateStamp()}`,
    sheetName: 'ממצאים',
    columns: EXPORT_CONFIGS.findings.columns,
  });
}

export function exportEquipmentList(data: any[]): void {
  exportToExcel(data, {
    filename: `ציוד_${getDateStamp()}`,
    sheetName: 'ציוד',
    columns: EXPORT_CONFIGS.equipment.columns,
  });
}

export function exportInspectionsList(data: any[]): void {
  const formattedData = data.map(item => ({
    ...item,
    status: STATUS_TEXT[item.status] || item.status,
  }));
  
  exportToExcel(formattedData, {
    filename: `בדיקות_${getDateStamp()}`,
    sheetName: 'בדיקות',
    columns: EXPORT_CONFIGS.inspections.columns,
  });
}

export function exportClientsList(data: any[]): void {
  exportToExcel(data, {
    filename: `לקוחות_${getDateStamp()}`,
    sheetName: 'לקוחות',
    columns: EXPORT_CONFIGS.clients.columns,
  });
}

// ============================================
// 📊 React Export Button Component
// ============================================

interface ExportButtonProps {
  data: any[];
  exportFn: (data: any[]) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  exportFn,
  label = 'ייצא לאקסל',
  disabled = false,
  className = '',
}) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (data.length === 0) {
      alert('אין נתונים לייצוא');
      return;
    }
    
    setExporting(true);
    try {
      await exportFn(data);
    } catch (err) {
      console.error('Export error:', err);
      alert('שגיאה בייצוא');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || exporting || data.length === 0}
      className={`px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {exporting ? 'מייצא...' : label}
    </button>
  );
};

export default ExportButton;
