# 📋 SafeM - Phase 2 Tasks & Roadmap
**Based on:** Gap Analysis Document (v1.0)
**Focus:** Safety Operations Module

---

## 🚀 Phase 2A: Foundation (Weeks 1-4)
*Infrastructure for Sites and Equipment*

### 🏗️ Week 1-2: Sites & Locations (Gap #1)
- [x] **Types Update:** Update `site.types.ts` with extended fields (contact, safety domains, stats).
- [x] **Hook:** Implement `useSites` hook (fetch, filter, CRUD).
- [x] **Page Refactor:** Rewrite `SafetyFilesPage.tsx` using `DynamicTable`.
- [x] **Detail View:** Create `SiteDetailPage` with tabs structure.
- [ ] **Forms:** Build `SiteFormModal` (Add/Edit Site).
- [ ] **Hierarchy:** Build `BuildingFormModal` & `AreaFormModal`.
- [ ] **Security:** Update Firestore rules for Sites collection.

### 🔧 Week 3-4: Equipment Registry (Gap #2)
- [x] **Types Update:** Add Equipment Types enums to `equipment.types.ts`.
- [ ] **Page:** Create `EquipmentListPage` with filtering (Site/Domain).
- [x] **Detail View:** Create `EquipmentDetailPage` (Info + History).
- [ ] **Wizard:** Build `EquipmentFormWizard` for complex addition.
- [ ] **Import:** Implement Excel import for bulk equipment.
- [x] **Hook:** Implement `useEquipment` hook.
- [ ] **Logic:** Implement status workflow (New -> Active -> Expired).

---

## ⚙️ Phase 2B: Core Operations (Weeks 5-8)
*The Inspection Engine*

### 📝 Week 5-6: Inspection Engine (Gap #3)
- [ ] **Templates:** Create `TemplateBuilderPage` and `TemplateListPage`.
- [ ] **Runner:** Build `InspectionFormPage` (The actual audit screen).
- [ ] **Components:** Implement `SignatureCanvas` component.
- [x] **Hook:** Implement `useInspections` hook.
- [ ] **Logic:** Connect Templates to Inspection Runner.

### ⚠️ Week 7-8: Findings & Tasks (Gap #4)
- [ ] **List View:** Create `FindingsListPage` with severity filters.
- [x] **Detail View:** Create `FindingDetailPage` with lifecycle actions.
- [ ] **Risk:** Implement `RiskAssessmentForm` (Matrix).
- [ ] **Automation:** Auto-create Tasks from Findings.
- [x] **Hook:** Implement `useFindings` hook.

---

## 📊 Phase 2C: Scheduling & Reports (Weeks 9-12)
*Automation and Visibility*

### 📅 Week 9-10: Scheduling (Gap #5)
- [ ] **Calendar:** Create `ScheduleCalendarPage`.
- [ ] **Rules:** Implement Scheduling Rules Engine.
- [ ] **Automation:** Job for `Overdue` detection and alerts.
- [x] **Hook:** Implement `useSchedule` hook.

### 📈 Week 11-12: Reports & Dashboard (Gap #8)
- [ ] **Dashboard:** Enhanced `SafetyDashboard` with new KPIs.
- [ ] **PDF:** Implement `pdfGenerator` service for inspection reports.
- [ ] **Export:** Excel export for all tables.
- [ ] **Compliance:** Generate "Site Compliance Summary" report.

---

## 📱 Phase 3: Mobile & Advanced (Future)
- [ ] **PWA:** Setup Service Worker for offline support.
- [ ] **Sync:** Implement Offline Data Sync (IndexedDB).
- [ ] **Mobile UI:** Optimize forms for touch/mobile.
- [ ] **Hardware:** Camera & Barcode Scanner integration.

