// Unit converter UI controller. Keeps the page interactive without server-side code.
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
    microwave: "600W / 500W",
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
    { ja: "1m をフィートへ", en: "1 meter to feet", category: "length", from: "meters", to: "feet", value: "1" },
    { ja: "100平方メートルを坪へ", en: "100 square meters to tsubo", category: "area", from: "square_meters", to: "tsubo", value: "100" },
    { ja: "10kg をポンドへ", en: "10 kg to pounds", category: "weight", from: "kilograms", to: "pounds", value: "10" },
    { ja: "180℃ を華氏へ", en: "180°C to Fahrenheit", category: "temperature", from: "celsius", to: "fahrenheit", value: "180" },
    { ja: "600W 3分を 500W へ", en: "600W 3 min to 500W", category: "microwave", from: "600w", to: "500w", value: "180" },
    { ja: "日本の1カップを mL へ", en: "1 Japanese cup to mL", category: "volume", from: "cups_jp", to: "milliliters", value: "1" },
    { ja: "1GB を MB へ", en: "1 GB to MB", category: "data", from: "gigabytes", to: "megabytes", value: "1" },
    { ja: "1気圧を kPa へ", en: "1 atm to kPa", category: "pressure", from: "atmospheres", to: "kilopascals", value: "1" },
    { ja: "15km/L を mpg へ", en: "15 km/L to mpg", category: "fuel_consumption", from: "kilometers_per_liter", to: "miles_per_gallon_us", value: "15" }
  ];

  const RELATED_TOOLS = [
    { href: "/tools/date-calculator.html", ja: "日付計算ツール", en: "Date Calculator" },
    { href: "/tools/text-converter.html", ja: "テキスト変換ツール", en: "Text Converter" },
    { href: "/tools/json-csv-yaml-excel.html", ja: "JSON / CSV / YAML / Excel 変換", en: "JSON / CSV / YAML / Excel Converter" },
    { href: "/tools/qr-code-generator.html", ja: "QRコード生成ツール", en: "QR Code Generator" }
  ];

  const HISTORY_STORAGE_KEY = "negi-lab-unit-converter-history";
  const MAX_HISTORY_ITEMS = 8;

  const state = {
    category: "length",
    from: "meters",
    to: "feet",
    value: "1",
    precision: "auto"
  };

  const els = {};
  let syncingMicrowave = false;
  let persistTimer = 0;
  let lastPersistSignature = "";

  function getLang() {
    if (typeof window.getLanguage === "function") {
      return window.getLanguage();
    }
    try {
      return localStorage.getItem("selectedLanguage") || localStorage.getItem("negi-lab-language") || "ja";
    } catch (_) {
      return "ja";
    }
  }

  function t(key, fallback = key) {
    if (typeof window.t === "function") {
      return window.t(key, fallback);
    }
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
    return t(`unitConverter.desc.${category}`, t("unitConverter.desc.default", "Useful conversion"));
  }

  function unitDef(category, unitKey) {
    return window.unitConverterData?.[category]?.definitions?.[unitKey];
  }

  function unitName(category, unitKey) {
    const def = unitDef(category, unitKey);
    if (!def) {
      return unitKey;
    }
    const lang = getLang();
    return def[lang] || def.ja || def.en || unitKey;
  }

  function unitLabel(category, unitKey) {
    const def = unitDef(category, unitKey);
    if (!def) {
      return unitKey;
    }
    const name = unitName(category, unitKey);
    return def.symbol && !name.includes(def.symbol) ? `${name} (${def.symbol})` : name;
  }

  function normalizeText(value) {
    return String(value ?? "").normalize("NFKC").toLowerCase().trim();
  }

  function categorySearchText(category) {
    const dict = window.unitConverterTranslations || {};
    const labelKey = categoryKey(category);
    const descKey = `unitConverter.desc.${category}`;
    const definitions = Object.values(window.unitConverterData?.[category]?.definitions || {});
    const unitText = definitions.flatMap((def) => [def.ja, def.en, def.symbol]).filter(Boolean).join(" ");
    return normalizeText([
      category,
      categoryLabel(category),
      categoryDescription(category),
      dict.ja?.[labelKey],
      dict.ja?.[descKey],
      dict.en?.[labelKey],
      dict.en?.[descKey],
      unitText
    ].filter(Boolean).join(" "));
  }

  function resultSymbol(category, unitKey) {
    return category === "microwave" ? "s" : (unitDef(category, unitKey)?.symbol || "");
  }

  function normalizeNumberString(value) {
    return String(value ?? "")
      .normalize("NFKC")
      .replace(/[，、]/g, ",")
      .replace(/[．。]/g, ".")
      .replace(/[－―ー]/g, "-");
  }

  function parseValue(value) {
    const cleaned = normalizeNumberString(value).replace(/,/g, "").trim();
    return cleaned === "" ? NaN : Number(cleaned);
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "";
    }
    if (state.precision !== "auto") {
      const digits = Number(state.precision);
      return value.toFixed(digits).replace(/\.?0+$/, "");
    }
    if (value === 0) {
      return "0";
    }
    const abs = Math.abs(value);
    if (abs >= 1e9 || abs < 1e-6) {
      return value.toExponential(8).replace(/\.?0+e/, "e");
    }
    return new Intl.NumberFormat(getLang() === "en" ? "en-US" : "ja-JP", {
      maximumSignificantDigits: 12
    }).format(value);
  }

  function formatDuration(totalSeconds) {
    if (!Number.isFinite(totalSeconds)) {
      return "";
    }
    const rounded = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    return getLang() === "en" ? `${minutes} min ${seconds} sec` : `${minutes}分 ${seconds}秒`;
  }

  function conversionResult(toUnit = state.to) {
    return window.unitConverterCore.convert(state.category, parseValue(state.value), state.from, toUnit);
  }

  function validateState() {
    if (!window.unitConverterData?.[state.category]) {
      state.category = "length";
    }
    const units = Object.keys(window.unitConverterData[state.category].definitions);
    if (!units.includes(state.from) || !units.includes(state.to)) {
      const pair = DEFAULT_PAIRS[state.category] || [units[0], units[1] || units[0]];
      state.from = pair[0];
      state.to = pair[1];
    }
  }

  function createOption(label, value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function renderCategories() {
    const query = normalizeText(els.categorySearch.value);
    const fragment = document.createDocumentFragment();
    let matchCount = 0;

    CATEGORY_ORDER.filter((category) => window.unitConverterData?.[category]).forEach((category) => {
      if (query && !categorySearchText(category).includes(query)) {
        return;
      }
      matchCount += 1;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "category-button rounded-lg bg-white p-3 text-left";
      button.setAttribute("aria-pressed", category === state.category ? "true" : "false");

      const labelEl = document.createElement("span");
      labelEl.className = "block text-sm font-bold text-ink";
      labelEl.textContent = categoryLabel(category);

      const descriptionEl = document.createElement("span");
      descriptionEl.className = "mt-1 block min-h-[2.5rem] text-xs leading-5 text-slate-600";
      descriptionEl.textContent = categoryDescription(category);

      const symbolEl = document.createElement("span");
      symbolEl.className = "mt-2 inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500";
      symbolEl.textContent = CATEGORY_SYMBOLS[category] || "";

      button.append(labelEl, descriptionEl, symbolEl);
      button.addEventListener("click", () => selectCategory(category, true));
      fragment.appendChild(button);
    });

    if (matchCount === 0) {
      const empty = document.createElement("p");
      empty.className = "col-span-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500";
      empty.textContent = t("unitConverter.categoryNoResults", "No matching categories");
      fragment.appendChild(empty);
    }

    els.categoryGrid.replaceChildren(fragment);
  }

  function selectCategory(category, resetPair) {
    state.category = category;
    if (resetPair) {
      const units = Object.keys(window.unitConverterData[category].definitions);
      const pair = DEFAULT_PAIRS[category] || [units[0], units[1] || units[0]];
      state.from = pair[0];
      state.to = pair[1];
      if (category === "microwave" && (!state.value || state.value === "1")) {
        state.value = "180";
      }
    }
    renderAll();
  }

  function populateSelects() {
    const units = Object.keys(window.unitConverterData[state.category].definitions);
    els.fromUnit.replaceChildren(...units.map((unitKey) => createOption(unitLabel(state.category, unitKey), unitKey)));
    els.toUnit.replaceChildren(...units.map((unitKey) => createOption(unitLabel(state.category, unitKey), unitKey)));
    els.fromUnit.value = state.from;
    els.toUnit.value = state.to;
  }

  function renderExamples() {
    els.exampleList.replaceChildren(...EXAMPLES.map((example) => {
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
      return button;
    }));
  }

  function renderRelatedTools() {
    els.relatedTools.replaceChildren(...RELATED_TOOLS.map((tool) => {
      const link = document.createElement("a");
      link.href = tool.href;
      link.className = "rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent transition";
      link.textContent = tool[getLang()] || tool.ja;
      return link;
    }));
  }

  function renderMicrowaveFields() {
    const isMicrowave = state.category === "microwave";
    els.microwaveFields.classList.toggle("hidden", !isMicrowave);
    if (!isMicrowave || syncingMicrowave) {
      return;
    }
    const seconds = Math.max(0, Math.round(parseValue(state.value) || 0));
    syncingMicrowave = true;
    els.microwaveMinutes.value = String(Math.floor(seconds / 60));
    els.microwaveSeconds.value = String(seconds % 60);
    syncingMicrowave = false;
  }

  function setResultPlaceholder() {
    els.resultValue.textContent = t("unitConverter.resultPlaceholder", "Result appears here");
    els.resultDetail.textContent = "";
  }

  function setError(messageKey, fallback) {
    if (!messageKey) {
      els.errorMessage.hidden = true;
      els.errorMessage.textContent = "";
      return;
    }
    els.errorMessage.hidden = false;
    els.errorMessage.textContent = t(messageKey, fallback);
  }

  function signatureFromState() {
    return JSON.stringify({
      category: state.category,
      from: state.from,
      to: state.to,
      value: state.value,
      precision: state.precision
    });
  }

  function signatureFromEntry(entry) {
    return JSON.stringify({
      category: entry.category,
      from: entry.from,
      to: entry.to,
      value: entry.rawValue,
      precision: entry.precision
    });
  }

  function readHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function writeHistory(items) {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
    } catch (_) {
      // Storage may be unavailable.
    }
  }

  function createHistoryLabel(item) {
    const resultPart = item.resultSymbol ? `${item.result} ${item.resultSymbol}` : item.result;
    return `${item.value} ${item.fromLabel} → ${resultPart} ${item.toLabel}`.trim();
  }

  function persistCurrentConversion() {
    const rawValue = parseValue(state.value);
    const converted = conversionResult();
    if (!Number.isFinite(rawValue) || !Number.isFinite(converted) || Math.abs(rawValue) > 1e15) {
      return;
    }

    const signature = signatureFromState();
    if (signature === lastPersistSignature) {
      return;
    }
    lastPersistSignature = signature;

    const item = {
      category: state.category,
      from: state.from,
      to: state.to,
      value: formatNumber(rawValue),
      rawValue: state.value,
      precision: state.precision,
      fromLabel: unitLabel(state.category, state.from),
      toLabel: unitLabel(state.category, state.to),
      result: formatNumber(converted),
      resultSymbol: resultSymbol(state.category, state.to),
      timestamp: Date.now()
    };

    const next = [item]
      .concat(readHistory().filter((entry) => signatureFromEntry(entry) !== signature))
      .slice(0, MAX_HISTORY_ITEMS);
    writeHistory(next);
    renderHistory();
  }

  function queuePersistCurrentConversion() {
    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(persistCurrentConversion, 500);
  }

  function renderHistory() {
    const items = readHistory();
    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500";
      empty.textContent = t("unitConverter.historyEmpty", "No history yet.");
      els.historyList.replaceChildren(empty);
      return;
    }

    els.historyList.replaceChildren(...items.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rounded-lg border border-slate-200 px-3 py-3 text-left text-sm hover:border-accent hover:bg-green-50 transition";
      button.setAttribute("aria-label", t("unitConverter.historyUse", "Reuse this setup"));

      const title = document.createElement("div");
      title.className = "font-semibold text-slate-800";
      title.textContent = createHistoryLabel(item);

      const meta = document.createElement("div");
      meta.className = "mt-1 text-xs text-slate-500";
      meta.textContent = `${categoryLabel(item.category)} · ${new Date(item.timestamp).toLocaleString(getLang() === "en" ? "en-US" : "ja-JP")}`;

      button.append(title, meta);
      button.addEventListener("click", () => {
        state.category = item.category;
        state.from = item.from;
        state.to = item.to;
        state.value = item.rawValue;
        state.precision = item.precision || "auto";
        renderAll();
      });
      return button;
    }));
  }

  function renderResult() {
    const value = parseValue(state.value);
    setError();

    if (state.value.trim() === "") {
      setResultPlaceholder();
      return;
    }
    if (!Number.isFinite(value)) {
      setResultPlaceholder();
      setError("unitConverter.errorInvalid", "Enter a valid number.");
      return;
    }
    if (Math.abs(value) > 1e15) {
      setResultPlaceholder();
      setError("unitConverter.errorTooLarge", "The value is too large.");
      return;
    }

    const result = conversionResult();
    if (!Number.isFinite(result)) {
      setResultPlaceholder();
      setError("unitConverter.errorUnavailable", "This combination cannot be converted.");
      return;
    }

    const symbol = resultSymbol(state.category, state.to);
    els.resultValue.textContent = symbol ? `${formatNumber(result)} ${symbol}` : formatNumber(result);

    if (state.category === "microwave") {
      els.resultDetail.textContent = `${formatNumber(value)} s (${formatDuration(value)}) → ${formatDuration(result)} / ${unitLabel(state.category, state.to)}`;
    } else {
      els.resultDetail.textContent = `${formatNumber(value)} ${unitLabel(state.category, state.from)} = ${formatNumber(result)} ${unitLabel(state.category, state.to)}`;
    }

    queuePersistCurrentConversion();
  }

  function renderAllResults() {
    const value = parseValue(state.value);
    const canConvert = Number.isFinite(value) && Math.abs(value) <= 1e15;
    const rows = Object.keys(window.unitConverterData[state.category].definitions).map((unitKey) => {
      const converted = canConvert ? conversionResult(unitKey) : NaN;
      const row = document.createElement("tr");
      row.className = unitKey === state.to ? "bg-green-50 cursor-pointer" : "cursor-pointer hover:bg-slate-50";
      row.tabIndex = 0;
      if (unitKey === state.to) {
        row.setAttribute("aria-current", "true");
      }

      const nameCell = document.createElement("td");
      nameCell.className = "px-4 py-3 font-medium text-ink";
      nameCell.textContent = unitName(state.category, unitKey);

      const valueCell = document.createElement("td");
      valueCell.className = "px-4 py-3 tabular-nums";
      valueCell.textContent = Number.isFinite(converted) ? formatNumber(converted) : "-";

      const symbolCell = document.createElement("td");
      symbolCell.className = "px-4 py-3 text-slate-500";
      symbolCell.textContent = state.category === "microwave" ? "s" : (unitDef(state.category, unitKey)?.symbol || "-");

      row.append(nameCell, valueCell, symbolCell);

      const activate = () => {
        state.to = unitKey;
        renderAll();
      };
      row.addEventListener("click", activate);
      row.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
      return row;
    });

    els.allResultsBody.replaceChildren(...rows);
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
    renderHistory();
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
    els.statusMessage.textContent = t(key, key);
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
    if (category && window.unitConverterData?.[category]) {
      state.category = category;
    }
    const from = params.get("from");
    const to = params.get("to");
    const value = params.get("value");
    const precision = params.get("precision");
    if (from) {
      state.from = from;
    }
    if (to) {
      state.to = to;
    }
    if (value) {
      state.value = value;
    }
    if (precision && ["auto", "2", "4", "6", "8", "12"].includes(precision)) {
      state.precision = precision;
    }
  }

  function closeGuideModal() {
    els.guideModal.classList.add("hidden");
    els.guideModal.classList.remove("flex");
    els.guideBtn.focus();
  }

  function openGuideModal() {
    els.guideModal.classList.remove("hidden");
    els.guideModal.classList.add("flex");
    els.guideClose.focus();
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
      const detail = els.resultDetail.textContent ? ` (${els.resultDetail.textContent})` : "";
      copyText(`${els.resultValue.textContent}${detail}`, "unitConverter.copied");
    });
    els.shareUrl.addEventListener("click", shareUrl);
    els.clearHistory.addEventListener("click", () => {
      writeHistory([]);
      renderHistory();
      announce("unitConverter.historyCleared");
    });

    [els.microwaveMinutes, els.microwaveSeconds].forEach((input) => {
      input.addEventListener("input", () => {
        if (syncingMicrowave) {
          return;
        }
        const minutes = Math.max(0, Number(els.microwaveMinutes.value) || 0);
        const seconds = Math.max(0, Number(els.microwaveSeconds.value) || 0);
        state.value = String(minutes * 60 + seconds);
        renderAll();
      });
    });

    els.guideBtn.addEventListener("click", openGuideModal);
    els.guideClose.addEventListener("click", closeGuideModal);
    els.guideModal.addEventListener("click", (event) => {
      if (event.target === els.guideModal) {
        closeGuideModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.guideModal.classList.contains("hidden")) {
        closeGuideModal();
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
      historyList: document.getElementById("historyList"),
      clearHistory: document.getElementById("clearHistory"),
      relatedTools: document.getElementById("relatedTools"),
      errorMessage: document.getElementById("errorMessage"),
      categoryCount: document.getElementById("categoryCount"),
      unitCount: document.getElementById("unitCount"),
      statusMessage: document.getElementById("statusMessage"),
      guideModal: document.getElementById("guide-modal"),
      guideBtn: document.getElementById("guide-btn"),
      guideClose: document.getElementById("guide-close")
    });
    initFromUrl();
    bindEvents();
    renderStats();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
