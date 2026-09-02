import React from 'react';
import { FlowStep } from '../types';

interface SideNavProps {
  currentStep: FlowStep;
  onNavigate: (step: FlowStep) => void;
  watchlistCount?: number;
}

export const SideNav: React.FC<SideNavProps> = ({ currentStep, onNavigate, watchlistCount = 0 }) => {
  const isDashboardActive = [
    'decision_objective',
    'dataset_requirement',
    'dataset_upload',
    'data_validation',
    'executive_dashboard',
  ].includes(currentStep);

  const isAnalysesActive = currentStep === 'explainable_ai';
  const isReportsActive = currentStep === 'export_memo';
  const isCompaniesActive = currentStep === 'sector_analysis';
  const isWatchlistActive = currentStep === 'watchlist';

  return (
    <nav className="hidden md:flex flex-col h-full py-stack-lg bg-[#0c0f0f] border-r border-[#45474b] fixed left-0 top-0 w-64 z-40 transition-all duration-200 ease-in-out">
      {/* Brand Header */}
      <div 
        className="px-6 mb-stack-lg cursor-pointer flex items-center gap-3"
        onClick={() => onNavigate('landing')}
      >
        <div className="w-8 h-8 rounded bg-[#c4c6cf] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#121414] font-bold">query_stats</span>
        </div>
        <div>
          <h1 className="text-[24px] font-[#Hanken Grotesk] font-bold text-[#e2e2e2] leading-tight">BoardIQ</h1>
          <p className="font-[#Geist] text-[10px] text-[#c6c6cb] uppercase tracking-wider">AI Decision Intelligence</p>
        </div>
      </div>

      {/* Main Nav Items */}
      <ul className="flex-1 px-4 space-y-1">
        <li>
          <button
            onClick={() => onNavigate('decision_objective')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
              isDashboardActive
                ? 'text-[#c4c6cf] font-bold border-r-2 border-[#c4c6cf] bg-[#282a2b]/50'
                : 'text-[#c6c6cb] hover:bg-[#282a2b] hover:text-[#e2e2e2]'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isDashboardActive ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
            <span className="font-body-md">Dashboard</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate('explainable_ai')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
              isAnalysesActive
                ? 'text-[#c4c6cf] font-bold border-r-2 border-[#c4c6cf] bg-[#282a2b]/50'
                : 'text-[#c6c6cb] hover:bg-[#282a2b] hover:text-[#e2e2e2]'
            }`}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-body-md">Analyses</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate('sector_analysis')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
              isCompaniesActive
                ? 'text-[#c4c6cf] font-bold border-r-2 border-[#c4c6cf] bg-[#282a2b]/50'
                : 'text-[#c6c6cb] hover:bg-[#282a2b] hover:text-[#e2e2e2]'
            }`}
          >
            <span className="material-symbols-outlined">business_center</span>
            <span className="font-body-md">Companies</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate('watchlist')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
              isWatchlistActive
                ? 'text-[#c4c6cf] font-bold border-r-2 border-[#c4c6cf] bg-[#282a2b]/50'
                : 'text-[#c6c6cb] hover:bg-[#282a2b] hover:text-[#e2e2e2]'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isWatchlistActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
            <span className="font-body-md flex-1 text-left">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/15 text-[#4edea3] font-[#Geist] text-[10px] font-bold border border-[#4edea3]/20">
                {watchlistCount}
              </span>
            )}
          </button>
        </li>
        <li>
          <button
            onClick={() => onNavigate('export_memo')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
              isReportsActive
                ? 'text-[#c4c6cf] font-bold border-r-2 border-[#c4c6cf] bg-[#282a2b]/50'
                : 'text-[#c6c6cb] hover:bg-[#282a2b] hover:text-[#e2e2e2]'
            }`}
          >
            <span className="material-symbols-outlined">description</span>
            <span className="font-body-md">Reports</span>
          </button>
        </li>
      </ul>

      {/* Footer Nav Items */}
      <div className="px-4 mt-auto space-y-1">
        <button
          onClick={() => onNavigate('investor_verification')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#c6c6cb] hover:bg-[#282a2b] hover:text-[#e2e2e2] transition-all duration-200 text-left"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-body-md">Settings</span>
        </button>
        <button
          onClick={() => onNavigate('login')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#c6c6cb] hover:bg-[#282a2b] hover:text-[#e2e2e2] transition-all duration-200 text-left"
        >
          <span className="material-symbols-outlined">account_circle</span>
          <span className="font-body-md">Profile</span>
        </button>
      </div>
    </nav>
  );
};
