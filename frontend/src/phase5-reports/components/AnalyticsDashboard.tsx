/**
 * AEGIS Analytics Dashboard
 * דשבורד אנליטיקה עם גרפים ו-KPIs
 */

import React, { useState, useMemo } from 'react';
import { SAFETY_DOMAINS } from '../types/safety';

// ============================================
// 📊 Types
// ============================================

export interface AnalyticsData {
  // Time range
  dateFrom: Date;
  dateTo: Date;
  
  // Inspections
  inspections: {
    total: number;
    passed: number;
    passedWithConditions: number;
    failed: number;
    byMonth: { month: string; total: number; passed: number; failed: number }[];
    byDomain: { domain: string; count: number }[];
    byInspector: { name: string; count: number; passRate: number }[];
  };
  
  // Findings
  findings: {
    total: number;
    open: number;
    closed: number;
    overdue: number;
    bySeverity: { severity: string; count: number }[];
    byCategory: { category: string; count: number }[];
    avgResolutionDays: number;
    resolutionTrend: { month: string; avgDays: number }[];
  };
  
  // Equipment
  equipment: {
    total: number;
    inspected: number;
    overdue: number;
    dueSoon: number;
    byDomain: { domain: string; count: number }[];
    byStatus: { status: string; count: number }[];
  };
  
  // Clients
  clients: {
    total: number;
    active: number;
    topByInspections: { name: string; count: number }[];
    topByFindings: { name: string; count: number }[];
  };
  
  // Compliance
  compliance: {
    overallScore: number;
    byDomain: { domain: string; score: number }[];
    trend: { month: string; score: number }[];
  };
}

export interface DateRange {
  from: Date;
  to: Date;
  label: string;
}

// ============================================
// 🎨 Props
// ============================================

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  loading?: boolean;
  onDateRangeChange?: (range: DateRange) => void;
  onExport?: (format: 'pdf' | 'excel') => void;
}

// ============================================
// 📊 Main Component
// ============================================

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  loading,
  onDateRangeChange,
  onExport,
}) => {
  const [selectedRange, setSelectedRange] = useState<string>('month');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'inspections' | 'findings' | 'compliance'>('overview');

  // Date range presets
  const dateRanges: Record<string, DateRange> = {
    week: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
      label: 'שבוע אחרון',
    },
    month: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
      label: 'חודש אחרון',
    },
    quarter: {
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: new Date(),
      label: 'רבעון אחרון',
    },
    year: {
      from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      to: new Date(),
      label: 'שנה אחרונה',
    },
  };

  const handleRangeChange = (rangeKey: string) => {
    setSelectedRange(rangeKey);
    onDateRangeChange?.(dateRanges[rangeKey]);
  };

  // Calculate KPIs
  const kpis = useMemo(() => {
    const passRate = data.inspections.total > 0
      ? Math.round(((data.inspections.passed + data.inspections.passedWithConditions) / data.inspections.total) * 100)
      : 0;
    
    const findingCloseRate = (data.findings.total - data.findings.open) > 0
      ? Math.round((data.findings.closed / (data.findings.total - data.findings.open + data.findings.closed)) * 100)
      : 0;

    const equipmentCompliance = data.equipment.total > 0
      ? Math.round(((data.equipment.total - data.equipment.overdue) / data.equipment.total) * 100)
      : 0;

    return { passRate, findingCloseRate, equipmentCompliance };
  }, [data]);

  return (
    <div className="analytics-dashboard" dir="rtl">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h2>דשבורד אנליטיקה</h2>
          <span className="date-range">
            {data.dateFrom.toLocaleDateString('he-IL')} - {data.dateTo.toLocaleDateString('he-IL')}
          </span>
        </div>
        <div className="header-actions">
          <div className="range-selector">
            {Object.entries(dateRanges).map(([key, range]) => (
              <button
                key={key}
                className={selectedRange === key ? 'active' : ''}
                onClick={() => handleRangeChange(key)}
              >
                {range.label}
              </button>
            ))}
          </div>
          {onExport && (
            <div className="export-buttons">
              <button onClick={() => onExport('pdf')}>📥 PDF</button>
              <button onClick={() => onExport('excel')}>📊 Excel</button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={selectedTab === 'overview' ? 'active' : ''}
          onClick={() => setSelectedTab('overview')}
        >
          סקירה כללית
        </button>
        <button
          className={selectedTab === 'inspections' ? 'active' : ''}
          onClick={() => setSelectedTab('inspections')}
        >
          בדיקות
        </button>
        <button
          className={selectedTab === 'findings' ? 'active' : ''}
          onClick={() => setSelectedTab('findings')}
        >
          ממצאים
        </button>
        <button
          className={selectedTab === 'compliance' ? 'active' : ''}
          onClick={() => setSelectedTab('compliance')}
        >
          ציות
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <span>טוען נתונים...</span>
        </div>
      )}

      {/* Overview Tab */}
      {!loading && selectedTab === 'overview' && (
        <div className="tab-content">
          {/* KPI Cards */}
          <div className="kpi-cards">
            <div className="kpi-card primary">
              <div className="kpi-icon">📋</div>
              <div className="kpi-content">
                <div className="kpi-value">{data.inspections.total}</div>
                <div className="kpi-label">בדיקות</div>
              </div>
              <div className="kpi-badge success">{kpis.passRate}% עברו</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">📝</div>
              <div className="kpi-content">
                <div className="kpi-value">{data.findings.open}</div>
                <div className="kpi-label">ממצאים פתוחים</div>
              </div>
              {data.findings.overdue > 0 && (
                <div className="kpi-badge danger">{data.findings.overdue} באיחור</div>
              )}
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">📦</div>
              <div className="kpi-content">
                <div className="kpi-value">{data.equipment.total}</div>
                <div className="kpi-label">פריטי ציוד</div>
              </div>
              <div className="kpi-badge">{kpis.equipmentCompliance}% מעודכנים</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon">🏢</div>
              <div className="kpi-content">
                <div className="kpi-value">{data.clients.active}</div>
                <div className="kpi-label">לקוחות פעילים</div>
              </div>
            </div>

            <div className="kpi-card highlight">
              <div className="kpi-icon">🎯</div>
              <div className="kpi-content">
                <div className="kpi-value">{data.compliance.overallScore}%</div>
                <div className="kpi-label">ציון ציות כללי</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Inspections by Month */}
            <div className="chart-card">
              <h3>בדיקות לפי חודש</h3>
              <div className="bar-chart">
                {data.inspections.byMonth.map((item, idx) => (
                  <div key={idx} className="bar-group">
                    <div className="bars">
                      <div 
                        className="bar passed" 
                        style={{ height: `${(item.passed / Math.max(...data.inspections.byMonth.map(m => m.total))) * 100}%` }}
                        title={`עברו: ${item.passed}`}
                      />
                      <div 
                        className="bar failed" 
                        style={{ height: `${(item.failed / Math.max(...data.inspections.byMonth.map(m => m.total))) * 100}%` }}
                        title={`נכשלו: ${item.failed}`}
                      />
                    </div>
                    <span className="bar-label">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span className="legend-item"><span className="dot passed"></span> עברו</span>
                <span className="legend-item"><span className="dot failed"></span> נכשלו</span>
              </div>
            </div>

            {/* Inspections by Domain */}
            <div className="chart-card">
              <h3>בדיקות לפי תחום</h3>
              <div className="donut-chart-container">
                <DonutChart 
                  data={data.inspections.byDomain.map(d => ({
                    label: SAFETY_DOMAINS[d.domain as keyof typeof SAFETY_DOMAINS]?.name || d.domain,
                    value: d.count,
                    color: SAFETY_DOMAINS[d.domain as keyof typeof SAFETY_DOMAINS]?.color || '#6b7280',
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="tables-row">
            {/* Top Inspectors */}
            <div className="table-card">
              <h3>בודקים מובילים</h3>
              <table>
                <thead>
                  <tr>
                    <th>שם</th>
                    <th>בדיקות</th>
                    <th>% הצלחה</th>
                  </tr>
                </thead>
                <tbody>
                  {data.inspections.byInspector.slice(0, 5).map((inspector, idx) => (
                    <tr key={idx}>
                      <td>{inspector.name}</td>
                      <td>{inspector.count}</td>
                      <td>
                        <span className={`rate-badge ${inspector.passRate >= 90 ? 'high' : inspector.passRate >= 70 ? 'medium' : 'low'}`}>
                          {inspector.passRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Clients */}
            <div className="table-card">
              <h3>לקוחות מובילים</h3>
              <table>
                <thead>
                  <tr>
                    <th>לקוח</th>
                    <th>בדיקות</th>
                  </tr>
                </thead>
                <tbody>
                  {data.clients.topByInspections.slice(0, 5).map((client, idx) => (
                    <tr key={idx}>
                      <td>{client.name}</td>
                      <td>{client.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Inspections Tab */}
      {!loading && selectedTab === 'inspections' && (
        <div className="tab-content">
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-value large">{data.inspections.total}</div>
              <div className="stat-label">סה"כ בדיקות</div>
            </div>
            <div className="stat-box success">
              <div className="stat-value large">{data.inspections.passed}</div>
              <div className="stat-label">עברו</div>
            </div>
            <div className="stat-box warning">
              <div className="stat-value large">{data.inspections.passedWithConditions}</div>
              <div className="stat-label">עברו בתנאים</div>
            </div>
            <div className="stat-box danger">
              <div className="stat-value large">{data.inspections.failed}</div>
              <div className="stat-label">נכשלו</div>
            </div>
          </div>

          <div className="chart-card full-width">
            <h3>מגמת בדיקות</h3>
            <div className="line-chart">
              {data.inspections.byMonth.map((item, idx) => (
                <div key={idx} className="line-point" style={{ 
                  left: `${(idx / (data.inspections.byMonth.length - 1)) * 100}%`,
                  bottom: `${(item.total / Math.max(...data.inspections.byMonth.map(m => m.total))) * 80}%`
                }}>
                  <div className="point-dot"></div>
                  <div className="point-value">{item.total}</div>
                  <div className="point-label">{item.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Findings Tab */}
      {!loading && selectedTab === 'findings' && (
        <div className="tab-content">
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-value large">{data.findings.total}</div>
              <div className="stat-label">סה"כ ממצאים</div>
            </div>
            <div className="stat-box warning">
              <div className="stat-value large">{data.findings.open}</div>
              <div className="stat-label">פתוחים</div>
            </div>
            <div className="stat-box success">
              <div className="stat-value large">{data.findings.closed}</div>
              <div className="stat-label">נסגרו</div>
            </div>
            <div className="stat-box danger">
              <div className="stat-value large">{data.findings.overdue}</div>
              <div className="stat-label">באיחור</div>
            </div>
            <div className="stat-box">
              <div className="stat-value large">{data.findings.avgResolutionDays}</div>
              <div className="stat-label">ימי טיפול ממוצע</div>
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3>לפי חומרה</h3>
              <div className="horizontal-bars">
                {data.findings.bySeverity.map((item, idx) => (
                  <div key={idx} className="h-bar-row">
                    <span className="h-bar-label">{getSeverityLabel(item.severity)}</span>
                    <div className="h-bar-container">
                      <div 
                        className={`h-bar severity-${item.severity}`}
                        style={{ width: `${(item.count / Math.max(...data.findings.bySeverity.map(s => s.count))) * 100}%` }}
                      />
                    </div>
                    <span className="h-bar-value">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h3>לפי קטגוריה</h3>
              <div className="horizontal-bars">
                {data.findings.byCategory.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="h-bar-row">
                    <span className="h-bar-label">{item.category}</span>
                    <div className="h-bar-container">
                      <div 
                        className="h-bar"
                        style={{ width: `${(item.count / Math.max(...data.findings.byCategory.map(c => c.count))) * 100}%` }}
                      />
                    </div>
                    <span className="h-bar-value">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {!loading && selectedTab === 'compliance' && (
        <div className="tab-content">
          <div className="compliance-score">
            <div className="score-circle">
              <svg viewBox="0 0 100 100">
                <circle className="bg" cx="50" cy="50" r="45" />
                <circle 
                  className="progress" 
                  cx="50" cy="50" r="45"
                  strokeDasharray={`${data.compliance.overallScore * 2.83} 283`}
                />
              </svg>
              <div className="score-value">{data.compliance.overallScore}%</div>
            </div>
            <div className="score-label">ציון ציות כללי</div>
          </div>

          <div className="chart-card full-width">
            <h3>ציות לפי תחום</h3>
            <div className="compliance-bars">
              {data.compliance.byDomain.map((item, idx) => {
                const domainInfo = SAFETY_DOMAINS[item.domain as keyof typeof SAFETY_DOMAINS];
                return (
                  <div key={idx} className="compliance-bar-row">
                    <span className="domain-name">
                      {domainInfo?.icon} {domainInfo?.name || item.domain}
                    </span>
                    <div className="compliance-bar-container">
                      <div 
                        className={`compliance-bar ${item.score >= 80 ? 'good' : item.score >= 60 ? 'medium' : 'poor'}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="compliance-score-value">{item.score}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="chart-card full-width">
            <h3>מגמת ציות</h3>
            <div className="trend-chart">
              {data.compliance.trend.map((item, idx) => (
                <div key={idx} className="trend-bar">
                  <div 
                    className="trend-fill"
                    style={{ height: `${item.score}%` }}
                  />
                  <span className="trend-value">{item.score}%</span>
                  <span className="trend-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// 🍩 Donut Chart Component
// ============================================

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  return (
    <div className="donut-chart">
      <svg viewBox="0 0 100 100">
        {data.map((item, idx) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          
          const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
          const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
          const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
          const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          return (
            <path
              key={idx}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={item.color}
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      <div className="donut-legend">
        {data.map((item, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-dot" style={{ background: item.color }}></span>
            <span className="legend-label">{item.label}</span>
            <span className="legend-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 🔧 Helper Functions
// ============================================

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'critical': return '🚨 קריטי';
    case 'major': return '⚠️ משמעותי';
    case 'minor': return '📝 קל';
    case 'observation': return '💡 הערה';
    default: return severity;
  }
}

// ============================================
// 🎨 Styles
// ============================================

export const AnalyticsDashboardStyles = `
.analytics-dashboard {
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-title h2 {
  margin: 0;
  font-size: 24px;
}

.date-range {
  font-size: 14px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.range-selector {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d1d5db;
}

.range-selector button {
  padding: 8px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.range-selector button.active {
  background: #3b82f6;
  color: white;
}

.export-buttons {
  display: flex;
  gap: 8px;
}

.export-buttons button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
}

/* Tabs */
.dashboard-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  background: white;
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
}

.dashboard-tabs button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.dashboard-tabs button.active {
  background: #3b82f6;
  color: white;
}

/* KPI Cards */
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: relative;
}

.kpi-card.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.kpi-card.highlight {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.kpi-icon {
  font-size: 32px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
}

.kpi-label {
  font-size: 14px;
  opacity: 0.8;
}

.kpi-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(255,255,255,0.2);
}

.kpi-badge.success { background: #dcfce7; color: #166534; }
.kpi-badge.danger { background: #fee2e2; color: #991b1b; }

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-card h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 20px 0;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bars {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 150px;
}

.bar {
  width: 20px;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.bar.passed { background: #22c55e; }
.bar.failed { background: #ef4444; }

.bar-label {
  font-size: 12px;
  color: #6b7280;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.legend-item .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.passed { background: #22c55e; }
.dot.failed { background: #ef4444; }

/* Donut Chart */
.donut-chart-container {
  display: flex;
  justify-content: center;
}

.donut-chart {
  display: flex;
  align-items: center;
  gap: 24px;
}

.donut-chart svg {
  width: 150px;
  height: 150px;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.donut-legend .legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.donut-legend .legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.donut-legend .legend-value {
  margin-right: auto;
  font-weight: 500;
}

/* Tables */
.tables-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.table-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table-card h3 {
  margin: 0 0 16px;
  font-size: 16px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
}

.table-card th,
.table-card td {
  padding: 10px;
  text-align: right;
  border-bottom: 1px solid #e5e7eb;
}

.table-card th {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
}

.rate-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.rate-badge.high { background: #dcfce7; color: #166534; }
.rate-badge.medium { background: #fef3c7; color: #92400e; }
.rate-badge.low { background: #fee2e2; color: #991b1b; }

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-box.success { border-top: 4px solid #22c55e; }
.stat-box.warning { border-top: 4px solid #f59e0b; }
.stat-box.danger { border-top: 4px solid #ef4444; }

.stat-value.large {
  font-size: 36px;
  font-weight: 700;
}

/* Horizontal Bars */
.horizontal-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.h-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.h-bar-label {
  min-width: 100px;
  font-size: 14px;
}

.h-bar-container {
  flex: 1;
  height: 24px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.h-bar {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s;
}

.h-bar.severity-critical { background: #dc2626; }
.h-bar.severity-major { background: #f97316; }
.h-bar.severity-minor { background: #eab308; }
.h-bar.severity-observation { background: #3b82f6; }

.h-bar-value {
  min-width: 40px;
  text-align: left;
  font-weight: 500;
}

/* Compliance Score */
.compliance-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.score-circle {
  position: relative;
  width: 200px;
  height: 200px;
}

.score-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-circle circle {
  fill: none;
  stroke-width: 8;
}

.score-circle .bg {
  stroke: #e5e7eb;
}

.score-circle .progress {
  stroke: #22c55e;
  stroke-linecap: round;
}

.score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: 700;
}

.score-label {
  margin-top: 12px;
  font-size: 16px;
  color: #6b7280;
}

/* Compliance Bars */
.compliance-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.compliance-bar-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.domain-name {
  min-width: 150px;
  font-size: 14px;
}

.compliance-bar-container {
  flex: 1;
  height: 24px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.compliance-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.compliance-bar.good { background: #22c55e; }
.compliance-bar.medium { background: #f59e0b; }
.compliance-bar.poor { background: #ef4444; }

.compliance-score-value {
  min-width: 50px;
  font-weight: 600;
}

/* Trend Chart */
.trend-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding: 20px 0;
}

.trend-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
}

.trend-fill {
  width: 40px;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px 4px 0 0;
}

.trend-value {
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
}

.trend-label {
  font-size: 11px;
  color: #6b7280;
}

/* Loading */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: white;
  border-radius: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
  
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .donut-chart {
    flex-direction: column;
  }
}
`;

export default AnalyticsDashboard;
