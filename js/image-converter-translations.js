/**
 * 画像変換ツール専用翻訳データ & システム
 * @description image-converter.html専用の多言語対応
 * @version 1.0.0
 * @author negi-lab.com
 */

// 画像変換ツール用翻訳データ
window.imageConverterTranslations = {
    ja: {
        // ページタイトル・メタ
        'pageTitle': '【無料】プロ仕様画像変換ツール - KTX・DDS・TGA等20形式対応 一括処理 | negi-lab.com',
        'metaDescription': 'KTX・KTX2・DDS・TGAなどゲーム開発対応、最新フォーマット20種類に対応した高機能変換ツール。複数ファイル一括処理、回転・フィルター効果、ゲーム/VR/3D制作向けプリセット搭載。最大50MB対応。',
        
        // ヘッダー
        'nav.tools': 'ツール',
        'nav.wikis': 'ゲームWiki',
        'nav.home': 'ホーム',
        'nav.imageConverterTool': '画像変換ツール',
        
        // メインタイトル
        'mainTitle': 'プロ仕様画像変換ツール',
        'subtitle': 'KTX・DDS・TGA等20形式対応 – ゲーム・VR・3D制作から一般用途まで',
        'description': '複数ファイル一括処理、回転・フィルター効果、用途別プリセット搭載で開発効率を大幅向上',
        
        // ファイルアップロード
        'upload.label': '画像ファイルをアップロード:',
        'upload.instructions': 'ここにファイルをドラッグ&ドロップ<br>またはクリックで選択（複数ファイル対応）',
        'upload.supportedFormats': '対応形式: JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, KTX, KTX2, DDS, TGA, HDR, EXR, AVIF, HEIC, JPEG XL',
        'upload.maxFileSize': '最大ファイルサイズ: 50MB',
        
        // プレビュー
        'preview.title': 'プレビュー比較',
        'preview.original': '元画像',
        'preview.processed': '変換後プレビュー',
        
        // プリセット
        'presets.label': 'プリセット設定:',
        'presets.custom': 'カスタム設定',
        'presets.webStandard': 'Web標準 (JPEG 80%)',
        'presets.webOptimized': 'Web最適化 (WebP 75%)',
        'presets.socialMedia': 'SNS投稿用 (JPEG 70%, 1080px)',
        'presets.printQuality': '印刷品質 (JPEG 95%)',
        'presets.thumbnail': 'サムネイル用 (JPEG 70%, 300px)',
        'presets.gameTexture': 'ゲームテクスチャ (KTX2 80%)',
        'presets.mobileGame': 'モバイルゲーム (KTX 512px)',
        'presets.threeDModel': '3Dモデル用 (TGA)',
        'presets.hdrImaging': 'HDRイメージング',
        'presets.vfxExr': 'VFX・映像制作 (EXR)',
        
        // 出力フォーマット
        'outputFormat.label': '出力フォーマット:',
        'outputFormat.standard': '標準フォーマット',
        'outputFormat.gaming': 'ゲーム・3D制作',
        'outputFormat.professional': '高品質・専門用途',
        'outputFormat.jpeg': 'JPEG',
        'outputFormat.png': 'PNG',
        'outputFormat.webp': 'WebP',
        'outputFormat.gif': 'GIF',
        'outputFormat.bmp': 'BMP',
        'outputFormat.tiff': 'TIFF',
        'outputFormat.avif': 'AVIF (次世代)',
        'outputFormat.ktx': 'KTX (Khronos Texture)',
        'outputFormat.ktx2': 'KTX2 (Khronos Texture 2.0)',
        'outputFormat.tga': 'TGA (Targa)',
        'outputFormat.dds': 'DDS (DirectDraw Surface)',
        'outputFormat.hdr': 'HDR (ハイダイナミックレンジ)',
        'outputFormat.exr': 'EXR (OpenEXR)',
        'outputFormat.jxl': 'JPEG XL',
        
        // 変換オプション
        'options.rotation': '画像回転:',
        'options.aspectRatio': 'アスペクト比:',
        'options.aspectOriginal': '元の比率を維持',
        'options.aspectSquare': '1:1 (正方形)',
        'options.aspectCustom': 'カスタム',
        'options.filters': 'フィルター効果:',
        'options.filterNone': 'なし',
        'options.filterGrayscale': 'グレースケール',
        'options.filterSepia': 'セピア',
        'options.filterBlur': 'ぼかし',
        'options.brightness': '明度調整:',
        'options.quality': '品質 (JPEG/WebP/KTX/TGA):',
        'options.maxDimensions': '最大寸法 (省略可):',
        'options.maxWidth': '最大幅 (px):',
        'options.maxHeight': '最大高さ (px):',
        'options.exampleWidth': '例: 1920',
        'options.exampleHeight': '例: 1080',
        
        // アクション
        'actions.convert': '変換開始',
        'actions.downloadAll': '全てダウンロード',
        'actions.clearResults': '結果をクリア',
        
        // 結果・進捗
        'results.title': '結果:',
        'progress.processing': '処理中...',
        'progress.percentage': '0%',
        
        // セクション
        'sections.guideTitle': '画像変換活用完全ガイド',
        'sections.formatTitle': '対応フォーマット技術解説',
        'sections.faqTitle': 'よくある質問・トラブルシューティング',
        'sections.casesTitle': '実際の活用事例',
        
        // ガイド
        'guide.webDev': 'Web・アプリ開発',
        'guide.contentCreation': 'コンテンツ制作・SNS',
        'guide.businessPrint': 'ビジネス・印刷業界',
        
        // フォーマット
        'formats.gamingSection': 'ゲーム・VR/AR開発者向けフォーマット',
        'formats.webSection': '一般・Web用フォーマット',
        'formats.techSection': '技術仕様と最適化',
        
        // 言語選択
        'lang.ja': '日本語',
        'lang.en': 'English'
    },
    
    en: {
        // Page title & meta
        'pageTitle': 'Free Professional Image Converter - KTX・DDS・TGA 20+ Formats Batch Processing | negi-lab.com',
        'metaDescription': 'Advanced image conversion tool supporting 20+ formats including KTX, KTX2, DDS, TGA for game development. Batch processing, rotation, filters, and specialized presets for gaming/VR/3D creation. Up to 50MB support.',
        
        // Header
        'nav.tools': 'Tools',
        'nav.wikis': 'Game Wikis',
        'nav.home': 'Home',
        'nav.imageConverterTool': 'Image Converter',
        
        // Main title
        'mainTitle': 'Professional Image Converter',
        'subtitle': '20+ Formats Including KTX・DDS・TGA – From Gaming/VR/3D to General Use',
        'description': 'Batch processing, rotation & filter effects, specialized presets for dramatically improved development efficiency',
        
        // File upload
        'upload.label': 'Upload Image Files:',
        'upload.instructions': 'Drag & drop files here<br>or click to select (multiple files supported)',
        'upload.supportedFormats': 'Supported formats: JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, KTX, KTX2, DDS, TGA, HDR, EXR, AVIF, HEIC, JPEG XL',
        'upload.maxFileSize': 'Max file size: 50MB',
        
        // Preview
        'preview.title': 'Preview Comparison',
        'preview.original': 'Original',
        'preview.processed': 'Converted Preview',
        
        // Presets
        'presets.label': 'Preset Settings:',
        'presets.custom': 'Custom Settings',
        'presets.webStandard': 'Web Standard (JPEG 80%)',
        'presets.webOptimized': 'Web Optimized (WebP 75%)',
        'presets.socialMedia': 'Social Media (JPEG 70%, 1080px)',
        'presets.printQuality': 'Print Quality (JPEG 95%)',
        'presets.thumbnail': 'Thumbnail (JPEG 70%, 300px)',
        'presets.gameTexture': 'Game Texture (KTX2 80%)',
        'presets.mobileGame': 'Mobile Game (KTX 512px)',
        'presets.threeDModel': '3D Model (TGA)',
        'presets.hdrImaging': 'HDR Imaging',
        'presets.vfxExr': 'VFX Production (EXR)',
        
        // Output format
        'outputFormat.label': 'Output Format:',
        'outputFormat.standard': 'Standard Formats',
        'outputFormat.gaming': 'Gaming & 3D Creation',
        'outputFormat.professional': 'High Quality & Professional',
        'outputFormat.jpeg': 'JPEG',
        'outputFormat.png': 'PNG',
        'outputFormat.webp': 'WebP',
        'outputFormat.gif': 'GIF',
        'outputFormat.bmp': 'BMP',
        'outputFormat.tiff': 'TIFF',
        'outputFormat.avif': 'AVIF (Next-gen)',
        'outputFormat.ktx': 'KTX (Khronos Texture)',
        'outputFormat.ktx2': 'KTX2 (Khronos Texture 2.0)',
        'outputFormat.tga': 'TGA (Targa)',
        'outputFormat.dds': 'DDS (DirectDraw Surface)',
        'outputFormat.hdr': 'HDR (High Dynamic Range)',
        'outputFormat.exr': 'EXR (OpenEXR)',
        'outputFormat.jxl': 'JPEG XL',
        
        // Conversion options
        'options.rotation': 'Image Rotation:',
        'options.aspectRatio': 'Aspect Ratio:',
        'options.aspectOriginal': 'Keep Original',
        'options.aspectSquare': '1:1 (Square)',
        'options.aspectCustom': 'Custom',
        'options.filters': 'Filter Effects:',
        'options.filterNone': 'None',
        'options.filterGrayscale': 'Grayscale',
        'options.filterSepia': 'Sepia',
        'options.filterBlur': 'Blur',
        'options.brightness': 'Brightness:',
        'options.quality': 'Quality (JPEG/WebP/KTX/TGA):',
        'options.maxDimensions': 'Max Dimensions (optional):',
        'options.maxWidth': 'Max Width (px):',
        'options.maxHeight': 'Max Height (px):',
        'options.exampleWidth': 'e.g. 1920',
        'options.exampleHeight': 'e.g. 1080',
        
        // Actions
        'actions.convert': 'Start Conversion',
        'actions.downloadAll': 'Download All',
        'actions.clearResults': 'Clear Results',
        
        // Results & progress
        'results.title': 'Results:',
        'progress.processing': 'Processing...',
        'progress.percentage': '0%',
        
        // Sections
        'sections.guideTitle': 'Complete Image Conversion Guide',
        'sections.formatTitle': 'Supported Formats Technical Guide',
        'sections.faqTitle': 'FAQ & Troubleshooting',
        'sections.casesTitle': 'Real-world Use Cases',
        
        // Guide
        'guide.webDev': 'Web & App Development',
        'guide.contentCreation': 'Content Creation & Social Media',
        'guide.businessPrint': 'Business & Printing Industry',
        
        // Formats
        'formats.gamingSection': 'Gaming & VR/AR Development Formats',
        'formats.webSection': 'General & Web Formats',
        'formats.techSection': 'Technical Specifications & Optimization',
        
        // Language options
        'lang.ja': '日本語',
        'lang.en': 'English'
    }
};

// 画像変換ツール専用翻訳システム
window.ImageConverterTranslationSystem = {
    currentLang: 'ja',
    
    init: function() {
        console.log('ImageConverter TranslationSystem: Initializing...');
        this.detectLanguage();
        this.applyTranslations();
        this.bindLanguageSwitch();
    },
    
    detectLanguage: function() {
        const saved = localStorage.getItem('selectedLanguage');
        if (saved && (saved === 'ja' || saved === 'en')) {
            this.currentLang = saved;
        }
        
        const langSelect = document.getElementById('lang-switch');
        if (langSelect) {
            langSelect.value = this.currentLang;
        }
    },
    
    bindLanguageSwitch: function() {
        const langSelect = document.getElementById('lang-switch');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                this.switchLanguage(e.target.value);
            });
        }
    },
    
    switchLanguage: function(lang) {
        console.log('ImageConverter TranslationSystem: Switching to', lang);
        this.currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        this.applyTranslations();
    },
    
    applyTranslations: function() {
        if (!window.imageConverterTranslations || !window.imageConverterTranslations[this.currentLang]) {
            console.error('ImageConverter translation data not available for', this.currentLang);
            return;
        }
        
        const translations = window.imageConverterTranslations[this.currentLang];
        const elements = document.querySelectorAll('[data-translate-key]');
        
        console.log('ImageConverter TranslationSystem: Found', elements.length, 'elements to translate');
        
        let translated = 0;
        elements.forEach(element => {
            const key = element.getAttribute('data-translate-key');
            
            // imageConverter. や header.nav. のプレフィックスを除去
            const cleanKey = key.replace(/^imageConverter\./, '').replace(/^header\./, '').replace(/^option\./, 'lang.');
            const text = translations[cleanKey];
            
            if (text) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = text;
                } else if (element.tagName === 'OPTION') {
                    element.textContent = text;
                } else if (element.tagName === 'OPTGROUP') {
                    element.label = text;
                } else {
                    // HTML含む場合の処理
                    if (text.includes('<br>') || text.includes('<')) {
                        element.innerHTML = text;
                    } else {
                        element.textContent = text;
                    }
                }
                translated++;
            }
        });
        
        console.log('ImageConverter TranslationSystem: Translated', translated, 'elements');
        
        // Update page title and meta
        const pageTitle = translations['pageTitle'];
        if (pageTitle) {
            document.title = pageTitle;
        }
        
        const metaDesc = document.querySelector('meta[name="description"]');
        const metaDescription = translations['metaDescription'];
        if (metaDesc && metaDescription) {
            metaDesc.content = metaDescription;
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.imageConverterTranslations) {
                window.ImageConverterTranslationSystem.init();
            }
        }, 100);
    });
} else {
    setTimeout(() => {
        if (window.imageConverterTranslations) {
            window.ImageConverterTranslationSystem.init();
        }
    }, 100);
}
