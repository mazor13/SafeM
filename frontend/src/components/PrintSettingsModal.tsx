import React, { useState } from 'react';
import { XMarkIcon, PrinterIcon, PhotoIcon, ChatBubbleBottomCenterTextIcon, PencilSquareIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// --- כאן נמצא ה-Export שהיה חסר ---
export interface PrintSettings {
  showPhotos: boolean;
  showNotes: boolean;
  showSignature: boolean;
  showSummary: boolean;
}
// -----------------------------------

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (settings: PrintSettings) => void;
}

export default function PrintSettingsModal({ isOpen, onClose, onPrint }: Props) {
  const [settings, setSettings] = useState<PrintSettings>({
    showPhotos: true,
    showNotes: true,
    showSignature: true,
    showSummary: true
  });

  if (!isOpen) return null;

  const toggle = (key: keyof PrintSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <PrinterIcon className="w-5 h-5 text-indigo-600" />
            הגדרות דוח להדפסה
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500 mb-4">בחר אילו חלקים ברצונך לכלול בדוח הסופי ללקוח:</p>

          <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><PhotoIcon className="w-5 h-5"/></div>
              <span className="font-medium text-gray-700">תמונות ותיעוד</span>
            </div>
            <input type="checkbox" checked={settings.showPhotos} onChange={() => toggle('showPhotos')} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><ChatBubbleBottomCenterTextIcon className="w-5 h-5"/></div>
              <span className="font-medium text-gray-700">הערות לכל סעיף</span>
            </div>
            <input type="checkbox" checked={settings.showNotes} onChange={() => toggle('showNotes')} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><DocumentTextIcon className="w-5 h-5"/></div>
              <span className="font-medium text-gray-700">סיכום מנהלים</span>
            </div>
            <input type="checkbox" checked={settings.showSummary} onChange={() => toggle('showSummary')} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
          </label>

          <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><PencilSquareIcon className="w-5 h-5"/></div>
              <span className="font-medium text-gray-700">חתימת המפקח</span>
            </div>
            <input type="checkbox" checked={settings.showSignature} onChange={() => toggle('showSignature')} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
          </label>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">ביטול</button>
          <button onClick={() => onPrint(settings)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow-sm">
            הפק דוח PDF
          </button>
        </div>
      </div>
    </div>
  );
}
