export type SafetyDomain = 'fire_safety' | 'electricity' | 'elevators' | 'lifting' | 'gas' | 'accessibility' | 'machinery' | 'radiation';

export const SAFETY_DOMAINS: Record<string, { name: string; icon: string; color: string }> = {
  fire_safety: { name: 'כיבוי אש', icon: 'fire', color: 'red' },
  electricity: { name: 'חשמל', icon: 'zap', color: 'yellow' },
  elevators: { name: 'מעליות', icon: 'arrow-up-circle', color: 'blue' },
  lifting: { name: 'מתקני הרמה', icon: 'anchor', color: 'orange' },
  gas: { name: 'גז', icon: 'wind', color: 'green' },
  accessibility: { name: 'נגישות', icon: 'user', color: 'purple' },
  machinery: { name: 'מכונות', icon: 'settings', color: 'slate' },
  radiation: { name: 'קרינה', icon: 'radio', color: 'rose' },
};
