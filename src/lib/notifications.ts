import { playVibration, playWaterSound, speakArabicMessage } from './audio';

export const MOTIVATIONAL_MESSAGES = [
  '💧 حان وقت شرب الماء.',
  '💧 جسمك يحتاج إلى الترطيب الآن.',
  '💧 اشرب كوباً من الماء لتحافظ على نشاطك وصحتك.',
  '💧 بقي القليل للوصول لهدفك اليومي!',
  '💧 لا تنتظر حتى تشعر بالعطش، اشرب الآن.',
  '💧 الماء يجدد طاقتك ويمنح بشرتك نضارة.',
  '💧 رشفة ماء الآن تمنح عقلك تركيزاً مضاعفاً.',
];

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function sendBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/water-drop.png', // Fallback or placeholder icon
        badge: '/water-drop.png',
        tag: 'irtiwi-water-reminder',
      });
    } catch (e) {
      console.warn('Browser notification error:', e);
    }
  }
}

export function triggerWaterReminder(
  message: string,
  options: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    ttsEnabled: boolean;
    ttsVolume: number;
    onTriggerInApp?: (msg: string) => void;
  }
) {
  // 1. Play Sound
  if (options.soundEnabled) {
    playWaterSound();
  }

  // 2. Vibrate
  if (options.vibrationEnabled) {
    playVibration([150, 80, 150]);
  }

  // 3. Browser Notification
  sendBrowserNotification('💧 ارتوِ | تذكير شرب الماء', message);

  // 4. Voice TTS Speech
  if (options.ttsEnabled) {
    // Strip emoji for TTS
    const cleanText = message.replace(/[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F1E0-\u1F1FF\u2600-\u26FF\u2700-\u27BF]/g, '').trim();
    speakArabicMessage(cleanText || 'حان وقت شرب الماء', options.ttsVolume);
  }

  // 5. In-App Notification Toast Trigger
  if (options.onTriggerInApp) {
    options.onTriggerInApp(message);
  }
}
