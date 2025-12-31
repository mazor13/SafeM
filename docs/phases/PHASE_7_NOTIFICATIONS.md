# 🔔 Phase 7: Notifications - AEGIS Platform

## 📋 סקירה כללית

**שם המודול:** Notifications (התראות ותזכורות)  
**מטרה:** מערכת התראות רב-ערוצית - Email, WhatsApp, Push  
**תלויות:** Phase 1-6 (כל המודולים הקודמים)  
**זמן פיתוח משוער:** 4-5 שבועות  

---

## 🎯 מה כולל המודול

| רכיב | תיאור | עדיפות |
|------|--------|--------|
| Email Notifications | שליחת מיילים | 🔴 קריטי |
| WhatsApp Bot | בוט וואטסאפ להתראות | 🔴 קריטי |
| Push Notifications | התראות Push לאפליקציה | 🟠 גבוה |
| SMS (Emergency) | SMS לחירום | 🟡 בינוני |
| Notification Center | מרכז התראות באפליקציה | 🔴 קריטי |
| Templates | תבניות הודעות | 🔴 קריטי |
| Scheduling | תזמון התראות | 🔴 קריטי |
| Preferences | הגדרות משתמש | 🟠 גבוה |

---

## 📡 ערוצי התקשורת

```
┌─────────────────────────────────────────────────────────────────┐
│                    Notification Channels                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📧 Email                                                       │
│  ─────────────────────────────────────────────────────────────  │
│  • דוחות ביקורת (PDF מצורף)                                    │
│  • התראות ליקויים                                              │
│  • תזכורות מועדים                                              │
│  • אסקלציות                                                    │
│  • חשבוניות                                                    │
│  Provider: SendGrid / AWS SES / Firebase                        │
│                                                                 │
│  💬 WhatsApp                                                    │
│  ─────────────────────────────────────────────────────────────  │
│  • התראת ליקוי חדש                                             │
│  • תזכורות דחופות                                              │
│  • אישור קבלת תיקון                                            │
│  • סטטוס ליקוי                                                 │
│  • קישור מהיר לפורטל                                           │
│  Provider: WhatsApp Business API / Twilio                       │
│                                                                 │
│  🔔 Push Notifications                                          │
│  ─────────────────────────────────────────────────────────────  │
│  • התראות בזמן אמת                                             │
│  • תזכורות                                                     │
│  • עדכוני סטטוס                                                │
│  Provider: Firebase Cloud Messaging (FCM)                       │
│                                                                 │
│  📱 SMS (חירום בלבד)                                            │
│  ─────────────────────────────────────────────────────────────  │
│  • ליקוי קריטי בלבד                                            │
│  • אסקלציה סופית                                               │
│  Provider: Twilio / MessageBird                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📨 סוגי התראות

### לפי קטגוריה

| קטגוריה | סוג | ערוצים | מתי |
|---------|-----|--------|-----|
| **ליקויים** | finding_new | Email, WhatsApp, Push | ליקוי חדש נפתח |
| | finding_reminder | Email, WhatsApp | תזכורת לפני פקיעה |
| | finding_escalated | Email, WhatsApp, SMS* | אסקלציה |
| | finding_overdue | Email, WhatsApp | עבר תאריך היעד |
| | finding_correction_received | Email, Push | תיקון התקבל |
| | finding_approved | Email, WhatsApp, Push | תיקון אושר |
| | finding_rejected | Email, WhatsApp, Push | תיקון נדחה |
| **ביקורות** | inspection_scheduled | Email, Push | ביקורת נקבעה |
| | inspection_reminder | Email, WhatsApp, Push | תזכורת ליום לפני |
| | inspection_completed | Email | ביקורת הסתיימה + PDF |
| **הדרכות** | training_reminder | Email, WhatsApp | תזכורת להדרכה |
| | training_expired | Email, WhatsApp | הדרכה פגה |
| **מסמכים** | document_new | Email, Push | מסמך חדש |
| | document_expiring | Email | מסמך עומד לפוג |
| **תיקי בטיחות** | safety_file_approved | Email, Push | תיק אושר |
| | safety_file_expiring | Email | תיק עומד לפוג |
| **מערכת** | user_invited | Email | הזמנה לפורטל |
| | password_reset | Email | איפוס סיסמה |

*SMS רק לליקויים קריטיים ואסקלציה סופית

---

## 📧 תבניות Email

### מבנה תבנית

```typescript
interface EmailTemplate {
  id: string;
  name: string;
  type: NotificationType;
  
  // תוכן
  subject: string;                 // נושא (עם placeholders)
  bodyHtml: string;                // גוף HTML
  bodyText: string;                // גוף טקסט (fallback)
  
  // עיצוב
  includeHeader: boolean;          // כולל header עם לוגו
  includeFooter: boolean;          // כולל footer
  
  // שפה
  language: 'he' | 'en';
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### דוגמאות תבניות

#### 📧 ליקוי חדש

```html
נושא: ⚠️ ליקוי חדש נמצא - {{finding.title}}

──────────────────────────────────────────
[לוגו החברה]
──────────────────────────────────────────

שלום {{contact.firstName}},

נמצא ליקוי חדש בביקורת שנערכה ב-{{finding.createdAt}}:

┌─────────────────────────────────────────┐
│ ⚠️ {{finding.title}}                    │
│                                         │
│ חומרה: {{finding.severity}}             │
│ מיקום: {{finding.location}}             │
│ תאריך יעד: {{finding.dueDate}}          │
│                                         │
│ {{finding.description}}                 │
└─────────────────────────────────────────┘

נא לטפל בליקוי עד לתאריך היעד.

[📤 העלה תיקון]

──────────────────────────────────────────
אלומה בטיחות | 054-1234567 | www.alumah.co.il
```

#### 📧 דוח ביקורת

```html
נושא: 📋 דוח ביקורת - {{inspection.title}}

שלום {{contact.firstName}},

מצורף דוח הביקורת שנערכה ב-{{inspection.date}}:

📊 סיכום:
• סטטוס כללי: {{inspection.overallStatus}}
• ליקויים שנמצאו: {{inspection.findingsCount}}
• פריטים תקינים: {{inspection.passedCount}}

📎 הדוח המלא מצורף לאימייל זה.

[📥 הורד PDF]  [🔗 צפה בפורטל]

בברכה,
{{tenant.name}}
```

#### 📧 אסקלציה

```html
נושא: 🚨 התראה: ליקוי לא טופל - {{finding.title}}

שלום {{contact.firstName}},

ליקוי בטיחות לא טופל במועד הנדרש:

┌─────────────────────────────────────────┐
│ 🚨 {{finding.title}}                    │
│                                         │
│ חומרה: {{finding.severity}}             │
│ נפתח בתאריך: {{finding.createdAt}}      │
│ תאריך יעד: {{finding.dueDate}}          │
│ איחור: {{finding.daysOverdue}} ימים    │
│                                         │
│ סטטוס אסקלציה: רמה {{escalation.level}} │
└─────────────────────────────────────────┘

נא לטפל בליקוי בהקדם האפשרי.

[📤 העלה תיקון]

──────────────────────────────────────────
הודעה זו נשלחה אוטומטית ממערכת AEGIS
```

---

## 💬 WhatsApp Bot

### הודעות אוטומטיות

```
┌─────────────────────────────────────────────────────────────────┐
│  💬 WhatsApp Bot Messages                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📍 ליקוי חדש:                                                 │
│  ────────────────────────────────                              │
│  ⚠️ *ליקוי חדש נמצא*                                           │
│                                                                 │
│  *{{finding.title}}*                                           │
│  חומרה: {{severity_emoji}} {{finding.severity}}                │
│  יעד: {{finding.dueDate}}                                      │
│                                                                 │
│  {{finding.description}}                                       │
│                                                                 │
│  👉 לצפייה והעלאת תיקון:                                       │
│  {{portal_link}}                                               │
│                                                                 │
│  ────────────────────────────────                              │
│                                                                 │
│  📍 תזכורת:                                                    │
│  ────────────────────────────────                              │
│  ⏰ *תזכורת: ליקוי ממתין לטיפול*                               │
│                                                                 │
│  *{{finding.title}}*                                           │
│  נותרו: {{days_remaining}} ימים                                │
│                                                                 │
│  👉 {{portal_link}}                                            │
│                                                                 │
│  ────────────────────────────────                              │
│                                                                 │
│  📍 תיקון אושר:                                                │
│  ────────────────────────────────                              │
│  ✅ *התיקון אושר*                                              │
│                                                                 │
│  הליקוי "{{finding.title}}" נסגר בהצלחה.                       │
│                                                                 │
│  תודה על שיתוף הפעולה! 🙏                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Interactive Messages (Buttons)

```
┌─────────────────────────────────────────────────────────────────┐
│  💬 Interactive WhatsApp Message                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⚠️ *ליקוי חדש נמצא*                                           │
│                                                                 │
│  *שילוט אזהרה דהוי*                                            │
│  חומרה: 🟠 גבוה                                                │
│  יעד: 05/01/2026                                               │
│                                                                 │
│  ┌─────────────────────────────────────────┐                   │
│  │ 📤 העלה תיקון                           │                   │
│  └─────────────────────────────────────────┘                   │
│  ┌─────────────────────────────────────────┐                   │
│  │ 👁️ צפה בפרטים                          │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔔 Push Notifications

### Firebase Cloud Messaging Setup

```typescript
// Notification payload structure
interface PushNotification {
  // Notification (shows in system tray)
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    click_action?: string;
  };
  
  // Data (for app handling)
  data: {
    type: NotificationType;
    entityId: string;
    entityType: string;
    url: string;
  };
  
  // Target
  token?: string;                  // Single device
  topic?: string;                  // Topic subscription
  condition?: string;              // Condition
}
```

### Topic Subscriptions

```typescript
// כל משתמש נרשם לטופיקים לפי הרשאות
const topics = {
  // Admin Portal
  `tenant_${tenantId}_all`,           // כל ההתראות לTenant
  `tenant_${tenantId}_user_${userId}`, // התראות אישיות
  
  // Client Portal
  `client_${clientId}_all`,           // כל ההתראות ללקוח
  `contact_${contactId}`,             // התראות אישיות
};
```

---

## 📊 מבנה נתונים

### 1. Notifications Collection
**נתיב:** `/tenants/{tenantId}/notifications/{notificationId}`

```typescript
interface Notification {
  id: string;
  tenantId: string;
  
  // סוג
  type: NotificationType;
  category: 'finding' | 'inspection' | 'training' | 'document' | 'system';
  
  // תוכן
  title: string;
  body: string;
  data: Record<string, any>;       // נתונים נוספים
  
  // קשר לישות
  entityType?: string;
  entityId?: string;
  
  // נמענים
  recipients: NotificationRecipient[];
  
  // תזמון
  scheduledFor?: Timestamp;        // null = מיידי
  sentAt?: Timestamp;
  
  // סטטוס
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  
  // מטא
  createdAt: Timestamp;
  createdBy: string;
}

interface NotificationRecipient {
  // מי
  recipientType: 'tenant_user' | 'client_contact';
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  
  // ערוצים
  channels: {
    email?: {
      enabled: boolean;
      status: 'pending' | 'sent' | 'failed' | 'bounced';
      sentAt?: Timestamp;
      error?: string;
    };
    whatsapp?: {
      enabled: boolean;
      status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
      sentAt?: Timestamp;
      deliveredAt?: Timestamp;
      readAt?: Timestamp;
      error?: string;
    };
    push?: {
      enabled: boolean;
      status: 'pending' | 'sent' | 'failed';
      sentAt?: Timestamp;
      error?: string;
    };
    sms?: {
      enabled: boolean;
      status: 'pending' | 'sent' | 'delivered' | 'failed';
      sentAt?: Timestamp;
      error?: string;
    };
  };
  
  // קריאה
  read: boolean;
  readAt?: Timestamp;
}
```

### 2. Notification Preferences
**נתיב:** `/tenants/{tenantId}/users/{userId}` או `contacts/{contactId}`

```typescript
interface NotificationPreferences {
  // ערוצים מופעלים
  channels: {
    email: boolean;
    whatsapp: boolean;
    push: boolean;
    sms: boolean;                  // רק לחירום
  };
  
  // מה לקבל
  categories: {
    findings: {
      new: boolean;
      reminders: boolean;
      escalations: boolean;
      updates: boolean;
    };
    inspections: {
      scheduled: boolean;
      reminders: boolean;
      completed: boolean;
    };
    training: {
      reminders: boolean;
      expired: boolean;
    };
    documents: {
      new: boolean;
      expiring: boolean;
    };
    system: {
      security: boolean;           // תמיד מופעל
      updates: boolean;
    };
  };
  
  // שעות שקט
  quietHours?: {
    enabled: boolean;
    start: string;                 // "22:00"
    end: string;                   // "07:00"
    timezone: string;              // "Asia/Jerusalem"
    excludeUrgent: boolean;        // חריגה להודעות דחופות
  };
  
  // שפה
  language: 'he' | 'en';
}
```

### 3. Email Templates
**נתיב:** `/tenants/{tenantId}/emailTemplates/{templateId}`

```typescript
interface EmailTemplate {
  id: string;
  tenantId: string;
  
  // מידע
  name: string;
  type: NotificationType;
  language: 'he' | 'en';
  
  // תוכן
  subject: string;
  bodyHtml: string;
  bodyText: string;
  
  // עיצוב
  settings: {
    includeHeader: boolean;
    includeLogo: boolean;
    includeFooter: boolean;
    includeSocialLinks: boolean;
  };
  
  // Placeholders
  availablePlaceholders: string[];
  
  // סטטוס
  isDefault: boolean;
  isActive: boolean;
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4. WhatsApp Templates
**נתיב:** `/system/whatsappTemplates/{templateId}`

```typescript
interface WhatsAppTemplate {
  id: string;
  
  // Meta/WhatsApp template info
  templateName: string;            // שם בMeta
  templateId: string;              // ID בMeta
  language: string;                // "he" / "en"
  
  // תוכן
  headerType: 'text' | 'image' | 'document';
  headerContent?: string;
  bodyContent: string;
  footerContent?: string;
  
  // כפתורים
  buttons?: {
    type: 'url' | 'call' | 'quick_reply';
    text: string;
    value: string;
  }[];
  
  // Placeholders
  variables: string[];
  
  // סטטוס
  status: 'pending' | 'approved' | 'rejected';
  
  // מטא
  submittedAt: Timestamp;
  approvedAt?: Timestamp;
}
```

---

## ☁️ Cloud Functions

### Notification Service

```typescript
// functions/src/notifications/index.ts

// שליחת התראה
export const sendNotification = functions.firestore
  .document('tenants/{tenantId}/notifications/{notificationId}')
  .onCreate(async (snapshot, context) => {
    const notification = snapshot.data() as Notification;
    
    // לכל נמען
    for (const recipient of notification.recipients) {
      // Email
      if (recipient.channels.email?.enabled) {
        await sendEmail(notification, recipient);
      }
      
      // WhatsApp
      if (recipient.channels.whatsapp?.enabled) {
        await sendWhatsApp(notification, recipient);
      }
      
      // Push
      if (recipient.channels.push?.enabled) {
        await sendPush(notification, recipient);
      }
      
      // SMS (רק דחוף)
      if (recipient.channels.sms?.enabled && notification.type.includes('critical')) {
        await sendSMS(notification, recipient);
      }
    }
  });

// התראות מתוזמנות
export const processScheduledNotifications = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    // שליפת התראות שהגיע זמנן
    const scheduled = await admin.firestore()
      .collectionGroup('notifications')
      .where('status', '==', 'pending')
      .where('scheduledFor', '<=', now)
      .get();
    
    // שליחה
    for (const doc of scheduled.docs) {
      await sendNotification(doc);
    }
  });

// תזכורות יומיות
export const dailyReminders = functions.pubsub
  .schedule('0 8 * * *')
  .timeZone('Asia/Jerusalem')
  .onRun(async (context) => {
    // תזכורות ליקויים
    await sendFindingReminders();
    
    // תזכורות הדרכות
    await sendTrainingReminders();
    
    // תזכורות מסמכים
    await sendDocumentReminders();
  });
```

### Email Service

```typescript
// functions/src/notifications/email.ts
import * as sgMail from '@sendgrid/mail';

export async function sendEmail(
  notification: Notification, 
  recipient: NotificationRecipient
): Promise<void> {
  // טעינת תבנית
  const template = await getEmailTemplate(notification.type);
  
  // החלפת placeholders
  const html = replacePlaceholders(template.bodyHtml, notification.data);
  const subject = replacePlaceholders(template.subject, notification.data);
  
  // שליחה
  await sgMail.send({
    to: recipient.recipientEmail,
    from: {
      email: 'noreply@aegis-safety.com',
      name: notification.data.tenantName || 'AEGIS Safety'
    },
    subject,
    html,
    text: template.bodyText,
    attachments: notification.data.attachments
  });
  
  // עדכון סטטוס
  await updateRecipientStatus(notification.id, recipient.recipientId, 'email', 'sent');
}
```

### WhatsApp Service

```typescript
// functions/src/notifications/whatsapp.ts

export async function sendWhatsApp(
  notification: Notification,
  recipient: NotificationRecipient
): Promise<void> {
  const template = await getWhatsAppTemplate(notification.type);
  
  // שליחה דרך WhatsApp Business API
  const response = await axios.post(
    `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to: recipient.recipientPhone,
      type: 'template',
      template: {
        name: template.templateName,
        language: { code: template.language },
        components: buildComponents(template, notification.data)
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  // עדכון סטטוס
  await updateRecipientStatus(notification.id, recipient.recipientId, 'whatsapp', 'sent');
}
```

### Push Service

```typescript
// functions/src/notifications/push.ts
import * as admin from 'firebase-admin';

export async function sendPush(
  notification: Notification,
  recipient: NotificationRecipient
): Promise<void> {
  // קבלת tokens של המשתמש
  const tokens = await getUserFCMTokens(recipient.recipientId);
  
  if (tokens.length === 0) return;
  
  const message: admin.messaging.MulticastMessage = {
    tokens,
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: {
      type: notification.type,
      entityType: notification.entityType || '',
      entityId: notification.entityId || '',
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'aegis_notifications',
        icon: 'ic_notification'
      }
    },
    apns: {
      payload: {
        aps: {
          badge: 1,
          sound: 'default'
        }
      }
    }
  };
  
  await admin.messaging().sendMulticast(message);
  
  // עדכון סטטוס
  await updateRecipientStatus(notification.id, recipient.recipientId, 'push', 'sent');
}
```

---

## 🖥️ ממשקים

### Admin Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| Notification Center | `/admin/notifications` | מרכז התראות |
| Notification Settings | `/admin/settings/notifications` | הגדרות מערכת |
| Email Templates | `/admin/settings/email-templates` | עריכת תבניות |
| Notification Log | `/admin/notifications/log` | יומן שליחות |

### Client Portal

| מסך | נתיב | תיאור |
|-----|------|--------|
| Notifications | `/portal/notifications` | התראות שלי |
| Preferences | `/portal/settings/notifications` | העדפות |

---

## 🎨 עיצוב מסכים

### מרכז התראות (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  🔔 התראות                                    [⚙️ הגדרות]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 סטטיסטיקות היום                                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ 📧 45      │ │ 💬 32      │ │ 🔔 28      │ │ ❌ 2       │   │
│  │ Email     │ │ WhatsApp   │ │ Push       │ │ Failed     │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│                                                                 │
│  🔍 [חיפוש...____]  סוג: [הכל ▼]  סטטוס: [הכל ▼]              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⚠️ ליקוי חדש - שילוט אזהרה דהוי          לפני 2 שעות   │   │
│  │                                                         │   │
│  │ 🏢 רול פרופיל    👤 עדי דובלרו                          │   │
│  │                                                         │   │
│  │ 📧 ✅ נשלח    💬 ✅ נקרא    🔔 ✅ נשלח                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📋 דוח ביקורת מוכן                        לפני 1 יום    │   │
│  │                                                         │   │
│  │ 🏢 ABC תעשיות    👤 משה כהן                             │   │
│  │                                                         │   │
│  │ 📧 ✅ נשלח    💬 ⏳ ממתין    🔔 ✅ נשלח                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### הגדרות התראות

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ הגדרות התראות                              [← הגדרות]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📡 ערוצים                                                     │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📧 Email                                           [✓]        │
│     Provider: SendGrid                                         │
│     From: noreply@aegis-safety.com                             │
│     [בדוק חיבור]                                               │
│                                                                 │
│  💬 WhatsApp                                        [✓]        │
│     Provider: Meta Business API                                │
│     Phone: +972-54-1234567                                     │
│     [בדוק חיבור]                                               │
│                                                                 │
│  🔔 Push Notifications                              [✓]        │
│     Provider: Firebase Cloud Messaging                         │
│     [בדוק חיבור]                                               │
│                                                                 │
│  📱 SMS (חירום)                                     [✓]        │
│     Provider: Twilio                                           │
│     From: +972-77-1234567                                      │
│     [בדוק חיבור]                                               │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📋 תבניות Email                                               │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [📝 ערוך תבניות]                                              │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ⏰ תזמונים                                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  תזכורות יומיות: [08:00 ▼]                                     │
│  אזור זמן: [Asia/Jerusalem ▼]                                  │
│                                                                 │
│  [שמור הגדרות]                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 מבנה קבצים

```
frontend/src/
├── types/
│   └── notification.ts            # Notification, Template, Preferences
│
├── hooks/
│   ├── useNotifications.ts        # CRUD notifications
│   ├── useNotificationPreferences.ts
│   └── usePushNotifications.ts    # FCM registration
│
├── pages/admin/
│   └── notifications/
│       ├── NotificationCenterPage.tsx
│       ├── NotificationSettingsPage.tsx
│       ├── EmailTemplatesPage.tsx
│       └── NotificationLogPage.tsx
│
├── components/notifications/
│   ├── NotificationBell.tsx       # Bell icon with badge
│   ├── NotificationDropdown.tsx   # Dropdown list
│   ├── NotificationCard.tsx
│   ├── NotificationStatusBadge.tsx
│   ├── PreferencesForm.tsx
│   └── EmailTemplateEditor.tsx

functions/src/
├── notifications/
│   ├── index.ts                   # Main exports
│   ├── send.ts                    # sendNotification trigger
│   ├── scheduled.ts               # Scheduled notifications
│   ├── reminders.ts               # Daily reminders
│   ├── email.ts                   # Email service
│   ├── whatsapp.ts                # WhatsApp service
│   ├── push.ts                    # Push service
│   └── sms.ts                     # SMS service
└── templates/
    ├── email/
    │   ├── finding_new.html
    │   ├── finding_reminder.html
    │   ├── inspection_report.html
    │   └── ...
    └── whatsapp/
        └── templates.json
```

---

## ✅ Checklist לפיתוח

### Types
- [ ] `types/notification.ts` - Notification, Template, Preferences

### Backend (Cloud Functions)
- [ ] sendNotification trigger
- [ ] processScheduledNotifications
- [ ] dailyReminders
- [ ] Email service (SendGrid)
- [ ] WhatsApp service (Meta API)
- [ ] Push service (FCM)
- [ ] SMS service (Twilio)

### Frontend - Admin
- [ ] NotificationCenterPage
- [ ] NotificationSettingsPage
- [ ] EmailTemplatesPage
- [ ] NotificationLogPage
- [ ] NotificationBell component

### Frontend - Portal
- [ ] Notifications list
- [ ] Preferences page
- [ ] Push notification registration

### Templates
- [ ] Email templates (HTML)
- [ ] WhatsApp templates (approval from Meta)

### Integrations
- [ ] SendGrid setup
- [ ] WhatsApp Business API setup
- [ ] Firebase Cloud Messaging setup
- [ ] Twilio setup (optional)

---

## 📅 אבני דרך

| שבוע | משימות |
|------|---------|
| **1** | Types, Database schema, SendGrid integration |
| **2** | Email service, Email templates |
| **3** | WhatsApp integration, WhatsApp templates |
| **4** | Push notifications, Notification center UI |
| **5** | Preferences, Scheduling, Testing |

---

## 🔗 קשר למודולים אחרים

| מודול | קשר |
|-------|------|
| **Phase 5: Findings** | התראות ליקויים ואסקלציה |
| **Phase 4: Inspections** | התראות ביקורות |
| **Phase 6: Client Portal** | מרכז התראות בפורטל |

---

*מסמך זה יעודכן במהלך הפיתוח*

**גרסה:** 1.0  
**תאריך:** 31/12/2025  
**נכתב ע"י:** Claude + Michel Mazor
