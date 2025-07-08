/**
 * リアル楽器サンプル対応 UI コントローラー
 * Tone.js-Instruments対応版
 */

class RealisticToneMusicUI {
  constructor() {
    this.engine = null;
    this.currentLanguage = 'ja';
    this.translations = window.musicGeneratorTranslations || {};
    this.isSimpleMode = true;
    this.currentComposition = null;
    this.isInitialized = false;
    this.loadingProgress = {};
    this.currentMusic = null;
    
    // 翻訳システムの確認
    if (!window.musicGeneratorTranslations) {
      console.warn('musicGeneratorTranslations not loaded, using fallback');
      this.translations = this.createFallbackTranslations();
    }
    
    this.init();
  }

  /**
   * フォールバック翻訳の作成
   */
  createFallbackTranslations() {
    return {
      ja: {
        controls: {
          generate: '音楽を生成',
          generating: '生成中...',
          play: '再生',
          stop: '停止',
          download: 'ダウンロード'
        },
        messages: {
          success: '成功',
          error: 'エラー',
          warning: '警告',
          info: '情報'
        }
      }
    };
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
      // Tone.jsとSampleLibraryの可用性チェック
      if (typeof Tone === 'undefined') {
        throw new Error('Tone.js is not loaded');
      }

      this.engine = new RealisticToneMusicEngine();
      
      // エンジンの初期化を待機
      let attempts = 0;
      const maxAttempts = 100; // 10秒間待機
      
      while (!this.engine.isInitialized && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        
        // 進行状況を表示
        if (attempts % 10 === 0) {
          this.updateLoadingProgress(attempts / maxAttempts * 100);
        }
      }
      
      if (!this.engine.isInitialized) {
        throw new Error('楽器サンプルの読み込みがタイムアウトしました');
      }
      
      this.showMessage('success', '楽器サンプルの読み込みが完了しました');
      
    } catch (error) {
      console.error('Engine initialization error:', error);
      this.showMessage('error', 'エンジンの初期化に失敗しました: ' + error.message);
      throw error;
    }
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // AudioContext初期化のためのユーザー操作監視
    this.setupAudioContextActivation();
    
    // 生成ボタン
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', async () => {
        await this.ensureAudioContextRunning();
        this.generateMusic();
      });
    }

    // 再生制御ボタン
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', async () => {
        await this.ensureAudioContextRunning();
        this.playMusic();
      });
    }

    const stopBtn = document.getElementById('stop-btn');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => this.stopMusic());
    }

    // ダウンロードボタン
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadMusic());
    }

    // プリセットボタン
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        this.applyPreset(preset);
      });
    });
  }

  /**
   * モード切り替えの設定
   */
  setupModeToggle() {
    const simpleModeBtn = document.getElementById('simple-mode-btn');
    const advancedModeBtn = document.getElementById('advanced-mode-btn');
    const simpleMode = document.getElementById('simple-mode');
    const advancedMode = document.getElementById('advanced-mode');

    if (simpleModeBtn && advancedModeBtn) {
      simpleModeBtn.addEventListener('click', () => {
        this.isSimpleMode = true;
        simpleModeBtn.classList.add('bg-accent', 'text-white');
        simpleModeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        advancedModeBtn.classList.remove('bg-accent', 'text-white');
        advancedModeBtn.classList.add('bg-gray-200', 'text-gray-700');
        
        if (simpleMode) simpleMode.classList.remove('hidden');
        if (advancedMode) advancedMode.classList.add('hidden');
      });

      advancedModeBtn.addEventListener('click', () => {
        this.isSimpleMode = false;
        advancedModeBtn.classList.add('bg-accent', 'text-white');
        advancedModeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        simpleModeBtn.classList.remove('bg-accent', 'text-white');
        simpleModeBtn.classList.add('bg-gray-200', 'text-gray-700');
        
        if (simpleMode) simpleMode.classList.add('hidden');
        if (advancedMode) advancedMode.classList.remove('hidden');
        
        // 楽器選択UIを更新
        this.updateInstrumentSelection();
      });
    }
  }

  /**
   * 楽器選択UIの更新
   */
  updateInstrumentSelection() {
    const container = document.getElementById('instrument-selection');
    if (!container || !this.engine) return;

    const instruments = this.engine.getAvailableInstrumentsList();
    const instrumentsData = this.engine.availableInstruments;
    
    container.innerHTML = '';

    instruments.forEach(instrumentKey => {
      const instrument = instrumentsData[instrumentKey];
      const status = this.engine.loadingStatus[instrumentKey];
      
      const card = document.createElement('div');
      card.className = `instrument-card p-3 border rounded-lg cursor-pointer transition-all ${
        status && status.status === 'loaded' ? 'border-accent bg-accent/10' : 
        status && status.status === 'fallback' ? 'border-yellow-400 bg-yellow-50' :
        'border-gray-300 bg-gray-50'
      }`;
      
      card.innerHTML = `
        <div class="text-center">
          <div class="text-2xl mb-2">${this.getInstrumentIcon(instrument.category)}</div>
          <div class="font-medium text-sm">${instrument.name}</div>
          <div class="text-xs mt-1 ${
            status && status.status === 'loaded' ? 'text-green-600' :
            status && status.status === 'fallback' ? 'text-yellow-600' :
            'text-gray-500'
          }">
            ${status ? this.getStatusText(status.status) : '未読み込み'}
          </div>
        </div>
      `;
      
      card.addEventListener('click', () => {
        card.classList.toggle('selected');
        this.updateSelectedInstruments();
      });
      
      container.appendChild(card);
    });
  }

  /**
   * 楽器アイコンの取得
   */
  getInstrumentIcon(category) {
    const icons = {
      keyboard: '🎹',
      guitar: '🎸',
      bass: '🎸',
      strings: '🎻',
      wind: '🎺',
      percussion: '🥁'
    };
    return icons[category] || '🎵';
  }

  /**
   * ステータステキストの取得
   */
  getStatusText(status) {
    const statusMap = {
      loaded: '読み込み完了',
      loading: '読み込み中...',
      fallback: 'フォールバック',
      failed: '読み込み失敗'
    };
    return statusMap[status] || '不明';
  }

  /**
   * レンジ入力の設定
   */
  setupRangeInputs() {
    // テンポスライダー
    const tempoRange = document.getElementById('tempo-range');
    const tempoDisplay = document.getElementById('tempo-display');
    if (tempoRange && tempoDisplay) {
      tempoRange.addEventListener('input', (e) => {
        tempoDisplay.textContent = e.target.value;
      });
    }

    // 長さスライダー
    const durationRange = document.getElementById('duration-range');
    const durationDisplay = document.getElementById('duration-display');
    if (durationRange && durationDisplay) {
      durationRange.addEventListener('input', (e) => {
        durationDisplay.textContent = e.target.value;
      });
    }
  }

  /**
   * 翻訳システムの初期化
   */
  initializeTranslations() {
    // 言語設定の復元
    const savedLang = localStorage.getItem('music-language') || 'ja';
    this.currentLanguage = savedLang;
    
    // 言語切り替えの設定
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
      langSwitch.value = this.currentLanguage;
      langSwitch.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }
  }

  /**
   * プリセットの設定
   */
  setupPresets() {
    this.presets = {
      creative: {
        description: '明るくて創造的なポップミュージック',
        genre: 'pop',
        mood: 'happy',
        tempo: 120,
        duration: 30,
        instruments: ['piano', 'guitar-acoustic']
      },
      meditation: {
        description: '瞑想とリラクゼーションのためのアンビエント音楽',
        genre: 'ambient',
        mood: 'calm',
        tempo: 70,
        duration: 60,
        instruments: ['piano']
      },
      workout: {
        description: 'エネルギッシュなワークアウト用音楽',
        genre: 'electronic',
        mood: 'energetic',
        tempo: 140,
        duration: 45,
        instruments: ['bass-electric']
      },
      gaming: {
        description: 'ゲーミング用のエピック音楽',
        genre: 'electronic',
        mood: 'energetic',
        tempo: 130,
        duration: 40,
        instruments: ['piano', 'bass-electric']
      }
    };
  }

  /**
   * 楽器状態表示
   */
  displayInstrumentStatus() {
    const container = document.getElementById('loading-progress');
    if (!container || !this.engine) return;

    const instruments = this.engine.getAvailableInstrumentsList();
    container.innerHTML = '';

    instruments.forEach(instrumentKey => {
      const instrument = this.engine.availableInstruments[instrumentKey];
      const status = this.engine.loadingStatus[instrumentKey];
      
      const statusDiv = document.createElement('div');
      statusDiv.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-lg';
      statusDiv.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="text-2xl">${this.getInstrumentIcon(instrument.category)}</span>
          <span class="font-medium">${instrument.name}</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full ${
            status && status.status === 'loaded' ? 'bg-green-500' :
            status && status.status === 'fallback' ? 'bg-yellow-500' :
            status && status.status === 'loading' ? 'bg-blue-500 animate-pulse' :
            'bg-gray-300'
          }"></div>
          <span class="text-sm text-gray-600">
            ${status ? this.getStatusText(status.status) : '未読み込み'}
          </span>
        </div>
      `;
      
      container.appendChild(statusDiv);
    });
  }

  /**
   * 音楽生成
   */
  async generateMusic() {
    if (!this.engine || !this.engine.isInitialized) {
      this.showMessage('error', 'エンジンが初期化されていません');
      return;
    }

    try {
      this.setGeneratingState(true);
      
      const settings = this.collectSettings();
      console.log('Generating music with settings:', settings);
      
      // AudioContextを開始
      if (Tone.context.state === 'suspended') {
        await Tone.start();
        console.log('AudioContext started');
      }
      
      const musicData = await this.engine.generateMusic(settings);
      this.currentMusic = musicData;
      
      this.displayMusicResult(musicData);
      this.showMessage('success', '音楽が正常に生成されました');
      
    } catch (error) {
      console.error('Music generation failed:', error);
      this.showMessage('error', '音楽生成に失敗しました: ' + error.message);
    } finally {
      this.setGeneratingState(false);
    }
  }

  /**
   * 設定の収集
   */
  collectSettings() {
    if (this.isSimpleMode) {
      const descriptionEl = document.getElementById('simple-description');
      const description = descriptionEl ? descriptionEl.value : '';
      return { description: description };
    } else {
      const keySelect = document.getElementById('key-select');
      const tempoRange = document.getElementById('tempo-range');
      const durationRange = document.getElementById('duration-range');
      const genreSelect = document.getElementById('genre-select');
      const moodSelect = document.getElementById('mood-select');
      const structureSelect = document.getElementById('structure-select');
      
      return {
        key: keySelect ? keySelect.value : 'auto',
        tempo: tempoRange ? parseInt(tempoRange.value) : 120,
        duration: durationRange ? parseInt(durationRange.value) : 30,
        genre: genreSelect ? genreSelect.value : 'pop',
        mood: moodSelect ? moodSelect.value : 'happy',
        structure: structureSelect ? structureSelect.value : 'simple',
        instruments: this.getSelectedInstruments()
      };
    }
  }

  /**
   * 選択された楽器の取得
   */
  getSelectedInstruments() {
    const selected = document.querySelectorAll('.instrument-card.selected');
    if (selected.length === 0) {
      return ['piano']; // デフォルト
    }
    
    const instruments = [];
    selected.forEach((card, index) => {
      const instrumentKey = this.engine.getAvailableInstrumentsList()[index];
      if (instrumentKey) {
        instruments.push(instrumentKey);
      }
    });
    
    return instruments.length > 0 ? instruments : ['piano'];
  }

  /**
   * 選択楽器の更新
   */
  updateSelectedInstruments() {
    // 選択状態の更新（必要に応じて実装）
  }

  /**
   * 音楽結果の表示
   */
  displayMusicResult(musicData) {
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
      resultSection.classList.remove('hidden');
      
      // メタデータの表示
      const resultKey = document.getElementById('result-key');
      const resultTempo = document.getElementById('result-tempo');
      const resultDuration = document.getElementById('result-duration');
      const resultProgression = document.getElementById('result-progression');
      
      if (resultKey) resultKey.textContent = musicData.metadata.key || '-';
      if (resultTempo) resultTempo.textContent = (musicData.metadata.tempo + ' BPM') || '-';
      if (resultDuration) resultDuration.textContent = this.formatDuration(musicData.metadata.duration) || '-';
      if (resultProgression) resultProgression.textContent = '自動生成';
      
      // 再生ボタンの有効化
      this.enablePlaybackControls(true);
    }
  }

  /**
   * 音楽再生
   */
  async playMusic() {
    if (!this.currentMusic) {
      this.showMessage('warning', '再生する音楽がありません');
      return;
    }

    try {
      if (Tone.context.state === 'suspended') {
        await Tone.start();
      }

      await this.engine.playComposition(this.currentMusic);
      this.showPlaybackStatus(true);
      
    } catch (error) {
      console.error('Playback failed:', error);
      this.showMessage('error', '再生に失敗しました: ' + error.message);
    }
  }

  /**
   * 音楽停止
   */
  stopMusic() {
    if (this.engine) {
      this.engine.stopMusic();
    }
    this.showPlaybackStatus(false);
  }

  /**
   * 音楽ダウンロード
   */
  async downloadMusic() {
    if (!this.currentMusic) {
      this.showMessage('warning', 'ダウンロードする音楽がありません');
      return;
    }

    try {
      const wavBuffer = this.engine.exportToWav(this.currentMusic);
      const blob = new Blob([wavBuffer], { type: 'audio/wav' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `music-${Date.now()}.wav`;
      link.click();
      
      this.showMessage('success', '音楽をダウンロードしました');
      
    } catch (error) {
      console.error('Download failed:', error);
      this.showMessage('error', 'ダウンロードに失敗しました: ' + error.message);
    }
  }

  /**
   * プリセットの適用
   */
  applyPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) return;

    if (this.isSimpleMode) {
      const descInput = document.getElementById('simple-description');
      if (descInput) {
        descInput.value = preset.description;
      }
    } else {
      // 詳細設定にプリセットを適用
      if (document.getElementById('tempo-range')) {
        document.getElementById('tempo-range').value = preset.tempo;
        document.getElementById('tempo-display').textContent = preset.tempo;
      }
      if (document.getElementById('duration-range')) {
        document.getElementById('duration-range').value = preset.duration;
        document.getElementById('duration-display').textContent = preset.duration;
      }
      if (document.getElementById('genre-select')) {
        document.getElementById('genre-select').value = preset.genre;
      }
      if (document.getElementById('mood-select')) {
        document.getElementById('mood-select').value = preset.mood;
      }
    }

    this.showMessage('info', `プリセット "${presetName}" を適用しました`);
  }

  /**
   * 生成状態の設定
   */
  setGeneratingState(isGenerating) {
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.disabled = isGenerating;
      generateBtn.innerHTML = isGenerating ? 
        '<span class="loading-text">🎵 生成中...</span>' : 
        '🎵 音楽を生成';
    }
  }

  /**
   * 再生制御の有効化
   */
  enablePlaybackControls(enabled) {
    const playBtn = document.getElementById('play-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    if (playBtn) playBtn.disabled = !enabled;
    if (downloadBtn) downloadBtn.disabled = !enabled;
  }

  /**
   * 再生状態の表示
   */
  showPlaybackStatus(isPlaying) {
    const playbackStatus = document.getElementById('playback-status');
    if (playbackStatus) {
      if (isPlaying) {
        playbackStatus.classList.remove('hidden');
      } else {
        playbackStatus.classList.add('hidden');
      }
    }
  }

  /**
   * 読み込み進行状況の更新
   */
  updateLoadingProgress(percentage) {
    const progressDiv = document.getElementById('loading-progress');
    if (progressDiv) {
      progressDiv.innerHTML = `
        <div class="flex items-center justify-center p-8">
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div class="text-gray-600">楽器音源読み込み中... ${Math.round(percentage)}%</div>
          </div>
        </div>
      `;
    }
  }

  /**
   * メッセージ表示
   */
  showMessage(type, message) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // 簡易的なメッセージ表示
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      type === 'warning' ? 'bg-yellow-500' :
      'bg-blue-500'
    }`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
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
   * 言語変更
   */
  changeLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('music-language', lang);
    // 翻訳適用の実装（必要に応じて）
  }

  /**
   * AudioContext初期化のためのユーザー操作監視
   */
  setupAudioContextActivation() {
    // 最初のユーザー操作でAudioContextを有効化
    const activateAudio = async () => {
      try {
        if (Tone && Tone.context && Tone.context.state !== 'running') {
          await Tone.start();
          console.log('AudioContext started successfully');
        }
      } catch (error) {
        console.warn('Failed to start AudioContext:', error);
      }
    };

    // 各種ユーザー操作イベントに対応
    ['click', 'touchstart', 'keydown'].forEach(eventType => {
      document.addEventListener(eventType, activateAudio, { once: true });
    });
  }

  /**
   * AudioContextが実行中であることを確認
   */
  async ensureAudioContextRunning() {
    try {
      if (typeof Tone === 'undefined') {
        throw new Error('Tone.js is not loaded');
      }

      if (Tone.context.state !== 'running') {
        console.log('Starting AudioContext...');
        await Tone.start();
        
        // 短い待機時間を追加
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (Tone.context.state !== 'running') {
          throw new Error('AudioContext failed to start');
        }
        
        console.log('AudioContext is now running');
      }
    } catch (error) {
      console.error('AudioContext initialization failed:', error);
      this.showMessage('error', 'オーディオの初期化に失敗しました。ページを再読み込みして再試行してください。');
      throw error;
    }
  }
}

// グローバルに公開
window.RealisticToneMusicUI = RealisticToneMusicUI;
