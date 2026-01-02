/**
 * AEGIS Equipment List Component
 * רשימת ציוד עם סינון ומיון
 */

import React, { useState, useMemo } from 'react';
import {
  Equipment,
  EquipmentFilters,
  EquipmentStatus,
  EQUIPMENT_STATUS_LABELS,
  EQUIPMENT_TYPES,
  getEquipmentTypeById,
  isInspectionOverdue,
  isInspectionDueSoon,
  formatEquipmentId,
} from '../types/equipment.types';
import { SafetyDomain, SAFETY_DOMAINS } from '../types/safety';

// ============================================
// 🎨 Props
// ============================================

interface EquipmentListProps {
  equipment: Equipment[];
  onSelect?: (equipment: Equipment) => void;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (equipment: Equipment) => void;
  onAddNew?: () => void;
  loading?: boolean;
  clientId?: string;
}

// ============================================
// 📋 Equipment List Component
// ============================================

export const EquipmentList: React.FC<EquipmentListProps> = ({
  equipment,
  onSelect,
  onEdit,
  onDelete,
  onAddNew,
  loading = false,
  clientId,
}) => {
  // Filters state
  const [filters, setFilters] = useState<EquipmentFilters>({
    clientId,
  });
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'nextInspection'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filter equipment
  const filteredEquipment = useMemo(() => {
    let result = [...equipment];

    // Apply filters
    if (filters.domain) {
      result = result.filter(e => e.domain === filters.domain);
    }
    if (filters.status) {
      result = result.filter(e => e.status === filters.status);
    }
    if (filters.equipmentTypeId) {
      result = result.filter(e => e.equipmentTypeId === filters.equipmentTypeId);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(term) ||
        e.serialNumber?.toLowerCase().includes(term) ||
        e.internalId?.toLowerCase().includes(term) ||
        e.manufacturer?.toLowerCase().includes(term) ||
        e.model?.toLowerCase().includes(term)
      );
    }
    if (filters.inspectionOverdue) {
      result = result.filter(isInspectionOverdue);
    }
    if (filters.inspectionDueSoon) {
      result = result.filter(e => isInspectionDueSoon(e, filters.inspectionDueSoon));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'he');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'nextInspection':
          const dateA = a.nextInspectionDate ? new Date(a.nextInspectionDate).getTime() : Infinity;
          const dateB = b.nextInspectionDate ? new Date(b.nextInspectionDate).getTime() : Infinity;
          comparison = dateA - dateB;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [equipment, filters, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    const overdue = equipment.filter(isInspectionOverdue).length;
    const dueSoon = equipment.filter(e => isInspectionDueSoon(e, 30)).length;
    return { total: equipment.length, overdue, dueSoon };
  }, [equipment]);

  // Handle filter change
  const updateFilter = (key: keyof EquipmentFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  // Format date
  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('he-IL');
  };

  // Get status badge
  const StatusBadge: React.FC<{ status: EquipmentStatus }> = ({ status }) => {
    const label = EQUIPMENT_STATUS_LABELS[status];
    return (
      <span className={`status-badge status-${label.color}`}>
        {label.he}
      </span>
    );
  };

  // Get inspection status indicator
  const InspectionIndicator: React.FC<{ equipment: Equipment }> = ({ equipment: eq }) => {
    if (isInspectionOverdue(eq)) {
      return <span className="inspection-indicator overdue">באיחור</span>;
    }
    if (isInspectionDueSoon(eq, 30)) {
      return <span className="inspection-indicator due-soon">בקרוב</span>;
    }
    return <span className="inspection-indicator ok">תקין</span>;
  };

  return (
    <div className="equipment-list" dir="rtl">
      {/* Header */}
      <div className="list-header">
        <div className="header-title">
          <h2>ניהול ציוד</h2>
          <span className="count">({stats.total} פריטים)</span>
        </div>
        {onAddNew && (
          <button className="btn btn-primary" onClick={onAddNew}>
            + הוסף ציוד
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">סה"כ ציוד</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{stats.dueSoon}</div>
          <div className="stat-label">בדיקה בקרוב</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-value">{stats.overdue}</div>
          <div className="stat-label">באיחור</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <input
            type="text"
            placeholder="חיפוש..."
            value={filters.searchTerm || ''}
            onChange={e => updateFilter('searchTerm', e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.domain || ''}
            onChange={e => updateFilter('domain', e.target.value)}
            className="filter-select"
          >
            <option value="">כל התחומים</option>
            {Object.entries(SAFETY_DOMAINS).map(([key, domain]) => (
              <option key={key} value={key}>{domain.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filters.status || ''}
            onChange={e => updateFilter('status', e.target.value)}
            className="filter-select"
          >
            <option value="">כל הסטטוסים</option>
            {Object.entries(EQUIPMENT_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label.he}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="checkbox-filter">
            <input
              type="checkbox"
              checked={filters.inspectionOverdue || false}
              onChange={e => updateFilter('inspectionOverdue', e.target.checked)}
            />
            <span>באיחור בלבד</span>
          </label>
        </div>

        <div className="filter-group">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="name">מיין לפי שם</option>
            <option value="status">מיין לפי סטטוס</option>
            <option value="nextInspection">מיין לפי בדיקה הבאה</option>
          </select>
          <button
            className="sort-toggle"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="view-toggle">
          <button
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            ☰
          </button>
          <button
            className={viewMode === 'cards' ? 'active' : ''}
            onClick={() => setViewMode('cards')}
          >
            ⊞
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <span>טוען...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEquipment.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>לא נמצא ציוד</h3>
          <p>
            {filters.searchTerm || filters.domain || filters.status
              ? 'נסה לשנות את הסינון'
              : 'הוסף ציוד חדש כדי להתחיל'}
          </p>
          {onAddNew && !filters.searchTerm && (
            <button className="btn btn-primary" onClick={onAddNew}>
              + הוסף ציוד ראשון
            </button>
          )}
        </div>
      )}

      {/* Table View */}
      {!loading && filteredEquipment.length > 0 && viewMode === 'table' && (
        <div className="table-container">
          <table className="equipment-table">
            <thead>
              <tr>
                <th>שם</th>
                <th>סוג</th>
                <th>מס' סידורי</th>
                <th>יצרן</th>
                <th>סטטוס</th>
                <th>בדיקה הבאה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map(eq => {
                const eqType = getEquipmentTypeById(eq.equipmentTypeId);
                return (
                  <tr
                    key={eq.id}
                    onClick={() => onSelect?.(eq)}
                    className={onSelect ? 'clickable' : ''}
                  >
                    <td className="name-cell">
                      <div className="name-primary">{eq.name}</div>
                      <div className="name-secondary">{formatEquipmentId(eq)}</div>
                    </td>
                    <td>{eqType?.name || eq.equipmentTypeId}</td>
                    <td dir="ltr">{eq.serialNumber || '-'}</td>
                    <td>{eq.manufacturer || '-'}</td>
                    <td><StatusBadge status={eq.status} /></td>
                    <td>
                      <div className="inspection-cell">
                        <span>{formatDate(eq.nextInspectionDate)}</span>
                        <InspectionIndicator equipment={eq} />
                      </div>
                    </td>
                    <td className="actions-cell">
                      {onEdit && (
                        <button
                          className="btn-icon"
                          onClick={e => { e.stopPropagation(); onEdit(eq); }}
                          title="ערוך"
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="btn-icon danger"
                          onClick={e => { e.stopPropagation(); onDelete(eq); }}
                          title="מחק"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {!loading && filteredEquipment.length > 0 && viewMode === 'cards' && (
        <div className="cards-grid">
          {filteredEquipment.map(eq => {
            const eqType = getEquipmentTypeById(eq.equipmentTypeId);
            const domainInfo = SAFETY_DOMAINS[eq.domain];
            return (
              <div
                key={eq.id}
                className={`equipment-card ${onSelect ? 'clickable' : ''}`}
                onClick={() => onSelect?.(eq)}
              >
                <div className="card-header">
                  <span className="domain-badge" style={{ background: domainInfo?.color }}>
                    {domainInfo?.name || eq.domain}
                  </span>
                  <StatusBadge status={eq.status} />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{eq.name}</h3>
                  <p className="card-type">{eqType?.name}</p>
                  <div className="card-details">
                    {eq.manufacturer && (
                      <div className="detail-row">
                        <span className="detail-label">יצרן:</span>
                        <span>{eq.manufacturer}</span>
                      </div>
                    )}
                    {eq.model && (
                      <div className="detail-row">
                        <span className="detail-label">דגם:</span>
                        <span>{eq.model}</span>
                      </div>
                    )}
                    {eq.serialNumber && (
                      <div className="detail-row">
                        <span className="detail-label">מס' סידורי:</span>
                        <span dir="ltr">{eq.serialNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <div className="inspection-info">
                    <span className="label">בדיקה הבאה:</span>
                    <span className="date">{formatDate(eq.nextInspectionDate)}</span>
                    <InspectionIndicator equipment={eq} />
                  </div>
                  {(onEdit || onDelete) && (
                    <div className="card-actions">
                      {onEdit && (
                        <button
                          className="btn-icon"
                          onClick={e => { e.stopPropagation(); onEdit(eq); }}
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="btn-icon danger"
                          onClick={e => { e.stopPropagation(); onDelete(eq); }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const EquipmentListStyles = `
.equipment-list {
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.header-title h2 {
  margin: 0;
  font-size: 24px;
  color: #111827;
}

.header-title .count {
  color: #6b7280;
  font-size: 14px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-card.warning {
  border-right: 4px solid #f59e0b;
}

.stat-card.danger {
  border-right: 4px solid #ef4444;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 200px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.checkbox-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.sort-toggle {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  margin-right: auto;
}

.view-toggle button {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  cursor: pointer;
}

.view-toggle button:first-child {
  border-radius: 8px 0 0 8px;
}

.view-toggle button:last-child {
  border-radius: 0 8px 8px 0;
  border-right: none;
}

.view-toggle button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.equipment-table {
  width: 100%;
  border-collapse: collapse;
}

.equipment-table th {
  text-align: right;
  padding: 12px 16px;
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.equipment-table td {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
}

.equipment-table tr.clickable {
  cursor: pointer;
}

.equipment-table tr.clickable:hover {
  background: #f9fafb;
}

.name-cell .name-primary {
  font-weight: 500;
  color: #111827;
}

.name-cell .name-secondary {
  font-size: 12px;
  color: #6b7280;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.status-green {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-yellow {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-red {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.status-orange {
  background: #ffedd5;
  color: #9a3412;
}

.status-badge.status-gray {
  background: #f3f4f6;
  color: #4b5563;
}

.inspection-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.inspection-indicator {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.inspection-indicator.overdue {
  background: #fee2e2;
  color: #991b1b;
}

.inspection-indicator.due-soon {
  background: #fef3c7;
  color: #92400e;
}

.inspection-indicator.ok {
  background: #d1fae5;
  color: #065f46;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}

.btn-icon:hover {
  background: #f3f4f6;
}

.btn-icon.danger:hover {
  background: #fee2e2;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.equipment-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.equipment-card.clickable {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.equipment-card.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
}

.domain-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.card-body {
  padding: 16px;
}

.card-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #111827;
}

.card-type {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #6b7280;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.detail-label {
  color: #6b7280;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.inspection-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.inspection-info .label {
  color: #6b7280;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #111827;
}

.empty-state p {
  margin: 0 0 16px 0;
  color: #6b7280;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: white;
  border-radius: 12px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .view-toggle {
    margin-right: 0;
  }
}
`;

export default EquipmentList;
