// JSON/CSV/YAML/Excel converter controller.
(function () {
  "use strict";

  const maxFileSizeMb = 10;
  const allowedExtensions = new Set(["json", "csv", "yaml", "yml", "xlsx"]);
  let inputData = null;
  let inputType = null;
  let objectUrl = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function showError(message, error) {
    if (window.SecurityUtils?.showUserError) window.SecurityUtils.showUserError(message, error);
    else alert(message);
    if (error) console.error(error);
  }

  function showSuccess(message) {
    if (window.SecurityUtils?.showSuccessMessage) window.SecurityUtils.showSuccessMessage(message);
  }

  function safeFileName(name) {
    if (window.SecurityUtils?.sanitizeInput) return window.SecurityUtils.sanitizeInput(name);
    return String(name || "").replace(/[^\w.\-\s]/g, "").trim();
  }

  function fileExtension(fileName) {
    return String(fileName || "").split(".").pop().toLowerCase();
  }

  function validateFile(file) {
    const ext = fileExtension(file.name);
    if (!allowedExtensions.has(ext)) {
      showError("JSON、CSV、YAML、Excel形式のファイルを選択してください");
      return false;
    }

    if (window.SecurityUtils?.validateFileSize) {
      if (!window.SecurityUtils.validateFileSize(file, maxFileSizeMb)) {
        showError(`ファイルサイズが${maxFileSizeMb}MB以下のファイルを選択してください`);
        return false;
      }
    } else if (file.size > maxFileSizeMb * 1024 * 1024) {
      showError(`ファイルサイズが${maxFileSizeMb}MB以下のファイルを選択してください`);
      return false;
    }

    return true;
  }

  function parseCsv(text) {
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    if (parsed.errors?.length) throw new Error(parsed.errors[0].message);
    return parsed.data;
  }

  function parseTextByExtension(value, ext) {
    if (ext === "json") return JSON.parse(value);
    if (ext === "csv") return parseCsv(value);
    if (ext === "yaml" || ext === "yml") return jsyaml.load(value);
    throw new Error("Unsupported file format");
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

    if (text.startsWith("---") || /^[\w"'-]+\s*:/m.test(text)) {
      inputType = "yaml";
      return jsyaml.load(text);
    }

    if (text.includes(",")) {
      inputType = "csv";
      return parseCsv(text);
    }

    throw new Error("Could not detect input format");
  }

  function readFile(file, ext) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (ext === "xlsx") {
            const workbook = XLSX.read(event.target.result, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            resolve(XLSX.utils.sheet_to_json(sheet));
          } else {
            resolve(parseTextByExtension(event.target.result, ext));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("File read failed"));
      if (ext === "xlsx") reader.readAsArrayBuffer(file);
      else reader.readAsText(file);
    });
  }

  function asRows(data) {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return [data];
    return [{ value: data }];
  }

  function createOutput(data, targetFormat) {
    if (targetFormat === "json") {
      const output = JSON.stringify(data, null, 2);
      return { text: output, blob: new Blob([output], { type: "application/json" }), ext: "json" };
    }

    if (targetFormat === "csv") {
      const output = Papa.unparse(asRows(data));
      return { text: output, blob: new Blob([output], { type: "text/csv;charset=utf-8" }), ext: "csv" };
    }

    if (targetFormat === "yaml") {
      const output = jsyaml.dump(data);
      return { text: output, blob: new Blob([output], { type: "text/yaml;charset=utf-8" }), ext: "yaml" };
    }

    if (targetFormat === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(asRows(data));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const output = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      return {
        text: "[Excelファイルを生成しました。ダウンロードしてください]",
        blob: new Blob([output], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        ext: "xlsx",
      };
    }

    throw new Error("Unsupported output format");
  }

  function setDownload(blob, ext) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(blob);
    byId("downloadLink").download = `converted.${ext}`;
    byId("downloadLink").href = objectUrl;
  }

  function updateStatus(targetFormat, data) {
    const status = byId("conversionStatus");
    if (!status) return;
    const count = Array.isArray(data) ? `${data.length} rows` : typeof data;
    status.textContent = `入力: ${String(inputType || "text").toUpperCase()} / 出力: ${targetFormat.toUpperCase()} / ${count}`;
  }

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;
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
      showSuccess("ファイルが正常に読み込まれました");
    } catch (error) {
      inputData = null;
      inputType = null;
      showError("ファイルの解析に失敗しました。正しい形式のファイルを選択してください", error);
    }
  }

  function handleTextInput() {
    inputData = null;
    inputType = null;
    byId("fileInput").value = "";
    byId("fileName").textContent = "";
  }

  function handleConvert() {
    let data = inputData;
    try {
      if (!data) data = parsePastedText(byId("textInput").value);
    } catch (error) {
      showError("入力データの解析に失敗しました", error);
      return;
    }

    if (!data) {
      showError("ファイルまたはテキストを入力してください");
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
      showError("変換に失敗しました", error);
    }
  }

  function bindEvents() {
    byId("fileInput").addEventListener("change", handleFileChange);
    byId("textInput").addEventListener("input", handleTextInput);
    byId("convertBtn").addEventListener("click", handleConvert);
  }

  function init() {
    if (window.renderSmartAds) window.renderSmartAds("smart-ads");
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
