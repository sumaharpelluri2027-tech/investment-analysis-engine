import React, { useState } from 'react';
import { FlowStep } from '../types';

interface TopNavProps {
  currentStep: FlowStep;
  onNavigate: (step: FlowStep) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ currentStep, onNavigate, searchQuery, setSearchQuery }) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const query = searchQuery !== undefined ? searchQuery : internalQuery;
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (setSearchQuery) setSearchQuery(val);
    else setInternalQuery(val);
  };

  return (
    <header className="hidden md:flex bg-[#121414] border-b border-[#45474b] fixed top-0 right-0 w-[calc(100%-16rem)] h-16 justify-between items-center px-container-padding z-30 transition-colors duration-150">
      <div className="flex-1 max-w-md relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c6c6cb] text-sm">search</span>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          className="w-full bg-[#0b0e14] border border-[#45474b] rounded-full py-2 pl-10 pr-4 text-body-md text-[#e2e2e2] focus:outline-none focus:border-[#4edea3] transition-colors placeholder:text-[#c6c6cb]/50"
          placeholder="Search insights, entities, or reports..."
        />
      </div>

      <div className="flex items-center gap-4 relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="text-[#c6c6cb] hover:text-[#e2e2e2] transition-colors p-2 rounded-full hover:bg-[#1e2020] relative"
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#4edea3]"></span>
        </button>

        {showNotifications && (
          <div className="absolute right-12 top-12 w-80 bg-[#141820] border border-[#1E293B] rounded-lg shadow-2xl p-4 z-50 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#1E293B] pb-2 mb-3">
              <span className="font-label-mono text-xs text-[#e2e2e2] uppercase">AI Alerts</span>
              <span className="text-[10px] text-[#4edea3]">2 New</span>
            </div>
            <div className="space-y-3 font-body-md text-xs">
              <div className="p-2 rounded bg-[#0b0e14] border border-[#1E293B] cursor-pointer" onClick={() => { onNavigate('data_validation'); setShowNotifications(false); }}>
                <p className="font-medium text-[#e2e2e2]">Validation Complete</p>
                <p className="text-[#c6c6cb] text-[11px]">Q3_Financials_Raw.csv confidence score at 85%.</p>
              </div>
              <div className="p-2 rounded bg-[#0b0e14] border border-[#1E293B] cursor-pointer" onClick={() => { onNavigate('executive_dashboard'); setShowNotifications(false); }}>
                <p className="font-medium text-[#4edea3]">AI Verdict: BUY</p>
                <p className="text-[#c6c6cb] text-[11px]">Nexus Technologies Group confidence score 94%.</p>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => onNavigate('sector_analysis')}
          className="text-[#c6c6cb] hover:text-[#e2e2e2] transition-colors p-2 rounded-full hover:bg-[#1e2020]"
          title="Apps"
        >
          <span className="material-symbols-outlined">apps</span>
        </button>

        <div 
          onClick={() => onNavigate('investor_verification')}
          className="h-8 w-8 rounded-full overflow-hidden border border-[#45474b] ml-2 cursor-pointer"
          title="User Profile"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzp6yw_IMZJSxm16futKt5tcmmXD7rvorgLhjgjuKE5xT1KYFOoK3IT2A4GqDRVwXxOrIn_iX7_82rUvTzTsw9jNTcWI69dzC2sNuGJHqJddEQAFc32BPCNIB71ZTF2ICPW6oDzioLYALPVHfraY8i0E-LiC6OWB79MFS-2bPT6zvBmgE7-p5drsujjjlQSh6oNYptsl-jtWroYDMWatT3ndW3GtdaAd3kmd8XcbHpEjlqj87U1mUdzA"
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
