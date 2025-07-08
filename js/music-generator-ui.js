/**
 * 音楽生成ツール UI制御
 * ユーザーインターフェースとユーザーインタラクションの管理
 */

class MusicGeneratorUI {
  constructor() {
    this.currentLanguage = 'ja';
    this.translations = window.musicGeneratorTranslations;
    this.musicGenerator = null;
    this.isInitialized = false;
    
    this.init();
  }

  /**
   * UI初期化
   */
  async init() {
    // 新しいTone.jsツールへの案内を表示
    this.showUpgradeNotice();
    
    // 音楽ジェネレーターが利用可能になるまで待機
    await this.waitForMusicGenerator();
    
    await this.initializeTranslationSystem();
    this.setupEventListeners();
    this.setupPresets();
    this.initializeAudioVisualization();
    this.isInitialized = true;
  }

  /**
   * 新しいTone.jsツールへの案内表示
   */
  showUpgradeNotice() {
    const noticeHtml = `
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6 shadow-lg">
        <div class="flex items-start space-x-4">
          <div class="text-3xl">🚀</div>
          <div class="flex-1">
            <h3 class="text-xl font-bold mb-2">新しい高品質音楽生成ツールが利用可能です！</h3>
            <p class="mb-4">Tone.jsを使用した音楽理論ベースの高品質音楽生成ツールをご利用ください：</p>
            <ul class="list-disc list-inside mb-4 space-y-1 text-sm">
              <li>音楽理論に基づいた自然なコード進行・メロディ</li>
              <li>高品質なTone.jsシンセサイザー音源</li>
              <li>自然言語解析対応（「明るく元気な感じで」など）</li>
              <li>シンプルモード + 詳細設定モード</li>
              <li>本格的な楽曲構成（Aメロ-Bメロ-サビ）</li>
            </ul>
            <a href="./music-generator-tone.html" class="inline-block bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              🎵 新しいツールを試す
            </a>
          </div>
        </div>
      </div>
    `;
    
    // メインコンテナの最初に挿入
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      const noticeDiv = document.createElement('div');
      noticeDiv.innerHTML = noticeHtml;
      mainContainer.insertBefore(noticeDiv, mainContainer.firstChild);
    }
  }

  /**
   * 翻訳システム初期化
   */
  async initializeTranslationSystem() {
    // 言語設定の復元
    const savedLang = localStorage.getItem('music-generator-language') || 'ja';
    this.currentLanguage = savedLang;
    
    // 言語切り替えセレクタの設定
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
      langSwitch.value = this.currentLanguage;
      langSwitch.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }
    
    // 初期翻訳適用
    this.applyTranslations();
  }

  /**
   * 言語変更
   */
  changeLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('music-generator-language', lang);
    this.applyTranslations();
  }

  /**
   * 翻訳適用
   */
  applyTranslations() {
    const t = this.translations[this.currentLanguage];
    if (!t) return;

    // data-translate-key属性を持つ要素の翻訳
    document.querySelectorAll('[data-translate-key]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      const translation = this.getNestedValue(t, key);
      if (translation) {
        element.textContent = translation;
      }
    });

    // data-translate-html-key属性を持つ要素の翻訳（HTMLを含む）
    document.querySelectorAll('[data-translate-html-key]').forEach(element => {
      const key = element.getAttribute('data-translate-html-key');
      const translation = this.getNestedValue(t, key);
      if (translation) {
        element.innerHTML = translation;
      }
    });

    // placeholder翻訳
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      const translation = this.getNestedValue(t, key);
      if (translation) {
        element.placeholder = translation;
      }
    });

    // title属性翻訳
    document.querySelectorAll('[data-translate-title]').forEach(element => {
      const key = element.getAttribute('data-translate-title');
      const translation = this.getNestedValue(t, key);
      if (translation) {
        element.title = translation;
      }
    });
  }

  /**
   * ネストしたオブジェクトから値を取得
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  /**
   * イベントリスナー設定
   */
  setupEventListeners() {
    // 音楽生成ボタン
    document.getElementById('generate-btn')?.addEventListener('click', () => {
      this.generateMusic();
    });

    // 再生制御ボタン
    document.getElementById('play-btn')?.addEventListener('click', () => {
      this.playMusic();
    });

    document.getElementById('pause-btn')?.addEventListener('click', () => {
      this.pauseMusic();
    });

    document.getElementById('stop-btn')?.addEventListener('click', () => {
      this.stopMusic();
    });

    // ダウンロードボタン
    document.getElementById('download-btn')?.addEventListener('click', () => {
      this.downloadMusic();
    });

    // 設定変更時のリアルタイムプレビュー
    this.setupRealtimePreview();

    // プリセット選択
    document.querySelectorAll('.preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const preset = card.dataset.preset;
        this.applyPreset(preset);
      });
    });

    // 詳細設定の表示/非表示
    document.getElementById('advanced-toggle')?.addEventListener('click', () => {
      this.toggleAdvancedSettings();
    });

    // ガイドモーダル
    document.getElementById('guide-btn')?.addEventListener('click', () => {
      this.showGuide();
    });

    document.getElementById('close-guide')?.addEventListener('click', () => {
      this.hideGuide();
    });
  }

  /**
   * プリセット設定
   */
  setupPresets() {
    this.presets = {
      'youtube': {
        genre: 'pop',
        mood: 'energetic',
        tempo: 'medium',
        duration: 'medium',
        instruments: ['piano', 'guitar', 'drums'],
        loop: true,
        complexity: 'moderate'
      },
      'game': {
        genre: 'gameMusic',
        mood: 'epic',
        tempo: 'medium',
        duration: 'long',
        instruments: ['orchestral', 'synthesizer'],
        loop: true,
        complexity: 'complex'
      },
      'presentation': {
        genre: 'ambient',
        mood: 'calm',
        tempo: 'slow',
        duration: 'long',
        instruments: ['piano', 'strings'],
        loop: true,
        complexity: 'simple'
      },
      'podcast': {
        genre: 'ambient',
        mood: 'peaceful',
        tempo: 'slow',
        duration: 'extended',
        instruments: ['synthesizer'],
        loop: true,
        complexity: 'simple'
      },
      'meditation': {
        genre: 'ambient',
        mood: 'peaceful',
        tempo: 'slow',
        duration: 'extended',
        instruments: ['strings', 'synthesizer'],
        loop: true,
        complexity: 'simple'
      },
      'workout': {
        genre: 'electronic',
        mood: 'energetic',
        tempo: 'fast',
        duration: 'long',
        instruments: ['synthesizer', 'drums'],
        loop: true,
        complexity: 'moderate'
      },
      'study': {
        genre: 'lofi',
        mood: 'calm',
        tempo: 'slow',
        duration: 'extended',
        instruments: ['piano', 'synthesizer'],
        loop: true,
        complexity: 'simple'
      },
      'sleep': {
        genre: 'ambient',
        mood: 'peaceful',
        tempo: 'slow',
        duration: 'extended',
        instruments: ['strings'],
        loop: true,
        complexity: 'simple'
      }
    };
  }

  /**
   * 設定検証
   */
  validateSettings(settings) {
    if (!settings || typeof settings !== 'object') return false;
    
    // 必須フィールドのチェック
    const requiredFields = ['genre', 'mood', 'tempo', 'duration', 'instruments'];
    for (const field of requiredFields) {
      if (!settings[field]) {
        console.warn(`Missing required setting: ${field}`);
        return false;
      }
    }
    
    // 楽器配列のチェック
    if (!Array.isArray(settings.instruments) || settings.instruments.length === 0) {
      console.warn('No instruments selected');
      return false;
    }
    
    return true;
  }

  // === 音楽再生制御機能 ===

  /**
   * 音楽再生（統合版）
   */
  async playMusic() {
    console.log('playMusic called');
    
    if (!this.currentMusic || !this.currentMusic.audioData) {
      this.showMessage('再生する音楽がありません。まず音楽を生成してください。', 'warning');
      return;
    }

    try {
      // AudioContextの再開（ブラウザの自動再生ポリシー対応）
      if (this.musicGenerator && this.musicGenerator.audioContext && this.musicGenerator.audioContext.state === 'suspended') {
        await this.musicGenerator.audioContext.resume();
      }

      // 既存の再生を停止
      this.stopAllOscillators();

      // 音楽データから音声バッファーを作成
      const audioContext = this.musicGenerator.audioContext;
      const audioData = this.currentMusic.audioData;
      const sampleRate = audioContext.sampleRate;
      
      const audioBuffer = audioContext.createBuffer(1, audioData.length, sampleRate);
      audioBuffer.copyToChannel(audioData, 0);

      // 音源を作成
      this.currentSource = audioContext.createBufferSource();
      this.currentSource.buffer = audioBuffer;
      
      // ゲインノードに接続
      if (this.musicGenerator.gainNode) {
        this.currentSource.connect(this.musicGenerator.gainNode);
      } else {
        this.currentSource.connect(audioContext.destination);
      }

      // 再生状態を更新
      this.isPlaying = true;
      this.isPaused = false;
      this.startProgressUpdate();
      this.updatePlaybackControls();

      // 再生開始
      this.currentSource.start(0);
      
      // 再生終了時のコールバック
      this.currentSource.onended = () => {
        this.stopMusic();
      };

      this.showMessage('音楽を再生中です', 'success');
      
    } catch (error) {
      console.error('Playback error:', error);
      this.showMessage('再生エラーが発生しました: ' + error.message, 'error');
      this.isPlaying = false;
      this.updatePlaybackControls();
    }
  }

  /**
   * 音楽一時停止
   */
  pauseMusic() {
    console.log('pauseMusic called');
    
    if (!this.isPlaying) {
      this.showMessage('再生中の音楽がありません', 'warning');
      return;
    }

    try {
      // 現在の音源を停止
      if (this.currentSource) {
        this.currentSource.stop();
        this.currentSource = null;
      }

      // 状態更新
      this.isPlaying = false;
      this.isPaused = true;
      this.stopProgressUpdate();
      this.updatePlaybackControls();

      this.showMessage('音楽を一時停止しました', 'info');
      
    } catch (error) {
      console.error('Pause error:', error);
      this.showMessage('一時停止エラーが発生しました: ' + error.message, 'error');
    }
  }

  /**
   * 音楽停止
   */
  stopMusic() {
    console.log('stopMusic called');
    
    try {
      // 全ての音源を停止
      this.stopAllOscillators();
      
      if (this.currentSource) {
        this.currentSource.stop();
        this.currentSource = null;
      }

      // 状態リセット
      this.isPlaying = false;
      this.isPaused = false;
      this.currentTime = 0;
      this.stopProgressUpdate();
      this.updatePlaybackControls();
      this.updateProgressDisplay();

      this.showMessage('音楽を停止しました', 'info');
      
    } catch (error) {
      console.error('Stop error:', error);
      this.showMessage('停止エラーが発生しました: ' + error.message, 'error');
    }
  }

  /**
   * 全ての発振器を停止
   */
  stopAllOscillators() {
    if (this.musicGenerator && this.musicGenerator.oscillators) {
      this.musicGenerator.oscillators.forEach(osc => {
        try {
          if (osc && typeof osc.stop === 'function') {
            osc.stop();
          }
        } catch (e) {
          // 既に停止済みの場合のエラーは無視
        }
      });
      this.musicGenerator.oscillators = [];
    }
  }

  /**
   * オーディオバッファ作成
   */
  createAudioBuffer(audioData) {
    const audioContext = this.musicGenerator.audioContext;
    const sampleRate = audioContext.sampleRate;
    const numberOfChannels = 1; // モノラル
    const length = audioData.length;
    
    const audioBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    // オーディオデータをコピー
    for (let i = 0; i < length; i++) {
      channelData[i] = audioData[i];
    }
    
    return audioBuffer;
  }

  /**
   * 再生制御UIの更新
   */
  updatePlaybackControls() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    if (playBtn) {
      playBtn.disabled = this.isPlaying;
      playBtn.style.opacity = this.isPlaying ? '0.5' : '1';
    }
    
    if (pauseBtn) {
      pauseBtn.disabled = !this.isPlaying;
      pauseBtn.style.opacity = this.isPlaying ? '1' : '0.5';
    }
    
    if (stopBtn) {
      stopBtn.disabled = !this.isPlaying && !this.isPaused;
      stopBtn.style.opacity = (this.isPlaying || this.isPaused) ? '1' : '0.5';
    }
  }

  /**
   * 進行状況更新開始
   */
  startProgressUpdate() {
    this.stopProgressUpdate(); // 既存のタイマーをクリア
    
    this.progressUpdateInterval = setInterval(() => {
      if (this.isPlaying && this.currentMusic) {
        this.currentTime += 0.1;
        this.updateProgressDisplay();
        
        // 再生完了チェック
        if (this.currentTime >= this.currentMusic.metadata.duration) {
          this.stopMusic();
        }
      }
    }, 100);
  }

  /**
   * 進行状況更新停止
   */
  stopProgressUpdate() {
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
      this.progressUpdateInterval = null;
    }
  }

  /**
   * 進行状況表示更新
   */
  updateProgressDisplay() {
    const currentTimeElement = document.getElementById('current-time');
    const progressBar = document.getElementById('progress-bar');
    
    if (currentTimeElement) {
      const minutes = Math.floor(this.currentTime / 60);
      const seconds = Math.floor(this.currentTime % 60);
      currentTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (progressBar && this.currentMusic) {
      const progress = (this.currentTime / this.currentMusic.metadata.duration) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  }

  /**
   * 簡単な波形データ生成
   */
  generateSimpleWaveform(audioData) {
    if (!audioData || audioData.length === 0) return [];
    
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
   * 音楽生成（改良版）
   */
  async generateMusic() {
    console.log('generateMusic called');
    
    if (!this.musicGenerator) {
      console.error('Music generator not available');
      this.showMessage('error', 'Music generator not available');
      return;
    }
    
    if (this.musicGenerator.isGenerating) {
      console.log('Generation already in progress');
      return;
    }

    try {
      // 設定収集
      const settings = this.collectSettings();
      console.log('Collected settings:', settings);
      
      // 設定検証
      if (!this.validateSettings(settings)) {
        console.error('Settings validation failed');
        this.showMessage('error', this.getTranslation('errors.generation'));
        return;
      }
      
      // UI状態更新
      this.showGenerating(true);
      console.log('Starting music generation with settings:', settings);
      
      // 音楽生成（タイムアウト付き）
      let musicData;
      try {
        musicData = await Promise.race([
          this.musicGenerator.generateMusic(settings),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Generation timeout')), 30000))
        ]);
      } catch (error) {
        console.error('Music generation failed:', error);
        // フォールバックとしてシンプル音楽を生成
        if (window.musicDebug) {
          console.log('Using fallback simple music generation');
          musicData = window.musicDebug.generateSimpleMusic(this.getDurationValue(settings.duration));
        } else {
          throw error;
        }
      }
      
      if (!musicData) {
        throw new Error('No music data generated');
      }
      
      console.log('Music generation completed:', musicData);
      
      // 結果表示
      this.displayGeneratedMusic(musicData);
      
      // 成功メッセージ
      this.showMessage('success', this.getTranslation('success.generated'));
      
    } catch (error) {
      console.error('Music generation failed:', error);
      this.showMessage('error', this.getTranslation('errors.generation') + ': ' + error.message);
    } finally {
      this.showGenerating(false);
    }
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
    return durationMap[duration] || 30;
  }

  /**
   * 設定収集
   */
  collectSettings() {
    return {
      genre: document.getElementById('genre-select')?.value || 'ambient',
      mood: document.getElementById('mood-select')?.value || 'calm',
      tempo: document.getElementById('tempo-select')?.value || 'medium',
      duration: document.getElementById('duration-select')?.value || 'medium',
      instruments: this.getSelectedInstruments(),
      loop: document.getElementById('loop-checkbox')?.checked || false,
      volume: parseFloat(document.getElementById('volume-range')?.value || '0.7'),
      complexity: document.getElementById('complexity-select')?.value || 'moderate',
      harmony: document.getElementById('harmony-select')?.value || 'consonant',
      dynamics: document.getElementById('dynamics-select')?.value || 'balanced'
    };
  }

  /**
   * 選択された楽器の取得
   */
  getSelectedInstruments() {
    const checkboxes = document.querySelectorAll('.instrument-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
  }

  /**
   * 生成進行状況の更新
   */
  updateProgress(percentage, message) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = message;
    }
  }

  /**
   * 生成された音楽の表示（改良版）
   */
  displayGeneratedMusic(musicData) {
    console.log('displayGeneratedMusic called with:', musicData);
    
    // 音楽データを保存
    this.currentMusic = musicData;
    console.log('Current music set to:', this.currentMusic);
    
    // プレビューエリアの表示
    const previewArea = document.getElementById('preview-area');
    if (previewArea) {
      previewArea.style.display = 'block';
      console.log('Preview area displayed');
    } else {
      console.error('Preview area not found');
    }

    // ダウンロードエリアの表示
    const downloadArea = document.getElementById('download-area');
    if (downloadArea) {
      downloadArea.style.display = 'block';
      console.log('Download area displayed');
    } else {
      console.error('Download area not found');
    }

    // 波形表示（新しい音声データ構造に対応）
    const waveformData = musicData.waveform || this.generateSimpleWaveform(musicData.audioData);
    if (waveformData && waveformData.length > 0) {
      this.displayWaveform(waveformData);
      console.log('Waveform displayed, points:', waveformData.length);
    } else {
      console.warn('No waveform data available');
    }
    
    // メタデータ表示
    if (musicData.metadata) {
      this.displayMetadata(musicData.metadata);
      console.log('Metadata displayed');
    } else {
      console.warn('No metadata available');
    }
    
    // 再生ボタンの有効化
    this.enablePlaybackControls(true);
    console.log('Playback controls enabled');

    // 音楽品質インジケーター表示
    if (musicData.metadata) {
      this.displayQualityIndicator(musicData.metadata);
      console.log('Quality indicator displayed');
    }
    
    // 再生制御UIの初期化
    this.currentTime = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.updatePlaybackControls();
    this.updateProgressDisplay();
    
    console.log('displayGeneratedMusic completed successfully');
  }

  /**
   * 波形表示
   */
  displayWaveform(waveformData) {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas || !waveformData) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // キャンバスクリア
    ctx.clearRect(0, 0, width, height);

    // 波形描画
    ctx.strokeStyle = '#4ADE80';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const samplesPerPixel = Math.floor(waveformData.length / width);
    
    for (let x = 0; x < width; x++) {
      const sampleIndex = x * samplesPerPixel;
      const sample = waveformData[sampleIndex] || 0;
      const y = (height / 2) + (sample * height / 2);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
  }

  /**
   * メタデータ表示
   */
  displayMetadata(metadata) {
    const elements = {
      'metadata-duration': this.formatDuration(metadata.duration || 30),
      'metadata-tempo': `${metadata.tempo || 120} BPM`,
      'metadata-key': metadata.key || 'C major',
      'metadata-generated': new Date().toLocaleString()
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  /**
   * 音楽ダウンロード（完全実装版）
   */
  async downloadMusic() {
    console.log('downloadMusic called, currentMusic:', this.currentMusic);
    
    if (!this.currentMusic) {
      this.showMessage('error', this.getTranslation('errors.download') + ': 音楽が生成されていません');
      return;
    }

    try {
      const format = document.getElementById('download-format')?.value || 'wav';
      console.log('Downloading in format:', format);
      
      // WAVエクスポート
      const wavArrayBuffer = this.musicGenerator.exportToWav();
      
      if (!wavArrayBuffer) {
        throw new Error('WAVデータの生成に失敗しました');
      }
      
      console.log('WAV export successful, size:', wavArrayBuffer.byteLength);
      
      // ダウンロード実行
      const blob = new Blob([wavArrayBuffer], { type: 'audio/wav' });
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `negi-lab-music-${timestamp}.wav`;
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // メモリ解放
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 1000);
      
      this.showMessage('success', this.getTranslation('success.downloaded'));
      console.log('Download completed successfully');
      
    } catch (error) {
      console.error('Download failed:', error);
      this.showMessage('error', this.getTranslation('errors.download') + ': ' + error.message);
    }
  }

  /**
   * プリセット適用
   */
  applyPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) return;

    // UI要素に設定を適用
    Object.entries(preset).forEach(([key, value]) => {
      if (key === 'instruments') {
        // 楽器チェックボックスの設定
        document.querySelectorAll('.instrument-checkbox').forEach(cb => {
          cb.checked = value.includes(cb.value);
        });
      } else if (key === 'loop') {
        // ループチェックボックス
        const loopCheckbox = document.getElementById('loop-checkbox');
        if (loopCheckbox) loopCheckbox.checked = value;
      } else {
        // セレクトボックスの設定
        const element = document.getElementById(`${key}-select`);
        if (element) element.value = value;
      }
    });

    // プリセットカードの選択状態更新
    document.querySelectorAll('.preset-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.preset === presetName);
    });

    this.showMessage('info', `${presetName} プリセットを適用しました`);
  }

  /**
   * リアルタイムプレビュー設定
   */
  setupRealtimePreview() {
    const previewElements = [
      'genre-select', 'mood-select', 'tempo-select', 
      'duration-select', 'volume-range'
    ];

    previewElements.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => {
          this.updatePreview();
        });
      }
    });
  }

  /**
   * プレビュー更新
   */
  updatePreview() {
    // 設定変更に基づいてプレビュー情報を更新
    const settings = this.collectSettings();
    
    // 予想される音楽特性の表示
    const characteristics = this.calculateMusicCharacteristics(settings);
    this.displayCharacteristics(characteristics);
  }

  /**
   * 音楽特性計算
   */
  calculateMusicCharacteristics(settings) {
    return {
      energy: this.calculateEnergyLevel(settings),
      complexity: settings.complexity,
      mood: settings.mood,
      estimatedFileSize: this.estimateFileSize(settings)
    };
  }

  /**
   * 詳細設定の表示切替
   */
  toggleAdvancedSettings() {
    const advancedPanel = document.getElementById('advanced-settings');
    const toggleBtn = document.getElementById('advanced-toggle');
    
    if (advancedPanel && toggleBtn) {
      const isVisible = advancedPanel.style.display !== 'none' && advancedPanel.style.display !== '';
      console.log('Toggling advanced settings, current visibility:', isVisible);
      
      if (isVisible) {
        advancedPanel.style.display = 'none';
        toggleBtn.textContent = '詳細設定を表示';
      } else {
        advancedPanel.style.display = 'grid';
        toggleBtn.textContent = '詳細設定を非表示';
      }
    } else {
      console.error('Advanced settings elements not found:', {
        panel: !!advancedPanel,
        button: !!toggleBtn
      });
    }
  }

  /**
   * ガイドモーダル表示
   */
  showGuide() {
    const modal = document.getElementById('guide-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * ガイドモーダル非表示
   */
  hideGuide() {
    const modal = document.getElementById('guide-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  /**
   * メッセージ表示
   */
  showMessage(type, message) {
    const messageEl = document.getElementById('message-area');
    if (!messageEl) return;

    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.display = 'block';

    // 自動非表示
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 5000);
  }

  /**
   * 生成中UI表示
   */
  showGenerating(isGenerating) {
    const generateBtn = document.getElementById('generate-btn');
    const progressArea = document.getElementById('progress-area');

    if (generateBtn) {
      generateBtn.disabled = isGenerating;
      generateBtn.textContent = isGenerating ? 
        this.getTranslation('controls.generating') : 
        this.getTranslation('controls.generate');
    }

    if (progressArea) {
      progressArea.style.display = isGenerating ? 'block' : 'none';
    }
  }

  /**
   * 再生制御ボタンの有効化
   */
  enablePlaybackControls(enabled) {
    const controls = ['play-btn', 'download-btn'];
    controls.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.disabled = !enabled;
      }
    });
  }

  /**
   * 音声視覚化初期化
   */
  initializeAudioVisualization() {
    const canvas = document.getElementById('waveform-canvas');
    if (canvas) {
      // キャンバスサイズ設定
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }

  /**
   * 音楽品質インジケーター表示
   */
  displayQualityIndicator(metadata) {
    const qualityArea = document.getElementById('quality-indicator');
    if (!qualityArea) return;

    const quality = metadata.quality || 'standard';
    const instruments = metadata.instruments || [];
    const complexity = metadata.complexity || 'moderate';

    qualityArea.innerHTML = `
      <div class="quality-badge quality-${quality}">
        ${quality.toUpperCase()} QUALITY
      </div>
      <div class="quality-details">
        <div class="quality-stat">
          <span class="label">楽器:</span>
          <span class="value">${instruments.length}種類</span>
        </div>
        <div class="quality-stat">
          <span class="label">複雑さ:</span>
          <span class="value">${complexity}</span>
        </div>
        <div class="quality-stat">
          <span class="label">ビットレート:</span>
          <span class="value">320kbps相当</span>
        </div>
      </div>
    `;
  }

  // ユーティリティ関数
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getTranslation(key) {
    return this.getNestedValue(this.translations[this.currentLanguage], key) || key;
  }

  calculateEnergyLevel(settings) {
    const energyMap = {
      'slow': 0.3, 'medium': 0.6, 'fast': 0.8, 'veryFast': 1.0
    };
    return energyMap[settings.tempo] || 0.6;
  }

  estimateFileSize(settings) {
    const duration = { 'short': 30, 'medium': 60, 'long': 120, 'extended': 180 }[settings.duration] || 60;
    const bitrate = 128; // kbps
    return Math.floor(duration * bitrate / 8); // KB
  }

  displayCharacteristics(characteristics) {
    // 特性表示の実装
    const charArea = document.getElementById('characteristics-area');
    if (charArea) {
      charArea.innerHTML = `
        <div class="characteristic">
          <span class="label">Energy:</span>
          <span class="value">${Math.round(characteristics.energy * 100)}%</span>
        </div>
        <div class="characteristic">
          <span class="label">File Size:</span>
          <span class="value">~${characteristics.estimatedFileSize}KB</span>
        </div>
      `;
    } else {
      // フォールバック: コンソールに表示
      console.log('Music characteristics:', characteristics);
    }
  }

  /**
   * 音楽ジェネレーターが利用可能になるまで待機
   */
  async waitForMusicGenerator() {
    let attempts = 0;
    const maxAttempts = 50; // 最大5秒待機
    
    while (!window.musicGenerator && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (window.musicGenerator) {
      this.musicGenerator = window.musicGenerator;
      console.log('Music generator initialized successfully');
    } else {
      console.warn('Music generator failed to initialize within timeout');
      // フォールバック: 基本的な音楽ジェネレーターを作成
      this.createFallbackMusicGenerator();
    }
  }

  /**
   * フォールバック用の基本音楽ジェネレーター
   */
  createFallbackMusicGenerator() {
    this.musicGenerator = {
      audioContext: new (window.AudioContext || window.webkitAudioContext)(),
      async generateMusic(settings) {
        // 簡易的な音楽データを返す
        return {
          audioData: new Float32Array(44100), // 1秒のサイレンス
          waveform: new Array(100).fill(0),
          params: settings,
          metadata: {
            duration: 30,
            quality: 'fallback'
          }
        };
      },
      exportMusic(musicData, format) {
        // 基本的なエクスポート機能
        const audioData = musicData.audioData || new Float32Array(44100);
        const wavData = this.encodeBasicWAV(audioData);
        return {
          blob: new Blob([wavData], { type: 'audio/wav' }),
          filename: `fallback-music-${Date.now()}.wav`,
          metadata: musicData.metadata
        };
      },
      encodeBasicWAV(audioData) {
        const length = audioData.length;
        const buffer = new ArrayBuffer(44 + length * 2);
        const view = new DataView(buffer);
        
        // 簡易WAVヘッダー
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
    };
  }
}

// DOM読み込み完了後にUI初期化
document.addEventListener('DOMContentLoaded', () => {
  window.musicGeneratorUI = new MusicGeneratorUI();
});
