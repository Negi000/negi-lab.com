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
    // Note: Loading overlay removed as per user request

    // --- Initial Loading ---
    async function initializeApp() {
        // Music generator app initialization
        
        // Check if using correct protocol
        if (!checkProtocol()) {
            return; // Stop initialization if using file:// protocol
        }
        
        // Note: Loading overlay removed as per user request
        
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
            
            // Wait for music engine to be available
            let engineAttempts = 0;
            while (!window.musicGenerator && engineAttempts < 100) {
                await new Promise(resolve => setTimeout(resolve, 50));
                engineAttempts++;
            }
            
            if (window.musicGenerator) {
                // Wait for engine initialization
                let initAttempts = 0;
                while (!window.musicGenerator.isInitialized && initAttempts < 100) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    initAttempts++;
                }
                
                if (window.musicGenerator.isInitialized) {
                    // Advanced AI Music Engine ready
                    updateInstrumentOptions();
                } else {
                    // Fallback mode
                    updateInstrumentOptions();
                }
            }
            
            // App initialization completed
            
            // Note: Loading overlay removed as per user request
        } catch (error) {
            console.error("❌ Initialization failed:", error);
            // Note: Loading overlay error handling removed as per user request
            // App continues with fallback instruments
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
            // Reverb is now handled by the advanced engine's effects chain
            console.log(`🎛️ Reverb set to: ${value}`);
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
                // Note: Loading indicator removed as per user request
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
                    
                    // Simple tempo mapping for the new engine
                    const tempoRanges = {
                        slow: [60, 90],
                        medium: [90, 120],
                        fast: [120, 160]
                    };
                    const tempoRange = tempoRanges[tempoName] || tempoRanges.medium;
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
    
                // Generate music using Advanced AI Engine
                const composition = await window.musicGenerator.generateAdvancedComposition(options);
    
                console.log('Generated AI composition:', composition);
    
                // Update UI for player
                if (playerPlaceholder) playerPlaceholder.style.display = 'none';
                if (playerControls) playerControls.style.display = 'flex';
                
                // Don't auto-start playback, just show controls as ready
                updatePlayPauseButton(false); // Set to pause state initially
    
                // Add to history
                addToHistory(options, composition);
    
            } catch (error) {
                console.error("Generation failed:", error);
                alert("音楽の生成に失敗しました。");
            } finally {
                // Note: Loading indicator removed as per user request
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
        playPauseBtn.addEventListener('click', async () => {
            // Resume AudioContext if suspended
            if (Tone.context.state !== 'running') {
                await Tone.start();
                console.log('✅ AudioContext started');
            }
            
            if (Tone.Transport.state === 'started') {
                window.musicGenerator.stop();
                updatePlayPauseButton(false);
            } else {
                // If we have a current composition, play it
                if (window.musicGenerator.currentComposition) {
                    Tone.Transport.start();
                    updatePlayPauseButton(true);
                } else {
                    console.warn('No composition to play');
                }
            }
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            window.musicGenerator.stop();
            updatePlayPauseButton(false);
        });
    }

    if (loopToggle) {
        loopToggle.addEventListener('change', () => {
            Tone.Transport.loop = loopToggle.checked;
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value); // Float value from 0 to 1
            const percentage = Math.round(value * 100); // Convert to percentage
            
            // Convert to dB (-60dB to 0dB range)
            let dbValue;
            if (value === 0) {
                dbValue = -Infinity;
            } else {
                // Convert 0.01-1.0 to -60dB to 0dB
                dbValue = -60 + (value * 60);
            }
            
            Tone.getDestination().volume.value = dbValue;
            console.log(`🔊 Volume set to: ${percentage}% (${dbValue === -Infinity ? '-∞' : dbValue.toFixed(1)}dB)`);
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
                if (window.musicGenerator && window.musicGenerator.playFromHistory) {
                    console.log('🎵 Playing from history:', item.options);
                    window.musicGenerator.playFromHistory(item.musicData);
                } else {
                    console.warn('❌ Music generator not available for history playback');
                }
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
        
        // Use Tone.Transport directly since we're using the new engine
        const transport = Tone.Transport;
        
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
        const initialValue = parseFloat(volumeSlider.value) || 0.8; // Float value from HTML
        const initialPercentage = Math.round(initialValue * 100);
        
        // Use same calculation as in the event listener
        let dbValue;
        if (initialValue === 0) {
            dbValue = -Infinity;
        } else {
            dbValue = -60 + (initialValue * 60);
        }
        Tone.getDestination().volume.value = dbValue;
        console.log(`🔊 Initial volume set to: ${initialPercentage}% (${dbValue === -Infinity ? '-∞' : dbValue.toFixed(1)}dB)`);
    }
    if (reverbSlider) {
        // Initial reverb will be set by the reverb slider event listener
        console.log('🎛️ Initial reverb value:', reverbSlider.value);
    }
    renderHistory(); // Initial render
    setupWaveform(); // Initialize the waveform visualizer

    // Note: Loading overlay click handler removed as per user request

    // --- Protocol Check ---
    function checkProtocol() {
        console.log('🔍 Current protocol:', window.location.protocol);
        console.log('🔍 Current URL:', window.location.href);
        
        // CORS warnings removed - using CDN now
        return true;
    }

    // Initial protocol check
    checkProtocol();

    // --- Instrument Options Update ---
    function updateInstrumentOptions() {
        console.log('🎺 Updating instrument options...');
        
        if (!window.musicGenerator || !window.musicGenerator.instruments) {
            console.warn('⚠️ Advanced Music Engine not available for instrument update');
            return;
        }
        
        const instruments = Object.keys(window.musicGenerator.instruments);
        console.log(`🎼 Available instruments: ${instruments.join(', ')}`);
        
        // Update melody instrument options
        if (melodyInstrumentSelect) {
            updateSelectOptions(melodyInstrumentSelect, instruments, 'piano');
        }
        
        // Update chord instrument options
        if (chordInstrumentSelect) {
            updateSelectOptions(chordInstrumentSelect, instruments, 'piano');
        }
        
        // Update bass instrument options
        if (bassInstrumentSelect) {
            updateSelectOptions(bassInstrumentSelect, instruments, 'bass-electric');
        }
    }
    
    function updateSelectOptions(selectElement, options, defaultValue) {
        selectElement.innerHTML = '';
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = formatInstrumentName(option);
            if (option === defaultValue) {
                optionElement.selected = true;
            }
            selectElement.appendChild(optionElement);
        });
    }
    
    function formatInstrumentName(instrumentName) {
        return instrumentName
            .replace(/-/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    }
});
