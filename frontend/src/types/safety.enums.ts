/**
 * AEGIS Safety Management Platform
 * Comprehensive Safety Enums
 * 
 * מיפוי מלא של כל תחומי הבטיחות, סוגי ציוד ומיקומים
 */

// ============================================
// 🏷️ תחומי בטיחות ראשיים (Safety Domains)
// ============================================

export enum SafetyDomain {
  LASER = 'laser',                    // בטיחות לייזר
  FIRE = 'fire',                      // בטיחות אש
  ELECTRICAL = 'electrical',          // בטיחות חשמל
  CHEMICAL = 'chemical',              // חומרים מסוכנים
  CONSTRUCTION = 'construction',      // בטיחות בבנייה
  HEIGHTS = 'heights',                // עבודה בגובה
  LIFTING = 'lifting',                // מתקני הרמה
  PRESSURE = 'pressure',              // כלי לחץ וקיטור
  MACHINERY = 'machinery',            // מכונות וציוד
  RADIATION = 'radiation',            // קרינה
  NOISE = 'noise',                    // רעש תעסוקתי
  ERGONOMICS = 'ergonomics',          // ארגונומיה
  CONFINED_SPACE = 'confined_space',  // חללים מוקפים
  BIOLOGICAL = 'biological',          // סיכונים ביולוגיים
  TRANSPORTATION = 'transportation',  // תחבורה והובלה
  ENVIRONMENTAL = 'environmental',    // סביבה
  FOOD = 'food',                      // בטיחות מזון
  MEDICAL = 'medical',                // בטיחות רפואית
  PPE = 'ppe',                        // ציוד מגן אישי
  EMERGENCY = 'emergency',            // חירום והצלה
  EXCAVATION = 'excavation',          // חפירות ותעלות
  WELDING = 'welding',                // ריתוך וחיתוך
  SCAFFOLDING = 'scaffolding',        // פיגומים
  ASBESTOS = 'asbestos',              // אסבסט
  PLAYGROUND = 'playground',          // מתקני משחק
  PSYCHOSOCIAL = 'psychosocial',      // סיכונים פסיכו-סוציאליים
  GENERAL = 'general'                 // כללי
}

export const SafetyDomainLabels: Record<SafetyDomain, { he: string; en: string }> = {
  [SafetyDomain.LASER]: { he: 'בטיחות לייזר', en: 'Laser Safety' },
  [SafetyDomain.FIRE]: { he: 'בטיחות אש', en: 'Fire Safety' },
  [SafetyDomain.ELECTRICAL]: { he: 'בטיחות חשמל', en: 'Electrical Safety' },
  [SafetyDomain.CHEMICAL]: { he: 'חומרים מסוכנים', en: 'Hazardous Materials' },
  [SafetyDomain.CONSTRUCTION]: { he: 'בטיחות בבנייה', en: 'Construction Safety' },
  [SafetyDomain.HEIGHTS]: { he: 'עבודה בגובה', en: 'Working at Heights' },
  [SafetyDomain.LIFTING]: { he: 'מתקני הרמה', en: 'Lifting Equipment' },
  [SafetyDomain.PRESSURE]: { he: 'כלי לחץ וקיטור', en: 'Pressure Vessels' },
  [SafetyDomain.MACHINERY]: { he: 'מכונות וציוד', en: 'Machinery' },
  [SafetyDomain.RADIATION]: { he: 'קרינה', en: 'Radiation' },
  [SafetyDomain.NOISE]: { he: 'רעש תעסוקתי', en: 'Occupational Noise' },
  [SafetyDomain.ERGONOMICS]: { he: 'ארגונומיה', en: 'Ergonomics' },
  [SafetyDomain.CONFINED_SPACE]: { he: 'חללים מוקפים', en: 'Confined Spaces' },
  [SafetyDomain.BIOLOGICAL]: { he: 'סיכונים ביולוגיים', en: 'Biological Hazards' },
  [SafetyDomain.TRANSPORTATION]: { he: 'תחבורה והובלה', en: 'Transportation' },
  [SafetyDomain.ENVIRONMENTAL]: { he: 'סביבה', en: 'Environmental' },
  [SafetyDomain.FOOD]: { he: 'בטיחות מזון', en: 'Food Safety' },
  [SafetyDomain.MEDICAL]: { he: 'בטיחות רפואית', en: 'Medical Safety' },
  [SafetyDomain.PPE]: { he: 'ציוד מגן אישי', en: 'PPE' },
  [SafetyDomain.EMERGENCY]: { he: 'חירום והצלה', en: 'Emergency Response' },
  [SafetyDomain.EXCAVATION]: { he: 'חפירות ותעלות', en: 'Excavation' },
  [SafetyDomain.WELDING]: { he: 'ריתוך וחיתוך', en: 'Welding & Cutting' },
  [SafetyDomain.SCAFFOLDING]: { he: 'פיגומים', en: 'Scaffolding' },
  [SafetyDomain.ASBESTOS]: { he: 'אסבסט', en: 'Asbestos' },
  [SafetyDomain.PLAYGROUND]: { he: 'מתקני משחק', en: 'Playground Equipment' },
  [SafetyDomain.PSYCHOSOCIAL]: { he: 'סיכונים פסיכו-סוציאליים', en: 'Psychosocial Hazards' },
  [SafetyDomain.GENERAL]: { he: 'כללי', en: 'General' }
};

// ============================================
// 🏢 סוגי מיקומים (Location Types)
// ============================================

export enum LocationType {
  BUILDING = 'building',
  FLOOR = 'floor',
  ROOM = 'room',
  LAB = 'lab',
  OFFICE = 'office',
  STORAGE = 'storage',
  PRODUCTION_HALL = 'production_hall',
  WORKSHOP = 'workshop',
  WAREHOUSE = 'warehouse',
  OUTDOOR_AREA = 'outdoor_area',
  ROOFTOP = 'rooftop',
  BASEMENT = 'basement',
  PARKING = 'parking',
  CONSTRUCTION_SITE = 'construction_site',
  CONFINED_SPACE = 'confined_space',
  HAZARDOUS_AREA = 'hazardous_area',
  CLEANROOM = 'cleanroom',
  SERVER_ROOM = 'server_room',
  ELECTRICAL_ROOM = 'electrical_room',
  MECHANICAL_ROOM = 'mechanical_room',
  KITCHEN = 'kitchen',
  LOADING_DOCK = 'loading_dock',
  TREATMENT_ROOM = 'treatment_room',
  OPERATING_ROOM = 'operating_room',
  PHARMACY = 'pharmacy',
  RECEPTION = 'reception'
}

export const LocationTypeLabels: Record<LocationType, { he: string; en: string }> = {
  [LocationType.BUILDING]: { he: 'בניין', en: 'Building' },
  [LocationType.FLOOR]: { he: 'קומה', en: 'Floor' },
  [LocationType.ROOM]: { he: 'חדר', en: 'Room' },
  [LocationType.LAB]: { he: 'מעבדה', en: 'Laboratory' },
  [LocationType.OFFICE]: { he: 'משרד', en: 'Office' },
  [LocationType.STORAGE]: { he: 'מחסן', en: 'Storage' },
  [LocationType.PRODUCTION_HALL]: { he: 'אולם ייצור', en: 'Production Hall' },
  [LocationType.WORKSHOP]: { he: 'סדנה', en: 'Workshop' },
  [LocationType.WAREHOUSE]: { he: 'מחסן', en: 'Warehouse' },
  [LocationType.OUTDOOR_AREA]: { he: 'שטח פתוח', en: 'Outdoor Area' },
  [LocationType.ROOFTOP]: { he: 'גג', en: 'Rooftop' },
  [LocationType.BASEMENT]: { he: 'מרתף', en: 'Basement' },
  [LocationType.PARKING]: { he: 'חניון', en: 'Parking' },
  [LocationType.CONSTRUCTION_SITE]: { he: 'אתר בנייה', en: 'Construction Site' },
  [LocationType.CONFINED_SPACE]: { he: 'חלל מוקף', en: 'Confined Space' },
  [LocationType.HAZARDOUS_AREA]: { he: 'אזור מסוכן', en: 'Hazardous Area' },
  [LocationType.CLEANROOM]: { he: 'חדר נקי', en: 'Cleanroom' },
  [LocationType.SERVER_ROOM]: { he: 'חדר שרתים', en: 'Server Room' },
  [LocationType.ELECTRICAL_ROOM]: { he: 'חדר חשמל', en: 'Electrical Room' },
  [LocationType.MECHANICAL_ROOM]: { he: 'חדר מכונות', en: 'Mechanical Room' },
  [LocationType.KITCHEN]: { he: 'מטבח', en: 'Kitchen' },
  [LocationType.LOADING_DOCK]: { he: 'רציף טעינה', en: 'Loading Dock' },
  [LocationType.TREATMENT_ROOM]: { he: 'חדר טיפולים', en: 'Treatment Room' },
  [LocationType.OPERATING_ROOM]: { he: 'חדר ניתוח', en: 'Operating Room' },
  [LocationType.PHARMACY]: { he: 'בית מרקחת', en: 'Pharmacy' },
  [LocationType.RECEPTION]: { he: 'קבלה', en: 'Reception' }
};

// ============================================
// 🔴 ציוד לייזר (Laser Equipment)
// ============================================

export enum LaserEquipmentType {
  LASER_DEVICE = 'laser_device',
  SAFETY_GOGGLES = 'safety_goggles',
  WARNING_LIGHT = 'warning_light',
  INTERLOCK = 'interlock',
  BEAM_STOP = 'beam_stop',
  LASER_BARRIER = 'laser_barrier',
  LASER_CURTAIN = 'laser_curtain',
  POWER_METER = 'power_meter',
  LASER_POINTER = 'laser_pointer'
}

export const LaserEquipmentLabels: Record<LaserEquipmentType, { he: string; en: string }> = {
  [LaserEquipmentType.LASER_DEVICE]: { he: 'מכשיר לייזר', en: 'Laser Device' },
  [LaserEquipmentType.SAFETY_GOGGLES]: { he: 'משקפי הגנה', en: 'Safety Goggles' },
  [LaserEquipmentType.WARNING_LIGHT]: { he: 'נורת אזהרה', en: 'Warning Light' },
  [LaserEquipmentType.INTERLOCK]: { he: 'אינטרלוק', en: 'Interlock' },
  [LaserEquipmentType.BEAM_STOP]: { he: 'עוצר קרן', en: 'Beam Stop' },
  [LaserEquipmentType.LASER_BARRIER]: { he: 'מחסום לייזר', en: 'Laser Barrier' },
  [LaserEquipmentType.LASER_CURTAIN]: { he: 'וילון לייזר', en: 'Laser Curtain' },
  [LaserEquipmentType.POWER_METER]: { he: 'מד עוצמה', en: 'Power Meter' },
  [LaserEquipmentType.LASER_POINTER]: { he: 'מצביע לייזר', en: 'Laser Pointer' }
};

export enum LaserClass {
  CLASS_1 = '1',
  CLASS_1M = '1M',
  CLASS_1C = '1C',
  CLASS_2 = '2',
  CLASS_2M = '2M',
  CLASS_3R = '3R',
  CLASS_3B = '3B',
  CLASS_4 = '4'
}

// ============================================
// 🔥 ציוד אש (Fire Equipment)
// ============================================

export enum FireEquipmentType {
  // ציוד כיבוי ידני
  FIRE_EXTINGUISHER_POWDER = 'fire_extinguisher_powder',
  FIRE_EXTINGUISHER_CO2 = 'fire_extinguisher_co2',
  FIRE_EXTINGUISHER_FOAM = 'fire_extinguisher_foam',
  FIRE_EXTINGUISHER_WATER = 'fire_extinguisher_water',
  FIRE_EXTINGUISHER_WET_CHEMICAL = 'fire_extinguisher_wet_chemical',
  FIRE_HOSE_REEL = 'fire_hose_reel',
  FIRE_HYDRANT = 'fire_hydrant',
  FIRE_CABINET = 'fire_cabinet',
  FIRE_BLANKET = 'fire_blanket',
  
  // מערכות אוטומטיות
  SPRINKLER = 'sprinkler',
  FIRE_PUMP = 'fire_pump',
  FM200_SYSTEM = 'fm200_system',
  CO2_SYSTEM = 'co2_system',
  FOAM_SYSTEM = 'foam_system',
  AEROSOL_SYSTEM = 'aerosol_system',
  KITCHEN_HOOD_SYSTEM = 'kitchen_hood_system',
  DELUGE_SYSTEM = 'deluge_system',
  WATER_MIST_SYSTEM = 'water_mist_system',
  
  // גילוי והתרעה
  SMOKE_DETECTOR = 'smoke_detector',
  HEAT_DETECTOR = 'heat_detector',
  FLAME_DETECTOR = 'flame_detector',
  MULTI_SENSOR_DETECTOR = 'multi_sensor_detector',
  BEAM_DETECTOR = 'beam_detector',
  ASPIRATING_DETECTOR = 'aspirating_detector',
  GAS_DETECTOR = 'gas_detector',
  FIRE_ALARM_PANEL = 'fire_alarm_panel',
  MANUAL_CALL_POINT = 'manual_call_point',
  FIRE_ALARM_BELL = 'fire_alarm_bell',
  FIRE_ALARM_SIREN = 'fire_alarm_siren',
  STROBE_LIGHT = 'strobe_light',
  
  // מערכות פסיביות
  FIRE_DOOR = 'fire_door',
  FIRE_DAMPER = 'fire_damper',
  FIRE_SHUTTER = 'fire_shutter',
  FIRE_CURTAIN = 'fire_curtain',
  FIREPROOFING = 'fireproofing',
  FIRE_STOPPING = 'fire_stopping',
  
  // מערכות שליטה בעשן
  SMOKE_EXHAUST = 'smoke_exhaust',
  PRESSURIZATION_FAN = 'pressurization_fan',
  SMOKE_DAMPER = 'smoke_damper',
  SMOKE_CURTAIN = 'smoke_curtain',
  
  // תאורה ושילוט
  EMERGENCY_LIGHT = 'emergency_light',
  EXIT_SIGN = 'exit_sign',
  FIRE_SAFETY_SIGN = 'fire_safety_sign',
  PHOTOLUMINESCENT_SIGN = 'photoluminescent_sign'
}

export const FireEquipmentLabels: Record<FireEquipmentType, { he: string; en: string }> = {
  [FireEquipmentType.FIRE_EXTINGUISHER_POWDER]: { he: 'מטף אבקה', en: 'Powder Extinguisher' },
  [FireEquipmentType.FIRE_EXTINGUISHER_CO2]: { he: 'מטף CO2', en: 'CO2 Extinguisher' },
  [FireEquipmentType.FIRE_EXTINGUISHER_FOAM]: { he: 'מטף קצף', en: 'Foam Extinguisher' },
  [FireEquipmentType.FIRE_EXTINGUISHER_WATER]: { he: 'מטף מים', en: 'Water Extinguisher' },
  [FireEquipmentType.FIRE_EXTINGUISHER_WET_CHEMICAL]: { he: 'מטף כימי רטוב', en: 'Wet Chemical Extinguisher' },
  [FireEquipmentType.FIRE_HOSE_REEL]: { he: 'גלגלון כיבוי', en: 'Fire Hose Reel' },
  [FireEquipmentType.FIRE_HYDRANT]: { he: 'ברז כיבוי', en: 'Fire Hydrant' },
  [FireEquipmentType.FIRE_CABINET]: { he: 'ארון כיבוי', en: 'Fire Cabinet' },
  [FireEquipmentType.FIRE_BLANKET]: { he: 'שמיכת כיבוי', en: 'Fire Blanket' },
  [FireEquipmentType.SPRINKLER]: { he: 'ספרינקלר', en: 'Sprinkler' },
  [FireEquipmentType.FIRE_PUMP]: { he: 'משאבת כיבוי', en: 'Fire Pump' },
  [FireEquipmentType.FM200_SYSTEM]: { he: 'מערכת FM-200', en: 'FM-200 System' },
  [FireEquipmentType.CO2_SYSTEM]: { he: 'מערכת CO2', en: 'CO2 System' },
  [FireEquipmentType.FOAM_SYSTEM]: { he: 'מערכת קצף', en: 'Foam System' },
  [FireEquipmentType.AEROSOL_SYSTEM]: { he: 'מערכת אירוסול', en: 'Aerosol System' },
  [FireEquipmentType.KITCHEN_HOOD_SYSTEM]: { he: 'מערכת כיבוי מנדפים', en: 'Kitchen Hood System' },
  [FireEquipmentType.DELUGE_SYSTEM]: { he: 'מערכת הצפה', en: 'Deluge System' },
  [FireEquipmentType.WATER_MIST_SYSTEM]: { he: 'מערכת ערפל מים', en: 'Water Mist System' },
  [FireEquipmentType.SMOKE_DETECTOR]: { he: 'גלאי עשן', en: 'Smoke Detector' },
  [FireEquipmentType.HEAT_DETECTOR]: { he: 'גלאי חום', en: 'Heat Detector' },
  [FireEquipmentType.FLAME_DETECTOR]: { he: 'גלאי להבה', en: 'Flame Detector' },
  [FireEquipmentType.MULTI_SENSOR_DETECTOR]: { he: 'גלאי משולב', en: 'Multi-Sensor Detector' },
  [FireEquipmentType.BEAM_DETECTOR]: { he: 'גלאי קרן', en: 'Beam Detector' },
  [FireEquipmentType.ASPIRATING_DETECTOR]: { he: 'גלאי שאיבה', en: 'Aspirating Detector' },
  [FireEquipmentType.GAS_DETECTOR]: { he: 'גלאי גז', en: 'Gas Detector' },
  [FireEquipmentType.FIRE_ALARM_PANEL]: { he: 'רכזת גילוי אש', en: 'Fire Alarm Panel' },
  [FireEquipmentType.MANUAL_CALL_POINT]: { he: 'לחצן אזעקה ידני', en: 'Manual Call Point' },
  [FireEquipmentType.FIRE_ALARM_BELL]: { he: 'פעמון אזעקה', en: 'Fire Alarm Bell' },
  [FireEquipmentType.FIRE_ALARM_SIREN]: { he: 'צופר אזעקה', en: 'Fire Alarm Siren' },
  [FireEquipmentType.STROBE_LIGHT]: { he: 'נורת הבזק', en: 'Strobe Light' },
  [FireEquipmentType.FIRE_DOOR]: { he: 'דלת אש', en: 'Fire Door' },
  [FireEquipmentType.FIRE_DAMPER]: { he: 'משתק אש', en: 'Fire Damper' },
  [FireEquipmentType.FIRE_SHUTTER]: { he: 'תריס אש', en: 'Fire Shutter' },
  [FireEquipmentType.FIRE_CURTAIN]: { he: 'וילון אש', en: 'Fire Curtain' },
  [FireEquipmentType.FIREPROOFING]: { he: 'ציפוי עמיד אש', en: 'Fireproofing' },
  [FireEquipmentType.FIRE_STOPPING]: { he: 'איטום אש', en: 'Fire Stopping' },
  [FireEquipmentType.SMOKE_EXHAUST]: { he: 'מערכת שחרור עשן', en: 'Smoke Exhaust' },
  [FireEquipmentType.PRESSURIZATION_FAN]: { he: 'מפוח דיחוס', en: 'Pressurization Fan' },
  [FireEquipmentType.SMOKE_DAMPER]: { he: 'משתק עשן', en: 'Smoke Damper' },
  [FireEquipmentType.SMOKE_CURTAIN]: { he: 'וילון עשן', en: 'Smoke Curtain' },
  [FireEquipmentType.EMERGENCY_LIGHT]: { he: 'תאורת חירום', en: 'Emergency Light' },
  [FireEquipmentType.EXIT_SIGN]: { he: 'שלט יציאה', en: 'Exit Sign' },
  [FireEquipmentType.FIRE_SAFETY_SIGN]: { he: 'שילוט בטיחות אש', en: 'Fire Safety Sign' },
  [FireEquipmentType.PHOTOLUMINESCENT_SIGN]: { he: 'שלט זרחני', en: 'Photoluminescent Sign' }
};

// ============================================
// ⚡ ציוד חשמל (Electrical Equipment)
// ============================================

export enum ElectricalEquipmentType {
  MAIN_PANEL = 'main_panel',
  DISTRIBUTION_BOARD = 'distribution_board',
  SUB_PANEL = 'sub_panel',
  TRANSFORMER = 'transformer',
  GENERATOR = 'generator',
  UPS = 'ups',
  GROUNDING_SYSTEM = 'grounding_system',
  LIGHTNING_ROD = 'lightning_rod',
  SURGE_PROTECTOR = 'surge_protector',
  CIRCUIT_BREAKER = 'circuit_breaker',
  RCD = 'rcd',
  RCBO = 'rcbo',
  ISOLATOR = 'isolator',
  CONTACTOR = 'contactor',
  MOTOR = 'motor',
  VFD = 'vfd',
  CAPACITOR_BANK = 'capacitor_bank',
  CABLE_TRAY = 'cable_tray',
  BUSBAR = 'busbar',
  SOCKET_OUTLET = 'socket_outlet',
  JUNCTION_BOX = 'junction_box'
}

export const ElectricalEquipmentLabels: Record<ElectricalEquipmentType, { he: string; en: string }> = {
  [ElectricalEquipmentType.MAIN_PANEL]: { he: 'לוח חשמל ראשי', en: 'Main Panel' },
  [ElectricalEquipmentType.DISTRIBUTION_BOARD]: { he: 'לוח חלוקה', en: 'Distribution Board' },
  [ElectricalEquipmentType.SUB_PANEL]: { he: 'לוח משנה', en: 'Sub Panel' },
  [ElectricalEquipmentType.TRANSFORMER]: { he: 'שנאי', en: 'Transformer' },
  [ElectricalEquipmentType.GENERATOR]: { he: 'גנרטור', en: 'Generator' },
  [ElectricalEquipmentType.UPS]: { he: 'אל-פסק', en: 'UPS' },
  [ElectricalEquipmentType.GROUNDING_SYSTEM]: { he: 'מערכת הארקה', en: 'Grounding System' },
  [ElectricalEquipmentType.LIGHTNING_ROD]: { he: 'מוט ברק', en: 'Lightning Rod' },
  [ElectricalEquipmentType.SURGE_PROTECTOR]: { he: 'מגן ברקים', en: 'Surge Protector' },
  [ElectricalEquipmentType.CIRCUIT_BREAKER]: { he: 'מפסק זרם', en: 'Circuit Breaker' },
  [ElectricalEquipmentType.RCD]: { he: 'מפסק פחת', en: 'RCD' },
  [ElectricalEquipmentType.RCBO]: { he: 'מפסק פחת משולב', en: 'RCBO' },
  [ElectricalEquipmentType.ISOLATOR]: { he: 'מפסק מבודד', en: 'Isolator' },
  [ElectricalEquipmentType.CONTACTOR]: { he: 'מגען', en: 'Contactor' },
  [ElectricalEquipmentType.MOTOR]: { he: 'מנוע חשמלי', en: 'Electric Motor' },
  [ElectricalEquipmentType.VFD]: { he: 'ממיר תדר', en: 'VFD' },
  [ElectricalEquipmentType.CAPACITOR_BANK]: { he: 'סוללת קבלים', en: 'Capacitor Bank' },
  [ElectricalEquipmentType.CABLE_TRAY]: { he: 'מגש כבלים', en: 'Cable Tray' },
  [ElectricalEquipmentType.BUSBAR]: { he: 'פס צבירה', en: 'Busbar' },
  [ElectricalEquipmentType.SOCKET_OUTLET]: { he: 'שקע חשמל', en: 'Socket Outlet' },
  [ElectricalEquipmentType.JUNCTION_BOX]: { he: 'קופסת חיבורים', en: 'Junction Box' }
};

// ============================================
// ☢️ ציוד חומרים מסוכנים (Chemical Equipment)
// ============================================

export enum ChemicalEquipmentType {
  // אחסון
  CHEMICAL_CABINET = 'chemical_cabinet',
  FLAMMABLE_CABINET = 'flammable_cabinet',
  ACID_CABINET = 'acid_cabinet',
  BASE_CABINET = 'base_cabinet',
  GAS_CABINET = 'gas_cabinet',
  CHEMICAL_STORAGE = 'chemical_storage',
  BUNDING = 'bunding',
  IBC_CONTAINER = 'ibc_container',
  DRUM = 'drum',
  GAS_CYLINDER = 'gas_cylinder',
  CYLINDER_RACK = 'cylinder_rack',
  
  // בטיחות
  SAFETY_SHOWER = 'safety_shower',
  EYE_WASH = 'eye_wash',
  COMBO_UNIT = 'combo_unit',
  FUME_HOOD = 'fume_hood',
  BIOSAFETY_CABINET = 'biosafety_cabinet',
  LAMINAR_FLOW = 'laminar_flow',
  SPILL_KIT = 'spill_kit',
  NEUTRALIZATION_KIT = 'neutralization_kit',
  
  // ניטור
  GAS_DETECTOR_FIXED = 'gas_detector_fixed',
  GAS_DETECTOR_PORTABLE = 'gas_detector_portable',
  LEL_DETECTOR = 'lel_detector',
  OXYGEN_MONITOR = 'oxygen_monitor',
  PH_METER = 'ph_meter',
  
  // אוורור
  LOCAL_EXHAUST = 'local_exhaust',
  SCRUBBER = 'scrubber',
  VENTILATION_SYSTEM = 'ventilation_system',
  AIR_CURTAIN = 'air_curtain'
}

export const ChemicalEquipmentLabels: Record<ChemicalEquipmentType, { he: string; en: string }> = {
  [ChemicalEquipmentType.CHEMICAL_CABINET]: { he: 'ארון חומרים', en: 'Chemical Cabinet' },
  [ChemicalEquipmentType.FLAMMABLE_CABINET]: { he: 'ארון דליקים', en: 'Flammable Cabinet' },
  [ChemicalEquipmentType.ACID_CABINET]: { he: 'ארון חומצות', en: 'Acid Cabinet' },
  [ChemicalEquipmentType.BASE_CABINET]: { he: 'ארון בסיסים', en: 'Base Cabinet' },
  [ChemicalEquipmentType.GAS_CABINET]: { he: 'ארון גזים', en: 'Gas Cabinet' },
  [ChemicalEquipmentType.CHEMICAL_STORAGE]: { he: 'מחסן חומרים', en: 'Chemical Storage' },
  [ChemicalEquipmentType.BUNDING]: { he: 'אמבטיה/סכר', en: 'Bunding' },
  [ChemicalEquipmentType.IBC_CONTAINER]: { he: 'מיכל IBC', en: 'IBC Container' },
  [ChemicalEquipmentType.DRUM]: { he: 'חבית', en: 'Drum' },
  [ChemicalEquipmentType.GAS_CYLINDER]: { he: 'בלון גז', en: 'Gas Cylinder' },
  [ChemicalEquipmentType.CYLINDER_RACK]: { he: 'מתקן בלונים', en: 'Cylinder Rack' },
  [ChemicalEquipmentType.SAFETY_SHOWER]: { he: 'מקלחת חירום', en: 'Safety Shower' },
  [ChemicalEquipmentType.EYE_WASH]: { he: 'שטיפת עיניים', en: 'Eye Wash' },
  [ChemicalEquipmentType.COMBO_UNIT]: { he: 'יחידה משולבת', en: 'Combo Unit' },
  [ChemicalEquipmentType.FUME_HOOD]: { he: 'מנדף', en: 'Fume Hood' },
  [ChemicalEquipmentType.BIOSAFETY_CABINET]: { he: 'כיפת ביו-בטיחות', en: 'Biosafety Cabinet' },
  [ChemicalEquipmentType.LAMINAR_FLOW]: { he: 'זרימה למינרית', en: 'Laminar Flow' },
  [ChemicalEquipmentType.SPILL_KIT]: { he: 'ערכת שפיכה', en: 'Spill Kit' },
  [ChemicalEquipmentType.NEUTRALIZATION_KIT]: { he: 'ערכת נטרול', en: 'Neutralization Kit' },
  [ChemicalEquipmentType.GAS_DETECTOR_FIXED]: { he: 'גלאי גז קבוע', en: 'Fixed Gas Detector' },
  [ChemicalEquipmentType.GAS_DETECTOR_PORTABLE]: { he: 'גלאי גז נייד', en: 'Portable Gas Detector' },
  [ChemicalEquipmentType.LEL_DETECTOR]: { he: 'גלאי LEL', en: 'LEL Detector' },
  [ChemicalEquipmentType.OXYGEN_MONITOR]: { he: 'מד חמצן', en: 'Oxygen Monitor' },
  [ChemicalEquipmentType.PH_METER]: { he: 'מד pH', en: 'pH Meter' },
  [ChemicalEquipmentType.LOCAL_EXHAUST]: { he: 'יניקה מקומית', en: 'Local Exhaust' },
  [ChemicalEquipmentType.SCRUBBER]: { he: 'מגדל שטיפה', en: 'Scrubber' },
  [ChemicalEquipmentType.VENTILATION_SYSTEM]: { he: 'מערכת אוורור', en: 'Ventilation System' },
  [ChemicalEquipmentType.AIR_CURTAIN]: { he: 'וילון אוויר', en: 'Air Curtain' }
};

// ============================================
// 🏗️ ציוד מתקני הרמה (Lifting Equipment)
// ============================================

export enum LiftingEquipmentType {
  // עגורנים
  TOWER_CRANE = 'tower_crane',
  MOBILE_CRANE = 'mobile_crane',
  CRAWLER_CRANE = 'crawler_crane',
  OVERHEAD_CRANE = 'overhead_crane',
  GANTRY_CRANE = 'gantry_crane',
  JIB_CRANE = 'jib_crane',
  PORTAL_CRANE = 'portal_crane',
  
  // מלגזות
  FORKLIFT_COUNTERBALANCE = 'forklift_counterbalance',
  FORKLIFT_REACH = 'forklift_reach',
  FORKLIFT_TELESCOPIC = 'forklift_telescopic',
  FORKLIFT_SIDE_LOADER = 'forklift_side_loader',
  PALLET_TRUCK_ELECTRIC = 'pallet_truck_electric',
  PALLET_TRUCK_MANUAL = 'pallet_truck_manual',
  STACKER = 'stacker',
  ORDER_PICKER = 'order_picker',
  
  // מנופים
  HOIST_ELECTRIC = 'hoist_electric',
  HOIST_MANUAL = 'hoist_manual',
  HOIST_PNEUMATIC = 'hoist_pneumatic',
  WINCH = 'winch',
  CHAIN_BLOCK = 'chain_block',
  LEVER_HOIST = 'lever_hoist',
  
  // מעליות
  ELEVATOR_PASSENGER = 'elevator_passenger',
  ELEVATOR_FREIGHT = 'elevator_freight',
  ELEVATOR_SERVICE = 'elevator_service',
  DUMBWAITER = 'dumbwaiter',
  ESCALATOR = 'escalator',
  MOVING_WALKWAY = 'moving_walkway',
  STAIRLIFT = 'stairlift',
  PLATFORM_LIFT = 'platform_lift',
  
  // במות הרמה
  SCISSOR_LIFT = 'scissor_lift',
  BOOM_LIFT_ARTICULATING = 'boom_lift_articulating',
  BOOM_LIFT_TELESCOPIC = 'boom_lift_telescopic',
  VERTICAL_MAST_LIFT = 'vertical_mast_lift',
  TRUCK_MOUNTED_LIFT = 'truck_mounted_lift',
  
  // ציוד תעשייתי
  CAR_LIFT = 'car_lift',
  DOCK_LEVELER = 'dock_leveler',
  LIFT_TABLE = 'lift_table',
  LOADING_RAMP = 'loading_ramp',
  TAIL_LIFT = 'tail_lift',
  MONORAIL = 'monorail',
  CONVEYOR = 'conveyor',
  
  // אביזרי הרמה
  SLING_CHAIN = 'sling_chain',
  SLING_WIRE = 'sling_wire',
  SLING_TEXTILE = 'sling_textile',
  SLING_ROUND = 'sling_round',
  SHACKLE = 'shackle',
  HOOK = 'hook',
  EYE_BOLT = 'eye_bolt',
  LIFTING_BEAM = 'lifting_beam',
  SPREADER_BAR = 'spreader_bar',
  LIFTING_CLAMP = 'lifting_clamp',
  MAGNET = 'magnet',
  VACUUM_LIFTER = 'vacuum_lifter',
  LIFTING_BASKET = 'lifting_basket',
  SKIP = 'skip',
  SWIVEL = 'swivel'
}

export const LiftingEquipmentLabels: Record<LiftingEquipmentType, { he: string; en: string }> = {
  [LiftingEquipmentType.TOWER_CRANE]: { he: 'עגורן צריח', en: 'Tower Crane' },
  [LiftingEquipmentType.MOBILE_CRANE]: { he: 'עגורן נייד', en: 'Mobile Crane' },
  [LiftingEquipmentType.CRAWLER_CRANE]: { he: 'עגורן זחל', en: 'Crawler Crane' },
  [LiftingEquipmentType.OVERHEAD_CRANE]: { he: 'עגורן גשר', en: 'Overhead Crane' },
  [LiftingEquipmentType.GANTRY_CRANE]: { he: 'עגורן שער', en: 'Gantry Crane' },
  [LiftingEquipmentType.JIB_CRANE]: { he: 'עגורן זרוע', en: 'Jib Crane' },
  [LiftingEquipmentType.PORTAL_CRANE]: { he: 'עגורן פורטל', en: 'Portal Crane' },
  [LiftingEquipmentType.FORKLIFT_COUNTERBALANCE]: { he: 'מלגזה נגדית', en: 'Counterbalance Forklift' },
  [LiftingEquipmentType.FORKLIFT_REACH]: { he: 'מלגזה ריצ\'', en: 'Reach Forklift' },
  [LiftingEquipmentType.FORKLIFT_TELESCOPIC]: { he: 'מלגזה טלסקופית', en: 'Telescopic Forklift' },
  [LiftingEquipmentType.FORKLIFT_SIDE_LOADER]: { he: 'מלגזה צדדית', en: 'Side Loader' },
  [LiftingEquipmentType.PALLET_TRUCK_ELECTRIC]: { he: 'עגלת משטחים חשמלית', en: 'Electric Pallet Truck' },
  [LiftingEquipmentType.PALLET_TRUCK_MANUAL]: { he: 'עגלת משטחים ידנית', en: 'Manual Pallet Truck' },
  [LiftingEquipmentType.STACKER]: { he: 'סטאקר', en: 'Stacker' },
  [LiftingEquipmentType.ORDER_PICKER]: { he: 'ליקט הזמנות', en: 'Order Picker' },
  [LiftingEquipmentType.HOIST_ELECTRIC]: { he: 'מנוף חשמלי', en: 'Electric Hoist' },
  [LiftingEquipmentType.HOIST_MANUAL]: { he: 'מנוף ידני', en: 'Manual Hoist' },
  [LiftingEquipmentType.HOIST_PNEUMATIC]: { he: 'מנוף פנאומטי', en: 'Pneumatic Hoist' },
  [LiftingEquipmentType.WINCH]: { he: 'כננת', en: 'Winch' },
  [LiftingEquipmentType.CHAIN_BLOCK]: { he: 'מפתל שרשרת', en: 'Chain Block' },
  [LiftingEquipmentType.LEVER_HOIST]: { he: 'מנוף מנוף', en: 'Lever Hoist' },
  [LiftingEquipmentType.ELEVATOR_PASSENGER]: { he: 'מעלית נוסעים', en: 'Passenger Elevator' },
  [LiftingEquipmentType.ELEVATOR_FREIGHT]: { he: 'מעלית משא', en: 'Freight Elevator' },
  [LiftingEquipmentType.ELEVATOR_SERVICE]: { he: 'מעלית שירות', en: 'Service Elevator' },
  [LiftingEquipmentType.DUMBWAITER]: { he: 'מעלון', en: 'Dumbwaiter' },
  [LiftingEquipmentType.ESCALATOR]: { he: 'דרגנוע', en: 'Escalator' },
  [LiftingEquipmentType.MOVING_WALKWAY]: { he: 'מדרכה נעה', en: 'Moving Walkway' },
  [LiftingEquipmentType.STAIRLIFT]: { he: 'מעלון מדרגות', en: 'Stairlift' },
  [LiftingEquipmentType.PLATFORM_LIFT]: { he: 'במת הרמה', en: 'Platform Lift' },
  [LiftingEquipmentType.SCISSOR_LIFT]: { he: 'במה מספריים', en: 'Scissor Lift' },
  [LiftingEquipmentType.BOOM_LIFT_ARTICULATING]: { he: 'במה זרוע מפרקית', en: 'Articulating Boom Lift' },
  [LiftingEquipmentType.BOOM_LIFT_TELESCOPIC]: { he: 'במה זרוע טלסקופית', en: 'Telescopic Boom Lift' },
  [LiftingEquipmentType.VERTICAL_MAST_LIFT]: { he: 'במה תורן אנכית', en: 'Vertical Mast Lift' },
  [LiftingEquipmentType.TRUCK_MOUNTED_LIFT]: { he: 'משאית רם-סע', en: 'Truck Mounted Lift' },
  [LiftingEquipmentType.CAR_LIFT]: { he: 'ליפט לרכב', en: 'Car Lift' },
  [LiftingEquipmentType.DOCK_LEVELER]: { he: 'רמפת עגינה', en: 'Dock Leveler' },
  [LiftingEquipmentType.LIFT_TABLE]: { he: 'שולחן הרמה', en: 'Lift Table' },
  [LiftingEquipmentType.LOADING_RAMP]: { he: 'רמפת טעינה', en: 'Loading Ramp' },
  [LiftingEquipmentType.TAIL_LIFT]: { he: 'דופן אחורית', en: 'Tail Lift' },
  [LiftingEquipmentType.MONORAIL]: { he: 'מונוריל', en: 'Monorail' },
  [LiftingEquipmentType.CONVEYOR]: { he: 'מסוע', en: 'Conveyor' },
  [LiftingEquipmentType.SLING_CHAIN]: { he: 'מענב שרשרת', en: 'Chain Sling' },
  [LiftingEquipmentType.SLING_WIRE]: { he: 'מענב כבל', en: 'Wire Rope Sling' },
  [LiftingEquipmentType.SLING_TEXTILE]: { he: 'מענב טקסטיל', en: 'Textile Sling' },
  [LiftingEquipmentType.SLING_ROUND]: { he: 'מענב עגול', en: 'Round Sling' },
  [LiftingEquipmentType.SHACKLE]: { he: 'אונקל', en: 'Shackle' },
  [LiftingEquipmentType.HOOK]: { he: 'וו', en: 'Hook' },
  [LiftingEquipmentType.EYE_BOLT]: { he: 'בורג עין', en: 'Eye Bolt' },
  [LiftingEquipmentType.LIFTING_BEAM]: { he: 'קורת הרמה', en: 'Lifting Beam' },
  [LiftingEquipmentType.SPREADER_BAR]: { he: 'מוט פיזור', en: 'Spreader Bar' },
  [LiftingEquipmentType.LIFTING_CLAMP]: { he: 'מלקחיים', en: 'Lifting Clamp' },
  [LiftingEquipmentType.MAGNET]: { he: 'מגנט הרמה', en: 'Lifting Magnet' },
  [LiftingEquipmentType.VACUUM_LIFTER]: { he: 'מרים ואקום', en: 'Vacuum Lifter' },
  [LiftingEquipmentType.LIFTING_BASKET]: { he: 'סל הרמה', en: 'Lifting Basket' },
  [LiftingEquipmentType.SKIP]: { he: 'אשפתון', en: 'Skip' },
  [LiftingEquipmentType.SWIVEL]: { he: 'סביבול', en: 'Swivel' }
};

// ============================================
// 💨 ציוד לחץ וקיטור (Pressure Equipment)
// ============================================

export enum PressureEquipmentType {
  STEAM_BOILER = 'steam_boiler',
  HOT_WATER_BOILER = 'hot_water_boiler',
  ECONOMIZER = 'economizer',
  SUPERHEATER = 'superheater',
  STEAM_RECEIVER = 'steam_receiver',
  AIR_RECEIVER = 'air_receiver',
  PRESSURE_VESSEL = 'pressure_vessel',
  AUTOCLAVE = 'autoclave',
  STERILIZER = 'sterilizer',
  STEAM_COOKER = 'steam_cooker',
  AIR_COMPRESSOR = 'air_compressor',
  REFRIGERATION_COMPRESSOR = 'refrigeration_compressor',
  SAFETY_VALVE = 'safety_valve',
  PRESSURE_GAUGE = 'pressure_gauge',
  WATER_LEVEL_GAUGE = 'water_level_gauge',
  PRESSURE_RELIEF_VALVE = 'pressure_relief_valve'
}

export const PressureEquipmentLabels: Record<PressureEquipmentType, { he: string; en: string }> = {
  [PressureEquipmentType.STEAM_BOILER]: { he: 'דוד קיטור', en: 'Steam Boiler' },
  [PressureEquipmentType.HOT_WATER_BOILER]: { he: 'דוד מים חמים', en: 'Hot Water Boiler' },
  [PressureEquipmentType.ECONOMIZER]: { he: 'חוסך', en: 'Economizer' },
  [PressureEquipmentType.SUPERHEATER]: { he: 'משחן', en: 'Superheater' },
  [PressureEquipmentType.STEAM_RECEIVER]: { he: 'קולט קיטור', en: 'Steam Receiver' },
  [PressureEquipmentType.AIR_RECEIVER]: { he: 'קולט אוויר', en: 'Air Receiver' },
  [PressureEquipmentType.PRESSURE_VESSEL]: { he: 'מיכל לחץ', en: 'Pressure Vessel' },
  [PressureEquipmentType.AUTOCLAVE]: { he: 'אוטוקלב', en: 'Autoclave' },
  [PressureEquipmentType.STERILIZER]: { he: 'מעקר', en: 'Sterilizer' },
  [PressureEquipmentType.STEAM_COOKER]: { he: 'סיר בישול בקיטור', en: 'Steam Cooker' },
  [PressureEquipmentType.AIR_COMPRESSOR]: { he: 'מדחס אוויר', en: 'Air Compressor' },
  [PressureEquipmentType.REFRIGERATION_COMPRESSOR]: { he: 'מדחס קירור', en: 'Refrigeration Compressor' },
  [PressureEquipmentType.SAFETY_VALVE]: { he: 'שסתום ביטחון', en: 'Safety Valve' },
  [PressureEquipmentType.PRESSURE_GAUGE]: { he: 'מד לחץ', en: 'Pressure Gauge' },
  [PressureEquipmentType.WATER_LEVEL_GAUGE]: { he: 'מד מפלס מים', en: 'Water Level Gauge' },
  [PressureEquipmentType.PRESSURE_RELIEF_VALVE]: { he: 'שסתום שחרור לחץ', en: 'Pressure Relief Valve' }
};

// ============================================
// 🧗 ציוד עבודה בגובה (Heights Equipment)
// ============================================

export enum HeightsEquipmentType {
  // סולמות
  LADDER_FIXED = 'ladder_fixed',
  LADDER_PORTABLE = 'ladder_portable',
  LADDER_EXTENSION = 'ladder_extension',
  LADDER_STEP = 'ladder_step',
  LADDER_PLATFORM = 'ladder_platform',
  LADDER_ROPE = 'ladder_rope',
  
  // ציוד אישי
  FULL_BODY_HARNESS = 'full_body_harness',
  LANYARD_SINGLE = 'lanyard_single',
  LANYARD_DOUBLE = 'lanyard_double',
  SHOCK_ABSORBER = 'shock_absorber',
  SRL = 'srl',
  SRL_LEADING_EDGE = 'srl_leading_edge',
  ANCHOR_POINT = 'anchor_point',
  ROOF_ANCHOR = 'roof_anchor',
  LIFELINE_HORIZONTAL = 'lifeline_horizontal',
  LIFELINE_VERTICAL = 'lifeline_vertical',
  ROPE_GRAB = 'rope_grab',
  CARABINER = 'carabiner',
  ROPE_STATIC = 'rope_static',
  ROPE_DYNAMIC = 'rope_dynamic',
  
  // אחר
  SAFETY_NET = 'safety_net',
  GUARDRAIL = 'guardrail',
  EDGE_PROTECTION = 'edge_protection',
  RESCUE_KIT = 'rescue_kit'
}

export const HeightsEquipmentLabels: Record<HeightsEquipmentType, { he: string; en: string }> = {
  [HeightsEquipmentType.LADDER_FIXED]: { he: 'סולם קבוע', en: 'Fixed Ladder' },
  [HeightsEquipmentType.LADDER_PORTABLE]: { he: 'סולם נייד', en: 'Portable Ladder' },
  [HeightsEquipmentType.LADDER_EXTENSION]: { he: 'סולם מתארך', en: 'Extension Ladder' },
  [HeightsEquipmentType.LADDER_STEP]: { he: 'סולם מדרגות', en: 'Step Ladder' },
  [HeightsEquipmentType.LADDER_PLATFORM]: { he: 'סולם במה', en: 'Platform Ladder' },
  [HeightsEquipmentType.LADDER_ROPE]: { he: 'סולם חבל', en: 'Rope Ladder' },
  [HeightsEquipmentType.FULL_BODY_HARNESS]: { he: 'רתמת גוף מלאה', en: 'Full Body Harness' },
  [HeightsEquipmentType.LANYARD_SINGLE]: { he: 'רצועת קישור בודדת', en: 'Single Lanyard' },
  [HeightsEquipmentType.LANYARD_DOUBLE]: { he: 'רצועת קישור כפולה', en: 'Double Lanyard' },
  [HeightsEquipmentType.SHOCK_ABSORBER]: { he: 'סופג אנרגיה', en: 'Shock Absorber' },
  [HeightsEquipmentType.SRL]: { he: 'מגביל נפילה', en: 'Self-Retracting Lifeline' },
  [HeightsEquipmentType.SRL_LEADING_EDGE]: { he: 'מגביל נפילה לקצה מוביל', en: 'Leading Edge SRL' },
  [HeightsEquipmentType.ANCHOR_POINT]: { he: 'נקודת עיגון', en: 'Anchor Point' },
  [HeightsEquipmentType.ROOF_ANCHOR]: { he: 'עוגן גג', en: 'Roof Anchor' },
  [HeightsEquipmentType.LIFELINE_HORIZONTAL]: { he: 'קו חיים אופקי', en: 'Horizontal Lifeline' },
  [HeightsEquipmentType.LIFELINE_VERTICAL]: { he: 'קו חיים אנכי', en: 'Vertical Lifeline' },
  [HeightsEquipmentType.ROPE_GRAB]: { he: 'תופס חבל', en: 'Rope Grab' },
  [HeightsEquipmentType.CARABINER]: { he: 'סגיר', en: 'Carabiner' },
  [HeightsEquipmentType.ROPE_STATIC]: { he: 'חבל סטטי', en: 'Static Rope' },
  [HeightsEquipmentType.ROPE_DYNAMIC]: { he: 'חבל דינמי', en: 'Dynamic Rope' },
  [HeightsEquipmentType.SAFETY_NET]: { he: 'רשת בטיחות', en: 'Safety Net' },
  [HeightsEquipmentType.GUARDRAIL]: { he: 'מעקה בטיחות', en: 'Guardrail' },
  [HeightsEquipmentType.EDGE_PROTECTION]: { he: 'הגנת קצה', en: 'Edge Protection' },
  [HeightsEquipmentType.RESCUE_KIT]: { he: 'ערכת חילוץ', en: 'Rescue Kit' }
};

// ============================================
// 🧤 ציוד מגן אישי (PPE)
// ============================================

export enum PPEType {
  // הגנת ראש
  HARD_HAT = 'hard_hat',
  BUMP_CAP = 'bump_cap',
  HAIR_NET = 'hair_net',
  WELDING_CAP = 'welding_cap',
  
  // הגנת עיניים
  SAFETY_GLASSES = 'safety_glasses',
  SAFETY_GOGGLES = 'safety_goggles',
  FACE_SHIELD = 'face_shield',
  WELDING_HELMET = 'welding_helmet',
  WELDING_GOGGLES = 'welding_goggles',
  LASER_GOGGLES = 'laser_goggles',
  
  // הגנת שמיעה
  EAR_PLUGS = 'ear_plugs',
  EAR_MUFFS = 'ear_muffs',
  COMMUNICATION_HEADSET = 'communication_headset',
  
  // הגנת נשימה
  DUST_MASK = 'dust_mask',
  HALF_MASK = 'half_mask',
  FULL_FACE_MASK = 'full_face_mask',
  PAPR = 'papr',
  SCBA = 'scba',
  ESCAPE_MASK = 'escape_mask',
  FILTER_P1 = 'filter_p1',
  FILTER_P2 = 'filter_p2',
  FILTER_P3 = 'filter_p3',
  FILTER_A = 'filter_a',
  FILTER_ABEK = 'filter_abek',
  
  // הגנת ידיים
  GLOVES_LEATHER = 'gloves_leather',
  GLOVES_NITRILE = 'gloves_nitrile',
  GLOVES_LATEX = 'gloves_latex',
  GLOVES_CUT_RESISTANT = 'gloves_cut_resistant',
  GLOVES_CHEMICAL = 'gloves_chemical',
  GLOVES_HEAT = 'gloves_heat',
  GLOVES_COLD = 'gloves_cold',
  GLOVES_ELECTRICAL = 'gloves_electrical',
  GLOVES_WELDING = 'gloves_welding',
  GLOVES_ANTI_VIBRATION = 'gloves_anti_vibration',
  
  // הגנת גוף
  COVERALL = 'coverall',
  APRON = 'apron',
  HIGH_VIS_VEST = 'high_vis_vest',
  HIGH_VIS_JACKET = 'high_vis_jacket',
  LAB_COAT = 'lab_coat',
  CHEMICAL_SUIT = 'chemical_suit',
  FLAME_RETARDANT_SUIT = 'flame_retardant_suit',
  ARC_FLASH_SUIT = 'arc_flash_suit',
  RAIN_SUIT = 'rain_suit',
  
  // הגנת רגליים
  SAFETY_BOOTS = 'safety_boots',
  SAFETY_SHOES = 'safety_shoes',
  METATARSAL_GUARDS = 'metatarsal_guards',
  GAITERS = 'gaiters',
  SHOE_COVERS = 'shoe_covers',
  ANTI_STATIC_SHOES = 'anti_static_shoes',
  ELECTRICAL_BOOTS = 'electrical_boots',
  
  // הגנה מנפילה
  HARNESS = 'harness',
  LANYARD = 'lanyard',
  SRL_PPE = 'srl_ppe'
}

export const PPELabels: Record<PPEType, { he: string; en: string }> = {
  [PPEType.HARD_HAT]: { he: 'קסדת בטיחות', en: 'Hard Hat' },
  [PPEType.BUMP_CAP]: { he: 'כובע מגן', en: 'Bump Cap' },
  [PPEType.HAIR_NET]: { he: 'רשת שיער', en: 'Hair Net' },
  [PPEType.WELDING_CAP]: { he: 'כובע ריתוך', en: 'Welding Cap' },
  [PPEType.SAFETY_GLASSES]: { he: 'משקפי מגן', en: 'Safety Glasses' },
  [PPEType.SAFETY_GOGGLES]: { he: 'משקפות מגן', en: 'Safety Goggles' },
  [PPEType.FACE_SHIELD]: { he: 'מגן פנים', en: 'Face Shield' },
  [PPEType.WELDING_HELMET]: { he: 'קסדת ריתוך', en: 'Welding Helmet' },
  [PPEType.WELDING_GOGGLES]: { he: 'משקפי ריתוך', en: 'Welding Goggles' },
  [PPEType.LASER_GOGGLES]: { he: 'משקפי לייזר', en: 'Laser Goggles' },
  [PPEType.EAR_PLUGS]: { he: 'אטמי אוזניים', en: 'Ear Plugs' },
  [PPEType.EAR_MUFFS]: { he: 'אוזניות מגן', en: 'Ear Muffs' },
  [PPEType.COMMUNICATION_HEADSET]: { he: 'אוזניות תקשורת', en: 'Communication Headset' },
  [PPEType.DUST_MASK]: { he: 'מסכת אבק', en: 'Dust Mask' },
  [PPEType.HALF_MASK]: { he: 'חצי מסכה', en: 'Half Mask' },
  [PPEType.FULL_FACE_MASK]: { he: 'מסכה מלאה', en: 'Full Face Mask' },
  [PPEType.PAPR]: { he: 'מערכת הנעה', en: 'PAPR' },
  [PPEType.SCBA]: { he: 'מערכת נשימה עצמית', en: 'SCBA' },
  [PPEType.ESCAPE_MASK]: { he: 'מסכת מילוט', en: 'Escape Mask' },
  [PPEType.FILTER_P1]: { he: 'מסנן P1', en: 'P1 Filter' },
  [PPEType.FILTER_P2]: { he: 'מסנן P2', en: 'P2 Filter' },
  [PPEType.FILTER_P3]: { he: 'מסנן P3', en: 'P3 Filter' },
  [PPEType.FILTER_A]: { he: 'מסנן A', en: 'A Filter' },
  [PPEType.FILTER_ABEK]: { he: 'מסנן ABEK', en: 'ABEK Filter' },
  [PPEType.GLOVES_LEATHER]: { he: 'כפפות עור', en: 'Leather Gloves' },
  [PPEType.GLOVES_NITRILE]: { he: 'כפפות ניטריל', en: 'Nitrile Gloves' },
  [PPEType.GLOVES_LATEX]: { he: 'כפפות לטקס', en: 'Latex Gloves' },
  [PPEType.GLOVES_CUT_RESISTANT]: { he: 'כפפות נגד חתך', en: 'Cut Resistant Gloves' },
  [PPEType.GLOVES_CHEMICAL]: { he: 'כפפות כימיות', en: 'Chemical Gloves' },
  [PPEType.GLOVES_HEAT]: { he: 'כפפות חום', en: 'Heat Gloves' },
  [PPEType.GLOVES_COLD]: { he: 'כפפות קור', en: 'Cold Gloves' },
  [PPEType.GLOVES_ELECTRICAL]: { he: 'כפפות חשמל', en: 'Electrical Gloves' },
  [PPEType.GLOVES_WELDING]: { he: 'כפפות ריתוך', en: 'Welding Gloves' },
  [PPEType.GLOVES_ANTI_VIBRATION]: { he: 'כפפות נגד רעד', en: 'Anti-Vibration Gloves' },
  [PPEType.COVERALL]: { he: 'סרבל', en: 'Coverall' },
  [PPEType.APRON]: { he: 'סינר', en: 'Apron' },
  [PPEType.HIGH_VIS_VEST]: { he: 'אפוד זוהר', en: 'High-Vis Vest' },
  [PPEType.HIGH_VIS_JACKET]: { he: 'ז\'קט זוהר', en: 'High-Vis Jacket' },
  [PPEType.LAB_COAT]: { he: 'חלוק מעבדה', en: 'Lab Coat' },
  [PPEType.CHEMICAL_SUIT]: { he: 'חליפה כימית', en: 'Chemical Suit' },
  [PPEType.FLAME_RETARDANT_SUIT]: { he: 'חליפה עמידת אש', en: 'Flame Retardant Suit' },
  [PPEType.ARC_FLASH_SUIT]: { he: 'חליפת קשת', en: 'Arc Flash Suit' },
  [PPEType.RAIN_SUIT]: { he: 'חליפת גשם', en: 'Rain Suit' },
  [PPEType.SAFETY_BOOTS]: { he: 'מגפי בטיחות', en: 'Safety Boots' },
  [PPEType.SAFETY_SHOES]: { he: 'נעלי בטיחות', en: 'Safety Shoes' },
  [PPEType.METATARSAL_GUARDS]: { he: 'מגני כף רגל', en: 'Metatarsal Guards' },
  [PPEType.GAITERS]: { he: 'חותלות', en: 'Gaiters' },
  [PPEType.SHOE_COVERS]: { he: 'כיסויי נעליים', en: 'Shoe Covers' },
  [PPEType.ANTI_STATIC_SHOES]: { he: 'נעליים אנטי-סטטיות', en: 'Anti-Static Shoes' },
  [PPEType.ELECTRICAL_BOOTS]: { he: 'מגפי חשמל', en: 'Electrical Boots' },
  [PPEType.HARNESS]: { he: 'רתמה', en: 'Harness' },
  [PPEType.LANYARD]: { he: 'רצועת קישור', en: 'Lanyard' },
  [PPEType.SRL_PPE]: { he: 'מגביל נפילה', en: 'SRL' }
};

// ============================================
// 🚨 ציוד חירום (Emergency Equipment)
// ============================================

export enum EmergencyEquipmentType {
  FIRST_AID_KIT = 'first_aid_kit',
  FIRST_AID_KIT_WALL = 'first_aid_kit_wall',
  FIRST_AID_KIT_PORTABLE = 'first_aid_kit_portable',
  FIRST_AID_KIT_VEHICLE = 'first_aid_kit_vehicle',
  AED = 'aed',
  STRETCHER = 'stretcher',
  SPINE_BOARD = 'spine_board',
  SCOOP_STRETCHER = 'scoop_stretcher',
  EMERGENCY_SHOWER = 'emergency_shower',
  EYE_WASH_STATION = 'eye_wash_station',
  EMERGENCY_PHONE = 'emergency_phone',
  ASSEMBLY_POINT = 'assembly_point',
  EVACUATION_CHAIR = 'evacuation_chair',
  RESCUE_EQUIPMENT = 'rescue_equipment',
  TRAUMA_KIT = 'trauma_kit',
  OXYGEN_UNIT = 'oxygen_unit',
  EMERGENCY_BLANKET = 'emergency_blanket'
}

export const EmergencyEquipmentLabels: Record<EmergencyEquipmentType, { he: string; en: string }> = {
  [EmergencyEquipmentType.FIRST_AID_KIT]: { he: 'ערכת עזרה ראשונה', en: 'First Aid Kit' },
  [EmergencyEquipmentType.FIRST_AID_KIT_WALL]: { he: 'ערכת עזרה ראשונה קיר', en: 'Wall First Aid Kit' },
  [EmergencyEquipmentType.FIRST_AID_KIT_PORTABLE]: { he: 'ערכת עזרה ראשונה ניידת', en: 'Portable First Aid Kit' },
  [EmergencyEquipmentType.FIRST_AID_KIT_VEHICLE]: { he: 'ערכת עזרה ראשונה לרכב', en: 'Vehicle First Aid Kit' },
  [EmergencyEquipmentType.AED]: { he: 'דפיברילטור', en: 'AED' },
  [EmergencyEquipmentType.STRETCHER]: { he: 'אלונקה', en: 'Stretcher' },
  [EmergencyEquipmentType.SPINE_BOARD]: { he: 'לוח גב', en: 'Spine Board' },
  [EmergencyEquipmentType.SCOOP_STRETCHER]: { he: 'אלונקת חפירה', en: 'Scoop Stretcher' },
  [EmergencyEquipmentType.EMERGENCY_SHOWER]: { he: 'מקלחת חירום', en: 'Emergency Shower' },
  [EmergencyEquipmentType.EYE_WASH_STATION]: { he: 'עמדת שטיפת עיניים', en: 'Eye Wash Station' },
  [EmergencyEquipmentType.EMERGENCY_PHONE]: { he: 'טלפון חירום', en: 'Emergency Phone' },
  [EmergencyEquipmentType.ASSEMBLY_POINT]: { he: 'נקודת התכנסות', en: 'Assembly Point' },
  [EmergencyEquipmentType.EVACUATION_CHAIR]: { he: 'כיסא פינוי', en: 'Evacuation Chair' },
  [EmergencyEquipmentType.RESCUE_EQUIPMENT]: { he: 'ציוד חילוץ', en: 'Rescue Equipment' },
  [EmergencyEquipmentType.TRAUMA_KIT]: { he: 'ערכת טראומה', en: 'Trauma Kit' },
  [EmergencyEquipmentType.OXYGEN_UNIT]: { he: 'יחידת חמצן', en: 'Oxygen Unit' },
  [EmergencyEquipmentType.EMERGENCY_BLANKET]: { he: 'שמיכת חירום', en: 'Emergency Blanket' }
};

// ============================================
// 📊 סטטוסים ורמות סיכון
// ============================================

export enum MaintenanceStatus {
  VALID = 'valid',
  EXPIRED = 'expired',
  PENDING = 'pending',
  NOT_APPLICABLE = 'na'
}

export enum EquipmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_REPAIR = 'under_repair',
  DISPOSED = 'disposed',
  OUT_OF_SERVICE = 'out_of_service'
}

export enum LocationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_CONSTRUCTION = 'under_construction',
  CLOSED = 'closed'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum InspectionType {
  ROUTINE = 'routine',
  PERIODIC = 'periodic',
  INITIAL = 'initial',
  POST_REPAIR = 'post_repair',
  SPECIAL = 'special',
  PRE_USE = 'pre_use'
}

export enum InspectionStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  ARCHIVED = 'archived'
}

export enum FindingSeverity {
  OBSERVATION = 'observation',
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical'
}

export enum ChecklistItemStatus {
  PASS = 'pass',
  FAIL = 'fail',
  NA = 'na',
  NOT_CHECKED = 'not_checked'
}

export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUAL = 'semi_annual',
  ANNUAL = 'annual',
  BIENNIAL = 'biennial',
  CUSTOM = 'custom'
}

export enum InspectorType {
  SELF = 'self',
  CERTIFIED = 'certified',
  AUTHORIZED = 'authorized',
  MANUFACTURER = 'manufacturer'
}

export enum LegalSourceType {
  LAW = 'law',
  REGULATION = 'regulation',
  STANDARD = 'standard',
  MANUFACTURER = 'manufacturer',
  CUSTOM = 'custom'
}
