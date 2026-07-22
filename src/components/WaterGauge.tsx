import React from 'react';
import { motion } from 'motion/react';
import { formatWaterAmount } from '../lib/calculator';
import { WaterUnit } from '../types';

interface WaterGaugeProps {
  currentMl: number;
  goalMl: number;
  unit: WaterUnit;
}

export const WaterGauge: React.FC<WaterGaugeProps> = ({ currentMl, goalMl, unit }) => {
  const percentage = Math.min(100, Math.round((currentMl / goalMl) * 100));
  const fillHeight = Math.min(100, Math.max(0, percentage));

  return (
    <div className="relative flex flex-col items-center justify-center my-4">
      {/* Outer Glow Ring */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 shadow-2xl shadow-cyan-500/10 flex items-center justify-center">
        {/* Animated Circular Progress Border */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            className="stroke-cyan-500 dark:stroke-cyan-400 transition-all duration-1000 ease-out"
            strokeWidth="4"
            strokeDasharray={289}
            strokeDashoffset={289 - (289 * percentage) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Liquid Container Ball */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden bg-slate-50 dark:bg-slate-900 border-4 border-white dark:border-slate-800 shadow-inner flex items-center justify-center">
          {/* Liquid Animated Fill Layer */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-sky-400 transition-all duration-700 ease-out"
            style={{ height: `${fillHeight}%` }}
          >
            {/* Liquid Wave Effect SVG */}
            {fillHeight > 0 && fillHeight < 100 && (
              <div className="absolute -top-4 left-0 right-0 h-6 overflow-hidden w-[200%] opacity-80 animate-wave">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full fill-sky-400">
                  <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,-20 1200,40 L1200,120 L0,120 Z"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Central Stats Card Overlay */}
          <div className="relative z-10 text-center px-4 py-2 rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-white/60 dark:border-slate-800 shadow-lg">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {percentage}%
            </div>
            <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 my-0.5">
              {formatWaterAmount(currentMl, unit)} / {formatWaterAmount(goalMl, unit)}
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {percentage >= 100 ? '🎉 اكتمل الهدف اليومي!' : 'نسبة الإنجاز اليومي'}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Bubbles decorative animation */}
      {percentage > 0 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [-10, -80], opacity: [0, 1, 0], scale: [0.8, 1.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
            className="absolute bottom-16 left-1/3 w-3 h-3 rounded-full bg-cyan-400/40 blur-[1px]"
          />
          <motion.div
            animate={{ y: [-5, -100], opacity: [0, 0.8, 0], scale: [0.5, 1.5] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1, ease: 'easeOut' }}
            className="absolute bottom-20 right-1/3 w-4 h-4 rounded-full bg-blue-300/40 blur-[1px]"
          />
        </div>
      )}
    </div>
  );
};
