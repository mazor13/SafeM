// ===========================================
// AEGIS - Template Designer V2.1
// Phase 2: עורך תבניות עם Drag & Drop מלא
// תיקונים: Sticky panels, Logo upload
// ===========================================

import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowRight,
  Save,
  Eye,
  Settings,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Edit3,
  X,
  Check,
  AlertTriangle,
  Image,
  Upload,
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { useTemplate, useCategories } from '../../../hooks/useTemplates';
import {
  Template,
  TemplateSection,
  TemplateField,
  FieldType,
  FIELD_TYPES,
  TEMPLATE_TYPES,
} from '../../../types/template-types';

// ===========================================
// FIELD TYPE ICONS
// ===========================================

const FIELD_ICONS: Record<FieldType, string> = {
  text: '📝',
  textarea: '📄',
  number: '🔢',
  email: '📧',
  phone: '📱',
  date: '📅',
  time: '🕐',
  datetime: '📆',
  select: '📋',
  multiselect: '☑️',
  radio: '🔘',
  checkbox: '✅',
  checkboxGroup: '☑️',
  toggle: '🔄',
  image: '🖼️',
  file: '📎',
  signature: '✍️',
  table: '📊',
  rating: '⭐',
  location: '📍',
  header: '🏷️',
  paragraph: '📰',
  divider: '➖',
  calculated: '🧮',
};

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function TemplateDesigner() {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const {
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
  } = useTemplate(templateId);

  const { categories, addCategory } = useCategories();

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showFieldPalette, setShowFieldPalette] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'field' | 'section' | 'palette' | null>(null);
  const [draggedFieldType, setDraggedFieldType] = useState<FieldType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const startEditingName = () => {
    setTempName(template?.nameHe || template?.name || '');
    setEditingName(true);
  };

  const saveName = async () => {
    if (tempName.trim()) {
      await updateTemplate({ nameHe: tempName.trim(), name: tempName.trim() });
    }
    setEditingName(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTemplate({ status: 'draft' });
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!template?.nameHe && !template?.name) {
      alert('יש להזין שם לתבנית לפני פרסום');
      return;
    }
    try {
      await updateTemplate({ status: 'published' });
      navigate('/admin/templates');
    } catch (err) {
      console.error('Error publishing:', err);
      alert('שגיאה בפרסום התבנית');
    }
  };

  const handleAddSection = async () => {
    const id = await addSection({ title: 'סקשן חדש', titleHe: 'סקשן חדש' });
    setSelectedSection(id);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    if (active.data.current?.type === 'palette') {
      setActiveType('palette');
      setDraggedFieldType(active.data.current.fieldType);
    } else if (active.data.current?.type === 'field') {
      setActiveType('field');
    } else if (active.data.current?.type === 'section') {
      setActiveType('section');
    }
  };

  const handleDragOver = (_event: DragOverEvent) => {};

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveType(null);
      setDraggedFieldType(null);
      return;
    }

    if (activeType === 'palette' && draggedFieldType) {
      const targetSectionId = over.data.current?.sectionId || over.id;
      if (targetSectionId && template?.sections.find(s => s.id === targetSectionId)) {
        const fieldInfo = FIELD_TYPES.find(f => f.value === draggedFieldType);
        await addField(targetSectionId as string, draggedFieldType, {
          label: fieldInfo?.labelHe || '',
          labelHe: fieldInfo?.labelHe || '',
        });
      }
    } else if (activeType === 'field') {
      const activeData = active.data.current;
      const overData = over.data.current;
      
      if (activeData?.sectionId === overData?.sectionId) {
        const sectionId = activeData?.sectionId;
        const section = template?.sections.find(s => s.id === sectionId);
        if (section) {
          const oldIndex = section.fields.findIndex(f => f.id === active.id);
          const newIndex = section.fields.findIndex(f => f.id === over.id);
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const newFieldIds = arrayMove(section.fields.map(f => f.id), oldIndex, newIndex);
            await reorderFields(sectionId, newFieldIds);
          }
        }
      } else if (overData?.sectionId) {
        await moveFieldToSection(active.id as string, activeData?.sectionId, overData?.sectionId);
      }
    } else if (activeType === 'section' && template) {
      const oldIndex = template.sections.findIndex(s => s.id === active.id);
      const newIndex = template.sections.findIndex(s => s.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newSectionIds = arrayMove(template.sections.map(s => s.id), oldIndex, newIndex);
        await reorderSections(newSectionIds);
      }
    }

    setActiveId(null);
    setActiveType(null);
    setDraggedFieldType(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500">טוען תבנית...</div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 text-rose-400" size={48} />
          <h2 className="text-xl font-bold text-rose-400 mb-2">שגיאה בטעינת התבנית</h2>
          <p className="text-slate-500 mb-4">{error || 'התבנית לא נמצאה'}</p>
          <button onClick={() => navigate('/admin/templates')} className="px-4 py-2 bg-slate-800 rounded-xl hover:bg-slate-700">
            חזרה לרשימה
          </button>
        </div>
      </div>
    );
  }

  const typeInfo = TEMPLATE_TYPES.find(t => t.value === template.type);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      {/* CRITICAL: h-screen + overflow-hidden on root to enable independent scrolling */}
      <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
        {/* Top Bar - Fixed height */}
        <div className="bg-slate-900 border-b border-white/5 px-4 py-3 flex-shrink-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin/templates')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                <ArrowRight size={20} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{typeInfo?.icon}</span>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-slate-800 border border-indigo-500 rounded-lg px-3 py-1 text-lg font-bold focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                    />
                    <button onClick={saveName} className="p-1 text-emerald-400 hover:bg-slate-800 rounded"><Check size={18} /></button>
                    <button onClick={() => setEditingName(false)} className="p-1 text-slate-400 hover:bg-slate-800 rounded"><X size={18} /></button>
                  </div>
                ) : (
                  <button onClick={startEditingName} className="flex items-center gap-2 hover:bg-slate-800 px-2 py-1 rounded-lg group">
                    <span className="text-lg font-bold">{template.nameHe || template.name || 'תבנית ללא שם'}</span>
                    <Edit3 size={14} className="text-slate-500 group-hover:text-slate-300" />
                  </button>
                )}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${template.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {template.status === 'published' ? 'פעיל' : 'טיוטה'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(`/admin/templates/${templateId}/preview`)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-slate-800 text-slate-400">
                <Eye size={18} /> תצוגה מקדימה
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"><Settings size={18} /></button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-slate-800 hover:bg-slate-700 border border-white/10">
                <Save size={18} /> {isSaving ? 'שומר...' : 'שמור'}
              </button>
              <button onClick={handlePublish} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20">
                פרסום
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - flex-1 + min-h-0 enables proper scroll containment */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Field Palette - FIXED with OWN scroll */}
          {showFieldPalette && (
            <div className="w-72 bg-slate-900 border-l border-white/5 flex flex-col min-h-0">
              <div className="p-4 border-b border-white/5 flex-shrink-0">
                <h3 className="font-bold text-sm flex items-center justify-between">
                  שדות זמינים
                  <button onClick={() => setShowFieldPalette(false)} className="p-1 hover:bg-slate-800 rounded text-slate-400"><X size={16} /></button>
                </h3>
              </div>
              {/* CRITICAL: flex-1 + overflow-y-auto for independent scroll */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {['basic', 'choice', 'advanced', 'display'].map(category => {
                  const categoryFields = FIELD_TYPES.filter(f => f.category === category);
                  const categoryLabels: Record<string, string> = { basic: 'שדות בסיסיים', choice: 'שדות בחירה', advanced: 'שדות מתקדמים', display: 'שדות תצוגה' };
                  return (
                    <div key={category}>
                      <h4 className="text-xs text-slate-500 font-bold mb-2">{categoryLabels[category]}</h4>
                      <div className="space-y-1">
                        {categoryFields.map(field => (
                          <DraggablePaletteItem key={field.value} fieldType={field.value} label={field.labelHe} icon={FIELD_ICONS[field.value]} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!showFieldPalette && (
            <button onClick={() => setShowFieldPalette(true)} className="fixed right-4 top-1/2 -translate-y-1/2 bg-slate-800 border border-white/10 rounded-lg px-2 py-4 hover:bg-slate-700 z-10">
              <Plus size={20} />
            </button>
          )}

          {/* Center - Canvas - SCROLLABLE INDEPENDENTLY */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              {template.sections.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/30 rounded-2xl border-2 border-dashed border-white/10">
                  <Plus size={48} className="mx-auto mb-4 text-slate-600" />
                  <h3 className="text-lg font-bold text-slate-400 mb-2">אין סקשנים עדיין</h3>
                  <p className="text-slate-500 text-sm mb-6">הוסף סקשן ראשון או גרור שדה לכאן</p>
                  <button onClick={handleAddSection} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold">הוסף סקשן</button>
                </div>
              ) : (
                <SortableContext items={template.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {template.sections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      isSelected={selectedSection === section.id}
                      onSelect={() => setSelectedSection(section.id)}
                      onUpdate={(data) => updateSection(section.id, data)}
                      onDelete={() => deleteSection(section.id)}
                      onDuplicate={async () => {
                        await addSection({
                          ...section,
                          title: `${section.titleHe || section.title} (העתק)`,
                          titleHe: `${section.titleHe || section.title} (העתק)`,
                          fields: section.fields.map(f => ({ ...f, id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` })),
                        });
                      }}
                      onAddField={(type) => addField(section.id, type)}
                      selectedField={selectedField}
                      onSelectField={setSelectedField}
                      onDeleteField={(fieldId) => deleteField(section.id, fieldId)}
                    />
                  ))}
                </SortableContext>
              )}
              {template.sections.length > 0 && (
                <button onClick={handleAddSection} className="w-full py-4 border-2 border-dashed border-white/10 hover:border-indigo-500/30 rounded-2xl text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2">
                  <Plus size={20} /> הוסף סקשן
                </button>
              )}
            </div>
          </div>

          {/* Right Panel - Field Editor - FIXED with OWN scroll */}
          {selectedField && (
            <FieldEditorPanel template={template} fieldId={selectedField} onClose={() => setSelectedField(null)} onUpdate={async (sectionId, fieldId, data) => { await updateField(sectionId, fieldId, data); }} />
          )}
        </div>

        <DragOverlay>
          {activeId && activeType === 'palette' && draggedFieldType && (
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-600 rounded-lg shadow-xl">
              <span>{FIELD_ICONS[draggedFieldType]}</span>
              <span className="text-sm font-bold">{FIELD_TYPES.find(f => f.value === draggedFieldType)?.labelHe}</span>
            </div>
          )}
          {activeId && activeType === 'field' && (
            <div className="bg-slate-800 rounded-xl p-3 shadow-xl border border-indigo-500"><span className="text-sm">גורר שדה...</span></div>
          )}
        </DragOverlay>
      </div>

      {showSettings && (
        <SettingsModal template={template} categories={categories} onClose={() => setShowSettings(false)} onUpdate={updateTemplate} onAddCategory={addCategory} />
      )}
    </DndContext>
  );
}

// ===========================================
// DRAGGABLE PALETTE ITEM
// ===========================================

function DraggablePaletteItem({ fieldType, label, icon }: { fieldType: FieldType; label: string; icon: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: `palette-${fieldType}`,
    data: { type: 'palette', fieldType },
  });
  const style = { transform: CSS.Transform.toString(transform), opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg cursor-grab active:cursor-grabbing border border-transparent hover:border-indigo-500/30 transition-all">
      <span>{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}

// ===========================================
// SORTABLE SECTION
// ===========================================

function SortableSection({ section, isSelected, onSelect, onUpdate, onDelete, onDuplicate, onAddField, selectedField, onSelectField, onDeleteField }: {
  section: TemplateSection; isSelected: boolean; onSelect: () => void; onUpdate: (data: Partial<TemplateSection>) => void;
  onDelete: () => void; onDuplicate: () => void; onAddField: (type: FieldType) => void;
  selectedField: string | null; onSelectField: (id: string | null) => void; onDeleteField: (fieldId: string) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: section.id,
    data: { type: 'section', sectionId: section.id },
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const startEditingTitle = () => { setTempTitle(section.titleHe || section.title); setEditingTitle(true); };
  const saveTitle = () => { if (tempTitle.trim()) onUpdate({ titleHe: tempTitle.trim(), title: tempTitle.trim() }); setEditingTitle(false); };

  return (
    <div ref={setNodeRef} style={style} className={`bg-slate-900/60 rounded-2xl border transition-all ${isSelected ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-white/5'} ${isOver ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`} onClick={onSelect}>
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300"><GripVertical size={18} /></button>
          <button onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }} className="text-slate-400 hover:text-white">
            {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input type="text" value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="bg-slate-800 border border-indigo-500 rounded px-2 py-1 text-sm font-bold" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') setEditingTitle(false); }} onClick={(e) => e.stopPropagation()} />
              <button onClick={saveTitle} className="text-emerald-400"><Check size={16} /></button>
            </div>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); startEditingTitle(); }} className="font-bold text-slate-200 hover:text-white flex items-center gap-1">
              {section.icon && <span>{section.icon}</span>}
              {section.titleHe || section.title || 'סקשן ללא שם'}
              <Edit3 size={12} className="text-slate-500" />
            </button>
          )}
          <span className="text-xs text-slate-500">({section.fields.length} שדות)</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="שכפול"><Copy size={16} /></button>
          <button onClick={(e) => { e.stopPropagation(); if (confirm('למחוק את הסקשן?')) onDelete(); }} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400" title="מחיקה"><Trash2 size={16} /></button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          <SortableContext items={section.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            {section.fields.length === 0 ? (
              <DroppableArea sectionId={section.id}><div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-white/10 rounded-xl">גרור שדה לכאן</div></DroppableArea>
            ) : (
              <>
                {section.fields.map((field) => (
                  <SortableField key={field.id} field={field} sectionId={section.id} isSelected={selectedField === field.id} onSelect={() => onSelectField(field.id)} onDelete={() => onDeleteField(field.id)} />
                ))}
                <DroppableArea sectionId={section.id}><div className="h-2" /></DroppableArea>
              </>
            )}
          </SortableContext>
          <div className="pt-2 flex flex-wrap gap-1">
            {['text', 'select', 'checkbox', 'textarea', 'date'].map((type) => {
              const fieldInfo = FIELD_TYPES.find(f => f.value === type);
              return (
                <button key={type} onClick={(e) => { e.stopPropagation(); onAddField(type as FieldType); }} className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800/50 hover:bg-slate-800 rounded border border-white/5 hover:border-indigo-500/30 transition-colors">
                  <span>{FIELD_ICONS[type as FieldType]}</span> {fieldInfo?.labelHe}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================
// DROPPABLE AREA
// ===========================================

function DroppableArea({ sectionId, children }: { sectionId: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useSortable({ id: `droppable-${sectionId}`, data: { type: 'droppable', sectionId } });
  return <div ref={setNodeRef} className={`transition-all rounded-xl ${isOver ? 'bg-indigo-500/10 ring-2 ring-indigo-500' : ''}`}>{children}</div>;
}

// ===========================================
// SORTABLE FIELD
// ===========================================

function SortableField({ field, sectionId, isSelected, onSelect, onDelete }: { field: TemplateField; sectionId: string; isSelected: boolean; onSelect: () => void; onDelete: () => void }) {
  const fieldInfo = FIELD_TYPES.find(f => f.value === field.type);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id, data: { type: 'field', sectionId, fieldId: field.id } });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} onClick={(e) => { e.stopPropagation(); onSelect(); }} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-800/30 border-white/5 hover:border-indigo-500/30'}`}>
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300" onClick={(e) => e.stopPropagation()}><GripVertical size={16} /></button>
      <span className="text-lg">{FIELD_ICONS[field.type]}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{field.labelHe || field.label || fieldInfo?.labelHe}</div>
        <div className="text-xs text-slate-500">{fieldInfo?.labelHe}</div>
      </div>
      <div className="flex items-center gap-1">
        {field.validation?.required && <span className="text-rose-400 text-xs">*</span>}
        {field.conditionalLogic?.enabled && <span className="text-amber-400 text-xs" title="יש לוגיקה מותנית">⚡</span>}
        <button onClick={(e) => { e.stopPropagation(); if (confirm('למחוק את השדה?')) onDelete(); }} className="p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-rose-400"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}

// ===========================================
// FIELD EDITOR PANEL
// ===========================================

function FieldEditorPanel({ template, fieldId, onClose, onUpdate }: { template: Template; fieldId: string; onClose: () => void; onUpdate: (sectionId: string, fieldId: string, data: Partial<TemplateField>) => void }) {
  let field: TemplateField | null = null;
  let sectionId: string = '';
  for (const section of template.sections) {
    const found = section.fields.find(f => f.id === fieldId);
    if (found) { field = found; sectionId = section.id; break; }
  }
  if (!field) return null;
  const fieldInfo = FIELD_TYPES.find(f => f.value === field!.type);

  return (
    <div className="w-80 bg-slate-900 border-r border-white/5 flex flex-col min-h-0">
      <div className="p-4 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">{FIELD_ICONS[field.type]}</span>
          <div><h3 className="font-bold text-sm">{fieldInfo?.labelHe}</h3><p className="text-xs text-slate-500">עריכת שדה</p></div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="text-xs text-slate-400 block mb-1">תווית השדה</label>
          <input type="text" value={field.labelHe || field.label || ''} onChange={(e) => onUpdate(sectionId, fieldId, { labelHe: e.target.value, label: e.target.value })} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="הזן תווית..." />
        </div>
        {['text', 'textarea', 'number', 'email', 'phone'].includes(field.type) && (
          <div>
            <label className="text-xs text-slate-400 block mb-1">Placeholder</label>
            <input type="text" value={field.placeholder || ''} onChange={(e) => onUpdate(sectionId, fieldId, { placeholder: e.target.value })} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="טקסט לדוגמה..." />
          </div>
        )}
        <div>
          <label className="text-xs text-slate-400 block mb-1">טקסט עזרה</label>
          <textarea value={field.helpText || ''} onChange={(e) => onUpdate(sectionId, fieldId, { helpText: e.target.value })} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm h-20 resize-none" placeholder="הסבר למילוי..." />
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
          <span className="text-sm">שדה חובה</span>
          <button onClick={() => onUpdate(sectionId, fieldId, { validation: { ...field!.validation, required: !field!.validation?.required } })} className={`w-10 h-6 rounded-full transition-colors relative ${field.validation?.required ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${field.validation?.required ? 'right-1' : 'right-5'}`} />
          </button>
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-2">רוחב השדה</label>
          <div className="grid grid-cols-4 gap-1">
            {(['full', 'half', 'third', 'quarter'] as const).map((width) => {
              const labels = { full: '100%', half: '50%', third: '33%', quarter: '25%' };
              return (
                <button key={width} onClick={() => onUpdate(sectionId, fieldId, { display: { ...field!.display, width } })} className={`py-2 text-xs rounded-lg border transition-colors ${field!.display?.width === width ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-white/10 hover:border-indigo-500/30'}`}>
                  {labels[width]}
                </button>
              );
            })}
          </div>
        </div>
        {['select', 'multiselect', 'radio', 'checkboxGroup'].includes(field.type) && (
          <div>
            <label className="text-xs text-slate-400 block mb-2">אפשרויות</label>
            <div className="space-y-2">
              {(field.options || []).map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <input type="text" value={option.label} onChange={(e) => { const newOptions = [...(field!.options || [])]; newOptions[index] = { ...option, label: e.target.value, value: e.target.value }; onUpdate(sectionId, fieldId, { options: newOptions }); }} className="flex-1 bg-slate-800 border border-white/10 rounded px-2 py-1 text-sm" />
                  <button onClick={() => { const newOptions = (field!.options || []).filter((_, i) => i !== index); onUpdate(sectionId, fieldId, { options: newOptions }); }} className="p-1 text-rose-400 hover:bg-slate-800 rounded"><X size={14} /></button>
                </div>
              ))}
              <button onClick={() => { const newOption = { id: `opt_${Date.now()}`, value: `option_${(field!.options || []).length + 1}`, label: `אפשרות ${(field!.options || []).length + 1}` }; onUpdate(sectionId, fieldId, { options: [...(field!.options || []), newOption] }); }} className="w-full py-2 text-xs text-indigo-400 hover:bg-slate-800 rounded-lg border border-dashed border-white/10">+ הוסף אפשרות</button>
            </div>
          </div>
        )}
        <div>
          <label className="text-xs text-slate-400 block mb-2">התנהגות Prefill</label>
          <select value={field.prefillBehavior} onChange={(e) => onUpdate(sectionId, fieldId, { prefillBehavior: e.target.value as any })} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm">
            <option value="always">העתק תמיד</option>
            <option value="optional">אופציונלי</option>
            <option value="never">לא להעתיק</option>
            <option value="reference">לעיון בלבד</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">איך השדה יתנהג בביקורת הבאה</p>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// SETTINGS MODAL
// ===========================================

function SettingsModal({ template, categories, onClose, onUpdate, onAddCategory }: {
  template: Template;
  categories: Array<{ value: string; label: string; labelHe: string; icon: string }>;
  onClose: () => void;
  onUpdate: (data: Partial<Template>) => void;
  onAddCategory: (category: { value: string; labelHe: string; icon: string }) => Promise<void>;
}) {
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      await onAddCategory({ value: newCategory.toLowerCase().replace(/\s+/g, '_'), labelHe: newCategory.trim(), icon: newCategoryIcon });
      setNewCategory('');
      setShowAddCategory(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('יש לבחור קובץ תמונה'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('גודל הקובץ חייב להיות עד 2MB'); return; }

    setUploadingLogo(true);
    try {
      const storageRef = ref(storage, `templates/${template.id}/logo_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      onUpdate({ settings: { ...template.settings, pdfSettings: { ...template.settings?.pdfSettings, logoUrl: downloadURL, includeLogo: true } } });
    } catch (err) {
      console.error('Error uploading logo:', err);
      alert('שגיאה בהעלאת הלוגו');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold">הגדרות תבנית</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="font-bold mb-4">מידע בסיסי</h3>
            <div className="grid gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">סוג תבנית</label>
                <select value={template.type} onChange={(e) => onUpdate({ type: e.target.value as any })} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2">
                  {TEMPLATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.labelHe}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">קטגוריה</label>
                <div className="flex gap-2">
                  <select value={template.category} onChange={(e) => onUpdate({ category: e.target.value as any })} className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2">
                    {categories.map(c => <option key={c.value} value={c.value}>{c.icon} {c.labelHe}</option>)}
                  </select>
                  <button onClick={() => setShowAddCategory(!showAddCategory)} className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg hover:bg-slate-700"><Plus size={18} /></button>
                </div>
                {showAddCategory && (
                  <div className="mt-2 p-3 bg-slate-800/50 rounded-lg space-y-2">
                    <div className="flex gap-2">
                      <select value={newCategoryIcon} onChange={(e) => setNewCategoryIcon(e.target.value)} className="w-16 bg-slate-800 border border-white/10 rounded px-2 py-1 text-center">
                        {['📁', '🔴', '🔥', '⚡', '🧪', '☢️', '🏗️', '🛡️', '🏭', '🏢', '🏥', '🔧', '⚙️', '🎯'].map(icon => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                      <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="שם הקטגוריה..." className="flex-1 bg-slate-800 border border-white/10 rounded px-2 py-1 text-sm" />
                      <button onClick={handleAddCategory} className="px-3 py-1 bg-indigo-600 rounded text-sm font-bold hover:bg-indigo-500">הוסף</button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">תיאור</label>
                <textarea value={template.descriptionHe || ''} onChange={(e) => onUpdate({ descriptionHe: e.target.value })} className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 h-20" placeholder="תיאור קצר של התבנית..." />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">לוגו</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                {template.settings?.pdfSettings?.logoUrl ? (
                  <img src={template.settings.pdfSettings.logoUrl} alt="Logo" className="h-16 w-auto object-contain bg-white rounded p-1" />
                ) : (
                  <div className="h-16 w-24 bg-slate-700 rounded flex items-center justify-center text-slate-500"><Image size={24} /></div>
                )}
                <div className="flex-1 space-y-2">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploadingLogo} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold disabled:opacity-50">
                    <Upload size={16} /> {uploadingLogo ? 'מעלה...' : 'העלה לוגו'}
                  </button>
                  <div className="text-xs text-slate-500">או הכנס URL:</div>
                  <input type="text" value={template.settings?.pdfSettings?.logoUrl || ''} onChange={(e) => onUpdate({ settings: { ...template.settings, pdfSettings: { ...template.settings?.pdfSettings, logoUrl: e.target.value } } })} placeholder="https://..." className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2 text-sm" />
                </div>
              </div>
              {template.settings?.pdfSettings?.logoUrl && (
                <button onClick={() => onUpdate({ settings: { ...template.settings, pdfSettings: { ...template.settings?.pdfSettings, logoUrl: '', includeLogo: false } } })} className="text-sm text-rose-400 hover:underline">הסר לוגו</button>
              )}
              <div>
                <label className="text-xs text-slate-400 block mb-2">מיקום הלוגו</label>
                <div className="flex gap-2">
                  {(['right', 'center', 'left'] as const).map((pos) => {
                    const labels = { right: 'ימין', center: 'מרכז', left: 'שמאל' };
                    return (
                      <button key={pos} onClick={() => onUpdate({ settings: { ...template.settings, pdfSettings: { ...template.settings?.pdfSettings, logoPosition: pos } } })} className={`flex-1 py-2 text-sm rounded-lg border ${template.settings?.pdfSettings?.logoPosition === pos ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-white/10 hover:border-indigo-500/30'}`}>
                        {labels[pos]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">הגדרות תצוגה</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <span className="text-sm">הצג סרגל התקדמות</span>
                <input type="checkbox" checked={template.settings?.showProgressBar || false} onChange={(e) => onUpdate({ settings: { ...template.settings, showProgressBar: e.target.checked } })} className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <span className="text-sm">הצג מספור סקשנים</span>
                <input type="checkbox" checked={template.settings?.showSectionNumbers || false} onChange={(e) => onUpdate({ settings: { ...template.settings, showSectionNumbers: e.target.checked } })} className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <span className="text-sm">אפשר שמירה כטיוטה</span>
                <input type="checkbox" checked={template.settings?.allowSaveAsDraft || false} onChange={(e) => onUpdate({ settings: { ...template.settings, allowSaveAsDraft: e.target.checked } })} className="w-5 h-5 rounded" />
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">הגדרות Prefill</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <div><span className="text-sm block">אפשר Prefill מביקורת קודמת</span><p className="text-xs text-slate-500">העתק נתונים מהביקורת הקודמת</p></div>
                <input type="checkbox" checked={template.settings?.prefillSettings?.enabled || false} onChange={(e) => onUpdate({ settings: { ...template.settings, prefillSettings: { ...template.settings?.prefillSettings, enabled: e.target.checked } } })} className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <div><span className="text-sm block">הדגש שינויים</span><p className="text-xs text-slate-500">סמן שדות שהשתנו מהביקורת הקודמת</p></div>
                <input type="checkbox" checked={template.settings?.prefillSettings?.highlightChanges || false} onChange={(e) => onUpdate({ settings: { ...template.settings, prefillSettings: { ...template.settings?.prefillSettings, highlightChanges: e.target.checked } } })} className="w-5 h-5 rounded" />
              </label>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-white/5 flex justify-end flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold">סגור</button>
        </div>
      </div>
    </div>
  );
}