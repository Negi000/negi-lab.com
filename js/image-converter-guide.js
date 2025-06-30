/**
 * Image Converter Guide Modal
 * @description ガイドモーダルの表示制御・多言語対応
 * @version 1.0.0
 * @author negi-lab.com
 */

document.addEventListener('DOMContentLoaded', function() {
    const guideBtn = document.getElementById('guide-btn');
    const guideModal = document.getElementById('guide-modal');
    const guideClose = document.getElementById('guide-close');
    const guideContent = document.getElementById('guide-modal-content');

    // 多言語ガイドデータ
    const guides = {
        ja: {
            title: '高機能画像変換ツールの使い方',
            list: [
                '🖼️ <strong>多様なフォーマット対応：</strong>JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, KTX, KTX2, DDS, TGA, HDR, EXR',
                '⚙️ <strong>プリセット選択：</strong>Web標準・SNS投稿用・印刷品質・ゲームテクスチャ用など',
                '🔄 <strong>回転・リサイズ：</strong>90°単位での回転、アスペクト比固定リサイズ',
                '🎨 <strong>フィルター効果：</strong>グレースケール・セピア・明度調整を適用',
                '🎮 <strong>ゲーム開発対応：</strong>KTX/KTX2テクスチャ、DDS、TGAフォーマット',
                '📱 <strong>一括変換：</strong>最大50MBファイル、複数同時処理'
            ],
            featuresTitle: '新機能・対応フォーマット',
            features: [
                'KTX/KTX2: Khronos公式テクスチャフォーマット（ゲーム/VR/AR用）',
                'DDS: DirectDraw Surface（DirectX/ゲーム開発用）',
                'TGA: Targa（3Dモデリング・ゲーム開発用）',
                'HDR/EXR: 高ダイナミックレンジ画像（映像制作用）',
                'TIFF/BMP: 高品質・無圧縮フォーマット',
                'ゲーム・VR・3D制作向け専用プリセット'
            ],
            tipsTitle: '活用例・ヒント',
            tips: [
                '🎮 <strong>ゲームテクスチャ：</strong>「ゲームテクスチャ」プリセットでKTX2最適化',
                '📱 <strong>モバイルゲーム：</strong>「モバイルゲーム」プリセットで軽量KTX変換',
                '🎬 <strong>3D制作：</strong>「3Dモデル用」プリセットでTGA無圧縮出力',
                '🎥 <strong>HDRイメージング：</strong>「HDRイメージング」プリセットで高ダイナミックレンジ',
                '🎞️ <strong>VFX・映像制作：</strong>「VFX・映像制作」プリセットでEXR高品質',
                '⚡ <strong>Web最適化：</strong>「Web最適化」プリセットでWebP軽量化',
                '🖨️ <strong>印刷・DTP：</strong>TIFF形式で最高品質保持'
            ]
        },
        en: {
            title: 'How to Use the Advanced Image Converter',
            list: [
                '🖼️ <strong>Wide Format Support:</strong> JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, KTX, KTX2, DDS, TGA, HDR, EXR',
                '⚙️ <strong>Preset Settings:</strong> Web Standard, Social Media, Print Quality, Game Texture presets',
                '🔄 <strong>Rotate & Resize:</strong> 90° rotation steps, aspect ratio preservation',
                '🎨 <strong>Filter Effects:</strong> Apply grayscale, sepia, brightness adjustments',
                '🎮 <strong>Game Development:</strong> KTX/KTX2 textures, DDS, TGA format support',
                '📱 <strong>Batch Convert:</strong> Up to 50MB files, multiple simultaneous processing'
            ],
            featuresTitle: 'New Features & Supported Formats',
            features: [
                'KTX/KTX2: Khronos official texture format (for games/VR/AR)',
                'DDS: DirectDraw Surface (for DirectX/game development)',
                'TGA: Targa (for 3D modeling and game development)',
                'HDR/EXR: High Dynamic Range images (for video production)',
                'TIFF/BMP: High quality, uncompressed formats',
                'Specialized presets for game, VR, and 3D production'
            ],
            tipsTitle: 'Tips & Examples',
            tips: [
                '🎮 <strong>Game Textures:</strong> Use "Game Texture" preset for KTX2 optimization',
                '📱 <strong>Mobile Games:</strong> Use "Mobile Game" preset for lightweight KTX',
                '🎬 <strong>3D Production:</strong> Use "3D Model" preset for uncompressed TGA',
                '🎥 <strong>HDR Imaging:</strong> Use "HDR Imaging" preset for high dynamic range',
                '🎞️ <strong>VFX Production:</strong> Use "VFX Production" preset for EXR quality',
                '⚡ <strong>Web Optimization:</strong> Use "Web Optimized" preset for WebP compression',
                '🖨️ <strong>Print/DTP:</strong> Use TIFF format for maximum quality preservation'
            ]
        }
    };

    function renderGuide(lang) {
        const g = guides[lang] || guides.ja;
        let html = `<h2 class='text-xl font-bold mb-3 text-accent'>${g.title}</h2>`;
        html += '<ul class="list-none ml-0 mb-4 text-gray-700 space-y-2">' + g.list.map(x=>`<li class="flex items-start"><span class="mr-2">•</span><span>${x}</span></li>`).join('') + '</ul>';
        
        if (g.featuresTitle) {
            html += `<h3 class='font-bold text-base mt-6 mb-2 text-blue-600'>${g.featuresTitle}</h3>`;
            html += '<ul class="list-disc ml-5 mb-4 text-gray-700 text-sm space-y-1">' + g.features.map(x=>`<li>${x}</li>`).join('') + '</ul>';
        }
        
        html += `<h3 class='font-bold text-base mt-6 mb-2 text-green-600'>${g.tipsTitle}</h3>`;
        html += '<ul class="list-none ml-0 text-gray-700 text-sm space-y-2">' + g.tips.map(x=>`<li class="flex items-start"><span class="mr-2">•</span><span>${x}</span></li>`).join('') + '</ul>';
        
        guideContent.innerHTML = html;
    }

    if(guideBtn && guideModal && guideClose && guideContent) {
        guideBtn.addEventListener('click', function() {
            // 翻訳システムから現在の言語を取得
            const lang = window.ImageConverterTranslationSystem?.currentLang || 
                        localStorage.getItem('selectedLanguage') || 
                        document.documentElement.lang || 'ja';
            console.log('Guide modal opening with language:', lang);
            renderGuide(lang);
            guideModal.classList.remove('hidden');
        });

        guideClose.addEventListener('click', function() {
            guideModal.classList.add('hidden');
        });

        guideModal.addEventListener('click', function(e) {
            if(e.target === guideModal) guideModal.classList.add('hidden');
        });
        
        // 言語切り替え時にガイドモーダルも更新
        if (window.ImageConverterTranslationSystem) {
            const originalSwitch = window.ImageConverterTranslationSystem.switchLanguage;
            window.ImageConverterTranslationSystem.switchLanguage = function(lang) {
                originalSwitch.call(this, lang);
                // ガイドモーダルが開いている場合は更新
                if (!guideModal.classList.contains('hidden')) {
                    renderGuide(lang);
                }
            };
        }
    }
});
