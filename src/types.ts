export type Gender = 'male' | 'female';
export type ActivityLevel = 'low' | 'moderate' | 'high';
export type WeatherCondition = 'cold' | 'moderate' | 'hot';
export type WaterUnit = 'ml' | 'oz';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  weatherCondition: WeatherCondition;
  dailyGoalMl: number;
  defaultCupMl: number;
  isConfigured: boolean;
}

export interface WaterLog {
  id: string;
  amountMl: number;
  timestamp: number; // Date.now()
  containerType?: string; // 'cup', 'bottle', 'glass', 'large_bottle'
  note?: string;
}

export interface ReminderConfig {
  enabled: boolean;
  intervalMinutes: number; // e.g. 30, 60, 120, 180
  startTime: string; // '08:00'
  endTime: string; // '22:00'
  pauseSleep: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  ttsEnabled: boolean;
  ttsVolume: number; // 0 to 1
  selectedSound: string; // 'bubble', 'chime', 'stream'
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number; // 0 to 100
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';
  unit: WaterUnit;
  developerSignature: string;
}

export type ViewTab = 'home' | 'history' | 'stats' | 'achievements' | 'settings';
