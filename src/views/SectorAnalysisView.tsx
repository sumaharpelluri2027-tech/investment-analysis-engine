import React, { useState } from 'react';
import { FlowStep } from '../types';
import { SideNav } from '../components/SideNav';
import { TopNav } from '../components/TopNav';

interface SectorAnalysisViewProps {
  onSelectCompany: (companyName: string) => void;
  onNavigate: (step: FlowStep) => void;
  watchlistIds: string[];
  onToggleWatchlist: (id: string) => void;
}

export interface DetailedCompany {
  id: string;
  name: string;
  ticker: string;
  category: string;
  revenue: string;
  arr: string;
  growth: string;
  valuation: string;
  revenueMultiple: string;
  risk: 'Low' | 'Moderate' | 'Elevated';
  investmentScore: number;
  recommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'WATCH';
  confidence: number;
  highlight: string;
}

export const SAMPLE_COMPANIES: DetailedCompany[] = [
  {
    id: 'ntg',
    name: 'Nexus Technologies Group',
    ticker: 'NTG',
    category: 'Enterprise SaaS & AI',
    revenue: '$38.2M',
    arr: '$42.5M',
    growth: '+34.8%',
    valuation: '$280M',
    revenueMultiple: '6.6x',
    risk: 'Low',
    investmentScore: 94,
    recommendation: 'STRONG BUY',
    confidence: 94,
    highlight: '124.2% NRR with 49.3% Rule of 40 score',
  },
  {
    id: 'csl',
    name: 'CloudScale Logic',
    ticker: 'CSL',
    category: 'Cloud Optimization',
    revenue: '$58.1M',
    arr: '$64.2M',
    growth: '+52.1%',
    valuation: '$480M',
    revenueMultiple: '7.5x',
    risk: 'Low',
    investmentScore: 96,
    recommendation: 'STRONG BUY',
    confidence: 96,
    highlight: 'Hypergrowth trajectory with 85% gross margin',
  },
  {
    id: 'csai',
    name: 'CyberShield AI',
    ticker: 'CSAI',
    category: 'Cybersecurity',
    revenue: '$24.8M',
    arr: '$28.1M',
    growth: '+41.2%',
    valuation: '$195M',
    revenueMultiple: '6.9x',
    risk: 'Moderate',
    investmentScore: 89,
    recommendation: 'BUY',
    confidence: 89,
    highlight: 'Expanding enterprise customer base in SecOps',
  },
  {
    id: 'dpa',
    name: 'DataPulse Analytics',
    ticker: 'DPA',
    category: 'Data Infrastructure',
    revenue: '$17.2M',
    arr: '$19.4M',
    growth: '+18.0%',
    valuation: '$110M',
    revenueMultiple: '5.7x',
    risk: 'Moderate',
    investmentScore: 76,
    recommendation: 'HOLD',
    confidence: 76,
    highlight: 'Stable ARR with moderate expansion velocity',
  },
  {
    id: 'aqh',
    name: 'Apex Quantum Health',
    ticker: 'AQH',
    category: 'HealthTech & Bio',
    revenue: '$48.5M',
    arr: '$55.0M',
    growth: '+12.4%',
    valuation: '$320M',
    revenueMultiple: '5.8x',
    risk: 'Elevated',
    investmentScore: 72,
    recommendation: 'HOLD',
    confidence: 72,
    highlight: 'Higher churn in non-enterprise healthcare tier',
  },
  {
    id: 'fba',
    name: 'Frontier Bio AI',
    ticker: 'FBA',
    category: 'HealthTech & BioAI',
    revenue: '$9.8M',
    arr: '$12.0M',
    growth: '+28.0%',
    valuation: '$85M',
    revenueMultiple: '7.1x',
    risk: 'Elevated',
    investmentScore: 65,
    recommendation: 'WATCH',
    confidence: 62,
    highlight: 'High R&D burn rate with 14 months runway',
  },
];

export const SectorAnalysisView: React.FC<SectorAnalysisViewProps> = ({
  onSelectCompany,
  onNavigate,
  watchlistIds,
  onToggleWatchlist,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'BUY' | 'HOLD' | 'WATCH'>('ALL');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>(['ntg', 'csl', 'csai']);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');

  const filteredCompanies = SAMPLE_COMPANIES.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.ticker.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'BUY' && (company.recommendation === 'BUY' || company.recommendation === 'STRONG BUY')) ||
      (selectedFilter === 'HOLD' && company.recommendation === 'HOLD') ||
      (selectedFilter === 'WATCH' && company.recommendation === 'WATCH');

    return matchesSearch && matchesFilter;
  });

  const toggleSelectForCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedForCompare((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const comparedCompanies = SAMPLE_COMPANIES.filter((c) => selectedForCompare.includes(c.id));

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#121414] text-[#e2e2e2]">
      <SideNav currentStep="sector_analysis" onNavigate={onNavigate} watchlistCount={watchlistIds.length} />
      <TopNav
        currentStep="sector_analysis"
        onNavigate={onNavigate}
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
      />

      <main className="flex-1 md:ml-64 mt-16 p-container-padding overflow-y-auto custom-scrollbar relative">
        <div className="max-w-6xl mx-auto space-y-stack-lg pb-stack-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-[#Geist] text-xs text-[#4edea3] tracking-widest uppercase font-semibold">
                  Market Coverage
                </span>
                <span className="material-symbols-outlined text-[#909095] text-sm">chevron_right</span>
                <span className="font-[#Geist] text-xs text-[#c6c6cb]">Sector Benchmarking</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                Target Entities Directory
              </h2>
            </div>

            {/* View Mode & Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* View Switcher */}
              <div className="flex items-center bg-[#0b0e14] border border-[#1E293B] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded font-[#Geist] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#282a2b] text-[#4edea3]'
                      : 'text-[#c6c6cb] hover:text-[#e2e2e2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                  <span>Directory</span>
                </button>
                <button
                  onClick={() => setViewMode('compare')}
                  className={`px-3 py-1.5 rounded font-[#Geist] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'compare'
                      ? 'bg-[#282a2b] text-[#4edea3]'
                      : 'text-[#c6c6cb] hover:text-[#e2e2e2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">compare_arrows</span>
                  <span>Compare ({selectedForCompare.length})</span>
                </button>
              </div>

              {/* Recommendation Filter */}
              <div className="flex items-center gap-1 p-1 bg-[#0b0e14] border border-[#1E293B] rounded-lg">
                {(['ALL', 'BUY', 'HOLD', 'WATCH'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1.5 rounded font-[#Geist] text-xs font-semibold transition-colors cursor-pointer ${
                      selectedFilter === filter
                        ? 'bg-[#282a2b] text-[#4edea3]'
                        : 'text-[#c6c6cb] hover:text-[#e2e2e2]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Comparison Bar if companies are selected and in grid mode */}
          {viewMode === 'grid' && selectedForCompare.length > 0 && (
            <div className="glass-panel rounded-xl p-3.5 border border-[#4edea3]/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="font-[#Geist] text-xs text-[#e2e2e2]">
                  <strong className="text-[#4edea3]">{selectedForCompare.length} entities</strong> selected for side-by-side metric comparison
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedForCompare([])}
                  className="px-3 py-1 text-xs text-[#c6c6cb] hover:text-[#e2e2e2] font-[#Geist] cursor-pointer"
                >
                  Clear Selection
                </button>
                <button
                  onClick={() => setViewMode('compare')}
                  className="bg-[#4edea3] text-[#003824] font-[#Hanken Grotesk] font-bold text-xs px-4 py-1.5 rounded hover:bg-[#6ffbbe] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>View Side-by-Side Comparison</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredCompanies.map((company) => {
                const isSelected = selectedForCompare.includes(company.id);
                const isWatchlisted = watchlistIds.includes(company.id);
                return (
                  <div
                    key={company.id}
                    onClick={() => {
                      onSelectCompany(company.name);
                      onNavigate('executive_dashboard');
                    }}
                    className={`insight-card rounded-xl p-6 flex flex-col justify-between cursor-pointer group relative transition-all ${
                      isSelected ? 'border-[#4edea3]/50 shadow-[0_0_15px_rgba(78,222,163,0.08)]' : ''
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => toggleSelectForCompare(company.id, e)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-[#4edea3] border-[#4edea3] text-[#003824]'
                                : 'border-[#45474b] bg-[#0b0e14] hover:border-[#4edea3]'
                            }`}
                            title="Select to compare"
                          >
                            {isSelected && <span className="material-symbols-outlined text-xs font-bold">check</span>}
                          </button>
                          <span className="font-[#Geist] text-xs px-2 py-0.5 rounded bg-[#0b0e14] text-[#c6c6cb] border border-[#1E293B]">
                            {company.ticker}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Bookmark / Watchlist Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleWatchlist(company.id);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isWatchlisted
                                ? 'bg-[#4edea3]/15 border border-[#4edea3]/30 text-[#4edea3]'
                                : 'bg-[#0b0e14] border border-[#45474b] text-[#909095] hover:border-[#4edea3] hover:text-[#4edea3]'
                            }`}
                            title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                          >
                            <span
                              className="material-symbols-outlined text-sm"
                              style={{ fontVariationSettings: isWatchlisted ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              bookmark
                            </span>
                          </button>

                          <span
                            className={`font-[#Geist] text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                              company.recommendation === 'STRONG BUY' || company.recommendation === 'BUY'
                                ? 'bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20'
                                : company.recommendation === 'HOLD'
                                ? 'bg-[#FBBC05]/10 text-[#FBBC05] border border-[#FBBC05]/20'
                                : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20'
                            }`}
                          >
                            {company.recommendation}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-[#Hanken Grotesk] font-bold text-lg text-[#e2e2e2] group-hover:text-[#4edea3] transition-colors mb-1">
                        {company.name}
                      </h3>
                      <p className="font-[#Inter] text-xs text-[#c6c6cb] mb-4">{company.category}</p>

                      <div className="grid grid-cols-2 gap-3 py-3 border-t border-[#1E293B] mb-3">
                        <div>
                          <span className="block font-[#Geist] text-[10px] text-[#909095] uppercase">Revenue / ARR</span>
                          <span className="font-[#Geist] text-sm font-semibold text-[#e2e2e2]">{company.arr}</span>
                        </div>
                        <div>
                          <span className="block font-[#Geist] text-[10px] text-[#909095] uppercase">YoY Growth</span>
                          <span className="font-[#Geist] text-sm font-semibold text-[#4edea3]">{company.growth}</span>
                        </div>
                        <div>
                          <span className="block font-[#Geist] text-[10px] text-[#909095] uppercase">Valuation</span>
                          <span className="font-[#Geist] text-sm font-semibold text-[#e2e2e2]">{company.valuation}</span>
                        </div>
                        <div>
                          <span className="block font-[#Geist] text-[10px] text-[#909095] uppercase">Multiple</span>
                          <span className="font-[#Geist] text-sm font-semibold text-[#c6c6cb]">{company.revenueMultiple}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-[#Geist] text-[#c6c6cb]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-[#4edea3]">verified</span>
                        Score: {company.investmentScore}/100
                      </span>
                      <span className="group-hover:text-[#4edea3] flex items-center gap-1 transition-colors">
                        Inspect
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SIDE-BY-SIDE COMPARISON VIEW */}
          {viewMode === 'compare' && (
            <div className="space-y-6 animate-fadeIn">
              {comparedCompanies.length === 0 ? (
                <div className="glass-panel rounded-xl p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-[#909095] mb-2">compare</span>
                  <h3 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2] mb-1">
                    No Companies Selected for Comparison
                  </h3>
                  <p className="text-xs text-[#c6c6cb] mb-4">
                    Select 2 or more entities from the directory to review side-by-side metric rows.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedForCompare(['ntg', 'csl', 'csai']);
                    }}
                    className="px-4 py-2 bg-[#4edea3] text-[#003824] rounded font-[#Hanken Grotesk] font-bold text-xs hover:bg-[#6ffbbe] cursor-pointer"
                  >
                    Select Top 3 Peers
                  </button>
                </div>
              ) : (
                <div className="glass-panel rounded-xl p-6 border border-[#1E293B] overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-[#1E293B]">
                    <div>
                      <h3 className="font-[#Hanken Grotesk] font-bold text-xl text-[#e2e2e2]">
                        Side-by-Side Target Entities Comparison
                      </h3>
                      <p className="text-xs font-[#Geist] text-[#c6c6cb] mt-0.5">
                        Evaluating {comparedCompanies.length} selected assets across shared core telemetry rows.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedForCompare(SAMPLE_COMPANIES.map((c) => c.id))}
                        className="px-3 py-1.5 bg-[#282a2b] hover:bg-[#333535] text-[#c6c6cb] hover:text-[#e2e2e2] rounded text-xs font-[#Geist] cursor-pointer transition-colors"
                      >
                        Select All ({SAMPLE_COMPANIES.length})
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className="px-3 py-1.5 bg-[#282a2b] hover:bg-[#333535] text-[#4edea3] rounded text-xs font-[#Geist] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">grid_view</span>
                        <span>Back to Grid</span>
                      </button>
                    </div>
                  </div>

                  {/* Comprehensive Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-[#Geist] text-xs">
                      <thead>
                        <tr className="border-b border-[#1E293B]">
                          <th className="py-4 px-4 text-[#909095] uppercase tracking-wider font-semibold w-48 bg-[#0b0e14]/50">
                            Metric Row
                          </th>
                          {comparedCompanies.map((c) => (
                            <th key={c.id} className="py-4 px-4 text-[#e2e2e2] min-w-[200px]">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] px-1.5 py-0.5 bg-[#1E293B] text-[#4edea3] rounded">
                                      {c.ticker}
                                    </span>
                                    <span className="font-bold text-sm font-[#Hanken Grotesk]">{c.name}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleSelectForCompare(c.id)}
                                  className="text-[#909095] hover:text-[#ffb4ab] p-1 cursor-pointer"
                                  title="Remove from comparison"
                                >
                                  <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#1E293B]">
                        {/* 1. Category */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            Category / Sector
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-3 px-4 text-[#e2e2e2]">
                              {c.category}
                            </td>
                          ))}
                        </tr>

                        {/* 2. Revenue */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            Annual Revenue (LTM)
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-3 px-4 font-semibold text-[#e2e2e2]">
                              {c.revenue}
                            </td>
                          ))}
                        </tr>

                        {/* 3. Growth Rate */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            YoY Growth Rate
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-3 px-4 font-bold text-[#4edea3]">
                              {c.growth}
                            </td>
                          ))}
                        </tr>

                        {/* 4. Valuation */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            Post-Money Valuation
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-3 px-4 text-[#e2e2e2] font-semibold">
                              {c.valuation}
                            </td>
                          ))}
                        </tr>

                        {/* 5. Revenue Multiple */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            Revenue Multiple (EV/ARR)
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-3 px-4 text-[#c6c6cb]">
                              {c.revenueMultiple}
                            </td>
                          ))}
                        </tr>

                        {/* 6. Risk */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            Identified Risk Level
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  c.risk === 'Low'
                                    ? 'bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20'
                                    : c.risk === 'Moderate'
                                    ? 'bg-[#FBBC05]/10 text-[#FBBC05] border border-[#FBBC05]/20'
                                    : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20'
                                }`}
                              >
                                {c.risk} Risk
                              </span>
                            </td>
                          ))}
                        </tr>

                        {/* 7. Investment Score */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            Investment Score
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#e2e2e2]">{c.investmentScore}</span>
                                <div className="w-16 bg-[#0b0e14] h-1.5 rounded-full overflow-hidden border border-[#1E293B]">
                                  <div
                                    className="bg-[#4edea3] h-full"
                                    style={{ width: `${c.investmentScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          ))}
                        </tr>

                        {/* 8. AI Recommendation */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-4 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            AI Recommendation
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-4 px-4">
                              <span
                                className={`px-2.5 py-1 rounded text-xs uppercase font-bold inline-block ${
                                  c.recommendation === 'STRONG BUY' || c.recommendation === 'BUY'
                                    ? 'bg-[#4edea3] text-[#003824]'
                                    : c.recommendation === 'HOLD'
                                    ? 'bg-[#FBBC05] text-[#121414]'
                                    : 'bg-[#ffb4ab] text-[#3b0808]'
                                }`}
                              >
                                {c.recommendation}
                              </span>
                            </td>
                          ))}
                        </tr>

                        {/* 9. Action Row */}
                        <tr className="hover:bg-[#1E293B]/20 transition-colors">
                          <td className="py-4 px-4 font-semibold text-[#c6c6cb] bg-[#0b0e14]/30">
                            Action
                          </td>
                          {comparedCompanies.map((c) => (
                            <td key={c.id} className="py-4 px-4">
                              <button
                                onClick={() => {
                                  onSelectCompany(c.name);
                                  onNavigate('executive_dashboard');
                                }}
                                className="bg-[#282a2b] hover:bg-[#4edea3] hover:text-[#003824] text-[#e2e2e2] px-3.5 py-1.5 rounded text-xs font-[#Hanken Grotesk] font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <span>Inspect Memo</span>
                                <span className="material-symbols-outlined text-xs">arrow_forward</span>
                              </button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
