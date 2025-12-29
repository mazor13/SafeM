export type TenantStatus = 'active' | 'suspended' | 'trial' | 'pending';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  taxId: string;
  status: TenantStatus;
  createdAt: Date;
}

export interface Subscription {
  tenantId: string;
  planId: 'starter' | 'pro' | 'enterprise';
  maxUsers: number;
  maxStorageGB: number;
  features: {
    laser: boolean;
    fire: boolean;
    height: boolean;
  };
  expiryDate?: Date;
}

export interface Invoice {
  id: string;
  tenantId: string;
  amount: number;
  currency: 'ILS' | 'USD';
  status: 'paid' | 'unpaid' | 'overdue' | 'refunded';
  externalLink?: string; // לינק לחשבונית ב-Morning
  billingDate: Date;
  dueDate: Date;
}

export interface StorageConfig {
  tenantId: string;
  provider: 'internal' | 'aws_s3' | 'azure_blob';
  bucketName?: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
  };
  isMirrored: boolean; // האם לשמור עותק גם ב-AEGIS
}

export interface TenantBranding {
  tenantId: string;
  customDomain?: string;
  logoUrl?: string;
  primaryColor: string; // HEX
  secondaryColor: string; // HEX
  faviconUrl?: string;
  status: 'pending_dns' | 'active' | 'error';
}

export interface BackupRecord {
  id: string;
  tenantId: string;
  snapshotDate: Date;
  sizeBytes: number;
  status: 'completed' | 'failed' | 'restoring';
  createdBy: string; // 'system' or admin_id
}

export interface BusinessRule {
  id: string;
  tenantId: string | 'global';
  triggerEvent: 'INACTIVITY' | 'REPORT_FAILED' | 'QUOTA_REACHED' | 'DOCUMENT_SIGNED';
  conditions: {
    field: string;
    operator: 'equals' | 'greater_than' | 'contains';
    value: any;
  }[];
  actionType: 'SEND_EMAIL' | 'SEND_SMS' | 'SUSPEND_ACCOUNT' | 'WEBHOOK';
  payload: any;
  isActive: boolean;
}

export interface EnterpriseConfig {
  poNumber: string;
  poTotalBudget: number;
  poUsedBudget: number;
  poExpirationDate: Date;
  requiresAdminApproval: boolean; // האם תשלום דורש אישור ידני
  externalSystemId?: string; // מזהה בתוך ניפנדו/מערכת רכש
}
