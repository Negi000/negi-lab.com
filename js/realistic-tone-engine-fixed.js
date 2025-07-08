/**
 * 高品質BGM生成エンジン（Tone.js + リアル楽器サンプル）
 * SampleLibraryを使用してリアル楽器音源を読み込み
 */
class RealisticToneEngine {
  constructor() {
    this.samplers = {};
    this.loadingStatus = {};
    this.initialized = false;
    this.currentComposition = null;
    
    // 楽器定義
    this.instruments = {
      'piano': { name: 'ピアノ', category: 'keyboard' },
      'guitar-acoustic': { name: 'アコースティックギター', category: 'strings' },
      'guitar-electric': { name: 'エレキギター', category: 'strings' },
      'bass-electric': { name: 'エレキベース', category: 'bass' },
      'violin': { name: 'バイオリン', category: 'strings' },
      'cello': { name: 'チェロ', category: 'strings' },
      'saxophone': { name: 'サックス', category: 'wind' },
      'trumpet': { name: 'トランペット', category: 'wind' },
      'flute': { name: 'フルート', category: 'wind' },
      'trombone': { name: 'トロンボーン', category: 'wind' },
      'clarinet': { name: 'クラリネット', category: 'wind' },
      'drums': { name: 'ドラム', category: 'percussion' }
    };

    // 音楽理論データ
    this.scales = {
      'major': [0, 2, 4, 5, 7, 9, 11],
      'minor': [0, 2, 3, 5, 7, 8, 10],
      'pentatonic': [0, 2, 4, 7, 9],
      'blues': [0, 3, 5, 6, 7, 10]
    };

    this.chordProgressions = {
      'pop': ['I', 'V', 'vi', 'IV'],
      'jazz': ['ii', 'V', 'I', 'vi'],
      'rock': ['I', 'VII', 'IV', 'I'],
      'blues': ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V']
    };

    this.genres = {
      'pop': { tempo: 120, scale: 'major', progression: 'pop' },
      'rock': { tempo: 140, scale: 'minor', progression: 'rock' },
      'jazz': { tempo: 100, scale: 'major', progression: 'jazz' },
      'classical': { tempo: 80, scale: 'major', progression: 'pop' },
      'electronic': { tempo: 128, scale: 'minor', progression: 'pop' },
      'blues': { tempo: 90, scale: 'blues', progression: 'blues' }
    };
  }

  /**
   * エンジンの初期化
   */
  async initialize() {
    try {
      console.log('RealisticToneEngine: Initializing...');
      
      // Tone.jsの開始
      if (Tone.context.state !== 'running') {
        await Tone.start();
        console.log('Tone.js context started');
      }

      // 基本楽器を読み込み
      await this.loadBasicInstruments();
      
      this.initialized = true;
      console.log('RealisticToneEngine: Initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize RealisticToneEngine:', error);
      this.initialized = false;
      throw error;
    }
  }

  /**
   * 基本楽器の読み込み
   */
  async loadBasicInstruments() {
    try {
      const basicInstruments = [
        'piano', 'guitar-acoustic', 'bass-electric', 
        'violin', 'flute', 'saxophone', 'trumpet'
      ];
      
      console.log('Loading instruments:', basicInstruments);
      
      // SampleLibraryを使用した楽器読み込み
      const loadPromise = new Promise((resolve, reject) => {
        if (!window.SampleLibrary) {
          console.warn('SampleLibrary not available, using fallback instruments');
          this.loadFallbackInstruments();
          resolve();
          return;
        }

        try {
          const instruments = SampleLibrary.load({
            instruments: basicInstruments,
            baseUrl: "https://cdn.jsdelivr.net/gh/nbrosowsky/tonejs-instruments/samples/",
            onload: () => {
              console.log('✓ Instruments loaded successfully');
              
              basicInstruments.forEach(key => {
                if (instruments[key]) {
                  instruments[key].toDestination();
                  this.samplers[key] = instruments[key];
                  this.loadingStatus[key] = { status: 'loaded', progress: 100 };
                  console.log(`✓ ${key} loaded`);
                } else {
                  console.warn(`⚠ ${key} failed, using fallback`);
                  this.loadFallbackInstrument(key);
                }
              });
              
              resolve();
            },
            onerror: (error) => {
              console.error('Instrument loading error:', error);
              this.loadFallbackInstruments();
              resolve(); // エラーでも続行
            }
          });
        } catch (error) {
          console.error('SampleLibrary error:', error);
          this.loadFallbackInstruments();
          resolve();
        }
      });

      // タイムアウト設定
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          console.warn('Instrument loading timeout, using fallback');
          this.loadFallbackInstruments();
          resolve();
        }, 15000);
      });

      await Promise.race([loadPromise, timeoutPromise]);
      
    } catch (error) {
      console.error('Failed to load instruments:', error);
      this.loadFallbackInstruments();
    }
  }

  /**
   * フォールバック楽器の読み込み
   */
  loadFallbackInstruments() {
    console.log('Loading fallback instruments...');
    
    const fallbacks = {
      'piano': () => new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.3, release: 1 }
      }).toDestination(),
      
      'guitar-acoustic': () => new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.9
      }).toDestination(),
      
      'bass-electric': () => new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.8 },
        filter: { frequency: 200 }
      }).toDestination(),
      
      'violin': () => new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.2, decay: 0.1, sustain: 0.8, release: 0.5 }
      }).toDestination(),
      
      'flute': () => new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.4 }
      }).toDestination(),
      
      'saxophone': () => new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 }
      }).toDestination(),
      
      'trumpet': () => new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.2 }
      }).toDestination()
    };

    Object.keys(fallbacks).forEach(key => {
      this.samplers[key] = fallbacks[key]();
      this.loadingStatus[key] = { status: 'fallback', progress: 100 };
      console.log(`✓ Fallback ${key} loaded`);
    });
  }

  loadFallbackInstrument(key) {
    if (!this.samplers[key]) {
      this.loadFallbackInstruments();
    }
  }

  /**
   * 音楽生成のメイン処理
   */
  async generateMusic(settings) {
    try {
      console.log('Generating music with settings:', settings);

      if (!this.initialized) {
        throw new Error('Engine not initialized');
      }

      // 設定の解析とデフォルト値
      const params = this.parseSettings(settings);
      console.log('Parsed parameters:', params);

      // 楽曲構造の作成
      const composition = this.createComposition(params);
      console.log('Created composition:', composition);

      // レンダリング
      const audioData = await this.renderComposition(composition, params);
      
      this.currentComposition = {
        composition,
        params,
        audioData,
        timestamp: Date.now()
      };

      return {
        success: true,
        audioData,
        composition,
        waveform: this.generateWaveform(audioData),
        metadata: {
          duration: params.duration,
          tempo: params.tempo,
          key: params.key,
          scale: params.scale,
          instruments: params.instruments,
          genre: params.genre
        }
      };

    } catch (error) {
      console.error('Music generation failed:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.generateSimpleFallback()
      };
    }
  }

  /**
   * 設定の解析
   */
  parseSettings(settings) {
    const defaults = {
      genre: 'pop',
      mood: 'happy',
      tempo: 120,
      duration: 30,
      key: 'C',
      scale: 'major',
      instruments: ['piano', 'guitar-acoustic', 'bass-electric']
    };

    // ジャンルベースの自動設定
    const genreData = this.genres[settings.genre] || this.genres.pop;
    
    return {
      genre: settings.genre || defaults.genre,
      mood: settings.mood || defaults.mood,
      tempo: settings.tempo || genreData.tempo,
      duration: parseInt(settings.duration) || defaults.duration,
      key: settings.key || defaults.key,
      scale: settings.scale || genreData.scale,
      instruments: settings.instruments || defaults.instruments,
      progression: genreData.progression,
      structure: this.generateStructure(settings.duration || defaults.duration)
    };
  }

  /**
   * 楽曲構造の生成
   */
  generateStructure(duration) {
    const sections = [];
    let currentTime = 0;
    
    if (duration <= 15) {
      sections.push({ type: 'verse', start: 0, duration: duration });
    } else if (duration <= 30) {
      sections.push({ type: 'intro', start: 0, duration: 4 });
      sections.push({ type: 'verse', start: 4, duration: duration - 8 });
      sections.push({ type: 'outro', start: duration - 4, duration: 4 });
    } else {
      sections.push({ type: 'intro', start: 0, duration: 4 });
      sections.push({ type: 'verse', start: 4, duration: 8 });
      sections.push({ type: 'chorus', start: 12, duration: 8 });
      sections.push({ type: 'verse', start: 20, duration: 8 });
      sections.push({ type: 'outro', start: duration - 2, duration: 2 });
    }
    
    return sections;
  }

  /**
   * コンポジションの作成
   */
  createComposition(params) {
    const scale = this.scales[params.scale] || this.scales.major;
    const progression = this.chordProgressions[params.progression] || this.chordProgressions.pop;
    
    const composition = {
      tempo: params.tempo,
      key: params.key,
      scale: scale,
      progression: progression,
      tracks: []
    };

    // 各楽器のトラックを作成
    params.instruments.forEach((instrument, index) => {
      if (this.samplers[instrument]) {
        const track = this.createTrack(instrument, scale, progression, params, index);
        composition.tracks.push(track);
      }
    });

    return composition;
  }

  /**
   * トラックの作成
   */
  createTrack(instrument, scale, progression, params, trackIndex) {
    const track = {
      instrument: instrument,
      sampler: this.samplers[instrument],
      notes: [],
      pattern: this.getInstrumentPattern(instrument, params.genre)
    };

    // 楽器の役割に応じてメロディを生成
    switch (this.instruments[instrument]?.category) {
      case 'keyboard':
        track.notes = this.generateMelody(scale, params.duration, params.tempo);
        break;
      case 'strings':
        if (instrument.includes('bass')) {
          track.notes = this.generateBassLine(scale, params.duration, params.tempo);
        } else {
          track.notes = this.generateHarmony(scale, params.duration, params.tempo);
        }
        break;
      case 'bass':
        track.notes = this.generateBassLine(scale, params.duration, params.tempo);
        break;
      case 'wind':
        track.notes = this.generateMelody(scale, params.duration, params.tempo, true);
        break;
      default:
        track.notes = this.generateSimplePattern(scale, params.duration, params.tempo);
    }

    return track;
  }

  /**
   * メロディの生成
   */
  generateMelody(scale, duration, tempo, isLead = false) {
    const notes = [];
    const noteInterval = 60 / tempo; // 四分音符の長さ
    const totalBeats = Math.floor(duration / noteInterval);
    
    let currentNote = isLead ? scale[4] : scale[2]; // リードは高め、伴奏は低めから開始
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const time = beat * noteInterval;
      
      // メロディの動きを生成（ランダムウォーク）
      const direction = Math.random() - 0.5;
      let nextIndex = scale.indexOf(currentNote % 12);
      
      if (direction > 0.2 && nextIndex < scale.length - 1) {
        nextIndex++;
      } else if (direction < -0.2 && nextIndex > 0) {
        nextIndex--;
      }
      
      currentNote = scale[nextIndex] + Math.floor(currentNote / 12) * 12;
      
      // 音域制限
      if (currentNote < 48) currentNote += 12; // C3より下は上げる
      if (currentNote > 84) currentNote -= 12; // C6より上は下げる
      
      const noteName = this.midiToNoteName(currentNote);
      const noteDuration = this.getNoteDuration(beat, tempo);
      
      notes.push({
        time: time,
        note: noteName,
        duration: noteDuration,
        velocity: 0.7 + Math.random() * 0.3
      });
    }
    
    return notes;
  }

  /**
   * ベースラインの生成
   */
  generateBassLine(scale, duration, tempo) {
    const notes = [];
    const noteInterval = 60 / tempo;
    const totalBeats = Math.floor(duration / noteInterval);
    
    const bassNotes = scale.map(note => note + 36); // 低いオクターブ
    
    for (let beat = 0; beat < totalBeats; beat += 2) {
      const time = beat * noteInterval;
      const rootNote = bassNotes[0]; // ルート音中心
      const fifthNote = bassNotes[4 % bassNotes.length]; // 5度
      
      const note = (beat % 8 < 4) ? rootNote : fifthNote;
      const noteName = this.midiToNoteName(note);
      
      notes.push({
        time: time,
        note: noteName,
        duration: noteInterval * 1.5,
        velocity: 0.8
      });
    }
    
    return notes;
  }

  /**
   * ハーモニーの生成
   */
  generateHarmony(scale, duration, tempo) {
    const notes = [];
    const chordInterval = (60 / tempo) * 4; // 全音符でコード変更
    const totalChords = Math.ceil(duration / chordInterval);
    
    for (let chord = 0; chord < totalChords; chord++) {
      const time = chord * chordInterval;
      const chordTones = [
        scale[0] + 60, // ルート
        scale[2] + 60, // 3度
        scale[4] + 60  // 5度
      ];
      
      chordTones.forEach((tone, index) => {
        const noteName = this.midiToNoteName(tone);
        notes.push({
          time: time + index * 0.1,
          note: noteName,
          duration: chordInterval - 0.2,
          velocity: 0.5
        });
      });
    }
    
    return notes;
  }

  /**
   * シンプルパターンの生成
   */
  generateSimplePattern(scale, duration, tempo) {
    const notes = [];
    const noteInterval = 60 / tempo;
    const patternLength = 4;
    
    for (let i = 0; i < duration / noteInterval; i += patternLength) {
      const baseTime = i * noteInterval;
      const note = scale[i % scale.length] + 60;
      const noteName = this.midiToNoteName(note);
      
      notes.push({
        time: baseTime,
        note: noteName,
        duration: noteInterval,
        velocity: 0.6
      });
    }
    
    return notes;
  }

  /**
   * MIDIノート番号を音名に変換
   */
  midiToNoteName(midi) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const note = noteNames[midi % 12];
    return `${note}${octave}`;
  }

  /**
   * 音符の長さを決定
   */
  getNoteDuration(beat, tempo) {
    const base = 60 / tempo;
    const patterns = [base, base / 2, base * 1.5, base / 4];
    return patterns[beat % patterns.length];
  }

  /**
   * 楽器パターンの取得
   */
  getInstrumentPattern(instrument, genre) {
    const patterns = {
      'piano': { attack: 0.1, rhythm: 'melody' },
      'guitar-acoustic': { attack: 0.05, rhythm: 'strum' },
      'bass-electric': { attack: 0.1, rhythm: 'bass' },
      'violin': { attack: 0.2, rhythm: 'legato' }
    };
    return patterns[instrument] || patterns['piano'];
  }

  /**
   * コンポジションのレンダリング
   */
  async renderComposition(composition, params) {
    try {
      console.log('Rendering composition...');
      
      // Tone.jsの録音を開始
      const recorder = new Tone.Recorder();
      Tone.Destination.connect(recorder);
      
      // 録音開始
      await recorder.start();
      
      // 全トラックのスケジュール
      composition.tracks.forEach(track => {
        this.scheduleTrack(track);
      });
      
      // 再生時間分待機
      const playbackDuration = params.duration * 1000 + 1000; // 1秒余裕
      
      // 再生開始
      Tone.Transport.bpm.value = composition.tempo;
      Tone.Transport.start();
      
      // 録音完了まで待機
      await new Promise(resolve => setTimeout(resolve, playbackDuration));
      
      // 停止と録音終了
      Tone.Transport.stop();
      Tone.Transport.cancel();
      
      const recording = await recorder.stop();
      
      console.log('Rendering completed');
      return recording;
      
    } catch (error) {
      console.error('Rendering failed:', error);
      throw error;
    }
  }

  /**
   * トラックのスケジュール
   */
  scheduleTrack(track) {
    track.notes.forEach(noteData => {
      Tone.Transport.schedule((time) => {
        if (track.sampler && track.sampler.triggerAttackRelease) {
          track.sampler.triggerAttackRelease(
            noteData.note,
            noteData.duration,
            time,
            noteData.velocity
          );
        }
      }, noteData.time);
    });
  }

  /**
   * 波形データの生成
   */
  generateWaveform(audioData) {
    if (!audioData) return [];
    
    try {
      // 簡易波形データ（実際のオーディオ解析は複雑）
      const samples = 100;
      const waveform = [];
      
      for (let i = 0; i < samples; i++) {
        const amplitude = Math.sin(i * 0.1) * 0.5 + Math.random() * 0.3;
        waveform.push(Math.max(-1, Math.min(1, amplitude)));
      }
      
      return waveform;
    } catch (error) {
      console.error('Waveform generation failed:', error);
      return [];
    }
  }

  /**
   * シンプルなフォールバック音楽
   */
  generateSimpleFallback() {
    return {
      notes: ['C4', 'D4', 'E4', 'F4', 'G4'],
      message: 'フォールバックメロディを生成しました'
    };
  }

  /**
   * 楽器読み込み状況の取得
   */
  getLoadingStatus() {
    return this.loadingStatus;
  }

  /**
   * 利用可能楽器リストの取得
   */
  getAvailableInstrumentsList() {
    return Object.keys(this.samplers).map(key => ({
      key: key,
      name: this.instruments[key]?.name || key,
      status: this.loadingStatus[key]?.status || 'unknown'
    }));
  }

  /**
   * 現在のコンポジションの再生
   */
  async playComposition(composition) {
    if (!composition || !this.initialized) {
      throw new Error('No composition to play or engine not initialized');
    }

    try {
      Tone.Transport.cancel();
      
      composition.tracks.forEach(track => {
        this.scheduleTrack(track);
      });
      
      Tone.Transport.bpm.value = composition.tempo;
      Tone.Transport.start();
      
      return true;
    } catch (error) {
      console.error('Playback failed:', error);
      return false;
    }
  }

  /**
   * 再生停止
   */
  stopPlayback() {
    try {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      return true;
    } catch (error) {
      console.error('Stop failed:', error);
      return false;
    }
  }
}

// グローバルに公開
window.RealisticToneEngine = RealisticToneEngine;
