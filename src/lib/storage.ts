import { Achievement, AppSettings, ReminderConfig, UserProfile, WaterLog } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'irtiwi_user_profile',
  LOGS: 'irtiwi_water_logs',
  REMINDERS: 'irtiwi_reminders_config',
  ACHIEVEMENTS: 'irtiwi_achievements',
  SETTINGS: 'irtiwi_app_settings',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  age: 26,
  gender: 'male',
  weightKg: 70,
  heightCm: 170,
  activityLevel: 'moderate',
  weatherCondition: 'moderate',
  dailyGoalMl: 2500,
  defaultCupMl: 250,
  isConfigured: false,
};

export const DEFAULT_REMINDERS: ReminderConfig = {
  enabled: true,
  intervalMinutes: 60, // Every 1 hour
  startTime: '08:00',
  endTime: '22:00',
  pauseSleep: true,
  soundEnabled: true,
  vibrationEnabled: true,
  ttsEnabled: true,
  ttsVolume: 0.9,
  selectedSound: 'bubble',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_cup',
    title: 'أول كوب ماء 🥛',
    description: 'سجل أول رشفة ماء في رحلة الترطيب الخاصة بك.',
    icon: 'Droplets',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'first_day_completed',
    title: 'أول يوم مكتمل 🎯',
    description: 'وصلت إلى 100% من هدفك اليومي لأول مرة.',
    icon: 'CheckCircle2',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_3',
    title: 'بداية القوة 💪🏼',
    description: 'حققت هدفك اليومي لـ 3 أيام متتالية.',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_7',
    title: 'أسبوع من الالتزام 🗓️',
    description: 'استمررت في شرب الماء بانتظام لمدة 7 أيام متتالية.',
    icon: 'CalendarDays',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'streak_30',
    title: 'عادة صحية دائمة 🌟',
    description: '30 يوماً متتالياً من الحفاظ على ترطيب جسمك.',
    icon: 'Award',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'liters_100',
    title: 'نادي الـ 100 لتر 🌊',
    description: 'شربت إجمالي 100 لتر من الماء عبر تطبيق ارتوِ.',
    icon: 'Waves',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'hydration_hero',
    title: 'بطل الترطيب 🏆',
    description: 'حقق الهدف اليومي بنسبة 100% لمدة 14 يوماً متتالية.',
    icon: 'Trophy',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'early_bird',
    title: 'النشاط الباكر 🌅',
    description: 'شربت أول كوب ماء قبل الساعة 8 صباحاً.',
    icon: 'Sun',
    unlocked: false,
    progress: 0,
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'ar',
  unit: 'ml',
  developerSignature: 'Designed & Developed by Ahmed Grairi',
};

// Storage helper methods
export function getUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Error reading profile from local storage', e);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getWaterLogs(): WaterLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Error reading water logs', e);
  }
  return [];
}

export function saveWaterLogs(logs: WaterLog[]): void {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

export function getReminderConfig(): ReminderConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Error reading reminders', e);
  }
  return DEFAULT_REMINDERS;
}

export function saveReminderConfig(config: ReminderConfig): void {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(config));
}

export function getAchievements(): Achievement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (data) {
      const stored: Achievement[] = JSON.parse(data);
      // Merge with initial list in case new ones were added
      return INITIAL_ACHIEVEMENTS.map((initItem) => {
        const found = stored.find((s) => s.id === initItem.id);
        return found ? { ...initItem, ...found } : initItem;
      });
    }
  } catch (e) {
    console.warn('Error reading achievements', e);
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export function getAppSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Error reading settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveAppSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Compute today's logs and stats
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getTodayLogs(logs: WaterLog[]): WaterLog[] {
  const today = new Date();
  return logs.filter((log) => isSameDay(new Date(log.timestamp), today));
}

export function getTodayTotalMl(logs: WaterLog[]): number {
  return getTodayLogs(logs).reduce((sum, log) => sum + log.amountMl, 0);
}

export function calculateStreakDays(logs: WaterLog[], dailyGoalMl: number): number {
  if (logs.length === 0) return 0;

  // Group logs by date string YYYY-MM-DD
  const totalsByDate: Record<string, number> = {};
  logs.forEach((log) => {
    const dateStr = new Date(log.timestamp).toISOString().split('T')[0];
    totalsByDate[dateStr] = (totalsByDate[dateStr] || 0) + log.amountMl;
  });

  let streak = 0;
  const now = new Date();
  
  // Check today first
  const todayStr = now.toISOString().split('T')[0];
  const todayTotal = totalsByDate[todayStr] || 0;

  let checkDate = new Date();
  if (todayTotal >= dailyGoalMl) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Check if yesterday was completed
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayTotal = totalsByDate[dateStr] || 0;
    if (dayTotal >= dailyGoalMl) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// Check and update achievements based on current logs & goal
export function checkAndUpdateAchievements(
  logs: WaterLog[],
  dailyGoalMl: number
): { updatedAchievements: Achievement[]; newlyUnlocked: Achievement[] } {
  const current = getAchievements();
  const newlyUnlocked: Achievement[] = [];

  const totalIntakesCount = logs.length;
  const totalVolumeMl = logs.reduce((sum, l) => sum + l.amountMl, 0);
  const streakDays = calculateStreakDays(logs, dailyGoalMl);
  const todayTotal = getTodayTotalMl(logs);

  const updatedAchievements = current.map((ach) => {
    if (ach.unlocked) return ach;

    let shouldUnlock = false;
    let newProgress = 0;

    switch (ach.id) {
      case 'first_cup':
        newProgress = Math.min(100, (totalIntakesCount / 1) * 100);
        shouldUnlock = totalIntakesCount >= 1;
        break;

      case 'first_day_completed':
        newProgress = Math.min(100, (todayTotal / dailyGoalMl) * 100);
        shouldUnlock = todayTotal >= dailyGoalMl;
        break;

      case 'streak_3':
        newProgress = Math.min(100, (streakDays / 3) * 100);
        shouldUnlock = streakDays >= 3;
        break;

      case 'streak_7':
        newProgress = Math.min(100, (streakDays / 7) * 100);
        shouldUnlock = streakDays >= 7;
        break;

      case 'streak_30':
        newProgress = Math.min(100, (streakDays / 30) * 100);
        shouldUnlock = streakDays >= 30;
        break;

      case 'liters_100':
        const liters = totalVolumeMl / 1000;
        newProgress = Math.min(100, (liters / 100) * 100);
        shouldUnlock = liters >= 100;
        break;

      case 'hydration_hero':
        newProgress = Math.min(100, (streakDays / 14) * 100);
        shouldUnlock = streakDays >= 14;
        break;

      case 'early_bird':
        const hasEarlyLog = logs.some((log) => {
          const hours = new Date(log.timestamp).getHours();
          return hours < 8;
        });
        newProgress = hasEarlyLog ? 100 : 0;
        shouldUnlock = hasEarlyLog;
        break;
    }

    if (shouldUnlock) {
      const unlockedItem = {
        ...ach,
        unlocked: true,
        unlockedAt: Date.now(),
        progress: 100,
      };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return {
      ...ach,
      progress: Math.round(newProgress),
    };
  });

  saveAchievements(updatedAchievements);
  return { updatedAchievements, newlyUnlocked };
}
