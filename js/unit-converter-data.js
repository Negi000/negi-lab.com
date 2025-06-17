// 単位定義データ（カテゴリごとに分割・拡張しやすい構造）
window.unitConverterData = {  length: {
    baseUnit: 'meters',
    definitions: {
      meters: { nameKey: 'unitConverter.length.meters', ja: 'メートル', en: 'Meters', factor: 1, symbol: 'm' },
      kilometers: { nameKey: 'unitConverter.length.kilometers', ja: 'キロメートル', en: 'Kilometers', factor: 1000, symbol: 'km' },
      centimeters: { nameKey: 'unitConverter.length.centimeters', ja: 'センチメートル', en: 'Centimeters', factor: 0.01, symbol: 'cm' },
      millimeters: { nameKey: 'unitConverter.length.millimeters', ja: 'ミリメートル', en: 'Millimeters', factor: 0.001, symbol: 'mm' },
      micrometers: { nameKey: 'unitConverter.length.micrometers', ja: 'マイクロメートル', en: 'Micrometers', factor: 1e-6, symbol: 'μm' },
      nanometers: { nameKey: 'unitConverter.length.nanometers', ja: 'ナノメートル', en: 'Nanometers', factor: 1e-9, symbol: 'nm' },
      picometers: { nameKey: 'unitConverter.length.picometers', ja: 'ピコメートル', en: 'Picometers', factor: 1e-12, symbol: 'pm' },
      decimeters: { nameKey: 'unitConverter.length.decimeters', ja: 'デシメートル', en: 'Decimeters', factor: 0.1, symbol: 'dm' },
      miles: { nameKey: 'unitConverter.length.miles', ja: 'マイル', en: 'Miles', factor: 1609.344, symbol: 'mi' },
      yards: { nameKey: 'unitConverter.length.yards', ja: 'ヤード', en: 'Yards', factor: 0.9144, symbol: 'yd' },
      feet: { nameKey: 'unitConverter.length.feet', ja: 'フィート', en: 'Feet', factor: 0.3048, symbol: 'ft' },
      inches: { nameKey: 'unitConverter.length.inches', ja: 'インチ', en: 'Inches', factor: 0.0254, symbol: 'in' },
      nautical_miles: { nameKey: 'unitConverter.length.nautical_miles', ja: '海里', en: 'Nautical Miles', factor: 1852, symbol: 'nmi' },
      light_years: { nameKey: 'unitConverter.length.light_years', ja: '光年', en: 'Light Years', factor: 9.4607e15, symbol: 'ly' },
      astronomical_units: { nameKey: 'unitConverter.length.astronomical_units', ja: '天文単位', en: 'Astronomical Units', factor: 1.495978707e11, symbol: 'AU' },
      parsecs: { nameKey: 'unitConverter.length.parsecs', ja: 'パーセク', en: 'Parsecs', factor: 3.085677581e16, symbol: 'pc' },
      angstroms: { nameKey: 'unitConverter.length.angstroms', ja: 'オングストローム', en: 'Angstroms', factor: 1e-10, symbol: 'Å' },
      // 日本の伝統単位
      shaku: { nameKey: 'unitConverter.length.shaku', ja: '尺', en: 'Shaku', factor: 0.303030303, symbol: '尺' },
      sun: { nameKey: 'unitConverter.length.sun', ja: '寸', en: 'Sun', factor: 0.0303030303, symbol: '寸' },
      ken: { nameKey: 'unitConverter.length.ken', ja: '間', en: 'Ken', factor: 1.8181818, symbol: '間' },
      ri: { nameKey: 'unitConverter.length.ri', ja: '里', en: 'Ri', factor: 3927.27, symbol: '里' },
      jo: { nameKey: 'unitConverter.length.jo', ja: '丈', en: 'Jo', factor: 3.030303, symbol: '丈' },
      cho: { nameKey: 'unitConverter.length.cho', ja: '町', en: 'Cho', factor: 109.09091, symbol: '町' }
    }
  },  weight: {
    baseUnit: 'grams',
    definitions: {
      grams: { nameKey: 'unitConverter.weight.grams', ja: 'グラム', en: 'Grams', factor: 1, symbol: 'g' },
      kilograms: { nameKey: 'unitConverter.weight.kilograms', ja: 'キログラム', en: 'Kilograms', factor: 1000, symbol: 'kg' },
      milligrams: { nameKey: 'unitConverter.weight.milligrams', ja: 'ミリグラム', en: 'Milligrams', factor: 0.001, symbol: 'mg' },
      micrograms: { nameKey: 'unitConverter.weight.micrograms', ja: 'マイクログラム', en: 'Micrograms', factor: 1e-6, symbol: 'μg' },
      nanograms: { nameKey: 'unitConverter.weight.nanograms', ja: 'ナノグラム', en: 'Nanograms', factor: 1e-9, symbol: 'ng' },
      tons: { nameKey: 'unitConverter.weight.tons', ja: 'トン', en: 'Tons', factor: 1e6, symbol: 't' },
      pounds: { nameKey: 'unitConverter.weight.pounds', ja: 'ポンド', en: 'Pounds', factor: 453.59237, symbol: 'lb' },
      ounces: { nameKey: 'unitConverter.weight.ounces', ja: 'オンス', en: 'Ounces', factor: 28.349523125, symbol: 'oz' },
      carats: { nameKey: 'unitConverter.weight.carats', ja: 'カラット', en: 'Carats', factor: 0.2, symbol: 'ct' },
      stones: { nameKey: 'unitConverter.weight.stones', ja: 'ストーン', en: 'Stones', factor: 6350.29318, symbol: 'st' },
      // 日本の伝統単位
      kan: { nameKey: 'unitConverter.weight.kan', ja: '貫', en: 'Kan', factor: 3750, symbol: '貫' },
      kin: { nameKey: 'unitConverter.weight.kin', ja: '斤', en: 'Kin', factor: 600, symbol: '斤' },
      ryo: { nameKey: 'unitConverter.weight.ryo', ja: '両', en: 'Ryo', factor: 37.5, symbol: '両' },
      momme: { nameKey: 'unitConverter.weight.momme', ja: '匁', en: 'Momme', factor: 3.75, symbol: '匁' },
      fun: { nameKey: 'unitConverter.weight.fun', ja: '分', en: 'Fun', factor: 0.375, symbol: '分' },
      // その他の国際単位
      grain: { nameKey: 'unitConverter.weight.grain', ja: 'グレーン', en: 'Grains', factor: 0.06479891, symbol: 'gr' },
      dram: { nameKey: 'unitConverter.weight.dram', ja: 'ドラム', en: 'Drams', factor: 1.7718451953125, symbol: 'dr' },
      troy_ounces: { nameKey: 'unitConverter.weight.troy_ounces', ja: 'トロイオンス', en: 'Troy Ounces', factor: 31.1034768, symbol: 'oz t' },
      troy_pounds: { nameKey: 'unitConverter.weight.troy_pounds', ja: 'トロイポンド', en: 'Troy Pounds', factor: 373.2417216, symbol: 'lb t' }
    }
  },
  temperature: {
    definitions: {
      celsius: { nameKey: 'unitConverter.temperature.celsius', ja: '摂氏(℃)', en: 'Celsius (°C)' },
      fahrenheit: { nameKey: 'unitConverter.temperature.fahrenheit', ja: '華氏(°F)', en: 'Fahrenheit (°F)' },
      kelvin: { nameKey: 'unitConverter.temperature.kelvin', ja: 'ケルビン(K)', en: 'Kelvin (K)' },
      rankine: { nameKey: 'unitConverter.temperature.rankine', ja: 'ランキン(°R)', en: 'Rankine (°R)' }
    },
    convert: function(val, from, to) {
      // 温度変換の特殊ロジック
      let celsius;
      switch(from) {
        case 'celsius': celsius = val; break;
        case 'fahrenheit': celsius = (val - 32) * 5/9; break;
        case 'kelvin': celsius = val - 273.15; break;
        case 'rankine': celsius = (val - 491.67) * 5/9; break;
        default: return NaN;
      }
      switch(to) {
        case 'celsius': return celsius;
        case 'fahrenheit': return celsius * 9/5 + 32;
        case 'kelvin': return celsius + 273.15;
        case 'rankine': return celsius * 9/5 + 491.67;
        default: return NaN;
      }
    }
  },
  area: {
    baseUnit: 'square_meters',
    definitions: {
      square_meters: { nameKey: 'unitConverter.area.square_meters', ja: '平方メートル', en: 'Square Meters', factor: 1, symbol: 'm²' },
      square_kilometers: { nameKey: 'unitConverter.area.square_kilometers', ja: '平方キロメートル', en: 'Square Kilometers', factor: 1e6, symbol: 'km²' },
      square_centimeters: { nameKey: 'unitConverter.area.square_centimeters', ja: '平方センチメートル', en: 'Square Centimeters', factor: 0.0001, symbol: 'cm²' },
      square_millimeters: { nameKey: 'unitConverter.area.square_millimeters', ja: '平方ミリメートル', en: 'Square Millimeters', factor: 1e-6, symbol: 'mm²' },
      hectares: { nameKey: 'unitConverter.area.hectares', ja: 'ヘクタール', en: 'Hectares', factor: 10000, symbol: 'ha' },
      acres: { nameKey: 'unitConverter.area.acres', ja: 'エーカー', en: 'Acres', factor: 4046.8564224, symbol: 'ac' },
      square_feet: { nameKey: 'unitConverter.area.square_feet', ja: '平方フィート', en: 'Square Feet', factor: 0.09290304, symbol: 'ft²' },
      square_inches: { nameKey: 'unitConverter.area.square_inches', ja: '平方インチ', en: 'Square Inches', factor: 0.00064516, symbol: 'in²' },
      square_yards: { nameKey: 'unitConverter.area.square_yards', ja: '平方ヤード', en: 'Square Yards', factor: 0.83612736, symbol: 'yd²' },
      square_miles: { nameKey: 'unitConverter.area.square_miles', ja: '平方マイル', en: 'Square Miles', factor: 2589988.110336, symbol: 'mi²' }
    }
  },  volume: {
    baseUnit: 'liters',
    definitions: {
      liters: { nameKey: 'unitConverter.volume.liters', ja: 'リットル', en: 'Liters', factor: 1, symbol: 'L' },
      milliliters: { nameKey: 'unitConverter.volume.milliliters', ja: 'ミリリットル', en: 'Milliliters', factor: 0.001, symbol: 'mL' },
      cubic_centimeters: { nameKey: 'unitConverter.volume.cubic_centimeters', ja: '立方センチメートル(㏄)', en: 'Cubic Centimeters (cc)', factor: 0.001, symbol: 'cm³' },
      cc: { nameKey: 'unitConverter.volume.cc', ja: 'シーシー(㏄)', en: 'CC', factor: 0.001, symbol: 'cc' },
      microliters: { nameKey: 'unitConverter.volume.microliters', ja: 'マイクロリットル', en: 'Microliters', factor: 1e-6, symbol: 'μL' },
      cubic_meters: { nameKey: 'unitConverter.volume.cubic_meters', ja: '立方メートル', en: 'Cubic Meters', factor: 1000, symbol: 'm³' },
      cubic_millimeters: { nameKey: 'unitConverter.volume.cubic_millimeters', ja: '立方ミリメートル', en: 'Cubic Millimeters', factor: 1e-6, symbol: 'mm³' },
      cubic_inches: { nameKey: 'unitConverter.volume.cubic_inches', ja: '立方インチ', en: 'Cubic Inches', factor: 0.016387064, symbol: 'in³' },
      cubic_feet: { nameKey: 'unitConverter.volume.cubic_feet', ja: '立方フィート', en: 'Cubic Feet', factor: 28.316846592, symbol: 'ft³' },
      cubic_yards: { nameKey: 'unitConverter.volume.cubic_yards', ja: '立方ヤード', en: 'Cubic Yards', factor: 764.554857984, symbol: 'yd³' },
      gallons_us: { nameKey: 'unitConverter.volume.gallons_us', ja: 'ガロン(米)', en: 'Gallons (US)', factor: 3.785411784, symbol: 'gal' },
      gallons_uk: { nameKey: 'unitConverter.volume.gallons_uk', ja: 'ガロン(英)', en: 'Gallons (UK)', factor: 4.54609, symbol: 'gal' },
      quarts_us: { nameKey: 'unitConverter.volume.quarts_us', ja: 'クォート(米)', en: 'Quarts (US)', factor: 0.946352946, symbol: 'qt' },
      pints_us: { nameKey: 'unitConverter.volume.pints_us', ja: 'パイント(米)', en: 'Pints (US)', factor: 0.473176473, symbol: 'pt' },
      cups_us: { nameKey: 'unitConverter.volume.cups_us', ja: 'カップ(米)', en: 'Cups (US)', factor: 0.2365882365, symbol: 'cup' },
      fluid_ounces_us: { nameKey: 'unitConverter.volume.fluid_ounces_us', ja: '液量オンス(米)', en: 'Fluid Ounces (US)', factor: 0.0295735296875, symbol: 'fl oz' },
      tablespoons: { nameKey: 'unitConverter.volume.tablespoons', ja: '大さじ', en: 'Tablespoons', factor: 0.01478676478125, symbol: 'tbsp' },
      teaspoons: { nameKey: 'unitConverter.volume.teaspoons', ja: '小さじ', en: 'Teaspoons', factor: 0.00492892159375, symbol: 'tsp' },
      // 日本の料理単位
      cups_jp: { nameKey: 'unitConverter.volume.cups_jp', ja: 'カップ(日本)', en: 'Cups (Japan)', factor: 0.2, symbol: 'カップ' },
      gou: { nameKey: 'unitConverter.volume.gou', ja: '合', en: 'Gou', factor: 0.18039, symbol: '合' },
      sho: { nameKey: 'unitConverter.volume.sho', ja: '升', en: 'Sho', factor: 1.8039, symbol: '升' },
      to: { nameKey: 'unitConverter.volume.to', ja: '斗', en: 'To', factor: 18.039, symbol: '斗' },
      koku: { nameKey: 'unitConverter.volume.koku', ja: '石', en: 'Koku', factor: 180.39, symbol: '石' },
      // バレル等
      barrels_oil: { nameKey: 'unitConverter.volume.barrels_oil', ja: 'バレル(石油)', en: 'Barrels (Oil)', factor: 158.987294928, symbol: 'bbl' },
      bushels_us: { nameKey: 'unitConverter.volume.bushels_us', ja: 'ブッシェル(米)', en: 'Bushels (US)', factor: 35.2390704, symbol: 'bu' },
      // その他の国際単位
      drops: { nameKey: 'unitConverter.volume.drops', ja: 'ドロップ', en: 'Drops', factor: 5e-5, symbol: 'drop' },
      drams: { nameKey: 'unitConverter.volume.drams', ja: 'ドラム', en: 'Drams', factor: 0.0036966911953, symbol: 'dr' },
      shots: { nameKey: 'unitConverter.volume.shots', ja: 'ショット', en: 'Shots', factor: 0.0443603, symbol: 'shot' }
    }
  },
  speed: {
    baseUnit: 'meters_per_second',
    definitions: {
      meters_per_second: { nameKey: 'unitConverter.speed.meters_per_second', ja: 'メートル毎秒', en: 'Meters per Second', factor: 1, symbol: 'm/s' },
      kilometers_per_hour: { nameKey: 'unitConverter.speed.kilometers_per_hour', ja: 'キロメートル毎時', en: 'Kilometers per Hour', factor: 0.277777778, symbol: 'km/h' },
      miles_per_hour: { nameKey: 'unitConverter.speed.miles_per_hour', ja: 'マイル毎時', en: 'Miles per Hour', factor: 0.44704, symbol: 'mph' },
      feet_per_second: { nameKey: 'unitConverter.speed.feet_per_second', ja: 'フィート毎秒', en: 'Feet per Second', factor: 0.3048, symbol: 'ft/s' },
      knots: { nameKey: 'unitConverter.speed.knots', ja: 'ノット', en: 'Knots', factor: 0.514444444, symbol: 'kn' },
      mach: { nameKey: 'unitConverter.speed.mach', ja: 'マッハ', en: 'Mach', factor: 343, symbol: 'M' }
    }
  },
  pressure: {
    baseUnit: 'pascals',
    definitions: {
      pascals: { nameKey: 'unitConverter.pressure.pascals', ja: 'パスカル', en: 'Pascals', factor: 1, symbol: 'Pa' },
      kilopascals: { nameKey: 'unitConverter.pressure.kilopascals', ja: 'キロパスカル', en: 'Kilopascals', factor: 1000, symbol: 'kPa' },
      megapascals: { nameKey: 'unitConverter.pressure.megapascals', ja: 'メガパスカル', en: 'Megapascals', factor: 1e6, symbol: 'MPa' },
      bars: { nameKey: 'unitConverter.pressure.bars', ja: 'バール', en: 'Bars', factor: 100000, symbol: 'bar' },
      atmospheres: { nameKey: 'unitConverter.pressure.atmospheres', ja: '気圧', en: 'Atmospheres', factor: 101325, symbol: 'atm' },
      mmhg: { nameKey: 'unitConverter.pressure.mmhg', ja: 'ミリ水銀柱', en: 'mmHg', factor: 133.322387415, symbol: 'mmHg' },
      psi: { nameKey: 'unitConverter.pressure.psi', ja: 'ポンド毎平方インチ', en: 'Pounds per Square Inch', factor: 6894.75729, symbol: 'psi' },
      torr: { nameKey: 'unitConverter.pressure.torr', ja: 'トル', en: 'Torr', factor: 133.322368421, symbol: 'Torr' }
    }
  },
  energy: {
    baseUnit: 'joules',
    definitions: {
      joules: { nameKey: 'unitConverter.energy.joules', ja: 'ジュール', en: 'Joules', factor: 1, symbol: 'J' },
      kilojoules: { nameKey: 'unitConverter.energy.kilojoules', ja: 'キロジュール', en: 'Kilojoules', factor: 1000, symbol: 'kJ' },
      calories: { nameKey: 'unitConverter.energy.calories', ja: 'カロリー', en: 'Calories', factor: 4.184, symbol: 'cal' },
      kilocalories: { nameKey: 'unitConverter.energy.kilocalories', ja: 'キロカロリー', en: 'Kilocalories', factor: 4184, symbol: 'kcal' },
      watt_hours: { nameKey: 'unitConverter.energy.watt_hours', ja: 'ワット時', en: 'Watt Hours', factor: 3600, symbol: 'Wh' },
      kilowatt_hours: { nameKey: 'unitConverter.energy.kilowatt_hours', ja: 'キロワット時', en: 'Kilowatt Hours', factor: 3.6e6, symbol: 'kWh' },
      btu: { nameKey: 'unitConverter.energy.btu', ja: 'BTU', en: 'British Thermal Units', factor: 1055.05585262, symbol: 'BTU' },
      electron_volts: { nameKey: 'unitConverter.energy.electron_volts', ja: '電子ボルト', en: 'Electron Volts', factor: 1.602176634e-19, symbol: 'eV' }
    }
  },
  power: {
    baseUnit: 'watts',
    definitions: {
      watts: { nameKey: 'unitConverter.power.watts', ja: 'ワット', en: 'Watts', factor: 1, symbol: 'W' },
      kilowatts: { nameKey: 'unitConverter.power.kilowatts', ja: 'キロワット', en: 'Kilowatts', factor: 1000, symbol: 'kW' },
      megawatts: { nameKey: 'unitConverter.power.megawatts', ja: 'メガワット', en: 'Megawatts', factor: 1e6, symbol: 'MW' },
      horsepower: { nameKey: 'unitConverter.power.horsepower', ja: '馬力', en: 'Horsepower', factor: 745.699871582, symbol: 'hp' },
      metric_horsepower: { nameKey: 'unitConverter.power.metric_horsepower', ja: 'メートル法馬力', en: 'Metric Horsepower', factor: 735.49875, symbol: 'PS' },
      btu_per_hour: { nameKey: 'unitConverter.power.btu_per_hour', ja: 'BTU毎時', en: 'BTU per Hour', factor: 0.293071070172, symbol: 'BTU/h' }
    }
  },
  time: {
    baseUnit: 'seconds',
    definitions: {
      seconds: { nameKey: 'unitConverter.time.seconds', ja: '秒', en: 'Seconds', factor: 1, symbol: 's' },
      minutes: { nameKey: 'unitConverter.time.minutes', ja: '分', en: 'Minutes', factor: 60, symbol: 'min' },
      hours: { nameKey: 'unitConverter.time.hours', ja: '時間', en: 'Hours', factor: 3600, symbol: 'h' },
      days: { nameKey: 'unitConverter.time.days', ja: '日', en: 'Days', factor: 86400, symbol: 'd' },
      weeks: { nameKey: 'unitConverter.time.weeks', ja: '週', en: 'Weeks', factor: 604800, symbol: 'wk' },
      months: { nameKey: 'unitConverter.time.months', ja: '月', en: 'Months', factor: 2629746, symbol: 'mo' },
      years: { nameKey: 'unitConverter.time.years', ja: '年', en: 'Years', factor: 31556952, symbol: 'yr' },
      milliseconds: { nameKey: 'unitConverter.time.milliseconds', ja: 'ミリ秒', en: 'Milliseconds', factor: 0.001, symbol: 'ms' },
      microseconds: { nameKey: 'unitConverter.time.microseconds', ja: 'マイクロ秒', en: 'Microseconds', factor: 1e-6, symbol: 'μs' },
      nanoseconds: { nameKey: 'unitConverter.time.nanoseconds', ja: 'ナノ秒', en: 'Nanoseconds', factor: 1e-9, symbol: 'ns' }
    }
  },  microwave: {
    baseUnit: 'seconds',
    definitions: {
      '500w': { nameKey: 'unitConverter.microwave.500w', ja: '500W', en: '500W', factor: 1, baseWatt: 500, symbol: 'W' },
      '600w': { nameKey: 'unitConverter.microwave.600w', ja: '600W', en: '600W', factor: 1, baseWatt: 600, symbol: 'W' },
      '700w': { nameKey: 'unitConverter.microwave.700w', ja: '700W', en: '700W', factor: 1, baseWatt: 700, symbol: 'W' },
      '800w': { nameKey: 'unitConverter.microwave.800w', ja: '800W', en: '800W', factor: 1, baseWatt: 800, symbol: 'W' },
      '900w': { nameKey: 'unitConverter.microwave.900w', ja: '900W', en: '900W', factor: 1, baseWatt: 900, symbol: 'W' },
      '1000w': { nameKey: 'unitConverter.microwave.1000w', ja: '1000W', en: '1000W', factor: 1, baseWatt: 1000, symbol: 'W' },
      '1200w': { nameKey: 'unitConverter.microwave.1200w', ja: '1200W', en: '1200W', factor: 1, baseWatt: 1200, symbol: 'W' }
    },
    convert: function(val, from, to) {
      // 電子レンジの時間変換：同じエネルギー量で計算
      // 基本原理：エネルギー = 電力 × 時間 が一定
      const fromWatt = this.definitions[from].baseWatt;
      const toWatt = this.definitions[to].baseWatt;
      return val * (fromWatt / toWatt);
    }
  },
  frequency: {
    baseUnit: 'hertz',
    definitions: {
      hertz: { nameKey: 'unitConverter.frequency.hertz', ja: 'ヘルツ', en: 'Hertz', factor: 1, symbol: 'Hz' },
      kilohertz: { nameKey: 'unitConverter.frequency.kilohertz', ja: 'キロヘルツ', en: 'Kilohertz', factor: 1000, symbol: 'kHz' },
      megahertz: { nameKey: 'unitConverter.frequency.megahertz', ja: 'メガヘルツ', en: 'Megahertz', factor: 1e6, symbol: 'MHz' },
      gigahertz: { nameKey: 'unitConverter.frequency.gigahertz', ja: 'ギガヘルツ', en: 'Gigahertz', factor: 1e9, symbol: 'GHz' },
      terahertz: { nameKey: 'unitConverter.frequency.terahertz', ja: 'テラヘルツ', en: 'Terahertz', factor: 1e12, symbol: 'THz' },
      revolutions_per_minute: { nameKey: 'unitConverter.frequency.revolutions_per_minute', ja: '回転毎分', en: 'Revolutions per Minute', factor: 1/60, symbol: 'rpm' },
      radians_per_second: { nameKey: 'unitConverter.frequency.radians_per_second', ja: 'ラジアン毎秒', en: 'Radians per Second', factor: 1/(2*Math.PI), symbol: 'rad/s' }
    }
  },
  angle: {
    baseUnit: 'degrees',
    definitions: {
      degrees: { nameKey: 'unitConverter.angle.degrees', ja: '度', en: 'Degrees', factor: 1, symbol: '°' },
      radians: { nameKey: 'unitConverter.angle.radians', ja: 'ラジアン', en: 'Radians', factor: 180/Math.PI, symbol: 'rad' },
      gradians: { nameKey: 'unitConverter.angle.gradians', ja: 'グラディアン', en: 'Gradians', factor: 0.9, symbol: 'gon' },
      turns: { nameKey: 'unitConverter.angle.turns', ja: '回転', en: 'Turns', factor: 360, symbol: 'turn' },
      mils: { nameKey: 'unitConverter.angle.mils', ja: 'ミル', en: 'Mils', factor: 0.05625, symbol: 'mil' }
    }
  },
  data: {
    baseUnit: 'bytes',
    definitions: {
      bytes: { nameKey: 'unitConverter.data.bytes', ja: 'バイト', en: 'Bytes', factor: 1, symbol: 'B' },
      kilobytes: { nameKey: 'unitConverter.data.kilobytes', ja: 'キロバイト', en: 'Kilobytes', factor: 1024, symbol: 'KB' },
      megabytes: { nameKey: 'unitConverter.data.megabytes', ja: 'メガバイト', en: 'Megabytes', factor: 1024*1024, symbol: 'MB' },
      gigabytes: { nameKey: 'unitConverter.data.gigabytes', ja: 'ギガバイト', en: 'Gigabytes', factor: 1024*1024*1024, symbol: 'GB' },
      terabytes: { nameKey: 'unitConverter.data.terabytes', ja: 'テラバイト', en: 'Terabytes', factor: 1024*1024*1024*1024, symbol: 'TB' },
      petabytes: { nameKey: 'unitConverter.data.petabytes', ja: 'ペタバイト', en: 'Petabytes', factor: Math.pow(1024, 5), symbol: 'PB' },
      bits: { nameKey: 'unitConverter.data.bits', ja: 'ビット', en: 'Bits', factor: 1/8, symbol: 'bit' },
      kilobits: { nameKey: 'unitConverter.data.kilobits', ja: 'キロビット', en: 'Kilobits', factor: 1024/8, symbol: 'Kbit' },
      megabits: { nameKey: 'unitConverter.data.megabits', ja: 'メガビット', en: 'Megabits', factor: 1024*1024/8, symbol: 'Mbit' },
      gigabits: { nameKey: 'unitConverter.data.gigabits', ja: 'ギガビット', en: 'Gigabits', factor: 1024*1024*1024/8, symbol: 'Gbit' }
    }
  },
  fuel_consumption: {
    baseUnit: 'kilometers_per_liter',
    definitions: {
      kilometers_per_liter: { nameKey: 'unitConverter.fuel.kilometers_per_liter', ja: 'キロメートル毎リットル', en: 'Kilometers per Liter', factor: 1, symbol: 'km/L' },
      miles_per_gallon_us: { nameKey: 'unitConverter.fuel.miles_per_gallon_us', ja: 'マイル毎ガロン(米)', en: 'Miles per Gallon (US)', factor: 2.352145833, symbol: 'mpg' },
      miles_per_gallon_uk: { nameKey: 'unitConverter.fuel.miles_per_gallon_uk', ja: 'マイル毎ガロン(英)', en: 'Miles per Gallon (UK)', factor: 2.824809363, symbol: 'mpg' },
      liters_per_100km: { nameKey: 'unitConverter.fuel.liters_per_100km', ja: 'リットル毎100キロメートル', en: 'Liters per 100 Kilometers', factor: 1, symbol: 'L/100km', isInverse: true }
    },
    convert: function(val, from, to) {
      // 燃費変換の特殊ロジック（L/100kmは逆数関係）
      if (from === 'liters_per_100km') {
        val = 100 / val; // km/Lに変換
        from = 'kilometers_per_liter';
      }
      
      let kmPerLiter;
      if (from === 'kilometers_per_liter') {
        kmPerLiter = val;
      } else {
        const fromDef = this.definitions[from];
        kmPerLiter = val / fromDef.factor;
      }
      
      if (to === 'liters_per_100km') {
        return 100 / kmPerLiter;
      } else if (to === 'kilometers_per_liter') {
        return kmPerLiter;
      } else {
        const toDef = this.definitions[to];        return kmPerLiter * toDef.factor;
      }
    }
  },
  
  // 新しいカテゴリ群
  density: {
    baseUnit: 'kg_per_cubic_meter',
    definitions: {
      kg_per_cubic_meter: { nameKey: 'unitConverter.density.kg_per_cubic_meter', ja: 'キログラム毎立方メートル', en: 'kg/m³', factor: 1, symbol: 'kg/m³' },
      g_per_cubic_centimeter: { nameKey: 'unitConverter.density.g_per_cubic_centimeter', ja: 'グラム毎立方センチメートル', en: 'g/cm³', factor: 1000, symbol: 'g/cm³' },
      g_per_liter: { nameKey: 'unitConverter.density.g_per_liter', ja: 'グラム毎リットル', en: 'g/L', factor: 1, symbol: 'g/L' },
      lb_per_cubic_foot: { nameKey: 'unitConverter.density.lb_per_cubic_foot', ja: 'ポンド毎立方フィート', en: 'lb/ft³', factor: 16.0185, symbol: 'lb/ft³' },
      oz_per_cubic_inch: { nameKey: 'unitConverter.density.oz_per_cubic_inch', ja: 'オンス毎立方インチ', en: 'oz/in³', factor: 1729.994, symbol: 'oz/in³' }
    }
  },
  
  force: {
    baseUnit: 'newtons',
    definitions: {
      newtons: { nameKey: 'unitConverter.force.newtons', ja: 'ニュートン', en: 'Newtons', factor: 1, symbol: 'N' },
      kilonewtons: { nameKey: 'unitConverter.force.kilonewtons', ja: 'キロニュートン', en: 'Kilonewtons', factor: 1000, symbol: 'kN' },
      dynes: { nameKey: 'unitConverter.force.dynes', ja: 'ダイン', en: 'Dynes', factor: 1e-5, symbol: 'dyn' },
      pounds_force: { nameKey: 'unitConverter.force.pounds_force', ja: 'ポンドフォース', en: 'Pounds Force', factor: 4.4482216, symbol: 'lbf' },
      kilograms_force: { nameKey: 'unitConverter.force.kilograms_force', ja: 'キログラムフォース', en: 'Kilograms Force', factor: 9.80665, symbol: 'kgf' },
      tons_force: { nameKey: 'unitConverter.force.tons_force', ja: 'トンフォース', en: 'Tons Force', factor: 9806.65, symbol: 'tf' },
      ounces_force: { nameKey: 'unitConverter.force.ounces_force', ja: 'オンスフォース', en: 'Ounces Force', factor: 0.27801385, symbol: 'ozf' }
    }
  },
  
  torque: {
    baseUnit: 'newton_meters',
    definitions: {
      newton_meters: { nameKey: 'unitConverter.torque.newton_meters', ja: 'ニュートンメートル', en: 'Newton-meters', factor: 1, symbol: 'N⋅m' },
      foot_pounds: { nameKey: 'unitConverter.torque.foot_pounds', ja: 'フィートポンド', en: 'Foot-pounds', factor: 1.3558179, symbol: 'ft⋅lb' },
      inch_pounds: { nameKey: 'unitConverter.torque.inch_pounds', ja: 'インチポンド', en: 'Inch-pounds', factor: 0.1129848, symbol: 'in⋅lb' },
      kilogram_meters: { nameKey: 'unitConverter.torque.kilogram_meters', ja: 'キログラムメートル', en: 'Kilogram-meters', factor: 9.80665, symbol: 'kg⋅m' },
      dyne_centimeters: { nameKey: 'unitConverter.torque.dyne_centimeters', ja: 'ダインセンチメートル', en: 'Dyne-centimeters', factor: 1e-7, symbol: 'dyn⋅cm' }
    }
  },
  
  acceleration: {
    baseUnit: 'meters_per_second_squared',
    definitions: {
      meters_per_second_squared: { nameKey: 'unitConverter.acceleration.meters_per_second_squared', ja: 'メートル毎秒毎秒', en: 'm/s²', factor: 1, symbol: 'm/s²' },
      gravity_standard: { nameKey: 'unitConverter.acceleration.gravity_standard', ja: '標準重力', en: 'Standard Gravity', factor: 9.80665, symbol: 'g' },
      feet_per_second_squared: { nameKey: 'unitConverter.acceleration.feet_per_second_squared', ja: 'フィート毎秒毎秒', en: 'ft/s²', factor: 0.3048, symbol: 'ft/s²' },
      galileo: { nameKey: 'unitConverter.acceleration.galileo', ja: 'ガル', en: 'Gal', factor: 0.01, symbol: 'Gal' },
      milligal: { nameKey: 'unitConverter.acceleration.milligal', ja: 'ミリガル', en: 'Milligal', factor: 1e-5, symbol: 'mGal' }
    }
  },
  
  velocity: {
    baseUnit: 'meters_per_second',
    definitions: {
      meters_per_second: { nameKey: 'unitConverter.velocity.meters_per_second', ja: 'メートル毎秒', en: 'm/s', factor: 1, symbol: 'm/s' },
      kilometers_per_hour: { nameKey: 'unitConverter.velocity.kilometers_per_hour', ja: 'キロメートル毎時', en: 'km/h', factor: 0.277777778, symbol: 'km/h' },
      miles_per_hour: { nameKey: 'unitConverter.velocity.miles_per_hour', ja: 'マイル毎時', en: 'mph', factor: 0.44704, symbol: 'mph' },
      feet_per_second: { nameKey: 'unitConverter.velocity.feet_per_second', ja: 'フィート毎秒', en: 'ft/s', factor: 0.3048, symbol: 'ft/s' },
      knots: { nameKey: 'unitConverter.velocity.knots', ja: 'ノット', en: 'Knots', factor: 0.514444444, symbol: 'kn' },
      mach: { nameKey: 'unitConverter.velocity.mach', ja: 'マッハ', en: 'Mach', factor: 343, symbol: 'M' },
      speed_of_light: { nameKey: 'unitConverter.velocity.speed_of_light', ja: '光速', en: 'Speed of Light', factor: 299792458, symbol: 'c' },
      mils_per_hour: { nameKey: 'unitConverter.velocity.mils_per_hour', ja: 'ミル毎時', en: 'mil/h', factor: 0.0254e-3, symbol: 'mil/h' }
    }
  },
  
  luminance: {
    baseUnit: 'candela_per_square_meter',
    definitions: {
      candela_per_square_meter: { nameKey: 'unitConverter.luminance.candela_per_square_meter', ja: 'カンデラ毎平方メートル', en: 'cd/m²', factor: 1, symbol: 'cd/m²' },
      nit: { nameKey: 'unitConverter.luminance.nit', ja: 'ニト', en: 'Nit', factor: 1, symbol: 'nt' },
      stilb: { nameKey: 'unitConverter.luminance.stilb', ja: 'スチルブ', en: 'Stilb', factor: 10000, symbol: 'sb' },
      lambert: { nameKey: 'unitConverter.luminance.lambert', ja: 'ランバート', en: 'Lambert', factor: 3183.09886, symbol: 'L' },
      foot_lambert: { nameKey: 'unitConverter.luminance.foot_lambert', ja: 'フートランバート', en: 'Foot-lambert', factor: 3.4262591, symbol: 'fL' }
    }
  },
  
  illuminance: {
    baseUnit: 'lux',
    definitions: {
      lux: { nameKey: 'unitConverter.illuminance.lux', ja: 'ルクス', en: 'Lux', factor: 1, symbol: 'lx' },
      foot_candles: { nameKey: 'unitConverter.illuminance.foot_candles', ja: 'フートキャンドル', en: 'Foot-candles', factor: 10.76391, symbol: 'fc' },
      phot: { nameKey: 'unitConverter.illuminance.phot', ja: 'フォト', en: 'Phot', factor: 10000, symbol: 'ph' },
      nox: { nameKey: 'unitConverter.illuminance.nox', ja: 'ノックス', en: 'Nox', factor: 0.001, symbol: 'nx' }
    }
  },
  
  electric_current: {
    baseUnit: 'amperes',
    definitions: {
      amperes: { nameKey: 'unitConverter.electric_current.amperes', ja: 'アンペア', en: 'Amperes', factor: 1, symbol: 'A' },
      milliamperes: { nameKey: 'unitConverter.electric_current.milliamperes', ja: 'ミリアンペア', en: 'Milliamperes', factor: 0.001, symbol: 'mA' },
      microamperes: { nameKey: 'unitConverter.electric_current.microamperes', ja: 'マイクロアンペア', en: 'Microamperes', factor: 1e-6, symbol: 'μA' },
      kiloamperes: { nameKey: 'unitConverter.electric_current.kiloamperes', ja: 'キロアンペア', en: 'Kiloamperes', factor: 1000, symbol: 'kA' },
      abamperes: { nameKey: 'unitConverter.electric_current.abamperes', ja: 'アブアンペア', en: 'Abamperes', factor: 10, symbol: 'abA' }
    }
  },
  
  voltage: {
    baseUnit: 'volts',
    definitions: {
      volts: { nameKey: 'unitConverter.voltage.volts', ja: 'ボルト', en: 'Volts', factor: 1, symbol: 'V' },
      millivolts: { nameKey: 'unitConverter.voltage.millivolts', ja: 'ミリボルト', en: 'Millivolts', factor: 0.001, symbol: 'mV' },
      microvolts: { nameKey: 'unitConverter.voltage.microvolts', ja: 'マイクロボルト', en: 'Microvolts', factor: 1e-6, symbol: 'μV' },
      kilovolts: { nameKey: 'unitConverter.voltage.kilovolts', ja: 'キロボルト', en: 'Kilovolts', factor: 1000, symbol: 'kV' },
      megavolts: { nameKey: 'unitConverter.voltage.megavolts', ja: 'メガボルト', en: 'Megavolts', factor: 1e6, symbol: 'MV' }
    }
  },
  
  resistance: {
    baseUnit: 'ohms',
    definitions: {
      ohms: { nameKey: 'unitConverter.resistance.ohms', ja: 'オーム', en: 'Ohms', factor: 1, symbol: 'Ω' },
      milliohms: { nameKey: 'unitConverter.resistance.milliohms', ja: 'ミリオーム', en: 'Milliohms', factor: 0.001, symbol: 'mΩ' },
      microohms: { nameKey: 'unitConverter.resistance.microohms', ja: 'マイクロオーム', en: 'Microohms', factor: 1e-6, symbol: 'μΩ' },
      kiloohms: { nameKey: 'unitConverter.resistance.kiloohms', ja: 'キロオーム', en: 'Kiloohms', factor: 1000, symbol: 'kΩ' },
      megaohms: { nameKey: 'unitConverter.resistance.megaohms', ja: 'メガオーム', en: 'Megaohms', factor: 1e6, symbol: 'MΩ' }
    }
  },
  
  capacitance: {
    baseUnit: 'farads',
    definitions: {
      farads: { nameKey: 'unitConverter.capacitance.farads', ja: 'ファラド', en: 'Farads', factor: 1, symbol: 'F' },
      millifarads: { nameKey: 'unitConverter.capacitance.millifarads', ja: 'ミリファラド', en: 'Millifarads', factor: 0.001, symbol: 'mF' },
      microfarads: { nameKey: 'unitConverter.capacitance.microfarads', ja: 'マイクロファラド', en: 'Microfarads', factor: 1e-6, symbol: 'μF' },
      nanofarads: { nameKey: 'unitConverter.capacitance.nanofarads', ja: 'ナノファラド', en: 'Nanofarads', factor: 1e-9, symbol: 'nF' },
      picofarads: { nameKey: 'unitConverter.capacitance.picofarads', ja: 'ピコファラド', en: 'Picofarads', factor: 1e-12, symbol: 'pF' }
    }
  },
  
  inductance: {
    baseUnit: 'henries',
    definitions: {
      henries: { nameKey: 'unitConverter.inductance.henries', ja: 'ヘンリー', en: 'Henries', factor: 1, symbol: 'H' },
      millihenries: { nameKey: 'unitConverter.inductance.millihenries', ja: 'ミリヘンリー', en: 'Millihenries', factor: 0.001, symbol: 'mH' },
      microhenries: { nameKey: 'unitConverter.inductance.microhenries', ja: 'マイクロヘンリー', en: 'Microhenries', factor: 1e-6, symbol: 'μH' },
      nanohenries: { nameKey: 'unitConverter.inductance.nanohenries', ja: 'ナノヘンリー', en: 'Nanohenries', factor: 1e-9, symbol: 'nH' }
    }
  },
  
  radioactivity: {
    baseUnit: 'becquerels',
    definitions: {
      becquerels: { nameKey: 'unitConverter.radioactivity.becquerels', ja: 'ベクレル', en: 'Becquerels', factor: 1, symbol: 'Bq' },
      curies: { nameKey: 'unitConverter.radioactivity.curies', ja: 'キュリー', en: 'Curies', factor: 3.7e10, symbol: 'Ci' },
      rutherford: { nameKey: 'unitConverter.radioactivity.rutherford', ja: 'ラザフォード', en: 'Rutherford', factor: 1e6, symbol: 'Rd' },
      disintegrations_per_minute: { nameKey: 'unitConverter.radioactivity.disintegrations_per_minute', ja: '毎分崩壊数', en: 'DPM', factor: 1/60, symbol: 'dpm' },
      disintegrations_per_second: { nameKey: 'unitConverter.radioactivity.disintegrations_per_second', ja: '毎秒崩壊数', en: 'DPS', factor: 1, symbol: 'dps' }
    }
  },
  
  radiation_dose: {
    baseUnit: 'grays',
    definitions: {
      grays: { nameKey: 'unitConverter.radiation_dose.grays', ja: 'グレイ', en: 'Grays', factor: 1, symbol: 'Gy' },
      rads: { nameKey: 'unitConverter.radiation_dose.rads', ja: 'ラド', en: 'Rads', factor: 0.01, symbol: 'rad' },
      sieverts: { nameKey: 'unitConverter.radiation_dose.sieverts', ja: 'シーベルト', en: 'Sieverts', factor: 1, symbol: 'Sv' },
      rems: { nameKey: 'unitConverter.radiation_dose.rems', ja: 'レム', en: 'Rems', factor: 0.01, symbol: 'rem' },
      roentgens: { nameKey: 'unitConverter.radiation_dose.roentgens', ja: 'レントゲン', en: 'Roentgens', factor: 0.00877, symbol: 'R' }
    }
  }
};
