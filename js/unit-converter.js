// Unit converter UI controller. Extracted from the static page to keep markup lean.
(() => {
  "use strict";

  const SIMPLE_KEYS = {
    length: "category.length",
    weight: "category.weight",
    temperature: "category.temperature",
    area: "category.area",
    volume: "category.volume"
  };

  const CATEGORY_ORDER = [
    "length", "weight", "temperature", "area", "volume", "microwave",
    "data", "time", "speed", "pressure", "energy", "power",
    "fuel_consumption", "angle", "frequency", "density", "force", "torque",
    "acceleration", "velocity", "electric_current", "voltage", "resistance",
    "capacitance", "inductance", "luminance", "illuminance", "radioactivity", "radiation_dose"
  ];

  const DEFAULT_PAIRS = {
    length: ["meters", "feet"],
    weight: ["kilograms", "pounds"],
    temperature: ["celsius", "fahrenheit"],
    area: ["square_meters", "tsubo"],
    volume: ["cups_jp", "milliliters"],
    microwave: ["600w", "500w"],
    data: ["gigabytes", "megabytes"],
    fuel_consumption: ["kilometers_per_liter", "miles_per_gallon_us"],
    time: ["minutes", "seconds"],
    pressure: ["pascals", "atmospheres"],
    energy: ["kilocalories", "joules"],
    power: ["kilowatts", "horsepower"]
  };

  const CATEGORY_SYMBOLS = {
    length: "m / ft",
    weight: "kg / lb",
    temperature: "°C / °F",
    area: "m² / 坪",
    volume: "L / cup",
    microwave: "600W → 500W",
    data: "GB / MB",
    time: "min / s",
    speed: "km/h / mph",
    pressure: "Pa / psi",
    energy: "kcal / J",
    power: "W / hp",
    fuel_consumption: "km/L / mpg",
    angle: "° / rad",
    frequency: "Hz / rpm",
    density: "kg/m³",
    force: "N / kgf",
    torque: "N·m",
    acceleration: "m/s²",
    velocity: "m/s / c",
    electric_current: "A / mA",
    voltage: "V / kV",
    resistance: "Ω / kΩ",
    capacitance: "F / µF",
    inductance: "H / mH",
    luminance: "cd/m²",
    illuminance: "lux",
    radioactivity: "Bq / Ci",
    radiation_dose: "Gy / Sv"
  };

  const EXAMPLES = [
    { ja: "1mをフィートへ", en: "1 m to feet", category: "length", from: "meters", to: "feet", value: "1" },
    { ja: "100平米を坪へ", en: "100 m² to tsubo", category: "area", from: "square_meters", to: "tsubo", value: "100" },
    { ja: "10kgをポンドへ", en: "10 kg to pounds", category: "weight", from: "kilograms", to: "pounds", value: "10" },
    { ja: "180°Cを華氏へ", en: "180°C to Fahrenheit", category: "temperature", from: "celsius", to: "fahrenheit", value: "180" },
    { ja: "600W 3分を500Wへ", en: "600W 3 min to 500W", category: "microwave", from: "600w", to: "500w", value: "180" },
    { ja: "日本の1カップをmLへ", en: "1 Japanese cup to mL", category: "volume", from: "cups_jp", to: "milliliters", value: "1" },
    { ja: "1GBをMBへ", en: "1 GB to MB", category: "data", from: "gigabytes", to: "megabytes", value: "1" },
    { ja: "1気圧をkPaへ", en: "1 atm to kPa", category: "pressure", from: "atmospheres", to: "kilopascals", value: "1" },
    { ja: "15km/Lをmpgへ", en: "15 km/L to mpg", category: "fuel_consumption", from: "kilometers_per_liter", to: "miles_per_gallon_us", value: "15" }
  ];

  const RELATED_TOOLS = [
    { href: "/tools/text-converter.html", ja: "テキスト変換", en: "Text Converter" },
    { href: "/tools/json-csv-yaml-excel.html", ja: "JSON/CSV/YAML/Excel変換", en: "JSON/CSV/YAML/Excel Converter" },
    { href: "/tools/date-calculator.html", ja: "日付計算", en: "Date Calculator" },
    { href: "/tools/qr-code-generator.html", ja: "QRコード生成", en: "QR Code Generator" }
  ];

  const state = {
    category: "length",
    from: "meters",
    to: "feet",
    value: "1",
    precision: "auto"
  };

  const els = {};
  let syncingMicrowave = false;

  function getLang() {
    if (typeof window.getLanguage === "function") return window.getLanguage();
    try {
      return localStorage.getItem("selectedLanguage") || localStorage.getItem("negi-lab-language") || "ja";
    } catch (_) {
      return "ja";
    }
  }

  function t(key, fallback = key) {
    if (typeof window.t === "function") return window.t(key, fallback);
    const dict = window.unitConverterTranslations?.[getLang()] || {};
    return dict[key] || fallback;
  }

  function categoryKey(category) {
    return SIMPLE_KEYS[category] || `unitConverter.category.${category}`;
  }

  function categoryLabel(category) {
    return t(categoryKey(category), category);
  }

  function categoryDescription(category) {
    return t(`unitConverter.desc.${category}`, t("unitConverter.desc.default", "日常から専門分野まで使える単位換算"));
  }

  function unitDef(category, unit) {
    return window.unitConverterData?.[category]?.definitions?.[unit];
  }

  function unitName(category, unit) {
    const def = unitDef(category, unit);
    if (!def) return unit;
    const lang = getLang();
    return def[lang] || def.ja || def.en || unit;
  }

  function unitLabel(category, unit) {
    const def = unitDef(category, unit);
    const name = unitName(category, unit);
    const symbol = def?.symbol || "";
    if (!symbol || name.includes(symbol)) return name;
    return `${name} (${symbol})`;
  }

  function categorySearchText(category) {
    const dict = window.unitConverterTranslations || {};
    const labelKey = categoryKey(category);
    const descKey = `unitConverter.desc.${category}`;
    const definitions = Object.values(window.unitConverterData?.[category]?.definitions || {});
    const unitText = definitions
      .flatMap((def) => [def.ja, def.en, def.symbol])
      .filter(Boolean)
      .join(" ");
    return [
      category,
      categoryLabel(category),
      categoryDescription(category),
      dict.ja?.[labelKey],
      dict.ja?.[descKey],
      dict.en?.[labelKey],
      dict.en?.[descKey],
      unitText
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function resultSymbol(category, unit) {
    if (category === "microwave") return "s";
    return unitDef(category, unit)?.symbol || "";
  }

  function normalizeNumberString(value) {
    return String(value ?? "")
      .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xFEE0))
      .replace(/[．]/g, ".")
      .replace(/[，]/g, ",")
      .replace(/[＋]/g, "+")
      .replace(/[－ー]/g, "-");
  }

  function parseValue(value) {
    const cleaned = normalizeNumberString(value).replace(/,/g, "").trim();
    if (cleaned === "") return NaN;
    return Number(cleaned);
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return "";
    const precision = state.precision;
    if (precision !== "auto") {
      const digits = Number(precision);
      return value.toFixed(digits).replace(/\.?0+$/, "");
    }
    if (value === 0) return "0";
    const abs = Math.abs(value);
    if (abs >= 1e9 || abs < 1e-6) return value.toExponential(8).replace(/\.?0+e/, "e");
    return new Intl.NumberFormat(getLang() === "en" ? "en-US" : "ja-JP", {
      maximumSignificantDigits: 12
    }).format(value);
  }

  function formatDuration(totalSeconds) {
    if (!Number.isFinite(totalSeconds)) return "";
    const rounded = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    if (getLang() === "en") return `${minutes} min ${seconds} sec`;
    return `${minutes}分${seconds}秒`;
  }

  function conversionResult(toUnit = state.to) {
    return window.unitConverterCore.convert(state.category, parseValue(state.value), state.from, toUnit);
  }

  function validateState() {
    const data = window.unitConverterData?.[state.category];
    if (!data) state.category = "length";
    const units = Object.keys(window.unitConverterData[state.category].definitions);
    if (!units.includes(state.from) || !units.includes(state.to)) {
      const pair = DEFAULT_PAIRS[state.category] || [units[0], units[1] || units[0]];
      state.from = pair[0];
      state.to = pair[1];
    }
  }

  function renderCategories() {
    const query = els.categorySearch.value.trim().toLowerCase();
    els.categoryGrid.innerHTML = "";
    let matchCount = 0;
    CATEGORY_ORDER.filter((category) => window.unitConverterData?.[category]).forEach((category) => {
      const label = categoryLabel(category);
      const description = categoryDescription(category);
      const searchable = categorySearchText(category);
      if (query && !searchable.includes(query)) return;
      matchCount += 1;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button rounded-lg bg-white p-3 text-left";
      button.setAttribute("aria-pressed", category === state.category ? "true" : "false");
      button.dataset.category = category;

      const labelEl = document.createElement("span");
      labelEl.className = "block text-sm font-bold text-ink";
      labelEl.textContent = label;
      const descriptionEl = document.createElement("span");
      descriptionEl.className = "mt-1 block min-h-[2.5rem] text-xs leading-5 text-slate-600";
      descriptionEl.textContent = description;
      const symbolEl = document.createElement("span");
      symbolEl.className = "mt-2 inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500";
      symbolEl.textContent = CATEGORY_SYMBOLS[category] || unitCountLabel(category);
      button.append(labelEl, descriptionEl, symbolEl);

      button.addEventListener("click", () => selectCategory(category, true));
      els.categoryGrid.appendChild(button);
    });
    if (matchCount === 0) {
      const empty = document.createElement("p");
      empty.className = "col-span-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500";
      empty.textContent = t("unitConverter.categoryNoResults", "該当するカテゴリがありません");
      els.categoryGrid.appendChild(empty);
    }
  }

  function unitCountLabel(category) {
    const count = Object.keys(window.unitConverterData?.[category]?.definitions || {}).length;
    return getLang() === "en" ? `${count} units` : `${count}単位`;
  }

  function selectCategory(category, resetPair) {
    state.category = category;
    if (resetPair) {
      const units = Object.keys(window.unitConverterData[category].definitions);
      const pair = DEFAULT_PAIRS[category] || [units[0], units[1] || units[0]];
      state.from = pair[0];
      state.to = pair[1];
      if (category === "microwave" && (!state.value || state.value === "1")) state.value = "180";
    }
    renderAll();
  }

  function populateSelects() {
    const units = Object.keys(window.unitConverterData[state.category].definitions);
    els.fromUnit.innerHTML = "";
    els.toUnit.innerHTML = "";
    units.forEach((unit) => {
      els.fromUnit.appendChild(new Option(unitLabel(state.category, unit), unit));
      els.toUnit.appendChild(new Option(unitLabel(state.category, unit), unit));
    });
    els.fromUnit.value = state.from;
    els.toUnit.value = state.to;
  }

  function renderExamples() {
    els.exampleList.innerHTML = "";
    EXAMPLES.forEach((example) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent transition";
      button.textContent = example[getLang()] || example.ja;
      button.addEventListener("click", () => {
        state.category = example.category;
        state.from = example.from;
        state.to = example.to;
        state.value = example.value;
        renderAll();
        els.inputValue.focus();
      });
      els.exampleList.appendChild(button);
    });
  }

  function renderRelatedTools() {
    els.relatedTools.innerHTML = "";
    RELATED_TOOLS.forEach((tool) => {
      const link = document.createElement("a");
      link.href = tool.href;
      link.className = "rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent transition";
      link.textContent = tool[getLang()] || tool.ja;
      els.relatedTools.appendChild(link);
    });
  }

  function renderMicrowaveFields() {
    const isMicrowave = state.category === "microwave";
    els.microwaveFields.classList.toggle("hidden", !isMicrowave);
    if (!isMicrowave || syncingMicrowave) return;
    const seconds = Math.max(0, Math.round(parseValue(state.value) || 0));
    syncingMicrowave = true;
    els.microwaveMinutes.value = String(Math.floor(seconds / 60));
    els.microwaveSeconds.value = String(seconds % 60);
    syncingMicrowave = false;
  }

  function setResultPlaceholder() {
    els.resultValue.textContent = t("unitConverter.resultPlaceholder", "結果がここに表示されます");
    els.resultDetail.textContent = "";
  }

  function renderResult() {
    const value = parseValue(state.value);
    els.errorMessage.classList.add("hidden");
    els.errorMessage.textContent = "";

    if (!Number.isFinite(value)) {
      setResultPlaceholder();
      return;
    }
    if (Math.abs(value) > 1e15) {
      setResultPlaceholder();
      els.errorMessage.textContent = t("unitConverter.errorTooLarge", "値が大きすぎます。1e15以下の値で試してください。");
      els.errorMessage.classList.remove("hidden");
      return;
    }

    const result = conversionResult();
    if (!Number.isFinite(result)) {
      setResultPlaceholder();
      els.errorMessage.textContent = t("unitConverter.errorUnavailable", "この組み合わせでは換算できません。別の値または単位を選んでください。");
      els.errorMessage.classList.remove("hidden");
      return;
    }
    const symbol = resultSymbol(state.category, state.to);
    const resultText = `${formatNumber(result)}${symbol ? ` ${symbol}` : ""}`;
    els.resultValue.textContent = resultText;
    const from = unitLabel(state.category, state.from);
    const to = unitLabel(state.category, state.to);
    if (state.category === "microwave") {
      els.resultDetail.textContent = `${formatNumber(value)} s (${formatDuration(value)}) ${from} → ${to} / ${formatDuration(result)}`;
    } else {
      els.resultDetail.textContent = `${formatNumber(value)} ${from} → ${to}`;
    }
  }

  function renderAllResults() {
    const value = parseValue(state.value);
    const canConvert = Number.isFinite(value) && Math.abs(value) <= 1e15;
    const units = Object.keys(window.unitConverterData[state.category].definitions);
    els.allResultsBody.innerHTML = "";
    units.forEach((unit) => {
      const converted = canConvert ? conversionResult(unit) : NaN;
      const def = unitDef(state.category, unit);
      const row = document.createElement("tr");
      row.className = unit === state.to ? "bg-green-50 cursor-pointer" : "cursor-pointer hover:bg-slate-50";

      const nameCell = document.createElement("td");
      nameCell.className = "px-4 py-3 font-medium text-ink";
      nameCell.textContent = unitName(state.category, unit);
      const valueCell = document.createElement("td");
      valueCell.className = "px-4 py-3 tabular-nums";
      valueCell.textContent = Number.isFinite(converted) ? formatNumber(converted) : "-";
      const symbolCell = document.createElement("td");
      symbolCell.className = "px-4 py-3 text-slate-500";
      symbolCell.textContent = state.category === "microwave" ? "s" : (def?.symbol || "");
      row.append(nameCell, valueCell, symbolCell);

      row.addEventListener("click", () => {
        state.to = unit;
        renderAll();
      });
      els.allResultsBody.appendChild(row);
    });
  }

  function renderStats() {
    const categories = Object.keys(window.unitConverterData || {});
    const units = categories.reduce((sum, category) => sum + Object.keys(window.unitConverterData[category].definitions || {}).length, 0);
    els.categoryCount.textContent = String(categories.length);
    els.unitCount.textContent = String(units);
  }

  function renderAll() {
    validateState();
    els.inputValue.value = state.value;
    els.precisionSelect.value = state.precision;
    populateSelects();
    renderMicrowaveFields();
    renderCategories();
    renderExamples();
    renderRelatedTools();
    renderResult();
    renderAllResults();
  }

  async function copyText(text, successKey) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      announce(successKey);
    } catch (_) {
      announce("unitConverter.copyFailed");
    }
  }

  function announce(key) {
    const previous = els.copyResult.querySelector("span").textContent;
    els.copyResult.querySelector("span").textContent = t(key, key);
    setTimeout(() => {
      els.copyResult.querySelector("span").textContent = previous;
    }, 1300);
  }

  function shareUrl() {
    const url = new URL(location.href);
    url.searchParams.set("category", state.category);
    url.searchParams.set("from", state.from);
    url.searchParams.set("to", state.to);
    url.searchParams.set("value", state.value);
    url.searchParams.set("precision", state.precision);
    history.replaceState(null, "", url);
    copyText(url.toString(), "unitConverter.shared");
  }

  function initFromUrl() {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category && window.unitConverterData?.[category]) state.category = category;
    const from = params.get("from");
    const to = params.get("to");
    const value = params.get("value");
    const precision = params.get("precision");
    if (from) state.from = from;
    if (to) state.to = to;
    if (value) state.value = value;
    if (precision && ["auto", "2", "4", "6", "8", "12"].includes(precision)) state.precision = precision;
  }

  function bindEvents() {
    els.categorySearch.addEventListener("input", renderCategories);
    els.inputValue.addEventListener("input", () => {
      state.value = els.inputValue.value;
      renderMicrowaveFields();
      renderResult();
      renderAllResults();
    });
    els.fromUnit.addEventListener("change", () => {
      state.from = els.fromUnit.value;
      renderResult();
      renderAllResults();
    });
    els.toUnit.addEventListener("change", () => {
      state.to = els.toUnit.value;
      renderResult();
      renderAllResults();
    });
    els.precisionSelect.addEventListener("change", () => {
      state.precision = els.precisionSelect.value;
      renderResult();
      renderAllResults();
    });
    els.swapUnits.addEventListener("click", () => {
      [state.from, state.to] = [state.to, state.from];
      renderAll();
    });
    els.copyResult.addEventListener("click", () => {
      const text = `${els.resultValue.textContent} (${els.resultDetail.textContent})`;
      copyText(text, "unitConverter.copied");
    });
    els.shareUrl.addEventListener("click", shareUrl);
    [els.microwaveMinutes, els.microwaveSeconds].forEach((input) => {
      input.addEventListener("input", () => {
        if (syncingMicrowave) return;
        const minutes = Math.max(0, Number(els.microwaveMinutes.value) || 0);
        const seconds = Math.max(0, Number(els.microwaveSeconds.value) || 0);
        state.value = String(minutes * 60 + seconds);
        renderAll();
      });
    });

    const modal = document.getElementById("guide-modal");
    document.getElementById("guide-btn").addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });
    document.getElementById("guide-close").addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    });

    document.addEventListener("languageChanged", renderAll);
    window.onLanguageChange = renderAll;
  }

  function init() {
    Object.assign(els, {
      categoryGrid: document.getElementById("categoryGrid"),
      categorySearch: document.getElementById("categorySearch"),
      inputValue: document.getElementById("inputValue"),
      microwaveFields: document.getElementById("microwaveFields"),
      microwaveMinutes: document.getElementById("microwaveMinutes"),
      microwaveSeconds: document.getElementById("microwaveSeconds"),
      fromUnit: document.getElementById("fromUnit"),
      toUnit: document.getElementById("toUnit"),
      precisionSelect: document.getElementById("precisionSelect"),
      swapUnits: document.getElementById("swapUnits"),
      resultValue: document.getElementById("resultValue"),
      resultDetail: document.getElementById("resultDetail"),
      copyResult: document.getElementById("copyResult"),
      shareUrl: document.getElementById("shareUrl"),
      allResultsBody: document.getElementById("allResultsBody"),
      exampleList: document.getElementById("exampleList"),
      relatedTools: document.getElementById("relatedTools"),
      errorMessage: document.getElementById("errorMessage"),
      categoryCount: document.getElementById("categoryCount"),
      unitCount: document.getElementById("unitCount")
    });
    initFromUrl();
    bindEvents();
    renderStats();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
