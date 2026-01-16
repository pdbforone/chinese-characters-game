/**
 * Tone-Specific Sound Synthesis for Mandarin Tone Learning
 *
 * Based on research synthesis from:
 * - Gemini: Psychoacoustic Architecture for L2 Mandarin Tone Acquisition
 * - Grok: Acoustic validation of synthesis parameters
 * - GPT: Frequency range and mobile speaker constraints
 *
 * Key principles:
 * - Pitch contour clarity over timbral realism
 * - Fundamentals ≥120Hz for mobile speaker compatibility
 * - Let contour shape do most of the work
 * - Irregular AM for vocal fry (not clean periodic)
 */

// Browser compatibility
interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

// Tone emotion mapping
export type ToneNumber = 1 | 2 | 3 | 4 | 5;

export interface ToneSound {
  tone: ToneNumber;
  emotion: string;
  description: string;
}

export const TONE_SOUND_MAP: Record<ToneNumber, ToneSound> = {
  1: { tone: 1, emotion: 'SING', description: 'Sustained high note - pure, ringing' },
  2: { tone: 2, emotion: 'GASP', description: 'Rising surprise - questioning lift' },
  3: { tone: 3, emotion: 'GROAN', description: 'Dipping moan - creaky, low' },
  4: { tone: 4, emotion: 'COMMAND', description: 'Sharp bark - commanding fall' },
  5: { tone: 5, emotion: 'whisper', description: 'Neutral - soft, undefined' },
};

class ToneSoundManager {
  private audioContext: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }
    // Resume context if suspended (required after user interaction)
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * TONE 1: SING - Sustained, pure, high
   * Research: E4 (330Hz) fixed, triangle wave, soft attack, reverb-like decay
   * Feel: Clear, ringing, stable - like holding a sung note
   */
  playTone1(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.5;

    // Triangle wave for pure, flute-like quality
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, now); // E4 - fixed high pitch

    // Gain envelope: soft attack, sustained, gentle release
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.08); // 80ms soft attack
    gainNode.gain.setValueAtTime(0.25, now + 0.3); // sustain
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Mild lowpass to keep it vocal-adjacent (not too bright)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    // Simple reverb simulation via delay
    const delay = ctx.createDelay();
    delay.delayTime.setValueAtTime(0.03, now);
    const delayGain = ctx.createGain();
    delayGain.gain.setValueAtTime(0.3, now);

    // Connect: osc -> filter -> gain -> destination
    //                      \-> delay -> delayGain -> destination
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    filter.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  /**
   * TONE 2: GASP - Rising, surprised
   * Research: C3→G3 (131→196Hz), fast attack, pitch rise carries the metaphor
   * Feel: Surprised question, lifting upward
   */
  playTone2(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.45;

    // Sawtooth for richer harmonics
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';

    // Rising pitch contour: C3 (131Hz) -> G3 (196Hz)
    osc.frequency.setValueAtTime(131, now);
    osc.frequency.exponentialRampToValueAtTime(196, now + duration * 0.8);

    // Fast attack (30ms), let pitch carry the "gasp" feeling
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.03); // 30ms fast attack
    gainNode.gain.setValueAtTime(0.2, now + duration * 0.7);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Bandpass filter that sweeps up with pitch (mouth opening)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2, now);
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + duration * 0.8);

    // Add subtle breathiness (10-15% bandlimited noise)
    const noiseBuffer = this.createNoiseBuffer(ctx, duration);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(2500, now); // 1-4kHz band
    noiseFilter.Q.setValueAtTime(0.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.03, now); // 12% noise
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Connect oscillator path
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Connect noise path
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }

  /**
   * TONE 3: GROAN - Dipping, creaky (vocal fry simulation)
   * Research: A3→E3→G3 (220→165→196Hz), irregular AM for fry texture
   * Feel: Low moan, zombie-like, guttural
   */
  playTone3(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.55;

    // Main oscillator - sawtooth for rich harmonics
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';

    // Dipping pitch contour: starts mid, dips low, rises slightly
    // A3 (220Hz) -> E3 (165Hz) -> G3 (196Hz)
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(165, now + duration * 0.4); // dip
    osc.frequency.exponentialRampToValueAtTime(196, now + duration * 0.9); // slight rise

    // Sub-oscillator one octave below for depth (uses harmonics, not sub-100Hz)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'square';
    subOsc.frequency.setValueAtTime(110, now); // A2
    subOsc.frequency.exponentialRampToValueAtTime(82, now + duration * 0.4);
    subOsc.frequency.exponentialRampToValueAtTime(98, now + duration * 0.9);

    // Vocal fry simulation: irregular amplitude modulation (25-50Hz randomized)
    // Using LFO with slight randomization for "creaky" texture
    const lfo = ctx.createOscillator();
    lfo.type = 'square'; // Square LFO for distinct pulses
    // Randomize between 25-50Hz for irregularity
    const fryRate = 25 + Math.random() * 25;
    lfo.frequency.setValueAtTime(fryRate, now);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.3, now); // Modulation depth

    // Main gain with sluggish attack
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.12); // 120ms sluggish attack
    gainNode.gain.setValueAtTime(0.18, now + duration * 0.7);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Sub gain (quieter)
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.08, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // AM modulator gain node
    const amGain = ctx.createGain();
    amGain.gain.setValueAtTime(1, now);

    // Lowpass filter for muffled/chest resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    // Connect LFO to modulate amplitude
    lfo.connect(lfoGain);
    lfoGain.connect(amGain.gain);

    // Connect oscillators through AM and filter
    osc.connect(amGain);
    amGain.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    osc.start(now);
    subOsc.start(now);
    lfo.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);
    lfo.stop(now + duration);
  }

  /**
   * TONE 4: COMMAND - Sharp, falling
   * Research: G3→C3 (196→131Hz), instant attack, short duration
   * Feel: Bark, command, impact - authoritative and decisive
   */
  playTone4(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.28;

    // Square wave for hollow, aggressive timbre
    const osc = ctx.createOscillator();
    osc.type = 'square';

    // Rapid falling pitch: G3 (196Hz) -> C3 (131Hz)
    osc.frequency.setValueAtTime(196, now);
    osc.frequency.exponentialRampToValueAtTime(131, now + duration * 0.6);

    // Instant attack (5ms), short decay - punchy
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.005); // 5ms instant attack
    gainNode.gain.setValueAtTime(0.25, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Slight saturation/compression effect via waveshaper
    const waveshaper = ctx.createWaveShaper();
    // Type assertion needed due to strict TypeScript ArrayBuffer typing
    waveshaper.curve = this.createDistortionCurve(2) as Float32Array<ArrayBuffer> | null;
    waveshaper.oversample = '2x';

    // Lowpass that closes quickly (filter envelope)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration * 0.5);

    osc.connect(waveshaper);
    waveshaper.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * TONE 5: WHISPER - Neutral tone (for completeness)
   * Soft, undefined, gentle
   */
  playTone5(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.3;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, now); // Mid-range, neutral

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * ERROR THUD - Non-tonal feedback for incorrect answers
   * Research: Must be non-tonal to avoid reinforcing wrong tone associations
   * Feel: Dull thud, no pitch information
   */
  playErrorThud(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 0.15;

    // Filtered noise burst - no clear pitch
    const noiseBuffer = this.createNoiseBuffer(ctx, duration);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Heavy lowpass to create dull thud
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.Q.setValueAtTime(1, now);

    // Short envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // 10ms attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration);
  }

  /**
   * Play the correct sound for a given tone
   */
  playToneSound(tone: ToneNumber): void {
    switch (tone) {
      case 1:
        this.playTone1();
        break;
      case 2:
        this.playTone2();
        break;
      case 3:
        this.playTone3();
        break;
      case 4:
        this.playTone4();
        break;
      case 5:
        this.playTone5();
        break;
    }
  }

  /**
   * Play completion fanfare - musical resolution (Major I chord)
   * Research: Triggers dopamine through musical resolution
   */
  playCompletionFanfare(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // C Major chord arpeggio: C4, E4, G4, C5
    const notes = [
      { freq: 261.63, delay: 0 }, // C4
      { freq: 329.63, delay: 0.1 }, // E4
      { freq: 392.0, delay: 0.2 }, // G4
      { freq: 523.25, delay: 0.3 }, // C5
    ];

    notes.forEach(({ freq, delay }) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.15, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.6);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.6);
    });
  }

  // Helper: Create white noise buffer
  private createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  // Helper: Create distortion curve for saturation effect
  private createDistortionCurve(amount: number): Float32Array {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    return curve;
  }
}

// Singleton instance
let toneSoundManager: ToneSoundManager | null = null;

export function getToneSoundManager(): ToneSoundManager {
  if (!toneSoundManager) {
    toneSoundManager = new ToneSoundManager();
  }
  return toneSoundManager;
}

// Convenience exports
export const playToneSound = (tone: ToneNumber) => getToneSoundManager().playToneSound(tone);
export const playTone1 = () => getToneSoundManager().playTone1();
export const playTone2 = () => getToneSoundManager().playTone2();
export const playTone3 = () => getToneSoundManager().playTone3();
export const playTone4 = () => getToneSoundManager().playTone4();
export const playTone5 = () => getToneSoundManager().playTone5();
export const playErrorThud = () => getToneSoundManager().playErrorThud();
export const playCompletionFanfare = () => getToneSoundManager().playCompletionFanfare();
