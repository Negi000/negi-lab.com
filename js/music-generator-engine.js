// Fixed Music Generator Engine with proper music theory

const MusicGeneratorEngine = (() => {
  console.log('🎵 Initializing Fixed MusicGeneratorEngine...');
  
  const reverb = new Tone.Reverb().toDestination();
  // Much lower initial volume
  const masterVolume = new Tone.Volume(-24).toDestination();
  reverb.connect(masterVolume);
  
  let instruments = {};
  let lastGeneratedMusic = null;
  
  console.log('🔧 Tone.js version:', Tone.version);

  // Advanced Music Theory with AI-Inspired Probabilistic Generation
  const musicRulebook = {
    scales: {
      major: { name: 'major', intervals: ['1P', '2M', '3M', '4P', '5P', '6M', '7M'] },
      natural_minor: { name: 'natural minor', intervals: ['1P', '2M', '3m', '4P', '5P', '6m', '7m'] },
      dorian: { name: 'dorian', intervals: ['1P', '2M', '3m', '4P', '5P', '6M', '7m'] },
      pentatonic: { name: 'pentatonic', intervals: ['1P', '2M', '3M', '5P', '6M'] },
      blues: { name: 'blues', intervals: ['1P', '3m', '4P', '5d', '5P', '7m'] },
      mixolydian: { name: 'mixolydian', intervals: ['1P', '2M', '3M', '4P', '5P', '6M', '7m'] },
      harmonic_minor: { name: 'harmonic minor', intervals: ['1P', '2M', '3m', '4P', '5P', '6m', '7M'] },
      melodic_minor: { name: 'melodic minor', intervals: ['1P', '2M', '3m', '4P', '5P', '6M', '7M'] }
    },
    
    // Advanced probabilistic chord progressions (research-based)
    chordTransitions: {
      major: {
        'I': { 'V': 0.35, 'vi': 0.25, 'IV': 0.2, 'ii': 0.12, 'iii': 0.05, 'bVII': 0.03 },
        'V': { 'I': 0.45, 'vi': 0.25, 'IV': 0.15, 'iii': 0.08, 'ii': 0.05, 'V7': 0.02 },
        'vi': { 'IV': 0.35, 'V': 0.25, 'I': 0.15, 'ii': 0.15, 'iii': 0.07, 'bVII': 0.03 },
        'IV': { 'V': 0.4, 'I': 0.25, 'vi': 0.15, 'ii': 0.1, 'bVII': 0.07, 'iii': 0.03 },
        'ii': { 'V': 0.5, 'vi': 0.2, 'IV': 0.15, 'I': 0.1, 'iii': 0.03, 'vii°': 0.02 },
        'iii': { 'vi': 0.4, 'IV': 0.25, 'V': 0.15, 'I': 0.1, 'ii': 0.07, 'vii°': 0.03 }
      },
      minor: {
        'i': { 'v': 0.3, 'VI': 0.25, 'iv': 0.2, 'ii°': 0.12, 'III': 0.08, 'VII': 0.05 },
        'v': { 'i': 0.4, 'VI': 0.25, 'iv': 0.15, 'III': 0.1, 'ii°': 0.07, 'VII': 0.03 },
        'VI': { 'iv': 0.35, 'v': 0.25, 'i': 0.15, 'ii°': 0.15, 'III': 0.07, 'VII': 0.03 },
        'iv': { 'v': 0.4, 'i': 0.25, 'VI': 0.15, 'ii°': 0.1, 'VII': 0.07, 'III': 0.03 },
        'ii°': { 'v': 0.5, 'VI': 0.2, 'iv': 0.15, 'i': 0.1, 'III': 0.03, 'VII': 0.02 },
        'III': { 'VI': 0.4, 'iv': 0.25, 'v': 0.15, 'i': 0.1, 'ii°': 0.07, 'VII': 0.03 }
      }
    },
    
    // Advanced melodic interval probabilities (based on cognitive music research)
    melodicIntervals: {
      unison: 0.12,      // Stay on same note
      second: 0.38,      // Step up/down (most common)
      third: 0.28,       // Small leap
      fourth: 0.12,      // Medium leap
      fifth: 0.06,       // Large leap
      sixth: 0.03,       // Rare large leap
      octave: 0.01       // Octave jump (rare)
    },
    
    // Enhanced genre-specific characteristics with AI parameters
    genreProfiles: {
      pop: {
        chordDensity: 1,        
        melodyDensity: 0.75,    
        rhythmComplexity: 0.3,  
        harmonicComplexity: 0.4, 
        preferredScale: 'major',
        aiCreativity: 0.6,      // Moderate creativity
        coherence: 0.8,         // High coherence
        emotionalRange: [0.4, 0.9] // Positive emotions
      },
      electronic: {
        chordDensity: 0.8,
        melodyDensity: 0.9,
        rhythmComplexity: 0.7,
        harmonicComplexity: 0.6,
        preferredScale: 'mixolydian',
        aiCreativity: 0.8,      // High creativity
        coherence: 0.6,         // Moderate coherence
        emotionalRange: [0.6, 1.0] // High energy
      },
      jazz: {
        chordDensity: 2,
        melodyDensity: 1.2,
        rhythmComplexity: 0.8,
        harmonicComplexity: 0.9,
        preferredScale: 'mixolydian',
        aiCreativity: 0.9,      // Maximum creativity
        coherence: 0.7,         // Good coherence
        emotionalRange: [0.3, 0.8] // Wide range
      },
      blues: {
        chordDensity: 0.5,
        melodyDensity: 0.6,
        rhythmComplexity: 0.6,
        harmonicComplexity: 0.3,
        preferredScale: 'blues',
        aiCreativity: 0.7,      
        coherence: 0.9,         // Very coherent
        emotionalRange: [0.2, 0.7] // Melancholic to hopeful
      },
      folk: {
        chordDensity: 0.5,
        melodyDensity: 0.8,
        rhythmComplexity: 0.2,
        harmonicComplexity: 0.2,
        preferredScale: 'major',
        aiCreativity: 0.5,      // Conservative creativity
        coherence: 0.9,         // Very coherent
        emotionalRange: [0.3, 0.8] // Calm to uplifting
      },
      rock: {
        chordDensity: 1,
        melodyDensity: 0.9,
        rhythmComplexity: 0.5,
        harmonicComplexity: 0.3,
        preferredScale: 'mixolydian',
        aiCreativity: 0.7,      
        coherence: 0.8,         
        emotionalRange: [0.6, 0.95] // Energetic
      },
      classical: {
        chordDensity: 1.5,
        melodyDensity: 1.0,
        rhythmComplexity: 0.7,
        harmonicComplexity: 0.8,
        preferredScale: 'major',
        aiCreativity: 0.8,      
        coherence: 0.9,         // Very structured
        emotionalRange: [0.2, 0.9] // Full emotional range
      },
      ambient: {
        chordDensity: 0.3,
        melodyDensity: 0.4,
        rhythmComplexity: 0.2,
        harmonicComplexity: 0.5,
        preferredScale: 'pentatonic',
        aiCreativity: 0.6,      
        coherence: 0.7,         
        emotionalRange: [0.1, 0.6] // Calm and peaceful
      },
      cinematic: {
        chordDensity: 1.2,
        melodyDensity: 0.8,
        rhythmComplexity: 0.6,
        harmonicComplexity: 0.7,
        preferredScale: 'harmonic minor',
        aiCreativity: 0.8,      
        coherence: 0.8,         
        emotionalRange: [0.2, 0.9] // Wide emotional range for film
      }
    },
    
    // Advanced mood-based parameters with AI integration
    moodProfiles: {
      happy: { tempo: [110, 140], dynamics: 0.8, brightness: 0.9, energy: 0.8, tension: 0.2, aiVariation: 0.3 },
      sad: { tempo: [60, 90], dynamics: 0.4, brightness: 0.3, energy: 0.3, tension: 0.6, aiVariation: 0.4 },
      calm: { tempo: [70, 100], dynamics: 0.5, brightness: 0.6, energy: 0.4, tension: 0.2, aiVariation: 0.2 },
      energetic: { tempo: [120, 160], dynamics: 0.9, brightness: 0.8, energy: 0.9, tension: 0.3, aiVariation: 0.4 },
      mysterious: { tempo: [80, 110], dynamics: 0.6, brightness: 0.4, energy: 0.5, tension: 0.7, aiVariation: 0.5 },
      romantic: { tempo: [80, 120], dynamics: 0.7, brightness: 0.7, energy: 0.6, tension: 0.3, aiVariation: 0.3 },
      melancholic: { tempo: [65, 95], dynamics: 0.5, brightness: 0.4, energy: 0.4, tension: 0.8, aiVariation: 0.4 },
      uplifting: { tempo: [100, 130], dynamics: 0.8, brightness: 0.9, energy: 0.8, tension: 0.2, aiVariation: 0.3 },
      aggressive: { tempo: [140, 180], dynamics: 0.9, brightness: 0.6, energy: 0.95, tension: 0.8, aiVariation: 0.5 }
    },
    
    // AI-powered harmonic extensions
    harmonicExtensions: {
      simple: ['', 'm', 'dim'],
      moderate: ['', 'm', 'dim', '7', 'm7', 'maj7'],
      complex: ['', 'm', 'dim', '7', 'm7', 'maj7', '9', 'm9', '11', '13', 'sus2', 'sus4'],
      jazz: ['7', 'm7', 'maj7', '9', 'm9', '11', '13', 'dim7', 'alt', 'add9']
    },
    
    keys: ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'F#', 'C#']
  };

  // Instrument Management
  function loadInstruments(instrumentsList = null) {
    console.log('🎺 Loading instruments from CDN:', instrumentsList);
    
    // CDN compatible instruments (verified from tonejs-instruments README)
    const defaultInstruments = [
      'piano', 'guitar-acoustic', 'violin', 'bass-electric', 
      'cello', 'flute', 'trumpet', 'saxophone', 'clarinet',
      'guitar-electric', 'harmonium', 'harp', 'organ',
      'french-horn', 'trombone', 'tuba', 'contrabass', 'bassoon'
    ];
    
    const instrumentsToLoad = instrumentsList || defaultInstruments;
    
    return new Promise((resolve, reject) => {
      if (!window.SampleLibrary) {
        console.warn('❌ SampleLibrary not found, creating fallback instruments');
        createFallbackInstruments();
        createDrumKit();
        createSynthesizers();
        resolve(instruments);
        return;
      }

      try {
        console.log('🔧 Setting SampleLibrary baseUrl to CDN');
        console.log('🎺 Attempting to load:', instrumentsToLoad);
        
        const loadedInstruments = SampleLibrary.load({
          instruments: instrumentsToLoad,
          baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/',
          minify: true,
          ext: '.[mp3|ogg]'
        });
        
        console.log('🎺 SampleLibrary.load returned:', loadedInstruments);
        console.log('🎺 Type of loadedInstruments:', typeof loadedInstruments);
        console.log('🎺 Keys available:', loadedInstruments ? Object.keys(loadedInstruments) : 'null/undefined');
        
        // Wait for loading completion with error handling
        let loadTimeout;
        
        const loadPromise = new Promise((resolveLoad, rejectLoad) => {
          loadTimeout = setTimeout(() => {
            console.warn('⏰ CDN loading timeout, switching to fallback');
            rejectLoad(new Error('CDN loading timeout'));
          }, 10000); // 10 second timeout
          
          // Check if instruments are immediately available
          if (loadedInstruments && typeof loadedInstruments === 'object' && Object.keys(loadedInstruments).length > 0) {
            console.log('✅ Instruments immediately available:', Object.keys(loadedInstruments));
            
            // Verify each instrument is valid
            let validInstruments = {};
            Object.keys(loadedInstruments).forEach(name => {
              const instrument = loadedInstruments[name];
              if (instrument && typeof instrument === 'object' && instrument.triggerAttackRelease) {
                validInstruments[name] = instrument;
                console.log(`✅ Valid instrument found: ${name}`);
              } else {
                console.warn(`⚠️ Invalid instrument: ${name}`, instrument);
              }
            });
            
            if (Object.keys(validInstruments).length > 0) {
              clearTimeout(loadTimeout);
              resolveLoad(validInstruments);
              return;
            }
          }
          
          // Wait for Tone.Buffer loading
          const checkLoaded = () => {
            try {
              if (loadedInstruments && Object.keys(loadedInstruments).length > 0) {
                // Verify at least one instrument is loaded
                const firstInstrument = Object.values(loadedInstruments)[0];
                if (firstInstrument && firstInstrument.loaded !== false) {
                  console.log('✅ Instruments loaded via Buffer callback');
                  clearTimeout(loadTimeout);
                  resolveLoad(loadedInstruments);
                  return;
                }
              }
              
              // Try again in 500ms
              setTimeout(checkLoaded, 500);
              
            } catch (error) {
              console.warn('⚠️ Error checking instrument load status:', error);
              clearTimeout(loadTimeout);
              rejectLoad(error);
            }
          };
          
          // Start checking
          setTimeout(checkLoaded, 100);
        });
        
        try {
          loadPromise.then(finalInstruments => {
            // Process loaded instruments
            Object.keys(finalInstruments).forEach(name => {
              instruments[name] = finalInstruments[name];
              
              // Add volume control to each instrument
              const instrumentVolume = new Tone.Volume(-6);
              instruments[name].connect(instrumentVolume);
              instrumentVolume.connect(reverb);
              
              console.log(`✅ Connected CDN instrument: ${name}`);
            });
            
            // Add emergency synth as fallback
            instruments.emergency = new Tone.PolySynth(Tone.Synth).connect(reverb);
            
            // Create comprehensive drum kit using Tone.js synthesizers
            createDrumKit();
            
            // Add versatile synthesizers for electronic elements
            createSynthesizers();
            
            console.log('✅ Emergency instruments ready');
            console.log('📊 Final instrument list:', Object.keys(instruments));
            
            resolve(instruments);
            
          }).catch(loadError => {
            console.warn('❌ CDN loading failed:', loadError.message);
            console.log('🔄 Switching to fallback instruments...');
            createFallbackInstruments();
            
            // Add drum kit and synthesizers even for fallback
            createDrumKit();
            createSynthesizers();
            
            resolve(instruments);
          });
          
        } catch (loadError) {
          console.warn('❌ CDN loading failed:', loadError.message);
          createFallbackInstruments();
          createDrumKit();
          createSynthesizers();
          resolve(instruments);
        }
        
      } catch (error) {
        console.error('❌ Error loading instruments from CDN:', error);
        createFallbackInstruments();
        createDrumKit();
        createSynthesizers();
        resolve(instruments);
      }
    });
  }

  // Create fallback instruments when SampleLibrary fails
  function createFallbackInstruments() {
    console.log('🔧 Creating verified fallback instruments...');
    
    const fallbackVolume = new Tone.Volume(-12);
    fallbackVolume.connect(reverb);
    
    // Create fallback instruments with verified names
    instruments.piano = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments['guitar-acoustic'] = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments['bass-electric'] = new Tone.MonoSynth().connect(fallbackVolume);
    instruments.violin = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.cello = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.flute = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.trumpet = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.saxophone = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.clarinet = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments['guitar-electric'] = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.harmonium = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.harp = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.organ = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments['french-horn'] = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.trombone = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.tuba = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.contrabass = new Tone.MonoSynth().connect(fallbackVolume);
    instruments.bassoon = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    instruments.emergency = new Tone.PolySynth(Tone.Synth).connect(fallbackVolume);
    
    console.log('✅ Verified fallback instruments created');
  }

  // Create comprehensive drum kit using Tone.js synthesizers
  function createDrumKit() {
    console.log('🥁 Creating comprehensive drum kit...');
    
    const drumVolume = new Tone.Volume(-8);
    drumVolume.connect(reverb);
    
    // Kick drum - deep, punchy low frequency
    instruments.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
    }).connect(drumVolume);
    
    // Snare drum - crisp, mid-range hit
    instruments.snare = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.0, release: 0.4 }
    }).connect(drumVolume);
    
    // Hi-hat closed - sharp, short metallic sound
    instruments.hihat = new Tone.MetalSynth({
      frequency: 400,
      envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).connect(drumVolume);
    
    // Hi-hat open - longer metallic ring
    instruments.hihatOpen = new Tone.MetalSynth({
      frequency: 400,
      envelope: { attack: 0.001, decay: 0.3, release: 0.3 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    }).connect(drumVolume);
    
    // Crash cymbal - explosive metallic crash
    instruments.crash = new Tone.MetalSynth({
      frequency: 300,
      envelope: { attack: 0.001, decay: 1, release: 3 },
      harmonicity: 12,
      modulationIndex: 64,
      resonance: 4000,
      octaves: 1.5
    }).connect(drumVolume);
    
    // Ride cymbal - sustained metallic ring
    instruments.ride = new Tone.MetalSynth({
      frequency: 800,
      envelope: { attack: 0.001, decay: 0.5, release: 0.8 },
      harmonicity: 5.1,
      modulationIndex: 16,
      resonance: 4000,
      octaves: 1
    }).connect(drumVolume);
    
    // Tom drums - tuned membrane sounds
    instruments.tomHigh = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.3, sustain: 0.01, release: 0.8 }
    }).connect(drumVolume);
    
    instruments.tomMid = new Tone.MembraneSynth({
      pitchDecay: 0.012,
      octaves: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.0 }
    }).connect(drumVolume);
    
    instruments.tomLow = new Tone.MembraneSynth({
      pitchDecay: 0.016,
      octaves: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.5, sustain: 0.01, release: 1.2 }
    }).connect(drumVolume);
    
    // Percussion elements
    instruments.clap = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.005, decay: 0.15, sustain: 0.0, release: 0.3 }
    }).connect(drumVolume);
    
    instruments.rimshot = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0.0, release: 0.1 }
    }).connect(drumVolume);
    
    console.log('✅ Comprehensive drum kit created');
  }
  
  // Create versatile synthesizers for electronic elements
  function createSynthesizers() {
    console.log('🎹 Creating versatile synthesizers...');
    
    const synthVolume = new Tone.Volume(-10);
    synthVolume.connect(reverb);
    
    // Lead synthesizer - bright, cutting lead sounds
    instruments.synthLead = new Tone.MonoSynth({
      oscillator: { type: "sawtooth" },
      filterEnvelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.8 },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.9, release: 0.8 }
    }).connect(synthVolume);
    
    // Pad synthesizer - warm, atmospheric pads
    instruments.synthPad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.5, decay: 0.3, sustain: 0.7, release: 2.0 }
    }).connect(synthVolume);
    
    // Bass synthesizer - deep, powerful bass
    instruments.synthBass = new Tone.MonoSynth({
      oscillator: { type: "square" },
      filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.5 },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.3 }
    }).connect(synthVolume);
    
    // Arp synthesizer - rhythmic, sequenced sounds
    instruments.synthArp = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 }
    }).connect(synthVolume);
    
    // Pluck synthesizer - percussive, plucked sounds
    instruments.synthPluck = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.9
    }).connect(synthVolume);
    
    // FM synthesizer - complex, bell-like tones
    instruments.synthFM = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.8 },
      modulation: { type: "square" },
      modulationEnvelope: { attack: 0.5, decay: 0.0, sustain: 1, release: 0.5 }
    }).connect(synthVolume);
    
    // AM synthesizer - tremolo and amplitude modulation effects
    instruments.synthAM = new Tone.AMSynth({
      harmonicity: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.8 },
      modulation: { type: "square" },
      modulationEnvelope: { attack: 0.5, decay: 0.0, sustain: 1, release: 0.5 }
    }).connect(synthVolume);
    
    console.log('✅ Versatile synthesizers created');
  }
  
  // Advanced AI-Inspired Markov Chain for Music Generation
  class AdvancedMarkovChain {
    constructor(order = 2) {
      this.order = order;
      this.chains = {};
      this.contexts = new Map();
    }
    
    // Train the chain with musical sequences
    train(sequence, weight = 1) {
      for (let i = 0; i < sequence.length - this.order; i++) {
        const context = sequence.slice(i, i + this.order).join('|');
        const next = sequence[i + this.order];
        
        if (!this.chains[context]) {
          this.chains[context] = {};
        }
        
        if (!this.chains[context][next]) {
          this.chains[context][next] = 0;
        }
        
        this.chains[context][next] += weight;
      }
    }
    
    // Generate next element based on context
    generate(context, creativity = 0.5) {
      const contextKey = context.slice(-this.order).join('|');
      const options = this.chains[contextKey];
      
      if (!options) {
        return null;
      }
      
      // Apply creativity factor
      const entries = Object.entries(options);
      if (creativity > 0.7) {
        // High creativity: flatten probability distribution
        const avgWeight = entries.reduce((sum, [, weight]) => sum + weight, 0) / entries.length;
        entries.forEach(([note, weight], index) => {
          entries[index][1] = weight * 0.3 + avgWeight * 0.7;
        });
      }
      
      // Weighted random selection
      const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
      let random = Math.random() * total;
      
      for (const [note, weight] of entries) {
        random -= weight;
        if (random <= 0) {
          return note;
        }
      }
      
      return entries[0][0]; // Fallback
    }
  }

  // Enhanced probabilistic chord progression generator with AI creativity
  function createChordProgression(genre, mood, length, key, scaleName, complexity = 0.7) {
    console.log(`🎼 Generating AI-enhanced chord progression for ${genre}/${mood} in ${key} ${scaleName}`);
    
    try {
      const scaleNotes = Tonal.Scale.get(`${key} ${scaleName}`).notes;
      if (!scaleNotes || scaleNotes.length === 0) {
        throw new Error(`Invalid scale: ${key} ${scaleName}`);
      }
      
      const genreProfile = musicRulebook.genreProfiles[genre] || musicRulebook.genreProfiles.pop;
      const moodProfile = musicRulebook.moodProfiles[mood] || musicRulebook.moodProfiles.happy;
      
      const isMinor = scaleName.includes('minor');
      const transitions = isMinor ? 
        musicRulebook.chordTransitions.minor : 
        musicRulebook.chordTransitions.major;
      
      // Start with tonic chord
      let currentChord = isMinor ? 'i' : 'I';
      const progression = [currentChord];
      
      // AI-enhanced generation with creativity parameter
      const creativity = genreProfile.aiCreativity || 0.6;
      
      // Generate progression using enhanced Markov chain with AI creativity
      for (let i = 1; i < length; i++) {
        const possibleChords = transitions[currentChord];
        if (!possibleChords) {
          currentChord = isMinor ? 'i' : 'I';
          progression.push(currentChord);
          continue;
        }
        
        // Apply AI creativity to chord selection
        const entries = Object.entries(possibleChords);
        let modifiedProbs = {};
        
        if (creativity > 0.7 && Math.random() < 0.3) {
          // High creativity: occasionally introduce unexpected chords
          const unusualChords = isMinor ? ['VII', 'bVI', 'iv'] : ['bVII', 'vi', 'iii'];
          const unusualChord = unusualChords[Math.floor(Math.random() * unusualChords.length)];
          if (Math.random() < 0.2) {
            currentChord = unusualChord;
            progression.push(currentChord);
            continue;
          }
        }
        
        // Weighted random selection with mood influence
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [nextChord, probability] of entries) {
          // Adjust probability based on mood tension
          let adjustedProb = probability;
          if (moodProfile.tension > 0.6) {
            // High tension moods prefer more dissonant progressions
            if (['ii°', 'vii°', 'iii'].includes(nextChord)) {
              adjustedProb *= 1.5;
            }
          }
          
          cumulative += adjustedProb;
          if (rand <= cumulative) {
            currentChord = nextChord;
            break;
          }
        }
        
        progression.push(currentChord);
      }
      
      // Ensure proper resolution (AI coherence)
      if (genreProfile.coherence > 0.7 && progression.length > 2) {
        // Force dominant-tonic resolution at the end
        const dominantChord = isMinor ? 'v' : 'V';
        const tonicChord = isMinor ? 'i' : 'I';
        progression[progression.length - 2] = dominantChord;
        progression[progression.length - 1] = tonicChord;
      }
      
      // Convert Roman numerals to actual chords with harmonic extensions
      const romanToIndex = {
        'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
        'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6,
        'ii°': 1, 'vii°': 6, 'bVII': 6, 'bVI': 5
      };
      
      // Determine harmonic complexity level
      let harmonicLevel = 'simple';
      if (genreProfile.harmonicComplexity > 0.7) harmonicLevel = 'complex';
      else if (genreProfile.harmonicComplexity > 0.4) harmonicLevel = 'moderate';
      if (genre === 'jazz') harmonicLevel = 'jazz';
      
      const extensions = musicRulebook.harmonicExtensions[harmonicLevel];
      
      const actualChords = progression.map((romanChord, index) => {
        const scaleIndex = romanToIndex[romanChord];
        if (scaleIndex === undefined) {
          console.warn(`Unknown roman numeral: ${romanChord}, using tonic`);
          return scaleNotes[0]; // Fallback to tonic
        }
        
        // Ensure we don't go out of bounds for the scale
        const noteIndex = Math.min(scaleIndex, scaleNotes.length - 1);
        const rootNote = scaleNotes[noteIndex];
        
        // Determine chord quality with extensions
        let chordSymbol;
        if (isMinor) {
          const minorQualities = ['m', 'dim', 'M', 'm', 'm', 'M', 'M'];
          let quality = minorQualities[Math.min(noteIndex, minorQualities.length - 1)];
          
          // Add extensions based on complexity
          if (extensions.length > 3 && Math.random() < genreProfile.harmonicComplexity) {
            const extension = extensions[Math.floor(Math.random() * extensions.length)];
            if (extension && extension !== '') {
              quality = extension;
            }
          }
          
          chordSymbol = rootNote + (quality === 'M' ? '' : quality === 'dim' ? 'dim' : quality);
        } else {
          const majorQualities = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];
          let quality = majorQualities[Math.min(noteIndex, majorQualities.length - 1)];
          
          // Add extensions based on complexity
          if (extensions.length > 3 && Math.random() < genreProfile.harmonicComplexity) {
            const extension = extensions[Math.floor(Math.random() * extensions.length)];
            if (extension && extension !== '') {
              quality = extension;
            }
          }
          
          chordSymbol = rootNote + (quality === 'M' ? '' : quality === 'dim' ? 'dim' : quality);
        }
        
        return chordSymbol;
      });
      
      console.log(`🎵 AI-generated progression: ${progression.join('-')} → ${actualChords.join('-')}`);
      return actualChords;
      
    } catch (error) {
      console.error('Failed to create AI chord progression:', error);
      // Fallback progression
      return ['C', 'Am', 'F', 'G'].slice(0, length);
    }
  }

  // Create professional chord accompaniment with consistent rhythm and voicing
  function createChordPart(progression, rhythmPattern = 'steady') {
    console.log('🎹 Creating professional chord accompaniment');
    let chordPart = [];
    
    // Define consistent rhythm patterns
    const rhythmPatterns = {
      'steady': [
        { beat: 0, duration: '1n' }  // Simple whole note pattern
      ],
      'waltz': [
        { beat: 0, duration: '4n' },
        { beat: 2, duration: '4n' },
        { beat: 3, duration: '4n' }
      ],
      'ballad': [
        { beat: 0, duration: '2n' },
        { beat: 2, duration: '2n' }
      ]
    };
    
    const selectedPattern = rhythmPatterns[rhythmPattern] || rhythmPatterns['steady'];
    
    progression.forEach((chordName, measureIndex) => {
      const chord = Tonal.Chord.get(chordName);
      let notes = chord.notes;
      
      // Fallback if chord is invalid
      if (!notes || notes.length === 0) {
        console.warn(`Invalid chord: ${chordName}, using C major`);
        notes = ['C', 'E', 'G'];
      }
      
      // Create professional voicing with smooth voice leading
      let voicedNotes;
      if (notes.length >= 3) {
        // Use consistent close voicing for better sound
        voicedNotes = [
          notes[0] + '3',  // Root in bass clef
          notes[1] + '4',  // Third in treble
          notes[2] + '4'   // Fifth in treble
        ];
      } else {
        voicedNotes = notes.map((note, index) => {
          const octave = 3 + Math.floor(index / 2);
          return note + octave;
        });
      }
      
      // Apply the consistent rhythm pattern
      selectedPattern.forEach(({ beat, duration }) => {
        chordPart.push({
          time: `${measureIndex}:${beat}:0`,
          notes: voicedNotes,
          duration: duration
        });
      });
    });
    
    console.log(`🎹 Generated ${chordPart.length} chord events with professional voicing`);
    return chordPart;
  }

  // AI-enhanced melodic generation with advanced algorithms
  function createMelody(progression, scale, key, genre, mood, complexity = 0.7) {
    console.log(`🎵 Generating AI-enhanced melody for ${key} ${scale.name} (${genre}/${mood})`);
    
    let melody = [];
    const scaleNotes = Tonal.Scale.get(`${key} ${scale.name || 'major'}`).notes;
    if (!scaleNotes || scaleNotes.length === 0) {
      console.error('Invalid scale for melody generation');
      return [];
    }
    
    console.log(`🎼 Scale notes:`, scaleNotes);
    
    // Get enhanced profiles
    const genreProfile = musicRulebook.genreProfiles[genre] || musicRulebook.genreProfiles.pop;
    const moodProfile = musicRulebook.moodProfiles[mood] || musicRulebook.moodProfiles.happy;
    
    // Initialize AI-powered Markov chain for melody
    const melodyMarkov = new AdvancedMarkovChain(2);
    
    // Train with genre-specific patterns
    const trainingPatterns = {
      pop: [
        ['C', 'D', 'E', 'G', 'E', 'D', 'C'],
        ['G', 'E', 'C', 'D', 'E', 'G'],
        ['E', 'D', 'C', 'E', 'G', 'F', 'E']
      ],
      jazz: [
        ['C', 'E', 'G', 'B', 'A', 'F', 'D'],
        ['G', 'B', 'D', 'F', 'E', 'C'],
        ['F', 'A', 'C', 'E', 'D', 'B', 'G']
      ],
      blues: [
        ['C', 'Eb', 'F', 'G', 'Bb', 'C'],
        ['G', 'Bb', 'C', 'Eb', 'F'],
        ['F', 'G', 'Bb', 'C', 'Eb']
      ]
    };
    
    // Train the Markov chain
    const patterns = trainingPatterns[genre] || trainingPatterns.pop;
    patterns.forEach(pattern => {
      melodyMarkov.train(pattern, 1.0);
    });
    
    // Calculate melodic density based on genre and mood
    const baseDensity = genreProfile.melodyDensity || 0.75;
    const moodAdjustment = moodProfile.energy || 0.5;
    const finalDensity = baseDensity * (0.7 + moodAdjustment * 0.6);
    const notesPerMeasure = Math.max(1, Math.round(4 * finalDensity));
    
    console.log(`🎵 Melodic density: ${finalDensity.toFixed(2)} (${notesPerMeasure} notes/measure)`);
    
    let currentNoteIndex = 0; // Start from tonic
    let currentOctave = 5;
    let melodicContext = [scaleNotes[0], scaleNotes[2]]; // Start with tonic and third
    
    // AI-powered phrase structure
    const phraseLength = 4; // 4 measures per phrase
    let currentPhrase = 0;
    
    progression.forEach((chordName, measureIndex) => {
      const chord = Tonal.Chord.get(chordName);
      const chordTones = chord.notes || [];
      
      // Determine if this is a phrase beginning/end for musical structure
      const isPhraseStart = (measureIndex % phraseLength) === 0;
      const isPhraseMid = (measureIndex % phraseLength) === 2;
      const isPhraseEnd = (measureIndex % phraseLength) === (phraseLength - 1);
      
      // Generate notes for this measure with AI-enhanced logic
      for (let noteIndex = 0; noteIndex < notesPerMeasure; noteIndex++) {
        const beat = (noteIndex * 4) / notesPerMeasure;
        const timing = `${measureIndex}:${beat}:0`;
        
        let selectedNote;
        
        // AI decision-making for note selection
        const onStrongBeat = (beat % 2 === 0);
        const creativity = genreProfile.aiCreativity || 0.6;
        
        // Enhanced probability calculation
        let chordToneChance = onStrongBeat ? 0.7 : 0.4;
        
        // Adjust for phrase structure
        if (isPhraseMid) chordToneChance *= 0.8; // More freedom in phrase middle
        if (isPhraseEnd) chordToneChance *= 1.2; // More resolution at phrase end
        
        // Adjust for mood tension
        if (moodProfile.tension > 0.6) {
          chordToneChance *= 0.7; // More non-chord tones for tension
        }
        
        if (Math.random() < chordToneChance && chordTones.length > 0) {
          // Use chord tone with AI weighting
          const weightedChordTones = chordTones.map((note, index) => ({
            note,
            weight: index === 0 ? 0.4 : index === 2 ? 0.3 : 0.15 // Root and fifth preferred
          }));
          
          const totalWeight = weightedChordTones.reduce((sum, {weight}) => sum + weight, 0);
          let random = Math.random() * totalWeight;
          
          for (const {note, weight} of weightedChordTones) {
            random -= weight;
            if (random <= 0) {
              selectedNote = note;
              break;
            }
          }
          
          selectedNote = selectedNote || chordTones[0];
          
          // Update melodic context and current position
          const noteIndexInScale = scaleNotes.indexOf(selectedNote);
          if (noteIndexInScale !== -1) {
            currentNoteIndex = noteIndexInScale;
            melodicContext.push(selectedNote);
            if (melodicContext.length > 3) melodicContext.shift();
          }
        } else {
          // Use AI Markov chain for scale-based movement
          const markovSuggestion = melodyMarkov.generate(melodicContext, creativity);
          
          if (markovSuggestion && scaleNotes.includes(markovSuggestion)) {
            selectedNote = markovSuggestion;
            currentNoteIndex = scaleNotes.indexOf(selectedNote);
          } else {
            // Fallback to traditional interval-based movement
            const intervalProbs = {...musicRulebook.melodicIntervals};
            
            // Adjust probabilities based on creativity
            if (creativity > 0.7) {
              intervalProbs.fourth *= 1.5;
              intervalProbs.fifth *= 1.3;
              intervalProbs.unison *= 0.7;
            }
            
            const rand = Math.random();
            let cumulative = 0;
            let selectedInterval = 'unison';
            
            for (const [interval, probability] of Object.entries(intervalProbs)) {
              cumulative += probability;
              if (rand <= cumulative) {
                selectedInterval = interval;
                break;
              }
            }
            
            // Apply the selected interval with AI direction logic
            let newIndex = currentNoteIndex;
            
            // AI-powered direction selection based on phrase structure
            let direction = Math.random() > 0.5 ? 1 : -1;
            
            // Prefer upward motion at phrase starts, downward at phrase ends
            if (isPhraseMid && moodProfile.energy > 0.6) direction = 1;
            if (isPhraseEnd) direction = -1;
            
            switch (selectedInterval) {
              case 'unison': break;
              case 'second': newIndex += direction * 1; break;
              case 'third': newIndex += direction * 2; break;
              case 'fourth': newIndex += direction * 3; break;
              case 'fifth': newIndex += direction * 4; break;
              case 'sixth': newIndex += direction * 5; break;
              case 'octave': newIndex += direction * 7; break;
            }
            
            // Keep within scale bounds with octave wrapping
            if (newIndex < 0) {
              newIndex = scaleNotes.length + newIndex;
              currentOctave = Math.max(4, currentOctave - 1);
            } else if (newIndex >= scaleNotes.length) {
              newIndex = newIndex - scaleNotes.length;
              currentOctave = Math.min(6, currentOctave + 1);
            }
            
            currentNoteIndex = newIndex;
            selectedNote = scaleNotes[currentNoteIndex];
          }
          
          // Update melodic context
          melodicContext.push(selectedNote);
          if (melodicContext.length > 3) melodicContext.shift();
        }
        
        // AI-enhanced octave and expression control
        let octave = currentOctave;
        
        // Dynamic octave adjustment based on mood and phrase structure
        if (isPhraseMid && moodProfile.energy > 0.7 && Math.random() < 0.4) {
          octave += 1; // Higher energy = higher notes at phrase peaks
        } else if (isPhraseEnd && moodProfile.energy < 0.4 && Math.random() < 0.3) {
          octave -= 1; // Lower energy = lower resolution
        }
        
        // Emotional expression through octave variation
        if (moodProfile.tension > 0.6 && Math.random() < 0.2) {
          octave += Math.random() > 0.5 ? 1 : -1; // Tension creates octave jumps
        }
        
        octave = Math.max(4, Math.min(6, octave));
        currentOctave = octave;
        
        const fullNote = selectedNote + octave;
        
        // AI-powered rhythmic variation
        let duration;
        const rhythmComplexity = genreProfile.rhythmComplexity || 0.3;
        const aiVariation = moodProfile.aiVariation || 0.3;
        
        if (rhythmComplexity > 0.6 && Math.random() < aiVariation) {
          // Complex rhythm with AI variation
          const complexRhythms = ['16n', '8n', '8n.', '4n', '4n.', '2n'];
          duration = complexRhythms[Math.floor(Math.random() * complexRhythms.length)];
        } else if (rhythmComplexity > 0.3 && Math.random() < aiVariation * 0.7) {
          // Moderate rhythm variation
          const moderateRhythms = ['8n', '4n', '4n.'];
          duration = moderateRhythms[Math.floor(Math.random() * moderateRhythms.length)];
        } else {
          // Simple, stable rhythm
          duration = notesPerMeasure <= 2 ? '2n' : '4n';
        }
        
        melody.push({
          time: timing,
          pitch: fullNote,
          duration: duration,
          velocity: 0.7 + (moodProfile.dynamics * 0.3) // AI-controlled velocity
        });
      }
    });
    
    // AI-powered melodic resolution
    if (melody.length > 0 && genreProfile.coherence > 0.7) {
      const tonic = scaleNotes[0] + currentOctave;
      melody[melody.length - 1].pitch = tonic;
      melody[melody.length - 1].duration = '2n'; // Longer resolution note
    }
    
    console.log(`🎵 Generated AI-enhanced melody with ${melody.length} notes`);
    return melody;
  }

  // AI-powered orchestration based on genre and mood with richer arrangements
  function getOrchestrationForGenre(genre, mood) {
    const orchestrations = {
      classical: {
        chords: 'piano',
        melody: Math.random() > 0.5 ? 'violin' : 'flute',
        bass: 'cello',
        harmony1: 'french-horn',
        harmony2: 'clarinet',
        harmony3: 'bassoon',
        drums: null // Classical usually doesn't use drum kit
      },
      jazz: {
        chords: 'piano',
        melody: Math.random() > 0.5 ? 'trumpet' : 'saxophone',
        bass: 'bass-electric',
        harmony1: 'trombone',
        harmony2: 'clarinet',
        harmony3: 'guitar-acoustic',
        drums: ['kick', 'snare', 'hihat', 'ride']
      },
      ambient: {
        chords: Math.random() > 0.5 ? 'synthPad' : 'harp',
        melody: Math.random() > 0.5 ? 'flute' : 'synthFM',
        bass: 'contrabass',
        harmony1: 'violin',
        harmony2: 'cello',
        harmony3: 'organ',
        drums: null // Ambient usually minimal percussion
      },
      folk: {
        chords: 'guitar-acoustic',
        melody: Math.random() > 0.5 ? 'violin' : 'flute',
        bass: 'bass-electric',
        harmony1: 'harmonium',
        harmony2: 'harp',
        harmony3: 'guitar-electric',
        drums: ['kick', 'snare', 'hihat']
      },
      electronic: {
        chords: Math.random() > 0.5 ? 'synthPad' : 'organ',
        melody: Math.random() > 0.5 ? 'synthLead' : 'synthArp',
        bass: 'synthBass',
        harmony1: 'synthFM',
        harmony2: 'synthPluck',
        harmony3: 'saxophone',
        drums: ['kick', 'snare', 'hihat', 'crash']
      },
      rock: {
        chords: 'guitar-electric',
        melody: Math.random() > 0.5 ? 'guitar-electric' : 'synthLead',
        bass: 'bass-electric',
        harmony1: 'organ',
        harmony2: 'piano',
        harmony3: 'trumpet',
        drums: ['kick', 'snare', 'hihat', 'crash', 'tomHigh', 'tomLow']
      },
      pop: {
        chords: 'piano',
        melody: Math.random() > 0.5 ? 'violin' : 'guitar-acoustic',
        bass: 'bass-electric',
        harmony1: 'organ',
        harmony2: 'synthPad',
        harmony3: 'flute',
        drums: ['kick', 'snare', 'hihat']
      },
      blues: {
        chords: 'piano',
        melody: Math.random() > 0.5 ? 'saxophone' : 'trumpet',
        bass: 'bass-electric',
        harmony1: 'harmonium',
        harmony2: 'guitar-electric',
        harmony3: 'trombone',
        drums: ['kick', 'snare', 'hihat', 'ride']
      },
      cinematic: {
        chords: 'piano',
        melody: Math.random() > 0.5 ? 'violin' : 'cello',
        bass: 'contrabass',
        harmony1: 'french-horn',
        harmony2: 'tuba',
        harmony3: 'harp',
        drums: ['kick', 'snare', 'crash', 'tomHigh', 'tomMid', 'tomLow']
      }
    };
    
    const baseOrchestration = orchestrations[genre] || orchestrations.pop;
    
    // Mood modifications for melody selection
    if (mood === 'mysterious' || mood === 'melancholic') {
      baseOrchestration.melody = Math.random() > 0.5 ? 'cello' : 'clarinet';
      baseOrchestration.harmony1 = 'bassoon';
    } else if (mood === 'energetic' || mood === 'aggressive') {
      baseOrchestration.melody = Math.random() > 0.5 ? 'trumpet' : 'saxophone';
      if (genre === 'electronic') {
        baseOrchestration.melody = 'synthLead';
      }
    } else if (mood === 'calm' || mood === 'romantic') {
      baseOrchestration.melody = Math.random() > 0.5 ? 'flute' : 'harp';
      baseOrchestration.harmony2 = 'violin';
    }
    
    console.log(`🎭 Selected rich orchestration for ${genre}/${mood}:`, baseOrchestration);
    return baseOrchestration;
  }

  // Create solid, foundational bassline
  function createBassline(progression, complexity, key) {
    console.log(`🎵 Creating solid bassline with ${complexity} complexity`);
    
    let bassline = [];
    
    progression.forEach((chordName, measureIndex) => {
      const chord = Tonal.Chord.get(chordName);
      const root = chord.tonic || chord.notes[0] || 'C';
      
      // Always use simple, solid bass pattern for stability
      bassline.push({
        time: `${measureIndex}:0:0`,
        pitch: root + '2', // Low octave for bass foundation
        duration: '1n'    // Whole note for solid, sustained bass
      });
    });
    
    console.log(`🎵 Generated solid bassline with ${bassline.length} notes`);
    return bassline;
  }

  // Helper function to transpose notes
  function transposeNote(note, semitones) {
    try {
      // Extract note name and octave
      const noteMatch = note.match(/^([A-G][#b]?)(\d+)$/);
      if (!noteMatch) return note;
      
      const [, noteName, octave] = noteMatch;
      const transposed = Tonal.Note.transpose(noteName, Tonal.Interval.fromSemitones(semitones));
      return transposed + octave;
    } catch (error) {
      console.warn('Failed to transpose note:', note, error);
      return note;
    }
  }

  // Professional music generation with structured composition
  function generate(options) {
    console.log('� Generating professional composition with options:', options);
    console.log('📊 Available instruments:', Object.keys(instruments));

    if (Tone.context.state !== 'running') {
      console.log('🔊 Starting AudioContext...');
      Tone.context.resume();
    }
    
    // Stop and clear all previous music parts
    Tone.Transport.stop();
    Tone.Transport.cancel();

    // Extract and validate parameters with AI profiles
    const genre = options.genre || 'pop';
    const mood = options.mood || 'happy';
    
    // Get AI profiles for this genre and mood
    const genreProfile = musicRulebook.genreProfiles[genre] || musicRulebook.genreProfiles.pop;
    const moodProfile = musicRulebook.moodProfiles[mood] || musicRulebook.moodProfiles.happy;
    
    // AI-powered key selection based on mood
    const moodKeyMap = {
      happy: ['C', 'G', 'D', 'A'],
      sad: ['Dm', 'Am', 'Em', 'Bm'],
      calm: ['F', 'Bb', 'Eb'],
      energetic: ['E', 'B', 'F#'],
      mysterious: ['Fm', 'Cm', 'Gm'],
      romantic: ['Ab', 'Db', 'Gb']
    };
    
    const keyOptions = moodKeyMap[mood] || moodKeyMap.happy;
    const key = options.key || keyOptions[Math.floor(Math.random() * keyOptions.length)];
    
    // Determine scale based on AI genre preference and mood
    let scaleName = genreProfile.preferredScale;
    let finalKey = key;
    
    if (mood === 'sad' || mood === 'mysterious') {
      scaleName = Math.random() < 0.7 ? 'natural minor' : 'dorian';
      // For minor scales, adjust key if needed
      if (scaleName.includes('minor') && !key.includes('m')) {
        finalKey = key + 'm';
      }
    } else if (mood === 'calm') {
      scaleName = Math.random() < 0.4 ? 'pentatonic' : 'major';
    } else if (genre === 'blues') {
      scaleName = 'blues';
    }
    
    // Handle genre-specific scale adjustments
    if (genre === 'cinematic') {
      if (mood === 'sad' || mood === 'melancholic') {
        scaleName = 'harmonic minor';
        if (!finalKey.includes('m')) {
          finalKey = finalKey + 'm';
        }
      } else if (mood === 'mysterious') {
        scaleName = 'dorian';
      }
    }
    
    const scale = musicRulebook.scales[scaleName] || musicRulebook.scales.major;
    console.log(`🤖 AI selected: ${finalKey} ${scaleName} for ${genre}/${mood}`);

    // Generate variable length based on AI genre analysis (8-12 measures)
    const length = Math.floor(Math.random() * 5) + 8; // 8-12 measures

    // AI-powered composition complexity level
    const complexity = options.complexity || 0.7;
    
    // Use advanced AI-powered chord progression
    const progressionChords = createChordProgression(genre, mood, length, finalKey, scaleName, complexity);
    
    console.log('🎵 AI-generated chord progression:', progressionChords);
    
    // Set AI-powered tempo based on mood profile with intelligent variation
    const tempoRange = moodProfile.tempo;
    const baseVariation = (tempoRange[1] - tempoRange[0]) * 0.3;
    const moodVariation = moodProfile.aiVariation * baseVariation;
    const tempo = tempoRange[0] + Math.floor(Math.random() * (tempoRange[1] - tempoRange[0]));
    Tone.Transport.bpm.value = tempo;
    
    // Enhanced reverb calculation based on multiple factors
    const reverbAmount = Math.min(0.4, moodProfile.dynamics * 0.25 + genreProfile.harmonicComplexity * 0.15);
    reverb.wet.value = reverbAmount;
    
    console.log(`🤖 AI parameters: tempo=${tempo}, reverb=${reverbAmount.toFixed(2)}, complexity=${complexity}`);

    // Generate musical elements with enhanced AI algorithms
    const rhythmPattern = genreProfile.rhythmComplexity > 0.6 ? 'complex' : 'steady';
    const chordPart = createChordPart(progressionChords, rhythmPattern);
    const melodyPart = createMelody(progressionChords, scale, finalKey, genre, mood, complexity);
    const bassPart = createBassline(progressionChords, complexity > 0.7 ? 'complex' : 'simple', finalKey);
    
    // Add orchestration based on genre
    const orchestration = getOrchestrationForGenre(genre, mood);
    
    // Dynamic drum part generation
    const drumPart = createDrumPart(genre, mood, length, tempo);

    // Scheduling with safe instrument access and orchestration
    console.log('🎼 Scheduling professional composition...');

    const safeGetInstrument = (instrumentRole, fallbackName = 'piano') => {
      const requestedInstrument = options.instruments && options.instruments[instrumentRole] 
        || orchestration[instrumentRole] || fallbackName;
      
      if (requestedInstrument && instruments[requestedInstrument]) {
        console.log(`✅ Using ${instrumentRole}: ${requestedInstrument}`);
        return instruments[requestedInstrument];
      }
      
      if (instruments[fallbackName]) {
        console.log(`⚠️ Fallback ${instrumentRole}: ${fallbackName}`);
        return instruments[fallbackName];
      }
      
      return instruments.emergency || new Tone.PolySynth(Tone.Synth).connect(reverb);
    };

    // Schedule parts with rich orchestration
    new Tone.Part((time, note) => {
      const instrument = safeGetInstrument('chords', 'piano');
      if (instrument && note.notes) {
        instrument.triggerAttackRelease(note.notes, note.duration, time);
      }
    }, chordPart).start(0);

    new Tone.Part((time, note) => {
      const instrument = safeGetInstrument('melody', 'violin');
      if (instrument && note.pitch) {
        instrument.triggerAttackRelease(note.pitch, note.duration, time);
      }
    }, melodyPart).start(0);
    
    new Tone.Part((time, note) => {
      const instrument = safeGetInstrument('bass', 'bass-electric');
      if (instrument && note.pitch) {
        instrument.triggerAttackRelease(note.pitch, note.duration, time);
      }
    }, bassPart).start(0);
    
    // Add multiple harmony layers for richer sound
    if (orchestration.harmony1) {
      new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('harmony1', orchestration.harmony1);
        if (instrument && note.notes && Math.random() > 0.3) { // Sparse harmony
          const harmonizedNotes = note.notes.map(n => transposeNote(n, 3)); // Transpose up
          instrument.triggerAttackRelease(harmonizedNotes, note.duration, time);
        }
      }, chordPart).start(0);
    }
    
    if (orchestration.harmony2) {
      new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('harmony2', orchestration.harmony2);
        if (instrument && note.pitch && Math.random() > 0.5) { // Sparse counter-melody
          const harmonizedNote = transposeNote(note.pitch, -5); // Transpose down
          instrument.triggerAttackRelease(harmonizedNote, note.duration, time);
        }
      }, melodyPart).start(0);
    }
    
    if (orchestration.harmony3) {
      new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('harmony3', orchestration.harmony3);
        if (instrument && note.pitch && Math.random() > 0.7) { // Very sparse accent
          instrument.triggerAttackRelease(note.pitch, '8n', time);
        }
      }, melodyPart).start(0);
    }

    // Schedule drum parts
    if (drumPart.length > 0) {
      new Tone.Part((time, drumEvent) => {
        const drumInstrument = instruments[drumEvent.drum];
        if (drumInstrument) {
          if (drumEvent.drum === 'kick' || drumEvent.drum.includes('tom')) {
            drumInstrument.triggerAttackRelease(drumEvent.note, '8n', time, drumEvent.velocity);
          } else {
            drumInstrument.triggerAttackRelease(time, drumEvent.velocity);
          }
        }
      }, drumPart).start(0);
    }

    new Tone.Part((time, note) => {
      const instrument = safeGetInstrument('drums', 'kick');
      if (instrument && note.drum) {
        // For drum parts, use triggerAttack instead of triggerAttackRelease
        instrument.triggerAttack(note.note, time, {
          velocity: note.velocity
        });
      }
    }, drumPart).start(0);

    // Set transport to loop
    const isLooping = options.isLooping !== undefined ? options.isLooping : true;
    Tone.Transport.loop = isLooping;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = `${length}m`;

    console.log('✅ AI composition scheduled. Ready to play.');

    const generatedData = {
      chordPart,
      melodyPart,
      bassPart,
      drumPart,
      tempo: Tone.Transport.bpm.value,
      options: {
        ...options,
        key: finalKey,
        genre,
        mood,
        length,
        scaleName,
        tempo,
        isLooping,
        aiGenerated: true
      }
    };
    
    lastGeneratedMusic = generatedData;
    return generatedData;
  }

  function play() {
    console.log('▶️ Starting playback...');
    if (Tone.context.state !== 'running') {
      Tone.context.resume();
    }
    Tone.Transport.start();
  }

  function stop() {
    console.log('⏹️ Stopping playback...');
    Tone.Transport.stop();
  }

  function pause() {
    console.log('⏸️ Pausing playback...');
    Tone.Transport.pause();
  }

  function playFromHistory(musicData) {
    console.log('▶️ Playing from history...');
    
    if (!musicData) {
      console.error('❌ No music data provided to playFromHistory');
      return;
    }
    
    if (Tone.context.state !== 'running') {
      console.log('🔊 Starting AudioContext...');
      Tone.context.resume();
    }
    
    // Stop and clear all previous music parts
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
    console.log('🎼 Scheduling music from history...');
    
    // Set tempo and reverb from stored options
    if (musicData.options) {
      Tone.Transport.bpm.value = musicData.options.tempo || musicData.tempo || 120;
      if (musicData.options.reverb !== undefined) {
        reverb.wet.value = musicData.options.reverb;
      }
    }
    
    const safeGetInstrument = (instrumentRole, fallbackName = 'piano') => {
      const requestedInstrument = musicData.options && musicData.options.instruments && musicData.options.instruments[instrumentRole];
      
      if (requestedInstrument && instruments[requestedInstrument]) {
        return instruments[requestedInstrument];
      }
      
      if (instruments[fallbackName]) {
        return instruments[fallbackName];
      }
      
      return instruments.emergency || new Tone.PolySynth(Tone.Synth).connect(reverb);
    };

    // Schedule chord part
    if (musicData.chordPart && musicData.chordPart.length > 0) {
      new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('chords', 'piano');
        if (instrument && note.notes) {
          instrument.triggerAttackRelease(note.notes, note.duration, time);
        }
      }, musicData.chordPart).start(0);
    }

    // Schedule melody part
    if (musicData.melodyPart && musicData.melodyPart.length > 0) {
      new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('melody', 'violin');
        if (instrument && note.pitch) {
          instrument.triggerAttackRelease(note.pitch, note.duration, time);
        }
      }, musicData.melodyPart).start(0);
    }
    
    // Schedule bass part
    if (musicData.bassPart && musicData.bassPart.length > 0) {
      new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('bass', 'bass-electric');
        if (instrument && note.pitch) {
          instrument.triggerAttackRelease(note.pitch, note.duration, time);
        }
      }, musicData.bassPart).start(0);
    }

    // Schedule drum part
    if (musicData.drumPart && musicData.drumPart.length > 0) {
      new Tone.Part((time, drumEvent) => {
        const drumInstrument = instruments[drumEvent.drum];
        if (drumInstrument) {
          if (drumEvent.drum === 'kick' || drumEvent.drum.includes('tom')) {
            drumInstrument.triggerAttackRelease(drumEvent.note, '8n', time, drumEvent.velocity);
          } else {
            drumInstrument.triggerAttackRelease(time, drumEvent.velocity);
          }
        }
      }, musicData.drumPart).start(0);
    }

    // Set transport loop based on stored options
    const isLooping = musicData.options && musicData.options.isLooping !== undefined ? musicData.options.isLooping : true;
    const length = musicData.options && musicData.options.length ? musicData.options.length : 16;
    
    Tone.Transport.loop = isLooping;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = `${length}m`;

    console.log('✅ Music from history scheduled. Ready to play manually.');
    // Update lastGeneratedMusic to this data
    lastGeneratedMusic = musicData;
  }

  // Export public interface
  return {
    loadInstruments,
    generate,
    play,
    stop,
    pause,
    playFromHistory,
    getLastGenerated: () => lastGeneratedMusic,
    getInstruments: () => instruments,
    getTransport: () => Tone.Transport,
    setReverb: (value) => {
      if (reverb) {
        reverb.wet.value = value;
        console.log(`🎛️ Reverb set to: ${value}`);
      }
    },
    setVolume: (value) => {
      if (masterVolume) {
        // Convert from 0-100 to dB scale (-40 to 0)
        const dbValue = -40 + (value * 40 / 100);
        masterVolume.volume.value = dbValue;
        console.log(`🔊 Master volume set to: ${value}% (${dbValue.toFixed(1)}dB)`);
      }
    },
    getVolume: () => {
      if (masterVolume) {
        // Convert from dB back to 0-100 scale
        const dbValue = masterVolume.volume.value;
        const percentage = Math.max(0, Math.min(100, ((dbValue + 40) * 100 / 40)));
        return Math.round(percentage);
      }
      return 50; // Default
    },
    getTempoRange: (tempoName) => {
      const tempos = {
        slow: [60, 80],
        medium: [90, 120], 
        fast: [130, 160]
      };
      return tempos[tempoName] || tempos.medium;
    },
    musicRulebook
  };
})();

// Make it globally available
window.MusicGeneratorEngine = MusicGeneratorEngine;
console.log('🎵 MusicGeneratorEngine loaded and ready!');

// Auto-initialize with basic instruments
(async () => {
  try {
    console.log('🎺 Auto-loading basic instruments...');
    await MusicGeneratorEngine.loadInstruments();
    console.log('✅ Basic instruments loaded successfully');
  } catch (error) {
    console.warn('⚠️ Auto-load failed, fallback instruments will be used:', error);
  }
})();
