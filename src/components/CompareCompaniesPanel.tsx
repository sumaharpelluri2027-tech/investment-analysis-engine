import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export interface CompanyDataset {
  id: string;
  name: string;
  ticker: string;
  sector: string;
  arr: number; // $M
  revenue: number; // $M
  yoyGrowth: number; // %
  grossMargin: number; // %
  ebitdaMargin: number; // %
  nrr: number; // %
  churn: number; // %
  ltvCac: number; // x
  cacPayback: number; // Months
  burnMultiple: number; // x
  ruleOf40: number; // %
  valuation: number; // $M
  arrMultiple: number; // x
  verdict: 'BUY' | 'HOLD' | 'PASS';
  confidence: number; // %
}

export const COMPANY_DATASETS: CompanyDataset[] = [
  {
    id: 'ntg',
    name: 'Nexus Technologies Group',
    ticker: 'NTG',
    sector: 'Enterprise SaaS & AI',
    arr: 42.5,
    revenue: 38.2,
    yoyGrowth: 34.8,
    grossMargin: 82.4,
    ebitdaMargin: 14.5,
    nrr: 124.2,
    churn: 1.8,
    ltvCac: 4.8,
    cacPayback: 11,
    burnMultiple: 0.8,
    ruleOf40: 49.3,
    valuation: 280,
    arrMultiple: 6.6,
    verdict: 'BUY',
    confidence: 94,
  },
  {
    id: 'csl',
    name: 'CloudScale Logic',
    ticker: 'CSL',
    sector: 'Cloud Optimization',
    arr: 64.2,
    revenue: 58.1,
    yoyGrowth: 38.2,
    grossMargin: 85.0,
    ebitdaMargin: 18.2,
    nrr: 128.5,
    churn: 1.2,
    ltvCac: 5.4,
    cacPayback: 9,
    burnMultiple: 0.6,
    ruleOf40: 56.4,
    valuation: 480,
    arrMultiple: 7.5,
    verdict: 'BUY',
    confidence: 96,
  },
  {
    id: 'csai',
    name: 'CyberShield AI',
    ticker: 'CSAI',
    sector: 'Cybersecurity & SecOps',
    arr: 28.1,
    revenue: 24.8,
    yoyGrowth: 31.0,
    grossMargin: 79.2,
    ebitdaMargin: 8.5,
    nrr: 119.4,
    churn: 2.1,
    ltvCac: 3.9,
    cacPayback: 14,
    burnMultiple: 1.1,
    ruleOf40: 39.5,
    valuation: 195,
    arrMultiple: 6.9,
    verdict: 'BUY',
    confidence: 89,
  },
  {
    id: 'fba',
    name: 'Frontier Bio AI',
    ticker: 'FBA',
    sector: 'HealthTech & BioAI',
    arr: 12.0,
    revenue: 9.8,
    yoyGrowth: 28.0,
    grossMargin: 68.5,
    ebitdaMargin: -12.0,
    nrr: 108.0,
    churn: 3.5,
    ltvCac: 2.5,
    cacPayback: 22,
    burnMultiple: 2.1,
    ruleOf40: 16.0,
    valuation: 85,
    arrMultiple: 7.1,
    verdict: 'HOLD',
    confidence: 62,
  },
  {
    id: 'dpa',
    name: 'DataPulse Analytics',
    ticker: 'DPA',
    sector: 'Data Infrastructure',
    arr: 19.4,
    revenue: 17.2,
    yoyGrowth: 22.5,
    grossMargin: 76.0,
    ebitdaMargin: 2.1,
    nrr: 112.5,
    churn: 2.8,
    ltvCac: 3.1,
    cacPayback: 16,
    burnMultiple: 1.4,
    ruleOf40: 24.6,
    valuation: 110,
    arrMultiple: 5.7,
    verdict: 'HOLD',
    confidence: 76,
  },
  {
    id: 'aqh',
    name: 'Apex Quantum Health',
    ticker: 'AQH',
    sector: 'HealthTech Infrastructure',
    arr: 55.0,
    revenue: 48.5,
    yoyGrowth: 20.0,
    grossMargin: 72.0,
    ebitdaMargin: 11.0,
    nrr: 115.0,
    churn: 2.4,
    ltvCac: 3.6,
    cacPayback: 15,
    burnMultiple: 1.0,
    ruleOf40: 31.0,
    valuation: 320,
    arrMultiple: 5.8,
    verdict: 'HOLD',
    confidence: 72,
  },
];

interface CompareCompaniesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCompanyAId?: string;
  defaultCompanyBId?: string;
}

export const CompareCompaniesPanel: React.FC<CompareCompaniesPanelProps> = ({
  isOpen,
  onClose,
  defaultCompanyAId = 'ntg',
  defaultCompanyBId = 'csl',
}) => {
  const [companyAId, setCompanyAId] = useState(defaultCompanyAId);
  const [companyBId, setCompanyBId] = useState(defaultCompanyBId);
  const [chartMetric, setChartMetric] = useState<'arr' | 'ruleOf40' | 'nrr' | 'grossMargin'>('arr');

  if (!isOpen) return null;

  const companyA = COMPANY_DATASETS.find((c) => c.id === companyAId) || COMPANY_DATASETS[0];
  const companyB = COMPANY_DATASETS.find((c) => c.id === companyBId) || COMPANY_DATASETS[1];

  const handleSwap = () => {
    const temp = companyAId;
    setCompanyAId(companyBId);
    setCompanyBId(temp);
  };

  const getWinner = (valA: number, valB: number, lowerIsBetter = false) => {
    if (valA === valB) return 'equal';
    if (lowerIsBetter) {
      return valA < valB ? 'A' : 'B';
    }
    return valA > valB ? 'A' : 'B';
  };

  // Recharts comparative dataset
  const chartData = [
    {
      metric: 'ARR ($M)',
      [companyA.ticker]: companyA.arr,
      [companyB.ticker]: companyB.arr,
    },
    {
      metric: 'NRR (%)',
      [companyA.ticker]: companyA.nrr,
      [companyB.ticker]: companyB.nrr,
    },
    {
      metric: 'Gross Margin (%)',
      [companyA.ticker]: companyA.grossMargin,
      [companyB.ticker]: companyB.grossMargin,
    },
    {
      metric: 'Rule of 40 (%)',
      [companyA.ticker]: companyA.ruleOf40,
      [companyB.ticker]: companyB.ruleOf40,
    },
    {
      metric: 'AI Confidence (%)',
      [companyA.ticker]: companyA.confidence,
      [companyB.ticker]: companyB.confidence,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#000000]/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[#0b0e14] border-l border-[#1E293B] h-full overflow-y-auto custom-scrollbar p-6 space-y-6 shadow-2xl flex flex-col justify-between font-[#Geist]">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#4edea3]/10 text-[#4edea3] material-symbols-outlined text-xl">
                compare_arrows
              </span>
              <div>
                <h3 className="font-[#Hanken Grotesk] font-bold text-xl text-[#e2e2e2]">
                  Institutional Side-by-Side Comparison
                </h3>
                <p className="text-xs text-[#909095]">
                  Analyze target company against industry peer benchmark datasets
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#909095] hover:text-[#e2e2e2] p-1.5 rounded-lg hover:bg-[#1E293B] transition-all cursor-pointer"
              title="Close side panel"
            >
              ✕
            </button>
          </div>

          {/* Company Selection Header Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center my-5 bg-[#141820] p-4 rounded-xl border border-[#1E293B]">
            {/* Company A Dropdown */}
            <div className="sm:col-span-5 space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4edea3] tracking-wider block">
                Target Company (A)
              </label>
              <select
                value={companyAId}
                onChange={(e) => setCompanyAId(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#45474b] focus:border-[#4edea3] rounded-lg py-2 px-3 text-xs font-semibold text-[#e2e2e2] outline-none cursor-pointer"
              >
                {COMPANY_DATASETS.map((comp) => (
                  <option key={`a-${comp.id}`} value={comp.id}>
                    {comp.name} ({comp.ticker})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-4">
              <button
                onClick={handleSwap}
                className="p-2 rounded-full bg-[#1E293B] hover:bg-[#4edea3] hover:text-[#003824] text-[#c6c6cb] transition-all cursor-pointer shadow"
                title="Swap Company A and B"
              >
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
              </button>
            </div>

            {/* Company B Dropdown */}
            <div className="sm:col-span-5 space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4285F4] tracking-wider block">
                Peer Benchmark (B)
              </label>
              <select
                value={companyBId}
                onChange={(e) => setCompanyBId(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#45474b] focus:border-[#4285F4] rounded-lg py-2 px-3 text-xs font-semibold text-[#e2e2e2] outline-none cursor-pointer"
              >
                {COMPANY_DATASETS.map((comp) => (
                  <option key={`b-${comp.id}`} value={comp.id}>
                    {comp.name} ({comp.ticker})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verdict Banner Header */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#0b0e14] border border-[#4edea3]/40 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] text-[#909095] uppercase tracking-wider block font-bold">
                {companyA.ticker} AI Verdict
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-[#Hanken Grotesk] text-[#e2e2e2]">
                  {companyA.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    companyA.verdict === 'BUY'
                      ? 'bg-[#4edea3]/20 text-[#4edea3]'
                      : 'bg-[#FBBC05]/20 text-[#FBBC05]'
                  }`}
                >
                  {companyA.verdict} ({companyA.confidence}%)
                </span>
              </div>
            </div>

            <div className="bg-[#0b0e14] border border-[#4285F4]/40 p-3.5 rounded-xl space-y-1">
              <span className="text-[10px] text-[#909095] uppercase tracking-wider block font-bold">
                {companyB.ticker} AI Verdict
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-[#Hanken Grotesk] text-[#e2e2e2]">
                  {companyB.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    companyB.verdict === 'BUY'
                      ? 'bg-[#4285F4]/20 text-[#4285F4]'
                      : 'bg-[#FBBC05]/20 text-[#FBBC05]'
                  }`}
                >
                  {companyB.verdict} ({companyB.confidence}%)
                </span>
              </div>
            </div>
          </div>

          {/* Visual Recharts Comparative Bar Chart */}
          <div className="bg-[#141820] border border-[#1E293B] rounded-xl p-4 space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[#e2e2e2]">Visual Metric Benchmark</h4>
              <span className="text-[10px] text-[#909095]">Comparative Normalized Scale</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fill: '#c6c6cb', fontSize: 10 }} stroke="#909095" />
                  <YAxis tick={{ fill: '#c6c6cb', fontSize: 10 }} stroke="#909095" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141820',
                      borderColor: '#4edea3',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                  <Bar dataKey={companyA.ticker} fill="#4edea3" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={companyB.ticker} fill="#4285F4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side-by-Side Detailed Metric Table */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#e2e2e2] uppercase tracking-wider border-b border-[#1E293B] pb-2">
              Financial & Unit Economic Comparison
            </h4>

            <div className="bg-[#141820] border border-[#1E293B] rounded-xl overflow-hidden divide-y divide-[#1E293B] text-xs">
              {/* Header */}
              <div className="grid grid-cols-12 bg-[#0b0e14] p-3 font-bold text-[#909095] text-[11px]">
                <div className="col-span-5">Metric Parameter</div>
                <div className="col-span-3 text-center text-[#4edea3]">{companyA.ticker}</div>
                <div className="col-span-3 text-center text-[#4285F4]">{companyB.ticker}</div>
                <div className="col-span-1 text-center">Adv.</div>
              </div>

              {/* Metric Row Helper */}
              {[
                { label: 'ARR Run Rate ($M)', keyA: `$${companyA.arr}M`, keyB: `$${companyB.arr}M`, winner: getWinner(companyA.arr, companyB.arr) },
                { label: 'YoY Growth Rate (%)', keyA: `+${companyA.yoyGrowth}%`, keyB: `+${companyB.yoyGrowth}%`, winner: getWinner(companyA.yoyGrowth, companyB.yoyGrowth) },
                { label: 'Net Revenue Retention (NRR)', keyA: `${companyA.nrr}%`, keyB: `${companyB.nrr}%`, winner: getWinner(companyA.nrr, companyB.nrr) },
                { label: 'Gross Profit Margin (%)', keyA: `${companyA.grossMargin}%`, keyB: `${companyB.grossMargin}%`, winner: getWinner(companyA.grossMargin, companyB.grossMargin) },
                { label: 'EBITDA Margin (%)', keyA: `${companyA.ebitdaMargin}%`, keyB: `${companyB.ebitdaMargin}%`, winner: getWinner(companyA.ebitdaMargin, companyB.ebitdaMargin) },
                { label: 'Annual Logo Churn (%)', keyA: `${companyA.churn}%`, keyB: `${companyB.churn}%`, winner: getWinner(companyA.churn, companyB.churn, true) },
                { label: 'LTV : CAC Ratio', keyA: `${companyA.ltvCac}x`, keyB: `${companyB.ltvCac}x`, winner: getWinner(companyA.ltvCac, companyB.ltvCac) },
                { label: 'CAC Payback Period', keyA: `${companyA.cacPayback} Mos`, keyB: `${companyB.cacPayback} Mos`, winner: getWinner(companyA.cacPayback, companyB.cacPayback, true) },
                { label: 'Capital Burn Multiple', keyA: `${companyA.burnMultiple}x`, keyB: `${companyB.burnMultiple}x`, winner: getWinner(companyA.burnMultiple, companyB.burnMultiple, true) },
                { label: 'Rule of 40 Score', keyA: `${companyA.ruleOf40}%`, keyB: `${companyB.ruleOf40}%`, winner: getWinner(companyA.ruleOf40, companyB.ruleOf40) },
                { label: 'Implied Valuation ($M)', keyA: `$${companyA.valuation}M`, keyB: `$${companyB.valuation}M`, winner: getWinner(companyA.valuation, companyB.valuation) },
                { label: 'ARR Valuation Multiple', keyA: `${companyA.arrMultiple}x`, keyB: `${companyB.arrMultiple}x`, winner: getWinner(companyA.arrMultiple, companyB.arrMultiple, true) },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-3 items-center hover:bg-[#1E293B]/40 transition-colors">
                  <div className="col-span-5 font-semibold text-[#c6c6cb]">{row.label}</div>
                  <div
                    className={`col-span-3 text-center font-bold ${
                      row.winner === 'A' ? 'text-[#4edea3]' : 'text-[#e2e2e2]'
                    }`}
                  >
                    {row.keyA}
                  </div>
                  <div
                    className={`col-span-3 text-center font-bold ${
                      row.winner === 'B' ? 'text-[#4285F4]' : 'text-[#e2e2e2]'
                    }`}
                  >
                    {row.keyB}
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {row.winner === 'A' && (
                      <span className="w-2 h-2 rounded-full bg-[#4edea3]" title={`${companyA.ticker} leads`} />
                    )}
                    {row.winner === 'B' && (
                      <span className="w-2 h-2 rounded-full bg-[#4285F4]" title={`${companyB.ticker} leads`} />
                    )}
                    {row.winner === 'equal' && <span className="text-[#909095] text-[10px]">-</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
          <span className="text-[11px] text-[#909095]">
            Comparing 2 dataset entities • Last updated Q3 Audit
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-[#4edea3] hover:bg-[#6ffbbe] text-[#003824] font-[#Hanken Grotesk] font-bold text-xs py-2.5 px-5 rounded-lg transition-all cursor-pointer shadow"
          >
            Apply Comparison to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
