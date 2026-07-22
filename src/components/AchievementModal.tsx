import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Check, X } from 'lucide-react';
import { Achievement } from '../types';
import { playCelebrationSound } from '../lib/audio';

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  onClose,
}) => {
  useEffect(() => {
    if (achievement) {
      playCelebrationSound();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#6366f1', '#f59e0b'],
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Top Glow & Badge */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center mb-4 animate-bounce">
          <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center text-amber-400">
            <Trophy className="w-10 h-10 fill-amber-400/20" />
          </div>
        </div>

        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800">
          إنجاز جديد فتحته! 🏆
        </span>

        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-2 mb-1">
          {achievement.title}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 px-2">
          {achievement.description}
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>متابعة الشرب</span>
        </button>

        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
