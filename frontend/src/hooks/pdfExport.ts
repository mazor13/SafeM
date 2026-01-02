// ===========================================
// AEGIS - PDF Export Utility (Print-based)
// Phase 2: ייצוא טפסים ל-PDF עם תמיכה מלאה בעברית
// ===========================================

import { FilledForm } from './useFilledForm';
import { Template, TemplateField, TEMPLATE_TYPES, SAFETY_CATEGORIES } from '../types/template-types';

// ===========================================
// TYPES
// ===========================================

export interface PDFExportOptions {
  form: FilledForm;
  template: Template;
  includeEmptyFields?: boolean;
  includeLogo?: boolean;
  includeFooter?: boolean;
  fileName?: string;
}

// ===========================================
// MAIN EXPORT FUNCTION
// ===========================================

export async function exportFormToPDF(options: PDFExportOptions): Promise<void> {
  const {
    form,
    template,
    includeEmptyFields = false,
    includeLogo = true,
    includeFooter = true,
  } = options;

  // Generate HTML content
  const htmlContent = generateHTMLContent({
    form,
    template,
    includeEmptyFields,
    includeLogo,
    includeFooter,
  });

  // Open print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('אנא אפשר חלונות קופצים כדי לייצא PDF');
    return;
  }

  // Write content to print window
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Don't close immediately - let user save as PDF
    }, 500);
  };
}

// ===========================================
// GENERATE HTML CONTENT
// ===========================================

function generateHTMLContent(options: {
  form: FilledForm;
  template: Template;
  includeEmptyFields: boolean;
  includeLogo: boolean;
  includeFooter: boolean;
}): string {
  const { form, template, includeEmptyFields, includeLogo, includeFooter } = options;

  const typeInfo = TEMPLATE_TYPES.find(t => t.value === template.type);
  const categoryInfo = SAFETY_CATEGORIES.find(c => c.value === template.category);

  // Generate sections HTML
  const sectionsHTML = template.sections.map((section) => {
    const fieldsHTML = section.fields
      .filter(field => {
        if (field.type === 'divider') return false;
        const value = form.data[field.id];
        const hasValue = value !== undefined && value !== null && value !== '';
        return includeEmptyFields || hasValue || field.type === 'header' || field.type === 'paragraph';
      })
      .map(field => generateFieldHTML(field, form.data[field.id]))
      .join('');

    if (!fieldsHTML && !includeEmptyFields) return '';

    return `
      <div class="section">
        <div class="section-header">
          ${section.icon || ''} ${section.titleHe || section.title}
        </div>
        ${section.description ? `<p class="section-desc">${section.description}</p>` : ''}
        <div class="fields">
          ${fieldsHTML}
        </div>
      </div>
    `;
  }).join('');

  // Generate notes HTML
  const notesHTML = form.data.formNotes ? `
    <div class="notes">
      <div class="notes-header">📝 הערות נוספות</div>
      <div class="notes-content">${escapeHtml(form.data.formNotes)}</div>
    </div>
  ` : '';

  // Full HTML document
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>${template.nameHe || template.name}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    @page {
      size: A4;
      margin: 15mm;
    }
    
    body {
      font-family: Arial, 'Segoe UI', Tahoma, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #1e293b;
      background: white;
      direction: rtl;
    }
    
    .container {
      max-width: 100%;
      padding: 20px;
    }
    
    /* Header */
    .header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .logo {
      max-height: 50px;
      margin-bottom: 10px;
    }
    
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #0f172a;
      margin-bottom: 5px;
    }
    
    .subtitle {
      font-size: 12px;
      color: #64748b;
    }
    
    /* Info Box */
    .info-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 15px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 25px;
    }
    
    .info-item {
      font-size: 11px;
    }
    
    .info-label {
      color: #64748b;
    }
    
    .info-value {
      font-weight: bold;
      color: #1e293b;
    }
    
    .status-draft { color: #f59e0b; }
    .status-submitted { color: #3b82f6; }
    .status-approved { color: #10b981; }
    .status-rejected { color: #ef4444; }
    
    /* Sections */
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .section-header {
      background: #f1f5f9;
      padding: 10px 15px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
      color: #1e293b;
      margin-bottom: 12px;
    }
    
    .section-desc {
      font-size: 11px;
      color: #64748b;
      margin: -8px 15px 12px;
    }
    
    .fields {
      padding: 0 10px;
    }
    
    /* Fields */
    .field {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    
    .field-label {
      font-size: 10px;
      color: #64748b;
      margin-bottom: 3px;
    }
    
    .field-value {
      font-size: 12px;
      color: #1e293b;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 6px;
      min-height: 20px;
    }
    
    .field-header {
      font-size: 13px;
      font-weight: bold;
      color: #334155;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 5px;
      margin: 15px 0 10px;
    }
    
    .field-paragraph {
      font-size: 11px;
      color: #64748b;
      margin: 10px 0;
    }
    
    .empty-value {
      color: #94a3b8;
    }
    
    .check-yes { color: #10b981; }
    .check-no { color: #ef4444; }
    
    .rating {
      color: #f59e0b;
      letter-spacing: 2px;
    }
    
    .tag {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      padding: 2px 8px;
      border-radius: 4px;
      margin-left: 4px;
      font-size: 11px;
    }
    
    /* Notes */
    .notes {
      background: #fef3c7;
      border-radius: 8px;
      padding: 12px 15px;
      margin-top: 20px;
    }
    
    .notes-header {
      font-weight: bold;
      color: #92400e;
      margin-bottom: 8px;
    }
    
    .notes-content {
      font-size: 12px;
      color: #78350f;
      white-space: pre-wrap;
    }
    
    /* Footer */
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #94a3b8;
      text-align: center;
    }
    
    /* Tables */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 5px;
      font-size: 11px;
    }
    
    .data-table th {
      background: #f1f5f9;
      padding: 6px 10px;
      text-align: right;
      border: 1px solid #e2e8f0;
      font-size: 10px;
    }
    
    .data-table td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
    }
    
    /* Signature */
    .signature-img {
      max-height: 60px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }
    
    /* Print styles */
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      ${includeLogo && template.settings?.pdfSettings?.logoUrl ? 
        `<img src="${template.settings.pdfSettings.logoUrl}" class="logo" />` : ''}
      <div class="title">${typeInfo?.icon || '📄'} ${template.nameHe || template.name}</div>
      <div class="subtitle">${typeInfo?.labelHe || ''} | ${categoryInfo?.labelHe || ''}</div>
    </div>

    <!-- Info Box -->
    <div class="info-box">
      <div class="info-item">
        <span class="info-label">סימוכין: </span>
        <span class="info-value">#${form.id.slice(-8)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">תאריך: </span>
        <span class="info-value">${formatDate(form.createdAt)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">סטטוס: </span>
        <span class="info-value status-${form.status}">${formatStatus(form.status)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">גרסה: </span>
        <span class="info-value">v${form.templateVersion}</span>
      </div>
    </div>

    <!-- Sections -->
    ${sectionsHTML}

    <!-- Notes -->
    ${notesHTML}

    <!-- Footer -->
    ${includeFooter ? `
      <div class="footer">
        AEGIS Safety Management System | נוצר בתאריך ${new Date().toLocaleDateString('he-IL')}
        ${template.settings?.pdfSettings?.footerText ? `<br>${template.settings.pdfSettings.footerText}` : ''}
      </div>
    ` : ''}
  </div>
</body>
</html>
  `;
}

// ===========================================
// GENERATE FIELD HTML
// ===========================================

function generateFieldHTML(field: TemplateField, value: any): string {
  if (field.type === 'header') {
    return `<div class="field-header">${field.labelHe || field.label}</div>`;
  }

  if (field.type === 'paragraph') {
    return `<div class="field-paragraph">${field.paragraphContent || field.helpText || ''}</div>`;
  }

  const formattedValue = formatFieldValue(value, field);
  const isRequired = field.validation?.required;

  return `
    <div class="field">
      <div class="field-label">${field.labelHe || field.label}${isRequired ? ' *' : ''}</div>
      <div class="field-value">${formattedValue}</div>
    </div>
  `;
}

// ===========================================
// HELPERS
// ===========================================

function formatDate(timestamp: any): string {
  if (!timestamp) return '-';
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('he-IL');
  } catch {
    return '-';
  }
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    draft: 'טיוטה',
    submitted: 'הוגש',
    approved: 'אושר',
    rejected: 'נדחה',
  };
  return statusMap[status] || status;
}

function formatFieldValue(value: any, field: TemplateField): string {
  if (value === undefined || value === null || value === '') {
    return '<span class="empty-value">-</span>';
  }

  switch (field.type) {
    case 'checkbox':
    case 'toggle':
      return value 
        ? '<span class="check-yes">✓ כן</span>' 
        : '<span class="check-no">✗ לא</span>';

    case 'date':
      try {
        return new Date(value).toLocaleDateString('he-IL');
      } catch {
        return escapeHtml(String(value));
      }

    case 'time':
      return escapeHtml(String(value));

    case 'datetime':
      try {
        const date = new Date(value);
        return `${date.toLocaleDateString('he-IL')} ${date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;
      } catch {
        return escapeHtml(String(value));
      }

    case 'select':
    case 'radio':
      const option = field.options?.find(o => o.value === value);
      return escapeHtml(option?.label || String(value));

    case 'multiselect':
    case 'checkboxGroup':
      if (Array.isArray(value)) {
        const labels = value.map(v => {
          const opt = field.options?.find(o => o.value === v);
          return opt?.label || v;
        });
        return labels.map(l => `<span class="tag">${escapeHtml(l)}</span>`).join(' ');
      }
      return escapeHtml(String(value));

    case 'rating':
      const max = field.ratingConfig?.max || 5;
      const stars = '★'.repeat(value) + '☆'.repeat(max - value);
      return `<span class="rating">${stars}</span> (${value}/${max})`;

    case 'number':
      const unit = field.numberConfig?.unit || '';
      return `${value}${unit ? ' ' + unit : ''}`;

    case 'location':
      if (value?.lat && value?.lng) {
        return `📍 ${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}`;
      }
      return '<span class="empty-value">-</span>';

    case 'signature':
      if (value) {
        return `<img src="${value}" class="signature-img" />`;
      }
      return '<span class="empty-value">-</span>';

    case 'image':
      if (value) {
        return `<img src="${value}" style="max-height: 100px; max-width: 200px; border-radius: 4px;" />`;
      }
      return '<span class="empty-value">-</span>';

    case 'file':
      return `📎 ${escapeHtml(value?.name || 'קובץ מצורף')}`;

    case 'table':
      if (Array.isArray(value) && value.length > 0) {
        return generateTableHTML(value, field);
      }
      return '<span class="empty-value">-</span>';

    case 'textarea':
      return `<div style="white-space: pre-wrap;">${escapeHtml(String(value))}</div>`;

    default:
      return escapeHtml(String(value));
  }
}

function generateTableHTML(rows: any[], field: TemplateField): string {
  const columns = field.tableConfig?.columns || [];
  
  if (columns.length === 0 || rows.length === 0) {
    return `[טבלה עם ${rows.length} שורות]`;
  }

  const headerCells = columns.map(col => 
    `<th>${escapeHtml(col.label)}</th>`
  ).join('');

  const bodyRows = rows.map(row => {
    const cells = columns.map(col => 
      `<td>${escapeHtml(row[col.id] || '-')}</td>`
    ).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    <table class="data-table">
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ===========================================
// EXPORT
// ===========================================

export default exportFormToPDF;