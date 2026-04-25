// Unit definitions used by the unit converter.
// Each factor converts the unit into the category base unit.
(function () {
  "use strict";

  window.unitConverterData = {
    length: {
      baseUnit: "meters",
      definitions: {
        meters: { ja: "メートル", en: "Meters", factor: 1, symbol: "m" },
        kilometers: { ja: "キロメートル", en: "Kilometers", factor: 1000, symbol: "km" },
        centimeters: { ja: "センチメートル", en: "Centimeters", factor: 0.01, symbol: "cm" },
        millimeters: { ja: "ミリメートル", en: "Millimeters", factor: 0.001, symbol: "mm" },
        micrometers: { ja: "マイクロメートル", en: "Micrometers", factor: 1e-6, symbol: "µm" },
        nanometers: { ja: "ナノメートル", en: "Nanometers", factor: 1e-9, symbol: "nm" },
        miles: { ja: "マイル", en: "Miles", factor: 1609.344, symbol: "mi" },
        yards: { ja: "ヤード", en: "Yards", factor: 0.9144, symbol: "yd" },
        feet: { ja: "フィート", en: "Feet", factor: 0.3048, symbol: "ft" },
        inches: { ja: "インチ", en: "Inches", factor: 0.0254, symbol: "in" },
        nautical_miles: { ja: "海里", en: "Nautical Miles", factor: 1852, symbol: "nmi" },
        light_years: { ja: "光年", en: "Light Years", factor: 9.4607e15, symbol: "ly" },
        astronomical_units: { ja: "天文単位", en: "Astronomical Units", factor: 1.495978707e11, symbol: "AU" },
        parsecs: { ja: "パーセク", en: "Parsecs", factor: 3.085677581e16, symbol: "pc" },
        angstroms: { ja: "オングストローム", en: "Angstroms", factor: 1e-10, symbol: "Å" },
        shaku: { ja: "尺", en: "Shaku", factor: 10 / 33, symbol: "尺" },
        sun: { ja: "寸", en: "Sun", factor: 1 / 33, symbol: "寸" },
        ken: { ja: "間", en: "Ken", factor: 60 / 33, symbol: "間" },
        ri: { ja: "里", en: "Ri", factor: 12960 / 3.3, symbol: "里" },
        jo: { ja: "丈", en: "Jo", factor: 100 / 33, symbol: "丈" },
        cho: { ja: "町", en: "Cho", factor: 3600 / 33, symbol: "町" }
      }
    },
    weight: {
      baseUnit: "grams",
      definitions: {
        grams: { ja: "グラム", en: "Grams", factor: 1, symbol: "g" },
        kilograms: { ja: "キログラム", en: "Kilograms", factor: 1000, symbol: "kg" },
        milligrams: { ja: "ミリグラム", en: "Milligrams", factor: 0.001, symbol: "mg" },
        micrograms: { ja: "マイクログラム", en: "Micrograms", factor: 1e-6, symbol: "µg" },
        nanograms: { ja: "ナノグラム", en: "Nanograms", factor: 1e-9, symbol: "ng" },
        tons: { ja: "トン", en: "Metric Tons", factor: 1e6, symbol: "t" },
        pounds: { ja: "ポンド", en: "Pounds", factor: 453.59237, symbol: "lb" },
        ounces: { ja: "オンス", en: "Ounces", factor: 28.349523125, symbol: "oz" },
        carats: { ja: "カラット", en: "Carats", factor: 0.2, symbol: "ct" },
        stones: { ja: "ストーン", en: "Stones", factor: 6350.29318, symbol: "st" },
        kan: { ja: "貫", en: "Kan", factor: 3750, symbol: "貫" },
        kin: { ja: "斤", en: "Kin", factor: 600, symbol: "斤" },
        ryo: { ja: "両", en: "Ryo", factor: 37.5, symbol: "両" },
        momme: { ja: "匁", en: "Momme", factor: 3.75, symbol: "匁" },
        fun: { ja: "分", en: "Fun", factor: 0.375, symbol: "分" },
        grain: { ja: "グレーン", en: "Grains", factor: 0.06479891, symbol: "gr" },
        dram: { ja: "ドラム", en: "Drams", factor: 1.7718451953125, symbol: "dr" },
        troy_ounces: { ja: "トロイオンス", en: "Troy Ounces", factor: 31.1034768, symbol: "oz t" },
        troy_pounds: { ja: "トロイポンド", en: "Troy Pounds", factor: 373.2417216, symbol: "lb t" }
      }
    },
    temperature: {
      definitions: {
        celsius: { ja: "摂氏", en: "Celsius", symbol: "°C" },
        fahrenheit: { ja: "華氏", en: "Fahrenheit", symbol: "°F" },
        kelvin: { ja: "ケルビン", en: "Kelvin", symbol: "K" },
        rankine: { ja: "ランキン", en: "Rankine", symbol: "°R" }
      },
      convert(value, from, to) {
        let celsius;
        switch (from) {
          case "celsius": celsius = value; break;
          case "fahrenheit": celsius = (value - 32) * 5 / 9; break;
          case "kelvin": celsius = value - 273.15; break;
          case "rankine": celsius = (value - 491.67) * 5 / 9; break;
          default: return NaN;
        }
        switch (to) {
          case "celsius": return celsius;
          case "fahrenheit": return celsius * 9 / 5 + 32;
          case "kelvin": return celsius + 273.15;
          case "rankine": return celsius * 9 / 5 + 491.67;
          default: return NaN;
        }
      }
    },
    area: {
      baseUnit: "square_meters",
      definitions: {
        square_meters: { ja: "平方メートル", en: "Square Meters", factor: 1, symbol: "m²" },
        square_kilometers: { ja: "平方キロメートル", en: "Square Kilometers", factor: 1e6, symbol: "km²" },
        square_centimeters: { ja: "平方センチメートル", en: "Square Centimeters", factor: 0.0001, symbol: "cm²" },
        square_millimeters: { ja: "平方ミリメートル", en: "Square Millimeters", factor: 1e-6, symbol: "mm²" },
        hectares: { ja: "ヘクタール", en: "Hectares", factor: 10000, symbol: "ha" },
        acres: { ja: "エーカー", en: "Acres", factor: 4046.8564224, symbol: "ac" },
        square_feet: { ja: "平方フィート", en: "Square Feet", factor: 0.09290304, symbol: "ft²" },
        square_inches: { ja: "平方インチ", en: "Square Inches", factor: 0.00064516, symbol: "in²" },
        square_yards: { ja: "平方ヤード", en: "Square Yards", factor: 0.83612736, symbol: "yd²" },
        square_miles: { ja: "平方マイル", en: "Square Miles", factor: 2589988.110336, symbol: "mi²" },
        tsubo: { ja: "坪", en: "Tsubo", factor: 3.305785124, symbol: "坪" },
        se: { ja: "畝", en: "Se", factor: 99.17355372, symbol: "畝" },
        tan: { ja: "反", en: "Tan", factor: 991.7355372, symbol: "反" },
        cho_area: { ja: "町歩", en: "Cho (area)", factor: 9917.355372, symbol: "町歩" }
      }
    },
    volume: {
      baseUnit: "liters",
      definitions: {
        liters: { ja: "リットル", en: "Liters", factor: 1, symbol: "L" },
        milliliters: { ja: "ミリリットル", en: "Milliliters", factor: 0.001, symbol: "mL" },
        cubic_centimeters: { ja: "立方センチメートル", en: "Cubic Centimeters", factor: 0.001, symbol: "cm³" },
        cc: { ja: "シーシー", en: "CC", factor: 0.001, symbol: "cc" },
        microliters: { ja: "マイクロリットル", en: "Microliters", factor: 1e-6, symbol: "µL" },
        cubic_meters: { ja: "立方メートル", en: "Cubic Meters", factor: 1000, symbol: "m³" },
        cubic_millimeters: { ja: "立方ミリメートル", en: "Cubic Millimeters", factor: 1e-6, symbol: "mm³" },
        cubic_inches: { ja: "立方インチ", en: "Cubic Inches", factor: 0.016387064, symbol: "in³" },
        cubic_feet: { ja: "立方フィート", en: "Cubic Feet", factor: 28.316846592, symbol: "ft³" },
        cubic_yards: { ja: "立方ヤード", en: "Cubic Yards", factor: 764.554857984, symbol: "yd³" },
        gallons_us: { ja: "ガロン（米）", en: "Gallons (US)", factor: 3.785411784, symbol: "gal US" },
        gallons_uk: { ja: "ガロン（英）", en: "Gallons (UK)", factor: 4.54609, symbol: "gal UK" },
        quarts_us: { ja: "クォート（米）", en: "Quarts (US)", factor: 0.946352946, symbol: "qt" },
        pints_us: { ja: "パイント（米）", en: "Pints (US)", factor: 0.473176473, symbol: "pt" },
        cups_us: { ja: "カップ（米）", en: "Cups (US)", factor: 0.2365882365, symbol: "cup US" },
        cups_jp: { ja: "カップ（日本）", en: "Cups (Japan)", factor: 0.2, symbol: "cup JP" },
        fluid_ounces_us: { ja: "液量オンス（米）", en: "Fluid Ounces (US)", factor: 0.0295735296875, symbol: "fl oz" },
        tablespoons: { ja: "大さじ", en: "Tablespoons", factor: 0.01478676478125, symbol: "tbsp" },
        teaspoons: { ja: "小さじ", en: "Teaspoons", factor: 0.00492892159375, symbol: "tsp" },
        gou: { ja: "合", en: "Gou", factor: 0.18039, symbol: "合" },
        sho: { ja: "升", en: "Sho", factor: 1.8039, symbol: "升" },
        to: { ja: "斗", en: "To", factor: 18.039, symbol: "斗" },
        koku: { ja: "石", en: "Koku", factor: 180.39, symbol: "石" },
        barrels_oil: { ja: "バレル（石油）", en: "Barrels (Oil)", factor: 158.987294928, symbol: "bbl" },
        bushels_us: { ja: "ブッシェル（米）", en: "Bushels (US)", factor: 35.2390704, symbol: "bu" },
        drops: { ja: "滴", en: "Drops", factor: 5e-5, symbol: "drop" },
        drams: { ja: "ドラム", en: "Drams", factor: 0.0036966911953, symbol: "dr" },
        shots: { ja: "ショット", en: "Shots", factor: 0.0443603, symbol: "shot" }
      }
    },
    speed: {
      baseUnit: "meters_per_second",
      definitions: {
        meters_per_second: { ja: "メートル毎秒", en: "Meters per Second", factor: 1, symbol: "m/s" },
        kilometers_per_hour: { ja: "キロメートル毎時", en: "Kilometers per Hour", factor: 0.277777778, symbol: "km/h" },
        miles_per_hour: { ja: "マイル毎時", en: "Miles per Hour", factor: 0.44704, symbol: "mph" },
        feet_per_second: { ja: "フィート毎秒", en: "Feet per Second", factor: 0.3048, symbol: "ft/s" },
        knots: { ja: "ノット", en: "Knots", factor: 0.514444444, symbol: "kn" },
        mach: { ja: "マッハ", en: "Mach", factor: 343, symbol: "M" }
      }
    },
    pressure: {
      baseUnit: "pascals",
      definitions: {
        pascals: { ja: "パスカル", en: "Pascals", factor: 1, symbol: "Pa" },
        kilopascals: { ja: "キロパスカル", en: "Kilopascals", factor: 1000, symbol: "kPa" },
        megapascals: { ja: "メガパスカル", en: "Megapascals", factor: 1e6, symbol: "MPa" },
        bars: { ja: "バール", en: "Bars", factor: 100000, symbol: "bar" },
        atmospheres: { ja: "気圧", en: "Atmospheres", factor: 101325, symbol: "atm" },
        mmhg: { ja: "水銀柱ミリメートル", en: "Millimeters of Mercury", factor: 133.322387415, symbol: "mmHg" },
        psi: { ja: "重量ポンド毎平方インチ", en: "Pounds per Square Inch", factor: 6894.75729, symbol: "psi" },
        torr: { ja: "トル", en: "Torr", factor: 133.322368421, symbol: "Torr" }
      }
    },
    energy: {
      baseUnit: "joules",
      definitions: {
        joules: { ja: "ジュール", en: "Joules", factor: 1, symbol: "J" },
        kilojoules: { ja: "キロジュール", en: "Kilojoules", factor: 1000, symbol: "kJ" },
        calories: { ja: "カロリー", en: "Calories", factor: 4.184, symbol: "cal" },
        kilocalories: { ja: "キロカロリー", en: "Kilocalories", factor: 4184, symbol: "kcal" },
        watt_hours: { ja: "ワット時", en: "Watt Hours", factor: 3600, symbol: "Wh" },
        kilowatt_hours: { ja: "キロワット時", en: "Kilowatt Hours", factor: 3.6e6, symbol: "kWh" },
        btu: { ja: "英国熱量単位", en: "British Thermal Units", factor: 1055.05585262, symbol: "BTU" },
        electron_volts: { ja: "電子ボルト", en: "Electron Volts", factor: 1.602176634e-19, symbol: "eV" }
      }
    },
    power: {
      baseUnit: "watts",
      definitions: {
        watts: { ja: "ワット", en: "Watts", factor: 1, symbol: "W" },
        kilowatts: { ja: "キロワット", en: "Kilowatts", factor: 1000, symbol: "kW" },
        megawatts: { ja: "メガワット", en: "Megawatts", factor: 1e6, symbol: "MW" },
        horsepower: { ja: "馬力", en: "Horsepower", factor: 745.699871582, symbol: "hp" },
        metric_horsepower: { ja: "仏馬力", en: "Metric Horsepower", factor: 735.49875, symbol: "PS" },
        btu_per_hour: { ja: "BTU毎時", en: "BTU per Hour", factor: 0.293071070172, symbol: "BTU/h" }
      }
    },
    time: {
      baseUnit: "seconds",
      definitions: {
        seconds: { ja: "秒", en: "Seconds", factor: 1, symbol: "s" },
        minutes: { ja: "分", en: "Minutes", factor: 60, symbol: "min" },
        hours: { ja: "時間", en: "Hours", factor: 3600, symbol: "h" },
        days: { ja: "日", en: "Days", factor: 86400, symbol: "d" },
        weeks: { ja: "週", en: "Weeks", factor: 604800, symbol: "wk" },
        months: { ja: "月（平均）", en: "Months (average)", factor: 2629746, symbol: "mo" },
        years: { ja: "年（平均）", en: "Years (average)", factor: 31556952, symbol: "yr" },
        milliseconds: { ja: "ミリ秒", en: "Milliseconds", factor: 0.001, symbol: "ms" },
        microseconds: { ja: "マイクロ秒", en: "Microseconds", factor: 1e-6, symbol: "µs" },
        nanoseconds: { ja: "ナノ秒", en: "Nanoseconds", factor: 1e-9, symbol: "ns" }
      }
    },
    microwave: {
      baseUnit: "seconds",
      definitions: {
        "500w": { ja: "500W", en: "500W", baseWatt: 500, symbol: "W" },
        "600w": { ja: "600W", en: "600W", baseWatt: 600, symbol: "W" },
        "700w": { ja: "700W", en: "700W", baseWatt: 700, symbol: "W" },
        "800w": { ja: "800W", en: "800W", baseWatt: 800, symbol: "W" },
        "900w": { ja: "900W", en: "900W", baseWatt: 900, symbol: "W" },
        "1000w": { ja: "1000W", en: "1000W", baseWatt: 1000, symbol: "W" },
        "1200w": { ja: "1200W", en: "1200W", baseWatt: 1200, symbol: "W" }
      },
      convert(value, from, to) {
        const fromWatt = this.definitions[from]?.baseWatt;
        const toWatt = this.definitions[to]?.baseWatt;
        return fromWatt && toWatt ? value * (fromWatt / toWatt) : NaN;
      }
    },
    frequency: {
      baseUnit: "hertz",
      definitions: {
        hertz: { ja: "ヘルツ", en: "Hertz", factor: 1, symbol: "Hz" },
        kilohertz: { ja: "キロヘルツ", en: "Kilohertz", factor: 1000, symbol: "kHz" },
        megahertz: { ja: "メガヘルツ", en: "Megahertz", factor: 1e6, symbol: "MHz" },
        gigahertz: { ja: "ギガヘルツ", en: "Gigahertz", factor: 1e9, symbol: "GHz" },
        terahertz: { ja: "テラヘルツ", en: "Terahertz", factor: 1e12, symbol: "THz" },
        revolutions_per_minute: { ja: "毎分回転数", en: "Revolutions per Minute", factor: 1 / 60, symbol: "rpm" },
        radians_per_second: { ja: "ラジアン毎秒", en: "Radians per Second", factor: 1 / (2 * Math.PI), symbol: "rad/s" }
      }
    },
    angle: {
      baseUnit: "degrees",
      definitions: {
        degrees: { ja: "度", en: "Degrees", factor: 1, symbol: "°" },
        radians: { ja: "ラジアン", en: "Radians", factor: 180 / Math.PI, symbol: "rad" },
        gradians: { ja: "グラード", en: "Gradians", factor: 0.9, symbol: "gon" },
        turns: { ja: "回転", en: "Turns", factor: 360, symbol: "turn" },
        mils: { ja: "ミル", en: "Mils", factor: 0.05625, symbol: "mil" }
      }
    },
    data: {
      baseUnit: "bytes",
      definitions: {
        bytes: { ja: "バイト", en: "Bytes", factor: 1, symbol: "B" },
        kilobytes: { ja: "キロバイト", en: "Kilobytes", factor: 1024, symbol: "KB" },
        megabytes: { ja: "メガバイト", en: "Megabytes", factor: 1024 ** 2, symbol: "MB" },
        gigabytes: { ja: "ギガバイト", en: "Gigabytes", factor: 1024 ** 3, symbol: "GB" },
        terabytes: { ja: "テラバイト", en: "Terabytes", factor: 1024 ** 4, symbol: "TB" },
        petabytes: { ja: "ペタバイト", en: "Petabytes", factor: 1024 ** 5, symbol: "PB" },
        bits: { ja: "ビット", en: "Bits", factor: 1 / 8, symbol: "bit" },
        kilobits: { ja: "キロビット", en: "Kilobits", factor: 1024 / 8, symbol: "Kbit" },
        megabits: { ja: "メガビット", en: "Megabits", factor: (1024 ** 2) / 8, symbol: "Mbit" },
        gigabits: { ja: "ギガビット", en: "Gigabits", factor: (1024 ** 3) / 8, symbol: "Gbit" }
      }
    },
    fuel_consumption: {
      baseUnit: "kilometers_per_liter",
      definitions: {
        kilometers_per_liter: { ja: "キロメートル毎リットル", en: "Kilometers per Liter", factor: 1, symbol: "km/L" },
        miles_per_gallon_us: { ja: "マイル毎ガロン（米）", en: "Miles per Gallon (US)", factor: 2.352145833, symbol: "mpg US" },
        miles_per_gallon_uk: { ja: "マイル毎ガロン（英）", en: "Miles per Gallon (UK)", factor: 2.824809363, symbol: "mpg UK" },
        liters_per_100km: { ja: "リットル毎100km", en: "Liters per 100 km", factor: 1, symbol: "L/100km", isInverse: true }
      },
      convert(value, from, to) {
        if (value === 0) return NaN;
        let kmPerLiter;
        if (from === "liters_per_100km") {
          kmPerLiter = 100 / value;
        } else if (from === "kilometers_per_liter") {
          kmPerLiter = value;
        } else {
          kmPerLiter = value / this.definitions[from].factor;
        }
        if (to === "liters_per_100km") return kmPerLiter === 0 ? NaN : 100 / kmPerLiter;
        if (to === "kilometers_per_liter") return kmPerLiter;
        return kmPerLiter * this.definitions[to].factor;
      }
    },
    density: {
      baseUnit: "kg_per_cubic_meter",
      definitions: {
        kg_per_cubic_meter: { ja: "キログラム毎立方メートル", en: "Kilograms per Cubic Meter", factor: 1, symbol: "kg/m³" },
        g_per_cubic_centimeter: { ja: "グラム毎立方センチメートル", en: "Grams per Cubic Centimeter", factor: 1000, symbol: "g/cm³" },
        g_per_liter: { ja: "グラム毎リットル", en: "Grams per Liter", factor: 1, symbol: "g/L" },
        lb_per_cubic_foot: { ja: "ポンド毎立方フィート", en: "Pounds per Cubic Foot", factor: 16.0185, symbol: "lb/ft³" },
        oz_per_cubic_inch: { ja: "オンス毎立方インチ", en: "Ounces per Cubic Inch", factor: 1729.994, symbol: "oz/in³" }
      }
    },
    force: {
      baseUnit: "newtons",
      definitions: {
        newtons: { ja: "ニュートン", en: "Newtons", factor: 1, symbol: "N" },
        kilonewtons: { ja: "キロニュートン", en: "Kilonewtons", factor: 1000, symbol: "kN" },
        dynes: { ja: "ダイン", en: "Dynes", factor: 1e-5, symbol: "dyn" },
        pounds_force: { ja: "重量ポンド", en: "Pounds Force", factor: 4.4482216, symbol: "lbf" },
        kilograms_force: { ja: "重量キログラム", en: "Kilograms Force", factor: 9.80665, symbol: "kgf" },
        tons_force: { ja: "重量トン", en: "Tons Force", factor: 9806.65, symbol: "tf" },
        ounces_force: { ja: "重量オンス", en: "Ounces Force", factor: 0.27801385, symbol: "ozf" }
      }
    },
    torque: {
      baseUnit: "newton_meters",
      definitions: {
        newton_meters: { ja: "ニュートンメートル", en: "Newton Meters", factor: 1, symbol: "N·m" },
        foot_pounds: { ja: "フィートポンド", en: "Foot Pounds", factor: 1.3558179, symbol: "ft·lb" },
        inch_pounds: { ja: "インチポンド", en: "Inch Pounds", factor: 0.1129848, symbol: "in·lb" },
        kilogram_meters: { ja: "キログラム重メートル", en: "Kilogram-force Meters", factor: 9.80665, symbol: "kgf·m" },
        dyne_centimeters: { ja: "ダインセンチメートル", en: "Dyne Centimeters", factor: 1e-7, symbol: "dyn·cm" }
      }
    },
    acceleration: {
      baseUnit: "meters_per_second_squared",
      definitions: {
        meters_per_second_squared: { ja: "メートル毎秒毎秒", en: "Meters per Second Squared", factor: 1, symbol: "m/s²" },
        gravity_standard: { ja: "標準重力加速度", en: "Standard Gravity", factor: 9.80665, symbol: "g" },
        feet_per_second_squared: { ja: "フィート毎秒毎秒", en: "Feet per Second Squared", factor: 0.3048, symbol: "ft/s²" },
        galileo: { ja: "ガル", en: "Gal", factor: 0.01, symbol: "Gal" },
        milligal: { ja: "ミリガル", en: "Milligal", factor: 1e-5, symbol: "mGal" }
      }
    },
    velocity: {
      baseUnit: "meters_per_second",
      definitions: {
        meters_per_second: { ja: "メートル毎秒", en: "Meters per Second", factor: 1, symbol: "m/s" },
        kilometers_per_hour: { ja: "キロメートル毎時", en: "Kilometers per Hour", factor: 0.277777778, symbol: "km/h" },
        miles_per_hour: { ja: "マイル毎時", en: "Miles per Hour", factor: 0.44704, symbol: "mph" },
        feet_per_second: { ja: "フィート毎秒", en: "Feet per Second", factor: 0.3048, symbol: "ft/s" },
        knots: { ja: "ノット", en: "Knots", factor: 0.514444444, symbol: "kn" },
        mach: { ja: "マッハ", en: "Mach", factor: 343, symbol: "M" },
        speed_of_light: { ja: "光速", en: "Speed of Light", factor: 299792458, symbol: "c" },
        mils_per_hour: { ja: "ミル毎時", en: "Mils per Hour", factor: 0.0254e-3, symbol: "mil/h" }
      }
    },
    luminance: {
      baseUnit: "candela_per_square_meter",
      definitions: {
        candela_per_square_meter: { ja: "カンデラ毎平方メートル", en: "Candelas per Square Meter", factor: 1, symbol: "cd/m²" },
        nit: { ja: "ニト", en: "Nit", factor: 1, symbol: "nt" },
        stilb: { ja: "スチルブ", en: "Stilb", factor: 10000, symbol: "sb" },
        lambert: { ja: "ランベルト", en: "Lambert", factor: 3183.09886, symbol: "L" },
        foot_lambert: { ja: "フートランベルト", en: "Foot-lambert", factor: 3.4262591, symbol: "fL" }
      }
    },
    illuminance: {
      baseUnit: "lux",
      definitions: {
        lux: { ja: "ルクス", en: "Lux", factor: 1, symbol: "lx" },
        foot_candles: { ja: "フートキャンドル", en: "Foot-candles", factor: 10.76391, symbol: "fc" },
        phot: { ja: "フォト", en: "Phot", factor: 10000, symbol: "ph" },
        nox: { ja: "ノックス", en: "Nox", factor: 0.001, symbol: "nx" }
      }
    },
    electric_current: {
      baseUnit: "amperes",
      definitions: {
        amperes: { ja: "アンペア", en: "Amperes", factor: 1, symbol: "A" },
        milliamperes: { ja: "ミリアンペア", en: "Milliamperes", factor: 0.001, symbol: "mA" },
        microamperes: { ja: "マイクロアンペア", en: "Microamperes", factor: 1e-6, symbol: "µA" },
        kiloamperes: { ja: "キロアンペア", en: "Kiloamperes", factor: 1000, symbol: "kA" },
        abamperes: { ja: "アブアンペア", en: "Abamperes", factor: 10, symbol: "abA" }
      }
    },
    voltage: {
      baseUnit: "volts",
      definitions: {
        volts: { ja: "ボルト", en: "Volts", factor: 1, symbol: "V" },
        millivolts: { ja: "ミリボルト", en: "Millivolts", factor: 0.001, symbol: "mV" },
        microvolts: { ja: "マイクロボルト", en: "Microvolts", factor: 1e-6, symbol: "µV" },
        kilovolts: { ja: "キロボルト", en: "Kilovolts", factor: 1000, symbol: "kV" },
        megavolts: { ja: "メガボルト", en: "Megavolts", factor: 1e6, symbol: "MV" }
      }
    },
    resistance: {
      baseUnit: "ohms",
      definitions: {
        ohms: { ja: "オーム", en: "Ohms", factor: 1, symbol: "Ω" },
        milliohms: { ja: "ミリオーム", en: "Milliohms", factor: 0.001, symbol: "mΩ" },
        microohms: { ja: "マイクロオーム", en: "Microohms", factor: 1e-6, symbol: "µΩ" },
        kiloohms: { ja: "キロオーム", en: "Kiloohms", factor: 1000, symbol: "kΩ" },
        megaohms: { ja: "メガオーム", en: "Megaohms", factor: 1e6, symbol: "MΩ" }
      }
    },
    capacitance: {
      baseUnit: "farads",
      definitions: {
        farads: { ja: "ファラド", en: "Farads", factor: 1, symbol: "F" },
        millifarads: { ja: "ミリファラド", en: "Millifarads", factor: 0.001, symbol: "mF" },
        microfarads: { ja: "マイクロファラド", en: "Microfarads", factor: 1e-6, symbol: "µF" },
        nanofarads: { ja: "ナノファラド", en: "Nanofarads", factor: 1e-9, symbol: "nF" },
        picofarads: { ja: "ピコファラド", en: "Picofarads", factor: 1e-12, symbol: "pF" }
      }
    },
    inductance: {
      baseUnit: "henries",
      definitions: {
        henries: { ja: "ヘンリー", en: "Henries", factor: 1, symbol: "H" },
        millihenries: { ja: "ミリヘンリー", en: "Millihenries", factor: 0.001, symbol: "mH" },
        microhenries: { ja: "マイクロヘンリー", en: "Microhenries", factor: 1e-6, symbol: "µH" },
        nanohenries: { ja: "ナノヘンリー", en: "Nanohenries", factor: 1e-9, symbol: "nH" }
      }
    },
    radioactivity: {
      baseUnit: "becquerels",
      definitions: {
        becquerels: { ja: "ベクレル", en: "Becquerels", factor: 1, symbol: "Bq" },
        curies: { ja: "キュリー", en: "Curies", factor: 3.7e10, symbol: "Ci" },
        rutherford: { ja: "ラザフォード", en: "Rutherford", factor: 1e6, symbol: "Rd" },
        disintegrations_per_minute: { ja: "毎分崩壊数", en: "Disintegrations per Minute", factor: 1 / 60, symbol: "dpm" },
        disintegrations_per_second: { ja: "毎秒崩壊数", en: "Disintegrations per Second", factor: 1, symbol: "dps" }
      }
    },
    radiation_dose: {
      baseUnit: "grays",
      definitions: {
        grays: { ja: "グレイ", en: "Grays", factor: 1, symbol: "Gy" },
        rads: { ja: "ラド", en: "Rads", factor: 0.01, symbol: "rad" },
        sieverts: { ja: "シーベルト", en: "Sieverts", factor: 1, symbol: "Sv" },
        rems: { ja: "レム", en: "Rems", factor: 0.01, symbol: "rem" },
        roentgens: { ja: "レントゲン", en: "Roentgens", factor: 0.00877, symbol: "R" }
      }
    }
  };
})();
