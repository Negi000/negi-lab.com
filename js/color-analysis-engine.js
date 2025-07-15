/**
 * Color Analysis Engine - 高度な色彩分析エンジン
 * @version 2.0.0
 * @description 色彩理論に基づく包括的な色分析・変換・生成機能を提供
 */

class ColorAnalysisEngine {
  constructor() {
    this.colorHistory = [];
    this.paletteCache = new Map();
    this.harmonies = ['monochromatic', 'analogous', 'complementary', 'triadic', 'tetradic', 'splitComplementary'];
    this.initColorNames();
  }

  /**
   * 色名データベースの初期化
   */
  initColorNames() {
    this.colorNames = {
      // 基本色
      '#FF0000': 'Red', '#00FF00': 'Lime', '#0000FF': 'Blue',
      '#FFFFFF': 'White', '#000000': 'Black', '#808080': 'Gray',
      '#FFFF00': 'Yellow', '#FF00FF': 'Magenta', '#00FFFF': 'Cyan',
      '#800000': 'Maroon', '#008000': 'Green', '#000080': 'Navy',
      '#FFA500': 'Orange', '#800080': 'Purple', '#FFC0CB': 'Pink',
      '#A52A2A': 'Brown', '#808000': 'Olive', '#4B0082': 'Indigo',
      '#F0E68C': 'Khaki', '#E6E6FA': 'Lavender', '#FFE4E1': 'MistyRose',
      
      // サイト固有色
      '#65c155': 'Negi Green', '#4ADE80': 'Accent Green',
      
      // 拡張色名（日本の伝統色）
      '#DC143C': 'Crimson', '#B22222': 'FireBrick', '#CD5C5C': 'IndianRed',
      '#F08080': 'LightCoral', '#FA8072': 'Salmon', '#E9967A': 'DarkSalmon',
      '#FFA07A': 'LightSalmon', '#FF6347': 'Tomato', '#FF4500': 'OrangeRed',
      '#FF8C00': 'DarkOrange', '#FFD700': 'Gold', '#FFFF00': 'Yellow',
      '#FFFFE0': 'LightYellow', '#FFFACD': 'LemonChiffon', '#FFEFD5': 'PapayaWhip',
      '#FFE4B5': 'Moccasin', '#FFDEAD': 'NavajoWhite', '#F5DEB3': 'Wheat',
      '#DEB887': 'BurlyWood', '#D2B48C': 'Tan', '#BC8F8F': 'RosyBrown',
      '#F4A460': 'SandyBrown', '#DAA520': 'Goldenrod', '#B8860B': 'DarkGoldenrod',
      '#CD853F': 'Peru', '#D2691E': 'Chocolate', '#8B4513': 'SaddleBrown',
      '#A0522D': 'Sienna', '#A52A2A': 'Brown', '#800000': 'Maroon'
    };
  }

  /**
   * HEX色をRGBに変換
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * RGBをHEXに変換
   */
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /**
   * RGBをHSLに変換
   */
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * HSLをRGBに変換
   */
  hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * RGBをCMYKに変換
   */
  rgbToCmyk(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }

  /**
   * 色の明度を計算
   */
  getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * コントラスト比を計算
   */
  getContrastRatio(color1, color2) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * WCAG基準判定
   */
  getWcagRating(ratio) {
    if (ratio >= 7) return { level: 'AAA', description: '最高レベル' };
    if (ratio >= 4.5) return { level: 'AA', description: '標準レベル' };
    if (ratio >= 3) return { level: 'AA Large', description: '大きな文字' };
    return { level: 'Fail', description: '基準未満' };
  }

  /**
   * カラーハーモニー生成
   */
  generateColorHarmony(baseColor, harmonyType) {
    const rgb = this.hexToRgb(baseColor);
    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [baseColor];

    switch (harmonyType) {
      case 'analogous':
        colors.push(
          this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
          this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l)
        );
        break;
      
      case 'complementary':
        colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        break;
      
      case 'triadic':
        colors.push(
          this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)
        );
        break;
      
      case 'tetradic':
        colors.push(
          this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
          this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)
        );
        break;
      
      case 'splitComplementary':
        colors.push(
          this.hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
          this.hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)
        );
        break;
      
      case 'monochromatic':
        colors.push(
          this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 100)),
          this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 0)),
          this.hslToHex(hsl.h, Math.min(hsl.s + 20, 100), hsl.l),
          this.hslToHex(hsl.h, Math.max(hsl.s - 20, 0), hsl.l)
        );
        break;
    }

    return colors.map(color => this.normalizeHex(color));
  }

  /**
   * HSLからHEXに変換
   */
  hslToHex(h, s, l) {
    const rgb = this.hslToRgb(h, s, l);
    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  /**
   * HEX値の正規化
   */
  normalizeHex(hex) {
    return hex.toUpperCase();
  }

  /**
   * 画像から色を抽出
   */
  extractColorsFromImage(canvas, x, y) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;
    
    return {
      hex: this.rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: this.rgbToHsl(r, g, b),
      cmyk: this.rgbToCmyk(r, g, b)
    };
  }

  /**
   * 画像の主要色パレット生成
   */
  generatePaletteFromImage(canvas, sampleSize = 5) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    const colorCounts = new Map();
    const step = Math.max(1, Math.floor(data.length / (sampleSize * sampleSize * 4)));
    
    for (let i = 0; i < data.length; i += step * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      if (alpha > 128) { // 透明度チェック
        const hex = this.rgbToHex(r, g, b);
        colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
      }
    }
    
    return Array.from(colorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([color]) => color);
  }

  /**
   * 色の類似度計算
   */
  getColorSimilarity(color1, color2) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    const deltaR = rgb1.r - rgb2.r;
    const deltaG = rgb1.g - rgb2.g;
    const deltaB = rgb1.b - rgb2.b;
    
    return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
  }

  /**
   * 最も近い色名を取得
   */
  getClosestColorName(hex) {
    const colorNames = {
      '#FF0000': '赤',
      '#00FF00': '緑',
      '#0000FF': '青',
      '#FFFF00': '黄',
      '#FF00FF': 'マゼンタ',
      '#00FFFF': 'シアン',
      '#000000': '黒',
      '#FFFFFF': '白',
      '#808080': 'グレー'
    };
    
    return colorNames[hex.toUpperCase()] || 'カスタム色';
  }

  /**
   * 色温度の取得
   */
  getColorTemperature(hex) {
    const rgb = this.hexToRgb(hex);
    const temp = (rgb.r + rgb.g + rgb.b) / 3;
    
    if (temp > 170) {
      return { temperature: 'warm', description: '暖色' };
    } else if (temp < 85) {
      return { temperature: 'cool', description: '寒色' };
    } else {
      return { temperature: 'neutral', description: '中性色' };
    }
  }

  /**
   * 色の心理効果
   */
  getColorPsychology(hex) {
    const hsl = this.rgbToHsl(...Object.values(this.hexToRgb(hex)));
    
    const effects = [];
    if (hsl.h < 60) effects.push('エネルギッシュ');
    else if (hsl.h < 120) effects.push('自然');
    else if (hsl.h < 180) effects.push('爽やか');
    else if (hsl.h < 240) effects.push('冷静');
    else if (hsl.h < 300) effects.push('神秘的');
    else effects.push('情熱的');
    
    return { effects };
  }

  /**
   * 履歴に追加
   */
  addToHistory(colorData) {
    if (!this.history) this.history = [];
    this.history.unshift(colorData);
    if (this.history.length > 50) this.history.pop();
  }

  /**
   * 色履歴の取得
   */
  getHistory() {
    return this.colorHistory;
  }

  /**
   * グラデーション生成
   */
  generateGradient(startColor, endColor, steps = 5) {
    const startRgb = this.hexToRgb(startColor);
    const endRgb = this.hexToRgb(endColor);
    const gradient = [];
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(startRgb.r + ratio * (endRgb.r - startRgb.r));
      const g = Math.round(startRgb.g + ratio * (endRgb.g - startRgb.g));
      const b = Math.round(startRgb.b + ratio * (endRgb.b - startRgb.b));
      gradient.push(this.rgbToHex(r, g, b));
    }
    
    return gradient;
  }

  /**
   * アクセシブルな色ペア生成
   */
  generateAccessiblePairs(baseColor) {
    const pairs = [];
    const baseRgb = this.hexToRgb(baseColor);
    const baseLum = this.getLuminance(baseRgb.r, baseRgb.g, baseRgb.b);
    
    // 白と黒でのコントラスト比をチェック
    const whiteRatio = this.getContrastRatio(baseColor, '#FFFFFF');
    const blackRatio = this.getContrastRatio(baseColor, '#000000');
    
    if (whiteRatio >= 4.5) {
      pairs.push({ text: '#FFFFFF', bg: baseColor, ratio: whiteRatio });
    }
    if (blackRatio >= 4.5) {
      pairs.push({ text: '#000000', bg: baseColor, ratio: blackRatio });
    }
    
    // 明度を調整してアクセシブルなペアを探す
    const hsl = this.rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    
    for (let l = 10; l <= 90; l += 10) {
      if (Math.abs(l - hsl.l) < 20) continue; // 元の色に近いものは除外
      
      const testColor = this.hslToHex(hsl.h, hsl.s, l);
      const ratio = this.getContrastRatio(baseColor, testColor);
      
      if (ratio >= 4.5) {
        pairs.push({
          text: testColor,
          bg: baseColor,
          ratio: ratio
        });
      }
    }
    
    return pairs.sort((a, b) => b.ratio - a.ratio).slice(0, 5);
  }
}

// エクスポート（モジュール対応）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorAnalysisEngine;
} else if (typeof window !== 'undefined') {
  window.ColorAnalysisEngine = ColorAnalysisEngine;
}
