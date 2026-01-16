# 🛡️ SafeM (AEGIS) - Project Roadmap & Status

## 📍 Current Status
| Module | State | Notes |
|--------|-------|-------|
| **Equipment Form** | ✅ V1 Complete | Hierarchical logic implemented |
| **Site Management** | ⚠️ V1 Basic | Hierarchy: Site -> Building. **Needs V2 Upgrade for Enterprise depth** |
| **Help Center** | ⚠️ V1 Basic | Simple slide-over. **Needs V2 Full Knowledge Base** |
| **Inspection Engine** | 🚧 In Progress | Wizard UI ready, logic pending |

---

## 🎯 Upcoming Priorities (Backlog)

### 1. 🏭 Global Product Catalog (Next Task)
* **Goal:** Create a standardized catalog (Manufacturer/Model) to avoid free-text errors.
* **Component:** `CatalogManager`
* **Data:** `catalog_items` (Global) collection.

### 2. 📚 Enterprise Knowledge Base (Ref: User Feedback)
* **Goal:** Move from simple "Help Tips" to a full Documentation Hub.
* **Features:** Searchable articles, video tutorials, role-based guides.
* **Tech:** Separate route `/admin/knowledge-base` or external integration.

### 3. 🏗️ Site Management v2.0 (Enterprise Grade)
* **Goal:** Deepen the hierarchy and data richness.
* **Features:**
    * Add **Level 3 Hierarchy**: Floors & Rooms/Zones.
    * Add **Metadata**: Photos, Maps, Area size, Specific Managers.
    * Add **Status Indicators**: Show open issues count next to each building.

### 4. 📄 Documents & Compliance
* **Goal:** Manage external files (Inspector Reports) with expiry alerts.

---

## 🛠️ Next Session Action Plan
1.  **Create Global Catalog Infrastructure:**
    * Create `catalog` collection.
    * Build `CatalogPage` for admins to manage standard items.
2.  **Integrate Catalog into Equipment Form:**
    * Replace free-text "Manufacturer/Model" with catalog selection.

