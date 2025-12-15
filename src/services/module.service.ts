import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase.service';
import {
  ModuleRecord,
  BaseModuleRecord,
  RecordStatus,
} from '../types/module.types';

/**
 * Generic function to create a module record
 * Enforces organizationId requirement
 */
export const createModuleRecord = async <T extends BaseModuleRecord>(
  collectionName: string,
  data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  // Validate organizationId exists
  if (!data.organizationId) {
    throw new Error('organizationId is required for all module records');
  }

  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Get module records for an organization
 */
export const getModuleRecordsByOrganization = async (
  collectionName: string,
  organizationId: string
): Promise<ModuleRecord[]> => {
  if (!organizationId) {
    throw new Error('organizationId is required');
  }

  const db = getFirebaseDb();
  const q = query(
    collection(db, collectionName),
    where('organizationId', '==', organizationId),
    where('status', '!=', RecordStatus.DELETED)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data['createdAt'] as Timestamp)?.toDate() || new Date(),
      updatedAt: (data['updatedAt'] as Timestamp)?.toDate() || new Date(),
    } as ModuleRecord;
  });
};

/**
 * Update a module record
 * Validates organizationId hasn't changed
 */
export const updateModuleRecord = async <T extends Partial<BaseModuleRecord>>(
  collectionName: string,
  recordId: string,
  data: T
): Promise<void> => {
  // Prevent changing organizationId
  if ('organizationId' in data && data.organizationId) {
    throw new Error('Cannot change organizationId of existing record');
  }

  const db = getFirebaseDb();
  const docRef = doc(db, collectionName, recordId);

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Soft delete a module record
 */
export const deleteModuleRecord = async (
  collectionName: string,
  recordId: string
): Promise<void> => {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionName, recordId);

  await updateDoc(docRef, {
    status: RecordStatus.DELETED,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Collection names for each module
 */
export const COLLECTION_NAMES = {
  RADIATION: 'radiationRecords',
  LASER: 'laserRecords',
  FIRE: 'fireSafetyRecords',
  WORK_SAFETY: 'workSafetyRecords',
  TRAINING: 'trainingRecords',
} as const;
