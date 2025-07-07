/**
 * 音楽生成コア機能 - 高度音響エンジン版
 * Web Audio API完全活用による高品質楽器音色生成
 */

class MusicGenerator {
  constructor() {
    this.audioContext = null;
    this.advancedEngine = null;
    this.isGenerating = false;
    this.currentMusic = null;
    this.isPlaying = false;
    this.activeNotes = [];
    this.scheduledNotes = [];
    this.isInitialized = false;
    
    // 非同期初期化を実行
    this.initialize();
  }

  async initialize() {
    try {
      await this.initializeAudioContext();
      this.isInitialized = true;
      console.log('MusicGenerator fully initialized');
    } catch (error) {
      console.error('MusicGenerator initialization failed:', error);
    }
  }

  async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // 高度音響エンジンの初期化
      this.advancedEngine = new AdvancedAudioEngine(this.audioContext);
      
      console.log('Advanced audio engine initialized successfully');
      console.log('Sample rate:', this.audioContext.sampleRate);
    } catch (error) {
      console.error('Advanced audio engine initialization failed:', error);
    }
  }

  async waitForInitialization() {
    const maxWait = 5000; // 最大5秒待機
    const startTime = Date.now();
    
    while (!this.isInitialized && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!this.isInitialized) {
      throw new Error('MusicGenerator initialization timeout');
    }
  }

  // ヘルパー関数群（先に定義）
  getTempoValue(tempo) {
    // テンポ範囲内でランダムな値を生成
    const tempoRanges = {
      'slow': { min: 60, max: 80 },
      'medium': { min: 100, max: 140 },
      'fast': { min: 130, max: 160 }
    };
    
    const range = tempoRanges[tempo] || tempoRanges['medium'];
    const randomTempo = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    
    console.log(`🥁 Selected tempo for ${tempo}: ${randomTempo} BPM`);
    return randomTempo;
  }

  getDurationValue(duration) {
    const durationMap = {
      'short': 15,
      'medium': 30,
      'long': 60
    };
    return durationMap[duration] || 30;
  }

  getKeyFromMood(mood) {
    // ムードごとに複数のキーを用意してランダム選択
    const keyOptions = {
      'calm': ['C', 'F', 'G', 'Am', 'Dm'],
      'energetic': ['G', 'D', 'E', 'A', 'Em'],
      'dramatic': ['Dm', 'Gm', 'Am', 'Em', 'Bm'],
      'peaceful': ['F', 'C', 'Bb', 'Dm', 'Gm'],
      'uplifting': ['D', 'A', 'E', 'G', 'C'],
      'melancholic': ['Am', 'Em', 'Dm', 'Gm', 'Fm']
    };
    
    const options = keyOptions[mood] || keyOptions['calm'];
    const selectedKey = options[Math.floor(Math.random() * options.length)];
    
    console.log(`🎵 Selected key for ${mood}: ${selectedKey}`);
    return selectedKey;
  }

  getScaleFromGenre(genre) {
    const scaleMap = {
      'classical': 'major',
      'jazz': 'major',
      'rock': 'minor',
      'electronic': 'minor',
      'ambient': 'major',
      'cinematic': 'minor'
    };
    return scaleMap[genre] || 'major';
  }

  getScaleNotes(key, scaleType) {
    const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const keyIndex = chromatic.indexOf(key.replace('m', ''));
    
    const scaleIntervals = {
      'major': [0, 2, 4, 5, 7, 9, 11],
      'minor': [0, 2, 3, 5, 7, 8, 10]
    };
    
    const intervals = scaleIntervals[scaleType] || scaleIntervals['major'];
    return intervals.map(interval => chromatic[(keyIndex + interval) % 12]);
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

  async generateMusic(settings) {
    if (this.isGenerating) return null;
    
    // 初期化が完了するまで待機
    if (!this.isInitialized) {
      console.log('Waiting for MusicGenerator initialization...');
      await this.waitForInitialization();
    }
    
    // エンジンの存在を確認
    if (!this.advancedEngine) {
      console.error('Advanced audio engine not available');
      throw new Error('Audio engine initialization failed');
    }
    
    this.isGenerating = true;
    console.log('🎵 Generating music with detailed settings:', {
      genre: settings.genre,
      mood: settings.mood,
      tempo: settings.tempo,
      duration: settings.duration,
      instruments: settings.instruments,
      complexity: settings.complexity,
      volume: settings.volume,
      loop: settings.loop
    });
    
    try {
      this.notifyProgress(0, 'Analyzing musical preferences...');
      
      // AudioContextの再開（必要に応じて）
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // 音楽パラメータ計算
      const params = this.calculateMusicParameters(settings);
      console.log('🎼 Calculated parameters with style differences:', {
        originalTempo: params.tempo,
        adjustedTempo: params.adjustedTempo,
        key: params.key,
        scale: params.scale,
        genre: params.genre,
        mood: params.mood,
        complexity: params.complexity,
        volume: params.volume,
        instruments: params.instruments
      });
      
      this.notifyProgress(25, `Composing ${params.genre} melody in ${params.key} ${params.scale} (${params.complexity})...`);
      
      // 高度なメロディ生成
      const melody = this.generateAdvancedMelody(params);
      console.log('🎹 Genre-specific melody generated:', {
        noteCount: melody.notes.length,
        instrument: melody.instrument,
        scale: melody.scale,
        firstNote: melody.notes[0] ? `${melody.notes[0].note}${melody.notes[0].octave}` : 'none',
        avgVelocity: melody.notes.reduce((sum, note) => sum + note.velocity, 0) / melody.notes.length
      });
      
      this.notifyProgress(50, `Creating ${params.genre} harmony with ${params.mood} characteristics...`);
      
      // 高度なハーモニー生成
      const harmony = this.generateAdvancedHarmony(params);
      console.log('🎺 Mood-specific harmony generated:', {
        chordCount: harmony.chords.length,
        instrument: harmony.instrument,
        progression: harmony.progression,
        firstChord: harmony.chords[0] ? harmony.chords[0].symbol : 'none'
      });
      
      this.notifyProgress(75, `Synthesizing with ${params.complexity} complexity and ${params.instruments.join(', ')} instruments...`);
      
      // 高品質音響合成
      const audioData = await this.synthesizeWithAdvancedEngine(melody, harmony, params);
      
      // 安全な最大振幅計算（スタックオーバーフロー対策）
      let maxAmplitude = 0;
      for (let i = 0; i < audioData.length; i++) {
        const abs = Math.abs(audioData[i]);
        if (abs > maxAmplitude) {
          maxAmplitude = abs;
        }
      }
      
      console.log('🔊 Audio synthesis complete:', {
        length: audioData.length,
        duration: audioData.length / this.audioContext.sampleRate,
        maxAmplitude: maxAmplitude,
        complexity: params.complexity,
        volume: params.volume
      });
      
      this.notifyProgress(100, `${params.genre}/${params.mood} music ready!`);
      
      const musicData = {
        audioData: audioData,
        waveform: this.generateWaveform(audioData),
        melody: melody,
        harmony: harmony,
        params: params,
        metadata: {
          duration: params.duration,
          tempo: params.adjustedTempo || params.tempo,
          key: params.key,
          genre: settings.genre || 'ambient',
          mood: settings.mood || 'calm',
          instruments: settings.instruments || ['piano'],
          complexity: settings.complexity || 'moderate',
          volume: settings.volume || 0.7,
          generatedAt: new Date().toISOString(),
          engine: 'AdvancedAudioEngine',
          quality: 'Professional',
          settingsHash: this.generateSettingsHash(settings)
        }
      };
      
      this.currentMusic = musicData;
      console.log('✅ Music generation complete with unique characteristics for:', settings.genre, settings.mood, settings.complexity);
      return musicData;
      
    } catch (error) {
      console.error('❌ High-quality music generation failed:', error);
      return this.generateFallbackMusic(settings);
    } finally {
      this.isGenerating = false;
    }
  }

  generateAdvancedMelody(params) {
    const melody = {
      notes: [],
      instrument: this.selectMelodyInstrument(params.instruments),
      scale: this.getScaleFromGenre(params.genre)
    };

    const scaleNotes = this.getScaleNotes(params.key, melody.scale);
    
    // 調整されたテンポを使用
    const actualTempo = params.adjustedTempo || params.tempo;
    const beatDuration = 60 / actualTempo; // 1拍の長さ（秒）
    const totalBeats = Math.floor(params.duration / beatDuration);
    
    console.log(`🎼 Generating melody for ${params.genre}/${params.mood}: ${totalBeats} beats, beat duration: ${beatDuration.toFixed(3)}s`);
    console.log(`🎵 Key: ${params.key}, Scale: ${melody.scale}, Instrument: ${melody.instrument}, Tempo: ${actualTempo}, Complexity: ${params.complexity}`);
    
    let currentTime = 0;
    let currentScaleIndex = 0; // ルート音から開始
    
    // ジャンル別の音楽的特徴を反映
    const genreCharacteristics = this.getGenreCharacteristics(params.genre);
    const moodCharacteristics = this.getMoodCharacteristics(params.mood);
    
    // 複雑さによる音楽的調整
    const complexityFactor = this.getComplexityFactor(params.complexity);
    
    // シンプルで音楽的なメロディを生成
    for (let beat = 0; beat < totalBeats; beat++) {
      // 4拍ごとに区切る（小節）
      const measurePosition = beat % 4;
      
      // ジャンル、ムード、複雑さに基づく音符の長さを決定
      let noteDuration = this.calculateGenreBasedDuration(beatDuration, measurePosition, genreCharacteristics);
      noteDuration *= complexityFactor.durationMultiplier;
      
      // スケール内の音符を音楽的に選択
      currentScaleIndex = this.selectMelodyNote(
        measurePosition, 
        currentScaleIndex, 
        scaleNotes.length, 
        genreCharacteristics,
        moodCharacteristics,
        complexityFactor
      );
      
      const note = scaleNotes[currentScaleIndex];
      const octave = this.selectMelodicOctave(note, params.genre, Math.floor(beat / 4), params.mood);
      const frequency = this.noteToFrequency(note, octave);
      
      // ムードに基づくベロシティを音楽的に設定
      let velocity = this.calculateMoodBasedVelocity(measurePosition, moodCharacteristics);
      velocity *= params.volume; // ボリューム設定を反映
      
      melody.notes.push({
        note: note,
        octave: octave,
        frequency: frequency,
        startTime: currentTime,
        duration: noteDuration,
        velocity: velocity,
        measurePosition: measurePosition,
        genre: params.genre,
        mood: params.mood,
        complexity: params.complexity
      });
      
      currentTime += noteDuration;
      
      // ジャンルと複雑さに基づく休符を時々挿入
      if (this.shouldInsertRest(measurePosition, genreCharacteristics, complexityFactor)) {
        currentTime += beatDuration * 0.5;
      }
    }

    console.log(`✅ Generated ${melody.notes.length} melody notes over ${currentTime.toFixed(2)}s`);
    return melody;
  }

  generateMelodicPhrases(params, totalNotes) {
    const phrases = [];
    const phraseLengths = this.getPhraseStructure(params.genre);
    
    let remainingNotes = totalNotes;
    
    phraseLengths.forEach(length => {
      if (remainingNotes <= 0) return;
      
      const phraseNotes = Math.min(length, remainingNotes);
      const phrase = this.createMelodicPhrase(phraseNotes, params);
      phrases.push(phrase);
      remainingNotes -= phraseNotes;
    });
    
    return phrases;
  }

  createMelodicPhrase(noteCount, params) {
    const phrase = { notes: [] };
    const baseDuration = 60 / params.tempo;
    
    for (let i = 0; i < noteCount; i++) {
      const position = i / noteCount;
      
      phrase.notes.push({
        duration: this.calculateNoteDuration(baseDuration, params, position),
        velocity: this.calculateNoteVelocity(params, position, i),
        expression: this.calculateNoteExpression(params, position)
      });
    }
    
    return phrase;
  }

  generateAdvancedHarmony(params) {
    const harmony = {
      chords: [],
      instrument: this.selectHarmonyInstrument(params.instruments),
      progression: this.selectAdvancedProgression(params)
    };

    // ジャンル・ムードに基づいたコード長を計算
    const genreChar = this.getGenreCharacteristics(params.genre);
    const moodChar = this.getMoodCharacteristics(params.mood);
    const baseChordDuration = (60 / (params.adjustedTempo || params.tempo)) * 4; // 4拍で1コード
    const chordDuration = baseChordDuration * (genreChar.rhythmComplexity > 0.8 ? 0.5 : 1.0);
    const totalChords = Math.ceil(params.duration / chordDuration);

    console.log(`🎺 Generating ${params.genre}/${params.mood} harmony: ${totalChords} chords, each ${chordDuration.toFixed(2)}s`);
    console.log(`🎵 Progression: ${harmony.progression.join(' - ')}, Instrument: ${harmony.instrument}`);

    for (let i = 0; i < totalChords; i++) {
      const chordSymbol = harmony.progression[i % harmony.progression.length];
      const chordNotes = this.chordToNotes(chordSymbol, params.key, params.genre);
      const chordFrequencies = this.calculateChordFrequencies(chordNotes, params, moodChar);
      
      // 確実に3音以上のコードにする
      if (chordFrequencies.length < 3) {
        // 不足している場合はオクターブ上の音を追加
        const baseFreq = chordFrequencies[0];
        for (let j = chordFrequencies.length; j < 3; j++) {
          chordFrequencies.push(baseFreq * Math.pow(2, j - chordFrequencies.length + 1));
        }
      }
      
      // 音楽的なタイミングでコードを配置
      const startTime = i * chordDuration;
      
      harmony.chords.push({
        symbol: chordSymbol,
        startTime: startTime,
        duration: chordDuration,
        notes: chordNotes,
        frequencies: chordFrequencies,
        voicing: this.selectChordVoicing(chordSymbol, params.genre),
        dynamics: this.calculateChordDynamics(i, totalChords, params, moodChar),
        genre: params.genre,
        mood: params.mood
      });
      
      console.log(`🎼 Chord ${i + 1}: ${chordSymbol} (${chordFrequencies.length} notes) @${startTime.toFixed(2)}s`);
    }

    console.log(`✅ Generated ${harmony.chords.length} rich harmony chords for ${params.genre}/${params.mood}`);
    return harmony;
  }

  async synthesizeWithAdvancedEngine(melody, harmony, params) {
    console.log('🎛️ Starting advanced synthesis...');
    
    // 事前にすべての音符をスケジュール
    this.scheduledNotes = [];
    
    // メロディノートのスケジュール（重複を避ける）
    if (melody && melody.notes && melody.notes.length > 0) {
      console.log(`🎹 Scheduling ${melody.notes.length} melody notes...`);
      melody.notes.forEach(note => {
        this.scheduledNotes.push({
          type: 'melody',
          instrument: melody.instrument,
          frequency: note.frequency,
          startTime: note.startTime,
          duration: note.duration,
          velocity: note.velocity * 0.9, // メロディを明瞭に
          noteInfo: `${note.note}${note.octave}`,
          genre: note.genre || params.genre,
          mood: note.mood || params.mood
        });
      });
    }
    
    // ハーモニーノートのスケジュール（アルペジオを削除してブロックコードに）
    if (harmony && harmony.chords && harmony.chords.length > 0) {
      console.log(`🎺 Scheduling ${harmony.chords.length} harmony chords...`);
      harmony.chords.forEach(chord => {
        // 同時にコード音を鳴らす（アルペジオなし）
        chord.frequencies.forEach((frequency, index) => {
          this.scheduledNotes.push({
            type: 'harmony',
            instrument: harmony.instrument,
            frequency: frequency,
            startTime: chord.startTime,
            duration: chord.duration,
            velocity: chord.dynamics * 0.8, // ハーモニーをさらに明瞭に
            chordInfo: `${chord.symbol}[${index}]`,
            genre: params.genre,
            mood: params.mood
          });
        });
      });
    }
    
    // ドラムトラックは一旦無効化（音楽的でないため）
    // if (params.instruments.includes('drums')) {
    //   console.log('🥁 Scheduling drum track...');
    //   this.scheduleAdvancedDrums(params);
    // }
    
    // 音符を時間順にソート
    this.scheduledNotes.sort((a, b) => a.startTime - b.startTime);
    
    console.log(`📅 Total scheduled notes: ${this.scheduledNotes.length}`);
    console.log(`📅 First 5 notes:`, this.scheduledNotes.slice(0, 5).map(n => 
      `${n.type}:${n.noteInfo || n.chordInfo} @${n.startTime.toFixed(2)}s`
    ));
    
    // 高品質音響合成の実行（バッファー生成）
    return await this.renderToBuffer(params.duration);
  }

  async renderToBuffer(duration) {
    console.log('🎚️ Rendering to high-quality buffer...');
    
    // リアルタイム合成でオーディオデータを生成
    const sampleRate = this.audioContext.sampleRate;
    const samples = Math.floor(sampleRate * duration);
    const audioData = new Float32Array(samples);
    
    console.log(`🎼 Rendering ${this.scheduledNotes.length} notes over ${duration} seconds (${samples} samples)...`);
    
    // スタックオーバーフローを防ぐため、バッチ処理で音符を処理
    const batchSize = 10; // 一度に処理する音符数
    let processedNotes = 0;
    
    for (let batchStart = 0; batchStart < this.scheduledNotes.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, this.scheduledNotes.length);
      const noteBatch = this.scheduledNotes.slice(batchStart, batchEnd);
      
      // バッチ内の各音符を処理
      for (const note of noteBatch) {
        const noteStartSample = Math.floor(note.startTime * sampleRate);
        const noteDurationSamples = Math.floor(note.duration * sampleRate);
        const noteEndSample = Math.min(samples, noteStartSample + noteDurationSamples);
        
        // 各音符のサンプルを効率的に生成
        this.renderNoteToBuffer(note, audioData, noteStartSample, noteEndSample, sampleRate);
        processedNotes++;
      }
      
      // 非同期処理を挟んでスタックをクリア
      if (batchStart % 50 === 0) { // 50音符ごとにyield
        await new Promise(resolve => setTimeout(resolve, 0));
        console.log(`🎵 Processed ${processedNotes}/${this.scheduledNotes.length} notes...`);
      }
    }
    
    // マスターボリューム調整とクリッピング防止（改善版）
    let maxAmplitude = 0;
    for (let i = 0; i < samples; i++) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(audioData[i]));
    }
    
    // より良い正規化：ヘッドルームを確保しつつ音量を最大化
    const targetLevel = 0.85; // より高いターゲットレベル
    const normalizationFactor = maxAmplitude > 0.1 ? targetLevel / maxAmplitude : 1.0;
    
    for (let i = 0; i < samples; i++) {
      audioData[i] *= normalizationFactor;
    }
    
    console.log(`✅ High-quality rendering complete (original max: ${maxAmplitude.toFixed(3)}, normalized: ${targetLevel})`);
    return audioData;
  }

  // 個別音符レンダリング（スタックオーバーフロー対策）
  renderNoteToBuffer(note, audioData, noteStartSample, noteEndSample, sampleRate) {
    for (let i = noteStartSample; i < noteEndSample; i++) {
      if (i >= 0 && i < audioData.length) {
        const noteTime = (i - noteStartSample) / sampleRate;
        const normalizedTime = noteTime / note.duration;
        
        // 楽器別の音色合成（ジャンル・ムード対応）
        let noteSample = 0;
        
        if (note.instrument === 'piano') {
          noteSample = this.synthesizePiano(note.frequency, noteTime, note.velocity, note.genre, note.mood);
        } else if (note.instrument === 'guitar') {
          noteSample = this.synthesizeGuitar(note.frequency, noteTime, note.velocity, note.genre, note.mood);
        } else if (note.instrument === 'strings') {
          noteSample = this.synthesizeStrings(note.frequency, noteTime, note.velocity, note.genre, note.mood);
        } else if (note.instrument === 'synthesizer') {
          noteSample = this.synthesizeSynth(note.frequency, noteTime, note.velocity, note.genre, note.mood);
        } else if (note.instrument === 'bass') {
          noteSample = this.synthesizeBass(note.frequency, noteTime, note.velocity, note.genre, note.mood);
        } else {
          // デフォルト合成
          noteSample = this.synthesizeDefault(note.frequency, noteTime, note.velocity);
        }
        
        // エンベロープ適用
        const envelope = this.calculateEnvelope(normalizedTime, note.instrument);
        const finalSample = noteSample * envelope;
        
        // サンプルを加算（複数の音符が重なる場合）
        audioData[i] += finalSample;
      }
    }
  }

  // 楽器別合成メソッド群（ジャンル・ムード対応版）
  synthesizePiano(frequency, time, velocity, genre = 'classical', mood = 'calm') {
    // ピアノの倍音構造をシミュレート（強化版）
    let sample = 0;
    
    // ジャンル別の倍音特性（より明瞭に）
    let harmonics;
    if (genre === 'jazz') {
      harmonics = [1, 0.8, 0.5, 0.3, 0.2, 0.1]; // ジャズピアノ（強化）
    } else if (genre === 'rock') {
      harmonics = [1, 0.9, 0.6, 0.4, 0.2]; // ロックピアノ（より明瞭）
    } else if (genre === 'electronic') {
      harmonics = [1, 0.9, 0.7, 0.5, 0.3, 0.2]; // 電子的で鋭い（強化）
    } else {
      harmonics = [1, 0.7, 0.4, 0.25, 0.15, 0.1]; // クラシック標準（強化）
    }
    
    for (let i = 0; i < harmonics.length; i++) {
      const harmonicFreq = frequency * (i + 1);
      const amplitude = harmonics[i] * velocity * 1.2; // 全体的に音量アップ
      sample += Math.sin(2 * Math.PI * harmonicFreq * time) * amplitude;
    }
    
    // ムード別の減衰特性（より持続的に）
    let decayRate = 1.5; // より持続的
    if (mood === 'dramatic') decayRate = 1.0; // より持続的
    if (mood === 'energetic') decayRate = 2.0; // やや短く、パンチのある音
    if (mood === 'peaceful') decayRate = 0.8; // ゆっくりとした減衰
    
    const decay = Math.exp(-time * decayRate);
    return sample * decay;
  }

  synthesizeGuitar(frequency, time, velocity, genre = 'rock', mood = 'energetic') {
    // ギターの弦の振動をシミュレート
    let sample = 0;
    
    // ジャンル別の音色特性
    let harmonics, noiseLevel;
    if (genre === 'classical') {
      harmonics = [1, 0.6, 0.4, 0.3, 0.2, 0.1];
      noiseLevel = 0.01; // クリーンな音
    } else if (genre === 'rock') {
      harmonics = [1, 0.8, 0.6, 0.4, 0.3, 0.2];
      noiseLevel = 0.05; // ディストーション効果
    } else if (genre === 'jazz') {
      harmonics = [1, 0.7, 0.5, 0.3, 0.2, 0.15];
      noiseLevel = 0.02; // 温かい音色
    } else {
      harmonics = [1, 0.8, 0.6, 0.4, 0.3, 0.2];
      noiseLevel = 0.03;
    }
    
    for (let i = 0; i < harmonics.length; i++) {
      const harmonicFreq = frequency * (i + 1);
      const amplitude = harmonics[i] * velocity;
      sample += Math.sin(2 * Math.PI * harmonicFreq * time) * amplitude;
      
      // ムード別ノイズ調整
      const moodNoiseMultiplier = mood === 'energetic' ? 2 : mood === 'calm' ? 0.5 : 1;
      sample += (Math.random() - 0.5) * noiseLevel * amplitude * moodNoiseMultiplier;
    }
    
    const decay = Math.exp(-time * 1.5);
    return sample * decay;
  }

  synthesizeStrings(frequency, time, velocity, genre = 'classical', mood = 'dramatic') {
    // ストリングスの豊かな倍音
    let sample = 0;
    
    // ジャンル別の倍音構成（より明瞭に）
    let harmonics;
    if (genre === 'cinematic') {
      harmonics = [1, 0.9, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25]; // 映画的な豊かさ
    } else if (genre === 'ambient') {
      harmonics = [1, 0.8, 0.5, 0.4, 0.3, 0.2, 0.15]; // 大気的だがより明瞭
    } else {
      harmonics = [1, 0.85, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2]; // クラシック標準（強化）
    }
    
    for (let i = 0; i < harmonics.length; i++) {
      const harmonicFreq = frequency * (i + 1);
      const amplitude = harmonics[i] * velocity;
      
      // ムード別の位相変調
      let phaseModulation = 0;
      if (mood === 'dramatic') {
        phaseModulation = Math.sin(2 * Math.PI * 3 * time) * 0.1; // ビブラート効果
      }
      
      sample += Math.sin(2 * Math.PI * harmonicFreq * time + phaseModulation) * amplitude;
    }
    
    // ムード別の持続特性（より持続的に）
    let decayRate = 0.6; // より長い持続
    if (mood === 'peaceful') decayRate = 0.4; // さらに長い持続
    if (mood === 'energetic') decayRate = 1.0; // やや短い持続
    
    const decay = Math.exp(-time * decayRate);
    return sample * decay;
  }

  synthesizeSynth(frequency, time, velocity, genre = 'electronic', mood = 'energetic') {
    // シンセサイザーのリッチな音色（改善版）
    let sample = 0;
    
    // ジャンル別の波形選択（音量強化）
    if (genre === 'electronic') {
      // 複数オシレーターのデチューン（強化）
      sample += Math.sin(2 * Math.PI * frequency * time) * 0.8; // メイン音量アップ
      sample += Math.sin(2 * Math.PI * frequency * 1.01 * time) * 0.4; // デチューン強化
      sample += Math.sin(2 * Math.PI * frequency * 2 * time) * 0.4; // 倍音強化
      sample += this.generateSquareWave(frequency, time) * 0.3; // 矩形波強化
    } else if (genre === 'ambient') {
      // パッド系の音色（強化）
      sample += Math.sin(2 * Math.PI * frequency * time) * 0.9; // メイン強化
      sample += Math.sin(2 * Math.PI * frequency * 0.5 * time) * 0.4; // サブオシレーター強化
      sample += Math.sin(2 * Math.PI * frequency * 3 * time) * 0.2; // 倍音追加
    } else {
      // 標準シンセ（強化）
      sample += Math.sin(2 * Math.PI * frequency * time) * 0.8; // メイン強化
      sample += Math.sin(2 * Math.PI * frequency * 2 * time) * 0.4; // 倍音強化
      sample += Math.sin(2 * Math.PI * frequency * 3 * time) * 0.2; // 高次倍音強化
    }
    
    // ムード別フィルター効果（より明瞭に）
    let filterEffect = 1;
    if (mood === 'dramatic') {
      filterEffect = 0.7 + 0.3 * Math.sin(2 * Math.PI * 2 * time); // オートフィルター（改良）
    } else if (mood === 'calm') {
      filterEffect = 0.8; // ローパスフィルター効果（改良）
    }
    
    sample *= filterEffect;
    
    const decay = Math.exp(-time * 1.0); // より持続的
    return sample * decay * velocity * 1.3; // 全体音量アップ
  }

  synthesizeBass(frequency, time, velocity, genre = 'rock', mood = 'energetic') {
    // ベースの低音強化
    let sample = 0;
    
    // ジャンル別の低音特性
    if (genre === 'jazz') {
      // アップライトベース風
      sample += Math.sin(2 * Math.PI * frequency * time) * 0.8;
      sample += Math.sin(2 * Math.PI * frequency * 2 * time) * 0.2;
      sample += (Math.random() - 0.5) * 0.05; // フィンガーノイズ
    } else if (genre === 'electronic') {
      // 電子ベース
      sample += Math.sin(2 * Math.PI * frequency * time) * 0.9;
      sample += this.generateSquareWave(frequency * 0.5, time) * 0.4; // サブベース
      sample += Math.sin(2 * Math.PI * frequency * 3 * time) * 0.1;
    } else {
      // エレキベース
      sample += Math.sin(2 * Math.PI * frequency * time) * 0.8;
      sample += Math.sin(2 * Math.PI * frequency * 2 * time) * 0.2;
      sample += Math.sin(2 * Math.PI * frequency * 0.5 * time) * 0.3; // サブベース
    }
    
    // ムード別アタック調整
    let attackEnvelope = 1;
    if (mood === 'energetic') {
      attackEnvelope = Math.min(1, time * 50); // シャープなアタック
    } else if (mood === 'calm') {
      attackEnvelope = Math.min(1, time * 10); // ソフトなアタック
    }
    
    const decay = Math.exp(-time * 1.0);
    return sample * decay * velocity * attackEnvelope;
  }

  // 矩形波生成ヘルパー
  generateSquareWave(frequency, time) {
    return Math.sign(Math.sin(2 * Math.PI * frequency * time));
  }

  synthesizeDrum(drumType, time, velocity) {
    let sample = 0;
    
    if (drumType === 'kick') {
      // キックドラム：低音ノイズ + 短いトーン
      const tone = Math.sin(2 * Math.PI * 60 * time);
      const noise = (Math.random() - 0.5) * 0.5;
      const env = Math.exp(-time * 20);
      sample = (tone * 0.8 + noise * 0.2) * env;
    } else if (drumType === 'snare') {
      // スネアドラム：ノイズ + 200Hzのトーン
      const tone = Math.sin(2 * Math.PI * 200 * time);
      const noise = (Math.random() - 0.5);
      const env = Math.exp(-time * 15);
      sample = (tone * 0.3 + noise * 0.7) * env;
    } else if (drumType === 'hihat') {
      // ハイハット：高周波ノイズ
      const noise = (Math.random() - 0.5);
      const filter = Math.sin(2 * Math.PI * 8000 * time);
      const env = Math.exp(-time * 30);
      sample = noise * filter * env * 0.3;
    }
    
    return sample * velocity;
  }

  synthesizeDefault(frequency, time, velocity) {
    // デフォルト合成（基本的な正弦波）
    const sample = Math.sin(2 * Math.PI * frequency * time);
    const decay = Math.exp(-time * 1.5);
    return sample * decay * velocity;
  }

  calculateEnvelope(normalizedTime, instrument) {
    // ADSR エンベロープ
    const instrumentEnvelopes = {
      'piano': { attack: 0.01, decay: 0.3, sustain: 0.7, release: 0.7 },
      'guitar': { attack: 0.02, decay: 0.2, sustain: 0.8, release: 0.8 },
      'strings': { attack: 0.1, decay: 0.1, sustain: 0.9, release: 0.9 },
      'synthesizer': { attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.3 },
      'bass': { attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.5 }
    };
    
    const envelope = instrumentEnvelopes[instrument] || instrumentEnvelopes['piano'];
    
    if (normalizedTime < envelope.attack) {
      // アタック段階
      return normalizedTime / envelope.attack;
    } else if (normalizedTime < envelope.attack + envelope.decay) {
      // ディケイ段階
      const decayTime = (normalizedTime - envelope.attack) / envelope.decay;
      return 1 - (1 - envelope.sustain) * decayTime;
    } else if (normalizedTime < 1 - envelope.release) {
      // サステイン段階
      return envelope.sustain;
    } else {
      // リリース段階
      const releaseTime = (normalizedTime - (1 - envelope.release)) / envelope.release;
      return envelope.sustain * (1 - releaseTime);
    }
  }

  // 高度な楽器選択とパラメータ計算
  calculateMusicParameters(settings) {
    console.log('Calculating music parameters from settings:', settings);
    
    const params = {
      tempo: this.getTempoValue(settings.tempo),
      duration: this.getDurationValue(settings.duration),
      key: this.getKeyFromMood(settings.mood),
      scale: this.getScaleFromGenre(settings.genre),
      complexity: settings.complexity || 'moderate',
      instruments: settings.instruments || ['piano', 'strings'],
      loop: settings.loop || false,
      mood: settings.mood || 'calm',
      genre: settings.genre || 'ambient',
      volume: settings.volume || 0.7,
      harmony: settings.harmony || 'consonant',
      dynamics: settings.dynamics || 'balanced'
    };
    
    // ムードとジャンルの特性を考慮したテンポ調整
    const moodCharacteristics = this.getMoodCharacteristics(params.mood);
    params.adjustedTempo = Math.round(params.tempo * moodCharacteristics.tempoModifier);
    
    console.log('Music parameters calculated:', params);
    return params;
  }

  selectMelodyInstrument(instruments) {
    console.log('Selecting melody instrument from:', instruments);
    
    // ランダム性を追加して同じ楽器配列でも異なる楽器を選択
    const shuffledInstruments = [...instruments].sort(() => Math.random() - 0.5);
    
    const melodyPriority = ['piano', 'guitar', 'synthesizer', 'strings', 'electronic'];
    
    // 30%の確率で完全にランダムに選択
    if (Math.random() < 0.3 && shuffledInstruments.length > 0) {
      const randomChoice = shuffledInstruments[Math.floor(Math.random() * shuffledInstruments.length)];
      console.log('Random melody instrument selected:', randomChoice);
      return randomChoice;
    }
    
    // 優先順位から選択（ランダム要素付き）
    const availablePriority = melodyPriority.filter(inst => instruments.includes(inst));
    if (availablePriority.length > 0) {
      // 上位2つから確率的に選択
      const topChoices = availablePriority.slice(0, Math.min(2, availablePriority.length));
      const selected = topChoices[Math.floor(Math.random() * topChoices.length)];
      console.log('Priority-based melody instrument selected:', selected);
      return selected;
    }
    
    const selected = shuffledInstruments[0] || 'piano';
    console.log('Default melody instrument:', selected);
    return selected;
  }

  selectHarmonyInstrument(instruments) {
    console.log('Selecting harmony instrument from:', instruments);
    
    // ランダム性を追加
    const shuffledInstruments = [...instruments].sort(() => Math.random() - 0.5);
    
    // ハーモニーには異なる楽器を選ぶ優先順位
    const harmonyPriority = ['strings', 'synthesizer', 'piano', 'guitar'];
    
    // 40%の確率で完全にランダムに選択
    if (Math.random() < 0.4 && shuffledInstruments.length > 0) {
      const randomChoice = shuffledInstruments[Math.floor(Math.random() * shuffledInstruments.length)];
      console.log('Random harmony instrument selected:', randomChoice);
      return randomChoice;
    }
    
    // 優先順位から選択（ランダム要素付き）
    const availablePriority = harmonyPriority.filter(inst => instruments.includes(inst));
    if (availablePriority.length > 0) {
      // 上位3つから確率的に選択
      const topChoices = availablePriority.slice(0, Math.min(3, availablePriority.length));
      const selected = topChoices[Math.floor(Math.random() * topChoices.length)];
      console.log('Priority-based harmony instrument selected:', selected);
      return selected;
    }
    
    const selected = shuffledInstruments[0] || 'strings';
    console.log('Default harmony instrument:', selected);
    return selected;
  }

  selectMelodicOctave(note, genre, phraseIndex, mood = 'calm') {
    const baseOctave = 4;
    
    // ジャンルによる基本オクターブ調整
    const genreOctaveMap = {
      'classical': 4,
      'jazz': 4,
      'rock': 4,
      'electronic': 5,
      'ambient': 4,
      'cinematic': 4
    };
    
    // ムードによる調整
    const moodOctaveShift = {
      'calm': 0,
      'energetic': 1,
      'dramatic': 0,
      'peaceful': -1,
      'uplifting': 1,
      'melancholic': -1
    };
    
    const genreOctave = genreOctaveMap[genre] || baseOctave;
    const moodShift = moodOctaveShift[mood] || 0;
    
    return genreOctave + moodShift;
  }

  selectAdvancedProgression(params) {
    // 複数のコード進行パターンを用意し、ランダムに選択
    const allProgressions = {
      'classical': [
        ['I', 'vi', 'IV', 'V'],   // Canon progression
        ['I', 'V', 'vi', 'IV'],   // Popular progression  
        ['I', 'IV', 'V', 'I'],    // Simple classical
        ['vi', 'IV', 'I', 'V'],   // vi-IV-I-V
        ['I', 'ii', 'V', 'I']     // ii-V-I classical
      ],
      'jazz': [
        ['I', 'vi', 'ii', 'V'],   // ii-V-I progression
        ['I', 'VI', 'ii', 'V'],   // Extended ii-V-I
        ['I', 'iii', 'vi', 'ii'], // Circle of fifths
        ['vi', 'ii', 'V', 'I'],   // Reverse ii-V-I
        ['I', 'IV', 'vii', 'iii'] // Jazz alternative
      ],
      'rock': [
        ['I', 'V', 'vi', 'IV'],   // Popular progression
        ['vi', 'IV', 'I', 'V'],   // vi-IV-I-V
        ['I', 'bVII', 'IV', 'I'], // Rock power chords
        ['i', 'VI', 'VII', 'i'],  // Minor rock
        ['I', 'iii', 'IV', 'V']   // Ascending rock
      ],
      'electronic': [
        ['vi', 'IV', 'I', 'V'],   // vi-IV-I-V
        ['I', 'V', 'vi', 'IV'],   // Popular progression
        ['vi', 'ii', 'IV', 'V'],  // Electronic variant
        ['I', 'bVII', 'vi', 'V'], // Electronic minor
        ['vi', 'V', 'IV', 'iii']  // Descending electronic
      ],
      'ambient': [
        ['I', 'V', 'vi', 'IV'],   // Calm progression
        ['vi', 'IV', 'I', 'V'],   // Peaceful flow
        ['I', 'iii', 'vi', 'IV'], // Soft ambient
        ['vi', 'ii', 'V', 'I'],   // Dreamy ambient
        ['I', 'IV', 'vi', 'V']    // Floating ambient
      ],
      'cinematic': [
        ['i', 'VI', 'iv', 'V'],   // Dramatic minor
        ['i', 'VII', 'VI', 'VII'], // Epic cinematic
        ['i', 'v', 'VI', 'iv'],   // Dark cinematic
        ['VI', 'VII', 'i', 'v'],  // Rising tension
        ['i', 'III', 'VI', 'iv']  // Orchestral minor
      ]
    };

    const genreProgressions = allProgressions[params.genre] || allProgressions['ambient'];
    
    // ランダムに進行を選択
    const selectedProgression = genreProgressions[Math.floor(Math.random() * genreProgressions.length)];
    
    console.log(`🎼 Selected progression for ${params.genre}: ${selectedProgression.join(' - ')}`);
    return selectedProgression;
  }

  chordToNotes(chordSymbol, key, genre) {
    const scaleNotes = this.getScaleNotes(key, this.getScaleFromGenre(genre));
    
    // コード構成音の基本パターン
    const chordPatterns = {
      'I': [0, 2, 4],           // C E G
      'ii': [1, 3, 5],          // D F A
      'iii': [2, 4, 6],         // E G B
      'IV': [3, 5, 0],          // F A C
      'V': [4, 6, 1],           // G B D
      'vi': [5, 0, 2],          // A C E
      'vii': [6, 1, 3],         // B D F
      'i': [0, 2, 4],           // マイナーキーでの i
      'VII': [6, 1, 3],         // フラット7度
      'VI': [5, 0, 2],          // フラット6度
      'IMaj7': [0, 2, 4, 6],    // ジャズコード
      'vi7': [5, 0, 2, 4],
      'ii7': [1, 3, 5, 0],
      'V7': [4, 6, 1, 3],
      'VIMaj7': [5, 0, 2, 4],
      'im7': [0, 2, 4, 6],
      'iv7': [3, 5, 0, 2],
      'VII7': [6, 1, 3, 5],
      'III7': [2, 4, 6, 1],
      'ii7b5': [1, 3, 5, 0]
    };
    
    const pattern = chordPatterns[chordSymbol] || chordPatterns['I'];
    return pattern.map(index => scaleNotes[index % scaleNotes.length]);
  }

  calculateChordDuration(params) {
    const baseDuration = 60 / params.tempo * 4; // 4拍分
    return baseDuration;
  }

  calculateChordFrequencies(chordNotes, params, moodChar = null) {
    let baseOctave = 3; // ハーモニーは低めのオクターブ
    
    // ムードに基づくオクターブ調整
    if (moodChar && moodChar.octaveShift) {
      baseOctave += moodChar.octaveShift;
    }
    
    return chordNotes.map((note, index) => {
      const octave = baseOctave + Math.floor(index / 3);
      return this.noteToFrequency(note, octave);
    });
  }

  selectChordVoicing(chordSymbol, genre) {
    // ジャンルに応じたボイシング
    const voicings = {
      'jazz': 'extended', // 9th, 11th, 13thを含む
      'classical': 'close',
      'rock': 'open',
      'electronic': 'sparse',
      'ambient': 'wide',
      'cinematic': 'orchestral'
    };
    
    return voicings[genre] || 'close';
  }

  calculateChordDynamics(chordIndex, totalChords, params, moodChar = null) {
    const position = chordIndex / totalChords;
    
    // ムードに基づく基本ダイナミクス
    let baseDynamics = 0.7;
    if (moodChar) {
      baseDynamics = moodChar.velocityBase;
    }
    
    // 楽曲構造による動的変化
    if (position < 0.25) return baseDynamics * 0.8; // 静かな始まり
    if (position < 0.75) return baseDynamics * 1.1; // 盛り上がり
    return baseDynamics * 0.9; // 静かな終わり
  }

  scheduleAdvancedDrums(params) {
    const beatDuration = 60 / params.tempo;
    const totalBeats = Math.floor(params.duration / beatDuration);
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const beatTime = beat * beatDuration;
      
      // キック
      if (beat % 4 === 0) {
        this.scheduledNotes.push({
          type: 'drum',
          instrument: 'kick',
          frequency: 60,
          startTime: beatTime,
          duration: 0.1,
          velocity: 0.8
        });
      }
      
      // スネア
      if (beat % 4 === 2) {
        this.scheduledNotes.push({
          type: 'drum',
          instrument: 'snare',
          frequency: 200,
          startTime: beatTime,
          duration: 0.1,
          velocity: 0.7
        });
      }
      
      // ハイハット
      if (params.genre === 'electronic' && beat % 2 === 1) {
        this.scheduledNotes.push({
          type: 'drum',
          instrument: 'hihat',
          frequency: 8000,
          startTime: beatTime,
          duration: 0.05,
          velocity: 0.4
        });
      }
    }
  }

  // 高品質再生機能
  async playMusic() {
    if (!this.currentMusic || !this.currentMusic.audioData) {
      console.error('❌ No music data available for playback');
      return false;
    }

    if (this.isPlaying) {
      console.log('⏸️ Music already playing, stopping first...');
      this.stopMusic();
    }

    try {
      // AudioContextの再開
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      console.log('🎵 Starting high-quality playback...');
      
      // AudioBufferを作成
      const audioBuffer = this.audioContext.createBuffer(
        1, // モノラル
        this.currentMusic.audioData.length,
        this.audioContext.sampleRate
      );
      
      const channelData = audioBuffer.getChannelData(0);
      channelData.set(this.currentMusic.audioData);
      
      // AudioBufferSourceNodeを作成
      this.bufferSource = this.audioContext.createBufferSource();
      this.bufferSource.buffer = audioBuffer;
      
      // 高品質再生チェーンに接続
      this.bufferSource.connect(this.advancedEngine.masterGain);
      
      // 再生開始
      this.bufferSource.start(0);
      this.isPlaying = true;
      
      // 再生終了のリスナー
      this.bufferSource.onended = () => {
        this.isPlaying = false;
        console.log('🎵 Playback completed');
        this.notifyPlaybackState('stopped');
      };
      
      console.log('✅ High-quality playback started');
      this.notifyPlaybackState('playing');
      return true;
      
    } catch (error) {
      console.error('❌ High-quality playback failed:', error);
      this.isPlaying = false;
      this.notifyPlaybackState('error');
      return false;
    }
  }

  stopMusic() {
    if (this.bufferSource) {
      try {
        this.bufferSource.stop();
        this.bufferSource.disconnect();
        this.bufferSource = null;
      } catch (error) {
        console.warn('⚠️ Error stopping playback:', error);
      }
    }
    
    this.isPlaying = false;
    console.log('⏹️ Playback stopped');
    this.notifyPlaybackState('stopped');
  }

  pauseMusic() {
    // Web Audio APIにはpauseがないため、stopを使用
    this.stopMusic();
  }

  // イベント通知
  notifyProgress(progress, message) {
    const event = new CustomEvent('musicGenerationProgress', {
      detail: { progress, message }
    });
    document.dispatchEvent(event);
  }

  notifyPlaybackState(state) {
    const event = new CustomEvent('musicPlaybackState', {
      detail: { state, isPlaying: this.isPlaying }
    });
    document.dispatchEvent(event);
  }

  // 波形生成
  generateWaveform(audioData) {
    const waveformLength = 200;
    const step = Math.floor(audioData.length / waveformLength);
    const waveform = [];
    
    for (let i = 0; i < waveformLength; i++) {
      const sampleIndex = i * step;
      if (sampleIndex < audioData.length) {
        waveform.push(audioData[sampleIndex]);
      } else {
        waveform.push(0);
      }
    }
    
    return waveform;
  }

  // WAVエクスポート
  exportToWav() {
    if (!this.currentMusic || !this.currentMusic.audioData) {
      console.error('❌ No music data available for export');
      return null;
    }

    console.log('💾 Exporting high-quality WAV...');
    
    const audioData = this.currentMusic.audioData;
    const sampleRate = this.audioContext.sampleRate;
    
    // WAVヘッダー生成
    const arrayBuffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAVヘッダーの書き込み
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + audioData.length * 2, true);
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
    view.setUint32(40, audioData.length * 2, true);
    
    // オーディオデータの変換（Float32 → Int16）
    let offset = 44;
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    console.log('✅ High-quality WAV export complete');
    return arrayBuffer;
  }

  // フォールバック音楽生成
  generateFallbackMusic(settings) {
    console.log('⚠️ Generating fallback music...');
    
    const duration = this.getDurationValue(settings.duration);
    const sampleRate = this.audioContext ? this.audioContext.sampleRate : 44100;
    const samples = Math.floor(sampleRate * duration);
    const audioData = new Float32Array(samples);
    
    // 高品質フォールバック音（複数倍音）
    for (let i = 0; i < samples; i++) {
      const time = i / sampleRate;
      const envelope = Math.exp(-time * 0.8);
      
      let sample = 0;
      sample += Math.sin(2 * Math.PI * 440 * time) * 0.5;      // 基音
      sample += Math.sin(2 * Math.PI * 880 * time) * 0.25;     // 2倍音
      sample += Math.sin(2 * Math.PI * 1320 * time) * 0.125;   // 3倍音
      
      audioData[i] = sample * envelope * 0.3;
    }

    return {
      audioData: audioData,
      waveform: this.generateWaveform(audioData),
      melody: { notes: [], instrument: 'piano' },
      harmony: { chords: [] },
      params: { duration, tempo: 120, key: 'C' },
      metadata: {
        duration: duration,
        tempo: 120,
        key: 'C',
        genre: settings.genre || 'ambient',
        mood: settings.mood || 'calm',
        instruments: settings.instruments || ['piano'],
        generatedAt: new Date().toISOString(),
        engine: 'Fallback',
        quality: 'Basic'
      }
    };
  }

  // クリーンアップ
  cleanup() {
    this.stopMusic();
    
    if (this.advancedEngine) {
      this.advancedEngine.cleanup();
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.scheduledNotes = [];
    this.activeNotes = [];
  }

  // 複雑さ係数の取得
  getComplexityFactor(complexity) {
    const factors = {
      'simple': {
        durationMultiplier: 1.2,    // より長い音符
        noteVariation: 0.3,         // 少ない音程変化
        rhythmComplexity: 0.5,      // シンプルなリズム
        restProbability: 0.1        // 少ない休符
      },
      'moderate': {
        durationMultiplier: 1.0,    // 標準の音符長
        noteVariation: 0.6,         // 適度な音程変化
        rhythmComplexity: 0.7,      // 標準的なリズム
        restProbability: 0.15       // 適度な休符
      },
      'complex': {
        durationMultiplier: 0.8,    // より短い音符
        noteVariation: 0.9,         // 多くの音程変化
        rhythmComplexity: 0.9,      // 複雑なリズム
        restProbability: 0.25       // 多くの休符
      }
    };
    
    return factors[complexity] || factors['moderate'];
  }

  // ジャンルとムードに基づくメロディノート選択（更新版・より多様性）
  selectMelodyNote(measurePosition, currentScaleIndex, scaleLength, genreCharacteristics, moodCharacteristics, complexityFactor = null) {
    if (measurePosition === 0) {
      // 小節の最初：複数の選択肢からランダム選択
      const rootOptions = [0, 2, 4]; // I, iii, V
      const rootProbability = genreCharacteristics.rhythmComplexity > 0.7 ? 0.5 : 0.7;
      
      if (Math.random() < rootProbability) {
        return rootOptions[Math.floor(Math.random() * rootOptions.length)];
      } else {
        // ルート以外の音程
        const nonRootOptions = [1, 3, 5, 6];
        return nonRootOptions[Math.floor(Math.random() * nonRootOptions.length)] % scaleLength;
      }
    } else {
      // その他の拍：より多様な動き
      const direction = Math.random() < 0.5 ? -1 : 1;
      
      // 複雑さ係数を考慮した最大ステップ数
      let baseVariation = genreCharacteristics.noteVariation;
      if (complexityFactor) {
        baseVariation *= complexityFactor.noteVariation;
      }
      
      // より大きなジャンプも可能にする
      const maxStep = Math.ceil(baseVariation * 4); // より大きな範囲
      const stepSize = Math.floor(Math.random() * maxStep) + 1;
      
      let newIndex = currentScaleIndex + (direction * stepSize);
      
      // ムードによる音域調整（より動的）
      const energyBoost = moodCharacteristics.rhythmEnergy * 2;
      if (energyBoost > 1 && Math.random() < 0.4) { // 確率を上げる
        newIndex += direction * 2; // より大きな動き
      }
      
      // 25%の確率で完全にランダムな音符
      if (Math.random() < 0.25) {
        newIndex = Math.floor(Math.random() * scaleLength);
      }
      
      // スケール範囲内に制限
      return Math.max(0, Math.min(scaleLength - 1, newIndex));
    }
  }

  // ジャンルに基づく休符挿入判定（更新版）
  shouldInsertRest(measurePosition, genreCharacteristics, complexityFactor = null) {
    if (measurePosition === 0) return false; // 小節の最初は休符なし
    
    let restProbability = genreCharacteristics.restProbability;
    if (complexityFactor) {
      restProbability *= complexityFactor.restProbability / 0.15; // 標準値で正規化
    }
    
    return Math.random() < restProbability;
  }

  // 設定のハッシュ生成（設定の変更を追跡）+ ランダムシード
  generateSettingsHash(settings) {
    const settingsString = JSON.stringify({
      genre: settings.genre,
      mood: settings.mood,
      tempo: settings.tempo,
      duration: settings.duration,
      instruments: settings.instruments,
      complexity: settings.complexity,
      volume: settings.volume,
      timestamp: Date.now(), // タイムスタンプを追加して一意性を保証
      randomSeed: Math.random() // 毎回異なるシードを追加
    });
    
    // 簡単なハッシュ生成
    let hash = 0;
    for (let i = 0; i < settingsString.length; i++) {
      const char = settingsString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    return hash.toString(16);
  }

  // ムードに基づくベロシティ計算
  calculateMoodBasedVelocity(measurePosition, moodCharacteristics) {
    let baseVelocity = moodCharacteristics.velocityBase;
    
    // 強拍・弱拍の調整
    if (measurePosition === 0) {
      baseVelocity += 0.1; // 強拍を強く
    } else if (measurePosition === 1 || measurePosition === 3) {
      baseVelocity -= 0.1; // 弱拍を弱く
    }
    
    // ランダムな変化
    const variation = (Math.random() - 0.5) * moodCharacteristics.velocityVariation;
    return Math.max(0.1, Math.min(1.0, baseVelocity + variation));
  }

  // ジャンル特性の取得
  getGenreCharacteristics(genre) {
    const characteristics = {
      'classical': {
        rhythmComplexity: 0.7,
        restProbability: 0.15,
        noteVariation: 0.6,
        tempoVariation: 0.1,
        melodyRange: 2.0,
        chordProgression: 'traditional'
      },
      'jazz': {
        rhythmComplexity: 0.9,
        restProbability: 0.2,
        noteVariation: 0.8,
        tempoVariation: 0.15,
        melodyRange: 2.5,
        chordProgression: 'complex'
      },
      'rock': {
        rhythmComplexity: 0.6,
        restProbability: 0.1,
        noteVariation: 0.5,
        tempoVariation: 0.05,
        melodyRange: 1.5,
        chordProgression: 'power'
      },
      'electronic': {
        rhythmComplexity: 0.8,
        restProbability: 0.05,
        noteVariation: 0.9,
        tempoVariation: 0.2,
        melodyRange: 3.0,
        chordProgression: 'synthetic'
      },
      'ambient': {
        rhythmComplexity: 0.3,
        restProbability: 0.25,
        noteVariation: 0.4,
        tempoVariation: 0.05,
        melodyRange: 1.8,
        chordProgression: 'atmospheric'
      },
      'cinematic': {
        rhythmComplexity: 0.8,
        restProbability: 0.2,
        noteVariation: 0.7,
        tempoVariation: 0.3,
        melodyRange: 2.8,
        chordProgression: 'dramatic'
      }
    };
    
    return characteristics[genre] || characteristics['ambient'];
  }

  // ムード特性の取得
  getMoodCharacteristics(mood) {
    const characteristics = {
      'calm': {
        velocityBase: 0.5,
        velocityVariation: 0.2,
        rhythmEnergy: 0.3,
        harmonicTension: 0.2,
        tempoModifier: 0.85
      },
      'energetic': {
        velocityBase: 0.8,
        velocityVariation: 0.3,
        rhythmEnergy: 0.9,
        harmonicTension: 0.6,
        tempoModifier: 1.2
      },
      'dramatic': {
        velocityBase: 0.7,
        velocityVariation: 0.4,
        rhythmEnergy: 0.8,
        harmonicTension: 0.8,
        tempoModifier: 1.0
      },
      'peaceful': {
        velocityBase: 0.4,
        velocityVariation: 0.15,
        rhythmEnergy: 0.2,
        harmonicTension: 0.1,
        tempoModifier: 0.8
      },
      'uplifting': {
        velocityBase: 0.75,
        velocityVariation: 0.25,
        rhythmEnergy: 0.7,
        harmonicTension: 0.4,
        tempoModifier: 1.1
      },
      'melancholic': {
        velocityBase: 0.45,
        velocityVariation: 0.3,
        rhythmEnergy: 0.4,
        harmonicTension: 0.7,
        tempoModifier: 0.9
      }
    };
    
    return characteristics[mood] || characteristics['calm'];
  }

  // ジャンルに基づく音符長さの計算
  calculateGenreBasedDuration(beatDuration, measurePosition, genreCharacteristics) {
    let baseDuration;
    
    // 基本的な音符長さ
    if (measurePosition === 0 || measurePosition === 2) {
      baseDuration = beatDuration; // 強拍は1拍
    } else {
      baseDuration = beatDuration * 0.5; // 弱拍は半拍
    }
    
    // ジャンルによる調整
    const complexityFactor = 1 + (genreCharacteristics.rhythmComplexity - 0.5) * 0.5;
    return baseDuration * complexityFactor;
  }
}

// グローバルインスタンス
window.musicGenerator = new MusicGenerator();
