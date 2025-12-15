import { useAuth } from '../hooks/useAuth';
import { useOrganization } from '../hooks/useOrganization';
import { signOutUser } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types/user.types';
import { SafetyModule } from '../types/organization.types';

/**
 * Dashboard component with role-based features and RTL Hebrew support
 */
export const Dashboard = () => {
  const { user, hasRoleLevel } = useAuth();
  const { currentOrganization, hasModuleAccess } = useOrganization();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const getRoleDisplayName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'מנהל על',
      [UserRole.ORG_ADMIN]: 'מנהל ארגון',
      [UserRole.INSPECTOR]: 'בודק',
      [UserRole.CLIENT]: 'לקוח',
    };
    return roleNames[role];
  };

  const getModuleDisplayName = (module: SafetyModule): string => {
    const moduleNames: Record<SafetyModule, string> = {
      [SafetyModule.RADIATION]: 'קרינה',
      [SafetyModule.LASER]: 'לייזר',
      [SafetyModule.FIRE]: 'בטיחות אש',
      [SafetyModule.WORK_SAFETY]: 'בטיחות בעבודה',
      [SafetyModule.TRAINING]: 'הדרכות',
      [SafetyModule.CHEMICAL]: 'כימיקלים',
      [SafetyModule.ELECTRICAL]: 'חשמל',
    };
    return moduleNames[module];
  };

  return (
    <div style={{ direction: 'rtl', padding: '2rem' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '2px solid #ccc',
        paddingBottom: '1rem'
      }}>
        <h1>לוח בקרה - SafeM</h1>
        <button
          onClick={handleSignOut}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          התנתק
        </button>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <h2>פרטי משתמש</h2>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <p><strong>שם:</strong> {user?.displayName}</p>
          <p><strong>אימייל:</strong> {user?.email}</p>
          <p><strong>תפקיד:</strong> {user ? getRoleDisplayName(user.role) : ''}</p>
          <p><strong>ארגון:</strong> {currentOrganization?.nameHebrew || 'טוען...'}</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>הרשאות</h2>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>✓ צפייה בדוחות</li>
            {hasRoleLevel(UserRole.INSPECTOR) && <li>✓ יצירת בדיקות</li>}
            {hasRoleLevel(UserRole.ORG_ADMIN) && <li>✓ ניהול משתמשים</li>}
            {hasRoleLevel(UserRole.SUPER_ADMIN) && <li>✓ ניהול ארגונים</li>}
          </ul>
        </div>
      </div>

      {currentOrganization && (
        <div>
          <h2>מודולים פעילים</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            {currentOrganization.modules
              .filter((m) => m.enabled)
              .map((m) => (
                <div
                  key={m.module}
                  style={{
                    backgroundColor: hasModuleAccess(m.module) ? '#d4edda' : '#f8d7da',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: hasModuleAccess(m.module) ? '2px solid #28a745' : '2px solid #dc3545',
                  }}
                >
                  <strong>{getModuleDisplayName(m.module)}</strong>
                  <br />
                  <small>{hasModuleAccess(m.module) ? 'פעיל' : 'לא זמין'}</small>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
