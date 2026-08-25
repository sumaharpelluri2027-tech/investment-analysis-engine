export type FlowStep =
  | 'landing'
  | 'login'
  | 'investor_verification'
  | 'decision_objective'
  | 'dataset_requirement'
  | 'dataset_upload'
  | 'data_validation'
  | 'ai_loading'
  | 'executive_dashboard'
  | 'explainable_ai'
  | 'export_memo'
  | 'sector_analysis';

export interface UserProfile {
  fullName: string;
  company: string;
  role: string;
  investorType: string;
  country: string;
  email?: string;
}

export interface UploadedRecord {
  company_name: string;
  industry_sector: string;
  annual_revenue_usd: number;
  growth_rate_pct: number;
  post_money_val_usd: number;
  total_active_customers: number;
  mrr_usd: number;
  arr_usd: number;
  nrr_pct?: number;
  churn_pct?: number;
  gross_margin_pct?: number;
  ebitda_margin_pct?: number;
  [key: string]: any;
}

export interface UploadedDataset {
  name: string;
  size: string;
  rows: number;
  columns?: string[];
  records?: UploadedRecord[];
  missingCount?: number;
  duplicateCount?: number;
  invalidCount?: number;
  outlierCount?: number;
  completenessPct?: number;
  confidenceScore?: number;
}

export interface AnalysisFramework {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredFields: string[];
}

export interface ValidationIssue {
  id: string;
  timestamp: string;
  entityId: string;
  issueType: string;
  severity: 'Warning' | 'Critical' | 'Info';
}

export interface AIRecommendation {
  companyName: string;
  ticker: string;
  sector: string;
  decision: 'BUY' | 'HOLD' | 'SELL';
  confidenceScore: number;
  executiveSummary: {
    revenueMomentum: string;
    marketPosition: string;
    capitalEfficiency: string;
  };
  supportingEvidence: {
    nrr: string;
    nrrChange: string;
    churnVelocity: string;
    churnChange: string;
    churnNote: string;
  };
  businessReasoning: string;
  risks: Array<{
    title: string;
    detail: string;
    severity: 'critical' | 'warning' | 'info';
  }>;
  suggestedAction: string;
}
