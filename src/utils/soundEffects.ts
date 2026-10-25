// Web Audio API Sound Synthesizer & Natural Vietnamese Female Teacher Speech Engine
// Ensures 100% natural Vietnamese female teacher voice across all devices without English fallback.

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public speechEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private vietnameseVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    
    // Find female Vietnamese voice if possible
    const femaleVi = voices.find(v => 
      (v.lang.startsWith('vi') || v.lang.includes('VIE')) &&
      (v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('mai') ||
       v.name.toLowerCase().includes('linh') ||
       v.name.toLowerCase().includes('nu') ||
       v.name.toLowerCase().includes('google'))
    );

    const anyVi = voices.find(v => v.lang.startsWith('vi') || v.lang.includes('VIE'));
    this.vietnameseVoice = femaleVi || anyVi || null;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft cheerful bubble pop for button clicks
  playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // Play cheerful ascending melody for correct answers
  playSuccess() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.09;
        const noteEnd = noteStart + 0.18;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.22, noteStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteEnd);
      });
    } catch {
      // ignore
    }
  }

  // Gentle, warm, non-punishing sound for incorrect answers
  playTryAgain() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [380, 310]; // Gentle descending tones
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.14;
        const noteEnd = noteStart + 0.2;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.12, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteEnd);
      });
    } catch {
      // ignore
    }
  }

  // Aliases for compatibility
  playCorrect() {
    this.playSuccess();
  }

  playWrong() {
    this.playTryAgain();
  }

  // Magical star sparkle sound
  playStar() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [783.99, 987.77, 1174.66, 1567.98]; // G5, B5, D6, G6
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.06;
        const noteEnd = noteStart + 0.25;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteEnd);
      });
    } catch {
      // ignore
    }
  }

  // Big Victory Fanfare when finishing a game or receiving a medal
  playFanfare() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 523.25, d: 0.12, t: 0.12 },
        { f: 523.25, d: 0.12, t: 0.24 },
        { f: 698.46, d: 0.35, t: 0.38 },
        { f: 880.0, d: 0.25, t: 0.75 },
        { f: 1046.5, d: 0.65, t: 1.0 },
      ];

      const now = ctx.currentTime;
      notes.forEach((item) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + item.t;
        const noteEnd = noteStart + item.d;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.24, noteStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteEnd);
      });
    } catch {
      // ignore
    }
  }

  // Cheerful classroom applause / vỗ tay hoan hô
  playApplause() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      for (let i = 0; i < 12; i++) {
        const clapTime = now + (i * 0.12) + (Math.random() * 0.03);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450 + (Math.random() * 200), clapTime);
        gain.gain.setValueAtTime(0.18, clapTime);
        gain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(clapTime);
        osc.stop(clapTime + 0.09);
      }
    } catch {
      // ignore
    }
  }

  // Stop any currently playing speech or voice
  stopSpeech() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  // Speak Vietnamese text with sweet Female Preschool Teacher voice
  // 1. First priority: High-quality Vietnamese Female Audio Stream (/api/tts or Google TTS)
  // 2. Fallback: Web Speech API ONLY IF a legitimate Vietnamese voice is installed (NEVER English!)
  speakVietnamese(text: string) {
    if (!this.speechEnabled) return;
    if (typeof window === 'undefined') return;

    this.stopSpeech();

    const cleanText = text.trim();
    if (!cleanText) return;

    // First attempt: Try natural Vietnamese female audio stream via /api/tts
    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
    const directGoogleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodeURIComponent(cleanText)}`;

    const audio = new Audio();
    this.currentAudio = audio;

    let hasStartedPlaying = false;

    audio.onplay = () => {
      hasStartedPlaying = true;
    };

    // If /api/tts fails or network is blocked, try direct Google TTS or Web Speech API
    audio.onerror = () => {
      if (!hasStartedPlaying) {
        // Try fallback to direct Google TTS link
        const fallbackAudio = new Audio(directGoogleUrl);
        this.currentAudio = fallbackAudio;

        fallbackAudio.onerror = () => {
          // Final fallback: Use browser's Web Speech API ONLY IF genuine Vietnamese voice exists
          this.speakWebSpeechFallback(cleanText);
        };

        fallbackAudio.play().catch(() => {
          this.speakWebSpeechFallback(cleanText);
        });
      }
    };

    audio.src = ttsUrl;
    audio.play().catch(() => {
      // If autoplay or fetch is blocked, try direct link or speech synthesis
      const fallbackAudio = new Audio(directGoogleUrl);
      this.currentAudio = fallbackAudio;
      fallbackAudio.play().catch(() => {
        this.speakWebSpeechFallback(cleanText);
      });
    });
  }

  // Browser speech synthesis fallback - STRICTLY Vietnamese only!
  private speakWebSpeechFallback(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      this.initVoices();
      
      // CRITICAL CHECK: If NO Vietnamese voice is installed on user's machine,
      // DO NOT speak using the English default voice, as that causes English gibberish!
      if (!this.vietnameseVoice) {
        // Re-check voices in case onvoiceschanged just arrived
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang.startsWith('vi') || v.lang.includes('VIE'));
        if (!viVoice) {
          console.warn('No Vietnamese voice installed in browser; skipped to avoid English pronunciation.');
          return;
        }
        this.vietnameseVoice = viVoice;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.vietnameseVoice;
      utterance.lang = 'vi-VN';
      utterance.rate = 0.88; // clear preschool teacher pace
      utterance.pitch = 1.25; // sweet, cheerful female preschool tone

      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundEffects();
