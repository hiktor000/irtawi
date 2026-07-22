import { ActivityLevel, Gender, WeatherCondition } from '../types';

export function calculateDailyWaterNeed(
  weightKg: number,
  activityLevel: ActivityLevel,
  weatherCondition: WeatherCondition,
  gender: Gender,
  _age: number
): number {
  if (!weightKg || weightKg <= 0) return 2500;

  // Base calculation: 35ml per kg of body weight
  let baseMl = weightKg * 35;

  // Activity bonus
  if (activityLevel === 'moderate') {
    baseMl += 350;
  } else if (activityLevel === 'high') {
    baseMl += 700;
  }

  // Weather bonus
  if (weatherCondition === 'moderate') {
    baseMl += 200;
  } else if (weatherCondition === 'hot') {
    baseMl += 500;
  }

  // Gender slight adjustment
  if (gender === 'male') {
    baseMl += 100;
  }

  // Round to nearest 50 ml
  const roundedMl = Math.round(baseMl / 50) * 50;
  
  // Constrain between 1200ml and 5000ml for realistic safety limits
  return Math.max(1200, Math.min(5000, roundedMl));
}

export function mlToOz(ml: number): number {
  return Math.round(ml * 0.033814);
}

export function ozToMl(oz: number): number {
  return Math.round(oz * 29.5735);
}

export function formatWaterAmount(ml: number, unit: 'ml' | 'oz'): string {
  if (unit === 'oz') {
    return `${mlToOz(ml)} أونصة`;
  }
  if (ml >= 1000) {
    const liters = (ml / 1000).toFixed(1).replace('.0', '');
    return `${liters} لتر`;
  }
  return `${ml} مل`;
}
