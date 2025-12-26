# 🔬 Micro-Spec: Master BI Dashboard Implementation
**Component:** `DashboardBI` | **Hook:** `useAnalytics`
**Date:** 26/12/2025 | **Version:** 5.2.1

## 1. Overview
The Master BI Dashboard serves as the central "God-Mode" view for admins. 
We refactored the monolithic component into a **Container/Presenter** pattern using a custom React Hook.

## 2. Technical Architecture

### A. The Brain: `src/hooks/useAnalytics.ts`
* **Purpose:** Decouples data fetching logic from UI rendering.
* **Mechanism:** Currently uses a `setTimeout` (1200ms) to simulate API latency and demonstrate loading states.
* **Data Models:**
    * `KPI`: Top-level metrics (MRR, Active Servers).
    * `ChurnRisk`: AI-generated list of clients at risk.
    * `FinancialDataPoint`: Time-series data for the main chart.

### B. The Face: `src/pages/admin/DashboardBI.tsx`
* **Styling:** Tailwind CSS with extensive use of `backdrop-blur`, `bg-opacity`, and gradients (Glassmorphism).
* **Performance:** Uses `recharts` for visualization with `ResponsiveContainer` for layout stability.
* **States:** Handles `loading` vs `data` states via visual Skeletons (Pulse animations).

## 3. Key Features
1.  **AI Simulation:** The Churn Predictor displays a spinning loader before presenting "Analyzed" data.
2.  **Global Health Radar:** Visualizes system latency and storage usage.
3.  **Anomaly Banner:** A conditional alert system for critical system-wide events.

## 4. Future Integration Points
* Replace `setTimeout` in `useAnalytics` with `getDocs(collection(db, 'analytics'))`.
* Connect "Retention Flow" button to the CRM module.
