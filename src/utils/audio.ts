/**
 * Cozy Web Audio synthesizer for StudyQuest City Builder.
 * Produces gentle, uplifting sound effects and cozy lofi study ambiance.
 * Includes global mute control with local storage persistence.
 */

const STORAGE_KEY = 'studyquest_audio_muted';

function getInitialMutedState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

let audioCtx: AudioContext | null = null;
let isMuted = getInitialMutedState();
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let isAmbientPlaying = false;

type MuteListener = (muted: boolean) => void;
const muteListeners = new Set<MuteListener>();

function notifyMuteListeners(muted: boolean) {
  muteListeners.forEach((listener) => {
    try {
      listener(muted);
    } catch {}
  });
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const soundEngine = {
  isMuted(): boolean {
    return isMuted;
  },

  setMuted(muted: boolean) {
    isMuted = muted;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
      }
    } catch {}

    if (muted && isAmbientPlaying) {
      this.stopAmbientFocus();
    }

    notifyMuteListeners(isMuted);
  },

  toggleMute(): boolean {
    const nextState = !isMuted;
    this.setMuted(nextState);
    return nextState;
  },

  subscribeMute(listener: MuteListener): () => void {
    muteListeners.add(listener);
    // Call immediately with current state
    listener(isMuted);
    return () => {
      muteListeners.delete(listener);
    };
  },

  playClick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  },

  playSuccess() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Soft harp chime: C5, E5, G5, B5, C6
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.32);
      });
    } catch {}
  },

  playBrickPlaced() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch {}
  },

  playSoftMiss() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  },

  playError() {
    this.playSoftMiss();
  },

  playLevelUp() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.1 },
        { f: 659.25, d: 0.1 },
        { f: 783.99, d: 0.1 },
        { f: 1046.5, d: 0.35 },
      ];

      let t = now;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + n.d + 0.05);

        t += n.d * 0.75;
      });
    } catch {}
  },

  toggleAmbientFocus(): boolean {
    if (isMuted) return false;
    if (isAmbientPlaying) {
      this.stopAmbientFocus();
      return false;
    } else {
      this.startAmbientFocus();
      return true;
    }
  },

  startAmbientFocus() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      this.stopAmbientFocus();

      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 2.0); // gentle soft lofi
      ambientGain.connect(ctx.destination);

      // Warm soothing 432Hz subharmonic chord
      ambientOsc1 = ctx.createOscillator();
      ambientOsc1.type = 'sine';
      ambientOsc1.frequency.setValueAtTime(144, ctx.currentTime); // D3

      ambientOsc2 = ctx.createOscillator();
      ambientOsc2.type = 'triangle';
      ambientOsc2.frequency.setValueAtTime(216, ctx.currentTime); // A3

      ambientOsc1.connect(ambientGain);
      ambientOsc2.connect(ambientGain);

      ambientOsc1.start();
      ambientOsc2.start();

      isAmbientPlaying = true;
    } catch {}
  },

  stopAmbientFocus() {
    if (ambientGain && audioCtx) {
      try {
        ambientGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        setTimeout(() => {
          if (ambientOsc1) ambientOsc1.stop();
          if (ambientOsc2) ambientOsc2.stop();
          ambientOsc1 = null;
          ambientOsc2 = null;
          ambientGain = null;
        }, 900);
      } catch {
        ambientOsc1 = null;
        ambientOsc2 = null;
        ambientGain = null;
      }
    }
    isAmbientPlaying = false;
  },

  isAmbientActive(): boolean {
    return isAmbientPlaying;
  },
};
