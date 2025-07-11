// This file will contain the core music generation logic using Tone.js

const MusicGeneratorEngine = (() => {
  console.log('🎵 Initializing MusicGeneratorEngine...');
  
  const reverb = new Tone.Reverb().toDestination();
  let instruments = {};
  let lastGeneratedMusic = null; // Variable to store the last generated music data
  
  console.log('🔧 Tone.js version:', Tone.version);
  console.log('🔧 Reverb initialized:', reverb);

  // --- Music Theory & Rulebook ---
  const musicRulebook = {
    scales: {
      major: { name: 'major', intervals: ['1P', '2M', '3M', '4P', '5P', '6M', '7M'] },
      natural_minor: { name: 'natural minor', intervals: ['1P', '2M', '3m', '4P', '5P', '6m', '7m'] },
      dorian: { name: 'dorian', intervals: ['1P', '2M', '3m', '4P', '5P', '6M', '7m'] },
      mixolydian: { name: 'mixolydian', intervals: ['1P', '2M', '3M', '4P', '5P', '6M', '7m'] },
    },
    diatonicChords: {
      major: ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
      // Imaj7, iim7, iiim7, IVmaj7, V7, vim7, viim7b5
    },
    progressions: {
      pop: [
        ['I', 'V', 'vi', 'IV'], // I-V-vi-IV
        ['IV', 'I', 'V', 'vi'], // IV-I-V-vi
      ],
      jazz: [
        ['ii', 'V', 'I', 'I'], // ii-V-I
      ],
      rock: [
        ['I', 'IV', 'V', 'V'], // I-IV-V
      ]
    },
    rhythms: {
      fourOnTheFloor: [{ time: '0:0' }, { time: '0:1' }, { time: '0:2' }, { time: '0:3' }],
      // ... other rhythms
    },
    tempos: {
      slow: [60, 80],
      medium: [90, 120],
      fast: [130, 160],
    },
    structures: {
        AABA: ['A', 'A', 'B', 'A'],
        ABAB: ['A', 'B', 'A', 'B'],
    }
  };

  // --- Keyword Analysis ---
  const keywordDictionary = {
    // Moods
    'happy': { mood: 'happy', scale: 'major', tempo: 'medium' },
    'upbeat': { mood: 'happy', scale: 'major', tempo: 'fast' },
    'sad': { mood: 'sad', scale: 'natural_minor', tempo: 'slow' },
    'melancholic': { mood: 'sad', scale: 'natural_minor', tempo: 'slow' },
    'energetic': { mood: 'energetic', genre: 'rock', tempo: 'fast' },
    'calm': { genre: 'ambient', scale: 'major', tempo: 'slow' },
    'epic': { genre: 'cinematic', scale: 'major', tempo: 'medium' },
    'mysterious': { genre: 'ambient', scale: 'natural_minor', tempo: 'slow' },
    // Genres
    'pop': { genre: 'pop', scale: 'major', tempo: 'medium' },
    'rock': { genre: 'rock', scale: 'major', tempo: 'fast' },
    'jazz': { genre: 'jazz', scale: 'major', tempo: 'medium' },
    'ambient': { genre: 'ambient', scale: 'major', tempo: 'slow' },
    'cinematic': { genre: 'cinematic', scale: 'major', tempo: 'medium' },
    // ... more keywords
  };

  // --- Instruments ---
  // let instruments = {}; // Removed duplicate declaration
  // let lastGeneratedMusic = null; // Variable to store the last generated music data

  // Available instruments using local tonejs-instruments SampleLibrary
  const availableInstruments = {
    // Piano family
    'piano': 'piano',
    
    // Guitar family
    'guitar-acoustic': 'guitar-acoustic',
    'guitar-electric': 'guitar-electric',
    'guitar-nylon': 'guitar-nylon',
    
    // Orchestral strings
    'violin': 'violin',
    'cello': 'cello',
    'contrabass': 'contrabass',
    
    // Winds
    'flute': 'flute',
    'clarinet': 'clarinet',
    'saxophone': 'saxophone',
    'trumpet': 'trumpet',
    'bassoon': 'bassoon',
    'tuba': 'tuba',
    'french-horn': 'french-horn',
    'trombone': 'trombone',
    
    // Others
    'xylophone': 'xylophone',
    'organ': 'organ',
    'harp': 'harp',
    'harmonium': 'harmonium',
    'bass-electric': 'bass-electric',
    
    // Drums using the correct drum sample URLs (keep existing)
    'drums': {
        'C1': 'https://tonejs.github.io/audio/drum-samples/acoustic-kit/kick.mp3',
        'D1': 'https://tonejs.github.io/audio/drum-samples/acoustic-kit/snare.mp3',
        'F#1': 'https://tonejs.github.io/audio/drum-samples/acoustic-kit/hihat.mp3'
    }
  };

  // Initialize and load instruments
  async function loadInstruments() {
    console.log('🎵 Loading instruments...');
    
    // Check if SampleLibrary is available
    if (typeof SampleLibrary === 'undefined') {
      console.error('❌ SampleLibrary not found! Make sure Tonejs-Instruments.js is loaded.');
      createFallbackInstruments();
      return;
    }

    console.log('✅ SampleLibrary found:', SampleLibrary);
    
    // Set the base URL for samples
    SampleLibrary.baseUrl = '../tonejs-instruments/samples/';
    
    try {
      // Load drums first (uses direct URLs)
      console.log('🥁 Loading drums...');
      const drumUrls = availableInstruments.drums;
      
      await new Promise((resolve, reject) => {
        instruments.drums = new Tone.Sampler({
          urls: drumUrls,
          onload: () => {
            console.log('✅ Drums loaded successfully');
            resolve();
          },
          onerror: (error) => {
            console.error('❌ Error loading drums:', error);
            instruments.drums = new Tone.MembraneSynth();
            resolve(); // Continue even if drums fail
          }
        }).connect(reverb);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          console.warn('⏰ Drums loading timeout, using fallback');
          if (!instruments.drums) {
            instruments.drums = new Tone.MembraneSynth().connect(reverb);
          }
          resolve();
        }, 10000);
      });
      
      // Load other instruments using SampleLibrary
      console.log('🎻 Loading SampleLibrary instruments...');
      const instrumentsToLoad = Object.keys(availableInstruments)
        .filter(name => name !== 'drums')
        .map(name => availableInstruments[name]);
      
      console.log('📦 Instruments to load:', instrumentsToLoad);
      
      await new Promise((resolve, reject) => {
        let loadedCount = 0;
        const totalInstruments = instrumentsToLoad.length;
        
        const loadedInstruments = SampleLibrary.load({
          instruments: instrumentsToLoad,
          baseUrl: '../tonejs-instruments/samples/',
          onload: () => {
            loadedCount++;
            console.log(`📈 Loaded ${loadedCount}/${totalInstruments} instruments`);
            
            if (loadedCount === totalInstruments) {
              console.log('✅ All SampleLibrary instruments loaded');
              resolve(loadedInstruments);
            }
          }
        });
        
        // Map loaded instruments immediately
        Object.keys(availableInstruments).forEach(name => {
          if (name !== 'drums') {
            const instrumentName = availableInstruments[name];
            if (loadedInstruments && loadedInstruments[instrumentName]) {
              instruments[name] = loadedInstruments[instrumentName].connect(reverb);
              console.log(`✅ ${name} (${instrumentName}) connected`);
            } else {
              console.warn(`⚠️ ${name} not immediately available, will create fallback`);
              instruments[name] = new Tone.PolySynth(Tone.Synth).connect(reverb);
            }
          }
        });
        
        // Resolve immediately if instruments are already available
        if (Object.keys(loadedInstruments).length === totalInstruments) {
          resolve(loadedInstruments);
        }
        
        // Timeout after 15 seconds
        setTimeout(() => {
          console.warn('⏰ SampleLibrary loading timeout, using fallbacks');
          createFallbackInstruments();
          resolve(loadedInstruments);
        }, 15000);
      });
      
    } catch (error) {
      console.error('❌ Error loading instruments:', error);
      createFallbackInstruments();
    }
    
    console.log('🎵 Instrument loading completed');
    console.log('📊 Available instruments:', Object.keys(instruments));
  }
  
  function createFallbackInstruments() {
    console.log('🔧 Creating fallback instruments...');
    Object.keys(availableInstruments).forEach(name => {
      if (!instruments[name]) {
        if (name === 'drums') {
          instruments[name] = new Tone.MembraneSynth().connect(reverb);
        } else {
          instruments[name] = new Tone.PolySynth(Tone.Synth).connect(reverb);
        }
        console.log(`🎛️ Created fallback for: ${name}`);
      }
    });
  }

  // Main generation function
  function generate(options) {
    console.log('🎵 Generating music with options:', options);
    console.log('📊 Available instruments:', Object.keys(instruments));
    console.log('🎛️ Requested instruments:', options.instruments);

    if (Tone.context.state !== 'running') {
        console.log('🔊 Starting AudioContext...');
        Tone.context.resume();
    }
    
    // Stop any previous music
    if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }

    // 1. Music Theory Setup
    const key = options.key || 'C';
    const genre = options.genre || 'pop';
    const mood = options.mood || 'happy';
    const length = options.length || 16; // Default to 16 measures
    const complexity = options.complexity || 'normal';
    const isLooping = options.isLooping !== undefined ? options.isLooping : true;

    // Determine scale based on mood
    let scaleName = 'major';
    if (mood === 'sad' || mood === 'melancholic' || mood === 'mysterious') {
        scaleName = 'natural_minor';
    } else if (genre === 'jazz') {
        scaleName = Math.random() > 0.5 ? 'major' : 'dorian';
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

    // 2. Element Generation with improved musical logic
    const chordPart = createChordPart(progressionChords);
    const melodyPart = createMelody(progressionChords, scale, key, complexity);
    const bassPart = createBassline(progressionChords, complexity, key);
    const drumPart = createDrums(length, complexity, genre);

    console.log('📊 Generated parts:', {
        chords: chordPart.length,
        melody: melodyPart.length, 
        bass: bassPart.length,
        drums: drumPart.length
    });

    // 3. Scheduling with safe instrument access
    console.log('🎼 Scheduling music parts...');
    
    // Helper function to safely get instrument
    const safeGetInstrument = (instrumentRole, fallbackName = 'piano') => {
      const requestedInstrument = options.instruments[instrumentRole];
      if (instruments[requestedInstrument]) {
        console.log(`✅ Using ${instrumentRole}: ${requestedInstrument}`);
        return instruments[requestedInstrument];
      }
      if (instruments[fallbackName]) {
        console.log(`⚠️ Fallback ${instrumentRole}: ${fallbackName} (${requestedInstrument} not available)`);
        return instruments[fallbackName];
      }
      console.log(`❌ Creating emergency synth for ${instrumentRole}`);
      return new Tone.PolySynth(Tone.Synth).connect(reverb);
    };

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

    console.log('Music scheduled. Ready to play.');
    // Tone.Transport.start(); // Removed autoplay

    // Store and return the generated data
    const generatedData = {
        chordPart,
        melodyPart,
        bassPart,
        drumPart,
        tempo: Tone.Transport.bpm.value,
        options // Store all options used for this generation
    };
    
    lastGeneratedMusic = generatedData;
    return generatedData;
  }

  function createChordProgression(baseProgression, length, isLooping, key, scaleName) {
    console.log(`🎼 Creating chord progression: ${baseProgression.join('-')} in ${key} ${scaleName}`);
    
    try {
        // Get the scale notes
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
            
            // Determine chord quality based on scale degree and mode
            let chordSymbol;
            if (scaleName.includes('minor') || scaleName === 'natural_minor') {
                // Natural minor scale chord qualities
                const minorQualities = ['m', 'dim', 'M', 'm', 'm', 'M', 'M'];
                chordSymbol = rootNote + minorQualities[scaleIndex];
            } else {
                // Major scale chord qualities  
                const majorQualities = ['M', 'm', 'm', 'M', 'M', 'm', 'dim'];
                chordSymbol = rootNote + majorQualities[scaleIndex];
            }
            
            progression.push(chordSymbol);
        }
        
        // If looping, ensure smooth resolution
        if (isLooping && length > 4) {
            // Make the last chord lead back to the first
            const dominantIndex = 4; // V chord
            const dominantNote = scaleNotes[dominantIndex];
            progression[length - 1] = dominantNote + (scaleName.includes('minor') ? 'm' : 'M');
        }
        
        console.log(`🎵 Final chord progression:`, progression);
        return progression;
        
    } catch (error) {
        console.error('Failed to create chord progression:', error);
        // Fallback to simple progression in C major
        const fallback = ['C', 'Am', 'F', 'G'];
        const result = [];
        for (let i = 0; i < length; i++) {
            result.push(fallback[i % fallback.length]);
        }
        return result;
    }
  }

  function createChordPart(progression) {
    // Creates chord accompaniment with better voicing and rhythm
    let chordPart = [];
    
    progression.forEach((chordName, i) => {
        const chord = Tonal.Chord.get(chordName);
        let notes = chord.notes;
        
        // Fallback if chord is invalid
        if (!notes || notes.length === 0) {
            console.warn(`Invalid chord: ${chordName}, using C major`);
            notes = ['C', 'E', 'G'];
        }
        
        // Use better voicing - spread notes across octaves
        const voicedNotes = notes.slice(0, 4).map((note, index) => {
            const octave = 3 + Math.floor(index / 3); // Spread across octaves 3-4
            return note + octave;
        });
        
        // Create rhythmic pattern instead of just whole notes
        chordPart.push({
            time: `${i}:0:0`,
            notes: voicedNotes,
            duration: '2n'
        });
        
        chordPart.push({
            time: `${i}:2:0`,
            notes: voicedNotes,
            duration: '2n'
        });
    });
    
    return chordPart;
  }

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
      console.log(`🎵 Note density:`, noteDensity);

      progression.forEach((chordName, measureIndex) => {
          const chord = Tonal.Chord.get(chordName);
          const chordTones = chord.notes || [];
          
          console.log(`Measure ${measureIndex}: ${chordName} (${chordTones.join(', ')})`);
          
          // Generate notes for this measure
          for (let noteIndex = 0; noteIndex < noteDensity; noteIndex++) {
              // Calculate timing within the measure
              const subdivision = 4 / noteDensity; // 4 quarter notes per measure
              const timing = `${measureIndex}:${Math.floor(noteIndex * subdivision)}:0`;
              
              let selectedNote;
              let noteOctave = currentOctave;
              
              // On beat 1, prefer chord tones
              if (noteIndex === 0 && chordTones.length > 0) {
                  selectedNote = chordTones[Math.floor(Math.random() * chordTones.length)];
                  console.log(`Beat 1: Using chord tone ${selectedNote}`);
              } else {
                  // For other beats, create stepwise motion
                  const stepDirection = Math.random() > 0.5 ? 1 : -1;
                  const newIndex = Math.max(0, Math.min(scaleNotes.length - 1, 
                      lastNoteIndex + stepDirection));
                  
                  selectedNote = scaleNotes[newIndex];
                  lastNoteIndex = newIndex;
                  
                  console.log(`Step motion: ${selectedNote} (index ${newIndex})`);
              }
              
              // Add octave to note
              const fullNote = selectedNote + noteOctave;
              
              // Determine note duration based on position
              let duration = '4n'; // Quarter note default
              if (noteIndex === 0) {
                  duration = '4n'; // Downbeat gets quarter note
              } else if (noteDensity === 8) {
                  duration = '8n'; // Eighth notes for complex melodies
              }
              
              melody.push({
                  time: timing,
                  pitch: fullNote,
                  duration: duration
              });
              
              console.log(`Added note: ${fullNote} at ${timing} (${duration})`);
          }
      });
      
      console.log(`🎵 Generated melody with ${melody.length} notes`);
      return melody;
  }
              let selectedNote;
              if (lastNote && Math.random() < 0.7) {
                  // 70% chance for stepwise motion
                  selectedNote = getStepwiseNote(lastNote, scaleNotes);
              } else {
                  // 30% chance for leap (chord tone preferred)
                  selectedNote = chordTones[Math.floor(Math.random() * chordTones.length)] || 
                                scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
              }
              
              // Octave selection with smoother transitions
              if (lastNote) {
                  const interval = Tonal.Interval.distance(lastNote, selectedNote + currentOctave);
                  const semitones = Tonal.Interval.semitones(interval);
                  
                  // Adjust octave to keep reasonable range
                  if (semitones > 7) currentOctave = Math.max(3, currentOctave - 1);
                  else if (semitones < -7) currentOctave = Math.min(5, currentOctave + 1);
              }
              
              // Rhythm variation based on complexity
              let duration = '4n';
              if (complexity === 'simple') {
                  duration = noteIndex % 2 === 0 ? '4n' : '4n';
              } else if (complexity === 'normal') {
                  duration = Math.random() > 0.3 ? '4n' : '8n';
              } else { // complex
                  const rhythms = ['8n', '4n', '8n', '16n'];
                  duration = rhythms[Math.floor(Math.random() * rhythms.length)];
              }
              
              const fullNote = selectedNote + currentOctave;
              
              melody.push({
                  time: `${measureIndex}:${Math.floor(timing)}:${Math.floor((timing % 1) * 4)}`,
                  pitch: fullNote,
                  duration: duration
              });
              
              lastNote = fullNote;
          }
      });
      
      return melody;
  }

  // Helper function for stepwise motion
  function getStepwiseNote(lastNote, scaleNotes) {
      const lastNoteName = Tonal.Note.pitchClass(lastNote);
      const scaleIndex = scaleNotes.findIndex(note => 
          Tonal.Note.pitchClass(note) === lastNoteName
      );
      
      if (scaleIndex === -1) return scaleNotes[0]; // Fallback
      
      // Choose next or previous note in scale
      const direction = Math.random() > 0.5 ? 1 : -1;
      const newIndex = scaleIndex + direction;
      
      if (newIndex >= 0 && newIndex < scaleNotes.length) {
          return scaleNotes[newIndex];
      } else {
          // If at scale boundary, go the other direction
          return scaleNotes[scaleIndex - direction] || scaleNotes[scaleIndex];
      }
  }

  function createBassline(progression, complexity, key) {
      console.log(`🎵 Creating bassline with ${complexity} complexity`);
      
      let bassline = [];
      
      progression.forEach((chordName, measureIndex) => {
          const chord = Tonal.Chord.get(chordName);
          const root = chord.tonic || chord.notes[0] || 'C';
          
          console.log(`Measure ${measureIndex}: ${chordName} -> root: ${root}`);
          
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
          } else if (complexity === 'normal') {
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
          } else {
              // Complex walking bass
              const chordNotes = chord.notes || [root];
              for (let beat = 0; beat < 4; beat++) {
                  const noteIndex = beat % chordNotes.length;
                  const note = chordNotes[noteIndex];
                  bassline.push({
                      time: `${measureIndex}:${beat}:0`,
                      pitch: note + '2',
                      duration: '4n'
                  });
              }
          }
      });
      
      console.log(`🎵 Generated bassline with ${bassline.length} notes`);
      return bassline;
  }
              });
              bassline.push({
                  time: `${i}:2:0`,
                  pitch: root + '2',
                  duration: '2n'
              });
          } else if (complexity === 'normal') {
              // Walking bass with root and fifth
              const fifth = chord.notes[2] || chord.notes[1]; // Try to get the fifth
              bassline.push({
                  time: `${i}:0:0`,
                  pitch: root + '2',
                  duration: '4n'
              });
              bassline.push({
                  time: `${i}:1:0`,
                  pitch: root + '2',
                  duration: '4n'
              });
              bassline.push({
                  time: `${i}:2:0`,
                  pitch: fifth + '2',
                  duration: '4n'
              });
              bassline.push({
                  time: `${i}:3:0`,
                  pitch: root + '2',
                  duration: '4n'
              });
          } else { // complex
              // More active bass with chord tones
              const chordTones = chord.notes;
              for (let j = 0; j < 4; j++) {
                  let noteChoice = root;
                  if (j === 1 && chordTones.length > 2) noteChoice = chordTones[2]; // Fifth
                  else if (j === 2 && chordTones.length > 1) noteChoice = chordTones[1]; // Third
                  else if (j === 3) noteChoice = root;
                  
                  bassline.push({
                      time: `${i}:${j}:0`,
                      pitch: noteChoice + '2',
                      duration: '4n'
                  });
              }
          }
      });
      return bassline;
  }

  function createDrums(length, complexity) {
      // Improved drum patterns with better groove
      let pattern = [];
      
      for (let i = 0; i < length; i++) {
          // Basic kick pattern - on 1 and 3
          pattern.push({ time: `${i}:0:0`, pitch: 'C1', duration: '8n' }); 
          pattern.push({ time: `${i}:2:0`, pitch: 'C1', duration: '8n' });
          
          // Snare on 2 and 4 (backbeat)
          pattern.push({ time: `${i}:1:0`, pitch: 'D1', duration: '8n' }); 
          pattern.push({ time: `${i}:3:0`, pitch: 'D1', duration: '8n' });

          // Hi-hat patterns based on complexity
          if (complexity === 'simple') {
              // Simple 4/4 hi-hat pattern
              for (let j = 0; j < 4; j++) {
                  pattern.push({ time: `${i}:${j}:0`, pitch: 'F#1', duration: '8n' });
              }
          } else if (complexity === 'normal') {
              // 8th note hi-hat pattern
              for (let j = 0; j < 8; j++) {
                  const velocity = (j % 2 === 0) ? 0.8 : 0.6; // Accent on downbeats
                  pattern.push({ 
                      time: `${i}:${Math.floor(j/2)}:${(j%2) * 2}`, 
                      pitch: 'F#1', 
                      duration: '8n',
                      velocity: velocity
                  });
              }
          } else { // complex
              // 16th note hi-hat with variations
              for (let j = 0; j < 16; j++) {
                  if (Math.random() < 0.85) { // 85% chance for each hi-hat hit
                      const velocity = (j % 4 === 0) ? 0.9 : (j % 2 === 0) ? 0.7 : 0.5;
                      pattern.push({ 
                          time: `${i}:${Math.floor(j/4)}:${(j%4)}`, 
                          pitch: 'F#1', 
                          duration: '16n',
                          velocity: velocity
                      });
                  }
              }
          }

          // Add occasional fills for complex patterns
          if (complexity === 'complex' && (i + 1) % 8 === 0 && i > 0) {
              // Replace last beat with a fill
              pattern = pattern.filter(note => 
                  !(note.time.startsWith(`${i}:3`) && note.pitch === 'D1')
              );
              
              // Simple snare roll fill
              pattern.push({ time: `${i}:3:0`, pitch: 'D1', duration: '16n' });
              pattern.push({ time: `${i}:3:1`, pitch: 'D1', duration: '16n' });
              pattern.push({ time: `${i}:3:2`, pitch: 'D1', duration: '16n' });
              pattern.push({ time: `${i}:3:3`, pitch: 'D1', duration: '16n' });
          }
      }
      
      return pattern;
  }

  function exportMIDI() {
    if (!lastGeneratedMusic) {
        console.error("Cannot export MIDI: No music has been generated yet.");
        throw new Error("No music generated to export.");
    }

    const midi = new Midi.Midi();
    midi.header.setTempo(lastGeneratedMusic.tempo);

    const addTrack = (name, part, isDrums = false, isChords = false) => {
        const track = midi.addTrack();
        track.name = name;
        
        if (isChords) {
             part.forEach(chord => {
                chord.notes.forEach(notePitch => {
                    track.addNote({
                        midi: Tonal.Note.midi(notePitch),
                        time: Tone.Time(chord.time).toSeconds(),
                        duration: Tone.Time(chord.duration).toSeconds()
                    });
                });
            });
        } else {
            part.forEach(note => {
                track.addNote({
                    midi: Tonal.Note.midi(note.pitch),
                    time: Tone.Time(note.time).toSeconds(),
                    duration: Tone.Time(note.duration).toSeconds(),
                    channel: isDrums ? 9 : 0
                });
            });
        }
    };

    addTrack('Melody', lastGeneratedMusic.melodyPart);
    addTrack('Chords', lastGeneratedMusic.chordPart, false, true);
    addTrack('Bass', lastGeneratedMusic.bassPart);
    addTrack('Drums', lastGeneratedMusic.drumPart, true);

    return new Blob([midi.toArray()], { type: 'audio/midi' });
  }

  async function exportWAV() {
    if (!lastGeneratedMusic) {
        console.error("Cannot export WAV: No music has been generated yet.");
        throw new Error("No music generated to export.");
    }

    // Stop playback before offline rendering
    await Tone.Transport.stop();

    const duration = Tone.Time(`${lastGeneratedMusic.options.length}m`).toSeconds();
    
    const buffer = await Tone.Offline(async (offlineContext) => {
        // This function runs in an offline audio context
        const offlineReverb = new Tone.Reverb().toDestination();
        offlineReverb.wet.value = lastGeneratedMusic.options.reverb || 0.1;

        // Re-create instruments in the offline context using existing loaded instruments
        const offlineInstruments = {};
        
        // Use fallback synths for offline rendering since SampleLibrary doesn't work in offline context
        Object.keys(availableInstruments).forEach(name => {
            if (name === 'drums') {
                offlineInstruments[name] = new Tone.MembraneSynth().connect(offlineReverb);
            } else {
                offlineInstruments[name] = new Tone.PolySynth(Tone.Synth).connect(offlineReverb);
            }
        });
        
        console.log('Offline instruments created for WAV export');

        // Schedule the parts in the offline context
        const musicData = lastGeneratedMusic;
        const options = musicData.options;
        offlineContext.transport.bpm.value = musicData.tempo;

        new Tone.Part((time, note) => {
            offlineInstruments[options.instruments.chords].triggerAttackRelease(note.notes, note.duration, time);
        }, musicData.chordPart).start(0);
        new Tone.Part((time, note) => {
            offlineInstruments[options.instruments.melody].triggerAttackRelease(note.pitch, note.duration, time);
        }, musicData.melodyPart).start(0);
        new Tone.Part((time, note) => {
            offlineInstruments[options.instruments.bass].triggerAttackRelease(note.pitch, note.duration, time);
        }, musicData.bassPart).start(0);
        new Tone.Part((time, note) => {
            offlineInstruments.drums.triggerAttackRelease(note.pitch, note.duration, time);
        }, musicData.drumPart).start(0);
        
        offlineContext.transport.start();

    }, duration);

    // Convert buffer to WAV
    const audioBuffer = buffer.get();
    const wavBlob = bufferToWave(audioBuffer);
    return wavBlob;
  }

  // Helper function to convert AudioBuffer to a WAV Blob
  function bufferToWave(abuffer) {
    // ... implementation from a standard library or source ...
    // This is a complex function, so we'll use a simplified placeholder
    // In a real scenario, you'd use a library or a well-tested function.
    let numOfChan = abuffer.numberOfChannels,
        length = abuffer.length * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [], i, sample,
        offset = 0,
        pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"

    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit

    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length

    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
            view.setInt16(pos, sample, true);          // write 16-bit sample
            pos += 2;
        }
        offset++
    }

    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }
  }


  function playFromHistory(musicData) {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
    }
    
    if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
        Tone.Transport.cancel();
    }

    lastGeneratedMusic = musicData; // Set the context to the history item
    const options = musicData.options;
    Tone.Transport.bpm.value = musicData.tempo;

    // Clear previous parts before scheduling new ones
    Tone.Transport.cancel(0);

    // Safe instrument getter for playback
    const safeGetInstrument = (role, fallbackName = 'piano') => {
        const selected = musicData.options.instruments[role];
        if (instruments[selected]) {
            return instruments[selected];
        }
        if (instruments[fallbackName]) {
            console.log(`⚠️ Using fallback ${fallbackName} for ${role} (${selected} not available)`);
            return instruments[fallbackName];
        }
        console.log(`❌ Creating emergency synth for ${role}`);
        return new Tone.PolySynth(Tone.Synth).toDestination();
    };

    new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('chords', 'piano');
        if (instrument && note.notes) {
          instrument.triggerAttackRelease(note.notes, note.duration, time);
        }
    }, musicData.chordPart).start(0);

    new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('melody', 'piano');
        if (instrument && note.pitch) {
          instrument.triggerAttackRelease(note.pitch, note.duration, time);
        }
    }, musicData.melodyPart).start(0);
    
    new Tone.Part((time, note) => {
        const instrument = safeGetInstrument('bass', 'piano');
        if (instrument && note.pitch) {
          instrument.triggerAttackRelease(note.pitch, note.duration, time);
        }
    }, musicData.bassPart).start(0);

    new Tone.Part((time, note) => {
        if (instruments.drums && note.pitch) {
          instruments.drums.triggerAttackRelease(note.pitch, note.duration, time);
        }
    }, musicData.drumPart).start(0);

    const totalMeasures = musicData.options.length || 4;
    Tone.Transport.loop = musicData.options.isLooping;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = `${totalMeasures}m`;

    // Don't auto-start playback - wait for user to press play button
    // Tone.Transport.start(); // Removed auto-play
  }


  function stop() {
    if (Tone.Transport.state !== 'stopped') {
        Tone.Transport.stop();
    }
  }

  function pause() {
    if (Tone.Transport.state === 'started') {
        Tone.Transport.pause();
    }
  }

  function play() {
    if (Tone.Transport.state !== 'started') {
        Tone.Transport.start();
    }
  }

  // Public API
  return {
    loadInstruments,
    generate,
    stop,
    pause,
    play,
    exportMIDI,
    exportWAV,
    playFromHistory,
    setReverb: (value) => {
        if (reverb) {
            reverb.wet.value = value;
        }
    },
    getTransport: () => Tone.Transport,
    getKeywordInfo: (keyword) => keywordDictionary[keyword],
    getTempoRange: (tempoName) => musicRulebook.tempos[tempoName] || musicRulebook.tempos.medium,
  };
})();

