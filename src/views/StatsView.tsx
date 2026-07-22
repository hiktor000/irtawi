import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Flame, Droplet, TrendingUp, Award, Calendar } from 'lucide-react';
import { formatWaterAmount, mlToOz } from '../lib/calculator';
import { WaterLog, WaterUnit } from '../types';

interface StatsViewProps {
  logs: WaterLog[];
  dailyGoalMl: number;
  streakDays: number;
  unit: WaterUnit;
}

type Timeframe = 'today' | 'week' | 'month' | 'year';

export const StatsView: React.FC<StatsViewProps> = ({
  logs,
  dailyGoalMl,
  streakDays,
  unit,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('week');

  // Compute total volume
  const totalVolumeMl = logs.reduce((sum, l) => sum + l.amountMl, 0);

  // Compute stats data for chart according to selected timeframe
  const getChartData = () => {
    const dataMap: { [label: string]: number } = {};
    const now = new Date();

    if (timeframe === 'today') {
      // 24 hours breakdown (grouped in 3-hour slots)
      for (let h = 0; h < 24; h += 3) {
        const slotLabel = `${h}:00`;
        dataMap[slotLabel] = 0;
      }
      logs.forEach((log) => {
        const logDate = new Date(log.timestamp);
        if (
          logDate.getFullYear() === now.getFullYear() &&
          logDate.getMonth() === now.getMonth() &&
          logDate.getDate() === now.getDate()
        ) {
          const h = logDate.getHours();
          const slotHour = Math.floor(h / 3) * 3;
          const label = `${slotHour}:00`;
          const val = unit === 'oz' ? mlToOz(log.amountMl) : log.amountMl;
          dataMap[label] = (dataMap[label] || 0) + val;
        }
      });
    } else if (timeframe === 'week') {
      // Last 7 days
      const daysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = daysArabic[d.getDay()];
        dataMap[dayName] = 0;
      }

      logs.forEach((log) => {
        const logDate = new Date(log.timestamp);
        const diffDays = Math.floor(
          (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays >= 0 && diffDays < 7) {
          const dayName = daysArabic[logDate.getDay()];
          const val = unit === 'oz' ? mlToOz(log.amountMl) : log.amountMl;
          dataMap[dayName] = (dataMap[dayName] || 0) + val;
        }
      });
    } else if (timeframe === 'month') {
      // Last 30 days grouped into 5-day buckets
      for (let i = 25; i >= 0; i -= 5) {
        const label = `قبل ${i} يوم`;
        dataMap[label] = 0;
      }
      logs.forEach((log) => {
        const diffDays = Math.floor(
          (now.getTime() - log.timestamp) / (1000 * 60 * 60 * 24)
        );
        if (diffDays >= 0 && diffDays <= 30) {
          const bucket = Math.floor(diffDays / 5) * 5;
          const label = `قبل ${bucket} يوم`;
          const val = unit === 'oz' ? mlToOz(log.amountMl) : log.amountMl;
          if (dataMap[label] !== undefined) {
            dataMap[label] += val;
          }
        }
      });
    } else {
      // Year - 12 Months
      const monthsArabic = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
      ];
      monthsArabic.forEach((m) => (dataMap[m] = 0));
      logs.forEach((log) => {
        const logDate = new Date(log.timestamp);
        if (logDate.getFullYear() === now.getFullYear()) {
          const mName = monthsArabic[logDate.getMonth()];
          const val = unit === 'oz' ? mlToOz(log.amountMl) : log.amountMl;
          dataMap[mName] = (dataMap[mName] || 0) + val;
        }
      });
    }

    return Object.entries(dataMap).map(([name, amount]) => ({
      name,
      amount,
    }));
  };

  const chartData = getChartData();

  // Calculate daily average
  const uniqueDatesCount = Math.max(
    1,
    new Set(logs.map((l) => new Date(l.timestamp).toDateString())).size
  );
  const dailyAvgMl = Math.round(totalVolumeMl / uniqueDatesCount);

  // Calculate adherence compliance %
  const completedDaysCount = Array.from(
    new Set(logs.map((l) => new Date(l.timestamp).toDateString()))
  ).filter((dStr) => {
    const sum = logs
      .filter((l) => new Date(l.timestamp).toDateString() === dStr)
      .reduce((s, l) => s + l.amountMl, 0);
    return sum >= dailyGoalMl;
  }).length;

  const complianceRate = Math.round(
    (completedDaysCount / Math.max(1, uniqueDatesCount)) * 100
  );

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-6 pb-24 animate-fade-in">
      {/* Header & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            الإحصائيات والتحليلات 📊
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تابع تطور عادة شرب الماء لديك بدقة
          </p>
        </div>

        {/* Timeframe Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 w-full sm:w-auto justify-between">
          {[
            { id: 'today', label: 'اليوم' },
            { id: 'week', label: 'الأسبوع' },
            { id: 'month', label: 'الشهر' },
            { id: 'year', label: 'السنة' },
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id as Timeframe)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === tf.id
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Chart Card */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-500" />
            معدل الشرب ({unit})
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            الهدف اليومي: {formatWaterAmount(dailyGoalMl, unit)}
          </span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Liters Drunk */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 shrink-0">
            <Droplet className="w-6 h-6 fill-cyan-500/20" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">إجمالي الشرب</span>
            <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
              {formatWaterAmount(totalVolumeMl, unit)}
            </div>
          </div>
        </div>

        {/* Daily Average */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">المعدل اليومي</span>
            <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
              {formatWaterAmount(dailyAvgMl, unit)}
            </div>
          </div>
        </div>

        {/* Best Streak */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-6 h-6 fill-amber-500/20" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">أفضل سلسلة</span>
            <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
              {streakDays} يوم متتالي
            </div>
          </div>
        </div>

        {/* Adherence Compliance Rate */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400">نسبة الالتزام</span>
            <div className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
              {complianceRate}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
