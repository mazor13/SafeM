/**
 * AEGIS Inspection Dashboard Component
 * דשבורד בדיקות - התראות, לוח שנה, סיכומים
 */

import React, { useState, useMemo } from 'react';
import {
  ScheduledInspection,
  InspectionCalendarDay,
  generateScheduledInspections,
  getScheduleSummary,
  getWeeklySchedule,
  getWeekStartDate,
  getMonthDays,
  groupByDate,
  INSPECTION_STATUS_LABELS,
  PRIORITY_LABELS,
} from '../services/inspectionScheduler';
import { Equipment, EQUIPMENT_TYPES, getEquipmentTypeById } from '../types/equipment.types';
import { SAFETY_DOMAINS } from '../types/safety';

// ============================================
// 🎨 Props
// ============================================

interface InspectionDashboardProps {
  equipment: Equipment[];
  onSelectEquipment?: (equipment: Equipment) => void;
  onScheduleInspection?: (equipment: Equipment) => void;
}

// ============================================
// 📊 Main Dashboard Component
// ============================================

export const InspectionDashboard: React.FC<InspectionDashboardProps> = ({
  equipment,
  onSelectEquipment,
  onScheduleInspection,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarMode, setCalendarMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');

  // Generate scheduled inspections
  const allInspections = useMemo(() => 
    generateScheduledInspections(equipment, { 
      includeOverdue: true, 
      daysAhead: 90 
    }),
  [equipment]);

  // Apply filters
  const filteredInspections = useMemo(() => {
    let result = allInspections;
    if (filterDomain) {
      result = result.filter(i => i.equipment.domain === filterDomain);
    }
    if (filterPriority) {
      result = result.filter(i => i.priority === filterPriority);
    }
    return result;
  }, [allInspections, filterDomain, filterPriority]);

  // Summary
  const summary = useMemo(() => getScheduleSummary(filteredInspections), [filteredInspections]);

  // Calendar data
  const weekStart = useMemo(() => getWeekStartDate(currentDate), [currentDate]);
  const weekSchedule = useMemo(() => 
    getWeeklySchedule(filteredInspections, weekStart),
  [filteredInspections, weekStart]);

  const monthDays = useMemo(() => 
    getMonthDays(currentDate.getFullYear(), currentDate.getMonth()),
  [currentDate]);

  const inspectionsByDate = useMemo(() => 
    groupByDate(filteredInspections),
  [filteredInspections]);

  // Navigation
  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Format date
  const formatDate = (date: Date, format: 'short' | 'long' = 'short') => {
    if (format === 'long') {
      return date.toLocaleDateString('he-IL', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }
    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  };

  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString('he-IL', { weekday: 'short' });
  };

  return (
    <div className="inspection-dashboard" dir="rtl">
      {/* Header */}
      <div className="dashboard-header">
        <h2>דשבורד בדיקות</h2>
        <div className="header-actions">
          <select 
            value={filterDomain} 
            onChange={e => setFilterDomain(e.target.value)}
            className="filter-select"
          >
            <option value="">כל התחומים</option>
            {Object.entries(SAFETY_DOMAINS).map(([key, domain]) => (
              <option key={key} value={key}>{domain.name}</option>
            ))}
          </select>
          <select 
            value={filterPriority} 
            onChange={e => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="">כל העדיפויות</option>
            {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label.he}</option>
            ))}
          </select>
          <div className="view-toggle">
            <button 
              className={viewMode === 'list' ? 'active' : ''} 
              onClick={() => setViewMode('list')}
            >
              רשימה
            </button>
            <button 
              className={viewMode === 'calendar' ? 'active' : ''} 
              onClick={() => setViewMode('calendar')}
            >
              לוח שנה
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card critical">
          <div className="card-icon">🚨</div>
          <div className="card-content">
            <div className="card-value">{summary.overdue}</div>
            <div className="card-label">באיחור</div>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="card-icon">⚠️</div>
          <div className="card-content">
            <div className="card-value">{summary.dueToday + summary.dueThisWeek}</div>
            <div className="card-label">השבוע</div>
          </div>
        </div>
        <div className="summary-card info">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <div className="card-value">{summary.dueThisMonth}</div>
            <div className="card-label">החודש</div>
          </div>
        </div>
        <div className="summary-card success">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <div className="card-value">{summary.upcoming}</div>
            <div className="card-label">בקרוב</div>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="inspection-list">
          {/* Overdue Section */}
          {summary.overdue > 0 && (
            <div className="list-section overdue">
              <h3>🚨 באיחור ({summary.overdue})</h3>
              <div className="inspection-items">
                {filteredInspections
                  .filter(i => i.status === 'overdue')
                  .map(insp => (
                    <InspectionCard
                      key={insp.equipmentId}
                      inspection={insp}
                      onSelect={() => onSelectEquipment?.(insp.equipment)}
                      onSchedule={() => onScheduleInspection?.(insp.equipment)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Due This Week */}
          {(summary.dueToday + summary.dueThisWeek) > 0 && (
            <div className="list-section this-week">
              <h3>📆 השבוע ({summary.dueToday + summary.dueThisWeek})</h3>
              <div className="inspection-items">
                {filteredInspections
                  .filter(i => i.status === 'due_today' || i.status === 'due_this_week')
                  .map(insp => (
                    <InspectionCard
                      key={insp.equipmentId}
                      inspection={insp}
                      onSelect={() => onSelectEquipment?.(insp.equipment)}
                      onSchedule={() => onScheduleInspection?.(insp.equipment)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Due This Month */}
          {summary.dueThisMonth > 0 && (
            <div className="list-section this-month">
              <h3>📅 החודש ({summary.dueThisMonth})</h3>
              <div className="inspection-items">
                {filteredInspections
                  .filter(i => i.status === 'due_this_month')
                  .map(insp => (
                    <InspectionCard
                      key={insp.equipmentId}
                      inspection={insp}
                      onSelect={() => onSelectEquipment?.(insp.equipment)}
                      onSchedule={() => onScheduleInspection?.(insp.equipment)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {summary.upcoming > 0 && (
            <div className="list-section upcoming">
              <h3>🔜 בקרוב ({summary.upcoming})</h3>
              <div className="inspection-items">
                {filteredInspections
                  .filter(i => i.status === 'upcoming' || i.status === 'scheduled')
                  .slice(0, 10)
                  .map(insp => (
                    <InspectionCard
                      key={insp.equipmentId}
                      inspection={insp}
                      onSelect={() => onSelectEquipment?.(insp.equipment)}
                      onSchedule={() => onScheduleInspection?.(insp.equipment)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredInspections.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3>אין בדיקות מתוזמנות</h3>
              <p>כל הבדיקות עודכנו או שאין ציוד עם תאריכי בדיקה</p>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="inspection-calendar">
          <div className="calendar-controls">
            <div className="calendar-nav">
              <button onClick={() => calendarMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}>
                ▶
              </button>
              <span className="current-period">
                {calendarMode === 'week' 
                  ? `${formatDate(weekStart)} - ${formatDate(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))}`
                  : currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })
                }
              </span>
              <button onClick={() => calendarMode === 'week' ? navigateWeek(1) : navigateMonth(1)}>
                ◀
              </button>
            </div>
            <div className="calendar-mode-toggle">
              <button 
                className={calendarMode === 'week' ? 'active' : ''} 
                onClick={() => setCalendarMode('week')}
              >
                שבוע
              </button>
              <button 
                className={calendarMode === 'month' ? 'active' : ''} 
                onClick={() => setCalendarMode('month')}
              >
                חודש
              </button>
            </div>
          </div>

          {/* Week View */}
          {calendarMode === 'week' && (
            <div className="week-view">
              {weekSchedule.map((day, index) => {
                const isToday = day.date.toDateString() === new Date().toDateString();
                return (
                  <div key={index} className={`day-column ${isToday ? 'today' : ''}`}>
                    <div className="day-header">
                      <span className="day-name">{formatWeekday(day.date)}</span>
                      <span className="day-date">{day.date.getDate()}</span>
                      {day.count > 0 && (
                        <span className="day-count">{day.count}</span>
                      )}
                    </div>
                    <div className="day-content">
                      {day.inspections.map(insp => (
                        <div 
                          key={insp.equipmentId}
                          className={`calendar-item priority-${insp.priority}`}
                          onClick={() => onSelectEquipment?.(insp.equipment)}
                        >
                          <span className="item-domain">
                            {SAFETY_DOMAINS[insp.equipment.domain]?.icon}
                          </span>
                          <span className="item-name">{insp.equipment.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Month View */}
          {calendarMode === 'month' && (
            <div className="month-view">
              <div className="month-header">
                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((day, i) => (
                  <div key={i} className="month-day-name">{day}</div>
                ))}
              </div>
              <div className="month-grid">
                {monthDays.map((day, index) => {
                  const dateKey = day.toISOString().split('T')[0];
                  const dayData = inspectionsByDate.get(dateKey);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div 
                      key={index} 
                      className={`month-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                    >
                      <span className="month-day-number">{day.getDate()}</span>
                      {dayData && dayData.count > 0 && (
                        <div className="month-day-inspections">
                          {dayData.count <= 3 ? (
                            dayData.inspections.map(insp => (
                              <div 
                                key={insp.equipmentId}
                                className={`month-item priority-${insp.priority}`}
                                title={insp.equipment.name}
                              />
                            ))
                          ) : (
                            <span className="month-day-count">{dayData.count}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// 📋 Inspection Card Component
// ============================================

interface InspectionCardProps {
  inspection: ScheduledInspection;
  onSelect?: () => void;
  onSchedule?: () => void;
}

const InspectionCard: React.FC<InspectionCardProps> = ({
  inspection,
  onSelect,
  onSchedule,
}) => {
  const { equipment, status, daysUntilDue, priority } = inspection;
  const eqType = getEquipmentTypeById(equipment.equipmentTypeId);
  const statusLabel = INSPECTION_STATUS_LABELS[status];
  const priorityLabel = PRIORITY_LABELS[priority];
  const domainInfo = SAFETY_DOMAINS[equipment.domain];

  const getDaysText = () => {
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} ימים באיחור`;
    if (daysUntilDue === 0) return 'היום';
    if (daysUntilDue === 1) return 'מחר';
    return `בעוד ${daysUntilDue} ימים`;
  };

  return (
    <div className={`inspection-card priority-${priority}`} onClick={onSelect}>
      <div className="card-header">
        <span 
          className="domain-badge"
          style={{ background: domainInfo?.color }}
        >
          {domainInfo?.icon} {domainInfo?.name}
        </span>
        <span 
          className="status-badge"
          style={{ background: statusLabel.bgColor, color: statusLabel.color }}
        >
          {statusLabel.he}
        </span>
      </div>
      
      <div className="card-body">
        <h4 className="equipment-name">{equipment.name}</h4>
        <p className="equipment-type">{eqType?.name}</p>
        
        <div className="card-details">
          {equipment.serialNumber && (
            <span className="detail">מס' {equipment.serialNumber}</span>
          )}
          {equipment.locationDescription && (
            <span className="detail">📍 {equipment.locationDescription}</span>
          )}
        </div>
      </div>

      <div className="card-footer">
        <span className="days-until" style={{ color: priorityLabel.color }}>
          {getDaysText()}
        </span>
        {onSchedule && (
          <button 
            className="schedule-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSchedule();
            }}
          >
            תזמן בדיקה
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const InspectionDashboardStyles = `
.inspection-dashboard {
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 24px;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.view-toggle {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d1d5db;
}

.view-toggle button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.view-toggle button.active {
  background: #3b82f6;
  color: white;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.summary-card.critical {
  border-right: 4px solid #dc2626;
}

.summary-card.warning {
  border-right: 4px solid #f97316;
}

.summary-card.info {
  border-right: 4px solid #3b82f6;
}

.summary-card.success {
  border-right: 4px solid #22c55e;
}

.card-icon {
  font-size: 24px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.card-label {
  font-size: 14px;
  color: #6b7280;
}

/* List View */
.inspection-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.list-section h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #374151;
}

.inspection-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

/* Inspection Card */
.inspection-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-right: 4px solid transparent;
}

.inspection-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.inspection-card.priority-critical {
  border-right-color: #dc2626;
}

.inspection-card.priority-high {
  border-right-color: #f97316;
}

.inspection-card.priority-medium {
  border-right-color: #eab308;
}

.inspection-card.priority-low {
  border-right-color: #22c55e;
}

.inspection-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
}

.domain-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.inspection-card .card-body {
  padding: 12px;
}

.equipment-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #111827;
}

.equipment-type {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #6b7280;
}

.card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-details .detail {
  font-size: 12px;
  color: #6b7280;
}

.inspection-card .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.days-until {
  font-size: 14px;
  font-weight: 600;
}

.schedule-btn {
  padding: 6px 12px;
  font-size: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.schedule-btn:hover {
  background: #2563eb;
}

/* Calendar */
.inspection-calendar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.calendar-nav button {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

.current-period {
  font-weight: 600;
  min-width: 200px;
  text-align: center;
}

.calendar-mode-toggle {
  display: flex;
  gap: 8px;
}

.calendar-mode-toggle button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

.calendar-mode-toggle button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* Week View */
.week-view {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-height: 400px;
}

.day-column {
  border-left: 1px solid #e5e7eb;
}

.day-column:last-child {
  border-left: none;
}

.day-column.today {
  background: #eff6ff;
}

.day-header {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.day-name {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.day-date {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.day-count {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  background: #3b82f6;
  color: white;
  border-radius: 10px;
  font-size: 11px;
}

.day-content {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.calendar-item {
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f6;
}

.calendar-item.priority-critical {
  background: #fee2e2;
}

.calendar-item.priority-high {
  background: #ffedd5;
}

.calendar-item.priority-medium {
  background: #fef3c7;
}

.item-domain {
  flex-shrink: 0;
}

.item-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Month View */
.month-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.month-day-name {
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.month-day {
  min-height: 80px;
  padding: 8px;
  border-left: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.month-day:nth-child(7n) {
  border-left: none;
}

.month-day.other-month {
  background: #f9fafb;
}

.month-day.other-month .month-day-number {
  color: #d1d5db;
}

.month-day.today {
  background: #eff6ff;
}

.month-day-number {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.month-day-inspections {
  margin-top: 4px;
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}

.month-item {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b7280;
}

.month-item.priority-critical {
  background: #dc2626;
}

.month-item.priority-high {
  background: #f97316;
}

.month-item.priority-medium {
  background: #eab308;
}

.month-day-count {
  font-size: 12px;
  padding: 2px 6px;
  background: #3b82f6;
  color: white;
  border-radius: 10px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 12px;
}

.empty-state .empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #111827;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
}

@media (max-width: 768px) {
  .week-view {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .day-column:nth-child(n+4) {
    display: none;
  }
  
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

export default InspectionDashboard;
