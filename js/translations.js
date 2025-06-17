/**
 * 多言語対応翻訳データ
 * 日本語・英語完全互換
 */

window.translations = {
  ja: {
    // 共通
    'option.ja': '日本語',
    'option.en': 'English',
    'header.nav.tools': 'ツール',
    'header.nav.wikis': 'ゲームWiki',
    'header.guide': 'ガイド',    // 単位変換ツール
    'unitConverter.pageTitle': '【全単位網羅】単位変換ツール - 長さ・重さ・温度・体積・圧力・エネルギー・電子レンジ・cc・ml・専門単位も対応 | negi-lab.com',
    'unitConverter.metaDescription': '長さ・重さ・温度・体積・圧力・エネルギー・電子レンジ・cc・ml・専門単位まで全て網羅！日常・理系・工学・医療・料理・海外生活にも役立つ最強の単位変換ツール。スマホ対応・無料・広告最小限。',
    'unitConverter.mainTitle': '単位変換ツール',
    'unitConverter.categoryTitle': 'カテゴリを選択',
    'unitConverter.swapButton': '単位を入れ替え',
    
    // カテゴリ    
    'unitConverter.category.length': '長さ',
    'unitConverter.category.weight': '重さ',
    'unitConverter.category.temperature': '温度',
    'unitConverter.category.area': '面積',
    'unitConverter.category.volume': '体積',
    'unitConverter.category.speed': '速度',
    'unitConverter.category.pressure': '圧力',
    'unitConverter.category.energy': 'エネルギー',
    'unitConverter.category.power': '電力',
    'unitConverter.category.time': '時間',
    'unitConverter.category.microwave': '電子レンジ',
    'unitConverter.category.frequency': '周波数',
    'unitConverter.category.angle': '角度',
    'unitConverter.category.data': 'データ量',
    'unitConverter.category.fuel_consumption': '燃費',

    // 入力・出力エリア    
    'unitConverter.inputTitle': '入力',
    'unitConverter.outputTitle': '結果',
    'unitConverter.inputValueLabel': '数値を入力',
    'unitConverter.inputPlaceholder': '例: 100',
    'unitConverter.fromUnitLabel': '変換元の単位','unitConverter.toUnitLabel': '変換先の単位',
    'unitConverter.resultLabel': '変換結果',
    'unitConverter.resultPlaceholder': '結果がここに表示されます',
    'unitConverter.copyButton': 'コピー',
    'unitConverter.copySuccess': 'コピーしました',
    'unitConverter.copyFailed': 'コピーに失敗しました',

    // 電子レンジ特殊UI
    'unitConverter.microwave.inputFormat': '入力形式',
    'unitConverter.microwave.seconds': '秒',
    'unitConverter.microwave.minutes': '分',
    'unitConverter.microwave.minutesLabel': '分',
    'unitConverter.microwave.secondsLabel': '秒',
    'unitConverter.microwave.currentPower': '現在のワット数',
    'unitConverter.microwave.targetPower': '変換先のワット数',

    // エラーメッセージ
    'unitConverter.error.invalidInput': '有効な数値を入力してください',
    'unitConverter.error.selectCategory': 'カテゴリを選択してください',
    'unitConverter.error.selectUnits': '変換元と変換先の単位を選択してください',
    'unitConverter.error.conversionFailed': '変換に失敗しました',

    // ガイド・ヘルプ
    'unitConverter.guide.title': '単位変換ツールの使い方',
    'unitConverter.guide.step1': '1. カテゴリを選択',
    'unitConverter.guide.step2': '2. 数値を入力',
    'unitConverter.guide.step3': '3. 変換元・変換先の単位を選択',
    'unitConverter.guide.step4': '4. 結果が自動表示されます',

    // 単位名（日本語）
    'unit.meter': 'メートル',
    'unit.kilometer': 'キロメートル',
    'unit.centimeter': 'センチメートル',
    'unit.millimeter': 'ミリメートル',
    'unit.inch': 'インチ',
    'unit.foot': 'フィート',
    'unit.yard': 'ヤード',
    'unit.mile': 'マイル',
    'unit.nauticalMile': '海里',

    'unit.kilogram': 'キログラム',
    'unit.gram': 'グラム',
    'unit.milligram': 'ミリグラム',
    'unit.ton': 'トン',
    'unit.pound': 'ポンド',
    'unit.ounce': 'オンス',
    'unit.stone': 'ストーン',

    'unit.celsius': '摂氏',
    'unit.fahrenheit': '華氏',
    'unit.kelvin': 'ケルビン',
    'unit.rankine': 'ランキン',

    'unit.squareMeter': '平方メートル',
    'unit.squareKilometer': '平方キロメートル',
    'unit.squareCentimeter': '平方センチメートル',
    'unit.squareMillimeter': '平方ミリメートル',
    'unit.squareInch': '平方インチ',
    'unit.squareFoot': '平方フィート',
    'unit.squareYard': '平方ヤード',
    'unit.acre': 'エーカー',
    'unit.hectare': 'ヘクタール',

    'unit.liter': 'リットル',
    'unit.milliliter': 'ミリリットル',
    'unit.cubicMeter': '立方メートル',
    'unit.cubicCentimeter': '立方センチメートル',
    'unit.gallon': 'ガロン',
    'unit.quart': 'クォート',
    'unit.pint': 'パイント',
    'unit.cup': 'カップ',
    'unit.fluidOunce': '液量オンス',
    'unit.tablespoon': '大さじ',
    'unit.teaspoon': '小さじ',

    'unit.meterPerSecond': 'メートル毎秒',
    'unit.kilometerPerHour': 'キロメートル毎時',
    'unit.milePerHour': 'マイル毎時',
    'unit.knot': 'ノット',
    'unit.footPerSecond': 'フィート毎秒',

    'unit.pascal': 'パスカル',
    'unit.kilopascal': 'キロパスカル',
    'unit.bar': 'バール',
    'unit.atmosphere': '気圧',
    'unit.psi': 'ポンド毎平方インチ',
    'unit.torr': 'トール',
    'unit.mmHg': 'ミリメートル水銀柱',

    'unit.joule': 'ジュール',
    'unit.kilojoule': 'キロジュール',
    'unit.calorie': 'カロリー',
    'unit.kilocalorie': 'キロカロリー',
    'unit.wattHour': 'ワット時',
    'unit.kilowattHour': 'キロワット時',
    'unit.btu': 'BTU',

    'unit.watt': 'ワット',
    'unit.kilowatt': 'キロワット',
    'unit.megawatt': 'メガワット',
    'unit.horsepower': '馬力',
    'unit.horsepowerMetric': 'PS',

    'unit.second': '秒',
    'unit.minute': '分',
    'unit.hour': '時間',
    'unit.day': '日',
    'unit.week': '週',
    'unit.month': '月',
    'unit.year': '年'
  },

  en: {
    // 共通
    'option.ja': '日本語',
    'option.en': 'English',
    'header.nav.tools': 'Tools',
    'header.nav.wikis': 'Game Wiki',
    'header.guide': 'Guide',    // 単位変換ツール
    'unitConverter.pageTitle': 'Universal Unit Converter - Length, Weight, Temperature, Volume, Pressure, Energy, Time & More | negi-lab.com',
    'unitConverter.metaDescription': 'Comprehensive unit converter for length, weight, temperature, volume, pressure, energy, time, and specialized units. Perfect for daily use, engineering, science, cooking, and international living.',
    'unitConverter.mainTitle': 'Unit Converter',
    'unitConverter.categoryTitle': 'Select Category',
    'unitConverter.swapButton': 'Swap Units',
    
    // カテゴリ    'unitConverter.category.length': 'Length',
    'unitConverter.category.weight': 'Weight',
    'unitConverter.category.temperature': 'Temperature',
    'unitConverter.category.area': 'Area',
    'unitConverter.category.volume': 'Volume',
    'unitConverter.category.speed': 'Speed',
    'unitConverter.category.pressure': 'Pressure',
    'unitConverter.category.energy': 'Energy',
    'unitConverter.category.power': 'Power',
    'unitConverter.category.time': 'Time',
    'unitConverter.category.microwave': 'Microwave',
    'unitConverter.category.frequency': 'Frequency',
    'unitConverter.category.angle': 'Angle',
    'unitConverter.category.data': 'Data Size',
    'unitConverter.category.fuel_consumption': 'Fuel Efficiency',

    // 入力・出力エリア    
    'unitConverter.inputTitle': 'Input',
    'unitConverter.outputTitle': 'Result',
    'unitConverter.inputValueLabel': 'Enter Value',
    'unitConverter.inputPlaceholder': 'e.g. 100',
    'unitConverter.fromUnitLabel': 'From Unit','unitConverter.toUnitLabel': 'To Unit',
    'unitConverter.resultLabel': 'Conversion Result',
    'unitConverter.resultPlaceholder': 'Result will be displayed here',
    'unitConverter.copyButton': 'Copy',
    'unitConverter.copySuccess': 'Copied to clipboard',
    'unitConverter.copyFailed': 'Failed to copy',

    // 電子レンジ特殊UI
    'unitConverter.microwave.inputFormat': 'Input Format',
    'unitConverter.microwave.seconds': 'Seconds',
    'unitConverter.microwave.minutes': 'Minutes',
    'unitConverter.microwave.minutesLabel': 'min',
    'unitConverter.microwave.secondsLabel': 'sec',
    'unitConverter.microwave.currentPower': 'Current Wattage',
    'unitConverter.microwave.targetPower': 'Target Wattage',

    // エラーメッセージ
    'unitConverter.error.invalidInput': 'Please enter a valid number',
    'unitConverter.error.selectCategory': 'Please select a category',
    'unitConverter.error.selectUnits': 'Please select from and to units',
    'unitConverter.error.conversionFailed': 'Conversion failed',

    // ガイド・ヘルプ
    'unitConverter.guide.title': 'How to Use Unit Converter',
    'unitConverter.guide.step1': '1. Select a category',
    'unitConverter.guide.step2': '2. Enter a value',
    'unitConverter.guide.step3': '3. Choose from and to units',
    'unitConverter.guide.step4': '4. Result will be displayed automatically',

    // 単位名（英語）
    'unit.meter': 'Meter',
    'unit.kilometer': 'Kilometer',
    'unit.centimeter': 'Centimeter',
    'unit.millimeter': 'Millimeter',
    'unit.inch': 'Inch',
    'unit.foot': 'Foot',
    'unit.yard': 'Yard',
    'unit.mile': 'Mile',
    'unit.nauticalMile': 'Nautical Mile',

    'unit.kilogram': 'Kilogram',
    'unit.gram': 'Gram',
    'unit.milligram': 'Milligram',
    'unit.ton': 'Ton',
    'unit.pound': 'Pound',
    'unit.ounce': 'Ounce',
    'unit.stone': 'Stone',

    'unit.celsius': 'Celsius',
    'unit.fahrenheit': 'Fahrenheit',
    'unit.kelvin': 'Kelvin',
    'unit.rankine': 'Rankine',

    'unit.squareMeter': 'Square Meter',
    'unit.squareKilometer': 'Square Kilometer',
    'unit.squareCentimeter': 'Square Centimeter',
    'unit.squareMillimeter': 'Square Millimeter',
    'unit.squareInch': 'Square Inch',
    'unit.squareFoot': 'Square Foot',
    'unit.squareYard': 'Square Yard',
    'unit.acre': 'Acre',
    'unit.hectare': 'Hectare',

    'unit.liter': 'Liter',
    'unit.milliliter': 'Milliliter',
    'unit.cubicMeter': 'Cubic Meter',
    'unit.cubicCentimeter': 'Cubic Centimeter',
    'unit.gallon': 'Gallon',
    'unit.quart': 'Quart',
    'unit.pint': 'Pint',
    'unit.cup': 'Cup',
    'unit.fluidOunce': 'Fluid Ounce',
    'unit.tablespoon': 'Tablespoon',
    'unit.teaspoon': 'Teaspoon',

    'unit.meterPerSecond': 'Meter per Second',
    'unit.kilometerPerHour': 'Kilometer per Hour',
    'unit.milePerHour': 'Mile per Hour',
    'unit.knot': 'Knot',
    'unit.footPerSecond': 'Foot per Second',

    'unit.pascal': 'Pascal',
    'unit.kilopascal': 'Kilopascal',
    'unit.bar': 'Bar',
    'unit.atmosphere': 'Atmosphere',
    'unit.psi': 'PSI',
    'unit.torr': 'Torr',
    'unit.mmHg': 'mmHg',

    'unit.joule': 'Joule',
    'unit.kilojoule': 'Kilojoule',
    'unit.calorie': 'Calorie',
    'unit.kilocalorie': 'Kilocalorie',
    'unit.wattHour': 'Watt Hour',
    'unit.kilowattHour': 'Kilowatt Hour',
    'unit.btu': 'BTU',

    'unit.watt': 'Watt',
    'unit.kilowatt': 'Kilowatt',
    'unit.megawatt': 'Megawatt',
    'unit.horsepower': 'Horsepower',
    'unit.horsepowerMetric': 'PS',

    'unit.second': 'Second',
    'unit.minute': 'Minute',
    'unit.hour': 'Hour',
    'unit.day': 'Day',
    'unit.week': 'Week',
    'unit.month': 'Month',
    'unit.year': 'Year'
  }
};

// 現在の言語を取得・設定する関数
window.currentLanguage = 'ja';

window.getLanguage = function() {
  return window.currentLanguage || document.documentElement.lang || localStorage.getItem('selectedLanguage') || 'ja';
};

window.setLanguage = function(lang) {
  window.currentLanguage = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('selectedLanguage', lang);
};

// 翻訳関数
window.t = function(key, fallback) {
  const lang = window.getLanguage();
  if (window.translations && window.translations[lang] && window.translations[lang][key]) {
    return window.translations[lang][key];
  }
  return fallback || key;
};

// 翻訳を適用する関数
window.applyTranslations = function(lang) {
  if (!lang) lang = window.getLanguage();
  
  window.setLanguage(lang);
    // data-translate-key属性を持つすべての要素を翻訳
  document.querySelectorAll('[data-translate-key]').forEach(function(element) {
    const key = element.getAttribute('data-translate-key');
    const translation = window.t(key);
    
    // title, metaタグ特殊処理
    if (element.tagName === 'TITLE') {
      element.textContent = translation;
    } else if (element.tagName === 'META') {
      element.setAttribute('content', translation);
    } else if (element.tagName === 'INPUT' && element.type === 'text' || element.type === 'number') {
      // input要素のplaceholder属性を更新
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
  
  // 言語選択ボックスの更新
  const langSelect = document.getElementById('lang-switch');
  if (langSelect) {
    langSelect.value = lang;
  }
  
  // 単位変換ツール特有の翻訳処理
  if (typeof updateUnitLabels === 'function') {
    updateUnitLabels();
  }
};

// 初期化
document.addEventListener('DOMContentLoaded', function() {
  const savedLang = localStorage.getItem('selectedLanguage') || 'ja';
  window.applyTranslations(savedLang);
  
  // 言語切り替えイベントリスナー
  const langSelect = document.getElementById('lang-switch');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      window.applyTranslations(this.value);
    });
  }
});
