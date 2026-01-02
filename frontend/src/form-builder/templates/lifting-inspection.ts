/**
 * AEGIS Lifting Equipment Inspection Templates
 * תבניות ביקורת מתקני הרמה
 * 
 * Based on:
 * - פקודת הבטיחות בעבודה [נוסח חדש], התש"ל-1970 - סימן ז'
 * - תקנות הבטיחות בעבודה (בודק מוסמך ומתקני הרמה), התשנ"ג-1992
 * - תקנות עגורנאים ומפעילי מכונות הרמה, התשנ"ג-1992
 */

import { FormSchema } from '../types/form.types';

// ============================================
// 🏗️ Crane Inspection - 14 Month Cycle
// בדיקת עגורן - מחזור 14 חודשים
// ============================================

export const CraneInspectionSchema: FormSchema = {
  id: 'crane-inspection-14month',
  name: 'בדיקת עגורן - תקופתית',
  nameEn: 'Crane Periodic Inspection',
  description: 'בדיקה תקופתית לעגורן לפי פקודת הבטיחות בעבודה סימן ז\' - מחזור 14 חודשים',
  version: '1.0.0',
  category: 'lifting',
  
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
      label: 'שם הבודק המוסמך',
      validation: { required: true }
    },
    {
      id: 'inspector_license',
      type: 'text',
      name: 'inspectorLicense',
      label: 'מספר רישיון בודק מוסמך',
      validation: { required: true }
    },
    {
      id: 'inspection_company',
      type: 'text',
      name: 'inspectionCompany',
      label: 'חברת הבדיקה',
      validation: { required: true }
    },
    {
      id: 'next_inspection_date',
      type: 'date',
      name: 'nextInspectionDate',
      label: 'תאריך בדיקה הבאה (עד 14 חודשים)',
      validation: { required: true }
    },

    // ========== פרטי הלקוח ==========
    {
      id: 'section_client',
      type: 'section',
      name: 'section_client',
      label: 'פרטי הלקוח'
    },
    {
      id: 'client_name',
      type: 'text',
      name: 'clientName',
      label: 'שם המפעל/חברה',
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

    // ========== פרטי העגורן ==========
    {
      id: 'section_crane',
      type: 'section',
      name: 'section_crane',
      label: 'פרטי העגורן'
    },
    {
      id: 'crane_type',
      type: 'select',
      name: 'craneType',
      label: 'סוג העגורן',
      validation: { required: true },
      options: [
        { value: 'overhead', label: 'עגורן גשר (Overhead Crane)' },
        { value: 'gantry', label: 'עגורן שער (Gantry Crane)' },
        { value: 'jib', label: 'עגורן זרוע (Jib Crane)' },
        { value: 'tower', label: 'עגורן צריח (Tower Crane)' },
        { value: 'mobile', label: 'עגורן נייד (Mobile Crane)' },
        { value: 'truck_mounted', label: 'עגורן על משאית (Truck Mounted)' },
        { value: 'crawler', label: 'עגורן זחלים (Crawler Crane)' },
        { value: 'hoist', label: 'מכונת הרמה (Hoist)' }
      ]
    },
    {
      id: 'manufacturer',
      type: 'text',
      name: 'manufacturer',
      label: 'יצרן',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'model',
      type: 'text',
      name: 'model',
      label: 'דגם',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'serial_number',
      type: 'text',
      name: 'serialNumber',
      label: 'מספר סידורי',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'internal_id',
      type: 'text',
      name: 'internalId',
      label: 'מספר פנימי',
      width: 'half'
    },
    {
      id: 'manufacture_year',
      type: 'number',
      name: 'manufactureYear',
      label: 'שנת ייצור',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'swl',
      type: 'text',
      name: 'swl',
      label: 'עומס עבודה בטוח - SWL (טון)',
      validation: { required: true },
      helpText: 'Safe Working Load',
      width: 'half'
    },
    {
      id: 'span',
      type: 'text',
      name: 'span',
      label: 'מוט/טווח (מטר)',
      width: 'half'
    },
    {
      id: 'lift_height',
      type: 'text',
      name: 'liftHeight',
      label: 'גובה הרמה (מטר)',
      width: 'half'
    },
    {
      id: 'power_type',
      type: 'select',
      name: 'powerType',
      label: 'סוג הנעה',
      options: [
        { value: 'electric', label: 'חשמלי' },
        { value: 'hydraulic', label: 'הידראולי' },
        { value: 'pneumatic', label: 'פנאומטי' },
        { value: 'manual', label: 'ידני' },
        { value: 'diesel', label: 'דיזל' }
      ]
    },

    // ========== בדיקת מבנה ==========
    {
      id: 'section_structure',
      type: 'section',
      name: 'section_structure',
      label: 'בדיקת מבנה'
    },
    {
      id: 'main_structure',
      type: 'radio',
      name: 'mainStructure',
      label: 'מבנה ראשי (קורות, מסגרת)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'welding_condition',
      type: 'radio',
      name: 'weldingCondition',
      label: 'מצב ריתוכים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'corrosion',
      type: 'radio',
      name: 'corrosion',
      label: 'קורוזיה/חלודה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין - אין קורוזיה משמעותית ✓' },
        { value: 'fail', label: 'לא תקין - יש קורוזיה ✗' }
      ]
    },
    {
      id: 'bolts_connections',
      type: 'radio',
      name: 'boltsConnections',
      label: 'ברגים וחיבורים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'rails_runway',
      type: 'radio',
      name: 'railsRunway',
      label: 'מסילות נסיעה',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'end_stops',
      type: 'radio',
      name: 'endStops',
      label: 'עוצרי קצה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בדיקת מנגנון הרמה ==========
    {
      id: 'section_hoist',
      type: 'section',
      name: 'section_hoist',
      label: 'בדיקת מנגנון הרמה'
    },
    {
      id: 'wire_rope',
      type: 'radio',
      name: 'wireRope',
      label: 'כבל פלדה/שרשרת',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'wire_rope_condition',
      type: 'textarea',
      name: 'wireRopeCondition',
      label: 'פירוט מצב כבל (שחיקה, חוטים שבורים)',
      settings: { rows: 2 }
    },
    {
      id: 'drum_condition',
      type: 'radio',
      name: 'drumCondition',
      label: 'תוף גלילה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'hook_condition',
      type: 'radio',
      name: 'hookCondition',
      label: 'וו הרמה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'hook_safety_latch',
      type: 'radio',
      name: 'hookSafetyLatch',
      label: 'נועל בטיחות בווו',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'sheaves_pulleys',
      type: 'radio',
      name: 'sheavesPulleys',
      label: 'גלגלות',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בדיקת בטיחות ==========
    {
      id: 'section_safety',
      type: 'section',
      name: 'section_safety',
      label: 'התקני בטיחות'
    },
    {
      id: 'overload_limiter',
      type: 'radio',
      name: 'overloadLimiter',
      label: 'מגביל עומס',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא מותקן' }
      ]
    },
    {
      id: 'overload_test',
      type: 'checkbox',
      name: 'overloadTest',
      label: 'בוצעה בדיקת מגביל עומס'
    },
    {
      id: 'upper_limit_switch',
      type: 'radio',
      name: 'upperLimitSwitch',
      label: 'מפסק גבול עליון',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'lower_limit_switch',
      type: 'radio',
      name: 'lowerLimitSwitch',
      label: 'מפסק גבול תחתון',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'travel_limit_switches',
      type: 'radio',
      name: 'travelLimitSwitches',
      label: 'מפסקי גבול נסיעה',
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
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'warning_devices',
      type: 'radio',
      name: 'warningDevices',
      label: 'התקני אזהרה (צופר, אור)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא מותקן' }
      ]
    },

    // ========== בדיקת חשמל ==========
    {
      id: 'section_electrical',
      type: 'section',
      name: 'section_electrical',
      label: 'מערכת חשמל'
    },
    {
      id: 'electrical_panel',
      type: 'radio',
      name: 'electricalPanel',
      label: 'לוח חשמל',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'cables_wiring',
      type: 'radio',
      name: 'cablesWiring',
      label: 'כבלים וחיווט',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'motors',
      type: 'radio',
      name: 'motors',
      label: 'מנועים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'brakes',
      type: 'radio',
      name: 'brakes',
      label: 'בלמים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'controls',
      type: 'radio',
      name: 'controls',
      label: 'בקרים/שלט',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'grounding',
      type: 'radio',
      name: 'grounding',
      label: 'הארקה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בדיקת עומס ==========
    {
      id: 'section_load_test',
      type: 'section',
      name: 'section_load_test',
      label: 'בדיקת עומס'
    },
    {
      id: 'load_test_performed',
      type: 'checkbox',
      name: 'loadTestPerformed',
      label: 'בוצעה בדיקת עומס'
    },
    {
      id: 'load_test_weight',
      type: 'text',
      name: 'loadTestWeight',
      label: 'משקל בדיקה (טון)',
      condition: {
        field: 'loadTestPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'load_test_result',
      type: 'radio',
      name: 'loadTestResult',
      label: 'תוצאת בדיקת עומס',
      condition: {
        field: 'loadTestPerformed',
        operator: 'equals',
        value: true
      },
      options: [
        { value: 'pass', label: 'עבר ✓' },
        { value: 'fail', label: 'נכשל ✗' }
      ]
    },
    {
      id: 'operational_test',
      type: 'radio',
      name: 'operationalTest',
      label: 'בדיקת הפעלה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== תיעוד ושילוט ==========
    {
      id: 'section_documentation',
      type: 'section',
      name: 'section_documentation',
      label: 'תיעוד ושילוט'
    },
    {
      id: 'swl_marking',
      type: 'radio',
      name: 'swlMarking',
      label: 'סימון SWL על העגורן',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'id_plate',
      type: 'radio',
      name: 'idPlate',
      label: 'לוחית זיהוי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'operator_manual',
      type: 'radio',
      name: 'operatorManual',
      label: 'ספר הפעלה זמין',
      options: [
        { value: 'pass', label: 'קיים ✓' },
        { value: 'fail', label: 'לא קיים ✗' }
      ]
    },
    {
      id: 'maintenance_log',
      type: 'radio',
      name: 'maintenanceLog',
      label: 'יומן תחזוקה',
      options: [
        { value: 'pass', label: 'קיים ומעודכן ✓' },
        { value: 'fail', label: 'לא קיים/לא מעודכן ✗' }
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
      label: 'סטטוס סופי',
      validation: { required: true },
      options: [
        { value: 'approved', label: 'אושר לשימוש' },
        { value: 'approved_limited', label: 'אושר בהגבלות' },
        { value: 'requires_repair', label: 'דורש תיקון' },
        { value: 'rejected', label: 'נפסל - אסור לשימוש' }
      ]
    },
    {
      id: 'limitations',
      type: 'textarea',
      name: 'limitations',
      label: 'הגבלות (אם יש)',
      settings: { rows: 2 },
      condition: {
        field: 'overallStatus',
        operator: 'equals',
        value: 'approved_limited'
      }
    },
    {
      id: 'findings',
      type: 'textarea',
      name: 'findings',
      label: 'ממצאים',
      settings: { rows: 3 }
    },
    {
      id: 'recommendations',
      type: 'textarea',
      name: 'recommendations',
      label: 'המלצות',
      settings: { rows: 3 }
    },
    {
      id: 'photo_crane',
      type: 'image',
      name: 'photoCrane',
      label: 'תמונת העגורן'
    },
    {
      id: 'photo_plate',
      type: 'image',
      name: 'photoPlate',
      label: 'תמונת לוחית זיהוי'
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
// 🚜 Forklift Inspection - 14 Month Cycle
// בדיקת מלגזה - מחזור 14 חודשים
// ============================================

export const ForkliftInspectionSchema: FormSchema = {
  id: 'forklift-inspection-14month',
  name: 'בדיקת מלגזה - תקופתית',
  nameEn: 'Forklift Periodic Inspection',
  description: 'בדיקה תקופתית למלגזה לפי פקודת הבטיחות בעבודה - מחזור 14 חודשים',
  version: '1.0.0',
  category: 'lifting',
  
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
      label: 'שם הבודק המוסמך',
      validation: { required: true }
    },
    {
      id: 'inspector_license',
      type: 'text',
      name: 'inspectorLicense',
      label: 'מספר רישיון',
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
    {
      id: 'next_inspection',
      type: 'date',
      name: 'nextInspection',
      label: 'תאריך בדיקה הבאה',
      validation: { required: true }
    },

    // ========== פרטי המלגזה ==========
    {
      id: 'section_forklift',
      type: 'section',
      name: 'section_forklift',
      label: 'פרטי המלגזה'
    },
    {
      id: 'forklift_type',
      type: 'select',
      name: 'forkliftType',
      label: 'סוג מלגזה',
      validation: { required: true },
      options: [
        { value: 'counterbalance', label: 'משקל נגדי (Counterbalance)' },
        { value: 'reach', label: 'ריצ\' (Reach)' },
        { value: 'pallet_jack', label: 'עגלת משטחים חשמלית' },
        { value: 'order_picker', label: 'ליקוט הזמנות (Order Picker)' },
        { value: 'telescopic', label: 'טלסקופית' },
        { value: 'rough_terrain', label: 'שטח (Rough Terrain)' },
        { value: 'side_loader', label: 'טעינה צדית' }
      ]
    },
    {
      id: 'power_source',
      type: 'select',
      name: 'powerSource',
      label: 'מקור כוח',
      validation: { required: true },
      options: [
        { value: 'electric', label: 'חשמלית (סוללה)' },
        { value: 'lpg', label: 'גפ"מ (LPG)' },
        { value: 'diesel', label: 'דיזל' },
        { value: 'gasoline', label: 'בנזין' }
      ]
    },
    {
      id: 'manufacturer',
      type: 'text',
      name: 'manufacturer',
      label: 'יצרן',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'model',
      type: 'text',
      name: 'model',
      label: 'דגם',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'serial_number',
      type: 'text',
      name: 'serialNumber',
      label: 'מספר סידורי',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'internal_id',
      type: 'text',
      name: 'internalId',
      label: 'מספר פנימי/רכב',
      width: 'half'
    },
    {
      id: 'manufacture_year',
      type: 'number',
      name: 'manufactureYear',
      label: 'שנת ייצור',
      width: 'half'
    },
    {
      id: 'capacity',
      type: 'text',
      name: 'capacity',
      label: 'כושר הרמה (ק"ג)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'mast_type',
      type: 'select',
      name: 'mastType',
      label: 'סוג תורן',
      options: [
        { value: 'duplex', label: 'דופלקס (2 שלבים)' },
        { value: 'triplex', label: 'טריפלקס (3 שלבים)' },
        { value: 'quad', label: 'קוואד (4 שלבים)' }
      ]
    },
    {
      id: 'lift_height',
      type: 'text',
      name: 'liftHeight',
      label: 'גובה הרמה מקסימלי (מ\')',
      width: 'half'
    },
    {
      id: 'hours_meter',
      type: 'number',
      name: 'hoursMeter',
      label: 'שעון שעות',
      width: 'half'
    },

    // ========== בדיקת מבנה ==========
    {
      id: 'section_structure',
      type: 'section',
      name: 'section_structure',
      label: 'בדיקת מבנה ושלדה'
    },
    {
      id: 'frame_condition',
      type: 'radio',
      name: 'frameCondition',
      label: 'מצב שלדה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'mast_condition',
      type: 'radio',
      name: 'mastCondition',
      label: 'מצב תורן',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'carriage_condition',
      type: 'radio',
      name: 'carriageCondition',
      label: 'מצב כרכרה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'forks_condition',
      type: 'radio',
      name: 'forksCondition',
      label: 'מצב מזלגות',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'forks_wear',
      type: 'text',
      name: 'forksWear',
      label: 'אחוז שחיקת מזלגות (%)'
    },
    {
      id: 'overhead_guard',
      type: 'radio',
      name: 'overheadGuard',
      label: 'גג מגן למפעיל',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'load_backrest',
      type: 'radio',
      name: 'loadBackrest',
      label: 'משענת עומס',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'counterweight',
      type: 'radio',
      name: 'counterweight',
      label: 'משקל נגדי',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },

    // ========== מערכת הידראולית ==========
    {
      id: 'section_hydraulic',
      type: 'section',
      name: 'section_hydraulic',
      label: 'מערכת הידראולית'
    },
    {
      id: 'hydraulic_pump',
      type: 'radio',
      name: 'hydraulicPump',
      label: 'משאבה הידראולית',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'lift_cylinders',
      type: 'radio',
      name: 'liftCylinders',
      label: 'צילינדרי הרמה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'tilt_cylinders',
      type: 'radio',
      name: 'tiltCylinders',
      label: 'צילינדרי הטיה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'hoses_fittings',
      type: 'radio',
      name: 'hosesFittings',
      label: 'צינורות וחיבורים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין - אין נזילות ✓' },
        { value: 'fail', label: 'לא תקין - יש נזילות ✗' }
      ]
    },
    {
      id: 'oil_level',
      type: 'radio',
      name: 'oilLevel',
      label: 'מפלס שמן',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'control_valves',
      type: 'radio',
      name: 'controlValves',
      label: 'שסתומי בקרה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בלמים והיגוי ==========
    {
      id: 'section_brakes_steering',
      type: 'section',
      name: 'section_brakes_steering',
      label: 'בלמים והיגוי'
    },
    {
      id: 'service_brake',
      type: 'radio',
      name: 'serviceBrake',
      label: 'בלם שירות',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'parking_brake',
      type: 'radio',
      name: 'parkingBrake',
      label: 'בלם חנייה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'steering_system',
      type: 'radio',
      name: 'steeringSystem',
      label: 'מערכת היגוי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'tires_wheels',
      type: 'radio',
      name: 'tiresWheels',
      label: 'צמיגים/גלגלים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'tire_condition_notes',
      type: 'text',
      name: 'tireConditionNotes',
      label: 'הערות לגבי צמיגים'
    },

    // ========== התקני בטיחות ==========
    {
      id: 'section_safety',
      type: 'section',
      name: 'section_safety',
      label: 'התקני בטיחות'
    },
    {
      id: 'horn',
      type: 'radio',
      name: 'horn',
      label: 'צופר',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'lights',
      type: 'radio',
      name: 'lights',
      label: 'תאורה (קדמית, אחורית)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'reverse_alarm',
      type: 'radio',
      name: 'reverseAlarm',
      label: 'אזעקת נסיעה לאחור',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'strobe_light',
      type: 'radio',
      name: 'strobeLight',
      label: 'אור מהבהב',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא מותקן' }
      ]
    },
    {
      id: 'seat_belt',
      type: 'radio',
      name: 'seatBelt',
      label: 'חגורת בטיחות',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'seat_switch',
      type: 'radio',
      name: 'seatSwitch',
      label: 'מתג מושב (Dead Man)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא מותקן' }
      ]
    },
    {
      id: 'mirrors',
      type: 'radio',
      name: 'mirrors',
      label: 'מראות',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== מערכת חשמל/דלק ==========
    {
      id: 'section_power',
      type: 'section',
      name: 'section_power',
      label: 'מערכת כוח'
    },
    {
      id: 'battery_condition',
      type: 'radio',
      name: 'batteryCondition',
      label: 'מצב מצבר/סוללה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'battery_connections',
      type: 'radio',
      name: 'batteryConnections',
      label: 'חיבורי מצבר',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'lpg_system',
      type: 'radio',
      name: 'lpgSystem',
      label: 'מערכת גפ"מ (אם רלוונטי)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'fuel_system',
      type: 'radio',
      name: 'fuelSystem',
      label: 'מערכת דלק (אם רלוונטי)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'exhaust_system',
      type: 'radio',
      name: 'exhaustSystem',
      label: 'מערכת פליטה',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },

    // ========== בדיקת הפעלה ==========
    {
      id: 'section_operation',
      type: 'section',
      name: 'section_operation',
      label: 'בדיקת הפעלה'
    },
    {
      id: 'lift_operation',
      type: 'radio',
      name: 'liftOperation',
      label: 'פעולת הרמה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'lower_operation',
      type: 'radio',
      name: 'lowerOperation',
      label: 'פעולת הורדה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'tilt_operation',
      type: 'radio',
      name: 'tiltOperation',
      label: 'פעולת הטיה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'travel_forward',
      type: 'radio',
      name: 'travelForward',
      label: 'נסיעה קדימה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'travel_reverse',
      type: 'radio',
      name: 'travelReverse',
      label: 'נסיעה אחורה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== תיעוד ==========
    {
      id: 'section_documentation',
      type: 'section',
      name: 'section_documentation',
      label: 'תיעוד ושילוט'
    },
    {
      id: 'capacity_plate',
      type: 'radio',
      name: 'capacityPlate',
      label: 'לוחית כושר הרמה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין וקריא ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'safety_stickers',
      type: 'radio',
      name: 'safetyStickers',
      label: 'מדבקות בטיחות',
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
      label: 'סטטוס סופי',
      validation: { required: true },
      options: [
        { value: 'approved', label: 'אושר לשימוש' },
        { value: 'approved_limited', label: 'אושר בהגבלות' },
        { value: 'requires_repair', label: 'דורש תיקון' },
        { value: 'rejected', label: 'נפסל - אסור לשימוש' }
      ]
    },
    {
      id: 'findings',
      type: 'textarea',
      name: 'findings',
      label: 'ממצאים',
      settings: { rows: 3 }
    },
    {
      id: 'recommendations',
      type: 'textarea',
      name: 'recommendations',
      label: 'המלצות',
      settings: { rows: 3 }
    },
    {
      id: 'photo_forklift',
      type: 'image',
      name: 'photoForklift',
      label: 'תמונת המלגזה'
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
// 🛗 Elevator Inspection - 6 Month Cycle
// בדיקת מעלית - מחזור 6 חודשים
// ============================================

export const ElevatorInspectionSchema: FormSchema = {
  id: 'elevator-inspection-6month',
  name: 'בדיקת מעלית - תקופתית',
  nameEn: 'Elevator Periodic Inspection',
  description: 'בדיקה תקופתית למעלית - מחזור 6 חודשים',
  version: '1.0.0',
  category: 'lifting',
  
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
      label: 'שם הבודק המוסמך',
      validation: { required: true }
    },
    {
      id: 'inspector_license',
      type: 'text',
      name: 'inspectorLicense',
      label: 'מספר רישיון',
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
      id: 'next_inspection',
      type: 'date',
      name: 'nextInspection',
      label: 'תאריך בדיקה הבאה',
      validation: { required: true }
    },

    // ========== פרטי המבנה ==========
    {
      id: 'section_building',
      type: 'section',
      name: 'section_building',
      label: 'פרטי המבנה'
    },
    {
      id: 'building_name',
      type: 'text',
      name: 'buildingName',
      label: 'שם המבנה',
      validation: { required: true }
    },
    {
      id: 'building_address',
      type: 'text',
      name: 'buildingAddress',
      label: 'כתובת',
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

    // ========== פרטי המעלית ==========
    {
      id: 'section_elevator',
      type: 'section',
      name: 'section_elevator',
      label: 'פרטי המעלית'
    },
    {
      id: 'elevator_id',
      type: 'text',
      name: 'elevatorId',
      label: 'מספר מעלית',
      validation: { required: true }
    },
    {
      id: 'elevator_type',
      type: 'select',
      name: 'elevatorType',
      label: 'סוג מעלית',
      validation: { required: true },
      options: [
        { value: 'passenger', label: 'נוסעים' },
        { value: 'freight', label: 'משא' },
        { value: 'service', label: 'שירות' },
        { value: 'panoramic', label: 'פנורמית' },
        { value: 'hospital', label: 'בית חולים' },
        { value: 'home', label: 'ביתית' },
        { value: 'dumbwaiter', label: 'מעלית מזון' }
      ]
    },
    {
      id: 'drive_type',
      type: 'select',
      name: 'driveType',
      label: 'סוג הנעה',
      validation: { required: true },
      options: [
        { value: 'traction', label: 'גרירה (Traction)' },
        { value: 'hydraulic', label: 'הידראולי' },
        { value: 'mrl', label: 'ללא חדר מכונות (MRL)' }
      ]
    },
    {
      id: 'manufacturer',
      type: 'text',
      name: 'manufacturer',
      label: 'יצרן',
      width: 'half'
    },
    {
      id: 'model',
      type: 'text',
      name: 'model',
      label: 'דגם',
      width: 'half'
    },
    {
      id: 'installation_year',
      type: 'number',
      name: 'installationYear',
      label: 'שנת התקנה',
      width: 'half'
    },
    {
      id: 'capacity_kg',
      type: 'number',
      name: 'capacityKg',
      label: 'כושר נשיאה (ק"ג)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'capacity_persons',
      type: 'number',
      name: 'capacityPersons',
      label: 'מספר נוסעים',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'num_floors',
      type: 'number',
      name: 'numFloors',
      label: 'מספר תחנות',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'speed',
      type: 'text',
      name: 'speed',
      label: 'מהירות (מ\'/שנ\')',
      width: 'half'
    },

    // ========== בדיקת חדר מכונות ==========
    {
      id: 'section_machine_room',
      type: 'section',
      name: 'section_machine_room',
      label: 'חדר מכונות'
    },
    {
      id: 'machine_room_access',
      type: 'radio',
      name: 'machineRoomAccess',
      label: 'גישה לחדר מכונות',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'אין חדר מכונות (MRL)' }
      ]
    },
    {
      id: 'machine_room_lighting',
      type: 'radio',
      name: 'machineRoomLighting',
      label: 'תאורה בחדר מכונות',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'motor_condition',
      type: 'radio',
      name: 'motorCondition',
      label: 'מצב מנוע',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'controller_condition',
      type: 'radio',
      name: 'controllerCondition',
      label: 'בקר/לוח בקרה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'governor',
      type: 'radio',
      name: 'governor',
      label: 'מגביל מהירות (Governor)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'brake_condition',
      type: 'radio',
      name: 'brakeCondition',
      label: 'בלם',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בדיקת פיר ==========
    {
      id: 'section_shaft',
      type: 'section',
      name: 'section_shaft',
      label: 'בדיקת פיר'
    },
    {
      id: 'guide_rails',
      type: 'radio',
      name: 'guideRails',
      label: 'מסילות הנחיה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'ropes_chains',
      type: 'radio',
      name: 'ropesChains',
      label: 'כבלים/שרשראות',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'counterweight',
      type: 'radio',
      name: 'counterweight',
      label: 'משקל נגדי',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'buffers',
      type: 'radio',
      name: 'buffers',
      label: 'בולמי זעזועים (Buffers)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'pit_condition',
      type: 'radio',
      name: 'pitCondition',
      label: 'מצב בור',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ונקי ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'pit_lighting',
      type: 'radio',
      name: 'pitLighting',
      label: 'תאורת בור',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בדיקת תא ==========
    {
      id: 'section_car',
      type: 'section',
      name: 'section_car',
      label: 'בדיקת תא'
    },
    {
      id: 'car_condition',
      type: 'radio',
      name: 'carCondition',
      label: 'מצב כללי של התא',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'car_door',
      type: 'radio',
      name: 'carDoor',
      label: 'דלת תא',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'door_safety_edge',
      type: 'radio',
      name: 'doorSafetyEdge',
      label: 'בטיחות דלת (פוטוסל/Safety Edge)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'car_lighting',
      type: 'radio',
      name: 'carLighting',
      label: 'תאורת תא',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'emergency_lighting',
      type: 'radio',
      name: 'emergencyLighting',
      label: 'תאורת חירום',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'ventilation',
      type: 'radio',
      name: 'ventilation',
      label: 'אוורור',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'floor_indicator',
      type: 'radio',
      name: 'floorIndicator',
      label: 'מחוון קומות',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'control_panel',
      type: 'radio',
      name: 'controlPanel',
      label: 'לוח כפתורים בתא',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בטיחות ==========
    {
      id: 'section_safety',
      type: 'section',
      name: 'section_safety',
      label: 'התקני בטיחות'
    },
    {
      id: 'safety_gear',
      type: 'radio',
      name: 'safetyGear',
      label: 'מערכת בטיחות (Safety Gear)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'interlock_doors',
      type: 'radio',
      name: 'interlockDoors',
      label: 'נעילת דלתות קומה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'overload_device',
      type: 'radio',
      name: 'overloadDevice',
      label: 'התקן עומס יתר',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'emergency_alarm',
      type: 'radio',
      name: 'emergencyAlarm',
      label: 'כפתור אזעקה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'intercom',
      type: 'radio',
      name: 'intercom',
      label: 'אינטרקום/טלפון חירום',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'fire_service',
      type: 'radio',
      name: 'fireService',
      label: 'מצב כבאות (Fire Service)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא מותקן' }
      ]
    },

    // ========== דלתות קומה ==========
    {
      id: 'section_landing_doors',
      type: 'section',
      name: 'section_landing_doors',
      label: 'דלתות קומה'
    },
    {
      id: 'landing_doors_condition',
      type: 'radio',
      name: 'landingDoorsCondition',
      label: 'מצב כללי דלתות קומה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'door_gap',
      type: 'radio',
      name: 'doorGap',
      label: 'מרווח דלת (עד 6 מ"מ)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'leveling',
      type: 'radio',
      name: 'leveling',
      label: 'פילוס (Leveling)',
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
      label: 'סטטוס סופי',
      validation: { required: true },
      options: [
        { value: 'approved', label: 'אושר לשימוש' },
        { value: 'approved_limited', label: 'אושר בהגבלות' },
        { value: 'requires_repair', label: 'דורש תיקון' },
        { value: 'rejected', label: 'נפסל - אסור לשימוש' }
      ]
    },
    {
      id: 'findings',
      type: 'textarea',
      name: 'findings',
      label: 'ממצאים',
      settings: { rows: 3 }
    },
    {
      id: 'recommendations',
      type: 'textarea',
      name: 'recommendations',
      label: 'המלצות',
      settings: { rows: 3 }
    },
    {
      id: 'certificate_number',
      type: 'text',
      name: 'certificateNumber',
      label: 'מספר תעודה'
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
// 📋 Export All Lifting Templates
// ============================================

export const LiftingInspectionTemplates = {
  crane: CraneInspectionSchema,
  forklift: ForkliftInspectionSchema,
  elevator: ElevatorInspectionSchema,
};

export default LiftingInspectionTemplates;
