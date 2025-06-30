/**
 * Image Converter Presets
 * @description プリセット設定とデータ管理
 * @version 1.0.0
 * @author negi-lab.com
 */

// プリセット設定データ
const ImagePresets = {
    'web-standard': {
        format: 'image/jpeg',
        quality: 0.8,
        maxWidth: null,
        maxHeight: null,
        rotation: 0,
        filter: 'none',
        description: 'Web標準品質（JPEG 80%）'
    },
    'web-optimized': {
        format: 'image/webp', 
        quality: 0.75,
        maxWidth: null,
        maxHeight: null,
        rotation: 0,
        filter: 'none',
        description: 'Web最適化（WebP 75%）'
    },
    'social-media': {
        format: 'image/jpeg',
        quality: 0.7,
        maxWidth: 1080,
        maxHeight: 1080,
        rotation: 0,
        filter: 'none',
        description: 'SNS投稿用（JPEG 70%, 1080px）'
    },
    'print-quality': {
        format: 'image/jpeg',
        quality: 0.95,
        maxWidth: null,
        maxHeight: null,
        rotation: 0,
        filter: 'none',
        description: '印刷品質（JPEG 95%）'
    },
    'thumbnail': {
        format: 'image/jpeg',
        quality: 0.7,
        maxWidth: 300,
        maxHeight: 300,
        rotation: 0,
        filter: 'none',
        description: 'サムネイル用（JPEG 70%, 300px）'
    },
    'game-texture': {
        format: 'image/ktx2',
        quality: 0.8,
        maxWidth: null,
        maxHeight: null,
        rotation: 0,
        filter: 'none',
        description: 'ゲームテクスチャ（KTX2 80%）'
    },
    'mobile-game': {
        format: 'image/ktx',
        quality: 0.75,
        maxWidth: 512,
        maxHeight: 512,
        rotation: 0,
        filter: 'none',
        description: 'モバイルゲーム（KTX 512px）'
    },
    '3d-model': {
        format: 'image/tga',
        quality: 0.9,
        maxWidth: null,
        maxHeight: null,
        rotation: 0,
        filter: 'none',
        description: '3Dモデル用（TGA）'
    },
    'hdr-imaging': {
        format: 'image/hdr',
        quality: 0.9,
        maxWidth: null,
        maxHeight: null,
        rotation: 0,
        filter: 'none',
        description: 'HDRイメージング'
    }
};

// フォーマット情報
const FormatInfo = {
    'image/jpeg': { 
        extension: 'jpg', 
        name: 'JPEG',
        description: '高圧縮・写真向け',
        supportsQuality: true,
        supportsTransparency: false
    },
    'image/png': { 
        extension: 'png', 
        name: 'PNG',
        description: '可逆圧縮・透明度対応',
        supportsQuality: false,
        supportsTransparency: true
    },
    'image/webp': { 
        extension: 'webp', 
        name: 'WebP',
        description: '次世代フォーマット・高効率',
        supportsQuality: true,
        supportsTransparency: true
    },
    'image/gif': { 
        extension: 'gif', 
        name: 'GIF',
        description: 'アニメーション・256色',
        supportsQuality: false,
        supportsTransparency: true
    },
    'image/bmp': { 
        extension: 'bmp', 
        name: 'BMP',
        description: '無圧縮・高品質',
        supportsQuality: false,
        supportsTransparency: false
    },
    'image/tiff': { 
        extension: 'tiff', 
        name: 'TIFF',
        description: '印刷・業務用',
        supportsQuality: false,
        supportsTransparency: true
    },
    'image/svg+xml': { 
        extension: 'svg', 
        name: 'SVG',
        description: 'ベクター・スケーラブル',
        supportsQuality: false,
        supportsTransparency: true
    },
    'image/ktx': { 
        extension: 'ktx', 
        name: 'KTX',
        description: 'OpenGL・ゲーム用',
        supportsQuality: true,
        supportsTransparency: true
    },
    'image/ktx2': { 
        extension: 'ktx2', 
        name: 'KTX2',
        description: 'OpenGL・次世代',
        supportsQuality: true,
        supportsTransparency: true
    },
    'image/dds': { 
        extension: 'dds', 
        name: 'DDS',
        description: 'DirectX・ゲーム用',
        supportsQuality: true,
        supportsTransparency: true
    },
    'image/tga': { 
        extension: 'tga', 
        name: 'TGA',
        description: '3D・ゲーム用',
        supportsQuality: false,
        supportsTransparency: true
    },
    'image/hdr': { 
        extension: 'hdr', 
        name: 'HDR',
        description: '高ダイナミックレンジ',
        supportsQuality: true,
        supportsTransparency: false
    },
    'image/exr': { 
        extension: 'exr', 
        name: 'EXR',
        description: '映像・VFX用',
        supportsQuality: true,
        supportsTransparency: true
    }
};

// フィルター設定
const FilterPresets = {
    'none': {
        name: 'なし',
        filter: '',
        description: 'フィルターなし'
    },
    'grayscale': {
        name: 'グレースケール',
        filter: 'grayscale(100%)',
        description: 'モノクロ変換'
    },
    'sepia': {
        name: 'セピア',
        filter: 'sepia(100%)',
        description: 'セピア調'
    },
    'blur': {
        name: 'ぼかし',
        filter: 'blur(2px)',
        description: 'ぼかし効果'
    },
    'brightness': {
        name: '明度調整',
        filter: 'brightness(1.2)',
        description: '明度20%アップ'
    },
    'contrast': {
        name: 'コントラスト',
        filter: 'contrast(1.2)',
        description: 'コントラスト強化'
    },
    'saturate': {
        name: '彩度強化',
        filter: 'saturate(1.5)',
        description: '彩度50%アップ'
    }
};

// プリセット管理クラス
window.ImageConverterPresets = {
    presets: ImagePresets,
    formats: FormatInfo,
    filters: FilterPresets,

    // プリセット取得
    getPreset: function(presetId) {
        return this.presets[presetId] || null;
    },

    // フォーマット情報取得
    getFormatInfo: function(format) {
        return this.formats[format] || null;
    },

    // フィルター取得
    getFilter: function(filterId) {
        return this.filters[filterId] || null;
    },

    // カスタムプリセット保存
    saveCustomPreset: function(name, settings) {
        const customKey = 'custom_' + name.replace(/\s+/g, '_').toLowerCase();
        this.presets[customKey] = {
            ...settings,
            description: 'カスタム: ' + name
        };
        
        // localStorage に保存
        try {
            const customPresets = JSON.parse(localStorage.getItem('imageConverterCustomPresets') || '{}');
            customPresets[customKey] = this.presets[customKey];
            localStorage.setItem('imageConverterCustomPresets', JSON.stringify(customPresets));
        } catch (e) {
            console.warn('カスタムプリセットの保存に失敗しました:', e);
        }
    },

    // カスタムプリセット読み込み
    loadCustomPresets: function() {
        try {
            const customPresets = JSON.parse(localStorage.getItem('imageConverterCustomPresets') || '{}');
            Object.assign(this.presets, customPresets);
        } catch (e) {
            console.warn('カスタムプリセットの読み込みに失敗しました:', e);
        }
    },

    // プリセット一覧取得
    getAllPresets: function() {
        return Object.keys(this.presets).map(key => ({
            id: key,
            ...this.presets[key]
        }));
    },

    // 推奨プリセット取得（用途別）
    getRecommendedPresets: function(purpose) {
        const recommendations = {
            'web': ['web-standard', 'web-optimized', 'social-media'],
            'game': ['game-texture', 'mobile-game', '3d-model'],
            'print': ['print-quality', 'hdr-imaging'],
            'mobile': ['thumbnail', 'social-media', 'mobile-game']
        };
        
        return recommendations[purpose] || [];
    }
};
