import React, { useMemo } from 'react';
import { FlowStep } from '../types';
import { SideNav } from '../components/SideNav';
import { TopNav } from '../components/TopNav';
import { SAMPLE_COMPANIES, DetailedCompany } from './SectorAnalysisView';

interface WatchlistViewProps {
  watchlistIds: string[];
  onToggleWatchlist: (id: string) => void;
  onSelectCompany: (companyName: string) => void;
  onNavigate: (step: FlowStep) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlistIds,
  onToggleWatchlist,
  onSelectCompany,
  onNavigate,
}) => {
  const watchlistedCompanies = useMemo(() => {
    return watchlistIds
      .map((id) => SAMPLE_COMPANIES.find((c) => c.id === id))
      .filter(Boolean) as DetailedCompany[];
  }, [watchlistIds]);

  const avgScore = watchlistedCompanies.length
    ? Math.round(watchlistedCompanies.reduce((sum, c) => sum + c.investmentScore, 0) / watchlistedCompanies.length)
    : 0;

  const totalArr = watchlistedCompanies.reduce((sum, c) => {
    const val = parseFloat(c.arr.replace(/[$M]/g, ''));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#121414] text-[#e2e2e2]">
      <SideNav currentStep="watchlist" onNavigate={onNavigate} watchlistCount={watchlistedCompanies.length} />
      <TopNav currentStep="watchlist" onNavigate={onNavigate} />

      <main className="flex-1 md:ml-64 mt-16 p-container-padding overflow-y-auto custom-scrollbar relative">
        <div className="max-w-6xl mx-auto space-y-stack-lg pb-stack-lg">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-[#Geist] text-xs text-[#4edea3] tracking-widest uppercase font-semibold">
                  Portfolio Tracking
                </span>
                <span className="material-symbols-outlined text-[#909095] text-sm">chevron_right</span>
                <span className="font-[#Geist] text-xs text-[#c6c6cb]">Saved Companies</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                Your Watchlist
              </h2>
              {watchlistedCompanies.length > 0 && (
                <p className="font-[#Inter] text-sm text-[#c6c6cb] mt-1">
                  Tracking {watchlistedCompanies.length} {watchlistedCompanies.length === 1 ? 'company' : 'companies'} across your portfolio
                </p>
              )}
            </div>

            {watchlistedCompanies.length > 0 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate('sector_analysis')}
                  className="bg-[#282a2b] border border-[#45474b] text-[#e2e2e2] hover:bg-[#333535] px-4 py-2.5 rounded font-[#Geist] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">business_center</span>
                  Browse Directory
                </button>
                <button
                  onClick={() => {
                    watchlistedCompanies.forEach((c) => onToggleWatchlist(c.id));
                  }}
                  className="bg-[#282a2b] border border-[#ffb4ab]/30 text-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#3b0808] px-4 py-2.5 rounded font-[#Geist] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">delete_sweep</span>
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Summary Stats Bar */}
          {watchlistedCompanies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
              <div className="glass-panel rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#4edea3]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#4edea3] text-2xl">visibility</span>
                </div>
                <div>
                  <span className="font-[#Geist] text-[10px] text-[#909095] uppercase tracking-wider block">
                    Companies Tracked
                  </span>
                  <span className="font-[#Hanken Grotesk] text-2xl font-bold text-[#e2e2e2]">
                    {watchlistedCompanies.length}
                  </span>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#4edea3]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#4edea3] text-2xl">bar_chart</span>
                </div>
                <div>
                  <span className="font-[#Geist] text-[10px] text-[#909095] uppercase tracking-wider block">
                    Combined ARR
                  </span>
                  <span className="font-[#Hanken Grotesk] text-2xl font-bold text-[#e2e2e2]">
                    ${totalArr.toFixed(1)}M
                  </span>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#4edea3]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#4edea3] text-2xl">verified</span>
                </div>
                <div>
                  <span className="font-[#Geist] text-[10px] text-[#909095] uppercase tracking-wider block">
                    Avg. Investment Score
                  </span>
                  <span className="font-[#Hanken Grotesk] text-2xl font-bold text-[#4edea3]">
                    {avgScore}/100
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Watchlisted Companies Grid */}
          {watchlistedCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {watchlistedCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => {
                    onSelectCompany(company.name);
                    onNavigate('executive_dashboard');
                  }}
                  className="insight-card rounded-xl p-6 flex flex-col justify-between cursor-pointer group relative transition-all border-[#4edea3]/30"
                >
                  {/* Bookmark / Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(company.id);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer bg-[#4edea3]/10 border border-[#4edea3]/20 hover:bg-[#ffb4ab]/20 hover:border-[#ffb4ab]/40"
                    title="Remove from watchlist"
                  >
                    <span
                      className="material-symbols-outlined text-sm"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bookmark
                    </span>
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-[#Geist] text-xs px-2 py-0.5 rounded bg-[#0b0e14] text-[#c6c6cb] border border-[#1E293B]">
                        {company.ticker}
                      </span>
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

                    <h3 className="font-[#Hanken Grotesk] font-bold text-lg text-[#e2e2e2] group-hover:text-[#4edea3] transition-colors mb-1">
                      {company.name}
                    </h3>
                    <p className="font-[#Inter] text-xs text-[#c6c6cb] mb-4">{company.category}</p>

                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-[#1E293B] mb-3">
                      <div>
                        <span className="block font-[#Geist] text-[10px] text-[#909095] uppercase">ARR</span>
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

                    <div className="p-3 rounded-lg bg-[#0b0e14] border border-[#1E293B] mb-3">
                      <p className="font-[#Inter] text-[11px] text-[#c6c6cb] leading-relaxed">
                        {company.highlight}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-[#Geist] text-[#c6c6cb]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-[#4edea3]">verified</span>
                      Score: {company.investmentScore}/100
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px] text-[#909095]">schedule</span>
                      <span className="text-[10px] text-[#909095]">
                        {company.risk} Risk
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="glass-panel rounded-xl p-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#1E293B] flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#4edea3] text-4xl">bookmark_border</span>
              </div>
              <h3 className="text-2xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2] mb-2">
                Your Watchlist Is Empty
              </h3>
              <p className="font-[#Inter] text-sm text-[#c6c6cb] max-w-md mx-auto mb-8 leading-relaxed">
                Browse the Target Entities Directory and tap the bookmark icon on any company card to start tracking it here. Your watchlist persists across sessions.
              </p>
              <button
                onClick={() => onNavigate('sector_analysis')}
                className="bg-[#4edea3] text-[#003824] font-[#Hanken Grotesk] font-bold text-sm px-8 py-4 rounded-lg hover:bg-[#6ffbbe] transition-all flex items-center gap-3 cursor-pointer shadow-2xl hover:scale-105 mx-auto"
              >
                <span className="material-symbols-outlined">business_center</span>
                <span>Browse Companies</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
