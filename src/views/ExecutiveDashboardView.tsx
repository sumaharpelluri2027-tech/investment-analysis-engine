import React, { useState, useMemo } from 'react';
import { FlowStep } from '../types';
import { SideNav } from '../components/SideNav';
import { TopNav } from '../components/TopNav';
import { HistoricalTrendChart } from '../components/HistoricalTrendChart';
import { RiskRewardMatrix } from '../components/RiskRewardMatrix';
import { CompareCompaniesPanel } from '../components/CompareCompaniesPanel';
import { SectorRiskHeatmap } from '../components/SectorRiskHeatmap';

interface ExecutiveDashboardViewProps {
  objectiveTitle?: string;
  onInspectAI: () => void;
  onExportMemo: () => void;
  onNavigate: (step: FlowStep) => void;
}

interface AnalyzedMetricItem {
  id: string;
  title: string;
  value: string;
  change: string;
  subtext: string;
  category: 'metric' | 'financial';
  icon: string;
  tags: string[];
}

interface AnalyzedRiskItem {
  id: string;
  title: string;
  type: 'Warning' | 'Opportunity' | 'Info';
  description: string;
  impactScore: string;
  tags: string[];
}

const DASHBOARD_METRICS: AnalyzedMetricItem[] = [
  {
    id: 'nrr',
    title: 'Net Revenue Retention',
    value: '124.2%',
    change: '+6.2% YoY',
    subtext: 'Top quartile enterprise SaaS expansion',
    category: 'metric',
    icon: 'trending_up',
    tags: ['nrr', 'retention', 'expansion', 'revenue', 'saas'],
  },
  {
    id: 'arr',
    title: 'ARR Run Rate',
    value: '$42.5M',
    change: '+34.8% YoY',
    subtext: 'Sustained top-decile growth trajectory',
    category: 'financial',
    icon: 'attach_money',
    tags: ['arr', 'recurring revenue', 'growth', 'financials', 'sales'],
  },
  {
    id: 'churn',
    title: 'Annual Logo Churn',
    value: '1.8%',
    change: '-0.4% YoY',
    subtext: 'Low contract attrition and high stickiness',
    category: 'metric',
    icon: 'trending_down',
    tags: ['churn', 'attrition', 'logo churn', 'retention', 'customers'],
  },
  {
    id: 'margin',
    title: 'Gross Profit Margin',
    value: '82.4%',
    change: '+2.1% YoY',
    subtext: 'High operating leverage and software unit economics',
    category: 'financial',
    icon: 'bar_chart',
    tags: ['gross margin', 'margin', 'profitability', 'cogs'],
  },
  {
    id: 'rule40',
    title: 'Rule of 40 Score',
    value: '49.3%',
    change: '+8.4% YoY',
    subtext: 'Combined growth (34.8%) + EBITDA margin (14.5%)',
    category: 'financial',
    icon: 'verified',
    tags: ['rule of 40', 'ebitda', 'efficiency', 'benchmark'],
  },
  {
    id: 'burn',
    title: 'Capital Burn Multiple',
    value: '0.8x',
    change: '-0.2x YoY',
    subtext: 'Top 5th percentile capital efficiency',
    category: 'metric',
    icon: 'hourglass_bottom',
    tags: ['burn', 'runway', 'capital efficiency', 'cash flow'],
  },
];

const DASHBOARD_RISKS: AnalyzedRiskItem[] = [
  {
    id: 'risk_sales_cycle',
    title: 'Sales Cycle Elongation',
    type: 'Warning',
    description: 'Average enterprise close time lengthened from 45 to 62 days in Q3 due to procurement friction and multi-tier security reviews.',
    impactScore: 'Medium Risk',
    tags: ['sales cycle', 'procurement', 'delay', 'close rate', 'pipeline', 'risk'],
  },
  {
    id: 'opp_expansion',
    title: 'Expansion Opportunity',
    type: 'Opportunity',
    description: '78% of Fortune 500 accounts added secondary module add-ons within 6 months of initial landing.',
    impactScore: 'High Upside',
    tags: ['expansion', 'upsell', 'fortune 500', 'land and expand', 'opportunity'],
  },
  {
    id: 'info_burn',
    title: 'Capital Efficiency Benchmark',
    type: 'Info',
    description: 'Burn Multiple sits at 0.8x, placing company in top 5th percentile for Rule of 40 growth equity performance.',
    impactScore: 'Top Efficiency',
    tags: ['burn multiple', 'efficiency', 'rule of 40', 'capital'],
  },
  {
    id: 'risk_concentration',
    title: 'Customer Concentration Buffer',
    type: 'Info',
    description: 'Top 3 accounts represent 18.5% of total ARR, well within the institutional risk safety threshold (<25%).',
    impactScore: 'Low Risk',
    tags: ['concentration', 'top accounts', 'arr risk', 'customer dependence'],
  },
  {
    id: 'risk_talent',
    title: 'VP Engineering Vesting Cliff',
    type: 'Warning',
    description: 'Key technical founding leader approaches 4-year vesting cliff in Q4 2026; retention equity package recommended.',
    impactScore: 'Talent Risk',
    tags: ['talent', 'vesting', 'retention', 'headcount', 'key person'],
  },
  {
    id: 'opp_sec',
    title: 'SOC2 Type II & FedRAMP Readiness',
    type: 'Opportunity',
    description: 'Fully audited SOC2 Type II compliance opens federal and regulated healthcare enterprise expansion pathways.',
    impactScore: 'High Upside',
    tags: ['compliance', 'soc2', 'fedramp', 'security', 'enterprise'],
  },
];

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  objectiveTitle = 'Investment Screening',
  onInspectAI,
  onExportMemo,
  onNavigate,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'Q3' | 'FY25' | 'TTM'>('TTM');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'metrics' | 'risks' | 'opportunities'>('all');
  const [isComparePanelOpen, setIsComparePanelOpen] = useState(false);

  const filteredMetrics = useMemo(() => {
    return DASHBOARD_METRICS.filter((metric) => {
      if (activeCategoryFilter === 'risks' || activeCategoryFilter === 'opportunities') return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        metric.title.toLowerCase().includes(q) ||
        metric.value.toLowerCase().includes(q) ||
        metric.subtext.toLowerCase().includes(q) ||
        metric.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategoryFilter]);

  const filteredRisks = useMemo(() => {
    return DASHBOARD_RISKS.filter((risk) => {
      if (activeCategoryFilter === 'metrics') return false;
      if (activeCategoryFilter === 'risks' && risk.type !== 'Warning') return false;
      if (activeCategoryFilter === 'opportunities' && risk.type !== 'Opportunity') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        risk.title.toLowerCase().includes(q) ||
        risk.description.toLowerCase().includes(q) ||
        risk.impactScore.toLowerCase().includes(q) ||
        risk.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategoryFilter]);

  const totalMatchesCount = filteredMetrics.length + filteredRisks.length;

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#121414] text-[#e2e2e2]">
      <SideNav currentStep="executive_dashboard" onNavigate={onNavigate} />
      <TopNav
        currentStep="executive_dashboard"
        onNavigate={onNavigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1 md:ml-64 mt-16 p-container-padding overflow-y-auto custom-scrollbar relative">
        <div className="max-w-6xl mx-auto space-y-stack-lg pb-stack-lg">
          {/* Top Banner / Verdict Bar */}
          <div className="glass-panel rounded-xl p-6 border-l-4 border-l-[#4edea3] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-[#Hanken Grotesk] font-bold text-2xl text-[#e2e2e2]">
                  Nexus Technologies Group
                </span>
                <span className="font-[#Geist] text-xs px-2.5 py-0.5 rounded bg-[#1E293B] text-[#c6c6cb] border border-[#45474b]">
                  NTG • Enterprise SaaS
                </span>
                <span className="buy-badge font-[#Geist] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">recommend</span>
                  AI Verdict: BUY
                </span>
              </div>
              <p className="font-[#Inter] text-xs text-[#c6c6cb]">
                Framework: <span className="text-[#e2e2e2] font-semibold">{objectiveTitle}</span> • Confidence Score: <span className="text-[#4edea3] font-bold">94%</span> (High Model Agreement)
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsComparePanelOpen(true)}
                className="bg-[#282a2b] border border-[#4edea3]/40 text-[#4edea3] hover:bg-[#4edea3] hover:text-[#003824] px-4 py-2.5 rounded font-[#Geist] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                <span>Compare Companies</span>
              </button>
              <button
                onClick={onInspectAI}
                className="bg-[#282a2b] border border-[#45474b] text-[#e2e2e2] hover:bg-[#333535] px-4 py-2.5 rounded font-[#Geist] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#4edea3]">psychology</span>
                <span>Explain AI Reasoning</span>
              </button>
              <button
                onClick={onExportMemo}
                className="bg-white text-[#0B0E14] font-[#Hanken Grotesk] font-bold text-xs px-5 py-2.5 rounded hover:bg-[#4edea3] hover:text-[#003824] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                <span>Export Memo</span>
              </button>
            </div>
          </div>

          {/* Interactive Search & Filter Bar */}
          <div className="glass-panel rounded-xl p-4 space-y-3 border border-[#1E293B]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Search Field Input */}
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4edea3] text-base">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by metric name, risk factor, keyword (e.g. ARR, Churn, Sales Cycle, Margin, Vesting)..."
                  className="w-full bg-[#0b0e14] border border-[#45474b] focus:border-[#4edea3] rounded-lg py-2.5 pl-10 pr-10 text-xs font-[#Geist] text-[#e2e2e2] placeholder:text-[#909095] outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#909095] hover:text-[#e2e2e2] text-xs cursor-pointer p-1"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'metrics', label: 'Key Metrics' },
                  { id: 'risks', label: 'Flagged Risks' },
                  { id: 'opportunities', label: 'Opportunities' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-[#Geist] font-semibold transition-all cursor-pointer ${
                      activeCategoryFilter === cat.id
                        ? 'bg-[#4edea3] text-[#003824] shadow'
                        : 'bg-[#0b0e14] border border-[#1E293B] text-[#c6c6cb] hover:text-[#e2e2e2]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Search Feedback Status */}
            {(searchQuery.trim() !== '' || activeCategoryFilter !== 'all') && (
              <div className="flex justify-between items-center text-xs font-[#Geist] text-[#c6c6cb] pt-1 border-t border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#4edea3]">filter_alt</span>
                  <span>
                    Showing <strong className="text-[#4edea3]">{totalMatchesCount}</strong> matching telemetry items
                    {searchQuery ? ` for "${searchQuery}"` : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategoryFilter('all');
                  }}
                  className="text-[#909095] hover:text-[#4edea3] underline text-[11px] cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* KPI Cards Grid */}
          {filteredMetrics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredMetrics.map((metric) => (
                <div key={metric.id} className="insight-card rounded-xl p-5 flex flex-col justify-between hover:border-[#4edea3]/40 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-[#Geist] text-xs text-[#c6c6cb] uppercase tracking-wider">
                      {metric.title}
                    </span>
                    <span className="material-symbols-outlined text-[#4edea3] text-sm">{metric.icon}</span>
                  </div>
                  <div className="text-3xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2] mb-1">
                    {metric.value}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-[#Geist] text-[#4edea3]">
                    <span>{metric.change}</span>
                    <span className="text-[#909095]">• {metric.subtext}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery || activeCategoryFilter !== 'all' ? (
            <div className="p-6 rounded-xl bg-[#0b0e14] border border-[#1E293B] text-center text-xs font-[#Geist] text-[#909095]">
              No financial metrics match your current filter query.
            </div>
          ) : null}

          {/* 5-Year Historical Financial Telemetry (Recharts Visualization) */}
          <HistoricalTrendChart />

          {/* Visual 2x2 Risk-Reward Matrix (Recharts Scatter) */}
          <RiskRewardMatrix />

          {/* Main Content Split: Chart & Risk Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Chart Container */}
            <div className="lg:col-span-7 glass-panel rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                      Quarterly ARR Trajectory & Forecast
                    </h3>
                    <p className="text-body-md text-[#c6c6cb]">Historical performance vs. AI projection model</p>
                  </div>
                  <div className="flex gap-1 p-1 bg-[#0b0e14] rounded border border-[#1E293B]">
                    {(['Q3', 'FY25', 'TTM'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`px-3 py-1 rounded font-[#Geist] text-[11px] transition-colors ${
                          selectedTimeframe === tf
                            ? 'bg-[#282a2b] text-[#4edea3] font-bold'
                            : 'text-[#c6c6cb] hover:text-[#e2e2e2]'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Visual Chart */}
                <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 relative border-b border-[#1E293B]">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-0 border-t border-[#1E293B]/40"></div>
                  <div className="absolute inset-x-0 top-1/2 border-t border-[#1E293B]/40"></div>

                  {[
                    { label: 'Q1 2025', val: 24, amount: '$24.1M' },
                    { label: 'Q2 2025', val: 28, amount: '$28.4M' },
                    { label: 'Q3 2025', val: 33, amount: '$33.0M' },
                    { label: 'Q4 2025', val: 38, amount: '$38.2M' },
                    { label: 'Q1 2026 (P)', val: 42.5, amount: '$42.5M', projected: true },
                    { label: 'Q2 2026 (P)', val: 48, amount: '$48.0M', projected: true },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative z-10">
                      <div className="text-[10px] font-[#Geist] text-[#c6c6cb] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.amount}
                      </div>
                      <div
                        className={`w-full max-w-[40px] rounded-t transition-all duration-300 ${
                          item.projected
                            ? 'bg-gradient-to-t from-[#4edea3]/40 to-[#4edea3] border-t-2 border-[#6ffbbe]'
                            : 'bg-[#282a2b] group-hover:bg-[#3a4a5f]'
                        }`}
                        style={{ height: `${(item.val / 50) * 100}%` }}
                      ></div>
                      <span className="font-[#Geist] text-[10px] text-[#909095] mt-2 block whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-[#c6c6cb] font-[#Geist]">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]"></span>
                  AI Projected Growth (34.8% CAGR)
                </span>
                <span className="text-[#909095]">Source: Model v2.4 Multi-Factor Ingestion</span>
              </div>
            </div>

            {/* Risk & Opportunity Audit Panel */}
            <div className="lg:col-span-5 glass-panel rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                    Risk & Opportunity Audit
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-[#1E293B] text-[#4edea3] text-[10px] font-[#Geist]">
                    {filteredRisks.length} Items Visible
                  </span>
                </div>

                {filteredRisks.length > 0 ? (
                  <div className="space-y-3">
                    {filteredRisks.map((risk) => (
                      <div key={risk.id} className="p-3 rounded bg-[#0b0e14] border border-[#1E293B] hover:border-[#4edea3]/40 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-[#Geist] text-xs font-semibold text-[#e2e2e2]">
                            {risk.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                              risk.type === 'Warning'
                                ? 'bg-[#FBBC05]/10 text-[#FBBC05] border border-[#FBBC05]/20'
                                : risk.type === 'Opportunity'
                                ? 'bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20'
                                : 'bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20'
                            }`}
                          >
                            {risk.type}
                          </span>
                        </div>
                        <p className="font-[#Inter] text-[11px] text-[#c6c6cb]">
                          {risk.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded bg-[#0b0e14] border border-[#1E293B] text-center text-xs font-[#Geist] text-[#909095]">
                    No risks or opportunities match "{searchQuery}".
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E293B] flex justify-between items-center">
                <button
                  onClick={onInspectAI}
                  className="text-xs text-[#4edea3] hover:underline font-[#Geist] flex items-center gap-1 cursor-pointer"
                >
                  Deep Dive Explainable AI →
                </button>
              </div>
            </div>
          </div>

          {/* D3 Cross-Sector Risk Heatmap Section */}
          <SectorRiskHeatmap />
        </div>
      </main>

      {/* Compare Companies Side Panel Drawer */}
      <CompareCompaniesPanel
        isOpen={isComparePanelOpen}
        onClose={() => setIsComparePanelOpen(false)}
      />
    </div>
  );
};

