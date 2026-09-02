import React, { useState, useEffect, useCallback } from 'react';
import { FlowStep, UserProfile, UploadedDataset } from './types';
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { InvestorVerificationView } from './views/InvestorVerificationView';
import { DecisionObjectiveView } from './views/DecisionObjectiveView';
import { DatasetRequirementView } from './views/DatasetRequirementView';
import { DatasetUploadView } from './views/DatasetUploadView';
import { DataValidationView } from './views/DataValidationView';
import { AILoadingView } from './views/AILoadingView';
import { ExecutiveDashboardView } from './views/ExecutiveDashboardView';
import { ExplainableAIView } from './views/ExplainableAIView';
import { ExportMemoView } from './views/ExportMemoView';
import { SectorAnalysisView } from './views/SectorAnalysisView';
import { WatchlistView } from './views/WatchlistView';
import { generateInstitutionalSampleDataset } from './utils/datasetManager';

const WATCHLIST_STORAGE_KEY = 'boardiq_watchlist';

function loadWatchlist(): string[] {
  try {
    const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'Alexander Vance',
    company: 'Vance Capital Partners',
    role: 'Managing Partner',
    investorType: 'vc',
    country: 'United States',
    email: 'alexander@vancecapital.com',
  });

  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('investment_screening');
  const [selectedObjectiveTitle, setSelectedObjectiveTitle] = useState<string>('Investment Screening');
  const [uploadedFile, setUploadedFile] = useState<UploadedDataset | null>(() => generateInstitutionalSampleDataset());

  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => loadWatchlist());

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlistIds));
    } catch { /* quota exceeded — ignore */ }
  }, [watchlistIds]);

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlistIds((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id]
    );
  }, []);

  const handleLoginSuccess = (profileData?: Partial<UserProfile>) => {
    if (profileData) {
      setUserProfile((prev) => ({ ...prev, ...profileData }));
    }
    setCurrentStep('investor_verification');
  };

  const handleVerificationComplete = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setCurrentStep('decision_objective');
  };

  const handleSelectObjective = (id: string, title: string) => {
    setSelectedObjectiveId(id);
    setSelectedObjectiveTitle(title);
    setCurrentStep('dataset_requirement');
  };

  const handleUploadComplete = (fileData: UploadedDataset) => {
    setUploadedFile(fileData);
    setCurrentStep('data_validation');
  };

  return (
    <div className="min-h-screen bg-[#121414] text-[#e2e2e2] font-body-md selection:bg-[#4edea3] selection:text-[#003824]">
      {currentStep === 'landing' && (
        <LandingView
          onStart={() => setCurrentStep('login')}
          onLogin={() => setCurrentStep('login')}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}

      {currentStep === 'login' && (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onGoBackLanding={() => setCurrentStep('landing')}
        />
      )}

      {currentStep === 'investor_verification' && (
        <InvestorVerificationView
          userProfile={userProfile}
          onVerificationComplete={handleVerificationComplete}
          onGoBack={() => setCurrentStep('login')}
        />
      )}

      {currentStep === 'decision_objective' && (
        <DecisionObjectiveView
          onSelectObjective={handleSelectObjective}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}

      {currentStep === 'dataset_requirement' && (
        <DatasetRequirementView
          objectiveId={selectedObjectiveId}
          objectiveTitle={selectedObjectiveTitle}
          onProceedToUpload={() => setCurrentStep('dataset_upload')}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}

      {currentStep === 'dataset_upload' && (
        <DatasetUploadView
          objectiveId={selectedObjectiveId}
          objectiveTitle={selectedObjectiveTitle}
          onUploadComplete={handleUploadComplete}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}

      {currentStep === 'data_validation' && (
        <DataValidationView
          uploadedFile={uploadedFile}
          onProceedToAI={() => setCurrentStep('ai_loading')}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}

      {currentStep === 'ai_loading' && (
        <AILoadingView
          objectiveTitle={selectedObjectiveTitle}
          onLoadingComplete={() => setCurrentStep('executive_dashboard')}
        />
      )}

      {currentStep === 'executive_dashboard' && (
        <ExecutiveDashboardView
          objectiveTitle={selectedObjectiveTitle}
          onInspectAI={() => setCurrentStep('explainable_ai')}
          onExportMemo={() => setCurrentStep('export_memo')}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}

      {currentStep === 'explainable_ai' && (
        <ExplainableAIView
          onExportMemo={() => setCurrentStep('export_memo')}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}

      {currentStep === 'export_memo' && (
        <ExportMemoView
          userProfile={userProfile}
          objectiveTitle={selectedObjectiveTitle}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}

      {currentStep === 'sector_analysis' && (
        <SectorAnalysisView
          onSelectCompany={(companyName) => {
            setSelectedObjectiveTitle(`Analysis: ${companyName}`);
            setCurrentStep('executive_dashboard');
          }}
          onNavigate={(step) => setCurrentStep(step)}
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {currentStep === 'watchlist' && (
        <WatchlistView
          watchlistIds={watchlistIds}
          onToggleWatchlist={toggleWatchlist}
          onSelectCompany={(companyName) => {
            setSelectedObjectiveTitle(`Analysis: ${companyName}`);
            setCurrentStep('executive_dashboard');
          }}
          onNavigate={(step) => setCurrentStep(step)}
        />
      )}
    </div>
  );
}
