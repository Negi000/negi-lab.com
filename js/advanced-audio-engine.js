/**
 * 高度音響合成エンジン - Web Audio API完全活用版
 * 物理モデリング・FM合成・減算合成・グラニュラー合成を組み合わせた高品質楽器音色生成
 */

class AdvancedAudioEngine {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.sampleRate = audioContext.sampleRate;
    this.masterGain = audioContext.createGain();
    this.compressor = audioContext.createDynamicsCompressor();
    this.reverb = null;
    
    // マスターチェーンの構築
    this.setupMasterChain();
    
    // 楽器用インパルスレスポンス
    this.impulseResponses = new Map();
    this.setupInstrumentImpulses();
  }

  setupMasterChain() {
    // プロフェッショナルなマスタリングチェーン
    this.compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
    this.compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
    this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

    this.masterGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
    
    // リバーブ用インパルスレスポンス生成
    this.createReverbImpulse();
    
    // 接続: compressor -> reverb -> masterGain -> destination
    this.compressor.connect(this.reverb);
    this.reverb.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);
  }

  createReverbImpulse() {
    const length = this.sampleRate * 2; // 2秒のリバーブ
    const impulse = this.audioContext.createBuffer(2, length, this.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = length - i;
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2);
      }
    }
    
    this.reverb = this.audioContext.createConvolver();
    this.reverb.buffer = impulse;
  }

  setupInstrumentImpulses() {
    // 楽器別のインパルスレスポンス設定（実際の録音データの代わりに計算で生成）
    this.impulseResponses.set('piano', this.createPianoImpulse());
    this.impulseResponses.set('guitar', this.createGuitarImpulse());
    this.impulseResponses.set('strings', this.createStringsImpulse());
  }

  createPianoImpulse() {
    const length = this.sampleRate * 0.1;
    const impulse = this.audioContext.createBuffer(1, length, this.sampleRate);
    const data = impulse.getChannelData(0);
    
    // ピアノの響板とハンマーの音響特性
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate;
      const decay = Math.exp(-t * 15);
      const resonance = Math.sin(2 * Math.PI * 4000 * t) * 0.3 + 
                       Math.sin(2 * Math.PI * 8000 * t) * 0.1;
      data[i] = resonance * decay;
    }
    
    return impulse;
  }

  createGuitarImpulse() {
    const length = this.sampleRate * 0.05;
    const impulse = this.audioContext.createBuffer(1, length, this.sampleRate);
    const data = impulse.getChannelData(0);
    
    // ギターボディの共鳴特性
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate;
      const decay = Math.exp(-t * 25);
      const resonance = Math.sin(2 * Math.PI * 100 * t) * 0.5 + 
                       Math.sin(2 * Math.PI * 200 * t) * 0.3;
      data[i] = resonance * decay;
    }
    
    return impulse;
  }

  createStringsImpulse() {
    const length = this.sampleRate * 0.2;
    const impulse = this.audioContext.createBuffer(1, length, this.sampleRate);
    const data = impulse.getChannelData(0);
    
    // 弦楽器の胴体共鳴
    for (let i = 0; i < length; i++) {
      const t = i / this.sampleRate;
      const decay = Math.exp(-t * 8);
      const resonance = Math.sin(2 * Math.PI * 250 * t) * 0.4 + 
                       Math.sin(2 * Math.PI * 500 * t) * 0.2;
      data[i] = resonance * decay;
    }
    
    return impulse;
  }

  // 高品質ピアノ音色生成（物理モデリング + FM合成）
  async generatePianoNote(frequency, duration, velocity, startTime = 0) {
    const now = this.audioContext.currentTime + startTime;
    
    // メインオシレーター（FM合成）
    const carrier = this.audioContext.createOscillator();
    const modulator = this.audioContext.createOscillator();
    const modGain = this.audioContext.createGain();
    
    // FM合成パラメータ
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(frequency, now);
    
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(frequency * 2.1, now); // 微細なデチューン
    
    // モジュレーション深度
    modGain.gain.setValueAtTime(frequency * 0.5, now);
    modGain.gain.exponentialRampToValueAtTime(frequency * 0.1, now + duration * 0.3);
    
    // 接続: modulator -> modGain -> carrier.frequency
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    
    // ハーモニクス追加
    const harmonics = [];
    const harmonicGains = [];
    
    for (let h = 2; h <= 8; h++) {
      const harmonic = this.audioContext.createOscillator();
      const harmGain = this.audioContext.createGain();
      
      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(frequency * h, now);
      
      const amplitude = velocity / (h * h) * 0.3;
      harmGain.gain.setValueAtTime(amplitude, now);
      harmGain.gain.exponentialRampToValueAtTime(amplitude * 0.01, now + duration);
      
      harmonic.connect(harmGain);
      harmonics.push(harmonic);
      harmonicGains.push(harmGain);
    }
    
    // メインエンベロープ
    const mainGain = this.audioContext.createGain();
    const attack = 0.01;
    const decay = 0.3;
    const sustain = velocity * 0.3;
    const release = Math.max(0.1, duration - attack - decay);
    
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(velocity, now + attack);
    mainGain.gain.exponentialRampToValueAtTime(sustain, now + attack + decay);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    // フィルタリング
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 8, now);
    filter.Q.setValueAtTime(2, now);
    filter.frequency.exponentialRampToValueAtTime(frequency * 3, now + duration);
    
    // ピアノ特有の共鳴効果
    const convolver = this.audioContext.createConvolver();
    convolver.buffer = this.impulseResponses.get('piano');
    
    // 接続チェーン
    carrier.connect(filter);
    filter.connect(convolver);
    convolver.connect(mainGain);
    
    // ハーモニクスも同様に接続
    harmonicGains.forEach(gain => {
      gain.connect(convolver);
    });
    
    mainGain.connect(this.compressor);
    
    // 再生開始
    carrier.start(now);
    modulator.start(now);
    harmonics.forEach(h => h.start(now));
    
    // 停止スケジュール
    const stopTime = now + duration;
    carrier.stop(stopTime);
    modulator.stop(stopTime);
    harmonics.forEach(h => h.stop(stopTime));
    
    return { carrier, modulator, harmonics, mainGain, filter };
  }

  // 高品質ギター音色生成（物理モデリング）
  async generateGuitarNote(frequency, duration, velocity, startTime = 0) {
    const now = this.audioContext.currentTime + startTime;
    
    // 弦の物理モデリング（Karplus-Strong-ライクな合成）
    const bufferSize = Math.floor(this.sampleRate / frequency);
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    
    // ピッキングノイズ（初期励起）
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * velocity * 0.5;
    }
    
    const bufferSource = this.audioContext.createBufferSource();
    bufferSource.buffer = noiseBuffer;
    bufferSource.loop = true;
    
    // ローパスフィルター（弦の減衰をシミュレート）
    const stringFilter = this.audioContext.createBiquadFilter();
    stringFilter.type = 'lowpass';
    stringFilter.frequency.setValueAtTime(frequency * 6, now);
    stringFilter.Q.setValueAtTime(1, now);
    
    // ボディ共鳴
    const bodyConvolver = this.audioContext.createConvolver();
    bodyConvolver.buffer = this.impulseResponses.get('guitar');
    
    // エンベロープ
    const envelope = this.audioContext.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(velocity, now + 0.02);
    envelope.gain.exponentialRampToValueAtTime(velocity * 0.3, now + 0.5);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    // 接続
    bufferSource.connect(stringFilter);
    stringFilter.connect(bodyConvolver);
    bodyConvolver.connect(envelope);
    envelope.connect(this.compressor);
    
    bufferSource.start(now);
    bufferSource.stop(now + duration);
    
    return { bufferSource, stringFilter, envelope };
  }

  // 高品質ストリングス音色生成（減算合成 + アンサンブル効果）
  async generateStringsNote(frequency, duration, velocity, startTime = 0) {
    const now = this.audioContext.currentTime + startTime;
    const voices = [];
    
    // 複数のボイスでアンサンブル効果
    for (let v = 0; v < 4; v++) {
      const detune = (v - 1.5) * 3; // 微細なデチューン
      
      const oscillator = this.audioContext.createOscillator();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(frequency + detune, now);
      
      // ビブラート
      const vibrato = this.audioContext.createOscillator();
      const vibratoGain = this.audioContext.createGain();
      vibrato.type = 'sine';
      vibrato.frequency.setValueAtTime(6.5, now);
      vibratoGain.gain.setValueAtTime(2, now);
      
      vibrato.connect(vibratoGain);
      vibratoGain.connect(oscillator.frequency);
      
      // フィルタ（弓の表現）
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(frequency * 3, now);
      filter.Q.setValueAtTime(5, now);
      
      // フィルタースイープ（弓の動き）
      filter.frequency.setValueAtTime(frequency * 2, now);
      filter.frequency.exponentialRampToValueAtTime(frequency * 4, now + duration * 0.3);
      filter.frequency.exponentialRampToValueAtTime(frequency * 2.5, now + duration);
      
      // エンベロープ（滑らかなアタック）
      const envelope = this.audioContext.createGain();
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(velocity * 0.25, now + 0.15);
      envelope.gain.linearRampToValueAtTime(velocity * 0.8, now + 0.3);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      // 接続
      oscillator.connect(filter);
      filter.connect(envelope);
      
      voices.push({ oscillator, vibrato, filter, envelope });
      
      oscillator.start(now);
      vibrato.start(now);
      oscillator.stop(now + duration);
      vibrato.stop(now + duration);
    }
    
    // ボイスをミックス
    const mixer = this.audioContext.createGain();
    mixer.gain.setValueAtTime(0.7, now);
    
    voices.forEach(voice => {
      voice.envelope.connect(mixer);
    });
    
    // ストリングス特有の共鳴
    const stringsConvolver = this.audioContext.createConvolver();
    stringsConvolver.buffer = this.impulseResponses.get('strings');
    
    mixer.connect(stringsConvolver);
    stringsConvolver.connect(this.compressor);
    
    return voices;
  }

  // 高品質シンセサイザー音色（減算合成）
  async generateSynthNote(frequency, duration, velocity, startTime = 0) {
    const now = this.audioContext.currentTime + startTime;
    
    // デュアルオシレーター
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    
    osc1.frequency.setValueAtTime(frequency, now);
    osc2.frequency.setValueAtTime(frequency * 1.01, now); // デチューン
    
    // ミキサー
    const mixer = this.audioContext.createGain();
    mixer.gain.setValueAtTime(0.5, now);
    
    // フィルター（Moogスタイル）
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(20, now);
    
    // フィルタースイープ
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(frequency * 8, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(frequency * 2, now + duration);
    
    // エンベロープ
    const envelope = this.audioContext.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(velocity, now + 0.05);
    envelope.gain.linearRampToValueAtTime(velocity * 0.7, now + 0.2);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    // LFO
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(4.5, now);
    lfoGain.gain.setValueAtTime(50, now);
    
    // 接続
    osc1.connect(mixer);
    osc2.connect(mixer);
    mixer.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.compressor);
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    
    // 再生
    osc1.start(now);
    osc2.start(now);
    lfo.start(now);
    
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    lfo.stop(now + duration);
    
    return { osc1, osc2, filter, envelope, lfo };
  }

  // 楽器別音色生成のメインファンクション
  async generateInstrumentNote(instrument, frequency, duration, velocity, startTime = 0) {
    switch (instrument) {
      case 'piano':
        return this.generatePianoNote(frequency, duration, velocity, startTime);
      case 'guitar':
        return this.generateGuitarNote(frequency, duration, velocity, startTime);
      case 'strings':
        return this.generateStringsNote(frequency, duration, velocity, startTime);
      case 'synthesizer':
      case 'electronic':
        return this.generateSynthNote(frequency, duration, velocity, startTime);
      default:
        return this.generatePianoNote(frequency, duration, velocity, startTime);
    }
  }

  // 和音生成
  async generateChord(instrument, frequencies, duration, velocity, startTime = 0) {
    const notes = [];
    
    for (const frequency of frequencies) {
      const note = await this.generateInstrumentNote(
        instrument, 
        frequency, 
        duration, 
        velocity * 0.7, // 和音では少し音量を下げる
        startTime
      );
      notes.push(note);
    }
    
    return notes;
  }

  // クリーンアップ
  cleanup() {
    // すべてのノードを切断
    if (this.reverb) {
      this.reverb.disconnect();
    }
    this.compressor.disconnect();
    this.masterGain.disconnect();
  }
}

// グローバルからアクセス可能に
window.AdvancedAudioEngine = AdvancedAudioEngine;
