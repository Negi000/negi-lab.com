// Fixed Music Generator Engine with proper music theory

const MusicGeneratorEngine = (() => {
  console.log('🎵 Initializing Fixed MusicGeneratorEngine...');
  
  const reverb = new Tone.Reverb().toDestination();
  // Lower initial volume
  const masterVolume = new Tone.Volume(-12).toDestination();
  reverb.connect(masterVolume);
  
  let instruments = {};
  let lastGeneratedMusic = null;
  
  console.log('🔧 Tone.js version:', Tone.version);

  // Music Theory Rulebook
  const musicRulebook = {
    scales: {
      major: { name: 'major', intervals: ['1P', '2M', '3M', '4P', '5P', '6M', '7M'] },
      natural_minor: { name: 'natural minor', intervals: ['1P', '2M', '3m', '4P', '5P', '6m', '7m'] },
      dorian: { name: 'dorian', intervals: ['1P', '2M', '3m', '4P', '5P', '6M', '7m'] }
    },
    progressions: {
      pop: [
        ['I', 'V', 'vi', 'IV'], // I-V-vi-IV progression
        ['vi', 'IV', 'I', 'V'], // vi-IV-I-V progression
        ['I', 'vi', 'IV', 'V']  // I-vi-IV-V progression
      ],
      rock: [
        ['I', 'IV', 'V', 'I'],
        ['vi', 'V', 'IV', 'I']
      ],
      jazz: [
        ['ii', 'V', 'I', 'I'],
        ['I', 'vi', 'ii', 'V']
      ]
    }
  };

  // Instrument Management
  function loadInstruments(instrumentsList = null) {
    console.log('🎺 Loading instruments from CDN:', instrumentsList);
    
    // Default instruments if none specified - CDN compatible
    const defaultInstruments = ['piano', 'guitar-acoustic', 'violin', 'bass-electric'];
    
    const instrumentsToLoad = instrumentsList || defaultInstruments;
    
    return new Promise((resolve, reject) => {
      if (!window.SampleLibrary) {
        console.warn('❌ SampleLibrary not found, creating fallback instruments');
        createFallbackInstruments();
        resolve(instruments);
        return;
      }

      try {
        // Use original CDN baseUrl
        console.log('🔧 Setting SampleLibrary baseUrl to CDN: https://nbrosowsky.github.io/tonejs-instruments/samples/');
        
        const loadedInstruments = SampleLibrary.load({
          instruments: instrumentsToLoad,
          baseUrl: 'https://nbrosowsky.github.io/tonejs-instruments/samples/',
          minify: true, // 音源ファイル数を削減
          onload: () => {
            console.log('✅ All instruments loaded successfully from CDN');
          }
        });
        
        // Store loaded instruments
        Object.keys(loadedInstruments).forEach(name => {
          instruments[name] = loadedInstruments[name];
          instruments[name].connect(reverb);
          console.log(`✅ Connected CDN instrument: ${name}`);
        });

        // Add emergency synth as fallback
        instruments.emergency = new Tone.PolySynth(Tone.Synth).connect(reverb);
        instruments.drums = new Tone.MembraneSynth().connect(reverb); // Simple drum fallback
        
        console.log('✅ Emergency instruments ready');
        console.log('📊 Final instrument list:', Object.keys(instruments));

        resolve(instruments);
        
      } catch (error) {
        console.error('❌ Error loading instruments from CDN:', error);
        createFallbackInstruments();
        resolve(instruments);
      }
    });
  }

  // Create fallback instruments when SampleLibrary fails
  function createFallbackInstruments() {
    console.log('🔧 Creating fallback instruments...');
    
    instruments.piano = new Tone.PolySynth(Tone.Synth).connect(reverb);
    instruments['guitar-acoustic'] = new Tone.PolySynth(Tone.Synth).connect(reverb);
    instruments['bass-electric'] = new Tone.MonoSynth().connect(reverb);
    instruments.violin = new Tone.PolySynth(Tone.Synth).connect(reverb);
    instruments.drums = new Tone.MembraneSynth().connect(reverb);
    instruments.emergency = new Tone.PolySynth(Tone.Synth).connect(reverb);
    
    console.log('✅ Fallback instruments created');
  }

  // Create proper chord progression with music theory
  function createChordProgression(baseProgression, length, isLooping, key, scaleName) {
    console.log(`🎼 Creating chord progression: ${baseProgression.join('-')} in ${key} ${scaleName}`);
    
    try {
      // Get scale notes
      const scaleNotes = Tonal.Scale.get(`${key} ${scaleName}`).notes;
      if (!scaleNotes || scaleNotes.length === 0) {
        throw new Error(`Invalid scale: ${key} ${scaleName}`);
      }
      
      console.log(`🎵 Scale notes:`, scaleNotes);
      
      // Map Roman numerals to scale degrees
      const romanToIndex = {
        'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6,
        'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6
      };
      
      const progression = [];
      
      for (let measure = 0; measure < length; measure++) {
        const romanChord = baseProgression[measure % baseProgression.length];
        const scaleIndex = romanToIndex[romanChord];
        
        if (scaleIndex === undefined) {
          console.warn(`Unknown roman numeral: ${romanChord}`);
          continue;
        }
        
        const rootNote = scaleNotes[scaleIndex];
        
        // Determine chord quality based on scale degree
        let chordSymbol;
        if (scaleName.includes('minor') || scaleName === 'natural_minor') {
          // Natural minor scale chord qualities: i ii° III iv v VI VII
          const minorQualities = ['m', 'dim', 'M', 'm', 'm', 'M', 'M'];
          const quality = minorQualities[scaleIndex];
          chordSymbol = rootNote + (quality === 'M' ? '' : quality === 'dim' ? 'dim' : 'm');
        } else {
          // Major scale chord qualities: I ii iii IV V vi vii°  
          const majorQualities = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];
          const quality = majorQualities[scaleIndex];
          chordSymbol = rootNote + (quality === 'M' ? '' : quality === 'dim' ? 'dim' : 'm');
        }
        
        progression.push(chordSymbol);
      }
      
      console.log(`🎵 Final chord progression:`, progression);
      return progression;
      
    } catch (error) {
      console.error('Failed to create chord progression:', error);
      // Fallback to simple C major progression
      const fallback = ['C', 'Am', 'F', 'G'];
      const result = [];
      for (let i = 0; i < length; i++) {
        result.push(fallback[i % fallback.length]);
      }
      return result;
    }
  }

  // Create chord accompaniment
  function createChordPart(progression) {
    console.log('🎹 Creating chord accompaniment');
    let chordPart = [];
    
    progression.forEach((chordName, measureIndex) => {
      const chord = Tonal.Chord.get(chordName);
      let notes = chord.notes;
      
      // Fallback if chord is invalid
      if (!notes || notes.length === 0) {
        console.warn(`Invalid chord: ${chordName}, using C major`);
        notes = ['C', 'E', 'G'];
      }
      
      // Create better voicing - spread notes across octaves
      const voicedNotes = notes.slice(0, 4).map((note, index) => {
        const octave = 3 + Math.floor(index / 3); // Spread across octaves 3-4
        return note + octave;
      });
      
      // Create rhythmic pattern
      chordPart.push({
        time: `${measureIndex}:0:0`,
        notes: voicedNotes,
        duration: '2n'
      });
      
      chordPart.push({
        time: `${measureIndex}:2:0`,
        notes: voicedNotes,
        duration: '2n'
      });
    });
    
    console.log(`🎹 Generated ${chordPart.length} chord events`);
    return chordPart;
  }

  // Create melody with musical logic
  function createMelody(progression, scale, key, complexity) {
    console.log(`🎵 Creating melody for ${key} scale with ${complexity} complexity`);
    
    let melody = [];
    const scaleNotes = Tonal.Scale.get(`${key} ${scale.name || 'major'}`).notes;
    if (!scaleNotes || scaleNotes.length === 0) {
      console.error('Invalid scale for melody generation');
      return [];
    }
    
    const noteDensity = { simple: 2, normal: 3, complex: 4 }[complexity] || 3;
    let currentOctave = 5; // Higher octave for melody
    let lastNoteIndex = Math.floor(scaleNotes.length / 2); // Start from middle of scale
    
    console.log(`🎼 Scale notes:`, scaleNotes);
    
    progression.forEach((chordName, measureIndex) => {
      const chord = Tonal.Chord.get(chordName);
      const chordTones = chord.notes || [];
      
      // Generate notes for this measure
      for (let noteIndex = 0; noteIndex < noteDensity; noteIndex++) {
        // Calculate timing within the measure
        const subdivision = 4 / noteDensity;
        const beat = noteIndex * subdivision;
        const timing = `${measureIndex}:${beat}:0`;
        
        let selectedNote;
        
        // First note of measure should be chord tone
        if (noteIndex === 0 && chordTones.length > 0) {
          selectedNote = chordTones[0]; // Root of chord
        } else {
          // Create more musical stepwise motion
          let direction = Math.random() > 0.6 ? 1 : -1;
          
          // Bias toward moving back to center
          if (lastNoteIndex > 5) direction = -1;
          if (lastNoteIndex < 2) direction = 1;
          
          const newIndex = Math.max(0, Math.min(scaleNotes.length - 1, 
              lastNoteIndex + direction));
          
          selectedNote = scaleNotes[newIndex];
          lastNoteIndex = newIndex;
        }
        
        // Add octave to note
        const fullNote = selectedNote + currentOctave;
        
        // Better rhythm patterns
        let duration = noteIndex === 0 ? '4n' : '8n';
        
        melody.push({
          time: timing,
          pitch: fullNote,
          duration: duration
        });
      }
    });
    
    console.log(`🎵 Generated melody with ${melody.length} notes`);
    return melody;
  }

  // Create bassline
  function createBassline(progression, complexity, key) {
    console.log(`🎵 Creating bassline with ${complexity} complexity`);
    
    let bassline = [];
    
    progression.forEach((chordName, measureIndex) => {
      const chord = Tonal.Chord.get(chordName);
      const root = chord.tonic || chord.notes[0] || 'C';
      
      if (complexity === 'simple') {
        // Play the root note on beats 1 and 3
        bassline.push({
          time: `${measureIndex}:0:0`,
          pitch: root + '2', // Low octave for bass
          duration: '2n'
        });
        bassline.push({
          time: `${measureIndex}:2:0`,
          pitch: root + '2',
          duration: '2n'
        });
      } else {
        // Root on 1, fifth on 3
        const fifth = chord.notes[2] || root;
        bassline.push({
          time: `${measureIndex}:0:0`,
          pitch: root + '2',
          duration: '4n'
        });
        bassline.push({
          time: `${measureIndex}:2:0`,
          pitch: fifth + '2',
          duration: '4n'
        });
      }
    });
    
    console.log(`🎵 Generated bassline with ${bassline.length} notes`);
    return bassline;
  }

  // Create drums
  function createDrums(length, complexity, genre) {
    console.log(`🥁 Creating drums for ${length} measures (${complexity}, ${genre})`);
    
    let drumPart = [];
    
    for (let measure = 0; measure < length; measure++) {
      // Basic kick pattern
      drumPart.push({
        time: `${measure}:0:0`,
        pitch: 'C2', // Kick
        duration: '4n'
      });
      
      if (complexity !== 'simple') {
        drumPart.push({
          time: `${measure}:2:0`,
          pitch: 'C2', // Kick on 3
          duration: '4n'
        });
      }
      
      // Snare on 2 and 4
      drumPart.push({
        time: `${measure}:1:0`,
        pitch: 'D2', // Snare
        duration: '4n'
      });
      drumPart.push({
        time: `${measure}:3:0`,
        pitch: 'D2', // Snare
        duration: '4n'
      });
    }
    
    console.log(`🥁 Generated ${drumPart.length} drum events`);
    return drumPart;
  }

  // Main generation function
  function generate(options) {
    console.log('🎵 Generating music with options:', options);
    console.log('📊 Available instruments:', Object.keys(instruments));

    if (Tone.context.state !== 'running') {
      console.log('🔊 Starting AudioContext...');
      Tone.context.resume();
    }
    
    // Stop and clear all previous music parts
    Tone.Transport.stop();
    Tone.Transport.cancel();

    // Setup parameters
    const key = options.key || 'C';
    const genre = options.genre || 'pop';
    const mood = options.mood || 'happy';
    const length = options.length || 16;
    const complexity = options.complexity || 'normal';
    const isLooping = options.isLooping !== undefined ? options.isLooping : true;

    // Determine scale based on mood
    let scaleName = 'major';
    if (mood === 'sad' || mood === 'melancholic' || mood === 'mysterious') {
      scaleName = 'natural_minor';
    }
    
    const scale = musicRulebook.scales[scaleName] || musicRulebook.scales.major;
    console.log(`🎼 Using ${key} ${scaleName} scale for ${genre}/${mood}`);

    // Select chord progression
    const progressionsForGenre = musicRulebook.progressions[genre] || musicRulebook.progressions['pop'];
    const baseProgression = progressionsForGenre[Math.floor(Math.random() * progressionsForGenre.length)];
    const progressionChords = createChordProgression(baseProgression, length, isLooping, key, scaleName);
    
    console.log('🎵 Chord progression:', progressionChords);
    
    Tone.Transport.bpm.value = options.tempo || 120;
    reverb.wet.value = options.reverb || 0.1;

    // Generate musical elements
    const chordPart = createChordPart(progressionChords);
    const melodyPart = createMelody(progressionChords, scale, key, complexity);
    const bassPart = createBassline(progressionChords, complexity, key);
    const drumPart = createDrums(length, complexity, genre);

    // Scheduling with safe instrument access
    console.log('🎼 Scheduling music parts...');

    const safeGetInstrument = (instrumentRole, fallbackName = 'piano') => {
      const requestedInstrument = options.instruments && options.instruments[instrumentRole];
      
      console.log(`🔍 Looking for ${instrumentRole} instrument: ${requestedInstrument}`);
      console.log(`📊 Available instruments:`, Object.keys(instruments));
      
      if (requestedInstrument && instruments[requestedInstrument]) {
        console.log(`✅ Using ${instrumentRole}: ${requestedInstrument}`);
        return instruments[requestedInstrument];
      }
      
      if (instruments[fallbackName]) {
        console.log(`⚠️ Fallback ${instrumentRole}: ${fallbackName} (${requestedInstrument} not available)`);
        return instruments[fallbackName];
      }
      
      // Final fallback to emergency instruments
      if (instruments.emergency) {
        console.log(`❌ Emergency synth for ${instrumentRole}`);
        return instruments.emergency;
      }
      
      // Create emergency instrument if nothing else works
      console.log(`🚨 Creating new emergency synth for ${instrumentRole}`);
      const emergencyInstrument = new Tone.PolySynth(Tone.Synth).connect(reverb);
      return emergencyInstrument;
    };

    // Schedule parts with better instrument allocation
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

    new Tone.Part((time, note) => {
      const drumInstrument = instruments.drums || instruments.emergency;
      if (drumInstrument && note.pitch) {
        drumInstrument.triggerAttackRelease(note.pitch, note.duration, time);
      }
    }, drumPart).start(0);

    // Set transport to loop
    Tone.Transport.loop = isLooping;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = `${length}m`;

    console.log('✅ Music scheduled. Ready to play.');

    const generatedData = {
      chordPart,
      melodyPart,
      bassPart,
      drumPart,
      tempo: Tone.Transport.bpm.value,
      options
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
      new Tone.Part((time, note) => {
        const drumInstrument = instruments.drums || instruments.emergency;
        if (drumInstrument && note.pitch) {
          drumInstrument.triggerAttackRelease(note.pitch, note.duration, time);
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
