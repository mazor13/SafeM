// ===========================================
// AEGIS - AuditLogTab Component
// היסטוריית פעולות ללקוח
// ===========================================

import React, { useState, useEffect } from 'react';
import { 
  History, Search, Filter, ChevronDown, RefreshCw,
  User, FileText, AlertTriangle, CheckCircle, XCircle,
  Edit, Trash2, Eye, Upload, Download, Mail, MessageCircle
} from 'lucide-react';
import { useAuditLog, AUDIT_ACTION_LABELS, ENTITY_TYPE_LABELS, formatAuditTimestamp } from '../../hooks/useAuditLog';
import { AuditLog, AuditAction, AuditEntityType } from '../../types/safety';

// ===========================================
// TYPES
// ===========================================

interface AuditLogTabProps {
  clientId: string;
  clientName: string;
}

// ===========================================
// ACTION ICONS & COLORS
// ===========================================

const ACTION_ICONS: Partial<Record<AuditAction, React.ReactNode>> = {
  created: <FileText size={14} />,
  updated: <Edit size={14} />,
  deleted: <Trash2 size={14} />,
  viewed: <Eye size={14} />,
  status_changed: <RefreshCw size={14} />,
  approved: <CheckCircle size={14} />,
  rejected: <XCircle size={14} />,
  escalated: <AlertTriangle size={14} />,
  file_uploaded: <Upload size={14} />,
  file_downloaded: <Download size={14} />,
  email_sent: <Mail size={14} />,
  whatsapp_sent: <MessageCircle size={14} />,
};

const ACTION_COLORS: Partial<Record<AuditAction, string>> = {
  created: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  updated: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  deleted: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  viewed: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  status_changed: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  approved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  rejected: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  escalated: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  file_uploaded: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  email_sent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

const ENTITY_ICONS: Partial<Record<AuditEntityType, string>> = {
  tenant: '🏢',
  contact: '👤',
  user: '👥',
  lead: '🎯',
  safety_file: '📁',
  inspection: '🔍',
  finding: '⚠️',
  template: '📋',
  invoice: '💳',
  training: '🎓',
  document: '📄',
};

// ===========================================
// MAIN COMPONENT
// ===========================================

export default function AuditLogTab({ clientId, clientName }: AuditLogTabProps) {
  const [filterAction, setFilterAction] = useState<AuditAction | ''>('');
  const [filterEntity, setFilterEntity] = useState<AuditEntityType | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { logs, loading, error, hasMore, loadMore } = useAuditLog({
    tenantId: clientId,
    action: filterAction || undefined,
    entityType: filterEntity || undefined,
    pageSize: 20,
  });

  // Filter logs by search term
  const filteredLogs = logs.filter(log => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      log.entityName?.toLowerCase().includes(search) ||
      log.userName?.toLowerCase().includes(search) ||
      AUDIT_ACTION_LABELS[log.action]?.includes(search) ||
      ENTITY_TYPE_LABELS[log.entityType]?.includes(search)
    );
  });

  // Clear filters
  const clearFilters = () => {
    setFilterAction('');
    setFilterEntity('');
    setSearchTerm('');
  };

  const hasActiveFilters = filterAction || filterEntity || searchTerm;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <History className="text-indigo-400" size={20} />
            היסטוריית פעולות
          </h3>
          <p className="text-xs text-slate-500">כל הפעולות שבוצעו עבור {clientName}</p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="חיפוש..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 bg-slate-800 text-sm py-2 pr-10 pl-4 rounded-xl border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400'
                : 'bg-slate-800 border-white/10 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-slate-900/40 p-4 rounded-2xl border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-300">סינון</h4>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                נקה סינון
              </button>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Action Filter */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">סוג פעולה</label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value as AuditAction | '')}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">הכל</option>
                {Object.entries(AUDIT_ACTION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Entity Filter */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">סוג ישות</label>
              <select
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value as AuditEntityType | '')}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">הכל</option>
                {Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && logs.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-500 italic">טוען היסטוריה...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-400">
          שגיאה בטעינת היסטוריה: {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredLogs.length === 0 && (
        <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-2xl border border-dashed border-white/5">
          <History size={40} className="mx-auto mb-4 opacity-50" />
          <p>{hasActiveFilters ? 'לא נמצאו תוצאות לסינון זה' : 'אין היסטוריית פעולות'}</p>
        </div>
      )}

      {/* Logs List */}
      {filteredLogs.length > 0 && (
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <LogItem key={log.id} log={log} />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && filteredLogs.length > 0 && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-6 py-2 rounded-xl text-sm font-bold text-indigo-400 hover:bg-indigo-500/10 transition-colors"
          >
            טען עוד...
          </button>
        </div>
      )}

      {/* Loading More */}
      {loading && logs.length > 0 && (
        <div className="text-center py-4 text-slate-500 text-sm">
          טוען...
        </div>
      )}
    </div>
  );
}

// ===========================================
// LOG ITEM COMPONENT
// ===========================================

interface LogItemProps {
  log: AuditLog;
}

function LogItem({ log }: LogItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  const actionColor = ACTION_COLORS[log.action] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  const actionIcon = ACTION_ICONS[log.action] || <FileText size={14} />;
  const entityIcon = ENTITY_ICONS[log.entityType] || '📄';
  
  const actionLabel = AUDIT_ACTION_LABELS[log.action] || log.action;
  const entityLabel = ENTITY_TYPE_LABELS[log.entityType] || log.entityType;

  const hasDetails = log.details && (log.details.changes || log.details.previousValue || log.details.notes);

  return (
    <div className="bg-slate-900/60 border border-white/5 rounded-xl hover:border-indigo-500/20 transition-all">
      <div 
        className={`flex items-center justify-between p-4 ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          {/* Action Badge */}
          <div className={`p-2 rounded-lg border ${actionColor}`}>
            {actionIcon}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{entityIcon}</span>
              <span className="font-bold text-slate-200">{log.entityName || entityLabel}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${actionColor}`}>
                {actionLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <User size={12} />
              <span>{log.userName}</span>
              <span>•</span>
              <span>{formatAuditTimestamp(log.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Expand Button */}
        {hasDetails && (
          <ChevronDown 
            size={18} 
            className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} 
          />
        )}
      </div>

      {/* Expanded Details */}
      {expanded && hasDetails && (
        <div className="px-4 pb-4 pt-0">
          <div className="bg-slate-800/50 rounded-lg p-3 text-sm space-y-2">
            {/* Notes */}
            {log.details?.notes && (
              <div className="text-slate-300">{log.details.notes}</div>
            )}

            {/* Status Change */}
            {log.details?.previousValue && log.details?.newValue && (
              <div className="flex items-center gap-2 text-slate-400">
                <span className="px-2 py-1 rounded bg-slate-700">{log.details.previousValue}</span>
                <span>→</span>
                <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400">{log.details.newValue}</span>
              </div>
            )}

            {/* Changes */}
            {log.details?.changes && (
              <div className="space-y-1">
                {Object.entries(log.details.changes).map(([field, change]: [string, any]) => (
                  <div key={field} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-mono">{field}:</span>
                    <span className="text-slate-400">{String(change.from || '(ריק)')}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-indigo-400">{String(change.to || '(ריק)')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}