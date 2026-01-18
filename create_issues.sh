#!/bin/bash

# הגדרת צבעים להדפסה
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Starting to create GitHub Issues for Phase 2A...${NC}"

# פונקציה ליצירת Issue
create_issue() {
  local title="$1"
  local body="$2"
  local labels="$3"
  
  echo "Creating issue: $title..."
  gh issue create --title "$title" --body "$body" --label "$labels"
}

# --- Phase 2A Tasks ---

create_issue "🏗️ SITE: Update site.types.ts schema" \
  "**Description:** Update the Site interface to include extended fields required for operations.\n\n**Requirements:**\n- Add contact person fields\n- Add safety domains array\n- Add statistics structure\n\n**Reference:** Gap Analysis Sec 4.3.1" \
  "enhancement,priority: high,area: operations"

create_issue "🪝 HOOK: Implement useSites hook" \
  "**Description:** Create a custom hook for managing Site data.\n\n**Requirements:**\n- Fetch all sites\n- Filter capability\n- CRUD operations wrappers" \
  "enhancement,priority: high,area: operations"

create_issue "💅 UI: Refactor SafetyFilesPage to DynamicTable" \
  "**Description:** Replace the legacy HTML table in SafetyFilesPage with the new DynamicTable component.\n\n**Goal:** Standardize UI and enable sorting/filtering." \
  "refactor,priority: medium,area: frontend"

create_issue "📱 UI: Build SiteDetailPage & Tabs" \
  "**Description:** Create the main drill-down view for a single Site.\n\n**Structure:**\n- Header with Site info\n- Tabs: Overview, Locations, Equipment, Inspections" \
  "enhancement,priority: high,area: frontend"

create_issue "📝 FORM: Build SiteFormModal (Add/Edit)" \
  "**Description:** Create the modal form for onboarding a new site.\n\n**Fields:**\n- Connect to Client (CRM)\n- Address & Details\n- Validation rules" \
  "enhancement,priority: high,area: frontend"

create_issue "🏗️ HIERARCHY: Build Building & Area Forms" \
  "**Description:** Modals for adding Buildings and Areas (Floors/Zones) to a site.\n\n**Context:** Part of the Site hierarchy structure." \
  "enhancement,priority: medium,area: frontend"

create_issue "🔒 SECURITY: Update Firestore Rules for Sites" \
  "**Description:** Ensure proper read/write rules for the 'sites' collection based on user roles." \
  "security,priority: high,area: backend"

# --- Phase 2A Equipment Tasks ---

create_issue "🔧 EQUIP: Update equipment.types.ts" \
  "**Description:** Add specific Enums for equipment types (Fire, Elevators, Lifting) as defined in the spec." \
  "enhancement,priority: medium,area: operations"

create_issue "📋 EQUIP: Create EquipmentListPage" \
  "**Description:** Main registry view for all equipment.\n\n**Features:**\n- Filter by Site\n- Filter by Domain\n- Status badges" \
  "enhancement,priority: high,area: frontend"

echo -e "${GREEN}✅ All Phase 2A issues created successfully! Check your GitHub 'Issues' tab.${NC}"
