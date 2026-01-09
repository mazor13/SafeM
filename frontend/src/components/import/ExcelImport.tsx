import React, { useState, useCallback } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface Column {
  key: string;
  label: string;
  required?: boolean;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
}

interface ExcelImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Record<string, any>[]) => Promise<ImportResult>;
  columns: Column[];
  title?: string;
  templateName?: string;
}

const ExcelImport: React.FC<ExcelImportProps> = ({
  isOpen,
  onClose,
  onImport,
  columns,
  title = 'ייבוא נתונים',
  templateName = 'template'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'done'>('upload');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError('');
    setFile(selectedFile);

    const extension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) {
            setError('הקובץ ריק');
            return;
          }
          setHeaders(results.meta.fields || []);
          setData(results.data as Record<string, any>[]);
          autoMapColumns(results.meta.fields || []);
          setStep('mapping');
        },
        error: () => setError('שגיאה בקריאת הקובץ'),
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const workbook = XLSX.read(event.target?.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
          
          if (jsonData.length < 2) {
            setError('הקובץ ריק או חסרה שורת כותרות');
            return;
          }

          const fileHeaders = jsonData[0].map(String);
          const rows = jsonData.slice(1).map(row => {
            const obj: Record<string, any> = {};
            fileHeaders.forEach((header, index) => {
              obj[header] = row[index] ?? '';
            });
            return obj;
          }).filter(row => Object.values(row).some(v => v !== ''));

          setHeaders(fileHeaders);
          setData(rows);
          autoMapColumns(fileHeaders);
          setStep('mapping');
        } catch {
          setError('שגיאה בקריאת קובץ Excel');
        }
      };
      reader.readAsBinaryString(selectedFile);
    } else {
      setError('פורמט לא נתמך. השתמש ב-CSV או Excel');
    }
  }, []);

  const autoMapColumns = (fileHeaders: string[]) => {
    const newMapping: Record<string, string> = {};
    columns.forEach(col => {
      const match = fileHeaders.find(h => 
        h.toLowerCase() === col.label.toLowerCase() ||
        h.toLowerCase() === col.key.toLowerCase()
      );
      if (match) {
        newMapping[col.key] = match;
      }
    });
    setMapping(newMapping);
  };

  const handleMappingChange = (columnKey: string, fileHeader: string) => {
    setMapping(prev => ({ ...prev, [columnKey]: fileHeader }));
  };

  const getMappedData = (): Record<string, any>[] => {
    return data.map(row => {
      const mapped: Record<string, any> = {};
      columns.forEach(col => {
        const fileHeader = mapping[col.key];
        mapped[col.key] = fileHeader ? row[fileHeader] : '';
      });
      return mapped;
    });
  };

  const validateMapping = (): boolean => {
    const missingRequired = columns
      .filter(col => col.required && !mapping[col.key])
      .map(col => col.label);
    
    if (missingRequired.length > 0) {
      setError(`שדות חובה חסרים: ${missingRequired.join(', ')}`);
      return false;
    }
    return true;
  };

  const handlePreview = () => {
    if (validateMapping()) {
      setError('');
      setStep('preview');
    }
  };

  const handleImport = async () => {
    setStep('importing');
    try {
      const mappedData = getMappedData();
      const importResult = await onImport(mappedData);
      setResult(importResult);
      setStep('done');
    } catch (err) {
      setError('שגיאה בייבוא הנתונים');
      setStep('preview');
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      columns.reduce((acc, col) => ({ ...acc, [col.label]: '' }), {})
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${templateName}.xlsx`);
  };

  const reset = () => {
    setFile(null);
    setData([]);
    setHeaders([]);
    setMapping({});
    setStep('upload');
    setResult(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Step: Upload */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div
                className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">גרור קובץ לכאן או לחץ לבחירה</p>
                <p className="text-slate-400 text-sm">תומך ב-Excel (.xlsx, .xls) ו-CSV</p>
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
              >
                <Download className="w-4 h-4" />
                הורד תבנית לדוגמה
              </button>
            </div>
          )}

          {/* Step: Mapping */}
          {step === 'mapping' && (
            <div className="space-y-4">
              <p className="text-slate-300 mb-4">מפה את העמודות בקובץ לשדות במערכת:</p>
              
              {columns.map(col => (
                <div key={col.key} className="flex items-center gap-4">
                  <label className="w-40 text-slate-300">
                    {col.label}
                    {col.required && <span className="text-red-400 mr-1">*</span>}
                  </label>
                  <select
                    value={mapping[col.key] || ''}
                    onChange={(e) => handleMappingChange(col.key, e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">-- בחר עמודה --</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Step: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <p className="text-slate-300">תצוגה מקדימה ({Math.min(data.length, 5)} מתוך {data.length} שורות):</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      {columns.filter(c => mapping[c.key]).map(col => (
                        <th key={col.key} className="text-right p-2 text-slate-400">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getMappedData().slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b border-slate-700/50">
                        {columns.filter(c => mapping[c.key]).map(col => (
                          <td key={col.key} className="p-2 text-white">{row[col.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step: Importing */}
          {step === 'importing' && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-white">מייבא נתונים...</p>
            </div>
          )}

          {/* Step: Done */}
          {step === 'done' && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <span className="text-emerald-400 font-medium">{result.success} רשומות יובאו בהצלחה</span>
              </div>

              {result.failed > 0 && (
                <div className="p-4 bg-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
                    <AlertCircle className="w-5 h-5" />
                    {result.failed} רשומות נכשלו
                  </div>
                  <ul className="text-sm text-red-300 space-y-1 max-h-32 overflow-auto">
                    {result.errors.slice(0, 10).map((err, i) => (
                      <li key={i}>שורה {err.row}: {err.message}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 rounded-lg text-red-400 mt-4">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={step === 'done' ? () => { reset(); onClose(); } : reset}
            className="px-4 py-2 text-slate-400 hover:text-white"
          >
            {step === 'done' ? 'סגור' : 'התחל מחדש'}
          </button>

          <div className="flex gap-2">
            {step === 'mapping' && (
              <button
                onClick={handlePreview}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium"
              >
                המשך לתצוגה מקדימה
              </button>
            )}
            {step === 'preview' && (
              <>
                <button
                  onClick={() => setStep('mapping')}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  חזור
                </button>
                <button
                  onClick={handleImport}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium"
                >
                  ייבא {data.length} רשומות
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelImport;
