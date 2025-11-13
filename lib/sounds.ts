// Sound utility using Web Audio API for game feedback sounds

// Type definition for browser compatibility
interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

class SoundManager {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize AudioContext with browser compatibility
      const AudioContextClass =
        window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
      this.audioContext = AudioContextClass ? new AudioContextClass() : null;
      // Load mute preference from localStorage
      const savedMute = localStorage.getItem('rth_sounds_muted');
      this.isMuted = savedMute === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
      this.audioContext = AudioContextClass ? new AudioContextClass() : null;
    }
    return this.audioContext;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rth_sounds_muted', String(muted));
    }
  }

  isSoundMuted(): boolean {
    return this.isMuted;
  }

  // Play a pleasant success sound for correct matches
  playCorrectSound() {
    if (this.isMuted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play two notes for a pleasant "ding"
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  // Play a gentle error sound for incorrect matches
  playIncorrectSound() {
    if (this.isMuted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Lower frequency for error
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  // Play a celebration sound for round completion
  playRoundCompleteSound() {
    if (this.isMuted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    // Play ascending arpeggio
    const notes = [523.25, 659.25, 783.99]; // C, E, G

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const startTime = ctx.currentTime + index * 0.15;
      oscillator.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
    });
  }

  // Play achievement sound for unlocking new modes
  playLevelUnlockSound() {
    if (this.isMuted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    // Play triumphant fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      const startTime = ctx.currentTime + index * 0.1;
      oscillator.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.5);
    });
  }

  // Play a soft click sound for button interactions
  playClickSound() {
    if (this.isMuted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }
}

// Singleton instance
let soundManager: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManager) {
    soundManager = new SoundManager();
  }
  return soundManager;
}

// Convenience functions
export const playCorrectSound = () => getSoundManager().playCorrectSound();
export const playIncorrectSound = () => getSoundManager().playIncorrectSound();
export const playRoundCompleteSound = () => getSoundManager().playRoundCompleteSound();
export const playLevelUnlockSound = () => getSoundManager().playLevelUnlockSound();
export const playClickSound = () => getSoundManager().playClickSound();
