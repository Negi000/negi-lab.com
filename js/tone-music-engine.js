/**
 * Tone.js音楽生成エンジン
 * 音楽理論に基づいた高品質な音楽生成システム
 */

class ToneMusicEngine {
  constructor() {
    this.isInitialized = false;
    this.isPlaying = false;
    this.instruments = {};
    this.currentComposition = null;
    this.transport = null;
    this.keywordDictionary = this.initializeKeywordDictionary();
    this.musicTheory = this.initializeMusicTheory();
    
    this.initialize();
  }

  async initialize() {
    try {
      // Tone.jsのAudioContextを開始
      await Tone.start();
      console.log('Tone.js initialized');
      
      // 楽器のセットアップ
      await this.setupInstruments();
      
      // Transportの設定
      this.setupTransport();
      
      this.isInitialized = true;
      console.log('ToneMusicEngine fully initialized');
    } catch (error) {
      console.error('ToneMusicEngine initialization failed:', error);
    }
  }

  /**
   * 楽器セットアップ
   */
  async setupInstruments() {
    // ピアノ（高品質AMシンセ）
    this.instruments.piano = new Tone.AMSynth({
      harmonicity: 2.5,
      detune: 0,
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2
      },
      modulation: {
        type: "sine"
      },
      modulationEnvelope: {
        attack: 0.2,
        decay: 0.3,
        sustain: 0.8,
        release: 1.0
      }
    }).toDestination();

    // ストリングス（ポリシンセ）
    this.instruments.strings = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "sawtooth"
      },
      envelope: {
        attack: 1.2,
        decay: 0.4,
        sustain: 0.8,
        release: 2.0
      },
      filter: {
        Q: 6,
        type: "lowpass",
        rolloff: -24,
        frequency: 1200
      }
    }).toDestination();

    // ギター（PLUCKシンセ）
    this.instruments.guitar = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.9
    }).toDestination();

    // ベース（MonoSynth）
    this.instruments.bass = new Tone.MonoSynth({
      oscillator: {
        type: "sawtooth"
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 0.5
      },
      filter: {
        Q: 2,
        frequency: 200,
        type: "lowpass",
        rolloff: -24
      }
    }).toDestination();

    // シンセサイザー（FMシンセ）
    this.instruments.synthesizer = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      detune: 0,
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.01,
        decay: 0.01,
        sustain: 1,
        release: 0.5
      },
      modulation: {
        type: "square"
      },
      modulationEnvelope: {
        attack: 0.5,
        decay: 0.2,
        sustain: 0.2,
        release: 0.1
      }
    }).toDestination();

    // ドラム（MembraneSynth for kick, NoiseSynth for snare/hihat）
    this.instruments.drums = {
      kick: new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: {
          type: "sine"
        },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 1.4,
          attackCurve: "exponential"
        }
      }).toDestination(),
      
      snare: new Tone.NoiseSynth({
        noise: {
          type: "white"
        },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.0
        }
      }).toDestination(),
      
      hihat: new Tone.NoiseSynth({
        noise: {
          type: "white"
        },
        envelope: {
          attack: 0.005,
          decay: 0.05,
          sustain: 0.0
        }
      }).toDestination()
    };

    // エフェクト追加
    this.setupEffects();
  }

  /**
   * エフェクトセットアップ
   */
  setupEffects() {
    // リバーブ
    this.effects = {
      reverb: new Tone.Reverb({
        decay: 1.5,
        wet: 0.3
      }).toDestination(),
      
      delay: new Tone.PingPongDelay({
        delayTime: "8n",
        feedback: 0.3,
        wet: 0.2
      }).toDestination(),
      
      chorus: new Tone.Chorus({
        frequency: 1.5,
        delayTime: 3.5,
        depth: 0.7,
        wet: 0.3
      }).toDestination(),
      
      filter: new Tone.AutoFilter({
        frequency: "4n",
        min: 800,
        max: 15000,
        wet: 0.5
      }).toDestination()
    };

    // 楽器にエフェクトをルーティング
    this.instruments.strings.connect(this.effects.reverb);
    this.instruments.piano.connect(this.effects.chorus);
    this.instruments.synthesizer.connect(this.effects.filter);
      },
      modulationEnvelope: {
        attack: 0.5,
        decay: 0.3,
        sustain: 1,
        release: 0.8
      }
    }).toDestination();

    // ベース（モノシンセ）
    this.instruments.bass = new Tone.MonoSynth({
      oscillator: {
        type: "square"
      },
      envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8
      },
      filter: {
        Q: 6,
        type: "lowpass",
        rolloff: -24,
        frequency: 200
      }
    }).toDestination();

    // ドラム（サンプラー）
    this.instruments.drums = new Tone.Sampler({
      urls: {
        "C1": "kick.wav",
        "D1": "snare.wav", 
        "F#1": "hihat.wav",
        "A1": "openhat.wav"
      },
      baseUrl: "https://tonejs.github.io/audio/drum-samples/",
      onload: () => {
        console.log('Drum samples loaded');
      }
    }).toDestination();

    console.log('All instruments initialized');
  }

  /**
   * Transportの設定
   */
  setupTransport() {
    Tone.Transport.bpm.value = 120;
    this.transport = Tone.Transport;
  }

  /**
   * キーワード辞書の初期化
   */
  initializeKeywordDictionary() {
    return {
      // 感情・雰囲気（日本語対応強化）
      'sad': { scale: 'minor', tempo: -20, dynamics: 'soft' },
      '悲しい': { scale: 'minor', tempo: -20, dynamics: 'soft' },
      'happy': { scale: 'major', tempo: +15, dynamics: 'bright' },
      '楽しい': { scale: 'major', tempo: +15, dynamics: 'bright' },
      '明るい': { scale: 'major', tempo: +20, dynamics: 'bright' },
      'calm': { tempo: -25, dynamics: 'soft', complexity: 'simple' },
      '静か': { tempo: -25, dynamics: 'soft', complexity: 'simple' },
      '穏やか': { tempo: -20, dynamics: 'soft', complexity: 'simple' },
      'energetic': { tempo: +30, dynamics: 'strong', complexity: 'complex' },
      'エネルギッシュ': { tempo: +30, dynamics: 'strong', complexity: 'complex' },
      '疾走感': { tempo: +40, dynamics: 'strong', progression: 'driving' },
      'dramatic': { scale: 'minor', dynamics: 'dynamic', progression: 'dramatic' },
      'ドラマチック': { scale: 'minor', dynamics: 'dynamic', progression: 'dramatic' },
      'peaceful': { tempo: -20, dynamics: 'soft', harmony: 'consonant' },
      '平和': { tempo: -20, dynamics: 'soft', harmony: 'consonant' },
      'epic': { tempo: +20, dynamics: 'strong', progression: 'rising' },
      '壮大': { tempo: +20, dynamics: 'strong', progression: 'rising' },
      'melancholic': { scale: 'minor', tempo: -15, mode: 'dorian' },
      '切ない': { scale: 'minor', tempo: -15, mode: 'dorian' },
      'メランコリック': { scale: 'minor', tempo: -15, mode: 'dorian' },
      'uplifting': { scale: 'major', tempo: +25, progression: 'ascending' },
      '爽やか': { scale: 'major', tempo: +15, progression: 'ascending' },
      'mysterious': { scale: 'minor', mode: 'harmonic', dynamics: 'mysterious' },
      '神秘的': { scale: 'minor', mode: 'harmonic', dynamics: 'mysterious' },
      'nostalgic': { mode: 'mixolydian', tempo: -10, harmony: 'vintage' },
      '懐かしい': { mode: 'mixolydian', tempo: -10, harmony: 'vintage' },
      'ノスタルジック': { mode: 'mixolydian', tempo: -10, harmony: 'vintage' },
      
      // ジャンル・スタイル（日本語対応）
      'classical': { progression: 'classical', instruments: ['piano', 'strings'], structure: 'sonata' },
      'クラシック': { progression: 'classical', instruments: ['piano', 'strings'], structure: 'sonata' },
      'jazz': { progression: 'jazz', harmony: 'extended', swing: true },
      'ジャズ': { progression: 'jazz', harmony: 'extended', swing: true },
      'rock': { instruments: ['guitar', 'bass', 'drums'], progression: 'power' },
      'ロック': { instruments: ['guitar', 'bass', 'drums'], progression: 'power' },
      'electronic': { instruments: ['synthesizer'], effects: 'electronic', quantize: true },
      'エレクトロニック': { instruments: ['synthesizer'], effects: 'electronic', quantize: true },
      '電子音楽': { instruments: ['synthesizer'], effects: 'electronic', quantize: true },
      'ambient': { tempo: -30, dynamics: 'soft', effects: 'ambient', progression: 'floating' },
      'アンビエント': { tempo: -30, dynamics: 'soft', effects: 'ambient', progression: 'floating' },
      'cinematic': { dynamics: 'dynamic', progression: 'cinematic', structure: 'film' },
      '映画音楽': { dynamics: 'dynamic', progression: 'cinematic', structure: 'film' },
      'folk': { instruments: ['guitar'], progression: 'simple', rhythm: 'organic' },
      'フォーク': { instruments: ['guitar'], progression: 'simple', rhythm: 'organic' },
      'game': { instruments: ['synthesizer'], effects: 'retro', progression: 'loop' },
      'ゲーム': { instruments: ['synthesizer'], effects: 'retro', progression: 'loop' },
      'chiptune': { instruments: ['synthesizer'], effects: 'retro', progression: 'loop' },
      'チップチューン': { instruments: ['synthesizer'], effects: 'retro', progression: 'loop' },
      
      // テンポ・リズム（日本語対応）
      'slow': { tempo: -40 },
      'ゆっくり': { tempo: -40 },
      'スロー': { tempo: -40 },
      'fast': { tempo: +40 },
      '速い': { tempo: +40 },
      'ファスト': { tempo: +40 },
      'driving': { tempo: +25, rhythm: 'driving' },
      'ドライビング': { tempo: +25, rhythm: 'driving' },
      'flowing': { tempo: -10, rhythm: 'legato' },
      '流れるような': { tempo: -10, rhythm: 'legato' },
      'pulsing': { rhythm: 'pulsing', syncopation: true },
      'パルス': { rhythm: 'pulsing', syncopation: true },
      'steady': { rhythm: 'steady', quantize: true },
      '安定した': { rhythm: 'steady', quantize: true },
      
      // 楽器・音色（日本語対応）
      'piano': { instruments: ['piano'], leadInstrument: 'piano' },
      'ピアノ': { instruments: ['piano'], leadInstrument: 'piano' },
      'strings': { instruments: ['strings'], harmony: 'orchestral' },
      'ストリングス': { instruments: ['strings'], harmony: 'orchestral' },
      '弦楽器': { instruments: ['strings'], harmony: 'orchestral' },
      'synth': { instruments: ['synthesizer'], effects: 'modern' },
      'シンセ': { instruments: ['synthesizer'], effects: 'modern' },
      'シンセサイザー': { instruments: ['synthesizer'], effects: 'modern' },
      'orchestral': { instruments: ['strings', 'piano'], dynamics: 'orchestral' },
      'オーケストラ': { instruments: ['strings', 'piano'], dynamics: 'orchestral' },
      'minimal': { instruments: ['piano'], complexity: 'minimal' },
      'ミニマル': { instruments: ['piano'], complexity: 'minimal' },
      'rich': { instruments: ['piano', 'strings', 'synthesizer'], complexity: 'rich' },
      '豊かな': { instruments: ['piano', 'strings', 'synthesizer'], complexity: 'rich' },
      
      // 特殊効果（日本語対応）
      'dreamy': { effects: 'reverb', tempo: -15, harmony: 'ethereal' },
      '夢のような': { effects: 'reverb', tempo: -15, harmony: 'ethereal' },
      'ドリーミー': { effects: 'reverb', tempo: -15, harmony: 'ethereal' },
      'intense': { dynamics: 'forte', tempo: +20, progression: 'tension' },
      '激しい': { dynamics: 'forte', tempo: +20, progression: 'tension' },
      'gentle': { dynamics: 'piano', tempo: -10, harmony: 'soft' },
      'powerful': { dynamics: 'fortissimo', progression: 'strong' },
      'floating': { effects: 'ambient', progression: 'suspended' },
      'grounded': { bass: 'strong', rhythm: 'solid' },
      
      // 時代・年代
      '80s': { effects: 'retro', instruments: ['synthesizer'], progression: '80s' },
      '90s': { effects: 'vintage', harmony: '90s' },
      'modern': { effects: 'contemporary', quantize: true },
      'vintage': { effects: 'analog', harmony: 'vintage' },
      'futuristic': { effects: 'digital', instruments: ['synthesizer'] },
      
      // 用途
      'background': { dynamics: 'soft', complexity: 'simple', volume: -10 },
      'focus': { tempo: -20, complexity: 'minimal', harmony: 'calm' },
      'meditation': { tempo: -35, dynamics: 'soft', progression: 'peaceful' },
      'workout': { tempo: +35, dynamics: 'strong', rhythm: 'driving' },
      'study': { tempo: -15, complexity: 'moderate', dynamics: 'gentle' },
      'sleep': { tempo: -40, dynamics: 'soft', progression: 'lullaby' }
    };
  }

  /**
   * 音楽理論データの初期化
   */
  initializeMusicTheory() {
    return {
      // キーとスケール
      keys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      scales: {
        major: [0, 2, 4, 5, 7, 9, 11],
        minor: [0, 2, 3, 5, 7, 8, 10],
        dorian: [0, 2, 3, 5, 7, 9, 10],
        mixolydian: [0, 2, 4, 5, 7, 9, 10],
        harmonic: [0, 2, 3, 5, 7, 8, 11]
      },
      
      // コード進行テンプレート
      progressions: {
        classical: [
          ['I', 'vi', 'IV', 'V'],
          ['I', 'V', 'vi', 'IV'],
          ['vi', 'IV', 'I', 'V'],
          ['I', 'IV', 'V', 'I'],
          ['I', 'ii', 'V', 'I']
        ],
        jazz: [
          ['Imaj7', 'vi7', 'ii7', 'V7'],
          ['Imaj7', 'VI7', 'ii7', 'V7'],
          ['iii7', 'vi7', 'ii7', 'V7'],
          ['Imaj7', 'iii7', 'vi7', 'ii7'],
          ['vi7', 'ii7', 'V7', 'Imaj7']
        ],
        dramatic: [
          ['i', 'VI', 'iv', 'V'],
          ['i', 'VII', 'VI', 'VII'],
          ['i', 'v', 'VI', 'iv'],
          ['VI', 'VII', 'i', 'v']
        ],
        ambient: [
          ['I', 'V', 'vi', 'IV'],
          ['vi', 'IV', 'I', 'V'],
          ['I', 'iii', 'vi', 'IV'],
          ['Isus2', 'V', 'vi', 'IVadd9']
        ]
      },
      
      // コード機能
      functions: {
        tonic: ['I', 'vi', 'iii'],
        subdominant: ['IV', 'ii'],
        dominant: ['V', 'vii']
      },
      
      // ダイアトニックコード
      diatonicChords: {
        major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
        minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
      }
    };
  }

  /**
   * 自然言語の解析とパラメータ抽出
   */
  parseNaturalLanguage(text) {
    const keywords = text.toLowerCase().split(/\s+/);
    let extractedParams = {
      tempo: 120,
      key: 'C',
      scale: 'major',
      progression: 'classical',
      instruments: ['piano'],
      dynamics: 'moderate',
      effects: [],
      complexity: 'moderate'
    };

    // キーワードマッチングによるパラメータ抽出
    keywords.forEach(keyword => {
      if (this.keywordDictionary[keyword]) {
        const params = this.keywordDictionary[keyword];
        
        // パラメータのマージ
        Object.keys(params).forEach(key => {
          if (key === 'tempo' && typeof params[key] === 'number') {
            extractedParams.tempo += params[key];
          } else if (key === 'instruments' && Array.isArray(params[key])) {
            extractedParams.instruments = [...new Set([...extractedParams.instruments, ...params[key]])];
          } else if (key === 'effects' && Array.isArray(params[key])) {
            extractedParams.effects = [...new Set([...extractedParams.effects, ...params[key]])];
          } else {
            extractedParams[key] = params[key];
          }
        });
      }
    });

    // 範囲チェック
    extractedParams.tempo = Math.max(40, Math.min(200, extractedParams.tempo));
    
    console.log('Parsed parameters from natural language:', extractedParams);
    return extractedParams;
  }

  /**
   * 音楽生成メイン関数
   */
  async generateMusic(settings) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      console.log('Generating music with settings:', settings);

      // 自然言語がある場合は解析
      let params = { ...settings };
      if (settings.naturalLanguage) {
        const nlParams = this.parseNaturalLanguage(settings.naturalLanguage);
        params = { ...params, ...nlParams };
      }

      // 作曲パラメータの設定
      const composition = this.createComposition(params);
      
      // Transport設定
      Tone.Transport.bpm.value = params.tempo || 120;
      Tone.Transport.timeSignature = 4;

      // 楽曲の構成を生成
      this.scheduleComposition(composition);
      
      this.currentComposition = composition;
      
      return {
        success: true,
        composition: composition,
        params: params,
        duration: composition.totalDuration
      };

    } catch (error) {
      console.error('Music generation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 作曲構造の作成
   */
  createComposition(params) {
    const key = params.key || 'C';
    const scale = params.scale || 'major';
    const progressionType = params.progression || 'classical';
    
    // コード進行の生成
    const chordProgression = this.generateChordProgression(key, scale, progressionType);
    
    // セクション構成の決定
    const structure = this.createSongStructure(params);
    
    // メロディの生成
    const melody = this.generateMelody(chordProgression, key, scale, params);
    
    // ベースラインの生成
    const bassline = this.generateBassline(chordProgression, key, params);
    
    return {
      key: key,
      scale: scale,
      tempo: params.tempo || 120,
      chordProgression: chordProgression,
      structure: structure,
      melody: melody,
      bassline: bassline,
      instruments: params.instruments || ['piano'],
      totalDuration: structure.reduce((sum, section) => sum + section.duration, 0)
    };
  }

  /**
   * コード進行生成
   */
  generateChordProgression(key, scale, progressionType) {
    const progressions = this.musicTheory.progressions[progressionType] || 
                        this.musicTheory.progressions.classical;
    
    // ランダムに進行を選択
    const selectedProgression = progressions[Math.floor(Math.random() * progressions.length)];
    
    // キーに基づいてコードを具体化
    return selectedProgression.map(romanNumeral => {
      return this.convertRomanToChord(romanNumeral, key, scale);
    });
  }

  /**
   * ローマ数字をコード名に変換
   */
  convertRomanToChord(romanNumeral, key, scale) {
    const keyIndex = this.musicTheory.keys.indexOf(key);
    const scaleNotes = this.musicTheory.scales[scale];
    
    // ローマ数字の解析（簡略版）
    const numeralMap = {
      'I': 0, 'ii': 1, 'iii': 2, 'IV': 3, 'V': 4, 'vi': 5, 'vii': 6,
      'i': 0, 'II': 1, 'III': 2, 'iv': 3, 'v': 4, 'VI': 5, 'VII': 6
    };
    
    const baseNumeral = romanNumeral.replace(/maj7|7|°|sus2|add9/g, '');
    const degree = numeralMap[baseNumeral] || 0;
    const noteIndex = (keyIndex + scaleNotes[degree]) % 12;
    const chordRoot = this.musicTheory.keys[noteIndex];
    
    // コードタイプの決定
    let chordType = '';
    if (romanNumeral.includes('maj7')) chordType = 'maj7';
    else if (romanNumeral.includes('7')) chordType = '7';
    else if (romanNumeral.includes('°')) chordType = 'dim';
    else if (romanNumeral.includes('sus2')) chordType = 'sus2';
    else if (romanNumeral.includes('add9')) chordType = 'add9';
    else if (romanNumeral === romanNumeral.toLowerCase()) chordType = 'm';
    
    return {
      root: chordRoot,
      type: chordType,
      roman: romanNumeral,
      notes: this.getChordNotes(chordRoot, chordType)
    };
  }

  /**
   * コード構成音の取得
   */
  getChordNotes(root, type) {
    const rootIndex = this.musicTheory.keys.indexOf(root);
    let intervals = [0, 4, 7]; // major triad
    
    switch (type) {
      case 'm':
        intervals = [0, 3, 7]; // minor triad
        break;
      case '7':
        intervals = [0, 4, 7, 10]; // dominant 7th
        break;
      case 'maj7':
        intervals = [0, 4, 7, 11]; // major 7th
        break;
      case 'dim':
        intervals = [0, 3, 6]; // diminished
        break;
      case 'sus2':
        intervals = [0, 2, 7]; // suspended 2nd
        break;
      case 'add9':
        intervals = [0, 4, 7, 14]; // add 9th
        break;
    }
    
    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return this.musicTheory.keys[noteIndex];
    });
  }

  /**
   * 楽曲構成の作成
   */
  createSongStructure(params) {
    const complexity = params.complexity || 'moderate';
    
    switch (complexity) {
      case 'simple':
        return [
          { name: 'intro', duration: 8, intensity: 0.3 },
          { name: 'verse', duration: 16, intensity: 0.6 },
          { name: 'chorus', duration: 16, intensity: 0.8 },
          { name: 'outro', duration: 8, intensity: 0.4 }
        ];
      case 'complex':
        return [
          { name: 'intro', duration: 8, intensity: 0.3 },
          { name: 'verse1', duration: 16, intensity: 0.5 },
          { name: 'chorus1', duration: 16, intensity: 0.8 },
          { name: 'verse2', duration: 16, intensity: 0.6 },
          { name: 'bridge', duration: 8, intensity: 0.7 },
          { name: 'chorus2', duration: 16, intensity: 0.9 },
          { name: 'outro', duration: 8, intensity: 0.4 }
        ];
      default: // moderate
        return [
          { name: 'intro', duration: 8, intensity: 0.3 },
          { name: 'verse', duration: 16, intensity: 0.6 },
          { name: 'bridge', duration: 8, intensity: 0.7 },
          { name: 'chorus', duration: 16, intensity: 0.8 },
          { name: 'outro', duration: 8, intensity: 0.4 }
        ];
    }
  }

  /**
   * メロディ生成
   */
  generateMelody(chordProgression, key, scale, params) {
    const scaleNotes = this.getScaleNotes(key, scale);
    const melody = [];
    let lastNote = null;
    
    chordProgression.forEach((chord, chordIndex) => {
      const chordNotes = chord.notes;
      const notesPerChord = 4; // 各コードで4つの音符
      
      for (let i = 0; i < notesPerChord; i++) {
        let selectedNote;
        
        // メロディのスムーズな流れを作るための音程制限
        const availableNotes = [];
        
        // コードトーンを優先（80%）
        if (Math.random() < 0.8) {
          chordNotes.forEach(note => {
            availableNotes.push(note);
          });
        } else {
          // スケール音符を使用
          scaleNotes.forEach(note => {
            availableNotes.push(note);
          });
        }
        
        // 前の音符から大きく離れすぎないように制限
        if (lastNote) {
          const filteredNotes = availableNotes.filter(note => {
            const interval = this.getInterval(lastNote, note);
            return Math.abs(interval) <= 7; // 7度以内
          });
          
          if (filteredNotes.length > 0) {
            selectedNote = filteredNotes[Math.floor(Math.random() * filteredNotes.length)];
          } else {
            selectedNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
          }
        } else {
          selectedNote = availableNotes[Math.floor(Math.random() * availableNotes.length)];
        }
        
        // オクターブの決定（より自然な範囲）
        let octave = 4;
        if (i === 0 && chordIndex % 4 === 0) {
          octave = 5; // フレーズの始まりで高めに
        } else if (i === notesPerChord - 1) {
          octave = 4; // フレーズの終わりで安定
        } else {
          octave = 4 + (Math.random() < 0.2 ? (Math.random() < 0.5 ? -1 : 1) : 0);
        }
        
        // 音楽的なリズムパターン
        let duration = '8n';
        if (i === 0) {
          duration = Math.random() < 0.3 ? '4n' : '8n'; // 強拍を長めに
        } else if (i === notesPerChord - 1) {
          duration = Math.random() < 0.5 ? '4n' : '8n'; // フレーズ終わりを長めに
        }
        
        // 人間らしい揺らぎを追加
        const timing = (chordIndex * 4 + i) * 0.5; // 8分音符基準
        const humanTiming = timing + (Math.random() - 0.5) * 0.02; // マイクロタイミング
        const velocity = 0.6 + (Math.random() - 0.5) * 0.4; // ベロシティの揺らぎ
        
        const noteWithOctave = selectedNote + octave;
        
        melody.push({
          note: noteWithOctave,
          time: humanTiming + 's',
          duration: duration,
          velocity: velocity
        });
        
        lastNote = selectedNote;
      }
    });
    
    return melody;
  }

  /**
   * 2つの音符間の音程を計算
   */
  getInterval(note1, note2) {
    const noteMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    const value1 = noteMap[note1] || 0;
    const value2 = noteMap[note2] || 0;
    return value2 - value1;
  }

  /**
   * ベースライン生成
   */
  generateBassline(chordProgression, key, params) {
    const bassline = [];
    
    chordProgression.forEach((chord, chordIndex) => {
      // 各コードのルート音をベースとして使用
      const rootNote = chord.root + '2'; // 低いオクターブ
      const timing = chordIndex * 4; // 全音符
      
      bassline.push({
        note: rootNote,
        time: timing + 's',
        duration: '2n',
        velocity: 0.8
      });
      
      // リズミカルなベースラインのために追加の音符
      if (Math.random() < 0.6) {
        bassline.push({
          note: rootNote,
          time: (timing + 2) + 's',
          duration: '4n',
          velocity: 0.6
        });
      }
    });
    
    return bassline;
  }

  /**
   * スケール音の取得
   */
  getScaleNotes(key, scale) {
    const keyIndex = this.musicTheory.keys.indexOf(key);
    const scaleIntervals = this.musicTheory.scales[scale] || this.musicTheory.scales.major;
    
    return scaleIntervals.map(interval => {
      const noteIndex = (keyIndex + interval) % 12;
      return this.musicTheory.keys[noteIndex];
    });
  }

  /**
   * 作曲のスケジューリング
   */
  scheduleComposition(composition) {
    // 既存のイベントをクリア
    Tone.Transport.cancel();
    
    let currentTime = 0;
    
    composition.structure.forEach(section => {
      // セクションの設定に基づいて楽器をスケジュール
      this.scheduleSection(section, currentTime, composition);
      currentTime += section.duration;
    });
  }

  /**
   * セクションのスケジューリング
   */
  scheduleSection(section, startTime, composition) {
    const { melody, bassline, chordProgression, instruments } = composition;
    
    // メロディのスケジューリング
    if (instruments.includes('piano') || instruments.includes('synthesizer')) {
      melody.forEach(note => {
        const noteTime = startTime + parseFloat(note.time);
        this.scheduleMelodyNote(note, noteTime, section, instruments);
      });
    }
    
    // ベースラインのスケジューリング
    if (instruments.includes('bass')) {
      bassline.forEach(note => {
        const noteTime = startTime + parseFloat(note.time);
        this.scheduleBassNote(note, noteTime, section);
      });
    }
    
    // ハーモニーのスケジューリング
    if (instruments.includes('strings')) {
      chordProgression.forEach((chord, index) => {
        const chordTime = startTime + (index * 4);
        this.scheduleChord(chord, chordTime, section);
      });
    }
  }

  /**
   * メロディ音符のスケジューリング
   */
  scheduleMelodyNote(note, time, section, instruments) {
    const instrument = instruments.includes('piano') ? this.instruments.piano : this.instruments.synthesizer;
    const adjustedVelocity = note.velocity * section.intensity;
    
    Tone.Transport.schedule(() => {
      instrument.triggerAttackRelease(note.note, note.duration, undefined, adjustedVelocity);
    }, time + 's');
  }

  /**
   * ベース音符のスケジューリング
   */
  scheduleBassNote(note, time, section) {
    const adjustedVelocity = note.velocity * section.intensity;
    
    Tone.Transport.schedule(() => {
      this.instruments.bass.triggerAttackRelease(note.note, note.duration, undefined, adjustedVelocity);
    }, time + 's');
  }

  /**
   * コードのスケジューリング
   */
  scheduleChord(chord, time, section) {
    const adjustedVelocity = 0.6 * section.intensity;
    const chordNotes = chord.notes.map(note => note + '3'); // 適切なオクターブ
    
    Tone.Transport.schedule(() => {
      this.instruments.strings.triggerAttackRelease(chordNotes, '1n', undefined, adjustedVelocity);
    }, time + 's');
  }

  /**
   * 再生開始
   */
  play() {
    if (!this.currentComposition) {
      console.warn('No composition to play');
      return false;
    }
    
    if (this.isPlaying) {
      console.warn('Already playing');
      return false;
    }
    
    Tone.Transport.start();
    this.isPlaying = true;
    console.log('Playback started');
    return true;
  }

  /**
   * 再生停止
   */
  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    this.isPlaying = false;
    console.log('Playback stopped');
  }

  /**
   * 一時停止
   */
  pause() {
    Tone.Transport.pause();
    this.isPlaying = false;
    console.log('Playback paused');
  }

  /**
   * 録音・エクスポート
   */
  async exportToWAV() {
    if (!this.currentComposition) {
      throw new Error('No composition to export');
    }
    
    try {
      // Tone.jsのRecorderを使用
      const recorder = new Tone.Recorder();
      Tone.Destination.connect(recorder);
      
      // 録音開始
      recorder.start();
      
      // 楽曲再生
      this.play();
      
      // 楽曲終了まで待機
      await new Promise(resolve => {
        setTimeout(resolve, this.currentComposition.totalDuration * 1000);
      });
      
      // 再生停止
      this.stop();
      
      // 録音終了
      const recording = await recorder.stop();
      
      return recording;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }

  /**
   * クリーンアップ
   */
  cleanup() {
    this.stop();
    
    // 全ての楽器を破棄
    Object.values(this.instruments).forEach(instrument => {
      if (instrument.dispose) {
        instrument.dispose();
      }
    });
    
    this.instruments = {};
    this.currentComposition = null;
    this.isInitialized = false;
  }
}

// グローバルインスタンス
window.toneMusicEngine = new ToneMusicEngine();
