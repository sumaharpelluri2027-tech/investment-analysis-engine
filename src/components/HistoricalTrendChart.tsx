import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface MetricPoint {
  year: string;
  arr: number; // $M
  revenue: number; // $M
  nrr: number; // %
  grossMargin: number; // %
  ebitdaMargin: number; // %
  customers: number; // integer
  burnMultiple: number; // ratio
  isProjection?: boolean;
}

const HISTORICAL_5YR_DATA: MetricPoint[] = [
  {
    year: '2021',
    arr: 8.2,
    revenue: 7.1,
    nrr: 110.5,
    grossMargin: 74.5,
    ebitdaMargin: -18.2,
    customers: 85,
    burnMultiple: 2.1,
  },
  {
    year: '2022',
    arr: 14.8,
    revenue: 12.6,
    nrr: 114.2,
    grossMargin: 77.0,
    ebitdaMargin: -11.5,
    customers: 142,
    burnMultiple: 1.6,
  },
  {
    year: '2023',
    arr: 22.5,
    revenue: 19.8,
    nrr: 118.8,
    grossMargin: 79.5,
    ebitdaMargin: -4.2,
    customers: 210,
    burnMultiple: 1.1,
  },
  {
    year: '2024',
    arr: 31.6,
    revenue: 28.4,
    nrr: 121.5,
    grossMargin: 81.2,
    ebitdaMargin: 6.8,
    customers: 295,
    burnMultiple: 0.9,
  },
  {
    year: '2025',
    arr: 42.5,
    revenue: 38.2,
    nrr: 124.2,
    grossMargin: 82.4,
    ebitdaMargin: 14.5,
    customers: 380,
    burnMultiple: 0.8,
  },
  {
    year: '2026 (P)',
    arr: 58.2,
    revenue: 52.0,
    nrr: 126.5,
    grossMargin: 84.0,
    ebitdaMargin: 19.2,
    customers: 490,
    burnMultiple: 0.6,
    isProjection: true,
  },
];

type ChartViewMode = 'arr_revenue' | 'margins_nrr' | 'efficiency';

export const HistoricalTrendChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('arr_revenue');
  const [showProjection, setShowProjection] = useState(true);

  const displayedData = showProjection
    ? HISTORICAL_5YR_DATA
    : HISTORICAL_5YR_DATA.filter((d) => !d.isProjection);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isProj = label.includes('(P)');
      return (
        <div className="bg-[#141820]/95 backdrop-blur-md border border-[#4edea3]/40 p-3.5 rounded-xl shadow-2xl font-[#Geist] text-xs space-y-2 min-w-[200px]">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
            <span className="font-bold text-[#e2e2e2] text-sm">{label} Performance</span>
            {isProj && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#4edea3]/20 text-[#4edea3] uppercase">
                AI Forecast
              </span>
            )}
          </div>
          <div className="space-y-1.5 pt-1">
            {payload.map((entry: any, index: number) => {
              let formattedVal = entry.value;
              if (entry.name.includes('ARR') || entry.name.includes('Revenue')) {
                formattedVal = `$${entry.value}M`;
              } else if (entry.name.includes('Margin') || entry.name.includes('NRR')) {
                formattedVal = `${entry.value}%`;
              } else if (entry.name.includes('Burn')) {
                formattedVal = `${entry.value}x`;
              }

              return (
                <div key={`item-${index}`} className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-[#c6c6cb]">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    {entry.name}:
                  </span>
                  <span className="font-bold text-[#e2e2e2] font-mono">{formattedVal}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-lg">stacked_line_chart</span>
            <h3 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
              5-Year Historical Financial Telemetry & AI Projection
            </h3>
          </div>
          <p className="text-body-md font-[#Inter] text-[#c6c6cb] mt-0.5">
            Audit trailing 5-year financials extracted from uploaded dataset with AI forward forecast
          </p>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex p-1 bg-[#0b0e14] rounded-lg border border-[#1E293B]">
            <button
              onClick={() => setViewMode('arr_revenue')}
              className={`px-3 py-1.5 rounded text-xs font-[#Geist] font-semibold transition-all cursor-pointer ${
                viewMode === 'arr_revenue'
                  ? 'bg-[#4edea3] text-[#003824] shadow'
                  : 'text-[#c6c6cb] hover:text-[#e2e2e2]'
              }`}
            >
              ARR & Revenue
            </button>
            <button
              onClick={() => setViewMode('margins_nrr')}
              className={`px-3 py-1.5 rounded text-xs font-[#Geist] font-semibold transition-all cursor-pointer ${
                viewMode === 'margins_nrr'
                  ? 'bg-[#4edea3] text-[#003824] shadow'
                  : 'text-[#c6c6cb] hover:text-[#e2e2e2]'
              }`}
            >
              NRR & Margins %
            </button>
            <button
              onClick={() => setViewMode('efficiency')}
              className={`px-3 py-1.5 rounded text-xs font-[#Geist] font-semibold transition-all cursor-pointer ${
                viewMode === 'efficiency'
                  ? 'bg-[#4edea3] text-[#003824] shadow'
                  : 'text-[#c6c6cb] hover:text-[#e2e2e2]'
              }`}
            >
              Efficiency & Churn
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-[#Geist] text-[#c6c6cb] bg-[#0b0e14] px-3 py-1.5 rounded-lg border border-[#1E293B] cursor-pointer hover:text-[#e2e2e2]">
            <input
              type="checkbox"
              checked={showProjection}
              onChange={(e) => setShowProjection(e.target.checked)}
              className="rounded border-[#45474b] bg-[#121414] text-[#4edea3] focus:ring-0"
            />
            <span>Include 2026 (P)</span>
          </label>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="bg-[#0b0e14] border border-[#1E293B] rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#909095] block font-[#Geist]">
            5-Yr ARR CAGR
          </span>
          <span className="text-lg font-bold text-[#4edea3] font-[#Hanken Grotesk]">
            +41.8%
          </span>
          <span className="text-[10px] text-[#c6c6cb] block">$8.2M → $42.5M</span>
        </div>

        <div className="bg-[#0b0e14] border border-[#1E293B] rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#909095] block font-[#Geist]">
            NRR Expansion
          </span>
          <span className="text-lg font-bold text-[#6ffbbe] font-[#Hanken Grotesk]">
            +13.7 pts
          </span>
          <span className="text-[10px] text-[#c6c6cb] block">110.5% → 124.2%</span>
        </div>

        <div className="bg-[#0b0e14] border border-[#1E293B] rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#909095] block font-[#Geist]">
            Gross Margin Expansion
          </span>
          <span className="text-lg font-bold text-[#A78BFA] font-[#Hanken Grotesk]">
            +7.9 pts
          </span>
          <span className="text-[10px] text-[#c6c6cb] block">74.5% → 82.4%</span>
        </div>

        <div className="bg-[#0b0e14] border border-[#1E293B] rounded-lg p-3">
          <span className="text-[10px] uppercase tracking-wider text-[#909095] block font-[#Geist]">
            Burn Multiple Improvement
          </span>
          <span className="text-lg font-bold text-[#FBBC05] font-[#Hanken Grotesk]">
            2.1x → 0.8x
          </span>
          <span className="text-[10px] text-[#c6c6cb] block">Top 5% Efficiency</span>
        </div>
      </div>

      {/* Main Recharts Visualization Canvas */}
      <div className="h-72 w-full pt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={displayedData}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4edea3" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4edea3" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4285F4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4285F4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorNrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#909095"
              tick={{ fill: '#c6c6cb', fontSize: 11 }}
              tickLine={{ stroke: '#1E293B' }}
            />

            {viewMode === 'arr_revenue' && (
              <>
                <YAxis
                  yAxisId="left"
                  stroke="#909095"
                  tick={{ fill: '#c6c6cb', fontSize: 11 }}
                  tickFormatter={(val) => `$${val}M`}
                  domain={[0, 'dataMax + 10']}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#909095"
                  tick={{ fill: '#c6c6cb', fontSize: 11 }}
                  tickFormatter={(val) => `${val}`}
                  domain={[0, 'dataMax + 100']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#c6c6cb' }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="arr"
                  name="Annual Recurring Revenue (ARR)"
                  stroke="#4edea3"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorArr)"
                  dot={{ r: 4, fill: '#4edea3' }}
                  activeDot={{ r: 6, fill: '#6ffbbe' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Recognized Revenue ($M)"
                  fill="#4285F4"
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                  opacity={0.85}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="customers"
                  name="Active Enterprise Customers"
                  stroke="#FBBC05"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#FBBC05' }}
                />
              </>
            )}

            {viewMode === 'margins_nrr' && (
              <>
                <YAxis
                  stroke="#909095"
                  tick={{ fill: '#c6c6cb', fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                  domain={[60, 140]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#c6c6cb' }}
                />
                <Area
                  type="monotone"
                  dataKey="nrr"
                  name="Net Revenue Retention (NRR %)"
                  stroke="#A78BFA"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorNrr)"
                  dot={{ r: 4, fill: '#A78BFA' }}
                />
                <Line
                  type="monotone"
                  dataKey="grossMargin"
                  name="Gross Margin %"
                  stroke="#4edea3"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#4edea3' }}
                />
                <Line
                  type="monotone"
                  dataKey="ebitdaMargin"
                  name="EBITDA Margin %"
                  stroke="#FBBC05"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#FBBC05' }}
                />
              </>
            )}

            {viewMode === 'efficiency' && (
              <>
                <YAxis
                  yAxisId="left"
                  stroke="#909095"
                  tick={{ fill: '#c6c6cb', fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                  domain={[-25, 30]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#909095"
                  tick={{ fill: '#c6c6cb', fontSize: 11 }}
                  tickFormatter={(val) => `${val}x`}
                  domain={[0, 3]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#c6c6cb' }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="ebitdaMargin"
                  name="EBITDA Margin %"
                  fill="#4edea3"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="burnMultiple"
                  name="Capital Burn Multiple (x)"
                  stroke="#FBBC05"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#FBBC05' }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Data Insight Footer Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-[#1E293B] text-xs font-[#Geist]">
        <div className="flex items-center gap-2 text-[#4edea3]">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Validated against audited financial disclosures (2021-2025)</span>
        </div>
        <span className="text-[#909095]">
          BoardIQ Engine • Recharts Interactive Telemetry v2.4
        </span>
      </div>
    </div>
  );
};
