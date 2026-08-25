import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LoginViewProps {
  onLoginSuccess: (profile?: Partial<UserProfile>) => void;
  onGoBackLanding?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onGoBackLanding }) => {
  const [authMode, setAuthMode] = useState<'options' | 'email'>('options');
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({ email });
  };

  const handleSocialLogin = (provider: string) => {
    onLoginSuccess({ email: `investor@${provider.toLowerCase()}.com` });
  };

  return (
    <div className="bg-[#0B0E14] text-[#e2e2e2] min-h-screen flex items-center justify-center p-4 antialiased relative overflow-hidden">
      {/* Background Ambient Element */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
        <div className="w-[800px] h-[800px] rounded-full bg-[#4edea3] opacity-[0.03] blur-[120px]"></div>
      </div>

      {/* Back to landing button */}
      {onGoBackLanding && (
        <button
          onClick={onGoBackLanding}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-[#c6c6cb] hover:text-[#e2e2e2] font-[#Geist] text-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Home</span>
        </button>
      )}

      {/* Login Card Container */}
      <main className="w-full max-w-[480px] bg-[#141820] border border-[#1E293B] rounded-xl overflow-hidden relative z-10 flex flex-col shadow-2xl">
        {/* Subtle Top Gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#1E293B] to-transparent opacity-20 pointer-events-none"></div>

        <div className="p-8 relative z-10">
          <header className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#4edea3]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
              <span className="font-[#Hanken Grotesk] font-bold text-2xl text-[#e2e2e2] tracking-tight">BoardIQ</span>
            </div>
            <p className="font-[#Inter] text-sm text-[#c6c6cb]">Sign in to access AI Decision Intelligence</p>
          </header>

          {authMode === 'options' ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setAuthMode('email')}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#0B0E14] border border-[#1E293B] rounded hover:bg-[#282a2b] transition-colors duration-200 group"
              >
                <span className="material-symbols-outlined text-[20px] text-[#e2e2e2] group-hover:text-[#4edea3] transition-colors">mail</span>
                <span className="font-[#Geist] text-xs font-medium text-[#e2e2e2]">Continue with Email & Access Key</span>
              </button>

              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-[#1E293B]"></div>
                <span className="flex-shrink-0 mx-4 font-[#Geist] text-[11px] text-[#c6c6cb] uppercase tracking-widest">Or SSO</span>
                <div className="flex-grow border-t border-[#1E293B]"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#0B0E14] border border-[#1E293B] rounded hover:bg-[#282a2b] transition-colors duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-[#Geist] text-xs font-medium text-[#e2e2e2]">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#0B0E14] border border-[#1E293B] rounded hover:bg-[#282a2b] transition-colors duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path d="M0 0h11v11H0z" fill="#f35325" />
                    <path d="M12 0h11v11H12z" fill="#81bc06" />
                    <path d="M0 12h11v11H0z" fill="#05a6f0" />
                    <path d="M12 12h11v11H12z" fill="#ffba08" />
                  </svg>
                  <span className="font-[#Geist] text-xs font-medium text-[#e2e2e2]">Microsoft</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block font-[#Geist] text-xs text-[#c6c6cb] mb-1.5">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="investor@firm.com"
                  className="w-full bg-[#0B0E14] border border-[#1E293B] text-[#e2e2e2] rounded px-4 py-2.5 font-[#Inter] text-sm focus:outline-none focus:border-[#10B981] transition-all"
                />
              </div>

              <div>
                <label className="block font-[#Geist] text-xs text-[#c6c6cb] mb-1.5 flex justify-between items-center">
                  <span>Enterprise Access Key</span>
                  <span className="text-[10px] text-[#4edea3]">Key Provided by Fund Administrator</span>
                </label>
                <input
                  type="password"
                  required
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="••••-••••-••••-••••"
                  className="w-full bg-[#0B0E14] border border-[#1E293B] text-[#e2e2e2] rounded px-4 py-2.5 font-[#Inter] text-sm focus:outline-none focus:border-[#10B981] transition-all"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setAuthMode('options')}
                  className="w-1/3 border border-[#1E293B] text-[#c6c6cb] hover:text-[#e2e2e2] py-3 px-3 rounded font-[#Geist] text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-white text-[#0B0E14] font-[#Hanken Grotesk] font-semibold text-sm py-3 px-4 rounded hover:bg-[#4edea3] hover:text-[#003824] transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          <p className="mt-8 text-center font-[#Inter] text-[12px] text-[#c6c6cb]">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#e2e2e2] hover:text-[#4edea3] transition-colors underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-[#e2e2e2] hover:text-[#4edea3] transition-colors underline">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
};
