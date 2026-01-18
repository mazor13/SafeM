import { Timestamp } from 'firebase/firestore';

export type SafetyDomain = 
  | 'fire_safety' 
  | 'electricity' 
  | 'elevators' 
  | 'lifting' 
  | 'gas' 
  | 'accessibility' 
  | 'machinery' 
  | 'radiation';

export const SAFETY_DOMAINS: Record<SafetyDomain, { name: string; icon: string; color: string }> = {
  fire_safety: { name: 'כיבוי אש', icon: 'fire', color: 'red' },
  electricity: { name: 'חשמל', icon: 'zap', color: 'yellow' },
  elevators: { name: 'מעליות', icon: 'arrow-up-circle', color: 'blue' },
  lifting: { name: 'מתקני הרמה', icon: 'anchor', color: 'orange' },
  gas: { name: 'גז', icon: 'wind', color: 'green' },
  accessibility: { name: 'נגישות', icon: 'user', color: 'purple' },
  machinery: { name: 'מכונות', icon: 'settings', color: 'slate' },
  radiation: { name: 'קרינה', icon: 'radio', color: 'rose' },
};

// ===== FIRE SAFETY =====
export type FireEquipmentType = 
  | 'fire_extinguisher'           // מטף כיבוי
  | 'fire_hose_reel'              // גלגלון כיבוי
  | 'fire_hydrant'                // הידרנט
  | 'smoke_detector'              // גלאי עשן
  | 'heat_detector'               // גלאי חום
  | 'fire_alarm_panel'            // לוח בקרה אש
  | 'sprinkler_head'              // ראש ספרינקלר
  | 'sprinkler_system'            // מערכת ספרינקלרים
  | 'emergency_light'             // תאורת חירום
  | 'exit_sign'                   // שלט יציאה
  | 'fire_door'                   // דלת אש
  | 'fire_shutter'                // תריס אש
  | 'foam_system'                 // מערכת קצף
  | 'gas_suppression'             // מערכת גז כיבוי
  | 'fire_pump';                  // משאבת כיבוי

// ===== ELEVATORS =====
export type ElevatorEquipmentType =
  | 'passenger_elevator'          // מעלית נוסעים
  | 'freight_elevator'            // מעלית משא
  | 'service_elevator'            // מעלית שירות
  | 'platform_lift'               // במת הרמה
  | 'stair_lift'                  // מעלון מדרגות
  | 'escalator'                   // מדרגות נעות
  | 'moving_walkway';             // מסילה נעה

// ===== LIFTING EQUIPMENT =====
export type LiftingEquipmentType =
  | 'overhead_crane'              // מנוף גשר
  | 'gantry_crane'                // עגורן שער
  | 'jib_crane'                   // מנוף זרוע
  | 'forklift'                    // מלגזה
  | 'scissor_lift'                // במת הרמה מספריים
  | 'boom_lift'                   // במת הרמה זרוע
  | 'chain_hoist'                 // מלגה שרשרת
  | 'wire_rope_hoist'             // מלגה כבל
  | 'sling'                       // מעגל הרמה
  | 'lifting_beam'                // קורת הרמה
  | 'pallet_jack';                // עגלת משטחים

// ===== ELECTRICAL =====
export type ElectricalEquipmentType =
  | 'main_distribution_board'     // לוח ראשי
  | 'sub_distribution_board'      // לוח משנה
  | 'transformer'                 // שנאי
  | 'generator'                   // גנרטור
  | 'ups'                         // אל-פסק
  | 'earthing_system'             // מערכת הארקה
  | 'lightning_protection'        // הגנה מברקים
  | 'cable_tray'                  // מגש כבלים
  | 'socket_outlet';              // שקע חשמל

// מפה של סוגי ציוד לפי Domain (לשימוש ב-Dropdown בטופס)
export const EQUIPMENT_TYPES_BY_DOMAIN: Record<SafetyDomain, string[]> = {
  fire_safety: [
    'fire_extinguisher', 'fire_hose_reel', 'fire_hydrant', 'smoke_detector', 
    'heat_detector', 'fire_alarm_panel', 'sprinkler_head', 'sprinkler_system', 
    'emergency_light', 'exit_sign', 'fire_door', 'gas_suppression'
  ],
  elevators: [
    'passenger_elevator', 'freight_elevator', 'platform_lift', 'escalator'
  ],
  lifting: [
    'overhead_crane', 'forklift', 'scissor_lift', 'boom_lift', 'chain_hoist'
  ],
  electricity: [
    'main_distribution_board', 'sub_distribution_board', 'generator', 'ups', 'earthing_system'
  ],
  gas: ['gas_meter', 'gas_regulator', 'gas_pipe', 'gas_tank'],
  accessibility: ['wheelchair_ramp', 'accessible_toilet', 'audio_loop'],
  machinery: ['cnc_machine', 'lathe', 'press', 'conveyor'],
  radiation: ['xray_machine', 'ct_scanner', 'laser_device']
};

export type EquipmentStatus = 'active' | 'expired' | 'damaged' | 'maintenance' | 'disposed';

export interface Equipment {
  id: string;
  tenantId: string;
  clientId: string;
  siteId: string;           // חובה: שיוך לאתר
  locationId?: string;      // אופציונלי: שיוך לאזור ספציפי (חדר/קומה)
  
  // זיהוי
  name: string;
  domain: SafetyDomain;
  type: string;             // אחד מה-Types למעלה
  serialNumber?: string;
  internalId?: string;      // מספר נכס פנימי
  qrCode?: string;
  
  // יצרן
  manufacturer?: string;
  model?: string;
  manufactureDate?: Timestamp;
  installationDate?: Timestamp;
  
  // סטטוס ותוקף
  status: EquipmentStatus;
  lastInspectionDate?: Timestamp;
  nextInspectionDate?: Timestamp;
  
  // מפרט טכני (גמיש לפי סוג)
  specs?: Record<string, any>;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
