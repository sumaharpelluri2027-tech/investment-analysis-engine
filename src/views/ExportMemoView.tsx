import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { FlowStep, UserProfile } from '../types';
import { SideNav } from '../components/SideNav';
import { TopNav } from '../components/TopNav';
import { ToastNotification, ToastMessage } from '../components/ToastNotification';

interface ExportMemoViewProps {
  userProfile: UserProfile;
  objectiveTitle?: string;
  onNavigate: (step: FlowStep) => void;
}

export const ExportMemoView: React.FC<ExportMemoViewProps> = ({
  userProfile,
  objectiveTitle = 'Investment Screening',
  onNavigate,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [pdfTheme, setPdfTheme] = useState<'dark' | 'light'>('light');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const memoRef = useRef<HTMLDivElement>(null);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 5 seconds if not loading type
    if (toast.type !== 'loading') {
      setTimeout(() => {
        dismissToast(id);
      }, 5000);
    }
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePrintPdf = () => {
    addToast({
      type: 'info',
      title: 'Print Preview Initiated',
      description: 'Preparing printable Executive Memorandum document...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    addToast({
      type: 'success',
      title: 'Share Link Copied',
      description: 'Direct link to this Investment Memo copied to your clipboard.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (!memoRef.current) return;
    setIsGeneratingPdf(true);
    setPdfDownloaded(false);

    const loadingToastId = addToast({
      type: 'loading',
      title: 'Memo PDF Export Started',
      description: 'Compiling high-resolution vector layout & financial charts...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    try {
      const element = memoRef.current;
      
      const imgData = await toPng(element, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: pdfTheme === 'light' ? '#ffffff' : '#141820',
        cacheBust: true,
      });

      const img = new Image();
      img.src = imgData;
      await new Promise((resolve, reject) => {
        img.onload = () => resolve(true);
        img.onerror = reject;
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (img.naturalHeight * imgWidth) / img.naturalWidth;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const fileName = `BoardIQ_Memo_NTG_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);

      setPdfDownloaded(true);
      dismissToast(loadingToastId);

      addToast({
        type: 'success',
        title: 'Memo Export Successfully Completed!',
        description: `${fileName} has been saved to your downloads folder.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });

      setTimeout(() => setPdfDownloaded(false), 4000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      dismissToast(loadingToastId);
      addToast({
        type: 'error',
        title: 'Memo Export Fallback',
        description: 'Opening print dialog for high-fidelity PDF output...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
      setTimeout(() => {
        window.print();
      }, 400);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#121414] text-[#e2e2e2]">
      <SideNav currentStep="export_memo" onNavigate={onNavigate} />
      <TopNav currentStep="export_memo" onNavigate={onNavigate} />

      <main className="flex-1 md:ml-64 mt-16 p-container-padding overflow-y-auto custom-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-stack-lg pb-stack-lg print:p-0 print:m-0 print:max-w-none">
          {/* Top Controls Bar (Hidden during Print) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-[#Geist] text-xs text-[#4edea3] tracking-widest uppercase">
                  Executive Export
                </span>
                <span className="material-symbols-outlined text-[#909095] text-sm">chevron_right</span>
                <span className="font-[#Geist] text-xs text-[#c6c6cb]">Investment Memorandum</span>
              </div>
              <h2 className="text-3xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                Export Investment Memo
              </h2>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleCopyLink}
                className="bg-[#282a2b] border border-[#45474b] text-[#e2e2e2] hover:bg-[#333535] px-3.5 py-2.5 rounded font-[#Geist] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">link</span>
                <span>{copiedLink ? 'Copied!' : 'Share Link'}</span>
              </button>
              
              <button
                onClick={handlePrintPdf}
                className="bg-[#282a2b] border border-[#45474b] text-[#e2e2e2] hover:bg-[#333535] px-3.5 py-2.5 rounded font-[#Geist] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-[#4edea3] text-[#003824] font-[#Hanken Grotesk] font-bold text-xs px-5 py-2.5 rounded hover:bg-[#6ffbbe] transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Download PDF Memo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export Options Customization Bar */}
          <div className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden text-xs font-[#Geist]">
            <div className="flex items-center gap-6">
              <span className="text-[#c6c6cb] font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#4edea3]">tune</span>
                Format Settings:
              </span>

              <label className="flex items-center gap-2 text-[#c6c6cb] cursor-pointer hover:text-[#e2e2e2]">
                <input
                  type="checkbox"
                  checked={includeWatermark}
                  onChange={(e) => setIncludeWatermark(e.target.checked)}
                  className="rounded border-[#45474b] bg-[#0b0e14] text-[#4edea3] focus:ring-0"
                />
                <span>Confidentiality Watermark</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#909095]">PDF Theme:</span>
              <button
                onClick={() => setPdfTheme('light')}
                className={`px-3 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  pdfTheme === 'light'
                    ? 'bg-white text-[#0B0E14]'
                    : 'bg-[#0b0e14] text-[#c6c6cb] border border-[#1E293B]'
                }`}
              >
                Executive Light
              </button>
              <button
                onClick={() => setPdfTheme('dark')}
                className={`px-3 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  pdfTheme === 'dark'
                    ? 'bg-[#4edea3] text-[#003824]'
                    : 'bg-[#0b0e14] text-[#c6c6cb] border border-[#1E293B]'
                }`}
              >
                Dark Institutional
              </button>
            </div>
          </div>

          {/* Success Toast Banner */}
          {pdfDownloaded && (
            <div className="p-4 rounded-xl bg-[#4edea3]/10 border border-[#4edea3]/40 text-[#4edea3] font-[#Geist] text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Professional PDF Investment Memorandum downloaded successfully!</span>
              </div>
              <span className="text-[10px] text-[#c6c6cb]">Saved to your local Downloads folder</span>
            </div>
          )}

          {/* Printable Memo Document Card */}
          <div
            ref={memoRef}
            className={`border rounded-xl p-8 sm:p-12 shadow-2xl document-card space-y-8 relative overflow-hidden transition-colors ${
              pdfTheme === 'light'
                ? 'bg-white text-[#0b0e14] border-gray-200'
                : 'bg-[#141820] text-[#e2e2e2] border-[#1E293B]'
            } print:border-none print:shadow-none print:bg-white print:text-black`}
          >
            {/* Confidential Watermark Overlay */}
            {includeWatermark && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none">
                <span className="text-7xl font-bold uppercase tracking-widest text-center rotate-[-30deg]">
                  BOARD IQ CONFIDENTIAL
                </span>
              </div>
            )}

            {/* Memo Header */}
            <div className={`border-b pb-6 flex flex-col sm:flex-row justify-between items-start gap-4 ${
              pdfTheme === 'light' ? 'border-gray-200' : 'border-[#1E293B]'
            } print:border-gray-300`}>
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined font-bold ${
                    pdfTheme === 'light' ? 'text-[#003824]' : 'text-[#4edea3]'
                  } print:text-black`}>query_stats</span>
                  <span className="font-[#Hanken Grotesk] font-bold text-xl tracking-tight">BoardIQ</span>
                </div>
                <h1 className="text-2xl font-[#Hanken Grotesk] font-bold tracking-tight print:text-black">
                  INVESTMENT COMMITTEE MEMORANDUM
                </h1>
                <p className={`font-[#Geist] text-xs uppercase tracking-wider mt-1 ${
                  pdfTheme === 'light' ? 'text-gray-500' : 'text-[#c6c6cb]'
                } print:text-gray-600`}>
                  Confidential • For Institutional IC Review Only
                </p>
              </div>

              <div className="text-left sm:text-right font-[#Geist] text-xs space-y-1">
                <p><span className={pdfTheme === 'light' ? 'text-gray-500' : 'text-[#909095]'}>Date:</span> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p><span className={pdfTheme === 'light' ? 'text-gray-500' : 'text-[#909095]'}>Author:</span> {userProfile.fullName || 'Alexander Vance'} ({userProfile.company || 'Vance Capital'})</p>
                <p><span className={pdfTheme === 'light' ? 'text-gray-500' : 'text-[#909095]'}>Framework:</span> {objectiveTitle}</p>
                <p><span className={pdfTheme === 'light' ? 'text-gray-500' : 'text-[#909095]'}>Target Entity:</span> Nexus Technologies Group (NTG)</p>
              </div>
            </div>

            {/* Verdict Callout Banner */}
            <div className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${
              pdfTheme === 'light'
                ? 'bg-gray-50 border-gray-300'
                : 'bg-[#0b0e14] border-[#4edea3]/40'
            } print:bg-gray-100 print:border-gray-400`}>
              <div>
                <span className={`font-[#Geist] text-[10px] uppercase font-bold tracking-widest block ${
                  pdfTheme === 'light' ? 'text-[#003824]' : 'text-[#4edea3]'
                } print:text-black`}>
                  AI DECISION RECOMMENDATION
                </span>
                <span className="font-[#Hanken Grotesk] text-xl font-bold print:text-black">
                  BUY — Target Allocation Recommended
                </span>
              </div>
              <div className="text-right font-[#Geist]">
                <span className={`text-2xl font-bold ${
                  pdfTheme === 'light' ? 'text-[#003824]' : 'text-[#4edea3]'
                } print:text-black`}>94%</span>
                <span className={`text-[10px] block ${
                  pdfTheme === 'light' ? 'text-gray-500' : 'text-[#909095]'
                } print:text-gray-600`}>Confidence Score</span>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-3">
              <h3 className={`text-lg font-[#Hanken Grotesk] font-bold border-b pb-1 ${
                pdfTheme === 'light' ? 'border-gray-200' : 'border-[#1E293B]'
              } print:text-black print:border-gray-300`}>
                1. Executive Summary & Investment Thesis
              </h3>
              <p className={`font-[#Inter] text-xs leading-relaxed ${
                pdfTheme === 'light' ? 'text-gray-700' : 'text-[#c6c6cb]'
              } print:text-gray-800`}>
                BoardIQ’s financial intelligence engine recommends a initial position entry in Nexus Technologies Group (NTG). The thesis rests upon strong Net Revenue Retention (124.2%), low annual logo churn (1.8%), and exceptional gross margins (82.4%), placing NTG in the top 5th percentile of enterprise SaaS companies benchmarked in 2026.
              </p>
            </div>

            {/* Section 2: Key Telemetry Metrics Table */}
            <div className="space-y-3">
              <h3 className={`text-lg font-[#Hanken Grotesk] font-bold border-b pb-1 ${
                pdfTheme === 'light' ? 'border-gray-200' : 'border-[#1E293B]'
              } print:text-black print:border-gray-300`}>
                2. Key Telemetry & Financial Audit
              </h3>
              <table className="w-full text-left text-xs font-[#Geist] border-collapse">
                <thead>
                  <tr className={`border-b ${
                    pdfTheme === 'light' ? 'border-gray-300 text-gray-500' : 'border-[#1E293B] text-[#909095]'
                  } print:border-gray-400 print:text-gray-600`}>
                    <th className="py-2">METRIC</th>
                    <th className="py-2">VALUE</th>
                    <th className="py-2">YOY DELTA</th>
                    <th className="py-2">BENCHMARK EVALUATION</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  pdfTheme === 'light' ? 'divide-gray-200 text-gray-800' : 'divide-[#1E293B] text-[#c6c6cb]'
                } print:divide-gray-300 print:text-gray-800`}>
                  <tr>
                    <td className="py-2 font-semibold">Annual Recurring Revenue (ARR)</td>
                    <td className="py-2">$42.5M</td>
                    <td className={`py-2 font-semibold ${pdfTheme === 'light' ? 'text-green-700' : 'text-[#4edea3]'}`}>+34.8%</td>
                    <td className="py-2">Outperforms Sector Median (22%)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Net Revenue Retention (NRR)</td>
                    <td className="py-2">124.2%</td>
                    <td className={`py-2 font-semibold ${pdfTheme === 'light' ? 'text-green-700' : 'text-[#4edea3]'}`}>+6.2%</td>
                    <td className="py-2">Top-Decile Land & Expand</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Gross Profit Margin</td>
                    <td className="py-2">82.4%</td>
                    <td className={`py-2 font-semibold ${pdfTheme === 'light' ? 'text-green-700' : 'text-[#4edea3]'}`}>+2.1%</td>
                    <td className="py-2">High Operating Leverage</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Capital Burn Multiple</td>
                    <td className="py-2">0.8x</td>
                    <td className={`py-2 font-semibold ${pdfTheme === 'light' ? 'text-green-700' : 'text-[#4edea3]'}`}>-0.2x</td>
                    <td className="py-2">Top 5% Capital Efficiency</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 3: Risk Factor Mitigation */}
            <div className="space-y-3">
              <h3 className={`text-lg font-[#Hanken Grotesk] font-bold border-b pb-1 ${
                pdfTheme === 'light' ? 'border-gray-200' : 'border-[#1E293B]'
              } print:text-black print:border-gray-300`}>
                3. Risk Assessment & Mitigation Strategy
              </h3>
              <div className={`p-3 border rounded font-[#Inter] text-xs space-y-2 ${
                pdfTheme === 'light'
                  ? 'bg-gray-50 border-gray-200 text-gray-800'
                  : 'bg-[#0b0e14] border-[#1E293B] text-[#c6c6cb]'
              } print:bg-gray-50 print:border-gray-300`}>
                <p>
                  <strong className="font-semibold">Identified Risk:</strong> Sales cycle elongation from 45 days to 62 days due to enterprise procurement scrutiny.
                </p>
                <p>
                  <strong className="font-semibold">Mitigation Audit:</strong> Strong expansion velocity within existing accounts mitigates net impact on annual growth targets.
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className={`pt-8 border-t flex justify-between items-end font-[#Geist] text-xs ${
              pdfTheme === 'light' ? 'border-gray-200 text-gray-500' : 'border-[#1E293B] text-[#909095]'
            } print:border-gray-400 print:text-gray-600`}>
              <div>
                <p className="font-semibold">{userProfile.fullName || 'Alexander Vance'}</p>
                <p>{userProfile.role || 'Managing Partner'} • {userProfile.company || 'Vance Capital'}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${pdfTheme === 'light' ? 'text-[#003824]' : 'text-[#4edea3]'} print:text-black`}>
                  BOARD IQ VERIFIED MEMO
                </p>
                <p>ID: MEMO-NTG-2026-0804</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Interactive Toast Overlay */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

