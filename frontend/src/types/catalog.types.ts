import { SafetyDomain } from './equipment.types';

export interface CatalogItem {
  id: string;
  manufacturer: string;
  model: string;
  domain: SafetyDomain;
  description?: string;
  specs?: Record<string, any>;
  recommendedFrequency?: number;
  standardRef?: string;
  isGlobal: boolean;
  tenantId?: string;
  createdAt: any;
  updatedAt: any;
}
