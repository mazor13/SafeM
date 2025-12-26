# 🔬 Micro-Spec: BI Dashboard - Real Data Integration
**Component:** `useAnalytics.ts`
**Date:** 26/12/2025 | **Status:** Connected to Firestore

## 1. Change Log
Transformed the `useAnalytics` hook from a Mock Data generator to a Real-Time Firestore consumer.

## 2. Data Sources
* **Collection:** `tenants`
* **Query Logic:**
    * `activeClients`: Count of documents where `status == 'active'`.
    * `highRiskCount`: Count of documents where `status == 'suspended'` OR `healthScore < 50`.
    * `MRR`: Calculated as `activeClients * 500` (Temporary Placeholder Pricing).

## 3. Current Limitations
* **Historical Data:** The financial graph currently connects two points (Start -> Now) as there is no historical `snapshots` collection yet.
* **Churn Logic:** Relies on basic status checks rather than ML-based usage analysis (planned for Sprint 6).

## 4. Verification
* Verified that dashboard loads without errors even with empty collections.
* Loading skeletons appear correctly during Firestore fetch latency.
