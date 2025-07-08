/**
 * 高品質BGM生成UI（シンプル版）
 * - 楽器読み込み状況表示を削除
 * - 詳細設定をアコーディオンに格納
 * - よりシンプルで直感的なUI
 */
class RealisticToneUI {
  constructor(engine) {
    this.engine = engine;
    this.currentAudio = null;
    this.isPlaying = false;
    this.currentSettings = {};
    this.translations = {};
    this.currentLanguage = 'ja';
    
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
      structureSelect: document.getElementById('structure-select'),
      
      // 生成とコントロール
      generateBtn: document.getElementById('generate-music'),
      playBtn: document.getElementById('play-music'),
      pauseBtn: document.getElementById('pause-music'),
      stopBtn: document.getElementById('stop-music'),
      downloadBtn: document.getElementById('download-music'),
      
      // 状態表示
      statusDiv: document.getElementById('generation-status'),
      progressBar: document.getElementById('progress-bar'),
      waveformCanvas: document.getElementById('waveform-canvas'),
      
      // 結果表示
      resultSection: document.getElementById('result-section'),
      playbackStatus: document.getElementById('playback-status'),
      
      // 言語切り替え
      languageSelect: document.getElementById('lang-switch')
    };

    // 見つからない要素の警告（デバッグ用）
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

    // 範囲入力の値表示更新
    if (this.elements.tempoRange && this.elements.tempoValue) {
      this.elements.tempoRange.addEventListener('input', (e) => {
        this.elements.tempoValue.textContent = `${e.target.value} BPM`;
      });
    }

    if (this.elements.durationRange && this.elements.durationValue) {
      this.elements.durationRange.addEventListener('input', (e) => {
        const minutes = Math.floor(e.target.value / 60);
        const seconds = e.target.value % 60;
        this.elements.durationValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      });
    }

    // プリセットボタン
    this.elements.presetButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.getAttribute('data-preset');
        this.applyPreset(preset);
      });
    });

    // 言語切り替え
    if (this.elements.languageSelect) {
      this.elements.languageSelect.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }
  }

  /**
   * アコーディオンの設定
   */
  setupAccordion() {
    if (this.elements.advancedToggle && this.elements.advancedContent) {
      this.elements.advancedToggle.addEventListener('click', () => {
        const isExpanded = this.elements.advancedContent.classList.contains('hidden');
        
        if (isExpanded) {
          // 開く
          this.elements.advancedContent.classList.remove('hidden');
          this.elements.advancedToggle.setAttribute('aria-expanded', 'true');
          if (this.elements.advancedIcon) {
            this.elements.advancedIcon.style.transform = 'rotate(180deg)';
          }
        } else {
          // 閉じる
          this.elements.advancedContent.classList.add('hidden');
          this.elements.advancedToggle.setAttribute('aria-expanded', 'false');
          if (this.elements.advancedIcon) {
            this.elements.advancedIcon.style.transform = 'rotate(0deg)';
          }
        }
      });
    }
  }

  /**
   * 楽器選択UIの動的生成
   */
  generateInstrumentSelection() {
    if (!this.elements.instrumentSelection || !this.engine) return;

    const instruments = this.engine.getAvailableInstruments();
    const container = this.elements.instrumentSelection;
    
    container.innerHTML = ''; // クリア

    instruments.forEach(instrument => {
      const checkbox = document.createElement('div');
      checkbox.className = 'flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors';
      
      checkbox.innerHTML = `
        <input 
          type="checkbox" 
          id="instrument-${instrument.id}" 
          name="instruments" 
          value="${instrument.id}"
          class="rounded border-gray-300 text-accent focus:ring-accent"
          ${instrument.default ? 'checked' : ''}
        />
        <label for="instrument-${instrument.id}" class="flex-1 text-sm font-medium text-gray-700">
          ${instrument.emoji} ${instrument.name}
        </label>
      `;
      
      container.appendChild(checkbox);
    });
  }

  /**
   * プリセットの適用
   */
  applyPreset(presetName) {
    const presets = {
      'chill-pop': {
        genre: 'pop',
        mood: 'calm',
        tempo: 110,
        complexity: 'simple',
        key: 'C',
        scale: 'major',
        description: 'リラックスできるチルポップ、カフェで流れるような優しい音楽'
      },
      'upbeat-rock': {
        genre: 'rock',
        mood: 'energetic',
        tempo: 140,
        complexity: 'normal',
        key: 'G',
        scale: 'major',
        description: 'エネルギッシュなロック、アップテンポで力強い'
      },
      'smooth-jazz': {
        genre: 'jazz',
        mood: 'romantic',
        tempo: 90,
        complexity: 'complex',
        key: 'F',
        scale: 'major',
        description: 'スムースジャズ、大人な雰囲気のロマンチックな音楽'
      },
      'classical-ensemble': {
        genre: 'classical',
        mood: 'calm',
        tempo: 100,
        complexity: 'complex',
        key: 'D',
        scale: 'major',
        description: 'クラシック音楽、オーケストラ風の上品で美しい音楽'
      }
    };

    const preset = presets[presetName];
    if (!preset) return;

    // UI要素に値を設定
    if (this.elements.genreSelect) this.elements.genreSelect.value = preset.genre;
    if (this.elements.moodSelect) this.elements.moodSelect.value = preset.mood;
    if (this.elements.tempoRange) {
      this.elements.tempoRange.value = preset.tempo;
      if (this.elements.tempoValue) {
        this.elements.tempoValue.textContent = `${preset.tempo} BPM`;
      }
    }
    if (this.elements.complexitySelect) this.elements.complexitySelect.value = preset.complexity;
    if (this.elements.keySelect) this.elements.keySelect.value = preset.key;
    if (this.elements.scaleSelect) this.elements.scaleSelect.value = preset.scale;
    if (this.elements.descriptionInput) this.elements.descriptionInput.value = preset.description;

    this.showStatus('プリセットを適用しました: ' + presetName, 'success');
  }

  /**
   * 音楽生成
   */
  async generateMusic() {
    try {
      this.showStatus('音楽を生成中...', 'info');
      this.setButtonsDisabled(true);

      // 設定の収集
      const settings = this.collectSettings();
      this.currentSettings = settings;

      console.log('Generating music with settings:', settings);

      // エンジンで音楽生成
      const result = await this.engine.generateMusic(settings);
      
      if (result && result.audioBuffer) {
        this.currentAudio = result.audioBuffer;
        this.showStatus('音楽の生成が完了しました！', 'success');
        this.updateResult(result);
        this.enablePlaybackControls(true);
      } else {
        throw new Error('音楽生成に失敗しました');
      }

    } catch (error) {
      console.error('Music generation failed:', error);
      this.showStatus('音楽生成中にエラーが発生しました: ' + error.message, 'error');
    } finally {
      this.setButtonsDisabled(false);
    }
  }

  /**
   * 設定の収集
   */
  collectSettings() {
    const settings = {
      genre: this.elements.genreSelect?.value || 'pop',
      mood: this.elements.moodSelect?.value || 'happy',
      description: this.elements.descriptionInput?.value || '',
      tempo: parseInt(this.elements.tempoRange?.value) || 120,
      duration: parseInt(this.elements.durationRange?.value) || 30,
      complexity: this.elements.complexitySelect?.value || 'normal',
      key: this.elements.keySelect?.value || 'C',
      scale: this.elements.scaleSelect?.value || 'major',
      structure: this.elements.structureSelect?.value || 'simple',
      instruments: []
    };

    // 選択された楽器を収集
    const instrumentCheckboxes = this.elements.instrumentSelection?.querySelectorAll('input[type="checkbox"]:checked');
    if (instrumentCheckboxes) {
      settings.instruments = Array.from(instrumentCheckboxes).map(cb => cb.value);
    }

    return settings;
  }

  /**
   * 再生
   */
  async playMusic() {
    if (!this.currentAudio) return;

    try {
      await this.engine.playAudio(this.currentAudio);
      this.isPlaying = true;
      this.updatePlaybackUI(true);
      this.showStatus('再生中...', 'info');
    } catch (error) {
      console.error('Playback failed:', error);
      this.showStatus('再生に失敗しました: ' + error.message, 'error');
    }
  }

  /**
   * 一時停止
   */
  async pauseMusic() {
    try {
      await this.engine.pauseAudio();
      this.isPlaying = false;
      this.updatePlaybackUI(false);
      this.showStatus('一時停止しました', 'info');
    } catch (error) {
      console.error('Pause failed:', error);
    }
  }

  /**
   * 停止
   */
  async stopMusic() {
    try {
      await this.engine.stopAudio();
      this.isPlaying = false;
      this.updatePlaybackUI(false);
      this.showStatus('停止しました', 'info');
    } catch (error) {
      console.error('Stop failed:', error);
    }
  }

  /**
   * ダウンロード
   */
  async downloadMusic() {
    if (!this.currentAudio) return;

    try {
      await this.engine.downloadAudio(this.currentAudio, 'generated-music.wav');
      this.showStatus('ダウンロードが開始されました', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      this.showStatus('ダウンロードに失敗しました: ' + error.message, 'error');
    }
  }

  /**
   * ステータス表示
   */
  showStatus(message, type = 'info') {
    if (!this.elements.statusDiv) return;

    this.elements.statusDiv.className = `mb-4 p-3 rounded-lg status ${type}`;
    this.elements.statusDiv.textContent = message;
    this.elements.statusDiv.classList.remove('hidden');

    // 成功/エラーメッセージは3秒後に自動消去
    if (type === 'success' || type === 'error') {
      setTimeout(() => {
        if (this.elements.statusDiv) {
          this.elements.statusDiv.classList.add('hidden');
        }
      }, 3000);
    }
  }

  /**
   * ボタンの無効化/有効化
   */
  setButtonsDisabled(disabled) {
    const buttons = [
      this.elements.generateBtn,
      this.elements.playBtn,
      this.elements.pauseBtn,
      this.elements.stopBtn,
      this.elements.downloadBtn
    ];

    buttons.forEach(btn => {
      if (btn) btn.disabled = disabled;
    });
  }

  /**
   * 再生コントロールの有効化
   */
  enablePlaybackControls(enabled) {
    if (this.elements.playBtn) this.elements.playBtn.disabled = !enabled;
    if (this.elements.downloadBtn) this.elements.downloadBtn.disabled = !enabled;
  }

  /**
   * 再生UI更新
   */
  updatePlaybackUI(isPlaying) {
    if (this.elements.playBtn) this.elements.playBtn.disabled = isPlaying;
    if (this.elements.pauseBtn) this.elements.pauseBtn.disabled = !isPlaying;
    if (this.elements.stopBtn) this.elements.stopBtn.disabled = !isPlaying;
    
    if (this.elements.playbackStatus) {
      if (isPlaying) {
        this.elements.playbackStatus.classList.remove('hidden');
      } else {
        this.elements.playbackStatus.classList.add('hidden');
      }
    }
  }

  /**
   * 結果表示の更新
   */
  updateResult(result) {
    if (!this.elements.resultSection) return;

    // 結果セクションを表示
    this.elements.resultSection.classList.remove('hidden');

    // メタデータの表示
    const metadataElements = {
      'result-key': result.metadata?.key || '-',
      'result-tempo': (result.metadata?.tempo || '-') + ' BPM',
      'result-duration': this.formatDuration(result.metadata?.duration || 0),
      'result-progression': result.metadata?.chordProgression?.join(' - ') || '-'
    };

    Object.keys(metadataElements).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = metadataElements[id];
      }
    });
  }

  /**
   * 時間のフォーマット
   */
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * 翻訳データの読み込み
   */
  async loadTranslations() {
    try {
      if (typeof MusicGeneratorTranslations !== 'undefined') {
        this.translations = MusicGeneratorTranslations;
        this.applyTranslations();
      }
    } catch (error) {
      console.warn('Translation loading failed:', error);
    }
  }

  /**
   * 言語変更
   */
  changeLanguage(language) {
    this.currentLanguage = language;
    this.applyTranslations();
  }

  /**
   * 翻訳の適用
   */
  applyTranslations() {
    const elements = document.querySelectorAll('[data-translate-key]');
    elements.forEach(element => {
      const key = element.getAttribute('data-translate-key');
      const text = this.getTranslation(key);
      if (text) {
        if (element.tagName === 'INPUT' && element.type !== 'button') {
          element.placeholder = text;
        } else {
          element.textContent = text;
        }
      }
    });
  }

  /**
   * 翻訳テキストの取得
   */
  getTranslation(key) {
    try {
      return this.translations[this.currentLanguage]?.[key] || key;
    } catch (error) {
      return key;
    }
  }

  /**
   * 初期化
   */
  initialize() {
    console.log('RealisticToneUI initialized (Simple version)');
    this.showStatus('音楽生成ツールが準備完了しました', 'success');
  }
}

// グローバルに公開
window.RealisticToneUI = RealisticToneUI;
