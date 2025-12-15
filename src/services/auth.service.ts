import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './firebase.service';
import { User, UserRole } from '../types/user.types';

/**
 * Sign in with email and password
 */
export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  return signOut(auth);
};

/**
 * Get current user data from Firestore
 */
export const getCurrentUserData = async (
  uid: string
): Promise<User | null> => {
  const db = getFirebaseDb();
  const userDoc = await getDoc(doc(db, 'users', uid));

  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data();
  return {
    id: userDoc.id,
    email: data['email'] as string,
    displayName: data['displayName'] as string,
    role: data['role'] as UserRole,
    organizationId: data['organizationId'] as string,
    createdAt: data['createdAt']?.toDate() || new Date(),
    updatedAt: data['updatedAt']?.toDate() || new Date(),
    isActive: data['isActive'] as boolean,
  };
};

/**
 * Subscribe to authentication state changes
 */
export const subscribeToAuthState = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user's custom claims (role and organizationId)
 */
export const getUserClaims = async (): Promise<{
  role: UserRole | null;
  organizationId: string | null;
}> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  if (!user) {
    return { role: null, organizationId: null };
  }

  const idTokenResult = await user.getIdTokenResult();
  return {
    role: (idTokenResult.claims['role'] as UserRole) || null,
    organizationId: (idTokenResult.claims['organizationId'] as string) || null,
  };
};

/**
 * Check if user has required role level
 */
export const hasRoleLevel = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  const roleLevels: Record<UserRole, number> = {
    [UserRole.SUPER_ADMIN]: 4,
    [UserRole.ORG_ADMIN]: 3,
    [UserRole.INSPECTOR]: 2,
    [UserRole.CLIENT]: 1,
  };

  return roleLevels[userRole] >= roleLevels[requiredRole];
};
