import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase.service';
import {
  Organization,
  CreateOrganizationData,
  SafetyModule,
} from '../types/organization.types';

const COLLECTION_NAME = 'organizations';

/**
 * Create a new organization
 * Note: organizationId is set to the document ID for self-reference
 * This is required for security rules to validate organizationId on all documents
 */
export const createOrganization = async (
  data: CreateOrganizationData
): Promise<string> => {
  const db = getFirebaseDb();
  
  // First create the document
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    name: data.name,
    nameHebrew: data.nameHebrew,
    email: data.email,
    phone: data.phone,
    address: data.address,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
    settings: {
      language: 'he',
      timezone: 'Asia/Jerusalem',
    },
    modules: data.modules.map((module) => ({
      module,
      enabled: true,
    })),
    organizationId: '', // Placeholder to pass initial validation
  });

  // Update with the actual document ID as organizationId
  await updateDoc(doc(db, COLLECTION_NAME, docRef.id), {
    organizationId: docRef.id,
  });

  return docRef.id;
};

/**
 * Get organization by ID
 */
export const getOrganization = async (
  id: string
): Promise<Organization | null> => {
  const db = getFirebaseDb();
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    name: data['name'] as string,
    nameHebrew: data['nameHebrew'] as string,
    email: data['email'] as string,
    phone: data['phone'] as string,
    address: data['address'] as string,
    createdAt: (data['createdAt'] as Timestamp)?.toDate() || new Date(),
    updatedAt: (data['updatedAt'] as Timestamp)?.toDate() || new Date(),
    isActive: data['isActive'] as boolean,
    settings: data['settings'] as Organization['settings'],
    modules: data['modules'] as Organization['modules'],
  };
};

/**
 * Get all organizations (SuperAdmin only)
 */
export const getAllOrganizations = async (): Promise<Organization[]> => {
  const db = getFirebaseDb();
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data['name'] as string,
      nameHebrew: data['nameHebrew'] as string,
      email: data['email'] as string,
      phone: data['phone'] as string,
      address: data['address'] as string,
      createdAt: (data['createdAt'] as Timestamp)?.toDate() || new Date(),
      updatedAt: (data['updatedAt'] as Timestamp)?.toDate() || new Date(),
      isActive: data['isActive'] as boolean,
      settings: data['settings'] as Organization['settings'],
      modules: data['modules'] as Organization['modules'],
    };
  });
};

/**
 * Update organization
 */
export const updateOrganization = async (
  id: string,
  data: Partial<Organization>
): Promise<void> => {
  const db = getFirebaseDb();
  const docRef = doc(db, COLLECTION_NAME, id);

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete organization (soft delete)
 */
export const deleteOrganization = async (id: string): Promise<void> => {
  const db = getFirebaseDb();
  const docRef = doc(db, COLLECTION_NAME, id);

  await updateDoc(docRef, {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Check if organization has module enabled
 */
export const hasModuleEnabled = (
  org: Organization,
  module: SafetyModule
): boolean => {
  const orgModule = org.modules.find((m) => m.module === module);
  return orgModule?.enabled || false;
};
