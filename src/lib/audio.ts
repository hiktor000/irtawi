// Web Audio API Sound Synthesizer & Speech Synthesis Helper

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a realistic water droplet chime sound using Web Audio API
 */
export function playWaterSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Primary drop oscillator (sine wave pitch slide)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency pitch slide mimicking water drop sound: 600Hz up to 1400Hz rapidly
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);

    // Second harmonic drop for richness
    setTimeout(() => {
      try {
        const now2 = ctx.currentTime;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(800, now2);
        osc2.frequency.exponentialRampToValueAtTime(1800, now2 + 0.06);

        gain2.gain.setValueAtTime(0.01, now2);
        gain2.gain.linearRampToValueAtTime(0.2, now2 + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.18);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start(now2);
        osc2.stop(now2 + 0.18);
      } catch (e) {
        console.warn('Audio sub-harmonics warning', e);
      }
    }, 60);
  } catch (e) {
    console.warn('Web Audio error:', e);
  }
}

/**
 * Synthesizes a triumphant victory celebration chord sequence
 */
export function playCelebrationSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  } catch (e) {
    console.warn('Celebration sound error:', e);
  }
}

/**
 * Triggers device haptic vibration
 */
export function playVibration(pattern: number[] = [100, 50, 100]) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignored if forbidden or unsupported
    }
  }
}

/**
 * Speaks an Arabic message using Text-To-Speech (Web SpeechSynthesis API)
 */
export function speakArabicMessage(text: string, volume: number = 0.9) {
  if (!('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA'; // Arabic (Saudi Arabia) or general 'ar'
    utterance.volume = Math.max(0, Math.min(1, volume));
    utterance.rate = 0.95; // Natural speaking rate
    utterance.pitch = 1.0;

    // Try to find Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      (v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic')
    );
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}
