/**
 * 高品質BGM生成エンジン（オンデマンド読み込み版）
 * Tone.js + リアル楽器サンプルを使用したオンデマンド楽器読み込みシステム
 */
class RealisticToneEngine {
  constructor() {
    this.samplers = {};
    this.loadingStatus = {};
    this.initialized = false;
    this.currentComposition = null;
    this.currentPlayer = null; // 追加: 現在のオーディオプレイヤー
    
    // 利用可能楽器の定義（Tone.js-Instruments対応）
    this.availableInstruments = {
      'piano': { name: 'ピアノ', category: 'keyboard' },
      'bass-electric': { name: 'エレキベース', category: 'bass' },
      'guitar-acoustic': { name: 'アコースティックギター', category: 'strings' },
      'guitar-electric': { name: 'エレキギター', category: 'strings' },
      'violin': { name: 'バイオリン', category: 'strings' },
      'cello': { name: 'チェロ', category: 'strings' },
      'contrabass': { name: 'コントラバス', category: 'strings' },
      'harp': { name: 'ハープ', category: 'strings' },
      'saxophone': { name: 'サックス', category: 'wind' },
      'trumpet': { name: 'トランペット', category: 'wind' },
      'trombone': { name: 'トロンボーン', category: 'wind' },
      'french-horn': { name: 'フレンチホルン', category: 'wind' },
      'tuba': { name: 'チューバ', category: 'wind' },
      'flute': { name: 'フルート', category: 'wind' },
      'clarinet': { name: 'クラリネット', category: 'wind' },
      'bassoon': { name: 'バスーン', category: 'wind' },
      'xylophone': { name: 'シロフォン', category: 'percussion' },
      'organ': { name: 'オルガン', category: 'keyboard' },
      'harmonium': { name: 'ハーモニウム', category: 'keyboard' }
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
      'blues': ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'],
      'classical': ['I', 'IV', 'V', 'I']
    };

    this.genres = {
      'pop': { tempo: 120, scale: 'major', progression: 'pop', instruments: ['piano', 'guitar-acoustic', 'bass-electric'] },
      'rock': { tempo: 140, scale: 'minor', progression: 'rock', instruments: ['guitar-electric', 'bass-electric', 'piano'] },
      'jazz': { tempo: 100, scale: 'major', progression: 'jazz', instruments: ['piano', 'saxophone', 'bass-electric'] },
      'classical': { tempo: 80, scale: 'major', progression: 'classical', instruments: ['piano', 'violin', 'cello'] },
      'electronic': { tempo: 128, scale: 'minor', progression: 'pop', instruments: ['organ', 'bass-electric'] },
      'blues': { tempo: 90, scale: 'blues', progression: 'blues', instruments: ['piano', 'guitar-acoustic', 'saxophone'] }
    };
  }

  /**
   * エンジンの初期化（軽量版）
   */
  async initialize() {
    try {
      console.log('RealisticToneEngine: Initializing (on-demand loading mode)...');
      
      // Tone.jsの開始
      if (typeof Tone === 'undefined') {
        throw new Error('Tone.js is not loaded');
      }

      if (Tone.context.state !== 'running') {
        console.log('AudioContext will start on user interaction');
      }

      // 初期化時は楽器を読み込まず、状態のみ準備
      Object.keys(this.availableInstruments).forEach(key => {
        this.loadingStatus[key] = { status: 'not-loaded', progress: 0 };
      });
      
      this.initialized = true;
      console.log('RealisticToneEngine: Initialized successfully (on-demand mode)');
      
      // 初期化完了イベント
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('musicEngineReady', {
          detail: { engine: this, mode: 'on-demand' }
        }));
      }
      
    } catch (error) {
      console.error('Failed to initialize RealisticToneEngine:', error);
      this.initialized = false;
      throw error;
    }
  }

  /**
   * 楽器のオンデマンド読み込み
   */
  async loadInstrumentOnDemand(instrumentKey) {
    // 既に読み込み済みの場合はスキップ
    if (this.samplers[instrumentKey] && this.loadingStatus[instrumentKey]?.status === 'loaded') {
      console.log(`Instrument ${instrumentKey} already loaded`);
      return this.samplers[instrumentKey];
    }

    console.log(`Loading instrument on-demand: ${instrumentKey}`);
    this.loadingStatus[instrumentKey] = { status: 'loading', progress: 0 };

    try {
      // SampleLibraryが利用可能な場合
      if (typeof SampleLibrary !== 'undefined') {
        const sampler = await this.loadWithSampleLibrary(instrumentKey);
        if (sampler) {
          this.samplers[instrumentKey] = sampler;
          this.loadingStatus[instrumentKey] = { status: 'loaded', progress: 100 };
          console.log(`✓ Successfully loaded real instrument: ${instrumentKey}`);
          return sampler;
        }
      }

      // フォールバックシンセサイザーを使用
      console.log(`Using fallback synthesizer for: ${instrumentKey}`);
      const fallbackSampler = this.createFallbackInstrument(instrumentKey);
      this.samplers[instrumentKey] = fallbackSampler;
      this.loadingStatus[instrumentKey] = { status: 'fallback', progress: 100 };
      return fallbackSampler;

    } catch (error) {
      console.error(`Failed to load instrument ${instrumentKey}:`, error);
      
      // エラー時もフォールバックを作成
      const fallbackSampler = this.createFallbackInstrument(instrumentKey);
      this.samplers[instrumentKey] = fallbackSampler;
      this.loadingStatus[instrumentKey] = { status: 'fallback', progress: 100 };
      return fallbackSampler;
    }
  }

  /**
   * SampleLibraryを使用した楽器読み込み
   */
  async loadWithSampleLibrary(instrumentKey) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Load timeout for ${instrumentKey}`));
      }, 10000); // 10秒タイムアウト

      try {
        const instruments = SampleLibrary.load({
          instruments: [instrumentKey],
          baseUrl: "https://cdn.jsdelivr.net/gh/nbrosowsky/tonejs-instruments/samples/",
          onload: () => {
            clearTimeout(timeout);
            const sampler = instruments[instrumentKey];
            if (sampler) {
              sampler.toDestination();
              resolve(sampler);
            } else {
              reject(new Error(`Sampler not found for ${instrumentKey}`));
            }
          },
          onerror: (error) => {
            clearTimeout(timeout);
            reject(error);
          }
        });

        // 即座に利用可能な場合
        if (instruments && instruments[instrumentKey]) {
          clearTimeout(timeout);
          instruments[instrumentKey].toDestination();
          resolve(instruments[instrumentKey]);
        }
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * フォールバック楽器の作成
   */
  createFallbackInstrument(instrumentKey) {
    const category = this.availableInstruments[instrumentKey]?.category || 'keyboard';
    
    switch (category) {
      case 'keyboard':
        return new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.1, decay: 0.3, sustain: 0.3, release: 1 }
        }).toDestination();
        
      case 'strings':
        if (instrumentKey.includes('bass') || instrumentKey === 'contrabass') {
          return new Tone.MonoSynth({
            oscillator: { type: 'sawtooth' },
            filter: { frequency: 200, Q: 2 },
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.8 }
          }).toDestination();
        } else {
          return new Tone.Synth({
            oscillator: { type: 'sawtooth' },
            envelope: { attack: 0.2, decay: 0.1, sustain: 0.8, release: 0.5 }
          }).toDestination();
        }
        
      case 'wind':
        return new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.4 }
        }).toDestination();
        
      case 'bass':
        return new Tone.MonoSynth({
          oscillator: { type: 'sawtooth' },
          filter: { frequency: 150, Q: 2, type: 'lowpass' },
          envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.8 }
        }).toDestination();
        
      case 'percussion':
        return new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 10,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
        }).toDestination();
        
      default:
        return new Tone.Synth().toDestination();
    }
  }

  /**
   * 複数楽器の並列読み込み
   */
  async loadMultipleInstruments(instrumentKeys, onProgress = null) {
    console.log(`Loading multiple instruments: ${instrumentKeys.join(', ')}`);
    
    const loadPromises = instrumentKeys.map(async (instrumentKey, index) => {
      try {
        const sampler = await this.loadInstrumentOnDemand(instrumentKey);
        if (onProgress) {
          onProgress(instrumentKey, index + 1, instrumentKeys.length);
        }
        return { instrumentKey, sampler, success: true };
      } catch (error) {
        console.error(`Failed to load ${instrumentKey}:`, error);
        if (onProgress) {
          onProgress(instrumentKey, index + 1, instrumentKeys.length, error);
        }
        return { instrumentKey, sampler: null, success: false, error };
      }
    });

    const results = await Promise.allSettled(loadPromises);
    return results.map(result => result.value || result.reason);
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

      // Tone.jsの開始
      if (Tone.context.state === 'suspended') {
        await Tone.start();
      }

      // 設定の解析
      const params = this.parseSettings(settings);
      console.log('Parsed parameters:', params);

      // 必要な楽器をオンデマンド読み込み
      console.log('Loading required instruments...');
      await this.loadMultipleInstruments(params.instruments, (instrument, loaded, total) => {
        console.log(`Loading progress: ${instrument} (${loaded}/${total})`);
      });

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
      instruments: settings.instruments || genreData.instruments,
      progression: genreData.progression,
      structure: this.generateStructure(settings.duration || defaults.duration)
    };
  }

  /**
   * 楽曲構造の生成
   */
  generateStructure(duration) {
    const sections = [];
    
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
    const category = this.availableInstruments[instrument]?.category;
    switch (category) {
      case 'keyboard':
        track.notes = this.generateMelody(scale, params.duration, params.tempo);
        break;
      case 'strings':
        if (instrument.includes('bass') || instrument === 'contrabass') {
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
    const noteInterval = 60 / tempo;
    const totalBeats = Math.floor(duration / noteInterval);
    
    let currentNote = isLead ? scale[4] : scale[2];
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const time = beat * noteInterval;
      
      // メロディの動きを生成
      const direction = Math.random() - 0.5;
      let nextIndex = scale.indexOf(currentNote % 12);
      
      if (direction > 0.2 && nextIndex < scale.length - 1) {
        nextIndex++;
      } else if (direction < -0.2 && nextIndex > 0) {
        nextIndex--;
      }
      
      currentNote = scale[nextIndex] + Math.floor(currentNote / 12) * 12;
      
      // 音域制限
      if (currentNote < 48) currentNote += 12;
      if (currentNote > 84) currentNote -= 12;
      
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
    
    const bassNotes = scale.map(note => note + 36);
    
    for (let beat = 0; beat < totalBeats; beat += 2) {
      const time = beat * noteInterval;
      const rootNote = bassNotes[0];
      const fifthNote = bassNotes[4 % bassNotes.length];
      
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
    const chordInterval = (60 / tempo) * 4;
    const totalChords = Math.ceil(duration / chordInterval);
    
    for (let chord = 0; chord < totalChords; chord++) {
      const time = chord * chordInterval;
      const chordTones = [
        scale[0] + 60,
        scale[2] + 60,
        scale[4] + 60
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
      
      await recorder.start();
      
      // 全トラックのスケジュール
      composition.tracks.forEach(track => {
        this.scheduleTrack(track);
      });
      
      // 再生開始
      Tone.Transport.bpm.value = composition.tempo;
      Tone.Transport.start();
      
      // 録音完了まで待機
      const playbackDuration = params.duration * 1000 + 1000;
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
    return Object.keys(this.availableInstruments).map(key => ({
      key: key,
      name: this.availableInstruments[key]?.name || key,
      category: this.availableInstruments[key]?.category || 'other',
      status: this.loadingStatus[key]?.status || 'not-loaded'
    }));
  }

  /**
   * 利用可能な楽器リストを取得（UI用）
   */
  getAvailableInstruments() {
    const instrumentData = this.getAvailableInstrumentsList();
    return instrumentData.map(key => {
      const info = this.availableInstruments[key];
      return {
        id: key,
        name: info.name,
        category: info.category,
        emoji: this.getInstrumentEmoji(key),
        default: this.isDefaultInstrument(key)
      };
    });
  }

  /**
   * 楽器の絵文字を取得
   */
  getInstrumentEmoji(key) {
    const emojiMap = {
      'piano': '🎹',
      'guitar-acoustic': '🎸',
      'guitar-electric': '🎸',
      'bass-electric': '🎸',
      'violin': '🎻',
      'cello': '🎻',
      'flute': '🎺',
      'saxophone': '🎷',
      'trumpet': '🎺',
      'drums': '🥁',
      'organ': '🎹'
    };
    return emojiMap[key] || '🎵';
  }

  /**
   * デフォルト楽器かどうか判定
   */
  isDefaultInstrument(key) {
    const defaultInstruments = ['piano', 'guitar-acoustic', 'bass-electric'];
    return defaultInstruments.includes(key);
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
   * 音声再生
   */
  async playAudio(audioBuffer) {
    try {
      if (Tone.context.state === 'suspended') {
        await Tone.start();
      }

      // 既存の再生を停止
      if (this.currentPlayer) {
        this.currentPlayer.stop();
        this.currentPlayer.dispose();
      }

      // 新しいプレイヤーを作成
      this.currentPlayer = new Tone.Player(audioBuffer).toDestination();
      await this.currentPlayer.start();
      
      return true;
    } catch (error) {
      console.error('Audio playback failed:', error);
      throw error;
    }
  }

  /**
   * 音声一時停止
   */
  async pauseAudio() {
    if (this.currentPlayer) {
      this.currentPlayer.stop();
    }
  }

  /**
   * 音声停止
   */
  async stopAudio() {
    if (this.currentPlayer) {
      this.currentPlayer.stop();
      this.currentPlayer.dispose();
      this.currentPlayer = null;
    }
  }

  /**
   * WAVダウンロード
   */
  async downloadAudio(audioBuffer, filename = 'generated-music.wav') {
    try {
      // AudioBuffer を WAV として変換
      const wavBuffer = this.audioBufferToWav(audioBuffer);
      
      // ダウンロードリンクを作成
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  }

  /**
   * AudioBuffer を WAV フォーマットに変換
   */
  audioBufferToWav(audioBuffer) {
    const length = audioBuffer.length;
    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * channels * 2);
    const view = new DataView(arrayBuffer);

    // WAVヘッダーの書き込み
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * channels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * channels * 2, true);

    // 音声データの書き込み
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }
}

// グローバルに公開
window.RealisticToneEngine = RealisticToneEngine;
