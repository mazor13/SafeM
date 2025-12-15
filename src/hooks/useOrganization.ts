import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/auth.store';
import { useOrganizationStore } from '../stores/organization.store';
import { getOrganization, getAllOrganizations } from '../services/organization.service';
import { UserRole } from '../types/user.types';
import { SafetyModule } from '../types/organization.types';

/**
 * Hook to manage organization data
 */
export const useOrganization = () => {
  const { user } = useAuthStore();
  const {
    currentOrganization,
    organizations,
    setCurrentOrganization,
    setOrganizations,
    hasModule,
  } = useOrganizationStore();

  // Fetch current user's organization
  const { isLoading: isLoadingCurrent } = useQuery({
    queryKey: ['organization', user?.organizationId],
    queryFn: async () => {
      if (!user?.organizationId) return null;
      const org = await getOrganization(user.organizationId);
      setCurrentOrganization(org);
      return org;
    },
    enabled: !!user?.organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch all organizations (SuperAdmin only)
  const { isLoading: isLoadingAll } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const orgs = await getAllOrganizations();
      setOrganizations(orgs);
      return orgs;
    },
    enabled: user?.role === UserRole.SUPER_ADMIN,
    staleTime: 5 * 60 * 1000,
  });

  const hasModuleAccess = (module: SafetyModule): boolean => {
    return hasModule(module);
  };

  return {
    currentOrganization,
    organizations,
    isLoading: isLoadingCurrent || isLoadingAll,
    hasModuleAccess,
  };
};
