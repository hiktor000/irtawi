import React from 'react';
import { Bell, Volume2, X, Plus } from 'lucide-react';
import { formatWaterAmount } from '../lib/calculator';
import { speakArabicMessage } from '../lib/audio';
import { WaterUnit } from '../types';

interface NotificationBannerProps {
  message: string | null;
  defaultCupMl: number;
  unit: WaterUnit;
  onDismiss: () => void;
  onQuickLog: (amountMl: number) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  defaultCupMl,
  unit,
  onDismiss,
  onQuickLog,
}) => {
  if (!message) return null;

  const handleSpeech = () => {
    speakArabicMessage(message.replace(/[^\u0600-\u06FF\s]/g, ''));
  };

  const handleLogAndDismiss = () => {
    onQuickLog(defaultCupMl);
    onDismiss();
  };

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-lg mx-auto bg-gradient-to-r from-blue-900 via-cyan-900 to-indigo-950 text-white rounded-2xl p-4 shadow-2xl border border-cyan-400/30 backdrop-blur-md animate-slide-down">
      <div className="flex items-start justify-between gap-3">
        {/* Left Notification Icon */}
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/20 shrink-0">
          <Bell className="w-6 h-6 animate-bounce" />
        </div>

        {/* Message Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300">تذكير الذكاء الاصطناعي 💧</span>
            <button
              onClick={handleSpeech}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-200 transition-colors"
              title="استماع للتذكير الصوتي"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-sm font-bold text-slate-100 mt-1 leading-snug">
            {message}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleLogAndDismiss}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>🥛 شربت {formatWaterAmount(defaultCupMl, unit)}</span>
            </button>

            <button
              onClick={onDismiss}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs transition-colors"
            >
              لاحقاً
            </button>
          </div>
        </div>

        {/* Close X */}
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
