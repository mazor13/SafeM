// ===========================================
// AEGIS - useDocuments Hook
// ניהול מסמכים ב-Firestore
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore as db } from '../firebase';

// ===========================================
// TYPES
// ===========================================

export interface Document {
  id: string;
  title: string;
  content: string;
  tenantId: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // מטא
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  
  // שיתוף
  isPublic?: boolean;
  sharedWith?: string[];
}

export interface UseDocumentsOptions {
  tenantId: string;
}

export interface UseDocumentOptions {
  documentId?: string;
  tenantId: string;
  userId: string;
}

// ===========================================
// DOCUMENT CATEGORIES
// ===========================================

export const DOCUMENT_CATEGORIES = [
  { value: 'procedure', label: 'נוהל', icon: '📋' },
  { value: 'report', label: 'דוח', icon: '📊' },
  { value: 'policy', label: 'מדיניות', icon: '📜' },
  { value: 'guide', label: 'מדריך', icon: '📖' },
  { value: 'template', label: 'תבנית', icon: '📄' },
  { value: 'other', label: 'אחר', icon: '📁' },
];

// ===========================================
// useDocuments - LIST HOOK
// ===========================================

export function useDocuments(options: UseDocumentsOptions) {
  const { tenantId } = options;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'documents'),
        where('tenantId', '==', tenantId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Document[];

      setDocuments(docs);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת מסמכים');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      await deleteDoc(doc(db, 'documents', documentId));
      setDocuments(prev => prev.filter(d => d.id !== documentId));
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  }, []);

  const duplicateDocument = useCallback(async (documentId: string, newTitle: string, userId: string) => {
    try {
      const originalDoc = documents.find(d => d.id === documentId);
      if (!originalDoc) throw new Error('המסמך לא נמצא');

      const newId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newDoc: Document = {
        ...originalDoc,
        id: newId,
        title: newTitle,
        status: 'draft',
        createdBy: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(doc(db, 'documents', newId), {
        ...newDoc,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setDocuments(prev => [newDoc, ...prev]);
      return newId;
    } catch (err) {
      console.error('Error duplicating document:', err);
      throw err;
    }
  }, [documents]);

  return {
    documents,
    loading,
    error,
    reload: loadDocuments,
    deleteDocument,
    duplicateDocument,
  };
}

// ===========================================
// useDocument - SINGLE DOCUMENT HOOK
// ===========================================

export function useDocument(options: UseDocumentOptions) {
  const { documentId, tenantId, userId } = options;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load or create document
  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);

    try {
      if (documentId && documentId !== 'new') {
        // Load existing document
        const docRef = await getDoc(doc(db, 'documents', documentId));
        if (!docRef.exists()) {
          throw new Error('המסמך לא נמצא');
        }
        setDocument({ id: docRef.id, ...docRef.data() } as Document);
      } else {
        // Create new document
        const newId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newDoc: Document = {
          id: newId,
          title: 'מסמך חדש',
          content: '',
          tenantId,
          createdBy: userId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          status: 'draft',
          category: 'other',
        };

        await setDoc(doc(db, 'documents', newId), {
          ...newDoc,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setDocument(newDoc);
      }
    } catch (err) {
      console.error('Error loading document:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת המסמך');
    } finally {
      setLoading(false);
    }
  };

  // Update title
  const updateTitle = useCallback(async (title: string) => {
    if (!document) return;

    try {
      await updateDoc(doc(db, 'documents', document.id), {
        title,
        updatedAt: serverTimestamp(),
      });

      setDocument(prev => prev ? { ...prev, title, updatedAt: Timestamp.now() } : null);
    } catch (err) {
      console.error('Error updating title:', err);
      throw err;
    }
  }, [document]);

  // Update content
  const updateContent = useCallback(async (content: string) => {
    if (!document) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'documents', document.id), {
        content,
        updatedAt: serverTimestamp(),
      });

      setDocument(prev => prev ? { ...prev, content, updatedAt: Timestamp.now() } : null);
    } catch (err) {
      console.error('Error updating content:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [document]);

  // Update metadata
  const updateMetadata = useCallback(async (metadata: Partial<Document>) => {
    if (!document) return;

    try {
      await updateDoc(doc(db, 'documents', document.id), {
        ...metadata,
        updatedAt: serverTimestamp(),
      });

      setDocument(prev => prev ? { ...prev, ...metadata, updatedAt: Timestamp.now() } : null);
    } catch (err) {
      console.error('Error updating metadata:', err);
      throw err;
    }
  }, [document]);

  // Publish
  const publish = useCallback(async () => {
    if (!document) return;

    try {
      await updateDoc(doc(db, 'documents', document.id), {
        status: 'published',
        updatedAt: serverTimestamp(),
      });

      setDocument(prev => prev ? { ...prev, status: 'published', updatedAt: Timestamp.now() } : null);
    } catch (err) {
      console.error('Error publishing document:', err);
      throw err;
    }
  }, [document]);

  // Archive
  const archive = useCallback(async () => {
    if (!document) return;

    try {
      await updateDoc(doc(db, 'documents', document.id), {
        status: 'archived',
        updatedAt: serverTimestamp(),
      });

      setDocument(prev => prev ? { ...prev, status: 'archived', updatedAt: Timestamp.now() } : null);
    } catch (err) {
      console.error('Error archiving document:', err);
      throw err;
    }
  }, [document]);

  return {
    document,
    loading,
    error,
    saving,
    updateTitle,
    updateContent,
    updateMetadata,
    publish,
    archive,
    reload: loadDocument,
  };
}