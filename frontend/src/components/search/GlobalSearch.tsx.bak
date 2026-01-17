import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Box, Building2, MapPin, FileText, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { useAuth } from '../../providers/AuthProvider';

interface SearchResult {
  id: string;
  type: 'equipment' | 'client' | 'site' | 'document';
  title: string;
  subtitle: string;
  url: string;
}

interface GroupedResults {
  equipment: SearchResult[];
  clients: SearchResult[];
  sites: SearchResult[];
  documents: SearchResult[];
}

const RECENT_SEARCHES_KEY = 'safem_recent_searches';
const MAX_RECENT = 5;

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GroupedResults>({
    equipment: [],
    clients: [],
    sites: [],
    documents: [],
  });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search function
  const performSearch = useCallback(async (term: string) => {
    if (!term.trim() || term.length < 2) {
      setResults({ equipment: [], clients: [], sites: [], documents: [] });
      return;
    }

    setLoading(true);
    const termLower = term.toLowerCase();

    try {
      const newResults: GroupedResults = {
        equipment: [],
        clients: [],
        sites: [],
        documents: [],
      };

      // Search Equipment
      const equipmentSnap = await getDocs(
        query(collection(firestore, 'equipment'), limit(50))
      );
      equipmentSnap.docs.forEach(doc => {
        const data = doc.data();
        const searchFields = [
          data.name,
          data.serialNumber,
          data.manufacturer,
          data.model,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (searchFields.includes(termLower)) {
          newResults.equipment.push({
            id: doc.id,
            type: 'equipment',
            title: data.name,
            subtitle: `${data.manufacturer || ''} ${data.model || ''} | ${data.serialNumber || ''}`.trim(),
            url: `/admin/equipment/${doc.id}`,
          });
        }
      });

      // Search Clients
      const clientsSnap = await getDocs(
        query(collection(firestore, 'clients'), limit(50))
      );
      clientsSnap.docs.forEach(doc => {
        const data = doc.data();
        const searchFields = [
          data.name,
          data.contactName,
          data.email,
          data.phone,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (searchFields.includes(termLower)) {
          newResults.clients.push({
            id: doc.id,
            type: 'client',
            title: data.name,
            subtitle: data.contactName || data.email || '',
            url: `/admin/clients/${doc.id}`,
          });
        }
      });

      // Search Sites/Facilities
      const sitesSnap = await getDocs(
        query(collection(firestore, 'facilities'), limit(50))
      );
      sitesSnap.docs.forEach(doc => {
        const data = doc.data();
        const searchFields = [
          data.name,
          data.address,
          data.city,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (searchFields.includes(termLower)) {
          newResults.sites.push({
            id: doc.id,
            type: 'site',
            title: data.name,
            subtitle: data.address || data.city || '',
            url: `/admin/facilities/${doc.id}`,
          });
        }
      });

      setResults(newResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  // Get all results as flat array
  const allResults = [
    ...results.equipment,
    ...results.clients,
    ...results.sites,
    ...results.documents,
  ];

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleResultClick(allResults[selectedIndex]);
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    // Save to recent
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

    // Navigate
    navigate(result.url);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Icon by type
  const getIcon = (type: string) => {
    switch (type) {
      case 'equipment': return <Box size={16} className="text-emerald-400" />;
      case 'client': return <Building2 size={16} className="text-blue-400" />;
      case 'site': return <MapPin size={16} className="text-amber-400" />;
      case 'document': return <FileText size={16} className="text-purple-400" />;
      default: return null;
    }
  };

  const totalResults = allResults.length;

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        <Search size={18} />
        <span className="hidden md:inline">חיפוש...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 rounded text-xs text-slate-500">
          Ctrl+K
        </kbd>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Panel */}
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-slate-700">
              <Search size={20} className="text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="חפש ציוד, לקוחות, אתרים..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
                dir="rtl"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white text-sm"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2" dir="rtl">
              {loading ? (
                <div className="p-8 text-center text-slate-400">
                  <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2" />
                  מחפש...
                </div>
              ) : searchTerm.length < 2 ? (
                // Recent searches
                recentSearches.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                      <Clock size={12} />
                      חיפושים אחרונים
                    </div>
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchTerm(term)}
                        className="w-full text-right px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )
              ) : totalResults === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  לא נמצאו תוצאות עבור "{searchTerm}"
                </div>
              ) : (
                <>
                  {/* Equipment Results */}
                  {results.equipment.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-slate-500 px-3 py-1 flex items-center gap-2">
                        <Box size={12} />
                        ציוד ({results.equipment.length})
                      </div>
                      {results.equipment.slice(0, 5).map((result, i) => (
                        <ResultItem
                          key={result.id}
                          result={result}
                          icon={getIcon(result.type)}
                          isSelected={allResults.indexOf(result) === selectedIndex}
                          onClick={() => handleResultClick(result)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Clients Results */}
                  {results.clients.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-slate-500 px-3 py-1 flex items-center gap-2">
                        <Building2 size={12} />
                        לקוחות ({results.clients.length})
                      </div>
                      {results.clients.slice(0, 5).map((result, i) => (
                        <ResultItem
                          key={result.id}
                          result={result}
                          icon={getIcon(result.type)}
                          isSelected={allResults.indexOf(result) === selectedIndex}
                          onClick={() => handleResultClick(result)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Sites Results */}
                  {results.sites.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-slate-500 px-3 py-1 flex items-center gap-2">
                        <MapPin size={12} />
                        אתרים ({results.sites.length})
                      </div>
                      {results.sites.slice(0, 5).map((result, i) => (
                        <ResultItem
                          key={result.id}
                          result={result}
                          icon={getIcon(result.type)}
                          isSelected={allResults.indexOf(result) === selectedIndex}
                          onClick={() => handleResultClick(result)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {totalResults > 0 && (
              <div className="p-3 border-t border-slate-700 text-xs text-slate-500 flex justify-between">
                <span>{totalResults} תוצאות</span>
                <span>↑↓ לניווט • Enter לבחירה</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Result Item Component
function ResultItem({
  result,
  icon,
  isSelected,
  onClick,
}: {
  result: SearchResult;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isSelected ? 'bg-emerald-600/20 text-emerald-400' : 'hover:bg-slate-800 text-white'
      }`}
    >
      {icon}
      <div className="flex-1 text-right">
        <div className="font-medium">{result.title}</div>
        {result.subtitle && (
          <div className="text-xs text-slate-400">{result.subtitle}</div>
        )}
      </div>
      <ArrowRight size={14} className="text-slate-500" />
    </button>
  );
}
