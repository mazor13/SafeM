// ===========================================
// AEGIS - Audit Log List Component
// ===========================================

import React from 'react';
import {
  AuditLog,
  AuditAction,
  AuditEntityType,
} from '../types/safety';
import {
  useAuditLog,
  useEntityHistory,
  AUDIT_ACTION_LABELS,
  ENTITY_TYPE_LABELS,
  formatAuditLogMessage,
  formatAuditTimestamp,
} from '../hooks/useAuditLog';

// ===========================================
// ACTION ICONS
// ===========================================

const ACTION_ICONS: Partial<Record<AuditAction, string>> = {
  created: '➕',
  updated: '✏️',
  deleted: '🗑️',
  viewed: '👁️',
  status_changed: '🔄',
  approved: '✅',
  rejected: '❌',
  submitted: '📤',
  assigned: '👤',
  reassigned: '🔀',
  escalated: '🔺',
  reminder_sent: '⏰',
  login: '🔑',
  logout: '🚪',
  password_changed: '🔐',
  file_uploaded: '📎',
  file_downloaded: '📥',
  file_deleted: '🗑️',
  exported: '📊',
  imported: '📁',
  comment_added: '💬',
  email_sent: '📧',
  sms_sent: '📱',
  whatsapp_sent: '💬',
};

const ACTION_COLORS: Partial<Record<AuditAction, string>> = {
  created: 'bg-green-100 text-green-800',
  updated: 'bg-blue-100 text-blue-800',
  deleted: 'bg-red-100 text-red-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
  escalated: 'bg-orange-100 text-orange-800',
  status_changed: 'bg-purple-100 text-purple-800',
};

// ===========================================
// SINGLE LOG ITEM
// ===========================================

interface AuditLogItemProps {
  log: AuditLog;
  showEntity?: boolean;
}

function AuditLogItem({ log, showEntity = true }: AuditLogItemProps) {
  const icon = ACTION_ICONS[log.action] || '📋';
  const colorClass = ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800';
  const timestamp = log.timestamp instanceof Date 
    ? log.timestamp 
    : new Date(log.timestamp as any);

  return (
    <div className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${colorClass}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Main message */}
        <div className="text-sm">
          <span className="font-medium">{log.userName}</span>
          <span className="text-gray-600"> {AUDIT_ACTION_LABELS[log.action] || log.action}</span>
          {showEntity && (
            <>
              <span className="text-gray-600"> {ENTITY_TYPE_LABELS[log.entityType] || log.entityType}</span>
              {log.entityName && (
                <span className="font-medium"> "{log.entityName}"</span>
              )}
            </>
          )}
        </div>

        {/* Details */}
        {log.details?.notes && (
          <div className="text-sm text-gray-500 mt-1">
            {log.details.notes}
          </div>
        )}

        {/* Changes */}
        {log.details?.changes && Object.keys(log.details.changes).length > 0 && (
          <div className="mt-2 text-xs space-y-1">
            {Object.entries(log.details.changes).slice(0, 3).map(([key, change]) => (
              <div key={key} className="flex gap-2 text-gray-500">
                <span className="font-medium">{key}:</span>
                <span className="line-through text-red-500">{String(change.from || '-')}</span>
                <span>→</span>
                <span className="text-green-600">{String(change.to || '-')}</span>
              </div>
            ))}
            {Object.keys(log.details.changes).length > 3 && (
              <div className="text-gray-400">
                +{Object.keys(log.details.changes).length - 3} שינויים נוספים
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className="text-xs text-gray-400 mt-1">
          {formatAuditTimestamp(timestamp)}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// AUDIT LOG LIST - GLOBAL
// ===========================================

interface AuditLogListProps {
  entityType?: AuditEntityType;
  tenantId?: string;
  userId?: string;
  maxItems?: number;
  showLoadMore?: boolean;
  className?: string;
}

export function AuditLogList({
  entityType,
  tenantId,
  userId,
  maxItems = 50,
  showLoadMore = true,
  className = '',
}: AuditLogListProps) {
  const { logs, loading, error, hasMore, loadMore } = useAuditLog({
    entityType,
    tenantId,
    userId,
    pageSize: maxItems,
  });

  if (loading && logs.length === 0) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="text-gray-500">⏳ טוען היסטוריה...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="text-red-500">❌ שגיאה: {error}</div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="text-gray-500">אין היסטוריה להצגה</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="divide-y">
        {logs.map((log) => (
          <AuditLogItem key={log.id} log={log} />
        ))}
      </div>

      {showLoadMore && hasMore && (
        <div className="text-center py-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {loading ? '⏳ טוען...' : '📜 טען עוד'}
          </button>
        </div>
      )}
    </div>
  );
}

// ===========================================
// ENTITY HISTORY - For specific entity
// ===========================================

interface EntityHistoryProps {
  entityType: AuditEntityType;
  entityId: string;
  title?: string;
  className?: string;
}

export function EntityHistory({
  entityType,
  entityId,
  title = 'היסטוריה',
  className = '',
}: EntityHistoryProps) {
  const { logs, loading, error } = useEntityHistory(entityType, entityId);

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <h4 className="font-medium flex items-center gap-2">
          📜 {title}
          {logs.length > 0 && (
            <span className="text-xs text-gray-500">({logs.length})</span>
          )}
        </h4>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">⏳ טוען...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500 text-sm">❌ {error}</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 text-sm">אין היסטוריה</div>
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <AuditLogItem key={log.id} log={log} showEntity={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================================
// RECENT ACTIVITY - Compact view
// ===========================================

interface RecentActivityProps {
  tenantId?: string;
  limit?: number;
  className?: string;
}

export function RecentActivity({
  tenantId,
  limit = 10,
  className = '',
}: RecentActivityProps) {
  const { logs, loading } = useAuditLog({
    tenantId,
    pageSize: limit,
    realtime: true,
  });

  return (
    <div className={`bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h4 className="font-medium">📊 פעילות אחרונה</h4>
        <a href="/admin/audit-log" className="text-sm text-blue-600 hover:text-blue-800">
          צפה בהכל →
        </a>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">⏳ טוען...</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 text-sm">אין פעילות אחרונה</div>
          </div>
        ) : (
          <div className="divide-y">
            {logs.map((log) => (
              <div key={log.id} className="px-4 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>{ACTION_ICONS[log.action] || '📋'}</span>
                  <span className="font-medium">{log.userName}</span>
                  <span className="text-gray-500">{AUDIT_ACTION_LABELS[log.action]}</span>
                  {log.entityName && (
                    <span className="text-gray-700 truncate">"{log.entityName}"</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mr-6">
                  {formatAuditTimestamp(
                    log.timestamp instanceof Date 
                      ? log.timestamp 
                      : new Date(log.timestamp as any)
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogList;
