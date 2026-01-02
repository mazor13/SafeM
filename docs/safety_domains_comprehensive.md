# 🏗️ מיפוי מקיף של תחומי בטיחות - AEGIS Platform

## מבנה מסד הנתונים המוצע

---

## 📁 קטגוריות ראשיות (Safety Domains)

```typescript
enum SafetyDomain {
  LASER = 'laser',                    // בטיחות לייזר
  FIRE = 'fire',                      // בטיחות אש
  ELECTRICAL = 'electrical',          // בטיחות חשמל
  CHEMICAL = 'chemical',              // חומרים מסוכנים
  CONSTRUCTION = 'construction',      // בטיחות בבנייה
  HEIGHTS = 'heights',                // עבודה בגובה
  LIFTING = 'lifting',                // מתקני הרמה
  PRESSURE = 'pressure',              // כלי לחץ וקיטור
  MACHINERY = 'machinery',            // מכונות וציוד
  RADIATION = 'radiation',            // קרינה (מייננת ולא מייננת)
  NOISE = 'noise',                    // רעש תעסוקתי
  ERGONOMICS = 'ergonomics',          // ארגונומיה
  CONFINED_SPACE = 'confined_space',  // חללים מוקפים
  BIOLOGICAL = 'biological',          // סיכונים ביולוגיים
  TRANSPORTATION = 'transportation',  // תחבורה והובלה
  ENVIRONMENTAL = 'environmental',    // סביבה ואיכות סביבה
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
```

---

## 📋 פירוט כל תחום בטיחות

---

### 1. 🔴 בטיחות לייזר (LASER)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות גיהות תעסוקתית ובטיחות העוסקים בקרינת לייזר | התשס"ה | 2005 |
| תקן ישראלי לייזרים | ת"י 60825 | |

#### סוגי ציוד:
```typescript
enum LaserEquipmentType {
  LASER_DEVICE = 'laser_device',           // מכשיר לייזר
  SAFETY_GOGGLES = 'safety_goggles',       // משקפי הגנה OD
  WARNING_LIGHT = 'warning_light',         // נורת אזהרה
  INTERLOCK = 'interlock',                 // אינטרלוק דלת
  BEAM_STOP = 'beam_stop',                 // עוצר קרן
  LASER_BARRIER = 'laser_barrier',         // מחסום לייזר
  LASER_CURTAIN = 'laser_curtain',         // וילון לייזר
  POWER_METER = 'power_meter'              // מד עוצמה
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור חוקי |
|-----------|---------|------------|
| ביקורת רבעונית | כל 3 חודשים | תקנות לייזר |
| ביקורת שנתית | כל 12 חודשים | תקנות לייזר |
| בדיקת משקפי הגנה | כל 12 חודשים | ת"י 60825 |
| כיול מד עוצמה | כל 12 חודשים | יצרן |
| הדרכת עובדים | כל 12 חודשים | תקנות לייזר |

#### סיווגי סיכון:
- Class 1, 1M, 1C
- Class 2, 2M
- Class 3R, 3B
- Class 4

---

### 2. 🔥 בטיחות אש (FIRE)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| חוק הרשויות המקומיות (שירותי כבאות) | התשי"ט | 1959 |
| צו רישוי עסקים | התשע"ג | 2013 |
| תקן ישראלי - גלאי אש | ת"י 1220 | |
| תקן ישראלי - ספרינקלרים | ת"י 1596/1928 | |
| הוראות נציב כבאות | 536 ואחרים | |

#### סוגי ציוד:
```typescript
enum FireEquipmentType {
  // ציוד כיבוי
  FIRE_EXTINGUISHER = 'fire_extinguisher',       // מטף כיבוי
  FIRE_EXTINGUISHER_CO2 = 'fire_extinguisher_co2',
  FIRE_EXTINGUISHER_FOAM = 'fire_extinguisher_foam',
  FIRE_EXTINGUISHER_POWDER = 'fire_extinguisher_powder',
  FIRE_EXTINGUISHER_WATER = 'fire_extinguisher_water',
  FIRE_HOSE_REEL = 'fire_hose_reel',             // גלגלון כיבוי
  FIRE_HYDRANT = 'fire_hydrant',                 // ברז כיבוי
  FIRE_CABINET = 'fire_cabinet',                 // ארון כיבוי
  
  // מערכות אוטומטיות
  SPRINKLER = 'sprinkler',                       // ספרינקלר
  FIRE_PUMP = 'fire_pump',                       // משאבת כיבוי
  FM200_SYSTEM = 'fm200_system',                 // מערכת FM-200
  CO2_SYSTEM = 'co2_system',                     // מערכת CO2
  FOAM_SYSTEM = 'foam_system',                   // מערכת קצף
  AEROSOL_SYSTEM = 'aerosol_system',             // מערכת אירוסול
  KITCHEN_HOOD_SYSTEM = 'kitchen_hood_system',   // מערכת כיבוי מנדפים
  
  // גילוי והתרעה
  SMOKE_DETECTOR = 'smoke_detector',             // גלאי עשן
  HEAT_DETECTOR = 'heat_detector',               // גלאי חום
  FLAME_DETECTOR = 'flame_detector',             // גלאי להבה
  GAS_DETECTOR = 'gas_detector',                 // גלאי גז
  FIRE_ALARM_PANEL = 'fire_alarm_panel',         // רכזת גילוי אש
  MANUAL_CALL_POINT = 'manual_call_point',       // לחצן אזעקה ידני
  FIRE_ALARM_BELL = 'fire_alarm_bell',           // צופר/פעמון אזעקה
  
  // מערכות פסיביות
  FIRE_DOOR = 'fire_door',                       // דלת אש
  FIRE_DAMPER = 'fire_damper',                   // משתק אש
  FIRE_SHUTTER = 'fire_shutter',                 // תריס אש
  FIRE_CURTAIN = 'fire_curtain',                 // וילון אש
  FIREPROOFING = 'fireproofing',                 // ציפוי עמיד אש
  
  // מערכות שליטה בעשן
  SMOKE_EXHAUST = 'smoke_exhaust',               // מערכת שחרור עשן
  PRESSURIZATION_FAN = 'pressurization_fan',     // מפוח דיחוס
  SMOKE_DAMPER = 'smoke_damper',                 // משתק עשן
  
  // תאורה ושילוט
  EMERGENCY_LIGHT = 'emergency_light',           // תאורת חירום
  EXIT_SIGN = 'exit_sign',                       // שלט יציאה
  FIRE_SAFETY_SIGN = 'fire_safety_sign'          // שילוט בטיחות אש
}
```

#### תדירות בדיקות:
| סוג ציוד | תדירות | תקן/הוראה |
|----------|---------|-----------|
| מטפים - בדיקה חזותית | חודשי | ת"י 129 |
| מטפים - בדיקה מלאה | שנתי | ת"י 129 |
| מטפים - בדיקה הידרוסטטית | כל 5 שנים | ת"י 129 |
| גלגלונים | שנתי | ת"י 2206 |
| ספרינקלרים | שנתי | ת"י 1928 |
| גלאי עשן/חום | שנתי | ת"י 1220 |
| רכזת גילוי אש | שנתי | ת"י 1220 חלק 11 |
| משאבות כיבוי | שנתי | ת"י 1596 |
| דלתות אש | שנתי | - |
| תאורת חירום | שנתי | ת"י 20 |
| מערכת שליטה בעשן | שנתי | ת"י 1001 |
| בדיקת אינטגרציה | שנתי | הוראת נציב 536 |
| מבנה סיכון 2 | פעמיים בשנה | - |

#### דרגות סיכון מבנה:
- סיכון 1 - בדיקה שנתית
- סיכון 2 - בדיקה פעמיים בשנה
- סיכון 3 - בדיקה רבעונית

---

### 3. ⚡ בטיחות חשמל (ELECTRICAL)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות הבטיחות בעבודה (חשמל) | התש"ן | 1990 |
| חוק החשמל | התשי"ד | 1954 |
| תקנות החשמל | שונות | |

#### סוגי ציוד:
```typescript
enum ElectricalEquipmentType {
  ELECTRICAL_PANEL = 'electrical_panel',         // לוח חשמל ראשי
  DISTRIBUTION_BOARD = 'distribution_board',     // לוח חלוקה
  TRANSFORMER = 'transformer',                   // שנאי
  GENERATOR = 'generator',                       // גנרטור
  UPS = 'ups',                                   // אל-פסק
  GROUNDING_SYSTEM = 'grounding_system',         // מערכת הארקה
  LIGHTNING_ROD = 'lightning_rod',               // מוט ברק
  CIRCUIT_BREAKER = 'circuit_breaker',           // מפסק זרם
  RCD = 'rcd',                                   // מפסק פחת
  SURGE_PROTECTOR = 'surge_protector',           // מגן ברקים
  CABLE_TRAY = 'cable_tray',                     // מגש כבלים
  CONDUIT = 'conduit',                           // תעלת כבלים
  SOCKET_OUTLET = 'socket_outlet',               // שקע חשמל
  ISOLATOR = 'isolator',                         // מפסק מבודד
  MOTOR = 'motor',                               // מנוע חשמלי
  VFD = 'vfd'                                    // ממיר תדר
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור |
|-----------|---------|------|
| בדיקת הארקה | שנתי | תקנות חשמל |
| בדיקת לוחות חשמל | שנתי | תקנות חשמל |
| בדיקת מפסקי פחת | חודשי (עצמי) | יצרן |
| בדיקת מפסקי פחת - מלאה | שנתי | תקנות חשמל |
| תרמוגרפיה | שנתי | מומלץ |
| בדיקת גנרטור | שנתי | יצרן |
| בדיקת UPS | שנתי | יצרן |

---

### 4. ☢️ חומרים מסוכנים (CHEMICAL)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| חוק החומרים המסוכנים | התשנ"ג | 1993 |
| תקנות החומרים המסוכנים (סיווג ופטור) | התשנ"ו | 1996 |
| תקנות גיליון בטיחות (SDS) | התשנ"ח | 1998 |
| תקנות עובדים בחומרי הדברה | התשכ"ד | 1964 |
| תקנות גיהות בממיסים | התשנ"א | 1990 |
| תקנות ADR (הובלה) | | |
| חוק למניעת מפגעי אסבסט | התשע"א | 2011 |

#### סוגי ציוד ומתקנים:
```typescript
enum ChemicalEquipmentType {
  // אחסון
  CHEMICAL_CABINET = 'chemical_cabinet',         // ארון חומרים
  FLAMMABLE_CABINET = 'flammable_cabinet',       // ארון דליקים
  ACID_CABINET = 'acid_cabinet',                 // ארון חומצות
  GAS_CABINET = 'gas_cabinet',                   // ארון גזים
  CHEMICAL_STORAGE = 'chemical_storage',         // מחסן חומרים
  BUNDING = 'bunding',                           // אמבטיה/סכר
  IBC_CONTAINER = 'ibc_container',               // מיכל IBC
  DRUM = 'drum',                                 // חבית
  GAS_CYLINDER = 'gas_cylinder',                 // בלון גז
  
  // בטיחות
  SAFETY_SHOWER = 'safety_shower',               // מקלחת חירום
  EYE_WASH = 'eye_wash',                         // שטיפת עיניים
  FUME_HOOD = 'fume_hood',                       // מנדף
  BIOSAFETY_CABINET = 'biosafety_cabinet',       // כיפת ביו-בטיחות
  SPILL_KIT = 'spill_kit',                       // ערכת שפיכה
  NEUTRALIZATION_KIT = 'neutralization_kit',     // ערכת נטרול
  
  // ניטור
  GAS_DETECTOR_FIXED = 'gas_detector_fixed',     // גלאי גז קבוע
  GAS_DETECTOR_PORTABLE = 'gas_detector_portable', // גלאי גז נייד
  LEL_DETECTOR = 'lel_detector',                 // גלאי LEL
  OXYGEN_MONITOR = 'oxygen_monitor',             // מד חמצן
  
  // אוורור
  LOCAL_EXHAUST = 'local_exhaust',               // יניקה מקומית
  SCRUBBER = 'scrubber',                         // מגדל שטיפה
  VENTILATION_SYSTEM = 'ventilation_system'      // מערכת אוורור
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור |
|-----------|---------|------|
| בדיקות סביבתיות תעסוקתיות | לפי סיכון | תקנות ניטור |
| בדיקת מנדפים | שנתי | ת"י |
| מקלחות חירום | שבועי (עצמי) / שנתי (מלא) | |
| גלאי גזים | לפי יצרן | |
| ארונות אחסון | שנתי | |
| בדיקות ניטור ביולוגי | לפי חומר | תקנות ניטור |

#### סיווגי חומרים (GHS):
- דליק
- מחמצן
- גז דחוס
- מאכל
- רעיל
- מגרה
- מסוכן לבריאות
- מסוכן לסביבה

---

### 5. 🏗️ בטיחות בבנייה (CONSTRUCTION)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות הבטיחות בעבודה (עבודות בנייה) | התשמ"ח | 1988 |
| תקנות תכנון וביצוע | | |
| צו הבטיחות (עבודות בנייה) | | |

#### סוגי ציוד:
```typescript
enum ConstructionEquipmentType {
  SCAFFOLD = 'scaffold',                         // פיגום
  MOBILE_SCAFFOLD = 'mobile_scaffold',           // פיגום נייד
  SUSPENDED_SCAFFOLD = 'suspended_scaffold',     // פיגום תלוי
  GUARDRAIL = 'guardrail',                       // מעקה בטיחות
  SAFETY_NET = 'safety_net',                     // רשת בטיחות
  TEMPORARY_FENCE = 'temporary_fence',           // גדר זמנית
  EXCAVATION_SUPPORT = 'excavation_support',     // תמיכת חפירה
  FORMWORK = 'formwork',                         // טפסות
  SHORING = 'shoring',                           // תמיכות
  CONCRETE_PUMP = 'concrete_pump',               // משאבת בטון
  TOWER_CRANE = 'tower_crane',                   // עגורן צריח
  CONCRETE_MIXER = 'concrete_mixer'              // מערבל בטון
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור |
|-----------|---------|------|
| בדיקת פיגומים | יומי (חזותי) / שבועי (מלא) | תקנות בנייה |
| בדיקת עגורנים | 14 חודשים | תקנות הרמה |
| בדיקת חפירות | יומי | תקנות בנייה |
| בדיקת מנהל עבודה | - | תקנות בנייה |

---

### 6. 🧗 עבודה בגובה (HEIGHTS)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות הבטיחות בעבודה (עבודה בגובה) | התשס"ז | 2007 |

#### סוגי ציוד:
```typescript
enum HeightsEquipmentType {
  // סולמות
  LADDER_FIXED = 'ladder_fixed',                 // סולם קבוע
  LADDER_PORTABLE = 'ladder_portable',           // סולם נייד
  LADDER_EXTENSION = 'ladder_extension',         // סולם מתארך
  LADDER_STEP = 'ladder_step',                   // סולם מדרגות
  
  // ציוד אישי
  FULL_BODY_HARNESS = 'full_body_harness',       // רתמת גוף מלאה
  LANYARD = 'lanyard',                           // רצועת קישור
  SHOCK_ABSORBER = 'shock_absorber',             // סופג אנרגיה
  SRL = 'srl',                                   // מגביל נפילה
  ANCHOR_POINT = 'anchor_point',                 // נקודת עיגון
  LIFELINE = 'lifeline',                         // קו חיים
  CARABINER = 'carabiner',                       // סגיר
  ROPE = 'rope',                                 // חבל
  
  // במות הרמה
  MEWP_SCISSOR = 'mewp_scissor',                 // במת הרמה מספריים
  MEWP_BOOM = 'mewp_boom',                       // במת הרמה זרוע
  MEWP_VERTICAL = 'mewp_vertical',               // במת הרמה אנכית
  
  // אחר
  SAFETY_NET = 'safety_net',                     // רשת בטיחות
  GUARDRAIL = 'guardrail',                       // מעקה
  ROOF_ANCHOR = 'roof_anchor'                    // עוגן גג
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור |
|-----------|---------|------|
| רתמות וציוד אישי | לפני כל שימוש + שנתי | תקנות גובה |
| סולמות | לפני שימוש + שנתי | תקנות גובה |
| קווי חיים | שנתי | תקנות גובה |
| במות הרמה (MEWP) | 14 חודשים | תקנות הרמה |
| נקודות עיגון | שנתי | תקנות גובה |
| הדרכת עובדים | לפני עבודה ראשונה | תקנות גובה |
| רענון הדרכה | כל 5 שנים | תקנות גובה |

---

### 7. 🏗️ מתקני הרמה (LIFTING)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| פקודת הבטיחות בעבודה - סימן ז' | התש"ל | 1970 |
| תקנות עגורנאים ומפעילי מכונות הרמה | התשנ"ג | 1992 |
| תקנות בדיקת מתקני הרמה | | |

#### סוגי ציוד:
```typescript
enum LiftingEquipmentType {
  // עגורנים
  TOWER_CRANE = 'tower_crane',                   // עגורן צריח
  MOBILE_CRANE = 'mobile_crane',                 // עגורן נייד
  OVERHEAD_CRANE = 'overhead_crane',             // עגורן גשר
  GANTRY_CRANE = 'gantry_crane',                 // עגורן שער
  JIB_CRANE = 'jib_crane',                       // עגורן זרוע
  
  // מלגזות
  FORKLIFT_COUNTERBALANCE = 'forklift_counterbalance', // מלגזה נגדית
  FORKLIFT_REACH = 'forklift_reach',             // מלגזה ריצ'
  FORKLIFT_TELESCOPIC = 'forklift_telescopic',   // מלגזה טלסקופית
  PALLET_TRUCK_ELECTRIC = 'pallet_truck_electric', // עגלת משטחים חשמלית
  ORDER_PICKER = 'order_picker',                 // ליקט הזמנות
  
  // מנופים
  HOIST_ELECTRIC = 'hoist_electric',             // מנוף חשמלי
  HOIST_MANUAL = 'hoist_manual',                 // מנוף ידני
  WINCH = 'winch',                               // כננת
  
  // מעליות ודוכנים
  ELEVATOR_PASSENGER = 'elevator_passenger',     // מעלית נוסעים
  ELEVATOR_FREIGHT = 'elevator_freight',         // מעלית משא
  SCISSOR_LIFT = 'scissor_lift',                 // במה מספריים
  DOCK_LEVELER = 'dock_leveler',                 // רמפת עגינה
  LIFT_TABLE = 'lift_table',                     // שולחן הרמה
  CAR_LIFT = 'car_lift',                         // ליפט לרכב
  LOADING_RAMP = 'loading_ramp',                 // רמפת טעינה
  TAIL_LIFT = 'tail_lift',                       // דופן אחורית
  
  // אביזרי הרמה
  SLING_CHAIN = 'sling_chain',                   // מענב שרשרת
  SLING_WIRE = 'sling_wire',                     // מענב כבל
  SLING_TEXTILE = 'sling_textile',               // מענב טקסטיל
  SHACKLE = 'shackle',                           // אונקל
  HOOK = 'hook',                                 // וו
  EYE_BOLT = 'eye_bolt',                         // בורג עין
  LIFTING_BEAM = 'lifting_beam',                 // קורת הרמה
  SPREADER_BAR = 'spreader_bar',                 // מוט פיזור
  MAGNET = 'magnet',                             // מגנט הרמה
  VACUUM_LIFTER = 'vacuum_lifter',               // מרים ואקום
  LIFTING_BASKET = 'lifting_basket',             // סל הרמה
  SKIP = 'skip'                                  // אשפתון
}
```

#### תדירות בדיקות:
| סוג ציוד | תדירות | מקור |
|----------|---------|------|
| עגורנים | 14 חודשים | פקודת בטיחות |
| מלגזות | 14 חודשים | תקנות הרמה |
| מעליות | 6 חודשים | פקודת בטיחות |
| אביזרי הרמה | 6 חודשים | פקודת בטיחות |
| במות הרמה | 14 חודשים | תקנות הרמה |
| ליפטים למוסכים | 14 חודשים | תקנות הרמה |
| רמפות | 14 חודשים | תקנות הרמה |
| כננות | 14 חודשים | תקנות הרמה |

#### סוגי עגורנים:
- סוג א' - עגורן צריח
- סוג ב' - עגורן נייד על גלגלים/זחלים
- סוג ג' - עגורן ימי
- סוג ד' - עגורן רכבת

---

### 8. 💨 כלי לחץ וקיטור (PRESSURE)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| פקודת הבטיחות בעבודה - סימן י'-יג' | התש"ל | 1970 |
| תקנות בדיקת מתקני לחץ | התשכ"ז | 1967 |
| תקנות בדיקה הידרוסטטית | התשנ"ו | 1995 |
| תקנות מפעיל דוד קיטור | התש"ס | 2000 |
| תקנות התקני בטיחות בדוד קיטור | התשמ"ז | 1986 |

#### סוגי ציוד:
```typescript
enum PressureEquipmentType {
  // דודי קיטור
  STEAM_BOILER = 'steam_boiler',                 // דוד קיטור
  HOT_WATER_BOILER = 'hot_water_boiler',         // דוד מים חמים
  ECONOMIZER = 'economizer',                     // חוסך
  SUPERHEATER = 'superheater',                   // משחן
  
  // קולטים
  STEAM_RECEIVER = 'steam_receiver',             // קולט קיטור
  AIR_RECEIVER = 'air_receiver',                 // קולט אוויר
  
  // מכלי לחץ
  PRESSURE_VESSEL = 'pressure_vessel',           // מיכל לחץ
  AUTOCLAVE = 'autoclave',                       // אוטוקלב
  STERILIZER = 'sterilizer',                     // מעקר
  STEAM_COOKER = 'steam_cooker',                 // סיר בישול בקיטור
  
  // מדחסים
  AIR_COMPRESSOR = 'air_compressor',             // מדחס אוויר
  REFRIGERATION_COMPRESSOR = 'refrigeration_compressor', // מדחס קירור
  
  // אביזרים
  SAFETY_VALVE = 'safety_valve',                 // שסתום ביטחון
  PRESSURE_GAUGE = 'pressure_gauge',             // מד לחץ
  WATER_LEVEL_GAUGE = 'water_level_gauge'        // מד מפלס מים
}
```

#### תדירות בדיקות:
| סוג ציוד | סוג בדיקה | תדירות | מקור |
|----------|-----------|---------|------|
| דוד קיטור | בדיקה קרה+חמה | 14 חודשים | פקודת בטיחות |
| דוד קיטור | הידרוסטטית | 9 שנים, אח"כ כל 6/3 שנים | תקנות הידרו |
| קולט קיטור | בדיקה | 26 חודשים | פקודת בטיחות |
| קולט קיטור | הידרוסטטית | 10 שנים, אח"כ כל 6 שנים | תקנות הידרו |
| קולט אוויר | בדיקה | 26 חודשים | פקודת בטיחות |
| קולט אוויר | הידרוסטטית | 10 שנים, אח"כ כל 6 שנים | תקנות הידרו |
| אוטוקלב | בדיקה | 14 חודשים | תקנות |

---

### 9. ⚙️ מכונות וציוד (MACHINERY)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| פקודת הבטיחות בעבודה - סימן ד' | התש"ל | 1970 |
| תקנות מכירה והשכרה של מכונות | התסס"א | 2001 |
| תקנות גידור מכונות | | |
| תקן CE | EN | |

#### סוגי ציוד:
```typescript
enum MachineryType {
  // מכונות עיבוד שבבי
  LATHE = 'lathe',                               // מחרטה
  MILLING_MACHINE = 'milling_machine',           // כרסומת
  DRILLING_MACHINE = 'drilling_machine',         // מקדחה
  GRINDING_MACHINE = 'grinding_machine',         // משחזת
  CNC_MACHINE = 'cnc_machine',                   // מכונת CNC
  
  // מכונות עיבוד פח
  PRESS_BRAKE = 'press_brake',                   // מכבש כיפוף
  SHEAR = 'shear',                               // גיליוטינה
  PUNCH_PRESS = 'punch_press',                   // מכבש ניקוב
  ROLL_FORMER = 'roll_former',                   // מכונת גלגול
  
  // מכונות נגרות
  TABLE_SAW = 'table_saw',                       // מסור שולחן
  BAND_SAW = 'band_saw',                         // מסור סרט
  PLANER = 'planer',                             // מקצועה
  JOINTER = 'jointer',                           // משטחת
  ROUTER = 'router',                             // פריזר
  
  // מכונות אחרות
  CONVEYOR = 'conveyor',                         // מסוע
  ROBOT = 'robot',                               // רובוט
  PACKAGING_MACHINE = 'packaging_machine',       // מכונת אריזה
  PRINTING_PRESS = 'printing_press',             // מכונת דפוס
  INJECTION_MOLDER = 'injection_molder',         // מכונת הזרקה
  EXTRUDER = 'extruder',                         // מכבש שחול
  MIXER = 'mixer',                               // מערבל
  CENTRIFUGE = 'centrifuge',                     // צנטריפוגה
  PUMP = 'pump'                                  // משאבה
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור |
|-----------|---------|------|
| בדיקת מיגונים | לפני שימוש + שנתי | פקודת בטיחות |
| בדיקת מערכות בטיחות | שנתי | CE / יצרן |
| LOTO | לפי צורך | תקנות |

---

### 10. ☢️ קרינה (RADIATION)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות בטיחות בקרינה מייננת | התשנ"ג | 1992 |
| חוק הקרינה הבלתי מייננת | התשס"ו | 2006 |
| תקנות לייזר | התשס"ה | 2005 |
| פקודת הבטיחות (קרינה) | | |

#### סוגי ציוד:
```typescript
enum RadiationEquipmentType {
  // קרינה מייננת
  XRAY_MACHINE = 'xray_machine',                 // מכשיר רנטגן
  CT_SCANNER = 'ct_scanner',                     // סורק CT
  GAMMA_SOURCE = 'gamma_source',                 // מקור גמא
  NUCLEAR_GAUGE = 'nuclear_gauge',               // מד גרעיני
  
  // מגנים
  LEAD_SHIELD = 'lead_shield',                   // מגן עופרת
  LEAD_APRON = 'lead_apron',                     // סינר עופרת
  LEAD_GLASSES = 'lead_glasses',                 // משקפי עופרת
  
  // ניטור
  DOSIMETER = 'dosimeter',                       // דוזימטר
  RADIATION_MONITOR = 'radiation_monitor',       // מד קרינה
  AREA_MONITOR = 'area_monitor',                 // מד אזורי
  
  // קרינה לא מייננת
  UV_LAMP = 'uv_lamp',                           // מנורת UV
  IR_HEATER = 'ir_heater',                       // מחמם IR
  MICROWAVE_EQUIPMENT = 'microwave_equipment',   // ציוד מיקרוגל
  RF_EQUIPMENT = 'rf_equipment'                  // ציוד RF
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור |
|-----------|---------|------|
| כיול דוזימטרים | לפי יצרן | תקנות קרינה |
| בדיקות מקורות רדיואקטיביים | שנתי | תקנות קרינה |
| בדיקות רנטגן | שנתי | משרד הבריאות |
| בדיקות עובדים | שנתי | תקנות קרינה |

---

### 11. 🔊 רעש תעסוקתי (NOISE)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות גיהות ובריאות העובדים ברעש | התשמ"ד | 1984 |
| תקנות ניטור סביבתי | התשע"א | 2011 |

#### סוגי ציוד:
```typescript
enum NoiseEquipmentType {
  NOISE_BARRIER = 'noise_barrier',               // מחסום רעש
  ACOUSTIC_ENCLOSURE = 'acoustic_enclosure',     // מעטפת אקוסטית
  SILENCER = 'silencer',                         // משתיק
  EAR_PLUGS = 'ear_plugs',                       // אטמי אוזניים
  EAR_MUFFS = 'ear_muffs',                       // אוזניות מגן
  SOUND_LEVEL_METER = 'sound_level_meter',       // מד רעש
  DOSIMETER_NOISE = 'dosimeter_noise'            // דוזימטר רעש
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור |
|-----------|---------|------|
| מדידות רעש סביבתי | שנתי | תקנות רעש |
| בדיקות שמיעה לעובדים | שנתי (מעל 85 dB) | תקנות רעש |
| כיול מדי רעש | שנתי | יצרן |

---

### 12. 🪑 ארגונומיה (ERGONOMICS)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות הגיינה וארגונומיה | | |
| הנחיות משרד העבודה | | |
| תקני ISO | | |

#### סוגי ציוד:
```typescript
enum ErgonomicsEquipmentType {
  ERGONOMIC_CHAIR = 'ergonomic_chair',           // כיסא ארגונומי
  ADJUSTABLE_DESK = 'adjustable_desk',           // שולחן מתכוונן
  MONITOR_ARM = 'monitor_arm',                   // זרוע מסך
  KEYBOARD_TRAY = 'keyboard_tray',               // מגש מקלדת
  FOOTREST = 'footrest',                         // הדום
  DOCUMENT_HOLDER = 'document_holder',           // מחזיק מסמכים
  ANTI_FATIGUE_MAT = 'anti_fatigue_mat',         // משטח נגד עייפות
  LIFTING_AID = 'lifting_aid',                   // עזר הרמה
  EXOSKELETON = 'exoskeleton'                    // שלד חיצוני
}
```

---

### 13. 🚧 חללים מוקפים (CONFINED_SPACE)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| הנחיות משרד העבודה | | |
| תקנות חללים מוקפים | (טיוטה) | |

#### סוגי ציוד:
```typescript
enum ConfinedSpaceEquipmentType {
  GAS_MONITOR_4 = 'gas_monitor_4',               // גלאי 4 גזים
  VENTILATION_FAN = 'ventilation_fan',           // מפוח אוורור
  RESCUE_TRIPOD = 'rescue_tripod',               // משולש חילוץ
  RESCUE_WINCH = 'rescue_winch',                 // כננת חילוץ
  SCBA = 'scba',                                 // מערכת נשימה עצמית
  SUPPLIED_AIR = 'supplied_air',                 // אוויר מסופק
  ESCAPE_SET = 'escape_set',                     // ערכת מילוט
  COMMUNICATION_SYSTEM = 'communication_system', // מערכת תקשורת
  ENTRY_PERMIT = 'entry_permit'                  // היתר כניסה
}
```

#### תדירות בדיקות:
| סוג בדיקה | תדירות | מקור |
|-----------|---------|------|
| גלאי גזים | לפי יצרן + כיול | |
| ציוד נשימה | לפני שימוש + שנתי | |
| ציוד חילוץ | שנתי | |

---

### 14. 🦠 סיכונים ביולוגיים (BIOLOGICAL)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות בטיחות במעבדות | התסס"א | 2001 |
| חוק בריאות הציבור | | |
| הנחיות משרד הבריאות | | |

#### סוגי ציוד:
```typescript
enum BiologicalEquipmentType {
  BIOSAFETY_CABINET = 'biosafety_cabinet',       // כיפת ביו-בטיחות
  AUTOCLAVE = 'autoclave',                       // אוטוקלב
  SHARPS_CONTAINER = 'sharps_container',         // מיכל חדים
  BIOHAZARD_WASTE = 'biohazard_waste',           // פסולת ביו-רפואית
  LAB_COAT = 'lab_coat',                         // חלוק מעבדה
  FACE_SHIELD = 'face_shield',                   // מגן פנים
  SAFETY_GLASSES = 'safety_glasses',             // משקפי מגן
  GLOVES_NITRILE = 'gloves_nitrile'              // כפפות ניטריל
}
```

---

### 15. 🚚 תחבורה והובלה (TRANSPORTATION)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| פקודת התעבורה | | |
| תקנות הובלת חומרים מסוכנים (ADR) | | |
| תקנות התעבורה | התשכ"א | 1961 |

#### סוגי ציוד:
```typescript
enum TransportationEquipmentType {
  TRUCK = 'truck',                               // משאית
  TANKER = 'tanker',                             // מכלית
  HAZMAT_VEHICLE = 'hazmat_vehicle',             // רכב חומ"ס
  FORKLIFT = 'forklift',                         // מלגזה
  PALLET_TRUCK = 'pallet_truck',                 // עגלת משטחים
  LOADING_DOCK = 'loading_dock',                 // רציף טעינה
  WHEEL_CHOCK = 'wheel_chock',                   // בלם גלגל
  SAFETY_CONE = 'safety_cone',                   // קונוס
  WARNING_TRIANGLE = 'warning_triangle'          // משולש אזהרה
}
```

---

### 16. 🌍 סביבה (ENVIRONMENTAL)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| חוק אוויר נקי | התשס"ח | 2008 |
| חוק מניעת זיהום הים | | |
| חוק רישוי עסקים | | |
| חוק החומרים המסוכנים | התשנ"ג | 1993 |

#### סוגי ציוד:
```typescript
enum EnvironmentalEquipmentType {
  AIR_MONITOR = 'air_monitor',                   // מד איכות אוויר
  WATER_MONITOR = 'water_monitor',               // מד איכות מים
  STACK_MONITOR = 'stack_monitor',               // מד ארובה
  SCRUBBER = 'scrubber',                         // מגדל שטיפה
  BAG_FILTER = 'bag_filter',                     // מסנן שקים
  OIL_SEPARATOR = 'oil_separator',               // מפריד שמן
  WASTEWATER_PLANT = 'wastewater_plant',         // מט"ש
  CONTAINMENT = 'containment'                    // אמצעי בלימה
}
```

---

### 17. 🍽️ בטיחות מזון (FOOD)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| פקודת בריאות הציבור (מזון) | התשמ"ג | 1983 |
| תקנות HACCP | | |
| תקני ISO 22000 | | |

---

### 18. 🏥 בטיחות רפואית (MEDICAL)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| פקודת הרוקחים | | |
| תקנות ציוד רפואי | | |
| הנחיות משרד הבריאות | | |

---

### 19. 🧤 ציוד מגן אישי (PPE)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות ציוד מגן אישי | התשנ"ז | 1997 |
| תקני EN/CE | | |

#### סוגי ציוד:
```typescript
enum PPEType {
  // הגנת ראש
  HARD_HAT = 'hard_hat',                         // קסדת בטיחות
  BUMP_CAP = 'bump_cap',                         // כובע מגן
  HAIR_NET = 'hair_net',                         // רשת שיער
  
  // הגנת עיניים
  SAFETY_GLASSES = 'safety_glasses',             // משקפי מגן
  SAFETY_GOGGLES = 'safety_goggles',             // משקפות מגן
  FACE_SHIELD = 'face_shield',                   // מגן פנים
  WELDING_HELMET = 'welding_helmet',             // קסדת ריתוך
  
  // הגנת שמיעה
  EAR_PLUGS = 'ear_plugs',                       // אטמי אוזניים
  EAR_MUFFS = 'ear_muffs',                       // אוזניות מגן
  
  // הגנת נשימה
  DUST_MASK = 'dust_mask',                       // מסכת אבק
  HALF_MASK = 'half_mask',                       // חצי מסכה
  FULL_MASK = 'full_mask',                       // מסכה מלאה
  PAPR = 'papr',                                 // מערכת הנעה
  SCBA = 'scba',                                 // מערכת נשימה עצמית
  
  // הגנת ידיים
  GLOVES_LEATHER = 'gloves_leather',             // כפפות עור
  GLOVES_NITRILE = 'gloves_nitrile',             // כפפות ניטריל
  GLOVES_CUT_RESISTANT = 'gloves_cut_resistant', // כפפות נגד חתך
  GLOVES_CHEMICAL = 'gloves_chemical',           // כפפות כימיות
  GLOVES_HEAT = 'gloves_heat',                   // כפפות חום
  GLOVES_ELECTRICAL = 'gloves_electrical',       // כפפות חשמל
  
  // הגנת גוף
  COVERALL = 'coverall',                         // סרבל
  APRON = 'apron',                               // סינר
  HIGH_VIS_VEST = 'high_vis_vest',               // אפוד זוהר
  LAB_COAT = 'lab_coat',                         // חלוק מעבדה
  CHEMICAL_SUIT = 'chemical_suit',               // חליפה כימית
  
  // הגנת רגליים
  SAFETY_BOOTS = 'safety_boots',                 // נעלי בטיחות
  SAFETY_SHOES = 'safety_shoes',                 // נעלי בטיחות
  METATARSAL_GUARDS = 'metatarsal_guards',       // מגני כף רגל
  GAITERS = 'gaiters',                           // חותלות
  
  // הגנה מנפילה
  HARNESS = 'harness',                           // רתמה
  LANYARD = 'lanyard',                           // רצועת קישור
  SRL = 'srl'                                    // מגביל נפילה
}
```

#### תדירות בדיקות:
| סוג ציוד | תדירות | מקור |
|----------|---------|------|
| קסדות | לפני שימוש + שנתי | תקן |
| רתמות | לפני שימוש + שנתי | תקנות גובה |
| כפפות חשמל | 6 חודשים | תקנות חשמל |
| ציוד נשימה | לפי יצרן | |
| משקפי לייזר | שנתי | תקנות לייזר |

---

### 20. 🚨 חירום והצלה (EMERGENCY)

#### סוגי ציוד:
```typescript
enum EmergencyEquipmentType {
  FIRST_AID_KIT = 'first_aid_kit',               // ערכת עזרה ראשונה
  AED = 'aed',                                   // דפיברילטור
  STRETCHER = 'stretcher',                       // אלונקה
  SPINE_BOARD = 'spine_board',                   // לוח גב
  EMERGENCY_SHOWER = 'emergency_shower',         // מקלחת חירום
  EYE_WASH = 'eye_wash',                         // שטיפת עיניים
  EMERGENCY_PHONE = 'emergency_phone',           // טלפון חירום
  ASSEMBLY_POINT = 'assembly_point',             // נקודת התכנסות
  EVACUATION_CHAIR = 'evacuation_chair',         // כיסא פינוי
  RESCUE_EQUIPMENT = 'rescue_equipment'          // ציוד חילוץ
}
```

#### תדירות בדיקות:
| סוג ציוד | תדירות | מקור |
|----------|---------|------|
| ערכת עזרה ראשונה | חודשי | תקנות עזרה ראשונה |
| AED | חודשי | יצרן |
| מקלחות חירום | שבועי | |

---

### 21. 🕳️ חפירות ותעלות (EXCAVATION)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות הבטיחות בעבודה (עבודות בנייה) | התשמ"ח | 1988 |

---

### 22. 🔥 ריתוך וחיתוך (WELDING)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות הבטיחות (ריתוך וחיתוך) | | |
| תקנות גיהות בריתוך | | |

#### סוגי ציוד:
```typescript
enum WeldingEquipmentType {
  WELDING_MACHINE = 'welding_machine',           // מכונת ריתוך
  WELDING_HELMET = 'welding_helmet',             // קסדת ריתוך
  WELDING_GLOVES = 'welding_gloves',             // כפפות ריתוך
  WELDING_APRON = 'welding_apron',               // סינר ריתוך
  WELDING_SCREEN = 'welding_screen',             // מסך ריתוך
  GAS_CYLINDER = 'gas_cylinder',                 // בלון גז
  REGULATOR = 'regulator',                       // רגולטור
  FLASHBACK_ARRESTOR = 'flashback_arrestor',     // עוצר להבה
  FUME_EXTRACTOR = 'fume_extractor'              // יונק אדים
}
```

---

### 23. 🏗️ פיגומים (SCAFFOLDING)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקנות הבטיחות בעבודה (עבודות בנייה) | התשמ"ח | 1988 |
| תקנות עבודה בגובה | התשס"ז | 2007 |

---

### 24. ♻️ אסבסט (ASBESTOS)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| חוק למניעת מפגעי אסבסט ואבק מזיק | התשע"א | 2011 |
| תקנות אסבסט | | |

---

### 25. 🎡 מתקני משחק (PLAYGROUND)

#### חקיקה רלוונטית:
| חוק/תקנה | מספר | שנה |
|----------|------|-----|
| תקן ישראלי למתקני משחק | ת"י 1498 | |
| חוק הרשויות המקומיות | | |

---

## 📅 מבנה תדירות בדיקות

```typescript
interface InspectionFrequency {
  id: string;
  
  // מקור החובה
  source: {
    type: 'law' | 'regulation' | 'standard' | 'manufacturer' | 'custom';
    name: string;           // שם החוק/תקנה/תקן
    reference: string;      // סעיף ספציפי
    url?: string;           // קישור למקור
  };
  
  // תדירות
  frequency: {
    type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semi_annual' | 'annual' | 'biennial' | 'custom';
    interval_days?: number; // לתדירות מותאמת
    interval_months?: number;
  };
  
  // תנאים
  conditions?: {
    equipment_age?: {       // לפי גיל הציוד
      threshold_years: number;
      new_frequency: InspectionFrequency;
    };
    risk_level?: {          // לפי רמת סיכון
      level: string;
      frequency: InspectionFrequency;
    };
    after_repair?: boolean; // בדיקה אחרי תיקון
    before_use?: boolean;   // בדיקה לפני כל שימוש
  };
  
  // סוג בדיקה
  inspection_type: 'visual' | 'functional' | 'full' | 'hydrostatic' | 'calibration' | 'training';
  
  // בודק נדרש
  inspector_requirements: {
    type: 'self' | 'certified' | 'authorized' | 'manufacturer';
    certification?: string; // סוג הסמכה נדרשת
  };
  
  // תיעוד
  documentation: {
    form_required: boolean;
    report_to_authority: boolean;
    authority_name?: string;
    retention_years: number;
  };
}
```

---

## 🏢 מבנה מיקומים (Locations)

```typescript
interface Location {
  id: string;
  tenantId: string;
  clientId: string;
  parentLocationId?: string;  // למבנה היררכי
  
  // פרטים בסיסיים
  name: string;
  type: LocationType;
  categories: SafetyDomain[]; // תחומי בטיחות רלוונטיים
  
  // מיקום פיזי
  building?: string;
  floor?: string;
  roomNumber?: string;
  area?: number;              // שטח במ"ר
  
  // אחראים
  responsiblePerson?: string;
  responsiblePhone?: string;
  
  // סיווג סיכון
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  hazards?: string[];
  
  // מטא-דאטה
  status: 'active' | 'inactive' | 'under_construction';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

enum LocationType {
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
  LOADING_DOCK = 'loading_dock'
}
```

---

## 🔧 מבנה ציוד (Equipment)

```typescript
interface Equipment {
  id: string;
  tenantId: string;
  clientId: string;
  locationId: string;
  
  // זיהוי
  name: string;
  type: string;              // מתוך ה-enums למעלה
  category: SafetyDomain;
  
  // פרטי יצרן
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  yearOfManufacture?: number;
  
  // מפרט טכני (דינמי לפי סוג)
  specifications: Record<string, any>;
  /*
  דוגמאות:
  - לייזר: { class: '4', wavelength: '1064nm', power: '100W' }
  - מטף: { type: 'powder', capacity: '6kg', expirationDate: '2025-01' }
  - מלגזה: { capacity: '2500kg', liftHeight: '5m', fuelType: 'electric' }
  - דוד קיטור: { pressure: '10bar', heatingArea: '50m2' }
  */
  
  // תחזוקה
  maintenance: {
    status: 'valid' | 'expired' | 'pending' | 'na';
    lastInspectionDate?: Timestamp;
    nextInspectionDate?: Timestamp;
    provider?: string;
    certificateNumber?: string;
  };
  
  // בדיקות נדרשות
  requiredInspections: InspectionFrequency[];
  
  // תיעוד
  documents?: {
    type: string;
    url: string;
    uploadedAt: Timestamp;
  }[];
  
  // מטא-דאטה
  status: 'active' | 'inactive' | 'disposed' | 'under_repair';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 📋 מבנה ביקורת (Inspection)

```typescript
interface Inspection {
  id: string;
  tenantId: string;
  clientId: string;
  locationId?: string;
  templateId?: string;
  
  // סוג וקטגוריה
  type: 'routine' | 'periodic' | 'initial' | 'post_repair' | 'special';
  category: SafetyDomain;
  
  // ציוד שנבדק
  equipmentIds: string[];
  
  // פרטי ביקורת
  inspectionDate: Timestamp;
  inspectorName: string;
  inspectorId?: string;
  inspectorCertification?: string;
  
  // ממצאים
  checklist: ChecklistItem[];
  findings: Finding[];
  overallStatus: 'pass' | 'pass_with_remarks' | 'fail';
  
  // חתימות
  signatures: {
    inspector?: SignatureData;
    client?: SignatureData;
    witness?: SignatureData;
  };
  
  // המלצות ומעקב
  recommendations?: string;
  followUpRequired: boolean;
  followUpDate?: Timestamp;
  
  // מסמכים
  attachments?: Attachment[];
  pdfUrl?: string;
  
  // מטא-דאטה
  status: 'draft' | 'completed' | 'approved' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ChecklistItem {
  id: string;
  question: string;
  status: 'pass' | 'fail' | 'na' | 'not_checked';
  notes?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  photos?: string[];
}

interface Finding {
  id: string;
  description: string;
  severity: 'observation' | 'minor' | 'major' | 'critical';
  recommendation: string;
  dueDate?: Timestamp;
  status: 'open' | 'in_progress' | 'closed';
  photos?: string[];
}
```

---

## 🔗 קישורים לחקיקה

### אתרים רשמיים:
- [משרד העבודה - מינהל הבטיחות](https://www.gov.il/he/departments/units/safety-and-occupational-health-contacts)
- [המוסד לבטיחות וגיהות](https://www.osh.org.il)
- [נבו - מאגר חקיקה](https://www.nevo.co.il)
- [מכון התקנים הישראלי](https://www.sii.org.il)
- [נציבות הכבאות](https://www.gov.il/he/departments/fire_and_rescue_authority)

---

## 📝 סיכום

מסמך זה מגדיר **27 תחומי בטיחות** עם:
- חקיקה רלוונטית
- סוגי ציוד
- תדירויות בדיקה
- דרישות תיעוד

המערכת תתמוך ב:
1. **תדירות מחוק** - לפי תקנות ותקנים
2. **תדירות יצרן** - לפי הנחיות יצרן
3. **תדירות מותאמת** - הגדרה ידנית לפי צורך
