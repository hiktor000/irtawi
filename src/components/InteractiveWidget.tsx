import React, { useState } from 'react';
import { Droplet, Plus, X, Smartphone, Check } from 'lucide-react';
import { formatWaterAmount } from '../lib/calculator';
import { playVibration, playWaterSound } from '../lib/audio';
import { WaterUnit } from '../types';

interface InteractiveWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  currentMl: number;
  goalMl: number;
  defaultCupMl: number;
  unit: WaterUnit;
  onAddWater: (amountMl: number) => void;
}

export const InteractiveWidget: React.FC<InteractiveWidgetProps> = ({
  isOpen,
  onClose,
  currentMl,
  goalMl,
  defaultCupMl,
  unit,
  onAddWater,
}) => {
  const [widgetSize, setWidgetSize] = useState<'4x2' | '2x2'>('4x2');
  const [justLogged, setJustLogged] = useState(false);

  if (!isOpen) return null;

  const percentage = Math.min(100, Math.round((currentMl / goalMl) * 100));

  const handleQuickWidgetAdd = () => {
    playWaterSound();
    playVibration([80, 40, 80]);
    onAddWater(defaultCupMl);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-200">
              معاينة ويدجت شاشة الأندرويد (Android Widget)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Widget Size Selector */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => setWidgetSize('4x2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              widgetSize === '4x2'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            مستطيل 4x2
          </button>
          <button
            onClick={() => setWidgetSize('2x2')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              widgetSize === '2x2'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            مربع 2x2
          </button>
        </div>

        {/* Android Home Screen Frame Simulation */}
        <div className="relative rounded-2xl p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-700/60 shadow-inner flex flex-col items-center justify-center min-h-[220px]">
          <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono">
            Android Home Screen Widget
          </div>

          {/* Actual Simulated Widget Box */}
          {widgetSize === '4x2' ? (
            <div className="w-full bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 border border-cyan-500/30 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
              {/* Progress Circle & Stats */}
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full bg-slate-800 border-2 border-cyan-400 flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
                  <span className="absolute text-[11px] font-black text-white">
                    {percentage}%
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-200">ارتوِ 💧</div>
                  <div className="text-sm font-extrabold text-cyan-400">
                    {formatWaterAmount(currentMl, unit)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    الهدف: {formatWaterAmount(goalMl, unit)}
                  </div>
                </div>
              </div>

              {/* Instant 1-Tap Add Water Button */}
              <button
                onClick={handleQuickWidgetAdd}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                {justLogged ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>تم التسجيل!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>🥛 شربت ماء</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="w-44 h-44 bg-gradient-to-br from-cyan-950/90 via-slate-900 to-blue-950/90 border border-cyan-500/30 rounded-2xl p-3 shadow-lg flex flex-col items-center justify-between text-center">
              <div className="flex items-center justify-between w-full text-[10px] text-cyan-300 font-bold">
                <span>ارتوِ 💧</span>
                <span>{percentage}%</span>
              </div>

              <div className="text-xs font-extrabold text-white">
                {formatWaterAmount(currentMl, unit)}
              </div>

              <button
                onClick={handleQuickWidgetAdd}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[11px] shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                {justLogged ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>+ {formatWaterAmount(defaultCupMl, unit)}</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-3">
          💡 هذا نموذج تفاعلي محاكي للـ Widget المتاح عند تثبيت التطبيق على هاتف الأندرويد.
        </p>
      </div>
    </div>
  );
};
