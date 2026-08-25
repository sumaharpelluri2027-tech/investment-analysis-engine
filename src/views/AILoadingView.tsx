import React, { useEffect, useState } from 'react';

interface AILoadingViewProps {
  onLoadingComplete: () => void;
  objectiveTitle?: string;
}

const REASONING_STEPS = [
  { title: 'Reading dataset...', desc: 'Ingesting 340 institutional telemetry rows' },
  { title: 'Validating data...', desc: 'Checking schema integrity & missing fields' },
  { title: 'Finding patterns...', desc: 'Auditing cohort retention & churn curves' },
  { title: 'Calculating metrics...', desc: 'Computing Rule of 40, CAC payback & burn multiple' },
  { title: 'Comparing companies...', desc: 'Benchmarking against top-quartile sector peers' },
  { title: 'Assessing risks...', desc: 'Evaluating single-customer concentration & runway' },
  { title: 'Generating recommendation...', desc: 'Synthesizing executive investment thesis & memo' },
];

export const AILoadingView: React.FC<AILoadingViewProps> = ({
  onLoadingComplete,
  objectiveTitle = 'Investment Screening',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const stepDuration = 550; // Total ~3.8 seconds for all 7 steps
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < REASONING_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 600);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  const progressPercent = Math.round(((currentStepIndex + 1) / REASONING_STEPS.length) * 100);

  return (
    <div className="bg-[#0B0E14] text-[#e2e2e2] min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden antialiased font-body-md">
      {/* Background AI Pulsing Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-[#4edea3] opacity-[0.05] blur-[140px] animate-pulse"></div>
      </div>

      <div className="w-full max-w-xl text-center relative z-10 space-y-6">
        {/* Animated AI Core Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-[#141820] border border-[#4edea3]/40 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(78,222,163,0.15)] relative">
            <span className="material-symbols-outlined text-4xl text-[#4edea3] animate-spin" style={{ animationDuration: '6s' }}>
              auto_awesome
            </span>
          </div>
          <div className="absolute inset-0 rounded-full border border-[#4edea3]/20 animate-ping" style={{ animationDuration: '3s' }}></div>
        </div>

        {/* Text Details */}
        <div>
          <span className="px-3 py-1 rounded-full bg-[#4edea3]/10 text-[#4edea3] font-[#Geist] text-xs uppercase tracking-widest border border-[#4edea3]/20 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            Gemini 2.5 Pro Financial Core
          </span>
          <h2 className="text-2xl md:text-3xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2] mt-3 mb-1">
            Synthesizing Decision Intelligence
          </h2>
          <p className="font-[#Inter] text-xs md:text-sm text-[#c6c6cb]">
            Executing institutional diligence for <span className="text-[#4edea3] font-semibold">{objectiveTitle}</span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#4edea3] h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Reasoning Steps Checklist */}
        <div className="glass-panel rounded-xl p-5 text-left border border-[#1E293B]">
          <div className="space-y-3">
            {REASONING_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <div className="w-5 h-5 rounded-full bg-[#4edea3] text-[#003824] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="material-symbols-outlined text-xs font-bold">check</span>
                      </div>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#4edea3] border-t-transparent animate-spin flex-shrink-0"></div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#45474b] flex-shrink-0"></div>
                    )}

                    <span
                      className={`font-[#Geist] text-xs transition-colors ${
                        isDone
                          ? 'text-[#e2e2e2] font-medium'
                          : isCurrent
                          ? 'text-[#4edea3] font-semibold'
                          : 'text-[#909095]'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>

                  <span className="font-[#Geist] text-[10px] text-[#909095] hidden sm:inline">
                    {step.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manual Skip Option */}
        <div>
          <button
            onClick={onLoadingComplete}
            className="text-xs text-[#c6c6cb] hover:text-[#4edea3] font-[#Geist] transition-colors cursor-pointer inline-flex items-center gap-1.5 py-1 px-3 rounded hover:bg-[#1E293B]"
          >
            <span>Skip animation & reveal dashboard</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
