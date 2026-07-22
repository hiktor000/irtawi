import React, { useState } from 'react';
import { GlassWater, Trash2, Edit2, Plus, Calendar, Clock, X } from 'lucide-react';
import { formatWaterAmount, ozToMl } from '../lib/calculator';
import { WaterLog, WaterUnit } from '../types';

interface HistoryViewProps {
  logs: WaterLog[];
  unit: WaterUnit;
  onAddManualLog: (amountMl: number, timestamp: number, containerType?: string) => void;
  onUpdateLog: (id: string, newAmountMl: number) => void;
  onDeleteLog: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  logs,
  unit,
  onAddManualLog,
  onUpdateLog,
  onDeleteLog,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Form states for manual add / edit
  const [inputAmount, setInputAmount] = useState('250');
  const [inputTime, setInputTime] = useState('');

  // Group logs by Date string (e.g. YYYY-MM-DD)
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  const groupedByDate: { [dateStr: string]: WaterLog[] } = {};
  sortedLogs.forEach((log) => {
    const d = new Date(log.timestamp);
    const dateKey = d.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(log);
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inputAmount);
    if (isNaN(val) || val <= 0) return;

    const amountMl = unit === 'oz' ? ozToMl(val) : Math.round(val);

    let ts = Date.now();
    if (inputTime) {
      const [h, m] = inputTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      ts = d.getTime();
    }

    onAddManualLog(amountMl, ts, 'manual');
    setShowAddModal(false);
    setInputAmount('250');
    setInputTime('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogId) return;
    const val = parseFloat(inputAmount);
    if (!isNaN(val) && val > 0) {
      const amountMl = unit === 'oz' ? ozToMl(val) : Math.round(val);
      onUpdateLog(editingLogId, amountMl);
      setEditingLogId(null);
    }
  };

  const startEdit = (log: WaterLog) => {
    setEditingLogId(log.id);
    setInputAmount(unit === 'oz' ? String(Math.round(log.amountMl * 0.033814)) : String(log.amountMl));
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-6 pb-24 animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            سجل شرب الماء 📜
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تتبع وإدارة جميع عمليات الشرب السابقة
          </p>
        </div>

        <button
          onClick={() => {
            setInputAmount('250');
            setShowAddModal(true);
          }}
          className="py-2 px-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سجل يدوي</span>
        </button>
      </div>

      {/* Logs List or Empty State */}
      {Object.keys(groupedByDate).length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-cyan-50 dark:bg-slate-800 text-cyan-500 flex items-center justify-center">
            <GlassWater className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">
            لا يوجد أي سجلات بعد
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            اضغط على زر "شربت ماء" في الصفحة الرئيسية أو أضف سجلاً يدوياً لتبدأ تتبعك.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([dateStr, dayLogs]) => {
            const dayTotalMl = dayLogs.reduce((sum, l) => sum + l.amountMl, 0);
            return (
              <div key={dateStr} className="space-y-2">
                {/* Date Section Header */}
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{dateStr}</span>
                  </div>
                  <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">
                    مجموع اليوم: {formatWaterAmount(dayTotalMl, unit)}
                  </span>
                </div>

                {/* Day's Log Items */}
                <div className="space-y-2">
                  {dayLogs.map((log) => {
                    const timeStr = new Date(log.timestamp).toLocaleTimeString('ar-EG', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    return (
                      <div
                        key={log.id}
                        className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 hover:border-cyan-200 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 shrink-0">
                            <GlassWater className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                              {formatWaterAmount(log.amountMl, unit)}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{timeStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions (Edit / Delete) */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(log)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="تعديل الكمية"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteLog(log.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Add Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                إضافة سجل شرب ماء يدوي
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الكمية ({unit})
                </label>
                <input
                  type="number"
                  min="10"
                  max="3000"
                  required
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الوقت (اختياري - افتراضيًا الآن)
                </label>
                <input
                  type="time"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-md"
                >
                  إضافة السجل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Log Modal */}
      {editingLogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                تعديل كمية الشرب
              </h3>
              <button
                onClick={() => setEditingLogId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الكمية الجديدة ({unit})
                </label>
                <input
                  type="number"
                  min="10"
                  max="3000"
                  required
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLogId(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-md"
                >
                  حفظ التعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
