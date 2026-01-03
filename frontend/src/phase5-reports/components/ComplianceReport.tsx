/**
 * AEGIS Compliance Report Component
 * דו"ח ציות לתקנות בטיחות
 */

import React, { useState, useMemo } from 'react';
import { SAFETY_DOMAINS } from '../types/safety';

// ============================================
// 📋 Types
// ============================================

export interface ComplianceReportData {
  // Report Info
  reportDate: Date;
  periodStart: Date;
  periodEnd: Date;
  generatedBy: string;
  
  // Overall
  overall: {
    score: number;
    trend: 'up' | 'down' | 'stable';
    previousScore?: number;
  };
  
  // By Domain
  byDomain: DomainCompliance[];
  
  // By Client
  byClient: ClientCompliance[];
  
  // Issues
  criticalIssues: ComplianceIssue[];
  upcomingDeadlines: ComplianceDeadline[];
  
  // Regulatory
  regulatoryRequirements: RegulatoryRequirement[];
  
  // Recommendations
  recommendations: string[];
}

export interface DomainCompliance {
  domain: string;
  score: number;
  totalEquipment: number;
  compliantEquipment: number;
  overdueInspections: number;
  openFindings: number;
  criticalFindings: number;
}

export interface ClientCompliance {
  clientId: string;
  clientName: string;
  score: number;
  totalEquipment: number;
  compliantEquipment: number;
  overdueInspections: number;
  openFindings: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceIssue {
  id: string;
  type: 'overdue_inspection' | 'expired_certificate' | 'critical_finding' | 'missing_documentation';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  clientName: string;
  equipmentName?: string;
  dueDate?: Date;
  daysOverdue?: number;
}

export interface ComplianceDeadline {
  id: string;
  type: string;
  description: string;
  clientName: string;
  dueDate: Date;
  daysUntil: number;
}

export interface RegulatoryRequirement {
  id: string;
  regulation: string;
  requirement: string;
  domain: string;
  frequency: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  notes?: string;
}

// ============================================
// 🎨 Props
// ============================================

interface ComplianceReportProps {
  data: ComplianceReportData;
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onViewClient?: (clientId: string) => void;
  loading?: boolean;
}

// ============================================
// 📋 Main Component
// ============================================

export const ComplianceReport: React.FC<ComplianceReportProps> = ({
  data,
  onExportPDF,
  onExportExcel,
  onViewClient,
  loading,
}) => {
  const [activeSection, setActiveSection] = useState<'summary' | 'domains' | 'clients' | 'issues' | 'regulatory'>('summary');

  const formatDate = (date: Date | string) => new Date(date).toLocaleDateString('he-IL');

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const getRiskBadge = (risk: string) => {
    const badges: Record<string, { text: string; className: string; icon: string }> = {
      low: { text: 'נמוך', className: 'risk-low', icon: '🟢' },
      medium: { text: 'בינוני', className: 'risk-medium', icon: '🟡' },
      high: { text: 'גבוה', className: 'risk-high', icon: '🟠' },
      critical: { text: 'קריטי', className: 'risk-critical', icon: '🔴' },
    };
    return badges[risk] || badges.low;
  };

  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      critical: { text: 'קריטי', className: 'severity-critical' },
      high: { text: 'גבוה', className: 'severity-high' },
      medium: { text: 'בינוני', className: 'severity-medium' },
      low: { text: 'נמוך', className: 'severity-low' },
    };
    return badges[severity] || badges.low;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string; icon: string }> = {
      compliant: { text: 'עומד בדרישות', className: 'status-compliant', icon: '✅' },
      partial: { text: 'עמידה חלקית', className: 'status-partial', icon: '⚠️' },
      non_compliant: { text: 'אינו עומד', className: 'status-non-compliant', icon: '❌' },
    };
    return badges[status] || badges.non_compliant;
  };

  // Sort clients by risk
  const sortedClients = useMemo(() => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...data.byClient].sort((a, b) => 
      riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
    );
  }, [data.byClient]);

  if (loading) {
    return <div className="compliance-report loading" dir="rtl"><div className="loading-spinner">טוען דו"ח...</div></div>;
  }

  return (
    <div className="compliance-report" dir="rtl">
      {/* Header */}
      <header className="report-header">
        <div className="header-title">
          <h1>דו"ח ציות תקופתי</h1>
          <p>
            תקופה: {formatDate(data.periodStart)} - {formatDate(data.periodEnd)}
          </p>
        </div>
        <div className="header-actions">
          {onExportPDF && <button className="btn btn-primary" onClick={onExportPDF}>📥 PDF</button>}
          {onExportExcel && <button className="btn btn-secondary" onClick={onExportExcel}>📊 Excel</button>}
        </div>
      </header>

      {/* Overall Score */}
      <div className="overall-score-section">
        <div className="score-circle-large" style={{ '--score-color': getScoreColor(data.overall.score) } as React.CSSProperties}>
          <svg viewBox="0 0 100 100">
            <circle className="bg" cx="50" cy="50" r="45" />
            <circle 
              className="progress" 
              cx="50" cy="50" r="45"
              strokeDasharray={`${data.overall.score * 2.83} 283`}
              style={{ stroke: getScoreColor(data.overall.score) }}
            />
          </svg>
          <div className="score-content">
            <span className="score-value">{data.overall.score}%</span>
            <span className="score-label">ציון ציות כללי</span>
            {data.overall.trend !== 'stable' && (
              <span className={`score-trend ${data.overall.trend}`}>
                {data.overall.trend === 'up' ? '↑' : '↓'}
                {data.overall.previousScore && ` מ-${data.overall.previousScore}%`}
              </span>
            )}
          </div>
        </div>

        <div className="quick-metrics">
          <div className="metric">
            <span className="metric-value">{data.criticalIssues.filter(i => i.severity === 'critical').length}</span>
            <span className="metric-label">בעיות קריטיות</span>
          </div>
          <div className="metric">
            <span className="metric-value">{data.upcomingDeadlines.length}</span>
            <span className="metric-label">מועדים קרובים</span>
          </div>
          <div className="metric">
            <span className="metric-value">{data.byClient.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length}</span>
            <span className="metric-label">לקוחות בסיכון</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="report-nav">
        {(['summary', 'domains', 'clients', 'issues', 'regulatory'] as const).map(section => (
          <button
            key={section}
            className={activeSection === section ? 'active' : ''}
            onClick={() => setActiveSection(section)}
          >
            {section === 'summary' && '📊 סיכום'}
            {section === 'domains' && '🏷️ תחומים'}
            {section === 'clients' && '🏢 לקוחות'}
            {section === 'issues' && '⚠️ בעיות'}
            {section === 'regulatory' && '📜 רגולציה'}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="report-content">
        {/* Summary Section */}
        {activeSection === 'summary' && (
          <div className="summary-section">
            {/* Domain Cards */}
            <h3>ציות לפי תחום</h3>
            <div className="domain-cards">
              {data.byDomain.map(domain => {
                const domainInfo = SAFETY_DOMAINS[domain.domain as keyof typeof SAFETY_DOMAINS];
                return (
                  <div key={domain.domain} className="domain-card">
                    <div className="domain-header" style={{ background: domainInfo?.color }}>
                      <span className="domain-icon">{domainInfo?.icon}</span>
                      <span className="domain-name">{domainInfo?.name || domain.domain}</span>
                    </div>
                    <div className="domain-body">
                      <div className="domain-score" style={{ color: getScoreColor(domain.score) }}>
                        {domain.score}%
                      </div>
                      <div className="domain-stats">
                        <span>ציוד: {domain.compliantEquipment}/{domain.totalEquipment}</span>
                        {domain.overdueInspections > 0 && <span className="warning">⏰ {domain.overdueInspections} באיחור</span>}
                        {domain.criticalFindings > 0 && <span className="danger">🚨 {domain.criticalFindings} קריטיים</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {data.recommendations.length > 0 && (
              <>
                <h3>המלצות</h3>
                <div className="recommendations">
                  {data.recommendations.map((rec, idx) => (
                    <div key={idx} className="recommendation-item">
                      <span className="rec-number">{idx + 1}</span>
                      <span className="rec-text">{rec}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Domains Section */}
        {activeSection === 'domains' && (
          <div className="domains-section">
            <h3>פירוט לפי תחום</h3>
            <div className="domains-table">
              <table>
                <thead>
                  <tr>
                    <th>תחום</th>
                    <th>ציון</th>
                    <th>ציוד תקין</th>
                    <th>באיחור</th>
                    <th>ממצאים פתוחים</th>
                    <th>קריטיים</th>
                  </tr>
                </thead>
                <tbody>
                  {data.byDomain.map(domain => {
                    const domainInfo = SAFETY_DOMAINS[domain.domain as keyof typeof SAFETY_DOMAINS];
                    return (
                      <tr key={domain.domain}>
                        <td>
                          <span className="domain-badge" style={{ background: domainInfo?.color }}>
                            {domainInfo?.icon} {domainInfo?.name || domain.domain}
                          </span>
                        </td>
                        <td>
                          <span className="score-cell" style={{ color: getScoreColor(domain.score) }}>
                            {domain.score}%
                          </span>
                        </td>
                        <td>{domain.compliantEquipment}/{domain.totalEquipment}</td>
                        <td className={domain.overdueInspections > 0 ? 'warning' : ''}>{domain.overdueInspections}</td>
                        <td>{domain.openFindings}</td>
                        <td className={domain.criticalFindings > 0 ? 'danger' : ''}>{domain.criticalFindings}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clients Section */}
        {activeSection === 'clients' && (
          <div className="clients-section">
            <h3>ציות לפי לקוח</h3>
            <div className="clients-list">
              {sortedClients.map(client => {
                const riskBadge = getRiskBadge(client.riskLevel);
                return (
                  <div 
                    key={client.clientId} 
                    className={`client-card ${client.riskLevel}`}
                    onClick={() => onViewClient?.(client.clientId)}
                  >
                    <div className="client-header">
                      <h4>{client.clientName}</h4>
                      <span className={`risk-badge ${riskBadge.className}`}>
                        {riskBadge.icon} {riskBadge.text}
                      </span>
                    </div>
                    <div className="client-score">
                      <div className="score-bar">
                        <div 
                          className="score-fill"
                          style={{ width: `${client.score}%`, background: getScoreColor(client.score) }}
                        />
                      </div>
                      <span style={{ color: getScoreColor(client.score) }}>{client.score}%</span>
                    </div>
                    <div className="client-stats">
                      <span>📦 {client.compliantEquipment}/{client.totalEquipment} ציוד תקין</span>
                      {client.overdueInspections > 0 && <span className="warning">⏰ {client.overdueInspections} באיחור</span>}
                      {client.openFindings > 0 && <span>📝 {client.openFindings} ממצאים</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Issues Section */}
        {activeSection === 'issues' && (
          <div className="issues-section">
            {/* Critical Issues */}
            <h3>🚨 בעיות דורשות טיפול</h3>
            {data.criticalIssues.length === 0 ? (
              <div className="empty-state success">
                <span className="empty-icon">✅</span>
                <h4>אין בעיות קריטיות</h4>
                <p>כל הנושאים מטופלים כראוי</p>
              </div>
            ) : (
              <div className="issues-list">
                {data.criticalIssues.map(issue => {
                  const severityBadge = getSeverityBadge(issue.severity);
                  return (
                    <div key={issue.id} className={`issue-card ${severityBadge.className}`}>
                      <div className="issue-header">
                        <span className={`severity-badge ${severityBadge.className}`}>{severityBadge.text}</span>
                        {issue.daysOverdue && <span className="days-overdue">{issue.daysOverdue} ימים באיחור</span>}
                      </div>
                      <p className="issue-description">{issue.description}</p>
                      <div className="issue-meta">
                        <span>🏢 {issue.clientName}</span>
                        {issue.equipmentName && <span>📦 {issue.equipmentName}</span>}
                        {issue.dueDate && <span>📅 {formatDate(issue.dueDate)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upcoming Deadlines */}
            <h3>📅 מועדים קרובים</h3>
            <div className="deadlines-list">
              {data.upcomingDeadlines.map(deadline => (
                <div key={deadline.id} className={`deadline-card ${deadline.daysUntil <= 7 ? 'urgent' : ''}`}>
                  <div className="deadline-date">
                    <span className="days">{deadline.daysUntil}</span>
                    <span className="days-label">ימים</span>
                  </div>
                  <div className="deadline-content">
                    <strong>{deadline.description}</strong>
                    <span>{deadline.clientName}</span>
                    <span className="due-date">{formatDate(deadline.dueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regulatory Section */}
        {activeSection === 'regulatory' && (
          <div className="regulatory-section">
            <h3>עמידה בדרישות רגולטוריות</h3>
            <div className="regulatory-table">
              <table>
                <thead>
                  <tr>
                    <th>תקנה</th>
                    <th>דרישה</th>
                    <th>תחום</th>
                    <th>תדירות</th>
                    <th>סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {data.regulatoryRequirements.map(req => {
                    const statusBadge = getStatusBadge(req.status);
                    const domainInfo = SAFETY_DOMAINS[req.domain as keyof typeof SAFETY_DOMAINS];
                    return (
                      <tr key={req.id}>
                        <td><strong>{req.regulation}</strong></td>
                        <td>{req.requirement}</td>
                        <td>
                          <span className="domain-badge small" style={{ background: domainInfo?.color }}>
                            {domainInfo?.icon} {domainInfo?.name}
                          </span>
                        </td>
                        <td>{req.frequency}</td>
                        <td>
                          <span className={`status-badge ${statusBadge.className}`}>
                            {statusBadge.icon} {statusBadge.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="report-footer">
        <p>דו"ח הופק בתאריך: {formatDate(data.reportDate)}</p>
        <p>הופק על ידי: {data.generatedBy}</p>
        <p className="disclaimer">דו"ח זה מהווה סקירה של מצב הציות ואינו מהווה תחליף לייעוץ מקצועי</p>
      </footer>
    </div>
  );
};

// ============================================
// 🎨 Styles
// ============================================

export const ComplianceReportStyles = `
.compliance-report { padding: 24px; background: #f9fafb; min-height: 100vh; }
.compliance-report.loading { display: flex; align-items: center; justify-content: center; }

.report-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.header-title h1 { margin: 0; font-size: 24px; }
.header-title p { margin: 8px 0 0; color: #6b7280; }
.header-actions { display: flex; gap: 12px; }
.btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
.btn-primary { background: #3b82f6; color: white; }
.btn-secondary { background: white; color: #374151; border: 1px solid #d1d5db; }

.overall-score-section { display: flex; align-items: center; gap: 48px; background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

.score-circle-large { position: relative; width: 180px; height: 180px; }
.score-circle-large svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.score-circle-large circle { fill: none; stroke-width: 10; }
.score-circle-large .bg { stroke: #e5e7eb; }
.score-circle-large .progress { stroke-linecap: round; transition: stroke-dasharray 0.5s; }
.score-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
.score-value { display: block; font-size: 42px; font-weight: 700; }
.score-label { font-size: 14px; color: #6b7280; }
.score-trend { display: block; font-size: 14px; margin-top: 4px; }
.score-trend.up { color: #22c55e; }
.score-trend.down { color: #ef4444; }

.quick-metrics { display: flex; gap: 32px; }
.metric { text-align: center; }
.metric-value { display: block; font-size: 36px; font-weight: 700; }
.metric-label { font-size: 14px; color: #6b7280; }

.report-nav { display: flex; gap: 8px; margin-bottom: 24px; background: white; padding: 8px; border-radius: 12px; }
.report-nav button { padding: 12px 20px; background: transparent; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
.report-nav button.active { background: #3b82f6; color: white; }

.report-content h3 { margin: 0 0 16px; font-size: 18px; }

.domain-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
.domain-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.domain-header { padding: 12px 16px; color: white; display: flex; align-items: center; gap: 8px; }
.domain-icon { font-size: 20px; }
.domain-name { font-weight: 500; }
.domain-body { padding: 16px; }
.domain-score { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
.domain-stats { font-size: 13px; color: #6b7280; display: flex; flex-direction: column; gap: 4px; }
.domain-stats .warning { color: #d97706; }
.domain-stats .danger { color: #dc2626; }

.recommendations { display: flex; flex-direction: column; gap: 12px; }
.recommendation-item { display: flex; gap: 12px; padding: 16px; background: white; border-radius: 8px; }
.rec-number { width: 28px; height: 28px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0; }
.rec-text { flex: 1; }

.domains-table, .regulatory-table { background: white; border-radius: 12px; overflow: hidden; }
.domains-table table, .regulatory-table table { width: 100%; border-collapse: collapse; }
.domains-table th, .domains-table td, .regulatory-table th, .regulatory-table td { padding: 12px 16px; text-align: right; border-bottom: 1px solid #e5e7eb; }
.domains-table th, .regulatory-table th { background: #f9fafb; font-weight: 600; }
.score-cell { font-weight: 600; }
td.warning { color: #d97706; }
td.danger { color: #dc2626; }

.domain-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; font-size: 13px; color: white; }
.domain-badge.small { padding: 2px 8px; font-size: 12px; }

.clients-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.client-card { background: white; border-radius: 12px; padding: 16px; cursor: pointer; transition: transform 0.2s; border-right: 4px solid #e5e7eb; }
.client-card:hover { transform: translateY(-2px); }
.client-card.low { border-right-color: #22c55e; }
.client-card.medium { border-right-color: #f59e0b; }
.client-card.high { border-right-color: #f97316; }
.client-card.critical { border-right-color: #ef4444; }
.client-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.client-header h4 { margin: 0; }
.risk-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; }
.risk-badge.risk-low { background: #dcfce7; color: #166534; }
.risk-badge.risk-medium { background: #fef3c7; color: #92400e; }
.risk-badge.risk-high { background: #fed7aa; color: #c2410c; }
.risk-badge.risk-critical { background: #fee2e2; color: #991b1b; }
.client-score { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.score-bar { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.score-fill { height: 100%; border-radius: 4px; }
.client-stats { display: flex; flex-wrap: wrap; gap: 12px; font-size: 13px; color: #6b7280; }
.client-stats .warning { color: #d97706; }

.empty-state { text-align: center; padding: 48px; background: white; border-radius: 12px; }
.empty-state.success { background: #f0fdf4; }
.empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
.empty-state h4 { margin: 0 0 8px; }
.empty-state p { margin: 0; color: #6b7280; }

.issues-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
.issue-card { background: white; border-radius: 12px; padding: 16px; border-right: 4px solid #6b7280; }
.issue-card.severity-critical { border-right-color: #dc2626; background: #fef2f2; }
.issue-card.severity-high { border-right-color: #f97316; background: #fff7ed; }
.issue-card.severity-medium { border-right-color: #f59e0b; }
.issue-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.severity-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; }
.severity-badge.severity-critical { background: #fee2e2; color: #991b1b; }
.severity-badge.severity-high { background: #fed7aa; color: #c2410c; }
.severity-badge.severity-medium { background: #fef3c7; color: #92400e; }
.severity-badge.severity-low { background: #f3f4f6; color: #6b7280; }
.days-overdue { color: #dc2626; font-size: 13px; }
.issue-description { margin: 0 0 12px; }
.issue-meta { display: flex; gap: 16px; font-size: 13px; color: #6b7280; }

.deadlines-list { display: flex; flex-direction: column; gap: 12px; }
.deadline-card { display: flex; align-items: center; gap: 16px; background: white; border-radius: 12px; padding: 16px; }
.deadline-card.urgent { border-right: 4px solid #ef4444; background: #fef2f2; }
.deadline-date { text-align: center; padding: 12px 16px; background: #f3f4f6; border-radius: 8px; min-width: 60px; }
.deadline-card.urgent .deadline-date { background: #fee2e2; }
.deadline-date .days { display: block; font-size: 24px; font-weight: 700; }
.deadline-date .days-label { font-size: 11px; color: #6b7280; }
.deadline-content { flex: 1; }
.deadline-content strong { display: block; margin-bottom: 4px; }
.deadline-content span { font-size: 13px; color: #6b7280; margin-left: 12px; }
.due-date { color: #9ca3af; }

.status-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; }
.status-badge.status-compliant { background: #dcfce7; color: #166534; }
.status-badge.status-partial { background: #fef3c7; color: #92400e; }
.status-badge.status-non-compliant { background: #fee2e2; color: #991b1b; }

.report-footer { text-align: center; padding: 24px; color: #6b7280; font-size: 13px; margin-top: 32px; border-top: 1px solid #e5e7eb; }
.report-footer p { margin: 4px 0; }
.disclaimer { font-style: italic; margin-top: 12px !important; }

@media (max-width: 768px) {
  .overall-score-section { flex-direction: column; }
  .quick-metrics { flex-wrap: wrap; justify-content: center; }
  .domain-cards, .clients-list { grid-template-columns: 1fr; }
}
`;

export default ComplianceReport;
