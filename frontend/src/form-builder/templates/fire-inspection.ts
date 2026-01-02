/**
 * AEGIS Fire Safety Inspection Templates
 * תבניות ביקורת בטיחות אש
 * 
 * Based on:
 * - ת"י 129 - מטפי כיבוי אש
 * - ת"י 1220 - מערכות גילוי אש
 * - ת"י 1596 - משאבות כיבוי אש
 * - הוראות נציב כבאות והצלה
 */

import { FormSchema } from '../types/form.types';

// ============================================
// 🧯 Fire Extinguisher Monthly Inspection
// בדיקה חזותית חודשית למטפים
// ============================================

export const FireExtinguisherMonthlySchema: FormSchema = {
  id: 'fire-extinguisher-monthly',
  name: 'בדיקת מטפים - חודשית',
  nameEn: 'Fire Extinguisher Monthly Inspection',
  description: 'בדיקה חזותית חודשית למטפי כיבוי אש לפי ת"י 129',
  version: '1.0.0',
  category: 'fire',
  
  fields: [
    // ========== פרטי הביקורת ==========
    {
      id: 'section_inspection',
      type: 'section',
      name: 'section_inspection',
      label: 'פרטי הביקורת'
    },
    {
      id: 'inspection_date',
      type: 'date',
      name: 'inspectionDate',
      label: 'תאריך בדיקה',
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
      id: 'client_name',
      type: 'text',
      name: 'clientName',
      label: 'שם הלקוח/אתר',
      validation: { required: true }
    },
    {
      id: 'location',
      type: 'text',
      name: 'location',
      label: 'מיקום',
      validation: { required: true }
    },

    // ========== פרטי המטף ==========
    {
      id: 'section_extinguisher',
      type: 'section',
      name: 'section_extinguisher',
      label: 'פרטי המטף'
    },
    {
      id: 'extinguisher_id',
      type: 'text',
      name: 'extinguisherId',
      label: 'מספר זיהוי מטף',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'extinguisher_type',
      type: 'select',
      name: 'extinguisherType',
      label: 'סוג מטף',
      validation: { required: true },
      options: [
        { value: 'powder_abc', label: 'אבקה ABC' },
        { value: 'powder_bc', label: 'אבקה BC' },
        { value: 'co2', label: 'CO2 פחמן דו-חמצני' },
        { value: 'foam', label: 'קצף' },
        { value: 'water', label: 'מים' },
        { value: 'wet_chemical', label: 'כימיקל רטוב (מטבחים)' },
        { value: 'clean_agent', label: 'חומר נקי (הלון/FM200)' }
      ],
      width: 'half'
    },
    {
      id: 'extinguisher_size',
      type: 'select',
      name: 'extinguisherSize',
      label: 'גודל (ק"ג)',
      validation: { required: true },
      options: [
        { value: '1', label: '1 ק"ג' },
        { value: '2', label: '2 ק"ג' },
        { value: '3', label: '3 ק"ג' },
        { value: '6', label: '6 ק"ג' },
        { value: '9', label: '9 ק"ג' },
        { value: '12', label: '12 ק"ג' },
        { value: '25', label: '25 ק"ג (על גלגלים)' },
        { value: '50', label: '50 ק"ג (על גלגלים)' }
      ],
      width: 'half'
    },
    {
      id: 'manufacturer',
      type: 'text',
      name: 'manufacturer',
      label: 'יצרן',
      width: 'half'
    },
    {
      id: 'manufacture_year',
      type: 'number',
      name: 'manufactureYear',
      label: 'שנת ייצור',
      validation: { min: 1990, max: 2030 },
      width: 'half'
    },
    {
      id: 'last_service_date',
      type: 'date',
      name: 'lastServiceDate',
      label: 'תאריך טיפול אחרון',
      width: 'half'
    },

    // ========== בדיקות ==========
    {
      id: 'section_checks',
      type: 'section',
      name: 'section_checks',
      label: 'רשימת בדיקות'
    },
    {
      id: 'location_accessible',
      type: 'radio',
      name: 'locationAccessible',
      label: 'המטף במקום נגיש וגלוי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'signage_visible',
      type: 'radio',
      name: 'signageVisible',
      label: 'שילוט מיקום המטף תקין',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'mounting_secure',
      type: 'radio',
      name: 'mountingSecure',
      label: 'התקנה יציבה (תליה/מעמד)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'height_correct',
      type: 'radio',
      name: 'heightCorrect',
      label: 'גובה התקנה תקין (עד 1.2 מ\')',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'pressure_gauge',
      type: 'radio',
      name: 'pressureGauge',
      label: 'מד לחץ באזור הירוק',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'אין מד לחץ (CO2)' }
      ]
    },
    {
      id: 'safety_pin',
      type: 'radio',
      name: 'safetyPin',
      label: 'סיכת בטיחות במקום',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'seal_intact',
      type: 'radio',
      name: 'sealIntact',
      label: 'חותם שלם',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'body_condition',
      type: 'radio',
      name: 'bodyCondition',
      label: 'מצב גוף המטף (ללא חלודה/שקעים)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'hose_condition',
      type: 'radio',
      name: 'hoseCondition',
      label: 'מצב הצינורית (ללא סדקים)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'nozzle_clear',
      type: 'radio',
      name: 'nozzleClear',
      label: 'זרבובית פנויה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'label_readable',
      type: 'radio',
      name: 'labelReadable',
      label: 'תווית קריאה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'service_sticker',
      type: 'radio',
      name: 'serviceSticker',
      label: 'מדבקת טיפול בתוקף',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== סיכום ==========
    {
      id: 'section_summary',
      type: 'section',
      name: 'section_summary',
      label: 'סיכום'
    },
    {
      id: 'overall_status',
      type: 'select',
      name: 'overallStatus',
      label: 'סטטוס כללי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין - ממשיך בשימוש' },
        { value: 'needs_service', label: 'דורש טיפול שנתי' },
        { value: 'fail', label: 'פסול - להחלפה/תיקון' }
      ]
    },
    {
      id: 'notes',
      type: 'textarea',
      name: 'notes',
      label: 'הערות',
      settings: { rows: 3 }
    },
    {
      id: 'photo',
      type: 'image',
      name: 'photo',
      label: 'תמונת המטף'
    }
  ],

  settings: {
    direction: 'rtl',
    showProgressBar: true,
    submitButtonText: 'שמור בדיקה',
    showSaveAsDraft: true,
    requireInspectorSignature: false,
    requireClientSignature: false,
    autoSave: true,
    autoSaveInterval: 30
  }
};

// ============================================
// 🧯 Fire Extinguisher Annual Inspection
// בדיקה שנתית מקיפה למטפים
// ============================================

export const FireExtinguisherAnnualSchema: FormSchema = {
  id: 'fire-extinguisher-annual',
  name: 'בדיקת מטפים - שנתית',
  nameEn: 'Fire Extinguisher Annual Inspection',
  description: 'בדיקה שנתית מקיפה למטפי כיבוי אש לפי ת"י 129 - מבוצעת ע"י טכנאי מוסמך',
  version: '1.0.0',
  category: 'fire',
  
  fields: [
    // ========== פרטי הביקורת ==========
    {
      id: 'section_inspection',
      type: 'section',
      name: 'section_inspection',
      label: 'פרטי הביקורת'
    },
    {
      id: 'inspection_date',
      type: 'date',
      name: 'inspectionDate',
      label: 'תאריך בדיקה',
      validation: { required: true }
    },
    {
      id: 'technician_name',
      type: 'text',
      name: 'technicianName',
      label: 'שם הטכנאי',
      validation: { required: true }
    },
    {
      id: 'technician_license',
      type: 'text',
      name: 'technicianLicense',
      label: 'מספר רישיון טכנאי',
      validation: { required: true }
    },
    {
      id: 'service_company',
      type: 'text',
      name: 'serviceCompany',
      label: 'חברת שירות',
      validation: { required: true }
    },
    {
      id: 'client_name',
      type: 'text',
      name: 'clientName',
      label: 'שם הלקוח',
      validation: { required: true }
    },
    {
      id: 'site_address',
      type: 'text',
      name: 'siteAddress',
      label: 'כתובת האתר',
      validation: { required: true }
    },

    // ========== פרטי המטף ==========
    {
      id: 'section_extinguisher',
      type: 'section',
      name: 'section_extinguisher',
      label: 'פרטי המטף'
    },
    {
      id: 'extinguisher_id',
      type: 'text',
      name: 'extinguisherId',
      label: 'מספר זיהוי מטף',
      validation: { required: true }
    },
    {
      id: 'extinguisher_type',
      type: 'select',
      name: 'extinguisherType',
      label: 'סוג מטף',
      validation: { required: true },
      options: [
        { value: 'powder_abc', label: 'אבקה ABC' },
        { value: 'powder_bc', label: 'אבקה BC' },
        { value: 'co2', label: 'CO2' },
        { value: 'foam', label: 'קצף' },
        { value: 'water', label: 'מים' },
        { value: 'wet_chemical', label: 'כימיקל רטוב' },
        { value: 'clean_agent', label: 'חומר נקי' }
      ]
    },
    {
      id: 'extinguisher_size',
      type: 'text',
      name: 'extinguisherSize',
      label: 'גודל/משקל',
      validation: { required: true }
    },
    {
      id: 'manufacturer',
      type: 'text',
      name: 'manufacturer',
      label: 'יצרן'
    },
    {
      id: 'serial_number',
      type: 'text',
      name: 'serialNumber',
      label: 'מספר סידורי'
    },
    {
      id: 'manufacture_year',
      type: 'number',
      name: 'manufactureYear',
      label: 'שנת ייצור',
      validation: { required: true }
    },
    {
      id: 'last_hydrostatic_test',
      type: 'date',
      name: 'lastHydrostaticTest',
      label: 'תאריך בדיקה הידרוסטטית אחרונה'
    },

    // ========== בדיקות חזותיות ==========
    {
      id: 'section_visual',
      type: 'section',
      name: 'section_visual',
      label: 'בדיקות חזותיות'
    },
    {
      id: 'cylinder_condition',
      type: 'radio',
      name: 'cylinderCondition',
      label: 'מצב הגליל (חלודה, שקעים, נזק)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'paint_condition',
      type: 'radio',
      name: 'paintCondition',
      label: 'מצב הצבע',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'valve_condition',
      type: 'radio',
      name: 'valveCondition',
      label: 'מצב השסתום',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'handle_condition',
      type: 'radio',
      name: 'handleCondition',
      label: 'מצב הידית',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'hose_condition',
      type: 'radio',
      name: 'hoseCondition',
      label: 'מצב הצינורית',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'nozzle_condition',
      type: 'radio',
      name: 'nozzleCondition',
      label: 'מצב הזרבובית',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בדיקות טכניות ==========
    {
      id: 'section_technical',
      type: 'section',
      name: 'section_technical',
      label: 'בדיקות טכניות'
    },
    {
      id: 'pressure_check',
      type: 'radio',
      name: 'pressureCheck',
      label: 'בדיקת לחץ',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'pressure_reading',
      type: 'text',
      name: 'pressureReading',
      label: 'קריאת לחץ (bar)',
      condition: {
        field: 'pressureCheck',
        operator: 'equals',
        value: 'pass'
      }
    },
    {
      id: 'weight_check',
      type: 'radio',
      name: 'weightCheck',
      label: 'בדיקת משקל (CO2)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'actual_weight',
      type: 'text',
      name: 'actualWeight',
      label: 'משקל בפועל (ק"ג)',
      condition: {
        field: 'weightCheck',
        operator: 'not_equals',
        value: 'na'
      }
    },
    {
      id: 'agent_condition',
      type: 'radio',
      name: 'agentCondition',
      label: 'מצב חומר הכיבוי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'agent_replaced',
      type: 'checkbox',
      name: 'agentReplaced',
      label: 'חומר כיבוי הוחלף'
    },

    // ========== פעולות שבוצעו ==========
    {
      id: 'section_actions',
      type: 'section',
      name: 'section_actions',
      label: 'פעולות שבוצעו'
    },
    {
      id: 'actions_performed',
      type: 'multi-select',
      name: 'actionsPerformed',
      label: 'פעולות שבוצעו',
      options: [
        { value: 'visual_inspection', label: 'בדיקה חזותית' },
        { value: 'pressure_check', label: 'בדיקת לחץ' },
        { value: 'weight_check', label: 'בדיקת משקל' },
        { value: 'valve_check', label: 'בדיקת שסתום' },
        { value: 'hose_replace', label: 'החלפת צינורית' },
        { value: 'nozzle_clean', label: 'ניקוי זרבובית' },
        { value: 'agent_replace', label: 'החלפת חומר כיבוי' },
        { value: 'refill', label: 'מילוי מחדש' },
        { value: 'seal_replace', label: 'החלפת חותם' },
        { value: 'sticker_update', label: 'עדכון מדבקת טיפול' }
      ]
    },
    {
      id: 'parts_replaced',
      type: 'textarea',
      name: 'partsReplaced',
      label: 'חלקים שהוחלפו (פירוט)',
      settings: { rows: 2 }
    },

    // ========== סיכום ==========
    {
      id: 'section_summary',
      type: 'section',
      name: 'section_summary',
      label: 'סיכום'
    },
    {
      id: 'overall_status',
      type: 'select',
      name: 'overallStatus',
      label: 'סטטוס סופי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'עבר בדיקה - תקין' },
        { value: 'pass_repaired', label: 'עבר בדיקה - לאחר תיקון' },
        { value: 'fail_repair', label: 'נכשל - דרוש תיקון נוסף' },
        { value: 'fail_replace', label: 'פסול - להחלפה' },
        { value: 'hydrostatic_required', label: 'דרושה בדיקה הידרוסטטית' }
      ]
    },
    {
      id: 'next_service_date',
      type: 'date',
      name: 'nextServiceDate',
      label: 'תאריך טיפול הבא',
      validation: { required: true }
    },
    {
      id: 'notes',
      type: 'textarea',
      name: 'notes',
      label: 'הערות',
      settings: { rows: 3 }
    }
  ],

  settings: {
    direction: 'rtl',
    showProgressBar: true,
    submitButtonText: 'שמור בדיקה',
    showSaveAsDraft: true,
    requireInspectorSignature: true,
    requireClientSignature: true,
    autoSave: true,
    autoSaveInterval: 60,
    generatePdf: true
  }
};

// ============================================
// 🚨 Smoke Detector Inspection
// בדיקת גלאי עשן
// ============================================

export const SmokeDetectorInspectionSchema: FormSchema = {
  id: 'smoke-detector-inspection',
  name: 'בדיקת גלאי עשן',
  nameEn: 'Smoke Detector Inspection',
  description: 'בדיקת גלאי עשן לפי ת"י 1220',
  version: '1.0.0',
  category: 'fire',
  
  fields: [
    // ========== פרטי הביקורת ==========
    {
      id: 'section_inspection',
      type: 'section',
      name: 'section_inspection',
      label: 'פרטי הביקורת'
    },
    {
      id: 'inspection_date',
      type: 'date',
      name: 'inspectionDate',
      label: 'תאריך בדיקה',
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
      label: 'מספר רישיון'
    },
    {
      id: 'client_name',
      type: 'text',
      name: 'clientName',
      label: 'שם הלקוח',
      validation: { required: true }
    },
    {
      id: 'building_name',
      type: 'text',
      name: 'buildingName',
      label: 'שם המבנה/אתר',
      validation: { required: true }
    },

    // ========== פרטי הגלאי ==========
    {
      id: 'section_detector',
      type: 'section',
      name: 'section_detector',
      label: 'פרטי הגלאי'
    },
    {
      id: 'detector_id',
      type: 'text',
      name: 'detectorId',
      label: 'מספר/כתובת גלאי',
      validation: { required: true }
    },
    {
      id: 'detector_location',
      type: 'text',
      name: 'detectorLocation',
      label: 'מיקום הגלאי',
      validation: { required: true }
    },
    {
      id: 'detector_type',
      type: 'select',
      name: 'detectorType',
      label: 'סוג גלאי',
      validation: { required: true },
      options: [
        { value: 'optical', label: 'אופטי (פוטואלקטרי)' },
        { value: 'ionization', label: 'יינון' },
        { value: 'heat', label: 'חום' },
        { value: 'multi', label: 'משולב' },
        { value: 'beam', label: 'קרן (Beam)' },
        { value: 'aspirating', label: 'שואב (Aspirating)' }
      ]
    },
    {
      id: 'manufacturer',
      type: 'text',
      name: 'manufacturer',
      label: 'יצרן'
    },
    {
      id: 'model',
      type: 'text',
      name: 'model',
      label: 'דגם'
    },
    {
      id: 'install_date',
      type: 'date',
      name: 'installDate',
      label: 'תאריך התקנה'
    },

    // ========== בדיקות ==========
    {
      id: 'section_tests',
      type: 'section',
      name: 'section_tests',
      label: 'בדיקות'
    },
    {
      id: 'visual_condition',
      type: 'radio',
      name: 'visualCondition',
      label: 'מצב חזותי (ניקיון, שלמות)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'led_indicator',
      type: 'radio',
      name: 'ledIndicator',
      label: 'נורית חיווי פעילה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'smoke_test',
      type: 'radio',
      name: 'smokeTest',
      label: 'בדיקת עשן (Smoke Test)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'הגיב - תקין ✓' },
        { value: 'fail', label: 'לא הגיב - לא תקין ✗' }
      ]
    },
    {
      id: 'response_time',
      type: 'number',
      name: 'responseTime',
      label: 'זמן תגובה (שניות)',
      settings: { suffix: 'שניות' }
    },
    {
      id: 'panel_communication',
      type: 'radio',
      name: 'panelCommunication',
      label: 'תקשורת לרכזת תקינה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'address_correct',
      type: 'radio',
      name: 'addressCorrect',
      label: 'כתובת ברכזת נכונה',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'sensitivity_ok',
      type: 'radio',
      name: 'sensitivityOk',
      label: 'רגישות בטווח תקין',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא נבדק' }
      ]
    },

    // ========== פעולות ==========
    {
      id: 'section_actions',
      type: 'section',
      name: 'section_actions',
      label: 'פעולות שבוצעו'
    },
    {
      id: 'cleaned',
      type: 'checkbox',
      name: 'cleaned',
      label: 'בוצע ניקוי'
    },
    {
      id: 'head_replaced',
      type: 'checkbox',
      name: 'headReplaced',
      label: 'ראש גלאי הוחלף'
    },
    {
      id: 'base_replaced',
      type: 'checkbox',
      name: 'baseReplaced',
      label: 'בסיס הוחלף'
    },

    // ========== סיכום ==========
    {
      id: 'section_summary',
      type: 'section',
      name: 'section_summary',
      label: 'סיכום'
    },
    {
      id: 'overall_status',
      type: 'select',
      name: 'overallStatus',
      label: 'סטטוס',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין' },
        { value: 'pass_cleaned', label: 'תקין לאחר ניקוי' },
        { value: 'replaced', label: 'הוחלף' },
        { value: 'fail', label: 'לא תקין - דורש טיפול' }
      ]
    },
    {
      id: 'notes',
      type: 'textarea',
      name: 'notes',
      label: 'הערות',
      settings: { rows: 2 }
    }
  ],

  settings: {
    direction: 'rtl',
    showProgressBar: false,
    submitButtonText: 'שמור',
    showSaveAsDraft: true,
    requireInspectorSignature: false,
    autoSave: true,
    autoSaveInterval: 30
  }
};

// ============================================
// 📋 Export All Fire Templates
// ============================================

export const FireInspectionTemplates = {
  extinguisherMonthly: FireExtinguisherMonthlySchema,
  extinguisherAnnual: FireExtinguisherAnnualSchema,
  smokeDetector: SmokeDetectorInspectionSchema,
};

export default FireInspectionTemplates;
