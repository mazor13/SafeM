import { Timestamp } from 'firebase/firestore';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low';
export type FindingStatus = 'open' | 'in_progress' | 'pending_approval' | 'closed' | 'rejected';

export interface FindingComment {
  id: string;
  text: string;
  by: string;
  byName: string;
  byRole: 'consultant' | 'client';
  source: 'web' | 'app' | 'external';
  createdAt: Timestamp;
  attachments?: string[];
}

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
  facilityId?: string;
  
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
    images?: string[];
  };
  
  // אישור יועץ
  approval?: {
    status: 'approved' | 'rejected';
    by: string;
    byName?: string;
    date: Timestamp;
    rejectionReason?: string;
  };
  
  // הערות ושיח
  comments?: FindingComment[];
  
  // היסטוריה
  history?: FindingHistoryEntry[];
  
  // מטא
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FindingHistoryEntry {
  action: 'created' | 'updated' | 'treated' | 'approved' | 'rejected' | 'reopened' | 'commented';
  by: string;
  byName?: string;
  date: Timestamp;
  details?: string;
}
