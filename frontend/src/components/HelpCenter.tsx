import React, { useState } from 'react';
import { X, Book, ChevronLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SYSTEM_DOCS, DocArticle } from '../data/docs';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  const [selectedDoc, setSelectedDoc] = useState<DocArticle | null>(null);
  const [search, setSearch] = useState('');

  const filteredDocs = SYSTEM_DOCS.filter(doc => 
    doc.title.includes(search) || doc.content.includes(search)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />
          
          {/* Slide Over Panel */}
          <motion.div 
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-r border-slate-700 z-[70] shadow-2xl flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Book className="text-indigo-400" /> מרכז עזרה
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {selectedDoc ? (
                // Article View
                <div className="flex-1 overflow-y-auto p-6 animate-in slide-in-from-right-4">
                  <button 
                    onClick={() => setSelectedDoc(null)}
                    className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300 mb-4"
                  >
                    <ChevronLeft size={16} /> חזרה לרשימה
                  </button>
                  <h3 className="text-2xl font-bold text-white mb-4">{selectedDoc.title}</h3>
                  <div 
                    className="prose prose-invert prose-sm max-w-none text-slate-300"
                    dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
                  />
                </div>
              ) : (
                // List View
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="relative mb-6">
                    <Search className="absolute right-3 top-2.5 text-slate-500" size={18} />
                    <input 
                      type="text"
                      placeholder="חפש במדריך..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {filteredDocs.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="w-full text-right p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all group"
                      >
                        <h4 className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                          {doc.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                            {doc.category === 'general' ? 'כללי' : 
                             doc.category === 'equipment' ? 'ציוד' : 'ניהול'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
