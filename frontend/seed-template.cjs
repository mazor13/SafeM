const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const template = {
  id: 'template_laser_safety_quarterly_v1',
  tenantId: 'system',
  name: 'Quarterly Laser Safety Inspection',
  nameHe: 'דוח בדיקת בטיחות לייזר רבעונית',
  description: 'Quarterly safety inspection report for laser equipment',
  descriptionHe: 'דוח ביקורת בטיחות רבעונית למכשירי לייזר',
  type: 'inspection',
  category: 'laser',
  tags: ['לייזר', 'ביקורת רבעונית', 'בטיחות'],
  version: 1,
  status: 'published',
  isSystemTemplate: true,
  isShared: true,
  createdBy: 'system',
  lastEditedBy: 'system',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  sections: [
    {
      id: 'section_site_details',
      title: 'Site Details',
      titleHe: 'פרטי האתר',
      icon: '🏢',
      order: 1,
      fields: [
        { id: 'field_site_name', type: 'text', label: 'Site Name', labelHe: 'שם האתר', order: 1, validation: { required: true }, prefillBehavior: 'always', display: { width: 'full', hidden: false, readOnly: false } },
        { id: 'field_address', type: 'text', label: 'Address', labelHe: 'כתובת', order: 2, validation: { required: true }, prefillBehavior: 'always', display: { width: 'full', hidden: false, readOnly: false } },
        { id: 'field_building', type: 'text', label: 'Building', labelHe: 'בניין / קומה / חדר', order: 3, validation: { required: false }, prefillBehavior: 'always', display: { width: 'full', hidden: false, readOnly: false } },
        { id: 'field_inspection_date', type: 'date', label: 'Date', labelHe: 'תאריך ביקורת', order: 4, validation: { required: true }, prefillBehavior: 'never', display: { width: 'half', hidden: false, readOnly: false } }
      ],
      settings: { collapsible: true, startCollapsed: false, repeatable: false, showTitle: true }
    },
    {
      id: 'section_contacts',
      title: 'Contacts',
      titleHe: 'אנשי קשר',
      icon: '👥',
      order: 2,
      fields: [
        {
          id: 'field_contacts_table',
          type: 'table',
          label: 'Contacts',
          labelHe: 'טבלת אנשי קשר',
          order: 1,
          validation: { required: true, minRows: 1 },
          prefillBehavior: 'always',
          display: { width: 'full', hidden: false, readOnly: false },
          tableConfig: {
            columns: [
              { id: 'col_role', label: 'Role', labelHe: 'תפקיד', type: 'select', width: '25%', required: true, options: [
                { id: 'opt_ceo', value: 'ceo', label: 'מנכ"ל' },
                { id: 'opt_safety', value: 'safety_manager', label: 'מנהל בטיחות' },
                { id: 'opt_or', value: 'or_manager', label: 'מנהל חדר ניתוח' },
                { id: 'opt_hr', value: 'hr', label: 'משאבי אנוש' }
              ]},
              { id: 'col_name', label: 'Name', labelHe: 'שם', type: 'text', width: '25%', required: true },
              { id: 'col_phone', label: 'Phone', labelHe: 'טלפון', type: 'phone', width: '25%', required: true },
              { id: 'col_email', label: 'Email', labelHe: 'מייל', type: 'email', width: '25%', required: false }
            ],
            minRows: 1, maxRows: 10, allowAddRows: true, allowDeleteRows: true, showRowNumbers: true, defaultRows: 3
          }
        }
      ],
      settings: { collapsible: true, startCollapsed: false, repeatable: false, showTitle: true }
    },
    {
      id: 'section_laser_devices',
      title: 'Laser Devices',
      titleHe: 'פרטי מכשיר הלייזר',
      icon: '🔦',
      order: 3,
      fields: [
        {
          id: 'field_laser_table',
          type: 'table',
          label: 'Devices',
          labelHe: 'טבלת מכשירי לייזר',
          order: 1,
          validation: { required: true, minRows: 1 },
          prefillBehavior: 'always',
          display: { width: 'full', hidden: false, readOnly: false },
          tableConfig: {
            columns: [
              { id: 'col_location', label: 'Location', labelHe: 'מיקום', type: 'text', width: '20%', required: true },
              { id: 'col_manufacturer', label: 'Manufacturer', labelHe: 'יצרן', type: 'text', width: '20%', required: true },
              { id: 'col_model', label: 'Model', labelHe: 'דגם', type: 'text', width: '20%', required: true },
              { id: 'col_class', label: 'Class', labelHe: 'דרגת סיכון', type: 'select', width: '20%', required: true, options: [
                { id: 'c1', value: 'class_1', label: 'Class 1' },
                { id: 'c2', value: 'class_2', label: 'Class 2' },
                { id: 'c3r', value: 'class_3r', label: 'Class 3R' },
                { id: 'c3b', value: 'class_3b', label: 'Class 3B' },
                { id: 'c4', value: 'class_4', label: 'Class 4' }
              ]},
              { id: 'col_maint', label: 'Maintenance', labelHe: 'תחזוקה', type: 'select', width: '20%', required: true, options: [
                { id: 'valid', value: 'valid', label: 'בתוקף' },
                { id: 'expired', value: 'expired', label: 'פג תוקף' },
                { id: 'missing', value: 'missing', label: 'חסר' }
              ]}
            ],
            minRows: 1, maxRows: 20, allowAddRows: true, allowDeleteRows: true, showRowNumbers: true, defaultRows: 2
          }
        }
      ],
      settings: { collapsible: true, startCollapsed: false, repeatable: false, showTitle: true }
    },
    {
      id: 'section_inspection',
      title: 'Inspection',
      titleHe: 'דוח בדיקה',
      icon: '📋',
      order: 4,
      fields: [
        {
          id: 'field_inspection_table',
          type: 'table',
          label: 'Items',
          labelHe: 'פריטי בדיקה',
          order: 1,
          validation: { required: true, minRows: 5 },
          prefillBehavior: 'always',
          display: { width: 'full', hidden: false, readOnly: false },
          tableConfig: {
            columns: [
              { id: 'col_item', label: 'Item', labelHe: 'מה נבדק', type: 'select', width: '30%', required: true, options: [
                { id: 'goggles', value: 'goggles', label: 'משקפי מגן' },
                { id: 'lights', value: 'warning_lights', label: 'מנורות התראה' },
                { id: 'signs', value: 'warning_signs', label: 'שלטי התראה' },
                { id: 'door', value: 'door_lock', label: 'ידית עיוורת לדלת' },
                { id: 'training', value: 'training', label: 'הדרכות בטיחות' },
                { id: 'instructions', value: 'instructions', label: 'הוראות בטיחות' },
                { id: 'permit', value: 'permit', label: 'היתר שימוש' },
                { id: 'extinguisher', value: 'extinguisher', label: 'מטף כיבוי' },
                { id: 'windows', value: 'window_protection', label: 'הגנת חלונות' }
              ]},
              { id: 'col_status', label: 'Status', labelHe: 'תקינות', type: 'select', width: '20%', required: true, options: [
                { id: 'ok', value: 'ok', label: 'תקין' },
                { id: 'not_ok', value: 'not_ok', label: 'לא תקין' },
                { id: 'partial', value: 'partial', label: 'חלקי' },
                { id: 'na', value: 'na', label: 'לא רלוונטי' }
              ]},
              { id: 'col_qty', label: 'Qty', labelHe: 'כמות', type: 'number', width: '15%', required: false },
              { id: 'col_notes', label: 'Notes', labelHe: 'הערות', type: 'text', width: '35%', required: false }
            ],
            minRows: 5, maxRows: 20, allowAddRows: true, allowDeleteRows: true, showRowNumbers: true, defaultRows: 10
          }
        }
      ],
      settings: { collapsible: true, startCollapsed: false, repeatable: false, showTitle: true }
    },
    {
      id: 'section_employees',
      title: 'Trained Employees',
      titleHe: 'עובדים עם הדרכות בתוקף',
      icon: '👨‍🎓',
      order: 5,
      fields: [
        { id: 'field_training_valid', type: 'date', label: 'Valid Until', labelHe: 'בתוקף עד', order: 1, validation: { required: true }, prefillBehavior: 'always', display: { width: 'half', hidden: false, readOnly: false } },
        { id: 'field_emp_count', type: 'number', label: 'Count', labelHe: 'מספר עובדים', order: 2, validation: { required: true }, prefillBehavior: 'always', display: { width: 'half', hidden: false, readOnly: false } },
        {
          id: 'field_employees_table',
          type: 'table',
          label: 'Employees',
          labelHe: 'רשימת עובדים',
          order: 3,
          validation: { required: false },
          prefillBehavior: 'always',
          display: { width: 'full', hidden: false, readOnly: false },
          tableConfig: {
            columns: [
              { id: 'col_lname', label: 'Last', labelHe: 'שם משפחה', type: 'text', width: '30%', required: true },
              { id: 'col_fname', label: 'First', labelHe: 'שם פרטי', type: 'text', width: '30%', required: true },
              { id: 'col_date', label: 'Date', labelHe: 'תאריך הדרכה', type: 'date', width: '40%', required: true }
            ],
            minRows: 0, maxRows: 50, allowAddRows: true, allowDeleteRows: true, showRowNumbers: true, defaultRows: 5
          }
        }
      ],
      settings: { collapsible: true, startCollapsed: false, repeatable: false, showTitle: true }
    },
    {
      id: 'section_findings',
      title: 'Findings',
      titleHe: 'ממצאים וסיכום',
      icon: '📝',
      order: 6,
      fields: [
        { id: 'field_status', type: 'radio', label: 'Status', labelHe: 'סטטוס כללי', order: 1, validation: { required: true }, prefillBehavior: 'never', display: { width: 'full', hidden: false, readOnly: false }, options: [
          { id: 'ok', value: 'ok', label: 'תקין' },
          { id: 'ok_notes', value: 'ok_with_notes', label: 'תקין עם הערות' },
          { id: 'not_ok', value: 'not_ok', label: 'לא תקין' }
        ]},
        { id: 'field_approval', type: 'toggle', label: 'Approval', labelHe: 'אישור הפעלה', checkboxLabel: 'ניתן אישור הפעלה למערכות הלייזר', order: 2, validation: { required: true }, prefillBehavior: 'never', display: { width: 'full', hidden: false, readOnly: false } },
        { id: 'field_findings_notes', type: 'textarea', label: 'Notes', labelHe: 'פירוט ממצאים', order: 3, validation: { required: false }, prefillBehavior: 'never', display: { width: 'full', hidden: false, readOnly: false, rows: 4 } },
        { id: 'field_recommendations', type: 'textarea', label: 'Recommendations', labelHe: 'המלצות', order: 4, validation: { required: false }, prefillBehavior: 'never', display: { width: 'full', hidden: false, readOnly: false, rows: 4 } }
      ],
      settings: { collapsible: true, startCollapsed: false, repeatable: false, showTitle: true }
    },
    {
      id: 'section_signature',
      title: 'Signature',
      titleHe: 'חתימת הבודק',
      icon: '✍️',
      order: 7,
      fields: [
        { id: 'field_inspector', type: 'text', label: 'Inspector', labelHe: 'שם הבודק', order: 1, validation: { required: true }, prefillBehavior: 'always', display: { width: 'half', hidden: false, readOnly: false } },
        { id: 'field_role', type: 'text', label: 'Role', labelHe: 'תפקיד', defaultValue: 'ממונה בטיחות לייזר', order: 2, validation: { required: true }, prefillBehavior: 'always', display: { width: 'half', hidden: false, readOnly: false } },
        { id: 'field_signature', type: 'signature', label: 'Signature', labelHe: 'חתימה', order: 3, validation: { required: true }, prefillBehavior: 'never', display: { width: 'full', hidden: false, readOnly: false } }
      ],
      settings: { collapsible: false, startCollapsed: false, repeatable: false, showTitle: true }
    }
  ],
  settings: {
    showProgressBar: true,
    showSectionNumbers: true,
    allowSaveAsDraft: true,
    autoSaveInterval: 30,
    pdfSettings: { includeHeader: true, includeFooter: true, includeLogo: true, pageSize: 'A4', orientation: 'portrait' },
    prefillSettings: { enabled: true, allowUserChoice: true, showPreviousValues: true, highlightChanges: true },
    permissions: { whoCanFill: 'tenant_users', requireApproval: false, approverRoles: [] }
  }
};

async function seed() {
  try {
    await db.collection('templates').doc(template.id).set(template);
    console.log('✅ Template seeded successfully!');
    console.log('   ID:', template.id);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seed();
