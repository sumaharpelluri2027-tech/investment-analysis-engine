import React, { useState } from 'react';
import { UserProfile } from '../types';

interface InvestorVerificationViewProps {
  userProfile: UserProfile;
  onVerificationComplete: (updatedProfile: UserProfile) => void;
  onGoBack: () => void;
}

export const InvestorVerificationView: React.FC<InvestorVerificationViewProps> = ({
  userProfile,
  onVerificationComplete,
  onGoBack,
}) => {
  const [fullName, setFullName] = useState(userProfile.fullName || 'Alexander Vance');
  const [company, setCompany] = useState(userProfile.company || 'Vance Capital Partners');
  const [role, setRole] = useState(userProfile.role || 'Managing Partner');
  const [investorType, setInvestorType] = useState(userProfile.investorType || 'vc');
  const [country, setCountry] = useState(userProfile.country || 'United States');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedBadge, setVerifiedBadge] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate verification check animation
    setTimeout(() => {
      setVerifiedBadge(true);
      setTimeout(() => {
        onVerificationComplete({
          fullName,
          company,
          role,
          investorType,
          country,
          email: userProfile.email,
        });
      }, 800);
    }, 1000);
  };

  return (
    <div className="bg-[#0B0E14] text-[#e2e2e2] min-h-screen flex items-center justify-center p-4 antialiased relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
        <div className="w-[800px] h-[800px] rounded-full bg-[#4edea3] opacity-[0.02] blur-[120px]"></div>
      </div>

      {/* Verification Card Container */}
      <main className="w-full max-w-[520px] bg-[#141820] border border-[#1E293B] rounded-xl overflow-hidden relative z-10 flex flex-col shadow-2xl">
        {/* Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#1E293B] to-transparent opacity-20 pointer-events-none"></div>

        <div className="p-8 relative z-10">
          <header className="mb-6 flex items-center gap-4 border-b border-[#1E293B] pb-5">
            <button
              onClick={onGoBack}
              type="button"
              className="text-[#c6c6cb] hover:text-[#e2e2e2] p-1.5 rounded bg-[#0B0E14] border border-[#1E293B] hover:bg-[#282a2b] transition-colors"
              title="Back to login"
            >
              <span className="material-symbols-outlined text-[20px] block">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-[#Hanken Grotesk] font-bold text-xl text-[#e2e2e2] tracking-tight">Complete Profile</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-[#Geist] uppercase bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
                  Step 2 of 3 (Verification)
                </span>
              </div>
              <p className="font-[#Inter] text-xs text-[#c6c6cb] mt-0.5">Institutional investor verification required for BoardIQ access.</p>
            </div>
          </header>

          {verifiedBadge ? (
            <div className="py-12 text-center animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#4edea3]/10 border border-[#4edea3]/30 text-[#4edea3] mx-auto flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h3 className="font-[#Hanken Grotesk] font-bold text-xl text-[#e2e2e2] mb-2">Verification Granted</h3>
              <p className="font-[#Inter] text-sm text-[#c6c6cb] max-w-sm mx-auto">
                Welcome, {fullName}. Your institutional profile at {company} has been verified for high-stakes decision intelligence.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-[#Geist] text-xs text-[#c6c6cb] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[#0B0E14] border border-[#1E293B] text-[#e2e2e2] rounded px-4 py-2.5 font-[#Inter] text-sm focus:outline-none focus:border-[#10B981] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-[#Geist] text-xs text-[#c6c6cb] mb-1.5">
                    Company / Firm
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Firm name"
                    className="w-full bg-[#0B0E14] border border-[#1E293B] text-[#e2e2e2] rounded px-4 py-2.5 font-[#Inter] text-sm focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-[#Geist] text-xs text-[#c6c6cb] mb-1.5">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Partner, Principal"
                    className="w-full bg-[#0B0E14] border border-[#1E293B] text-[#e2e2e2] rounded px-4 py-2.5 font-[#Inter] text-sm focus:outline-none focus:border-[#10B981] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-[#Geist] text-xs text-[#c6c6cb] mb-1.5">
                  Investor Category
                </label>
                <div className="relative">
                  <select
                    value={investorType}
                    onChange={(e) => setInvestorType(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#1E293B] text-[#e2e2e2] rounded px-4 py-2.5 font-[#Inter] text-sm appearance-none focus:outline-none focus:border-[#10B981] transition-all pr-10 cursor-pointer"
                  >
                    <option value="vc">Venture Capital</option>
                    <option value="pe">Private Equity</option>
                    <option value="angel">Angel Investor</option>
                    <option value="corp">Corporate M&A / Strategy</option>
                    <option value="family">Family Office</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#c6c6cb] pointer-events-none text-xl">
                    expand_more
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-[#Geist] text-xs text-[#c6c6cb] mb-1.5">
                  Jurisdiction / Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States, United Kingdom, Germany"
                  className="w-full bg-[#0B0E14] border border-[#1E293B] text-[#e2e2e2] rounded px-4 py-2.5 font-[#Inter] text-sm focus:outline-none focus:border-[#10B981] transition-all"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-[#0B0E14] font-[#Hanken Grotesk] font-bold text-sm py-3 px-4 rounded hover:bg-[#4edea3] hover:text-[#003824] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#0B0E14] border-t-transparent rounded-full animate-spin"></span>
                      <span>Verifying Accreditation...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Verification & Proceed</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-[#Geist] text-[#909095]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#4edea3]">lock</span>
              256-Bit SEC-Grade Encryption
            </span>
            <span>BoardIQ ID: RT-VERIFY-2026</span>
          </div>
        </div>
      </main>
    </div>
  );
};
