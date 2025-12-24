import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
}

// --- פונקציית עזר חכמה לחיתוך שוליים ריקים (Memory Efficient) ---
// פונקציה זו מחליפה את getTrimmedCanvas השבורה של הספרייה
function trimCanvas(c: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = c.getContext('2d');
  if (!ctx) return c;

  const pixels = ctx.getImageData(0, 0, c.width, c.height);
  const l = pixels.data.length;
  const bound = { top: -1, left: -1, right: -1, bottom: -1 };
  let i, x, y;

  // סריקה למציאת הגבולות של החתימה
  for (i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % c.width;
      y = ~~((i / 4) / c.width);

      if (bound.top === -1) {
        bound.top = y;
      }
      if (bound.left === -1) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }
      if (bound.right === -1) {
        bound.right = x;
      } else if (x > bound.right) {
        bound.right = x;
      }
      if (bound.bottom === -1) {
        bound.bottom = y;
      } else if (y > bound.bottom) {
        bound.bottom = y;
      }
    }
  }

  // אם הקנבס ריק לגמרי
  if (bound.top === -1) return c;

  // חישוב הגודל החדש
  const trimHeight = bound.bottom - bound.top + 1;
  const trimWidth = bound.right - bound.left + 1;
  
  // יצירת קנבס זמני קטן ומדויק
  const trimmed = document.createElement('canvas');
  trimmed.width = trimWidth;
  trimmed.height = trimHeight;
  const copy = trimmed.getContext('2d');

  if (copy) {
    copy.drawImage(c, bound.left, bound.top, trimWidth, trimHeight, 0, 0, trimWidth, trimHeight);
    return trimmed;
  }
  
  return c;
}

export default function SignatureModal({ isOpen, onClose, onSave }: Props) {
  const sigPad = useRef<SignatureCanvas>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (sigPad.current) {
      // 1. השגת הקנבס המקורי (עם השוליים הריקים)
      const originalCanvas = sigPad.current.getCanvas();
      
      // 2. שליחה לפונקציית החיתוך החכמה שלנו
      const trimmedCanvas = trimCanvas(originalCanvas);
      
      // 3. המרה לתמונה (Base64) קלה וחסכונית
      const data = trimmedCanvas.toDataURL('image/png');
      
      onSave(data);
    }
  };

  const clear = () => {
    sigPad.current?.clear();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        {/* כותרת */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">חתימת המפקח</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* משטח הציור */}
        <div className="p-6 bg-white flex flex-col items-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-crosshair">
            <SignatureCanvas 
              ref={sigPad}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 200,
                className: 'signature-canvas'
              }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">צייר את חתימתך בתוך המסגרת</p>
        </div>

        {/* כפתורים */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <button 
            onClick={clear}
            className="text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2"
          >
            נקה חתימה
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-white"
            >
              ביטול
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm font-bold"
            >
              אשר וחתום
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
