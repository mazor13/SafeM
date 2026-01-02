// ===========================================
// AEGIS - useTemplates Hook V2
// Phase 2: ניהול תבניות + קטגוריות דינמיות
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { firestore } from '../firebase';
import { logAction } from './useAuditLog';
import {
  Template,
  TemplateSection,
  TemplateField,
  TemplateStatus,
  TemplateType,
  SafetyCategory,
  TemplateVersion,
  createDefaultTemplate,
  createDefaultSection,
  createDefaultField,
  FieldType,
  SAFETY_CATEGORIES,
} from '../types/template-types';

// ===========================================
// TYPES
// ===========================================

interface UseTemplatesOptions {
  tenantId?: string;
  status?: TemplateStatus;
  type?: TemplateType;
  category?: SafetyCategory | string;
  includeSystem?: boolean;
  realtime?: boolean;
  limit?: number;
}

interface UseTemplatesReturn {
  templates: Template[];
  loading: boolean;
  error: string | null;
  createTemplate: (data: Partial<Template>) => Promise<string>;
  updateTemplate: (id: string, data: Partial<Template>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string, newName: string) => Promise<string>;
  publishTemplate: (id: string) => Promise<void>;
  archiveTemplate: (id: string) => Promise<void>;
  createVersion: (id: string, notes?: string) => Promise<string>;
  getVersions: (id: string) => Promise<TemplateVersion[]>;
  restoreVersion: (templateId: string, versionId: string) => Promise<void>;
}

interface UseTemplateReturn {
  template: Template | null;
  loading: boolean;
  error: string | null;
  updateTemplate: (data: Partial<Template>) => Promise<void>;
  addSection: (section?: Partial<TemplateSection>) => Promise<string>;
  updateSection: (sectionId: string, data: Partial<TemplateSection>) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
  reorderSections: (sectionIds: string[]) => Promise<void>;
  addField: (sectionId: string, type: FieldType, data?: Partial<TemplateField>) => Promise<string>;
  updateField: (sectionId: string, fieldId: string, data: Partial<TemplateField>) => Promise<void>;
  deleteField: (sectionId: string, fieldId: string) => Promise<void>;
  reorderFields: (sectionId: string, fieldIds: string[]) => Promise<void>;
  moveFieldToSection: (fieldId: string, fromSectionId: string, toSectionId: string) => Promise<void>;
  publish: () => Promise<void>;
  saveDraft: () => Promise<void>;
}

export interface CategoryItem {
  value: string;
  label: string;
  labelHe: string;
  icon: string;
}

interface UseCategoriesReturn {
  categories: CategoryItem[];
  loading: boolean;
  addCategory: (category: { value: string; labelHe: string; icon: string }) => Promise<void>;
  deleteCategory: (value: string) => Promise<void>;
}

// ===========================================
// HOOK: useCategories (Dynamic Categories)
// ===========================================

export function useCategories(): UseCategoriesReturn {
  const [customCategories, setCustomCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(firestore, 'settings', 'categories');
    
    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCustomCategories(data.items || []);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const categories: CategoryItem[] = [
    ...SAFETY_CATEGORIES,
    ...customCategories.filter(c => !SAFETY_CATEGORIES.find(sc => sc.value === c.value)),
  ];

  const addCategory = useCallback(async (category: { value: string; labelHe: string; icon: string }) => {
    const docRef = doc(firestore, 'settings', 'categories');
    const snapshot = await getDoc(docRef);
    
    const existingItems: CategoryItem[] = snapshot.exists() ? snapshot.data().items || [] : [];
    
    if (existingItems.find(c => c.value === category.value) || SAFETY_CATEGORIES.find(c => c.value === category.value)) {
      throw new Error('קטגוריה כבר קיימת');
    }

    const newCategory: CategoryItem = {
      value: category.value,
      label: category.labelHe,
      labelHe: category.labelHe,
      icon: category.icon,
    };

    await setDoc(docRef, {
      items: [...existingItems, newCategory],
      updatedAt: Timestamp.now(),
    }, { merge: true });
  }, []);

  const deleteCategory = useCallback(async (value: string) => {
    if (SAFETY_CATEGORIES.find(c => c.value === value)) {
      throw new Error('לא ניתן למחוק קטגוריית מערכת');
    }

    const docRef = doc(firestore, 'settings', 'categories');
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      const existingItems: CategoryItem[] = snapshot.data().items || [];
      await setDoc(docRef, {
        items: existingItems.filter(c => c.value !== value),
        updatedAt: Timestamp.now(),
      }, { merge: true });
    }
  }, []);

  return {
    categories,
    loading,
    addCategory,
    deleteCategory,
  };
}

// ===========================================
// HOOK: useTemplates (List)
// ===========================================

export function useTemplates(options: UseTemplatesOptions = {}): UseTemplatesReturn {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    tenantId,
    status,
    type,
    category,
    includeSystem = true,
    realtime = true,
    limit: queryLimit = 100,
  } = options;

  useEffect(() => {
    if (!tenantId) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(firestore, 'templates'),
      orderBy('updatedAt', 'desc'),
      limit(queryLimit)
    );

    if (realtime) {
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          let data = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
          })) as Template[];
          
          // Filter client-side for more flexibility
          if (includeSystem) {
            data = data.filter(t => t.tenantId === tenantId || t.tenantId === 'system');
          } else {
            data = data.filter(t => t.tenantId === tenantId);
          }
          
          if (status) {
            data = data.filter(t => t.status === status);
          }
          if (type) {
            data = data.filter(t => t.type === type);
          }
          if (category) {
            data = data.filter(t => t.category === category);
          }
          
          setTemplates(data);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching templates:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsub();
    } else {
      getDocs(q)
        .then((snapshot) => {
          let data = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
          })) as Template[];
          
          if (includeSystem) {
            data = data.filter(t => t.tenantId === tenantId || t.tenantId === 'system');
          } else {
            data = data.filter(t => t.tenantId === tenantId);
          }
          
          if (status) {
            data = data.filter(t => t.status === status);
          }
          if (type) {
            data = data.filter(t => t.type === type);
          }
          if (category) {
            data = data.filter(t => t.category === category);
          }
          
          setTemplates(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching templates:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [tenantId, status, type, category, includeSystem, realtime, queryLimit]);

  const createTemplate = useCallback(async (data: Partial<Template>): Promise<string> => {
    if (!tenantId) throw new Error('Tenant ID is required');

    const now = Timestamp.now();
    const templateData = {
      ...createDefaultTemplate(tenantId, data.createdBy || 'system'),
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(firestore, 'templates'), templateData);

    await logAction({
      action: 'created',
      entityType: 'template',
      entityId: docRef.id,
      entityName: templateData.nameHe || templateData.name,
      tenantId,
    }, null);

    return docRef.id;
  }, [tenantId]);

  const updateTemplate = useCallback(async (id: string, data: Partial<Template>): Promise<void> => {
    const docRef = doc(firestore, 'templates', id);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    await logAction({
      action: 'updated',
      entityType: 'template',
      entityId: id,
      entityName: data.nameHe || data.name,
      tenantId,
    }, null);
  }, [tenantId]);

  const deleteTemplate = useCallback(async (id: string): Promise<void> => {
    const docRef = doc(firestore, 'templates', id);
    const snapshot = await getDoc(docRef);
    const template = snapshot.data() as Template;

    await deleteDoc(docRef);

    await logAction({
      action: 'deleted',
      entityType: 'template',
      entityId: id,
      entityName: template?.nameHe || template?.name,
      tenantId,
    }, null);
  }, [tenantId]);

  const duplicateTemplate = useCallback(async (id: string, newName: string): Promise<string> => {
    const docRef = doc(firestore, 'templates', id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      throw new Error('Template not found');
    }

    const original = snapshot.data() as Template;
    const now = Timestamp.now();

    const duplicateData: Partial<Template> = {
      ...original,
      name: newName,
      nameHe: newName,
      status: 'draft',
      version: 1,
      isSystemTemplate: false,
      
      createdAt: now as any,
      updatedAt: now as any,
    };

    delete (duplicateData as any).id;

    const newDocRef = await addDoc(collection(firestore, 'templates'), duplicateData);

    await logAction({
      action: 'created',
      entityType: 'template',
      entityId: newDocRef.id,
      entityName: newName,
      details: { duplicatedFrom: id },
      tenantId,
    }, null);

    return newDocRef.id;
  }, [tenantId]);

  const publishTemplate = useCallback(async (id: string): Promise<void> => {
    await updateTemplate(id, { status: 'published' });
    
    await logAction({
      action: 'status_changed',
      entityType: 'template',
      entityId: id,
      details: { previousValue: 'draft', newValue: 'published' },
      tenantId,
    }, null);
  }, [updateTemplate, tenantId]);

  const archiveTemplate = useCallback(async (id: string): Promise<void> => {
    await updateTemplate(id, { status: 'archived' });

    await logAction({
      action: 'status_changed',
      entityType: 'template',
      entityId: id,
      details: { previousValue: 'published', newValue: 'archived' },
      tenantId,
    }, null);
  }, [updateTemplate, tenantId]);

  const createVersion = useCallback(async (id: string, notes?: string): Promise<string> => {
    const docRef = doc(firestore, 'templates', id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      throw new Error('Template not found');
    }

    const template = { id: snapshot.id, ...snapshot.data() } as Template;

    const versionData: Omit<TemplateVersion, 'id'> = {
      templateId: id,
      version: template.version,
      snapshot: {
        ...template,
        
      } as any,
      createdAt: Timestamp.now() as any,
      createdBy: template.lastEditedBy,
      notes,
    };

    const versionRef = await addDoc(
      collection(firestore, 'templates', id, 'versions'),
      versionData
    );

    await updateDoc(docRef, {
      version: template.version + 1,
      previousVersionId: versionRef.id,
      updatedAt: Timestamp.now(),
    });

    return versionRef.id;
  }, []);

  const getVersions = useCallback(async (id: string): Promise<TemplateVersion[]> => {
    const versionsRef = collection(firestore, 'templates', id, 'versions');
    const q = query(versionsRef, orderBy('version', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
    })) as TemplateVersion[];
  }, []);

  const restoreVersion = useCallback(async (templateId: string, versionId: string): Promise<void> => {
    const versionRef = doc(firestore, 'templates', templateId, 'versions', versionId);
    const versionSnapshot = await getDoc(versionRef);

    if (!versionSnapshot.exists()) {
      throw new Error('Version not found');
    }

    const version = versionSnapshot.data() as TemplateVersion;

    await createVersion(templateId, 'Auto-saved before restore');

    const templateRef = doc(firestore, 'templates', templateId);
    await updateDoc(templateRef, {
      ...version.snapshot,
      updatedAt: Timestamp.now(),
      status: 'draft',
    });

    await logAction({
      action: 'updated',
      entityType: 'template',
      entityId: templateId,
      details: { restoredFromVersion: version.version },
      tenantId,
    }, null);
  }, [createVersion, tenantId]);

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    publishTemplate,
    archiveTemplate,
    createVersion,
    getVersions,
    restoreVersion,
  };
}

// ===========================================
// HOOK: useTemplate (Single Template)
// ===========================================

export function useTemplate(templateId: string | undefined): UseTemplateReturn {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setTemplate(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const docRef = doc(firestore, 'templates', templateId);

    const unsub = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setTemplate({ id: snapshot.id, ...snapshot.data() } as Template);
        } else {
          setTemplate(null);
          setError('Template not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching template:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [templateId]);

  const updateTemplate = useCallback(async (data: Partial<Template>): Promise<void> => {
    if (!templateId) throw new Error('Template ID is required');

    const docRef = doc(firestore, 'templates', templateId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }, [templateId]);

  const addSection = useCallback(async (sectionData?: Partial<TemplateSection>): Promise<string> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const newOrder = template.sections.length;
    const newSection: TemplateSection = {
      ...createDefaultSection(newOrder),
      ...sectionData,
    };

    const updatedSections = [...template.sections, newSection];

    await updateTemplate({ sections: updatedSections });

    return newSection.id;
  }, [templateId, template, updateTemplate]);

  const updateSection = useCallback(async (
    sectionId: string,
    data: Partial<TemplateSection>
  ): Promise<void> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const updatedSections = template.sections.map(section =>
      section.id === sectionId ? { ...section, ...data } : section
    );

    await updateTemplate({ sections: updatedSections });
  }, [templateId, template, updateTemplate]);

  const deleteSection = useCallback(async (sectionId: string): Promise<void> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const updatedSections = template.sections
      .filter(section => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index }));

    await updateTemplate({ sections: updatedSections });
  }, [templateId, template, updateTemplate]);

  const reorderSections = useCallback(async (sectionIds: string[]): Promise<void> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const sectionMap = new Map(template.sections.map(s => [s.id, s]));
    const updatedSections = sectionIds
      .map((id, index) => {
        const section = sectionMap.get(id);
        return section ? { ...section, order: index } : null;
      })
      .filter(Boolean) as TemplateSection[];

    await updateTemplate({ sections: updatedSections });
  }, [templateId, template, updateTemplate]);

  const addField = useCallback(async (
    sectionId: string,
    type: FieldType,
    fieldData?: Partial<TemplateField>
  ): Promise<string> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const section = template.sections.find(s => s.id === sectionId);
    if (!section) throw new Error('Section not found');

    const newOrder = section.fields.length;
    const newField: TemplateField = {
      ...createDefaultField(type, sectionId, newOrder),
      ...fieldData,
    };

    const updatedSections = template.sections.map(s =>
      s.id === sectionId
        ? { ...s, fields: [...s.fields, newField] }
        : s
    );

    await updateTemplate({ sections: updatedSections });

    return newField.id;
  }, [templateId, template, updateTemplate]);

  const updateField = useCallback(async (
    sectionId: string,
    fieldId: string,
    data: Partial<TemplateField>
  ): Promise<void> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const updatedSections = template.sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            fields: section.fields.map(field =>
              field.id === fieldId ? { ...field, ...data } : field
            ),
          }
        : section
    );

    await updateTemplate({ sections: updatedSections });
  }, [templateId, template, updateTemplate]);

  const deleteField = useCallback(async (
    sectionId: string,
    fieldId: string
  ): Promise<void> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const updatedSections = template.sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            fields: section.fields
              .filter(field => field.id !== fieldId)
              .map((field, index) => ({ ...field, order: index })),
          }
        : section
    );

    await updateTemplate({ sections: updatedSections });
  }, [templateId, template, updateTemplate]);

  const reorderFields = useCallback(async (
    sectionId: string,
    fieldIds: string[]
  ): Promise<void> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const updatedSections = template.sections.map(section => {
      if (section.id !== sectionId) return section;

      const fieldMap = new Map(section.fields.map(f => [f.id, f]));
      const reorderedFields = fieldIds
        .map((id, index) => {
          const field = fieldMap.get(id);
          return field ? { ...field, order: index } : null;
        })
        .filter(Boolean) as TemplateField[];

      return { ...section, fields: reorderedFields };
    });

    await updateTemplate({ sections: updatedSections });
  }, [templateId, template, updateTemplate]);

  const moveFieldToSection = useCallback(async (
    fieldId: string,
    fromSectionId: string,
    toSectionId: string
  ): Promise<void> => {
    if (!templateId || !template) throw new Error('Template not loaded');

    const fromSection = template.sections.find(s => s.id === fromSectionId);
    const toSection = template.sections.find(s => s.id === toSectionId);

    if (!fromSection || !toSection) throw new Error('Section not found');

    const fieldToMove = fromSection.fields.find(f => f.id === fieldId);
    if (!fieldToMove) throw new Error('Field not found');

    const updatedSections = template.sections.map(section => {
      if (section.id === fromSectionId) {
        return {
          ...section,
          fields: section.fields
            .filter(f => f.id !== fieldId)
            .map((f, i) => ({ ...f, order: i })),
        };
      }
      if (section.id === toSectionId) {
        return {
          ...section,
          fields: [
            ...section.fields,
            { ...fieldToMove, sectionId: toSectionId, order: section.fields.length },
          ],
        };
      }
      return section;
    });

    await updateTemplate({ sections: updatedSections });
  }, [templateId, template, updateTemplate]);

  const publish = useCallback(async (): Promise<void> => {
    await updateTemplate({ status: 'published' });

    await logAction({
      action: 'status_changed',
      entityType: 'template',
      entityId: templateId!,
      entityName: template?.nameHe || template?.name,
      details: { previousValue: 'draft', newValue: 'published' },
      tenantId: template?.tenantId,
    }, null);
  }, [updateTemplate, templateId, template]);

  const saveDraft = useCallback(async (): Promise<void> => {
    await updateTemplate({ status: 'draft' });
  }, [updateTemplate]);

  return {
    template,
    loading,
    error,
    updateTemplate,
    addSection,
    updateSection,
    deleteSection,
    reorderSections,
    addField,
    updateField,
    deleteField,
    reorderFields,
    moveFieldToSection,
    publish,
    saveDraft,
  };
}

// ===========================================
// HOOK: useSystemTemplates (Library)
// ===========================================

export function useSystemTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(firestore, 'templates'),
      where('isSystemTemplate', '==', true),
      where('status', '==', 'published')
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        })) as Template[];
        setTemplates(data);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching system templates:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const copyToTenant = useCallback(async (
    templateId: string,
    tenantId: string,
    customName?: string
  ): Promise<string> => {
    const docRef = doc(firestore, 'templates', templateId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error('Template not found');
    }

    const original = snapshot.data() as Template;
    const now = Timestamp.now();

    const newTemplate: Partial<Template> = {
      ...original,
      tenantId,
      name: customName || original.name,
      nameHe: customName || original.nameHe,
      isSystemTemplate: false,
      status: 'draft',
      version: 1,
      
      createdAt: now as any,
      updatedAt: now as any,
    };

    delete (newTemplate as any).id;
    delete (newTemplate as any).stats;

    const newDocRef = await addDoc(collection(firestore, 'templates'), newTemplate);

    await logAction({
      action: 'created',
      entityType: 'template',
      entityId: newDocRef.id,
      entityName: newTemplate.nameHe || newTemplate.name,
      details: { copiedFromLibrary: templateId },
      tenantId,
    }, null);

    return newDocRef.id;
  }, []);

  return {
    templates,
    loading,
    error,
    copyToTenant,
  };
}