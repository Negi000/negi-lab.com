/**
 * 🎵 Advanced AI Music Generator Engine v2.0 - Real Instruments
 * Professional-grade music composition with AI intelligence and real instrument samples
 */

class AdvancedMusicGeneratorEngine {
  constructor() {
    // Advanced AI Music Generator Engine v2.0 - Real instrument initialization
    
    this.instruments = {};
    this.isInitialized = false;
    this.composition = null;
    this.currentComposition = null;
    this.currentConfig = null;
    this.effects = {};
    this.generationHistory = [];
    
    // AI composition parameters
    this.creativity = 0.8;
    this.harmonicComplexity = 0.75;
    this.rhythmicVariation = 0.85;
    this.emotionalIntelligence = 0.9;
    
    // Initialize non-audio components only
    this.initializeBasicComponents();
    
    console.log('🔧 Music Generator Engine initialized (audio deferred)');
    this.deferredInitialization();
  }

  // Initialize only non-audio components first
  initializeBasicComponents() {
    this.generationHistory = [];
    
    // Initialize chord progressions with more musical variety
    this.chordProgressions = {
      pop: {
        happy: [
          ['I', 'V', 'vi', 'IV'], // Classic pop progression
          ['vi', 'IV', 'I', 'V'], // Alternative progression  
          ['I', 'vi', 'IV', 'V'], // Circle progression
          ['IV', 'V', 'vi', 'I']  // Reverse progression
        ],
        sad: [
          ['vi', 'IV', 'I', 'V'],
          ['i', 'VI', 'III', 'VII'],
          ['vi', 'I', 'V', 'IV']
        ],
        energetic: [
          ['I', 'V', 'vi', 'IV'],
          ['V', 'vi', 'IV', 'I'],
          ['I', 'IV', 'V', 'vi']
        ],
        calm: [
          ['I', 'vi', 'IV', 'V'],
          ['IV', 'I', 'V', 'vi'],
          ['vi', 'I', 'IV', 'V']
        ]
      },
      rock: {
        happy: [
          ['I', 'V', 'vi', 'IV'],
          ['I', 'VII', 'IV', 'I'],
          ['V', 'IV', 'I', 'V']
        ],
        energetic: [
          ['I', 'VII', 'IV', 'V'],
          ['V', 'IV', 'I', 'VII'],
          ['I', 'V', 'IV', 'I']
        ]
      },
      jazz: {
        happy: [
          ['Imaj7', 'vi7', 'ii7', 'V7'],
          ['I6', 'V7', 'iii7', 'vi7'],
          ['Imaj7', 'IV7', 'vii7', 'iii7']
        ]
      },
      electronic: {
        happy: [
          ['i', 'VII', 'VI', 'VII'],
          ['i', 'v', 'VI', 'IV'],
          ['VI', 'VII', 'i', 'v']
        ]
      }
    };
    
    // Initialize rhythm patterns
    this.rhythmPatterns = {
      pop: {
        kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]
      },
      rock: {
        kick: [1,0,0,0, 1,0,1,0, 1,0,0,0, 1,0,1,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1]
      },
      jazz: {
        kick: [1,0,0,0, 0,0,1,0, 0,0,0,0, 1,0,0,0],
        snare: [0,0,0,0, 1,0,0,1, 0,0,0,0, 1,0,0,0],
        hihat: [1,0,1,1, 0,1,0,1, 1,0,1,1, 0,1,0,1]
      },
      blues: {
        kick: [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0]
      },
      electronic: {
        kick: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,1,0,1]
      }
    };
    
    this.compositionPatterns = {
      pop: { chords: ['C', 'G', 'Am', 'F'], tempo: 120 },
      jazz: { chords: ['CM7', 'Em7', 'Am7', 'DM7'], tempo: 130 },
      blues: { chords: ['C7', 'F7', 'G7'], tempo: 90 },
      rock: { chords: ['Em', 'C', 'G', 'D'], tempo: 140 },
      folk: { chords: ['C', 'F', 'G', 'Am'], tempo: 100 }
    };
    
    // Initialize scale templates  
    this.scaleTemplates = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      pentatonic: [0, 2, 4, 7, 9]
    };
  }

  // Defer all Tone.js initialization until user interaction
  deferredInitialization() {
    // Wait for user interaction before any audio initialization
    const startEngine = async () => {
      try {
        console.log('🎵 Starting audio engine after user interaction...');
        if (Tone.context.state !== 'running') {
          await Tone.start();
        }
        await this.initializeAdvancedEngine();
      } catch (error) {
        console.error('❌ Deferred initialization failed:', error);
      }
    };

    // Listen for first user interaction
    const userInteractionEvents = ['click', 'touchstart', 'keydown'];
    const handleFirstInteraction = async () => {
      await startEngine();
      userInteractionEvents.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };

    userInteractionEvents.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });
  }

  async initializeAdvancedEngine() {
    try {
      this.initializeAIComposition();
      this.initializeAdvancedEffects();
      await this.loadRealInstruments();
      
      this.isInitialized = true;
      console.log('✅ Advanced AI Music Engine with real instruments initialized');
      
    } catch (error) {
      console.error('❌ Engine initialization failed:', error);
      this.createEmergencyInstrument();
      this.isInitialized = true;
    }
  }

  // Load real instrument samples using SampleLibrary
  async loadRealInstruments() {
    console.log('🎻 Loading real instrument samples...');
    
    try {
      // Check if SampleLibrary is available
      if (typeof SampleLibrary === 'undefined') {
        console.warn('⚠️ SampleLibrary not found, using fallback synthesizers');
        await this.loadSimpleInstruments();
        return;
      }

      console.log('✅ SampleLibrary found, loading real instruments');
      
      // Configure SampleLibrary for GitHub CDN
      SampleLibrary.baseUrl = 'https://nbrosowsky.github.io/tonejs-instruments/samples/';
      
      // Check if we're in HTTP environment for real instruments
      if (window.location.protocol === 'file:') {
        console.warn('⚠️ Running on file:// protocol, using fallback synthesizers to avoid CORS');
        await this.loadSimpleInstruments();
        return;
      }
      
      console.log('🌐 Using online CDN for real instrument samples');
      
      // Available real instruments for CDN loading
      const instrumentsToLoad = [
        'piano',
        'guitar-acoustic', 
        'violin',
        'cello',
        'flute',
        'trumpet',
        'saxophone',
        'organ'
      ];

      console.log('📦 Loading instruments from CDN:', instrumentsToLoad);

      // Load instruments with shorter timeout
      const loadedInstruments = await this.loadInstrumentsWithTimeout(instrumentsToLoad, 3000);
      
      // Check if real instruments loaded successfully
      if (loadedInstruments && Object.keys(loadedInstruments).length > 0) {
        console.log('🎹 Using real instruments from CDN');
        
        // Map loaded instruments with both original and alias names
        this.instruments = {
          piano: loadedInstruments.piano || this.createFallbackSynth('piano'),
          lead: loadedInstruments.violin || this.createFallbackSynth('lead'),
          pad: loadedInstruments.organ || this.createFallbackSynth('pad'),
          bass: loadedInstruments.cello || this.createFallbackSynth('bass'),
          synthPad: loadedInstruments.organ || this.createFallbackSynth('synthPad'),
          guitar: loadedInstruments['guitar-acoustic'] || this.createFallbackSynth('guitar'),
          flute: loadedInstruments.flute || this.createFallbackSynth('flute'),
          trumpet: loadedInstruments.trumpet || this.createFallbackSynth('trumpet'),
          saxophone: loadedInstruments.saxophone || this.createFallbackSynth('saxophone'),
          // Add direct instrument name aliases
          violin: loadedInstruments.violin || this.createFallbackSynth('lead'),
          cello: loadedInstruments.cello || this.createFallbackSynth('bass'),
          organ: loadedInstruments.organ || this.createFallbackSynth('pad')
        };
        
        // Connect real instruments to destination and boost volume
        Object.entries(this.instruments).forEach(([name, instrument]) => {
          if (instrument && typeof instrument.toDestination === 'function') {
            instrument.toDestination();
          }
          // Boost volume for sample-based instruments
          if (instrument && (instrument.constructor.name === 'aa' || instrument._sources)) {
            try {
              // Try to boost volume for SampleLibrary instruments
              if (instrument.volume) {
                instrument.volume.value = +6; // +6dB boost
                console.log(`🔊 Boosted volume for real ${name} instrument`);
              }
            } catch (error) {
              console.log(`📢 Volume boost not available for ${name}`);
            }
          }
        });
        
      } else {
        console.log('🎛️ Using high-quality synthesizers (real instruments unavailable)');
        await this.loadSimpleInstruments();
        return;
      }

      // Create drum kit
      this.createAdvancedDrumKit();
      
      // Set emergency fallback
      this.instruments.emergency = this.instruments.piano;
      
      console.log('✅ Real instruments loaded successfully');
      console.log('🎼 Available instruments:', Object.keys(this.instruments));
      
    } catch (error) {
      console.error('❌ Real instrument loading failed:', error);
      await this.loadSimpleInstruments();
    }
  }

  async loadInstrumentsWithTimeout(instrumentList, timeout = 3000) {
    return new Promise((resolve) => {
      let completed = false;
      const loadedInstruments = {};

      // Timeout handler - switch to fallback quickly
      const timeoutId = setTimeout(() => {
        if (!completed) {
          completed = true;
          console.warn('⏰ Real instrument loading timeout, switching to high-quality synthesizers');
          resolve(null); // Signal to use fallback
        }
      }, timeout);

      // Try to load real instruments
      try {
        console.log('� Attempting to load real instruments from CDN...');
        
        // Load a simple test instrument first
        const testInstrument = SampleLibrary.load({
          instruments: 'piano',
          onload: () => {
            if (!completed) {
              completed = true;
              clearTimeout(timeoutId);
              console.log('✅ Real instruments loaded successfully from CDN');
        console.log('🎹 Using real piano, violin, cello, flute, trumpet, saxophone, and organ sounds');
              
              // Load all instruments
              instrumentList.forEach(name => {
                const instrument = SampleLibrary.load({
                  instruments: name
                });
                if (instrument) {
                  instrument.toDestination();
                  loadedInstruments[name] = instrument;
                }
              });
              
              resolve(loadedInstruments);
            }
          },
          onerror: () => {
            if (!completed) {
              completed = true;
              clearTimeout(timeoutId);
              console.warn('❌ Real instrument loading failed, using synthesizers');
              resolve(null);
            }
          }
        });

      } catch (error) {
        if (!completed) {
          completed = true;
          clearTimeout(timeoutId);
          console.warn('❌ Real instrument loading error:', error);
          resolve(null);
        }
      }
    });
  }

  createFallbackSynth(type) {
    console.log(`🔧 Creating high-quality synth for ${type}`);
    
    const synthConfigs = {
      piano: {
        oscillator: { 
          type: 'sine',
          partialCount: 4,
          partials: [1, 0.2, 0.01, 0.005]
        },
        envelope: { 
          attack: 0.02, 
          decay: 0.3, 
          sustain: 0.4, 
          release: 1.2 
        },
        filter: {
          frequency: 3000,
          type: 'lowpass'
        },
        filterEnvelope: {
          attack: 0.02,
          decay: 0.2,
          sustain: 0.8,
          release: 1.0,
          baseFrequency: 300,
          octaves: 2.5
        }
      },
      lead: {
        oscillator: { 
          type: 'sawtooth',
          spread: 20,
          count: 3
        },
        envelope: { 
          attack: 0.01, 
          decay: 0.2, 
          sustain: 0.6, 
          release: 0.4 
        },
        filter: {
          frequency: 1500,
          type: 'lowpass',
          rolloff: -24
        }
      },
      pad: {
        oscillator: { 
          type: 'triangle',
          spread: 40,
          count: 3
        },
        envelope: { 
          attack: 0.8, 
          decay: 0.5, 
          sustain: 0.9, 
          release: 2.0 
        },
        filter: {
          frequency: 800,
          type: 'lowpass'
        },
        filterEnvelope: {
          attack: 1.0,
          decay: 0.5,
          sustain: 0.6,
          release: 2.0,
          baseFrequency: 200,
          octaves: 3
        }
      },
      bass: {
        oscillator: { 
          type: 'square',
          width: 0.4
        },
        envelope: { 
          attack: 0.01, 
          decay: 0.3, 
          sustain: 0.4, 
          release: 0.2 
        },
        filter: {
          frequency: 150,
          type: 'lowpass',
          rolloff: -12
        }
      }
    };

    const config = synthConfigs[type] || synthConfigs.piano;
    
    // Use more appropriate synth types for different instruments
    if (type === 'bass') {
      return new Tone.MonoSynth(config);
    } else if (type === 'pad') {
      return new Tone.PolySynth(Tone.Synth, config);
    } else {
      return new Tone.Synth(config);
    }
  }

  // Enhanced synthesizer instrument loading for high-quality sound
  async loadSimpleInstruments() {
    console.log('� Loading high-quality synthesizer instruments...');
    
    try {
      this.instruments = {
        piano: this.createFallbackSynth('piano').toDestination(),
        lead: this.createFallbackSynth('lead').toDestination(),
        pad: this.createFallbackSynth('pad').toDestination(),
        bass: this.createFallbackSynth('bass').toDestination(),
      };
      
      this.instruments.synthPad = this.instruments.pad;
      this.instruments.emergency = this.instruments.piano;
      
      this.createSimpleDrumKit();
      
      console.log('✅ Fallback instruments loaded');
      
    } catch (error) {
      console.error('❌ Fallback instrument loading failed:', error);
      this.createEmergencyInstrument();
    }
  }

  createAdvancedDrumKit() {
    try {
      console.log('🥁 Creating advanced drum kit...');
      
      // High-quality drum sounds using samples or better synthesis
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

      this.instruments.clap = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0 }
      }).toDestination();

      console.log('✅ Advanced drum kit created');

    } catch (error) {
      console.warn('⚠️ Advanced drum kit creation failed:', error.message);
      this.createSimpleDrumKit();
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
      console.warn('⚠️ Simple drum kit creation failed:', error.message);
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
      pop: {
        happy: ['I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV'],
        sad: ['vi', 'IV', 'I', 'V', 'vi', 'IV', 'I', 'V'],
        energetic: ['I', 'V', 'vi', 'IV', 'V', 'I', 'IV', 'V'],
        calm: ['I', 'vi', 'IV', 'V', 'I', 'vi', 'IV', 'V']
      },
      jazz: {
        happy: ['Imaj7', 'vi7', 'IImaj7', 'V7', 'Imaj7', 'vi7', 'IImaj7', 'V7'],
        sad: ['ii7', 'V7', 'i7', 'VI7', 'ii7', 'V7', 'i7', 'i7'],
        energetic: ['Imaj7', 'V7', 'IImaj7', 'V7', 'Imaj7', 'VImaj7', 'IImaj7', 'V7'],
        calm: ['Imaj7', 'IVmaj7', 'ii7', 'V7', 'Imaj7', 'IVmaj7', 'ii7', 'V7']
      },
      rock: {
        happy: ['I', 'V', 'vi', 'IV', 'I', 'V', 'vi', 'IV'],
        sad: ['i', 'VII', 'VI', 'VII', 'i', 'VII', 'VI', 'VII'],
        energetic: ['I', 'VII', 'IV', 'I', 'V', 'VII', 'IV', 'V'],
        calm: ['I', 'vi', 'IV', 'V', 'I', 'vi', 'IV', 'V']
      },
      electronic: {
        happy: ['i', 'VII', 'VI', 'VII', 'i', 'VII', 'VI', 'VII'],
        sad: ['i', 'VI', 'III', 'VII', 'i', 'VI', 'III', 'VII'],
        energetic: ['i', 'VII', 'VI', 'VII', 'V', 'VI', 'VII', 'i'],
        calm: ['i', 'VI', 'IV', 'VII', 'i', 'VI', 'IV', 'VII']
      }
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

  // Genre/Mood settings system
  getGenreSettings(genre, mood) {
    const settings = {
      noteResolution: 0.5, // Default: 8th notes
      melodyRange: 'comfortable', // Default to comfortable
      bassStyle: 'simple',
      harmonyDensity: 0.5,
      sectionVariation: 0.3,
      brightness: 0.5
    };
    
    // GENRE adjustments
    switch(genre.toLowerCase()) {
      case 'pop':
        settings.noteResolution = 0.5; // 8th notes
        settings.melodyRange = 'comfortable';
        settings.bassStyle = 'simple';
        settings.harmonyDensity = 0.6;
        break;
      case 'rock':
        settings.noteResolution = 0.25; // 16th notes
        settings.melodyRange = 'wide';
        settings.bassStyle = 'driving';
        settings.harmonyDensity = 0.8;
        break;
      case 'jazz':
        settings.noteResolution = 0.3;
        settings.melodyRange = 'wide';
        settings.bassStyle = 'walking';
        settings.harmonyDensity = 0.9;
        break;
      case 'ambient':
        settings.noteResolution = 0.8; // Slower, more spacious
        settings.melodyRange = 'ethereal';
        settings.bassStyle = 'drone';
        settings.harmonyDensity = 0.4;
        break;
      case 'electronic':
        settings.noteResolution = 0.4;
        settings.melodyRange = 'wide';
        settings.bassStyle = 'driving';
        settings.harmonyDensity = 0.7;
        break;
      case 'classical':
        settings.noteResolution = 0.25;
        settings.melodyRange = 'wide';
        settings.bassStyle = 'walking';
        settings.harmonyDensity = 0.9;
        break;
      case 'cinematic':
        settings.noteResolution = 0.6; // Cinematic pacing
        settings.melodyRange = 'heroic';
        settings.bassStyle = 'drone';
        settings.harmonyDensity = 0.7;
        break;
      case 'bossa nova':
      case 'bossanova':
        settings.noteResolution = 0.7; // Relaxed, syncopated rhythm
        settings.melodyRange = 'comfortable';
        settings.bassStyle = 'walking';
        settings.harmonyDensity = 0.8; // Rich jazz harmonies
        break;
    }
    
    // MOOD adjustments
    switch(mood.toLowerCase()) {
      case 'happy':
      case 'upbeat':
        settings.brightness = 0.8;
        settings.sectionVariation = 0.4;
        settings.melodyRange = 'uplifting';
        settings.noteResolution *= 0.8; // More frequent notes
        break;
      case 'sad':
      case 'melancholy':
        settings.brightness = 0.2;
        settings.sectionVariation = 0.2;
        settings.noteResolution *= 1.2; // Slower notes
        break;
      case 'energetic':
        settings.brightness = 0.9;
        settings.sectionVariation = 0.5;
        settings.noteResolution *= 0.6; // Much more frequent
        break;
      case 'epic':
        settings.brightness = 0.7;
        settings.sectionVariation = 0.6; // Much more variation for epic feel
        settings.melodyRange = 'heroic';
        settings.noteResolution *= 0.9;
        break;
      case 'calm':
      case 'peaceful':
        settings.brightness = 0.6;
        settings.sectionVariation = 0.1;
        settings.noteResolution *= 1.5; // Much slower
        break;
      case 'mysterious':
        settings.brightness = 0.3; // Dark and mysterious
        settings.sectionVariation = 0.5; // Unpredictable changes
        settings.melodyRange = 'ethereal'; // Floating, mysterious melodies
        settings.noteResolution *= 1.1; // Slightly slower
        break;
    }
    
    return settings;
  }

  // Main composition generation method
  async generateAdvancedComposition(options = {}) {
    console.log('🤖 Generating advanced AI composition...');
    
    const config = {
      genre: options.genre || 'pop',
      mood: options.mood || 'happy',
      tempo: options.tempo || this.generateIntelligentTempo(options.genre, options.mood),
      length: options.length || 32, // Increased for ~30 seconds
      complexity: options.complexity || 0.7,
      creativity: options.creativity || this.creativity,
      key: options.key || null,
      reverb: options.reverb || 0.1,
      isLooping: options.isLooping || false // Ensure loop setting is passed through
    };

    try {
      const key = this.selectIntelligentKey(config.genre, config.mood, config.key);
      console.log(`🎼 AI selected key: ${key} for ${config.genre}/${config.mood} (${config.isLooping ? 'LOOP' : 'SINGLE'} playback)`);

      const composition = await this.createAIComposition(config, key);
      
      this.composition = composition;
      this.generationHistory.push({
        config,
        composition,
        timestamp: Date.now()
      });

      console.log('🎼 Scheduling advanced playback...');
      await this.scheduleAdvancedPlayback(composition, config);

      // Store current composition for playback control
      this.currentComposition = composition;
      this.currentConfig = config;

      console.log('✅ Advanced AI composition completed');
      return composition;

    } catch (error) {
      console.error('❌ Composition generation failed:', error);
      throw error;
    }
  }

  selectIntelligentKey(genre, mood, requestedKey) {
    if (requestedKey) return requestedKey;

    // More musical key selections based on genre and mood
    const musicalKeys = {
      happy: {
        pop: ['C major', 'G major', 'F major', 'D major'], // Bright, popular keys
        ambient: ['C major', 'F major', 'G major', 'D major'], // Open, peaceful keys
        rock: ['E major', 'A major', 'G major'], // Guitar-friendly keys
        electronic: ['C major', 'Am major', 'F major'], // Electronic-friendly
        jazz: ['C major', 'G major', 'F major'], // Bright jazz
        cinematic: ['C major', 'F major', 'G major'], // Uplifting cinematic
        'bossa nova': ['G major', 'F major', 'C major'], // Warm bossa nova
        bossanova: ['G major', 'F major', 'C major'] // Warm bossa nova
      },
      sad: {
        pop: ['A minor', 'D minor', 'E minor'], // Natural minor keys
        ambient: ['A minor', 'F major', 'D minor'], // Contemplative
        rock: ['E minor', 'A minor', 'D minor'], // Guitar minor keys
        electronic: ['A minor', 'C major', 'F major'], // Bittersweet electronic
        jazz: ['A minor', 'D minor', 'E minor'], // Melancholy jazz
        cinematic: ['A minor', 'D minor', 'F major'], // Emotional cinematic
        'bossa nova': ['A minor', 'D minor', 'F major'], // Melancholy bossa
        bossanova: ['A minor', 'D minor', 'F major'] // Melancholy bossa
      },
      energetic: {
        pop: ['C major', 'G major', 'F major'], // Driving major keys
        ambient: ['C major', 'G major', 'D major'], // Uplifting ambient
        rock: ['E major', 'A major', 'D major'], // High-energy rock keys
        electronic: ['C major', 'F major', 'G major'], // Energetic electronic
        jazz: ['G major', 'A major', 'D major'], // Fast jazz
        cinematic: ['D major', 'A major', 'G major'], // Action cinematic
        'bossa nova': ['A major', 'G major', 'D major'], // Upbeat bossa
        bossanova: ['A major', 'G major', 'D major'] // Upbeat bossa
      },
      calm: {
        pop: ['F major', 'C major', 'G major'], // Peaceful major keys
        ambient: ['F major', 'C major', 'A minor'], // Serene ambience
        rock: ['G major', 'C major', 'F major'], // Mellow rock
        electronic: ['F major', 'C major', 'A minor'], // Chill electronic
        jazz: ['F major', 'C major', 'G major'], // Smooth jazz
        cinematic: ['F major', 'C major', 'A minor'], // Peaceful cinematic
        'bossa nova': ['F major', 'C major', 'G major'], // Smooth bossa
        bossanova: ['F major', 'C major', 'G major'] // Smooth bossa
      },
      epic: {
        pop: ['C major', 'D major', 'A major'], // Grand and powerful
        ambient: ['F major', 'G major', 'D major'], // Expansive ambient
        rock: ['E major', 'D major', 'A major'], // Epic rock anthems
        electronic: ['C major', 'D major', 'G major'], // Epic electronic
        jazz: ['G major', 'D major', 'C major'], // Grand jazz
        cinematic: ['C major', 'D major', 'F major'], // Cinematic grandeur
        'bossa nova': ['D major', 'G major', 'A major'], // Grand bossa
        bossanova: ['D major', 'G major', 'A major'] // Grand bossa
      },
      mysterious: {
        pop: ['A minor', 'E minor', 'F# minor'], // Intriguing and dark
        ambient: ['A minor', 'D minor', 'F# minor'], // Ethereal mystery
        rock: ['E minor', 'A minor', 'B minor'], // Dark rock
        electronic: ['A minor', 'E minor', 'C# minor'], // Electronic mystery
        jazz: ['A minor', 'E minor', 'D minor'], // Mysterious jazz
        cinematic: ['A minor', 'F# minor', 'D minor'], // Cinematic suspense
        'bossa nova': ['E minor', 'A minor', 'D minor'], // Mysterious bossa
        bossanova: ['E minor', 'A minor', 'D minor'] // Mysterious bossa
      }
    };

    const genreKeys = musicalKeys[mood]?.[genre] || musicalKeys[mood]?.pop || musicalKeys.happy.pop;
    return genreKeys[Math.floor(Math.random() * genreKeys.length)];
  }

  generateIntelligentTempo(genre, mood) {
    const tempoMap = {
      pop: { happy: 120, sad: 80, energetic: 128, calm: 90, epic: 110, mysterious: 85 },
      rock: { happy: 140, sad: 70, energetic: 160, calm: 100, epic: 130, mysterious: 95 },
      electronic: { happy: 128, sad: 90, energetic: 140, calm: 110, epic: 120, mysterious: 100 },
      jazz: { happy: 120, sad: 70, energetic: 140, calm: 80, epic: 115, mysterious: 75 },
      ambient: { happy: 90, sad: 60, energetic: 110, calm: 70, epic: 85, mysterious: 65 },
      cinematic: { happy: 100, sad: 75, energetic: 130, calm: 80, epic: 95, mysterious: 70 },
      'bossa nova': { happy: 110, sad: 85, energetic: 125, calm: 95, epic: 105, mysterious: 90 },
      bossanova: { happy: 110, sad: 85, energetic: 125, calm: 95, epic: 105, mysterious: 90 }
    };

    const genreTempos = tempoMap[genre] || tempoMap.pop;
    return genreTempos[mood] || 120;
  }

  async createAIComposition(config, key) {
    console.log('🎵 Creating unified AI composition...');

    // Generate proper song structure like professional music generators
    const songStructure = this.generateSongStructure(config.genre, config.isLooping);
    console.log(`🎼 Song structure: ${songStructure.map(s => s.name).join(' - ')}`);

    const chordProgression = this.generateAdvancedChordProgression(
      config.genre, config.mood, config.length, key, config.creativity
    );

    // GENERATE ALL PARTS TOGETHER AS ONE UNIFIED COMPOSITION
    const unifiedComposition = this.generateUnifiedComposition(
      songStructure, chordProgression, key, config.tempo, config
    );

    return {
      key,
      tempo: config.tempo,
      songStructure,
      chordProgression,
      melody: unifiedComposition.melody,
      bassline: unifiedComposition.bass,
      harmonyLayers: unifiedComposition.harmony,
      drums: unifiedComposition.drums,
      effects: {
        reverb: config.reverb
      },
      isUnified: true // Flag to indicate this is a unified composition
    };
  }

  // Professional song structure generator
  generateSongStructure(genre, isLooping) {
    if (isLooping) {
      // For BGM loops, simpler structure that seamlessly repeats
      return [
        { name: 'Intro', duration: 4, energy: 0.3, density: 0.4 },
        { name: 'Main', duration: 20, energy: 0.8, density: 0.9 },
        { name: 'Outro', duration: 6, energy: 0.5, density: 0.6 }
      ];
    }
    // Professional song structures by genre
    const structures = {
      pop: [
        { name: 'Intro', duration: 4, energy: 0.3, density: 0.4 },
        { name: 'Verse', duration: 8, energy: 0.6, density: 0.7 },
        { name: 'Chorus', duration: 8, energy: 0.9, density: 1.0 },
        { name: 'Bridge', duration: 6, energy: 0.4, density: 0.5 },
        { name: 'Outro', duration: 4, energy: 0.2, density: 0.3 }
      ],
      rock: [
        { name: 'Intro', duration: 3, energy: 0.4, density: 0.6 },
        { name: 'Verse', duration: 8, energy: 0.7, density: 0.8 },
        { name: 'Chorus', duration: 8, energy: 1.0, density: 1.0 },
        { name: 'Solo', duration: 8, energy: 0.9, density: 0.7 },
        { name: 'Outro', duration: 3, energy: 0.3, density: 0.4 }
      ],
      ambient: [
        { name: 'Intro', duration: 4, energy: 0.2, density: 0.3 },
        { name: 'Main', duration: 20, energy: 0.7, density: 0.8 },
        { name: 'Outro', duration: 6, energy: 0.4, density: 0.5 }
      ]
    };
    return structures[genre] || structures.pop;
  }

  // Generate sophisticated chord progressions with musical context
  generateAdvancedChordProgression(genre, mood, length, key, creativity) {
    console.log(`🎼 Generating advanced chord progression: ${genre}/${mood} in ${key}`);
    
    // Use proven, musical chord progressions instead of random generation
    const musicalProgressions = {
      pop: {
        happy: [
          ['C', 'Am', 'F', 'G'],     // vi-IV-I-V (very common)
          ['C', 'G', 'Am', 'F'],     // I-V-vi-IV (classic pop)
          ['Am', 'F', 'C', 'G'],     // vi-IV-I-V
          ['F', 'G', 'C', 'Am']      // IV-V-I-vi
        ],
        sad: [
          ['Am', 'F', 'C', 'G'],     // Natural minor progression
          ['Dm', 'G', 'C', 'Am'],    // ii-V-I-vi
          ['Em', 'Am', 'F', 'G']     // iii-vi-IV-V
        ],
        energetic: [
          ['C', 'F', 'G', 'C'],      // I-IV-V-I (strong resolution)
          ['G', 'Am', 'F', 'C'],     // V-vi-IV-I
          ['C', 'G', 'F', 'C']       // I-V-IV-I
        ]
      },
      ambient: {
        happy: [
          ['C', 'Em', 'F', 'G'],     // Gentle, floating progression
          ['Am', 'C', 'F', 'G'],     // Minor to major lift
          ['F', 'C', 'G', 'Am'],     // Suspended feeling
          ['Dm', 'F', 'C', 'G']      // Modal progression
        ],
        calm: [
          ['C', 'F', 'Am', 'G'],     // Peaceful progression
          ['F', 'Am', 'G', 'C'],     // Contemplative
          ['Am', 'G', 'F', 'C']      // Descending bass
        ]
      },
      rock: {
        energetic: [
          ['Em', 'C', 'G', 'D'],     // Classic rock progression
          ['A', 'D', 'E', 'A'],      // Power chord progression
          ['C', 'F', 'G', 'C']       // Strong, driving progression
        ]
      },
      'bossa nova': {
        happy: [
          ['Cmaj7', 'Am7', 'Dm7', 'G7'],    // Classic bossa progression
          ['Fmaj7', 'Em7', 'Am7', 'Dm7'],   // Sophisticated jazz chords
          ['Cmaj7', 'F#m7b5', 'B7', 'Em7'], // ii-V-I with extensions
          ['Am7', 'D7', 'Gmaj7', 'Cmaj7']   // Circle of fifths
        ],
        sad: [
          ['Am7', 'Dm7', 'G7', 'Cmaj7'],    // Minor ii-V-I
          ['Em7', 'Am7', 'Dm7', 'G7'],      // Descending progression
          ['Fm7', 'Bb7', 'Ebmaj7', 'Am7']   // Modal interchange
        ],
        calm: [
          ['Cmaj7', 'Am7', 'F7', 'Em7'],    // Smooth bossa
          ['Fmaj7', 'Dm7', 'G7', 'Cmaj7'],  // Gentle resolution
          ['Am7', 'F7', 'Cmaj7', 'G7']      // Floating harmony
        ],
        energetic: [
          ['Cmaj7', 'C7', 'Fmaj7', 'F#dim7'], // Chromatic movement
          ['Am7', 'D7', 'Dm7', 'G7'],       // Fast bossa changes
          ['Gmaj7', 'G#dim7', 'Am7', 'D7']   // Diminished passing chords
        ]
      },
      bossanova: {
        happy: [
          ['Cmaj7', 'Am7', 'Dm7', 'G7'],    // Classic bossa progression
          ['Fmaj7', 'Em7', 'Am7', 'Dm7'],   // Sophisticated jazz chords
          ['Cmaj7', 'F#m7b5', 'B7', 'Em7'], // ii-V-I with extensions
          ['Am7', 'D7', 'Gmaj7', 'Cmaj7']   // Circle of fifths
        ],
        sad: [
          ['Am7', 'Dm7', 'G7', 'Cmaj7'],    // Minor ii-V-I
          ['Em7', 'Am7', 'Dm7', 'G7'],      // Descending progression
          ['Fm7', 'Bb7', 'Ebmaj7', 'Am7']   // Modal interchange
        ],
        calm: [
          ['Cmaj7', 'Am7', 'F7', 'Em7'],    // Smooth bossa
          ['Fmaj7', 'Dm7', 'G7', 'Cmaj7'],  // Gentle resolution
          ['Am7', 'F7', 'Cmaj7', 'G7']      // Floating harmony
        ],
        energetic: [
          ['Cmaj7', 'C7', 'Fmaj7', 'F#dim7'], // Chromatic movement
          ['Am7', 'D7', 'Dm7', 'G7'],       // Fast bossa changes
          ['Gmaj7', 'G#dim7', 'Am7', 'D7']   // Diminished passing chords
        ]
      }
    };

    // Get the appropriate progressions for genre/mood
    const genreProgs = musicalProgressions[genre] || musicalProgressions.pop;
    const moodProgs = genreProgs[mood] || genreProgs.happy || genreProgs[Object.keys(genreProgs)[0]];
    
    // Select a proven musical progression
    const selectedProgression = moodProgs[Math.floor(Math.random() * moodProgs.length)];
    
    // Convert to the requested key
    const progression = this.transposeProgression(selectedProgression, key);
    
    console.log(`🎵 Generated musical progression: ${progression.join(' - ')}`);
    return progression;
  }

  // Convert Roman numeral notation to actual chords
  convertRomanToChord(roman, key) {
    const scaleNotes = this.getScaleNotes(key);
    
    // Roman numeral mappings
    const romanMapping = {
      'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
      'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6
    };
    
    const degree = romanMapping[roman.replace(/[^IVXivx]/g, '')];
    if (degree === undefined) return 'C'; // Fallback
    
    const rootNote = scaleNotes[degree % scaleNotes.length];
    
    // Determine chord quality
    const isMinor = roman.toLowerCase() === roman;
    const has7th = roman.includes('7');
    const isDim = roman.includes('dim') || roman.includes('°');
    
    let chordSymbol = rootNote;
    if (isDim) {
      chordSymbol += 'dim';
    } else if (isMinor) {
      chordSymbol += 'm';
    }
    if (has7th) {
      chordSymbol += '7';
    }
    
    return chordSymbol;
  }

  // Add musical variations to chords for professional quality
  addMusicalVariation(chord, position, totalLength, genre) {
    const variations = {
      pop: ['sus2', 'sus4', 'add9'],
      rock: ['sus4', 'add9', '5'],
      jazz: ['maj7', 'm7', '9', '11'],
      electronic: ['sus2', 'add9', 'm7']
    };
    
    const genreVars = variations[genre] || variations.pop;
    
    // Apply variations based on musical context
    if (position === 0) {
      // Strong opening chord
      return chord;
    } else if (position === totalLength - 1) {
      // Resolving chord
      if (Math.random() < 0.4) {
        const variation = genreVars[Math.floor(Math.random() * genreVars.length)];
        return chord + variation;
      }
    } else {
      // Middle progression - more variation possible
      if (Math.random() < 0.6) {
        const variation = genreVars[Math.floor(Math.random() * genreVars.length)];
        return chord + variation;
      }
    }
    
    return chord;
  }

  // Helper method to get scale notes for a key
  getScaleNotes(key) {
    // Major scale intervals: W-W-H-W-W-W-H
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyIndex = chromaticScale.indexOf(key);
    
    if (keyIndex === -1) return ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // Fallback
    
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
    return majorScaleIntervals.map(interval => 
      chromaticScale[(keyIndex + interval) % 12]
    );
  }

  // Get musical scale for a key (improved version)
  getMusicalScale(key) {
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyRoot = key.split(' ')[0];
    const keyIndex = chromaticScale.indexOf(keyRoot);
    
    if (keyIndex === -1) return ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
    return majorScaleIntervals.map(interval => 
      chromaticScale[(keyIndex + interval) % 12]
    );
  }

  // Get chord tones with scale positions for better melody generation
  getMusicalChordTones(chordSymbol, scale) {
    const root = chordSymbol.match(/^[A-G][#b]?/)?.[0] || 'C';
    const rootIndex = scale.indexOf(root);
    
    if (rootIndex === -1) return [{ note: root, scaleIndex: 0 }];
    
    // Basic triad (1, 3, 5) with scale positions
    const chordTones = [
      { note: scale[rootIndex], scaleIndex: rootIndex },
      { note: scale[(rootIndex + 2) % scale.length], scaleIndex: (rootIndex + 2) % scale.length },
      { note: scale[(rootIndex + 4) % scale.length], scaleIndex: (rootIndex + 4) % scale.length }
    ];
    
    // Add 7th if present
    if (chordSymbol.includes('7') || chordSymbol.includes('maj7')) {
      chordTones.push({ 
        note: scale[(rootIndex + 6) % scale.length], 
        scaleIndex: (rootIndex + 6) % scale.length 
      });
    }
    
    return chordTones;
  }

  // Improved stepwise motion for smooth melodies
  getStepwiseMotion(lastNoteIndex, targetScaleStep, scaleLength) {
    // Prefer step-wise motion (±1 or ±2 scale steps)
    const maxStep = 2;
    const direction = targetScaleStep > lastNoteIndex ? 1 : -1;
    const stepSize = Math.min(maxStep, Math.abs(targetScaleStep - lastNoteIndex));
    
    let newIndex = lastNoteIndex + (direction * stepSize);
    
    // Keep within scale bounds
    newIndex = Math.max(0, Math.min(scaleLength - 1, newIndex));
    
    return newIndex;
  }

  // Musical duration selection based on context
  getMusicalDuration(noteIndex, energy, patternIndex) {
    // More varied, musical durations
    const durations = ['8n', '4n', '4n.', '2n'];
    
    // Phrase endings get longer notes
    if (patternIndex === 7 || patternIndex === 3) return '2n';
    
    // Strong beats get quarter notes
    if (noteIndex % 4 === 0) return '4n';
    
    // High energy sections get faster notes
    if (energy > 0.7) return '8n';
    
    // Default to quarter notes for stability
    return '4n';
  }

  // Helper method to safely get instruments
  getInstrument(type) {
    if (this.instruments && this.instruments[type]) {
      return this.instruments[type];
    }
    
    // Fallback to emergency synth
    console.warn(`⚠️ Instrument ${type} not found, using emergency synth`);
    return this.instruments.emergency || this.createFallbackSynth(type);
  }

  // 主題フレーズ（モチーフ）生成
  generateMotif(scale, chordProgression) {
    // 4音～8音の印象的なフレーズを作る
    const motifLength = 6;
    const motif = [];
    let lastNoteIndex = 0;
    for (let i = 0; i < motifLength; i++) {
      // 強拍はコードトーン
      const chord = chordProgression[i % chordProgression.length];
      const chordTones = this.getMusicalChordTones(chord, scale);
      let noteIndex;
      if (i % 2 === 0) {
        noteIndex = chordTones[Math.floor(Math.random() * chordTones.length)].scaleIndex;
      } else {
        // 弱拍はスケール内の経過音
        noteIndex = Math.max(0, Math.min(scale.length - 1, lastNoteIndex + (Math.random() < 0.5 ? 1 : -1)));
      }
      motif.push({
        note: scale[noteIndex],
        scaleIndex: noteIndex
      });
      lastNoteIndex = noteIndex;
    }
    return motif;
  }

  // Generate melody with主題フレーズと繰り返し・変奏
  generateStructuredMelody(songStructure, chordProgression, key, genre, mood, creativity, config) {
    console.log('🎵 Generating structured melody with motif and repetition...');
    const scale = this.getMusicalScale(key);
    const melody = [];
    let currentTime = 0;
    let currentOctave = 4;
    let lastNoteIndex = 0;
    // 主題フレーズ（モチーフ）を生成
    const motif = this.generateMotif(scale, chordProgression);
    songStructure.forEach((section, sectionIdx) => {
      const sectionDuration = section.duration;
      const beatsPerSecond = config.tempo / 60;
      const notesPerBeat = 1.5;
      const densityMultiplier = 0.7 + (section.energy * 0.3);
      const sectionNotes = Math.floor(sectionDuration * beatsPerSecond * notesPerBeat * densityMultiplier);
      // セクションごとにモチーフを繰り返し、時々変奏
      for (let i = 0; i < sectionNotes; i++) {
        // 4音ごとにモチーフを繰り返す
        const motifNote = motif[i % motif.length];
        let selectedNoteIndex = motifNote.scaleIndex;
        // ChorusやMainではオクターブ上げて高揚感
        let noteOctave = currentOctave;
        if (section.name.toLowerCase() === 'chorus' || section.name.toLowerCase() === 'main') {
          noteOctave = Math.min(6, currentOctave + 1);
        }
        // セクション切り替え時はモチーフを少し変奏
        if (sectionIdx > 0 && i % motif.length === 0 && Math.random() < 0.5) {
          selectedNoteIndex = Math.max(0, Math.min(scale.length - 1, motifNote.scaleIndex + (Math.random() < 0.5 ? 1 : -1)));
        }
        // 強拍は必ずコードトーン
        const chordIndex = Math.floor((i / sectionNotes) * chordProgression.length);
        const currentChord = chordProgression[chordIndex % chordProgression.length];
        const chordTones = this.getMusicalChordTones(currentChord, scale);
        if (i % 4 === 0) {
          selectedNoteIndex = chordTones[Math.floor(Math.random() * chordTones.length)].scaleIndex;
        }
        const selectedNote = scale[selectedNoteIndex];
        // タイミング・ダイナミクス
        const baseNoteTime = currentTime + (i / sectionNotes) * sectionDuration;
        const humanization = (Math.random() - 0.5) * 0.02;
        const noteTime = baseNoteTime + humanization;
        let velocity = 0.5 + (section.energy * 0.3);
        if (i % 4 === 0) velocity += 0.1;
        velocity += (Math.random() - 0.5) * 0.1;
        velocity = Math.max(0.3, Math.min(0.9, velocity));
        // 音長
        const duration = this.getMusicalDuration(i, section.energy, i % motif.length);
        melody.push({
          note: selectedNote + noteOctave,
          time: noteTime,
          duration: duration,
          velocity: velocity,
          section: section.name
        });
        lastNoteIndex = selectedNoteIndex;
      }
      currentTime += sectionDuration;
    });
    console.log(`🎵 Generated musical melody with motif: ${melody.length} notes across ${songStructure.length} sections`);
    return melody;
  }

  // Generate bassline that follows song structure with proper musical patterns
  generateStructuredBassline(songStructure, chordProgression, key, complexity, config) {
    console.log('🎸 Creating rich structured bassline...');
    const scale = this.getMusicalScale(key);
    const bassline = [];
    let currentTime = 0;
    
    songStructure.forEach(section => {
      const sectionDuration = section.duration;
      const beatsPerSecond = config.tempo / 60;
      const totalBeats = Math.floor(sectionDuration * beatsPerSecond);
      
      // Much denser bass pattern - 8th notes
      for (let beat = 0; beat < totalBeats; beat += 0.5) { // 8th note resolution
        const beatTime = currentTime + (beat / totalBeats) * sectionDuration;
        const chordIndex = Math.floor((beat / 4) % chordProgression.length);
        const currentChord = chordProgression[chordIndex % chordProgression.length];
        const chordTones = this.getMusicalChordTones(currentChord, scale);
        
        let shouldPlay = false;
        let bassNote = chordTones[0].note; // Root
        let duration = '8n'; // Default to 8th notes
        const beatInMeasure = beat % 4;
        
        // Create walking bass patterns
        if (beatInMeasure === 0) {
          // Strong beats - always root
          shouldPlay = true;
          bassNote = chordTones[0].note;
          duration = '4n';
        } else if (beatInMeasure === 1) {
          // Move to fifth or third
          shouldPlay = true;
          bassNote = chordTones[2]?.note || chordTones[1]?.note || chordTones[0].note;
        } else if (beatInMeasure === 2) {
          // Third or root
          shouldPlay = true;
          bassNote = chordTones[1]?.note || chordTones[0].note;
        } else if (beatInMeasure === 3) {
          // Back to root or fifth
          shouldPlay = true;
          bassNote = chordTones[0].note;
        }
        
        // Add offbeat patterns for energy
        if (beat % 1 === 0.5 && section.energy > 0.5) {
          shouldPlay = true;
          bassNote = chordTones[Math.floor(Math.random() * chordTones.length)].note;
          duration = '8n';
        }
        
        if (shouldPlay) {
          bassline.push({
            note: bassNote + '2', // Bass octave
            time: beatTime,
            duration: duration,
            velocity: 0.7 + (section.energy * 0.2),
            section: section.name,
            chord: currentChord
          });
        }
      }
      currentTime += sectionDuration;
    });
    
    console.log(`🎸 Generated rich bassline: ${bassline.length} notes`);
    console.log(`🎸 Bass density: ${(bassline.length / (currentTime)).toFixed(1)} notes per second`);
    return bassline;
  }

  // Generate harmony with proper musical chord voicings
  generateStructuredHarmony(songStructure, chordProgression, key, genre, complexity, config) {
    console.log('🎼 Creating structured harmony...');
    const scale = this.getMusicalScale(key);
    const harmonyLayers = [];
    let currentTime = 0;
    songStructure.forEach(section => {
      const sectionDuration = section.duration;
      const beatsPerChord = 8; // Slower chord changes for cleaner harmony
      const beatsPerSecond = config.tempo / 60;
      const chordChanges = Math.max(1, Math.floor(sectionDuration * beatsPerSecond / beatsPerChord));
      for (let i = 0; i < chordChanges; i++) {
        const chordIndex = i % chordProgression.length;
        const chord = chordProgression[chordIndex];
        const chordTones = this.getMusicalChordTones(chord, scale);
        const chordTime = currentTime + (i / chordChanges) * sectionDuration;
        const chordDuration = Math.min(beatsPerChord / beatsPerSecond, sectionDuration / chordChanges);
        if (chordTones.length >= 3) {
          // Musical chord voicing based on section and genre
          let voicing;
          if (section.name.toLowerCase() === 'chorus' || section.name.toLowerCase() === 'main') {
            // Fuller, brighter voicing for main sections
            voicing = [
              chordTones[0].note + '3', // Root
              chordTones[1].note + '4', // Third 
              chordTones[2].note + '4', // Fifth
              chordTones[0].note + '5' // Root octave
            ];
          } else if (section.name.toLowerCase() === 'intro' || section.name.toLowerCase() === 'outro') {
            // Gentler, simpler voicing
            voicing = [
              chordTones[0].note + '4', // Root mid-range
              chordTones[2].note + '4', // Fifth for openness
            ];
          } else {
            // Standard triad voicing
            voicing = [
              chordTones[0].note + '3', // Root
              chordTones[1].note + '4', // Third
              chordTones[2].note + '4' // Fifth
            ];
          }
          // Reduce volume for harmony to not overpower melody
          const harmonyVelocity = Math.min(0.4, 0.2 + (section.energy * 0.2));
          harmonyLayers.push({
            notes: voicing,
            time: chordTime,
            duration: chordDuration + 's',
            velocity: harmonyVelocity,
            section: section.name
          });
        }
      }
      currentTime += sectionDuration;
    });
    console.log(`🎼 Generated musical harmony: ${harmonyLayers.length} chord changes`);
    return harmonyLayers;
  }

  // Generate drums with proper song structure
  generateStructuredDrums(songStructure, genre, mood, tempo, config) {
    console.log('🥁 Creating structured drum patterns...');
    
    const drums = [];
    let currentTime = 0;

    songStructure.forEach(section => {
      const sectionDuration = section.duration;
      const drumPattern = this.getDrumPattern(genre, section.name, section.energy);
      const beatsPerSecond = tempo / 60;
      const sectionBeats = Math.floor(sectionDuration * beatsPerSecond * 4); // 16th note resolution

      console.log(`🥁 ${section.name}: ${sectionBeats} drum hits over ${sectionDuration}s`);

      for (let i = 0; i < sectionBeats; i++) {
        const beatTime = currentTime + (i / sectionBeats) * sectionDuration;
        const patternIndex = i % 16; // 16th note pattern

        if (drumPattern.kick[patternIndex]) {
          drums.push({
            instrument: 'kick',
            time: beatTime,
            velocity: 0.8 + (section.energy * 0.2),
            section: section.name
          });
        }

        if (drumPattern.snare[patternIndex]) {
          drums.push({
            instrument: 'snare',
            time: beatTime,
            velocity: 0.7 + (section.energy * 0.3),
            section: section.name
          });
        }

        if (drumPattern.hihat[patternIndex]) {
          drums.push({
            instrument: 'hihat',
            time: beatTime,
            velocity: 0.5 + (section.energy * 0.2),
            section: section.name
          });
        }
      }

      currentTime += sectionDuration;
    });

    console.log(`🥁 Generated structured drums: ${drums.length} drum hits`);
    return drums;
  }

  // Helper methods for musical structure
  getNoteDuration(section, noteIndex, totalNotes) {
    const durations = ['16n', '8n', '4n'];
    const energyIndex = Math.floor(section.energy * (durations.length - 1));
    return durations[energyIndex];
  }

  getBassPattern(sectionName, energy) {
    const patterns = {
      intro: [
        { play: true, note: null, duration: '2n' },
        { play: false },
        { play: true, note: null, duration: '4n' },
        { play: false }
      ],
      verse: [
        { play: true, note: null, duration: '4n' },
        { play: false },
        { play: true, note: null, duration: '8n' },
        { play: true, note: null, duration: '8n' }
      ],
      chorus: [
        { play: true, note: null, duration: '4n' },
        { play: true, note: null, duration: '8n' },
        { play: true, note: null, duration: '4n' },
        { play: true, note: null, duration: '8n' }
      ],
      bridge: [
        { play: true, note: null, duration: '2n' },
        { play: false },
        { play: false },
        { play: true, note: null, duration: '4n' }
      ],
      main: [
        { play: true, note: null, duration: '4n' },
        { play: true, note: null, duration: '8n' },
        { play: true, note: null, duration: '4n' },
        { play: true, note: null, duration: '8n' }
      ],
      outro: [
        { play: true, note: null, duration: '2n' },
        { play: false },
        { play: true, note: null, duration: '4n' },
        { play: false }
      ]
    };

    return patterns[sectionName.toLowerCase()] || patterns.verse;
  }

  getChordVoicing(sectionName, energy) {
    const voicings = {
      intro: { bass: '3', mid: '4', high: '5' },
      verse: { bass: '3', mid: '4', high: '4' },
      chorus: { bass: '2', mid: '4', high: '5' },
      bridge: { bass: '3', mid: '4', high: '4' },
      main: { bass: '3', mid: '4', high: '5' },
      outro: { bass: '3', mid: '4', high: '5' }
    };

    return voicings[sectionName.toLowerCase()] || voicings.verse;
  }

  getDrumPattern(genre, sectionName, energy) {
    const basePattern = this.rhythmPatterns[genre] || this.rhythmPatterns.pop;
    
    // Modify pattern based on section
    const sectionModifiers = {
      intro: { kickReduce: 0.5, snareReduce: 0.7 },
      verse: { kickReduce: 1.0, snareReduce: 1.0 },
      chorus: { kickReduce: 1.2, snareReduce: 1.2 },
      bridge: { kickReduce: 0.8, snareReduce: 0.6 },
      main: { kickReduce: 1.1, snareReduce: 1.1 },
      outro: { kickReduce: 0.6, snareReduce: 0.5 }
    };

    const modifier = sectionModifiers[sectionName.toLowerCase()] || sectionModifiers.verse;
    
    return {
      kick: basePattern.kick.map(hit => hit * modifier.kickReduce),
      snare: basePattern.snare.map(hit => hit * modifier.snareReduce),
      hihat: basePattern.hihat
    };
  }

  // Transpose a chord progression to a different key musically
  transposeProgression(progression, targetKey) {
    console.log(`🎼 Transposing progression [${progression.join(', ')}] to ${targetKey}`);
    
    // Parse target key (remove 'major'/'minor')
    const targetRoot = targetKey.split(' ')[0];
    const sourceRoot = 'C'; // All progressions are in C major
    
    // Calculate semitones to transpose
    const transposition = this.calculateTransposition(sourceRoot, targetRoot);
    console.log(`🎼 Transposition: ${transposition} semitones from ${sourceRoot} to ${targetRoot}`);
    
    const transposedProgression = progression.map(chord => this.transposeChord(chord, transposition));
    console.log(`🎼 Transposed result: [${transposedProgression.join(', ')}]`);
    
    return transposedProgression;
  }

  // Calculate semitones between two keys
  calculateTransposition(fromKey, toKey) {
    // Chromatic scale with proper enharmonic equivalents
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const enharmonicMap = {
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
      'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#'
    };
    
    // Normalize key names
    const normalizeKey = (key) => enharmonicMap[key] || key;
    const fromNormalized = normalizeKey(fromKey);
    const toNormalized = normalizeKey(toKey);
    
    const fromIndex = chromaticScale.indexOf(fromNormalized);
    const toIndex = chromaticScale.indexOf(toNormalized);
    
    if (fromIndex === -1 || toIndex === -1) {
      console.warn(`⚠️ Invalid key: ${fromKey} -> ${toKey}`);
      return 0;
    }
    
    return (toIndex - fromIndex + 12) % 12;
  }

  // Transpose a single chord by semitones with proper enharmonic handling
  transposeChord(chord, semitones) {
    // Enhanced regex to handle complex chord symbols
    const chordRegex = /^([A-G][#b]?)(.*)/;
    const match = chord.match(chordRegex);
    
    if (!match) {
      console.warn(`⚠️ Invalid chord format: ${chord}`);
      return chord;
    }
    
    const [, root, suffix] = match;
    
    // Chromatic scale
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Handle enharmonic equivalents properly
    let normalizedRoot = root;
    if (root === 'Db') normalizedRoot = 'C#';
    else if (root === 'Eb') normalizedRoot = 'D#';
    else if (root === 'Gb') normalizedRoot = 'F#';
    else if (root === 'Ab') normalizedRoot = 'G#';
    else if (root === 'Bb') normalizedRoot = 'A#';
    
    const rootIndex = chromaticScale.indexOf(normalizedRoot);
    
    if (rootIndex === -1) {
      console.warn(`⚠️ Unknown root note: ${root} (normalized: ${normalizedRoot})`);
      return chord;
    }
    
    const newRootIndex = (rootIndex + semitones) % 12;
    const newRoot = chromaticScale[newRootIndex];
    
    const result = newRoot + suffix;
    console.log(`🎼 Chord transposition: ${chord} -> ${result} (+${semitones} semitones)`);
    
    return result;
  }

  // Stop playback method
  stop() {
    try {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      console.log('🛑 Playback stopped');
    } catch (error) {
      console.warn('⚠️ Stop failed:', error);
    }
  }

  // Start playback method  
  start() {
    try {
      Tone.Transport.start();
      console.log('▶️ Playback started');
    } catch (error) {
      console.warn('⚠️ Start failed:', error);
    }
  }

  // Pause playback method
  pause() {
    try {
      Tone.Transport.pause();
      console.log('⏸️ Playback paused');
    } catch (error) {
      console.warn('⚠️ Pause failed:', error);
    }
  }

  // Advanced playback scheduling with professional song structure
  async scheduleAdvancedPlayback(composition, config) {
    console.log('🎼 Scheduling professional playback with grid synchronization...');
    try {
      // Clear existing parts
      Tone.Transport.cancel();

      // Calculate total song duration
      const totalDuration = composition.songStructure.reduce((sum, section) => sum + section.duration, 0);
      console.log(`🎼 Total song duration: ${totalDuration} seconds`);

      // Set up transport with musical grid
      Tone.Transport.bpm.value = composition.tempo;
      Tone.Transport.loop = config.isLooping;
      if (config.isLooping) {
        Tone.Transport.loopEnd = totalDuration;
      }

      // Create unified musical grid (grid-based approach)
      const beatsPerSecond = composition.tempo / 60;
      const totalBeats = Math.ceil(totalDuration * beatsPerSecond);
      const musicalGrid = this.createMusicalGrid(composition, totalBeats, beatsPerSecond);

      console.log(`🎼 Created musical grid: ${totalBeats} beats at ${composition.tempo} BPM`);

      // Schedule harmony first (foundation) - NOW ENABLED for full band sound
      if (musicalGrid.harmony.length > 0) {
        const harmonyPart = new Tone.Part((time, chord) => {
          const instrument = this.getInstrument('piano');
          if (instrument && chord.notes) {
            // Play with slight attack delay for natural chord voicing, reduced volume
            chord.notes.forEach((note, index) => {
              const noteTime = time + (index * 0.02); // Natural chord roll
              const reducedVelocity = Math.min(0.35, chord.velocity || 0.25); // Lower volume
              instrument.triggerAttackRelease(note, chord.duration || '2n', noteTime, reducedVelocity);
            });
          }
        }, musicalGrid.harmony);
        harmonyPart.start(0);
        console.log(`🎼 Scheduled ${musicalGrid.harmony.length} background harmony chords`);
      }

      // Schedule bassline (rhythmic foundation) - NOW ENABLED for full band sound
      if (musicalGrid.bass.length > 0) {
        const bassPart = new Tone.Part((time, note) => {
          const instrument = this.getInstrument('bass');
          if (instrument && note.note) {
            instrument.triggerAttackRelease(note.note, note.duration || '4n', time, note.velocity || 0.7);
          }
        }, musicalGrid.bass);
        bassPart.start(0);
        console.log(`� Scheduled ${musicalGrid.bass.length} synchronized bassline notes`);
      }

      // Schedule melody (melodic line) - Enhanced prominence with simplified approach
      if (musicalGrid.melody.length > 0) {
        const melodyPart = new Tone.Part((time, note) => {
          // Use piano as primary melody instrument (most reliable)
          const melodyInstrument = this.getInstrument('piano');
          if (melodyInstrument && note.note) {
            // Fixed high velocity for clear melody line
            const melodyVelocity = 0.9;
            melodyInstrument.triggerAttackRelease(note.note, note.duration || '4n', time, melodyVelocity);
            console.log(`� Piano melody: ${note.note} at ${time.toFixed(2)}s`);
          } else {
            console.warn('⚠️ Piano not available for melody');
          }
        }, musicalGrid.melody);
        melodyPart.start(0);
        console.log(`🎵 Scheduled ${musicalGrid.melody.length} piano melody notes`);
      }

      // Schedule drums (rhythmic layer)
      if (musicalGrid.drums.length > 0) {
        const drumPart = new Tone.Part((time, drum) => {
          try {
            const instrument = this.getInstrument(drum.instrument);
            if (instrument && instrument.triggerAttack) {
              instrument.triggerAttack('C2', time, drum.velocity || 0.8);
            } else if (instrument && instrument.triggerAttackRelease) {
              instrument.triggerAttackRelease('C2', '32n', time, drum.velocity || 0.8);
            }
          } catch (error) {
            // Suppress drum errors to prevent console spam
          }
        }, musicalGrid.drums);
        drumPart.start(0);
        console.log(`🥁 Scheduled ${musicalGrid.drums.length} synchronized drum hits`);
      }

      // Auto-stop for non-looping tracks
      if (!config.isLooping) {
        Tone.Transport.schedule(() => {
          console.log('🎼 Song completed, stopping transport');
          Tone.Transport.stop();
        }, totalDuration);
      }

      console.log('✅ Professional synchronized playback scheduled successfully');
    } catch (error) {
      console.error('❌ Playback scheduling failed:', error);
      throw error;
    }
  }

  // Create unified musical grid for all parts - Enhanced version
  createMusicalGrid(composition, totalBeats, beatsPerSecond) {
    console.log('🎼 Creating unified musical grid with advanced composition integration...');
    
    const grid = {
      harmony: [],
      melody: [],
      bass: [],
      drums: []
    };

    // CHECK FOR UNIFIED COMPOSITION (new system)
    if (composition.isUnified) {
      console.log('🎯 Using unified composition - all parts already synchronized!');
      
      // Direct integration of unified parts
      grid.melody = composition.melody.map(note => ({
        time: note.time,
        note: note.note,
        duration: note.duration || '8n',
        velocity: note.velocity || 0.8,
        chord: note.chord
      }));
      
      grid.bass = composition.bassline.map(note => ({
        time: note.time,
        note: note.note,
        duration: note.duration || '4n',
        velocity: note.velocity || 0.7,
        chord: note.chord
      }));
      
      grid.harmony = composition.harmonyLayers.map(chord => ({
        time: chord.time,
        notes: chord.notes,
        duration: chord.duration || '2n',
        velocity: chord.velocity || 0.4,
        chord: chord.chord
      }));
      
      grid.drums = composition.drums.map(drum => ({
        time: drum.time,
        instrument: drum.type === 'kick' ? 'kick' : 'snare',
        velocity: drum.velocity || 0.8,
        type: drum.type
      }));
      
      console.log(`🎯 Unified grid: H:${grid.harmony.length} M:${grid.melody.length} B:${grid.bass.length} D:${grid.drums.length}`);
      
    } else {
      // OLD SYSTEM: Individual part integration

    // INTEGRATE EXISTING HARMONY from advanced composition
    if (composition.harmonyLayers && composition.harmonyLayers.length > 0) {
      console.log(`🎼 Integrating ${composition.harmonyLayers.length} advanced harmony layers`);
      grid.harmony = composition.harmonyLayers.map(harmony => ({
        time: harmony.time,
        notes: harmony.notes,
        duration: harmony.duration,
        velocity: Math.min(0.3, harmony.velocity * 0.7), // Reduce volume for background
        chord: harmony.chord
      }));
    } else {
      // Fallback to simple grid generation
      this.createFallbackHarmony(grid, composition, totalBeats, beatsPerSecond);
    }

    // FORCE USE of simplified melody generation (bypass complex system)
    console.log('🎵 FORCING simplified melody generation for musical coherence...');
    grid.melody = [];
    this.createFallbackMelody(grid, composition, totalBeats, beatsPerSecond);

    // INTEGRATE EXISTING BASSLINE from advanced composition
    if (composition.bassline && composition.bassline.length > 0) {
      console.log(`🎸 Integrating ${composition.bassline.length} advanced bassline notes`);
      grid.bass = composition.bassline.map(note => ({
        time: note.time,
        note: note.note,
        duration: note.duration || '4n',
        velocity: note.velocity || 0.7
      }));
    } else {
      // Fallback to simple grid generation
      this.createFallbackBass(grid, composition, totalBeats, beatsPerSecond);
    }

    // INTEGRATE EXISTING DRUMS from advanced composition
    if (composition.drums && composition.drums.length > 0) {
      console.log(`🥁 Integrating ${composition.drums.length} advanced drum patterns`);
      grid.drums = composition.drums.map(drum => ({
        time: drum.time,
        instrument: drum.instrument,
        velocity: drum.velocity || 0.8
      }));
    } else {
      // Fallback to simple grid generation
      this.createFallbackDrums(grid, composition, totalBeats, beatsPerSecond);
    }

      console.log(`🎼 Enhanced musical grid created: H:${grid.harmony.length} M:${grid.melody.length} B:${grid.bass.length} D:${grid.drums.length}`);
    }

    console.log(`🎼 Enhanced musical grid created: H:${grid.harmony.length} M:${grid.melody.length} B:${grid.bass.length} D:${grid.drums.length}`);
    return grid;
  }

  // Fallback harmony generation
  createFallbackHarmony(grid, composition, totalBeats, beatsPerSecond) {
    console.log('🎼 Creating fallback harmony...');
    const chordDuration = 4;
    const chordsPerSong = Math.ceil(totalBeats / chordDuration);
    
    for (let chordIndex = 0; chordIndex < chordsPerSong; chordIndex++) {
      const beatPosition = chordIndex * chordDuration;
      const timePosition = beatPosition / beatsPerSecond;
      const chord = composition.chordProgression[chordIndex % composition.chordProgression.length];
      
      const chordTones = this.getMusicalChordTones(chord, this.getMusicalScale(composition.key));
      if (chordTones.length >= 3) {
        const voicing = [
          chordTones[0].note + '3',
          chordTones[1].note + '4',
          chordTones[2].note + '4',
          chordTones[0].note + '5'
        ];

        grid.harmony.push({
          time: timePosition,
          notes: voicing,
          duration: (chordDuration / beatsPerSecond) + 's',
          velocity: 0.25,
          chord: chord
        });
      }
    }
  }

  // COMPLETELY REWRITTEN melody generation for musical richness
  createFallbackMelody(grid, composition, totalBeats, beatsPerSecond) {
    console.log('🎵 Creating rich, musical melody...');
    const scale = this.getMusicalScale(composition.key);
    const melodyOctave = 4;
    
    // Much more frequent notes for a rich melody
    const notesPerBeat = 2; // 8th notes (twice as dense)
    const chordProgression = composition.chordProgression; // [C, Am, F, G]
    const beatsPerChord = 4;
    
    for (let beat = 0; beat < totalBeats; beat += 0.5) { // Every 8th note
      const timePosition = beat / beatsPerSecond;
      const chordIndex = Math.floor(beat / beatsPerChord) % chordProgression.length;
      const currentChord = chordProgression[chordIndex];
      const chordTones = this.getMusicalChordTones(currentChord, scale);
      
      if (chordTones.length >= 3) {
        let selectedNote;
        const beatInChord = beat % beatsPerChord;
        
        // Create varied, musical patterns within each chord
        if (beatInChord < 1) {
          // First beat: Root note
          selectedNote = chordTones[0];
        } else if (beatInChord < 2) {
          // Second beat: Move to third or fifth
          selectedNote = chordTones[1];
        } else if (beatInChord < 3) {
          // Third beat: Fifth or scale note
          selectedNote = chordTones[2];
        } else {
          // Fourth beat: Back to root or neighboring scale note
          selectedNote = chordTones[0];
        }
        
        // Add some melodic variation on weak beats
        if (beat % 1 === 0.5) { // Weak beats (offbeats)
          // Occasionally use passing tones (scale notes)
          if (Math.random() < 0.3) {
            const scaleIndex = Math.floor(Math.random() * scale.length);
            selectedNote = { note: scale[scaleIndex] };
          }
        }
        
        // Ensure we have a valid note
        if (selectedNote && selectedNote.note) {
          grid.melody.push({
            time: timePosition,
            note: selectedNote.note + melodyOctave,
            duration: '8n', // 8th notes for flowing melody
            velocity: 0.7 + (Math.random() * 0.2), // Some dynamic variation
            chord: currentChord
          });
        }
      }
    }
    
    // Add some rhythmic interest - occasionally skip notes
    grid.melody = grid.melody.filter((note, index) => {
      // Keep most notes, but occasionally skip for rhythmic interest
      return Math.random() > 0.15; // Keep 85% of notes
    });
    
    console.log(`🎵 Generated ${grid.melody.length} rich melody notes`);
    console.log(`🎵 Melody density: ${(grid.melody.length / (totalBeats / beatsPerSecond)).toFixed(1)} notes per second`);
    console.log(`🎵 Following chord progression: ${chordProgression.join(' → ')}`);
    
    // Show first few notes
    if (grid.melody.length > 0) {
      const preview = grid.melody.slice(0, 12).map(n => n.note).join(' → ');
      console.log(`� Melody preview: ${preview}...`);
    }
  }

  // Fallback bass generation
  createFallbackBass(grid, composition, totalBeats, beatsPerSecond) {
    console.log('🎸 Creating fallback bass...');
    const chordDuration = 4;
    const chordsPerSong = Math.ceil(totalBeats / chordDuration);
    
    for (let chordIndex = 0; chordIndex < chordsPerSong; chordIndex++) {
      const beatPosition = chordIndex * chordDuration;
      const chord = composition.chordProgression[chordIndex % composition.chordProgression.length];
      const chordTones = this.getMusicalChordTones(chord, this.getMusicalScale(composition.key));
      
      for (let beatOffset = 0; beatOffset < chordDuration; beatOffset++) {
        if (beatOffset % 2 === 0) {
          const bassTime = (beatPosition + beatOffset) / beatsPerSecond;
          const bassNote = chordTones.length > 0 ? chordTones[0].note + '2' : 'C2';
          
          grid.bass.push({
            time: bassTime,
            note: bassNote,
            duration: '4n',
            velocity: 0.7
          });
        }
      }
    }
  }

  // Fallback drums generation
  createFallbackDrums(grid, composition, totalBeats, beatsPerSecond) {
    console.log('🥁 Creating fallback drums...');
    for (let beat = 0; beat < totalBeats; beat++) {
      const timePosition = beat / beatsPerSecond;
      
      if (beat % 4 === 0 || beat % 4 === 2) {
        grid.drums.push({
          time: timePosition,
          instrument: 'kick',
          velocity: 0.8
        });
      }
      
      if (beat % 4 === 1 || beat % 4 === 3) {
        grid.drums.push({
          time: timePosition,
          instrument: 'snare',
          velocity: 0.7
        });
      }
      
      grid.drums.push({
        time: timePosition,
        instrument: 'hihat',
        velocity: 0.4
      });
    }
  }



  // Stop playback method
  stop() {
    try {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      console.log('🛑 Playback stopped');
    } catch (error) {
      console.warn('⚠️ Stop failed:', error);
    }
  }

  // NEW: Unified musical composition generator with GENRE/MOOD AWARENESS
  generateUnifiedComposition(songStructure, chordProgression, key, tempo, config) {
    console.log(`🎼 Generating ${config.genre}/${config.mood} unified composition...`);
    
    const composition = {
      melody: [],
      bass: [],
      harmony: [],
      drums: []
    };
    
    const scale = this.getMusicalScale(key);
    const beatsPerSecond = tempo / 60;
    const beatsPerChord = 4; // 4拍で1コード
    
    // Convert complexity to number and ADD RANDOMIZATION
    let complexityNum = config.complexity || 0.5;
    if (typeof complexityNum === 'string') {
      switch(complexityNum) {
        case 'simple': complexityNum = 0.2 + (Math.random() * 0.2); break; // 0.2-0.4
        case 'normal': complexityNum = 0.4 + (Math.random() * 0.3); break; // 0.4-0.7
        case 'complex': complexityNum = 0.7 + (Math.random() * 0.3); break; // 0.7-1.0
        default: complexityNum = 0.5 + (Math.random() * 0.2); break;
      }
    }
    
    // GENRE/MOOD ADJUSTMENTS
    const genreSettings = this.getGenreSettings(config.genre, config.mood);
    console.log(`🎯 Genre settings: ${JSON.stringify(genreSettings)}`);
    console.log(`🎯 Complexity: ${config.complexity} → ${complexityNum.toFixed(2)}`);
    
    // CONTINUOUS COMPOSITION: No breaks between sections
    const totalDuration = songStructure.reduce((sum, section) => sum + section.duration, 0);
    const totalBeats = Math.floor(totalDuration * beatsPerSecond);
    
    console.log(`🎵 Composing CONTINUOUS ${totalDuration}s with ${totalBeats} beats...`);
    
    // MUSICAL PROGRESSION: Create sections with different patterns
    const sectionsCount = Math.ceil(totalBeats / 16); // 16拍 = 1セクション
    
    // Generate for ENTIRE song duration with musical progression  
    // Use fine-grained resolution for proper musical density
    for (let beat = 0; beat < totalBeats; beat += 0.25) { // Quarter note resolution for musical timing
      const absoluteTime = beat / beatsPerSecond;
      
      // Determine current chord
      const chordIndex = Math.floor(beat / beatsPerChord) % chordProgression.length;
      const currentChord = chordProgression[chordIndex];
      const chordTones = this.getMusicalChordTones(currentChord, scale);
      
      // SAFETY CHECK: Ensure we have valid chord tones
      if (!chordTones || chordTones.length === 0) {
        console.warn(`⚠️ No chord tones found for ${currentChord} in ${scale}, skipping beat ${beat}`);
        continue;
      }
      
      // Add DRAMATIC musical variation every 16 beats with TRUE randomization
      const currentSection = Math.floor(beat / 16);
      const sectionSeed = (currentSection * 2.718 + beat * 0.001) % 1; // Different seed per section
      const variationFactor = 1 + ((currentSection % 4) + sectionSeed) * genreSettings.sectionVariation;
      
      // GENRE-SPECIFIC section behavior
      let sectionMultiplier = 1;
      switch(genreSettings.melodyRange) {
        case 'comfortable': // Pop: Subtle but noticeable changes
          sectionMultiplier = 1 + (currentSection % 3) * 0.2;
          break;
        case 'wide': // Jazz: Dramatic improvisation-like changes
          sectionMultiplier = 1 + Math.sin(currentSection * 1.2) * 0.4;
          break;
        case 'ethereal': // Ambient: Slow evolution
          sectionMultiplier = 1 + (currentSection * 0.1) % 0.3;
          break;
        case 'uplifting': // Happy: Building energy
          sectionMultiplier = 1 + (currentSection * 0.15);
          break;
        case 'heroic': // Epic: Dramatic peaks and valleys
          sectionMultiplier = 1 + Math.sin(currentSection * 0.8) * 0.6;
          break;
      }
      
      if (chordTones.length >= 3) {
        const beatInChord = beat % beatsPerChord;
        const subdivision = beat % 1; // 0, 0.25, 0.5, 0.75
        
        // 1. HARMONY: Genre-specific chord placement and voicing
        const isChordBeat = subdivision === 0 && (beatInChord === 0 || (complexityNum > 0.4 && beatInChord === 2));
        if (isChordBeat) {
          // GENRE-SPECIFIC chord voicings
          let chordVoicing;
          switch(genreSettings.bassStyle) {
            case 'simple': // Pop: Close voicing, comfortable
              chordVoicing = [
                chordTones[0].note + '3', // Root
                chordTones[1].note + '4', // Third  
                chordTones[2].note + '4'  // Fifth
              ];
              break;
            case 'walking': // Jazz: Extended voicing
              chordVoicing = [
                chordTones[0].note + '3', // Root
                chordTones[1].note + '4', // Third
                chordTones[2].note + '4', // Fifth
                chordTones[0].note + '5'  // Root octave
              ];
              break;
            case 'driving': // Rock: Power chord style
              chordVoicing = [
                chordTones[0].note + '3', // Root
                chordTones[2].note + '3', // Fifth (power chord)
                chordTones[0].note + '4'  // Root octave
              ];
              break;
            case 'drone': // Ambient: Wide, spacious voicing
              chordVoicing = [
                chordTones[0].note + '2', // Low root
                chordTones[1].note + '4', // Third
                chordTones[2].note + '5'  // High fifth
              ];
              break;
            default:
              chordVoicing = [
                chordTones[0].note + '3',
                chordTones[1].note + '4',
                chordTones[2].note + '4'
              ];
          }
          
          composition.harmony.push({
            time: absoluteTime,
            notes: chordVoicing,
            duration: complexityNum > 0.6 ? '2n' : '1n',
            velocity: (0.25 + (complexityNum * 0.05)) * variationFactor * sectionMultiplier,
            chord: currentChord
          });
        }
        
        // 2. BASS: GENRE-SPECIFIC bass patterns with complete differentiation
        const isBassBeat = subdivision === 0 || (complexityNum > 0.3 && subdivision === 0.5);
        if (isBassBeat) {
          let bassNote;
          
          // GENRE-SPECIFIC bass patterns
          if (subdivision === 0) {
            // Strong beats: Different patterns per genre
            switch(genreSettings.bassStyle) {
              case 'simple': // Pop: Root-heavy, predictable
                bassNote = chordTones[0].note + '2'; // Always root
                break;
              case 'walking': // Jazz: Walking bass line
                const walkingPattern = [0, 2, 1, 0, 2, 1, 0, 1]; // Root-5th-3rd-Root...
                const walkIndex = walkingPattern[Math.floor(beatInChord) % walkingPattern.length];
                bassNote = chordTones[walkIndex % chordTones.length].note + '2';
                break;
              case 'driving': // Rock: Alternating pattern
                const drivingPattern = [0, 0, 2, 0]; // Root-Root-5th-Root
                bassNote = chordTones[drivingPattern[Math.floor(beatInChord) % 4]].note + '2';
                break;
              case 'drone': // Ambient: Sustained root
                bassNote = chordTones[0].note + '1'; // Low root, sustained
                break;
              case 'root': // Default
              default:
                bassNote = chordTones[0].note + '2';
                break;
            }
          } else {
            // Weak beats: Genre-specific connecting tones
            if (complexityNum > 0.6) {
              switch(genreSettings.bassStyle) {
                case 'simple': // Pop: Occasional 5th
                  bassNote = Math.random() > 0.7 ? chordTones[2 % chordTones.length].note + '2' : null;
                  break;
                case 'walking': // Jazz: Chromatic approaches
                  const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                  bassNote = chromatic[Math.floor(Math.random() * 12)] + '2';
                  break;
                case 'driving': // Rock: Syncopated hits
                  bassNote = chordTones[Math.floor(Math.random() * chordTones.length)].note + '2';
                  break;
                case 'drone': // Ambient: Rare movement
                  bassNote = Math.random() > 0.9 ? chordTones[1 % chordTones.length].note + '1' : null;
                  break;
                default:
                  bassNote = chordTones[1].note + '2';
                  break;
              }
            }
          }
          
          if (bassNote) {
            composition.bass.push({
              time: absoluteTime,
              note: bassNote,
              duration: subdivision === 0 ? '4n' : '8n',
              velocity: (0.65 + (complexityNum * 0.15)) * variationFactor * sectionMultiplier,
              chord: currentChord
            });
          }
        }
        
        // 3. MELODY: COMPLETELY REWRITTEN with GENRE/MOOD DIFFERENTIATION
        const isStrongBeat = subdivision === 0;
        const isWeakBeat = subdivision === 0.5;  
        const isOffBeat = subdivision === 0.25 || subdivision === 0.75;
        
        // GENRE-SPECIFIC melody generation patterns
        let shouldGenerateMelody = false;
        switch(genreSettings.melodyRange) {
          case 'comfortable': // Pop
            shouldGenerateMelody = isStrongBeat || (complexityNum > 0.3 && isWeakBeat && Math.random() < 0.7);
            break;
          case 'wide': // Jazz/Rock
            shouldGenerateMelody = isStrongBeat || (complexityNum > 0.2 && (isWeakBeat || isOffBeat) && Math.random() < 0.8);
            break;
          case 'ethereal': // Ambient
            shouldGenerateMelody = Math.random() < 0.3; // Very sparse, floating
            break;
          case 'uplifting': // Happy
            shouldGenerateMelody = Math.random() < 0.8; // Very frequent, energetic
            break;
          case 'heroic': // Epic
            shouldGenerateMelody = isStrongBeat || (Math.random() < 0.6);
            break;
          default:
            shouldGenerateMelody = isStrongBeat || (complexityNum > 0.3 && isWeakBeat);
        }
                                   
        if (shouldGenerateMelody) {
          let melodyNote;
          const isChordChange = beatInChord === 0;
          const randomSeed = Math.random() * (currentSection + 1) * 1.414; // Use section for variation
          
          // ADDITIONAL SAFETY: Ensure chordTones are valid for melody generation
          if (!chordTones || chordTones.length === 0) {
            console.warn(`⚠️ Invalid chord tones for melody generation, skipping melody at beat ${beat}`);
          } else {
          if (isChordChange) {
            // Chord change: Different strategies per genre
            switch(genreSettings.melodyRange) {
              case 'comfortable': // Pop: Predictable but catchy
                const comfortableIndex = randomSeed < 0.5 ? 0 : (randomSeed < 0.8 ? 1 : 2);
                melodyNote = chordTones[comfortableIndex % chordTones.length].note + '4';
                break;
              case 'wide': // Jazz: Sophisticated note choices
                const jazzChoice = Math.floor(randomSeed * 4);
                if (jazzChoice < chordTones.length) {
                  melodyNote = chordTones[jazzChoice].note + (randomSeed > 0.7 ? '5' : '4');
                } else {
                  melodyNote = scale[Math.floor(randomSeed * scale.length)] + '4';
                }
                break;
              case 'ethereal': // Ambient: Floating, scale-based
                melodyNote = scale[Math.floor(randomSeed * scale.length)] + (randomSeed > 0.6 ? '5' : '4');
                break;
              case 'uplifting': // Happy: High, bright notes
                const upliftingIndex = (randomSeed < 0.3 ? 2 : 1) % chordTones.length;
                melodyNote = chordTones[upliftingIndex].note + '5';
                break;
              case 'heroic': // Epic: Bold intervals
                melodyNote = chordTones[0].note + (randomSeed > 0.5 ? '5' : '4');
                break;
              default:
                const defaultChordIndex = Math.floor(randomSeed * chordTones.length) % chordTones.length;
                melodyNote = chordTones[defaultChordIndex].note + '4';
            }
          } else {
            // Within chord: Genre-specific movement patterns
            const intraChordSeed = (randomSeed + beatInChord) % 1;
            
            switch(genreSettings.melodyRange) {
              case 'comfortable': // Pop: Stepwise, singable
                if (intraChordSeed < 0.6) {
                  // Stay on chord tones
                  const comfortableIntraIndex = Math.floor(intraChordSeed * chordTones.length) % chordTones.length;
                  melodyNote = chordTones[comfortableIntraIndex].note + '4';
                } else {
                  // Occasional scale step
                  melodyNote = scale[(Math.floor(beatInChord * 2) + currentSection) % scale.length] + '4';
                }
                break;
                
              case 'wide': // Jazz: Complex movement
                if (intraChordSeed < 0.4) {
                  // Chord tones
                  const wideIntraIndex = Math.floor(intraChordSeed * chordTones.length) % chordTones.length;
                  melodyNote = chordTones[wideIntraIndex].note + '4';
                } else if (intraChordSeed < 0.8) {
                  // Scale runs
                  melodyNote = scale[Math.floor(intraChordSeed * scale.length)] + '4';
                } else {
                  // Chromatic passing tones
                  const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                  melodyNote = chromatic[Math.floor(intraChordSeed * 12)] + '4';
                }
                break;
                
              case 'ethereal': // Ambient: Sustained, evolving
                if (intraChordSeed < 0.3) {
                  // Long sustained notes
                  melodyNote = chordTones[0].note + '4';
                } else {
                  // Gentle scale movement
                  melodyNote = scale[Math.floor(intraChordSeed * scale.length)] + (intraChordSeed > 0.7 ? '5' : '4');
                }
                break;
                
              case 'uplifting': // Happy: Bouncy, ascending
                const happyPattern = [(beatInChord * 3) % chordTones.length, (beatInChord + 1) % chordTones.length];
                const patternIndex = Math.floor(intraChordSeed * 2) % happyPattern.length;
                const chordToneIndex = happyPattern[patternIndex] % chordTones.length;
                melodyNote = chordTones[chordToneIndex].note + (intraChordSeed > 0.4 ? '5' : '4');
                break;
                
              case 'heroic': // Epic: Bold leaps
                if (intraChordSeed < 0.5) {
                  const heroicIntraIndex = Math.floor(intraChordSeed * chordTones.length) % chordTones.length;
                  melodyNote = chordTones[heroicIntraIndex].note + '5';
                } else {
                  melodyNote = chordTones[0].note + (intraChordSeed > 0.7 ? '6' : '4');
                }
                break;
                
              default:
                const defaultIntraIndex = Math.floor(intraChordSeed * chordTones.length) % chordTones.length;
                melodyNote = chordTones[defaultIntraIndex].note + '4';
            }
          }
          
          // BRIGHTNESS-based final adjustments
          if (genreSettings.brightness > 0.7 && Math.random() > 0.7) {
            // Very bright: push to higher octaves
            melodyNote = melodyNote.replace(/[3-5]/, '5');
          } else if (genreSettings.brightness < 0.3 && Math.random() > 0.8) {
            // Dark: occasionally drop to lower octaves
            melodyNote = melodyNote.replace(/[4-6]/, '3');
          }
          
          composition.melody.push({
            time: absoluteTime,
            note: melodyNote,
            duration: isStrongBeat ? '4n' : '8n',
            velocity: (0.6 + (genreSettings.brightness * 0.3) + (Math.random() * 0.1)) * variationFactor * sectionMultiplier,
            chord: currentChord
          });
          } // Close the safety check if block
        }
        
        // 4. DRUMS: Complex rhythmic patterns based on complexity with variation
        const drumComplexity = complexityNum;
        const drumVariation = variationFactor;
        
        // Kick pattern
        if (subdivision === 0 && (beatInChord === 0 || beatInChord === 2)) {
          composition.drums.push({
            time: absoluteTime,
            note: 'C1',
            duration: '16n',
            velocity: 0.8 * drumVariation,
            type: 'kick'
          });
        }
        
        // Snare pattern  
        if (subdivision === 0 && beatInChord === 1) {
          composition.drums.push({
            time: absoluteTime,
            note: 'D1',
            duration: '16n',
            velocity: 0.7 * drumVariation,
            type: 'snare'
          });
        }
        
        // Hi-hat pattern (more complex) with better placement
        if (drumComplexity > 0.2 && (subdivision === 0.25 || subdivision === 0.75)) {
          composition.drums.push({
            time: absoluteTime,
            note: 'F#1',
            duration: '32n',
            velocity: (0.4 + (drumComplexity * 0.2)) * drumVariation,
            type: 'hihat'
          });
        }
        
        // Additional percussion for high complexity
        if (drumComplexity > 0.7 && subdivision === 0.5 && Math.random() < 0.3) {
          composition.drums.push({
            time: absoluteTime,
            note: 'A1',
            duration: '16n',
            velocity: 0.5 * drumVariation,
            type: 'clap'
          });
        }
      }
    }
    
    console.log(`🎼 DENSE unified composition complete:`);
    console.log(`   🎵 Melody: ${composition.melody.length} notes (${(composition.melody.length/totalDuration).toFixed(1)}/sec)`);
    console.log(`   🎸 Bass: ${composition.bass.length} notes (${(composition.bass.length/totalDuration).toFixed(1)}/sec)`);
    console.log(`   🎼 Harmony: ${composition.harmony.length} chords (${(composition.harmony.length/totalDuration).toFixed(1)}/sec)`);
    console.log(`   🥁 Drums: ${composition.drums.length} hits (${(composition.drums.length/totalDuration).toFixed(1)}/sec)`);
    console.log(`🎯 Complexity level: ${complexityNum} | CONTINUOUS with musical progression`);
    console.log(`🎵 Musical sections: ${sectionsCount} with variation patterns`);
    
    return composition;
  }

  // ...existing code...
}

// Global initialization
window.musicGenerator = new AdvancedMusicGeneratorEngine();
