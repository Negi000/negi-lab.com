/**
 * Tone.js音楽生成UI コントローラー
 * シンプルモード + 詳細設定モード対応
 */

class ToneMusicUI {
  constructor() {
    this.engine = null;
    this.currentLanguage = 'ja';
    this.translations = window.musicGeneratorTranslations;
    this.isSimpleMode = true;
    this.currentComposition = null;
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      // エンジンの初期化を待つ
      await this.waitForEngine();
      
      // UI初期化
      this.setupEventListeners();
      this.setupModeToggle();
      this.initializeTranslations();
      this.setupPresets();
      
      this.isInitialized = true;
      console.log('ToneMusicUI initialized successfully');
    } catch (error) {
      console.error('ToneMusicUI initialization failed:', error);
    }
  }

  /**
   * エンジンの初期化を待つ
   */
  async waitForEngine() {
    // 簡易版エンジンを初期化
    if (!window.SimpleToneMusicEngine) {
      throw new Error('SimpleToneMusicEngine not found');
    }
    
    try {
      this.engine = new window.SimpleToneMusicEngine();
      
      let attempts = 0;
      const maxAttempts = 50;
      
      while (!this.engine.isInitialized && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (this.engine.isInitialized) {
        console.log('Simple Tone music engine connected');
      } else {
        throw new Error('Simple Tone music engine failed to initialize');
      }
    } catch (error) {
      console.error('Engine initialization error:', error);
      throw error;
    }
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // 生成ボタン
    document.getElementById('generate-btn')?.addEventListener('click', () => {
      this.generateMusic();
    });

    // 再生制御
    document.getElementById('play-btn')?.addEventListener('click', () => {
      this.playMusic();
    });

    document.getElementById('pause-btn')?.addEventListener('click', () => {
      this.pauseMusic();
    });

    document.getElementById('stop-btn')?.addEventListener('click', () => {
      this.stopMusic();
    });

    // ダウンロード
    document.getElementById('download-btn')?.addEventListener('click', () => {
      this.downloadMusic();
    });

    // モード切り替え
    document.getElementById('mode-toggle')?.addEventListener('click', () => {
      this.toggleMode();
    });

    // プリセット
    document.querySelectorAll('.preset-card').forEach(card => {
      card.addEventListener('click', () => {
        this.applyPreset(card.dataset.preset);
      });
    });

    // リアルタイムプレビュー（詳細モード）
    this.setupDetailedModeListeners();
  }

  /**
   * 詳細モードのリスナー設定
   */
  setupDetailedModeListeners() {
    const detailedInputs = [
      'detailed-key', 'detailed-scale', 'detailed-tempo', 
      'detailed-progression', 'detailed-complexity'
    ];

    detailedInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => {
          this.updatePreview();
        });
      }
    });

    // 楽器チェックボックス
    document.querySelectorAll('.detailed-instrument').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updatePreview();
      });
    });
  }

  /**
   * モード切り替えの設定
   */
  setupModeToggle() {
    // 初期状態はシンプルモード
    this.isSimpleMode = true;
    this.updateModeDisplay();
  }

  /**
   * モード切り替え
   */
  toggleMode() {
    this.isSimpleMode = !this.isSimpleMode;
    this.updateModeDisplay();
    
    console.log('Mode switched to:', this.isSimpleMode ? 'Simple' : 'Detailed');
  }

  /**
   * モード表示の更新
   */
  updateModeDisplay() {
    const simplePanel = document.getElementById('simple-mode-panel');
    const detailedPanel = document.getElementById('detailed-mode-panel');
    const modeToggle = document.getElementById('mode-toggle');

    if (simplePanel && detailedPanel && modeToggle) {
      if (this.isSimpleMode) {
        simplePanel.style.display = 'block';
        detailedPanel.style.display = 'none';
        modeToggle.textContent = '詳細設定を開く';
        modeToggle.className = 'mode-toggle simple-mode';
      } else {
        simplePanel.style.display = 'none';
        detailedPanel.style.display = 'block';
        modeToggle.textContent = 'シンプルモードに戻る';
        modeToggle.className = 'mode-toggle detailed-mode';
      }
    }
  }

  /**
   * 翻訳の初期化
   */
  initializeTranslations() {
    // 既存の翻訳システムを使用
    const savedLang = localStorage.getItem('music-generator-language') || 'ja';
    this.currentLanguage = savedLang;
    this.applyTranslations();
  }

  /**
   * 翻訳適用
   */
  applyTranslations() {
    const t = this.translations?.[this.currentLanguage];
    if (!t) return;

    document.querySelectorAll('[data-translate-key]').forEach(element => {
      const key = element.getAttribute('data-translate-key');
      const translation = this.getNestedValue(t, key);
      if (translation) {
        element.textContent = translation;
      }
    });
  }

  /**
   * プリセットの設定
   */
  setupPresets() {
    this.presets = {
      'study': {
        naturalLanguage: 'calm peaceful piano ambient slow focus background',
        detailed: {
          key: 'C',
          scale: 'major',
          tempo: 80,
          progression: 'ambient',
          instruments: ['piano'],
          complexity: 'simple'
        }
      },
      'workout': {
        naturalLanguage: 'energetic driving fast electronic powerful intense',
        detailed: {
          key: 'E',
          scale: 'minor',
          tempo: 140,
          progression: 'dramatic',
          instruments: ['synthesizer', 'bass'],
          complexity: 'complex'
        }
      },
      'meditation': {
        naturalLanguage: 'peaceful dreamy slow strings ambient floating gentle',
        detailed: {
          key: 'F',
          scale: 'major',
          tempo: 60,
          progression: 'ambient',
          instruments: ['strings'],
          complexity: 'simple'
        }
      },
      'creative': {
        naturalLanguage: 'uplifting inspiring classical piano moderate flowing',
        detailed: {
          key: 'D',
          scale: 'major',
          tempo: 110,
          progression: 'classical',
          instruments: ['piano', 'strings'],
          complexity: 'moderate'
        }
      },
      'gaming': {
        naturalLanguage: 'epic dramatic intense orchestral cinematic powerful',
        detailed: {
          key: 'A',
          scale: 'minor',
          tempo: 130,
          progression: 'dramatic',
          instruments: ['synthesizer', 'strings', 'bass'],
          complexity: 'complex'
        }
      },
      'sleep': {
        naturalLanguage: 'gentle peaceful soft slow dreamy minimal quiet',
        detailed: {
          key: 'G',
          scale: 'major',
          tempo: 50,
          progression: 'ambient',
          instruments: ['piano'],
          complexity: 'minimal'
        }
      }
    };
  }

  /**
   * 音楽生成メイン処理
   */
  async generateMusic() {
    if (!this.engine || !this.engine.isInitialized) {
      this.showMessage('error', 'エンジンが初期化されていません');
      return;
    }

    try {
      this.showGenerating(true);
      
      let settings;
      
      if (this.isSimpleMode) {
        // シンプルモード：自然言語解析
        settings = this.collectSimpleModeSettings();
      } else {
        // 詳細モード：直接設定
        settings = this.collectDetailedModeSettings();
      }
      
      console.log('Generating music with settings:', settings);
      
      // 音楽生成
      const result = await this.engine.generateMusic(settings);
      
      if (result.success) {
        this.currentComposition = result.composition;
        this.displayGenerationResult(result);
        this.showMessage('success', '音楽が生成されました！');
      } else {
        throw new Error(result.error || '音楽生成に失敗しました');
      }
      
    } catch (error) {
      console.error('Music generation failed:', error);
      this.showMessage('error', '音楽生成に失敗しました: ' + error.message);
    } finally {
      this.showGenerating(false);
    }
  }

  /**
   * シンプルモードの設定収集
   */
  collectSimpleModeSettings() {
    const naturalLanguage = document.getElementById('natural-language-input')?.value || '';
    const selectedPreset = document.querySelector('.preset-card.selected')?.dataset.preset;
    
    let settings = {
      naturalLanguage: naturalLanguage
    };
    
    // プリセットが選択されている場合はマージ
    if (selectedPreset && this.presets[selectedPreset]) {
      settings.naturalLanguage = this.presets[selectedPreset].naturalLanguage + ' ' + naturalLanguage;
    }
    
    return settings;
  }

  /**
   * 詳細モードの設定収集
   */
  collectDetailedModeSettings() {
    const selectedInstruments = Array.from(document.querySelectorAll('.detailed-instrument:checked'))
                                    .map(cb => cb.value);
    
    return {
      key: document.getElementById('detailed-key')?.value || 'C',
      scale: document.getElementById('detailed-scale')?.value || 'major',
      tempo: parseInt(document.getElementById('detailed-tempo')?.value) || 120,
      progression: document.getElementById('detailed-progression')?.value || 'classical',
      complexity: document.getElementById('detailed-complexity')?.value || 'moderate',
      instruments: selectedInstruments.length > 0 ? selectedInstruments : ['piano'],
      dynamics: document.getElementById('detailed-dynamics')?.value || 'moderate'
    };
  }

  /**
   * 結果表示の改善
   */
  displayGenerationResult(composition) {
    // 結果パネルの表示
    const resultPanel = document.getElementById('result-panel');
    if (resultPanel) {
      resultPanel.style.display = 'block';
    }
    
    // メタデータの表示
    this.displayCompositionMetadata(composition);
    
    // 再生ボタンの有効化
    this.enablePlaybackControls(true);
    
    console.log('Generation result displayed:', composition);
  }

  /**
   * 作曲メタデータの表示
   */
  displayCompositionMetadata(composition) {
    // 基本情報の表示
    const metadata = {
      'キー': composition.params?.key + ' ' + composition.params?.scale,
      'テンポ': composition.params?.tempo + ' BPM',
      '長さ': this.formatDuration(composition.params?.duration || 16),
      '楽器': composition.params?.instruments?.join(', ') || 'ピアノ',
      'スタイル': composition.params?.style || 'モダン'
    };
    
    // メタデータ表示エリアがある場合
    const metadataArea = document.getElementById('metadata-area');
    if (metadataArea) {
      metadataArea.innerHTML = Object.entries(metadata)
        .map(([key, value]) => `<div class="metadata-item"><span class="label">${key}:</span> <span class="value">${value}</span></div>`)
        .join('');
    }
    
    console.log('Metadata displayed:', metadata);
  }

  /**
   * 再生制御
   */
  playMusic() {
    if (!this.engine || !this.currentComposition) {
      this.showMessage('warning', '再生する音楽がありません');
      return;
    }
    
    if (this.engine.play()) {
      this.updatePlaybackControls(true);
      this.showMessage('info', '再生を開始しました');
    }
  }

  pauseMusic() {
    if (this.engine) {
      this.engine.pause();
      this.updatePlaybackControls(false);
      this.showMessage('info', '再生を一時停止しました');
    }
  }

  stopMusic() {
    if (this.engine) {
      this.engine.stop();
      this.updatePlaybackControls(false);
      this.showMessage('info', '再生を停止しました');
    }
  }

  /**
   * 再生制御ボタンの更新
   */
  updatePlaybackControls(isPlaying) {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    
    if (playBtn) {
      playBtn.disabled = isPlaying;
      playBtn.style.opacity = isPlaying ? '0.5' : '1';
    }
    
    if (pauseBtn) {
      pauseBtn.disabled = !isPlaying;
      pauseBtn.style.opacity = isPlaying ? '1' : '0.5';
    }
    
    if (stopBtn) {
      stopBtn.disabled = !isPlaying;
      stopBtn.style.opacity = isPlaying ? '1' : '0.5';
    }
  }

  /**
   * ダウンロード機能
   */
  async downloadMusic() {
    if (!this.engine || !this.currentComposition) {
      this.showMessage('warning', 'ダウンロードする音楽がありません');
      return;
    }
    
    try {
      this.showMessage('info', 'WAVファイルを生成中...');
      
      // WAVエクスポート
      const wavArrayBuffer = await this.engine.exportToWAV();
      
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
      
      this.showMessage('success', 'ダウンロードが完了しました');
      console.log('Download completed:', filename);
      
    } catch (error) {
      console.error('Download failed:', error);
      this.showMessage('error', 'ダウンロードに失敗しました: ' + error.message);
    }
  }

  /**
   * 再生制御ボタンの有効化
   */
  enablePlaybackControls(enabled) {
    const controls = ['play-btn', 'pause-btn', 'stop-btn', 'download-btn'];
    controls.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.disabled = !enabled;
        element.style.opacity = enabled ? '1' : '0.5';
      }
    });
  }

  /**
   * 音楽ダウンロード
   */
  async downloadMusic() {
    if (!this.engine || !this.currentComposition) {
      this.showMessage('error', 'ダウンロードする音楽がありません');
      return;
    }

    try {
      this.showMessage('info', '録音を開始しています...');
      
      const recording = await this.engine.exportToWAV();
      
      // ダウンロード実行
      const url = URL.createObjectURL(recording);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tone-music-${Date.now()}.wav`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      this.showMessage('success', 'ダウンロードが完了しました');
    } catch (error) {
      console.error('Download failed:', error);
      this.showMessage('error', 'ダウンロードに失敗しました: ' + error.message);
    }
  }

  /**
   * プリセット適用
   */
  applyPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) return;
    
    // プリセットカードの選択状態を更新
    document.querySelectorAll('.preset-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.preset === presetName);
    });
    
    if (this.isSimpleMode) {
      // シンプルモード: 自然言語入力を更新
      const input = document.getElementById('natural-language-input');
      if (input) {
        input.value = preset.naturalLanguage;
      }
    } else {
      // 詳細モード: 各設定項目を更新
      const detailed = preset.detailed;
      if (detailed) {
        Object.entries(detailed).forEach(([key, value]) => {
          if (key === 'instruments') {
            // 楽器チェックボックスの更新
            document.querySelectorAll('.detailed-instrument').forEach(cb => {
              cb.checked = value.includes(cb.value);
            });
          } else {
            // その他の設定項目
            const element = document.getElementById(`detailed-${key}`);
            if (element) {
              element.value = value;
              // テンポスライダーの表示も更新
              if (key === 'tempo') {
                const display = element.parentNode.querySelector('.text-center');
                if (display) {
                  display.textContent = `${value} BPM`;
                }
              }
            }
          }
        });
      }
    }
    
    this.showMessage('info', `${presetName} プリセットを適用しました`);
  }

  /**
   * プレビュー更新（詳細モード）
   */
  updatePreview() {
    if (this.isSimpleMode) return;
    
    const settings = this.collectDetailedModeSettings();
    
    // プレビュー情報の表示
    const previewArea = document.getElementById('settings-preview');
    if (previewArea) {
      previewArea.innerHTML = `
        <div class="preview-item">
          <span class="label">キー:</span>
          <span class="value">${settings.key} ${settings.scale}</span>
        </div>
        <div class="preview-item">
          <span class="label">テンポ:</span>
          <span class="value">${settings.tempo} BPM</span>
        </div>
        <div class="preview-item">
          <span class="label">楽器:</span>
          <span class="value">${settings.instruments.join(', ')}</span>
        </div>
        <div class="preview-item">
          <span class="label">複雑さ:</span>
          <span class="value">${settings.complexity}</span>
        </div>
      `;
    }
  }

  /**
   * メッセージ表示
   */
  showMessage(type, message) {
    const messageEl = document.getElementById('message-area');
    if (!messageEl) {
      console.log(`[${type}] ${message}`);
      return;
    }

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
    if (generateBtn) {
      generateBtn.disabled = isGenerating;
      generateBtn.textContent = isGenerating ? '🔄 生成中...' : '🎵 音楽を生成する';
    }
  }

  /**
   * 時間フォーマット
   */
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * ネストしたオブジェクトから値を取得
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }
}

// DOM読み込み完了後にUI初期化
document.addEventListener('DOMContentLoaded', () => {
  window.toneMusicUI = new ToneMusicUI();
});
