// סוגי ציוד קריטיים - ברירת מחדל
export const CRITICAL_EQUIPMENT_TYPES = [
  'laser',              // לייזר
  'chemical',           // חומרים מסוכנים
  'radiation',          // קרינה
  'lifting',            // מתקני הרמה
  'lifting_accessories', // אביזרי הרמה
  'forklift',           // מלגזות
] as const;

// כל סוגי הציוד במערכת
export const EQUIPMENT_TYPES = {
  laser: {
    id: 'laser',
    label: 'בטיחות לייזר',
    icon: 'bolt',
    isCriticalByDefault: true,
  },
  chemical: {
    id: 'chemical',
    label: 'חומרים מסוכנים',
    icon: 'beaker',
    isCriticalByDefault: true,
  },
  radiation: {
    id: 'radiation',
    label: 'קרינה',
    icon: 'radioactive',
    isCriticalByDefault: true,
  },
  lifting: {
    id: 'lifting',
    label: 'מתקני הרמה',
    icon: 'crane',
    isCriticalByDefault: true,
  },
  lifting_accessories: {
    id: 'lifting_accessories',
    label: 'אביזרי הרמה',
    icon: 'chain',
    isCriticalByDefault: true,
  },
  forklift: {
    id: 'forklift',
    label: 'מלגזות',
    icon: 'truck',
    isCriticalByDefault: true,
  },
  fire: {
    id: 'fire',
    label: 'כיבוי אש',
    icon: 'fire',
    isCriticalByDefault: false,
  },
  general: {
    id: 'general',
    label: 'בטיחות כללית',
    icon: 'wrench',
    isCriticalByDefault: false,
  },
  electrical: {
    id: 'electrical',
    label: 'חשמל',
    icon: 'zap',
    isCriticalByDefault: false,
  },
} as const;

// פונקציה לבדיקה אם סוג ציוד הוא קריטי
export const isCriticalType = (type: string): boolean => {
  return CRITICAL_EQUIPMENT_TYPES.includes(type as any);
};

// פונקציה לקבלת פרטי סוג ציוד
export const getEquipmentTypeInfo = (type: string) => {
  return EQUIPMENT_TYPES[type as keyof typeof EQUIPMENT_TYPES] || {
    id: type,
    label: type,
    icon: 'wrench',
    isCriticalByDefault: false,
  };
};

// סטטוסי אישור
export const APPROVAL_STATUS = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const;

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];
