// Unit definitions used by the unit converter.
// Each factor converts the unit into the category base unit.
(function () {
  "use strict";

  function unit(ja, en, extra) {
    return Object.assign({ ja, en }, extra);
  }

  window.unitConverterData = {
    length: {
      baseUnit: "meters",
      definitions: {
        meters: unit("メートル", "Meters", { factor: 1, symbol: "m" }),
        kilometers: unit("キロメートル", "Kilometers", { factor: 1000, symbol: "km" }),
        centimeters: unit("センチメートル", "Centimeters", { factor: 0.01, symbol: "cm" }),
        millimeters: unit("ミリメートル", "Millimeters", { factor: 0.001, symbol: "mm" }),
        micrometers: unit("マイクロメートル", "Micrometers", { factor: 1e-6, symbol: "µm" }),
        nanometers: unit("ナノメートル", "Nanometers", { factor: 1e-9, symbol: "nm" }),
        miles: unit("マイル", "Miles", { factor: 1609.344, symbol: "mi" }),
        yards: unit("ヤード", "Yards", { factor: 0.9144, symbol: "yd" }),
        feet: unit("フィート", "Feet", { factor: 0.3048, symbol: "ft" }),
        inches: unit("インチ", "Inches", { factor: 0.0254, symbol: "in" }),
        nautical_miles: unit("海里", "Nautical Miles", { factor: 1852, symbol: "nmi" }),
        light_years: unit("光年", "Light Years", { factor: 9.4607e15, symbol: "ly" }),
        astronomical_units: unit("天文単位", "Astronomical Units", { factor: 1.495978707e11, symbol: "AU" }),
        parsecs: unit("パーセク", "Parsecs", { factor: 3.085677581e16, symbol: "pc" }),
        angstroms: unit("オングストローム", "Angstroms", { factor: 1e-10, symbol: "Å" }),
        shaku: unit("尺", "Shaku", { factor: 10 / 33, symbol: "尺" }),
        sun: unit("寸", "Sun", { factor: 1 / 33, symbol: "寸" }),
        ken: unit("間", "Ken", { factor: 60 / 33, symbol: "間" }),
        ri: unit("里", "Ri", { factor: 12960 / 3.3, symbol: "里" }),
        jo: unit("丈", "Jo", { factor: 100 / 33, symbol: "丈" }),
        cho: unit("町", "Cho", { factor: 3600 / 33, symbol: "町" })
      }
    },
    weight: {
      baseUnit: "grams",
      definitions: {
        grams: unit("グラム", "Grams", { factor: 1, symbol: "g" }),
        kilograms: unit("キログラム", "Kilograms", { factor: 1000, symbol: "kg" }),
        milligrams: unit("ミリグラム", "Milligrams", { factor: 0.001, symbol: "mg" }),
        micrograms: unit("マイクログラム", "Micrograms", { factor: 1e-6, symbol: "µg" }),
        nanograms: unit("ナノグラム", "Nanograms", { factor: 1e-9, symbol: "ng" }),
        tons: unit("トン", "Metric Tons", { factor: 1e6, symbol: "t" }),
        pounds: unit("ポンド", "Pounds", { factor: 453.59237, symbol: "lb" }),
        ounces: unit("オンス", "Ounces", { factor: 28.349523125, symbol: "oz" }),
        carats: unit("カラット", "Carats", { factor: 0.2, symbol: "ct" }),
        stones: unit("ストーン", "Stones", { factor: 6350.29318, symbol: "st" }),
        kan: unit("貫", "Kan", { factor: 3750, symbol: "貫" }),
        kin: unit("斤", "Kin", { factor: 600, symbol: "斤" }),
        ryo: unit("両", "Ryo", { factor: 37.5, symbol: "両" }),
        momme: unit("匁", "Momme", { factor: 3.75, symbol: "匁" }),
        fun: unit("分", "Fun", { factor: 0.375, symbol: "分" }),
        grain: unit("グレーン", "Grains", { factor: 0.06479891, symbol: "gr" }),
        dram: unit("ドラム", "Drams", { factor: 1.7718451953125, symbol: "dr" }),
        troy_ounces: unit("トロイオンス", "Troy Ounces", { factor: 31.1034768, symbol: "oz t" }),
        troy_pounds: unit("トロイポンド", "Troy Pounds", { factor: 373.2417216, symbol: "lb t" })
      }
    },
    temperature: {
      definitions: {
        celsius: unit("摂氏", "Celsius", { symbol: "°C" }),
        fahrenheit: unit("華氏", "Fahrenheit", { symbol: "°F" }),
        kelvin: unit("ケルビン", "Kelvin", { symbol: "K" }),
        rankine: unit("ランキン", "Rankine", { symbol: "°R" })
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
        square_meters: unit("平方メートル", "Square Meters", { factor: 1, symbol: "m²" }),
        square_kilometers: unit("平方キロメートル", "Square Kilometers", { factor: 1e6, symbol: "km²" }),
        square_centimeters: unit("平方センチメートル", "Square Centimeters", { factor: 0.0001, symbol: "cm²" }),
        square_millimeters: unit("平方ミリメートル", "Square Millimeters", { factor: 1e-6, symbol: "mm²" }),
        hectares: unit("ヘクタール", "Hectares", { factor: 10000, symbol: "ha" }),
        acres: unit("エーカー", "Acres", { factor: 4046.8564224, symbol: "ac" }),
        square_feet: unit("平方フィート", "Square Feet", { factor: 0.09290304, symbol: "ft²" }),
        square_inches: unit("平方インチ", "Square Inches", { factor: 0.00064516, symbol: "in²" }),
        square_yards: unit("平方ヤード", "Square Yards", { factor: 0.83612736, symbol: "yd²" }),
        square_miles: unit("平方マイル", "Square Miles", { factor: 2589988.110336, symbol: "mi²" }),
        tsubo: unit("坪", "Tsubo", { factor: 3.305785124, symbol: "坪" }),
        se: unit("畝", "Se", { factor: 99.17355372, symbol: "畝" }),
        tan: unit("反", "Tan", { factor: 991.7355372, symbol: "反" }),
        cho_area: unit("町歩", "Cho (area)", { factor: 9917.355372, symbol: "町歩" })
      }
    },
    volume: {
      baseUnit: "liters",
      definitions: {
        liters: unit("リットル", "Liters", { factor: 1, symbol: "L" }),
        milliliters: unit("ミリリットル", "Milliliters", { factor: 0.001, symbol: "mL" }),
        cubic_centimeters: unit("立方センチメートル", "Cubic Centimeters", { factor: 0.001, symbol: "cm³" }),
        cc: unit("シーシー", "CC", { factor: 0.001, symbol: "cc" }),
        microliters: unit("マイクロリットル", "Microliters", { factor: 1e-6, symbol: "µL" }),
        cubic_meters: unit("立方メートル", "Cubic Meters", { factor: 1000, symbol: "m³" }),
        cubic_millimeters: unit("立方ミリメートル", "Cubic Millimeters", { factor: 1e-6, symbol: "mm³" }),
        cubic_inches: unit("立方インチ", "Cubic Inches", { factor: 0.016387064, symbol: "in³" }),
        cubic_feet: unit("立方フィート", "Cubic Feet", { factor: 28.316846592, symbol: "ft³" }),
        cubic_yards: unit("立方ヤード", "Cubic Yards", { factor: 764.554857984, symbol: "yd³" }),
        gallons_us: unit("ガロン（米）", "Gallons (US)", { factor: 3.785411784, symbol: "gal US" }),
        gallons_uk: unit("ガロン（英）", "Gallons (UK)", { factor: 4.54609, symbol: "gal UK" }),
        quarts_us: unit("クォート（米）", "Quarts (US)", { factor: 0.946352946, symbol: "qt" }),
        pints_us: unit("パイント（米）", "Pints (US)", { factor: 0.473176473, symbol: "pt" }),
        cups_us: unit("カップ（米）", "Cups (US)", { factor: 0.2365882365, symbol: "cup US" }),
        cups_jp: unit("カップ（日本）", "Cups (Japan)", { factor: 0.2, symbol: "cup JP" }),
        fluid_ounces_us: unit("液量オンス（米）", "Fluid Ounces (US)", { factor: 0.0295735296875, symbol: "fl oz" }),
        tablespoons: unit("大さじ", "Tablespoons", { factor: 0.01478676478125, symbol: "tbsp" }),
        teaspoons: unit("小さじ", "Teaspoons", { factor: 0.00492892159375, symbol: "tsp" }),
        gou: unit("合", "Gou", { factor: 0.18039, symbol: "合" }),
        sho: unit("升", "Sho", { factor: 1.8039, symbol: "升" }),
        to: unit("斗", "To", { factor: 18.039, symbol: "斗" }),
        koku: unit("石", "Koku", { factor: 180.39, symbol: "石" }),
        barrels_oil: unit("バレル（原油）", "Barrels (Oil)", { factor: 158.987294928, symbol: "bbl" }),
        bushels_us: unit("ブッシェル（米）", "Bushels (US)", { factor: 35.2390704, symbol: "bu" }),
        drops: unit("滴", "Drops", { factor: 5e-5, symbol: "drop" }),
        drams: unit("ドラム", "Drams", { factor: 0.0036966911953, symbol: "dr" }),
        shots: unit("ショット", "Shots", { factor: 0.0443603, symbol: "shot" })
      }
    },
    speed: {
      baseUnit: "meters_per_second",
      definitions: {
        meters_per_second: unit("メートル毎秒", "Meters per Second", { factor: 1, symbol: "m/s" }),
        kilometers_per_hour: unit("キロメートル毎時", "Kilometers per Hour", { factor: 0.277777778, symbol: "km/h" }),
        miles_per_hour: unit("マイル毎時", "Miles per Hour", { factor: 0.44704, symbol: "mph" }),
        feet_per_second: unit("フィート毎秒", "Feet per Second", { factor: 0.3048, symbol: "ft/s" }),
        knots: unit("ノット", "Knots", { factor: 0.514444444, symbol: "kn" }),
        mach: unit("マッハ", "Mach", { factor: 343, symbol: "M" })
      }
    },
    pressure: {
      baseUnit: "pascals",
      definitions: {
        pascals: unit("パスカル", "Pascals", { factor: 1, symbol: "Pa" }),
        kilopascals: unit("キロパスカル", "Kilopascals", { factor: 1000, symbol: "kPa" }),
        megapascals: unit("メガパスカル", "Megapascals", { factor: 1e6, symbol: "MPa" }),
        bars: unit("バール", "Bars", { factor: 100000, symbol: "bar" }),
        atmospheres: unit("気圧", "Atmospheres", { factor: 101325, symbol: "atm" }),
        mmhg: unit("水銀柱ミリメートル", "Millimeters of Mercury", { factor: 133.322387415, symbol: "mmHg" }),
        psi: unit("psi", "Pounds per Square Inch", { factor: 6894.75729, symbol: "psi" }),
        torr: unit("トル", "Torr", { factor: 133.322368421, symbol: "Torr" })
      }
    },
    energy: {
      baseUnit: "joules",
      definitions: {
        joules: unit("ジュール", "Joules", { factor: 1, symbol: "J" }),
        kilojoules: unit("キロジュール", "Kilojoules", { factor: 1000, symbol: "kJ" }),
        calories: unit("カロリー", "Calories", { factor: 4.184, symbol: "cal" }),
        kilocalories: unit("キロカロリー", "Kilocalories", { factor: 4184, symbol: "kcal" }),
        watt_hours: unit("ワット時", "Watt Hours", { factor: 3600, symbol: "Wh" }),
        kilowatt_hours: unit("キロワット時", "Kilowatt Hours", { factor: 3.6e6, symbol: "kWh" }),
        btu: unit("英国熱量単位", "British Thermal Units", { factor: 1055.05585262, symbol: "BTU" }),
        electron_volts: unit("電子ボルト", "Electron Volts", { factor: 1.602176634e-19, symbol: "eV" })
      }
    },
    power: {
      baseUnit: "watts",
      definitions: {
        watts: unit("ワット", "Watts", { factor: 1, symbol: "W" }),
        kilowatts: unit("キロワット", "Kilowatts", { factor: 1000, symbol: "kW" }),
        megawatts: unit("メガワット", "Megawatts", { factor: 1e6, symbol: "MW" }),
        horsepower: unit("馬力", "Horsepower", { factor: 745.699871582, symbol: "hp" }),
        metric_horsepower: unit("仏馬力", "Metric Horsepower", { factor: 735.49875, symbol: "PS" }),
        btu_per_hour: unit("BTU毎時", "BTU per Hour", { factor: 0.293071070172, symbol: "BTU/h" })
      }
    },
    time: {
      baseUnit: "seconds",
      definitions: {
        seconds: unit("秒", "Seconds", { factor: 1, symbol: "s" }),
        minutes: unit("分", "Minutes", { factor: 60, symbol: "min" }),
        hours: unit("時間", "Hours", { factor: 3600, symbol: "h" }),
        days: unit("日", "Days", { factor: 86400, symbol: "d" }),
        weeks: unit("週", "Weeks", { factor: 604800, symbol: "wk" }),
        months: unit("か月（平均）", "Months (average)", { factor: 2629746, symbol: "mo" }),
        years: unit("年（平均）", "Years (average)", { factor: 31556952, symbol: "yr" }),
        milliseconds: unit("ミリ秒", "Milliseconds", { factor: 0.001, symbol: "ms" }),
        microseconds: unit("マイクロ秒", "Microseconds", { factor: 1e-6, symbol: "µs" }),
        nanoseconds: unit("ナノ秒", "Nanoseconds", { factor: 1e-9, symbol: "ns" })
      }
    },
    microwave: {
      baseUnit: "seconds",
      definitions: {
        "500w": unit("500W", "500W", { baseWatt: 500, symbol: "W" }),
        "600w": unit("600W", "600W", { baseWatt: 600, symbol: "W" }),
        "700w": unit("700W", "700W", { baseWatt: 700, symbol: "W" }),
        "800w": unit("800W", "800W", { baseWatt: 800, symbol: "W" }),
        "900w": unit("900W", "900W", { baseWatt: 900, symbol: "W" }),
        "1000w": unit("1000W", "1000W", { baseWatt: 1000, symbol: "W" }),
        "1200w": unit("1200W", "1200W", { baseWatt: 1200, symbol: "W" })
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
        hertz: unit("ヘルツ", "Hertz", { factor: 1, symbol: "Hz" }),
        kilohertz: unit("キロヘルツ", "Kilohertz", { factor: 1000, symbol: "kHz" }),
        megahertz: unit("メガヘルツ", "Megahertz", { factor: 1e6, symbol: "MHz" }),
        gigahertz: unit("ギガヘルツ", "Gigahertz", { factor: 1e9, symbol: "GHz" }),
        terahertz: unit("テラヘルツ", "Terahertz", { factor: 1e12, symbol: "THz" }),
        revolutions_per_minute: unit("毎分回転数", "Revolutions per Minute", { factor: 1 / 60, symbol: "rpm" }),
        radians_per_second: unit("ラジアン毎秒", "Radians per Second", { factor: 1 / (2 * Math.PI), symbol: "rad/s" })
      }
    },
    angle: {
      baseUnit: "degrees",
      definitions: {
        degrees: unit("度", "Degrees", { factor: 1, symbol: "°" }),
        radians: unit("ラジアン", "Radians", { factor: 180 / Math.PI, symbol: "rad" }),
        gradians: unit("グラード", "Gradians", { factor: 0.9, symbol: "gon" }),
        turns: unit("回転", "Turns", { factor: 360, symbol: "turn" }),
        mils: unit("ミル", "Mils", { factor: 0.05625, symbol: "mil" })
      }
    },
    data: {
      baseUnit: "bytes",
      definitions: {
        bytes: unit("バイト", "Bytes", { factor: 1, symbol: "B" }),
        kilobytes: unit("キロバイト", "Kilobytes", { factor: 1024, symbol: "KB" }),
        megabytes: unit("メガバイト", "Megabytes", { factor: 1024 ** 2, symbol: "MB" }),
        gigabytes: unit("ギガバイト", "Gigabytes", { factor: 1024 ** 3, symbol: "GB" }),
        terabytes: unit("テラバイト", "Terabytes", { factor: 1024 ** 4, symbol: "TB" }),
        petabytes: unit("ペタバイト", "Petabytes", { factor: 1024 ** 5, symbol: "PB" }),
        bits: unit("ビット", "Bits", { factor: 1 / 8, symbol: "bit" }),
        kilobits: unit("キロビット", "Kilobits", { factor: 1024 / 8, symbol: "Kbit" }),
        megabits: unit("メガビット", "Megabits", { factor: (1024 ** 2) / 8, symbol: "Mbit" }),
        gigabits: unit("ギガビット", "Gigabits", { factor: (1024 ** 3) / 8, symbol: "Gbit" })
      }
    },
    fuel_consumption: {
      baseUnit: "kilometers_per_liter",
      definitions: {
        kilometers_per_liter: unit("キロメートル毎リットル", "Kilometers per Liter", { factor: 1, symbol: "km/L" }),
        miles_per_gallon_us: unit("マイル毎ガロン（米）", "Miles per Gallon (US)", { factor: 2.352145833, symbol: "mpg US" }),
        miles_per_gallon_uk: unit("マイル毎ガロン（英）", "Miles per Gallon (UK)", { factor: 2.824809363, symbol: "mpg UK" }),
        liters_per_100km: unit("100km あたりリットル", "Liters per 100 km", { factor: 1, symbol: "L/100km", isInverse: true })
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
        kg_per_cubic_meter: unit("キログラム毎立方メートル", "Kilograms per Cubic Meter", { factor: 1, symbol: "kg/m³" }),
        g_per_cubic_centimeter: unit("グラム毎立方センチメートル", "Grams per Cubic Centimeter", { factor: 1000, symbol: "g/cm³" }),
        g_per_liter: unit("グラム毎リットル", "Grams per Liter", { factor: 1, symbol: "g/L" }),
        lb_per_cubic_foot: unit("ポンド毎立方フィート", "Pounds per Cubic Foot", { factor: 16.0185, symbol: "lb/ft³" }),
        oz_per_cubic_inch: unit("オンス毎立方インチ", "Ounces per Cubic Inch", { factor: 1729.994, symbol: "oz/in³" })
      }
    },
    force: {
      baseUnit: "newtons",
      definitions: {
        newtons: unit("ニュートン", "Newtons", { factor: 1, symbol: "N" }),
        kilonewtons: unit("キロニュートン", "Kilonewtons", { factor: 1000, symbol: "kN" }),
        dynes: unit("ダイン", "Dynes", { factor: 1e-5, symbol: "dyn" }),
        pounds_force: unit("重量ポンド", "Pounds Force", { factor: 4.4482216, symbol: "lbf" }),
        kilograms_force: unit("重量キログラム", "Kilograms Force", { factor: 9.80665, symbol: "kgf" }),
        tons_force: unit("重量トン", "Tons Force", { factor: 9806.65, symbol: "tf" }),
        ounces_force: unit("重量オンス", "Ounces Force", { factor: 0.27801385, symbol: "ozf" })
      }
    },
    torque: {
      baseUnit: "newton_meters",
      definitions: {
        newton_meters: unit("ニュートンメートル", "Newton Meters", { factor: 1, symbol: "N·m" }),
        foot_pounds: unit("フィートポンド", "Foot Pounds", { factor: 1.3558179, symbol: "ft·lb" }),
        inch_pounds: unit("インチポンド", "Inch Pounds", { factor: 0.1129848, symbol: "in·lb" }),
        kilogram_meters: unit("kgfメートル", "Kilogram-force Meters", { factor: 9.80665, symbol: "kgf·m" }),
        dyne_centimeters: unit("ダインセンチメートル", "Dyne Centimeters", { factor: 1e-7, symbol: "dyn·cm" })
      }
    },
    acceleration: {
      baseUnit: "meters_per_second_squared",
      definitions: {
        meters_per_second_squared: unit("メートル毎秒毎秒", "Meters per Second Squared", { factor: 1, symbol: "m/s²" }),
        gravity_standard: unit("標準重力", "Standard Gravity", { factor: 9.80665, symbol: "g" }),
        feet_per_second_squared: unit("フィート毎秒毎秒", "Feet per Second Squared", { factor: 0.3048, symbol: "ft/s²" }),
        galileo: unit("ガル", "Gal", { factor: 0.01, symbol: "Gal" }),
        milligal: unit("ミリガル", "Milligal", { factor: 1e-5, symbol: "mGal" })
      }
    },
    velocity: {
      baseUnit: "meters_per_second",
      definitions: {
        meters_per_second: unit("メートル毎秒", "Meters per Second", { factor: 1, symbol: "m/s" }),
        kilometers_per_hour: unit("キロメートル毎時", "Kilometers per Hour", { factor: 0.277777778, symbol: "km/h" }),
        miles_per_hour: unit("マイル毎時", "Miles per Hour", { factor: 0.44704, symbol: "mph" }),
        feet_per_second: unit("フィート毎秒", "Feet per Second", { factor: 0.3048, symbol: "ft/s" }),
        knots: unit("ノット", "Knots", { factor: 0.514444444, symbol: "kn" }),
        mach: unit("マッハ", "Mach", { factor: 343, symbol: "M" }),
        speed_of_light: unit("光速", "Speed of Light", { factor: 299792458, symbol: "c" }),
        mils_per_hour: unit("ミル毎時", "Mils per Hour", { factor: 0.0254e-3, symbol: "mil/h" })
      }
    },
    luminance: {
      baseUnit: "candela_per_square_meter",
      definitions: {
        candela_per_square_meter: unit("カンデラ毎平方メートル", "Candelas per Square Meter", { factor: 1, symbol: "cd/m²" }),
        nit: unit("ニト", "Nit", { factor: 1, symbol: "nt" }),
        stilb: unit("スチルブ", "Stilb", { factor: 10000, symbol: "sb" }),
        lambert: unit("ランバート", "Lambert", { factor: 3183.09886, symbol: "L" }),
        foot_lambert: unit("フートランバート", "Foot-lambert", { factor: 3.4262591, symbol: "fL" })
      }
    },
    illuminance: {
      baseUnit: "lux",
      definitions: {
        lux: unit("ルクス", "Lux", { factor: 1, symbol: "lx" }),
        foot_candles: unit("フートキャンドル", "Foot-candles", { factor: 10.76391, symbol: "fc" }),
        phot: unit("フォト", "Phot", { factor: 10000, symbol: "ph" }),
        nox: unit("ノクス", "Nox", { factor: 0.001, symbol: "nx" })
      }
    },
    electric_current: {
      baseUnit: "amperes",
      definitions: {
        amperes: unit("アンペア", "Amperes", { factor: 1, symbol: "A" }),
        milliamperes: unit("ミリアンペア", "Milliamperes", { factor: 0.001, symbol: "mA" }),
        microamperes: unit("マイクロアンペア", "Microamperes", { factor: 1e-6, symbol: "µA" }),
        kiloamperes: unit("キロアンペア", "Kiloamperes", { factor: 1000, symbol: "kA" }),
        abamperes: unit("アバアンペア", "Abamperes", { factor: 10, symbol: "abA" })
      }
    },
    voltage: {
      baseUnit: "volts",
      definitions: {
        volts: unit("ボルト", "Volts", { factor: 1, symbol: "V" }),
        millivolts: unit("ミリボルト", "Millivolts", { factor: 0.001, symbol: "mV" }),
        microvolts: unit("マイクロボルト", "Microvolts", { factor: 1e-6, symbol: "µV" }),
        kilovolts: unit("キロボルト", "Kilovolts", { factor: 1000, symbol: "kV" }),
        megavolts: unit("メガボルト", "Megavolts", { factor: 1e6, symbol: "MV" })
      }
    },
    resistance: {
      baseUnit: "ohms",
      definitions: {
        ohms: unit("オーム", "Ohms", { factor: 1, symbol: "Ω" }),
        milliohms: unit("ミリオーム", "Milliohms", { factor: 0.001, symbol: "mΩ" }),
        microohms: unit("マイクロオーム", "Microohms", { factor: 1e-6, symbol: "µΩ" }),
        kiloohms: unit("キロオーム", "Kiloohms", { factor: 1000, symbol: "kΩ" }),
        megaohms: unit("メガオーム", "Megaohms", { factor: 1e6, symbol: "MΩ" })
      }
    },
    capacitance: {
      baseUnit: "farads",
      definitions: {
        farads: unit("ファラド", "Farads", { factor: 1, symbol: "F" }),
        millifarads: unit("ミリファラド", "Millifarads", { factor: 0.001, symbol: "mF" }),
        microfarads: unit("マイクロファラド", "Microfarads", { factor: 1e-6, symbol: "µF" }),
        nanofarads: unit("ナノファラド", "Nanofarads", { factor: 1e-9, symbol: "nF" }),
        picofarads: unit("ピコファラド", "Picofarads", { factor: 1e-12, symbol: "pF" })
      }
    },
    inductance: {
      baseUnit: "henries",
      definitions: {
        henries: unit("ヘンリー", "Henries", { factor: 1, symbol: "H" }),
        millihenries: unit("ミリヘンリー", "Millihenries", { factor: 0.001, symbol: "mH" }),
        microhenries: unit("マイクロヘンリー", "Microhenries", { factor: 1e-6, symbol: "µH" }),
        nanohenries: unit("ナノヘンリー", "Nanohenries", { factor: 1e-9, symbol: "nH" })
      }
    },
    radioactivity: {
      baseUnit: "becquerels",
      definitions: {
        becquerels: unit("ベクレル", "Becquerels", { factor: 1, symbol: "Bq" }),
        curies: unit("キュリー", "Curies", { factor: 3.7e10, symbol: "Ci" }),
        rutherford: unit("ラザフォード", "Rutherford", { factor: 1e6, symbol: "Rd" }),
        disintegrations_per_minute: unit("毎分崩壊数", "Disintegrations per Minute", { factor: 1 / 60, symbol: "dpm" }),
        disintegrations_per_second: unit("毎秒崩壊数", "Disintegrations per Second", { factor: 1, symbol: "dps" })
      }
    },
    radiation_dose: {
      baseUnit: "grays",
      definitions: {
        grays: unit("グレイ", "Grays", { factor: 1, symbol: "Gy" }),
        rads: unit("ラド", "Rads", { factor: 0.01, symbol: "rad" }),
        sieverts: unit("シーベルト", "Sieverts", { factor: 1, symbol: "Sv" }),
        rems: unit("レム", "Rems", { factor: 0.01, symbol: "rem" }),
        roentgens: unit("レントゲン", "Roentgens", { factor: 0.00877, symbol: "R" })
      }
    }
  };
})();
