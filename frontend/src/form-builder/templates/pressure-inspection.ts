/**
 * AEGIS Pressure Equipment Inspection Templates
 * תבניות ביקורת ציוד לחץ
 * 
 * Based on:
 * - פקודת הבטיחות בעבודה [נוסח חדש], התש"ל-1970 - סעיפים 31-33
 * - תקנות הבטיחות בעבודה (בודקים מוסמכים), התשנ"ה-1995
 * - תקנות הבטיחות בעבודה (דודי קיטור), התש"ה-1945
 */

import { FormSchema } from '../types/form.types';

// ============================================
// 🔥 Steam Boiler Inspection - 14 Month Cycle
// בדיקת דוד קיטור - מחזור 14 חודשים
// ============================================

export const SteamBoilerInspectionSchema: FormSchema = {
  id: 'steam-boiler-inspection-14month',
  name: 'בדיקת דוד קיטור - תקופתית',
  nameEn: 'Steam Boiler Periodic Inspection',
  description: 'בדיקה תקופתית לדוד קיטור לפי פקודת הבטיחות בעבודה סעיף 31 - מחזור 14 חודשים (בדיקה קרה + חמה)',
  version: '1.0.0',
  category: 'pressure',
  
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
      id: 'inspection_type',
      type: 'select',
      name: 'inspectionType',
      label: 'סוג בדיקה',
      validation: { required: true },
      options: [
        { value: 'cold', label: 'בדיקה קרה (פנימית)' },
        { value: 'hot', label: 'בדיקה חמה (תפעולית)' },
        { value: 'both', label: 'בדיקה קרה + חמה' },
        { value: 'hydrostatic', label: 'בדיקה הידרוסטטית' }
      ]
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
      label: 'תאריך בדיקה הבאה',
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
    {
      id: 'boiler_operator',
      type: 'text',
      name: 'boilerOperator',
      label: 'שם המפעיל/מסיק',
      width: 'half'
    },
    {
      id: 'operator_license',
      type: 'text',
      name: 'operatorLicense',
      label: 'מספר רישיון מסיק',
      width: 'half'
    },

    // ========== פרטי הדוד ==========
    {
      id: 'section_boiler',
      type: 'section',
      name: 'section_boiler',
      label: 'פרטי דוד הקיטור'
    },
    {
      id: 'boiler_type',
      type: 'select',
      name: 'boilerType',
      label: 'סוג הדוד',
      validation: { required: true },
      options: [
        { value: 'fire_tube', label: 'דוד צינורות אש (Fire Tube)' },
        { value: 'water_tube', label: 'דוד צינורות מים (Water Tube)' },
        { value: 'electric', label: 'דוד חשמלי' },
        { value: 'cast_iron', label: 'דוד יציקה (Cast Iron)' },
        { value: 'coil', label: 'דוד סליל (Coil)' },
        { value: 'other', label: 'אחר' }
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
      id: 'registration_number',
      type: 'text',
      name: 'registrationNumber',
      label: 'מספר רישום (משרד העבודה)',
      validation: { required: true },
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
      id: 'installation_year',
      type: 'number',
      name: 'installationYear',
      label: 'שנת התקנה',
      width: 'half'
    },
    {
      id: 'heating_surface',
      type: 'text',
      name: 'heatingSurface',
      label: 'שטח חימום (מ"ר)',
      width: 'half'
    },
    {
      id: 'capacity',
      type: 'text',
      name: 'capacity',
      label: 'תפוקת קיטור (ק"ג/שעה)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'design_pressure',
      type: 'text',
      name: 'designPressure',
      label: 'לחץ תכנון (bar)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'working_pressure',
      type: 'text',
      name: 'workingPressure',
      label: 'לחץ עבודה מותר (bar)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'fuel_type',
      type: 'select',
      name: 'fuelType',
      label: 'סוג דלק',
      options: [
        { value: 'natural_gas', label: 'גז טבעי' },
        { value: 'lpg', label: 'גפ"מ' },
        { value: 'diesel', label: 'סולר' },
        { value: 'heavy_oil', label: 'מזוט' },
        { value: 'electric', label: 'חשמל' },
        { value: 'other', label: 'אחר' }
      ]
    },
    {
      id: 'last_hydrostatic_test',
      type: 'date',
      name: 'lastHydrostaticTest',
      label: 'תאריך בדיקה הידרוסטטית אחרונה'
    },

    // ========== בדיקה קרה (פנימית) ==========
    {
      id: 'section_cold_inspection',
      type: 'section',
      name: 'section_cold_inspection',
      label: 'בדיקה קרה (פנימית)'
    },
    {
      id: 'cold_inspection_performed',
      type: 'checkbox',
      name: 'coldInspectionPerformed',
      label: 'בוצעה בדיקה קרה'
    },
    {
      id: 'shell_condition',
      type: 'radio',
      name: 'shellCondition',
      label: 'מצב מעטפת (Shell)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'tubes_condition',
      type: 'radio',
      name: 'tubesCondition',
      label: 'מצב צינורות',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'tube_sheet_condition',
      type: 'radio',
      name: 'tubeSheetCondition',
      label: 'מצב לוח צינורות (Tube Sheet)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'furnace_condition',
      type: 'radio',
      name: 'furnaceCondition',
      label: 'מצב תנור/תא שריפה',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'refractory_condition',
      type: 'radio',
      name: 'refractoryCondition',
      label: 'מצב בטון עמיד אש',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'corrosion_internal',
      type: 'radio',
      name: 'corrosionInternal',
      label: 'קורוזיה פנימית',
      options: [
        { value: 'pass', label: 'תקין - אין קורוזיה משמעותית ✓' },
        { value: 'fail', label: 'לא תקין - יש קורוזיה ✗' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'scale_deposits',
      type: 'radio',
      name: 'scaleDeposits',
      label: 'משקעים/אבנית',
      options: [
        { value: 'pass', label: 'תקין - נקי ✓' },
        { value: 'fail', label: 'לא תקין - יש משקעים ✗' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'welds_condition',
      type: 'radio',
      name: 'weldsCondition',
      label: 'מצב ריתוכים',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'manhole_condition',
      type: 'radio',
      name: 'manholeCondition',
      label: 'מצב פתחי ביקורת (Manhole)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ],
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'thickness_measurement',
      type: 'checkbox',
      name: 'thicknessMeasurement',
      label: 'בוצעה מדידת עובי',
      condition: {
        field: 'coldInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'min_thickness_found',
      type: 'text',
      name: 'minThicknessFound',
      label: 'עובי מינימלי שנמדד (מ"מ)',
      condition: {
        field: 'thicknessMeasurement',
        operator: 'equals',
        value: true
      }
    },

    // ========== בדיקה חמה (תפעולית) ==========
    {
      id: 'section_hot_inspection',
      type: 'section',
      name: 'section_hot_inspection',
      label: 'בדיקה חמה (תפעולית)'
    },
    {
      id: 'hot_inspection_performed',
      type: 'checkbox',
      name: 'hotInspectionPerformed',
      label: 'בוצעה בדיקה חמה'
    },
    {
      id: 'operating_pressure',
      type: 'text',
      name: 'operatingPressure',
      label: 'לחץ עבודה בזמן הבדיקה (bar)',
      condition: {
        field: 'hotInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'water_level_indicator',
      type: 'radio',
      name: 'waterLevelIndicator',
      label: 'מחוון מפלס מים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'water_level_glass',
      type: 'radio',
      name: 'waterLevelGlass',
      label: 'זכוכית מפלס',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ונקי ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'pressure_gauge',
      type: 'radio',
      name: 'pressureGauge',
      label: 'מד לחץ',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ומכויל ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'pressure_gauge_calibration',
      type: 'date',
      name: 'pressureGaugeCalibration',
      label: 'תאריך כיול מד לחץ'
    },
    {
      id: 'safety_valve_1',
      type: 'radio',
      name: 'safetyValve1',
      label: 'שסתום בטיחות ראשי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'safety_valve_1_setting',
      type: 'text',
      name: 'safetyValve1Setting',
      label: 'לחץ כיוון שסתום ראשי (bar)'
    },
    {
      id: 'safety_valve_2',
      type: 'radio',
      name: 'safetyValve2',
      label: 'שסתום בטיחות משני (אם קיים)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא קיים' }
      ]
    },
    {
      id: 'safety_valve_test',
      type: 'checkbox',
      name: 'safetyValveTest',
      label: 'בוצעה בדיקת שסתום בטיחות'
    },
    {
      id: 'low_water_cutoff',
      type: 'radio',
      name: 'lowWaterCutoff',
      label: 'מפסק מפלס נמוך (Low Water Cutoff)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'low_water_cutoff_test',
      type: 'checkbox',
      name: 'lowWaterCutoffTest',
      label: 'בוצעה בדיקת מפסק מפלס נמוך'
    },
    {
      id: 'high_pressure_cutoff',
      type: 'radio',
      name: 'highPressureCutoff',
      label: 'מפסק לחץ גבוה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'feed_water_system',
      type: 'radio',
      name: 'feedWaterSystem',
      label: 'מערכת הזנת מים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'blowdown_valve',
      type: 'radio',
      name: 'blowdownValve',
      label: 'שסתום ניקוז (Blowdown)',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== מערכת בערה ==========
    {
      id: 'section_combustion',
      type: 'section',
      name: 'section_combustion',
      label: 'מערכת בערה'
    },
    {
      id: 'burner_condition',
      type: 'radio',
      name: 'burnerCondition',
      label: 'מצב מבער',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'flame_detector',
      type: 'radio',
      name: 'flameDetector',
      label: 'גלאי להבה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'fuel_shutoff',
      type: 'radio',
      name: 'fuelShutoff',
      label: 'שסתום ניתוק דלק',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'gas_train',
      type: 'radio',
      name: 'gasTrain',
      label: 'רכבת גז (Gas Train)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא רלוונטי' }
      ]
    },
    {
      id: 'combustion_air',
      type: 'radio',
      name: 'combustionAir',
      label: 'אספקת אוויר לבערה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'stack_condition',
      type: 'radio',
      name: 'stackCondition',
      label: 'מצב ארובה',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== מערכת חשמל ובקרה ==========
    {
      id: 'section_electrical',
      type: 'section',
      name: 'section_electrical',
      label: 'מערכת חשמל ובקרה'
    },
    {
      id: 'control_panel',
      type: 'radio',
      name: 'controlPanel',
      label: 'לוח בקרה',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'wiring_condition',
      type: 'radio',
      name: 'wiringCondition',
      label: 'מצב חיווט',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'emergency_shutoff',
      type: 'radio',
      name: 'emergencyShutoff',
      label: 'מפסק חירום',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'alarms_indicators',
      type: 'radio',
      name: 'alarmsIndicators',
      label: 'התראות ומחוונים',
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
      id: 'nameplate',
      type: 'radio',
      name: 'nameplate',
      label: 'לוחית זיהוי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'קיימת וקריאה ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'operating_instructions',
      type: 'radio',
      name: 'operatingInstructions',
      label: 'הוראות הפעלה',
      options: [
        { value: 'pass', label: 'קיימות ✓' },
        { value: 'fail', label: 'לא קיימות ✗' }
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
    {
      id: 'water_treatment_log',
      type: 'radio',
      name: 'waterTreatmentLog',
      label: 'יומן טיפול מים',
      options: [
        { value: 'pass', label: 'קיים ומעודכן ✓' },
        { value: 'fail', label: 'לא קיים/לא מעודכן ✗' }
      ]
    },
    {
      id: 'previous_certificate',
      type: 'radio',
      name: 'previousCertificate',
      label: 'תעודת בדיקה קודמת',
      options: [
        { value: 'pass', label: 'קיימת ✓' },
        { value: 'fail', label: 'לא קיימת ✗' }
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
        { value: 'rejected', label: 'נפסל - אסור לשימוש' },
        { value: 'hydrostatic_required', label: 'דרושה בדיקה הידרוסטטית' }
      ]
    },
    {
      id: 'approved_pressure',
      type: 'text',
      name: 'approvedPressure',
      label: 'לחץ עבודה מאושר (bar)',
      validation: { required: true }
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
      id: 'certificate_number',
      type: 'text',
      name: 'certificateNumber',
      label: 'מספר תעודה',
      validation: { required: true }
    },
    {
      id: 'photo_boiler',
      type: 'image',
      name: 'photoBoiler',
      label: 'תמונת הדוד'
    },
    {
      id: 'photo_nameplate',
      type: 'image',
      name: 'photoNameplate',
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
// 🫙 Pressure Vessel / Air Receiver Inspection
// בדיקת מכל לחץ / קולט אוויר - מחזור 26 חודשים
// ============================================

export const PressureVesselInspectionSchema: FormSchema = {
  id: 'pressure-vessel-inspection-26month',
  name: 'בדיקת מכל לחץ / קולט אוויר',
  nameEn: 'Pressure Vessel / Air Receiver Inspection',
  description: 'בדיקה תקופתית למכל לחץ לפי פקודת הבטיחות בעבודה סעיף 32 - מחזור 26 חודשים',
  version: '1.0.0',
  category: 'pressure',
  
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
      id: 'inspection_type',
      type: 'select',
      name: 'inspectionType',
      label: 'סוג בדיקה',
      validation: { required: true },
      options: [
        { value: 'periodic', label: 'בדיקה תקופתית (26 חודשים)' },
        { value: 'hydrostatic', label: 'בדיקה הידרוסטטית' },
        { value: 'initial', label: 'בדיקה ראשונית' }
      ]
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
      id: 'inspection_company',
      type: 'text',
      name: 'inspectionCompany',
      label: 'חברת הבדיקה'
    },
    {
      id: 'next_inspection_date',
      type: 'date',
      name: 'nextInspectionDate',
      label: 'תאריך בדיקה הבאה',
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

    // ========== פרטי המכל ==========
    {
      id: 'section_vessel',
      type: 'section',
      name: 'section_vessel',
      label: 'פרטי מכל הלחץ'
    },
    {
      id: 'vessel_type',
      type: 'select',
      name: 'vesselType',
      label: 'סוג המכל',
      validation: { required: true },
      options: [
        { value: 'air_receiver', label: 'קולט אוויר (Air Receiver)' },
        { value: 'compressed_air_tank', label: 'מיכל אוויר דחוס' },
        { value: 'nitrogen_tank', label: 'מיכל חנקן' },
        { value: 'lpg_tank', label: 'מיכל גפ"מ' },
        { value: 'pressure_vessel', label: 'מכל לחץ כללי' },
        { value: 'heat_exchanger', label: 'מחליף חום' },
        { value: 'autoclave', label: 'אוטוקלב' },
        { value: 'other', label: 'אחר' }
      ]
    },
    {
      id: 'contents',
      type: 'select',
      name: 'contents',
      label: 'תכולה',
      validation: { required: true },
      options: [
        { value: 'air', label: 'אוויר' },
        { value: 'nitrogen', label: 'חנקן' },
        { value: 'oxygen', label: 'חמצן' },
        { value: 'lpg', label: 'גפ"מ' },
        { value: 'steam', label: 'קיטור' },
        { value: 'water', label: 'מים' },
        { value: 'oil', label: 'שמן' },
        { value: 'other', label: 'אחר' }
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
      id: 'serial_number',
      type: 'text',
      name: 'serialNumber',
      label: 'מספר סידורי',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'registration_number',
      type: 'text',
      name: 'registrationNumber',
      label: 'מספר רישום',
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
      id: 'volume',
      type: 'text',
      name: 'volume',
      label: 'נפח (ליטר)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'design_pressure',
      type: 'text',
      name: 'designPressure',
      label: 'לחץ תכנון (bar)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'working_pressure',
      type: 'text',
      name: 'workingPressure',
      label: 'לחץ עבודה מותר (bar)',
      validation: { required: true },
      width: 'half'
    },
    {
      id: 'test_pressure',
      type: 'text',
      name: 'testPressure',
      label: 'לחץ ניסוי (bar)',
      width: 'half'
    },
    {
      id: 'material',
      type: 'text',
      name: 'material',
      label: 'חומר המכל',
      width: 'half'
    },
    {
      id: 'orientation',
      type: 'select',
      name: 'orientation',
      label: 'מיקום',
      options: [
        { value: 'vertical', label: 'אנכי' },
        { value: 'horizontal', label: 'אופקי' }
      ]
    },
    {
      id: 'last_hydrostatic_test',
      type: 'date',
      name: 'lastHydrostaticTest',
      label: 'תאריך בדיקה הידרוסטטית אחרונה'
    },
    {
      id: 'next_hydrostatic_test',
      type: 'date',
      name: 'nextHydrostaticTest',
      label: 'תאריך בדיקה הידרוסטטית הבאה',
      helpText: 'עד גיל 9 - כל 9 שנים, 9-18 - כל 6 שנים, מעל 18 - כל 3 שנים'
    },

    // ========== בדיקה חיצונית ==========
    {
      id: 'section_external',
      type: 'section',
      name: 'section_external',
      label: 'בדיקה חיצונית'
    },
    {
      id: 'external_condition',
      type: 'radio',
      name: 'externalCondition',
      label: 'מצב חיצוני כללי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'corrosion_external',
      type: 'radio',
      name: 'corrosionExternal',
      label: 'קורוזיה חיצונית',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין - אין קורוזיה משמעותית ✓' },
        { value: 'fail', label: 'לא תקין - יש קורוזיה ✗' }
      ]
    },
    {
      id: 'paint_condition',
      type: 'radio',
      name: 'paintCondition',
      label: 'מצב צבע/ציפוי',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'welds_external',
      type: 'radio',
      name: 'weldsExternal',
      label: 'ריתוכים חיצוניים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'supports_foundation',
      type: 'radio',
      name: 'supportsFoundation',
      label: 'תמיכות/יסודות',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'insulation_condition',
      type: 'radio',
      name: 'insulationCondition',
      label: 'מצב בידוד (אם קיים)',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'אין בידוד' }
      ]
    },
    {
      id: 'nozzles_connections',
      type: 'radio',
      name: 'nozzlesConnections',
      label: 'פתחים וחיבורים',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },

    // ========== בדיקה פנימית ==========
    {
      id: 'section_internal',
      type: 'section',
      name: 'section_internal',
      label: 'בדיקה פנימית (אם בוצעה)'
    },
    {
      id: 'internal_inspection_performed',
      type: 'checkbox',
      name: 'internalInspectionPerformed',
      label: 'בוצעה בדיקה פנימית'
    },
    {
      id: 'internal_condition',
      type: 'radio',
      name: 'internalCondition',
      label: 'מצב פנימי כללי',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ],
      condition: {
        field: 'internalInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'corrosion_internal',
      type: 'radio',
      name: 'corrosionInternal',
      label: 'קורוזיה פנימית',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ],
      condition: {
        field: 'internalInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'deposits',
      type: 'radio',
      name: 'deposits',
      label: 'משקעים/לכלוך',
      options: [
        { value: 'pass', label: 'נקי ✓' },
        { value: 'fail', label: 'יש משקעים ✗' }
      ],
      condition: {
        field: 'internalInspectionPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'thickness_measurement',
      type: 'checkbox',
      name: 'thicknessMeasurement',
      label: 'בוצעה מדידת עובי'
    },
    {
      id: 'min_thickness',
      type: 'text',
      name: 'minThickness',
      label: 'עובי מינימלי שנמדד (מ"מ)',
      condition: {
        field: 'thicknessMeasurement',
        operator: 'equals',
        value: true
      }
    },

    // ========== אביזרי בטיחות ==========
    {
      id: 'section_safety',
      type: 'section',
      name: 'section_safety',
      label: 'אביזרי בטיחות'
    },
    {
      id: 'safety_valve',
      type: 'radio',
      name: 'safetyValve',
      label: 'שסתום בטיחות',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'safety_valve_setting',
      type: 'text',
      name: 'safetyValveSetting',
      label: 'לחץ כיוון שסתום (bar)'
    },
    {
      id: 'safety_valve_test',
      type: 'checkbox',
      name: 'safetyValveTest',
      label: 'בוצעה בדיקת שסתום בטיחות'
    },
    {
      id: 'pressure_gauge',
      type: 'radio',
      name: 'pressureGauge',
      label: 'מד לחץ',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'pressure_gauge_range',
      type: 'text',
      name: 'pressureGaugeRange',
      label: 'טווח מד לחץ (bar)'
    },
    {
      id: 'drain_valve',
      type: 'radio',
      name: 'drainValve',
      label: 'שסתום ניקוז',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'isolation_valve',
      type: 'radio',
      name: 'isolationValve',
      label: 'שסתום בידוד',
      options: [
        { value: 'pass', label: 'תקין ✓' },
        { value: 'fail', label: 'לא תקין ✗' },
        { value: 'na', label: 'לא קיים' }
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
      id: 'nameplate',
      type: 'radio',
      name: 'nameplate',
      label: 'לוחית זיהוי',
      validation: { required: true },
      options: [
        { value: 'pass', label: 'קיימת וקריאה ✓' },
        { value: 'fail', label: 'לא תקין ✗' }
      ]
    },
    {
      id: 'ce_marking',
      type: 'radio',
      name: 'ceMarking',
      label: 'סימון CE/תקן',
      options: [
        { value: 'pass', label: 'קיים ✓' },
        { value: 'fail', label: 'לא קיים ✗' }
      ]
    },
    {
      id: 'previous_certificate',
      type: 'radio',
      name: 'previousCertificate',
      label: 'תעודת בדיקה קודמת',
      options: [
        { value: 'pass', label: 'קיימת ✓' },
        { value: 'fail', label: 'לא קיימת ✗' }
      ]
    },

    // ========== בדיקה הידרוסטטית ==========
    {
      id: 'section_hydrostatic',
      type: 'section',
      name: 'section_hydrostatic',
      label: 'בדיקה הידרוסטטית (אם בוצעה)'
    },
    {
      id: 'hydrostatic_performed',
      type: 'checkbox',
      name: 'hydrostaticPerformed',
      label: 'בוצעה בדיקה הידרוסטטית'
    },
    {
      id: 'hydrostatic_pressure',
      type: 'text',
      name: 'hydrostaticPressure',
      label: 'לחץ בדיקה (bar)',
      condition: {
        field: 'hydrostaticPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'hydrostatic_duration',
      type: 'text',
      name: 'hydrostaticDuration',
      label: 'משך הבדיקה (דקות)',
      condition: {
        field: 'hydrostaticPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'hydrostatic_result',
      type: 'radio',
      name: 'hydrostaticResult',
      label: 'תוצאת בדיקה הידרוסטטית',
      options: [
        { value: 'pass', label: 'עבר ✓' },
        { value: 'fail', label: 'נכשל ✗' }
      ],
      condition: {
        field: 'hydrostaticPerformed',
        operator: 'equals',
        value: true
      }
    },
    {
      id: 'leaks_deformation',
      type: 'radio',
      name: 'leaksDeformation',
      label: 'נזילות/עיוותים',
      options: [
        { value: 'pass', label: 'לא נמצאו ✓' },
        { value: 'fail', label: 'נמצאו ✗' }
      ],
      condition: {
        field: 'hydrostaticPerformed',
        operator: 'equals',
        value: true
      }
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
        { value: 'rejected', label: 'נפסל - אסור לשימוש' },
        { value: 'hydrostatic_required', label: 'דרושה בדיקה הידרוסטטית' }
      ]
    },
    {
      id: 'approved_pressure',
      type: 'text',
      name: 'approvedPressure',
      label: 'לחץ עבודה מאושר (bar)',
      validation: { required: true }
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
      label: 'מספר תעודה',
      validation: { required: true }
    },
    {
      id: 'photo_vessel',
      type: 'image',
      name: 'photoVessel',
      label: 'תמונת המכל'
    },
    {
      id: 'photo_nameplate',
      type: 'image',
      name: 'photoNameplate',
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
// 📋 Export All Pressure Templates
// ============================================

export const PressureInspectionTemplates = {
  steamBoiler: SteamBoilerInspectionSchema,
  pressureVessel: PressureVesselInspectionSchema,
};

export default PressureInspectionTemplates;
