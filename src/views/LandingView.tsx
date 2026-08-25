import React from 'react';
import { FlowStep } from '../types';

interface LandingViewProps {
  onStart: () => void;
  onLogin: () => void;
  onNavigate?: (step: FlowStep) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart, onLogin, onNavigate }) => {
  const handleLaunch = () => {
    if (onNavigate) {
      onNavigate('login');
    } else {
      onStart();
    }
  };

  const handleSignIn = () => {
    if (onNavigate) {
      onNavigate('login');
    } else {
      onLogin();
    }
  };
  return (
    <div className="bg-[#0B0E14] text-[#e2e2e2] min-h-screen antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
        <div className="w-[1000px] h-[1000px] rounded-full bg-[#4edea3] opacity-[0.03] blur-[160px]"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#c4c6cf] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#121414] font-bold">query_stats</span>
          </div>
          <div>
            <h1 className="text-xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2] tracking-tight">BoardIQ</h1>
            <p className="font-[#Geist] text-[10px] text-[#c6c6cb] uppercase tracking-widest">AI Decision Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSignIn}
            className="text-xs font-[#Geist] text-[#c6c6cb] hover:text-[#e2e2e2] transition-colors cursor-pointer px-3 py-2"
          >
            Sign In
          </button>
          <button
            onClick={handleLaunch}
            className="bg-white text-[#0B0E14] font-[#Hanken Grotesk] font-bold text-xs px-5 py-2.5 rounded hover:bg-[#4edea3] hover:text-[#003824] transition-all cursor-pointer shadow-lg"
          >
            Launch Platform
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="w-full max-w-5xl mx-auto px-6 py-16 text-center relative z-10 space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E293B] border border-[#4edea3]/30 text-[#4edea3] font-[#Geist] text-xs">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span>Powered by Gemini 2.5 Financial Core</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2] tracking-tight leading-tight">
          Automated Due Diligence & Explainable AI for Investors
        </h1>

        <p className="font-[#Inter] text-lg text-[#c6c6cb] max-w-2xl mx-auto leading-relaxed">
          Ingest raw financial datasets, audit telemetry integrity, simulate growth scenarios, and generate board-ready Investment Memos in minutes.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <button
            onClick={handleLaunch}
            className="bg-[#4edea3] text-[#003824] font-[#Hanken Grotesk] font-bold text-base px-8 py-4 rounded-lg hover:bg-[#6ffbbe] transition-all flex items-center gap-3 cursor-pointer shadow-2xl hover:scale-105"
          >
            <span>Initiate Due Diligence</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="glass-panel rounded-xl p-6">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl mb-3">verified</span>
            <h3 className="font-[#Hanken Grotesk] font-bold text-lg text-[#e2e2e2] mb-1">
              Data Validation Engine
            </h3>
            <p className="font-[#Inter] text-xs text-[#c6c6cb]">
              Automated anomaly detection and 256-bit institutional schema verification.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl mb-3">psychology</span>
            <h3 className="font-[#Hanken Grotesk] font-bold text-lg text-[#e2e2e2] mb-1">
              Explainable AI Reasoning
            </h3>
            <p className="font-[#Inter] text-xs text-[#c6c6cb]">
              Unredacted decision logic traces, sensitivity matrices, and counterfactual prompts.
            </p>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <span className="material-symbols-outlined text-[#4edea3] text-2xl mb-3">description</span>
            <h3 className="font-[#Hanken Grotesk] font-bold text-lg text-[#e2e2e2] mb-1">
              Export IC Memorandums
            </h3>
            <p className="font-[#Inter] text-xs text-[#c6c6cb]">
              Instant generation of print-optimized Investment Committee Memos with audit tags.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#1E293B] flex items-center justify-between text-xs font-[#Geist] text-[#909095] relative z-10">
        <p>© 2026 BoardIQ Platform Inc. SEC-Grade Anonymized Intelligence.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#e2e2e2] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#e2e2e2] transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};
