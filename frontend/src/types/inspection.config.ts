/**
 * AEGIS Safety Management Platform
 * Inspection Frequency Configurations
 * 
 * מיפוי תדירויות בדיקה לפי חקיקה ישראלית
 * Based on Israeli safety regulations and standards
 */

import {
  SafetyDomain,
  FrequencyType,
  RiskLevel,
  InspectorType,
  LegalSourceType,
  LaserEquipmentType,
  FireEquipmentType,
  ElectricalEquipmentType,
  LiftingEquipmentType,
  PressureEquipmentType,
  HeightsEquipmentType,
  PPEType,
  ChemicalEquipmentType,
  EmergencyEquipmentType
} from './safety.enums';

import { InspectionRequirement } from './safety.types';

// ============================================
// 🔴 Laser Safety Inspection Requirements
// ============================================

export const LaserInspectionRequirements: Record<string, InspectionRequirement[]> = {
  [LaserEquipmentType.LASER_DEVICE]: [
    {
      id: 'laser_quarterly',
      name: 'ביקורת רבעונית',
      nameEn: 'Quarterly Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות גיהות תעסוקתית ובטיחות העוסקים בקרינת לייזר',
        reference: 'התשס"ה-2005',
        url: 'https://www.nevo.co.il/law_html/law00/74793.htm'
      },
      frequency: {
        type: FrequencyType.QUARTERLY,
        intervalMonths: 3
      },
      inspectorType: InspectorType.CERTIFIED,
      certificationRequired: 'ממונה בטיחות לייזר',
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 7,
      inspectionType: 'functional'
    },
    {
      id: 'laser_annual',
      name: 'ביקורת שנתית מקיפה',
      nameEn: 'Comprehensive Annual Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות גיהות תעסוקתית ובטיחות העוסקים בקרינת לייזר',
        reference: 'התשס"ה-2005'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      certificationRequired: 'ממונה בטיחות לייזר',
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 7,
      inspectionType: 'full'
    }
  ],
  [LaserEquipmentType.SAFETY_GOGGLES]: [
    {
      id: 'laser_goggles_annual',
      name: 'בדיקת משקפי לייזר',
      nameEn: 'Laser Goggles Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 60825',
        reference: 'תקן לייזרים'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'visual'
    }
  ],
  [LaserEquipmentType.POWER_METER]: [
    {
      id: 'power_meter_calibration',
      name: 'כיול מד עוצמה',
      nameEn: 'Power Meter Calibration',
      source: {
        type: LegalSourceType.MANUFACTURER,
        name: 'הנחיות יצרן'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.MANUFACTURER,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'calibration'
    }
  ]
};

// ============================================
// 🔥 Fire Safety Inspection Requirements
// ============================================

export const FireInspectionRequirements: Record<string, InspectionRequirement[]> = {
  // מטפים
  [FireEquipmentType.FIRE_EXTINGUISHER_POWDER]: [
    {
      id: 'extinguisher_monthly',
      name: 'בדיקה חזותית חודשית',
      nameEn: 'Monthly Visual Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 129 חלק 1',
        reference: 'תקן מטפים'
      },
      frequency: {
        type: FrequencyType.MONTHLY,
        intervalMonths: 1
      },
      inspectorType: InspectorType.SELF,
      formRequired: false,
      reportToAuthority: false,
      retentionYears: 1,
      inspectionType: 'visual'
    },
    {
      id: 'extinguisher_annual',
      name: 'בדיקה שנתית',
      nameEn: 'Annual Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 129 חלק 1',
        reference: 'תקן מטפים'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      certificationRequired: 'טכנאי מטפים מוסמך',
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional'
    },
    {
      id: 'extinguisher_hydrostatic',
      name: 'בדיקה הידרוסטטית',
      nameEn: 'Hydrostatic Test',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 129 חלק 1',
        reference: 'תקן מטפים'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 60  // 5 years
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 10,
      inspectionType: 'hydrostatic'
    }
  ],
  
  // גלגלון כיבוי
  [FireEquipmentType.FIRE_HOSE_REEL]: [
    {
      id: 'hose_reel_annual',
      name: 'בדיקת גלגלון שנתית',
      nameEn: 'Annual Hose Reel Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 2206 חלק 2',
        reference: 'תקן גלגלונים'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional'
    }
  ],
  
  // ספרינקלרים
  [FireEquipmentType.SPRINKLER]: [
    {
      id: 'sprinkler_annual',
      name: 'בדיקת ספרינקלרים שנתית',
      nameEn: 'Annual Sprinkler Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 1928',
        reference: 'NFPA 25'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      conditions: [
        {
          type: 'risk_level',
          riskLevel: RiskLevel.HIGH,
          newFrequency: {
            type: FrequencyType.SEMI_ANNUAL,
            intervalMonths: 6
          }
        }
      ],
      inspectorType: InspectorType.CERTIFIED,
      certificationRequired: 'בודק מערכות כיבוי מוסמך',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'רשות הכבאות',
      retentionYears: 10,
      inspectionType: 'full'
    }
  ],
  
  // גלאי עשן
  [FireEquipmentType.SMOKE_DETECTOR]: [
    {
      id: 'smoke_detector_annual',
      name: 'בדיקת גלאי עשן',
      nameEn: 'Smoke Detector Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 1220 חלק 3',
        reference: 'תקן גלאי עשן'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional'
    }
  ],
  
  // רכזת גילוי אש
  [FireEquipmentType.FIRE_ALARM_PANEL]: [
    {
      id: 'fire_panel_annual',
      name: 'בדיקת רכזת גילוי אש',
      nameEn: 'Fire Alarm Panel Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 1220 חלק 11',
        reference: 'תקן רכזות'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'רשות הכבאות',
      retentionYears: 10,
      inspectionType: 'functional'
    }
  ],
  
  // דלת אש
  [FireEquipmentType.FIRE_DOOR]: [
    {
      id: 'fire_door_annual',
      name: 'בדיקת דלת אש',
      nameEn: 'Fire Door Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'הוראות נציב כבאות'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional'
    }
  ],
  
  // תאורת חירום
  [FireEquipmentType.EMERGENCY_LIGHT]: [
    {
      id: 'emergency_light_annual',
      name: 'בדיקת תאורת חירום',
      nameEn: 'Emergency Light Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 20',
        reference: 'תקן תאורת חירום'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional'
    }
  ],
  
  // משאבת כיבוי
  [FireEquipmentType.FIRE_PUMP]: [
    {
      id: 'fire_pump_annual',
      name: 'בדיקת משאבת כיבוי',
      nameEn: 'Fire Pump Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 1596',
        reference: 'NFPA 25'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'רשות הכבאות',
      retentionYears: 10,
      inspectionType: 'full'
    }
  ],
  
  // מערכת שליטה בעשן
  [FireEquipmentType.SMOKE_EXHAUST]: [
    {
      id: 'smoke_control_annual',
      name: 'בדיקת מערכת שליטה בעשן',
      nameEn: 'Smoke Control System Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ת"י 1001',
        reference: 'תקן שליטה בעשן'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'רשות הכבאות',
      retentionYears: 10,
      inspectionType: 'full'
    }
  ]
};

// ============================================
// ⚡ Electrical Safety Inspection Requirements
// ============================================

export const ElectricalInspectionRequirements: Record<string, InspectionRequirement[]> = {
  [ElectricalEquipmentType.MAIN_PANEL]: [
    {
      id: 'electrical_panel_annual',
      name: 'בדיקת לוח חשמל',
      nameEn: 'Electrical Panel Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות הבטיחות בעבודה (חשמל)',
        reference: 'התש"ן-1990'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      certificationRequired: 'חשמלאי מוסמך',
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 7,
      inspectionType: 'full'
    },
    {
      id: 'thermography_annual',
      name: 'בדיקה תרמוגרפית',
      nameEn: 'Thermographic Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'מומלץ'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional'
    }
  ],
  
  [ElectricalEquipmentType.GROUNDING_SYSTEM]: [
    {
      id: 'grounding_annual',
      name: 'בדיקת הארקה',
      nameEn: 'Grounding System Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות החשמל',
        reference: 'חוק החשמל'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      certificationRequired: 'בודק חשמל מוסמך',
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 7,
      inspectionType: 'functional'
    }
  ],
  
  [ElectricalEquipmentType.RCD]: [
    {
      id: 'rcd_monthly',
      name: 'בדיקת מפסק פחת - עצמית',
      nameEn: 'RCD Self-Test',
      source: {
        type: LegalSourceType.MANUFACTURER,
        name: 'הנחיות יצרן'
      },
      frequency: {
        type: FrequencyType.MONTHLY,
        intervalMonths: 1
      },
      inspectorType: InspectorType.SELF,
      formRequired: false,
      reportToAuthority: false,
      retentionYears: 1,
      inspectionType: 'functional'
    },
    {
      id: 'rcd_annual',
      name: 'בדיקת מפסק פחת - מלאה',
      nameEn: 'RCD Full Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות החשמל'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional'
    }
  ],
  
  [ElectricalEquipmentType.GENERATOR]: [
    {
      id: 'generator_annual',
      name: 'בדיקת גנרטור',
      nameEn: 'Generator Inspection',
      source: {
        type: LegalSourceType.MANUFACTURER,
        name: 'הנחיות יצרן'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'full'
    }
  ]
};

// ============================================
// 🏗️ Lifting Equipment Inspection Requirements
// ============================================

export const LiftingInspectionRequirements: Record<string, InspectionRequirement[]> = {
  // עגורנים
  [LiftingEquipmentType.TOWER_CRANE]: [
    {
      id: 'crane_14_months',
      name: 'בדיקת עגורן תקופתית',
      nameEn: 'Periodic Crane Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'סימן ז\' - מתקני הרמה'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק מוסמך למתקני הרמה',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 240
    }
  ],
  
  [LiftingEquipmentType.MOBILE_CRANE]: [
    {
      id: 'mobile_crane_14_months',
      name: 'בדיקת עגורן נייד',
      nameEn: 'Mobile Crane Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'תקנות עגורנאים התשנ"ג-1992'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק מוסמך למתקני הרמה',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 180
    }
  ],
  
  [LiftingEquipmentType.OVERHEAD_CRANE]: [
    {
      id: 'overhead_crane_14_months',
      name: 'בדיקת עגורן גשר',
      nameEn: 'Overhead Crane Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'סימן ז\''
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק מוסמך למתקני הרמה',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 120
    }
  ],
  
  // מלגזות
  [LiftingEquipmentType.FORKLIFT_COUNTERBALANCE]: [
    {
      id: 'forklift_14_months',
      name: 'בדיקת מלגזה',
      nameEn: 'Forklift Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות הבטיחות בעבודה',
        reference: 'תקנות עגורנאים ומפעילי מכונות הרמה'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק מוסמך למתקני הרמה',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 60
    }
  ],
  
  // מעליות
  [LiftingEquipmentType.ELEVATOR_PASSENGER]: [
    {
      id: 'elevator_6_months',
      name: 'בדיקת מעלית',
      nameEn: 'Elevator Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'סעיפים 59-65'
      },
      frequency: {
        type: FrequencyType.SEMI_ANNUAL,
        intervalMonths: 6
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק מוסמך למעליות',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 90
    }
  ],
  
  // אביזרי הרמה
  [LiftingEquipmentType.SLING_CHAIN]: [
    {
      id: 'sling_6_months',
      name: 'בדיקת אביזרי הרמה',
      nameEn: 'Lifting Accessories Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'סימן ז\' - אביזרי הרמה'
      },
      frequency: {
        type: FrequencyType.SEMI_ANNUAL,
        intervalMonths: 6
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק מוסמך',
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 7,
      inspectionType: 'visual',
      estimatedDuration: 15
    }
  ],
  
  // במות הרמה
  [LiftingEquipmentType.SCISSOR_LIFT]: [
    {
      id: 'scissor_lift_14_months',
      name: 'בדיקת במת הרמה',
      nameEn: 'Scissor Lift Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות הבטיחות בעבודה',
        reference: 'מתקני הרמה'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק מוסמך למתקני הרמה',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 60
    }
  ],
  
  // ליפט לרכב
  [LiftingEquipmentType.CAR_LIFT]: [
    {
      id: 'car_lift_14_months',
      name: 'בדיקת ליפט לרכב',
      nameEn: 'Car Lift Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות הבטיחות בעבודה'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק מוסמך למתקני הרמה',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 45
    }
  ]
};

// ============================================
// 💨 Pressure Equipment Inspection Requirements
// ============================================

export const PressureInspectionRequirements: Record<string, InspectionRequirement[]> = {
  [PressureEquipmentType.STEAM_BOILER]: [
    {
      id: 'boiler_cold_14_months',
      name: 'בדיקת דוד קיטור קרה',
      nameEn: 'Cold Boiler Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'סעיף 31'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק דוודים מוסמך',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'visual',
      estimatedDuration: 120
    },
    {
      id: 'boiler_hot_14_months',
      name: 'בדיקת דוד קיטור חמה',
      nameEn: 'Hot Boiler Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'סעיף 31'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק דוודים מוסמך',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'functional',
      estimatedDuration: 60
    },
    {
      id: 'boiler_hydrostatic',
      name: 'בדיקה הידרוסטטית',
      nameEn: 'Hydrostatic Test',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות בדיקה הידרוסטטית',
        reference: 'התשנ"ו-1995'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 108  // 9 years initially
      },
      conditions: [
        {
          type: 'age',
          ageThresholdYears: 9,
          newFrequency: {
            type: FrequencyType.CUSTOM,
            intervalMonths: 72  // Then every 6 years
          }
        },
        {
          type: 'age',
          ageThresholdYears: 21,
          newFrequency: {
            type: FrequencyType.CUSTOM,
            intervalMonths: 36  // After 21 years: every 3 years
          }
        }
      ],
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק דוודים מוסמך',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'hydrostatic',
      estimatedDuration: 180
    }
  ],
  
  [PressureEquipmentType.STEAM_RECEIVER]: [
    {
      id: 'steam_receiver_26_months',
      name: 'בדיקת קולט קיטור',
      nameEn: 'Steam Receiver Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'סעיף 110'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 26
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק דוודים מוסמך',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 60
    },
    {
      id: 'steam_receiver_hydrostatic',
      name: 'בדיקה הידרוסטטית קולט קיטור',
      nameEn: 'Steam Receiver Hydrostatic Test',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות בדיקה הידרוסטטית',
        reference: 'התשנ"ו-1995'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 120  // 10 years
      },
      conditions: [
        {
          type: 'age',
          ageThresholdYears: 21,
          newFrequency: {
            type: FrequencyType.CUSTOM,
            intervalMonths: 72  // After 21 years: every 6 years
          }
        }
      ],
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק דוודים מוסמך',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'hydrostatic',
      estimatedDuration: 120
    }
  ],
  
  [PressureEquipmentType.AIR_RECEIVER]: [
    {
      id: 'air_receiver_26_months',
      name: 'בדיקת קולט אוויר',
      nameEn: 'Air Receiver Inspection',
      source: {
        type: LegalSourceType.LAW,
        name: 'פקודת הבטיחות בעבודה',
        reference: 'סעיפים 32-33'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 26
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק דוודים מוסמך',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 45
    }
  ],
  
  [PressureEquipmentType.AUTOCLAVE]: [
    {
      id: 'autoclave_14_months',
      name: 'בדיקת אוטוקלב',
      nameEn: 'Autoclave Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות הבטיחות בעבודה'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 14
      },
      inspectorType: InspectorType.AUTHORIZED,
      certificationRequired: 'בודק דוודים מוסמך',
      formRequired: true,
      reportToAuthority: true,
      authorityName: 'מפקח עבודה אזורי',
      retentionYears: 10,
      inspectionType: 'full',
      estimatedDuration: 60
    }
  ]
};

// ============================================
// 🧗 Heights Equipment Inspection Requirements
// ============================================

export const HeightsInspectionRequirements: Record<string, InspectionRequirement[]> = {
  [HeightsEquipmentType.FULL_BODY_HARNESS]: [
    {
      id: 'harness_pre_use',
      name: 'בדיקה לפני שימוש',
      nameEn: 'Pre-Use Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות עבודה בגובה',
        reference: 'התשס"ז-2007'
      },
      frequency: {
        type: FrequencyType.DAILY,
        intervalDays: 1
      },
      inspectorType: InspectorType.SELF,
      formRequired: false,
      reportToAuthority: false,
      retentionYears: 1,
      inspectionType: 'visual'
    },
    {
      id: 'harness_annual',
      name: 'בדיקת רתמה שנתית',
      nameEn: 'Annual Harness Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות עבודה בגובה',
        reference: 'התשס"ז-2007'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      certificationRequired: 'בודק ציוד מגן מפני נפילה',
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'full',
      estimatedDuration: 15
    }
  ],
  
  [HeightsEquipmentType.LIFELINE_HORIZONTAL]: [
    {
      id: 'lifeline_annual',
      name: 'בדיקת קו חיים',
      nameEn: 'Lifeline Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות עבודה בגובה',
        reference: 'התשס"ז-2007'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      certificationRequired: 'בודק מוסמך',
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 7,
      inspectionType: 'full',
      estimatedDuration: 60
    }
  ],
  
  [HeightsEquipmentType.ANCHOR_POINT]: [
    {
      id: 'anchor_annual',
      name: 'בדיקת נקודות עיגון',
      nameEn: 'Anchor Point Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות עבודה בגובה',
        reference: 'התשס"ז-2007'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 7,
      inspectionType: 'full',
      estimatedDuration: 30
    }
  ],
  
  [HeightsEquipmentType.LADDER_PORTABLE]: [
    {
      id: 'ladder_pre_use',
      name: 'בדיקת סולם לפני שימוש',
      nameEn: 'Pre-Use Ladder Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות עבודה בגובה'
      },
      frequency: {
        type: FrequencyType.DAILY,
        intervalDays: 1
      },
      inspectorType: InspectorType.SELF,
      formRequired: false,
      reportToAuthority: false,
      retentionYears: 1,
      inspectionType: 'visual'
    },
    {
      id: 'ladder_annual',
      name: 'בדיקת סולמות שנתית',
      nameEn: 'Annual Ladder Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות עבודה בגובה'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'full',
      estimatedDuration: 15
    }
  ]
};

// ============================================
// 🚨 Emergency Equipment Inspection Requirements
// ============================================

export const EmergencyInspectionRequirements: Record<string, InspectionRequirement[]> = {
  [EmergencyEquipmentType.FIRST_AID_KIT]: [
    {
      id: 'first_aid_monthly',
      name: 'בדיקת ערכת עזרה ראשונה',
      nameEn: 'First Aid Kit Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות עזרה ראשונה במקומות עבודה',
        reference: 'התשמ"ח-1988'
      },
      frequency: {
        type: FrequencyType.MONTHLY,
        intervalMonths: 1
      },
      inspectorType: InspectorType.SELF,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 3,
      inspectionType: 'visual',
      estimatedDuration: 10
    }
  ],
  
  [EmergencyEquipmentType.AED]: [
    {
      id: 'aed_monthly',
      name: 'בדיקת דפיברילטור',
      nameEn: 'AED Inspection',
      source: {
        type: LegalSourceType.MANUFACTURER,
        name: 'הנחיות יצרן'
      },
      frequency: {
        type: FrequencyType.MONTHLY,
        intervalMonths: 1
      },
      inspectorType: InspectorType.SELF,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 3,
      inspectionType: 'visual',
      estimatedDuration: 5
    }
  ],
  
  [EmergencyEquipmentType.EMERGENCY_SHOWER]: [
    {
      id: 'shower_weekly',
      name: 'בדיקת מקלחת חירום שבועית',
      nameEn: 'Weekly Emergency Shower Test',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ANSI Z358.1'
      },
      frequency: {
        type: FrequencyType.WEEKLY,
        intervalDays: 7
      },
      inspectorType: InspectorType.SELF,
      formRequired: false,
      reportToAuthority: false,
      retentionYears: 1,
      inspectionType: 'functional'
    },
    {
      id: 'shower_annual',
      name: 'בדיקת מקלחת חירום שנתית',
      nameEn: 'Annual Emergency Shower Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'ANSI Z358.1'
      },
      frequency: {
        type: FrequencyType.ANNUAL,
        intervalMonths: 12
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'full',
      estimatedDuration: 30
    }
  ]
};

// ============================================
// 🧤 PPE Inspection Requirements
// ============================================

export const PPEInspectionRequirements: Record<string, InspectionRequirement[]> = {
  [PPEType.HARD_HAT]: [
    {
      id: 'hard_hat_pre_use',
      name: 'בדיקה לפני שימוש',
      nameEn: 'Pre-Use Inspection',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'תקן EN 397'
      },
      frequency: {
        type: FrequencyType.DAILY,
        intervalDays: 1
      },
      inspectorType: InspectorType.SELF,
      formRequired: false,
      reportToAuthority: false,
      retentionYears: 1,
      inspectionType: 'visual'
    }
  ],
  
  [PPEType.GLOVES_ELECTRICAL]: [
    {
      id: 'electrical_gloves_6_months',
      name: 'בדיקת כפפות חשמל',
      nameEn: 'Electrical Gloves Inspection',
      source: {
        type: LegalSourceType.REGULATION,
        name: 'תקנות החשמל'
      },
      frequency: {
        type: FrequencyType.SEMI_ANNUAL,
        intervalMonths: 6
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional',
      estimatedDuration: 30
    }
  ],
  
  [PPEType.SCBA]: [
    {
      id: 'scba_monthly',
      name: 'בדיקת מערכת נשימה חודשית',
      nameEn: 'Monthly SCBA Inspection',
      source: {
        type: LegalSourceType.MANUFACTURER,
        name: 'הנחיות יצרן'
      },
      frequency: {
        type: FrequencyType.MONTHLY,
        intervalMonths: 1
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 5,
      inspectionType: 'functional',
      estimatedDuration: 30
    },
    {
      id: 'scba_hydrostatic',
      name: 'בדיקה הידרוסטטית',
      nameEn: 'Hydrostatic Test',
      source: {
        type: LegalSourceType.STANDARD,
        name: 'DOT/TC'
      },
      frequency: {
        type: FrequencyType.CUSTOM,
        intervalMonths: 60  // 5 years
      },
      inspectorType: InspectorType.CERTIFIED,
      formRequired: true,
      reportToAuthority: false,
      retentionYears: 10,
      inspectionType: 'hydrostatic',
      estimatedDuration: 60
    }
  ]
};

// ============================================
// 🔄 Master Configuration Export
// ============================================

export const AllInspectionRequirements: Record<SafetyDomain, Record<string, InspectionRequirement[]>> = {
  [SafetyDomain.LASER]: LaserInspectionRequirements,
  [SafetyDomain.FIRE]: FireInspectionRequirements,
  [SafetyDomain.ELECTRICAL]: ElectricalInspectionRequirements,
  [SafetyDomain.LIFTING]: LiftingInspectionRequirements,
  [SafetyDomain.PRESSURE]: PressureInspectionRequirements,
  [SafetyDomain.HEIGHTS]: HeightsInspectionRequirements,
  [SafetyDomain.EMERGENCY]: EmergencyInspectionRequirements,
  [SafetyDomain.PPE]: PPEInspectionRequirements,
  [SafetyDomain.CHEMICAL]: {},  // To be populated
  [SafetyDomain.CONSTRUCTION]: {},
  [SafetyDomain.MACHINERY]: {},
  [SafetyDomain.RADIATION]: {},
  [SafetyDomain.NOISE]: {},
  [SafetyDomain.ERGONOMICS]: {},
  [SafetyDomain.CONFINED_SPACE]: {},
  [SafetyDomain.BIOLOGICAL]: {},
  [SafetyDomain.TRANSPORTATION]: {},
  [SafetyDomain.ENVIRONMENTAL]: {},
  [SafetyDomain.FOOD]: {},
  [SafetyDomain.MEDICAL]: {},
  [SafetyDomain.EXCAVATION]: {},
  [SafetyDomain.WELDING]: {},
  [SafetyDomain.SCAFFOLDING]: {},
  [SafetyDomain.ASBESTOS]: {},
  [SafetyDomain.PLAYGROUND]: {},
  [SafetyDomain.PSYCHOSOCIAL]: {},
  [SafetyDomain.GENERAL]: {}
};

// ============================================
// 🔧 Helper Functions
// ============================================

/**
 * Get inspection requirements for a specific equipment type
 */
export function getInspectionRequirements(
  domain: SafetyDomain, 
  equipmentType: string
): InspectionRequirement[] {
  const domainRequirements = AllInspectionRequirements[domain];
  if (!domainRequirements) return [];
  return domainRequirements[equipmentType] || [];
}

/**
 * Calculate next inspection date based on requirements and equipment age
 */
export function calculateNextInspectionDate(
  requirement: InspectionRequirement,
  lastInspectionDate: Date,
  equipmentAge?: number
): Date {
  let intervalMonths = requirement.frequency.intervalMonths || 12;
  
  // Check for age-based conditions
  if (equipmentAge && requirement.conditions) {
    for (const condition of requirement.conditions) {
      if (condition.type === 'age' && 
          condition.ageThresholdYears && 
          equipmentAge >= condition.ageThresholdYears &&
          condition.newFrequency?.intervalMonths) {
        intervalMonths = condition.newFrequency.intervalMonths;
      }
    }
  }
  
  const nextDate = new Date(lastInspectionDate);
  nextDate.setMonth(nextDate.getMonth() + intervalMonths);
  return nextDate;
}

/**
 * Check if inspection is overdue
 */
export function isInspectionOverdue(
  nextInspectionDate: Date | null | undefined
): boolean {
  if (!nextInspectionDate) return true;
  return new Date() > nextInspectionDate;
}

/**
 * Get days until next inspection
 */
export function getDaysUntilInspection(
  nextInspectionDate: Date | null | undefined
): number | null {
  if (!nextInspectionDate) return null;
  const now = new Date();
  const diff = nextInspectionDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
