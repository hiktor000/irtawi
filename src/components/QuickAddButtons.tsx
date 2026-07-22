import React, { useState } from 'react';
import { Plus, GlassWater, PlusCircle } from 'lucide-react';
import { playVibration, playWaterSound } from '../lib/audio';
import { formatWaterAmount, ozToMl } from '../lib/calculator';
import { WaterUnit } from '../types';

interface QuickAddButtonsProps {
  defaultCupMl: number;
  unit: WaterUnit;
  onAddWater: (amountMl: number, containerType?: string) => void;
}

export const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({
  defaultCupMl,
  unit,
  onAddWater,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const handleQuickAdd = (amountMl: number, containerType: string = 'glass') => {
    playWaterSound();
    playVibration([80, 40, 80]);
    onAddWater(amountMl, containerType);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customInput);
    if (!isNaN(val) && val > 0) {
      const amountMl = unit === 'oz' ? ozToMl(val) : Math.round(val);
      handleQuickAdd(amountMl, 'custom');
      setCustomInput('');
      setShowCustomModal(false);
    }
  };

  const presets = [100, 200, 250, 330, 500];

  return (
    <div className="w-full flex flex-col items-center gap-4 my-2">
      {/* Giant Primary Action Button */}
      <button
        onClick={() => handleQuickAdd(defaultCupMl, 'glass')}
        className="group relative w-full max-w-md py-4 px-6 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-cyan-500/25 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 border border-white/20"
      >
        <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
          <GlassWater className="w-7 h-7 text-white fill-white/30" />
        </div>
        <span>🥛 شربت ماء ({formatWaterAmount(defaultCupMl, unit)})</span>
      </button>

      {/* Quick Add Presets Row */}
      <div className="w-full max-w-md flex flex-wrap items-center justify-center gap-2 px-2">
        {presets.map((presetMl) => (
          <button
            key={presetMl}
            onClick={() => handleQuickAdd(presetMl, presetMl >= 500 ? 'bottle' : 'glass')}
            className="flex-1 min-w-[70px] py-2 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm hover:shadow-md hover:bg-cyan-50/50 dark:hover:bg-slate-700/50 active:scale-95 transition-all duration-150 flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-500" />
            <span>+{formatWaterAmount(presetMl, unit)}</span>
          </button>
        ))}

        {/* Custom Amount Button */}
        <button
          onClick={() => setShowCustomModal(true)}
          className="py-2 px-3 rounded-2xl bg-cyan-100/70 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 font-bold text-xs hover:bg-cyan-200/70 active:scale-95 transition-all duration-150 flex items-center gap-1"
          title="إدخال كمية مخصصة"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>تخصيص</span>
        </button>
      </div>

      {/* Custom Amount Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">
              إضافة كمية ماء مخصصة
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
              أدخل الكمية التي شربتها بـ ({unit === 'oz' ? 'أونصة' : 'ملليلتر'})
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max="3000"
                  step="10"
                  autoFocus
                  required
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={unit === 'oz' ? 'مثال: 8' : 'مثال: 350'}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="absolute left-4 top-3.5 text-xs font-semibold text-slate-400">
                  {unit}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-md hover:from-cyan-600 hover:to-blue-700 transition-all"
                >
                  حفظ الكمية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
