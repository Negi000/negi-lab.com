/**
 * 高品質BGM生成UI（オンデマンド読み込み対応版）
 */
class RealisticToneUI {
  constructor(engine) {
    this.engine = engine;
    this.currentAudio = null;
    this.isPlaying = false;
    this.currentSettings = {};
    this.translations = {};
    this.currentLanguage = 'ja';
    this.loadingInstruments = new Set();
    
    // UI要素の参照
    this.elements = {};
    
    this.initializeElements();
    this.setupEventListeners();
    this.loadTranslations();
  }

  /**
   * UI要素の初期化
   */
  initializeElements() {
    this.elements = {
      // 基本コントロール
      genreSelect: document.getElementById('genre-select'),
      moodSelect: document.getElementById('mood-select'),
      tempoRange: document.getElementById('tempo-range'),
      tempoValue: document.getElementById('tempo-value'),
      durationRange: document.getElementById('duration-range'),
      durationValue: document.getElementById('duration-value'),
      
      // 楽器選択
      instrumentCheckboxes: document.querySelectorAll('input[name="instruments"]'),
      
      // 生成とコントロール
      generateBtn: document.getElementById('generate-music'),
      playBtn: document.getElementById('play-music'),
      pauseBtn: document.getElementById('pause-music'),
      stopBtn: document.getElementById('stop-music'),
      downloadBtn: document.getElementById('download-music'),
      
      // 状態表示
      statusDiv: document.getElementById('generation-status'),
      progressBar: document.getElementById('progress-bar'),
      instrumentStatus: document.getElementById('instrument-status'),
      waveformCanvas: document.getElementById('waveform-canvas'),
      
      // プリセット
      presetSelect: document.getElementById('preset-select'),
      
      // アドバンスド設定
      keySelect: document.getElementById('key-select'),
      scaleSelect: document.getElementById('scale-select'),
      
      // 言語切り替え
      languageSelect: document.getElementById('language-select'),
      
      // 楽器読み込み進捗
      loadingProgress: document.getElementById('loading-progress'),
      loadingMessage: document.getElementById('loading-message')
    };

    // 見つからない要素の警告
    Object.keys(this.elements).forEach(key => {
      if (!this.elements[key] || (this.elements[key].length === 0)) {
        console.warn(`UI element not found: ${key}`);
      }
    });
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // 生成ボタン
    if (this.elements.generateBtn) {
      this.elements.generateBtn.addEventListener('click', () => this.generateMusic());
    }

    // 再生コントロール
    if (this.elements.playBtn) {
      this.elements.playBtn.addEventListener('click', () => this.playMusic());
    }
    if (this.elements.pauseBtn) {
      this.elements.pauseBtn.addEventListener('click', () => this.pauseMusic());
    }
    if (this.elements.stopBtn) {
      this.elements.stopBtn.addEventListener('click', () => this.stopMusic());
    }
    if (this.elements.downloadBtn) {
      this.elements.downloadBtn.addEventListener('click', () => this.downloadMusic());
    }

    // 範囲入力の値表示
    if (this.elements.tempoRange && this.elements.tempoValue) {
      this.elements.tempoRange.addEventListener('input', (e) => {
        this.elements.tempoValue.textContent = e.target.value;
      });
    }
    
    if (this.elements.durationRange && this.elements.durationValue) {
      this.elements.durationRange.addEventListener('input', (e) => {
        const minutes = Math.floor(e.target.value / 60);
        const seconds = e.target.value % 60;
        this.elements.durationValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      });
    }

    // プリセット選択
    if (this.elements.presetSelect) {
      this.elements.presetSelect.addEventListener('change', (e) => {
        this.applyPreset(e.target.value);
      });
    }

    // 言語選択
    if (this.elements.languageSelect) {
      this.elements.languageSelect.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }

    // 楽器選択の変更監視
    if (this.elements.instrumentCheckboxes) {
      this.elements.instrumentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          this.updateInstrumentPreview();
        });
      });
    }

    // キーボードショートカット
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            this.generateMusic();
            break;
          case ' ':
            e.preventDefault();
            if (this.isPlaying) {
              this.pauseMusic();
            } else {
              this.playMusic();
            }
            break;
        }
      }
    });
  }

  /**
   * 翻訳の読み込み
   */
  loadTranslations() {
    if (typeof window.musicGeneratorTranslations !== 'undefined') {
      this.translations = window.musicGeneratorTranslations;
    } else {
      console.warn('翻訳データが見つかりません');
      this.translations = {
        ja: {
          generating: '生成中...',
          loading_instruments: '楽器を読み込み中...',
          completed: '生成完了',
          error: 'エラーが発生しました',
          play: '再生',
          pause: '一時停止',
          stop: '停止',
          download: 'ダウンロード',
          not_loaded: '未読み込み',
          loading: '読み込み中',
          loaded: '読み込み済み',
          fallback: 'フォールバック'
        }
      };
    }
  }

  /**
   * 翻訳テキストの取得
   */
  getTranslation(key, fallback = key) {
    try {
      return this.translations[this.currentLanguage]?.[key] || 
             this.translations['ja']?.[key] || 
             fallback;
    } catch (error) {
      return fallback;
    }
  }

  /**
   * 言語変更
   */
  changeLanguage(language) {
    this.currentLanguage = language;
    this.updateUITexts();
  }

  /**
   * UIテキストの更新
   */
  updateUITexts() {
    const textElements = {
      'generate-music': 'generate',
      'play-music': 'play',
      'pause-music': 'pause',
      'stop-music': 'stop',
      'download-music': 'download'
    };

    Object.keys(textElements).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        const key = textElements[id];
        element.textContent = this.getTranslation(key, element.textContent);
      }
    });
  }

  /**
   * 楽器状態の表示（オンデマンド版）
   */
  displayInstrumentStatus() {
    if (!this.elements.instrumentStatus) return;

    const instrumentsList = this.engine.getAvailableInstrumentsList();
    
    let html = '<div class="instrument-status-grid">';
    
    instrumentsList.forEach(instrument => {
      const statusClass = instrument.status === 'loaded' ? 'loaded' : 
                         instrument.status === 'fallback' ? 'fallback' : 
                         instrument.status === 'loading' ? 'loading' : 'not-loaded';
      
      let statusIcon = '⚪'; // 未読み込み
      if (instrument.status === 'loaded') statusIcon = '✅';
      else if (instrument.status === 'fallback') statusIcon = '⚠️';
      else if (instrument.status === 'loading') statusIcon = '⏳';
      
      const statusText = this.getTranslation(instrument.status, instrument.status);
      
      html += `
        <div class="instrument-item ${statusClass}">
          <span class="status-icon">${statusIcon}</span>
          <span class="instrument-name">${instrument.name}</span>
          <span class="category-badge">${instrument.category}</span>
          <span class="status-text">${statusText}</span>
        </div>
      `;
    });
    
    html += '</div>';
    this.elements.instrumentStatus.innerHTML = html;
  }

  /**
   * 楽器読み込み進捗の表示
   */
  displayLoadingProgress(current, total, instrumentName = '') {
    if (!this.elements.loadingProgress) return;

    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    
    if (this.elements.loadingMessage) {
      this.elements.loadingMessage.textContent = 
        `${this.getTranslation('loading_instruments', '楽器を読み込み中...')} ${instrumentName} (${current}/${total})`;
    }
    
    // プログレスバーの更新
    const progressBar = this.elements.loadingProgress.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    
    // 完了時は非表示
    if (current >= total) {
      setTimeout(() => {
        if (this.elements.loadingProgress) {
          this.elements.loadingProgress.style.display = 'none';
        }
      }, 1000);
    } else {
      this.elements.loadingProgress.style.display = 'block';
    }
  }

  /**
   * 楽器のプレビュー更新
   */
  updateInstrumentPreview() {
    const selectedInstruments = this.getSelectedInstruments();
    console.log('Selected instruments for preview:', selectedInstruments);
    
    // 選択された楽器の状態を表示
    this.displayInstrumentStatus();
  }

  /**
   * 選択された楽器の取得
   */
  getSelectedInstruments() {
    if (!this.elements.instrumentCheckboxes) return [];
    
    return Array.from(this.elements.instrumentCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
  }

  /**
   * 音楽生成（オンデマンド読み込み対応）
   */
  async generateMusic() {
    try {
      this.setUIState('generating');
      this.currentSettings = this.getSettings();
      
      console.log('UI: Starting music generation with settings:', this.currentSettings);
      
      // 楽器読み込み進捗の初期化
      const requiredInstruments = this.currentSettings.instruments || [];
      this.displayLoadingProgress(0, requiredInstruments.length);
      
      // 読み込み進捗のコールバック
      let loadedCount = 0;
      const onInstrumentLoaded = (instrumentName) => {
        loadedCount++;
        this.displayLoadingProgress(loadedCount, requiredInstruments.length, instrumentName);
        this.displayInstrumentStatus(); // 状態を更新
      };
      
      // 音楽生成（内部で楽器がオンデマンド読み込みされる）
      const result = await this.engine.generateMusic(this.currentSettings);
      
      if (result.success) {
        this.currentAudio = result.audioData;
        this.displayWaveform(result.waveform);
        this.setUIState('completed');
        this.showStatus(this.getTranslation('generation_complete', '生成完了'), 'success');
        
        // メタデータの表示
        if (result.metadata) {
          this.displayMetadata(result.metadata);
        }
        
        // 楽器状態の最終更新
        this.displayInstrumentStatus();
      } else {
        throw new Error(result.error || 'Generation failed');
      }
      
    } catch (error) {
      console.error('音楽生成エラー:', error);
      this.setUIState('error');
      this.showStatus(this.getTranslation('generation_error', 'エラーが発生しました') + ': ' + error.message, 'error');
    }
  }

  /**
   * 設定の取得
   */
  getSettings() {
    const settings = {};
    
    // 基本設定
    if (this.elements.genreSelect) {
      settings.genre = this.elements.genreSelect.value;
    }
    if (this.elements.moodSelect) {
      settings.mood = this.elements.moodSelect.value;
    }
    if (this.elements.tempoRange) {
      settings.tempo = parseInt(this.elements.tempoRange.value);
    }
    if (this.elements.durationRange) {
      settings.duration = parseInt(this.elements.durationRange.value);
    }
    
    // 楽器選択
    settings.instruments = this.getSelectedInstruments();
    
    // アドバンスド設定
    if (this.elements.keySelect) {
      settings.key = this.elements.keySelect.value;
    }
    if (this.elements.scaleSelect) {
      settings.scale = this.elements.scaleSelect.value;
    }
    
    return settings;
  }

  /**
   * プリセットの適用
   */
  applyPreset(presetName) {
    const presets = {
      'chill-pop': {
        genre: 'pop',
        mood: 'relaxed',
        tempo: 100,
        duration: 30,
        instruments: ['piano', 'guitar-acoustic', 'bass-electric']
      },
      'upbeat-rock': {
        genre: 'rock',
        mood: 'energetic',
        tempo: 140,
        duration: 45,
        instruments: ['guitar-electric', 'bass-electric', 'piano']
      },
      'smooth-jazz': {
        genre: 'jazz',
        mood: 'smooth',
        tempo: 90,
        duration: 60,
        instruments: ['piano', 'saxophone', 'bass-electric']
      },
      'classical-ensemble': {
        genre: 'classical',
        mood: 'peaceful',
        tempo: 70,
        duration: 90,
        instruments: ['piano', 'violin', 'cello']
      },
      'orchestral-wind': {
        genre: 'classical',
        mood: 'dramatic',
        tempo: 85,
        duration: 75,
        instruments: ['flute', 'clarinet', 'trumpet', 'french-horn']
      }
    };

    const preset = presets[presetName];
    if (!preset) return;

    // UI要素に設定を反映
    if (this.elements.genreSelect) this.elements.genreSelect.value = preset.genre;
    if (this.elements.moodSelect) this.elements.moodSelect.value = preset.mood;
    if (this.elements.tempoRange) this.elements.tempoRange.value = preset.tempo;
    if (this.elements.durationRange) this.elements.durationRange.value = preset.duration;
    
    // 値表示の更新
    if (this.elements.tempoValue) this.elements.tempoValue.textContent = preset.tempo;
    if (this.elements.durationValue) {
      const minutes = Math.floor(preset.duration / 60);
      const seconds = preset.duration % 60;
      this.elements.durationValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // 楽器選択の更新
    if (this.elements.instrumentCheckboxes) {
      this.elements.instrumentCheckboxes.forEach(cb => {
        cb.checked = preset.instruments.includes(cb.value);
      });
    }
    
    // プレビュー更新
    this.updateInstrumentPreview();
  }

  /**
   * 音楽再生
   */
  async playMusic() {
    try {
      if (!this.currentAudio) {
        this.showStatus(this.getTranslation('no_music', '生成された音楽がありません'), 'warning');
        return;
      }

      if (this.currentAudio instanceof Blob) {
        const url = URL.createObjectURL(this.currentAudio);
        const audio = new Audio(url);
        
        audio.onended = () => {
          this.isPlaying = false;
          this.updatePlaybackControls();
        };
        
        await audio.play();
        this.isPlaying = true;
        this.updatePlaybackControls();
        
        if (this.audioElement) {
          this.audioElement.pause();
        }
        this.audioElement = audio;
      } else {
        if (this.engine.currentComposition) {
          await this.engine.playComposition(this.engine.currentComposition.composition);
          this.isPlaying = true;
          this.updatePlaybackControls();
        }
      }
      
    } catch (error) {
      console.error('再生エラー:', error);
      this.showStatus(this.getTranslation('playback_error', '再生エラー'), 'error');
    }
  }

  /**
   * 音楽一時停止
   */
  pauseMusic() {
    try {
      if (this.audioElement) {
        this.audioElement.pause();
      }
      this.engine.stopPlayback();
      this.isPlaying = false;
      this.updatePlaybackControls();
    } catch (error) {
      console.error('一時停止エラー:', error);
    }
  }

  /**
   * 音楽停止
   */
  stopMusic() {
    try {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      }
      this.engine.stopPlayback();
      this.isPlaying = false;
      this.updatePlaybackControls();
    } catch (error) {
      console.error('停止エラー:', error);
    }
  }

  /**
   * 音楽ダウンロード
   */
  downloadMusic() {
    try {
      if (!this.currentAudio) {
        this.showStatus(this.getTranslation('no_music', 'ダウンロードする音楽がありません'), 'warning');
        return;
      }

      if (this.currentAudio instanceof Blob) {
        const url = URL.createObjectURL(this.currentAudio);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-music-${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus(this.getTranslation('download_started', 'ダウンロードを開始しました'), 'success');
      }
      
    } catch (error) {
      console.error('ダウンロードエラー:', error);
      this.showStatus(this.getTranslation('download_error', 'ダウンロードエラー'), 'error');
    }
  }

  /**
   * 再生コントロールの更新
   */
  updatePlaybackControls() {
    if (this.elements.playBtn) {
      this.elements.playBtn.disabled = this.isPlaying || !this.currentAudio;
    }
    if (this.elements.pauseBtn) {
      this.elements.pauseBtn.disabled = !this.isPlaying;
    }
    if (this.elements.stopBtn) {
      this.elements.stopBtn.disabled = !this.currentAudio;
    }
    if (this.elements.downloadBtn) {
      this.elements.downloadBtn.disabled = !this.currentAudio;
    }
  }

  /**
   * UI状態の設定
   */
  setUIState(state) {
    const states = {
      'idle': {
        generateBtn: false,
        statusText: this.getTranslation('ready', '準備完了')
      },
      'generating': {
        generateBtn: true,
        statusText: this.getTranslation('generating', '生成中...')
      },
      'completed': {
        generateBtn: false,
        statusText: this.getTranslation('completed', '生成完了')
      },
      'error': {
        generateBtn: false,
        statusText: this.getTranslation('error', 'エラー')
      }
    };

    const currentState = states[state] || states['idle'];
    
    if (this.elements.generateBtn) {
      this.elements.generateBtn.disabled = currentState.generateBtn;
    }
    
    this.updatePlaybackControls();
  }

  /**
   * ステータス表示
   */
  showStatus(message, type = 'info') {
    if (!this.elements.statusDiv) return;

    this.elements.statusDiv.className = `status ${type}`;
    this.elements.statusDiv.textContent = message;
    this.elements.statusDiv.style.display = 'block';
    
    // 自動で非表示にする
    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        if (this.elements.statusDiv) {
          this.elements.statusDiv.style.display = 'none';
        }
      }, 3000);
    }
  }

  /**
   * 波形の表示
   */
  displayWaveform(waveformData) {
    if (!this.elements.waveformCanvas || !waveformData) return;

    try {
      const canvas = this.elements.waveformCanvas;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      waveformData.forEach((amplitude, index) => {
        const x = (index / waveformData.length) * width;
        const y = centerY + (amplitude * centerY * 0.8);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
    } catch (error) {
      console.error('波形表示エラー:', error);
    }
  }

  /**
   * メタデータの表示
   */
  displayMetadata(metadata) {
    const metadataDiv = document.getElementById('metadata-display');
    if (!metadataDiv) return;

    const html = `
      <div class="metadata-grid">
        <div class="metadata-item">
          <span class="label">${this.getTranslation('duration', '長さ')}:</span>
          <span class="value">${this.formatDuration(metadata.duration)}</span>
        </div>
        <div class="metadata-item">
          <span class="label">${this.getTranslation('tempo', 'テンポ')}:</span>
          <span class="value">${metadata.tempo} BPM</span>
        </div>
        <div class="metadata-item">
          <span class="label">${this.getTranslation('key', 'キー')}:</span>
          <span class="value">${metadata.key} ${metadata.scale}</span>
        </div>
        <div class="metadata-item">
          <span class="label">${this.getTranslation('genre', 'ジャンル')}:</span>
          <span class="value">${this.getTranslation('genre_' + metadata.genre, metadata.genre)}</span>
        </div>
        <div class="metadata-item">
          <span class="label">${this.getTranslation('instruments', '楽器')}:</span>
          <span class="value">${metadata.instruments.length}個</span>
        </div>
      </div>
    `;
    
    metadataDiv.innerHTML = html;
  }

  /**
   * 時間のフォーマット
   */
  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * 初期化
   */
  initialize() {
    this.setUIState('idle');
    this.displayInstrumentStatus();
    this.updateUITexts();
    
    // 楽器状態を定期的に更新
    setInterval(() => {
      this.displayInstrumentStatus();
    }, 2000);
    
    console.log('RealisticToneUI initialized with on-demand loading support');
  }
}

// グローバルに公開
window.RealisticToneUI = RealisticToneUI;
