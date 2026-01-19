import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Eye,
  Filter
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  score?: number; // Intelligence score out of 100
  glowColor?: string;
}

interface ActivityItem {
  id: string;
  type: 'lead' | 'safety' | 'equipment' | 'opportunity';
  title: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

const DashboardBI: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  const [recentActivity] = useState<ActivityItem[]>([
    { id: '1', type: 'lead', title: 'ליד חדש: חברת טכנולוגיה בע״מ', time: 'לפני 5 דקות', status: 'success' },
    { id: '2', type: 'safety', title: 'ממצא בטיחות דורש תשומת לב', time: 'לפני 12 דקות', status: 'warning' },
    { id: '3', type: 'equipment', title: 'בדיקת ציוד הושלמה בהצלחה', time: 'לפני 23 דקות', status: 'success' },
    { id: '4', type: 'opportunity', title: 'הזדמנות חדשה בשווי ₪50,000', time: 'לפני שעה', status: 'info' },
  ]);

  const intelligenceMetrics: MetricCardProps[] = [
    {
      title: 'Lead Intelligence',
      value: '94',
      score: 94,
      icon: Target,
      trend: 'up',
      change: 12,
      changeLabel: 'מהשבוע שעבר',
      glowColor: 'rgba(0,216,255,0.6)'
    },
    {
      title: 'Safety Score',
      value: '87',
      score: 87,
      icon: Shield,
      trend: 'up',
      change: 5,
      changeLabel: 'שיפור מתמשך',
      glowColor: 'rgba(16,185,129,0.6)'
    },
    {
      title: 'Equipment Health',
      value: '92',
      score: 92,
      icon: Activity,
      trend: 'neutral',
      change: 0,
      changeLabel: 'יציב',
      glowColor: 'rgba(59,130,246,0.6)'
    },
    {
      title: 'Revenue Growth',
      value: '₪2.4M',
      score: 78,
      icon: DollarSign,
      trend: 'up',
      change: 18,
      changeLabel: 'צמיחה רבעונית',
      glowColor: 'rgba(251,191,36,0.6)'
    }
  ];

  const kpiCards = [
    { title: 'לידים פעילים', value: '247', change: '+23%', icon: Users, color: '#00D8FF' },
    { title: 'לקוחות', value: '89', change: '+12%', icon: Building2, color: '#10B981' },
    { title: 'ממצאים פתוחים', value: '34', change: '-8%', icon: AlertTriangle, color: '#F59E0B' },
    { title: 'משימות היום', value: '12', change: '5 הושלמו', icon: CheckCircle, color: '#8B5CF6' },
  ];

  const IntelligenceCard: React.FC<MetricCardProps> = ({
    title,
    value,
    score,
    icon: Icon,
    trend,
    change,
    changeLabel,
    glowColor
  }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (score! / 100) * circumference;

    return (
      <div 
        className="relative bg-[#1C2435] rounded-2xl p-6 border border-[rgba(0,216,255,0.2)] overflow-hidden group hover:border-[rgba(0,216,255,0.5)] transition-all duration-300"
        style={{
          boxShadow: `0 0 30px ${glowColor?.replace('0.6', '0.15')}`
        }}
      >
        {/* Background Glow Effect */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500"
          style={{ backgroundColor: glowColor }}
        ></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[#A9B3C1] text-sm font-medium mb-1">{title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{value}</span>
                {typeof score === 'number' && (
                  <span className="text-[#00D8FF] text-lg font-semibold">/100</span>
                )}
              </div>
            </div>

            {/* Circular Progress */}
            {typeof score === 'number' && (
              <div className="relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="45"
                    stroke="rgba(0,216,255,0.1)"
                    strokeWidth="6"
                    fill="none"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="45"
                    stroke={glowColor}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{
                      filter: `drop-shadow(0 0 6px ${glowColor})`
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon size={24} className="text-[#00D8FF]" style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }} />
                </div>
              </div>
            )}
          </div>

          {/* Trend Indicator */}
          {change !== undefined && (
            <div className="flex items-center gap-2">
              {trend === 'up' && (
                <div className="flex items-center gap-1 text-[#10B981] bg-[rgba(16,185,129,0.1)] px-2 py-1 rounded-lg">
                  <ArrowUpRight size={16} />
                  <span className="text-sm font-bold">+{change}%</span>
                </div>
              )}
              {trend === 'down' && (
                <div className="flex items-center gap-1 text-[#EF4444] bg-[rgba(239,68,68,0.1)] px-2 py-1 rounded-lg">
                  <ArrowDownRight size={16} />
                  <span className="text-sm font-bold">{change}%</span>
                </div>
              )}
              {trend === 'neutral' && (
                <div className="flex items-center gap-1 text-[#6B7C93] bg-[rgba(107,124,147,0.1)] px-2 py-1 rounded-lg">
                  <span className="text-sm font-bold">—</span>
                </div>
              )}
              <span className="text-[#6B7C93] text-xs">{changeLabel}</span>
            </div>
          )}
        </div>

        {/* Bottom Glow Line */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
          style={{
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`
          }}
        ></div>
      </div>
    );
  };

  const KPICard: React.FC<{
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-[#1C2435] rounded-xl p-5 border border-[rgba(0,216,255,0.15)] hover:border-[rgba(0,216,255,0.3)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ 
            backgroundColor: `${color}15`,
            boxShadow: `0 0 20px ${color}30`
          }}
        >
          <Icon size={24} style={{ color }} />
        </div>
        <span className="text-[#10B981] text-xs font-semibold bg-[rgba(16,185,129,0.1)] px-2 py-1 rounded-lg">
          {change}
        </span>
      </div>
      <p className="text-[#A9B3C1] text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );

  const ActivityCard: React.FC = () => {
    const getStatusColor = (status: ActivityItem['status']) => {
      switch (status) {
        case 'success': return '#10B981';
        case 'warning': return '#F59E0B';
        case 'error': return '#EF4444';
        case 'info': return '#00D8FF';
        default: return '#6B7C93';
      }
    };

    const getTypeIcon = (type: ActivityItem['type']) => {
      switch (type) {
        case 'lead': return Target;
        case 'safety': return Shield;
        case 'equipment': return Activity;
        case 'opportunity': return Zap;
        default: return Activity;
      }
    };

    return (
      <div className="bg-[#1C2435] rounded-2xl p-6 border border-[rgba(0,216,255,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-lg font-bold flex items-center gap-2">
            <Activity size={20} className="text-[#00D8FF]" />
            פעילות אחרונה
          </h3>
          <button className="text-[#00D8FF] text-sm hover:underline flex items-center gap-1">
            <Eye size={16} />
            הצג הכל
          </button>
        </div>

        <div className="space-y-3">
          {recentActivity.map((item) => {
            const Icon = getTypeIcon(item.type);
            const statusColor = getStatusColor(item.status);

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(14,26,53,0.5)] border border-[rgba(0,216,255,0.1)] hover:border-[rgba(0,216,255,0.3)] transition-all cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${statusColor}15` }}
                >
                  <Icon size={18} style={{ color: statusColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.title}</p>
                  <p className="text-[#6B7C93] text-xs">{item.time}</p>
                </div>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ 
                    backgroundColor: statusColor,
                    boxShadow: `0 0 8px ${statusColor}`
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-[#0E1A35] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D8FF] flex items-center justify-center shadow-[0_0_20px_rgba(0,216,255,0.5)]">
              <BarChart3 size={24} className="text-[#0E1A35]" />
            </div>
            Cortex BI Intelligence Dashboard
          </h1>
          <p className="text-[#A9B3C1]">מערכת אינטליגנציה עסקית מתקדמת</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-2 bg-[#1C2435] rounded-xl p-1 border border-[rgba(0,216,255,0.2)]">
          {(['today', 'week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-[#00D8FF] text-[#0E1A35] shadow-[0_0_15px_rgba(0,216,255,0.4)]'
                  : 'text-[#A9B3C1] hover:text-white'
              }`}
            >
              {range === 'today' && 'היום'}
              {range === 'week' && 'שבוע'}
              {range === 'month' && 'חודש'}
              {range === 'quarter' && 'רבעון'}
            </button>
          ))}
        </div>
      </div>

      {/* Intelligence Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {intelligenceMetrics.map((metric, index) => (
          <IntelligenceCard key={index} {...metric} />
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#1C2435] rounded-2xl p-6 border border-[rgba(0,216,255,0.2)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white text-lg font-bold flex items-center gap-2">
              <PieChart size={20} className="text-[#00D8FF]" />
              ניתוח ביצועים
            </h3>
            <button className="text-[#A9B3C1] hover:text-[#00D8FF] p-2 rounded-lg hover:bg-[rgba(0,216,255,0.1)] transition-all">
              <Filter size={18} />
            </button>
          </div>
          
          {/* Placeholder for Chart */}
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-[rgba(0,216,255,0.2)] rounded-xl">
            <div className="text-center">
              <BarChart3 size={48} className="text-[#00D8FF] mx-auto mb-2 opacity-50" />
              <p className="text-[#6B7C93]">תרשים אינטראקטיבי יוטמע כאן</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <ActivityCard />
      </div>

      {/* Bottom Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1C2435] rounded-xl p-5 border border-[rgba(0,216,255,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#A9B3C1] text-sm">שיעור המרה</p>
            <TrendingUp size={18} className="text-[#10B981]" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">34.2%</p>
          <p className="text-[#10B981] text-sm">+5.4% מהחודש שעבר</p>
        </div>

        <div className="bg-[#1C2435] rounded-xl p-5 border border-[rgba(0,216,255,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#A9B3C1] text-sm">זמן תגובה ממוצע</p>
            <Clock size={18} className="text-[#00D8FF]" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">2.4h</p>
          <p className="text-[#00D8FF] text-sm">-18% שיפור</p>
        </div>

        <div className="bg-[#1C2435] rounded-xl p-5 border border-[rgba(0,216,255,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#A9B3C1] text-sm">שביעות רצון</p>
            <CheckCircle size={18} className="text-[#10B981]" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">4.8/5</p>
          <p className="text-[#10B981] text-sm">מצוין ביותר</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardBI;
