/**
 * 高品質楽器サンプルエンジン
 * Tone.js-InstrumentsのSampleLibraryを使用したリアル楽器音源システム
 */

class RealisticToneMusicEngine {
  constructor() {
    this.isInitialized = false;
    this.isPlaying = false;
    this.instruments = {};
    this.samplers = {};
    this.currentComposition = null;
    this.keywordDictionary = this.initializeKeywordDictionary();
    this.loadingStatus = {};
    this.availableInstruments = this.getAvailableInstruments();
    
    this.initialize();
  }

  /**
   * 利用可能な楽器の定義（Tone.js-Instruments対応）
   */
  getAvailableInstruments() {
    return {
      piano: {
        name: 'ピアノ',
        key: 'piano',
        category: 'keyboard'
      },
      'bass-electric': {
        name: 'エレキベース',
        key: 'bass-electric',
        category: 'bass'
      },
      'guitar-acoustic': {
        name: 'アコースティックギター',
        key: 'guitar-acoustic',
        category: 'guitar'
      },
      'guitar-electric': {
        name: 'エレキギター',
        key: 'guitar-electric',
        category: 'guitar'
      },
      'guitar-nylon': {
        name: 'ナイロンギター',
        key: 'guitar-nylon',
        category: 'guitar'
      },
      'violin': {
        name: 'バイオリン',
        key: 'violin',
        category: 'strings'
      },
      'cello': {
        name: 'チェロ',
        key: 'cello',
        category: 'strings'
      },
      'saxophone': {
        name: 'サックス',
        key: 'saxophone',
        category: 'wind'
      },
      'trumpet': {
        name: 'トランペット',
        key: 'trumpet',
        category: 'wind'
      },
      'trombone': {
        name: 'トロンボーン',
        key: 'trombone',
        category: 'wind'
      },
      'flute': {
        name: 'フルート',
        key: 'flute',
        category: 'wind'
      },
      'clarinet': {
        name: 'クラリネット',
        key: 'clarinet',
        category: 'wind'
      },
      'xylophone': {
        name: 'シロフォン',
        key: 'xylophone',
        category: 'percussion'
      },
      'harp': {
        name: 'ハープ',
        key: 'harp',
        category: 'strings'
      }
    };
  }
        fallback: 'amsynth'
      },
      guitar: {
        name: 'ギター',
        sources: [
          {
            urls: {
              'F#2': 'Fs2.mp3',
              'A2': 'A2.mp3',
              'C3': 'C3.mp3',
              'D#3': 'Ds3.mp3',
              'F#3': 'Fs3.mp3',
              'A3': 'A3.mp3',
              'C4': 'C4.mp3',
              'D#4': 'Ds4.mp3',
              'F#4': 'Fs4.mp3',
              'A4': 'A4.mp3'
            },
            baseUrl: 'https://tonejs.github.io/audio/berklee/guitar_acoustic_'
          }
        ],
        fallback: 'pluck'
      },
      violin: {
        name: 'バイオリン',
        sources: [
          {
            urls: {
              'G3': 'G3.mp3',
              'D4': 'D4.mp3',
              'A4': 'A4.mp3',
              'E5': 'E5.mp3',
              'G5': 'G5.mp3',
              'D6': 'D6.mp3'
            },
            baseUrl: 'https://tonejs.github.io/audio/berklee/violin_'
          }
        ],
        fallback: 'synth'
      },
      bass: {
        name: 'ベース',
        sources: [
          {
            urls: {
              'A0': 'A0.mp3',
              'C1': 'C1.mp3',
              'E1': 'E1.mp3',
              'G1': 'G1.mp3',
              'C2': 'C2.mp3',
              'E2': 'E2.mp3'
            },
            baseUrl: 'https://tonejs.github.io/audio/berklee/bass_'
          }
        ],
        fallback: 'monosynth'
      },
      // シンプルなシンセサイザー楽器も含める
      synth: {
        name: 'シンセサイザー',
        sources: [],
        fallback: 'polysynth'
      },
      lead: {
        name: 'リードシンセ',
        sources: [],
        fallback: 'monosynth'
      }
    };
  }

  async initialize() {
    try {
      // Tone.jsのAudioContextを開始
      await Tone.start();
      console.log('Tone.js started successfully');
      
      // 楽器の段階的ロード
      await this.setupInstruments();
      
      // Transport設定
      Tone.Transport.bpm.value = 120;
      
      this.isInitialized = true;
      console.log('RealisticToneMusicEngine fully initialized');
    } catch (error) {
      console.error('Initialization failed:', error);
    }
  }

  /**
   * 楽器のセットアップ（リアルサンプル + フォールバック）
   */
  async setupInstruments() {
    console.log('Loading realistic instrument samples...');
    
    // 全楽器の読み込みステータス初期化
    Object.keys(this.instrumentSources).forEach(key => {
      this.loadingStatus[key] = 'loading';
    });
    
    // 楽器を順次ロード
    for (const [instrumentKey, config] of Object.entries(this.instrumentSources)) {
      try {
        if (config.sources && config.sources.length > 0) {
          await this.loadInstrumentWithSources(instrumentKey, config);
        } else {
          // シンセサイザー楽器の場合はフォールバックを直接作成
          this.createFallbackInstrument(instrumentKey, config);
        }
        this.loadingStatus[instrumentKey] = 'loaded';
        console.log(`${config.name} loaded successfully`);
      } catch (error) {
        console.warn(`Failed to load ${config.name}, using fallback:`, error);
        this.createFallbackInstrument(instrumentKey, config);
        this.loadingStatus[instrumentKey] = 'fallback';
      }
    }
    
    // ドラムとパーカッション
    this.setupDrums();
    console.log('All instruments setup completed');
  }

  /**
   * 複数ソース対応の楽器ロード
   */
  async loadInstrumentWithSources(key, config) {
    const sources = config.sources || [];
    
    for (let i = 0; i < sources.length; i++) {
      try {
        await this.loadInstrument(key, sources[i]);
        return; // 成功したら終了
      } catch (error) {
        console.warn(`Source ${i + 1} failed for ${config.name}:`, error);
        if (i === sources.length - 1) {
          throw error; // 最後のソースも失敗した場合は例外を投げる
        }
      }
    }
  }

  /**
   * 個別楽器のロード
   */
  async loadInstrument(key, source) {
    return new Promise((resolve, reject) => {
      const sampler = new Tone.Sampler({
        urls: source.urls,
        baseUrl: source.baseUrl,
        onload: () => {
          this.samplers[key] = sampler.toDestination();
          resolve();
        },
        onerror: (error) => {
          reject(error);
        }
      });
      
      // 15秒でタイムアウト
      setTimeout(() => {
        if (this.loadingStatus[key] === 'loading') {
          reject(new Error('Load timeout'));
        }
      }, 15000);
    });
  }

  /**
   * フォールバック楽器の作成
   */
  createFallbackInstrument(key, config) {
    switch (config.fallback) {
      case 'amsynth':
        this.samplers[key] = new Tone.AMSynth({
          harmonicity: 2.5,
          oscillator: { type: "sine" },
          envelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 1.2 }
        }).toDestination();
        break;
        
      case 'pluck':
        this.samplers[key] = new Tone.PluckSynth({
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.9
        }).toDestination();
        break;
        
      case 'monosynth':
        this.samplers[key] = new Tone.MonoSynth({
          oscillator: { type: "sawtooth" },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 },
          filter: { Q: 2, frequency: 200, type: "lowpass" }
        }).toDestination();
        break;
        
      case 'polysynth':
        this.samplers[key] = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "fatsawtooth", count: 3, spread: 30 },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.4 }
        }).toDestination();
        break;
        
      default:
        this.samplers[key] = new Tone.Synth({
          oscillator: { type: "sawtooth" },
          envelope: { attack: 0.8, decay: 0.3, sustain: 0.7, release: 1.5 }
        }).toDestination();
    }
  }

  /**
   * ドラムとパーカッションの設定
   */
  setupDrums() {
    // 高品質ドラムシンセサイザー
    this.samplers.drums = {
      kick: new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 },
        filter: { Q: 1 }
      }).toDestination(),
      
      snare: new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.0 }
      }).toDestination(),
      
      hihat: new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.005, decay: 0.05, sustain: 0.0 }
      }).toDestination(),
      
      cymbal: new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.0 }
      }).toDestination()
    };
    
    // ポリシンセサイザー楽器も追加
    this.samplers.polysynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "fatsawtooth", count: 3, spread: 30 },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.4 }
    }).toDestination();
    
    this.loadingStatus.drums = 'loaded';
    this.loadingStatus.polysynth = 'loaded';
  }

  /**
   * キーワード辞書（拡張版）
   */
  initializeKeywordDictionary() {
    return {
      // 感情・雰囲気（日本語対応）
      '疾走感': { tempo: 40, scale: 'major', energy: 'high', instruments: ['guitar', 'drums'] },
      '疾走': { tempo: 40, scale: 'major', energy: 'high' },
      'ゲーム': { style: 'retro', tempo: 20, scale: 'major', instruments: ['synthesizer'] },
      '90年代': { style: 'retro', tempo: 10, instruments: ['synthesizer', 'guitar'] },
      '楽しい': { scale: 'major', tempo: 15, energy: 'medium', instruments: ['piano', 'guitar'] },
      '明るい': { scale: 'major', tempo: 10, energy: 'medium' },
      '悲しい': { scale: 'minor', tempo: -20, energy: 'low', instruments: ['violin', 'piano'] },
      '切ない': { scale: 'minor', tempo: -15, energy: 'low', instruments: ['violin', 'cello'] },
      '静か': { tempo: -30, energy: 'low', instruments: ['piano'] },
      '穏やか': { tempo: -20, energy: 'low', instruments: ['flute', 'piano'] },
      'エネルギッシュ': { tempo: 30, energy: 'high' },
      'ドラマチック': { scale: 'minor', energy: 'high', instruments: ['violin', 'cello'] },
      '壮大': { tempo: 20, energy: 'high', instruments: ['violin', 'cello', 'piano'] },
      '神秘的': { scale: 'minor', energy: 'medium', instruments: ['flute', 'synthesizer'] },
      '懐かしい': { tempo: -10, energy: 'medium', instruments: ['piano', 'guitar'] },
      
      // ジャンル（日本語対応）
      'クラシック': { style: 'classical', instruments: ['piano', 'violin', 'cello'] },
      'ジャズ': { style: 'jazz', instruments: ['piano', 'bass'], tempo: 5 },
      'ロック': { style: 'rock', instruments: ['guitar', 'bass', 'drums'], tempo: 25 },
      'エレクトロニック': { style: 'electronic', instruments: ['synthesizer'], tempo: 30 },
      '電子音楽': { style: 'electronic', instruments: ['synthesizer'], tempo: 30 },
      'アンビエント': { style: 'ambient', tempo: -30, instruments: ['synthesizer', 'flute'] },
      '映画音楽': { style: 'cinematic', energy: 'high', instruments: ['violin', 'cello', 'piano'] },
      'フォーク': { style: 'folk', tempo: -10, instruments: ['guitar'] },
      'チップチューン': { style: 'chiptune', tempo: 20, instruments: ['synthesizer'] },
      
      // 楽器（日本語対応）
      'ピアノ': { instruments: ['piano'] },
      'ギター': { instruments: ['guitar'] },
      'バイオリン': { instruments: ['violin'] },
      'チェロ': { instruments: ['cello'] },
      'フルート': { instruments: ['flute'] },
      'ベース': { instruments: ['bass'] },
      'シンセ': { instruments: ['synthesizer'] },
      'シンセサイザー': { instruments: ['synthesizer'] },
      'ドラム': { instruments: ['drums'] },
      
      // 英語キーワード
      'energetic': { tempo: 30, energy: 'high' },
      'calm': { tempo: -25, energy: 'low' },
      'dramatic': { scale: 'minor', energy: 'high' },
      'peaceful': { tempo: -20, energy: 'low' },
      'epic': { tempo: 20, energy: 'high' },
      'piano': { instruments: ['piano'] },
      'guitar': { instruments: ['guitar'] },
      'violin': { instruments: ['violin'] },
      'electronic': { style: 'electronic', instruments: ['synthesizer'] }
    };
  }

  /**
   * 自然言語解析（改良版）
   */
  parseNaturalLanguage(text) {
    const keywords = text.toLowerCase().split(/\s+/);
    let params = {
      tempo: 120,
      key: 'C',
      scale: 'major',
      style: 'modern',
      energy: 'medium',
      instruments: []
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
        if (keywordParams.instruments) {
          keywordParams.instruments.forEach(inst => {
            if (!params.instruments.includes(inst)) {
              params.instruments.push(inst);
            }
          });
        }
      }
    });

    // デフォルト楽器設定
    if (params.instruments.length === 0) {
      params.instruments = ['piano'];
    }

    // テンポの範囲制限
    params.tempo = Math.max(60, Math.min(200, params.tempo));

    console.log('Parsed parameters:', params);
    return params;
  }

  /**
   * 楽器の読み込み状態取得
   */
  getLoadingStatus() {
    const status = {};
    Object.entries(this.loadingStatus).forEach(([key, state]) => {
      status[key] = {
        name: this.instrumentSources[key]?.name || key,
        status: state
      };
    });
    return status;
  }

  /**
   * 利用可能な楽器一覧
   */
  getAvailableInstruments() {
    return Object.keys(this.samplers).filter(key => key !== 'drums');
  }

  // その他のメソッドは SimpleToneMusicEngine から継承・改良
  async generateMusic(settings) {
    if (!this.isInitialized) {
      throw new Error('Engine not initialized');
    }

    console.log('Generating music with realistic instruments:', settings);

    // 自然言語を解析
    let params = {
      tempo: settings.tempo || 120,
      key: settings.key || 'C',
      scale: 'major',
      duration: settings.duration || 16,
      instruments: settings.instruments || ['piano']
    };

    if (settings.naturalLanguage) {
      const parsedParams = this.parseNaturalLanguage(settings.naturalLanguage);
      params = { ...params, ...parsedParams };
    }

    // コード進行を生成
    const chordProgression = this.generateChordProgression(params.key, params.scale);
    
    // メロディを生成（使用可能な楽器に基づく）
    const melody = this.generateMelodyForInstruments(chordProgression, params);

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

    console.log('Music generation completed with realistic instruments');
    return this.currentComposition;
  }

  generateChordProgression(key, scale) {
    // より豊富なコード進行パターン
    const progressions = [
      [
        { name: 'C', notes: ['C', 'E', 'G'], root: 'C' },
        { name: 'Am', notes: ['A', 'C', 'E'], root: 'A' },
        { name: 'F', notes: ['F', 'A', 'C'], root: 'F' },
        { name: 'G', notes: ['G', 'B', 'D'], root: 'G' }
      ],
      [
        { name: 'C', notes: ['C', 'E', 'G'], root: 'C' },
        { name: 'G', notes: ['G', 'B', 'D'], root: 'G' },
        { name: 'Am', notes: ['A', 'C', 'E'], root: 'A' },
        { name: 'F', notes: ['F', 'A', 'C'], root: 'F' }
      ]
    ];
    
    return progressions[Math.floor(Math.random() * progressions.length)];
  }

  generateMelodyForInstruments(chordProgression, params) {
    const melody = [];
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    
    // 楽器ごとに異なる音域とスタイルでメロディを生成
    params.instruments.forEach((instrument, instIndex) => {
      const instrumentNotes = this.getInstrumentRange(instrument);
      
      for (let i = 0; i < 16; i++) {
        const note = instrumentNotes[Math.floor(Math.random() * instrumentNotes.length)];
        melody.push({
          note: note,
          time: i * 0.5,
          duration: '4n',
          instrument: instrument
        });
      }
    });
    
    return melody;
  }

  getInstrumentRange(instrument) {
    const ranges = {
      'piano': ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
      'guitar': ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      'violin': ['G3', 'D4', 'A4', 'E5', 'G5', 'D6'],
      'cello': ['C2', 'G2', 'D3', 'A3', 'C4'],
      'flute': ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'],
      'bass': ['E1', 'A1', 'D2', 'G2'],
      'synthesizer': ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4']
    };
    
    return ranges[instrument] || ranges.piano;
  }

  play() {
    if (!this.currentComposition) {
      console.log('No composition to play');
      return false;
    }

    try {
      console.log('Starting playback with realistic instruments...');
      
      this.stop();
      
      Tone.Transport.bpm.value = this.currentComposition.params.tempo;
      
      // 楽器ごとにパートを作成
      const parts = [];
      
      this.currentComposition.melody.forEach(note => {
        const instrument = note.instrument || 'piano';
        const sampler = this.samplers[instrument];
        
        if (sampler) {
          const part = new Tone.Part((time, noteData) => {
            if (sampler.triggerAttackRelease) {
              sampler.triggerAttackRelease(noteData.note, noteData.duration, time);
            }
          }, [{
            time: note.time,
            note: note.note,
            duration: note.duration
          }]);
          
          part.start(0);
          parts.push(part);
        }
      });

      Tone.Transport.start();
      this.isPlaying = true;
      this.currentParts = parts;
      
      // 自動停止
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
    try {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      
      if (this.currentParts) {
        this.currentParts.forEach(part => part.dispose());
        this.currentParts = null;
      }
      
      if (this.stopTimer) {
        clearTimeout(this.stopTimer);
        this.stopTimer = null;
      }
      
      this.isPlaying = false;
    } catch (error) {
      console.error('Stop error:', error);
    }
  }

  pause() {
    if (this.isPlaying) {
      try {
        Tone.Transport.pause();
        this.isPlaying = false;
      } catch (error) {
        console.error('Pause error:', error);
      }
    }
  }

  // WAVエクスポート機能はSimpleToneMusicEngineから継承
  async exportToWAV() {
    if (!this.currentComposition) {
      throw new Error('エクスポートする音楽がありません');
    }
    
    try {
      console.log('Starting WAV export with realistic instruments...');
      
      const duration = this.currentComposition.params.duration;
      const sampleRate = 44100;
      const numberOfChannels = 2; // ステレオ
      const length = sampleRate * duration;
      
      const offlineContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
      
      // 楽器ごとにオフライン音源を作成・スケジュール
      const promises = this.currentComposition.melody.map(async (note) => {
        const instrument = note.instrument || 'piano';
        const config = this.instrumentSources[instrument];
        
        if (config) {
          // リアル楽器のオフライン版を作成
          const offlineSampler = new Tone.Sampler({
            urls: config.urls,
            baseUrl: config.baseUrl
          }).connect(offlineContext.destination);
          
          return new Promise((resolve) => {
            offlineSampler.triggerAttackRelease(
              note.note, 
              note.duration === '4n' ? 0.5 : 0.25, 
              note.time
            );
            resolve();
          });
        }
      });
      
      await Promise.all(promises);
      
      const renderedBuffer = await offlineContext.startRendering();
      const wavArrayBuffer = this.bufferToWav(renderedBuffer);
      
      console.log('WAV export completed with realistic instruments');
      return wavArrayBuffer;
      
    } catch (error) {
      console.error('WAV export failed:', error);
      throw error;
    }
  }

  bufferToWav(buffer) {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    // WAVヘッダー
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    // PCMデータ
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return arrayBuffer;
  }

  // その他のユーティリティメソッド
  getCurrentComposition() {
    return this.currentComposition;
  }

  getPlaybackProgress() {
    if (!this.isPlaying || !this.currentComposition) {
      return 0;
    }
    // 簡易的な進行状況計算
    return Tone.Transport.seconds / this.currentComposition.params.duration;
  }
}

// グローバルに公開
window.RealisticToneMusicEngine = RealisticToneMusicEngine;
