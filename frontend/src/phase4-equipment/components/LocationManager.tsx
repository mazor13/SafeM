/**
 * AEGIS Location Management Components
 * ניהול מיקומים היררכי - אתר > בניין > קומה > חדר > אזור
 */

import React, { useState, useMemo } from 'react';
import { Location } from '../types/equipment.types';

// ============================================
// 🎨 Types
// ============================================

export type LocationLevel = 'site' | 'building' | 'floor' | 'room' | 'area';

export const LOCATION_LEVELS: Record<LocationLevel, { name: string; icon: string; canHaveChildren: LocationLevel[] }> = {
  site: { name: 'אתר', icon: '🏭', canHaveChildren: ['building', 'area'] },
  building: { name: 'בניין', icon: '🏢', canHaveChildren: ['floor', 'room', 'area'] },
  floor: { name: 'קומה', icon: '🔲', canHaveChildren: ['room', 'area'] },
  room: { name: 'חדר', icon: '🚪', canHaveChildren: ['area'] },
  area: { name: 'אזור', icon: '📍', canHaveChildren: [] },
};

// ============================================
// 🌳 Location Tree Component
// ============================================

interface LocationTreeProps {
  locations: Location[];
  selectedId?: string;
  onSelect?: (location: Location) => void;
  onAdd?: (parentId: string | null, level: LocationLevel) => void;
  onEdit?: (location: Location) => void;
  onDelete?: (location: Location) => void;
  expandedIds?: string[];
  onToggleExpand?: (id: string) => void;
}

export const LocationTree: React.FC<LocationTreeProps> = ({
  locations,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  expandedIds: controlledExpandedIds,
  onToggleExpand,
}) => {
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>([]);
  
  const expandedIds = controlledExpandedIds ?? internalExpandedIds;
  
  const toggleExpand = (id: string) => {
    if (onToggleExpand) {
      onToggleExpand(id);
    } else {
      setInternalExpandedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    }
  };

  // Build tree structure
  const tree = useMemo(() => {
    const map = new Map<string | null, Location[]>();
    
    locations.forEach(loc => {
      const parentId = loc.parentId || null;
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)!.push(loc);
    });

    // Sort each level by name
    map.forEach(children => {
      children.sort((a, b) => a.name.localeCompare(b.name, 'he'));
    });

    return map;
  }, [locations]);

  // Get children of a location
  const getChildren = (parentId: string | null): Location[] => {
    return tree.get(parentId) || [];
  };

  // Recursive render
  const renderNode = (location: Location, depth: number = 0): React.ReactNode => {
    const children = getChildren(location.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.includes(location.id);
    const isSelected = selectedId === location.id;
    const levelInfo = LOCATION_LEVELS[location.level];
    const canAddChildren = levelInfo.canHaveChildren.length > 0;

    return (
      <div key={location.id} className="tree-node">
        <div
          className={`tree-item ${isSelected ? 'selected' : ''}`}
          style={{ paddingRight: `${depth * 24 + 12}px` }}
        >
          {/* Expand/Collapse Button */}
          <button
            className={`expand-btn ${hasChildren ? '' : 'invisible'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(location.id);
            }}
          >
            {isExpanded ? '▼' : '◀'}
          </button>

          {/* Icon */}
          <span className="level-icon">{levelInfo.icon}</span>

          {/* Name */}
          <span
            className="node-name"
            onClick={() => onSelect?.(location)}
          >
            {location.name}
            {location.code && <span className="node-code">({location.code})</span>}
          </span>

          {/* Equipment Count */}
          {location.equipmentCount !== undefined && location.equipmentCount > 0 && (
            <span className="equipment-count">{location.equipmentCount}</span>
          )}

          {/* Actions */}
          <div className="node-actions">
            {canAddChildren && onAdd && (
              <button
                className="action-btn add"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(location.id, levelInfo.canHaveChildren[0]);
                }}
                title="הוסף תת-מיקום"
              >
                +
              </button>
            )}
            {onEdit && (
              <button
                className="action-btn edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(location);
                }}
                title="ערוך"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                className="action-btn delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(location);
                }}
                title="מחק"
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="tree-children">
            {children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Root locations (no parent)
  const rootLocations = getChildren(null);

  return (
    <div className="location-tree" dir="rtl">
      {/* Header */}
      <div className="tree-header">
        <h3>מבנה מיקומים</h3>
        {onAdd && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAdd(null, 'site')}
          >
            + אתר חדש
          </button>
        )}
      </div>

      {/* Tree Content */}
      <div className="tree-content">
        {rootLocations.length === 0 ? (
          <div className="empty-tree">
            <span className="empty-icon">📍</span>
            <p>אין מיקומים</p>
            {onAdd && (
              <button
                className="btn btn-primary"
                onClick={() => onAdd(null, 'site')}
              >
                + הוסף אתר ראשון
              </button>
            )}
          </div>
        ) : (
          rootLocations.map(loc => renderNode(loc, 0))
        )}
      </div>
    </div>
  );
};

// ============================================
// 📝 Location Form Component
// ============================================

interface LocationFormProps {
  location?: Location;
  parentLocation?: Location;
  clientId: string;
  level: LocationLevel;
  onSave: (data: Partial<Location>) => Promise<void>;
  onCancel: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  location,
  parentLocation,
  clientId,
  level,
  onSave,
  onCancel,
}) => {
  const isEdit = !!location;
  const levelInfo = LOCATION_LEVELS[level];

  const [formData, setFormData] = useState<Partial<Location>>({
    clientId,
    parentId: parentLocation?.id || null,
    level,
    name: '',
    ...location,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof Location, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = 'שם הוא שדה חובה';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving location:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="location-form" onSubmit={handleSubmit} dir="rtl">
      <div className="form-header">
        <h3>
          {isEdit ? 'עריכת' : 'הוספת'} {levelInfo.name} {levelInfo.icon}
        </h3>
        <button type="button" className="close-btn" onClick={onCancel}>✕</button>
      </div>

      {parentLocation && (
        <div className="parent-info">
          <span className="label">תחת:</span>
          <span className="parent-name">
            {LOCATION_LEVELS[parentLocation.level].icon} {parentLocation.name}
          </span>
        </div>
      )}

      <div className="form-content">
        <div className="form-field">
          <label htmlFor="name">שם {levelInfo.name} *</label>
          <input
            id="name"
            type="text"
            value={formData.name || ''}
            onChange={e => handleChange('name', e.target.value)}
            placeholder={`לדוגמה: ${level === 'site' ? 'מפעל ראשי' : level === 'building' ? 'בניין A' : level === 'floor' ? 'קומה 2' : level === 'room' ? 'חדר 201' : 'אזור ייצור'}`}
            className={errors.name ? 'error' : ''}
            autoFocus
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="code">קוד/מזהה</label>
          <input
            id="code"
            type="text"
            value={formData.code || ''}
            onChange={e => handleChange('code', e.target.value)}
            placeholder="אופציונלי"
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">תיאור</label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={e => handleChange('description', e.target.value)}
            rows={2}
          />
        </div>

        {/* Address fields for site level */}
        {level === 'site' && (
          <>
            <h4>כתובת</h4>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="street">רחוב</label>
                <input
                  id="street"
                  type="text"
                  value={formData.address?.street || ''}
                  onChange={e => handleChange('address', { ...formData.address, street: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="city">עיר</label>
                <input
                  id="city"
                  type="text"
                  value={formData.address?.city || ''}
                  onChange={e => handleChange('address', { ...formData.address, city: e.target.value })}
                />
              </div>
            </div>
          </>
        )}

        <h4>איש קשר</h4>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="contactPerson">שם</label>
            <input
              id="contactPerson"
              type="text"
              value={formData.contactPerson || ''}
              onChange={e => handleChange('contactPerson', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="contactPhone">טלפון</label>
            <input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone || ''}
              onChange={e => handleChange('contactPhone', e.target.value)}
              dir="ltr"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="contactEmail">אימייל</label>
          <input
            id="contactEmail"
            type="email"
            value={formData.contactEmail || ''}
            onChange={e => handleChange('contactEmail', e.target.value)}
            dir="ltr"
          />
        </div>
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
// 📋 Location Breadcrumb Component
// ============================================

interface LocationBreadcrumbProps {
  locations: Location[];
  currentId: string;
  onNavigate?: (location: Location | null) => void;
}

export const LocationBreadcrumb: React.FC<LocationBreadcrumbProps> = ({
  locations,
  currentId,
  onNavigate,
}) => {
  const path = useMemo(() => {
    const result: Location[] = [];
    let current = locations.find(l => l.id === currentId);
    
    while (current) {
      result.unshift(current);
      current = locations.find(l => l.id === current?.parentId);
    }
    
    return result;
  }, [locations, currentId]);

  return (
    <nav className="location-breadcrumb" dir="rtl">
      <button
        className="breadcrumb-item root"
        onClick={() => onNavigate?.(null)}
      >
        🏠 ראשי
      </button>
      {path.map((loc, index) => (
        <React.Fragment key={loc.id}>
          <span className="breadcrumb-separator">◀</span>
          <button
            className={`breadcrumb-item ${index === path.length - 1 ? 'current' : ''}`}
            onClick={() => onNavigate?.(loc)}
          >
            {LOCATION_LEVELS[loc.level].icon} {loc.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const LocationStyles = `
/* Location Tree */
.location-tree {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.tree-header h3 {
  margin: 0;
  font-size: 16px;
  color: #111827;
}

.tree-content {
  max-height: 500px;
  overflow-y: auto;
}

.tree-node {
  /* Container for recursion */
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.15s;
}

.tree-item:hover {
  background: #f9fafb;
}

.tree-item.selected {
  background: #eff6ff;
  border-right: 3px solid #3b82f6;
}

.expand-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  color: #6b7280;
  border-radius: 4px;
}

.expand-btn:hover {
  background: #e5e7eb;
}

.expand-btn.invisible {
  visibility: hidden;
}

.level-icon {
  font-size: 16px;
}

.node-name {
  flex: 1;
  font-size: 14px;
  color: #111827;
}

.node-code {
  color: #6b7280;
  font-size: 12px;
  margin-right: 4px;
}

.equipment-count {
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 500;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.tree-item:hover .node-actions {
  opacity: 1;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
}

.action-btn:hover {
  background: #e5e7eb;
}

.action-btn.delete:hover {
  background: #fee2e2;
}

.tree-children {
  /* Children container */
}

.empty-tree {
  text-align: center;
  padding: 32px;
  color: #6b7280;
}

.empty-tree .empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

/* Location Form */
.location-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  max-width: 500px;
  margin: 0 auto;
}

.location-form .form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.location-form .form-header h3 {
  margin: 0;
  font-size: 18px;
}

.location-form .close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  font-size: 18px;
}

.location-form .close-btn:hover {
  background: #f3f4f6;
}

.parent-info {
  padding: 12px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.parent-info .label {
  color: #6b7280;
  margin-left: 8px;
}

.parent-info .parent-name {
  color: #111827;
  font-weight: 500;
}

.location-form .form-content {
  padding: 20px;
}

.location-form h4 {
  margin: 16px 0 12px;
  font-size: 14px;
  color: #374151;
}

.location-form .form-field {
  margin-bottom: 16px;
}

.location-form .form-field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.location-form input,
.location-form textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-sizing: border-box;
}

.location-form input:focus,
.location-form textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.location-form input.error {
  border-color: #ef4444;
}

.location-form .error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

.location-form .form-row {
  display: flex;
  gap: 12px;
}

.location-form .form-row .form-field {
  flex: 1;
}

.location-form .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* Location Breadcrumb */
.location-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.breadcrumb-item {
  padding: 6px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #3b82f6;
  border-radius: 6px;
  white-space: nowrap;
}

.breadcrumb-item:hover {
  background: #eff6ff;
}

.breadcrumb-item.current {
  background: #eff6ff;
  font-weight: 500;
}

.breadcrumb-item.root {
  color: #6b7280;
}

.breadcrumb-separator {
  color: #d1d5db;
  font-size: 10px;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  border: none;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
`;

export default LocationTree;
