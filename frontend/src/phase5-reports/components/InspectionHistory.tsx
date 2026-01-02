/**
 * AEGIS Inspection History Component
 * היסטוריית בדיקות עם Timeline ו-Filters
 */

import React, { useState, useMemo } from 'react';
import { SAFETY_DOMAINS } from '../types/safety';

// ============================================
// 📋 Types
// ============================================

export interface InspectionHistoryItem {
  id: string;
  
  // Equipment
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  domain: string;
  serialNumber?: string;
  
  // Client
  clientId: string;
  clientName: string;
  
  // Inspection
  date: Date;
  inspectorName: string;
  result: 'pass' | 'pass_with_conditions' | 'fail';
  templateName: string;
  
  // Findings
  findingsCount: number;
  criticalFindings: number;
  
  // Certificate
  certificateNumber?: string;
  certificateExpiry?: Date;
  
  // Report
  reportUrl?: string;
}

export interface HistoryFilters {
  clientId?: string;
  equipmentId?: string;
  domain?: string;
  result?: string;
  dateFrom?: Date;
  dateTo?: Date;
  inspectorName?: string;
  searchTerm?: string;
}

export interface HistoryStats {
  total: number;
  passed: number;
  passedWithConditions: number;
  failed: number;
  passRate: number;
  avgFindingsPerInspection: number;
  byMonth: { month: string; count: number; passRate: number }[];
}

// ============================================
// 🎨 Props
// ============================================

interface InspectionHistoryProps {
  inspections: InspectionHistoryItem[];
  onSelect?: (inspection: InspectionHistoryItem) => void;
  onViewReport?: (inspection: InspectionHistoryItem) => void;
  onDownloadReport?: (inspection: InspectionHistoryItem) => void;
  clients?: { id: string; name: string }[];
  loading?: boolean;
}

// ============================================
// 📋 Main Component
// ============================================

export const InspectionHistory: React.FC<InspectionHistoryProps> = ({
  inspections,
  onSelect,
  onViewReport,
  onDownloadReport,
  clients,
  loading,
}) => {
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'table'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'client' | 'result'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Apply filters
  const filteredInspections = useMemo(() => {
    let result = [...inspections];

    if (filters.clientId) {
      result = result.filter(i => i.clientId === filters.clientId);
    }
    if (filters.domain) {
      result = result.filter(i => i.domain === filters.domain);
    }
    if (filters.result) {
      result = result.filter(i => i.result === filters.result);
    }
    if (filters.dateFrom) {
      result = result.filter(i => new Date(i.date) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      result = result.filter(i => new Date(i.date) <= filters.dateTo!);
    }
    if (filters.inspectorName) {
      result = result.filter(i => 
        i.inspectorName.toLowerCase().includes(filters.inspectorName!.toLowerCase())
      );
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(i =>
        i.equipmentName.toLowerCase().includes(term) ||
        i.clientName.toLowerCase().includes(term) ||
        i.serialNumber?.toLowerCase().includes(term) ||
        i.certificateNumber?.toLowerCase().includes(term)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'client':
          comparison = a.clientName.localeCompare(b.clientName, 'he');
          break;
        case 'result':
          comparison = a.result.localeCompare(b.result);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [inspections, filters, sortBy, sortOrder]);

  // Calculate stats
  const stats = useMemo((): HistoryStats => {
    const total = filteredInspections.length;
    const passed = filteredInspections.filter(i => i.result === 'pass').length;
    const passedWithConditions = filteredInspections.filter(i => i.result === 'pass_with_conditions').length;
    const failed = filteredInspections.filter(i => i.result === 'fail').length;
    const passRate = total > 0 ? Math.round(((passed + passedWithConditions) / total) * 100) : 0;
    
    const totalFindings = filteredInspections.reduce((sum, i) => sum + i.findingsCount, 0);
    const avgFindingsPerInspection = total > 0 ? Math.round((totalFindings / total) * 10) / 10 : 0;

    // Group by month
    const byMonthMap = new Map<string, { count: number; passed: number }>();
    filteredInspections.forEach(insp => {
      const date = new Date(insp.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = byMonthMap.get(monthKey) || { count: 0, passed: 0 };
      current.count++;
      if (insp.result !== 'fail') current.passed++;
      byMonthMap.set(monthKey, current);
    });

    const byMonth = Array.from(byMonthMap.entries())
      .map(([month, data]) => ({
        month,
        count: data.count,
        passRate: Math.round((data.passed / data.count) * 100),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return { total, passed, passedWithConditions, failed, passRate, avgFindingsPerInspection, byMonth };
  }, [filteredInspections]);

  // Group by date for timeline
  const groupedByDate = useMemo(() => {
    const groups = new Map<string, InspectionHistoryItem[]>();
    
    filteredInspections.forEach(insp => {
      const dateKey = new Date(insp.date).toLocaleDateString('he-IL');
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(insp);
    });

    return Array.from(groups.entries());
  }, [filteredInspections]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'pass':
        return { text: 'עבר', className: 'result-pass', icon: '✅' };
      case 'pass_with_conditions':
        return { text: 'עבר בתנאים', className: 'result-conditional', icon: '⚠️' };
      case 'fail':
        return { text: 'נכשל', className: 'result-fail', icon: '❌' };
      default:
        return { text: result, className: '', icon: '' };
    }
  };

  return (
    <div className="inspection-history" dir="rtl">
      {/* Header */}
      <div className="history-header">
        <h2>היסטוריית בדיקות</h2>
        <div className="view-toggle">
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            רשימה
          </button>
          <button
            className={viewMode === 'timeline' ? 'active' : ''}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            טבלה
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">סה"כ בדיקות</div>
        </div>
        <div className="stat-card success">
          <div className="stat-value">{stats.passRate}%</div>
          <div className="stat-label">אחוז הצלחה</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.passed}</div>
          <div className="stat-label">עברו</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{stats.passedWithConditions}</div>
          <div className="stat-label">בתנאים</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-value">{stats.failed}</div>
          <div className="stat-label">נכשלו</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgFindingsPerInspection}</div>
          <div className="stat-label">ממצאים/בדיקה</div>
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
        
        {clients && (
          <select
            value={filters.clientId || ''}
            onChange={e => setFilters(f => ({ ...f, clientId: e.target.value || undefined }))}
          >
            <option value="">כל הלקוחות</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}

        <select
          value={filters.domain || ''}
          onChange={e => setFilters(f => ({ ...f, domain: e.target.value || undefined }))}
        >
          <option value="">כל התחומים</option>
          {Object.entries(SAFETY_DOMAINS).map(([key, domain]) => (
            <option key={key} value={key}>{domain.name}</option>
          ))}
        </select>

        <select
          value={filters.result || ''}
          onChange={e => setFilters(f => ({ ...f, result: e.target.value || undefined }))}
        >
          <option value="">כל התוצאות</option>
          <option value="pass">עבר</option>
          <option value="pass_with_conditions">עבר בתנאים</option>
          <option value="fail">נכשל</option>
        </select>

        <input
          type="date"
          value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
          onChange={e => setFilters(f => ({ 
            ...f, 
            dateFrom: e.target.value ? new Date(e.target.value) : undefined 
          }))}
          placeholder="מתאריך"
        />

        <input
          type="date"
          value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
          onChange={e => setFilters(f => ({ 
            ...f, 
            dateTo: e.target.value ? new Date(e.target.value) : undefined 
          }))}
          placeholder="עד תאריך"
        />

        <button
          className="clear-filters"
          onClick={() => setFilters({})}
        >
          נקה סינון
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">טוען...</div>
      )}

      {/* Empty State */}
      {!loading && filteredInspections.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>לא נמצאו בדיקות</h3>
          <p>נסה לשנות את הסינון או שאין עדיין היסטוריית בדיקות</p>
        </div>
      )}

      {/* List View */}
      {!loading && filteredInspections.length > 0 && viewMode === 'list' && (
        <div className="history-list">
          {filteredInspections.map(insp => {
            const resultBadge = getResultBadge(insp.result);
            const domainInfo = SAFETY_DOMAINS[insp.domain as keyof typeof SAFETY_DOMAINS];
            
            return (
              <div
                key={insp.id}
                className="history-item"
                onClick={() => onSelect?.(insp)}
              >
                <div className="item-header">
                  <span 
                    className="domain-badge"
                    style={{ background: domainInfo?.color }}
                  >
                    {domainInfo?.icon} {domainInfo?.name}
                  </span>
                  <span className={`result-badge ${resultBadge.className}`}>
                    {resultBadge.icon} {resultBadge.text}
                  </span>
                </div>
                
                <div className="item-body">
                  <h4>{insp.equipmentName}</h4>
                  <p className="equipment-type">{insp.equipmentType}</p>
                  <div className="item-meta">
                    <span>🏢 {insp.clientName}</span>
                    <span>📅 {formatDate(insp.date)}</span>
                    <span>👤 {insp.inspectorName}</span>
                  </div>
                </div>

                <div className="item-footer">
                  <div className="findings-count">
                    {insp.findingsCount > 0 && (
                      <span className={insp.criticalFindings > 0 ? 'has-critical' : ''}>
                        {insp.findingsCount} ממצאים
                        {insp.criticalFindings > 0 && ` (${insp.criticalFindings} קריטיים)`}
                      </span>
                    )}
                  </div>
                  <div className="item-actions">
                    {onViewReport && insp.reportUrl && (
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewReport(insp);
                        }}
                      >
                        👁️ צפה
                      </button>
                    )}
                    {onDownloadReport && insp.reportUrl && (
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadReport(insp);
                        }}
                      >
                        📥 הורד
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline View */}
      {!loading && filteredInspections.length > 0 && viewMode === 'timeline' && (
        <div className="history-timeline">
          {groupedByDate.map(([date, items]) => (
            <div key={date} className="timeline-group">
              <div className="timeline-date">
                <span className="date-badge">{date}</span>
                <span className="date-count">{items.length} בדיקות</span>
              </div>
              <div className="timeline-items">
                {items.map(insp => {
                  const resultBadge = getResultBadge(insp.result);
                  return (
                    <div
                      key={insp.id}
                      className={`timeline-item ${resultBadge.className}`}
                      onClick={() => onSelect?.(insp)}
                    >
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <strong>{insp.equipmentName}</strong>
                        <span className="client">{insp.clientName}</span>
                        <span className="result">{resultBadge.icon} {resultBadge.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {!loading && filteredInspections.length > 0 && viewMode === 'table' && (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th onClick={() => { setSortBy('date'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}>
                  תאריך {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>ציוד</th>
                <th onClick={() => { setSortBy('client'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}>
                  לקוח {sortBy === 'client' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>בודק</th>
                <th onClick={() => { setSortBy('result'); setSortOrder(o => o === 'asc' ? 'desc' : 'asc'); }}>
                  תוצאה {sortBy === 'result' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>ממצאים</th>
                <th>תעודה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredInspections.map(insp => {
                const resultBadge = getResultBadge(insp.result);
                return (
                  <tr key={insp.id} onClick={() => onSelect?.(insp)}>
                    <td>{formatDate(insp.date)}</td>
                    <td>
                      <div className="equipment-cell">
                        <strong>{insp.equipmentName}</strong>
                        <span>{insp.equipmentType}</span>
                      </div>
                    </td>
                    <td>{insp.clientName}</td>
                    <td>{insp.inspectorName}</td>
                    <td>
                      <span className={`result-badge small ${resultBadge.className}`}>
                        {resultBadge.icon} {resultBadge.text}
                      </span>
                    </td>
                    <td>{insp.findingsCount}</td>
                    <td>{insp.certificateNumber || '-'}</td>
                    <td>
                      <div className="table-actions">
                        {onViewReport && (
                          <button onClick={(e) => { e.stopPropagation(); onViewReport(insp); }}>
                            👁️
                          </button>
                        )}
                        {onDownloadReport && (
                          <button onClick={(e) => { e.stopPropagation(); onDownloadReport(insp); }}>
                            📥
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const InspectionHistoryStyles = `
.inspection-history {
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.history-header h2 {
  margin: 0;
  font-size: 24px;
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

/* Stats */
.history-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-card.success { border-top: 3px solid #22c55e; }
.stat-card.warning { border-top: 3px solid #f59e0b; }
.stat-card.danger { border-top: 3px solid #ef4444; }

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

/* Filters */
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
}

.filters-bar input,
.filters-bar select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.search-input {
  min-width: 200px;
}

.clear-filters {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
}

/* List View */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.domain-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: white;
}

.result-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.result-badge.result-pass {
  background: #dcfce7;
  color: #166534;
}

.result-badge.result-conditional {
  background: #fef3c7;
  color: #92400e;
}

.result-badge.result-fail {
  background: #fee2e2;
  color: #991b1b;
}

.item-body h4 {
  margin: 0 0 4px;
  font-size: 16px;
}

.equipment-type {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 14px;
}

.item-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.findings-count .has-critical {
  color: #dc2626;
  font-weight: 500;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.action-btn:hover {
  background: #e5e7eb;
}

/* Timeline View */
.history-timeline {
  position: relative;
}

.timeline-group {
  margin-bottom: 24px;
}

.timeline-date {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.date-badge {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  font-weight: 500;
}

.date-count {
  color: #6b7280;
  font-size: 14px;
}

.timeline-items {
  padding-right: 24px;
  border-right: 2px solid #e5e7eb;
  margin-right: 12px;
}

.timeline-item {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
}

.timeline-dot {
  position: absolute;
  right: -30px;
  top: 16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
  border: 2px solid white;
}

.timeline-item.result-pass .timeline-dot { background: #22c55e; }
.timeline-item.result-conditional .timeline-dot { background: #f59e0b; }
.timeline-item.result-fail .timeline-dot { background: #ef4444; }

.timeline-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.timeline-content strong {
  margin-left: 8px;
}

.timeline-content .client {
  color: #6b7280;
}

.timeline-content .result {
  margin-right: auto;
  font-size: 13px;
}

/* Table View */
.history-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 12px;
  text-align: right;
  border-bottom: 1px solid #e5e7eb;
}

.history-table th {
  background: #f9fafb;
  font-weight: 600;
  cursor: pointer;
}

.history-table tr:hover {
  background: #f9fafb;
}

.equipment-cell {
  display: flex;
  flex-direction: column;
}

.equipment-cell span {
  font-size: 12px;
  color: #6b7280;
}

.result-badge.small {
  padding: 2px 8px;
  font-size: 11px;
}

.table-actions {
  display: flex;
  gap: 4px;
}

.table-actions button {
  padding: 4px 8px;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* Empty & Loading */
.empty-state,
.loading {
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .history-stats {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .filters-bar {
    flex-direction: column;
  }
  
  .item-meta {
    flex-direction: column;
    gap: 4px;
  }
}
`;

export default InspectionHistory;
