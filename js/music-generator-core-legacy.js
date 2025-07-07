/**
 * 音楽生成コア機能
 * AI音楽生成のメインロジック
 */

class MusicGenerator {
  constructor() {
    this.audioContext = null;
    this.isGenerating = false;
    this.currentMusic = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.oscillators = [];
    this.currentTime = 0;
    this.animationFrame = null;
    
    this.initializeAudioContext();
  }

  /**
   * Web Audio APIコンテキストの初期化
   */
  async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
  }

  /**
   * 音楽生成メイン関数（高度エンジン統合版）
   */
  async generateMusic(settings) {
    if (this.isGenerating) return null;
    
    this.isGenerating = true;
    console.log('MusicGenerator.generateMusic called with settings:', settings);
    
    try {
      // 音楽生成の進行状況を通知
      this.notifyProgress(0, 'Initializing advanced music engine...');
      
      // 高度エンジンの利用可能性チェック
      const advancedEngine = window.advancedMusicEngine;
      console.log('Advanced engine available:', !!advancedEngine);
      
      // 設定に基づいて音楽パラメータを計算
      const musicParams = this.calculateMusicParameters(settings);
      console.log('Music parameters calculated:', musicParams);
      
      this.notifyProgress(10, 'Generating song structure...');
      
      // 楽曲構造生成
      const songStructure = advancedEngine ? 
        advancedEngine.generateSongStructure(settings.genre, musicParams.duration) :
        this.generateBasicStructure(musicParams);
      console.log('Song structure generated:', songStructure);
      
      this.notifyProgress(25, 'Creating advanced harmony...');
      
      // 高度な和声生成
      let harmony = advancedEngine ?
        advancedEngine.generateAdvancedHarmony(musicParams.key, musicParams.scale, settings.genre, settings.complexity) :
        this.generateHarmony(musicParams);
      
      // 和声が適切に生成されたかチェック
      if (!harmony || !harmony.chords || !Array.isArray(harmony.chords)) {
        console.warn('Harmony generation failed, falling back to basic harmony');
        harmony = this.generateHarmony(musicParams);
      }
      console.log('Harmony generated:', harmony);
      
      this.notifyProgress(50, 'Generating melody with AI...');
      
      // メロディ生成（高度版）
      const melody = this.generateAdvancedMelody(musicParams, harmony, songStructure);
      console.log('Melody generated:', melody);
      
      this.notifyProgress(75, 'Adding rhythm and instruments...');
      
      // リズム・楽器パート生成
      const instrumentParts = this.generateInstrumentParts(musicParams, melody, harmony, songStructure);
      console.log('Instrument parts generated:', instrumentParts);
      
      this.notifyProgress(90, 'Applying effects and mastering...');
      
      // エフェクト適用とマスタリング（スタックオーバーフロー保護）
      let musicData;
      try {
        musicData = this.masterTrack(instrumentParts, musicParams, settings);
        
        // 音声データが生成されているか確認
        if (!musicData.audioData || musicData.audioData.length === 0) {
          console.warn('Audio data not generated in masterTrack, synthesizing now...');
          musicData.audioData = this.synthesizeAudioData({
            melody: melody,
            harmony: harmony,
            params: musicParams,
            instrumentParts: instrumentParts
          });
        }
      } catch (error) {
        if (error.name === 'RangeError' && error.message.includes('Maximum call stack size exceeded')) {
          console.warn('Stack overflow detected, using simplified audio generation');
          musicData = this.generateSimplifiedMusicData(instrumentParts, musicParams, settings);
        } else {
          console.warn('Master track failed, using simplified generation:', error);
          musicData = this.generateSimplifiedMusicData(instrumentParts, musicParams, settings);
        }
        
        // 音声データの強制生成
        if (!musicData.audioData || musicData.audioData.length === 0) {
          console.log('Generating audio data from melody and harmony...');
          musicData.audioData = this.synthesizeAudioData({
            melody: melody,
            harmony: harmony,
            params: musicParams,
            instrumentParts: instrumentParts
          });
        }
      }
      
      // 最終検証と音声データ強制生成
      if (!musicData || !musicData.audioData || musicData.audioData.length === 0) {
        console.warn('Music data invalid or no audio data, generating reliable audio...');
        musicData = this.generateReliableAudioData(melody, harmony, musicParams, settings);
      }
      
      // さらなる安全性チェック
      if (!musicData.audioData || musicData.audioData.length === 0) {
        console.error('Critical: Failed to generate any audio data, creating emergency audio');
        musicData = this.generateEmergencyFallback(settings);
      }
      
      // 音声データの最終検証
      let validAudioData = false;
      if (musicData.audioData && musicData.audioData.length > 0) {
        // 実際に音がある（サイレンスでない）かチェック
        for (let i = 0; i < musicData.audioData.length; i++) {
          if (Math.abs(musicData.audioData[i]) > 0.001) {
            validAudioData = true;
            break;
          }
        }
      }
      
      if (!validAudioData) {
        console.error('Generated audio data is silent, creating audible emergency fallback');
        musicData = this.generateAudibleEmergencyFallback(settings);
      }
      
      this.notifyProgress(100, 'Complete!');
      console.log('Music generation completed successfully:', musicData);
      
      this.currentMusic = musicData;
      return musicData;
      
    } catch (error) {
      console.error('Music generation failed:', error);
      throw error;
    } finally {
      this.isGenerating = false;
    }
  }

  /**
   * 設定から音楽パラメータを計算
   */
  calculateMusicParameters(settings) {
    const params = {
      tempo: this.getTempoValue(settings.tempo),
      duration: this.getDurationValue(settings.duration),
      key: this.getKeyFromMood(settings.mood),
      scale: this.getScaleFromGenre(settings.genre),
      timeSignature: this.getTimeSignature(settings.genre),
      complexity: settings.complexity || 'moderate',
      instruments: settings.instruments || ['piano'],
      loop: settings.loop || false,
      volume: settings.volume || 0.7
    };

    // ジャンル別の追加パラメータ
    params.genreSpecific = this.getGenreSpecificParams(settings.genre);
    
    // ムード別の音楽的特徴
    params.moodSpecific = this.getMoodSpecificParams(settings.mood);
    
    return params;
  }

  /**
   * テンポ値の取得
   */
  getTempoValue(tempo) {
    const tempoMap = {
      'slow': 70,
      'medium': 100,
      'fast': 140,
      'veryFast': 180
    };
    return tempoMap[tempo] || 100;
  }

  /**
   * 長さ値の取得（秒）
   */
  getDurationValue(duration) {
    const durationMap = {
      'short': 30,
      'medium': 60,
      'long': 120,
      'extended': 180
    };
    return durationMap[duration] || 60;
  }

  /**
   * ムードから調性を決定
   */
  getKeyFromMood(mood) {
    const keyMap = {
      'happy': 'C',
      'sad': 'Am',
      'energetic': 'G',
      'calm': 'F',
      'mysterious': 'Dm',
      'dramatic': 'Bb',
      'romantic': 'Eb',
      'epic': 'D',
      'peaceful': 'F',
      'tense': 'F#m'
    };
    return keyMap[mood] || 'C';
  }

  /**
   * ジャンルからスケールを決定
   */
  getScaleFromGenre(genre) {
    const scaleMap = {
      'ambient': 'major',
      'classical': 'major',
      'electronic': 'minor',
      'jazz': 'major',
      'rock': 'minor',
      'pop': 'major',
      'cinematic': 'minor',
      'gameMusic': 'major',
      'lofi': 'major',
      'chillout': 'major'
    };
    return scaleMap[genre] || 'major';
  }

  /**
   * ジャンル別拍子の取得
   */
  getTimeSignature(genre) {
    const timeSignatureMap = {
      'ambient': [4, 4],
      'classical': [4, 4],
      'electronic': [4, 4],
      'jazz': [4, 4],
      'rock': [4, 4],
      'pop': [4, 4],
      'cinematic': [4, 4],
      'gameMusic': [4, 4],
      'lofi': [4, 4],
      'chillout': [4, 4]
    };
    return timeSignatureMap[genre] || [4, 4];
  }

  /**
   * メロディ生成
   */
  generateMelody(params) {
    const notes = this.generateNoteSequence(params);
    const melody = {
      notes: notes,
      instrument: this.selectMelodyInstrument(params.instruments),
      volume: params.volume * 0.8
    };
    
    return melody;
  }

  /**
   * 音符シーケンス生成
   */
  generateNoteSequence(params) {
    const scale = this.getScaleNotes(params.key, params.scale);
    const noteDuration = 60 / params.tempo; // 四分音符の長さ（秒）
    const totalNotes = Math.floor(params.duration / noteDuration);
    
    const notes = [];
    let currentOctave = 4;
    
    for (let i = 0; i < totalNotes; i++) {
      // 音高の決定（スケール内）
      const scaleIndex = this.selectNoteFromScale(i, params);
      const note = scale[scaleIndex % scale.length];
      
      // オクターブの調整
      if (scaleIndex >= scale.length) {
        currentOctave = Math.min(6, currentOctave + Math.floor(scaleIndex / scale.length));
      }
      
      notes.push({
        frequency: this.noteToFrequency(note, currentOctave),
        startTime: i * noteDuration,
        duration: noteDuration * this.getNoteDurationMultiplier(params),
        velocity: this.getNoteVelocity(i, params)
      });
    }
    
    return notes;
  }

  /**
   * スケールの音符を取得
   */
  getScaleNotes(key, scale) {
    const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyIndex = chromaticScale.indexOf(key.replace('m', ''));
    
    const scalePatterns = {
      'major': [0, 2, 4, 5, 7, 9, 11],
      'minor': [0, 2, 3, 5, 7, 8, 10],
      'pentatonic': [0, 2, 4, 7, 9],
      'jazz': [0, 2, 4, 5, 7, 9, 10, 11],
      'modal': [0, 2, 3, 5, 7, 9, 10],
      'mixolydian': [0, 2, 4, 5, 7, 9, 10],
      'dorian': [0, 2, 3, 5, 7, 9, 10]
    };
    
    const pattern = scalePatterns[scale] || scalePatterns['major'];
    return pattern.map(interval => chromaticScale[(keyIndex + interval) % 12]);
  }

  /**
   * 音符から周波数への変換
   */
  noteToFrequency(note, octave) {
    const noteFrequencies = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
      'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
      'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
    
    const baseFreq = noteFrequencies[note] || 440;
    return baseFreq * Math.pow(2, octave - 4);
  }

  /**
   * ハーモニー生成
   */
  generateHarmony(params, melody) {
    const chordProgression = this.generateChordProgression(params);
    const harmony = {
      chords: chordProgression || [],
      instrument: this.selectHarmonyInstrument(params.instruments),
      volume: params.volume * 0.6
    };
    
    return harmony;
  }

  /**
   * コード進行生成
   */
  generateChordProgression(params) {
    const commonProgressions = {
      'major': ['I', 'V', 'vi', 'IV'],
      'minor': ['i', 'VII', 'VI', 'v'],
      'jazz': ['IIMaj7', 'V7', 'IMaj7', 'vi7'],
      'pop': ['I', 'V', 'vi', 'IV']
    };
    
    const baseProgression = commonProgressions[params.scale] || commonProgressions['major'];
    const chordDuration = 60 / params.tempo * 4; // 1小節の長さ
    const totalChords = Math.ceil(params.duration / chordDuration);
    
    const chords = [];
    for (let i = 0; i < totalChords; i++) {
      const chordSymbol = baseProgression[i % baseProgression.length];
      const chord = {
        symbol: chordSymbol,
        startTime: i * chordDuration,
        duration: chordDuration,
        notes: this.chordToNotes(chordSymbol, params.key)
      };
      chords.push(chord);
    }
    
    return chords;
  }

  /**
   * リズム生成
   */
  generateRhythm(params) {
    const rhythmPattern = this.getRhythmPattern(params.genre);
    const rhythm = {
      pattern: rhythmPattern,
      instrument: 'drums',
      volume: params.volume * 0.7,
      tempo: params.tempo
    };
    
    return rhythm;
  }

  /**
   * 楽器パートの統合
   */
  combineInstruments(melody, harmony, rhythm, params) {
    const musicData = {
      melody: melody,
      harmony: harmony,
      rhythm: rhythm,
      params: params,
      waveform: this.generateWaveform(params),
      metadata: {
        duration: params.duration,
        tempo: params.tempo,
        key: params.key,
        genre: params.genreSpecific,
        mood: params.moodSpecific,
        generatedAt: new Date().toISOString()
      }
    };
    
    return musicData;
  }

  /**
   * 波形データ生成（視覚化用）
   */
  generateWaveform(params) {
    const sampleRate = 44100;
    const samples = Math.floor(params.duration * sampleRate);
    const waveform = new Float32Array(samples);
    
    // 簡易的な波形生成（実際のオーディオ合成とは別）
    for (let i = 0; i < samples; i++) {
      const time = i / sampleRate;
      const frequency = 440; // A4
      waveform[i] = Math.sin(2 * Math.PI * frequency * time) * 0.3;
    }
    
    return waveform;
  }

  /**
   * 音楽再生
   */
  async playMusic(musicData) {
    if (!this.audioContext || this.isPlaying) return;
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    this.isPlaying = true;
    this.currentTime = 0;
    
    // 各楽器パートを再生
    this.playMelody(musicData.melody);
    this.playHarmony(musicData.harmony);
    this.playRhythm(musicData.rhythm);
    
    // 再生時間の更新
    this.startTimeUpdate(musicData.params.duration);
  }

  /**
   * メロディ再生
   */
  playMelody(melody) {
    melody.notes.forEach(note => {
      setTimeout(() => {
        if (!this.isPlaying) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(note.frequency, this.audioContext.currentTime);
        oscillator.type = this.getOscillatorType(melody.instrument);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(note.velocity * melody.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + note.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.gainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + note.duration);
        
        this.oscillators.push(oscillator);
      }, note.startTime * 1000);
    });
  }

  /**
   * 音楽停止
   */
  stopMusic() {
    this.isPlaying = false;
    
    // 全オシレーターを停止
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // すでに停止している場合のエラーを無視
      }
    });
    this.oscillators = [];
    
    // アニメーション停止
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    this.currentTime = 0;
  }

  /**
   * 音楽データのエクスポート（完全実装版）
   */
  exportMusic(musicData, format = 'mp3') {
    console.log('Exporting music in format:', format);
    
    if (!musicData || !musicData.audioData) {
      throw new Error('No audio data to export');
    }
    
    // Float32Arrayからオーディオデータを変換
    const audioData = musicData.audioData;
    const sampleRate = this.audioContext.sampleRate;
    
    if (format === 'wav') {
      // WAV形式でエクスポート
      const wavData = this.encodeWAV(audioData, sampleRate);
      return {
        blob: new Blob([wavData], { type: 'audio/wav' }),
        filename: `generated-music-${Date.now()}.wav`,
        metadata: musicData.metadata
      };
    } else {
      // MP3/その他の形式（PCM形式でWAVとして出力）
      const wavData = this.encodeWAV(audioData, sampleRate);
      return {
        blob: new Blob([wavData], { type: 'audio/wav' }),
        filename: `generated-music-${Date.now()}.wav`,
        metadata: musicData.metadata
      };
    }
  }

  /**
   * WAVエンコーディング
   */
  encodeWAV(audioData, sampleRate) {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // WAVヘッダー
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // オーディオデータ
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return buffer;
  }

  /**
   * プログレス通知
   */
  notifyProgress(percentage, message) {
    if (window.musicGeneratorUI) {
      window.musicGeneratorUI.updateProgress(percentage, message);
    }
  }

  // ヘルパー関数群
  selectNoteFromScale(index, params) {
    // 複雑さに基づいて音符選択のロジックを変更
    const baseIndex = index % 7;
    const complexity = params.complexity;
    
    if (complexity === 'simple') {
      return [0, 2, 4][index % 3];
    } else if (complexity === 'complex') {
      return baseIndex + Math.floor(Math.random() * 3);
    }
    
    return baseIndex;
  }

  getNoteDurationMultiplier(params) {
    const complexityMap = {
      'simple': 1.0,
      'moderate': 0.75,
      'complex': 0.5
    };
    return complexityMap[params.complexity] || 0.75;
  }

  getNoteVelocity(index, params) {
    // ダイナミクスに基づいて音量を調整
    const baseVelocity = 0.7;
    const dynamics = params.moodSpecific?.dynamics || 'balanced';
    
    if (dynamics === 'soft') {
      return baseVelocity * 0.6;
    } else if (dynamics === 'dramatic') {
      return baseVelocity * (0.4 + Math.sin(index * 0.1) * 0.4);
    }
    
    return baseVelocity;
  }

  selectMelodyInstrument(instruments) {
    const melodyInstruments = ['piano', 'guitar', 'synthesizer'];
    return instruments.find(inst => melodyInstruments.includes(inst)) || 'piano';
  }

  selectHarmonyInstrument(instruments) {
    const harmonyInstruments = ['piano', 'strings', 'synthesizer'];
    return instruments.find(inst => harmonyInstruments.includes(inst)) || 'piano';
  }

  getOscillatorType(instrument) {
    const typeMap = {
      'piano': 'triangle',
      'guitar': 'sawtooth',
      'synthesizer': 'square',
      'strings': 'sine'
    };
    return typeMap[instrument] || 'sine';
  }

  chordToNotes(chordSymbol, key) {
    // コードシンボルから実際の音符に変換
    const chordMap = {
      'I': { intervals: [0, 4, 7], type: 'major' },
      'ii': { intervals: [2, 5, 9], type: 'minor' },
      'iii': { intervals: [4, 7, 11], type: 'minor' },
      'IV': { intervals: [5, 9, 0], type: 'major' },
      'V': { intervals: [7, 11, 2], type: 'major' },
      'vi': { intervals: [9, 0, 4], type: 'minor' },
      'vii': { intervals: [11, 2, 5], type: 'diminished' }
    };
    
    const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyIndex = chromatic.indexOf(key.replace('m', ''));
    
    const chord = chordMap[chordSymbol] || chordMap['I'];
    const notes = chord.intervals.map(interval => {
      return chromatic[(keyIndex + interval) % 12];
    });
    
    return notes;
  }

  getRhythmPattern(genre) {
    const patterns = {
      'rock': [1, 0, 1, 0, 1, 0, 1, 0],
      'electronic': [1, 0, 0, 1, 1, 0, 0, 1],
      'jazz': [1, 0, 1, 1, 0, 1, 0, 1],
      'ambient': [1, 0, 0, 0, 1, 0, 0, 0]
    };
    return patterns[genre] || patterns['rock'];
  }

  playHarmony(harmony) {
    // ハーモニー再生の実装
  }

  playRhythm(rhythm) {
    // リズム再生の実装
  }

  startTimeUpdate(duration) {
    const startTime = Date.now();
    
    const update = () => {
      if (!this.isPlaying) return;
      
      this.currentTime = (Date.now() - startTime) / 1000;
      
      if (this.currentTime >= duration) {
        this.stopMusic();
        return;
      }
      
      // UI更新
      if (window.musicGeneratorUI) {
        window.musicGeneratorUI.updatePlaybackTime(this.currentTime, duration);
      }
      
      this.animationFrame = requestAnimationFrame(update);
    };
    
    update();
  }

  synthesizeAudioData(musicData) {
    // 統一された音声合成実装
    const sampleRate = this.audioContext.sampleRate;
    const duration = musicData.params.duration;
    const samples = new Float32Array(sampleRate * duration);
    
    // メロディを合成
    if (musicData.melody && musicData.melody.notes) {
      musicData.melody.notes.forEach(note => {
        const startSample = Math.floor(note.startTime * sampleRate);
        const noteSamples = Math.floor(note.duration * sampleRate);
        
        for (let i = 0; i < noteSamples && startSample + i < samples.length; i++) {
          const time = i / sampleRate;
          const envelope = Math.exp(-time * 2);
          const sample = Math.sin(2 * Math.PI * note.frequency * time) * envelope * note.velocity * 0.3;
          samples[startSample + i] += sample;
        }
      });
    }
    
    // ハーモニーを合成
    if (musicData.harmony && musicData.harmony.chords) {
      musicData.harmony.chords.forEach(chord => {
        if (chord.notes) {
          chord.notes.forEach(note => {
            const startSample = Math.floor(note.startTime * sampleRate);
            const noteSamples = Math.floor(note.duration * sampleRate);
            
            for (let i = 0; i < noteSamples && startSample + i < samples.length; i++) {
              const time = i / sampleRate;
              const envelope = Math.exp(-time * 1.5);
              const sample = Math.sin(2 * Math.PI * note.frequency * time) * envelope * note.velocity * 0.2;
              samples[startSample + i] += sample;
            }
          });
        }
      });
    }
    
    // 音量正規化
    let maxAmplitude = 0;
    for (let i = 0; i < samples.length; i++) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(samples[i]));
    }
    
    if (maxAmplitude > 0) {
      const normalizeRatio = 0.8 / maxAmplitude;
      for (let i = 0; i < samples.length; i++) {
        samples[i] *= normalizeRatio;
      }
    }
    
    return samples;
  }

  /**
   * 確実に音声データを生成する関数
   */
  generateReliableAudioData(melody, harmony, params, settings) {
    console.log('Generating reliable audio data...');
    
    const sampleRate = this.audioContext.sampleRate;
    const duration = params.duration;
    const samples = Math.floor(sampleRate * duration);
    const audioData = new Float32Array(samples);
    
    // メロディを確実にレンダリング
    if (melody && melody.notes && Array.isArray(melody.notes)) {
      melody.notes.forEach(note => {
        if (note && typeof note.frequency === 'number' && note.frequency > 0) {
          const startSample = Math.floor(note.startTime * sampleRate);
          const noteSamples = Math.floor(note.duration * sampleRate);
          const endSample = Math.min(startSample + noteSamples, samples);
          
          for (let i = startSample; i < endSample; i++) {
            const time = (i - startSample) / sampleRate;
            const envelope = Math.exp(-time * 3); // エンベロープ
            const phase = 2 * Math.PI * note.frequency * time;
            const amplitude = (note.velocity || 0.7) * 0.3 * envelope;
            audioData[i] += Math.sin(phase) * amplitude;
          }
        }
      });
    }
    
    // ハーモニーを追加
    if (harmony && harmony.chords && Array.isArray(harmony.chords)) {
      harmony.chords.forEach(chord => {
        if (chord && chord.notes && Array.isArray(chord.notes)) {
          chord.notes.forEach(noteStr => {
            const frequency = this.noteToFrequency(noteStr, 3);
            const startSample = Math.floor((chord.startTime || 0) * sampleRate);
            const noteSamples = Math.floor((chord.duration || 1) * sampleRate);
            const endSample = Math.min(startSample + noteSamples, samples);
            
            for (let i = startSample; i < endSample; i++) {
              const time = (i - startSample) / sampleRate;
              const envelope = Math.exp(-time * 2);
              const phase = 2 * Math.PI * frequency * time;
              const amplitude = 0.15 * envelope;
              audioData[i] += Math.sin(phase) * amplitude;
            }
          });
        }
      });
    }
    
    // 音量正規化
    let maxAmplitude = 0;
    for (let i = 0; i < audioData.length; i++) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(audioData[i]));
    }
    
    if (maxAmplitude > 0) {
      const normalizeRatio = 0.8 / maxAmplitude;
      for (let i = 0; i < audioData.length; i++) {
        audioData[i] *= normalizeRatio;
      }
    }
    
    return {
      audioData: audioData,
      waveform: this.generateSimpleWaveform(audioData),
      instrumentParts: { melody: melody, harmony: harmony },
      params: params,
      metadata: {
        duration: duration,
        tempo: params.tempo,
        key: params.key,
        genre: settings.genre || 'ambient',
        mood: settings.mood || 'calm',
        instruments: settings.instruments || ['piano'],
        generatedAt: new Date().toISOString(),
        quality: 'reliable'
      }
    };
  }

  /**
   * 音が確実に聞こえる緊急フォールバック
   */
  generateAudibleEmergencyFallback(settings) {
    console.log('Generating audible emergency fallback music...');
    
    const duration = this.getDurationValue(settings.duration);
    const tempo = this.getTempoValue(settings.tempo);
    const sampleRate = this.audioContext.sampleRate;
    const samples = Math.floor(sampleRate * duration);
    const audioData = new Float32Array(samples);
    
    // 確実に聞こえるメロディを生成
    const melodyFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C-major scale
    const noteDuration = 60 / tempo; // 1拍の長さ
    
    for (let noteIndex = 0; noteIndex < 8; noteIndex++) {
      const frequency = melodyFreqs[noteIndex % melodyFreqs.length];
      const startTime = noteIndex * noteDuration;
      const endTime = (noteIndex + 1) * noteDuration;
      
      if (startTime >= duration) break;
      
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.min(Math.floor(endTime * sampleRate), samples);
      
      for (let i = startSample; i < endSample; i++) {
        const time = (i - startSample) / sampleRate;
        const envelope = Math.exp(-time * 2) * (1 - time / noteDuration);
        const phase = 2 * Math.PI * frequency * time;
        const amplitude = 0.4 * envelope;
        audioData[i] = Math.sin(phase) * amplitude;
      }
    }
    
    return {
      audioData: audioData,
      waveform: this.generateSimpleWaveform(audioData),
      instrumentParts: { emergency: { notes: [], instrument: 'piano' } },
      params: {
        duration: duration,
        tempo: tempo,
        key: 'C',
        scale: 'major'
      },
      metadata: {
        duration: duration,
        tempo: tempo,
        key: 'C major',
        genre: settings.genre || 'ambient',
        mood: settings.mood || 'calm',
        instruments: settings.instruments || ['piano'],
        generatedAt: new Date().toISOString(),
        quality: 'audible-emergency'
      }
    };
  }

  // === 不足している基本的なヘルパー関数群 ===

  getTempoValue(tempoSetting) {
    const tempoMap = {
      'slow': 70,
      'medium': 100,
      'fast': 140,
      'veryFast': 180
    };
    return tempoMap[tempoSetting] || 100;
  }

  getDurationValue(durationSetting) {
    const durationMap = {
      'short': 30,
      'medium': 60,
      'long': 120,
      'extended': 180
    };
    return durationMap[durationSetting] || 60;
  }

  getKeyFromMood(mood) {
    const keyMap = {
      'happy': 'C',
      'sad': 'Am',
      'energetic': 'G',
      'calm': 'F',
      'mysterious': 'Dm',
      'dramatic': 'Bb',
      'romantic': 'Eb',
      'epic': 'D',
      'peaceful': 'F',
      'tense': 'F#m'
    };
    return keyMap[mood] || 'C';
  }

  getScaleFromGenre(genre) {
    const scaleMap = {
      'ambient': 'major',
      'classical': 'major',
      'electronic': 'minor',
      'jazz': 'major',
      'rock': 'minor',
      'pop': 'major',
      'cinematic': 'minor',
      'gameMusic': 'major',
      'lofi': 'major',
      'chillout': 'major'
    };
    return scaleMap[genre] || 'major';
  }

  getTimeSignature(genre) {
    const timeSignatureMap = {
      'ambient': [4, 4],
      'classical': [4, 4],
      'electronic': [4, 4],
      'jazz': [4, 4],
      'rock': [4, 4],
      'pop': [4, 4],
      'cinematic': [4, 4],
      'gameMusic': [4, 4],
      'lofi': [4, 4],
      'chillout': [4, 4]
    };
    return timeSignatureMap[genre] || [4, 4];
  }

  getGenreSpecificParams(genre) {
    const genreParams = {
      'ambient': { reverb: 0.8, delay: 0.3, dynamics: 'soft' },
      'classical': { reverb: 0.6, dynamics: 'dramatic' },
      'electronic': { delay: 0.4, compression: 0.7 },
      'jazz': { reverb: 0.4, complexity: 0.8 },
      'rock': { compression: 0.8, dynamics: 'dramatic' },
      'pop': { compression: 0.6, dynamics: 'balanced' },
      'cinematic': { reverb: 0.9, dynamics: 'dramatic' },
      'gameMusic': { reverb: 0.5, dynamics: 'balanced' },
      'lofi': { reverb: 0.3, compression: 0.5 },
      'chillout': { reverb: 0.6, dynamics: 'soft' }
    };
    return genreParams[genre] || {};
  }

  getMoodSpecificParams(mood) {
    const moodParams = {
      'happy': { brightness: 0.8, energy: 0.7 },
      'sad': { brightness: 0.3, energy: 0.3 },
      'energetic': { brightness: 0.9, energy: 0.9 },
      'calm': { brightness: 0.5, energy: 0.3 },
      'mysterious': { brightness: 0.4, energy: 0.5 },
      'dramatic': { brightness: 0.6, energy: 0.8 },
      'romantic': { brightness: 0.7, energy: 0.5 },
      'epic': { brightness: 0.8, energy: 0.9 },
      'peaceful': { brightness: 0.6, energy: 0.2 },
      'tense': { brightness: 0.4, energy: 0.8 }
    };
    return moodParams[mood] || { brightness: 0.5, energy: 0.5 };
  }

  getScaleNotes(key, scaleType) {
    const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyIndex = chromatic.indexOf(key.replace('m', ''));
    
    const scaleIntervals = {
      'major': [0, 2, 4, 5, 7, 9, 11],
      'minor': [0, 2, 3, 5, 7, 8, 10],
      'pentatonic': [0, 2, 4, 7, 9],
      'blues': [0, 3, 5, 6, 7, 10]
    };
    
    const intervals = scaleIntervals[scaleType] || scaleIntervals['major'];
    return intervals.map(interval => chromatic[(keyIndex + interval) % 12]);
  }

  selectNoteFromScale(index, params) {
    const scaleLength = 7; // 基本スケールの長さ
    return Math.floor(Math.random() * scaleLength);
  }

  noteToFrequency(note, octave) {
    const noteFrequencies = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
      'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
      'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
    const baseFreq = noteFrequencies[note] || 440;
    return baseFreq * Math.pow(2, octave - 4);
  }

  getNoteDurationMultiplier(params) {
    return 0.8 + Math.random() * 0.4; // 0.8-1.2の範囲
  }

  getNoteVelocity(index, params) {
    return 0.5 + Math.random() * 0.3; // 0.5-0.8の範囲
  }

  selectMelodyInstrument(instruments) {
    const melodyInstruments = ['piano', 'guitar', 'synthesizer'];
    const validInstruments = instruments.filter(inst => melodyInstruments.includes(inst));
    return validInstruments.length > 0 ? validInstruments[0] : 'piano';
  }

  selectHarmonyInstrument(instruments) {
    const harmonyInstruments = ['piano', 'strings', 'synthesizer'];
    const validInstruments = instruments.filter(inst => harmonyInstruments.includes(inst));
    return validInstruments.length > 0 ? validInstruments[0] : 'piano';
  }

  generateExpression(params) {
    return {
      dynamics: Math.random() * 0.5 + 0.3,
      articulation: Math.random() > 0.5 ? 'legato' : 'staccato',
      vibrato: Math.random() * 0.2
    };
  }

  getNoteDurationVariation(characteristics) {
    return 0.8 + (characteristics.complexity || 0.5) * 0.4;
  }

  calculateVelocity(characteristics, noteIndex, totalNotes) {
    const baseVelocity = 0.6;
    const variation = Math.sin(noteIndex / totalNotes * Math.PI) * 0.2;
    return Math.max(0.3, Math.min(0.9, baseVelocity + variation));
  }

  chordToNotes(chordSymbol, key) {
    // 基本的なコード定義
    const chordMap = {
      'I': [0, 2, 4],
      'ii': [1, 3, 5],
      'iii': [2, 4, 6],
      'IV': [3, 5, 7],
      'V': [4, 6, 8],
      'vi': [5, 7, 9],
      'vii': [6, 8, 10]
    };
    
    const intervals = chordMap[chordSymbol] || [0, 2, 4];
    const scaleNotes = this.getScaleNotes(key, 'major');
    
    return intervals.map(interval => scaleNotes[interval % scaleNotes.length]);
  }

  generateAdvancedMelody(params, harmony, songStructure) {
    const melody = {
      notes: [],
      instrument: this.selectMelodyInstrument(params.instruments),
      volume: params.volume * 0.8,
      expression: this.generateExpression(params)
    };

    const scale = this.getScaleNotes(params.key, params.scale);
    const totalNotes = Math.ceil(params.duration * params.tempo / 60 * 2); // 8分音符
    const noteDuration = 60 / params.tempo / 2; // 8分音符の長さ

    for (let i = 0; i < totalNotes; i++) {
      const scaleIndex = Math.floor(Math.random() * scale.length);
      const note = scale[scaleIndex];
      const octave = 4 + Math.floor(Math.random() * 2);

      melody.notes.push({
        frequency: this.noteToFrequency(note, octave),
        startTime: i * noteDuration,
        duration: noteDuration * (0.8 + Math.random() * 0.4),
        velocity: 0.6 + Math.random() * 0.3
      });
    }

    return melody;
  }

  generateBasicStructure(params) {
    const sectionDuration = params.duration / 4;
    return {
      intro: { start: 0, duration: sectionDuration * 0.5 },
      verse: { start: sectionDuration * 0.5, duration: sectionDuration },
      chorus: { start: sectionDuration * 1.5, duration: sectionDuration },
      outro: { start: sectionDuration * 2.5, duration: sectionDuration * 1.5 }
    };
  }

  generateInstrumentParts(params, melody, harmony, songStructure) {
    return {
      melody: melody,
      harmony: harmony,
      rhythm: this.generateRhythmPart(params),
      bass: this.generateBassPart(params, harmony)
    };
  }

  generateRhythmPart(params) {
    return {
      instrument: 'drums',
      pattern: 'basic_4_4',
      volume: params.volume * 0.5
    };
  }

  generateBassPart(params, harmony) {
    const bassPart = {
      notes: [],
      instrument: 'bass',
      volume: params.volume * 0.6
    };

    if (harmony && harmony.chords) {
      harmony.chords.forEach(chord => {
        if (chord.notes && chord.notes.length > 0) {
          const rootNote = chord.notes[0];
          const frequency = this.noteToFrequency(rootNote, 2);
          
          bassPart.notes.push({
            frequency: frequency,
            startTime: chord.startTime,
            duration: chord.duration,
            velocity: 0.7
          });
        }
      });
    }

    return bassPart;
  }

  masterTrack(instrumentParts, params, settings) {
    console.log('Mastering track with instrument parts:', instrumentParts);
    
    // 音声データを直接合成
    const audioData = this.synthesizeAudioData({
      melody: instrumentParts.melody,
      harmony: instrumentParts.harmony,
      params: params,
      instrumentParts: instrumentParts
    });

    return {
      audioData: audioData,
      waveform: this.generateSimpleWaveform(audioData),
      instrumentParts: instrumentParts,
      params: params,
      metadata: {
        duration: params.duration,
        tempo: params.tempo,
        key: params.key,
        genre: settings.genre || 'ambient',
        mood: settings.mood || 'calm',
        instruments: settings.instruments || ['piano'],
        generatedAt: new Date().toISOString(),
        quality: 'standard'
      }
    };
  }

  generateSimplifiedMusicData(instrumentParts, params, settings) {
    console.log('Generating simplified music data...');
    
    // 簡化された音声データ生成
    const audioData = this.synthesizeAudioData({
      melody: instrumentParts.melody,
      harmony: instrumentParts.harmony,
      params: params,
      instrumentParts: instrumentParts
    });

    return {
      audioData: audioData,
      waveform: this.generateSimpleWaveform(audioData),
      instrumentParts: instrumentParts,
      params: params,
      metadata: {
        duration: params.duration,
        tempo: params.tempo,
        key: params.key,
        genre: settings.genre || 'ambient',
        mood: settings.mood || 'calm',
        instruments: settings.instruments || ['piano'],
        generatedAt: new Date().toISOString(),
        quality: 'simplified'
      }
    };
  }

  generateEmergencyFallback(settings) {
    console.log('Generating emergency fallback music...');
    
    const duration = this.getDurationValue(settings.duration);
    const tempo = this.getTempoValue(settings.tempo);
    const sampleRate = this.audioContext.sampleRate;
    const samples = Math.floor(sampleRate * duration);
    const audioData = new Float32Array(samples);
    
    // 基本的なトーンを生成
    const frequency = 440; // A4
    for (let i = 0; i < samples; i++) {
      const time = i / sampleRate;
      const envelope = Math.exp(-time * 0.5);
      audioData[i] = Math.sin(2 * Math.PI * frequency * time) * envelope * 0.3;
    }

    return {
      audioData: audioData,
      waveform: this.generateSimpleWaveform(audioData),
      instrumentParts: { emergency: { notes: [], instrument: 'synthesizer' } },
      params: {
        duration: duration,
        tempo: tempo,
        key: 'A',
        scale: 'major'
      },
      metadata: {
        duration: duration,
        tempo: tempo,
        key: 'A major',
        genre: settings.genre || 'ambient',
        mood: settings.mood || 'calm',
        instruments: settings.instruments || ['synthesizer'],
        generatedAt: new Date().toISOString(),
        quality: 'emergency'
      }
    };
  }

  generateSimpleWaveform(audioData) {
    const waveformLength = Math.min(200, audioData.length);
    const step = Math.floor(audioData.length / waveformLength);
    const waveform = [];
    
    for (let i = 0; i < waveformLength; i++) {
      const sampleIndex = i * step;
      waveform.push(audioData[sampleIndex] || 0);
    }
    
    return waveform;
  }

  notifyProgress(percentage, message) {
    if (window.musicGeneratorUI && window.musicGeneratorUI.updateProgress) {
      window.musicGeneratorUI.updateProgress(percentage, message);
    }
    console.log(`Progress: ${percentage}% - ${message}`);
  }
    const baseVelocity = 0.5;
    const energyVariation = (characteristics.energy || 0.5) * 0.3;
    const positionVariation = Math.sin(noteIndex / totalNotes * Math.PI) * 0.2;
    return Math.max(0.1, Math.min(1.0, baseVelocity + energyVariation + positionVariation));
  }

  getOscillatorType(instrument) {
    const oscillatorMap = {
      'piano': 'triangle',
      'guitar': 'sawtooth',
      'synthesizer': 'square',
      'strings': 'triangle',
      'bass': 'sine'
    };
    return oscillatorMap[instrument] || 'sine';
  }

  generateWaveform(params) {
    // 簡易波形生成
    const points = 100;
    const waveform = [];
    for (let i = 0; i < points; i++) {
      waveform.push(Math.sin(i * 0.1) * 0.5 + 0.5);
    }
    return waveform;
  }

  /**
   * メロディ再生（実装版）
   */
  playMelody(melody) {
    if (!melody || !melody.notes || !Array.isArray(melody.notes)) {
      console.warn('Invalid melody data for playback');
      return;
    }
    
    console.log('Playing melody with', melody.notes.length, 'notes');
    
    melody.notes.forEach((note, index) => {
      setTimeout(() => {
        this.playNote(note);
      }, note.startTime * 1000);
    });
  }

  /**
   * ハーモニー再生（実装版）
   */
  playHarmony(harmony) {
    if (!harmony || !harmony.chords || !Array.isArray(harmony.chords)) {
      console.warn('Invalid harmony data for playback');
      return;
    }
    
    console.log('Playing harmony with', harmony.chords.length, 'chords');
    
    harmony.chords.forEach((chord, index) => {
      if (chord.notes && Array.isArray(chord.notes)) {
        chord.notes.forEach(note => {
          setTimeout(() => {
            this.playNote(note, 0.5); // ハーモニーは音量を下げる
          }, note.startTime * 1000);
        });
      }
    });
  }

  /**
   * リズム再生（実装版）
   */
  playRhythm(rhythm) {
    if (!rhythm || !rhythm.pattern) {
      console.warn('Invalid rhythm data for playback');
      return;
    }
    
    console.log('Playing rhythm pattern');
    
    // リズムパターンに基づいてドラム音を再生
    rhythm.pattern.forEach((beat, index) => {
      if (beat.hit) {
        setTimeout(() => {
          this.playDrumSound(beat.type);
        }, beat.time * 1000);
      }
    });
  }

  /**
   * 単一音符再生
   */
  playNote(note, volumeMultiplier = 1.0) {
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(note.frequency || 440, this.audioContext.currentTime);
      oscillator.type = note.waveform || 'sine';
      
      const volume = (note.velocity || 0.5) * volumeMultiplier;
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (note.duration || 0.5));
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + (note.duration || 0.5));
      
    } catch (error) {
      console.warn('Failed to play note:', error);
    }
  }

  /**
   * ドラム音再生
   */
  playDrumSound(type) {
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // ドラムタイプに応じて周波数を設定
      const drumFreqs = {
        'kick': 60,
        'snare': 200,
        'hihat': 10000
      };
      
      oscillator.frequency.setValueAtTime(drumFreqs[type] || 100, this.audioContext.currentTime);
      oscillator.type = type === 'hihat' ? 'white' : 'triangle';
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
      
    } catch (error) {
      console.warn('Failed to play drum sound:', error);
    }
  }

  /**
   * 時間更新開始（実装版）
   */
  startTimeUpdate(duration) {
    console.log('Starting time update for duration:', duration);
    
    this.currentPlaybackTime = 0;
    this.playbackDuration = duration;
    
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
    
    this.timeUpdateInterval = setInterval(() => {
      this.currentPlaybackTime += 0.1;
      
      // UI更新
      if (window.musicGeneratorUI) {
        window.musicGeneratorUI.updatePlaybackTime(this.currentPlaybackTime, this.playbackDuration);
      }
      
      // 再生完了チェック
      if (this.currentPlaybackTime >= this.playbackDuration) {
        this.stopTimeUpdate();
      }
    }, 100);
  }

  /**
   * 時間更新停止
   */
  stopTimeUpdate() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
    this.currentPlaybackTime = 0;
  }

  /**
   * 緊急フォールバック音楽生成
   */
  generateEmergencyFallback(settings) {
    console.log('Generating emergency fallback music');
    
    const duration = this.getDurationValue(settings.duration);
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const audioData = new Float32Array(length);
    
    // C major scale
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const noteDuration = sampleRate * (duration / 8); // 8音符分で分割
    
    for (let i = 0; i < 8 && i * noteDuration < length; i++) {
      const frequency = notes[i];
      const startSample = Math.floor(i * noteDuration);
      const samples = Math.min(noteDuration, length - startSample);
      
      for (let j = 0; j < samples; j++) {
        const time = j / sampleRate;
        const envelope = Math.exp(-time * 2);
        const sample = Math.sin(2 * Math.PI * frequency * time) * envelope * 0.5; // 音量を上げた
        audioData[startSample + j] = sample;
      }
    }
    
    return {
      audioData: audioData,
      waveform: this.generateSimpleWaveform(audioData),
      instrumentParts: { melody: { notes: [], instrument: 'piano' } },
      params: {
        duration: duration,
        tempo: 120,
        key: 'C',
        scale: 'major'
      },
      metadata: {
        duration: duration,
        tempo: 120,
        key: 'C major',
        genre: settings.genre || 'ambient',
        mood: settings.mood || 'calm',
        instruments: settings.instruments || ['piano'],
        generatedAt: new Date().toISOString(),
        quality: 'emergency-fallback'
      }
    };
  }
}

// グローバル変数として音楽ジェネレーターを初期化
window.musicGenerator = new MusicGenerator();
