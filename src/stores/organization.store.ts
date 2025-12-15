import { create } from 'zustand';
import { Organization, SafetyModule } from '../types/organization.types';

interface OrganizationState {
  currentOrganization: Organization | null;
  organizations: Organization[];
  isLoading: boolean;
  error: string | null;
  setCurrentOrganization: (org: Organization | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hasModule: (module: SafetyModule) => boolean;
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  currentOrganization: null,
  organizations: [],
  isLoading: false,
  error: null,

  setCurrentOrganization: (org) =>
    set({
      currentOrganization: org,
      error: null,
    }),

  setOrganizations: (orgs) =>
    set({
      organizations: orgs,
      error: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  hasModule: (module) => {
    const { currentOrganization } = get();
    if (!currentOrganization) return false;

    const orgModule = currentOrganization.modules.find(
      (m) => m.module === module
    );
    return orgModule?.enabled || false;
  },
}));
