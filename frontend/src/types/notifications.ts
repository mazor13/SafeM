import { Timestamp } from 'firebase/firestore';

export type NotificationType = 'automation' | 'system' | 'mention' | 'task';

export type NotificationLinkType = 'finding' | 'inspection' | 'task' | 'client' | 'equipment';

export interface Notification {
  id: string;
  userId: string;
  tenantId: string;
  title: string;
  body: string;
  type: NotificationType;
  linkTo?: string;
  linkType?: NotificationLinkType;
  linkId?: string;
  isRead: boolean;
  readAt?: Date;  // Changed from Timestamp to Date
  sourceRuleId?: string;
  createdAt: Date;  // Changed from Timestamp to Date
}

export interface CreateNotificationDTO {
  userId: string;
  tenantId: string;
  title: string;
  body: string;
  type: NotificationType;
  linkTo?: string;
  linkType?: NotificationLinkType;
  linkId?: string;
  sourceRuleId?: string;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export interface UnreadCountResult {
  count: number;
}
