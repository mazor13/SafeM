# 🔧 Dynamic Entity Engine - Technical Specification
**Version:** 1.0  
**Date:** January 2026  
**Status:** Planning

---

## 1. מטרת הפיצ'ר (Feature Goal)

להוסיף למערכת AEGIS/SafeM יכולת **דינמית** להוספת עמודות מותאמות אישית לישויות קיימות, בדומה ל-Monday.com / Aether Core.

### Use Cases:
- **Tenant A** רוצה להוסיף עמודה "עלות תיקון" ל-Findings
- **Tenant B** רוצה להוסיף עמודת "ספק" ל-Equipment  
- **Tenant C** רוצה עמודת "אחראי פנימי" ל-Tasks

---

## 2. ארכיטקטורה (Architecture)

### 2.1 Data Model Changes

#### New Collection: `columnDefinitions`
```
Firestore:
  tenants/{tenantId}/columnDefinitions/{columnId}
    - id: string
    - entityType: 'finding' | 'equipment' | 'inspection' | 'task' | 'client' | 'facility'
    - type: 'text' | 'number' | 'status' | 'person' | 'date' | 'priority' | 'file'
    - title: string
    - width: number (default: 150)
    - order: number
    - settings: {
        options?: { id, label, color }[]  // For status/dropdown
        format?: string                   // For date/number
        required?: boolean
        defaultValue?: any
      }
    - createdAt: Timestamp
    - createdBy: string (userId)
    - isActive: boolean
```

#### Modified Entity Structure
```typescript
// Before (static)
interface Finding {
  id: string;
  title: string;
  status: 'open' | 'closed';
  severity: string;
}

// After (dynamic)
interface Finding {
  // Core fields (unchanged)
  id: string;
  title: string;
  status: 'open' | 'closed';
  severity: string;
  
  // NEW: Dynamic columns
  columnValues: {
    [columnId: string]: CellValue;
  };
  // Example:
  // columnValues: {
  //   'col_cost': 5000,
  //   'col_vendor': 'Acme Corp',
  //   'col_custom_priority': 'p1'
  // }
}

type CellValue = string | number | boolean | string[] | null;
```

---

## 3. רכיבי Frontend (Frontend Components)

### 3.1 Cell Factory System
```
components/cells/
  ├── CellFactory.tsx       # Main renderer
  ├── TextCell.tsx
  ├── NumberCell.tsx
  ├── StatusCell.tsx        # Dropdown with colors
  ├── PersonCell.tsx        # User picker
  ├── DateCell.tsx
  ├── PriorityCell.tsx
  └── FileCell.tsx
```

### 3.2 Column Management UI
```
components/columns/
  ├── ColumnManager.tsx     # Modal to add/edit columns
  ├── ColumnSettings.tsx    # Configure column (type, options, etc.)
  └── ColumnList.tsx        # Reorderable list of columns
```

### 3.3 Dynamic Table Component
```typescript
// components/DynamicTable.tsx
<DynamicTable
  entityType="finding"
  items={findings}
  onUpdate={(itemId, columnId, value) => ...}
  onAddColumn={() => ...}
/>
```

---

## 4. Hooks & State Management

### 4.1 Custom Hooks
```typescript
// hooks/useColumnDefinitions.ts
const { 
  columns,           // ColumnDefinition[]
  loading,
  addColumn,
  updateColumn,
  deleteColumn,
  reorderColumns
} = useColumnDefinitions('finding');

// hooks/useDynamicEntity.ts
const {
  items,             // Finding[] with columnValues
  updateCellValue,   // (itemId, columnId, value) => Promise
  loading
} = useDynamicEntity('finding');
```

### 4.2 Zustand Store (Optional)
```typescript
// stores/columnStore.ts
interface ColumnStore {
  definitions: Record<EntityType, ColumnDefinition[]>;
  loadColumns: (entityType: EntityType) => Promise<void>;
  updateCell: (entityType, itemId, columnId, value) => Promise<void>;
}
```

---

## 5. פירוק משימות (Task Breakdown)

### Milestone: **Dynamic Entity Engine v1.0**

---

### Epic 1: Foundation & Data Model
**Estimated:** 2-3 days

#### Issue #110: Create ColumnDefinition type system
- [ ] Define TypeScript types (`ColumnDefinition`, `CellValue`, `ColumnType`)
- [ ] Add to `/src/types/columns.ts`
- [ ] Export from main types

#### Issue #111: Add Firestore schema for columnDefinitions
- [ ] Create security rules for `columnDefinitions` subcollection
- [ ] Add indexes for queries (`entityType`, `order`)
- [ ] Write migration helper to add `columnValues` field to existing entities

#### Issue #112: Create useColumnDefinitions hook
- [ ] Implement `useColumnDefinitions(entityType)` hook
- [ ] CRUD operations: add, update, delete, reorder
- [ ] Real-time listener for column changes
- [ ] Cache with React Query

---

### Epic 2: Cell Factory System
**Estimated:** 3-4 days

#### Issue #113: Build CellFactory component
- [ ] Create base `CellFactory.tsx` with type switch
- [ ] Add props interface (`CellProps`)
- [ ] Implement error boundaries

#### Issue #114: Implement Text Cell
- [ ] Editable input with auto-save
- [ ] Character limit support
- [ ] Validation

#### Issue #115: Implement Number Cell
- [ ] Number input with formatting
- [ ] Min/max validation
- [ ] Support for currency/percentage

#### Issue #116: Implement Status Cell
- [ ] Dropdown with color pills
- [ ] Configurable options from column settings
- [ ] Keyboard navigation

#### Issue #117: Implement Person Cell
- [ ] User picker dropdown
- [ ] Avatar display
- [ ] Search functionality

#### Issue #118: Implement Date Cell
- [ ] Date picker integration
- [ ] Multiple format support (DD/MM/YYYY)
- [ ] Relative dates (e.g., "2 days ago")

#### Issue #119: Implement Priority Cell  
- [ ] Fixed priority levels (Low/Medium/High/Urgent)
- [ ] Color-coded badges
- [ ] Quick toggle

---

### Epic 3: Column Management UI
**Estimated:** 2-3 days

#### Issue #120: Build ColumnManager modal
- [ ] Add Column button in table header
- [ ] Modal with column type selection
- [ ] Form for title, type, settings
- [ ] Validation

#### Issue #121: Create ColumnSettings component
- [ ] Type-specific settings (e.g., status options)
- [ ] Width adjustment
- [ ] Required/optional toggle
- [ ] Default value

#### Issue #122: Implement column reordering
- [ ] Drag & drop column headers
- [ ] Save order to Firestore
- [ ] Visual feedback during drag

---

### Epic 4: Dynamic Tables Integration
**Estimated:** 3-4 days

#### Issue #123: Create DynamicTable component
- [ ] Renders core fields + dynamic columns
- [ ] Uses CellFactory for dynamic cells
- [ ] Optimistic updates
- [ ] Loading states

#### Issue #124: Refactor Findings page to use DynamicTable
- [ ] Replace static table with `<DynamicTable entityType="finding" />`
- [ ] Migrate existing data
- [ ] Test all CRUD operations

#### Issue #125: Add dynamic columns to Equipment
- [ ] Implement DynamicTable for Equipment
- [ ] Add column management UI
- [ ] Test

#### Issue #126: Add dynamic columns to Tasks
- [ ] Implement DynamicTable for Tasks
- [ ] Integrate with existing Kanban view
- [ ] Test

#### Issue #127: Add dynamic columns to Inspections
- [ ] Implement DynamicTable for Inspections
- [ ] Test

---

### Epic 5: Polish & Performance
**Estimated:** 2 days

#### Issue #128: Add column templates
- [ ] Pre-defined column sets (e.g., "Cost Tracking", "Vendor Management")
- [ ] Template library UI
- [ ] Import/export columns

#### Issue #129: Performance optimization
- [ ] Virtualize table rows (TanStack Virtual)
- [ ] Debounce cell updates
- [ ] Optimize Firestore queries

#### Issue #130: Documentation
- [ ] User guide: How to add columns
- [ ] Developer docs: How to add new cell types
- [ ] API documentation

---

## 6. Testing Strategy

### Unit Tests
- [ ] Cell components (each type)
- [ ] useColumnDefinitions hook
- [ ] Data transformations

### Integration Tests
- [ ] Add column → Save → Reload
- [ ] Update cell value → Sync to Firestore
- [ ] Delete column → Archive data

### E2E Tests
- [ ] User flow: Add custom column to Findings
- [ ] User flow: Fill custom column values
- [ ] User flow: Filter/sort by custom column

---

## 7. Migration Plan

### Phase 1: Additive (No Breaking Changes)
- Add `columnValues` field to entities (starts empty)
- Deploy column management UI
- Tenants can start adding columns

### Phase 2: Data Migration (Optional)
- Script to migrate old static fields to dynamic columns
- Example: `finding.customField1` → `columnValues['col_custom1']`

---

## 8. Security Considerations

### Firestore Rules
```javascript
match /tenants/{tenantId}/columnDefinitions/{columnId} {
  // Only tenant members can read
  allow read: if isTenantMember(tenantId);
  
  // Only admins can write
  allow write: if isTenantAdmin(tenantId);
}
```

### Validation
- Column titles max 50 chars
- Max 50 custom columns per entity type
- Prevent duplicate column titles

---

## 9. Success Metrics

- [ ] Tenant can add custom column in < 30 seconds
- [ ] Table with 20 columns + 1000 rows loads in < 2s
- [ ] Cell updates reflect in UI in < 100ms (optimistic)
- [ ] Zero data loss during migration

---

## 10. Future Enhancements (v2.0)

- [ ] Formula columns (e.g., `=SUM(column1, column2)`)
- [ ] Conditional formatting
- [ ] Column dependencies (show/hide based on other column)
- [ ] Bulk edit cells
- [ ] Column-level permissions
- [ ] API to manage columns programmatically

---

**Document Status:** ✅ Ready for Implementation  
**Next Step:** Create GitHub Issues from Epic breakdown
