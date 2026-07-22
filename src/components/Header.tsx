import React from 'react';
import { Droplet, Flame, Bell, Moon, Sun } from 'lucide-react';
import { AppSettings, UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  streakDays: number;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenWidgetSim: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  streakDays,
  settings,
  onUpdateSettings,
  onOpenWidgetSim,
}) => {
  const isDark = settings.theme === 'dark';

  const toggleTheme = () => {
    onUpdateSettings({ theme: isDark ? 'light' : 'dark' });
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-cyan-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & App Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Droplet className="w-6 h-6 fill-white text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              ارتوِ
            </h1>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              تتبع شرب الماء الذكي
            </p>
          </div>
        </div>

        {/* Right Badges & Controls */}
        <div className="flex items-center gap-2">
          {/* Streak Counter Badge */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold"
            title="سلسلة الأيام المتتالية"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{streakDays} يوم</span>
          </div>

          {/* Android Widget Simulator Launcher */}
          <button
            onClick={onOpenWidgetSim}
            className="p-2 rounded-xl bg-cyan-50 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-slate-700 transition-colors text-xs font-semibold flex items-center gap-1 border border-cyan-200/60 dark:border-slate-700"
            title="معاينة ويدجت الشاشة الرئيسية"
          >
            <span className="text-sm">📱</span>
            <span className="hidden sm:inline">الويدجت</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="تغيير المظهر"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
