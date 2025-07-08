/**
 * 簡易版 Tone.js音楽生成エンジン
 * テスト・デバッグ用
 */

class SimpleToneMusicEngine {
  constructor() {
    this.isInitialized = false;
    this.isPlaying = false;
    this.instruments = {};
    this.currentComposition = null;
    this.keywordDictionary = this.initializeKeywordDictionary();
    
    this.initialize();
  }

  async initialize() {
    try {
      // Tone.jsのAudioContextを開始
      await Tone.start();
      console.log('Tone.js started successfully');
      
      // 基本楽器のセットアップ
      this.setupBasicInstruments();
      
      // Transport設定
      Tone.Transport.bpm.value = 120;
      
      this.isInitialized = true;
      console.log('SimpleToneMusicEngine initialized');
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  }

  setupBasicInstruments() {
    // ピアノ
    this.instruments.piano = new Tone.Synth({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();

    // ベース
    this.instruments.bass = new Tone.Synth({
      oscillator: {
        type: "square"
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.4,
        release: 0.5
      }
    }).toDestination();

    console.log('Basic instruments set up');
  }

  initializeKeywordDictionary() {
    return {
      // 感情・雰囲気（日本語対応）
      '疾走感': { tempo: 40, scale: 'major', energy: 'high' },
      '疾走': { tempo: 40, scale: 'major', energy: 'high' },
      'ゲーム': { style: 'retro', tempo: 20, scale: 'major' },
      '90年代': { style: 'retro', tempo: 10 },
      '楽しい': { scale: 'major', tempo: 15, energy: 'medium' },
      '明るい': { scale: 'major', tempo: 10, energy: 'medium' },
      '悲しい': { scale: 'minor', tempo: -20, energy: 'low' },
      '切ない': { scale: 'minor', tempo: -15, energy: 'low' },
      '静か': { tempo: -30, energy: 'low' },
      '穏やか': { tempo: -20, energy: 'low' },
      'エネルギッシュ': { tempo: 30, energy: 'high' },
      'ドラマチック': { scale: 'minor', energy: 'high' },
      '壮大': { tempo: 20, energy: 'high' },
      '神秘的': { scale: 'minor', energy: 'medium' },
      '懐かしい': { tempo: -10, energy: 'medium' },
      
      // ジャンル
      'クラシック': { style: 'classical', tempo: 0 },
      'ジャズ': { style: 'jazz', tempo: 5 },
      'ロック': { style: 'rock', tempo: 25 },
      'エレクトロニック': { style: 'electronic', tempo: 30 },
      '電子音楽': { style: 'electronic', tempo: 30 },
      'アンビエント': { style: 'ambient', tempo: -30 },
      '映画音楽': { style: 'cinematic', energy: 'high' },
      'フォーク': { style: 'folk', tempo: -10 },
      'チップチューン': { style: 'chiptune', tempo: 20 },
      
      // 楽器
      'ピアノ': { instrument: 'piano' },
      'シンセ': { instrument: 'synth' },
      'シンセサイザー': { instrument: 'synth' }
    };
  }

  parseNaturalLanguage(text) {
    const keywords = text.toLowerCase().split(/\s+/);
    let params = {
      tempo: 120,
      key: 'C',
      scale: 'major',
      style: 'modern',
      energy: 'medium',
      instruments: ['piano']
    };

    console.log('Parsing keywords:', keywords);

    // キーワードマッチング
    keywords.forEach(keyword => {
      if (this.keywordDictionary[keyword]) {
        const keywordParams = this.keywordDictionary[keyword];
        console.log('Found keyword:', keyword, keywordParams);
        
        // パラメータをマージ
        if (keywordParams.tempo) {
          params.tempo += keywordParams.tempo;
        }
        if (keywordParams.scale) {
          params.scale = keywordParams.scale;
        }
        if (keywordParams.style) {
          params.style = keywordParams.style;
        }
        if (keywordParams.energy) {
          params.energy = keywordParams.energy;
        }
        if (keywordParams.instrument) {
          if (!params.instruments.includes(keywordParams.instrument)) {
            params.instruments.push(keywordParams.instrument);
          }
        }
      }
    });

    // テンポの範囲制限
    params.tempo = Math.max(60, Math.min(200, params.tempo));

    console.log('Parsed parameters:', params);
    return params;
  }

  async generateMusic(settings) {
    if (!this.isInitialized) {
      throw new Error('Engine not initialized');
    }

    console.log('Generating music with settings:', settings);

    // 自然言語を解析
    let params = {
      tempo: settings.tempo || 120,
      key: settings.key || 'C',
      scale: 'major',
      duration: settings.duration || 16
    };

    if (settings.naturalLanguage) {
      const parsedParams = this.parseNaturalLanguage(settings.naturalLanguage);
      params = { ...params, ...parsedParams };
    }

    // シンプルなコード進行を生成
    const chordProgression = this.generateSimpleChordProgression(params.key, params.scale);
    
    // シンプルなメロディを生成
    const melody = this.generateSimpleMelody(chordProgression, params);

    // コンポジションオブジェクトを作成
    this.currentComposition = {
      params: params,
      chordProgression: chordProgression,
      melody: melody,
      structure: {
        sections: [
          { name: 'メインセクション', duration: params.duration, chords: chordProgression.length }
        ]
      }
    };

    console.log('Music generation completed');
    return this.currentComposition;
  }

  generateSimpleChordProgression(key, scale) {
    // シンプルなコード進行（I-V-vi-IV）
    const chords = [
      { name: 'C', notes: ['C', 'E', 'G'] },
      { name: 'G', notes: ['G', 'B', 'D'] },
      { name: 'Am', notes: ['A', 'C', 'E'] },
      { name: 'F', notes: ['F', 'A', 'C'] }
    ];
    
    return chords;
  }

  generateSimpleMelody(chordProgression, params) {
    const melody = [];
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
    
    for (let i = 0; i < 16; i++) { // 16個の音符
      const note = notes[Math.floor(Math.random() * notes.length)];
      melody.push({
        note: note,
        time: i * 0.5, // 0.5秒間隔
        duration: '4n'
      });
    }
    
    return melody;
  }

  play() {
    if (!this.currentComposition) {
      console.log('No composition to play');
      return false;
    }

    try {
      console.log('Starting playback...');
      
      // 既存の再生をストップ
      this.stop();
      
      // Transport設定
      Tone.Transport.bpm.value = this.currentComposition.params.tempo;
      
      // メロディをスケジュール
      const part = new Tone.Part((time, note) => {
        this.instruments.piano.triggerAttackRelease(note.note, note.duration, time);
      }, this.currentComposition.melody.map(note => ({
        time: note.time,
        note: note.note,
        duration: note.duration
      })));

      part.start(0);
      Tone.Transport.start();
      
      this.isPlaying = true;
      this.currentPart = part; // パートを保存して後で停止できるように
      console.log('Playback started');

      // 自動停止（楽曲の長さ後）
      this.stopTimer = setTimeout(() => {
        this.stop();
      }, this.currentComposition.params.duration * 1000);
      
      return true;
    } catch (error) {
      console.error('Playback error:', error);
      return false;
    }
  }

  stop() {
    console.log('Stopping playback...');
    
    try {
      Tone.Transport.stop();
      Tone.Transport.cancel(); // スケジュールされたイベントをクリア
      
      if (this.currentPart) {
        this.currentPart.dispose(); // パートを破棄
        this.currentPart = null;
      }
      
      if (this.stopTimer) {
        clearTimeout(this.stopTimer);
        this.stopTimer = null;
      }
      
      this.isPlaying = false;
      console.log('Playback stopped');
    } catch (error) {
      console.error('Stop error:', error);
    }
  }

  pause() {
    if (this.isPlaying) {
      try {
        Tone.Transport.pause();
        this.isPlaying = false;
        console.log('Playback paused');
      } catch (error) {
        console.error('Pause error:', error);
      }
    }
  }

  /**
   * WAVエクスポート機能（基本版）
   */
  async exportToWAV() {
    if (!this.currentComposition) {
      throw new Error('エクスポートする音楽がありません');
    }
    
    try {
      console.log('Starting WAV export...');
      
      // オフラインレンダリング用のAudioContextを作成
      const duration = this.currentComposition.params.duration;
      const sampleRate = 44100;
      const numberOfChannels = 1;
      const length = sampleRate * duration;
      
      const offlineContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
      
      // オフライン用楽器をセットアップ
      const offlinePiano = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: { attack: 0.02, decay: 0.3, sustain: 0.3, release: 1 }
      }).connect(offlineContext.destination);
      
      // メロディをスケジュール
      this.currentComposition.melody.forEach(note => {
        const startTime = note.time;
        const noteLength = note.duration === '4n' ? 0.5 : 0.25; // 基本的な音符長
        offlinePiano.triggerAttackRelease(note.note, noteLength, startTime);
      });
      
      // レンダリング実行
      const renderedBuffer = await offlineContext.startRendering();
      
      // WAVフォーマットに変換
      const wavArrayBuffer = this.bufferToWav(renderedBuffer);
      
      console.log('WAV export completed, size:', wavArrayBuffer.byteLength);
      return wavArrayBuffer;
      
    } catch (error) {
      console.error('WAV export failed:', error);
      throw error;
    }
  }

  /**
   * AudioBufferをWAVファイルに変換
   */
  bufferToWav(buffer) {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAVヘッダーを書き込み
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    // RIFF identifier
    writeString(0, 'RIFF');
    // file length minus first 8 bytes
    view.setUint32(4, 36 + length * 2, true);
    // RIFF type
    writeString(8, 'WAVE');
    // format chunk identifier
    writeString(12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, buffer.sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, buffer.sampleRate * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    writeString(36, 'data');
    // data chunk length
    view.setUint32(40, length * 2, true);
    
    // write the PCM samples
    const channelData = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.SimpleToneMusicEngine = SimpleToneMusicEngine;
}
