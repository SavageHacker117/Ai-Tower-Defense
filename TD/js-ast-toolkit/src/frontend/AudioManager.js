// Audio Manager System - Refactored as ES6 Module
export class AudioManager {
  constructor() {
    console.log("Calling method: constructor");
    // Audio context
    this.audioContext = null;
    this.masterGain = null;

    // Volume controls
    this.masterVolume = 0.7;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.8;
    this.isMuted = false;

    // Audio sources
    this.sounds = new Map();
    this.music = new Map();
    this.currentMusic = null;
    this.musicFadeInterval = null;

    // Audio pools for performance
    this.soundPools = new Map();
    this.maxPoolSize = 5;
    console.log('AudioManager initialized');
  }
  async init() {
    console.log("Calling method: init");
    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.masterVolume;

      // Load default sounds
      await this.loadDefaultSounds();
    } catch (error) {
      console.warn('Web Audio API not supported, falling back to HTML5 Audio:', error);
      this.initFallback();
    }
  }
  initFallback() {
    console.log("Calling method: initFallback");
    // Fallback to HTML5 Audio
    this.audioContext = null;
    console.log('Using HTML5 Audio fallback');
  }
  async loadDefaultSounds() {
    console.log("Calling method: loadDefaultSounds");
    // Define default sound effects
    const defaultSounds = {
      // UI Sounds
      'buttonClick': this.generateTone(800, 0.1, 'square'),
      'buttonHover': this.generateTone(600, 0.05, 'sine'),
      // Game Sounds
      'enemyDeath': this.generateExplosion(),
      'towerShoot': this.generateShot(),
      'towerPlace': this.generateTone(400, 0.2, 'triangle'),
      'baseDamage': this.generateAlarm(),
      'waveStart': this.generateFanfare(),
      'gameOver': this.generateGameOver(),
      'victory': this.generateVictory(),
      // Projectile Sounds
      'bulletHit': this.generateTone(300, 0.1, 'sawtooth'),
      'laserShoot': this.generateLaser(),
      'missileExplode': this.generateExplosion(),
      'freezeEffect': this.generateFreeze(),
      // Enemy Sounds
      'enemySpawn': this.generateTone(200, 0.3, 'sine'),
      'bossAppear': this.generateBossIntro()
    };

    // Generate and store sounds
    for (const [name, generator] of Object.entries(defaultSounds)) {
      try {
        const audioBuffer = await generator;
        this.sounds.set(name, audioBuffer);
        this.createSoundPool(name);
      } catch (error) {
        console.warn(`Failed to generate sound '${name}':`, error);
      }
    }
  }

  // Sound generation methods
  generateTone(frequency, duration, waveType = 'sine') {
    console.log("Calling method: generateTone");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        let sample = 0;
        switch (waveType) {
          case 'sine':
            sample = Math.sin(2 * Math.PI * frequency * t);
            break;
          case 'square':
            sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
            break;
          case 'triangle':
            sample = 2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1;
            break;
          case 'sawtooth':
            sample = 2 * (frequency * t - Math.floor(frequency * t + 0.5));
            break;
        }

        // Apply envelope
        const envelope = Math.exp(-t * 5); // Exponential decay
        channelData[i] = sample * envelope * 0.3;
      }
      resolve(audioBuffer);
    });
  }
  generateExplosion() {
    console.log("Calling method: generateExplosion");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 0.5;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const noise = Math.random() * 2 - 1;
        const envelope = Math.exp(-t * 8);
        const lowFreq = Math.sin(2 * Math.PI * 60 * t);
        channelData[i] = (noise * 0.7 + lowFreq * 0.3) * envelope * 0.4;
      }
      resolve(audioBuffer);
    });
  }
  generateShot() {
    console.log("Calling method: generateShot");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 0.1;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const noise = Math.random() * 2 - 1;
        const tone = Math.sin(2 * Math.PI * 1000 * t);
        const envelope = Math.exp(-t * 20);
        channelData[i] = (noise * 0.5 + tone * 0.5) * envelope * 0.3;
      }
      resolve(audioBuffer);
    });
  }
  generateLaser() {
    console.log("Calling method: generateLaser");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 0.2;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const freq = 2000 - t * 1500; // Frequency sweep down
        const sample = Math.sin(2 * Math.PI * freq * t);
        const envelope = Math.exp(-t * 3);
        channelData[i] = sample * envelope * 0.3;
      }
      resolve(audioBuffer);
    });
  }
  generateFreeze() {
    console.log("Calling method: generateFreeze");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 0.3;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const freq = 400 + Math.sin(t * 20) * 100; // Vibrato effect
        const sample = Math.sin(2 * Math.PI * freq * t);
        const envelope = 1 - t / duration; // Linear fade

        channelData[i] = sample * envelope * 0.2;
      }
      resolve(audioBuffer);
    });
  }
  generateAlarm() {
    console.log("Calling method: generateAlarm");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 1.0;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const freq = Math.sin(t * 8) > 0 ? 800 : 400; // Alternating frequencies
        const sample = Math.sin(2 * Math.PI * freq * t);
        const envelope = Math.sin(t * Math.PI * 4) * 0.5 + 0.5; // Pulsing

        channelData[i] = sample * envelope * 0.4;
      }
      resolve(audioBuffer);
    });
  }
  generateFanfare() {
    console.log("Calling method: generateFanfare");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 1.5;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      const notes = [440, 554, 659, 880]; // A, C#, E, A (major chord)

      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        let sample = 0;

        // Play chord
        notes.forEach(function (freq) {
          sample += Math.sin(2 * Math.PI * freq * t) * 0.25;
        });
        const envelope = Math.exp(-t * 2);
        channelData[i] = sample * envelope * 0.3;
      }
      resolve(audioBuffer);
    });
  }
  generateGameOver() {
    console.log("Calling method: generateGameOver");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 2.0;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const freq = 220 - t * 100; // Descending tone
        const sample = Math.sin(2 * Math.PI * freq * t);
        const envelope = Math.exp(-t * 1);
        channelData[i] = sample * envelope * 0.4;
      }
      resolve(audioBuffer);
    });
  }
  generateVictory() {
    console.log("Calling method: generateVictory");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 2.0;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      const melody = [440, 494, 554, 659, 740, 831, 880]; // Rising scale

      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const noteIndex = Math.floor(t * 3.5) % melody.length;
        const freq = melody[noteIndex];
        const sample = Math.sin(2 * Math.PI * freq * t);
        const envelope = Math.sin(t * Math.PI / duration);
        channelData[i] = sample * envelope * 0.3;
      }
      resolve(audioBuffer);
    });
  }
  generateBossIntro() {
    console.log("Calling method: generateBossIntro");
    if (!this.audioContext) return Promise.resolve(null);
    return new Promise(function (resolve) {
      const duration = 3.0;
      const sampleRate = this.audioContext.sampleRate;
      const frameCount = sampleRate * duration;
      const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const lowFreq = Math.sin(2 * Math.PI * 55 * t); // Low bass
        const midFreq = Math.sin(2 * Math.PI * 110 * t * (1 + Math.sin(t * 2)));
        const noise = (Math.random() * 2 - 1) * 0.1;
        const envelope = Math.min(1, t * 2) * (1 - Math.max(0, (t - 2.5) * 2));
        channelData[i] = (lowFreq * 0.6 + midFreq * 0.3 + noise) * envelope * 0.5;
      }
      resolve(audioBuffer);
    });
  }

  // Sound pool management
  createSoundPool(soundName) {
    console.log("Calling method: createSoundPool");
    if (!this.sounds.has(soundName)) return;
    const pool = [];
    for (let i = 0; i < this.maxPoolSize; i++) {
      pool.push({
        inUse: false,
        source: null
      });
    }
    this.soundPools.set(soundName, pool);
  }
  getAvailableSource(soundName) {
    console.log("Calling method: getAvailableSource");
    const pool = this.soundPools.get(soundName);
    if (!pool) return null;

    // Find available source
    for (const poolItem of pool) {
      if (!poolItem.inUse) {
        return poolItem;
      }
    }

    // If no available source, use the first one (interrupt)
    return pool[0];
  }

  // Public sound methods
  playSound(soundName, volume = 1.0, pitch = 1.0) {
    console.log("Calling method: playSound");
    if (this.isMuted || !this.sounds.has(soundName)) return;
    try {
      if (this.audioContext) {
        this.playWebAudioSound(soundName, volume, pitch);
      } else {
        this.playHTML5Sound(soundName, volume, pitch);
      }
    } catch (error) {
      console.warn(`Failed to play sound '${soundName}':`, error);
    }
  }
  playWebAudioSound(soundName, volume, pitch) {
    console.log("Calling method: playWebAudioSound");
    const audioBuffer = this.sounds.get(soundName);
    if (!audioBuffer) return;
    const poolItem = this.getAvailableSource(soundName);
    if (!poolItem) return;

    // Stop previous sound if playing
    if (poolItem.source) {
      poolItem.source.stop();
    }

    // Create new source
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    source.buffer = audioBuffer;
    source.playbackRate.value = pitch;
    gainNode.gain.value = volume * this.sfxVolume;
    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Mark as in use
    poolItem.inUse = true;
    poolItem.source = source;

    // Clean up when finished
    source.onended = function () {
      poolItem.inUse = false;
      poolItem.source = null;
    };
    source.start();
  }
  playHTML5Sound(soundName, volume, pitch) {
    console.log("Calling method: playHTML5Sound");
    // Fallback implementation using HTML5 Audio
    // This is a simplified version
    console.log(`Playing sound: ${soundName} (HTML5 fallback)`);
  }

  // Background music methods
  playBackgroundMusic(musicName = 'default', fadeIn = true) {
    console.log("Calling method: playBackgroundMusic");
    if (this.isMuted) return;

    // Stop current music
    this.stopBackgroundMusic(fadeIn);

    // Start new music
    setTimeout(function () {
      this.currentMusic = this.createMusicLoop();
      if (fadeIn) {
        this.fadeInMusic();
      }
    }, fadeIn ? 500 : 0);
  }
  stopBackgroundMusic(fadeOut = true) {
    console.log("Calling method: stopBackgroundMusic");
    if (!this.currentMusic) return;
    if (fadeOut) {
      this.fadeOutMusic();
    } else {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }
  createMusicLoop() {
    console.log("Calling method: createMusicLoop");
    if (!this.audioContext) return null;

    // Create a simple ambient music loop
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    oscillator.type = 'sine';
    oscillator.frequency.value = 220;
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    gainNode.gain.value = this.musicVolume * 0.1;
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    oscillator.start();
    return oscillator;
  }
  fadeInMusic() {
    console.log("Calling method: fadeInMusic");
    if (!this.currentMusic || !this.audioContext) return;
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.linearRampToValueAtTime(this.musicVolume * 0.1, this.audioContext.currentTime + 2);
  }
  fadeOutMusic() {
    console.log("Calling method: fadeOutMusic");
    if (!this.currentMusic || !this.audioContext) return;
    this.musicFadeInterval = setInterval(function () {
      // Simplified fade out
      setTimeout(function () {
        if (this.currentMusic) {
          this.currentMusic.stop();
          this.currentMusic = null;
        }
      }, 1000);
      clearInterval(this.musicFadeInterval);
    }, 100);
  }

  // Volume controls
  setMasterVolume(volume) {
    console.log("Calling method: setMasterVolume");
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }
  setMusicVolume(volume) {
    console.log("Calling method: setMusicVolume");
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }
  setSFXVolume(volume) {
    console.log("Calling method: setSFXVolume");
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
  mute() {
    console.log("Calling method: mute");
    this.isMuted = true;
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
  }
  unmute() {
    console.log("Calling method: unmute");
    this.isMuted = false;
    if (this.masterGain) {
      this.masterGain.gain.value = this.masterVolume;
    }
  }
  toggleMute() {
    console.log("Calling method: toggleMute");
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  // Getters
  getMasterVolume() {
    console.log("Calling method: getMasterVolume");
    return this.masterVolume;
  }
  getMusicVolume() {
    console.log("Calling method: getMusicVolume");
    return this.musicVolume;
  }
  getSFXVolume() {
    console.log("Calling method: getSFXVolume");
    return this.sfxVolume;
  }
  isMusicPlaying() {
    console.log("Calling method: isMusicPlaying");
    return this.currentMusic !== null;
  }

  // Cleanup
  dispose() {
    console.log("Calling method: dispose");
    this.stopBackgroundMusic(false);
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.sounds.clear();
    this.soundPools.clear();
  }
}