# 💳 Phase 8: Billing & Payments - AEGIS Platform

## 📋 סקירה כללית

**שם המודול:** Billing & Payments (חיוב ותשלומים)  
**מטרה:** ניהול מחירונים, חשבוניות ותשלומים  
**תלויות:** Phase 1 (Foundation), Phase 4 (Inspections)  
**זמן פיתוח משוער:** 5-6 שבועות  

---

## 🎯 מה כולל המודול

| רכיב | תיאור | עדיפות |
|------|--------|--------|
| Price List | מחירון שירותים | 🔴 קריטי |
| Invoice Generation | יצירת חשבוניות | 🔴 קריטי |
| Invoice Management | ניהול חשבוניות | 🔴 קריטי |
| Payment Tracking | מעקב תשלומים | 🔴 קריטי |
| Integration | חיבור לחשבונית ירוקה/iCount | 🟠 גבוה |
| Reports | דוחות כספיים | 🟡 בינוני |
| Recurring Billing | חיוב חוזר | 🟡 בינוני |

---

## 💰 מודל תמחור

### סוגי שירותים

| שירות | תיאור | תמחור טיפוסי |
|-------|-------|--------------|
| **ביקורת רבעונית** | ביקורת תקופתית | ₪500-1,500 |
| **ביקורת שנתית** | ביקורת מקיפה + בודק מוסמך | ₪1,500-3,000 |
| **הדרכה** | הדרכת בטיחות לעובדים | ₪150-300 לאדם |
| **תוכנית בטיחות** | כתיבת תוכנית שנתית | ₪2,000-5,000 |
| **ייעוץ שעתי** | ייעוץ לפי שעה | ₪250-400 לשעה |
| **מנוי שנתי** | חבילת שירות שנתית | ₪3,000-15,000 |
| **ביקורת מעקב** | ביקורת מעקב לאחר תיקון | ₪300-600 |

---

## 🔄 תהליך חיוב

```
┌─────────────────────────────────────────────────────────────────┐
│                      Billing Workflow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │          │    │          │    │          │    │          │  │
│  │ שירות    │───▶│ חשבונית  │───▶│  נשלחה   │───▶│  שולמה   │  │
│  │ בוצע     │    │  נוצרה   │    │ ללקוח    │    │          │  │
│  │          │    │  Draft   │    │  Sent    │    │  Paid    │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│                        │                              ▲         │
│                        │                              │         │
│                        ▼                              │         │
│                  ┌──────────┐                   ┌──────────┐   │
│                  │          │                   │          │   │
│                  │  בוטלה   │                   │  חלקית   │   │
│                  │ Cancelled│                   │ Partial  │   │
│                  │          │                   │          │   │
│                  └──────────┘                   └──────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 סטטוסי חשבונית

| סטטוס | תיאור | צבע |
|-------|-------|-----|
| `draft` | טיוטה - לא נשלחה | אפור |
| `sent` | נשלחה ללקוח | כחול |
| `viewed` | נצפתה ע"י הלקוח | כחול כהה |
| `paid` | שולמה במלואה | ירוק |
| `partial` | שולמה חלקית | צהוב |
| `overdue` | באיחור תשלום | אדום |
| `cancelled` | בוטלה | אפור כהה |
| `refunded` | הוחזרה | כתום |

---

## 📊 מבנה נתונים (Database Schema)

### 1. Price List
**נתיב:** `/tenants/{tenantId}/priceList/{itemId}`

```typescript
interface PriceListItem {
  id: string;
  tenantId: string;
  
  // מידע בסיסי
  name: string;                    // "ביקורת רבעונית"
  description?: string;
  category: ServiceCategory;
  
  // מחיר
  price: number;                   // מחיר בסיס
  currency: 'ILS';
  
  // סוג תמחור
  pricingType: 'fixed' | 'hourly' | 'per_person' | 'custom';
  
  // מע"מ
  taxRate: number;                 // 17 (אחוזים)
  taxIncluded: boolean;            // האם המחיר כולל מע"מ
  
  // יחידה
  unit?: string;                   // "לאדם" / "לשעה" / "לביקורת"
  
  // הנחות
  discounts?: {
    type: 'percentage' | 'fixed';
    value: number;
    minQuantity?: number;          // הנחת כמות
  }[];
  
  // סטטוס
  isActive: boolean;
  
  // קישור לשירותים
  linkedServiceTypes?: string[];   // inspection, training, etc.
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type ServiceCategory = 
  | 'inspection'      // ביקורות
  | 'training'        // הדרכות
  | 'consulting'      // ייעוץ
  | 'documentation'   // תיעוד
  | 'subscription'    // מנוי
  | 'other';          // אחר
```

### 2. Invoices
**נתיב:** `/tenants/{tenantId}/invoices/{invoiceId}`

```typescript
interface Invoice {
  id: string;
  tenantId: string;
  
  // מספר חשבונית
  invoiceNumber: string;           // "INV-2025-0001"
  
  // לקוח
  clientId: string;
  clientName: string;
  clientAddress: string;
  clientBusinessNumber?: string;   // ח.פ.
  clientEmail: string;
  
  // פרטי עסק (מהTenant)
  businessName: string;
  businessAddress: string;
  businessNumber: string;          // ע.מ. / ח.פ.
  businessPhone: string;
  businessEmail: string;
  
  // תאריכים
  issueDate: Timestamp;            // תאריך הפקה
  dueDate: Timestamp;              // תאריך לתשלום
  
  // פריטים
  items: InvoiceItem[];
  
  // סיכום
  subtotal: number;                // סה"כ לפני מע"מ
  taxAmount: number;               // סכום מע"מ
  discountAmount: number;          // הנחה כוללת
  total: number;                   // סה"כ לתשלום
  
  // מטבע
  currency: 'ILS';
  
  // סטטוס
  status: InvoiceStatus;
  
  // תשלומים
  payments: Payment[];
  paidAmount: number;              // סכום ששולם
  balanceDue: number;              // יתרה לתשלום
  
  // הערות
  notes?: string;                  // הערות לחשבונית
  internalNotes?: string;          // הערות פנימיות
  
  // קישורים
  linkedInspectionIds?: string[];  // ביקורות מקושרות
  linkedTrainingIds?: string[];    // הדרכות מקושרות
  
  // אינטגרציה
  externalInvoiceId?: string;      // ID בחשבונית ירוקה/iCount
  externalInvoiceUrl?: string;     // קישור לחשבונית
  
  // שליחה
  sentAt?: Timestamp;
  sentTo?: string[];
  viewedAt?: Timestamp;
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

type InvoiceStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'partial'
  | 'overdue'
  | 'cancelled'
  | 'refunded';

interface InvoiceItem {
  id: string;
  
  // פריט
  priceListItemId?: string;        // קישור למחירון
  description: string;             // תיאור
  
  // כמות ומחיר
  quantity: number;
  unitPrice: number;
  
  // הנחה
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  
  // מע"מ
  taxRate: number;
  
  // סה"כ
  subtotal: number;                // לפני מע"מ
  taxAmount: number;
  total: number;
  
  // קישור לשירות
  linkedServiceType?: string;
  linkedServiceId?: string;
  linkedServiceDate?: Timestamp;
}
```

### 3. Payments
```typescript
interface Payment {
  id: string;
  invoiceId: string;
  
  // סכום
  amount: number;
  currency: 'ILS';
  
  // אמצעי תשלום
  method: PaymentMethod;
  
  // פרטי תשלום
  reference?: string;              // מספר אסמכתא
  checkNumber?: string;            // מספר צ'ק
  lastFourDigits?: string;         // 4 ספרות אחרונות
  
  // תאריך
  paymentDate: Timestamp;
  
  // הערות
  notes?: string;
  
  // מטא
  recordedAt: Timestamp;
  recordedBy: string;
}

type PaymentMethod = 
  | 'cash'           // מזומן
  | 'check'          // צ'ק
  | 'bank_transfer'  // העברה בנקאית
  | 'credit_card'    // כרטיס אשראי
  | 'bit'            // ביט
  | 'paypal'         // PayPal
  | 'other';         // אחר
```

### 4. Recurring Billing
**נתיב:** `/tenants/{tenantId}/recurringBilling/{billingId}`

```typescript
interface RecurringBilling {
  id: string;
  tenantId: string;
  clientId: string;
  
  // מידע
  name: string;                    // "מנוי שנתי - רול פרופיל"
  description?: string;
  
  // פריטים
  items: InvoiceItem[];
  
  // תדירות
  frequency: 'monthly' | 'quarterly' | 'yearly';
  
  // תאריכים
  startDate: Timestamp;
  endDate?: Timestamp;
  nextBillingDate: Timestamp;
  lastBilledDate?: Timestamp;
  
  // הגדרות
  autoSend: boolean;               // שלח אוטומטית
  daysUntilDue: number;            // ימים לתשלום
  
  // סטטוס
  isActive: boolean;
  
  // היסטוריה
  generatedInvoiceIds: string[];
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}
```

### 5. Billing Settings
**נתיב:** `/tenants/{tenantId}` (חלק מ-Tenant)

```typescript
interface BillingSettings {
  // מספור חשבוניות
  invoicePrefix: string;           // "INV"
  nextInvoiceNumber: number;       // 1
  
  // ברירות מחדל
  defaultTaxRate: number;          // 17
  defaultDueDays: number;          // 30
  defaultCurrency: 'ILS';
  
  // פרטי עסק לחשבונית
  businessDetails: {
    name: string;
    address: string;
    businessNumber: string;
    phone: string;
    email: string;
    logo?: string;
  };
  
  // בנק
  bankDetails?: {
    bankName: string;
    branchNumber: string;
    accountNumber: string;
    accountName: string;
  };
  
  // אינטגרציה
  integration?: {
    provider: 'green_invoice' | 'icount' | 'none';
    apiKey?: string;
    companyId?: string;
    autoSync: boolean;
  };
  
  // תבניות
  invoiceTemplate?: string;        // ID של תבנית
  
  // תזכורות
  paymentReminders: {
    enabled: boolean;
    daysBeforeDue: number[];       // [7, 3, 1]
    daysAfterDue: number[];        // [1, 7, 14, 30]
  };
}
```

---

## 🖥️ ממשקים

### Admin Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| Invoices List | `/admin/billing/invoices` | רשימת חשבוניות |
| Invoice Detail | `/admin/billing/invoices/:id` | פרטי חשבונית |
| Create Invoice | `/admin/billing/invoices/new` | יצירת חשבונית |
| Price List | `/admin/billing/price-list` | מחירון |
| Payments | `/admin/billing/payments` | תשלומים |
| Recurring | `/admin/billing/recurring` | חיוב חוזר |
| Reports | `/admin/billing/reports` | דוחות כספיים |
| Settings | `/admin/billing/settings` | הגדרות חיוב |

---

## 🎨 עיצוב מסכים

### רשימת חשבוניות

```
┌─────────────────────────────────────────────────────────────────┐
│  💳 חשבוניות                                [+ חשבונית חדשה]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 סיכום                                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ ₪45,000   │ │ ₪12,500   │ │ ₪5,200    │ │ ₪2,300    │   │
│  │ החודש     │ │ ממתין     │ │ באיחור    │ │ טיוטות    │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│                                                                 │
│  🔍 [חיפוש...____]  סטטוס: [הכל ▼]  תאריך: [החודש ▼]          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ # │ מספר      │ לקוח           │ סכום    │ סטטוס  │ פעולות ││
│  ├───┼───────────┼────────────────┼─────────┼────────┼────────┤│
│  │ 1 │ INV-0045  │ רול פרופיל     │ ₪1,800  │ 🟢שולם │ [👁️][📥]││
│  │ 2 │ INV-0044  │ ABC תעשיות    │ ₪2,500  │ 🔴באיחור│ [👁️][📧]││
│  │ 3 │ INV-0043  │ XYZ בע"מ      │ ₪950    │ 🔵נשלח │ [👁️][📧]││
│  │ 4 │ INV-0042  │ רול פרופיל     │ ₪3,200  │ 🟢שולם │ [👁️][📥]││
│  │ 5 │ DRAFT-003 │ DEF חברה      │ ₪1,200  │ ⚪טיוטה │ [👁️][✏️]││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [◀ הקודם]  עמוד 1 מתוך 5  [הבא ▶]                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### יצירת חשבונית

```
┌─────────────────────────────────────────────────────────────────┐
│  📝 חשבונית חדשה                               [← חשבוניות]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👤 לקוח                                                       │
│  ─────────────────────────────────────────────────────────────  │
│  בחר לקוח: [רול פרופיל בע"מ_________________ ▼]                │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📋 פריטים                                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ תיאור                     │ כמות │ מחיר  │ הנחה │ סה"כ   ││
│  ├───────────────────────────┼──────┼───────┼──────┼────────┤│
│  │ ביקורת רבעונית Q4 2025   │  1   │₪1,200 │  -   │ ₪1,200 ││
│  │ [🔗 INS-0045]             │      │       │      │        ││
│  │                           │      │       │      │  [🗑️]  ││
│  ├───────────────────────────┼──────┼───────┼──────┼────────┤│
│  │ הדרכת בטיחות לייזר       │  4   │ ₪200  │ 10%  │ ₪720   ││
│  │                           │      │       │      │  [🗑️]  ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [+ הוסף מהמחירון]  [+ הוסף שורה חופשית]                       │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📊 סיכום                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│                              סה"כ לפני מע"מ:     ₪1,920.00    │
│                              מע"מ (17%):          ₪326.40     │
│                              ─────────────────────────────     │
│                              סה"כ לתשלום:        ₪2,246.40    │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📅 תאריכים                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  תאריך הפקה: [31/12/2025]    תאריך לתשלום: [30/01/2026]       │
│                                                                 │
│  📝 הערות                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ תודה על שיתוף הפעולה!                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  [שמור כטיוטה]              [תצוגה מקדימה]    [📧 שלח ללקוח]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### צפייה בחשבונית

```
┌─────────────────────────────────────────────────────────────────┐
│  חשבונית מס' INV-2025-0045                     [← חשבוניות]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │ 🏢 אלומה בטיחות        │  │ סטטוס: 🔵 נשלחה             │  │
│  │ רח' הבטיחות 10         │  │                             │  │
│  │ תל אביב                │  │ תאריך הפקה: 31/12/2025      │  │
│  │ ע.מ. 123456789         │  │ לתשלום עד: 30/01/2026       │  │
│  │ 054-1234567            │  │                             │  │
│  └─────────────────────────┘  │ נשלחה: 31/12/2025 10:30    │  │
│                               │ נצפתה: 31/12/2025 14:15    │  │
│  ┌─────────────────────────┐  └─────────────────────────────┘  │
│  │ 👤 לכבוד:              │                                   │
│  │ רול פרופיל בע"מ        │                                   │
│  │ צור 9, כרמיאל          │                                   │
│  │ ח.פ. 514803512         │                                   │
│  └─────────────────────────┘                                   │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ תיאור                              │ כמות │ מחיר │ סה"כ   ││
│  ├────────────────────────────────────┼──────┼──────┼────────┤│
│  │ ביקורת רבעונית Q4 2025            │  1   │₪1,200│ ₪1,200 ││
│  │ הדרכת בטיחות לייזר (4 עובדים)     │  4   │ ₪180 │ ₪720   ││
│  ├────────────────────────────────────┼──────┼──────┼────────┤│
│  │                          סה"כ לפני מע"מ:        │ ₪1,920 ││
│  │                          מע"מ 17%:              │ ₪326   ││
│  │                          ═══════════════════════│════════││
│  │                          סה"כ לתשלום:           │ ₪2,246 ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  💳 תשלומים                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  (אין תשלומים עדיין)                                           │
│                                                                 │
│  יתרה לתשלום: ₪2,246.40                                        │
│                                                                 │
│  [+ רשום תשלום]                                                │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  [📥 הורד PDF]  [📧 שלח שוב]  [✏️ ערוך]  [🗑️ בטל]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### מחירון

```
┌─────────────────────────────────────────────────────────────────┐
│  💰 מחירון                                    [+ פריט חדש]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  קטגוריה: [הכל ▼]                                              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  🔍 ביקורות                                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ שם                        │ מחיר    │ יחידה   │ פעולות    ││
│  ├───────────────────────────┼─────────┼─────────┼───────────┤│
│  │ ביקורת רבעונית            │ ₪1,200  │ לביקורת │ [✏️] [🗑️] ││
│  │ ביקורת שנתית + בודק מוסמך │ ₪2,500  │ לביקורת │ [✏️] [🗑️] ││
│  │ ביקורת מעקב               │ ₪500    │ לביקורת │ [✏️] [🗑️] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  👥 הדרכות                                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ שם                        │ מחיר    │ יחידה   │ פעולות    ││
│  ├───────────────────────────┼─────────┼─────────┼───────────┤│
│  │ הדרכת בטיחות לייזר       │ ₪200    │ לאדם    │ [✏️] [🗑️] ││
│  │ הדרכת בטיחות אש          │ ₪150    │ לאדם    │ [✏️] [🗑️] ││
│  │ הדרכת ממונה בטיחות       │ ₪500    │ לאדם    │ [✏️] [🗑️] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📄 תיעוד                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ שם                        │ מחיר    │ יחידה   │ פעולות    ││
│  ├───────────────────────────┼─────────┼─────────┼───────────┤│
│  │ תוכנית בטיחות שנתית      │ ₪3,000  │ לתוכנית │ [✏️] [🗑️] ││
│  │ עדכון תוכנית בטיחות      │ ₪1,500  │ לתוכנית │ [✏️] [🗑️] ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### רישום תשלום

```
┌─────────────────────────────────────────────────────────────────┐
│  💳 רישום תשלום - INV-2025-0045                         [✕]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  חשבונית: INV-2025-0045                                        │
│  לקוח: רול פרופיל בע"מ                                         │
│  סכום החשבונית: ₪2,246.40                                      │
│  יתרה לתשלום: ₪2,246.40                                        │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  סכום התשלום: *                                                │
│  [₪2,246.40_______]  [💰 מלא]                                  │
│                                                                 │
│  אמצעי תשלום: *                                                │
│  [העברה בנקאית ▼]                                              │
│                                                                 │
│  תאריך תשלום: *                                                │
│  [31/12/2025______]                                            │
│                                                                 │
│  מספר אסמכתא:                                                  │
│  [________________]                                            │
│                                                                 │
│  הערות:                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  [ביטול]                                      [💾 שמור תשלום]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 אינטגרציות

### חשבונית ירוקה (Green Invoice)

```typescript
interface GreenInvoiceIntegration {
  // הגדרות
  apiKey: string;
  apiSecret: string;
  companyId: string;
  
  // פעולות
  async createInvoice(invoice: Invoice): Promise<string>;  // returns externalId
  async getInvoice(externalId: string): Promise<any>;
  async sendInvoice(externalId: string, email: string): Promise<void>;
  async cancelInvoice(externalId: string): Promise<void>;
  async getPaymentLink(externalId: string): Promise<string>;
}
```

### iCount

```typescript
interface ICountIntegration {
  // הגדרות
  companyId: string;
  apiUser: string;
  apiPass: string;
  
  // פעולות
  async createDocument(invoice: Invoice): Promise<string>;
  async getDocument(docId: string): Promise<any>;
  async emailDocument(docId: string): Promise<void>;
}
```

---

## 🔄 תהליכי עבודה

### 1. יצירת חשבונית מביקורת

```
┌─────────────────────────────────────────────────────────────────┐
│  1. ביקורת הושלמה                                              │
│     └── status: completed                                      │
│                              ↓                                  │
│  2. לחיצה על "צור חשבונית"                                     │
│     (מתוך דף הביקורת או רשימת ביקורות)                         │
│                              ↓                                  │
│  3. נפתח טופס חשבונית                                          │
│     ├── לקוח: ממולא אוטומטית                                   │
│     ├── פריט: ממולא מהמחירון                                   │
│     └── קישור: linkedInspectionIds                             │
│                              ↓                                  │
│  4. עריכה והוספת פריטים                                        │
│     └── הדרכות, ייעוץ נוסף...                                  │
│                              ↓                                  │
│  5. שמירה / שליחה                                              │
│     ├── Draft → שמירה בלבד                                     │
│     └── Send → שליחה ללקוח + Email                             │
│                              ↓                                  │
│  6. סנכרון לחשבונית ירוקה (אם מופעל)                           │
│                              ↓                                  │
│  7. Audit Log נרשם                                              │
└─────────────────────────────────────────────────────────────────┘
```

### 2. תזכורת תשלום

```
┌─────────────────────────────────────────────────────────────────┐
│  Cloud Function - יומי                                         │
│                              ↓                                  │
│  1. שליפת חשבוניות פתוחות                                      │
│     └── status in ['sent', 'viewed', 'partial']                │
│                              ↓                                  │
│  2. בדיקת תאריכים                                              │
│     ├── 7 ימים לפני → תזכורת ראשונה                            │
│     ├── 3 ימים לפני → תזכורת שנייה                             │
│     ├── יום לפני → תזכורת אחרונה                               │
│     ├── יום אחרי → התראת איחור                                 │
│     └── 7+ ימים אחרי → status: overdue                         │
│                              ↓                                  │
│  3. שליחת Email                                                │
│     └── "תזכורת: חשבונית X ממתינה לתשלום"                      │
│                              ↓                                  │
│  4. התראה לבעל העסק                                            │
│     └── "יש X חשבוניות באיחור"                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 מבנה קבצים

```
frontend/src/
├── types/
│   └── billing.ts                 # Invoice, Payment, PriceListItem
│
├── hooks/
│   ├── useInvoices.ts             # CRUD invoices
│   ├── usePriceList.ts            # CRUD price list
│   ├── usePayments.ts             # Payment operations
│   ├── useRecurringBilling.ts     # Recurring billing
│   └── useBillingReports.ts       # Reports
│
├── pages/admin/
│   └── billing/
│       ├── InvoicesPage.tsx
│       ├── InvoiceDetailPage.tsx
│       ├── CreateInvoicePage.tsx
│       ├── PriceListPage.tsx
│       ├── PaymentsPage.tsx
│       ├── RecurringBillingPage.tsx
│       ├── BillingReportsPage.tsx
│       └── BillingSettingsPage.tsx
│
├── components/billing/
│   ├── InvoiceCard.tsx
│   ├── InvoiceStatusBadge.tsx
│   ├── InvoiceItemsTable.tsx
│   ├── PaymentForm.tsx
│   ├── PaymentsList.tsx
│   ├── PriceListItemForm.tsx
│   ├── InvoicePreview.tsx
│   └── BillingSummaryCards.tsx

functions/src/
├── billing/
│   ├── invoiceReminders.ts        # תזכורות תשלום
│   ├── recurringBilling.ts        # יצירת חשבוניות חוזרות
│   └── integrations/
│       ├── greenInvoice.ts
│       └── icount.ts
```

---

## ✅ Checklist לפיתוח

### Types
- [ ] `types/billing.ts` - Invoice, Payment, PriceListItem, etc.

### Hooks
- [ ] useInvoices - CRUD
- [ ] usePriceList - CRUD
- [ ] usePayments - Record, list
- [ ] useRecurringBilling
- [ ] useBillingReports

### Pages
- [ ] InvoicesPage
- [ ] InvoiceDetailPage
- [ ] CreateInvoicePage
- [ ] PriceListPage
- [ ] PaymentsPage
- [ ] RecurringBillingPage
- [ ] BillingReportsPage
- [ ] BillingSettingsPage

### Components
- [ ] InvoiceCard
- [ ] InvoiceStatusBadge
- [ ] InvoiceItemsTable
- [ ] PaymentForm
- [ ] PaymentsList
- [ ] PriceListItemForm
- [ ] InvoicePreview
- [ ] BillingSummaryCards

### Cloud Functions
- [ ] invoiceReminders (יומי)
- [ ] recurringBilling (חודשי)

### Integrations
- [ ] חשבונית ירוקה API
- [ ] iCount API (אופציונלי)

### PDF
- [ ] Invoice PDF template
- [ ] PDF generation

---

## 📅 אבני דרך

| שבוע | משימות |
|------|---------|
| **1** | Types, Database schema, Price List |
| **2** | Create Invoice, Invoice Detail |
| **3** | Payments, Invoice List |
| **4** | חשבונית ירוקה integration |
| **5** | Recurring billing, Reports |
| **6** | Reminders, Testing, Polish |

---

## 🔗 קשר למודולים אחרים

| מודול | קשר |
|-------|------|
| **Phase 1: Foundation** | Client, Tenant settings |
| **Phase 4: Inspections** | יצירת חשבונית מביקורת |
| **Phase 7: Notifications** | תזכורות תשלום |

---

*מסמך זה יעודכן במהלך הפיתוח*

**גרסה:** 1.0  
**תאריך:** 31/12/2025  
**נכתב ע"י:** Claude + Michel Mazor
