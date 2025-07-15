/**
 * 🎵 Advanced AI Music Generator Engine v2.0 - Simplified
 * Professional-grade music composition with AI intelligence
 */

class AdvancedMusicGeneratorEngine {
  constructor() {
    // Advanced AI Music Generator Engine v2.0 - Silent initialization
    
    this.instruments = {};
    this.isInitialized = false;
    this.composition = null;
    this.effects = {};
    this.generationHistory = [];
    
    // AI composition parameters
    this.creativity = 0.8;
    this.harmonicComplexity = 0.75;
    this.rhythmicVariation = 0.85;
    this.emotionalIntelligence = 0.9;
    
    this.initializeAIComposition();
    
    console.log('🔧 Tone.js version:', Tone.version || 'Unknown');
    this.initializeAdvancedEngine();
  }

  async initializeAdvancedEngine() {
    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      this.initializeAIComposition();
      this.initializeAdvancedEffects();
      await this.loadSimpleInstruments();
      
      this.isInitialized = true;
      console.log('✅ Advanced AI Music Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Engine initialization failed:', error);
      this.createEmergencyInstrument();
      this.isInitialized = true;
    }
  }

  // Simplified and reliable instrument loading
  async loadSimpleInstruments() {
    console.log('🎵 Loading instruments...');
    
    try {
      this.instruments = {
        piano: new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.8 }
        }).toDestination(),
        
        lead: new Tone.Synth({
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.4 }
        }).toDestination(),
        
        pad: new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.8, decay: 0.5, sustain: 0.9, release: 2 }
        }).toDestination(),
        
        bass: new Tone.Synth({
          oscillator: { type: 'square' },
          envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.2 }
        }).toDestination(),
      };
      
      this.instruments.synthPad = this.instruments.pad;
      this.instruments.emergency = this.instruments.piano;
      
      this.createSimpleDrumKit();
      
      console.log('✅ All instruments loaded successfully');
      
    } catch (error) {
      console.error('❌ Instrument loading failed:', error);
      this.createEmergencyInstrument();
    }
  }

  createSimpleDrumKit() {
    try {
      this.instruments.kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
      }).toDestination();

      this.instruments.snare = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
      }).toDestination();

      this.instruments.hihat = new Tone.MetalSynth({
        frequency: 200,
        envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      }).toDestination();

      this.instruments.tom = new Tone.MembraneSynth({
        pitchDecay: 0.008,
        octaves: 4,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.006, decay: 0.5, sustain: 0 }
      }).toDestination();

    } catch (error) {
      console.warn('⚠️ Drum kit creation failed:', error.message);
    }
  }

  createEmergencyInstrument() {
    console.log('🚨 Creating emergency fallback instrument...');
    try {
      const emergency = new Tone.Synth().toDestination();
      this.instruments = {
        piano: emergency,
        lead: emergency,
        bass: emergency,
        pad: emergency,
        synthPad: emergency,
        emergency: emergency,
        kick: emergency,
        snare: emergency,
        hihat: emergency,
        tom: emergency
      };
    } catch (error) {
      console.error('❌ Emergency instrument creation failed:', error);
    }
  }

  initializeAdvancedEffects() {
    // Advanced effects initialized silently
    
    try {
      this.effects = {
        reverb: new Tone.Reverb({
          decay: 2,
          wet: 0.1
        }).toDestination(),
        
        delay: new Tone.PingPongDelay({
          delayTime: '8n',
          feedback: 0.3,
          wet: 0.2
        }).toDestination(),
        
        compressor: new Tone.Compressor({
          threshold: -20,
          ratio: 8,
          attack: 0.003,
          release: 0.1
        }).toDestination()
      };
      
      console.log('✅ Advanced effects initialized');
    } catch (error) {
      console.warn('⚠️ Effects initialization failed:', error.message);
      this.effects = {};
    }
  }

  initializeAIComposition() {
    // AI composition intelligence initialized silently
    
    this.scaleTemplates = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      pentatonic: [0, 2, 4, 7, 9]
    };

    this.chordProgressions = {
      pop: ['I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV'],
      jazz: ['IImaj7', 'V7', 'Imaj7', 'VImaj7', 'IImaj7', 'V7', 'Imaj7', 'Imaj7'],
      rock: ['I', 'VII', 'IV', 'I', 'I', 'VII', 'IV', 'I'],
      blues: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'],
      electronic: ['i', 'VII', 'VI', 'VII', 'i', 'VII', 'VI', 'VII']
    };

    this.rhythmPatterns = {
      pop: {
        kick: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
        snare: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      },
      rock: {
        kick: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        snare: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
      },
      electronic: {
        kick: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        snare: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        hihat: [1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1]
      }
    };
  }

  // Main composition generation method
  async generateAdvancedComposition(options = {}) {
    console.log('🤖 Generating advanced AI composition...');
    
    const config = {
      genre: options.genre || 'pop',
      mood: options.mood || 'happy',
      tempo: options.tempo || this.generateIntelligentTempo(options.genre, options.mood),
      length: options.length || 16,
      complexity: options.complexity || 0.7,
      creativity: options.creativity || this.creativity,
      key: options.key || null,
      reverb: options.reverb || 0.1
    };

    try {
      const key = this.selectIntelligentKey(config.genre, config.mood, config.key);
      console.log(`🎼 AI selected key: ${key} for ${config.genre}/${config.mood}`);

      const composition = await this.createAIComposition(config, key);
      
      this.composition = composition;
      this.generationHistory.push({
        config,
        composition,
        timestamp: Date.now()
      });

      console.log('🎼 Scheduling advanced playback...');
      await this.scheduleAdvancedPlayback(composition, config);

      console.log('✅ Advanced AI composition completed');
      return composition;

    } catch (error) {
      console.error('❌ Composition generation failed:', error);
      throw error;
    }
  }

  selectIntelligentKey(genre, mood, requestedKey) {
    if (requestedKey) return requestedKey;

    const keyMappings = {
      happy: ['C major', 'G major', 'D major', 'A major'],
      sad: ['A minor', 'D minor', 'E minor', 'B minor'],
      energetic: ['E major', 'B major', 'F# major'],
      calm: ['F major', 'Bb major', 'Eb major'],
      dark: ['F# minor', 'C# minor', 'G# minor'],
      nostalgic: ['Am', 'Dm', 'Em']
    };

    const possibleKeys = keyMappings[mood] || keyMappings.happy;
    return possibleKeys[Math.floor(Math.random() * possibleKeys.length)];
  }

  generateIntelligentTempo(genre, mood) {
    const tempoMap = {
      pop: { happy: 120, sad: 80, energetic: 128, calm: 90 },
      rock: { happy: 140, sad: 70, energetic: 160, calm: 100 },
      electronic: { happy: 128, sad: 90, energetic: 140, calm: 110 },
      jazz: { happy: 120, sad: 70, energetic: 140, calm: 80 }
    };

    const genreTempos = tempoMap[genre] || tempoMap.pop;
    return genreTempos[mood] || 120;
  }

  async createAIComposition(config, key) {
    console.log('🎵 Creating AI-enhanced musical composition...');

    const chordProgression = this.generateAdvancedChordProgression(
      config.genre, config.mood, config.length, key, config.creativity
    );

    const melody = this.generateAdvancedMelody(
      chordProgression, key, config.genre, config.mood, config.creativity
    );

    const bassline = this.generateDynamicBassline(
      chordProgression, key, config.complexity
    );

    const harmonyLayers = this.generateHarmonyLayers(
      chordProgression, key, config.genre, config.complexity
    );

    const drums = this.generateProfessionalDrums(
      config.genre, config.mood, config.length, config.tempo
    );

    return {
      key,
      tempo: config.tempo,
      chordProgression,
      melody,
      bassline,
      harmonyLayers,
      drums,
      effects: {
        reverb: config.reverb
      }
    };
  }

  generateAdvancedChordProgression(genre, mood, length, key, creativity) {
    console.log(`🎼 Generating advanced chord progression for ${genre}/${mood}`);
    
    const template = this.chordProgressions[genre] || this.chordProgressions.pop;
    const progression = [];

    for (let i = 0; i < length; i++) {
      const baseChord = template[i % template.length];
      const chord = this.addCreativeVariation(baseChord, creativity, mood);
      progression.push(chord);
    }

    console.log(`🎵 Generated progression: ${progression.join(' - ')}`);
    return progression;
  }

  addCreativeVariation(chord, creativity, mood) {
    if (Math.random() > creativity) return chord;

    const variations = {
      'I': ['Imaj7', 'Iadd9', 'I6'],
      'IV': ['IVmaj7', 'IVadd9', 'IV6'],
      'V': ['V7', 'Vsus4', 'V9'],
      'vi': ['vi7', 'viadd9', 'vi6'],
      'ii': ['ii7', 'iim7', 'ii9']
    };

    const chordVariations = variations[chord];
    if (chordVariations && Math.random() < 0.3) {
      return chordVariations[Math.floor(Math.random() * chordVariations.length)];
    }

    return chord;
  }

  generateAdvancedMelody(chordProgression, key, genre, mood, creativity) {
    console.log('🎵 Generating advanced AI melody...');
    
    const scale = this.getScaleNotes(key);
    const melody = [];
    let currentOctave = 4;
    let previousNote = scale[0];

    for (let i = 0; i < chordProgression.length * 5; i++) {
      const chordIndex = Math.floor(i / 5);
      const chord = chordProgression[chordIndex];
      const chordTones = this.getChordTones(chord, scale);

      let note;
      const useChordTone = Math.random() < 0.7;
      
      if (useChordTone && chordTones.length > 0) {
        note = chordTones[Math.floor(Math.random() * chordTones.length)];
      } else {
        note = scale[Math.floor(Math.random() * scale.length)];
      }

      const interval = Math.abs(this.getNoteValue(note) - this.getNoteValue(previousNote));
      if (interval > 7 && Math.random() < 0.6) {
        currentOctave += Math.random() < 0.5 ? -1 : 1;
        currentOctave = Math.max(3, Math.min(6, currentOctave));
      }

      melody.push({
        note: note + currentOctave,
        time: i * 0.25,
        duration: '8n',
        velocity: 0.6 + Math.random() * 0.3
      });

      previousNote = note;
    }

    console.log(`🎵 Generated advanced melody with ${melody.length} notes`);
    return melody;
  }

  generateDynamicBassline(chordProgression, key, complexity) {
    console.log('🎸 Creating dynamic bassline...');
    
    const scale = this.getScaleNotes(key);
    const bassline = [];

    chordProgression.forEach((chord, index) => {
      const root = this.getChordRoot(chord, scale);
      const time = index * 1.0;

      bassline.push({
        note: root + '2',
        time: time,
        duration: '4n',
        velocity: 0.8
      });

      if (complexity > 0.5 && Math.random() < complexity) {
        const fifth = this.getFifth(root, scale);
        bassline.push({
          note: fifth + '2',
          time: time + 0.5,
          duration: '8n',
          velocity: 0.6
        });
      }
    });

    console.log(`🎸 Generated bassline with ${bassline.length} notes`);
    return bassline;
  }

  generateHarmonyLayers(chordProgression, key, genre, complexity) {
    console.log('🎼 Creating harmony layers...');
    
    const scale = this.getScaleNotes(key);
    const harmonyLayers = [];

    chordProgression.forEach((chord, index) => {
      const chordTones = this.getChordTones(chord, scale);
      const time = index * 1.0;

      if (chordTones.length >= 3) {
        harmonyLayers.push({
          notes: [
            chordTones[0] + '4',
            chordTones[1] + '4',
            chordTones[2] + '4'
          ],
          time: time,
          duration: '2n',
          velocity: 0.4
        });
      }
    });

    console.log('🎼 Generated rich harmony layers');
    return harmonyLayers;
  }

  generateProfessionalDrums(genre, mood, length, tempo) {
    console.log(`🥁 Creating professional drum pattern for ${genre}`);
    
    const pattern = this.rhythmPatterns[genre] || this.rhythmPatterns.pop;
    const drums = [];
    const beatsPerMeasure = 16;

    for (let measure = 0; measure < length; measure++) {
      for (let beat = 0; beat < beatsPerMeasure; beat++) {
        const time = measure * 4 + (beat * 0.25);

        if (pattern.kick[beat]) {
          drums.push({
            instrument: 'kick',
            time: time,
            velocity: 0.8 + Math.random() * 0.2
          });
        }

        if (pattern.snare[beat]) {
          drums.push({
            instrument: 'snare',
            time: time,
            velocity: 0.7 + Math.random() * 0.2
          });
        }

        if (pattern.hihat[beat]) {
          drums.push({
            instrument: 'hihat',
            time: time,
            velocity: 0.5 + Math.random() * 0.3
          });
        }

        if (Math.random() < 0.1) {
          drums.push({
            instrument: 'tom',
            time: time,
            velocity: 0.6 + Math.random() * 0.2
          });
        }
      }
    }

    console.log(`🥁 Generated ${drums.length} drum events`);
    return drums;
  }

  async scheduleAdvancedPlayback(composition, config) {
    Tone.Transport.cancel();
    Tone.Transport.bpm.value = composition.tempo;

    if (config.reverb && this.effects.reverb) {
      this.effects.reverb.wet.value = config.reverb;
    }

    this.scheduleMelody(composition.melody);
    this.scheduleBass(composition.bassline);
    this.scheduleHarmonyLayers(composition.harmonyLayers);
    this.scheduleDrums(composition.drums);

    Tone.Transport.start();
    console.log('▶️ Advanced composition playback started');
  }

  scheduleMelody(melody) {
    melody.forEach(note => {
      Tone.Transport.schedule((time) => {
        const instrument = this.getInstrument('lead');
        if (instrument) {
          instrument.triggerAttackRelease(note.note, note.duration, time, note.velocity);
        }
      }, note.time);
    });
  }

  scheduleBass(bassline) {
    bassline.forEach(note => {
      Tone.Transport.schedule((time) => {
        const instrument = this.getInstrument('bass');
        if (instrument) {
          instrument.triggerAttackRelease(note.note, note.duration, time, note.velocity);
        }
      }, note.time);
    });
  }

  scheduleHarmonyLayers(harmonyLayers) {
    harmonyLayers.forEach(layer => {
      Tone.Transport.schedule((time) => {
        const instrument = this.getInstrument('synthPad');
        if (instrument && layer.notes) {
          layer.notes.forEach((note, index) => {
            setTimeout(() => {
              instrument.triggerAttackRelease(note, layer.duration, time, layer.velocity);
            }, index * 10);
          });
        }
      }, layer.time);
    });
  }

  scheduleDrums(drums) {
    drums.forEach(drum => {
      Tone.Transport.schedule((time) => {
        const instrument = this.getInstrument(drum.instrument);
        if (instrument) {
          if (drum.instrument === 'kick') {
            instrument.triggerAttackRelease('C1', '8n', time, drum.velocity);
          } else if (drum.instrument === 'snare') {
            instrument.triggerAttackRelease(time, drum.velocity);
          } else if (drum.instrument === 'hihat') {
            instrument.triggerAttackRelease('C5', '16n', time, drum.velocity);
          } else if (drum.instrument === 'tom') {
            instrument.triggerAttackRelease('C3', '8n', time, drum.velocity);
          }
        }
      }, drum.time);
    });
  }

  // Utility methods
  getInstrument(instrumentName) {
    if (!instrumentName) return null;
    
    const instrument = this.instruments[instrumentName];
    if (instrument) {
      return instrument;
    }
    
    return this.instruments.emergency || null;
  }

  getScaleNotes(key) {
    const noteMap = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
      'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyNote = key.split(' ')[0];
    const isMinor = key.includes('minor') || key.includes('m');
    
    const rootIndex = noteMap[keyNote] || 0;
    const scalePattern = isMinor ? this.scaleTemplates.minor : this.scaleTemplates.major;
    
    return scalePattern.map(interval => notes[(rootIndex + interval) % 12]);
  }

  getChordTones(chord, scale) {
    const chordRoot = chord.replace(/[^A-G#b]/g, '');
    const rootIndex = scale.indexOf(chordRoot) !== -1 ? scale.indexOf(chordRoot) : 0;
    
    return [
      scale[rootIndex],
      scale[(rootIndex + 2) % scale.length],
      scale[(rootIndex + 4) % scale.length]
    ];
  }

  getChordRoot(chord, scale) {
    const chordRoot = chord.replace(/[^A-G#b]/g, '');
    return scale.indexOf(chordRoot) !== -1 ? chordRoot : scale[0];
  }

  getFifth(root, scale) {
    const rootIndex = scale.indexOf(root);
    return scale[(rootIndex + 4) % scale.length];
  }

  getNoteValue(note) {
    const noteMap = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
    return noteMap[note] || 0;
  }

  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    console.log('⏹️ Playback stopped');
  }

  async playFromHistory(index) {
    if (this.generationHistory[index]) {
      const { composition, config } = this.generationHistory[index];
      await this.scheduleAdvancedPlayback(composition, config);
    }
  }
}

// Global initialization
window.musicGenerator = new AdvancedMusicGeneratorEngine();
console.log('🎵 Advanced AI Music Generator Engine v2.0 loaded and ready!');
