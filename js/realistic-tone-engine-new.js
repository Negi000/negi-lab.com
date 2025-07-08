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
      'piano': {
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
        category: 'strings'
      },
      'guitar-electric': {
        name: 'エレキギター',
        key: 'guitar-electric',
        category: 'strings'
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
      'contrabass': {
        name: 'コントラバス',
        key: 'contrabass',
        category: 'strings'
      },
      'harp': {
        name: 'ハープ',
        key: 'harp',
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
      'french-horn': {
        name: 'フレンチホルン',
        key: 'french-horn',
        category: 'wind'
      },
      'tuba': {
        name: 'チューバ',
        key: 'tuba',
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
      'bassoon': {
        name: 'バスーン',
        key: 'bassoon',
        category: 'wind'
      },
      'xylophone': {
        name: 'シロフォン',
        key: 'xylophone',
        category: 'percussion'
      },
      'organ': {
        name: 'オルガン',
        key: 'organ',
        category: 'keyboard'
      },
      'harmonium': {
        name: 'ハーモニウム',
        key: 'harmonium',
        category: 'keyboard'
      }
    };
  }

  /**
   * エンジン初期化
   */
  async initialize() {
    try {
      console.log('Initializing RealisticToneMusicEngine...');
      
      // Tone.jsの確認
      if (typeof Tone === 'undefined') {
        throw new Error('Tone.js is not loaded');
      }

      // AudioContextの初期化（ユーザー操作が必要な場合に備えて）
      if (Tone.context.state !== 'running') {
        console.log('AudioContext is not running, will start on user interaction');
      }

      // SampleLibraryの確認
      if (typeof SampleLibrary === 'undefined') {
        console.warn('Tone.js-Instruments (SampleLibrary) is not available, using fallback instruments');
        this.loadFallbackInstruments();
        this.isInitialized = true;
        return;
      }

      // 基本的な楽器を読み込み
      console.log('Loading basic instruments with SampleLibrary...');
      await this.loadBasicInstruments();
      
      this.isInitialized = true;
      console.log('RealisticToneMusicEngine initialized successfully');
      
      // 初期化完了イベントを発火
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('musicEngineReady', {
          detail: { engine: this, availableInstruments: Object.keys(this.samplers) }
        }));
      }
      
    } catch (error) {
      console.error('Engine initialization failed:', error);
      // フォールバックを試行
      console.log('Falling back to synthetic instruments...');
      this.loadFallbackInstruments();
      this.isInitialized = true;
      
      // フォールバック完了イベントを発火
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('musicEngineFallback', {
          detail: { engine: this, error: error.message }
        }));
      }
    }
  }

  /**
   * 基本楽器の読み込み
   */
  async loadBasicInstruments() {
    try {
      // 複数楽器を一括読み込み（SampleLibraryの推奨方法）
      const basicInstruments = [
        'piano', 'guitar-acoustic', 'bass-electric', 
        'violin', 'flute', 'saxophone', 'trumpet',
        'guitar-electric', 'cello'
      ];
      const LOAD_TIMEOUT = 20000; // 20秒タイムアウト（多数楽器のため）
      
      for (const instrumentKey of basicInstruments) {
        this.loadingStatus[instrumentKey] = { status: 'loading', progress: 0 };
      }

      console.log('Starting to load instruments:', basicInstruments);
      
      // SampleLibraryで全楽器を一括読み込み
      const loadPromise = new Promise((resolve, reject) => {
        try {
          // 一括ロードの方が効率的
          const instruments = SampleLibrary.load({
            instruments: basicInstruments,
            baseUrl: "https://cdn.jsdelivr.net/gh/nbrosowsky/tonejs-instruments/samples/",
            onload: () => {
              console.log('All instruments loaded successfully');
              
              // 各楽器をセットアップ
              basicInstruments.forEach(instrumentKey => {
                const sampler = instruments[instrumentKey];
                if (sampler) {
                  sampler.toDestination();
                  this.samplers[instrumentKey] = sampler;
                  this.loadingStatus[instrumentKey] = { status: 'loaded', progress: 100 };
                  console.log(`✓ Loaded: ${instrumentKey}`);
                } else {
                  console.warn(`⚠ Failed to load: ${instrumentKey}, using fallback`);
                  this.loadFallbackInstrument(instrumentKey);
                  this.loadingStatus[instrumentKey] = { status: 'fallback', progress: 100 };
                }
              });
              
              resolve(instruments);
            },
            onerror: (error) => {
              console.error('Error loading instruments:', error);
              reject(error);
            }
              });
              
              // 即座に楽器が利用可能な場合（同期的ロード）
              if (instruments && instruments[instrumentKey]) {
                instruments[instrumentKey].toDestination();
                resolve(instruments[instrumentKey]);
              }
              
            } catch (error) {
              reject(error);
            }
          });

          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Load timeout for ${instrumentKey}`)), LOAD_TIMEOUT);
          });

          const loadedSampler = await Promise.race([loadPromise, timeoutPromise]);
          
          this.samplers[instrumentKey] = loadedSampler;
          this.loadingStatus[instrumentKey] = { status: 'loaded', progress: 100 };
          console.log(`Successfully loaded instrument: ${instrumentKey}`);
          
        } catch (error) {
          console.warn(`Failed to load ${instrumentKey}, using fallback:`, error);
          this.loadFallbackInstrument(instrumentKey);
          this.loadingStatus[instrumentKey] = { status: 'fallback', progress: 100 };
        }
      });

      await Promise.allSettled(promises);

    } catch (error) {
      console.error('Failed to load basic instruments:', error);
      // 完全フォールバック
      this.loadFallbackInstruments();
    }
  }

  /**
   * 単一楽器のフォールバック読み込み
   */
  loadFallbackInstrument(instrumentKey) {
    console.log(`Loading fallback for instrument: ${instrumentKey}`);
    
    switch (instrumentKey) {
      case 'piano':
        this.samplers[instrumentKey] = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.1, decay: 0.3, sustain: 0.3, release: 1 }
        }).toDestination();
        break;
      case 'guitar-acoustic':
      case 'guitar-electric':
      case 'guitar-nylon':
        this.samplers[instrumentKey] = new Tone.PluckSynth({
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.9
        }).toDestination();
        break;
      case 'bass-electric':
        this.samplers[instrumentKey] = new Tone.MonoSynth({
          oscillator: { type: 'sawtooth' },
          filter: { Q: 2, frequency: 120 },
          envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.8 }
        }).toDestination();
        break;
      default:
        this.samplers[instrumentKey] = new Tone.Synth().toDestination();
    }
    
    this.loadingStatus[instrumentKey] = { status: 'fallback', progress: 100 };
  }

  /**
   * フォールバック楽器の読み込み
   */
  loadFallbackInstruments() {
    console.log('Loading fallback instruments...');
    
    // より高品質なTone.jsシンセサイザーを使用
    this.samplers.piano = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.3, release: 1.5 }
    }).toDestination();
    
    this.samplers['guitar-acoustic'] = new Tone.PluckSynth({
      attackNoise: 0.8,
      dampening: 4000,
      resonance: 0.9
    }).toDestination();
    
    this.samplers['bass-electric'] = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      filter: { Q: 2, frequency: 150, type: 'lowpass' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.8 }
    }).toDestination();
    
    // 追加のフォールバック楽器
    this.samplers['guitar-electric'] = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.5 }
    }).toDestination();
    
    this.samplers.violin = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3.01,
      modulationIndex: 14,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.2, decay: 0.3, sustain: 0.6, release: 0.8 }
    }).toDestination();
    
    this.samplers.flute = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.1, sustain: 0.8, release: 0.3 }
    }).toDestination();
    
    this.samplers.drums = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
    }).toDestination();
    
    // すべての楽器の読み込み状況を更新
    Object.keys(this.samplers).forEach(key => {
      this.loadingStatus[key] = { status: 'fallback', progress: 100 };
    });
    
    console.log('Fallback instruments loaded:', Object.keys(this.samplers));
  }

  /**
   * キーワード辞書の初期化
   */
  initializeKeywordDictionary() {
    return {
      mood: {
        happy: ['明るい', '楽しい', '元気', 'ポップ', '幸せ'],
        sad: ['悲しい', '切ない', '暗い', 'メランコリー'],
        energetic: ['エネルギッシュ', '激しい', 'パワフル', 'ロック'],
        calm: ['落ち着いた', '静か', 'リラックス', '穏やか'],
        romantic: ['ロマンチック', '愛', '甘い', '優雅'],
        mysterious: ['神秘的', '不思議', 'ミステリアス']
      },
      genre: {
        pop: ['ポップ', 'J-POP', 'ポピュラー'],
        jazz: ['ジャズ', 'スイング', 'ブルース'],
        rock: ['ロック', 'ハード', 'メタル'],
        classical: ['クラシック', 'オーケストラ', '交響曲'],
        electronic: ['エレクトロニック', 'テクノ', 'シンセ'],
        ambient: ['アンビエント', '環境音楽', 'ヒーリング']
      },
      tempo: {
        slow: ['遅い', 'スロー', 'ゆっくり', 'バラード'],
        medium: ['普通', 'ミディアム', '中程度'],
        fast: ['速い', 'ファスト', 'アップテンポ', 'ダンス']
      }
    };
  }

  /**
   * 自然言語解析
   */
  parseNaturalLanguage(description) {
    const parsed = {
      mood: 'happy',
      genre: 'pop',
      tempo: 'medium',
      instruments: ['piano'],
      duration: 30
    };

    const lowerDesc = description.toLowerCase();

    // ムード解析
    for (const [mood, keywords] of Object.entries(this.keywordDictionary.mood)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        parsed.mood = mood;
        break;
      }
    }

    // ジャンル解析
    for (const [genre, keywords] of Object.entries(this.keywordDictionary.genre)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        parsed.genre = genre;
        break;
      }
    }

    // テンポ解析
    for (const [tempo, keywords] of Object.entries(this.keywordDictionary.tempo)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        parsed.tempo = tempo;
        break;
      }
    }

    // 楽器解析
    if (lowerDesc.includes('ピアノ')) parsed.instruments = ['piano'];
    if (lowerDesc.includes('ギター')) parsed.instruments = ['guitar-acoustic'];
    if (lowerDesc.includes('ベース')) parsed.instruments = ['bass-electric'];

    return parsed;
  }

  /**
   * 音楽生成
   */
  async generateMusic(settings) {
    if (!this.isInitialized) {
      throw new Error('Engine not initialized');
    }

    try {
      // AudioContextの初期化
      if (Tone.context.state === 'suspended') {
        await Tone.start();
      }

      console.log('Generating music with settings:', settings);

      // 自然言語解析（シンプルモード用）
      let params = settings;
      if (settings.description) {
        const parsed = this.parseNaturalLanguage(settings.description);
        params = { ...parsed, ...settings };
      }

      // 楽曲構造の生成
      const composition = this.createComposition(params);
      
      // 音楽の再生とレンダリング
      const musicData = await this.renderComposition(composition, params);
      
      return {
        audioData: musicData.audioBuffer,
        waveform: musicData.waveform,
        metadata: {
          duration: params.duration || 30,
          tempo: params.tempo || 120,
          key: composition.key,
          instruments: params.instruments,
          quality: 'high'
        },
        params: params
      };

    } catch (error) {
      console.error('Music generation failed:', error);
      throw error;
    }
  }

  /**
   * 楽曲構造の作成
   */
  createComposition(params) {
    const keys = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb'];
    const key = keys[Math.floor(Math.random() * keys.length)];
    
    const chordProgressions = {
      pop: ['I', 'V', 'vi', 'IV'],
      jazz: ['I', 'vi', 'ii', 'V'],
      rock: ['I', 'VII', 'IV', 'I'],
      classical: ['I', 'IV', 'V', 'I']
    };

    const progression = chordProgressions[params.genre] || chordProgressions.pop;

    return {
      key: key,
      chordProgression: progression,
      tempo: this.getTempoValue(params.tempo),
      structure: this.createSongStructure(params),
      instruments: params.instruments || ['piano']
    };
  }

  /**
   * テンポ値の取得
   */
  getTempoValue(tempoName) {
    const tempoMap = {
      slow: 70 + Math.random() * 20,
      medium: 100 + Math.random() * 40,
      fast: 140 + Math.random() * 40
    };
    return Math.floor(tempoMap[tempoName] || tempoMap.medium);
  }

  /**
   * 楽曲構造の作成
   */
  createSongStructure(params) {
    const duration = params.duration || 30;
    const measures = Math.floor(duration / 2); // 1小節約2秒

    return {
      intro: Math.min(2, measures * 0.1),
      verse: Math.floor(measures * 0.4),
      chorus: Math.floor(measures * 0.4),
      outro: Math.min(2, measures * 0.1)
    };
  }

  /**
   * 楽曲のレンダリング
   */
  async renderComposition(composition, params) {
    const duration = params.duration || 30;
    const sampleRate = 44100;
    const bufferLength = duration * sampleRate;
    const audioBuffer = new Float32Array(bufferLength);

    // シンプルな音楽生成（デモ用）
    const noteFreq = 440; // A4
    const time = duration;

    for (let i = 0; i < bufferLength; i++) {
      const t = i / sampleRate;
      const chord = Math.sin(2 * Math.PI * noteFreq * t) * 0.3;
      const melody = Math.sin(2 * Math.PI * noteFreq * 1.5 * t) * 0.2;
      const envelope = Math.exp(-t * 0.5);
      
      audioBuffer[i] = (chord + melody) * envelope;
    }

    // 波形データの生成
    const waveform = this.generateWaveform(audioBuffer);

    return {
      audioBuffer: audioBuffer,
      waveform: waveform
    };
  }

  /**
   * 波形データの生成
   */
  generateWaveform(audioData) {
    const points = 100;
    const chunkSize = Math.floor(audioData.length / points);
    const waveform = [];

    for (let i = 0; i < points; i++) {
      let sum = 0;
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, audioData.length);

      for (let j = start; j < end; j++) {
        sum += Math.abs(audioData[j] || 0);
      }

      waveform.push(sum / (end - start) || 0);
    }

    return waveform;
  }

  /**
   * 楽器の読み込み状況取得
   */
  getLoadingStatus() {
    return this.loadingStatus;
  }

  /**
   * 利用可能な楽器リスト取得
   */
  getAvailableInstrumentsList() {
    return Object.keys(this.availableInstruments);
  }

  /**
   * 音楽再生
   */
  async playComposition(composition) {
    if (!this.isInitialized) {
      throw new Error('Engine not initialized');
    }

    try {
      if (Tone.context.state === 'suspended') {
        await Tone.start();
      }

      this.isPlaying = true;
      
      // シンプルな再生デモ
      const piano = this.samplers.piano || this.samplers['guitar-acoustic'];
      if (piano) {
        piano.triggerAttackRelease('C4', '2n');
        setTimeout(() => {
          piano.triggerAttackRelease('E4', '2n');
        }, 500);
        setTimeout(() => {
          piano.triggerAttackRelease('G4', '2n');
        }, 1000);
      }

      return true;
    } catch (error) {
      console.error('Playback failed:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  /**
   * 音楽停止
   */
  stopMusic() {
    this.isPlaying = false;
    // 全ての音源を停止
    Object.values(this.samplers).forEach(sampler => {
      if (sampler && typeof sampler.releaseAll === 'function') {
        sampler.releaseAll();
      }
    });
  }

  /**
   * WAVエクスポート
   */
  exportToWav(musicData) {
    if (!musicData || !musicData.audioData) {
      throw new Error('No music data to export');
    }

    const audioData = musicData.audioData;
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);

    // WAVヘッダーの作成
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
    view.setUint32(24, 44100, true);
    view.setUint32(28, 44100 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return buffer;
  }
}

// グローバルに公開
window.RealisticToneMusicEngine = RealisticToneMusicEngine;
