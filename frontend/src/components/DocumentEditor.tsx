// ===========================================
// AEGIS - Document Editor (TipTap)
// עורך מסמכים עשיר עם תמיכה מלאה בעברית
// ===========================================

import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignRight,
  AlignCenter,
  AlignLeft,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Type,
  Palette,
  Highlighter,
  ChevronDown,
  Plus,
  Trash2,
  Save,
  FileText,
  Check,
} from 'lucide-react';

// ===========================================
// TYPES
// ===========================================

export interface DocumentEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

// ===========================================
// FONT OPTIONS
// ===========================================

const FONTS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'David', label: 'David' },
  { value: 'Frank Ruhl Libre', label: 'Frank Ruhl' },
  { value: 'Heebo', label: 'Heebo' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Alef', label: 'Alef' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
];

const FONT_SIZES = [
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '28px', label: '28' },
  { value: '32px', label: '32' },
  { value: '36px', label: '36' },
  { value: '48px', label: '48' },
];

const COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc', '#ffffff',
  '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff',
  '#9900ff', '#ff00ff', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3',
  '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc', '#ea9999', '#f9cb9c',
];

const HIGHLIGHT_COLORS = [
  '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff9900', '#ff0000',
  '#ffffff', 'transparent',
];

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function DocumentEditor({
  content = '',
  onChange,
  onSave,
  placeholder = 'התחל לכתוב...',
  editable = true,
  autoSave = true,
  autoSaveInterval = 30000,
}: DocumentEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'right',
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-400 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-slate-600',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-slate-800 border border-slate-600 p-2 text-right font-bold',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-600 p-2 text-right',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-6',
        dir: 'rtl',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // Auto-save
  useEffect(() => {
    if (!autoSave || !editor || !onSave) return;

    const interval = setInterval(() => {
      handleSave();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, editor, onSave, autoSaveInterval]);

  // Save handler
  const handleSave = useCallback(async () => {
    if (!editor || !onSave) return;

    setIsSaving(true);
    try {
      await onSave(editor.getHTML());
      setLastSaved(new Date());
    } catch (err) {
      console.error('Error saving document:', err);
    } finally {
      setIsSaving(false);
    }
  }, [editor, onSave]);

  // Add link
  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('הזן כתובת URL:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  // Add image
  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('הזן כתובת תמונה:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // Upload image
  const uploadImage = useCallback(() => {
    if (!editor) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editor]);

  // Insert table
  const insertTable = useCallback((rows: number, cols: number) => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTableMenu(false);
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-800/50 border-b border-white/10 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 pl-2 border-l border-white/10">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="בטל"
          >
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="בצע שוב"
          >
            <Redo size={16} />
          </ToolbarButton>
        </div>

        {/* Font Family */}
        <div className="relative">
          <button
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-slate-700 text-sm min-w-[100px]"
          >
            <Type size={14} />
            <span className="truncate">
              {editor.getAttributes('textStyle').fontFamily || 'Arial'}
            </span>
            <ChevronDown size={12} />
          </button>
          {showFontMenu && (
            <DropdownMenu onClose={() => setShowFontMenu(false)}>
              {FONTS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => {
                    editor.chain().focus().setFontFamily(font.value).run();
                    setShowFontMenu(false);
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-slate-700 text-sm"
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </button>
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Font Size */}
        <div className="relative">
          <button
            onClick={() => setShowSizeMenu(!showSizeMenu)}
            className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-slate-700 text-sm min-w-[60px]"
          >
            <span>16</span>
            <ChevronDown size={12} />
          </button>
          {showSizeMenu && (
            <DropdownMenu onClose={() => setShowSizeMenu(false)}>
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => {
                    editor.chain().focus().setMark('textStyle', { fontSize: size.value }).run();
                    setShowSizeMenu(false);
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-slate-700 text-sm"
                >
                  {size.label}
                </button>
              ))}
            </DropdownMenu>
          )}
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="כותרת 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="כותרת 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="כותרת 3"
        >
          H3
        </ToolbarButton>

        <div className="w-px h-6 bg-white/10" />

        {/* Basic Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="מודגש"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="נטוי"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="קו תחתון"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="קו חוצה"
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-white/10" />

        {/* Text Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorMenu(!showColorMenu)}
            className="flex items-center gap-1 p-1.5 rounded hover:bg-slate-700"
            title="צבע טקסט"
          >
            <Palette size={16} />
            <div
              className="w-3 h-1 rounded-full"
              style={{ backgroundColor: editor.getAttributes('textStyle').color || '#ffffff' }}
            />
          </button>
          {showColorMenu && (
            <ColorPicker
              colors={COLORS}
              onSelect={(color) => {
                editor.chain().focus().setColor(color).run();
                setShowColorMenu(false);
              }}
              onClose={() => setShowColorMenu(false)}
            />
          )}
        </div>

        {/* Highlight */}
        <div className="relative">
          <button
            onClick={() => setShowHighlightMenu(!showHighlightMenu)}
            className="flex items-center gap-1 p-1.5 rounded hover:bg-slate-700"
            title="הדגשת רקע"
          >
            <Highlighter size={16} />
          </button>
          {showHighlightMenu && (
            <ColorPicker
              colors={HIGHLIGHT_COLORS}
              onSelect={(color) => {
                if (color === 'transparent') {
                  editor.chain().focus().unsetHighlight().run();
                } else {
                  editor.chain().focus().toggleHighlight({ color }).run();
                }
                setShowHighlightMenu(false);
              }}
              onClose={() => setShowHighlightMenu(false)}
            />
          )}
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="יישור לימין"
        >
          <AlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="יישור למרכז"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="יישור לשמאל"
        >
          <AlignLeft size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-white/10" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="רשימה"
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="רשימה ממוספרת"
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="ציטוט"
        >
          <Quote size={16} />
        </ToolbarButton>

        <div className="w-px h-6 bg-white/10" />

        {/* Insert */}
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="קו מפריד">
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="קישור">
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={uploadImage} title="תמונה">
          <ImageIcon size={16} />
        </ToolbarButton>

        {/* Table */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowTableMenu(!showTableMenu)}
            active={editor.isActive('table')}
            title="טבלה"
          >
            <TableIcon size={16} />
          </ToolbarButton>
          {showTableMenu && (
            <TablePicker
              onSelect={insertTable}
              onClose={() => setShowTableMenu(false)}
            />
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Save Status */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {isSaving ? (
            <>
              <div className="w-3 h-3 border border-indigo-500 border-t-transparent rounded-full animate-spin" />
              שומר...
            </>
          ) : lastSaved ? (
            <>
              <Check size={12} className="text-emerald-400" />
              נשמר {lastSaved.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
            </>
          ) : null}
        </div>

        {/* Save Button */}
        {onSave && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            <Save size={14} />
            שמור
          </button>
        )}
      </div>

      {/* Table Controls (when table is selected) */}
      {editor.isActive('table') && (
        <div className="bg-slate-800/30 border-b border-white/10 p-2 flex gap-1 items-center text-xs">
          <span className="text-slate-400 px-2">טבלה:</span>
          <button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="px-2 py-1 rounded hover:bg-slate-700"
          >
            + עמודה
          </button>
          <button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="px-2 py-1 rounded hover:bg-slate-700"
          >
            + שורה
          </button>
          <button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="px-2 py-1 rounded hover:bg-slate-700 text-rose-400"
          >
            מחק עמודה
          </button>
          <button
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="px-2 py-1 rounded hover:bg-slate-700 text-rose-400"
          >
            מחק שורה
          </button>
          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2 py-1 rounded hover:bg-slate-700 text-rose-400"
          >
            מחק טבלה
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-slate-950">
        <EditorContent editor={editor} />
      </div>


      {/* Word Count */}
      <div className="bg-slate-800/30 border-t border-white/10 px-4 py-2 text-xs text-slate-500 flex justify-between">
        <span>
          {editor.storage.characterCount?.words?.() || 0} מילים
          {' • '}
          {editor.storage.characterCount?.characters?.() || editor.getText().length} תווים
        </span>
      </div>
    </div>
  );
}

// ===========================================
// TOOLBAR BUTTON
// ===========================================

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
  small?: boolean;
}

function ToolbarButton({ onClick, active, disabled, title, children, small }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        ${small ? 'p-1' : 'p-1.5'} rounded transition-colors
        ${active ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700 text-slate-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );
}

// ===========================================
// DROPDOWN MENU
// ===========================================

interface DropdownMenuProps {
  children: React.ReactNode;
  onClose: () => void;
}

function DropdownMenu({ children, onClose }: DropdownMenuProps) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.dropdown-menu')) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div className="dropdown-menu absolute top-full right-0 mt-1 bg-slate-800 rounded-lg border border-white/10 shadow-xl z-20 min-w-[150px] max-h-[300px] overflow-y-auto">
      {children}
    </div>
  );
}

// ===========================================
// COLOR PICKER
// ===========================================

interface ColorPickerProps {
  colors: string[];
  onSelect: (color: string) => void;
  onClose: () => void;
}

function ColorPicker({ colors, onSelect, onClose }: ColorPickerProps) {
  useEffect(() => {
    const handleClick = () => onClose();
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div
      className="absolute top-full right-0 mt-1 bg-slate-800 rounded-lg border border-white/10 shadow-xl z-20 p-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-6 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className="w-6 h-6 rounded border border-white/20 hover:scale-110 transition-transform"
            style={{ backgroundColor: color === 'transparent' ? '#ffffff' : color }}
            title={color}
          >
            {color === 'transparent' && (
              <span className="text-red-500 text-xs">✕</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===========================================
// TABLE PICKER
// ===========================================

interface TablePickerProps {
  onSelect: (rows: number, cols: number) => void;
  onClose: () => void;
}

function TablePicker({ onSelect, onClose }: TablePickerProps) {
  const [hoverRows, setHoverRows] = useState(0);
  const [hoverCols, setHoverCols] = useState(0);

  useEffect(() => {
    const handleClick = () => onClose();
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  return (
    <div
      className="absolute top-full right-0 mt-1 bg-slate-800 rounded-lg border border-white/10 shadow-xl z-20 p-3"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-xs text-slate-400 mb-2 text-center">
        {hoverRows > 0 ? `${hoverRows} × ${hoverCols}` : 'בחר גודל טבלה'}
      </div>
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: 36 }).map((_, i) => {
          const row = Math.floor(i / 6) + 1;
          const col = (i % 6) + 1;
          const isHighlighted = row <= hoverRows && col <= hoverCols;

          return (
            <button
              key={i}
              className={`w-5 h-5 border rounded transition-colors ${
                isHighlighted
                  ? 'bg-indigo-500 border-indigo-400'
                  : 'bg-slate-700 border-slate-600 hover:border-slate-500'
              }`}
              onMouseEnter={() => {
                setHoverRows(row);
                setHoverCols(col);
              }}
              onClick={() => onSelect(row, col)}
            />
          );
        })}
      </div>
    </div>
  );
}