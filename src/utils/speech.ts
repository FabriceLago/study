import { soundEngine } from './audio';
import { i18n } from './i18n';

class SpeechHelper {
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public speak(text: string, customLang?: string, rate: number = 0.95) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Respect the global mute state
    if (soundEngine.isMuted()) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Determine voice language: custom override, or current study language from i18n
      const targetLang = customLang || i18n.getLanguageInfo().voiceLang || 'fr-FR';
      utterance.lang = targetLang;
      utterance.rate = rate; // Gentle pace suitable for young learners
      utterance.pitch = 1.05; // Friendly warm tone

      const voices = window.speechSynthesis.getVoices();
      const prefix = targetLang.split('-')[0].toLowerCase();

      // Find appropriate voice based on target language (Dutch, French, English, Spanish)
      let matchedVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith(prefix) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Enhanced'))
      );

      if (!matchedVoice) {
        matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
}

export const speechHelper = new SpeechHelper();
