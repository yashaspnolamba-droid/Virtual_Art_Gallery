/**
 * GalleryAudioEngine - Procedural Web Audio API Soundscape & Interactive FX
 * Zero external audio dependencies. 100% synthesized in real-time.
 */
class GalleryAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;
    this.ambientGain = null;
    this.masterGain = null;
    this.footstepStep = 0;
    this.lastFootstepTime = 0;
    this.activeAudioGuideNodes = [];
    this.isPlayingAudioGuide = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.startAmbientSoundscape();
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime + 0.1);
    }
    return this.isMuted;
  }

  /**
   * Continuous architectural museum ambient drone
   */
  startAmbientSoundscape() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Filtered resonant air hum
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);
    filter.Q.setValueAtTime(2, now);
    filter.connect(this.ambientGain);

    // Warm base chord (C2, G2, D3 detuned)
    const freqs = [65.41, 98.00, 146.83, 196.00];
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f + (Math.random() * 0.4 - 0.2), now);

      oscGain.gain.setValueAtTime(0.12 / freqs.length, now);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
    });

    // Slow atmospheric breathing LFO
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, now); // 12.5s cycle
    lfoGain.gain.setValueAtTime(40, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);
  }

  /**
   * Procedural footstep sound for walking on polished museum terrazzo
   */
  playFootstep() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    if (now - this.lastFootstepTime < 0.28) return; // Prevent machine-gun trigger
    this.lastFootstepTime = now;
    this.footstepStep++;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Alternate subtle pitch for left/right foot
    const baseFreq = this.footstepStep % 2 === 0 ? 95 : 108;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Distinct resonant acoustic chime when inspecting an artwork
   */
  playArtworkChime(soundType = 'celestial') {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const chords = {
      celestial: [523.25, 659.25, 783.99, 1046.50, 1318.51], // C5 Major9 ethereal
      geometric: [440.00, 554.37, 659.25, 830.61, 987.77],   // A Major7 sharp
      crystalline: [587.33, 739.99, 880.00, 1174.66, 1760.00], // D Lydian bell
      organic: [392.00, 493.88, 587.33, 783.99],             // G Major warm
      cyber: [329.63, 493.88, 622.25, 739.99, 987.77],      // E Phrygian modern
      sculpture: [261.63, 392.00, 523.25, 659.25, 1046.50]   // Deep fundamental resonant
    };

    const notes = chords[soundType] || chords.celestial;

    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const delay = index * 0.055; // Arpeggiated shimmer

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + delay);

      noteGain.gain.setValueAtTime(0.0001, now + delay);
      noteGain.gain.linearRampToValueAtTime(0.16 / notes.length, now + delay + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.8);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 1.9);
    });
  }

  /**
   * Curatorial Audio Guide playback simulation with harmonized synthesized phrase
   */
  startAudioGuide(soundType, onEndCallback) {
    if (!this.ctx) return;
    this.stopAudioGuide();
    this.isPlayingAudioGuide = true;

    const now = this.ctx.currentTime;
    const melodies = {
      celestial: [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 523.25],
      geometric: [220.00, 277.18, 329.63, 440.00, 554.37, 440.00, 329.63],
      crystalline: [293.66, 369.99, 440.00, 587.33, 739.99, 880.00, 587.33],
      organic: [196.00, 246.94, 293.66, 392.00, 493.88, 392.00, 293.66],
      cyber: [164.81, 246.94, 329.63, 493.88, 415.30, 329.63, 246.94],
      sculpture: [130.81, 196.00, 261.63, 392.00, 329.63, 261.63, 196.00]
    };

    const notes = melodies[soundType] || melodies.celestial;
    const noteDuration = 0.55;
    const totalTime = notes.length * noteDuration + 1.2;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * noteDuration;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 1.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + noteDuration * 1.5);
      this.activeAudioGuideNodes.push(osc);
    });

    this.audioGuideTimeout = setTimeout(() => {
      this.isPlayingAudioGuide = false;
      if (onEndCallback) onEndCallback();
    }, totalTime * 1000);
  }

  stopAudioGuide() {
    if (this.audioGuideTimeout) {
      clearTimeout(this.audioGuideTimeout);
      this.audioGuideTimeout = null;
    }
    this.activeAudioGuideNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    this.activeAudioGuideNodes = [];
    this.isPlayingAudioGuide = false;
  }
}

window.GalleryAudio = new GalleryAudioEngine();
