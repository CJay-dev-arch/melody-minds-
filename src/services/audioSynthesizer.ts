/**
 * Web Audio API Music Synthesizer & Educational Sound Generator
 * Generates rich musical notes, cheerful sound effects, and melody playback.
 */

// Note to Frequency mapping (Hz)
const NOTE_FREQS: Record<string, number> = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50,
};

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentSongTimeouts: number[] = [];
  private activeOscillators: OscillatorNode[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play a single musical note with envelope (Attack, Decay, Sustain, Release)
   */
  public playNote(noteName: string, durationSec = 0.5, instrument: 'marimba' | 'piano' | 'synth' | 'chime' = 'marimba') {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const freq = NOTE_FREQS[noteName] || 440;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    if (instrument === 'marimba') {
      osc.type = 'sine';
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
    } else if (instrument === 'piano') {
      osc.type = 'triangle';
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.35, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 1.2);
    } else if (instrument === 'chime') {
      osc.type = 'sine';
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.25, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 1.5);
    } else {
      osc.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
    }

    osc.frequency.setValueAtTime(freq, now);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec * 1.5);
  }

  /**
   * Play rewarding positive feedback chime
   */
  public playCorrectSound() {
    if (this.isMuted) return;
    const notes = ['C4', 'E4', 'G4', 'C5'];
    notes.forEach((note, idx) => {
      setTimeout(() => {
        this.playNote(note, 0.4, 'chime');
      }, idx * 100);
    });
  }

  /**
   * Gentle encouraging sound for retry
   */
  public playTryAgainSound() {
    if (this.isMuted) return;
    const notes = ['E4', 'C4'];
    notes.forEach((note, idx) => {
      setTimeout(() => {
        this.playNote(note, 0.35, 'marimba');
      }, idx * 150);
    });
  }

  /**
   * Star / Level-up Fanfare
   */
  public playFanfare() {
    if (this.isMuted) return;
    const notes = ['C4', 'C4', 'E4', 'G4', 'G4', 'C5'];
    const times = [0, 100, 200, 320, 420, 560];
    notes.forEach((n, idx) => {
      setTimeout(() => {
        this.playNote(n, 0.45, 'piano');
      }, times[idx]);
    });
  }

  /**
   * Play an educational song's musical note sequence
   */
  public playSongNotes(
    notes: { pitch: string; duration: number; timeOffset: number }[],
    onNoteTrigger?: (pitch: string, index: number) => void,
    onEnded?: () => void
  ) {
    this.stopAll();
    if (this.isMuted || !notes || notes.length === 0) return;

    let maxDuration = 0;
    notes.forEach((item, index) => {
      const timeMs = item.timeOffset * 1000;
      const timeoutId = window.setTimeout(() => {
        this.playNote(item.pitch, item.duration, 'piano');
        if (onNoteTrigger) onNoteTrigger(item.pitch, index);
      }, timeMs);
      this.currentSongTimeouts.push(timeoutId);

      const endTime = item.timeOffset + item.duration;
      if (endTime > maxDuration) maxDuration = endTime;
    });

    if (onEnded) {
      const endTimeoutId = window.setTimeout(() => {
        onEnded();
      }, (maxDuration + 0.5) * 1000);
      this.currentSongTimeouts.push(endTimeoutId);
    }
  }

  /**
   * Stop any currently scheduled song notes
   */
  public stopAll() {
    this.currentSongTimeouts.forEach((id) => clearTimeout(id));
    this.currentSongTimeouts = [];
  }

  /**
   * Cheerful narration voice using browser SpeechSynthesis
   */
  public speakNarration(text: string, enabled = true) {
    if (this.isMuted || !enabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly slower, very friendly and clear for children
    utterance.pitch = 1.25; // cheerful, melodic pitch

    // Try finding a friendly English voice
    const voices = window.speechSynthesis.getVoices();
    const friendlyVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Google'))
    );
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const soundEngine = new AudioSynthesizer();
