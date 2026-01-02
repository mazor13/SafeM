// ===========================================
// AEGIS - AI PDF Import Service
// ייבוא אוטומטי של תבניות מ-PDF באמצעות AI
// ===========================================

import { TemplateSection, TemplateField } from '../types/template-types';

// ===========================================
// TYPES
// ===========================================

export interface PDFAnalysisResult {
  success: boolean;
  templateName: string;
  templateNameHe: string;
  description: string;
  category: string;
  sections: TemplateSection[];
  alerts: AlertRule[];
  confidence: number;
  rawText?: string;
  error?: string;
}

export interface AlertRule {
  id: string;
  fieldId: string;
  fieldLabel: string;
  condition: AlertCondition;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  messageHe: string;
}

export interface AlertCondition {
  type: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'out_of_range' | 'past_date' | 'future_date' | 'is_empty' | 'contains';
  value?: any;
  min?: number;
  max?: number;
}

export interface ImportProgress {
  stage: 'uploading' | 'extracting' | 'analyzing' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
}

// ===========================================
// PDF TEXT EXTRACTION
// ===========================================

export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Use pdf.js to extract text
        const pdfjsLib = await import('pdfjs-dist');
        
        // Set worker from CDN - must match installed version
        const version = pdfjsLib.version;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
        
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n\n';
        }
        
        resolve(fullText.trim());
      } catch (err) {
        console.error('PDF extraction error:', err);
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error('שגיאה בקריאת הקובץ'));
    reader.readAsArrayBuffer(file);
  });
}

// ===========================================
// CLAUDE API ANALYSIS
// ===========================================

const ANALYSIS_PROMPT = `אתה מומחה בניתוח טפסי בדיקה ובטיחות. נתתי לך טקסט שחולץ מ-PDF של טופס בדיקה.

המשימה שלך:
1. זהה את שם הטופס והקטגוריה
2. זהה את כל הסקשנים (חלקים) בטופס
3. זהה את כל השדות בכל סקשן
4. קבע את סוג כל שדה
5. הצע התראות לערכים חריגים

סוגי שדות: text, textarea, number, date, time, select, checkbox, toggle, signature, rating

קטגוריות: fire_safety, laser_safety, electrical, chemical, construction, general

רמות התראה: low, medium, high, critical

החזר JSON בלבד, ללא markdown, ללא אמוג'י, ללא הסברים:
{
  "templateName": "English Name",
  "templateNameHe": "שם בעברית",
  "description": "Short description",
  "category": "general",
  "confidence": 0.8,
  "sections": [
    {
      "id": "section_1",
      "title": "Section",
      "titleHe": "סקשן",
      "icon": "clipboard",
      "fields": [
        {
          "id": "field_1",
          "type": "text",
          "label": "Field",
          "labelHe": "שדה",
          "required": true,
          "helpText": "help"
        }
      ]
    }
  ],
  "alerts": [
    {
      "id": "alert_1",
      "fieldId": "field_1",
      "fieldLabel": "field name",
      "condition": {"type": "equals", "value": "no"},
      "severity": "high",
      "message": "Alert",
      "messageHe": "התראה"
    }
  ]
}

IMPORTANT: Return ONLY valid JSON! No emojis, no special characters, no markdown code blocks.

הטקסט מהטופס:
`;

export async function analyzePDFWithAI(
  pdfText: string,
  apiKey: string,
  onProgress?: (progress: ImportProgress) => void
): Promise<PDFAnalysisResult> {
  
  onProgress?.({
    stage: 'analyzing',
    progress: 50,
    message: 'מנתח את הטופס עם AI...'
  });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [
          {
            role: 'user',
            content: ANALYSIS_PROMPT + pdfText
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'שגיאה בתקשורת עם AI');
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      throw new Error('לא התקבלה תשובה מה-AI');
    }

    onProgress?.({
      stage: 'generating',
      progress: 80,
      message: 'מייצר תבנית...'
    });

    // Parse JSON from response
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('לא ניתן לפרסר את תשובת ה-AI');
    }

    let jsonStr = jsonMatch[0];
    
    // Remove emojis and special characters BEFORE parsing
    jsonStr = jsonStr
      // Remove emojis
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, ' ')
      // Remove trailing commas
      .replace(/,\s*([}\]])/g, '$1')
      // Remove double commas
      .replace(/,\s*,/g, ',')
      // Fix empty icon fields
      .replace(/"icon":\s*""/g, '"icon": "default"')
      // Remove leading commas in arrays
      .replace(/\[\s*,/g, '[')
      // Remove trailing commas in arrays  
      .replace(/,\s*\]/g, ']');

    let result;
    try {
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw JSON (first 1000 chars):', jsonStr.substring(0, 1000));
      
      // Try to find and fix specific issues
      try {
        // Sometimes there are unescaped quotes - try to fix them
        jsonStr = jsonStr.replace(/: "([^"]*)"([^,}\]"])/g, ': "$1\\"$2');
        result = JSON.parse(jsonStr);
      } catch (e) {
        console.error('Second parse attempt failed:', e);
        throw new Error('לא ניתן לפרסר את תשובת ה-AI - JSON לא תקין');
      }
    }

    // Generate unique IDs if missing and set default icons
    result.sections = (result.sections || []).map((section: any, sIndex: number) => ({
      ...section,
      id: section.id || `section_${Date.now()}_${sIndex}`,
      icon: section.icon && section.icon !== 'default' && section.icon.length > 0 ? section.icon : '📋',
      fields: (section.fields || []).map((field: any, fIndex: number) => ({
        ...field,
        id: field.id || `field_${Date.now()}_${sIndex}_${fIndex}`,
        display: { width: 'full' }
      }))
    }));

    result.alerts = (result.alerts || []).map((alert: any, aIndex: number) => ({
      ...alert,
      id: alert.id || `alert_${Date.now()}_${aIndex}`
    }));

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'הייבוא הושלם בהצלחה!'
    });

    return {
      success: true,
      templateName: result.templateName,
      templateNameHe: result.templateNameHe,
      description: result.description,
      category: result.category,
      sections: result.sections,
      alerts: result.alerts,
      confidence: result.confidence || 0.8,
      rawText: pdfText
    };

  } catch (err) {
    console.error('AI Analysis Error:', err);
    
    onProgress?.({
      stage: 'error',
      progress: 0,
      message: err instanceof Error ? err.message : 'שגיאה בניתוח'
    });

    return {
      success: false,
      templateName: '',
      templateNameHe: '',
      description: '',
      category: 'general',
      sections: [],
      alerts: [],
      confidence: 0,
      rawText: pdfText,
      error: err instanceof Error ? err.message : 'שגיאה לא ידועה'
    };
  }
}

// ===========================================
// FULL IMPORT FLOW
// ===========================================

export async function importPDFAsTemplate(
  file: File,
  apiKey: string,
  onProgress?: (progress: ImportProgress) => void
): Promise<PDFAnalysisResult> {
  
  // Stage 1: Upload
  onProgress?.({
    stage: 'uploading',
    progress: 10,
    message: 'מעלה קובץ...'
  });

  // Stage 2: Extract text
  onProgress?.({
    stage: 'extracting',
    progress: 30,
    message: 'מחלץ טקסט מה-PDF...'
  });

  let pdfText: string;
  try {
    pdfText = await extractTextFromPDF(file);
  } catch (err) {
    onProgress?.({
      stage: 'error',
      progress: 0,
      message: 'שגיאה בחילוץ טקסט מהקובץ'
    });
    return {
      success: false,
      templateName: '',
      templateNameHe: '',
      description: '',
      category: 'general',
      sections: [],
      alerts: [],
      confidence: 0,
      error: 'שגיאה בחילוץ טקסט מהקובץ'
    };
  }

  if (!pdfText || pdfText.length < 10) {
    onProgress?.({
      stage: 'error',
      progress: 0,
      message: 'הקובץ ריק או לא ניתן לקרוא'
    });
    return {
      success: false,
      templateName: '',
      templateNameHe: '',
      description: '',
      category: 'general',
      sections: [],
      alerts: [],
      confidence: 0,
      error: 'הקובץ ריק או לא ניתן לקרוא'
    };
  }

  // Stage 3 & 4: Analyze with AI
  return await analyzePDFWithAI(pdfText, apiKey, onProgress);
}

// ===========================================
// ALERT EVALUATION
// ===========================================

export function evaluateAlert(
  alert: AlertRule,
  fieldValue: any
): { triggered: boolean; message: string } {
  
  const { condition } = alert;
  let triggered = false;

  switch (condition.type) {
    case 'equals':
      triggered = fieldValue === condition.value;
      break;
      
    case 'not_equals':
      triggered = fieldValue !== condition.value;
      break;
      
    case 'greater_than':
      triggered = Number(fieldValue) > Number(condition.value);
      break;
      
    case 'less_than':
      triggered = Number(fieldValue) < Number(condition.value);
      break;
      
    case 'out_of_range':
      const num = Number(fieldValue);
      triggered = num < (condition.min || -Infinity) || num > (condition.max || Infinity);
      break;
      
    case 'past_date':
      triggered = new Date(fieldValue) < new Date();
      break;
      
    case 'future_date':
      triggered = new Date(fieldValue) > new Date();
      break;
      
    case 'is_empty':
      triggered = !fieldValue || fieldValue === '' || 
                  (Array.isArray(fieldValue) && fieldValue.length === 0);
      break;
      
    case 'contains':
      triggered = String(fieldValue).includes(String(condition.value));
      break;
  }

  return {
    triggered,
    message: triggered ? alert.messageHe : ''
  };
}

// ===========================================
// EXPORT
// ===========================================

export default {
  extractTextFromPDF,
  analyzePDFWithAI,
  importPDFAsTemplate,
  evaluateAlert
};