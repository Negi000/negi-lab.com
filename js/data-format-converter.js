// Browser-only JSON / CSV / YAML / Excel converter controller.
(function () {
  "use strict";

  const maxFileSizeMb = 10;
  const allowedExtensions = new Set(["json", "csv", "yaml", "yml", "xlsx"]);
  const samples = {
    json: JSON.stringify([
      { name: "Negi", role: "Engineer", score: 95 },
      { name: "Lab", role: "Designer", score: 88 }
    ], null, 2),
    csv: "name,role,score\nNegi,Engineer,95\nLab,Designer,88",
    yaml: "- name: Negi\n  role: Engineer\n  score: 95\n- name: Lab\n  role: Designer\n  score: 88\n"
  };
  const messages = {
    ja: {
      csvLibraryMissing: "CSV変換ライブラリを読み込めませんでした。ページを再読み込みしてください。",
      yamlLibraryMissing: "YAML変換ライブラリを読み込めませんでした。ページを再読み込みしてください。",
      xlsxLibraryMissing: "Excel変換ライブラリを読み込めませんでした。ページを再読み込みしてください。",
      invalidFileType: "JSON、CSV、YAML、Excel（.xlsx）のファイルを選択してください。",
      fileTooLarge: "{max}MB以下のファイルを選択してください。",
      unsupportedFile: "対応していないファイル形式です。",
      unsupportedOutput: "対応していない出力形式です。",
      detectFailed: "入力形式を判定できませんでした。JSON、CSV、YAMLの形式を確認してください。",
      xlsxPreview: "[Excelファイルを生成しました。ダウンロードして確認してください。]",
      status: "入力: {input} / 出力: {output} / {count}",
      rows: "{count}行",
      object: "オブジェクト",
      value: "値",
      fileLoaded: "ファイルを読み込みました。",
      sampleLoaded: "{format}サンプルを入力しました。",
      copied: "変換結果をコピーしました。",
      copyFailed: "コピーできませんでした。結果欄を選択して手動でコピーしてください。",
      fileParseFailed: "ファイルの解析に失敗しました。形式と文字コードを確認してください。",
      inputParseFailed: "入力データの解析に失敗しました。",
      emptyInput: "ファイルを選択するか、テキストを貼り付けてください。",
      convertFailed: "変換に失敗しました。入力データの構造を確認してください。"
    },
    en: {
      csvLibraryMissing: "The CSV conversion library could not be loaded. Please reload the page.",
      yamlLibraryMissing: "The YAML conversion library could not be loaded. Please reload the page.",
      xlsxLibraryMissing: "The Excel conversion library could not be loaded. Please reload the page.",
      invalidFileType: "Please choose a JSON, CSV, YAML, or Excel (.xlsx) file.",
      fileTooLarge: "Please choose a file smaller than {max}MB.",
      unsupportedFile: "Unsupported file format.",
      unsupportedOutput: "Unsupported output format.",
      detectFailed: "Could not detect the input format. Check that the text is valid JSON, CSV, or YAML.",
      xlsxPreview: "[Excel file generated. Download it to review the result.]",
      status: "Input: {input} / Output: {output} / {count}",
      rows: "{count} rows",
      object: "object",
      value: "value",
      fileLoaded: "File loaded.",
      sampleLoaded: "{format} sample loaded.",
      copied: "Result copied.",
      copyFailed: "Copy failed. Select the result and copy it manually.",
      fileParseFailed: "Could not parse the file. Check the format and encoding.",
      inputParseFailed: "Could not parse the input data.",
      emptyInput: "Choose a file or paste text first.",
      convertFailed: "Conversion failed. Check the structure of the input data."
    }
  };

  let inputData = null;
  let inputType = null;
  let objectUrl = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function getLanguage() {
    if (window.NegiI18n && typeof window.NegiI18n.getLanguage === "function") {
      return window.NegiI18n.getLanguage() === "en" ? "en" : "ja";
    }
    return (document.documentElement.lang || "ja").slice(0, 2) === "en" ? "en" : "ja";
  }

  function t(key, replacements) {
    const table = messages[getLanguage()] || messages.ja;
    let value = table[key] || messages.ja[key] || key;
    Object.entries(replacements || {}).forEach(([name, replacement]) => {
      value = value.replace(`{${name}}`, String(replacement));
    });
    return value;
  }

  function setMessage(type, message, error) {
    const box = byId("messageBox");
    if (box) {
      box.hidden = false;
      box.textContent = message;
      box.className = "notice mb-5 rounded-lg border px-4 py-3 text-sm";
      box.classList.add(
        type === "error" ? "border-red-200" : "border-green-200",
        type === "error" ? "bg-red-50" : "bg-green-50",
        type === "error" ? "text-red-800" : "text-green-800"
      );
    }
    if (type === "error" && error) console.error(error);
  }

  function clearMessage() {
    const box = byId("messageBox");
    if (box) {
      box.hidden = true;
      box.textContent = "";
    }
  }

  function safeFileName(name) {
    return String(name || "").replace(/[^\w.\-\s()[\]\u3040-\u30ff\u3400-\u9fff]/g, "").trim();
  }

  function fileExtension(fileName) {
    return String(fileName || "").split(".").pop().toLowerCase();
  }

  function ensureCsvLibrary() {
    if (!window.Papa || !window.Papa.parse || !window.Papa.unparse) throw new Error(t("csvLibraryMissing"));
  }

  function ensureYamlLibrary() {
    if (!window.jsyaml || !window.jsyaml.load || !window.jsyaml.dump) throw new Error(t("yamlLibraryMissing"));
  }

  function ensureXlsxLibrary() {
    if (!window.XLSX || !window.XLSX.read || !window.XLSX.write) throw new Error(t("xlsxLibraryMissing"));
  }

  function validateFile(file) {
    const ext = fileExtension(file.name);
    if (!allowedExtensions.has(ext)) {
      setMessage("error", t("invalidFileType"));
      return false;
    }
    if (file.size > maxFileSizeMb * 1024 * 1024) {
      setMessage("error", t("fileTooLarge", { max: maxFileSizeMb }));
      return false;
    }
    return true;
  }

  function parseCsv(text) {
    ensureCsvLibrary();
    const parsed = window.Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header) => header.trim()
    });
    if (parsed.errors && parsed.errors.length) throw new Error(parsed.errors[0].message);
    return parsed.data;
  }

  function parseTextByExtension(value, ext) {
    if (ext === "json") return JSON.parse(value);
    if (ext === "csv") return parseCsv(value);
    if (ext === "yaml" || ext === "yml") {
      ensureYamlLibrary();
      return window.jsyaml.load(value);
    }
    throw new Error(t("unsupportedFile"));
  }

  function parsePastedText(value) {
    const text = value.trim();
    if (!text) return null;
    if (text.startsWith("{") || text.startsWith("[")) {
      inputType = "json";
      return JSON.parse(text);
    }
    if (text.includes(",") && text.includes("\n")) {
      inputType = "csv";
      return parseCsv(text);
    }
    if (text.startsWith("---") || /^[\w"'-]+\s*:/m.test(text) || /^-\s+[\w"'-]+\s*:/m.test(text)) {
      inputType = "yaml";
      ensureYamlLibrary();
      return window.jsyaml.load(text);
    }
    throw new Error(t("detectFailed"));
  }

  function readFile(file, ext) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (ext === "xlsx") {
            ensureXlsxLibrary();
            const workbook = window.XLSX.read(event.target.result, { type: "array", cellDates: true });
            const sheetName = workbook.SheetNames[0];
            if (!sheetName) throw new Error("Workbook has no sheets.");
            resolve(window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" }));
          } else {
            resolve(parseTextByExtension(event.target.result, ext));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("File read failed"));
      if (ext === "xlsx") reader.readAsArrayBuffer(file);
      else reader.readAsText(file, "UTF-8");
    });
  }

  function asRows(data) {
    if (Array.isArray(data)) {
      return data.map((item) => (item && typeof item === "object" && !Array.isArray(item) ? item : { value: item }));
    }
    if (data && typeof data === "object") return [data];
    return [{ value: data }];
  }

  function createOutput(data, targetFormat) {
    if (targetFormat === "json") {
      const output = JSON.stringify(data, null, 2);
      return { text: output, blob: new Blob([output], { type: "application/json;charset=utf-8" }), ext: "json" };
    }
    if (targetFormat === "csv") {
      ensureCsvLibrary();
      const output = window.Papa.unparse(asRows(data));
      return { text: output, blob: new Blob(["\ufeff", output], { type: "text/csv;charset=utf-8" }), ext: "csv" };
    }
    if (targetFormat === "yaml") {
      ensureYamlLibrary();
      const output = window.jsyaml.dump(data, { lineWidth: 120, noRefs: true });
      return { text: output, blob: new Blob([output], { type: "text/yaml;charset=utf-8" }), ext: "yaml" };
    }
    if (targetFormat === "xlsx") {
      ensureXlsxLibrary();
      const worksheet = window.XLSX.utils.json_to_sheet(asRows(data));
      const workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const output = window.XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      return {
        text: t("xlsxPreview"),
        blob: new Blob([output], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        ext: "xlsx"
      };
    }
    throw new Error(t("unsupportedOutput"));
  }

  function setDownload(blob, ext) {
    const link = byId("downloadLink");
    if (!link) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(blob);
    link.download = `converted.${ext}`;
    link.href = objectUrl;
  }

  function countLabel(data) {
    if (Array.isArray(data)) return t("rows", { count: data.length });
    if (data && typeof data === "object") return t("object");
    return t("value");
  }

  function updateStatus(targetFormat, data) {
    const status = byId("conversionStatus");
    if (!status) return;
    status.textContent = t("status", {
      input: String(inputType || "text").toUpperCase(),
      output: targetFormat.toUpperCase(),
      count: countLabel(data)
    });
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    clearMessage();
    if (!validateFile(file)) {
      event.target.value = "";
      return;
    }
    const ext = fileExtension(file.name);
    try {
      byId("fileName").textContent = safeFileName(file.name);
      inputData = await readFile(file, ext);
      inputType = ext;
      byId("textInput").value = "";
      setMessage("success", t("fileLoaded"));
    } catch (error) {
      inputData = null;
      inputType = null;
      setMessage("error", t("fileParseFailed"), error);
    }
  }

  function resetFileInput() {
    const fileInput = byId("fileInput");
    if (fileInput) fileInput.value = "";
    const fileName = byId("fileName");
    if (fileName) fileName.textContent = "対応形式: .json / .csv / .yaml / .yml / .xlsx（10MBまで）";
  }

  function handleTextInput() {
    inputData = null;
    inputType = null;
    resetFileInput();
    clearMessage();
  }

  function loadSample(format) {
    const textInput = byId("textInput");
    if (!textInput) return;
    textInput.value = samples[format];
    inputData = null;
    inputType = null;
    resetFileInput();
    setMessage("success", t("sampleLoaded", { format: format.toUpperCase() }));
    textInput.focus();
  }

  function handleConvert() {
    clearMessage();
    let data = inputData;
    try {
      if (!data) data = parsePastedText(byId("textInput").value);
    } catch (error) {
      setMessage("error", `${t("inputParseFailed")} ${error.message || ""}`.trim(), error);
      return;
    }
    if (!data) {
      setMessage("error", t("emptyInput"));
      return;
    }
    try {
      const targetFormat = byId("formatSelect").value;
      const output = createOutput(data, targetFormat);
      byId("resultText").value = output.text;
      byId("resultContainer").classList.remove("hidden");
      setDownload(output.blob, output.ext);
      updateStatus(targetFormat, data);
    } catch (error) {
      setMessage("error", `${t("convertFailed")} ${error.message || ""}`.trim(), error);
    }
  }

  async function copyResult() {
    const result = (byId("resultText") && byId("resultText").value) || "";
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setMessage("success", t("copied"));
    } catch (error) {
      setMessage("error", t("copyFailed"), error);
    }
  }

  function bindEvents() {
    byId("fileInput")?.addEventListener("change", handleFileChange);
    byId("textInput")?.addEventListener("input", handleTextInput);
    byId("convertBtn")?.addEventListener("click", handleConvert);
    byId("copyResultBtn")?.addEventListener("click", copyResult);
    byId("sampleJsonBtn")?.addEventListener("click", () => loadSample("json"));
    byId("sampleCsvBtn")?.addEventListener("click", () => loadSample("csv"));
    byId("sampleYamlBtn")?.addEventListener("click", () => loadSample("yaml"));
    window.addEventListener("beforeunload", () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    });
  }

  document.addEventListener("DOMContentLoaded", bindEvents);
})();
