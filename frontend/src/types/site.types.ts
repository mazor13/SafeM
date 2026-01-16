/**
 * Site Hierarchy Types
 * מגדיר את מבנה האתרים, המבנים והאזורים של הלקוח.
 */

export type SiteType = 'campus' | 'building' | 'branch' | 'warehouse' | 'outdoor';

export interface Site {
  id: string;
  clientId: string;
  name: string; // שם האתר (למשל: קמפוס חיפה)
  type: SiteType;
  address?: string;
  managerName?: string;
  managerPhone?: string;
  coordinates?: { lat: number; lng: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Building {
  id: string;
  siteId: string;
  name: string; // שם/מספר הבניין
  floors: number;
  description?: string;
}

export interface SiteArea {
  id: string;
  buildingId: string; // אם זה בתוך בניין
  siteId: string;     // שיוך לאתר אב
  name: string;       // שם החדר/אזור (למשל: חדר שרתים ראשי)
  floor?: string;     // קומה (יכול להיות "2", "-1", "גג")
  accessCode?: string; // קוד כניסה (אופציונלי)
  riskLevel?: 'low' | 'medium' | 'high';
}
