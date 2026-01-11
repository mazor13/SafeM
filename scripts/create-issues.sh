#!/bin/bash

# GitHub repository (עדכן לפי הצורך)
REPO="mazor13/SafeM"

echo "🚀 Creating Dynamic Entity Engine Issues in $REPO"
echo "================================================"

# Step 1: Create Milestone
echo "📍 Creating Milestone..."
MILESTONE=$(gh api repos/$REPO/milestones -f title="Dynamic Entity Engine v1.0" -f description="Add dynamic column system to all entities" -f due_on="2026-01-31T23:59:59Z" --jq '.number')
echo "✅ Milestone created: #$MILESTONE"

# Step 2: Create Labels
echo "🏷️  Creating Labels..."
gh label create "epic:foundation" --color "0052CC" --description "Foundation & Data Model" --force 2>/dev/null || true
gh label create "epic:cells" --color "00875A" --description "Cell Factory System" --force 2>/dev/null || true
gh label create "epic:column-management" --color "FF5630" --description "Column Management UI" --force 2>/dev/null || true
gh label create "epic:integration" --color "6554C0" --description "Dynamic Tables Integration" --force 2>/dev/null || true
gh label create "epic:polish" --color "FFC400" --description "Polish & Performance" --force 2>/dev/null || true
gh label create "priority:high" --color "D73A4A" --description "High Priority" --force 2>/dev/null || true
gh label create "priority:medium" --color "FBCA04" --description "Medium Priority" --force 2>/dev/null || true
gh label create "priority:low" --color "0E8A16" --description "Low Priority" --force 2>/dev/null || true
echo "✅ Labels created"

# Step 3: Create Issues
echo "📝 Creating Issues..."

# Epic 1: Foundation & Data Model
gh issue create --title "Create ColumnDefinition type system" \
  --milestone $MILESTONE \
  --label "enhancement,typescript,foundation,epic:foundation,priority:high" \
  --body "**Epic:** Foundation & Data Model
**Estimated:** 4 hours

## Description
Create TypeScript type definitions for the dynamic column system.

## Tasks
- [ ] Define \`ColumnType\` enum
- [ ] Define \`ColumnDefinition\` interface
- [ ] Define \`CellValue\` type
- [ ] Add to \`/src/types/columns.ts\`
- [ ] Export from main types index

## Acceptance Criteria
- All types are properly exported
- JSDoc comments added
- No TypeScript errors"

gh issue create --title "Add Firestore schema for columnDefinitions" \
  --milestone $MILESTONE \
  --label "enhancement,backend,firestore,foundation,epic:foundation,priority:high" \
  --body "**Epic:** Foundation & Data Model
**Estimated:** 6 hours

## Description
Set up Firestore collection structure and security rules for custom columns.

## Tasks
- [ ] Create \`columnDefinitions\` subcollection under \`tenants/{tenantId}\`
- [ ] Add Firestore security rules
- [ ] Add composite indexes for queries
- [ ] Write migration helper function
- [ ] Test with sample data

## Acceptance Criteria
- Security rules tested and working
- Can query columns by \`entityType\`
- Can order by \`order\` field"

gh issue create --title "Create useColumnDefinitions hook" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,hooks,foundation,epic:foundation,priority:high" \
  --body "**Epic:** Foundation & Data Model
**Estimated:** 8 hours

## Description
Create React hook for managing column definitions.

## Tasks
- [ ] Create \`/src/hooks/useColumnDefinitions.ts\`
- [ ] Implement real-time listener
- [ ] Add CRUD operations (add, update, delete, reorder)
- [ ] Add error handling
- [ ] Add loading states
- [ ] Write unit tests

## Acceptance Criteria
- Hook returns columns in correct order
- Real-time updates work
- Error states handled gracefully"

# Epic 2: Cell Factory System
gh issue create --title "Build CellFactory component" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,cells,epic:cells,priority:high" \
  --body "**Epic:** Cell Factory System
**Estimated:** 4 hours

## Description
Create base CellFactory component that renders the correct cell type based on column definition.

## Tasks
- [ ] Create \`/src/components/cells/CellFactory.tsx\`
- [ ] Add \`CellProps\` interface
- [ ] Implement type switch logic
- [ ] Add error boundaries
- [ ] Add loading state

## Acceptance Criteria
- Component renders without errors
- Proper TypeScript types
- Error boundary catches cell render errors"

gh issue create --title "Implement Text Cell" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,cells,epic:cells,priority:medium" \
  --body "**Epic:** Cell Factory System
**Estimated:** 3 hours

## Description
Create editable text cell with auto-save.

## Tasks
- [ ] Create \`TextCell.tsx\`
- [ ] Implement debounced onChange
- [ ] Add character limit validation
- [ ] Add visual feedback on save
- [ ] Handle blur/Enter to save

## Acceptance Criteria
- Text saves on blur/Enter
- Character limit enforced
- Visual feedback on save"

gh issue create --title "Implement Number Cell" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,cells,epic:cells,priority:medium" \
  --body "**Epic:** Cell Factory System
**Estimated:** 3 hours

## Description
Create number input cell with formatting options.

## Tasks
- [ ] Create \`NumberCell.tsx\`
- [ ] Support integer/decimal
- [ ] Add currency formatting (₪)
- [ ] Add percentage formatting
- [ ] Add min/max validation

## Acceptance Criteria
- Numbers formatted correctly
- Validation works
- Supports negative numbers"

gh issue create --title "Implement Status Cell" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,cells,epic:cells,priority:high" \
  --body "**Epic:** Cell Factory System
**Estimated:** 4 hours

## Description
Create status dropdown cell with color pills (like Monday.com).

## Tasks
- [ ] Create \`StatusCell.tsx\`
- [ ] Implement dropdown with options from column settings
- [ ] Add color-coded pills
- [ ] Keyboard navigation (arrows, Enter)
- [ ] Click outside to close

## Acceptance Criteria
- Dropdown shows all options
- Colors match settings
- Keyboard accessible"

gh issue create --title "Implement Person Cell" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,cells,epic:cells,priority:medium" \
  --body "**Epic:** Cell Factory System
**Estimated:** 4 hours

## Description
Create user picker cell with avatar display.

## Tasks
- [ ] Create \`PersonCell.tsx\`
- [ ] Fetch team members from Firestore
- [ ] Show avatar + name
- [ ] Search functionality
- [ ] Support multi-select

## Acceptance Criteria
- Shows user avatar
- Search filters users
- Selected user saved correctly"

gh issue create --title "Implement Date Cell" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,cells,epic:cells,priority:medium" \
  --body "**Epic:** Cell Factory System
**Estimated:** 4 hours

## Description
Create date picker cell with multiple formats.

## Tasks
- [ ] Create \`DateCell.tsx\`
- [ ] Integrate date picker library
- [ ] Support DD/MM/YYYY format
- [ ] Show relative dates (\"2 days ago\")
- [ ] Handle timezone correctly

## Acceptance Criteria
- Date picker works
- Format matches locale (Hebrew)
- Timestamps stored correctly"

gh issue create --title "Implement Priority Cell" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,cells,epic:cells,priority:medium" \
  --body "**Epic:** Cell Factory System
**Estimated:** 2 hours

## Description
Create priority badge cell with fixed levels.

## Tasks
- [ ] Create \`PriorityCell.tsx\`
- [ ] Support Low/Medium/High/Urgent
- [ ] Color-coded badges
- [ ] Quick toggle dropdown

## Acceptance Criteria
- 4 priority levels work
- Colors visually distinct
- Toggle works smoothly"

# Epic 3: Column Management UI
gh issue create --title "Build ColumnManager modal" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,column-management,epic:column-management,priority:high" \
  --body "**Epic:** Column Management UI
**Estimated:** 6 hours

## Description
Create modal for adding/editing columns.

## Tasks
- [ ] Create \`ColumnManager.tsx\`
- [ ] Add \"+ Add Column\" button in table header
- [ ] Modal with form (title, type, settings)
- [ ] Type selection dropdown
- [ ] Validation (unique title, max 50 chars)
- [ ] Save to Firestore

## Acceptance Criteria
- Modal opens/closes smoothly
- Validation prevents invalid input
- New column appears immediately"

gh issue create --title "Create ColumnSettings component" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,column-management,epic:column-management,priority:medium" \
  --body "**Epic:** Column Management UI
**Estimated:** 5 hours

## Description
Create settings panel for configuring column options.

## Tasks
- [ ] Create \`ColumnSettings.tsx\`
- [ ] Type-specific settings (status options, date format, etc.)
- [ ] Width adjustment slider
- [ ] Required toggle
- [ ] Default value input

## Acceptance Criteria
- Settings change based on column type
- Width changes reflected in table
- Settings saved correctly"

gh issue create --title "Implement column reordering" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,column-management,epic:column-management,priority:low" \
  --body "**Epic:** Column Management UI
**Estimated:** 4 hours

## Description
Allow drag & drop reordering of columns.

## Tasks
- [ ] Add drag handles to column headers
- [ ] Implement @dnd-kit for reordering
- [ ] Update \`order\` field in Firestore
- [ ] Visual feedback during drag

## Acceptance Criteria
- Columns can be dragged
- Order persists after refresh
- Smooth animation"

# Epic 4: Dynamic Tables Integration
gh issue create --title "Create DynamicTable component" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,component,integration,epic:integration,priority:high" \
  --body "**Epic:** Dynamic Tables Integration
**Estimated:** 8 hours

## Description
Create reusable DynamicTable component that works for all entity types.

## Tasks
- [ ] Create \`DynamicTable.tsx\`
- [ ] Render core fields + dynamic columns
- [ ] Use CellFactory for each cell
- [ ] Implement optimistic updates
- [ ] Add loading skeleton
- [ ] Handle errors gracefully

## Acceptance Criteria
- Table renders all columns
- Cell updates sync to Firestore
- Optimistic UI works (< 100ms)"

gh issue create --title "Refactor Findings page to use DynamicTable" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,refactor,integration,epic:integration,priority:high" \
  --body "**Epic:** Dynamic Tables Integration
**Estimated:** 6 hours

## Description
Replace static Findings table with DynamicTable.

## Tasks
- [ ] Replace JSX with \`<DynamicTable entityType=\"finding\" />\`
- [ ] Test all existing features still work
- [ ] Add \"+ Add Column\" button
- [ ] Migrate sample data
- [ ] Update tests

## Acceptance Criteria
- All finding CRUD operations work
- Can add custom columns
- No regression bugs"

gh issue create --title "Add dynamic columns to Equipment" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,integration,epic:integration,priority:medium" \
  --body "**Epic:** Dynamic Tables Integration
**Estimated:** 4 hours

## Description
Implement DynamicTable for Equipment entity.

## Tasks
- [ ] Add \`<DynamicTable entityType=\"equipment\" />\`
- [ ] Update Equipment type to include \`columnValues\`
- [ ] Test column management
- [ ] Deploy"

gh issue create --title "Add dynamic columns to Tasks" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,integration,epic:integration,priority:medium" \
  --body "**Epic:** Dynamic Tables Integration
**Estimated:** 4 hours

## Description
Implement DynamicTable for Tasks and integrate with Kanban view.

## Tasks
- [ ] Add dynamic columns to Task type
- [ ] Show dynamic columns in Kanban cards
- [ ] Show dynamic columns in List view
- [ ] Test"

gh issue create --title "Add dynamic columns to Inspections" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,integration,epic:integration,priority:low" \
  --body "**Epic:** Dynamic Tables Integration
**Estimated:** 4 hours

## Description
Implement DynamicTable for Inspections.

## Tasks
- [ ] Add \`<DynamicTable entityType=\"inspection\" />\`
- [ ] Update types
- [ ] Test"

# Epic 5: Polish & Performance
gh issue create --title "Add column templates" \
  --milestone $MILESTONE \
  --label "enhancement,frontend,feature,polish,epic:polish,priority:low" \
  --body "**Epic:** Polish & Performance
**Estimated:** 6 hours

## Description
Create pre-defined column templates for common use cases.

## Tasks
- [ ] Create template definitions
- [ ] Templates: \"Cost Tracking\", \"Vendor Management\", \"Compliance\"
- [ ] Template picker UI
- [ ] Import template → create columns
- [ ] Export current columns as template

## Acceptance Criteria
- 3+ templates available
- Import creates all columns
- Export generates JSON"

gh issue create --title "Performance optimization" \
  --milestone $MILESTONE \
  --label "enhancement,performance,polish,epic:polish,priority:medium" \
  --body "**Epic:** Polish & Performance
**Estimated:** 6 hours

## Description
Optimize table performance for large datasets.

## Tasks
- [ ] Add TanStack Virtual for row virtualization
- [ ] Debounce cell updates (300ms)
- [ ] Implement pagination for 1000+ items
- [ ] Optimize Firestore queries (add indexes)
- [ ] Measure performance (Lighthouse)

## Acceptance Criteria
- Table with 1000 rows loads in < 2s
- Scrolling smooth (60fps)
- No unnecessary re-renders"

gh issue create --title "Documentation" \
  --milestone $MILESTONE \
  --label "documentation,polish,epic:polish,priority:medium" \
  --body "**Epic:** Polish & Performance
**Estimated:** 4 hours

## Description
Write comprehensive documentation for dynamic columns.

## Tasks
- [ ] User guide: \"How to add custom columns\"
- [ ] Developer guide: \"How to add new cell types\"
- [ ] API documentation
- [ ] Video tutorial (optional)
- [ ] Add to README

## Acceptance Criteria
- User guide covers all features
- Developer guide includes code examples
- API documented with examples"

echo ""
echo "✅ Done! Created:"
echo "   - 1 Milestone"
echo "   - 8 Labels"
echo "   - 21 Issues"
echo ""
echo "🔗 View at: https://github.com/$REPO/issues"
