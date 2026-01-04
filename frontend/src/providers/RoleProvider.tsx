import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { firestore as db } from '../firebase';

// סוגי תפקידים
type UserRole = 'super_admin' | 'admin' | 'system_admin' | 'inspector' | 'client_user' | null;

// הרשאות
interface Permissions {
  canViewEquipment: boolean;
  canAddEquipment: boolean;
  canEditEquipment: boolean;
  canDeleteEquipment: boolean;
  canAddCriticalEquipment: boolean;  // דורש אישור יועץ
  
  canViewInspections: boolean;
  canCreateInspection: boolean;
  canEditInspection: boolean;
  
  canViewFindings: boolean;
  canUpdateFindingStatus: boolean;  // לקוח יכול לעדכן "טופל"
  canCreateFinding: boolean;        // רק יועץ
  canDeleteFinding: boolean;        // רק יועץ
  
  canViewDocuments: boolean;
  canUploadDocuments: boolean;
  canDeleteDocuments: boolean;
  
  canViewTraining: boolean;
  canRegisterTraining: boolean;
  canUploadCertificate: boolean;
  
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManageClients: boolean;
}

interface RoleContextType {
  role: UserRole;
  clientId: string | null;
  tenantId: string | null;
  loading: boolean;
  
  // Flags
  isConsultant: boolean;  // יועץ (admin, super_admin, inspector)
  isClient: boolean;      // לקוח
  isAdmin: boolean;       // מנהל מערכת
  
  // Permissions
  permissions: Permissions;
  
  // Helper functions
  can: (action: keyof Permissions) => boolean;
}

const defaultPermissions: Permissions = {
  canViewEquipment: false,
  canAddEquipment: false,
  canEditEquipment: false,
  canDeleteEquipment: false,
  canAddCriticalEquipment: false,
  
  canViewInspections: false,
  canCreateInspection: false,
  canEditInspection: false,
  
  canViewFindings: false,
  canUpdateFindingStatus: false,
  canCreateFinding: false,
  canDeleteFinding: false,
  
  canViewDocuments: false,
  canUploadDocuments: false,
  canDeleteDocuments: false,
  
  canViewTraining: false,
  canRegisterTraining: false,
  canUploadCertificate: false,
  
  canAccessAdmin: false,
  canManageUsers: false,
  canManageClients: false,
};

const RoleContext = createContext<RoleContextType>({
  role: null,
  clientId: null,
  tenantId: null,
  loading: true,
  isConsultant: false,
  isClient: false,
  isAdmin: false,
  permissions: defaultPermissions,
  can: () => false,
});

export const useRole = () => useContext(RoleContext);

// הגדרת הרשאות לפי תפקיד
const getPermissionsByRole = (role: UserRole, isClientUser: boolean): Permissions => {
  // יועץ / מנהל - הרשאות מלאות
  if (role === 'super_admin' || role === 'admin' || role === 'system_admin') {
    return {
      canViewEquipment: true,
      canAddEquipment: true,
      canEditEquipment: true,
      canDeleteEquipment: true,
      canAddCriticalEquipment: true,
      
      canViewInspections: true,
      canCreateInspection: true,
      canEditInspection: true,
      
      canViewFindings: true,
      canUpdateFindingStatus: true,
      canCreateFinding: true,
      canDeleteFinding: true,
      
      canViewDocuments: true,
      canUploadDocuments: true,
      canDeleteDocuments: true,
      
      canViewTraining: true,
      canRegisterTraining: true,
      canUploadCertificate: true,
      
      canAccessAdmin: true,
      canManageUsers: true,
      canManageClients: true,
    };
  }
  
  // בודק/מפקח - הרשאות מקצועיות
  if (role === 'inspector') {
    return {
      canViewEquipment: true,
      canAddEquipment: true,
      canEditEquipment: true,
      canDeleteEquipment: false,
      canAddCriticalEquipment: true,
      
      canViewInspections: true,
      canCreateInspection: true,
      canEditInspection: true,
      
      canViewFindings: true,
      canUpdateFindingStatus: true,
      canCreateFinding: true,
      canDeleteFinding: false,
      
      canViewDocuments: true,
      canUploadDocuments: true,
      canDeleteDocuments: false,
      
      canViewTraining: true,
      canRegisterTraining: true,
      canUploadCertificate: true,
      
      canAccessAdmin: false,  // לא יכול לגשת לאדמין אלא אם יש לו clientId
      canManageUsers: false,
      canManageClients: false,
    };
  }
  
  // לקוח - הרשאות מוגבלות
  if (role === 'client_user' || isClientUser) {
    return {
      canViewEquipment: true,
      canAddEquipment: true,       // ציוד רגיל בלבד
      canEditEquipment: false,
      canDeleteEquipment: false,
      canAddCriticalEquipment: false,  // דורש אישור
      
      canViewInspections: true,
      canCreateInspection: false,  // רק בקשה
      canEditInspection: false,
      
      canViewFindings: true,
      canUpdateFindingStatus: true,  // יכול לעדכן "טופל"
      canCreateFinding: false,
      canDeleteFinding: false,
      
      canViewDocuments: true,
      canUploadDocuments: true,    // יכול להעלות תסקירים וכד'
      canDeleteDocuments: false,
      
      canViewTraining: true,
      canRegisterTraining: true,
      canUploadCertificate: true,
      
      canAccessAdmin: false,
      canManageUsers: false,
      canManageClients: false,
    };
  }
  
  // ברירת מחדל - אין הרשאות
  return defaultPermissions;
};

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setClientId(null);
        setTenantId(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setRole(data.role as UserRole);
          setClientId(data.clientId || null);
          setTenantId(data.tenantId || null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  const isConsultant = role === 'super_admin' || role === 'admin' || role === 'system_admin' || role === 'inspector';
  const isClient = role === 'client_user' || (!!clientId && !isConsultant);
  const isAdmin = role === 'super_admin' || role === 'admin' || role === 'system_admin';
  
  const permissions = getPermissionsByRole(role, isClient);
  
  const can = (action: keyof Permissions): boolean => {
    return permissions[action];
  };

  return (
    <RoleContext.Provider value={{
      role,
      clientId,
      tenantId,
      loading: loading || authLoading,
      isConsultant,
      isClient,
      isAdmin,
      permissions,
      can,
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleProvider;
