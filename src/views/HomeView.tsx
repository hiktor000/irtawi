import React from 'react';
import { GlassWater, Flame, Target, Sparkles } from 'lucide-react';
import { WaterGauge } from '../components/WaterGauge';
import { QuickAddButtons } from '../components/QuickAddButtons';
import { formatWaterAmount } from '../lib/calculator';
import { MOTIVATIONAL_MESSAGES } from '../lib/notifications';
import { UserProfile, WaterLog, WaterUnit } from '../types';

interface HomeViewProps {
  profile: UserProfile;
  todayLogs: WaterLog[];
  todayTotalMl: number;
  streakDays: number;
  unit: WaterUnit;
  onAddWater: (amountMl: number, containerType?: string) => void;
  onOpenWidgetSim: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  todayLogs,
  todayTotalMl,
  streakDays,
  unit,
  onAddWater,
}) => {
  const goalMl = profile.dailyGoalMl;
  const remainingMl = Math.max(0, goalMl - todayTotalMl);
  const cupsDrunk = todayLogs.length;

  // Pick a motivational message based on date or completion status
  const messageIndex = new Date().getDate() % MOTIVATIONAL_MESSAGES.length;
  const dailyMotivation =
    todayTotalMl >= goalMl
      ? '🎉 أحسنت! لقد حققت هدفك اليومي لحماية صحتك وزيادة نشاطك.'
      : MOTIVATIONAL_MESSAGES[messageIndex];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-6 pb-24 animate-fade-in">
      {/* Top Greeting Card */}
      <div className="flex items-center justify-between bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent p-4 rounded-3xl border border-cyan-100 dark:border-slate-800">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {new Date().getHours() < 12 ? 'صباح الخير ☀️' : 'مساء الخير 🌙'}
          </p>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            أهلاً، {profile.name || 'صديقي'} 👋🏼
          </h2>
        </div>

        {/* Motivational Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-800/80">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>حافظ على ترطيبك</span>
        </div>
      </div>

      {/* Main Liquid Gauge */}
      <WaterGauge currentMl={todayTotalMl} goalMl={goalMl} unit={unit} />

      {/* Primary Action & Quick Add Buttons */}
      <QuickAddButtons
        defaultCupMl={profile.defaultCupMl}
        unit={unit}
        onAddWater={onAddWater}
      />

      {/* Quick Summary Cards Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Remaining Amount */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center">
          <Target className="w-5 h-5 text-cyan-500 mb-1" />
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
            المتبقي للهدف
          </span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {formatWaterAmount(remainingMl, unit)}
          </span>
        </div>

        {/* Cups Drunk Count */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center">
          <GlassWater className="w-5 h-5 text-blue-500 mb-1" />
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
            عدد الأكواب
          </span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {cupsDrunk} كوب
          </span>
        </div>

        {/* Consecutive Streak Days */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center justify-center">
          <Flame className="w-5 h-5 text-amber-500 mb-1" />
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
            الأيام المتتالية
          </span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {streakDays} يوم 🔥
          </span>
        </div>
      </div>

      {/* Daily Dynamic Motivational Quote */}
      <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-900/60 flex items-start gap-3">
        <span className="text-xl shrink-0">💡</span>
        <div>
          <h4 className="text-xs font-bold text-cyan-900 dark:text-cyan-300">
            نصيحة الترطيب اليومية
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
            {dailyMotivation}
          </p>
        </div>
      </div>
    </div>
  );
};
