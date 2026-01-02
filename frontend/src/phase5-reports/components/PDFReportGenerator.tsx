/**
 * AEGIS PDF Report Generator
 * מחולל דוחות PDF לבדיקות בטיחות
 * 
 * Note: This module provides TypeScript interfaces and React components.
 * The actual PDF generation is done server-side using Python/ReportLab
 * or client-side using jsPDF/pdf-lib.
 */

import React, { useState } from 'react';

// ============================================
// 📋 Types
// ============================================

export interface ReportData {
  // Header
  reportNumber: string;
  reportDate: Date;
  reportType: 'inspection' | 'certificate' | 'summary' | 'compliance';
  
  // Company Info
  company: {
    name: string;
    logo?: string;
    address?: string;
    phone?: string;
    email?: string;
    license?: string;
  };
  
  // Client Info
  client: {
    name: string;
    address?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  };
  
  // Equipment
  equipment?: {
    name: string;
    type: string;
    serialNumber?: string;
    manufacturer?: string;
    model?: string;
    location?: string;
    registrationNumber?: string;
  };
  
  // Inspection Details
  inspection?: {
    date: Date;
    inspectorName: string;
    inspectorLicense?: string;
    templateName: string;
    result: 'pass' | 'pass_with_conditions' | 'fail';
    sections: ReportSection[];
    findings: ReportFinding[];
    overallNotes?: string;
  };
  
  // Certificate
  certificate?: {
    number: string;
    issueDate: Date;
    expiryDate: Date;
    approvedPressure?: number;
    approvedLoad?: number;
    conditions?: string[];
  };
  
  // Signatures
  signatures?: {
    inspector?: {
      name: string;
      signature?: string;
      date: Date;
    };
    client?: {
      name: string;
      signature?: string;
      date: Date;
    };
  };
}

export interface ReportSection {
  title: string;
  items: {
    label: string;
    value: string | boolean;
    status?: 'pass' | 'fail' | 'na';
    notes?: string;
  }[];
}

export interface ReportFinding {
  id: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  title: string;
  description: string;
  dueDate?: Date;
  status: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportData['reportType'];
  sections: string[];
  headerImage?: string;
  footerText?: string;
  watermark?: string;
}

// ============================================
// 🎨 Report Preview Component
// ============================================

interface ReportPreviewProps {
  data: ReportData;
  template?: ReportTemplate;
  onDownload?: () => void;
  onPrint?: () => void;
  onEmail?: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  data,
  template,
  onDownload,
  onPrint,
  onEmail,
}) => {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('he-IL');
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case 'pass': return { text: 'עבר', color: '#16a34a', bg: '#dcfce7' };
      case 'pass_with_conditions': return { text: 'עבר בתנאים', color: '#ca8a04', bg: '#fef9c3' };
      case 'fail': return { text: 'נכשל', color: '#dc2626', bg: '#fee2e2' };
      default: return { text: result, color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'major': return '⚠️';
      case 'minor': return '📝';
      default: return '💡';
    }
  };

  return (
    <div className="report-preview" dir="rtl">
      {/* Actions Bar */}
      <div className="preview-actions">
        {onDownload && (
          <button className="action-btn" onClick={onDownload}>
            📥 הורד PDF
          </button>
        )}
        {onPrint && (
          <button className="action-btn" onClick={onPrint}>
            🖨️ הדפס
          </button>
        )}
        {onEmail && (
          <button className="action-btn" onClick={onEmail}>
            📧 שלח במייל
          </button>
        )}
      </div>

      {/* Report Content */}
      <div className="report-content">
        {/* Header */}
        <div className="report-header">
          <div className="header-logo">
            {data.company.logo ? (
              <img src={data.company.logo} alt={data.company.name} />
            ) : (
              <div className="logo-placeholder">{data.company.name.charAt(0)}</div>
            )}
          </div>
          <div className="header-info">
            <h1>{data.company.name}</h1>
            {data.company.address && <p>{data.company.address}</p>}
            {data.company.phone && <p>טלפון: {data.company.phone}</p>}
            {data.company.license && <p>רישיון: {data.company.license}</p>}
          </div>
          <div className="header-report">
            <div className="report-number">דו"ח מס' {data.reportNumber}</div>
            <div className="report-date">{formatDate(data.reportDate)}</div>
          </div>
        </div>

        {/* Title */}
        <div className="report-title">
          <h2>
            {data.reportType === 'inspection' && 'דו"ח בדיקה תקופתית'}
            {data.reportType === 'certificate' && 'תעודת בדיקה'}
            {data.reportType === 'summary' && 'דו"ח סיכום'}
            {data.reportType === 'compliance' && 'דו"ח תאימות'}
          </h2>
        </div>

        {/* Client Info */}
        <div className="info-section">
          <h3>פרטי הלקוח</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">שם:</span>
              <span className="value">{data.client.name}</span>
            </div>
            {data.client.address && (
              <div className="info-item">
                <span className="label">כתובת:</span>
                <span className="value">{data.client.address}</span>
              </div>
            )}
            {data.client.contactPerson && (
              <div className="info-item">
                <span className="label">איש קשר:</span>
                <span className="value">{data.client.contactPerson}</span>
              </div>
            )}
            {data.client.phone && (
              <div className="info-item">
                <span className="label">טלפון:</span>
                <span className="value" dir="ltr">{data.client.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Info */}
        {data.equipment && (
          <div className="info-section">
            <h3>פרטי הציוד</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">שם:</span>
                <span className="value">{data.equipment.name}</span>
              </div>
              <div className="info-item">
                <span className="label">סוג:</span>
                <span className="value">{data.equipment.type}</span>
              </div>
              {data.equipment.serialNumber && (
                <div className="info-item">
                  <span className="label">מס' סידורי:</span>
                  <span className="value" dir="ltr">{data.equipment.serialNumber}</span>
                </div>
              )}
              {data.equipment.manufacturer && (
                <div className="info-item">
                  <span className="label">יצרן:</span>
                  <span className="value">{data.equipment.manufacturer}</span>
                </div>
              )}
              {data.equipment.model && (
                <div className="info-item">
                  <span className="label">דגם:</span>
                  <span className="value">{data.equipment.model}</span>
                </div>
              )}
              {data.equipment.location && (
                <div className="info-item">
                  <span className="label">מיקום:</span>
                  <span className="value">{data.equipment.location}</span>
                </div>
              )}
              {data.equipment.registrationNumber && (
                <div className="info-item">
                  <span className="label">מס' רישום:</span>
                  <span className="value">{data.equipment.registrationNumber}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inspection Result */}
        {data.inspection && (
          <>
            <div className="result-section">
              <h3>תוצאת הבדיקה</h3>
              <div 
                className="result-badge"
                style={{ 
                  background: getResultLabel(data.inspection.result).bg,
                  color: getResultLabel(data.inspection.result).color,
                }}
              >
                {getResultLabel(data.inspection.result).text}
              </div>
              <div className="result-meta">
                <span>תאריך בדיקה: {formatDate(data.inspection.date)}</span>
                <span>בודק: {data.inspection.inspectorName}</span>
                {data.inspection.inspectorLicense && (
                  <span>רישיון: {data.inspection.inspectorLicense}</span>
                )}
              </div>
            </div>

            {/* Inspection Sections */}
            {data.inspection.sections.map((section, idx) => (
              <div key={idx} className="checklist-section">
                <h4>{section.title}</h4>
                <table className="checklist-table">
                  <thead>
                    <tr>
                      <th>פריט</th>
                      <th>תקין</th>
                      <th>לא תקין</th>
                      <th>לא רלוונטי</th>
                      <th>הערות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, itemIdx) => (
                      <tr key={itemIdx}>
                        <td>{item.label}</td>
                        <td className="check-cell">
                          {item.status === 'pass' && '✓'}
                        </td>
                        <td className="check-cell">
                          {item.status === 'fail' && '✗'}
                        </td>
                        <td className="check-cell">
                          {item.status === 'na' && '—'}
                        </td>
                        <td className="notes-cell">{item.notes || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {/* Findings */}
            {data.inspection.findings.length > 0 && (
              <div className="findings-section">
                <h3>ממצאים וליקויים</h3>
                <div className="findings-list">
                  {data.inspection.findings.map((finding, idx) => (
                    <div key={idx} className={`finding-item severity-${finding.severity}`}>
                      <div className="finding-header">
                        <span className="finding-severity">
                          {getSeverityIcon(finding.severity)}
                        </span>
                        <span className="finding-title">{finding.title}</span>
                      </div>
                      <p className="finding-description">{finding.description}</p>
                      {finding.dueDate && (
                        <span className="finding-due">
                          תאריך יעד לתיקון: {formatDate(finding.dueDate)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Notes */}
            {data.inspection.overallNotes && (
              <div className="notes-section">
                <h3>הערות כלליות</h3>
                <p>{data.inspection.overallNotes}</p>
              </div>
            )}
          </>
        )}

        {/* Certificate */}
        {data.certificate && (
          <div className="certificate-section">
            <div className="certificate-box">
              <h3>תעודת בדיקה</h3>
              <div className="certificate-number">מס' {data.certificate.number}</div>
              <div className="certificate-dates">
                <div>
                  <span className="label">תאריך הנפקה:</span>
                  <span className="value">{formatDate(data.certificate.issueDate)}</span>
                </div>
                <div>
                  <span className="label">תוקף עד:</span>
                  <span className="value">{formatDate(data.certificate.expiryDate)}</span>
                </div>
              </div>
              {data.certificate.approvedPressure && (
                <div className="approved-value">
                  לחץ עבודה מאושר: {data.certificate.approvedPressure} bar
                </div>
              )}
              {data.certificate.approvedLoad && (
                <div className="approved-value">
                  עומס מאושר: {data.certificate.approvedLoad} ק"ג
                </div>
              )}
              {data.certificate.conditions && data.certificate.conditions.length > 0 && (
                <div className="conditions">
                  <strong>תנאים:</strong>
                  <ul>
                    {data.certificate.conditions.map((cond, idx) => (
                      <li key={idx}>{cond}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Signatures */}
        {data.signatures && (
          <div className="signatures-section">
            <div className="signature-boxes">
              {data.signatures.inspector && (
                <div className="signature-box">
                  <div className="signature-label">חתימת הבודק</div>
                  {data.signatures.inspector.signature ? (
                    <img 
                      src={data.signatures.inspector.signature} 
                      alt="חתימת בודק"
                      className="signature-image"
                    />
                  ) : (
                    <div className="signature-line"></div>
                  )}
                  <div className="signer-name">{data.signatures.inspector.name}</div>
                  <div className="sign-date">{formatDate(data.signatures.inspector.date)}</div>
                </div>
              )}
              {data.signatures.client && (
                <div className="signature-box">
                  <div className="signature-label">חתימת נציג הלקוח</div>
                  {data.signatures.client.signature ? (
                    <img 
                      src={data.signatures.client.signature} 
                      alt="חתימת לקוח"
                      className="signature-image"
                    />
                  ) : (
                    <div className="signature-line"></div>
                  )}
                  <div className="signer-name">{data.signatures.client.name}</div>
                  <div className="sign-date">{formatDate(data.signatures.client.date)}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="report-footer">
          <p>
            דו"ח זה הופק באמצעות מערכת AEGIS לניהול בטיחות
          </p>
          <p className="footer-note">
            {template?.footerText || 'מסמך זה הינו קניינו של בעל הרישיון ואין להעתיקו או להפיצו ללא אישור'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 📥 PDF Generation Functions (Client-side)
// ============================================

export interface PDFGeneratorOptions {
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  fontSize?: number;
  includeWatermark?: boolean;
}

/**
 * Generate PDF using browser print
 */
export function printReport(): void {
  window.print();
}

/**
 * Generate PDF data URL for download
 * This is a placeholder - actual implementation uses jsPDF or server-side generation
 */
export async function generatePDFDataUrl(
  data: ReportData,
  options?: PDFGeneratorOptions
): Promise<string> {
  // In production, this would use jsPDF or call a server endpoint
  // For now, return a placeholder
  console.log('Generating PDF for:', data.reportNumber);
  console.log('Options:', options);
  
  // Placeholder - would return actual PDF data URL
  return 'data:application/pdf;base64,...';
}

/**
 * Download PDF file
 */
export function downloadPDF(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate filename for report
 */
export function generateReportFilename(data: ReportData): string {
  const date = new Date(data.reportDate).toISOString().split('T')[0];
  const type = data.reportType === 'inspection' ? 'inspection' : 
               data.reportType === 'certificate' ? 'certificate' : 'report';
  const equipment = data.equipment?.name.replace(/\s+/g, '_') || 'general';
  
  return `AEGIS_${type}_${equipment}_${date}_${data.reportNumber}.pdf`;
}

// ============================================
// 🎨 Styles
// ============================================

export const ReportPreviewStyles = `
.report-preview {
  background: #f3f4f6;
  padding: 20px;
}

.preview-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.action-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.action-btn:hover {
  background: #2563eb;
}

.report-content {
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  padding: 20mm;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  font-family: 'David', 'Arial', sans-serif;
  font-size: 12pt;
  line-height: 1.6;
}

/* Header */
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 16px;
  border-bottom: 2px solid #1f2937;
  margin-bottom: 20px;
}

.header-logo img {
  max-width: 120px;
  max-height: 60px;
}

.logo-placeholder {
  width: 60px;
  height: 60px;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  border-radius: 8px;
}

.header-info {
  flex: 1;
  padding: 0 20px;
}

.header-info h1 {
  margin: 0 0 4px;
  font-size: 18pt;
}

.header-info p {
  margin: 0;
  font-size: 10pt;
  color: #4b5563;
}

.header-report {
  text-align: left;
}

.report-number {
  font-weight: 700;
  font-size: 14pt;
}

.report-date {
  color: #6b7280;
}

/* Title */
.report-title {
  text-align: center;
  margin: 24px 0;
}

.report-title h2 {
  margin: 0;
  font-size: 20pt;
  color: #1f2937;
}

/* Info Sections */
.info-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.info-section h3 {
  margin: 0 0 12px;
  font-size: 12pt;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-item .label {
  color: #6b7280;
  min-width: 80px;
}

.info-item .value {
  font-weight: 500;
}

/* Result Section */
.result-section {
  text-align: center;
  margin: 24px 0;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
}

.result-section h3 {
  margin: 0 0 12px;
}

.result-badge {
  display: inline-block;
  padding: 12px 32px;
  font-size: 18pt;
  font-weight: 700;
  border-radius: 8px;
  margin-bottom: 12px;
}

.result-meta {
  display: flex;
  justify-content: center;
  gap: 24px;
  color: #6b7280;
  font-size: 10pt;
}

/* Checklist */
.checklist-section {
  margin-bottom: 20px;
}

.checklist-section h4 {
  margin: 0 0 8px;
  font-size: 11pt;
  color: #374151;
}

.checklist-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10pt;
}

.checklist-table th,
.checklist-table td {
  border: 1px solid #e5e7eb;
  padding: 8px;
  text-align: right;
}

.checklist-table th {
  background: #f3f4f6;
  font-weight: 600;
}

.check-cell {
  text-align: center;
  width: 60px;
}

.notes-cell {
  font-size: 9pt;
  color: #6b7280;
}

/* Findings */
.findings-section {
  margin: 20px 0;
}

.findings-section h3 {
  margin: 0 0 12px;
  color: #dc2626;
}

.findings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.finding-item {
  padding: 12px;
  border-radius: 8px;
  border-right: 4px solid #6b7280;
  background: #f9fafb;
}

.finding-item.severity-critical {
  border-right-color: #dc2626;
  background: #fef2f2;
}

.finding-item.severity-major {
  border-right-color: #f97316;
  background: #fff7ed;
}

.finding-item.severity-minor {
  border-right-color: #eab308;
  background: #fefce8;
}

.finding-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.finding-severity {
  font-size: 14pt;
}

.finding-title {
  font-weight: 600;
}

.finding-description {
  margin: 0;
  font-size: 10pt;
  color: #4b5563;
}

.finding-due {
  display: block;
  margin-top: 8px;
  font-size: 9pt;
  color: #6b7280;
}

/* Notes */
.notes-section {
  margin: 20px 0;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.notes-section h3 {
  margin: 0 0 8px;
}

.notes-section p {
  margin: 0;
  white-space: pre-wrap;
}

/* Certificate */
.certificate-section {
  margin: 24px 0;
}

.certificate-box {
  border: 3px double #1f2937;
  padding: 24px;
  text-align: center;
}

.certificate-box h3 {
  margin: 0 0 8px;
  font-size: 16pt;
}

.certificate-number {
  font-size: 20pt;
  font-weight: 700;
  margin-bottom: 16px;
}

.certificate-dates {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 16px;
}

.approved-value {
  font-size: 14pt;
  font-weight: 600;
  margin: 8px 0;
}

.conditions {
  text-align: right;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.conditions ul {
  margin: 8px 0 0;
  padding-right: 20px;
}

/* Signatures */
.signatures-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.signature-boxes {
  display: flex;
  justify-content: space-around;
  gap: 40px;
}

.signature-box {
  flex: 1;
  text-align: center;
  max-width: 200px;
}

.signature-label {
  font-weight: 600;
  margin-bottom: 8px;
}

.signature-image {
  max-width: 150px;
  max-height: 60px;
}

.signature-line {
  height: 60px;
  border-bottom: 1px solid #1f2937;
  margin-bottom: 8px;
}

.signer-name {
  font-weight: 500;
}

.sign-date {
  font-size: 10pt;
  color: #6b7280;
}

/* Footer */
.report-footer {
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  font-size: 9pt;
  color: #6b7280;
}

.footer-note {
  font-style: italic;
}

/* Print Styles */
@media print {
  .preview-actions {
    display: none;
  }
  
  .report-preview {
    background: white;
    padding: 0;
  }
  
  .report-content {
    box-shadow: none;
    padding: 0;
  }
}

@page {
  size: A4;
  margin: 15mm;
}
`;

export default ReportPreview;
