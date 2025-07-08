/**
 * リアル楽器サンプル対応 UI コントローラー
 * 高品質楽器音源を使用した音楽生成UI
 */

class RealisticToneMusicUI {
  constructor() {
    this.engine = null;
    this.currentLanguage = 'ja';
    this.translations = window.musicGeneratorTranslations;
    this.isSimpleMode = true;
    this.currentComposition = null;
    this.isInitialized = false;
    this.loadingProgress = {};
    
    this.init();
  }

  async init() {
    try {
      console.log('Initializing RealisticToneMusicUI...');
      
      // エンジンの初期化
      await this.initializeEngine();
      
      // UI初期化
      this.setupEventListeners();
      this.setupModeToggle();
      this.setupRangeInputs();
      this.initializeTranslations();
      this.setupPresets();
      this.displayInstrumentStatus();
      
      this.isInitialized = true;
      console.log('RealisticToneMusicUI initialized successfully');
    } catch (error) {
      console.error('RealisticToneMusicUI initialization failed:', error);
      this.showMessage('error', '初期化に失敗しました: ' + error.message);
    }
  }

  /**
   * リアル楽器エンジンの初期化
   */
  async initializeEngine() {
    this.showMessage('info', '高品質楽器サンプルを読み込み中...');
    
    try {
      this.engine = new RealisticToneMusicEngine();
      
      // 初期化完了を待つ
      let attempts = 0;
      const maxAttempts = 100; // 10秒
      
      while (!this.engine.isInitialized && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 読み込み進捗を表示
        if (attempts % 10 === 0) {
          this.updateInstrumentLoadingStatus();
        }
        
        attempts++;
      }
      
      if (this.engine.isInitialized) {
        this.showMessage('success', '楽器サンプルの読み込みが完了しました！');
        this.displayInstrumentStatus();
      } else {
        throw new Error('楽器サンプルの読み込みがタイムアウトしました');
      }
    } catch (error) {
      console.error('Engine initialization error:', error);
      this.showMessage('warning', 'フォールバック音源を使用します: ' + error.message);
      throw error;
    }
  }

  /**
   * 楽器読み込み状況の表示（改良版）
   */
  displayInstrumentStatus() {
    if (!this.engine) return;
    
    const status = this.engine.getLoadingStatus();
    const progressContainer = document.getElementById('loading-progress');
    
    if (progressContainer) {
      progressContainer.innerHTML = '';
      
      Object.entries(status).forEach(([key, info]) => {
        const statusClass = info.status === 'loaded' ? 'bg-green-100 text-green-800' : 
                           info.status === 'fallback' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-blue-100 text-blue-800';
        const statusIcon = info.status === 'loaded' ? '✅' : 
                          info.status === 'fallback' ? '⚠️' : '🔄';
        
        const statusText = info.status === 'loaded' ? 'リアルサンプル読み込み完了' : 
                          info.status === 'fallback' ? 'フォールバック音源使用中' : '読み込み中...';
        
        progressContainer.innerHTML += `
          <div class="flex items-center justify-between p-3 rounded-lg border ${statusClass}">
            <div class="flex items-center space-x-3">
              <span class="text-xl">${statusIcon}</span>
              <div>
                <div class="font-medium">${info.name}</div>
                <div class="text-sm opacity-75">${statusText}</div>
              </div>
            </div>
            <div class="text-xs font-mono">${key}</div>
          </div>
        `;
      });
    }
  }

  /**
   * 楽器読み込み進捗の更新
   */
  updateInstrumentLoadingStatus() {
    if (!this.engine) return;
    
    const status = this.engine.getLoadingStatus();
    const totalInstruments = Object.keys(status).length;
    const loadedInstruments = Object.values(status).filter(s => s.status === 'loaded' || s.status === 'fallback').length;
    const progress = (loadedInstruments / totalInstruments) * 100;
    
    const progressBar = document.querySelector('#loading-progress .progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    this.displayInstrumentStatus();
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

    // 楽器選択の動的更新
    this.setupInstrumentSelection();
  }

  /**
   * 楽器選択UIの設定（改良版）
   */
  setupInstrumentSelection() {
    // 利用可能な楽器に基づいて選択肢を動的更新
    if (this.engine) {
      const availableInstruments = this.engine.getAvailableInstruments();
      console.log('Available instruments:', availableInstruments);
      
      // 上級者モードの楽器選択UIを更新
      this.updateInstrumentSelectionUI(availableInstruments);
    }
  }

  /**
   * 楽器選択UIの更新
   */
  updateInstrumentSelectionUI(instruments) {
    const container = document.getElementById('instrument-selection');
    if (!container) return;
    
    const instrumentInfo = {
      'piano': { name: 'ピアノ', icon: '🎹', color: 'bg-blue-100 hover:bg-blue-200' },
      'guitar': { name: 'ギター', icon: '🎸', color: 'bg-amber-100 hover:bg-amber-200' },
      'violin': { name: 'バイオリン', icon: '🎻', color: 'bg-purple-100 hover:bg-purple-200' },
      'bass': { name: 'ベース', icon: '🎸', color: 'bg-red-100 hover:bg-red-200' },
      'synth': { name: 'シンセ', icon: '🎛️', color: 'bg-green-100 hover:bg-green-200' },
      'lead': { name: 'リード', icon: '🎵', color: 'bg-pink-100 hover:bg-pink-200' }
    };
    
    container.innerHTML = '';
    instruments.forEach(instrument => {
      const info = instrumentInfo[instrument] || { 
        name: instrument, 
        icon: '🎵', 
        color: 'bg-gray-100 hover:bg-gray-200' 
      };
      
      const card = document.createElement('div');
      card.className = `instrument-card cursor-pointer p-3 rounded-lg transition-all ${info.color}`;
      card.dataset.instrument = instrument;
      card.innerHTML = `
        <div class="text-center">
          <div class="text-2xl mb-2">${info.icon}</div>
          <div class="text-sm font-medium">${info.name}</div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        card.classList.toggle('selected');
        this.updateSelectedInstruments();
      });
      
      container.appendChild(card);
    });
    
    // デフォルトでピアノを選択
    const pianoCard = container.querySelector('[data-instrument="piano"]');
    if (pianoCard) {
      pianoCard.classList.add('selected');
    }
  }

  /**
   * 選択された楽器の更新
   */
  updateSelectedInstruments() {
    const selectedCards = document.querySelectorAll('.instrument-card.selected');
    const selectedInstruments = Array.from(selectedCards).map(card => card.dataset.instrument);
    console.log('Selected instruments updated:', selectedInstruments);
  }

  /**
   * モード切り替えの設定
   */
  setupModeToggle() {
    const simpleModeBtn = document.getElementById('simple-mode-btn');
    const advancedModeBtn = document.getElementById('advanced-mode-btn');
    
    simpleModeBtn?.addEventListener('click', () => {
      this.setMode('simple');
    });
    
    advancedModeBtn?.addEventListener('click', () => {
      this.setMode('advanced');
    });
    
    // 初期はシンプルモード
    this.setMode('simple');
  }

  /**
   * モード設定
   */
  setMode(mode) {
    this.isSimpleMode = mode === 'simple';
    
    const simplePanel = document.getElementById('simple-mode');
    const advancedPanel = document.getElementById('advanced-mode');
    const simpleModeBtn = document.getElementById('simple-mode-btn');
    const advancedModeBtn = document.getElementById('advanced-mode-btn');
    
    if (this.isSimpleMode) {
      simplePanel?.classList.remove('hidden');
      advancedPanel?.classList.add('hidden');
      simpleModeBtn?.classList.add('bg-music-primary', 'text-white');
      simpleModeBtn?.classList.remove('bg-gray-200', 'text-gray-700');
      advancedModeBtn?.classList.add('bg-gray-200', 'text-gray-700');
      advancedModeBtn?.classList.remove('bg-music-primary', 'text-white');
    } else {
      simplePanel?.classList.add('hidden');
      advancedPanel?.classList.remove('hidden');
      advancedModeBtn?.classList.add('bg-music-primary', 'text-white');
      advancedModeBtn?.classList.remove('bg-gray-200', 'text-gray-700');
      simpleModeBtn?.classList.add('bg-gray-200', 'text-gray-700');
      simpleModeBtn?.classList.remove('bg-music-primary', 'text-white');
    }
    
    console.log('Mode set to:', this.isSimpleMode ? 'Simple' : 'Advanced');
  }

  /**
   * プリセットの設定（リアル楽器対応）
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
        naturalLanguage: 'energetic driving fast guitar powerful intense',
        detailed: {
          key: 'E',
          scale: 'minor',
          tempo: 140,
          progression: 'dramatic',
          instruments: ['guitar', 'bass'],
          complexity: 'complex'
        }
      },
      'meditation': {
        naturalLanguage: 'peaceful dreamy slow flute ambient floating gentle',
        detailed: {
          key: 'F',
          scale: 'major',
          tempo: 60,
          progression: 'ambient',
          instruments: ['flute'],
          complexity: 'simple'
        }
      },
      'creative': {
        naturalLanguage: 'uplifting inspiring classical piano violin moderate flowing',
        detailed: {
          key: 'D',
          scale: 'major',
          tempo: 110,
          progression: 'classical',
          instruments: ['piano', 'violin'],
          complexity: 'moderate'
        }
      },
      'gaming': {
        naturalLanguage: 'epic dramatic energetic synthesizer powerful intense',
        detailed: {
          key: 'Am',
          scale: 'minor',
          tempo: 130,
          progression: 'dramatic',
          instruments: ['synth', 'lead'],
          complexity: 'complex'
        }
      }
    };

    // プリセットボタンのイベントリスナー
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        this.applyPreset(preset);
      });
    });
  }

  /**
   * プリセット適用
   */
  applyPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) {
      console.warn('Unknown preset:', presetName);
      return;
    }

    console.log('Applying preset:', presetName, preset);

    if (this.isSimpleMode) {
      // シンプルモード: 自然言語を入力フィールドに設定
      const descriptionField = document.getElementById('simple-description');
      if (descriptionField) {
        descriptionField.value = preset.naturalLanguage;
      }
    } else {
      // 上級者モード: 詳細設定を適用
      if (preset.detailed) {
        const settings = preset.detailed;
        
        // キー設定
        const keySelect = document.getElementById('key-select');
        if (keySelect) keySelect.value = settings.key || 'auto';
        
        // テンポ設定
        const tempoRange = document.getElementById('tempo-range');
        const tempoDisplay = document.getElementById('tempo-display');
        if (tempoRange && tempoDisplay) {
          tempoRange.value = settings.tempo || 120;
          tempoDisplay.textContent = settings.tempo || 120;
        }
        
        // 楽器選択
        if (settings.instruments) {
          // 全ての楽器カードの選択を解除
          document.querySelectorAll('.instrument-card').forEach(card => {
            card.classList.remove('selected');
          });
          
          // 指定された楽器を選択
          settings.instruments.forEach(instrument => {
            const card = document.querySelector(`[data-instrument="${instrument}"]`);
            if (card) {
              card.classList.add('selected');
            }
          });
          
          this.updateSelectedInstruments();
        }
      }
    }

    // プリセットボタンの視覚的フィードバック
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.remove('ring-2', 'ring-white');
    });
    
    const selectedBtn = document.querySelector(`[data-preset="${presetName}"]`);
    if (selectedBtn) {
      selectedBtn.classList.add('ring-2', 'ring-white');
      setTimeout(() => {
        selectedBtn.classList.remove('ring-2', 'ring-white');
      }, 2000);
    }

    this.showMessage('info', `プリセット「${presetName}」を適用しました`);
  }

  /**
   * 音楽生成（リアル楽器対応）
   */
  async generateMusic() {
    if (!this.engine) {
      this.showMessage('error', 'エンジンが初期化されていません');
      return;
    }
    
    try {
      this.showGenerating(true);
      
      // 設定の収集
      let settings;
      if (this.isSimpleMode) {
        settings = this.collectSimpleModeSettings();
      } else {
        settings = this.collectDetailedModeSettings();
      }
      
      settings.duration = 16; // 16秒の楽曲
      
      console.log('Generating music with realistic instruments:', settings);
      
      // 使用する楽器の確認と表示
      this.displaySelectedInstruments(settings.instruments || ['piano']);
      
      // 音楽生成
      const composition = await this.engine.generateMusic(settings);
      
      if (composition) {
        this.currentComposition = composition;
        this.displayGenerationResult(composition);
        this.showMessage('success', '高品質な音楽が生成されました！');
      } else {
        throw new Error('音楽生成に失敗しました');
      }
      
    } catch (error) {
      console.error('Music generation failed:', error);
      this.showMessage('error', '音楽生成に失敗しました: ' + error.message);
    } finally {
      this.showGenerating(false);
    }
  }

  /**
   * 選択された楽器の表示
   */
  displaySelectedInstruments(instruments) {
    const instrumentNames = {
      'piano': 'ピアノ',
      'guitar': 'ギター', 
      'violin': 'バイオリン',
      'cello': 'チェロ',
      'flute': 'フルート',
      'bass': 'ベース',
      'synthesizer': 'シンセサイザー'
    };
    
    const displayNames = instruments.map(inst => instrumentNames[inst] || inst);
    this.showMessage('info', `使用楽器: ${displayNames.join(', ')}`);
  }

  /**
   * シンプルモードの設定収集
   */
  collectSimpleModeSettings() {
    const description = document.getElementById('simple-description')?.value || '';
    
    return {
      naturalLanguage: description,
      instruments: ['piano'], // デフォルト
      tempo: 120,
      key: 'C',
      duration: 16
    };
  }

  /**
   * 上級者モードの設定収集
   */
  collectDetailedModeSettings() {
    // 選択された楽器を取得
    const selectedCards = document.querySelectorAll('.instrument-card.selected');
    const instruments = Array.from(selectedCards).map(card => card.dataset.instrument);
    
    const settings = {
      instruments: instruments.length > 0 ? instruments : ['piano'],
      key: document.getElementById('key-select')?.value || 'auto',
      tempo: parseInt(document.getElementById('tempo-range')?.value) || 120,
      duration: parseInt(document.getElementById('duration-range')?.value) || 30,
      genre: document.getElementById('genre-select')?.value || 'pop',
      mood: document.getElementById('mood-select')?.value || 'happy',
      structure: document.getElementById('structure-select')?.value || 'simple'
    };
    
    return settings;
  }

  /**
   * 音楽再生
   */
  async playMusic() {
    if (!this.currentComposition) {
      this.showMessage('warning', '再生する音楽がありません。まず音楽を生成してください。');
      return;
    }

    try {
      const success = this.engine.play();
      if (success) {
        this.updatePlaybackControls(true);
        this.showPlaybackStatus(true);
        this.showMessage('success', '再生を開始しました');
      } else {
        this.showMessage('error', '再生に失敗しました');
      }
    } catch (error) {
      console.error('Playback error:', error);
      this.showMessage('error', '再生エラー: ' + error.message);
    }
  }

  /**
   * 音楽停止
   */
  stopMusic() {
    try {
      this.engine.stop();
      this.updatePlaybackControls(false);
      this.showPlaybackStatus(false);
      this.showMessage('info', '再生を停止しました');
    } catch (error) {
      console.error('Stop error:', error);
      this.showMessage('error', '停止エラー: ' + error.message);
    }
  }

  /**
   * 音楽ダウンロード
   */
  async downloadMusic() {
    if (!this.currentComposition) {
      this.showMessage('warning', 'ダウンロードする音楽がありません。');
      return;
    }

    try {
      this.showMessage('info', 'WAVファイルを生成中...');
      const wavData = await this.engine.exportToWav();
      
      const blob = new Blob([wavData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `realistic-music-${Date.now()}.wav`;
      link.click();
      
      URL.revokeObjectURL(url);
      this.showMessage('success', 'ダウンロードが完了しました');
    } catch (error) {
      console.error('Download error:', error);
      this.showMessage('error', 'ダウンロードエラー: ' + error.message);
    }
  }

  /**
   * 再生制御UIの更新
   */
  updatePlaybackControls(isPlaying) {
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    if (playBtn) {
      playBtn.disabled = isPlaying;
    }
    
    if (stopBtn) {
      stopBtn.disabled = !isPlaying;
    }
    
    if (downloadBtn) {
      downloadBtn.disabled = !this.currentComposition;
    }
  }

  /**
   * 再生状況の表示
   */
  showPlaybackStatus(isPlaying) {
    const statusArea = document.getElementById('playback-status');
    if (statusArea) {
      if (isPlaying) {
        statusArea.classList.remove('hidden');
        this.startProgressUpdater();
      } else {
        statusArea.classList.add('hidden');
        this.stopProgressUpdater();
      }
    }
  }

  /**
   * 進行状況更新の開始
   */
  startProgressUpdater() {
    this.stopProgressUpdater(); // 既存のタイマーをクリア
    
    this.progressTimer = setInterval(() => {
      if (this.engine && this.engine.isPlaying) {
        const progress = this.engine.getPlaybackProgress();
        const progressBar = document.getElementById('playback-progress');
        const timeDisplay = document.getElementById('playback-time');
        
        if (progressBar) {
          progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
        }
        
        if (timeDisplay && this.currentComposition) {
          const currentTime = progress * this.currentComposition.params.duration;
          const totalTime = this.currentComposition.params.duration;
          timeDisplay.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(totalTime)}`;
        }
      } else {
        this.stopProgressUpdater();
        this.showPlaybackStatus(false);
      }
    }, 100);
  }

  /**
   * 進行状況更新の停止
   */
  stopProgressUpdater() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  /**
   * 時間フォーマット
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * 生成結果の表示
   */
  displayGenerationResult(composition) {
    // 結果セクションを表示
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
      resultSection.classList.remove('hidden');
    }

    // メタデータの表示
    const metadataArea = document.getElementById('metadata-area');
    if (metadataArea && composition.params) {
      metadataArea.innerHTML = `
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-800 mb-2">楽曲情報</h4>
          <div class="space-y-1 text-sm">
            <div><span class="font-medium">キー:</span> ${composition.params.key || 'C'}</div>
            <div><span class="font-medium">テンポ:</span> ${composition.params.tempo || 120} BPM</div>
            <div><span class="font-medium">長さ:</span> ${composition.params.duration || 16}秒</div>
            <div><span class="font-medium">楽器:</span> ${(composition.params.instruments || []).join(', ')}</div>
          </div>
        </div>
      `;
    }

    // 統計情報の表示
    if (composition.params) {
      document.getElementById('result-key').textContent = composition.params.key || 'C';
      document.getElementById('result-tempo').textContent = `${composition.params.tempo || 120} BPM`;
      document.getElementById('result-duration').textContent = `${composition.params.duration || 16}秒`;
    }

    if (composition.chordProgression) {
      const chordNames = composition.chordProgression.map(chord => chord.name).join(' - ');
      document.getElementById('result-progression').textContent = chordNames;
    }

    // 技術的詳細
    const technicalDetails = document.getElementById('technical-details');
    if (technicalDetails) {
      technicalDetails.innerHTML = `
        <div class="space-y-2">
          <div><strong>音楽生成エンジン:</strong> Tone.js + リアル楽器サンプル</div>
          <div><strong>生成メソッド:</strong> 音楽理論ベース + アルゴリズム合成</div>
          <div><strong>サンプルレート:</strong> 44.1kHz</div>
          <div><strong>音源タイプ:</strong> ${this.getUsedSampleTypes(composition.params.instruments)}</div>
          <div><strong>楽曲構造:</strong> ${composition.structure ? composition.structure.sections.map(s => s.name).join(' → ') : 'シンプル構造'}</div>
        </div>
      `;
    }

    // 再生ボタンを有効化
    this.updatePlaybackControls(false);
  }

  /**
   * 使用された音源タイプの取得
   */
  getUsedSampleTypes(instruments) {
    if (!instruments || !this.engine) return 'フォールバック音源';
    
    const status = this.engine.getLoadingStatus();
    const types = instruments.map(inst => {
      const instStatus = status[inst];
      return instStatus?.status === 'loaded' ? 'リアルサンプル' : 'シンセサイザー';
    });
    
    const uniqueTypes = [...new Set(types)];
    return uniqueTypes.join(' + ');
  }

  /**
   * 生成中UIの表示
   */
  showGenerating(isGenerating) {
    const generateBtn = document.getElementById('generate-btn');
    const loadingText = generateBtn?.querySelector('.loading-text');
    
    if (generateBtn) {
      generateBtn.disabled = isGenerating;
      if (loadingText) {
        loadingText.textContent = isGenerating ? '🎵 生成中...' : '🎵 音楽を生成';
        if (isGenerating) {
          loadingText.classList.add('loading-dots');
        } else {
          loadingText.classList.remove('loading-dots');
        }
      }
    }
  }

  /**
   * メッセージ表示
   */
  showMessage(type, message) {
    // 既存のメッセージを削除
    const existingMessage = document.querySelector('.ui-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageClasses = {
      'success': 'bg-green-100 text-green-800 border-green-200',
      'error': 'bg-red-100 text-red-800 border-red-200',
      'warning': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'info': 'bg-blue-100 text-blue-800 border-blue-200'
    };

    const messageDiv = document.createElement('div');
    messageDiv.className = `ui-message fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg ${messageClasses[type] || messageClasses.info}`;
    messageDiv.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(messageDiv);

    // 5秒後に自動削除
    setTimeout(() => {
      if (messageDiv && messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }

  /**
   * 翻訳システムの初期化
   */
  initializeTranslations() {
    // 基本的な翻訳機能（必要に応じて拡張）
    this.currentLanguage = 'ja';
  }

  /**
   * テンポスライダーのイベントリスナー
   */
  setupRangeInputs() {
    const tempoRange = document.getElementById('tempo-range');
    const tempoDisplay = document.getElementById('tempo-display');
    
    if (tempoRange && tempoDisplay) {
      tempoRange.addEventListener('input', () => {
        tempoDisplay.textContent = tempoRange.value;
      });
    }

    const durationRange = document.getElementById('duration-range');
    const durationDisplay = document.getElementById('duration-display');
    
    if (durationRange && durationDisplay) {
      durationRange.addEventListener('input', () => {
        durationDisplay.textContent = durationRange.value;
      });
    }
  }
}

// グローバルに公開
window.RealisticToneUI = RealisticToneMusicUI;
