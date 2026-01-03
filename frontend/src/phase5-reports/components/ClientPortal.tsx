/**
 * AEGIS Client Portal
 * פורטל לקוח - תצוגה ללקוחות
 */

import React, { useState, useMemo } from 'react';
import { SAFETY_DOMAINS } from '../types/safety';

// ============================================
// 📋 Types
// ============================================

export interface ClientPortalData {
  client: {
    id: string;
    name: string;
    logo?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
  };
  
  summary: {
    totalEquipment: number;
    compliantEquipment: number;
    overdueInspections: number;
    openFindings: number;
    criticalFindings: number;
    upcomingInspections: number;
    complianceScore: number;
  };
  
  equipment: ClientEquipment[];
  recentInspections: ClientInspection[];
  findings: ClientFinding[];
  documents: ClientDocument[];
  schedule: ScheduledInspection[];
}

export interface ClientEquipment {
  id: string;
  name: string;
  type: string;
  domain: string;
  location?: string;
  serialNumber?: string;
  status: 'compliant' | 'due_soon' | 'overdue' | 'not_inspected';
  lastInspection?: Date;
  nextInspection?: Date;
  certificateExpiry?: Date;
}

export interface ClientInspection {
  id: string;
  equipmentName: string;
  date: Date;
  result: 'pass' | 'pass_with_conditions' | 'fail';
  inspectorName: string;
  certificateNumber?: string;
  reportUrl?: string;
}

export interface ClientFinding {
  id: string;
  equipmentName: string;
  title: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  status: string;
  dueDate?: Date;
  foundDate: Date;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: 'certificate' | 'report' | 'protocol' | 'manual';
  date: Date;
  url: string;
  equipmentName?: string;
}

export interface ScheduledInspection {
  id: string;
  equipmentName: string;
  equipmentType: string;
  scheduledDate: Date;
  inspectorName?: string;
}

// ============================================
// 🎨 Props
// ============================================

interface ClientPortalProps {
  data: ClientPortalData;
  onViewReport?: (inspection: ClientInspection) => void;
  onDownloadDocument?: (document: ClientDocument) => void;
  onContactSupport?: () => void;
  loading?: boolean;
}

// ============================================
// 📋 Main Component
// ============================================

export const ClientPortal: React.FC<ClientPortalProps> = ({
  data,
  onViewReport,
  onDownloadDocument,
  onContactSupport,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'equipment' | 'inspections' | 'findings' | 'documents' | 'schedule'>('overview');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');

  const formatDate = (date: Date | string) => new Date(date).toLocaleDateString('he-IL');

  const getStatusBadge = (status: ClientEquipment['status']) => {
    const badges = {
      compliant: { text: 'תקין', className: 'status-compliant', icon: '✅' },
      due_soon: { text: 'בדיקה קרובה', className: 'status-due-soon', icon: '📅' },
      overdue: { text: 'באיחור', className: 'status-overdue', icon: '⚠️' },
      not_inspected: { text: 'לא נבדק', className: 'status-not-inspected', icon: '❓' },
    };
    return badges[status] || { text: status, className: '', icon: '' };
  };

  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, { text: string; className: string; icon: string }> = {
      critical: { text: 'קריטי', className: 'severity-critical', icon: '🚨' },
      major: { text: 'משמעותי', className: 'severity-major', icon: '⚠️' },
      minor: { text: 'קל', className: 'severity-minor', icon: '📝' },
      observation: { text: 'הערה', className: 'severity-observation', icon: '💡' },
    };
    return badges[severity] || badges.observation;
  };

  const filteredEquipment = useMemo(() => {
    if (equipmentFilter === 'all') return data.equipment;
    return data.equipment.filter(eq => eq.status === equipmentFilter);
  }, [data.equipment, equipmentFilter]);

  if (loading) {
    return <div className="client-portal loading" dir="rtl"><div className="loading-spinner">טוען...</div></div>;
  }

  return (
    <div className="client-portal" dir="rtl">
      {/* Header */}
      <header className="portal-header">
        <div className="header-logo">
          {data.client.logo ? <img src={data.client.logo} alt={data.client.name} /> : 
            <div className="logo-placeholder">{data.client.name.charAt(0)}</div>}
        </div>
        <div className="header-info">
          <h1>{data.client.name}</h1>
          <p>פורטל ניהול בטיחות</p>
        </div>
        <div className="header-actions">
          {onContactSupport && <button className="support-btn" onClick={onContactSupport}>📞 צור קשר</button>}
        </div>
      </header>

      {/* Compliance Banner */}
      <div className={`compliance-banner ${data.summary.complianceScore >= 80 ? 'good' : data.summary.complianceScore >= 60 ? 'medium' : 'poor'}`}>
        <div className="compliance-score">
          <span className="score-value">{data.summary.complianceScore}%</span>
          <span className="score-label">ציון ציות</span>
        </div>
        <div className="compliance-message">
          {data.summary.complianceScore >= 90 && 'מצוין! הארגון שלך עומד בכל דרישות הבטיחות.'}
          {data.summary.complianceScore >= 70 && data.summary.complianceScore < 90 && 'טוב, אך יש מקום לשיפור.'}
          {data.summary.complianceScore < 70 && 'נדרשת תשומת לב - יש פריטים שדורשים טיפול.'}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card"><div className="stat-icon">📦</div><div className="stat-content"><div className="stat-value">{data.summary.totalEquipment}</div><div className="stat-label">פריטי ציוד</div></div></div>
        <div className="stat-card success"><div className="stat-icon">✅</div><div className="stat-content"><div className="stat-value">{data.summary.compliantEquipment}</div><div className="stat-label">תקינים</div></div></div>
        <div className="stat-card warning"><div className="stat-icon">📅</div><div className="stat-content"><div className="stat-value">{data.summary.upcomingInspections}</div><div className="stat-label">בדיקות קרובות</div></div></div>
        <div className="stat-card danger"><div className="stat-icon">⚠️</div><div className="stat-content"><div className="stat-value">{data.summary.overdueInspections}</div><div className="stat-label">באיחור</div></div></div>
        <div className="stat-card"><div className="stat-icon">📝</div><div className="stat-content"><div className="stat-value">{data.summary.openFindings}</div><div className="stat-label">ממצאים פתוחים</div></div>
          {data.summary.criticalFindings > 0 && <div className="stat-badge danger">{data.summary.criticalFindings} קריטיים</div>}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="portal-tabs">
        {(['overview', 'equipment', 'inspections', 'findings', 'documents', 'schedule'] as const).map(tab => (
          <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
            {tab === 'overview' && 'סקירה כללית'}
            {tab === 'equipment' && `ציוד (${data.equipment.length})`}
            {tab === 'inspections' && `בדיקות (${data.recentInspections.length})`}
            {tab === 'findings' && `ממצאים (${data.findings.length})`}
            {tab === 'documents' && `מסמכים (${data.documents.length})`}
            {tab === 'schedule' && 'לוח זמנים'}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {(data.summary.overdueInspections > 0 || data.summary.criticalFindings > 0) && (
              <div className="alerts-section">
                <h3>🔔 התראות</h3>
                <div className="alerts-list">
                  {data.summary.overdueInspections > 0 && (
                    <div className="alert-item warning">
                      <span className="alert-icon">⏰</span>
                      <span>{data.summary.overdueInspections} בדיקות באיחור</span>
                      <button onClick={() => setActiveTab('equipment')}>צפה →</button>
                    </div>
                  )}
                  {data.summary.criticalFindings > 0 && (
                    <div className="alert-item danger">
                      <span className="alert-icon">🚨</span>
                      <span>{data.summary.criticalFindings} ממצאים קריטיים פתוחים</span>
                      <button onClick={() => setActiveTab('findings')}>צפה →</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="recent-section">
              <h3>פעילות אחרונה</h3>
              <div className="activity-list">
                {data.recentInspections.slice(0, 5).map(insp => (
                  <div key={insp.id} className="activity-item">
                    <div className="activity-icon">{insp.result === 'pass' ? '✅' : insp.result === 'pass_with_conditions' ? '⚠️' : '❌'}</div>
                    <div className="activity-content"><strong>{insp.equipmentName}</strong><span>נבדק ב-{formatDate(insp.date)}</span></div>
                    {onViewReport && insp.reportUrl && <button className="view-btn" onClick={() => onViewReport(insp)}>צפה בדו"ח</button>}
                  </div>
                ))}
              </div>
            </div>
            <div className="upcoming-section">
              <h3>בדיקות קרובות</h3>
              <div className="upcoming-list">
                {data.schedule.slice(0, 5).map(item => (
                  <div key={item.id} className="upcoming-item">
                    <div className="upcoming-date">
                      <span className="day">{new Date(item.scheduledDate).getDate()}</span>
                      <span className="month">{new Date(item.scheduledDate).toLocaleDateString('he-IL', { month: 'short' })}</span>
                    </div>
                    <div className="upcoming-content"><strong>{item.equipmentName}</strong><span>{item.equipmentType}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <div className="equipment-tab">
            <div className="tab-header">
              <h3>רשימת ציוד</h3>
              <div className="filter-buttons">
                {['all', 'compliant', 'due_soon', 'overdue'].map(f => (
                  <button key={f} className={equipmentFilter === f ? 'active' : ''} onClick={() => setEquipmentFilter(f)}>
                    {f === 'all' && `הכל (${data.equipment.length})`}
                    {f === 'compliant' && '✅ תקין'}
                    {f === 'due_soon' && '📅 קרוב'}
                    {f === 'overdue' && '⚠️ באיחור'}
                  </button>
                ))}
              </div>
            </div>
            <div className="equipment-list">
              {filteredEquipment.map(eq => {
                const statusBadge = getStatusBadge(eq.status);
                const domainInfo = SAFETY_DOMAINS[eq.domain as keyof typeof SAFETY_DOMAINS];
                return (
                  <div key={eq.id} className="equipment-card">
                    <div className="equipment-header">
                      <span className="domain-badge" style={{ background: domainInfo?.color }}>{domainInfo?.icon}</span>
                      <span className={`status-badge ${statusBadge.className}`}>{statusBadge.icon} {statusBadge.text}</span>
                    </div>
                    <h4>{eq.name}</h4>
                    <p className="equipment-type">{eq.type}</p>
                    <div className="equipment-details">
                      {eq.location && <span>📍 {eq.location}</span>}
                      {eq.serialNumber && <span dir="ltr">🔢 {eq.serialNumber}</span>}
                    </div>
                    <div className="equipment-dates">
                      {eq.lastInspection && <div className="date-item"><span className="date-label">בדיקה אחרונה:</span><span className="date-value">{formatDate(eq.lastInspection)}</span></div>}
                      {eq.nextInspection && <div className="date-item"><span className="date-label">בדיקה הבאה:</span><span className={`date-value ${eq.status === 'overdue' ? 'overdue' : ''}`}>{formatDate(eq.nextInspection)}</span></div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'inspections' && (
          <div className="inspections-tab">
            <h3>היסטוריית בדיקות</h3>
            <div className="inspections-list">
              {data.recentInspections.map(insp => (
                <div key={insp.id} className="inspection-card">
                  <div className="inspection-header">
                    <div className="inspection-result">
                      {insp.result === 'pass' && <span className="result-pass">✅ עבר</span>}
                      {insp.result === 'pass_with_conditions' && <span className="result-conditional">⚠️ עבר בתנאים</span>}
                      {insp.result === 'fail' && <span className="result-fail">❌ נכשל</span>}
                    </div>
                    <span className="inspection-date">{formatDate(insp.date)}</span>
                  </div>
                  <h4>{insp.equipmentName}</h4>
                  <div className="inspection-meta">
                    <span>👤 {insp.inspectorName}</span>
                    {insp.certificateNumber && <span>📜 {insp.certificateNumber}</span>}
                  </div>
                  {onViewReport && insp.reportUrl && <button className="view-report-btn" onClick={() => onViewReport(insp)}>📄 צפה בדו"ח</button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'findings' && (
          <div className="findings-tab">
            <h3>ממצאים פתוחים</h3>
            {data.findings.length === 0 ? (
              <div className="empty-state"><span className="empty-icon">🎉</span><h4>אין ממצאים פתוחים</h4><p>כל הממצאים טופלו בהצלחה</p></div>
            ) : (
              <div className="findings-list">
                {data.findings.map(finding => {
                  const severityBadge = getSeverityBadge(finding.severity);
                  const isOverdue = finding.dueDate && new Date(finding.dueDate) < new Date();
                  return (
                    <div key={finding.id} className={`finding-card ${severityBadge.className}`}>
                      <div className="finding-header">
                        <span className="severity-badge">{severityBadge.icon} {severityBadge.text}</span>
                        {isOverdue && <span className="overdue-badge">באיחור!</span>}
                      </div>
                      <h4>{finding.title}</h4>
                      <p className="finding-equipment">{finding.equipmentName}</p>
                      <div className="finding-dates">
                        <span>נמצא: {formatDate(finding.foundDate)}</span>
                        {finding.dueDate && <span className={isOverdue ? 'overdue' : ''}>יעד: {formatDate(finding.dueDate)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-tab">
            <h3>מסמכים ותעודות</h3>
            <div className="documents-list">
              {data.documents.map(doc => (
                <div key={doc.id} className="document-card">
                  <div className="document-icon">
                    {doc.type === 'certificate' ? '📜' : doc.type === 'report' ? '📋' : doc.type === 'protocol' ? '📝' : '📚'}
                  </div>
                  <div className="document-content">
                    <h4>{doc.name}</h4>
                    {doc.equipmentName && <p>{doc.equipmentName}</p>}
                    <span className="document-date">{formatDate(doc.date)}</span>
                  </div>
                  {onDownloadDocument && <button className="download-btn" onClick={() => onDownloadDocument(doc)}>📥 הורד</button>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule-tab">
            <h3>לוח זמנים לבדיקות</h3>
            <div className="schedule-list">
              {data.schedule.map(item => {
                const date = new Date(item.scheduledDate);
                const isThisMonth = date.getMonth() === new Date().getMonth();
                return (
                  <div key={item.id} className={`schedule-card ${isThisMonth ? 'this-month' : ''}`}>
                    <div className="schedule-date">
                      <span className="day">{date.getDate()}</span>
                      <span className="month">{date.toLocaleDateString('he-IL', { month: 'short' })}</span>
                      <span className="year">{date.getFullYear()}</span>
                    </div>
                    <div className="schedule-content">
                      <h4>{item.equipmentName}</h4>
                      <p>{item.equipmentType}</p>
                      {item.inspectorName && <span>👤 {item.inspectorName}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <footer className="portal-footer">
        <p>מופעל על ידי AEGIS - מערכת ניהול בטיחות</p>
        <p>© {new Date().getFullYear()} כל הזכויות שמורות</p>
      </footer>
    </div>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const ClientPortalStyles = `
.client-portal { min-height: 100vh; background: #f3f4f6; }
.client-portal.loading { display: flex; align-items: center; justify-content: center; }

.portal-header { display: flex; align-items: center; gap: 20px; padding: 20px 24px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.header-logo img { max-width: 60px; max-height: 60px; }
.logo-placeholder { width: 60px; height: 60px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; border-radius: 12px; }
.header-info h1 { margin: 0; font-size: 20px; }
.header-info p { margin: 4px 0 0; color: #6b7280; font-size: 14px; }
.header-actions { margin-right: auto; }
.support-btn { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; }

.compliance-banner { display: flex; align-items: center; gap: 24px; padding: 20px 24px; margin: 16px 24px; border-radius: 12px; color: white; }
.compliance-banner.good { background: linear-gradient(135deg, #22c55e, #16a34a); }
.compliance-banner.medium { background: linear-gradient(135deg, #f59e0b, #d97706); }
.compliance-banner.poor { background: linear-gradient(135deg, #ef4444, #dc2626); }
.compliance-score { text-align: center; padding: 12px 24px; background: rgba(255,255,255,0.2); border-radius: 12px; }
.score-value { display: block; font-size: 32px; font-weight: 700; }
.score-label { font-size: 12px; opacity: 0.9; }
.compliance-message { font-size: 16px; }

.quick-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; padding: 0 24px; margin-bottom: 24px; }
.stat-card { background: white; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: relative; }
.stat-card.success { border-top: 3px solid #22c55e; }
.stat-card.warning { border-top: 3px solid #f59e0b; }
.stat-card.danger { border-top: 3px solid #ef4444; }
.stat-icon { font-size: 28px; }
.stat-value { font-size: 24px; font-weight: 700; }
.stat-label { font-size: 12px; color: #6b7280; }
.stat-badge { position: absolute; top: 8px; left: 8px; padding: 2px 8px; border-radius: 4px; font-size: 10px; }
.stat-badge.danger { background: #fee2e2; color: #991b1b; }

.portal-tabs { display: flex; gap: 4px; padding: 0 24px; margin-bottom: 24px; overflow-x: auto; }
.portal-tabs button { padding: 12px 20px; background: white; border: none; border-radius: 8px 8px 0 0; cursor: pointer; font-size: 14px; white-space: nowrap; border-bottom: 3px solid transparent; }
.portal-tabs button.active { border-bottom-color: #3b82f6; color: #3b82f6; font-weight: 500; }

.tab-content { padding: 0 24px 24px; }
.tab-content h3 { margin: 0 0 16px; font-size: 18px; }

.alerts-section, .recent-section, .upcoming-section { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
.alerts-list, .activity-list, .upcoming-list { display: flex; flex-direction: column; gap: 12px; }
.alert-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; }
.alert-item.warning { background: #fef3c7; color: #92400e; }
.alert-item.danger { background: #fee2e2; color: #991b1b; }
.alert-item button { margin-right: auto; padding: 6px 12px; background: rgba(0,0,0,0.1); border: none; border-radius: 4px; cursor: pointer; }
.activity-item, .upcoming-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; }
.activity-icon { font-size: 24px; }
.upcoming-date { display: flex; flex-direction: column; align-items: center; padding: 8px 12px; background: #3b82f6; color: white; border-radius: 8px; min-width: 50px; }
.upcoming-date .day { font-size: 20px; font-weight: 700; }
.upcoming-date .month { font-size: 11px; }
.activity-content, .upcoming-content { flex: 1; }
.activity-content strong, .upcoming-content strong { display: block; }
.activity-content span, .upcoming-content span { font-size: 13px; color: #6b7280; }
.view-btn { padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }

.tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.filter-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-buttons button { padding: 8px 16px; background: white; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 13px; }
.filter-buttons button.active { background: #3b82f6; color: white; border-color: #3b82f6; }

.equipment-list, .inspections-list, .findings-list, .documents-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.equipment-card, .inspection-card, .finding-card, .document-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.equipment-header, .inspection-header, .finding-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
.domain-badge { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 18px; }
.status-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; }
.status-badge.status-compliant { background: #dcfce7; color: #166534; }
.status-badge.status-due-soon { background: #dbeafe; color: #1e40af; }
.status-badge.status-overdue { background: #fee2e2; color: #991b1b; }
.status-badge.status-not-inspected { background: #f3f4f6; color: #6b7280; }
.equipment-card h4, .inspection-card h4, .finding-card h4 { margin: 0 0 4px; font-size: 16px; }
.equipment-type, .finding-equipment { margin: 0 0 12px; color: #6b7280; font-size: 14px; }
.equipment-details { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; margin-bottom: 12px; }
.equipment-dates { padding-top: 12px; border-top: 1px solid #e5e7eb; }
.date-item { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
.date-label { color: #6b7280; }
.date-value.overdue { color: #dc2626; font-weight: 500; }

.result-pass { color: #16a34a; font-weight: 500; }
.result-conditional { color: #d97706; font-weight: 500; }
.result-fail { color: #dc2626; font-weight: 500; }
.inspection-date { color: #6b7280; font-size: 14px; }
.inspection-meta { display: flex; gap: 16px; font-size: 13px; color: #6b7280; margin-bottom: 12px; }
.view-report-btn { width: 100%; padding: 10px; background: #f3f4f6; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
.view-report-btn:hover { background: #e5e7eb; }

.finding-card.severity-critical { border-right: 4px solid #dc2626; }
.finding-card.severity-major { border-right: 4px solid #f97316; }
.finding-card.severity-minor { border-right: 4px solid #eab308; }
.severity-badge { font-size: 13px; font-weight: 500; }
.overdue-badge { padding: 2px 8px; background: #fee2e2; color: #991b1b; border-radius: 4px; font-size: 11px; }
.finding-dates { display: flex; gap: 16px; font-size: 13px; color: #6b7280; }
.finding-dates .overdue { color: #dc2626; }

.document-card { display: flex; align-items: center; gap: 16px; }
.document-icon { font-size: 32px; }
.document-content { flex: 1; }
.document-content h4 { margin: 0 0 4px; font-size: 14px; }
.document-content p { margin: 0; font-size: 13px; color: #6b7280; }
.document-date { font-size: 12px; color: #9ca3af; }
.download-btn { padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; }

.schedule-list { display: flex; flex-direction: column; gap: 12px; }
.schedule-card { display: flex; align-items: center; gap: 16px; background: white; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.schedule-card.this-month { border-right: 4px solid #3b82f6; }
.schedule-date { display: flex; flex-direction: column; align-items: center; padding: 12px 16px; background: #f3f4f6; border-radius: 8px; min-width: 60px; }
.schedule-date .day { font-size: 24px; font-weight: 700; }
.schedule-date .month { font-size: 12px; color: #6b7280; }
.schedule-date .year { font-size: 11px; color: #9ca3af; }
.schedule-content h4 { margin: 0 0 4px; }
.schedule-content p { margin: 0; font-size: 14px; color: #6b7280; }
.schedule-content span { font-size: 13px; color: #9ca3af; }

.empty-state { text-align: center; padding: 48px; background: white; border-radius: 12px; }
.empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
.empty-state h4 { margin: 0 0 8px; }
.empty-state p { margin: 0; color: #6b7280; }

.portal-footer { text-align: center; padding: 24px; color: #6b7280; font-size: 13px; }
.portal-footer p { margin: 4px 0; }

@media (max-width: 768px) {
  .portal-header { flex-wrap: wrap; }
  .compliance-banner { flex-direction: column; text-align: center; }
  .quick-stats { grid-template-columns: repeat(2, 1fr); }
  .equipment-list, .inspections-list, .findings-list, .documents-list { grid-template-columns: 1fr; }
}
`;

export default ClientPortal;
