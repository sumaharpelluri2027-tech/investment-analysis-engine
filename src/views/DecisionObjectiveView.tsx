import React, { useState } from 'react';
import { FlowStep } from '../types';
import { SideNav } from '../components/SideNav';
import { TopNav } from '../components/TopNav';

interface DecisionObjectiveViewProps {
  onSelectObjective: (objectiveId: string, objectiveTitle: string) => void;
  onNavigate: (step: FlowStep) => void;
}

export interface FrameworkOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  span?: string;
  requiredFields: string[];
}

export const FRAMEWORK_OPTIONS: FrameworkOption[] = [
  {
    id: 'investment_screening',
    title: 'Investment Screening',
    description: 'Evaluate potential targets against strategic metrics.',
    icon: 'show_chart',
    requiredFields: [
      'Company Name & Industry',
      'Revenue & Growth Rate',
      'Current Valuation (if known)',
      'Customer Count',
      'MRR / ARR',
    ],
  },
  {
    id: 'acquisition_analysis',
    title: 'Acquisition Analysis',
    description: 'M&A due diligence and synergy modeling.',
    icon: 'handshake',
    requiredFields: [
      'Target Financial Audits (3 yrs)',
      'Cost Structure & OPEX Breakdown',
      'EBITDA & Synergies Baseline',
      'IP & Tech Stack Audit',
      'Employee & Talent Roster',
    ],
  },
  {
    id: 'portfolio_review',
    title: 'Portfolio Review',
    description: 'Analyze performance and risk across holdings.',
    icon: 'pie_chart',
    requiredFields: [
      'Fund Holdings & Equity Ownership',
      'Quarterly Burn & Runway Months',
      'LTV / CAC Ratio Data',
      'Valuation Markups / Markdown History',
    ],
  },
  {
    id: 'startup_benchmarking',
    title: 'Startup Benchmarking',
    description: 'Compare early-stage ventures against industry peers based on growth trajectory and burn rate.',
    icon: 'rocket_launch',
    requiredFields: [
      'Stage & Capital Raised to Date',
      'Monthly Active Users (MAU/DAU)',
      'Gross Margin %',
      'Net Revenue Retention Rate',
      'Rule of 40 Score Data',
    ],
  },
  {
    id: 'market_opportunity',
    title: 'Market Opportunity Analysis',
    description: 'Identify emerging sectors and whitespace.',
    icon: 'travel_explore',
    requiredFields: [
      'TAM / SAM / SOM Market Estimates',
      'Competitor Revenue & Market Share',
      'Regulatory Exposure Index',
      'Customer Acquisition Cost Dynamics',
    ],
  },
  {
    id: 'custom_objective',
    title: 'Custom Objective',
    description: 'Define bespoke investment criteria, custom thesis, or ad-hoc target scenarios.',
    icon: 'edit_square',
    requiredFields: [
      'Company Name & Industry',
      'Revenue & Growth Rate',
      'Target Financial Audits (3 yrs)',
      'Quarterly Burn & Runway Months',
      'Rule of 40 Score Data',
    ],
  },
];

export const DecisionObjectiveView: React.FC<DecisionObjectiveViewProps> = ({
  onSelectObjective,
  onNavigate,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [aiInterpretation, setAiInterpretation] = useState<{
    mappedObjective: string;
    objectiveTitle: string;
    confidence: number;
    executiveSummary: string;
    recommendedFields: string[];
  } | null>(null);

  const handleCardClick = (option: FrameworkOption) => {
    if (option.id === 'custom_objective') {
      setShowCustomModal(true);
    } else {
      onSelectObjective(option.id, option.title);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsInterpreting(true);
    try {
      const res = await fetch('/api/gemini/interpret-objective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiInterpretation(data);
      } else {
        throw new Error('Failed to interpret objective');
      }
    } catch (err) {
      console.warn('Using offline fallback for objective mapping', err);
      setAiInterpretation({
        mappedObjective: 'custom_objective',
        objectiveTitle: 'Custom Thesis Evaluation',
        confidence: 90,
        executiveSummary: `Structured diligence framework synthesized for scenario: "${customPrompt.trim()}".`,
        recommendedFields: ['Company Name & Industry', 'Revenue & ARR Metrics', 'Runway & Capital Burn'],
      });
    } finally {
      setIsInterpreting(false);
      setShowCustomModal(false);
    }
  };

  const handleProceedWithAI = () => {
    if (!aiInterpretation) return;
    onSelectObjective(aiInterpretation.mappedObjective, aiInterpretation.objectiveTitle);
  };

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#121414] text-[#e2e2e2] relative">
      {/* Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-radial from-[#10B981]/5 to-transparent pointer-events-none -z-0"></div>

      <SideNav currentStep="decision_objective" onNavigate={onNavigate} />
      <TopNav currentStep="decision_objective" onNavigate={onNavigate} />

      <main className="w-full h-full md:ml-64 pt-16 flex flex-col items-center justify-center relative z-10 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-5xl px-container-padding py-stack-lg flex flex-col gap-stack-lg animate-fadeIn">
          {/* AI Header */}
          <div className="flex items-start gap-stack-md">
            <div className="w-10 h-10 rounded-lg bg-[#0b0e14] border border-[#4edea3]/30 flex items-center justify-center shadow-[0_0_15px_rgba(78,222,163,0.1)] flex-shrink-0">
              <span className="material-symbols-outlined text-[#4edea3]">smart_toy</span>
            </div>
            <div className="pt-1">
              <h2 className="text-headline-lg font-[#Hanken Grotesk] font-semibold text-[#e2e2e2] mb-1 tracking-tight">
                What business decision are you trying to make today?
              </h2>
              <p className="text-body-md font-[#Inter] text-[#c6c6cb]">
                Select an analysis framework to initiate the intelligence gathering process.
              </p>
            </div>
          </div>

          {/* Selection Grid (6 Framework Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mt-stack-md">
            {FRAMEWORK_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleCardClick(option)}
                className={`insight-card rounded-xl p-stack-md text-left flex flex-col gap-stack-sm h-full group focus:outline-none focus:ring-1 focus:ring-[#4edea3] cursor-pointer transition-all ${
                  option.id === 'custom_objective'
                    ? 'border-[#4edea3]/30 bg-[#1E293B]/40 hover:border-[#4edea3]'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`material-symbols-outlined transition-colors ${
                    option.id === 'custom_objective' ? 'text-[#4edea3]' : 'text-[#c6c6cb] group-hover:text-[#4edea3]'
                  }`}>
                    {option.icon}
                  </span>
                  <span className="material-symbols-outlined text-[#c6c6cb] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    arrow_forward
                  </span>
                </div>
                <h3 className="text-body-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                  {option.title}
                </h3>
                <p className="text-body-md font-[#Inter] text-[#c6c6cb] mt-auto pt-2">
                  {option.description}
                </p>
              </button>
            ))}
          </div>

          {/* Manual Input Fallback & AI Interpretation Card */}
          <div className="mt-stack-md border-t border-[#45474b]/30 pt-stack-md w-full space-y-4">
            <form onSubmit={handleCustomSubmit} className="relative w-full max-w-2xl mx-auto">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Or type a specific question or scenario (e.g. Series B follow-on dilution analysis)..."
                className="w-full bg-[#0b0e14] border border-[#45474b] rounded-full py-3.5 pl-6 pr-14 text-body-md text-[#e2e2e2] focus:outline-none focus:border-[#4edea3] transition-colors placeholder:text-[#c6c6cb]/50 shadow-inner"
              />
              <button
                type="submit"
                disabled={isInterpreting || !customPrompt.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#282a2b] flex items-center justify-center text-[#e2e2e2] hover:text-[#4edea3] hover:bg-[#333535] transition-all disabled:opacity-40 cursor-pointer"
                title="Evaluate with Gemini"
              >
                {isInterpreting ? (
                  <span className="material-symbols-outlined text-sm animate-spin text-[#4edea3]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">send</span>
                )}
              </button>
            </form>

            {/* Single AI Interpretation Result Card */}
            {aiInterpretation && (
              <div className="max-w-2xl mx-auto bg-[#141820] border border-[#4edea3]/40 rounded-xl p-5 shadow-2xl animate-fadeIn space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-[#1E293B] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
                      <span className="material-symbols-outlined text-base">auto_awesome</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#4edea3]">
                          AI Framework Alignment
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 font-semibold">
                          {aiInterpretation.confidence}% Confidence
                        </span>
                      </div>
                      <h4 className="text-base font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                        {aiInterpretation.objectiveTitle}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => setAiInterpretation(null)}
                    className="text-[#909095] hover:text-[#e2e2e2] p-1 cursor-pointer"
                    title="Dismiss"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                <p className="text-xs text-[#c6c6cb] font-[#Inter] leading-relaxed">
                  {aiInterpretation.executiveSummary}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-[#Geist] text-[#909095] font-semibold uppercase tracking-wider block">
                    Recommended Telemetry Fields:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {aiInterpretation.recommendedFields.map((field, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#0b0e14] border border-[#1E293B] text-[#4edea3] px-2.5 py-1 rounded-md font-[#Geist] flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-[#1E293B]">
                  <button
                    type="button"
                    onClick={() => setAiInterpretation(null)}
                    className="px-3 py-1.5 text-xs font-[#Geist] text-[#c6c6cb] hover:text-[#e2e2e2] cursor-pointer"
                  >
                    Modify Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedWithAI}
                    className="bg-[#4edea3] text-[#003824] font-[#Hanken Grotesk] font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#6ffbbe] transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Proceed with Framework</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom Objective Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141820] border border-[#45474b] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
                  <span className="material-symbols-outlined">edit_square</span>
                </div>
                <div>
                  <h3 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                    Define Custom Objective
                  </h3>
                  <p className="text-xs font-[#Geist] text-[#c6c6cb]">
                    Specify your custom thesis or diligence target scenario
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-[#909095] hover:text-[#e2e2e2] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-[#Geist] text-[#c6c6cb] mb-2 uppercase tracking-wider">
                  Diligence Objective or Question
                </label>
                <textarea
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Evaluate Series B expansion thesis for B2B cybersecurity vendor targeting $50M ARR with multi-product cross-sell potential..."
                  className="w-full bg-[#0b0e14] border border-[#45474b] rounded-xl p-3.5 text-xs text-[#e2e2e2] focus:outline-none focus:border-[#4edea3] transition-colors resize-none placeholder:text-[#909095]"
                  autoFocus
                />
              </div>

              {/* Preset suggestion chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-[#Geist] text-[#909095]">Quick suggestions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Late Stage Growth Round Evaluation',
                    'Strategic Buyout & Restructuring Plan',
                    'Cross-Border Expansion Valuation',
                  ].map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomPrompt(sug)}
                      className="text-[11px] font-[#Geist] bg-[#1E293B] hover:bg-[#282a2b] text-[#c6c6cb] hover:text-[#4edea3] px-2.5 py-1 rounded border border-[#45474b]/50 transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-[#Geist] text-[#c6c6cb] hover:text-[#e2e2e2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customPrompt.trim()}
                  className="bg-[#4edea3] text-[#003824] font-[#Hanken Grotesk] font-bold text-xs px-5 py-2.5 rounded hover:bg-[#6ffbbe] transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Apply Custom Objective</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
