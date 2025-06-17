// 単位変換共通ロジック（今後の拡張・保守性重視）
window.unitConverterCore = {
  convert: function(category, value, fromUnit, toUnit) {
    const data = window.unitConverterData[category];
    if (!data) return null;
    
    // 温度の特殊変換
    if (category === 'temperature' && typeof data.convert === 'function') {
      return data.convert(value, fromUnit, toUnit);
    }
    
    // 電子レンジの特殊変換
    if (category === 'microwave' && typeof data.convert === 'function') {
      return data.convert(value, fromUnit, toUnit);
    }
    
    // 一般的なfactor基準変換
    if (!data.definitions[fromUnit] || !data.definitions[toUnit]) return null;
    const fromDef = data.definitions[fromUnit];
    const toDef = data.definitions[toUnit];
    
    // 基本単位を介した変換
    const baseValue = value * fromDef.factor;
    return baseValue / toDef.factor;
  },
  
  // カテゴリ情報取得
  getCategories: function() {
    return Object.keys(window.unitConverterData);
  },
  
  // 単位情報取得
  getUnits: function(category) {
    const data = window.unitConverterData[category];
    return data ? Object.keys(data.definitions) : [];
  },
  
  // 単位シンボル取得
  getUnitSymbol: function(category, unit) {
    const data = window.unitConverterData[category];
    if (!data || !data.definitions[unit]) return '';
    return data.definitions[unit].symbol || '';
  },
  
  // 単位名取得（多言語対応）
  getUnitName: function(category, unit, lang = 'ja') {
    const data = window.unitConverterData[category];
    if (!data || !data.definitions[unit]) return '';
    const unitDef = data.definitions[unit];
    return unitDef[lang] || unitDef.ja || unitDef.en || unit;
  },
  
  // バリデーション
  isValidCategory: function(category) {
    return category in window.unitConverterData;
  },
  
  isValidUnit: function(category, unit) {
    const data = window.unitConverterData[category];
    return data && data.definitions && unit in data.definitions;
  }
};
