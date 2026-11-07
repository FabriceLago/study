import { soundEngine } from './audio';

class SpeechHelper {
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public speak(text: string, rate: number = 0.95) {
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
      utterance.lang = 'fr-FR';
      utterance.rate = rate; // Gentle pace suitable for 10-year-olds
      utterance.pitch = 1.05; // Friendly warm tone

      // Try to find a natural French voice if available
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice =
        voices.find((v) => v.lang.startsWith('fr') && (v.name.includes('Amélie') || v.name.includes('Thomas') || v.name.includes('French') || v.name.includes('Google'))) ||
        voices.find((v) => v.lang.startsWith('fr'));

      if (frenchVoice) {
        utterance.voice = frenchVoice;
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
