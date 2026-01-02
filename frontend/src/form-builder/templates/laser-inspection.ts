/**
 * AEGIS Laser Safety Inspection Templates
 * תבניות ביקורת בטיחות לייזר
 */

import { FormSchema } from '../types/form.types';

// ============================================
// 🔴 Laser Safety Quarterly Inspection
// ============================================

export const LaserQuarterlyInspectionSchema: FormSchema = {
  id: 'laser-quarterly-inspection',
  name: 'ביקורת בטיחות לייזר - רבעונית',
  nameEn: 'Laser Safety Quarterly Inspection',
  description: 'טופס ביקורת רבעונית למערכות לייזר לפי תקנות הבטיחות בעבודה (גיהות תעסוקתית ובטיחות העוסקים בקרינת לייזר), התשס"ה-2005',
  version: '1.0.0',
  category: 'laser',
  
  fields: [
    // ========== פרטי הביקורת ==========
    {
      id: 'section_inspection_details',
      type: 'section',
      name: 'section_inspection_details',
      label: 'פרטי הביקורת',
      settings: { collapsible: true }
    },
    {
      id: 'inspection_date',
      type: 'date',
      name: 'inspectionDate',
      label: 'תאריך ביקורת',
      validation: { required: true }
    },
    {
      id: 'inspector_name',
      type: 'text',
      name: 'inspectorName',
      label: 'שם הבודק',
      validation: { required: true }
    },
    {
      id: 'inspector_license',
      type: 'text',
      name: 'inspectorLicense',
      label: 'מספר רישיון ממונה בטיחות לייזר',
      validation: { required: true }
    },
    {
      id: 'next_inspection_date',
      type: 'date',
      name: 'nextInspectionDate',
      label: 'תאריך ביקורת הבאה',
      validation: { required: true }
    },

    // ========== פרטי הלקוח ==========
    {
      id: 'section_client',
      type: 'section',
      name: 'section_client',
      label: 'פרטי הלקוח והמיקום'
    },
    {
      id: 'client_name',
      type: 'text',
      name: 'clientName',
      label: 'שם החברה/מוסד',
      validation: { required: true }
    },
    {
      id: 'client_address',
      type: 'text',
      name: 'clientAddress',
      label: 'כתובת',
      validation: { required: true }
    },
    {
      id: 'location_name',
      type: 'text',
      name: 'locationName',
      label: 'מיקום הבדיקה (חדר/מעבדה)',
      validation: { required: true }
    },
    {
      id: 'contact_person',
      type: 'text',
      name: 'contactPerson',
      label: 'איש קשר',
      width: 'half'
    },
    {
      id: 'contact_phone',
      type: 'phone',
      name: 'contactPhone',
      label: 'טלפון',
      width: 'half'
    },

    // ========== פרטי מכשיר הלייזר ==========
    {
      id: 'section_laser_device',
      type: 'section',
      name: 'section_laser_device',
      label: 'פרטי מכשיר הלייזר'
    },
    {
      id: 'laser_manufacturer',
      type: 'text',
      name: 'laserManufacturer',
      label: 'יצרן',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'laser_model',
      type: 'text',
      name: 'laserModel',
      label: 'דגם',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'laser_serial',
      type: 'text',
      name: 'laserSerial',
      label: 'מספר סידורי',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'laser_class',
      type: 'select',
      name: 'laserClass',
      label: 'סיווג הלייזר',
      validation: { required: true },
      options: [
        { value: '1', label: 'Class 1' },
        { value: '1M', label: 'Class 1M' },
        { value: '1C', label: 'Class 1C' },
        { value: '2', label: 'Class 2' },
        { value: '2M', label: 'Class 2M' },
        { value: '3R', label: 'Class 3R' },
        { value: '3B', label: 'Class 3B' },
        { value: '4', label: 'Class 4' }
      ],
      width: 'half'
    },
    {
      id: 'wavelength',
      type: 'text',
      name: 'wavelength',
      label: 'אורך גל (nm)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'power_output',
      type: 'text',
      name: 'powerOutput',
      label: 'הספק יציאה (mW/W)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'laser_application',
      type: 'select',
      name: 'laserApplication',
      label: 'שימוש',
      options: [
        { value: 'medical', label: 'רפואי' },
        { value: 'industrial', label: 'תעשייתי' },
        { value: 'research', label: 'מחקר' },
        { value: 'cosmetic', label: 'קוסמטי' },
        { value: 'entertainment', label: 'בידור' },
        { value: 'other', label: 'אחר' }
      ]
    },

    // ========== בדיקות שילוט ותיוג ==========
    {
      id: 'section_signage',
      type: 'section',
      name: 'section_signage',
      label: 'שילוט ותיוג'
    },
    {
      id: 'warning_sign_door',
      type: 'radio',
      name: 'warningSignDoor',
      label: 'שלט אזהרה על דלת הכניסה לאזור הלייזר',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'warning_sign_door_notes',
      type: 'text',
      name: 'warningSignDoorNotes',
      label: 'הערות',
      condition: {
        field: 'warningSignDoor',
        operator: 'equals',
        value: 'fail'
      }
    },
    {
      id: 'warning_label_device',
      type: 'radio',
      name: 'warningLabelDevice',
      label: 'תווית אזהרה על המכשיר',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'class_label',
      type: 'radio',
      name: 'classLabel',
      label: 'תווית סיווג הלייזר',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'aperture_label',
      type: 'radio',
      name: 'apertureLabel',
      label: 'תיוג פתח יציאת הקרן',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },

    // ========== בקרות הנדסיות ==========
    {
      id: 'section_engineering',
      type: 'section',
      name: 'section_engineering',
      label: 'בקרות הנדסיות'
    },
    {
      id: 'key_switch',
      type: 'radio',
      name: 'keySwitch',
      label: 'מתג מפתח להפעלה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'key_removable',
      type: 'radio',
      name: 'keyRemovable',
      label: 'מפתח ניתן להסרה במצב כבוי',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'warning_light',
      type: 'radio',
      name: 'warningLight',
      label: 'נורית אזהרה בזמן פעולה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'beam_stop',
      type: 'radio',
      name: 'beamStop',
      label: 'עוצר קרן (Beam Stop)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'interlock_door',
      type: 'radio',
      name: 'interlockDoor',
      label: 'אינטרלוק בדלת',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'interlock_housing',
      type: 'radio',
      name: 'interlockHousing',
      label: 'אינטרלוק במארז',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'emergency_stop',
      type: 'radio',
      name: 'emergencyStop',
      label: 'כפתור עצירת חירום',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'shutter',
      type: 'radio',
      name: 'shutter',
      label: 'תריס (Shutter)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },

    // ========== ציוד מגן אישי ==========
    {
      id: 'section_ppe',
      type: 'section',
      name: 'section_ppe',
      label: 'ציוד מגן אישי'
    },
    {
      id: 'goggles_available',
      type: 'radio',
      name: 'gogglesAvailable',
      label: 'משקפי הגנה זמינים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'goggles_od',
      type: 'text',
      name: 'gogglesOd',
      label: 'ערך OD של המשקפיים',
      helpText: 'Optical Density מתאים לאורך הגל וההספק'
    },
    {
      id: 'goggles_wavelength',
      type: 'text',
      name: 'gogglesWavelength',
      label: 'טווח אורכי גל של המשקפיים (nm)'
    },
    {
      id: 'goggles_condition',
      type: 'radio',
      name: 'gogglesCondition',
      label: 'מצב פיזי של המשקפיים',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'goggles_quantity',
      type: 'number',
      name: 'gogglesQuantity',
      label: 'כמות משקפיים',
      settings: { min: 0 }
    },

    // ========== נהלים ותיעוד ==========
    {
      id: 'section_procedures',
      type: 'section',
      name: 'section_procedures',
      label: 'נהלים ותיעוד'
    },
    {
      id: 'sop_available',
      type: 'radio',
      name: 'sopAvailable',
      label: 'נוהל עבודה בטוח (SOP) קיים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'training_records',
      type: 'radio',
      name: 'trainingRecords',
      label: 'רישומי הדרכה עדכניים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'authorized_users_list',
      type: 'radio',
      name: 'authorizedUsersList',
      label: 'רשימת משתמשים מורשים',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'maintenance_log',
      type: 'radio',
      name: 'maintenanceLog',
      label: 'יומן תחזוקה',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },

    // ========== סביבת העבודה ==========
    {
      id: 'section_environment',
      type: 'section',
      name: 'section_environment',
      label: 'סביבת העבודה'
    },
    {
      id: 'controlled_area',
      type: 'radio',
      name: 'controlledArea',
      label: 'אזור מבוקר מוגדר',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'reflective_surfaces',
      type: 'radio',
      name: 'reflectiveSurfaces',
      label: 'אין משטחים מחזירי אור',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'window_protection',
      type: 'radio',
      name: 'windowProtection',
      label: 'חלונות מוגנים/מכוסים',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'ventilation',
      type: 'radio',
      name: 'ventilation',
      label: 'אוורור תקין',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'fire_extinguisher',
      type: 'radio',
      name: 'fireExtinguisher',
      label: 'מטף כיבוי אש זמין',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },

    // ========== סיכום וממצאים ==========
    {
      id: 'section_summary',
      type: 'section',
      name: 'section_summary',
      label: 'סיכום וממצאים'
    },
    {
      id: 'overall_status',
      type: 'select',
      name: 'overallStatus',
      label: 'סטטוס כללי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'עבר - תקין' },
        { value: 'pass_with_remarks', label: 'עבר עם הערות' },
        { value: 'fail', label: 'נכשל - נדרש תיקון' }
      ]
    },
    {
      id: 'findings',
      type: 'textarea',
      name: 'findings',
      label: 'ממצאים והערות',
      settings: { rows: 4 }
    },
    {
      id: 'recommendations',
      type: 'textarea',
      name: 'recommendations',
      label: 'המלצות לפעולה',
      settings: { rows: 4 }
    },
    {
      id: 'corrective_actions_required',
      type: 'checkbox',
      name: 'correctiveActionsRequired',
      label: 'נדרשות פעולות מתקנות'
    },
    {
      id: 'follow_up_date',
      type: 'date',
      name: 'followUpDate',
      label: 'תאריך מעקב',
      condition: {
        field: 'correctiveActionsRequired',
        operator: 'equals',
        value: true
      }
    },

    // ========== תמונות ==========
    {
      id: 'section_photos',
      type: 'section',
      name: 'section_photos',
      label: 'תיעוד צילומי'
    },
    {
      id: 'photo_device',
      type: 'image',
      name: 'photoDevice',
      label: 'תמונת המכשיר'
    },
    {
      id: 'photo_signage',
      type: 'image',
      name: 'photoSignage',
      label: 'תמונת שילוט'
    },
    {
      id: 'photo_findings',
      type: 'image',
      name: 'photoFindings',
      label: 'תמונת ממצאים (אם יש)'
    }
  ],

  settings: {
    direction: 'rtl',
    showProgressBar: true,
    showFieldNumbers: false,
    submitButtonText: 'שמור ביקורת',
    submitButtonTextEn: 'Save Inspection',
    showSaveAsDraft: true,
    requireInspectorSignature: true,
    requireClientSignature: true,
    requireWitnessSignature: false,
    autoSave: true,
    autoSaveInterval: 60,
    generatePdf: true
  }
};

// ============================================
// 📋 Export All Templates
// ============================================

export const LaserInspectionTemplates = {
  quarterly: LaserQuarterlyInspectionSchema,
  // annual: LaserAnnualInspectionSchema, // TODO
};

export default LaserInspectionTemplates;
