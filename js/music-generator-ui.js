/**
 * 高品質音楽生成UI（統合版）
 * - シンプルで直感的な操作
 * - 詳細設定をアコーディオンに格納
 * - プリセット対応
 * - 楽器読み込み状況の非表示化
 */
class RealisticToneUI {
  constructor(engine) {
    this.engine = engine;
    this.currentAudio = null;
    this.isPlaying = false;
    this.currentSettings = {};
    this.translations = {};
    this.currentLanguage = 'ja';
    this.currentComposition = null;
    
    // UI要素の参照
    this.elements = {};
    
    this.initializeElements();
    this.setupEventListeners();
    this.setupAccordion();
    this.generateInstrumentSelection();
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
      descriptionInput: document.getElementById('description-input'),
      tempoRange: document.getElementById('tempo-range'),
      tempoValue: document.getElementById('tempo-value'),
      durationRange: document.getElementById('duration-range'),
      durationValue: document.getElementById('duration-value'),
      complexitySelect: document.getElementById('complexity-select'),
      
      // プリセットボタン
      presetButtons: document.querySelectorAll('.preset-btn'),
      
      // 詳細設定（アコーディオン）
      advancedToggle: document.getElementById('advanced-toggle'),
      advancedContent: document.getElementById('advanced-content'),
      advancedIcon: document.getElementById('advanced-icon'),
      instrumentSelection: document.getElementById('instrument-selection'),
      keySelect: document.getElementById('key-select'),
      scaleSelect: document.getElementById('scale-select'),
      
      // 生成・再生コントロール
      generateMusic: document.getElementById('generate-music'),
      playMusic: document.getElementById('play-music'),
      pauseMusic: document.getElementById('pause-music'),
      stopMusic: document.getElementById('stop-music'),
      downloadMusic: document.getElementById('download-music'),
      
      // 表示エリア
      generationStatus: document.getElementById('generation-status'),
      waveformCanvas: document.getElementById('waveform-canvas'),
      metadataDisplay: document.getElementById('metadata-display'),
      playbackStatus: document.getElementById('playback-status'),
      playbackProgress: document.getElementById('playback-progress'),
      playbackTime: document.getElementById('playback-time'),
      resultSection: document.getElementById('result-section'),
      metadataArea: document.getElementById('metadata-area'),
      resultKey: document.getElementById('result-key'),
      resultTempo: document.getElementById('result-tempo'),
      resultDuration: document.getElementById('result-duration'),
      resultProgression: document.getElementById('result-progression'),
      technicalDetails: document.getElementById('technical-details')
    };
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // スライダーの値表示更新
    if (this.elements.tempoRange) {
      this.elements.tempoRange.addEventListener('input', (e) => {
        if (this.elements.tempoValue) {
          this.elements.tempoValue.textContent = `${e.target.value} BPM`;
        }
      });
    }

    if (this.elements.durationRange) {
      this.elements.durationRange.addEventListener('input', (e) => {
        if (this.elements.durationValue) {
          const seconds = parseInt(e.target.value);
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          this.elements.durationValue.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
      });
    }

    // プリセットボタン
    this.elements.presetButtons.forEach(button => {
      button.addEventListener('click', () => {
        const preset = button.getAttribute('data-preset');
        this.applyPreset(preset);
      });
    });

    // 生成・再生ボタン
    if (this.elements.generateMusic) {
      this.elements.generateMusic.addEventListener('click', () => this.generateMusic());
    }

    if (this.elements.playMusic) {
      this.elements.playMusic.addEventListener('click', () => this.playMusic());
    }

    if (this.elements.pauseMusic) {
      this.elements.pauseMusic.addEventListener('click', () => this.pauseMusic());
    }

    if (this.elements.stopMusic) {
      this.elements.stopMusic.addEventListener('click', () => this.stopMusic());
    }

    if (this.elements.downloadMusic) {
      this.elements.downloadMusic.addEventListener('click', () => this.downloadMusic());
    }
  }

  /**
   * アコーディオンの設定
   */
  setupAccordion() {
    if (this.elements.advancedToggle && this.elements.advancedContent) {
      this.elements.advancedToggle.addEventListener('click', () => {
        const isExpanded = this.elements.advancedToggle.getAttribute('aria-expanded') === 'true';
        
        this.elements.advancedToggle.setAttribute('aria-expanded', !isExpanded);
        
        if (isExpanded) {
          this.elements.advancedContent.classList.add('hidden');
        } else {
          this.elements.advancedContent.classList.remove('hidden');
        }
      });
    }
  }

  /**
   * 楽器選択UIの生成
   */
  generateInstrumentSelection() {
    if (!this.elements.instrumentSelection) return;

    const instruments = this.engine.getAvailableInstrumentsList();
    const categories = {};

    // カテゴリ別に分類
    instruments.forEach(key => {
      const instrument = this.engine.availableInstruments[key];
      if (!categories[instrument.category]) {
        categories[instrument.category] = [];
      }
      categories[instrument.category].push({key, ...instrument});
    });

    // UI生成
    this.elements.instrumentSelection.innerHTML = '';
    
    Object.entries(categories).forEach(([category, categoryInstruments]) => {
      categoryInstruments.forEach(instrument => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'instrument-card p-3 rounded-lg border text-center transition-all cursor-pointer hover:bg-gray-50';
        button.setAttribute('data-instrument', instrument.key);
        button.innerHTML = `
          <div class="text-sm font-medium">${instrument.name}</div>
          <div class="text-xs text-gray-500 mt-1">${this.getCategoryName(category)}</div>
        `;
        
        button.addEventListener('click', () => {
          button.classList.toggle('selected');
        });
        
        this.elements.instrumentSelection.appendChild(button);
      });
    });
  }

  /**
   * カテゴリ名の日本語変換
   */
  getCategoryName(category) {
    const categoryNames = {
      'keyboard': '鍵盤楽器',
      'strings': '弦楽器',
      'wind': '管楽器',
      'percussion': '打楽器',
      'bass': 'ベース'
    };
    return categoryNames[category] || category;
  }

  /**
   * プリセットの適用
   */
  applyPreset(preset) {
    const presets = {
      'chill-pop': {
        genre: 'pop',
        mood: 'calm',
        tempo: 100,
        duration: 45,
        complexity: 'normal',
        description: 'ゆったりとしたポップスで、カフェのような雰囲気',
        instruments: ['piano', 'guitar-acoustic', 'bass-electric']
      },
      'upbeat-rock': {
        genre: 'rock',
        mood: 'energetic',
        tempo: 140,
        duration: 60,
        complexity: 'complex',
        description: 'エネルギッシュなロック、ドライブにぴったり',
        instruments: ['guitar-electric', 'bass-electric', 'piano']
      },
      'smooth-jazz': {
        genre: 'jazz',
        mood: 'romantic',
        tempo: 90,
        duration: 40,
        complexity: 'complex',
        description: 'スムースジャズ、夜のバーのような雰囲気',
        instruments: ['piano', 'saxophone', 'bass-electric']
      },
      'classical-ensemble': {
        genre: 'classical',
        mood: 'calm',
        tempo: 80,
        duration: 90,
        complexity: 'complex',
        description: 'クラシック室内楽、上品で落ち着いた',
        instruments: ['piano', 'violin', 'cello']
      }
    };

    const presetData = presets[preset];
    if (!presetData) return;

    // 基本設定を適用
    if (this.elements.genreSelect) this.elements.genreSelect.value = presetData.genre;
    if (this.elements.moodSelect) this.elements.moodSelect.value = presetData.mood;
    if (this.elements.tempoRange) {
      this.elements.tempoRange.value = presetData.tempo;
      if (this.elements.tempoValue) {
        this.elements.tempoValue.textContent = `${presetData.tempo} BPM`;
      }
    }
    if (this.elements.durationRange) {
      this.elements.durationRange.value = presetData.duration;
      if (this.elements.durationValue) {
        const minutes = Math.floor(presetData.duration / 60);
        const seconds = presetData.duration % 60;
        this.elements.durationValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    if (this.elements.complexitySelect) this.elements.complexitySelect.value = presetData.complexity;
    if (this.elements.descriptionInput) this.elements.descriptionInput.value = presetData.description;

    // 楽器選択をクリア後、プリセットの楽器を選択
    this.clearInstrumentSelection();
    presetData.instruments.forEach(instrumentKey => {
      this.selectInstrument(instrumentKey);
    });

    console.log(`Applied preset: ${preset}`, presetData);
  }

  /**
   * 楽器選択をクリア
   */
  clearInstrumentSelection() {
    const buttons = this.elements.instrumentSelection?.querySelectorAll('.instrument-card');
    buttons?.forEach(button => button.classList.remove('selected'));
  }

  /**
   * 楽器を選択
   */
  selectInstrument(instrumentKey) {
    const button = this.elements.instrumentSelection?.querySelector(`[data-instrument="${instrumentKey}"]`);
    if (button) {
      button.classList.add('selected');
    }
  }

  /**
   * 選択された楽器を取得
   */
  getSelectedInstruments() {
    const selectedButtons = this.elements.instrumentSelection?.querySelectorAll('.instrument-card.selected');
    if (!selectedButtons || selectedButtons.length === 0) {
      return ['piano']; // デフォルト楽器
    }
    
    return Array.from(selectedButtons).map(button => 
      button.getAttribute('data-instrument')
    );
  }

  /**
   * 現在の設定を取得
   */
  getCurrentSettings() {
    return {
      genre: this.elements.genreSelect?.value || 'pop',
      mood: this.elements.moodSelect?.value || 'happy',
      description: this.elements.descriptionInput?.value || '',
      tempo: parseInt(this.elements.tempoRange?.value || '120'),
      duration: parseInt(this.elements.durationRange?.value || '30'),
      complexity: this.elements.complexitySelect?.value || 'normal',
      key: this.elements.keySelect?.value || 'C',
      scale: this.elements.scaleSelect?.value || 'major',
      instruments: this.getSelectedInstruments()
    };
  }

  /**
   * ステータスメッセージの表示
   */
  showStatus(message, type = 'info') {
    if (!this.elements.generationStatus) return;

    this.elements.generationStatus.className = `mb-4 p-3 rounded-lg status ${type}`;
    this.elements.generationStatus.textContent = message;
    this.elements.generationStatus.classList.remove('hidden');
  }

  /**
   * ステータスメッセージを隠す
   */
  hideStatus() {
    if (this.elements.generationStatus) {
      this.elements.generationStatus.classList.add('hidden');
    }
  }

  /**
   * 音楽生成
   */
  async generateMusic() {
    try {
      this.showStatus('音楽を生成しています...', 'info');
      
      // ボタンを無効化
      if (this.elements.generateMusic) {
        this.elements.generateMusic.disabled = true;
        this.elements.generateMusic.querySelector('.loading-text').textContent = '生成中...';
      }

      const settings = this.getCurrentSettings();
      console.log('Generating music with settings:', settings);

      // 必要な楽器をオンデマンド読み込み
      for (const instrumentKey of settings.instruments) {
        await this.engine.loadInstrument(instrumentKey);
      }

      // 音楽生成
      const result = await this.engine.generateMusic(settings);
      
      this.currentComposition = result;
      this.showGenerationResult(result);
      
      // 再生ボタンを有効化
      this.enablePlaybackControls(true);
      
      this.showStatus('音楽が生成されました！', 'success');
      
      console.log('Music generation completed:', result);

    } catch (error) {
      console.error('Music generation failed:', error);
      this.showStatus(`エラー: ${error.message}`, 'error');
    } finally {
      // ボタンを復元
      if (this.elements.generateMusic) {
        this.elements.generateMusic.disabled = false;
        this.elements.generateMusic.querySelector('.loading-text').textContent = '🎵 音楽を生成';
      }
    }
  }

  /**
   * 生成結果の表示
   */
  showGenerationResult(result) {
    // 波形表示
    this.drawWaveform(result.waveform || []);
    
    // メタデータ表示
    this.updateMetadata(result.metadata || {});
    
    // 結果セクションを表示
    if (this.elements.resultSection) {
      this.elements.resultSection.classList.remove('hidden');
    }
  }

  /**
   * 波形表示
   */
  drawWaveform(waveformData) {
    if (!this.elements.waveformCanvas || !waveformData.length) return;

    const canvas = this.elements.waveformCanvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // キャンバスクリア
    ctx.clearRect(0, 0, width, height);

    // 波形描画
    ctx.strokeStyle = '#4ADE80';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const step = width / waveformData.length;
    waveformData.forEach((value, index) => {
      const x = index * step;
      const y = height / 2 + (value * height / 2);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }

  /**
   * メタデータ更新
   */
  updateMetadata(metadata) {
    if (this.elements.resultKey) this.elements.resultKey.textContent = metadata.key || '-';
    if (this.elements.resultTempo) this.elements.resultTempo.textContent = metadata.tempo ? `${metadata.tempo} BPM` : '-';
    if (this.elements.resultDuration) {
      const duration = metadata.duration || 0;
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      this.elements.resultDuration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    if (this.elements.resultProgression) this.elements.resultProgression.textContent = metadata.progression || '-';
  }

  /**
   * 再生コントロールの有効/無効
   */
  enablePlaybackControls(enable) {
    if (this.elements.playMusic) this.elements.playMusic.disabled = !enable;
    if (this.elements.downloadMusic) this.elements.downloadMusic.disabled = !enable;
  }

  /**
   * 音楽再生
   */
  async playMusic() {
    if (!this.currentComposition) {
      this.showStatus('再生する音楽がありません', 'warning');
      return;
    }

    try {
      await this.engine.playMusic(this.currentComposition);
      this.isPlaying = true;
      
      // 再生状態のUI更新
      if (this.elements.playMusic) this.elements.playMusic.disabled = true;
      if (this.elements.pauseMusic) this.elements.pauseMusic.disabled = false;
      if (this.elements.stopMusic) this.elements.stopMusic.disabled = false;
      
      if (this.elements.playbackStatus) {
        this.elements.playbackStatus.classList.remove('hidden');
      }
      
      this.showStatus('再生中...', 'info');
      
    } catch (error) {
      console.error('Playback failed:', error);
      this.showStatus(`再生エラー: ${error.message}`, 'error');
    }
  }

  /**
   * 音楽一時停止
   */
  pauseMusic() {
    this.engine.stopMusic();
    this.isPlaying = false;
    
    // UI更新
    if (this.elements.playMusic) this.elements.playMusic.disabled = false;
    if (this.elements.pauseMusic) this.elements.pauseMusic.disabled = true;
    
    this.showStatus('一時停止中', 'warning');
  }

  /**
   * 音楽停止
   */
  stopMusic() {
    this.engine.stopMusic();
    this.isPlaying = false;
    
    // UI更新
    if (this.elements.playMusic) this.elements.playMusic.disabled = false;
    if (this.elements.pauseMusic) this.elements.pauseMusic.disabled = true;
    if (this.elements.stopMusic) this.elements.stopMusic.disabled = true;
    
    if (this.elements.playbackStatus) {
      this.elements.playbackStatus.classList.add('hidden');
    }
    
    this.showStatus('停止しました', 'info');
  }

  /**
   * 音楽ダウンロード
   */
  downloadMusic() {
    if (!this.currentComposition) {
      this.showStatus('ダウンロードする音楽がありません', 'warning');
      return;
    }

    try {
      const wavData = this.engine.exportToWav(this.currentComposition);
      const blob = new Blob([wavData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-music-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      this.showStatus('ダウンロードを開始しました', 'success');
      
    } catch (error) {
      console.error('Download failed:', error);
      this.showStatus(`ダウンロードエラー: ${error.message}`, 'error');
    }
  }

  /**
   * 翻訳読み込み
   */
  loadTranslations() {
    if (typeof musicGeneratorTranslations !== 'undefined') {
      this.translations = musicGeneratorTranslations;
    }
  }

  /**
   * 初期化
   */
  initialize() {
    console.log('RealisticToneUI initialized');
    
    // 初期値設定
    if (this.elements.tempoRange) {
      this.elements.tempoRange.dispatchEvent(new Event('input'));
    }
    if (this.elements.durationRange) {
      this.elements.durationRange.dispatchEvent(new Event('input'));
    }
  }
}

// グローバルに公開
window.RealisticToneUI = RealisticToneUI;