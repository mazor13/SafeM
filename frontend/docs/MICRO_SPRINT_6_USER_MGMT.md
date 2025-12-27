# 🔬 Micro-Spec: User Management Logic (V2.1)
**Component:** `UsersTab.tsx`
**Status:** Implemented & Verified

## 1. The Atomic "Invite" Flow
We implemented a strict transactional flow for adding users to ensure data integrity.
* **Pre-Check:** Frontend verifies `currentCount < limit`.
* **Duplicate Check:** Query checks if email exists within `tenantId`.
* **Batch Write:**
    1. Create User Document (`status: 'pending'`).
    2. Increment Tenant Counter (`usersCount + 1`).
    3. Audit Log Entry.

## 2. Search & Filtering
* Implemented client-side filtering for immediate feedback.
* Filter covers both `fullName` and `email`.

## 3. Next Steps (Current Sprint)
* Implement **Atomic Delete** (Reverse of Invite).
* Implement Password Reset trigger.
