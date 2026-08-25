import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'loading';
  title: string;
  description?: string;
  timestamp?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = 'info';
        let iconColor = 'text-[#4285F4]';
        let borderColor = 'border-[#4285F4]/40';
        let bgAccent = 'bg-[#4285F4]/10';

        if (toast.type === 'success') {
          icon = 'check_circle';
          iconColor = 'text-[#4edea3]';
          borderColor = 'border-[#4edea3]/40';
          bgAccent = 'bg-[#4edea3]/10';
        } else if (toast.type === 'warning') {
          icon = 'warning';
          iconColor = 'text-[#FBBC05]';
          borderColor = 'border-[#FBBC05]/40';
          bgAccent = 'bg-[#FBBC05]/10';
        } else if (toast.type === 'error') {
          icon = 'error';
          iconColor = 'text-[#ffb4ab]';
          borderColor = 'border-[#ffb4ab]/40';
          bgAccent = 'bg-[#ffb4ab]/10';
        } else if (toast.type === 'loading') {
          icon = 'progress_activity';
          iconColor = 'text-[#4edea3] animate-spin';
          borderColor = 'border-[#4edea3]/40';
          bgAccent = 'bg-[#4edea3]/10';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#141820]/95 backdrop-blur-md border ${borderColor} rounded-xl p-4 shadow-2xl flex items-start justify-between gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-5 font-[#Geist]`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${bgAccent} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined text-lg ${iconColor}`}>{icon}</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs text-[#e2e2e2]">{toast.title}</h4>
                  {toast.type === 'loading' && (
                    <span className="text-[9px] font-mono text-[#4edea3] uppercase bg-[#4edea3]/20 px-1.5 py-0.2 rounded">
                      In Progress
                    </span>
                  )}
                </div>
                {toast.description && (
                  <p className="text-[11px] text-[#c6c6cb] font-[#Inter] leading-relaxed">
                    {toast.description}
                  </p>
                )}
                {toast.timestamp && (
                  <span className="text-[9px] text-[#909095] block pt-0.5">{toast.timestamp}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#909095] hover:text-[#e2e2e2] text-xs p-1 rounded hover:bg-[#1E293B] transition-colors cursor-pointer shrink-0"
              title="Dismiss notification"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
