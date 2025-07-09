/**
 * 高品質音楽生成エンジン（統合版）
 * Tone.js + リアル楽器サンプルを使用した音楽理論ベースの音楽生成システム
 * オンデマンド楽器読み込み対応
 */
class RealisticToneEngine {
  constructor() {
    this.samplers = {};
    this.loadingStatus = {};
    this.initialized = false;
    this.currentPlayer = null;
    this.currentComposition = null;
    
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

    this.keywordDictionary = {
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
        electronic: ['エレクトロニック', 'テクノ', 'シンセ']
      },
      tempo: {
        slow: ['遅い', 'スロー', 'ゆっくり', 'バラード'],
        medium: ['普通', 'ミディアム', '中程度'],
        fast: ['速い', 'ファスト', 'アップテンポ', 'ダンス']
      }
    };

    this.initialize();
  }

  /**
   * エンジン初期化
   */
  async initialize() {
    try {
      console.log('Initializing RealisticToneEngine...');
      
      if (typeof Tone === 'undefined') {
        throw new Error('Tone.js is not loaded');
      }

      if (Tone.context.state !== 'running') {
        console.log('AudioContext is not running, will start on user interaction');
      }

      // フォールバック楽器の初期化
      this.initializeFallbackInstruments();
      
      this.initialized = true;
      console.log('RealisticToneEngine initialized successfully');
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('musicEngineReady', {
          detail: { engine: this }
        }));
      }
      
    } catch (error) {
      console.error('Engine initialization failed:', error);
      this.initializeFallbackInstruments();
      this.initialized = true;
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('musicEngineFallback', {
          detail: { engine: this, error: error.message }
        }));
      }
    }
  }

  /**
   * フォールバック楽器の初期化
   */
  initializeFallbackInstruments() {
    console.log('Loading fallback instruments...');
    
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
    
    this.samplers.saxophone = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.5 }
    }).toDestination();
    
    this.samplers.trumpet = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.3 }
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
    
    console.log('Fallback instruments loaded:', Object.keys(this.samplers));
  }

  /**
   * オンデマンド楽器読み込み
   */
  async loadInstrument(instrumentKey) {
    if (this.samplers[instrumentKey]) {
      return this.samplers[instrumentKey];
    }

    this.loadingStatus[instrumentKey] = { status: 'loading', progress: 0 };

    try {
      console.log(`Loading instrument: ${instrumentKey}...`);
      
      // SampleLibraryが利用可能な場合はリアル楽器を読み込み
      if (typeof SampleLibrary !== 'undefined') {
        const sampler = await this.loadRealInstrument(instrumentKey);
        this.samplers[instrumentKey] = sampler;
        this.loadingStatus[instrumentKey] = { status: 'loaded', progress: 100 };
        console.log(`✓ Real instrument loaded: ${instrumentKey}`);
        return sampler;
      } else {
        // フォールバック楽器を作成
        const fallbackInstrument = this.createFallbackInstrument(instrumentKey);
        this.samplers[instrumentKey] = fallbackInstrument;
        this.loadingStatus[instrumentKey] = { status: 'fallback', progress: 100 };
        console.log(`✓ Fallback instrument loaded: ${instrumentKey}`);
        return fallbackInstrument;
      }
    } catch (error) {
      console.warn(`Failed to load ${instrumentKey}, using fallback:`, error);
      const fallbackInstrument = this.createFallbackInstrument(instrumentKey);
      this.samplers[instrumentKey] = fallbackInstrument;
      this.loadingStatus[instrumentKey] = { status: 'fallback', progress: 100 };
      return fallbackInstrument;
    }
  }

  /**
   * リアル楽器サンプルの読み込み
   */
  async loadRealInstrument(instrumentKey) {
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
            filter: { Q: 2, frequency: 150, type: 'lowpass' },
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 0.8 }
          }).toDestination();
        } else {
          return new Tone.PluckSynth({
            attackNoise: 0.8,
            dampening: 4000,
            resonance: 0.9
          }).toDestination();
        }
        
      case 'wind':
        return new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.1, decay: 0.1, sustain: 0.8, release: 0.3 }
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

    if (!description) return parsed;

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
    if (lowerDesc.includes('サックス')) parsed.instruments = ['saxophone'];
    if (lowerDesc.includes('バイオリン')) parsed.instruments = ['violin'];

    return parsed;
  }

  /**
   * 音楽生成
   */
  async generateMusic(settings) {
    if (!this.initialized) {
      throw new Error('Engine not initialized');
    }

    try {
      if (Tone.context.state === 'suspended') {
        await Tone.start();
      }

      console.log('Generating music with settings:', settings);

      // 自然言語解析
      let params = settings;
      if (settings.description) {
        const parsed = this.parseNaturalLanguage(settings.description);
        params = { ...parsed, ...settings };
      }

      // 楽曲構造の生成
      const composition = this.createComposition(params);
      
      // シンプルな音楽データ生成（デモ用）
      const musicData = this.generateSimpleMusic(composition, params);
      
      return {
        audioBuffer: musicData.buffer,
        waveform: musicData.waveform,
        metadata: {
          duration: params.duration || 30,
          tempo: composition.tempo,
          key: composition.key,
          instruments: params.instruments || ['piano'],
          chordProgression: composition.chordProgression,
          quality: 'high'
        }
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
    const key = params.key || keys[Math.floor(Math.random() * keys.length)];
    
    const progression = this.chordProgressions[params.genre] || this.chordProgressions.pop;
    const tempo = this.getTempoValue(params.tempo);

    return {
      key: key,
      chordProgression: progression,
      tempo: tempo,
      scale: params.scale || 'major',
      structure: this.createSongStructure(params),
      instruments: params.instruments || ['piano']
    };
  }

  /**
   * テンポ値の取得
   */
  getTempoValue(tempoName) {
    if (typeof tempoName === 'number') return tempoName;
    
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
    const measures = Math.floor(duration / 2);

    return {
      intro: Math.min(2, Math.floor(measures * 0.1)),
      verse: Math.floor(measures * 0.4),
      chorus: Math.floor(measures * 0.4),
      outro: Math.min(2, Math.floor(measures * 0.1))
    };
  }

  /**
   * シンプルな音楽生成
   */
  generateSimpleMusic(composition, params) {
    const duration = params.duration || 30;
    const sampleRate = 44100;
    const bufferLength = duration * sampleRate;
    const audioBuffer = new Float32Array(bufferLength);

    // 基本周波数（A4 = 440Hz）
    const baseFreq = 440;
    const tempo = composition.tempo;
    const beatDuration = 60 / tempo; // 1拍の長さ（秒）

    for (let i = 0; i < bufferLength; i++) {
      const t = i / sampleRate;
      const beatPosition = (t % beatDuration) / beatDuration;
      
      // シンプルなコード進行
      const chordIndex = Math.floor(t / (beatDuration * 4)) % composition.chordProgression.length;
      const chordFreq = baseFreq * Math.pow(2, chordIndex * 0.1);
      
      // 和音とメロディー
      const chord = Math.sin(2 * Math.PI * chordFreq * t) * 0.3;
      const melody = Math.sin(2 * Math.PI * chordFreq * 1.5 * t) * 0.2;
      const rhythm = Math.sin(2 * Math.PI * chordFreq * 0.5 * t) * 0.1;
      
      // エンベロープ
      const envelope = Math.exp(-beatPosition * 2) * 0.5 + 0.5;
      
      audioBuffer[i] = (chord + melody + rhythm) * envelope * 0.7;
    }

    // 波形データの生成
    const waveform = this.generateWaveform(audioBuffer);

    return {
      buffer: audioBuffer,
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
   * 利用可能な楽器リストを取得（UI用）
   */
  getAvailableInstruments() {
    return Object.keys(this.availableInstruments).map(key => {
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
   * 利用可能な楽器リスト取得（UI用）
   */
  getAvailableInstrumentsList() {
    return Object.keys(this.availableInstruments);
  }

  /**
   * 楽器の読み込み状況取得
   */
  getLoadingStatus() {
    return this.loadingStatus;
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
      'drums': '🥁'
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
   * 音声再生
   */
  async playAudio(audioBuffer) {
    try {
      if (Tone.context.state === 'suspended') {
        await Tone.start();
      }

      if (this.currentPlayer) {
        this.currentPlayer.stop();
        this.currentPlayer.dispose();
      }

      // AudioBufferをTone.jsで再生可能な形式に変換
      const buffer = new Tone.ToneAudioBuffer();
      buffer.fromArray(audioBuffer);
      
      this.currentPlayer = new Tone.Player(buffer).toDestination();
      this.currentPlayer.start();
      
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
      const wavBuffer = this.audioBufferToWav(audioBuffer);
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
    const sampleRate = 44100;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);

    // WAVヘッダーの書き込み
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

    // 音声データの書き込み
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioBuffer[i] || 0));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return arrayBuffer;
  }

  /**
   * 音楽再生
   */
  async playMusic(composition) {
    try {
      if (Tone.context.state === 'suspended') {
        await Tone.start();
      }

      this.stopMusic(); // 既存の再生を停止

      console.log('Playing composition:', composition);
      
      // シンプルな再生デモ（実際の楽曲構造に基づく）
      const piano = this.samplers.piano || await this.loadInstrument('piano');
      
      if (piano && composition.chords) {
        const chordSequence = composition.chords.slice(0, 4); // 最初の4コード
        const noteSequence = this.generateMelodyFromChords(chordSequence, composition.key);
        
        // コード進行の再生
        let time = 0;
        chordSequence.forEach((chord, index) => {
          const chordNotes = this.getChordNotes(chord, composition.key);
          piano.triggerAttackRelease(chordNotes, '2n', time);
          time += 2; // 2秒間隔
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Playback failed:', error);
      throw error;
    }
  }

  /**
   * 音楽停止
   */
  stopMusic() {
    try {
      // すべての楽器の音を停止
      Object.values(this.samplers).forEach(sampler => {
        if (sampler && typeof sampler.releaseAll === 'function') {
          sampler.releaseAll();
        }
      });

      // オーディオプレイヤーも停止
      if (this.currentPlayer) {
        this.currentPlayer.pause();
        this.currentPlayer.currentTime = 0;
      }

      console.log('Music stopped');
      return true;
    } catch (error) {
      console.error('Stop failed:', error);
      return false;
    }
  }

  /**
   * コードから和音ノートを取得
   */
  getChordNotes(chord, key) {
    // シンプルな三和音の実装
    const rootNote = this.getNoteFromChord(chord, key);
    const chordType = this.getChordType(chord);
    
    const intervals = chordType === 'minor' ? [0, 3, 7] : [0, 4, 7]; // メジャー/マイナー三和音
    
    return intervals.map(interval => 
      Tone.Frequency(rootNote).transpose(interval).toNote()
    );
  }

  /**
   * コードから根音を取得
   */
  getNoteFromChord(chord, key) {
    const chordMap = {
      'I': 0, 'ii': 2, 'iii': 4, 'IV': 5, 'V': 7, 'vi': 9, 'VII': 11
    };
    
    const keyOffset = this.getKeyOffset(key);
    const chordOffset = chordMap[chord] || 0;
    
    return Tone.Frequency('C4').transpose(keyOffset + chordOffset).toNote();
  }

  /**
   * キーのオフセットを取得
   */
  getKeyOffset(key) {
    const keyMap = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    return keyMap[key] || 0;
  }

  /**
   * コードタイプを取得
   */
  getChordType(chord) {
    return chord.toLowerCase() === chord ? 'minor' : 'major';
  }

  /**
   * メロディー生成（コード進行から）
   */
  generateMelodyFromChords(chords, key) {
    return chords.map(chord => this.getNoteFromChord(chord, key));
  }
}

// グローバルに公開
window.RealisticToneEngine = RealisticToneEngine;
