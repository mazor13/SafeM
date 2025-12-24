export type Role = 'super_admin' | 'admin' | 'employee' | 'client_user' | 'org_admin' | 'safety_manager';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: Role;
  permissions?: string[];
  department?: string;
  phone?: string;
  avatarUrl?: string;
  status?: 'active' | 'inactive';
  lastActive?: Date;
}

export interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
  status: 'active' | 'inactive';
  organizationId?: string; // הוסף כדי לתמוך בציוד
  contractDetails?: {
    planName: string;
    startDate: any;
    endDate: any;
    maxUsers?: number;       // הוסף
    activeModules?: string[]; // הוסף
    status?: 'active' | 'inactive'; // הוסף
  };
}

// Equipment Types
export interface Equipment {
  id: string;
  name: string;
  type: string;
  model?: string;
  serialNumber?: string;
  status: 'active' | 'maintenance' | 'broken';
  purchaseDate?: Date;
  nextInspectionDate?: Date | string; // גמישות לתאריכים
  organizationId?: string;
  location?: string;
  notes?: string;
}

export interface ModuleType {
  id: string;
  label: string;
  icon?: any;
}

// Template System Types
export interface InspectionTemplate {
  id: string;
  title: string;
  description?: string;
  category: 'safety' | 'maintenance' | 'audit' | 'general';
  isGlobal: boolean;
  sections: TemplateSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateSection {
  id: string;
  title: string;
  items: TemplateItem[];
}

export interface TemplateItem {
  id: string;
  text: string;
  type: 'pass_fail' | 'text' | 'number' | 'photo';
  required: boolean;
}
