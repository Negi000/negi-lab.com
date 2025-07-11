document.addEventListener('DOMContentLoaded', () => {
    // --- Element Cache ---
    const simpleModeBtn = document.getElementById('simple-mode-btn');
    const advancedModeBtn = document.getElementById('advanced-mode-btn');
    const simpleModePanel = document.getElementById('simple-mode-panel');
    const advancedModePanel = document.getElementById('advanced-mode-panel');
    const generateBtn = document.getElementById('generate-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const loopBtn = document.getElementById('loop-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const timeDisplay = document.getElementById('time-display');
    const progressBar = document.getElementById('progress-bar');
    const playerControls = document.getElementById('player-controls');
    const playerPlaceholder = document.getElementById('player-placeholder');
    const historyList = document.getElementById('history-list');
    const reverbSlider = document.getElementById('reverb');
    const reverbValue = document.getElementById('reverb-value');
    const waveformCanvas = document.getElementById('waveform-canvas');

    // --- SIMPLE ---
    const genreSelect = document.getElementById('genre-select');
    const moodSelect = document.getElementById('mood-select');
    const naturalLanguageInput = document.getElementById('natural-language');
    const tempoSimpleSlider = document.getElementById('tempo-simple-slider');
    const tempoSimpleValue = document.getElementById('tempo-simple-value');
    const lengthSelect = document.getElementById('length-select');
    const complexitySelect = document.getElementById('complexity-select');
    const loopToggle = document.getElementById('loop-toggle');


    // --- ADVANCED ---
    const keySelect = document.getElementById('key');
    const tempoSlider = document.getElementById('tempo');
    const tempoValue = document.getElementById('tempo-value');
    const melodyInstrumentSelect = document.getElementById('melody-instrument-select');
    const chordInstrumentSelect = document.getElementById('chord-instrument-select');
    const bassInstrumentSelect = document.getElementById('bass-instrument-select');


    let currentMode = 'simple';
    let generationHistory = [];
    let waveform = null;
    const loadingIndicator = document.getElementById('loading-indicator');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');

    // --- Initial Loading ---
    async function initializeApp() {
        console.log('🚀 Initializing music generator app...');
        
        // Check if using correct protocol
        if (!checkProtocol()) {
            return; // Stop initialization if using file:// protocol
        }
        
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        if (loadingText) loadingText.textContent = '楽器を読み込んでいます...';
        
        try {
            // Wait for the SampleLibrary to be available
            let attempts = 0;
            while (typeof SampleLibrary === 'undefined' && attempts < 50) {
              await new Promise(resolve => setTimeout(resolve, 100));
              attempts++;
            }
            
            if (typeof SampleLibrary === 'undefined') {
              throw new Error('SampleLibrary failed to load after 5 seconds');
            }
            
            console.log('✅ SampleLibrary is available, loading instruments...');
            
            // Initialize Tone.js context safely
            if (Tone.context.state !== 'running') {
                console.log('⏳ AudioContext is suspended, waiting for user interaction...');
                if (loadingText) loadingText.textContent = 'クリックして音楽エンジンを開始してください';
                // Don't start context automatically, wait for user interaction
            }
            
            await MusicGeneratorEngine.loadInstruments();
            console.log('✅ App initialization completed');
            
            if (loadingOverlay) loadingOverlay.style.display = 'none';
        } catch (error) {
            console.error("❌ Initialization failed:", error);
            if (loadingText) {
              loadingText.textContent = `初期化に失敗しました: ${error.message}`;
              loadingText.style.color = '#ef4444';
            }
            // Still allow the app to continue with fallback instruments
            setTimeout(() => {
              if (loadingOverlay) loadingOverlay.style.display = 'none';
            }, 3000);
        }
    }


    // --- Mode Toggling ---
    function setMode(mode) {
        currentMode = mode;
        if (mode === 'simple') {
            if (simpleModePanel) simpleModePanel.classList.remove('hidden');
            if (advancedModePanel) advancedModePanel.classList.add('hidden');
            if (simpleModeBtn) {
                simpleModeBtn.classList.add('bg-white', 'shadow-md');
                simpleModeBtn.classList.remove('text-gray-700');
            }
            if (advancedModeBtn) {
                advancedModeBtn.classList.remove('bg-white', 'shadow-md');
                advancedModeBtn.classList.add('text-gray-700');
            }
        } else { // advanced
            if (simpleModePanel) simpleModePanel.classList.add('hidden');
            if (advancedModePanel) advancedModePanel.classList.remove('hidden');
            if (advancedModeBtn) {
                advancedModeBtn.classList.add('bg-white', 'shadow-md');
                advancedModeBtn.classList.remove('text-gray-700');
            }
            if (simpleModeBtn) {
                simpleModeBtn.classList.remove('bg-white', 'shadow-md');
                simpleModeBtn.classList.add('text-gray-700');
            }
        }
        console.log(`Switched to ${mode} mode.`);
    }

    if (simpleModeBtn) {
        simpleModeBtn.addEventListener('click', () => setMode('simple'));
    }
    if (advancedModeBtn) {
        advancedModeBtn.addEventListener('click', () => setMode('advanced'));
    }

    // --- Event Listeners ---

    if (reverbSlider) {
        reverbSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            MusicGeneratorEngine.setReverb(value);
            if (reverbValue) {
                reverbValue.textContent = value.toFixed(2);
            }
        });
    }

    if (tempoSlider) {
        tempoSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value, 10);
            if (tempoValue) {
                tempoValue.textContent = `${value}`;
            }
        });
    }
    
    if (tempoSimpleSlider) {
        tempoSimpleSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value, 10);
            const labels = ['遅い', '普通', '速い'];
            if (tempoSimpleValue) {
                tempoSimpleValue.textContent = labels[value] || '普通';
            }
        });
    }


    // --- Generation ---
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            try {
                if (loadingIndicator) loadingIndicator.style.display = 'flex';
                generateBtn.disabled = true;
            
                // Start Tone.js context (this requires user gesture)
                if (Tone.context.state !== 'running') {
                    console.log('🎵 Starting AudioContext...');
                    await Tone.start();
                    console.log('✅ AudioContext started');
                } else {
                    console.log('✅ AudioContext already running');
                }

                // Collect options
                let options = {
                    reverb: reverbSlider ? parseFloat(reverbSlider.value) : 0.1,
                    isLooping: loopToggle ? loopToggle.checked : true,
                };                // Get options from the current mode
                if (currentMode === 'simple') {
                    const mood = moodSelect ? moodSelect.value : 'happy';
                    const genre = genreSelect ? genreSelect.value : 'pop';
                    
                    options = {
                        ...options,
                        genre: genre,
                        mood: mood,
                        keywords: naturalLanguageInput ? naturalLanguageInput.value : '',
                        length: lengthSelect ? parseInt(lengthSelect.value, 10) : 16,
                        complexity: complexitySelect ? complexitySelect.value : 'medium',
                        instruments: { // Default instruments for simple mode
                            melody: 'piano',
                            chords: 'piano',
                            bass: 'bass-electric',
                        }
                    };
                    
                    const tempoMap = ['slow', 'medium', 'fast'];
                    const tempoName = tempoMap[tempoSimpleSlider ? tempoSimpleSlider.value : 1] || 'medium';
                    const tempoRange = MusicGeneratorEngine.getTempoRange(tempoName);
                    options.tempo = Math.floor(Math.random() * (tempoRange[1] - tempoRange[0])) + tempoRange[0];
        
                } else { // advanced mode
                    options = {
                        ...options,
                        instruments: {
                            melody: melodyInstrumentSelect ? melodyInstrumentSelect.value : 'piano',
                            chords: chordInstrumentSelect ? chordInstrumentSelect.value : 'piano',
                            bass: bassInstrumentSelect ? bassInstrumentSelect.value : 'bass-electric',
                        },
                        key: keySelect ? keySelect.value : 'C',
                        tempo: tempoSlider ? parseInt(tempoSlider.value, 10) : 120,
                        length: 16, // Default length for advanced mode
                        complexity: 'medium', // Default complexity
                    };
                }

                console.log('Generating with options:', options);
    
                // Generate music
                const musicData = await MusicGeneratorEngine.generate(options);
    
                console.log('Generated music data:', musicData);
    
                // Play the generated music
                MusicGeneratorEngine.playFromHistory(musicData);
    
                // Update UI for player
                if (playerPlaceholder) playerPlaceholder.style.display = 'none';
                if (playerControls) playerControls.style.display = 'flex';
                updatePlayPauseButton(true);
    
                // Add to history
                addToHistory(options, musicData);
    
            } catch (error) {
                console.error("Generation failed:", error);
                alert("音楽の生成に失敗しました。");
            } finally {
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                generateBtn.disabled = false;
            }
        });
    }

    // --- Player Controls ---
    function updatePlayPauseButton(isPlaying) {
        if (!playPauseBtn) return;
        
        if (isPlaying) {
            playPauseBtn.innerHTML = `<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`; // Pause icon
        } else {
            playPauseBtn.innerHTML = `<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.002v3.996a1 1 0 001.555.832l3.196-1.998a1 1 0 000-1.664L9.555 7.168z" clip-rule="evenodd"></path></svg>`; // Play icon
        }
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            const transport = MusicGeneratorEngine.getTransport();
            if (transport.state === 'started') {
                MusicGeneratorEngine.pause();
                updatePlayPauseButton(false);
            } else {
                MusicGeneratorEngine.play();
                updatePlayPauseButton(true);
            }
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            MusicGeneratorEngine.stop();
            updatePlayPauseButton(false);
        });
    }

    if (loopToggle) { // Use loopToggle for the event listener
        loopToggle.addEventListener('change', () => { // Use 'change' for checkboxes
            const transport = MusicGeneratorEngine.getTransport();
            if (transport) {
                transport.loop = loopToggle.checked;
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            // UI a bit more responsive by converting linear slider to dB
            Tone.getDestination().volume.value = Tone.gainToDb(e.target.value);
        });
    }
    
    // --- Effects ---
    // This is redundant, already handled above
    // if (reverbSlider) {
    //     reverbSlider.addEventListener('input', (e) => {
    //         const value = parseFloat(e.target.value);
    //         reverbValue.textContent = value.toFixed(2);
    //         MusicGeneratorEngine.setReverb(value);
    //     });
    // }

    // --- Download ---
    // Note: Download buttons are not present in the HTML, these would need to be added
    // if (downloadWavBtn) {
    //     downloadWavBtn.addEventListener('click', async () => {
    //         // Download WAV functionality
    //     });
    // }

    // if (downloadMidiBtn) {
    //     downloadMidiBtn.addEventListener('click', () => {
    //         // Download MIDI functionality
    //     });
    // }


    // --- History ---
    function addToHistory(options, musicData) {
        const historyItem = {
            id: Date.now(),
            options: JSON.parse(JSON.stringify(options)), // Deep copy
            musicData: musicData,
            timestamp: new Date().toLocaleTimeString()
        };

        generationHistory.unshift(historyItem); // Add to the beginning
        if (generationHistory.length > 10) {
            generationHistory.pop(); // Keep only the last 10
        }
        renderHistory();
    }

    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = '';
        if (generationHistory.length === 0) {
            historyList.innerHTML = `<p class="text-gray-500 text-sm" data-translate="history_empty">まだ生成された音楽はありません。</p>`;
            return;
        }

        generationHistory.forEach(item => {
            const li = document.createElement('li');
            li.className = 'p-3 rounded-lg border bg-gray-50/50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center';
            
            const infoDiv = document.createElement('div');
            const description = item.options.keywords || `${item.options.genre}/${item.options.mood}` || `${item.options.key} Key`;
            infoDiv.innerHTML = `
                <p class="font-semibold text-gray-700">${description}</p>
                <p class="text-xs text-gray-500">${item.timestamp}</p>
            `;

            const button = document.createElement('button');
            button.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664L9.555 7.168z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
            button.className = 'p-1 rounded-full hover:bg-accent/20 text-gray-600 hover:text-accent';
            button.title = 'この音楽を再生';
            button.onclick = () => {
                MusicGeneratorEngine.playFromHistory(item.musicData);
                if(playerPlaceholder) playerPlaceholder.style.display = 'none';
                if(playerControls) playerControls.style.display = 'flex';
                updatePlayPauseButton(true);
            };

            li.appendChild(infoDiv);
            li.appendChild(button);
            historyList.appendChild(li);
        });
    }

    function setupWaveform() {
        if (!waveformCanvas) return;
        waveform = new Tone.Waveform();
        Tone.getDestination().connect(waveform);
        const canvasCtx = waveformCanvas.getContext('2d');

        function drawWaveform() {
            requestAnimationFrame(drawWaveform);
            const waveArray = waveform.getValue();
            canvasCtx.fillStyle = 'rgb(243 244 246)'; // bg-gray-100
            canvasCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(79 70 229)'; // accent color

            canvasCtx.beginPath();
            const sliceWidth = waveformCanvas.width * 1.0 / waveArray.length;
            let x = 0;

            for (let i = 0; i < waveArray.length; i++) {
                const v = waveArray[i] / 2.0; // Adjust amplitude
                const y = (v * waveformCanvas.height / 2) + (waveformCanvas.height / 2);

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            canvasCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
            canvasCtx.stroke();
        }
        drawWaveform();
    }

    Tone.Transport.on('stop', () => {
        updatePlayPauseButton(false);
        if (progressBar) progressBar.style.width = '0%';
        const duration = Tone.Time(Tone.Transport.loopEnd).toSeconds();
        if (timeDisplay) timeDisplay.textContent = `0:00 / ${formatTime(duration)}`;
    });
    Tone.Transport.on('pause', () => updatePlayPauseButton(false));
    Tone.Transport.on('start', () => updatePlayPauseButton(true));

    function updateProgress() {
        requestAnimationFrame(updateProgress);
        
        // Safely get transport
        const transport = MusicGeneratorEngine.getTransport ? MusicGeneratorEngine.getTransport() : Tone.Transport;
        
        if (!transport) return;
        
        const progress = transport.progress || 0;
        const currentTime = transport.seconds || 0;
        const loopEnd = transport.loopEnd || '4m';
        const duration = Tone.Time(loopEnd).toSeconds();

        if (progressBar) progressBar.style.width = `${progress * 100}%`;
        
        if (timeDisplay) {
            if (isFinite(currentTime) && isFinite(duration) && duration > 0) {
                timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            } else {
                const loopEndSeconds = Tone.Time(loopEnd).toSeconds() || 0;
                timeDisplay.textContent = `0:00 / ${formatTime(loopEndSeconds)}`;
            }
        }
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${minutes}:${secs}`;
    }

    updateProgress();

    // Initial setup
    initializeApp(); // Call initialization function
    setMode('simple');
    if (volumeSlider) {
        Tone.getDestination().volume.value = Tone.gainToDb(volumeSlider.value);
    }
    if (reverbSlider) {
        MusicGeneratorEngine.setReverb(parseFloat(reverbSlider.value)); // Set initial reverb
    }
    renderHistory(); // Initial render
    setupWaveform(); // Initialize the waveform visualizer

    // --- Loading Overlay Click Handler ---
    if (loadingOverlay) {
        loadingOverlay.addEventListener('click', async () => {
            if (Tone.context.state !== 'running') {
                try {
                    await Tone.start();
                    console.log('✅ AudioContext started by user click');
                    if (loadingText) loadingText.textContent = '楽器を読み込んでいます...';
                    // Re-run initialization if needed
                    if (typeof MusicGeneratorEngine !== 'undefined' && MusicGeneratorEngine.loadInstruments) {
                        await MusicGeneratorEngine.loadInstruments();
                    }
                    if (loadingOverlay) loadingOverlay.style.display = 'none';
                } catch (error) {
                    console.error('Failed to start AudioContext:', error);
                }
            }
        });
    }

    // --- Protocol Check ---
    function checkProtocol() {
        console.log('🔍 Current protocol:', window.location.protocol);
        console.log('🔍 Current URL:', window.location.href);
        
        if (window.location.protocol === 'file:') {
            console.warn('⚠️ CORS WARNING: Using file:// protocol will cause CORS errors!');
            console.log('✅ SOLUTION: Please access via http://localhost:8000/tools/music-generator.html');
            
            // Show user-friendly warning
            if (loadingText) {
                loadingText.innerHTML = `
                    <div style="color: #f59e0b; text-align: center;">
                        <strong>⚠️ CORS エラーが発生します</strong><br>
                        正しいURL: <br>
                        <code style="background: #f3f4f6; padding: 2px 4px; border-radius: 4px;">
                            http://localhost:8000/tools/music-generator.html
                        </code><br>
                        でアクセスしてください
                    </div>
                `;
            }
            return false;
        }
        return true;
    }

    // Initial protocol check
    checkProtocol();
});
