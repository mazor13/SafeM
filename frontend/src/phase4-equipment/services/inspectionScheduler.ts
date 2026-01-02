/**
 * AEGIS Inspection Scheduling Engine
 * מנוע תזמון בדיקות
 */

import { Equipment, isInspectionOverdue, isInspectionDueSoon } from '../types/equipment.types';

// ============================================
// 📅 Types
// ============================================

export type InspectionStatus = 
  | 'overdue'      // באיחור
  | 'due_today'    // היום
  | 'due_this_week'// השבוע
  | 'due_this_month' // החודש
  | 'upcoming'     // בקרוב (30-60 יום)
  | 'scheduled'    // מתוזמן (60+ יום)
  | 'not_scheduled'; // לא מתוזמן

export interface ScheduledInspection {
  equipmentId: string;
  equipment: Equipment;
  dueDate: Date;
  status: InspectionStatus;
  daysUntilDue: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface InspectionCalendarDay {
  date: Date;
  inspections: ScheduledInspection[];
  count: number;
}

export interface InspectionScheduleOptions {
  includeOverdue?: boolean;
  daysAhead?: number;
  priorityFilter?: ScheduledInspection['priority'][];
  domainFilter?: string[];
}

// ============================================
// 🔧 Scheduling Functions
// ============================================

/**
 * Calculate days until inspection is due
 */
export function getDaysUntilDue(dueDate: Date | string | undefined): number {
  if (!dueDate) return Infinity;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Get inspection status based on due date
 */
export function getInspectionStatus(dueDate: Date | string | undefined): InspectionStatus {
  if (!dueDate) return 'not_scheduled';
  
  const days = getDaysUntilDue(dueDate);
  
  if (days < 0) return 'overdue';
  if (days === 0) return 'due_today';
  if (days <= 7) return 'due_this_week';
  if (days <= 30) return 'due_this_month';
  if (days <= 60) return 'upcoming';
  return 'scheduled';
}

/**
 * Get priority based on status and equipment type
 */
export function getInspectionPriority(
  status: InspectionStatus,
  requiresCertification: boolean
): ScheduledInspection['priority'] {
  if (status === 'overdue') return 'critical';
  if (status === 'due_today') return 'critical';
  if (status === 'due_this_week') return 'high';
  if (status === 'due_this_month' && requiresCertification) return 'high';
  if (status === 'due_this_month') return 'medium';
  return 'low';
}

/**
 * Generate scheduled inspections from equipment list
 */
export function generateScheduledInspections(
  equipment: Equipment[],
  options: InspectionScheduleOptions = {}
): ScheduledInspection[] {
  const {
    includeOverdue = true,
    daysAhead = 90,
    priorityFilter,
    domainFilter,
  } = options;

  let scheduled: ScheduledInspection[] = equipment
    .filter(eq => eq.nextInspectionDate)
    .map(eq => {
      const dueDate = new Date(eq.nextInspectionDate!);
      const daysUntilDue = getDaysUntilDue(dueDate);
      const status = getInspectionStatus(dueDate);
      const requiresCert = eq.certificateNumber !== undefined;
      const priority = getInspectionPriority(status, requiresCert);

      return {
        equipmentId: eq.id,
        equipment: eq,
        dueDate,
        status,
        daysUntilDue,
        priority,
      };
    });

  // Filter by options
  if (!includeOverdue) {
    scheduled = scheduled.filter(s => s.daysUntilDue >= 0);
  }

  if (daysAhead !== Infinity) {
    scheduled = scheduled.filter(s => s.daysUntilDue <= daysAhead);
  }

  if (priorityFilter?.length) {
    scheduled = scheduled.filter(s => priorityFilter.includes(s.priority));
  }

  if (domainFilter?.length) {
    scheduled = scheduled.filter(s => domainFilter.includes(s.equipment.domain));
  }

  // Sort by due date (overdue first, then soonest)
  scheduled.sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  return scheduled;
}

/**
 * Group scheduled inspections by date for calendar view
 */
export function groupByDate(
  inspections: ScheduledInspection[]
): Map<string, InspectionCalendarDay> {
  const grouped = new Map<string, InspectionCalendarDay>();

  inspections.forEach(inspection => {
    const dateKey = inspection.dueDate.toISOString().split('T')[0];
    
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, {
        date: new Date(dateKey),
        inspections: [],
        count: 0,
      });
    }

    const day = grouped.get(dateKey)!;
    day.inspections.push(inspection);
    day.count++;
  });

  return grouped;
}

/**
 * Get inspections for a specific week
 */
export function getWeeklySchedule(
  inspections: ScheduledInspection[],
  weekStart: Date
): InspectionCalendarDay[] {
  const days: InspectionCalendarDay[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    
    const dayInspections = inspections.filter(insp => {
      const inspDateKey = insp.dueDate.toISOString().split('T')[0];
      return inspDateKey === dateKey;
    });

    days.push({
      date,
      inspections: dayInspections,
      count: dayInspections.length,
    });
  }

  return days;
}

/**
 * Get summary statistics
 */
export function getScheduleSummary(inspections: ScheduledInspection[]) {
  const summary = {
    total: inspections.length,
    overdue: 0,
    dueToday: 0,
    dueThisWeek: 0,
    dueThisMonth: 0,
    upcoming: 0,
    byPriority: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
    byDomain: {} as Record<string, number>,
  };

  inspections.forEach(insp => {
    // By status
    switch (insp.status) {
      case 'overdue': summary.overdue++; break;
      case 'due_today': summary.dueToday++; break;
      case 'due_this_week': summary.dueThisWeek++; break;
      case 'due_this_month': summary.dueThisMonth++; break;
      default: summary.upcoming++;
    }

    // By priority
    summary.byPriority[insp.priority]++;

    // By domain
    const domain = insp.equipment.domain;
    summary.byDomain[domain] = (summary.byDomain[domain] || 0) + 1;
  });

  return summary;
}

// ============================================
// 📅 Calendar Utilities
// ============================================

export function getWeekStartDate(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  // Start week on Sunday (Israeli calendar)
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Add padding days from previous month
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(d);
  }
  
  // Add all days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add padding days from next month
  const endPadding = 6 - lastDay.getDay();
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
}

// ============================================
// 🔔 Reminder Utilities
// ============================================

export interface ReminderConfig {
  daysBefore: number[];  // e.g., [30, 14, 7, 1]
  sendEmail: boolean;
  sendSms: boolean;
  sendPush: boolean;
}

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  daysBefore: [30, 14, 7, 1],
  sendEmail: true,
  sendSms: false,
  sendPush: true,
};

export function shouldSendReminder(
  dueDate: Date,
  config: ReminderConfig,
  lastReminderSent?: Date
): { shouldSend: boolean; daysUntil: number } {
  const daysUntil = getDaysUntilDue(dueDate);
  
  // Check if we hit any reminder threshold
  const shouldSend = config.daysBefore.includes(daysUntil);
  
  // Don't send if we already sent today
  if (lastReminderSent) {
    const lastSentToday = lastReminderSent.toDateString() === new Date().toDateString();
    if (lastSentToday) {
      return { shouldSend: false, daysUntil };
    }
  }
  
  return { shouldSend, daysUntil };
}

export function generateReminderMessage(
  equipment: Equipment,
  daysUntil: number
): { subject: string; body: string } {
  const urgency = daysUntil <= 0 ? 'דחוף' : daysUntil <= 7 ? 'בקרוב' : 'תזכורת';
  
  const subject = `${urgency}: בדיקה נדרשת - ${equipment.name}`;
  
  let body = '';
  if (daysUntil < 0) {
    body = `בדיקת ${equipment.name} באיחור של ${Math.abs(daysUntil)} ימים.\n`;
  } else if (daysUntil === 0) {
    body = `בדיקת ${equipment.name} מתוזמנת להיום.\n`;
  } else if (daysUntil === 1) {
    body = `בדיקת ${equipment.name} מתוזמנת למחר.\n`;
  } else {
    body = `בדיקת ${equipment.name} מתוזמנת בעוד ${daysUntil} ימים.\n`;
  }
  
  body += `\nפרטי הציוד:\n`;
  body += `- סוג: ${equipment.equipmentTypeId}\n`;
  if (equipment.serialNumber) body += `- מספר סידורי: ${equipment.serialNumber}\n`;
  if (equipment.locationDescription) body += `- מיקום: ${equipment.locationDescription}\n`;
  
  return { subject, body };
}

// ============================================
// 📊 Status Labels
// ============================================

export const INSPECTION_STATUS_LABELS: Record<InspectionStatus, { he: string; en: string; color: string; bgColor: string }> = {
  overdue: { he: 'באיחור', en: 'Overdue', color: '#991b1b', bgColor: '#fee2e2' },
  due_today: { he: 'היום', en: 'Due Today', color: '#9a3412', bgColor: '#ffedd5' },
  due_this_week: { he: 'השבוע', en: 'This Week', color: '#92400e', bgColor: '#fef3c7' },
  due_this_month: { he: 'החודש', en: 'This Month', color: '#1d4ed8', bgColor: '#dbeafe' },
  upcoming: { he: 'בקרוב', en: 'Upcoming', color: '#065f46', bgColor: '#d1fae5' },
  scheduled: { he: 'מתוזמן', en: 'Scheduled', color: '#4b5563', bgColor: '#f3f4f6' },
  not_scheduled: { he: 'לא מתוזמן', en: 'Not Scheduled', color: '#6b7280', bgColor: '#f9fafb' },
};

export const PRIORITY_LABELS: Record<ScheduledInspection['priority'], { he: string; en: string; color: string }> = {
  critical: { he: 'קריטי', en: 'Critical', color: '#dc2626' },
  high: { he: 'גבוה', en: 'High', color: '#f97316' },
  medium: { he: 'בינוני', en: 'Medium', color: '#eab308' },
  low: { he: 'נמוך', en: 'Low', color: '#22c55e' },
};
