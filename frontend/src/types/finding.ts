import { Timestamp } from 'firebase/firestore';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'in_progress' | 'pending_approval' | 'closed' | 'rejected';

export interface Finding {
  id: string;
  
  // פרטי הממצא
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  
  // קישור לציוד
  equipmentId?: string;
  equipmentName?: string;
  
  // מיקום
  location?: string;
  
  // תאריכים
  foundDate: Timestamp;
  dueDate?: Timestamp;
  closedDate?: Timestamp;
  
  // מי מצא
  foundBy: string;
  foundByName?: string;
  
  // טיפול
  treatment?: {
    description: string;
    treatedBy: string;
    treatedByName?: string;
    treatedDate: Timestamp;
    images?: string[]; // URLs from Firebase Storage
  };
  
  // אישור יועץ
  approval?: {
    status: 'approved' | 'rejected';
    by: string;
    byName?: string;
    date: Timestamp;
    rejectionReason?: string;
  };
  
  // היסטוריה
  history?: FindingHistoryEntry[];
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FindingHistoryEntry {
  action: 'created' | 'updated' | 'treated' | 'approved' | 'rejected' | 'reopened';
  by: string;
  byName?: string;
  date: Timestamp;
  details?: string;
}
