/**
 * AEGIS Finding Tracking System
 * מערכת מעקב ממצאים וליקויים
 */

import React, { useState, useMemo } from 'react';

// ============================================
// 📋 Types
// ============================================

export type FindingSeverity = 'critical' | 'major' | 'minor' | 'observation';
export type FindingStatus = 'open' | 'in_progress' | 'pending_verification' | 'closed' | 'wont_fix';

export interface Finding {
  id: string;
  
  // Reference
  inspectionId: string;
  equipmentId: string;
  clientId: string;
  
  // Finding Details
  title: string;
  description: string;
  severity: FindingSeverity;
  category: string;
  
  // Location
  locationId?: string;
  locationDescription?: string;
  
  // Status
  status: FindingStatus;
  
  // Assignment
  assignedTo?: string;
  assignedToName?: string;
  
  // Dates
  foundDate: Date;
  dueDate?: Date;
  closedDate?: Date;
  
  // Resolution
  resolution?: string;
  resolutionNotes?: string;
  verifiedBy?: string;
  verifiedDate?: Date;
  
  // Evidence
  photos?: string[];
  documents?: string[];
  
  // Metadata
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface FindingFilters {
  clientId?: string;
  equipmentId?: string;
  inspectionId?: string;
  severity?: FindingSeverity;
  status?: FindingStatus;
  assignedTo?: string;
  overdue?: boolean;
  searchTerm?: string;
}

// ============================================
// 🏷️ Labels & Colors
// ============================================

export const SEVERITY_CONFIG: Record<FindingSeverity, {
  he: string;
  en: string;
  color: string;
  bgColor: string;
  icon: string;
  priority: number;
}> = {
  critical: {
    he: 'קריטי',
    en: 'Critical',
    color: '#991b1b',
    bgColor: '#fee2e2',
    icon: '🚨',
    priority: 1,
  },
  major: {
    he: 'משמעותי',
    en: 'Major',
    color: '#9a3412',
    bgColor: '#ffedd5',
    icon: '⚠️',
    priority: 2,
  },
  minor: {
    he: 'קל',
    en: 'Minor',
    color: '#92400e',
    bgColor: '#fef3c7',
    icon: '📝',
    priority: 3,
  },
  observation: {
    he: 'הערה',
    en: 'Observation',
    color: '#1d4ed8',
    bgColor: '#dbeafe',
    icon: '💡',
    priority: 4,
  },
};

export const STATUS_CONFIG: Record<FindingStatus, {
  he: string;
  en: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  open: {
    he: 'פתוח',
    en: 'Open',
    color: '#dc2626',
    bgColor: '#fee2e2',
    icon: '🔴',
  },
  in_progress: {
    he: 'בטיפול',
    en: 'In Progress',
    color: '#2563eb',
    bgColor: '#dbeafe',
    icon: '🔵',
  },
  pending_verification: {
    he: 'ממתין לאימות',
    en: 'Pending Verification',
    color: '#7c3aed',
    bgColor: '#ede9fe',
    icon: '🟣',
  },
  closed: {
    he: 'סגור',
    en: 'Closed',
    color: '#16a34a',
    bgColor: '#dcfce7',
    icon: '🟢',
  },
  wont_fix: {
    he: 'לא יטופל',
    en: "Won't Fix",
    color: '#6b7280',
    bgColor: '#f3f4f6',
    icon: '⚪',
  },
};

export const FINDING_CATEGORIES = [
  { id: 'safety_device', name: 'התקן בטיחות' },
  { id: 'documentation', name: 'תיעוד' },
  { id: 'maintenance', name: 'תחזוקה' },
  { id: 'training', name: 'הדרכה' },
  { id: 'signage', name: 'שילוט' },
  { id: 'ppe', name: 'ציוד מגן אישי' },
  { id: 'procedure', name: 'נוהל' },
  { id: 'structural', name: 'מבנה' },
  { id: 'electrical', name: 'חשמל' },
  { id: 'environmental', name: 'סביבתי' },
  { id: 'other', name: 'אחר' },
];

// ============================================
// 🔧 Utility Functions
// ============================================

export function isOverdue(finding: Finding): boolean {
  if (!finding.dueDate) return false;
  if (finding.status === 'closed' || finding.status === 'wont_fix') return false;
  return new Date(finding.dueDate) < new Date();
}

export function getDaysUntilDue(finding: Finding): number | null {
  if (!finding.dueDate) return null;
  const due = new Date(finding.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function sortFindings(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => {
    // Open items first
    if (a.status !== 'closed' && b.status === 'closed') return -1;
    if (a.status === 'closed' && b.status !== 'closed') return 1;
    
    // Then by severity
    const sevA = SEVERITY_CONFIG[a.severity].priority;
    const sevB = SEVERITY_CONFIG[b.severity].priority;
    if (sevA !== sevB) return sevA - sevB;
    
    // Then by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    return 0;
  });
}

// ============================================
// 📊 Statistics
// ============================================

export interface FindingStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  overdue: number;
  bySeverity: Record<FindingSeverity, number>;
  byStatus: Record<FindingStatus, number>;
  byCategory: Record<string, number>;
  avgResolutionDays: number;
}

export function calculateFindingStats(findings: Finding[]): FindingStats {
  const stats: FindingStats = {
    total: findings.length,
    open: 0,
    inProgress: 0,
    closed: 0,
    overdue: 0,
    bySeverity: { critical: 0, major: 0, minor: 0, observation: 0 },
    byStatus: { open: 0, in_progress: 0, pending_verification: 0, closed: 0, wont_fix: 0 },
    byCategory: {},
    avgResolutionDays: 0,
  };

  let totalResolutionDays = 0;
  let closedCount = 0;

  findings.forEach(f => {
    // By status
    stats.byStatus[f.status]++;
    if (f.status === 'open') stats.open++;
    if (f.status === 'in_progress') stats.inProgress++;
    if (f.status === 'closed') stats.closed++;
    
    // Overdue
    if (isOverdue(f)) stats.overdue++;
    
    // By severity
    stats.bySeverity[f.severity]++;
    
    // By category
    stats.byCategory[f.category] = (stats.byCategory[f.category] || 0) + 1;
    
    // Resolution time
    if (f.status === 'closed' && f.closedDate && f.foundDate) {
      const days = Math.floor(
        (new Date(f.closedDate).getTime() - new Date(f.foundDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      totalResolutionDays += days;
      closedCount++;
    }
  });

  stats.avgResolutionDays = closedCount > 0 ? Math.round(totalResolutionDays / closedCount) : 0;

  return stats;
}

// ============================================
// 📋 Finding List Component
// ============================================

interface FindingListProps {
  findings: Finding[];
  onSelect?: (finding: Finding) => void;
  onEdit?: (finding: Finding) => void;
  onStatusChange?: (finding: Finding, newStatus: FindingStatus) => void;
  loading?: boolean;
}

export const FindingList: React.FC<FindingListProps> = ({
  findings,
  onSelect,
  onEdit,
  onStatusChange,
  loading,
}) => {
  const [filters, setFilters] = useState<FindingFilters>({});
  const [sortBy, setSortBy] = useState<'severity' | 'status' | 'dueDate'>('severity');

  // Apply filters and sort
  const filteredFindings = useMemo(() => {
    let result = [...findings];

    if (filters.severity) {
      result = result.filter(f => f.severity === filters.severity);
    }
    if (filters.status) {
      result = result.filter(f => f.status === filters.status);
    }
    if (filters.overdue) {
      result = result.filter(isOverdue);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(f =>
        f.title.toLowerCase().includes(term) ||
        f.description.toLowerCase().includes(term)
      );
    }

    return sortFindings(result);
  }, [findings, filters, sortBy]);

  // Stats
  const stats = useMemo(() => calculateFindingStats(findings), [findings]);

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('he-IL');
  };

  return (
    <div className="finding-list" dir="rtl">
      {/* Stats Summary */}
      <div className="stats-bar">
        <div className="stat-item critical">
          <span className="stat-value">{stats.bySeverity.critical}</span>
          <span className="stat-label">קריטי</span>
        </div>
        <div className="stat-item major">
          <span className="stat-value">{stats.bySeverity.major}</span>
          <span className="stat-label">משמעותי</span>
        </div>
        <div className="stat-item open">
          <span className="stat-value">{stats.open}</span>
          <span className="stat-label">פתוחים</span>
        </div>
        <div className="stat-item overdue">
          <span className="stat-value">{stats.overdue}</span>
          <span className="stat-label">באיחור</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="חיפוש..."
          value={filters.searchTerm || ''}
          onChange={e => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
          className="search-input"
        />
        <select
          value={filters.severity || ''}
          onChange={e => setFilters(f => ({ ...f, severity: e.target.value as FindingSeverity || undefined }))}
        >
          <option value="">כל החומרות</option>
          {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.icon} {config.he}</option>
          ))}
        </select>
        <select
          value={filters.status || ''}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value as FindingStatus || undefined }))}
        >
          <option value="">כל הסטטוסים</option>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.icon} {config.he}</option>
          ))}
        </select>
        <label className="checkbox-filter">
          <input
            type="checkbox"
            checked={filters.overdue || false}
            onChange={e => setFilters(f => ({ ...f, overdue: e.target.checked }))}
          />
          <span>באיחור בלבד</span>
        </label>
      </div>

      {/* Findings */}
      {loading ? (
        <div className="loading">טוען...</div>
      ) : filteredFindings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✅</span>
          <h3>אין ממצאים</h3>
          <p>{filters.searchTerm ? 'נסה לשנות את הסינון' : 'לא נמצאו ממצאים פתוחים'}</p>
        </div>
      ) : (
        <div className="findings-grid">
          {filteredFindings.map(finding => (
            <FindingCard
              key={finding.id}
              finding={finding}
              onSelect={() => onSelect?.(finding)}
              onEdit={() => onEdit?.(finding)}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// 📝 Finding Card Component
// ============================================

interface FindingCardProps {
  finding: Finding;
  onSelect?: () => void;
  onEdit?: () => void;
  onStatusChange?: (finding: Finding, newStatus: FindingStatus) => void;
}

const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  onSelect,
  onEdit,
  onStatusChange,
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  
  const severityConfig = SEVERITY_CONFIG[finding.severity];
  const statusConfig = STATUS_CONFIG[finding.status];
  const overdue = isOverdue(finding);
  const daysUntilDue = getDaysUntilDue(finding);

  const getDueDateText = () => {
    if (!finding.dueDate) return null;
    if (finding.status === 'closed') return null;
    
    if (daysUntilDue === null) return null;
    if (daysUntilDue < 0) return `באיחור ${Math.abs(daysUntilDue)} ימים`;
    if (daysUntilDue === 0) return 'היום';
    if (daysUntilDue === 1) return 'מחר';
    return `בעוד ${daysUntilDue} ימים`;
  };

  return (
    <div 
      className={`finding-card severity-${finding.severity} ${overdue ? 'overdue' : ''}`}
      onClick={onSelect}
    >
      <div className="card-header">
        <span 
          className="severity-badge"
          style={{ background: severityConfig.bgColor, color: severityConfig.color }}
        >
          {severityConfig.icon} {severityConfig.he}
        </span>
        <div className="status-container">
          <button
            className="status-badge"
            style={{ background: statusConfig.bgColor, color: statusConfig.color }}
            onClick={(e) => {
              e.stopPropagation();
              setShowStatusMenu(!showStatusMenu);
            }}
          >
            {statusConfig.icon} {statusConfig.he} ▼
          </button>
          {showStatusMenu && onStatusChange && (
            <div className="status-menu">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(finding, key as FindingStatus);
                    setShowStatusMenu(false);
                  }}
                  disabled={key === finding.status}
                >
                  {config.icon} {config.he}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card-body">
        <h4 className="finding-title">{finding.title}</h4>
        <p className="finding-description">{finding.description}</p>
        
        <div className="finding-meta">
          {finding.category && (
            <span className="meta-item">
              📂 {FINDING_CATEGORIES.find(c => c.id === finding.category)?.name || finding.category}
            </span>
          )}
          {finding.locationDescription && (
            <span className="meta-item">📍 {finding.locationDescription}</span>
          )}
        </div>
      </div>

      <div className="card-footer">
        <div className="footer-info">
          {finding.dueDate && (
            <span className={`due-date ${overdue ? 'overdue' : ''}`}>
              📅 {getDueDateText()}
            </span>
          )}
          {finding.assignedToName && (
            <span className="assigned">👤 {finding.assignedToName}</span>
          )}
        </div>
        {onEdit && (
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            ✏️
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// 📝 Finding Form Component
// ============================================

interface FindingFormProps {
  finding?: Finding;
  inspectionId: string;
  equipmentId: string;
  clientId: string;
  onSave: (data: Partial<Finding>) => Promise<void>;
  onCancel: () => void;
}

export const FindingForm: React.FC<FindingFormProps> = ({
  finding,
  inspectionId,
  equipmentId,
  clientId,
  onSave,
  onCancel,
}) => {
  const isEdit = !!finding;
  
  const [formData, setFormData] = useState<Partial<Finding>>({
    inspectionId,
    equipmentId,
    clientId,
    severity: 'minor',
    status: 'open',
    category: 'other',
    foundDate: new Date(),
    ...finding,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Finding, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'כותרת היא שדה חובה';
    if (!formData.description?.trim()) newErrors.description = 'תיאור הוא שדה חובה';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const formatDateForInput = (date?: Date | string) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <form className="finding-form" onSubmit={handleSubmit} dir="rtl">
      <div className="form-header">
        <h3>{isEdit ? 'עריכת ממצא' : 'הוספת ממצא'}</h3>
        <button type="button" className="close-btn" onClick={onCancel}>✕</button>
      </div>

      <div className="form-content">
        <div className="form-row">
          <div className="form-field">
            <label>חומרה *</label>
            <div className="severity-buttons">
              {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  className={`severity-btn ${formData.severity === key ? 'selected' : ''}`}
                  style={{
                    background: formData.severity === key ? config.bgColor : 'white',
                    color: formData.severity === key ? config.color : '#6b7280',
                    borderColor: formData.severity === key ? config.color : '#d1d5db',
                  }}
                  onClick={() => handleChange('severity', key)}
                >
                  {config.icon} {config.he}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="title">כותרת *</label>
          <input
            id="title"
            type="text"
            value={formData.title || ''}
            onChange={e => handleChange('title', e.target.value)}
            placeholder="תיאור קצר של הממצא"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="description">תיאור מפורט *</label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            rows={4}
            placeholder="פרט את הממצא, הסיכון, והפעולה הנדרשת..."
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="category">קטגוריה</label>
            <select
              id="category"
              value={formData.category || 'other'}
              onChange={e => handleChange('category', e.target.value)}
            >
              {FINDING_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="status">סטטוס</label>
            <select
              id="status"
              value={formData.status || 'open'}
              onChange={e => handleChange('status', e.target.value)}
            >
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.icon} {config.he}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="dueDate">תאריך יעד לתיקון</label>
            <input
              id="dueDate"
              type="date"
              value={formatDateForInput(formData.dueDate)}
              onChange={e => handleChange('dueDate', e.target.value ? new Date(e.target.value) : null)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="assignedToName">אחראי לטיפול</label>
            <input
              id="assignedToName"
              type="text"
              value={formData.assignedToName || ''}
              onChange={e => handleChange('assignedToName', e.target.value)}
              placeholder="שם האחראי"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="locationDescription">מיקום</label>
          <input
            id="locationDescription"
            type="text"
            value={formData.locationDescription || ''}
            onChange={e => handleChange('locationDescription', e.target.value)}
            placeholder="תאר את המיקום המדויק"
          />
        </div>

        {(isEdit && (formData.status === 'closed' || formData.status === 'pending_verification')) && (
          <div className="form-field">
            <label htmlFor="resolution">פתרון/פעולה שבוצעה</label>
            <textarea
              id="resolution"
              value={formData.resolution || ''}
              onChange={e => handleChange('resolution', e.target.value)}
              rows={3}
              placeholder="תאר את הפעולה שבוצעה לתיקון הממצא..."
            />
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          ביטול
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'שומר...' : (isEdit ? 'עדכן' : 'הוסף')}
        </button>
      </div>
    </form>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const FindingStyles = `
.finding-list {
  padding: 24px;
}

.stats-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  flex: 1;
  padding: 16px;
  background: white;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-item.critical { border-right: 4px solid #dc2626; }
.stat-item.major { border-right: 4px solid #f97316; }
.stat-item.open { border-right: 4px solid #3b82f6; }
.stat-item.overdue { border-right: 4px solid #991b1b; }

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.filters-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.filters-bar input,
.filters-bar select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.search-input { width: 200px; }

.checkbox-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.findings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.finding-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-right: 4px solid transparent;
}

.finding-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.finding-card.severity-critical { border-right-color: #dc2626; }
.finding-card.severity-major { border-right-color: #f97316; }
.finding-card.severity-minor { border-right-color: #eab308; }
.finding-card.severity-observation { border-right-color: #3b82f6; }

.finding-card.overdue {
  background: #fef2f2;
}

.finding-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
}

.severity-badge,
.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge {
  cursor: pointer;
  border: none;
  position: relative;
}

.status-container {
  position: relative;
}

.status-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10;
  overflow: hidden;
  min-width: 150px;
}

.status-menu button {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: transparent;
  text-align: right;
  cursor: pointer;
  font-size: 14px;
}

.status-menu button:hover {
  background: #f3f4f6;
}

.status-menu button:disabled {
  background: #f3f4f6;
  color: #9ca3af;
}

.finding-card .card-body {
  padding: 12px;
}

.finding-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #111827;
}

.finding-description {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #4b5563;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.finding-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: #6b7280;
}

.finding-card .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.footer-info {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.due-date { color: #6b7280; }
.due-date.overdue { color: #dc2626; font-weight: 600; }
.assigned { color: #6b7280; }

.edit-btn {
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}

.edit-btn:hover { background: #e5e7eb; }

/* Form Styles */
.finding-form {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
}

.finding-form .form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.finding-form .form-header h3 { margin: 0; }

.finding-form .close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-size: 18px;
}

.finding-form .form-content { padding: 20px; }

.finding-form .form-field {
  margin-bottom: 16px;
}

.finding-form .form-row {
  display: flex;
  gap: 16px;
}

.finding-form .form-row .form-field { flex: 1; }

.finding-form label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.finding-form input,
.finding-form select,
.finding-form textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.finding-form input:focus,
.finding-form select:focus,
.finding-form textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.finding-form input.error,
.finding-form textarea.error {
  border-color: #ef4444;
}

.error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

.severity-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.severity-btn {
  padding: 8px 12px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.finding-form .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

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

.loading {
  text-align: center;
  padding: 48px;
  color: #6b7280;
}
`;

export default FindingList;
