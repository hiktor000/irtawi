/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/OnboardingModal';
import { AchievementModal } from './components/AchievementModal';
import { InteractiveWidget } from './components/InteractiveWidget';
import { NotificationBanner } from './components/NotificationBanner';
import { HomeView } from './views/HomeView';
import { HistoryView } from './views/HistoryView';
import { StatsView } from './views/StatsView';
import { AchievementsView } from './views/AchievementsView';
import { SettingsView } from './views/SettingsView';

import {
  getUserProfile,
  saveUserProfile,
  getWaterLogs,
  saveWaterLogs,
  getReminderConfig,
  saveReminderConfig,
  getAchievements,
  getAppSettings,
  saveAppSettings,
  getTodayLogs,
  getTodayTotalMl,
  calculateStreakDays,
  checkAndUpdateAchievements,
} from './lib/storage';
import {
  Achievement,
  AppSettings,
  ReminderConfig,
  UserProfile,
  ViewTab,
  WaterLog,
} from './types';
import { triggerWaterReminder, MOTIVATIONAL_MESSAGES } from './lib/notifications';
import { playCelebrationSound } from './lib/audio';
import confetti from 'canvas-confetti';

export default function App() {
  // State initialization
  const [profile, setProfile] = useState<UserProfile>(getUserProfile);
  const [logs, setLogs] = useState<WaterLog[]>(getWaterLogs);
  const [reminders, setReminders] = useState<ReminderConfig>(getReminderConfig);
  const [achievements, setAchievements] = useState<Achievement[]>(getAchievements);
  const [settings, setSettings] = useState<AppSettings>(getAppSettings);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ViewTab>('home');

  // Modals & Banners state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!profile.isConfigured);
  const [unlockedModalBadge, setUnlockedModalBadge] = useState<Achievement | null>(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [activeNotificationMsg, setActiveNotificationMsg] = useState<string | null>(null);

  // Sync theme class to html element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Calculated properties
  const todayLogs = getTodayLogs(logs);
  const todayTotalMl = getTodayTotalMl(logs);
  const streakDays = calculateStreakDays(logs, profile.dailyGoalMl);

  // Check achievements helper
  const updateAndCheckBadges = useCallback(
    (currentLogs: WaterLog[], goalMl: number) => {
      const { updatedAchievements, newlyUnlocked } = checkAndUpdateAchievements(
        currentLogs,
        goalMl
      );
      setAchievements(updatedAchievements);
      if (newlyUnlocked.length > 0) {
        setUnlockedModalBadge(newlyUnlocked[0]);
      }
    },
    []
  );

  // Add water intake handler
  const handleAddWater = (amountMl: number, containerType: string = 'glass') => {
    const prevTotal = todayTotalMl;
    const newLog: WaterLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      amountMl,
      timestamp: Date.now(),
      containerType,
    };

    const nextLogs = [newLog, ...logs];
    setLogs(nextLogs);
    saveWaterLogs(nextLogs);

    // Check if goal completed with this log
    const nextTotal = prevTotal + amountMl;
    if (prevTotal < profile.dailyGoalMl && nextTotal >= profile.dailyGoalMl) {
      playCelebrationSound();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }

    // Check badges
    updateAndCheckBadges(nextLogs, profile.dailyGoalMl);
  };

  // Add manual log with custom timestamp
  const handleAddManualLog = (
    amountMl: number,
    timestamp: number,
    containerType: string = 'manual'
  ) => {
    const newLog: WaterLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      amountMl,
      timestamp,
      containerType,
    };

    const nextLogs = [newLog, ...logs];
    setLogs(nextLogs);
    saveWaterLogs(nextLogs);
    updateAndCheckBadges(nextLogs, profile.dailyGoalMl);
  };

  // Update log amount
  const handleUpdateLog = (id: string, newAmountMl: number) => {
    const nextLogs = logs.map((l) => (l.id === id ? { ...l, amountMl: newAmountMl } : l));
    setLogs(nextLogs);
    saveWaterLogs(nextLogs);
    updateAndCheckBadges(nextLogs, profile.dailyGoalMl);
  };

  // Delete log
  const handleDeleteLog = (id: string) => {
    const nextLogs = logs.filter((l) => l.id !== id);
    setLogs(nextLogs);
    saveWaterLogs(nextLogs);
    updateAndCheckBadges(nextLogs, profile.dailyGoalMl);
  };

  // Onboarding completion
  const handleCompleteOnboarding = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveUserProfile(newProfile);
    setIsOnboardingOpen(false);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveAppSettings(updated);
  };

  // Update Profile
  const handleUpdateProfile = (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile };
    setProfile(updated);
    saveUserProfile(updated);
  };

  // Update Reminders
  const handleUpdateReminders = (newReminders: Partial<ReminderConfig>) => {
    const updated = { ...reminders, ...newReminders };
    setReminders(updated);
    saveReminderConfig(updated);
  };

  // Reset all application data
  const handleResetData = () => {
    if (confirm('هل أنت تأكد من أنك تريد إعادة ضبط جميع البيانات والسجلات؟')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Trigger test reminder
  const handleTriggerTestReminder = () => {
    const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    triggerWaterReminder(msg, {
      soundEnabled: reminders.soundEnabled,
      vibrationEnabled: reminders.vibrationEnabled,
      ttsEnabled: reminders.ttsEnabled,
      ttsVolume: reminders.ttsVolume,
      onTriggerInApp: (m) => setActiveNotificationMsg(m),
    });
  };

  // Setup smart reminder interval background timer
  useEffect(() => {
    if (!reminders.enabled) return;

    const intervalMs = reminders.intervalMinutes * 60 * 1000;
    const timer = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [startH, startM] = reminders.startTime.split(':').map(Number);
      const [endH, endM] = reminders.endTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      // Check if within active time window
      if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
        triggerWaterReminder(msg, {
          soundEnabled: reminders.soundEnabled,
          vibrationEnabled: reminders.vibrationEnabled,
          ttsEnabled: reminders.ttsEnabled,
          ttsVolume: reminders.ttsVolume,
          onTriggerInApp: (m) => setActiveNotificationMsg(m),
        });
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [reminders]);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sticky Header Bar */}
      <Header
        profile={profile}
        streakDays={streakDays}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenWidgetSim={() => setIsWidgetOpen(true)}
      />

      {/* In-App Floating Smart Reminder Banner */}
      <NotificationBanner
        message={activeNotificationMsg}
        defaultCupMl={profile.defaultCupMl}
        unit={settings.unit}
        onDismiss={() => setActiveNotificationMsg(null)}
        onQuickLog={(amt) => handleAddWater(amt, 'notification')}
      />

      {/* Main View Router Content */}
      <main className="w-full">
        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            todayLogs={todayLogs}
            todayTotalMl={todayTotalMl}
            streakDays={streakDays}
            unit={settings.unit}
            onAddWater={handleAddWater}
            onOpenWidgetSim={() => setIsWidgetOpen(true)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            logs={logs}
            unit={settings.unit}
            onAddManualLog={handleAddManualLog}
            onUpdateLog={handleUpdateLog}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            logs={logs}
            dailyGoalMl={profile.dailyGoalMl}
            streakDays={streakDays}
            unit={settings.unit}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView achievements={achievements} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            profile={profile}
            reminders={reminders}
            settings={settings}
            onUpdateProfile={handleUpdateProfile}
            onUpdateReminders={handleUpdateReminders}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetData}
            onReopenOnboarding={() => setIsOnboardingOpen(true)}
            onTriggerTestReminder={handleTriggerTestReminder}
          />
        )}
      </main>

      {/* Bottom Material 3 Navigation Bar */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* First Run Setup Onboarding Wizard */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleCompleteOnboarding}
      />

      {/* Unlocked Trophy Badge Modal */}
      <AchievementModal
        achievement={unlockedModalBadge}
        onClose={() => setUnlockedModalBadge(null)}
      />

      {/* Android Widget Simulator Modal */}
      <InteractiveWidget
        isOpen={isWidgetOpen}
        onClose={() => setIsWidgetOpen(false)}
        currentMl={todayTotalMl}
        goalMl={profile.dailyGoalMl}
        defaultCupMl={profile.defaultCupMl}
        unit={settings.unit}
        onAddWater={(amt) => handleAddWater(amt, 'widget')}
      />
    </div>
  );
}
