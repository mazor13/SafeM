#!/bin/bash
REPO="mazor13/SafeM"
MILESTONE="Dynamic Entity Engine v1.0"

echo "🚀 Creating Dynamic Entity Engine Issues"
echo "========================================="

# Epic 1: Foundation & Data Model
echo "📦 Epic 1: Foundation..."

gh issue create -R $REPO \
  -t "Create ColumnDefinition type system" \
  -m "$MILESTONE" \
  -l "enhancement,epic:foundation,priority:high" \
  -b "## Epic: Foundation & Data Model
**Estimated:** 4 hours

## Description
Create TypeScript type definitions for the dynamic column system.

## Tasks
- [ ] Define ColumnType enum
- [ ] Define ColumnDefinition interface
- [ ] Define CellValue type
- [ ] Add to /src/types/columns.ts
- [ ] Export from main types index

## Acceptance Criteria
- All types are properly exported
- JSDoc comments added
- No TypeScript errors"

gh issue create -R $REPO \
  -t "Add Firestore schema for columnDefinitions" \
  -m "$MILESTONE" \
  -l "enhancement,epic:foundation,priority:high" \
  -b "## Epic: Foundation & Data Model
**Estimated:** 6 hours

## Description
Create Firestore collections and security rules for column definitions.

## Tasks
- [ ] Create columnDefinitions collection
- [ ] Create cellValues subcollection
- [ ] Add security rules
- [ ] Create indexes"

gh issue create -R $REPO \
  -t "Create useColumnDefinitions hook" \
  -m "$MILESTONE" \
  -l "enhancement,epic:foundation,priority:high" \
  -b "## Epic: Foundation & Data Model
**Estimated:** 8 hours

## Description
React hook for managing column definitions.

## Tasks
- [ ] CRUD operations for columns
- [ ] Real-time updates
- [ ] Optimistic updates
- [ ] Error handling"

# Epic 2: Cell Factory System
echo "🔧 Epic 2: Cell Factory..."

gh issue create -R $REPO \
  -t "Build CellFactory component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:cells,priority:high" \
  -b "## Epic: Cell Factory System
**Estimated:** 4 hours

## Description
Factory component that renders the correct cell type.

## Tasks
- [ ] Create CellFactory.tsx
- [ ] Switch by column type
- [ ] Handle view/edit modes
- [ ] Loading states"

gh issue create -R $REPO \
  -t "Implement Text Cell component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:cells,priority:medium" \
  -b "## Epic: Cell Factory System
**Estimated:** 3 hours

## Tasks
- [ ] View mode
- [ ] Edit mode with inline editing
- [ ] Validation
- [ ] Auto-save"

gh issue create -R $REPO \
  -t "Implement Number Cell component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:cells,priority:medium" \
  -b "## Epic: Cell Factory System
**Estimated:** 3 hours

## Tasks
- [ ] View mode with formatting
- [ ] Edit mode
- [ ] Min/max validation
- [ ] Currency support"

gh issue create -R $REPO \
  -t "Implement Status Cell component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:cells,priority:high" \
  -b "## Epic: Cell Factory System
**Estimated:** 4 hours

## Tasks
- [ ] Dropdown with color options
- [ ] Custom status values
- [ ] Color picker
- [ ] Status badges"

gh issue create -R $REPO \
  -t "Implement Person Cell component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:cells,priority:medium" \
  -b "## Epic: Cell Factory System
**Estimated:** 4 hours

## Tasks
- [ ] User dropdown
- [ ] Avatar display
- [ ] Multi-select option
- [ ] Search users"

gh issue create -R $REPO \
  -t "Implement Date Cell component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:cells,priority:medium" \
  -b "## Epic: Cell Factory System
**Estimated:** 3 hours

## Tasks
- [ ] Date picker
- [ ] Date range support
- [ ] Relative dates display
- [ ] Hebrew locale"

gh issue create -R $REPO \
  -t "Implement Priority Cell component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:cells,priority:medium" \
  -b "## Epic: Cell Factory System
**Estimated:** 3 hours

## Tasks
- [ ] Priority levels (Low/Medium/High/Critical)
- [ ] Color coding
- [ ] Icons
- [ ] Dropdown selection"

# Epic 3: Column Management UI
echo "🎨 Epic 3: Column Management..."

gh issue create -R $REPO \
  -t "Build ColumnManager modal" \
  -m "$MILESTONE" \
  -l "enhancement,epic:column-management,priority:high" \
  -b "## Epic: Column Management UI
**Estimated:** 6 hours

## Tasks
- [ ] Add Column button
- [ ] Column type selection
- [ ] Column name input
- [ ] Settings configuration"

gh issue create -R $REPO \
  -t "Create ColumnSettings component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:column-management,priority:medium" \
  -b "## Epic: Column Management UI
**Estimated:** 5 hours

## Tasks
- [ ] Width settings
- [ ] Required toggle
- [ ] Default value
- [ ] Delete column"

gh issue create -R $REPO \
  -t "Implement column reordering" \
  -m "$MILESTONE" \
  -l "enhancement,epic:column-management,priority:medium" \
  -b "## Epic: Column Management UI
**Estimated:** 4 hours

## Tasks
- [ ] Drag and drop columns
- [ ] Persist order
- [ ] Column hiding"

# Epic 4: Dynamic Tables Integration
echo "📊 Epic 4: Integration..."

gh issue create -R $REPO \
  -t "Create DynamicTable component" \
  -m "$MILESTONE" \
  -l "enhancement,epic:integration,priority:high" \
  -b "## Epic: Dynamic Tables Integration
**Estimated:** 8 hours

## Tasks
- [ ] Combine static + dynamic columns
- [ ] Header rendering
- [ ] Row rendering
- [ ] Sorting support"

gh issue create -R $REPO \
  -t "Refactor Findings page with DynamicTable" \
  -m "$MILESTONE" \
  -l "enhancement,epic:integration,priority:high" \
  -b "## Epic: Dynamic Tables Integration
**Estimated:** 6 hours

## Tasks
- [ ] Replace static table
- [ ] Migrate existing columns
- [ ] Add custom columns support
- [ ] Test all functionality"

gh issue create -R $REPO \
  -t "Add DynamicTable to Equipment page" \
  -m "$MILESTONE" \
  -l "enhancement,epic:integration,priority:medium" \
  -b "## Epic: Dynamic Tables Integration
**Estimated:** 4 hours

## Tasks
- [ ] Replace static table
- [ ] Add custom columns
- [ ] Test"

gh issue create -R $REPO \
  -t "Add DynamicTable to Tasks page" \
  -m "$MILESTONE" \
  -l "enhancement,epic:integration,priority:medium" \
  -b "## Epic: Dynamic Tables Integration
**Estimated:** 4 hours

## Tasks
- [ ] Replace static table
- [ ] Add custom columns
- [ ] Test"

gh issue create -R $REPO \
  -t "Add DynamicTable to Inspections page" \
  -m "$MILESTONE" \
  -l "enhancement,epic:integration,priority:medium" \
  -b "## Epic: Dynamic Tables Integration
**Estimated:** 4 hours

## Tasks
- [ ] Replace static table
- [ ] Add custom columns
- [ ] Test"

# Epic 5: Polish & Performance
echo "✨ Epic 5: Polish..."

gh issue create -R $REPO \
  -t "Add column templates" \
  -m "$MILESTONE" \
  -l "enhancement,epic:polish,priority:low" \
  -b "## Epic: Polish & Performance
**Estimated:** 4 hours

## Tasks
- [ ] Pre-defined column sets
- [ ] Quick add templates
- [ ] Industry templates"

gh issue create -R $REPO \
  -t "Performance optimization for dynamic columns" \
  -m "$MILESTONE" \
  -l "enhancement,epic:polish,priority:medium" \
  -b "## Epic: Polish & Performance
**Estimated:** 6 hours

## Tasks
- [ ] Virtual scrolling
- [ ] Memoization
- [ ] Batch updates
- [ ] Lazy loading"

gh issue create -R $REPO \
  -t "Documentation for Dynamic Entity Engine" \
  -m "$MILESTONE" \
  -l "documentation,epic:polish,priority:low" \
  -b "## Epic: Polish & Performance
**Estimated:** 6 hours

## Tasks
- [ ] README update
- [ ] API documentation
- [ ] Usage examples
- [ ] Developer guide"

echo ""
echo "✅ Done! All issues created."
echo "🔗 View at: https://github.com/mazor13/SafeM/milestone/11"
