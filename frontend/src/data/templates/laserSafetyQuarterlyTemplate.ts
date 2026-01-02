// ===========================================
// AEGIS - תבנית: דוח בדיקת בטיחות לייזר רבעונית
// מבנה זהה ל-PDF המקורי
// ===========================================

import { Template, TemplateSection, TemplateField } from '../../types/template-types';

// ===========================================
// HELPER - יצירת ID ייחודי
// ===========================================
const createId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

// ===========================================
// SECTION 1: פרטי האתר
// ===========================================
const section1_siteDetails: TemplateSection = {
  id: 'section_site_details',
  title: 'Site Details',
  titleHe: 'פרטי האתר',
  icon: '🏢',
  order: 1,
  fields: [
    {
      id: 'field_site_name',
      sectionId: 'section_site_details',
      type: 'text',
      label: 'Site Name',
      labelHe: 'שם האתר / חברה',
      placeholder: 'הזן שם האתר',
      order: 1,
      validation: { required: true },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false },
    },
    {
      id: 'field_address',
      sectionId: 'section_site_details',
      type: 'text',
      label: 'Address',
      labelHe: 'כתובת',
      placeholder: 'רחוב, מספר, עיר',
      order: 2,
      validation: { required: true },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false },
    },
    {
      id: 'field_building',
      sectionId: 'section_site_details',
      type: 'text',
      label: 'Building/Floor/Room',
      labelHe: 'בניין / קומה / חדר',
      placeholder: 'בניין X - קומה Y - חדר Z',
      order: 3,
      validation: { required: false },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false },
    },
    {
      id: 'field_inspection_date',
      sectionId: 'section_site_details',
      type: 'date',
      label: 'Inspection Date',
      labelHe: 'תאריך ביקורת',
      order: 4,
      validation: { required: true },
      prefillBehavior: 'never',
      display: { width: 'half', hidden: false, readOnly: false },
    },
  ],
  settings: {
    collapsible: true,
    startCollapsed: false,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// SECTION 2: אנשי קשר (טבלה)
// ===========================================
const section2_contacts: TemplateSection = {
  id: 'section_contacts',
  title: 'Contacts',
  titleHe: 'אנשי קשר',
  icon: '👥',
  order: 2,
  fields: [
    {
      id: 'field_contacts_table',
      sectionId: 'section_contacts',
      type: 'table',
      label: 'Contacts Table',
      labelHe: 'טבלת אנשי קשר',
      order: 1,
      validation: { required: true, minRows: 1 },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false },
      tableConfig: {
        columns: [
          {
            id: 'col_role',
            label: 'Role',
            labelHe: 'תפקיד',
            type: 'select',
            width: '25%',
            required: true,
            options: [
              { id: 'opt_ceo', value: 'ceo', label: 'מנכ"ל' },
              { id: 'opt_safety_manager', value: 'safety_manager', label: 'מנהל בטיחות' },
              { id: 'opt_or_manager', value: 'or_manager', label: 'מנהל חדר ניתוח' },
              { id: 'opt_hr', value: 'hr', label: 'מנהלת משרד/משאבי אנוש' },
              { id: 'opt_laser_operator', value: 'laser_operator', label: 'מפעיל לייזר' },
              { id: 'opt_other', value: 'other', label: 'אחר' },
            ],
          },
          {
            id: 'col_name',
            label: 'Name',
            labelHe: 'שם',
            type: 'text',
            width: '25%',
            required: true,
          },
          {
            id: 'col_phone',
            label: 'Phone',
            labelHe: 'טלפון',
            type: 'phone',
            width: '25%',
            required: true,
          },
          {
            id: 'col_email',
            label: 'Email',
            labelHe: 'מייל',
            type: 'email',
            width: '25%',
            required: false,
          },
        ],
        minRows: 1,
        maxRows: 10,
        allowAddRows: true,
        allowDeleteRows: true,
        showRowNumbers: true,
        defaultRows: 3,
      },
    },
  ],
  settings: {
    collapsible: true,
    startCollapsed: false,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// SECTION 3: מכשירי לייזר (טבלה)
// ===========================================
const section3_laserDevices: TemplateSection = {
  id: 'section_laser_devices',
  title: 'Laser Devices',
  titleHe: 'פרטי מכשיר הלייזר',
  icon: '🔦',
  order: 3,
  fields: [
    {
      id: 'field_laser_devices_table',
      sectionId: 'section_laser_devices',
      type: 'table',
      label: 'Laser Devices Table',
      labelHe: 'טבלת מכשירי לייזר',
      order: 1,
      validation: { required: true, minRows: 1 },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false },
      tableConfig: {
        columns: [
          {
            id: 'col_location',
            label: 'Location',
            labelHe: 'מיקום הפעלה',
            type: 'text',
            width: '15%',
            required: true,
          },
          {
            id: 'col_department',
            label: 'Department',
            labelHe: 'מחלקה',
            type: 'text',
            width: '12%',
            required: false,
          },
          {
            id: 'col_room',
            label: 'Room',
            labelHe: 'חדר',
            type: 'text',
            width: '8%',
            required: false,
          },
          {
            id: 'col_manufacturer',
            label: 'Manufacturer',
            labelHe: 'יצרן',
            type: 'text',
            width: '15%',
            required: true,
          },
          {
            id: 'col_model',
            label: 'Model',
            labelHe: 'דגם',
            type: 'text',
            width: '15%',
            required: true,
          },
          {
            id: 'col_risk_class',
            label: 'Risk Class',
            labelHe: 'דרגת סיכון',
            type: 'select',
            width: '15%',
            required: true,
            options: [
              { id: 'class_1', value: 'class_1', label: 'Class 1' },
              { id: 'class_1m', value: 'class_1m', label: 'Class 1M' },
              { id: 'class_2', value: 'class_2', label: 'Class 2' },
              { id: 'class_2m', value: 'class_2m', label: 'Class 2M' },
              { id: 'class_3r', value: 'class_3r', label: 'Class 3R' },
              { id: 'class_3b', value: 'class_3b', label: 'Class 3B' },
              { id: 'class_4', value: 'class_4', label: 'Class 4' },
            ],
          },
          {
            id: 'col_maintenance',
            label: 'Maintenance',
            labelHe: 'תחזוקה',
            type: 'select',
            width: '20%',
            required: true,
            options: [
              { id: 'maint_valid', value: 'valid', label: 'בתוקף' },
              { id: 'maint_expired', value: 'expired', label: 'פג תוקף' },
              { id: 'maint_missing', value: 'missing', label: 'חסר' },
            ],
          },
        ],
        minRows: 1,
        maxRows: 20,
        allowAddRows: true,
        allowDeleteRows: true,
        showRowNumbers: true,
        defaultRows: 2,
      },
    },
    {
      id: 'field_laser_images',
      sectionId: 'section_laser_devices',
      type: 'image',
      label: 'Device Images',
      labelHe: 'תמונות המכשירים',
      helpText: 'צלם את מכשירי הלייזר',
      order: 2,
      validation: { required: false },
      prefillBehavior: 'never',
      display: { width: 'full', hidden: false, readOnly: false },
      fileConfig: {
        allowedTypes: ['image/*'],
        maxSize: 10,
        maxFiles: 5,
      },
    },
  ],
  settings: {
    collapsible: true,
    startCollapsed: false,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// SECTION 4: דוח בדיקה (טבלה)
// ===========================================
const section4_inspectionReport: TemplateSection = {
  id: 'section_inspection_report',
  title: 'Inspection Report',
  titleHe: 'דוח בדיקה',
  icon: '📋',
  order: 4,
  fields: [
    {
      id: 'field_inspection_table',
      sectionId: 'section_inspection_report',
      type: 'table',
      label: 'Inspection Items',
      labelHe: 'פריטי בדיקה',
      order: 1,
      validation: { required: true, minRows: 1 },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false },
      tableConfig: {
        columns: [
          {
            id: 'col_item',
            label: 'Item',
            labelHe: 'מה נבדק',
            type: 'select',
            width: '30%',
            required: true,
            options: [
              { id: 'item_goggles', value: 'goggles', label: 'משקפי מגן' },
              { id: 'item_warning_lights', value: 'warning_lights', label: 'מנורות התראה' },
              { id: 'item_warning_signs', value: 'warning_signs', label: 'שלטי התראה' },
              { id: 'item_door_lock', value: 'door_lock', label: 'ידית עיוורת לדלת ראשית' },
              { id: 'item_training', value: 'training', label: 'הדרכות בטיחות' },
              { id: 'item_instructions', value: 'instructions', label: 'הוראות בטיחות' },
              { id: 'item_permit', value: 'permit', label: 'היתר שימוש' },
              { id: 'item_reflective', value: 'reflective', label: 'משטחים מחזירים' },
              { id: 'item_extinguisher', value: 'extinguisher', label: 'מטף כיבוי' },
              { id: 'item_window_protection', value: 'window_protection', label: 'הגנת חלונות' },
              { id: 'item_ventilation', value: 'ventilation', label: 'אוורור' },
              { id: 'item_emergency_stop', value: 'emergency_stop', label: 'כפתור חירום' },
              { id: 'item_key_control', value: 'key_control', label: 'בקרת מפתח' },
              { id: 'item_beam_path', value: 'beam_path', label: 'נתיב קרן' },
              { id: 'item_other', value: 'other', label: 'אחר' },
            ],
          },
          {
            id: 'col_status',
            label: 'Status',
            labelHe: 'תקינות',
            type: 'select',
            width: '20%',
            required: true,
            options: [
              { id: 'status_ok', value: 'ok', label: 'תקין', color: '#22c55e' },
              { id: 'status_not_ok', value: 'not_ok', label: 'לא תקין', color: '#ef4444' },
              { id: 'status_partial', value: 'partial', label: 'חלקי', color: '#f59e0b' },
              { id: 'status_na', value: 'na', label: 'לא רלוונטי', color: '#6b7280' },
            ],
          },
          {
            id: 'col_quantity',
            label: 'Quantity',
            labelHe: 'כמות',
            type: 'number',
            width: '15%',
            required: false,
          },
          {
            id: 'col_notes',
            label: 'Notes',
            labelHe: 'הערות',
            type: 'text',
            width: '35%',
            required: false,
          },
        ],
        minRows: 5,
        maxRows: 20,
        allowAddRows: true,
        allowDeleteRows: true,
        showRowNumbers: true,
        defaultRows: 10,
      },
    },
  ],
  settings: {
    collapsible: true,
    startCollapsed: false,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// SECTION 5: עובדים עם הדרכות בתוקף (טבלה)
// ===========================================
const section5_trainedEmployees: TemplateSection = {
  id: 'section_trained_employees',
  title: 'Trained Employees',
  titleHe: 'עובדים עם הדרכות בתוקף',
  icon: '👨‍🎓',
  order: 5,
  fields: [
    {
      id: 'field_training_validity',
      sectionId: 'section_trained_employees',
      type: 'date',
      label: 'Training Valid Until',
      labelHe: 'הדרכות בתוקף עד',
      order: 1,
      validation: { required: true },
      prefillBehavior: 'always',
      display: { width: 'half', hidden: false, readOnly: false },
    },
    {
      id: 'field_employees_count',
      sectionId: 'section_trained_employees',
      type: 'number',
      label: 'Number of Trained Employees',
      labelHe: 'מספר עובדים מוכשרים',
      order: 2,
      validation: { required: true, min: 0 },
      prefillBehavior: 'always',
      display: { width: 'half', hidden: false, readOnly: false },
    },
    {
      id: 'field_employees_table',
      sectionId: 'section_trained_employees',
      type: 'table',
      label: 'Employees List',
      labelHe: 'רשימת עובדים',
      helpText: 'רשימת עובדים שעברו הדרכת בטיחות לייזר',
      order: 3,
      validation: { required: false },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false },
      tableConfig: {
        columns: [
          {
            id: 'col_last_name',
            label: 'Last Name',
            labelHe: 'שם משפחה',
            type: 'text',
            width: '30%',
            required: true,
          },
          {
            id: 'col_first_name',
            label: 'First Name',
            labelHe: 'שם פרטי',
            type: 'text',
            width: '30%',
            required: true,
          },
          {
            id: 'col_training_date',
            label: 'Training Date',
            labelHe: 'תאריך ביצוע',
            type: 'date',
            width: '40%',
            required: true,
          },
        ],
        minRows: 0,
        maxRows: 50,
        allowAddRows: true,
        allowDeleteRows: true,
        showRowNumbers: true,
        defaultRows: 5,
      },
    },
    {
      id: 'field_employees_list_attached',
      sectionId: 'section_trained_employees',
      type: 'toggle',
      label: 'Employees List Attached',
      labelHe: 'רשימת עובדים מצורפת',
      checkboxLabel: 'כן, רשימת עובדים מצורפת כנספח',
      order: 4,
      validation: { required: false },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false },
    },
  ],
  settings: {
    collapsible: true,
    startCollapsed: false,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// SECTION 6: ממצאים וסיכום
// ===========================================
const section6_findings: TemplateSection = {
  id: 'section_findings',
  title: 'Findings',
  titleHe: 'ממצאים וסיכום',
  icon: '📝',
  order: 6,
  fields: [
    {
      id: 'field_overall_status',
      sectionId: 'section_findings',
      type: 'radio',
      label: 'Overall Status',
      labelHe: 'סטטוס כללי',
      order: 1,
      validation: { required: true },
      prefillBehavior: 'never',
      display: { width: 'full', hidden: false, readOnly: false },
      options: [
        { id: 'opt_ok', value: 'ok', label: 'תקין', color: '#22c55e' },
        { id: 'opt_ok_with_notes', value: 'ok_with_notes', label: 'תקין עם הערות', color: '#f59e0b' },
        { id: 'opt_not_ok', value: 'not_ok', label: 'לא תקין', color: '#ef4444' },
      ],
    },
    {
      id: 'field_approval_granted',
      sectionId: 'section_findings',
      type: 'toggle',
      label: 'Approval Granted',
      labelHe: 'ניתן אישור הפעלה למערכות הלייזר',
      checkboxLabel: 'כן, ניתן אישור הפעלה',
      order: 2,
      validation: { required: true },
      prefillBehavior: 'never',
      display: { width: 'full', hidden: false, readOnly: false },
    },
    {
      id: 'field_findings_notes',
      sectionId: 'section_findings',
      type: 'textarea',
      label: 'Findings Notes',
      labelHe: 'פירוט ממצאים',
      placeholder: 'תאר את הממצאים העיקריים...',
      order: 3,
      validation: { required: false },
      prefillBehavior: 'never',
      display: { width: 'full', hidden: false, readOnly: false, rows: 4 },
    },
    {
      id: 'field_recommendations',
      sectionId: 'section_findings',
      type: 'textarea',
      label: 'Recommendations',
      labelHe: 'המלצות ודרישות',
      placeholder: 'הזן המלצות לתיקון ליקויים...',
      order: 4,
      validation: { required: false },
      prefillBehavior: 'never',
      display: { width: 'full', hidden: false, readOnly: false, rows: 4 },
    },
  ],
  settings: {
    collapsible: true,
    startCollapsed: false,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// SECTION 7: הנחיות ותנאים
// ===========================================
const section7_guidelines: TemplateSection = {
  id: 'section_guidelines',
  title: 'Guidelines',
  titleHe: 'הנחיות ותנאים לאישור עבודה עם לייזר',
  icon: '📜',
  order: 7,
  fields: [
    {
      id: 'field_guidelines_text',
      sectionId: 'section_guidelines',
      type: 'paragraph',
      label: 'Guidelines',
      labelHe: 'הנחיות',
      paragraphContent: `1. העובדים לא יהיו מורשים לעבוד עם לייזרים ללא הדרכה בתוקף. המעסיק אחראי לוודא שכל העובדים שעובדים עם לייזרים קיבלו הדרכה מתאימה.

2. באחריות המעסיק לוודא שהעובדים מקיימים את הוראות הבטיחות המפורטות בדוח זה.

3. אסור לשנות את מיקום מכונת/מכשיר הלייזר ללא אישור מוקדם בכתב ממעבדה מוסמכת.

4. יש לדווח לממונה בטיחות הלייזר על כל שינוי מהותי במערכת הלייזר או במעבדת לייזר.`,
      order: 1,
      validation: { required: false },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: true },
    },
  ],
  settings: {
    collapsible: true,
    startCollapsed: true,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// SECTION 8: חתימה
// ===========================================
const section8_signature: TemplateSection = {
  id: 'section_signature',
  title: 'Signature',
  titleHe: 'חתימת הבודק',
  icon: '✍️',
  order: 8,
  fields: [
    {
      id: 'field_inspector_name',
      sectionId: 'section_signature',
      type: 'text',
      label: 'Inspector Name',
      labelHe: 'שם הבודק',
      order: 1,
      validation: { required: true },
      prefillBehavior: 'always',
      display: { width: 'half', hidden: false, readOnly: false },
    },
    {
      id: 'field_inspector_role',
      sectionId: 'section_signature',
      type: 'text',
      label: 'Inspector Role',
      labelHe: 'תפקיד',
      defaultValue: 'ממונה בטיחות לייזר',
      order: 2,
      validation: { required: true },
      prefillBehavior: 'always',
      display: { width: 'half', hidden: false, readOnly: false },
    },
    {
      id: 'field_signature',
      sectionId: 'section_signature',
      type: 'signature',
      label: 'Signature',
      labelHe: 'חתימה',
      order: 3,
      validation: { required: true },
      prefillBehavior: 'never',
      display: { width: 'full', hidden: false, readOnly: false },
    },
    {
      id: 'field_report_copies',
      sectionId: 'section_signature',
      type: 'textarea',
      label: 'Report Copies',
      labelHe: 'העתקים',
      placeholder: 'שמות הנמענים להעתקי הדוח',
      helpText: 'למי לשלוח העתק של הדוח',
      order: 4,
      validation: { required: false },
      prefillBehavior: 'always',
      display: { width: 'full', hidden: false, readOnly: false, rows: 2 },
    },
  ],
  settings: {
    collapsible: false,
    startCollapsed: false,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// SECTION 9: הערות נוספות
// ===========================================
const section9_notes: TemplateSection = {
  id: 'section_notes',
  title: 'Additional Notes',
  titleHe: 'הערות נוספות',
  icon: '📌',
  order: 9,
  fields: [
    {
      id: 'field_additional_notes',
      sectionId: 'section_notes',
      type: 'textarea',
      label: 'Notes',
      labelHe: 'הערות',
      placeholder: 'הערות נוספות...',
      order: 1,
      validation: { required: false },
      prefillBehavior: 'never',
      display: { width: 'full', hidden: false, readOnly: false, rows: 4 },
    },
    {
      id: 'field_additional_images',
      sectionId: 'section_notes',
      type: 'image',
      label: 'Additional Images',
      labelHe: 'תמונות נוספות',
      helpText: 'ניתן לצרף תמונות נוספות',
      order: 2,
      validation: { required: false },
      prefillBehavior: 'never',
      display: { width: 'full', hidden: false, readOnly: false },
      fileConfig: {
        allowedTypes: ['image/*'],
        maxSize: 10,
        maxFiles: 10,
      },
    },
  ],
  settings: {
    collapsible: true,
    startCollapsed: true,
    repeatable: false,
    showTitle: true,
  },
};

// ===========================================
// FULL TEMPLATE
// ===========================================
export const laserSafetyQuarterlyTemplate: Omit<Template, 'id' | 'createdAt' | 'updatedAt'> = {
  tenantId: 'system',
  
  // מידע בסיסי
  name: 'Quarterly Laser Safety Inspection',
  nameHe: 'דוח בדיקת בטיחות לייזר רבעונית',
  description: 'Quarterly safety inspection report for laser equipment and facilities',
  descriptionHe: 'דוח ביקורת בטיחות רבעונית למכשירי לייזר ומתקנים',
  
  type: 'inspection',
  category: 'laser',
  tags: ['לייזר', 'ביקורת רבעונית', 'בטיחות', 'Class 4'],
  
  // גרסה
  version: 1,
  
  // סקשנים
  sections: [
    section1_siteDetails,
    section2_contacts,
    section3_laserDevices,
    section4_inspectionReport,
    section5_trainedEmployees,
    section6_findings,
    section7_guidelines,
    section8_signature,
    section9_notes,
  ],
  
  // הגדרות
  settings: {
    showProgressBar: true,
    showSectionNumbers: true,
    allowSaveAsDraft: true,
    autoSaveInterval: 30,
    
    pdfSettings: {
      includeHeader: true,
      includeFooter: true,
      includeLogo: true,
      logoPosition: 'right',
      pageSize: 'A4',
      orientation: 'portrait',
      headerText: 'דוח בדיקת בטיחות לייזר רבעונית',
      footerText: 'AEGIS Safety Management System',
    },
    
    validityPeriod: {
      enabled: true,
      months: 3, // רבעון
    },
    
    prefillSettings: {
      enabled: true,
      allowUserChoice: true,
      showPreviousValues: true,
      highlightChanges: true,
    },
    
    permissions: {
      whoCanFill: 'tenant_users',
      requireApproval: false,
      approverRoles: [],
    },
  },
  
  // סטטוס
  status: 'published',
  isSystemTemplate: true,
  isShared: true,
  
  // יוצר
  createdBy: 'system',
  lastEditedBy: 'system',
};

// ===========================================
// EXPORT DEFAULT INSPECTION ITEMS
// ===========================================
export const DEFAULT_LASER_INSPECTION_ITEMS = [
  { item: 'goggles', labelHe: 'משקפי מגן', defaultQuantity: 1 },
  { item: 'warning_lights', labelHe: 'מנורות התראה', defaultQuantity: 1 },
  { item: 'warning_signs', labelHe: 'שלטי התראה', defaultQuantity: 1 },
  { item: 'door_lock', labelHe: 'ידית עיוורת לדלת ראשית', defaultQuantity: 1 },
  { item: 'training', labelHe: 'הדרכות בטיחות', defaultQuantity: null },
  { item: 'instructions', labelHe: 'הוראות בטיחות', defaultQuantity: 1 },
  { item: 'permit', labelHe: 'היתר שימוש', defaultQuantity: 1 },
  { item: 'reflective', labelHe: 'משטחים מחזירים', defaultQuantity: null },
  { item: 'extinguisher', labelHe: 'מטף כיבוי', defaultQuantity: 1 },
  { item: 'window_protection', labelHe: 'הגנת חלונות', defaultQuantity: null },
];

export default laserSafetyQuarterlyTemplate;