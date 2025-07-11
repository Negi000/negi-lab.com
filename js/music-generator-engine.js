// Fixed Music Generator Engine with proper music theory

const MusicGeneratorEngine = (() => {
  console.log('🎵 Initializing Fixed MusicGeneratorEngine...');
  
  const reverb = new Tone.Reverb().toDestination();
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
  function loadInstruments(instrumentsList) {
    console.log('🎺 Loading instruments:', instrumentsList);
    return new Promise((resolve, reject) => {
      if (!window.SampleLibrary) {
        console.error('❌ SampleLibrary not found');
        reject(new Error('SampleLibrary not available'));
        return;
      }

      const samples = SampleLibrary.load(instrumentsList);
      
      Object.keys(samples).forEach(name => {
        instruments[name] = samples[name];
        instruments[name].connect(reverb);
        console.log(`✅ Loaded instrument: ${name}`);
      });

      // Add a simple emergency synth as fallback
      instruments.emergency = new Tone.PolySynth(Tone.Synth).connect(reverb);
      console.log('✅ Emergency synth ready');

      resolve(instruments);
    });
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
    
    const noteDensity = { simple: 2, normal: 4, complex: 8 }[complexity] || 4;
    let currentOctave = 5; // Higher octave for melody
    let lastNoteIndex = 0; // Track position in scale
    
    console.log(`🎼 Scale notes:`, scaleNotes);
    
    progression.forEach((chordName, measureIndex) => {
      const chord = Tonal.Chord.get(chordName);
      const chordTones = chord.notes || [];
      
      // Generate notes for this measure
      for (let noteIndex = 0; noteIndex < noteDensity; noteIndex++) {
        // Calculate timing within the measure
        const subdivision = 4 / noteDensity;
        const beat = Math.floor(noteIndex * subdivision);
        const timing = `${measureIndex}:${beat}:0`;
        
        let selectedNote;
        
        // On strong beats (1 and 3), prefer chord tones
        if ((noteIndex % 2 === 0) && chordTones.length > 0) {
          selectedNote = chordTones[Math.floor(Math.random() * chordTones.length)];
        } else {
          // For other beats, create stepwise motion
          const stepDirection = Math.random() > 0.5 ? 1 : -1;
          const newIndex = Math.max(0, Math.min(scaleNotes.length - 1, 
              lastNoteIndex + stepDirection));
          
          selectedNote = scaleNotes[newIndex];
          lastNoteIndex = newIndex;
        }
        
        // Add octave to note
        const fullNote = selectedNote + currentOctave;
        
        // Determine note duration
        let duration = '4n'; // Quarter note default
        if (noteDensity === 8) {
          duration = '8n'; // Eighth notes for complex melodies
        }
        
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
    
    // Stop any previous music
    if (Tone.Transport.state === 'started') {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    }

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
      const requestedInstrument = options.instruments[instrumentRole];
      if (instruments[requestedInstrument]) {
        console.log(`✅ Using ${instrumentRole}: ${requestedInstrument}`);
        return instruments[requestedInstrument];
      }
      if (instruments[fallbackName]) {
        console.log(`⚠️ Fallback ${instrumentRole}: ${fallbackName}`);
        return instruments[fallbackName];
      }
      console.log(`❌ Emergency synth for ${instrumentRole}`);
      return instruments.emergency || new Tone.PolySynth(Tone.Synth).connect(reverb);
    };

    // Schedule parts
    new Tone.Part((time, note) => {
      const instrument = safeGetInstrument('chords', 'piano');
      if (instrument && note.notes) {
        instrument.triggerAttackRelease(note.notes, note.duration, time);
      }
    }, chordPart).start(0);

    new Tone.Part((time, note) => {
      const instrument = safeGetInstrument('melody', 'piano');
      if (instrument && note.pitch) {
        instrument.triggerAttackRelease(note.pitch, note.duration, time);
      }
    }, melodyPart).start(0);
    
    new Tone.Part((time, note) => {
      const instrument = safeGetInstrument('bass', 'piano');
      if (instrument && note.pitch) {
        instrument.triggerAttackRelease(note.pitch, note.duration, time);
      }
    }, bassPart).start(0);

    new Tone.Part((time, note) => {
      if (instruments.drums && note.pitch) {
        instruments.drums.triggerAttackRelease(note.pitch, note.duration, time);
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

  // Export public interface
  return {
    loadInstruments,
    generate,
    play,
    stop,
    pause,
    getLastGenerated: () => lastGeneratedMusic,
    getInstruments: () => instruments,
    musicRulebook
  };
})();

// Make it globally available
window.MusicGeneratorEngine = MusicGeneratorEngine;
console.log('🎵 MusicGeneratorEngine loaded and ready!');
