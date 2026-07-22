import React, { useState } from 'react';
import {
  Bell,
  Volume2,
  Vibrate,
  Moon,
  Sun,
  RotateCcw,
  Download,
  Upload,
  UserCheck,
  Code2,
  Check,
  Play,
  VolumeX,
} from 'lucide-react';
import {
  speakArabicMessage,
  playWaterSound,
  playVibration,
} from '../lib/audio';
import { requestNotificationPermission } from '../lib/notifications';
import { AppSettings, ReminderConfig, UserProfile, WaterUnit } from '../types';

interface SettingsViewProps {
  profile: UserProfile;
  reminders: ReminderConfig;
  settings: AppSettings;
  onUpdateProfile: (newProfile: Partial<UserProfile>) => void;
  onUpdateReminders: (newReminders: Partial<ReminderConfig>) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetData: () => void;
  onReopenOnboarding: () => void;
  onTriggerTestReminder: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  reminders,
  settings,
  onUpdateProfile,
  onUpdateReminders,
  onUpdateSettings,
  onResetData,
  onReopenOnboarding,
  onTriggerTestReminder,
}) => {
  const [goalInput, setGoalInput] = useState(String(profile.dailyGoalMl));
  const [cupInput, setCupInput] = useState(String(profile.defaultCupMl));
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseInt(goalInput);
    const c = parseInt(cupInput);
    if (!isNaN(g) && g >= 500 && !isNaN(c) && c >= 50) {
      onUpdateProfile({ dailyGoalMl: g, defaultCupMl: c });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    }
  };

  const handleToggleNotifications = async () => {
    if (!reminders.enabled) {
      const granted = await requestNotificationPermission();
      onUpdateReminders({ enabled: granted });
    } else {
      onUpdateReminders({ enabled: false });
    }
  };

  const handleTestTTS = () => {
    speakArabicMessage('مرحباً بك في تطبيق ارتوِ، حان وقت شرب كوب من الماء للحفاظ على صحتك!', reminders.ttsVolume);
  };

  const handleExportData = () => {
    const data = {
      profile,
      reminders,
      settings,
      logs: localStorage.getItem('irtiwi_water_logs'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `irtiwi-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 space-y-6 pb-28 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          الإعدادات والتفضلات ⚙️
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          خصّص تجربتك في التذكير وتأثيرات الصوت والوحدات
        </p>
      </div>

      {/* 1. Daily Target & Cup Settings */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🎯</span>
            <span>الهدف الحجمي والأكواب</span>
          </h3>
          <button
            onClick={onReopenOnboarding}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>إعادة حساب احتياجي</span>
          </button>
        </div>

        <form onSubmit={handleSaveGoals} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                الهدف اليومي (مل)
              </label>
              <input
                type="number"
                min="500"
                max="8000"
                step="50"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                سعة الكوب (مل)
              </label>
              <input
                type="number"
                min="50"
                max="1000"
                step="10"
                value={cupInput}
                onChange={(e) => setCupInput(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>تم حفظ التعديلات!</span>
              </>
            ) : (
              <span>حفظ الإعدادات</span>
            )}
          </button>
        </form>
      </div>

      {/* 2. Smart Notifications & Reminders Engine */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-500" />
            <span>نظام الإشعارات والتذكير الذكي</span>
          </h3>

          {/* Toggle Master Notifications */}
          <button
            onClick={handleToggleNotifications}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              reminders.enabled
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {reminders.enabled ? 'مفعل ✅' : 'معطل ❌'}
          </button>
        </div>

        {/* Interval Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
            تكرار التذكير
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { mins: 30, label: '30 دقيقة' },
              { mins: 60, label: 'ساعة' },
              { mins: 120, label: 'ساعتين' },
              { mins: 180, label: '3 ساعات' },
            ].map((item) => (
              <button
                key={item.mins}
                onClick={() => onUpdateReminders({ intervalMinutes: item.mins })}
                className={`py-2 rounded-2xl text-xs font-bold border transition-all ${
                  reminders.intervalMinutes === item.mins
                    ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Start / End Time & Sleep Toggle */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              وقت بداية التذكير
            </label>
            <input
              type="time"
              value={reminders.startTime}
              onChange={(e) => onUpdateReminders({ startTime: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
              وقت نهاية التذكير
            </label>
            <input
              type="time"
              value={reminders.endTime}
              onChange={(e) => onUpdateReminders({ endTime: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold text-center"
            />
          </div>
        </div>

        {/* Pause during sleep switch */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            إيقاف الإشعارات تلقائياً أثناء النوم 😴
          </span>
          <button
            onClick={() => onUpdateReminders({ pauseSleep: !reminders.pauseSleep })}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              reminders.pauseSleep ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                reminders.pauseSleep ? 'translate-x-0' : '-translate-x-5'
              }`}
            />
          </button>
        </div>

        {/* Test Notification Trigger Button */}
        <button
          onClick={onTriggerTestReminder}
          className="w-full py-2.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 text-cyan-800 dark:text-cyan-300 font-bold text-xs border border-cyan-200 dark:border-cyan-800/80 transition-all flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 text-cyan-500" />
          <span>اختبار إرسال إشعار تذكير محاكي الآن</span>
        </button>
      </div>

      {/* 3. Text To Speech Voice Reminders */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-500" />
            <span>التذكير الصوتي (Text To Speech)</span>
          </h3>

          <button
            onClick={() => onUpdateReminders({ ttsEnabled: !reminders.ttsEnabled })}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              reminders.ttsEnabled
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {reminders.ttsEnabled ? 'مفعل 🔊' : 'مغلق 🔇'}
          </button>
        </div>

        {/* Speech Volume Slider */}
        {reminders.ttsEnabled && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                <span>مستوى صوت الصوت العربي</span>
                <span>{Math.round(reminders.ttsVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={reminders.ttsVolume}
                onChange={(e) => onUpdateReminders({ ttsVolume: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleTestTTS}
              className="w-full py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-800 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 transition-all flex items-center justify-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-blue-500" />
              <span>اختبار الصوت العربي الآن</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Units & Appearance */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
          🎨 المظهر والوحدات
        </h3>

        {/* Volume Unit Selector */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            وحدة قياس الحجم
          </span>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => onUpdateSettings({ unit: 'ml' })}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                settings.unit === 'ml'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              ملليلتر (ml)
            </button>
            <button
              onClick={() => onUpdateSettings({ unit: 'oz' })}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                settings.unit === 'oz'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              أونصة (oz)
            </button>
          </div>
        </div>

        {/* Dark Mode Switch */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            الوضع الليلي (Dark Mode)
          </span>
          <button
            onClick={() =>
              onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
            }
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* 5. Data Backup & Reset */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
          💾 النسخ الاحتياطي والبيانات
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExportData}
            className="py-2.5 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير نسخة JSON</span>
          </button>

          <button
            onClick={onResetData}
            className="py-2.5 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط التطبيق</span>
          </button>
        </div>
      </div>

      {/* 6. Developer Sign-Off Signature Footer */}
      <div className="pt-6 pb-2 text-center">
        <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-[11px] font-medium tracking-wide">
          <Code2 className="w-3.5 h-3.5 text-cyan-500" />
          <span>{settings.developerSignature}</span>
        </div>
      </div>
    </div>
  );
};
