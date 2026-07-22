import React, { useState } from 'react';
import { Droplet, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { calculateDailyWaterNeed } from '../lib/calculator';
import { ActivityLevel, Gender, UserProfile, WeatherCondition } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [age, setAge] = useState(26);
  const [gender, setGender] = useState<Gender>('male');
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(170);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('moderate');
  const [customGoalMl, setCustomGoalMl] = useState<number | null>(null);

  if (!isOpen) return null;

  const calculatedGoalMl = calculateDailyWaterNeed(
    weightKg,
    activityLevel,
    weatherCondition,
    gender,
    age
  );

  const finalGoalMl = customGoalMl !== null ? customGoalMl : calculatedGoalMl;

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name.trim() || 'صديقي',
      age: Number(age) || 25,
      gender,
      weightKg: Number(weightKg) || 70,
      heightCm: Number(heightCm) || 170,
      activityLevel,
      weatherCondition,
      dailyGoalMl: finalGoalMl,
      defaultCupMl: 250,
      isConfigured: true,
    };
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Top Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step 1: Welcome & Basic Info */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                <Droplet className="w-9 h-9 fill-cyan-500/30" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                مرحباً بك في ارتوِ 💧
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                دعنا نتعرف عليك لنحسب احتياجك اليومي المثالي من الماء بدقة
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم (اختياري)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  العمر (سنة)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <span>المتابعة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Gender, Weight, Height */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center">
              البيانات الجسدية ⚖️
            </h3>

            {/* Gender Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                الجنس
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-3 rounded-2xl font-bold text-sm border transition-all ${
                    gender === 'male'
                      ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  👨‍💼 ذكر
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-3 rounded-2xl font-bold text-sm border transition-all ${
                    gender === 'female'
                      ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  👩‍💼 أنثى
                </button>
              </div>
            </div>

            {/* Weight and Height Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الوزن (كجم)
                </label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الطول (سم)
                </label>
                <input
                  type="number"
                  min="80"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <span>التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Activity Level & Weather Condition */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center">
              أسلوب الحياة والبيئة 🏃‍♂️
            </h3>

            {/* Activity Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                مستوى النشاط البدني
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low', label: 'منخفض 🧘‍♂️' },
                  { id: 'moderate', label: 'متوسط 🚶‍♂️' },
                  { id: 'high', label: 'مرتفع 🏃‍♂️' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivityLevel(act.id as ActivityLevel)}
                    className={`py-2.5 px-2 rounded-2xl font-bold text-xs border transition-all ${
                      activityLevel === act.id
                        ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Condition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                طبيعة الجو
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cold', label: 'بارد ❄️' },
                  { id: 'moderate', label: 'معتدل 🌤️' },
                  { id: 'hot', label: 'حار ☀️' },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWeatherCondition(w.id as WeatherCondition)}
                    className={`py-2.5 px-2 rounded-2xl font-bold text-xs border transition-all ${
                      weatherCondition === w.id
                        ? 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-500 text-cyan-600 dark:text-cyan-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <span>حساب الهدف</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Calculated Goal Confirmation */}
        {step === 4 && (
          <div className="space-y-5 text-center animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              هدف الشرب اليومي الموصى به 🎯
            </h3>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/60 dark:to-blue-950/60 border border-cyan-200 dark:border-cyan-800 shadow-inner">
              <div className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-1">
                {finalGoalMl} مل
              </div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                أي ما يعادل تقريباً {Math.round(finalGoalMl / 250)} أستكانة / أكواب يومياً
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 text-right">
                تعديل الهدف يدويًا إذا رغبت:
              </label>
              <input
                type="number"
                min="1000"
                max="6000"
                step="100"
                value={finalGoalMl}
                onChange={(e) => setCustomGoalMl(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-center font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>ابدأ رحلة الترطيب الآن</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
