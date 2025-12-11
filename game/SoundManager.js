// Sound Manager - Handles all audio (music and sound effects)
export class SoundManager {
  constructor() {
    this.sounds = {};
    this.music = {};
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.currentMusic = null;
    
    this.loadSettings();
    this.initializeSounds();
  }
  
  loadSettings() {
    const savedMusicVolume = localStorage.getItem('musicVolume');
    const savedSfxVolume = localStorage.getItem('sfxVolume');
    const savedMusicEnabled = localStorage.getItem('musicEnabled');
    const savedSfxEnabled = localStorage.getItem('sfxEnabled');
    
    if (savedMusicVolume !== null) this.musicVolume = parseFloat(savedMusicVolume);
    if (savedSfxVolume !== null) this.sfxVolume = parseFloat(savedSfxVolume);
    if (savedMusicEnabled !== null) this.musicEnabled = savedMusicEnabled === 'true';
    if (savedSfxEnabled !== null) this.sfxEnabled = savedSfxEnabled === 'true';
  }
  
  saveSettings() {
    localStorage.setItem('musicVolume', this.musicVolume.toString());
    localStorage.setItem('sfxVolume', this.sfxVolume.toString());
    localStorage.setItem('musicEnabled', this.musicEnabled.toString());
    localStorage.setItem('sfxEnabled', this.sfxEnabled.toString());
  }
  
  initializeSounds() {
    // Using Web Audio API to generate sounds procedurally
    // This avoids needing external audio files
    
    this.audioContext = null;
    
    // Initialize on first user interaction (browser requirement)
    this.initialized = false;
  }
  
  // Initialize audio context on first user interaction
  initAudioContext() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
      console.log('Audio context initialized');
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }
  
  // Generate a simple tone
  playTone(frequency, duration, volume = 1.0, type = 'sine') {
    if (!this.sfxEnabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }
  
  // Play UI click sound
  playClick() {
    this.initAudioContext();
    this.playTone(800, 0.1, 0.3, 'square');
  }
  
  // Play card select sound
  playCardSelect() {
    this.initAudioContext();
    this.playTone(600, 0.15, 0.4, 'sine');
  }
  
  // Play unit deploy sound
  playDeploy() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Multi-tone deployment sound
    this.playTone(400, 0.2, 0.5, 'sawtooth');
    setTimeout(() => this.playTone(500, 0.15, 0.4, 'sine'), 50);
  }
  
  // Play attack sound
  playAttack() {
    this.initAudioContext();
    this.playTone(300, 0.1, 0.3, 'square');
  }
  
  // Play damage/hit sound
  playHit() {
    this.initAudioContext();
    this.playTone(200, 0.08, 0.4, 'sawtooth');
  }
  
  // Play tower destroyed sound
  playTowerDestroyed() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Descending explosion sound
    this.playTone(500, 0.3, 0.6, 'sawtooth');
    setTimeout(() => this.playTone(350, 0.25, 0.5, 'square'), 100);
    setTimeout(() => this.playTone(200, 0.2, 0.4, 'triangle'), 200);
  }
  
  // Play victory sound
  playVictory() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Ascending victory fanfare
    this.playTone(523, 0.2, 0.5, 'sine'); // C
    setTimeout(() => this.playTone(659, 0.2, 0.5, 'sine'), 150); // E
    setTimeout(() => this.playTone(784, 0.4, 0.6, 'sine'), 300); // G
  }
  
  // Play defeat sound
  playDefeat() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Descending sad trombone
    this.playTone(400, 0.3, 0.5, 'sawtooth');
    setTimeout(() => this.playTone(350, 0.3, 0.5, 'sawtooth'), 200);
    setTimeout(() => this.playTone(300, 0.5, 0.5, 'sawtooth'), 400);
  }
  
  // Play upgrade sound
  playUpgrade() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Ascending sparkle sound
    this.playTone(600, 0.1, 0.4, 'sine');
    setTimeout(() => this.playTone(800, 0.1, 0.4, 'sine'), 80);
    setTimeout(() => this.playTone(1000, 0.15, 0.5, 'sine'), 160);
  }
  
  // Play coin/gold sound
  playCoin() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    this.playTone(1200, 0.08, 0.4, 'sine');
    setTimeout(() => this.playTone(1400, 0.08, 0.4, 'sine'), 50);
  }
  
  // Play card reward sound
  playCardReward() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Magical reward sound
    this.playTone(800, 0.12, 0.4, 'triangle');
    setTimeout(() => this.playTone(1000, 0.12, 0.4, 'triangle'), 60);
    setTimeout(() => this.playTone(1200, 0.15, 0.5, 'triangle'), 120);
  }
  
  // Play matchmaking found sound
  playMatchFound() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    this.playTone(700, 0.15, 0.5, 'square');
    setTimeout(() => this.playTone(900, 0.2, 0.6, 'square'), 150);
  }
  
  // Play battle start countdown sound
  playCountdown() {
    this.initAudioContext();
    this.playTone(800, 0.2, 0.5, 'sine');
  }
  
  // Play heal sound
  playHeal() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Gentle healing sound
    this.playTone(600, 0.15, 0.3, 'sine');
    setTimeout(() => this.playTone(700, 0.15, 0.3, 'sine'), 70);
  }
  
  // Play Bonkhouse Legendary Strike sound - EPIC!
  playLegendaryStrike() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Epic 4-layer legendary ability sound effect
    
    // Layer 1: Deep power-up rumble (sawtooth for gritty power)
    this.playTone(80, 0.6, 0.7, 'sawtooth');
    setTimeout(() => this.playTone(100, 0.5, 0.6, 'sawtooth'), 100);
    
    // Layer 2: Rising energy charge (triangle for magical quality)
    setTimeout(() => {
      this.playTone(300, 0.15, 0.5, 'triangle');
      setTimeout(() => this.playTone(400, 0.15, 0.5, 'triangle'), 80);
      setTimeout(() => this.playTone(500, 0.15, 0.5, 'triangle'), 160);
      setTimeout(() => this.playTone(600, 0.15, 0.5, 'triangle'), 240);
    }, 50);
    
    // Layer 3: Massive impact/explosion (square for harsh power)
    setTimeout(() => {
      this.playTone(150, 0.4, 0.8, 'square');
      setTimeout(() => this.playTone(120, 0.35, 0.7, 'square'), 80);
      setTimeout(() => this.playTone(90, 0.3, 0.6, 'sawtooth'), 160);
    }, 400);
    
    // Layer 4: High-frequency legendary shimmer (sine for clean sparkle)
    setTimeout(() => {
      this.playTone(1200, 0.12, 0.4, 'sine');
      setTimeout(() => this.playTone(1400, 0.12, 0.4, 'sine'), 60);
      setTimeout(() => this.playTone(1600, 0.15, 0.45, 'sine'), 120);
      setTimeout(() => this.playTone(1800, 0.15, 0.45, 'sine'), 180);
      setTimeout(() => this.playTone(2000, 0.2, 0.5, 'sine'), 240);
    }, 420);
    
    // Layer 5: Echo/reverb effect with descending tones
    setTimeout(() => {
      this.playTone(400, 0.25, 0.3, 'triangle');
      setTimeout(() => this.playTone(350, 0.25, 0.25, 'triangle'), 150);
      setTimeout(() => this.playTone(300, 0.3, 0.2, 'triangle'), 300);
    }, 700);
  }
  
  // Play ability activation sound (for other abilities)
  playAbilityActivate() {
    this.initAudioContext();
    if (!this.sfxEnabled || !this.audioContext) return;
    
    // Epic ability activation sound
    this.playTone(400, 0.2, 0.5, 'triangle');
    setTimeout(() => this.playTone(600, 0.2, 0.5, 'triangle'), 100);
    setTimeout(() => this.playTone(800, 0.25, 0.6, 'sine'), 200);
  }
  
  // Background music using oscillators
  startMenuMusic() {
    if (!this.musicEnabled || !this.audioContext) return;
    this.stopMusic();
    
    // Simple ambient loop
    this.currentMusic = 'menu';
    this.playMenuLoop();
  }
  
  playMenuLoop() {
    if (this.currentMusic !== 'menu' || !this.musicEnabled) return;
    
    const notes = [523, 659, 784, 659]; // C, E, G, E
    const duration = 0.5;
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        if (this.currentMusic === 'menu' && this.musicEnabled && this.audioContext) {
          this.playTone(freq, duration, 0.1, 'sine');
        }
      }, index * 500);
    });
    
    // Loop
    setTimeout(() => this.playMenuLoop(), notes.length * 500);
  }
  
  startBattleMusic() {
    if (!this.musicEnabled || !this.audioContext) return;
    this.stopMusic();
    
    this.currentMusic = 'battle';
    this.playBattleLoop();
  }
  
  playBattleLoop() {
    if (this.currentMusic !== 'battle' || !this.musicEnabled) return;
    
    // More intense battle music
    const notes = [392, 523, 440, 523, 392, 466]; // G, C, A, C, G, A#
    const duration = 0.3;
    
    notes.forEach((freq, index) => {
      setTimeout(() => {
        if (this.currentMusic === 'battle' && this.musicEnabled && this.audioContext) {
          this.playTone(freq, duration, 0.08, 'square');
        }
      }, index * 300);
    });
    
    // Loop
    setTimeout(() => this.playBattleLoop(), notes.length * 300);
  }
  
  stopMusic() {
    this.currentMusic = null;
  }
  
  // Volume controls
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    this.saveSettings();
    
    if (!this.musicEnabled) {
      this.stopMusic();
    } else {
      // Restart current context music
      if (this.currentMusic === 'menu') {
        this.startMenuMusic();
      } else if (this.currentMusic === 'battle') {
        this.startBattleMusic();
      }
    }
    
    return this.musicEnabled;
  }
  
  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    this.saveSettings();
    return this.sfxEnabled;
  }
  
  getMusicVolume() {
    return this.musicVolume;
  }
  
  getSfxVolume() {
    return this.sfxVolume;
  }
  
  isMusicEnabled() {
    return this.musicEnabled;
  }
  
  isSfxEnabled() {
    return this.sfxEnabled;
  }
}
