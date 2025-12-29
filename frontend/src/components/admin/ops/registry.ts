import { Activity, LucideIcon } from 'lucide-react';

export interface OpsTool {
  id: string;
  title: string;
  desc: string;
  component: string; // השם שיופיע ב-COMPONENT_MAP
  icon: LucideIcon;
  minLevel: number; // 1 = Basic, 2 = Tech, 3 = DevOps
}

export const OPS_REGISTRY: OpsTool[] = [
  {
    id: 'diag-001',
    title: 'סריקת מערכת (L1)',
    desc: 'בדיקת בריאות בסיסית וניתוח לוגים מהיר',
    component: 'DiagnosticTool',
    icon: Activity,
    minLevel: 1
  }
];
