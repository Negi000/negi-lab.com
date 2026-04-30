/**
 * Image Converter UI Controller
 * @description UI制御・イベントハンドリング・ユーザーインタラクション
 * @version 1.0.0
 * @author negi-lab.com
 */

// UI制御クラス
window.ImageConverterUI = {
    elements: {},
    maxFileSize: 50 * 1024 * 1024, // 50MB
    _initialized: false,
    
    // 初期化
    init: function() {
        if (this._initialized) {
            return;
        }
        this._initialized = true;
        this.cacheElements();
        this.bindEvents();
        if (window.ImageConverterPresets) {
            window.ImageConverterPresets.loadCustomPresets();
        }
        this.initializeForm();
        this.checkFormatSupport();
        this.initializeTranslations();
        // Core状態の存在保証
        if (!window.ImageConverterCore) {
            window.ImageConverterCore = {};
        }
        window.ImageConverterCore.selectedFiles = window.ImageConverterCore.selectedFiles || [];
        window.ImageConverterCore.results = window.ImageConverterCore.results || [];
        window.ImageConverterCore.currentRotation = window.ImageConverterCore.currentRotation || 0;
        window.ImageConverterCore.currentFilter = window.ImageConverterCore.currentFilter || 'none';
    },

    // 翻訳システム初期化（既に初期化されている場合はスキップ）
    initializeTranslations: function() {
        if (window.TranslationSystem && !window.TranslationSystem._initialized) {
            window.TranslationSystem.init();
        }
    },

    // 要素キャッシュ
    cacheElements: function() {
        this.elements = {
            // ファイル関連
            uploadArea: document.getElementById('imageUploadArea'),
            fileInput: document.getElementById('imageFile'),
            fileList: document.getElementById('fileList'),
            
            // プレビュー
            previewContainer: document.getElementById('previewContainer'),
            imagePreview: document.getElementById('imagePreview'),
            
            // フォーム要素
            presetSelect: document.getElementById('presetSelect'),
            outputFormat: document.getElementById('outputFormat'),
            qualitySlider: document.getElementById('qualityRange'),
            qualityValue: document.getElementById('qualityValue'),
            qualityContainer: document.getElementById('qualityControlContainer'),
            
            // サイズ制限
            aspectRatio: document.getElementById('aspectRatio'),
            maxWidthInput: document.getElementById('maxWidthInput'),
            maxHeightInput: document.getElementById('maxHeightInput'),
            
            // 回転ボタン
            rotate90: document.getElementById('rotate90'),
            rotate180: document.getElementById('rotate180'), 
            rotate270: document.getElementById('rotate270'),
            
            // フィルターボタン
            filterNone: document.getElementById('filterNone'),
            filterGrayscale: document.getElementById('filterGrayscale'),
            filterSepia: document.getElementById('filterSepia'),
            filterBlur: document.getElementById('filterBlur'),
            
            // アクションボタン
            convertBtn: document.getElementById('convertButton'),
            downloadAllBtn: document.getElementById('downloadAllBtn'),
            clearBtn: document.getElementById('clearResultsBtn'),
            
            // ステータス・結果
            statusMessage: document.getElementById('statusMessage'),
            errorMessage: document.getElementById('errorMessage'),
            resultContainer: document.getElementById('resultContainer'),
            resultsGrid: document.getElementById('resultsGrid'),
            
            // 進捗表示
            progressContainer: document.getElementById('progressContainer'),
            progressBar: document.getElementById('progressBar'),
            progressText: document.getElementById('progressText'),
            progressPercent: document.getElementById('progressPercent'),
            
            // リアルタイムプレビュー
            realtimePreview: document.getElementById('realtimePreview'),
            originalPreview: document.getElementById('originalPreview'),
            processedPreview: document.getElementById('processedPreview'),
            originalInfo: document.getElementById('originalInfo'),
            processedInfo: document.getElementById('processedInfo')
        };
    },

    // イベントバインド
    bindEvents: function() {
        // ファイルアップロード
        this.elements.uploadArea.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.uploadArea.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.elements.fileInput.click();
            }
        });
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // ドラッグ&ドロップ
        this.elements.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.elements.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.elements.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // プリセット変更
        this.elements.presetSelect.addEventListener('change', () => this.handlePresetChange());
        
        // フォーマット変更
        this.elements.outputFormat.addEventListener('change', () => this.updateQualityVisibility());
        
        // 品質スライダー
        if (this.elements.qualitySlider) {
            this.elements.qualitySlider.addEventListener('input', () => this.updateQualityValue());
        }
        
        // 回転ボタン
        this.elements.rotate90?.addEventListener('click', () => this.setRotation(90));
        this.elements.rotate180?.addEventListener('click', () => this.setRotation(180));
        this.elements.rotate270?.addEventListener('click', () => this.setRotation(270));
        
        // フィルターボタン
        this.elements.filterNone?.addEventListener('click', () => this.setFilter('none'));
        this.elements.filterGrayscale?.addEventListener('click', () => this.setFilter('grayscale'));
        this.elements.filterSepia?.addEventListener('click', () => this.setFilter('sepia'));
        this.elements.filterBlur?.addEventListener('click', () => this.setFilter('blur'));
        
        // アクションボタン
        this.elements.convertBtn?.addEventListener('click', () => this.convertImages());
        this.elements.downloadAllBtn?.addEventListener('click', () => this.downloadAllResults());
        this.elements.clearBtn?.addEventListener('click', () => this.clearAll());
    },

    // 初期化
    initializeForm: function() {
        this.updateQualityVisibility();
        this.updateQualityValue();
        window.ImageConverterPresets.loadCustomPresets();
    },

    // フォーマットサポート確認
    checkFormatSupport: function() {
        this.formatSupport = {
            standard: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
            custom: ['image/bmp', 'image/x-targa', 'application/ktx', 'application/ktx2', 'image/vnd-ms.dds'],
            fallback: ['image/tiff', 'image/vnd.radiance', 'image/x-exr', 'image/svg+xml'],
            tiffMode: window.UTIF_FALLBACK ? 'fallback' : 'utif'
        };
    },

    // ファイル選択処理
    handleFileSelect: function(event) {
        const files = Array.from(event.target.files);
        this.addFiles(files);
    },

    // ドラッグオーバー
    handleDragOver: function(event) {
        event.preventDefault();
        this.elements.uploadArea.classList.add('dragover');
    },

    // ドラッグリーブ
    handleDragLeave: function(event) {
        event.preventDefault();
        this.elements.uploadArea.classList.remove('dragover');
    },

    // ドロップ処理
    handleDrop: function(event) {
        event.preventDefault();
        this.elements.uploadArea.classList.remove('dragover');
        
        const files = Array.from(event.dataTransfer.files);
        this.addFiles(files);
    },

    // ファイル追加
    addFiles: function(files) {
        const validFiles = [];
        const errorFiles = [];

        files.forEach(file => {
            if (!this.isSupportedInputFile(file)) {
                errorFiles.push(`${file.name}: unsupported input format. Use JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, or AVIF when supported by your browser.`);
                return;
            }

            if (file.size > this.maxFileSize) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                errorFiles.push(`${file.name}: file is too large (${sizeMB}MB > 50MB).`);
                return;
            }

            validFiles.push(file);
        });

        // エラーファイルがある場合は表示
        if (errorFiles.length > 0) {
            this.showStatus(errorFiles.join('\n'), 'error');
        }

        if (validFiles.length === 0) {
            if (errorFiles.length === 0) {
                this.showStatus('Please select an image file.', 'error');
            }
            return;
        }

        // 既存ファイルに追加
        if (!Array.isArray(window.ImageConverterCore.selectedFiles)) {
            window.ImageConverterCore.selectedFiles = [];
        }
        window.ImageConverterCore.selectedFiles.push(...validFiles);
        this.updateFileList();
        this.showPreview(validFiles[0]);
        
        let message = `${validFiles.length} file(s) added.`;
        if (errorFiles.length > 0) {
            message += ` (${errorFiles.length} file(s) skipped)`;
        }
        this.showStatus(message, 'success');
        
        // リアルタイムプレビューを更新
        this.updateRealtimePreview();
    },

    // ファイルリスト更新
    isSupportedInputFile: function(file) {
        const supportedTypes = new Set([
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'image/bmp', 'image/tiff', 'image/svg+xml', 'image/avif'
        ]);
        const supportedExtensions = /.(jpe?g|png|webp|gif|bmp|tiff?|svg|avif)$/i;
        return supportedTypes.has(file.type) || supportedExtensions.test(file.name);
    },

    updateFileList: function() {
        const fileList = this.elements.fileList;
        if (!fileList) return;
        fileList.replaceChildren();

        window.ImageConverterCore.selectedFiles.forEach((file, index) => {
            const fileSize = this.formatFileSize(file.size);
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item flex items-center justify-between bg-gray-50 p-2 rounded mb-1';

            const fileMeta = document.createElement('div');
            fileMeta.className = 'flex-1 min-w-0';

            const fileName = document.createElement('span');
            fileName.className = 'text-sm text-gray-700 block break-all';
            fileName.textContent = file.name;

            const size = document.createElement('span');
            size.className = 'text-xs text-gray-500';
            size.textContent = fileSize;

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'text-red-500 hover:text-red-700 text-sm ml-2 shrink-0';
            removeButton.textContent = 'Remove';
            removeButton.setAttribute('aria-label', `Remove ${file.name}`);
            removeButton.addEventListener('click', () => this.removeFile(index));

            fileMeta.append(fileName, size);
            fileItem.append(fileMeta, removeButton);
            fileList.appendChild(fileItem);
        });
        
        // 変換ボタンの状態更新
        this.updateConvertButtonState();
    },

    // ファイル削除
    removeFile: function(index) {
        window.ImageConverterCore.selectedFiles.splice(index, 1);
        this.updateFileList();
        
        if (window.ImageConverterCore.selectedFiles.length === 0) {
            this.elements.previewContainer.classList.add('hidden');
            this.showStatus('All files removed.', 'info');
        }
    },

    // プレビュー表示
    showPreview: function(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.elements.imagePreview.src = e.target.result;
            this.elements.previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    },

    // プリセット変更処理
    handlePresetChange: function() {
        const presetId = this.elements.presetSelect.value;
        
        if (presetId === 'custom') {
            return;
        }

        const preset = window.ImageConverterPresets.getPreset(presetId);
        if (!preset) return;

        // フォーム値更新
        this.elements.outputFormat.value = preset.format;
        
        if (this.elements.qualitySlider && preset.quality !== undefined) {
            const val = Math.max(0.1, Math.min(1, preset.quality));
            this.elements.qualitySlider.value = val;
        }
        
        if (preset.maxWidth) {
            this.elements.maxWidthInput.value = preset.maxWidth;
        }
        
        if (preset.maxHeight) {
            this.elements.maxHeightInput.value = preset.maxHeight;
        }

        // UI更新
        this.updateQualityVisibility();
        this.updateQualityValue();
        this.setRotation(preset.rotation || 0);
        this.setFilter(preset.filter || 'none');

        this.showStatus(`プリセット「${preset.description}」を適用しました。`, 'info');
    },

    // 品質表示更新
    updateQualityVisibility: function() {
        const format = this.elements.outputFormat.value;
    const formatInfo = window.ImageConverterPresets?.getFormatInfo ? window.ImageConverterPresets.getFormatInfo(format) : null;
        
        if (formatInfo && formatInfo.supportsQuality) {
            this.elements.qualityContainer?.classList.remove('hidden');
        } else {
            this.elements.qualityContainer?.classList.add('hidden');
        }
    },

    // 品質値更新
    updateQualityValue: function() {
        if (this.elements.qualitySlider && this.elements.qualityValue) {
            const val = this.elements.qualitySlider.value;
            this.elements.qualityValue.textContent = (parseFloat(val)).toFixed(2);
        }
    },

    // 回転設定
    setRotation: function(degrees) {
    window.ImageConverterCore.currentRotation = degrees;
        
        // ボタンの状態更新
        document.querySelectorAll('[id^="rotate"]').forEach(btn => {
            btn.classList.remove('rotation-active');
        });
        
        if (degrees > 0) {
            document.getElementById(`rotate${degrees}`)?.classList.add('rotation-active');
        }
    },

    // フィルター設定
    setFilter: function(filterType) {
        window.ImageConverterCore.currentFilter = filterType;
        
        // ボタンの状態更新
        document.querySelectorAll('[id^="filter"]').forEach(btn => {
            btn.classList.remove('filter-button-active');
        });
        
        const activeBtn = document.getElementById(`filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`);
        activeBtn?.classList.add('filter-button-active');
    },

    // 画像変換実行
    convertImages: async function() {
        if (window.ImageConverterCore.selectedFiles.length === 0) {
            this.showStatus('Please select at least one image before converting.', 'error');
            return;
        }

        try {
            // UI状態を変換中に変更
            this.elements.convertBtn.disabled = true;
            const spinner = document.createElement('span');
            spinner.className = 'spinner mr-2';
            this.elements.convertBtn.replaceChildren(spinner, document.createTextNode('Converting...'));
            this.showProgress(0, window.ImageConverterCore.selectedFiles.length, 'Starting conversion...');
            
            // 結果リセット
            window.ImageConverterCore.results = [];
            
            const totalFiles = window.ImageConverterCore.selectedFiles.length;
            
            // ファイルを順次処理
            for (let i = 0; i < totalFiles; i++) {
                const file = window.ImageConverterCore.selectedFiles[i];
                
                this.showProgress(i, totalFiles, `Converting ${file.name}...`);
                
                try {
                    const result = await this.convertSingleImage(file);
                    window.ImageConverterCore.results.push(result);
                } catch (error) {
                    console.error(`Conversion error (${file.name}):`, error);
                    window.ImageConverterCore.results.push({
                        fileName: file.name,
                        error: error.message || 'Conversion failed',
                        originalSize: file.size
                    });
                }
            }
            
            // 完了
            this.showProgress(totalFiles, totalFiles, 'Conversion complete');
            setTimeout(() => this.hideProgress(), 1000);
            
            // 結果表示
            this.displayResults();
            this.showStatus(`${totalFiles} file(s) converted.`, 'success');
            
        } catch (error) {
            console.error('Batch conversion error:', error);
            this.showStatus('An error occurred during conversion.', 'error');
            this.hideProgress();
        } finally {
            // UI状態を元に戻す
            this.elements.convertBtn.disabled = false;
            this.elements.convertBtn.replaceChildren(document.createTextNode('Start Conversion'));
        }
    },

    // 単一画像変換
    convertSingleImage: async function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const img = new Image();
                    img.onload = async () => {
                        try {
                            const canvas = this.createProcessedCanvas(img);
                            const format = this.elements.outputFormat.value;
                            const quality = this.getQualityValue();
                            
                            const blob = await window.ImageConverterCore.FormatConverter.canvasToBlob(canvas, format, quality);
                            
                            resolve({
                                fileName: this.generateFileName(file.name, format),
                                originalSize: file.size,
                                convertedSize: blob.size,
                                convertedBlob: blob,
                                format: format
                            });
                        } catch (error) {
                            reject(error);
                        }
                    };
                    img.onerror = () => reject(new Error('The image could not be loaded.'));
                    img.src = e.target.result;
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('The file could not be read.'));
            reader.readAsDataURL(file);
        });
    },

    // ファイル名生成
    generateFileName: function(originalName, format) {
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
        const extension = this.getExtensionFromFormat(format);
        return `${nameWithoutExt}.${extension}`;
    },

    // フォーマットから拡張子を取得
    getExtensionFromFormat: function(format) {
        const extensionMap = {
            // 標準フォーマット
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'image/gif': 'gif',
            'image/bmp': 'bmp',
            'image/tiff': 'tiff',
            'image/tif': 'tiff',
            'image/svg+xml': 'svg',
            'image/svg': 'svg',
            'image/avif': 'avif',
            'image/heic': 'heic',
            'image/heif': 'heif',
            'image/jxl': 'jxl',
            // ゲーム・3D制作向け
            'application/ktx': 'ktx',
            'application/ktx2': 'ktx2',
            'image/x-targa': 'tga',
            'image/tga': 'tga',
            'image/vnd-ms.dds': 'dds',
            'image/dds': 'dds',
            // 高品質・専門フォーマット
            'image/vnd.radiance': 'hdr',
            'image/hdr': 'hdr',
            'image/x-exr': 'exr',
            'image/exr': 'exr',
            'image/x-portable-pixmap': 'ppm',
            'image/x-portable-graymap': 'pgm',
            'image/x-portable-bitmap': 'pbm',
            'image/x-portable-anymap': 'pnm',
            // RAW・カメラフォーマット
            'image/x-canon-cr2': 'cr2',
            'image/x-canon-crw': 'crw',
            'image/x-nikon-nef': 'nef',
            'image/x-sony-arw': 'arw',
            'image/x-adobe-dng': 'dng'
        };
    return extensionMap[format] || 'bin';
    },

    // 単一ファイル処理
    processFile: function(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = async () => {
                try {
                    const canvas = this.createProcessedCanvas(img);
                    const format = this.elements.outputFormat.value;
                    const quality = this.elements.qualitySlider ? 
                        this.elements.qualitySlider.value / 100 : 0.8;
                    
                    const blob = await window.ImageConverterCore.FormatConverter.canvasToBlob(
                        canvas, format, quality
                    );
                    
                    const formatInfo = window.ImageConverterPresets.getFormatInfo(format);
                    const extension = formatInfo ? formatInfo.extension : 'bin';
                    const baseName = file.name.replace(/\\.[^/.]+$/, "");
                    const fileName = `${baseName}.${extension}`;
                    
                    resolve({
                        originalFile: file,
                        convertedBlob: blob,
                        fileName: fileName,
                        format: format,
                        originalSize: file.size,
                        convertedSize: blob.size
                    });
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = () => reject(new Error('The image could not be loaded.'));
            img.src = URL.createObjectURL(file);
        });
    },

    // 処理済みCanvas作成
    createProcessedCanvas: function(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // サイズ計算
        let width = img.width;
        let height = img.height;
        
        const maxWidth = this.elements.maxWidthInput.value ? 
            parseInt(this.elements.maxWidthInput.value) : null;
        const maxHeight = this.elements.maxHeightInput.value ? 
            parseInt(this.elements.maxHeightInput.value) : null;
        
        if (maxWidth || maxHeight) {
            const scale = Math.min(
                maxWidth ? maxWidth / width : 1,
                maxHeight ? maxHeight / height : 1
            );
            width *= scale;
            height *= scale;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // フィルター適用
        const filter = window.ImageConverterPresets.getFilter(window.ImageConverterCore.currentFilter);
        if (filter && filter.filter) {
            ctx.filter = filter.filter;
        }
        
        // 回転処理
        const rotation = window.ImageConverterCore.currentRotation;
        if (rotation) {
            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -width / 2, -height / 2, width, height);
            ctx.restore();
        } else {
            ctx.drawImage(img, 0, 0, width, height);
        }
        
        return canvas;
    },

    // 結果表示
    displayResults: function(results) {
        const data = results ?? window.ImageConverterCore.results ?? [];
        window.ImageConverterCore.results = data;
        const grid = this.elements.resultsGrid || this.elements.resultsContainer;
        if (!grid) return;
        grid.replaceChildren();
        
        data.forEach((result, index) => {
            const resultItem = this.createResultItem(result, index);
            grid.appendChild(resultItem);
        });
        
        this.elements.resultContainer?.classList.remove('hidden');
        this.elements.downloadAllBtn?.classList.remove('hidden');
    },

    // 結果アイテム作成
    createResultItem: function(result, index) {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded-lg shadow border';
        
        if (result.error) {
            const errorWrap = document.createElement('div');
            errorWrap.className = 'text-red-600';

            const name = document.createElement('p');
            name.className = 'font-medium break-all';
            name.textContent = result.fileName || result.originalFile?.name || 'File';

            const message = document.createElement('p');
            message.className = 'text-sm';
            message.textContent = `Error: ${result.error}`;

            errorWrap.append(name, message);
            div.appendChild(errorWrap);
        } else {
            const row = document.createElement('div');
            row.className = 'flex flex-col sm:flex-row sm:items-center justify-between gap-3';

            const details = document.createElement('div');
            details.className = 'min-w-0';

            const name = document.createElement('p');
            name.className = 'font-medium text-gray-800 break-all';
            name.textContent = result.fileName;

            const sizeLine = document.createElement('p');
            sizeLine.className = 'text-sm text-gray-600';
            const delta = result.originalSize - result.convertedSize;
            const ratio = result.originalSize > 0 ? Math.abs(delta / result.originalSize * 100).toFixed(1) : '0.0';
            const change = document.createElement('span');
            change.className = delta >= 0 ? 'text-green-600' : 'text-orange-600';
            change.textContent = delta >= 0 ? ` (${ratio}% smaller)` : ` (${ratio}% larger)`;
            sizeLine.append(
                document.createTextNode(`${this.formatFileSize(result.originalSize)} -> ${this.formatFileSize(result.convertedSize)}`),
                change
            );

            const downloadButton = document.createElement('button');
            downloadButton.type = 'button';
            downloadButton.className = 'form-button px-4 py-2 text-sm shrink-0 self-start sm:self-auto';
            downloadButton.textContent = 'Download';
            downloadButton.setAttribute('aria-label', `Download ${result.fileName}`);
            downloadButton.addEventListener('click', () => this.downloadResult(index));

            details.append(name, sizeLine);
            row.append(details, downloadButton);
            div.appendChild(row);
        }
        
        return div;
    },

    // 単一結果ダウンロード
    downloadResult: function(index) {
        const result = window.ImageConverterCore.results[index];
        if (!result || result.error) return;
        
        const url = URL.createObjectURL(result.convertedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.fileName;
        a.click();
        URL.revokeObjectURL(url);
    },

    // 全結果ダウンロード
    downloadAllResults: function() {
        window.ImageConverterCore.results.forEach((result, index) => {
            if (!result.error) {
                setTimeout(() => this.downloadResult(index), index * 100);
            }
        });
    },

    // 全クリア
    clearAll: function() {
        window.ImageConverterCore.selectedFiles = [];
        window.ImageConverterCore.results = [];
        
        this.elements.fileList?.replaceChildren();
        this.elements.resultsGrid?.replaceChildren();
        this.elements.previewContainer.classList.add('hidden');
        this.elements.resultContainer?.classList.add('hidden');
        this.elements.downloadAllBtn?.classList.add('hidden');
        
        this.showStatus('Cleared files and results.', 'info');
    },

    // ステータス表示
    showStatus: function(message, type = 'info') {
        if (!this.elements.statusMessage) return;
        
        const colors = {
            'success': 'text-green-600',
            'error': 'text-red-600', 
            'warning': 'text-yellow-600',
            'info': 'text-blue-600'
        };
        
        this.elements.statusMessage.textContent = message;
        this.elements.statusMessage.className = `text-sm mt-2 ${colors[type] || colors.info}`;
        
        // 3秒後に自動消去
        setTimeout(() => {
            if (this.elements.statusMessage.textContent === message) {
                this.elements.statusMessage.textContent = '';
            }
        }, 3000);
    },

    // 進捗表示機能
    showProgress: function(current, total, message) {
        if (this.elements.progressContainer) {
            this.elements.progressContainer.classList.remove('hidden');
            
            const percent = Math.round((current / total) * 100);
            this.elements.progressBar.style.width = percent + '%';
            this.elements.progressText.textContent = message || `Processing... (${current}/${total})`;
            this.elements.progressPercent.textContent = percent + '%';
        }
    },
    
    // 進捗非表示
    hideProgress: function() {
        if (this.elements.progressContainer) {
            this.elements.progressContainer.classList.add('hidden');
        }
    },
    
    // ファイルサイズフォーマット
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // 変換ボタン状態更新
    updateConvertButtonState: function() {
        if (this.elements.convertBtn) {
            const hasFiles = window.ImageConverterCore.selectedFiles.length > 0;
            this.elements.convertBtn.disabled = !hasFiles;
        }
    },
    
    // リアルタイムプレビュー更新
    updateRealtimePreview: function() {
        if (!this.elements.realtimePreview || window.ImageConverterCore.selectedFiles.length === 0) {
            this.elements.realtimePreview?.classList.add('hidden');
            return;
        }
        
        const firstFile = window.ImageConverterCore.selectedFiles[0];
        this.showRealtimePreview(firstFile);
    },
    
    // リアルタイムプレビュー表示
    showRealtimePreview: function(file) {
        if (!this.elements.realtimePreview) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            // 元画像表示
            this.elements.originalPreview.src = e.target.result;
            this.elements.originalInfo.textContent = `${this.formatFileSize(file.size)} | ${file.type}`;
            
            // 変換後プレビューを生成
            this.generateProcessedPreview(e.target.result, file);
            
            this.elements.realtimePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    },
    
    // 変換後プレビュー生成
    generateProcessedPreview: function(originalDataUrl, file) {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = this.createProcessedCanvas(img);
                const format = this.elements.outputFormat.value;
                const quality = this.getQualityValue();
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        this.elements.processedPreview.src = url;
                        this.elements.processedInfo.textContent = 
                            `${this.formatFileSize(blob.size)} | ${format}`;
                        
                        // メモリリーク防止のため、少し遅れてURLを削除
                        setTimeout(() => URL.revokeObjectURL(url), 1000);
                    }
                }, format, quality);
            } catch (error) {
                console.error('Preview generation failed:', error);
                this.elements.processedInfo.textContent = 'Preview generation failed';
            }
        };
        img.src = originalDataUrl;
    },
    
    // 品質値取得
    getQualityValue: function() {
    const qualitySlider = document.getElementById('qualityRange');
    // HTMLのmin/maxは0.1-1で指定。Canvasや一部フォーマットは0-1を期待。
    const v = qualitySlider ? parseFloat(qualitySlider.value) : 0.9;
    return Math.max(0.0, Math.min(1.0, v));
    },
    
    // 設定変更時のリアルタイム更新
    onSettingChange: function() {
        // 設定が変更されたときにプレビューを更新
        if (window.ImageConverterCore.selectedFiles.length > 0) {
            this.updateRealtimePreview();
        }
    }
};

// 設定変更イベントの監視
document.addEventListener('DOMContentLoaded', function() {
    // 品質スライダー変更時
    const qualityRange = document.getElementById('qualityRange');
    if (qualityRange) {
        qualityRange.addEventListener('input', function() {
            window.ImageConverterUI.onSettingChange();
        });
    }
    
    // フォーマット変更時
    const outputFormat = document.getElementById('outputFormat');
    if (outputFormat) {
        outputFormat.addEventListener('change', function() {
            window.ImageConverterUI.onSettingChange();
        });
    }
    
    // フィルターボタン変更時
    const filterButtons = document.querySelectorAll('[id^="filter"]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => window.ImageConverterUI.onSettingChange(), 100);
        });
    });
    
    // 回転ボタン変更時
    const rotateButtons = document.querySelectorAll('[id^="rotate"]');
    rotateButtons.forEach(button => {
        button.addEventListener('click', function() {
            setTimeout(() => window.ImageConverterUI.onSettingChange(), 100);
        });
    });
});

// DOM読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', function() {
    window.ImageConverterUI.init();
});
