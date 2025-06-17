// 単位定義データ（カテゴリごとに分割・拡張しやすい構造）
window.unitConverterData = {
  length: {
    baseUnit: 'meters',
    definitions: {
      meters: { nameKey: 'unitConverter.length.meters', ja: 'メートル', en: 'Meters', factor: 1, symbol: 'm' },
      kilometers: { nameKey: 'unitConverter.length.kilometers', ja: 'キロメートル', en: 'Kilometers', factor: 1000, symbol: 'km' },
      centimeters: { nameKey: 'unitConverter.length.centimeters', ja: 'センチメートル', en: 'Centimeters', factor: 0.01, symbol: 'cm' },
      millimeters: { nameKey: 'unitConverter.length.millimeters', ja: 'ミリメートル', en: 'Millimeters', factor: 0.001, symbol: 'mm' },
      micrometers: { nameKey: 'unitConverter.length.micrometers', ja: 'マイクロメートル', en: 'Micrometers', factor: 1e-6, symbol: 'μm' },
      nanometers: { nameKey: 'unitConverter.length.nanometers', ja: 'ナノメートル', en: 'Nanometers', factor: 1e-9, symbol: 'nm' },
      miles: { nameKey: 'unitConverter.length.miles', ja: 'マイル', en: 'Miles', factor: 1609.344, symbol: 'mi' },
      yards: { nameKey: 'unitConverter.length.yards', ja: 'ヤード', en: 'Yards', factor: 0.9144, symbol: 'yd' },
      feet: { nameKey: 'unitConverter.length.feet', ja: 'フィート', en: 'Feet', factor: 0.3048, symbol: 'ft' },
      inches: { nameKey: 'unitConverter.length.inches', ja: 'インチ', en: 'Inches', factor: 0.0254, symbol: 'in' },
      nautical_miles: { nameKey: 'unitConverter.length.nautical_miles', ja: '海里', en: 'Nautical Miles', factor: 1852, symbol: 'nmi' },
      light_years: { nameKey: 'unitConverter.length.light_years', ja: '光年', en: 'Light Years', factor: 9.4607e15, symbol: 'ly' },
      astronomical_units: { nameKey: 'unitConverter.length.astronomical_units', ja: '天文単位', en: 'Astronomical Units', factor: 1.495978707e11, symbol: 'AU' },
      parsecs: { nameKey: 'unitConverter.length.parsecs', ja: 'パーセク', en: 'Parsecs', factor: 3.085677581e16, symbol: 'pc' },
      angstroms: { nameKey: 'unitConverter.length.angstroms', ja: 'オングストローム', en: 'Angstroms', factor: 1e-10, symbol: 'Å' }
    }
  },
  weight: {
    baseUnit: 'grams',
    definitions: {
      grams: { nameKey: 'unitConverter.weight.grams', ja: 'グラム', en: 'Grams', factor: 1, symbol: 'g' },
      kilograms: { nameKey: 'unitConverter.weight.kilograms', ja: 'キログラム', en: 'Kilograms', factor: 1000, symbol: 'kg' },
      milligrams: { nameKey: 'unitConverter.weight.milligrams', ja: 'ミリグラム', en: 'Milligrams', factor: 0.001, symbol: 'mg' },
      micrograms: { nameKey: 'unitConverter.weight.micrograms', ja: 'マイクログラム', en: 'Micrograms', factor: 1e-6, symbol: 'μg' },
      tons: { nameKey: 'unitConverter.weight.tons', ja: 'トン', en: 'Tons', factor: 1e6, symbol: 't' },
      pounds: { nameKey: 'unitConverter.weight.pounds', ja: 'ポンド', en: 'Pounds', factor: 453.59237, symbol: 'lb' },
      ounces: { nameKey: 'unitConverter.weight.ounces', ja: 'オンス', en: 'Ounces', factor: 28.349523125, symbol: 'oz' },
      carats: { nameKey: 'unitConverter.weight.carats', ja: 'カラット', en: 'Carats', factor: 0.2, symbol: 'ct' },
      stones: { nameKey: 'unitConverter.weight.stones', ja: 'ストーン', en: 'Stones', factor: 6350.29318, symbol: 'st' }
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
  },
  volume: {
    baseUnit: 'liters',
    definitions: {
      liters: { nameKey: 'unitConverter.volume.liters', ja: 'リットル', en: 'Liters', factor: 1, symbol: 'L' },
      milliliters: { nameKey: 'unitConverter.volume.milliliters', ja: 'ミリリットル', en: 'Milliliters', factor: 0.001, symbol: 'mL' },
      cubic_meters: { nameKey: 'unitConverter.volume.cubic_meters', ja: '立方メートル', en: 'Cubic Meters', factor: 1000, symbol: 'm³' },
      cubic_centimeters: { nameKey: 'unitConverter.volume.cubic_centimeters', ja: '立方センチメートル', en: 'Cubic Centimeters', factor: 0.001, symbol: 'cm³' },
      gallons_us: { nameKey: 'unitConverter.volume.gallons_us', ja: 'ガロン(米)', en: 'Gallons (US)', factor: 3.785411784, symbol: 'gal' },
      gallons_uk: { nameKey: 'unitConverter.volume.gallons_uk', ja: 'ガロン(英)', en: 'Gallons (UK)', factor: 4.54609, symbol: 'gal' },
      quarts_us: { nameKey: 'unitConverter.volume.quarts_us', ja: 'クォート(米)', en: 'Quarts (US)', factor: 0.946352946, symbol: 'qt' },
      pints_us: { nameKey: 'unitConverter.volume.pints_us', ja: 'パイント(米)', en: 'Pints (US)', factor: 0.473176473, symbol: 'pt' },
      cups_us: { nameKey: 'unitConverter.volume.cups_us', ja: 'カップ(米)', en: 'Cups (US)', factor: 0.2365882365, symbol: 'cup' },
      fluid_ounces_us: { nameKey: 'unitConverter.volume.fluid_ounces_us', ja: '液量オンス(米)', en: 'Fluid Ounces (US)', factor: 0.0295735296875, symbol: 'fl oz' },
      tablespoons: { nameKey: 'unitConverter.volume.tablespoons', ja: '大さじ', en: 'Tablespoons', factor: 0.01478676478125, symbol: 'tbsp' },
      teaspoons: { nameKey: 'unitConverter.volume.teaspoons', ja: '小さじ', en: 'Teaspoons', factor: 0.00492892159375, symbol: 'tsp' }
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
  },
  microwave: {
    baseUnit: 'watts',
    definitions: {
      '500w': { nameKey: 'unitConverter.microwave.500w', ja: '500W', en: '500W', factor: 500, symbol: 'W' },
      '600w': { nameKey: 'unitConverter.microwave.600w', ja: '600W', en: '600W', factor: 600, symbol: 'W' },
      '700w': { nameKey: 'unitConverter.microwave.700w', ja: '700W', en: '700W', factor: 700, symbol: 'W' },
      '800w': { nameKey: 'unitConverter.microwave.800w', ja: '800W', en: '800W', factor: 800, symbol: 'W' },
      '900w': { nameKey: 'unitConverter.microwave.900w', ja: '900W', en: '900W', factor: 900, symbol: 'W' },
      '1000w': { nameKey: 'unitConverter.microwave.1000w', ja: '1000W', en: '1000W', factor: 1000, symbol: 'W' }
    },
    convert: function(val, from, to) {
      const fromWatt = parseInt(from.replace('w', ''));
      const toWatt = parseInt(to.replace('w', ''));
      return val * (fromWatt / toWatt);
    }
  }
};
