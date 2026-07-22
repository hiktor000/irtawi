import React from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Achievement } from '../types';
import { playCelebrationSound } from '../lib/audio';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleTestConfetti = () => {
    playCelebrationSound();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-6 pb-24 animate-fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent p-4 rounded-3xl border border-amber-200/80 dark:border-amber-800/60">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-black shrink-0 shadow-md shadow-amber-500/20">
            <Trophy className="w-7 h-7 fill-slate-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              قاعة الإنجازات 🏆
            </h2>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
              فتحت {unlockedCount} من أصل {achievements.length} إنجاز
            </p>
          </div>
        </div>

        <button
          onClick={handleTestConfetti}
          className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition-colors text-xs font-bold flex items-center gap-1 border border-amber-300/80 dark:border-amber-800"
          title="احتفال الإنجازات"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>احتفال</span>
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-4 rounded-3xl border transition-all ${
              ach.unlocked
                ? 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 dark:from-amber-950/40 dark:via-slate-900 dark:to-yellow-950/30 border-amber-300 dark:border-amber-800/80 shadow-md shadow-amber-500/5'
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 opacity-75'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-bold shadow-sm ${
                  ach.unlocked
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {ach.unlocked ? '🏆' : <Lock className="w-5 h-5 text-slate-400" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-bold text-sm ${
                      ach.unlocked
                        ? 'text-slate-800 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {ach.title}
                  </h3>
                  {ach.unlocked && (
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {ach.description}
                </p>

                {/* Progress Bar for Locked Badges */}
                {!ach.unlocked && (
                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>التقدم</span>
                      <span>{ach.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
