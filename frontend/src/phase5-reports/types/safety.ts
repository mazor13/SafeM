/**
 * AEGIS Safety Domains
 * תחומי בטיחות
 * 
 * Note: This file may already exist in the project.
 * If so, import from the existing location.
 */

export type SafetyDomain = 
  | 'laser'
  | 'fire'
  | 'lifting'
  | 'pressure'
  | 'electrical'
  | 'chemical'
  | 'radiation'
  | 'noise'
  | 'ergonomics'
  | 'heights'
  | 'confined_spaces'
  | 'general';

export interface SafetyDomainInfo {
  id: SafetyDomain;
  name: string;
  nameEn: string;
  color: string;
  icon: string;
}

export const SAFETY_DOMAINS: Record<SafetyDomain, SafetyDomainInfo> = {
  laser: {
    id: 'laser',
    name: 'בטיחות לייזר',
    nameEn: 'Laser Safety',
    color: '#ef4444',
    icon: '🔴',
  },
  fire: {
    id: 'fire',
    name: 'בטיחות אש',
    nameEn: 'Fire Safety',
    color: '#f97316',
    icon: '🔥',
  },
  lifting: {
    id: 'lifting',
    name: 'מתקני הרמה',
    nameEn: 'Lifting Equipment',
    color: '#eab308',
    icon: '🏗️',
  },
  pressure: {
    id: 'pressure',
    name: 'ציוד לחץ',
    nameEn: 'Pressure Equipment',
    color: '#22c55e',
    icon: '🔧',
  },
  electrical: {
    id: 'electrical',
    name: 'בטיחות חשמל',
    nameEn: 'Electrical Safety',
    color: '#3b82f6',
    icon: '⚡',
  },
  chemical: {
    id: 'chemical',
    name: 'חומרים מסוכנים',
    nameEn: 'Chemical Safety',
    color: '#8b5cf6',
    icon: '⚗️',
  },
  radiation: {
    id: 'radiation',
    name: 'קרינה',
    nameEn: 'Radiation Safety',
    color: '#ec4899',
    icon: '☢️',
  },
  noise: {
    id: 'noise',
    name: 'רעש',
    nameEn: 'Noise',
    color: '#06b6d4',
    icon: '🔊',
  },
  ergonomics: {
    id: 'ergonomics',
    name: 'ארגונומיה',
    nameEn: 'Ergonomics',
    color: '#14b8a6',
    icon: '🪑',
  },
  heights: {
    id: 'heights',
    name: 'עבודה בגובה',
    nameEn: 'Working at Heights',
    color: '#6366f1',
    icon: '🧗',
  },
  confined_spaces: {
    id: 'confined_spaces',
    name: 'חללים מוקפים',
    nameEn: 'Confined Spaces',
    color: '#84cc16',
    icon: '🚧',
  },
  general: {
    id: 'general',
    name: 'בטיחות כללית',
    nameEn: 'General Safety',
    color: '#6b7280',
    icon: '🛡️',
  },
};

export function getSafetyDomainInfo(domain: SafetyDomain): SafetyDomainInfo {
  return SAFETY_DOMAINS[domain] || SAFETY_DOMAINS.general;
}
