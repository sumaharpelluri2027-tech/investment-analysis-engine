import React, { useState } from 'react';
import { FlowStep } from '../types';
import { SideNav } from '../components/SideNav';
import { TopNav } from '../components/TopNav';
import { FRAMEWORK_OPTIONS } from './DecisionObjectiveView';

interface DatasetRequirementViewProps {
  objectiveId: string;
  objectiveTitle: string;
  onProceedToUpload: () => void;
  onNavigate: (step: FlowStep) => void;
}

interface FieldDetail {
  whyCritical: string;
  impact: string;
  expectedFormat: string;
  sampleHeader: string;
  categoryIcon: string;
}

const FIELD_DETAILS_MAP: Record<string, FieldDetail> = {
  'Company Name & Industry': {
    whyCritical: 'Essential for matching macroeconomic multiples, sector peer group comparisons, and industry risk weighting.',
    impact: 'High (+15% Peer Alignment)',
    expectedFormat: 'String / Categorical',
    sampleHeader: 'company_name, industry_sector',
    categoryIcon: 'domain',
  },
  'Revenue & Growth Rate': {
    whyCritical: 'Core engine metric to calculate CAGR trajectory, validate Rule of 40 score, and project future cash flows.',
    impact: 'Critical (+25% Model Confidence)',
    expectedFormat: 'Currency ($) / Percentage (%)',
    sampleHeader: 'annual_revenue_usd, growth_rate_pct',
    categoryIcon: 'trending_up',
  },
  'Current Valuation (if known)': {
    whyCritical: 'Sets entry EV baseline to calculate MOIC (Multiple on Invested Capital) and IRR return sensitivity.',
    impact: 'High (Return Calibration)',
    expectedFormat: 'Currency USD',
    sampleHeader: 'post_money_val_usd',
    categoryIcon: 'price_change',
  },
  'Customer Count': {
    whyCritical: 'Required to audit revenue concentration, calculate ARPU (Average Revenue Per User), and detect single-customer risk.',
    impact: 'Medium (Concentration Audit)',
    expectedFormat: 'Integer Count',
    sampleHeader: 'total_active_customers',
    categoryIcon: 'groups',
  },
  'MRR / ARR': {
    whyCritical: 'Primary baseline metric for recurring financial health, growth momentum, and annual contract value calculations.',
    impact: 'Critical (+30% Forecast Precision)',
    expectedFormat: 'Currency USD',
    sampleHeader: 'mrr_usd, arr_usd',
    categoryIcon: 'payments',
  },
  'Target Financial Audits (3 yrs)': {
    whyCritical: 'Crucial for QoE (Quality of Earnings) validation, discovering hidden liabilities, and historical gross margin trends.',
    impact: 'Critical (Audit Risk Reduction)',
    expectedFormat: 'Structured Statement Array',
    sampleHeader: 'fy23_rev, fy24_rev, fy25_rev',
    categoryIcon: 'receipt_long',
  },
  'Cost Structure & OPEX Breakdown': {
    whyCritical: 'Necessary for identifying duplicate overhead, evaluating R&D/S&M ratio efficiency, and modeling post-merger OPEX.',
    impact: 'High (Synergy Identification)',
    expectedFormat: 'Currency breakdown',
    sampleHeader: 'sm_opex, rd_opex, ga_opex',
    categoryIcon: 'account_balance_wallet',
  },
  'EBITDA & Synergies Baseline': {
    whyCritical: 'Primary anchor for debt capacity, debt service coverage, and accretion/dilution analysis in M&A transactions.',
    impact: 'Critical (M&A Valuation)',
    expectedFormat: 'Currency ($) / Margin (%)',
    sampleHeader: 'ebitda_usd, projected_synergies',
    categoryIcon: 'balance',
  },
  'IP & Tech Stack Audit': {
    whyCritical: 'Identifies software technical debt, open-source compliance liabilities, and proprietary technology moat strength.',
    impact: 'Medium (Moat Risk)',
    expectedFormat: 'Categorical Audit Text',
    sampleHeader: 'ip_patent_count, tech_stack',
    categoryIcon: 'code',
  },
  'Employee & Talent Roster': {
    whyCritical: 'Evaluates key-person risks, headcount efficiency (Revenue per Employee), and post-acquisition retention budget.',
    impact: 'Medium (Human Capital Score)',
    expectedFormat: 'Headcount & Salary Array',
    sampleHeader: 'headcount_total, avg_comp',
    categoryIcon: 'badge',
  },
  'Fund Holdings & Equity Ownership': {
    whyCritical: 'Required to compute diluted equity position, cap table ownership %, and follow-on pro-rata participation rights.',
    impact: 'High (Cap Table Precision)',
    expectedFormat: 'Percentage (%) / Share Count',
    sampleHeader: 'equity_ownership_pct',
    categoryIcon: 'pie_chart',
  },
  'Quarterly Burn & Runway Months': {
    whyCritical: 'Predicts exact capital call needs, insolvencies, and optimal timing for follow-on extension rounds.',
    impact: 'Critical (Liquidity Warning)',
    expectedFormat: 'Monthly Burn Rate / Months',
    sampleHeader: 'net_monthly_burn, runway_months',
    categoryIcon: 'hourglass_bottom',
  },
  'LTV / CAC Ratio Data': {
    whyCritical: 'Determines long-term unit economics viability, customer payback duration, and marketing efficiency scalability.',
    impact: 'Critical (Unit Economics)',
    expectedFormat: 'Ratio Decimal (e.g. 4.2x)',
    sampleHeader: 'ltv_usd, cac_usd, ltv_cac_ratio',
    categoryIcon: 'analytics',
  },
  'Valuation Markups / Markdown History': {
    whyCritical: 'Required for ASC 820 GAAP fair-value reporting and tracking fund historical IRR and TVPI performance.',
    impact: 'Medium (Fund Compliance)',
    expectedFormat: 'Historical Valuation Array',
    sampleHeader: 'last_round_val, markup_pct',
    categoryIcon: 'history_edu',
  },
  'Stage & Capital Raised to Date': {
    whyCritical: 'Normalizes growth standards by funding maturity phase (Seed vs Series A/B) and measures capital efficiency.',
    impact: 'High (Peer Normalization)',
    expectedFormat: 'Stage String / Currency USD',
    sampleHeader: 'funding_stage, total_raised',
    categoryIcon: 'rocket',
  },
  'Monthly Active Users (MAU/DAU)': {
    whyCritical: 'Measures organic usage velocity, product-market fit stickiness, and DAU/MAU engagement ratios.',
    impact: 'High (Product Stickiness)',
    expectedFormat: 'Integer User Counts',
    sampleHeader: 'dau_count, mau_count',
    categoryIcon: 'insights',
  },
  'Gross Margin %': {
    whyCritical: 'Determines software operating leverage potential, hosting cost scalability, and long-term cash generation capability.',
    impact: 'Critical (+20% Margin Reliability)',
    expectedFormat: 'Percentage Ratio (%)',
    sampleHeader: 'gross_margin_pct',
    categoryIcon: 'percent',
  },
  'Net Revenue Retention Rate': {
    whyCritical: 'Single most important metric for evaluating expansion revenue, product stickiness, and negative churn health.',
    impact: 'Critical (+35% Growth Quality)',
    expectedFormat: 'Percentage Ratio (%)',
    sampleHeader: 'nrr_pct, churn_rate_pct',
    categoryIcon: 'repeat',
  },
  'Rule of 40 Score Data': {
    whyCritical: 'Combines YoY growth rate and EBITDA margin to score growth equity trajectory against top-tier tech benchmarks.',
    impact: 'High (Institutional Grade)',
    expectedFormat: 'Combined Score (%)',
    sampleHeader: 'growth_plus_margin_score',
    categoryIcon: 'verified',
  },
  'TAM / SAM / SOM Market Estimates': {
    whyCritical: 'Establishes maximum revenue upside potential and caps market saturation limits for TAM penetration.',
    impact: 'High (Market Ceiling)',
    expectedFormat: 'Currency Billions ($)',
    sampleHeader: 'tam_usd_billions, sam_usd_billions',
    categoryIcon: 'public',
  },
  'Competitor Revenue & Market Share': {
    whyCritical: 'Quantifies market fragmentation, Herfindahl-Hirschman concentration, and competitive displacement velocity.',
    impact: 'High (Competitive Risk)',
    expectedFormat: 'Market Share (%)',
    sampleHeader: 'top3_competitor_share_pct',
    categoryIcon: 'travel_explore',
  },
  'Regulatory Exposure Index': {
    whyCritical: 'Identifies legal compliance risks, data privacy liabilities (GDPR/HIPAA), and potential regulatory fines.',
    impact: 'Medium (Compliance Hazard)',
    expectedFormat: 'Risk Index / Score',
    sampleHeader: 'compliance_risk_rating',
    categoryIcon: 'gavel',
  },
  'Customer Acquisition Cost Dynamics': {
    whyCritical: 'Reveals payback period trend lines, channel saturation risk, and sales rep productivity efficiency.',
    impact: 'High (GTM Efficiency)',
    expectedFormat: 'Currency ($) / Months',
    sampleHeader: 'blended_cac_usd, payback_months',
    categoryIcon: 'campaign',
  },
};

function getFieldDetail(fieldName: string, objectiveTitle: string): FieldDetail {
  if (FIELD_DETAILS_MAP[fieldName]) {
    return FIELD_DETAILS_MAP[fieldName];
  }
  return {
    whyCritical: `Crucial telemetry point required by BoardIQ financial engine to evaluate target risk and project return metrics for ${objectiveTitle}.`,
    impact: 'High (+15% Model Reliability)',
    expectedFormat: 'Standard Text / Currency / Numerical',
    sampleHeader: fieldName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    categoryIcon: 'info',
  };
}

export const DatasetRequirementView: React.FC<DatasetRequirementViewProps> = ({
  objectiveId,
  objectiveTitle,
  onProceedToUpload,
  onNavigate,
}) => {
  const selectedFramework = FRAMEWORK_OPTIONS.find((f) => f.id === objectiveId) || FRAMEWORK_OPTIONS[0];
  const [downloading, setDownloading] = useState(false);
  const [activeTooltipField, setActiveTooltipField] = useState<string | null>(null);

  const handleDownloadTemplate = () => {
    setDownloading(true);
    // Create CSV content dynamically based on required fields
    const headers = selectedFramework.requiredFields.join(',') + '\n';
    const sampleRow = selectedFramework.requiredFields.map(() => 'Sample_Value').join(',') + '\n';
    const blob = new Blob([headers + sampleRow], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFramework.id}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
      setDownloading(false);
    }, 800);
  };

  const toggleTooltip = (field: string) => {
    setActiveTooltipField((prev) => (prev === field ? null : field));
  };

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#121414] text-[#e2e2e2]">
      <SideNav currentStep="dataset_requirement" onNavigate={onNavigate} />
      <TopNav currentStep="dataset_requirement" onNavigate={onNavigate} />

      <main className="flex-1 md:ml-64 mt-16 p-container-padding overflow-y-auto custom-scrollbar relative">
        <div className="max-w-5xl mx-auto space-y-stack-lg pb-stack-lg">
          {/* Breadcrumb Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-[#Geist] text-xs text-[#4edea3] tracking-widest uppercase">
                {objectiveTitle.toUpperCase()}
              </span>
              <span className="material-symbols-outlined text-[#909095] text-sm">chevron_right</span>
              <span className="font-[#Geist] text-xs text-[#c6c6cb]">Dataset Requirement Generator</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
              Dataset Requirements Schema
            </h2>
            <p className="text-body-lg font-[#Inter] text-[#c6c6cb] mt-2 max-w-2xl">
              BoardIQ engine requires structured parameters to perform predictive financial modeling and audit due diligence for <span className="text-[#e2e2e2] font-semibold">{objectiveTitle}</span>.
            </p>
          </div>

          {/* Requirements Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Required Fields Detail Card */}
            <div className="lg:col-span-7 ai-glow">
              <div className="glass-panel rounded-xl p-stack-lg h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#4edea3]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        psychology
                      </span>
                      <h3 className="text-xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                        Required Telemetry Fields
                      </h3>
                    </div>

                    {/* Interactive Spec Badge Tooltip */}
                    <div className="relative group">
                      <span className="px-2.5 py-1 rounded-full bg-[#4edea3]/10 text-[#4edea3] font-[#Geist] text-[11px] border border-[#4edea3]/20 flex items-center gap-1 cursor-help">
                        <span className="material-symbols-outlined text-xs">auto_awesome</span>
                        <span>Model v2.4 Spec</span>
                      </span>
                      <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#141820] border border-[#4edea3]/30 rounded-lg shadow-2xl z-30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto text-xs font-[#Geist]">
                        <p className="font-semibold text-[#4edea3] mb-1">Gemini Financial Core Requirement</p>
                        <p className="text-[#c6c6cb] text-[11px] leading-tight">
                          These fields directly feed the Monte Carlo scenario models. Hover or tap "Why Required?" on any field to inspect criticality.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-body-md font-[#Inter] text-[#c6c6cb] mb-6">
                    Ensure your source CSV, Excel, or JSON exports contain headers matching the following attributes for maximum confidence rating:
                  </p>

                  <ul className="space-y-4">
                    {selectedFramework.requiredFields.map((field, index) => {
                      const detail = getFieldDetail(field, objectiveTitle);
                      const isTooltipOpen = activeTooltipField === field;

                      return (
                        <li key={index} className="relative p-3 rounded-lg bg-[#0b0e14] border border-[#1E293B] hover:border-[#45474b] transition-all">
                          <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-[#4edea3] text-sm mt-0.5 flex-shrink-0">
                              check_circle
                            </span>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-[#Geist] text-xs font-semibold text-[#e2e2e2]">
                                  {field}
                                </span>

                                {/* Interactive Info Icon & Tooltip Trigger */}
                                <div className="relative inline-block">
                                  <button
                                    type="button"
                                    onClick={() => toggleTooltip(field)}
                                    className="text-[#909095] hover:text-[#4edea3] focus:text-[#4edea3] transition-colors p-0.5 rounded cursor-pointer flex items-center"
                                    title="Click or hover to inspect why this field is critical"
                                  >
                                    <span className="material-symbols-outlined text-xs">info</span>
                                  </button>

                                  {/* Interactive Tooltip Card Popover */}
                                  {isTooltipOpen && (
                                    <div className="absolute left-0 sm:left-6 top-6 sm:-top-2 z-40 w-72 sm:w-80 p-4 bg-[#141820] border border-[#4edea3]/40 rounded-xl shadow-2xl text-xs font-[#Geist] animate-fadeIn">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-1.5 text-[#4edea3] font-semibold">
                                          <span className="material-symbols-outlined text-sm">{detail.categoryIcon}</span>
                                          <span>Why Critical for Objective</span>
                                        </div>
                                        <button
                                          onClick={() => setActiveTooltipField(null)}
                                          className="text-[#909095] hover:text-[#e2e2e2] text-xs"
                                        >
                                          ✕
                                        </button>
                                      </div>

                                      <p className="text-[#e2e2e2] font-[#Inter] text-xs leading-relaxed mb-3">
                                        {detail.whyCritical}
                                      </p>

                                      <div className="space-y-1.5 border-t border-[#1E293B] pt-2 text-[11px]">
                                        <div className="flex justify-between">
                                          <span className="text-[#909095]">Objective Context:</span>
                                          <span className="text-[#4edea3] font-semibold">{objectiveTitle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-[#909095]">Confidence Impact:</span>
                                          <span className="text-[#6ffbbe] font-semibold">{detail.impact}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-[#909095]">Expected Format:</span>
                                          <span className="text-[#c6c6cb]">{detail.expectedFormat}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-[#909095]">Sample CSV Header:</span>
                                          <code className="text-[#4edea3] bg-[#0b0e14] px-1 py-0.5 rounded font-mono text-[10px]">
                                            {detail.sampleHeader}
                                          </code>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <p className="text-[12px] text-[#c6c6cb] mt-0.5">
                                {detail.whyCritical}
                              </p>

                              <div className="flex items-center gap-3 mt-2 text-[10px] font-[#Geist]">
                                <span className="text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20 font-medium">
                                  {detail.impact}
                                </span>
                                <span className="text-[#909095]">Format: {detail.expectedFormat}</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleTooltip(field)}
                              className={`px-2.5 py-1 rounded font-[#Geist] text-[10px] font-semibold transition-all cursor-pointer flex-shrink-0 ${
                                isTooltipOpen
                                  ? 'bg-[#4edea3] text-[#003824]'
                                  : 'bg-[#282a2b] hover:bg-[#333535] text-[#c6c6cb] hover:text-[#4edea3]'
                              }`}
                            >
                              {isTooltipOpen ? 'Close Rationale' : 'Why Required?'}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={handleDownloadTemplate}
                    disabled={downloading}
                    className="text-[#4edea3] hover:text-[#6ffbbe] font-[#Geist] text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>{downloading ? 'Generating Template...' : 'Download Starter Template (.CSV)'}</span>
                  </button>

                  <button
                    onClick={onProceedToUpload}
                    className="bg-white text-[#0B0E14] px-6 py-3 rounded font-[#Hanken Grotesk] font-bold text-sm hover:bg-[#4edea3] hover:text-[#003824] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Proceed to Data Upload</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Validation Standard & Sample Card */}
            <div className="lg:col-span-5 flex flex-col gap-gutter">
              {/* Specification Card */}
              <div className="glass-panel rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3 text-[#4edea3]">
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <h4 className="font-[#Geist] text-xs uppercase tracking-wider font-semibold">Institutional Security Protocol</h4>
                </div>
                <p className="font-[#Inter] text-xs text-[#c6c6cb] leading-relaxed mb-4">
                  All uploaded datasets undergo automated 256-bit anonymization and schema verification. Data remains strictly private to your firm's session.
                </p>
                <div className="p-3 bg-[#0b0e14] border border-[#1E293B] rounded space-y-2">
                  <div className="flex justify-between text-[11px] font-[#Geist]">
                    <span className="text-[#909095]">Supported Formats</span>
                    <span className="text-[#e2e2e2]">.CSV, .XLSX, .JSON</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-[#Geist]">
                    <span className="text-[#909095]">Max File Size</span>
                    <span className="text-[#e2e2e2]">250 MB / Dataset</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-[#Geist]">
                    <span className="text-[#909095]">Target Engine</span>
                    <span className="text-[#4edea3]">Gemini 2.5 Pro Financial Core</span>
                  </div>
                </div>
              </div>

              {/* Sample Data Matrix Preview */}
              <div className="glass-panel rounded-xl p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-[#Hanken Grotesk] font-bold text-sm text-[#e2e2e2] mb-3">
                    Sample Schema Matrix
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px] font-[#Geist]">
                      <thead>
                        <tr className="border-b border-[#1E293B] text-[#909095]">
                          <th className="py-2 pr-2">FIELD</th>
                          <th className="py-2 pr-2">TYPE</th>
                          <th className="py-2">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E293B]/50 text-[#c6c6cb]">
                        <tr>
                          <td className="py-2 pr-2 text-[#e2e2e2]">Company_Name</td>
                          <td className="py-2 pr-2">String</td>
                          <td className="py-2 text-[#4edea3]">Valid</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 text-[#e2e2e2]">Revenue_YoY</td>
                          <td className="py-2 pr-2">Float (%)</td>
                          <td className="py-2 text-[#4edea3]">Valid</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-2 text-[#e2e2e2]">ARR_USD</td>
                          <td className="py-2 pr-2">Currency</td>
                          <td className="py-2 text-[#4edea3]">Valid</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1E293B] flex justify-between items-center text-xs text-[#c6c6cb]">
                  <span>Ready to ingest?</span>
                  <button
                    onClick={onProceedToUpload}
                    className="text-[#4edea3] hover:underline font-[#Geist] flex items-center gap-1 cursor-pointer"
                  >
                    Upload Dataset Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
