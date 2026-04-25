(function () {
  "use strict";

  const TOOL_META = [
    { href: "/tools/unit-converter.html", category: "calc", keywords: "unit converter length weight temperature area volume microwave tsubo 単位 変換 長さ 重さ 温度 面積 体積 電子レンジ 坪" },
    { href: "/tools/date-calculator.html", category: "calc", keywords: "date calculator age business days period 日付 計算 期間 年齢 営業日" },
    { href: "/tools/image-converter.html", category: "image", keywords: "image converter jpeg png webp resize 画像 変換 リサイズ 圧縮" },
    { href: "/tools/image-size-compare.html", category: "image", keywords: "image size social youtube instagram x sns 画像 サイズ SNS YouTube Instagram" },
    { href: "/tools/bg-remover.html", category: "image", keywords: "background remover transparent png image 背景 削除 透過 PNG" },
    { href: "/tools/color-code-tool.html", category: "image", keywords: "color code hex rgb hsl palette image colors カラー 色 HEX RGB HSL パレット" },
    { href: "/tools/favicon-og-generator.html", category: "image", keywords: "favicon ogp og image website icon ファビコン OGP OG アイコン" },
    { href: "/tools/pdf-tool.html", category: "doc", keywords: "pdf merge split compress convert document PDF 結合 分割 圧縮 変換" },
    { href: "/tools/text-converter.html", category: "doc", keywords: "text converter case count camel snake テキスト 変換 文字数 大文字 小文字" },
    { href: "/tools/json-csv-yaml-excel.html", category: "doc", keywords: "json csv yaml excel converter data api データ 変換" },
    { href: "/tools/qr-code-generator.html", category: "web", keywords: "qr code generator wifi url qrコード 作成 URL Wi-Fi" },
    { href: "/tools/url-shortener.html", category: "web", keywords: "url shortener link share URL 短縮 リンク 共有" },
    { href: "/tools/music-generator.html", category: "creative", keywords: "music generator bgm composer 音楽 生成 BGM 作曲" }
  ];

  const COPY = {
    ja: {
      label: "ツールを探す",
      placeholder: "例: PDF、画像、QR、単位、JSON",
      all: "すべて",
      image: "画像・デザイン",
      doc: "文書・データ",
      calc: "計算",
      web: "Web共有",
      creative: "制作",
      count: "{count}件のツール",
      empty: "該当するツールがありません。別のキーワードで試してください。"
    },
    en: {
      label: "Find a tool",
      placeholder: "Try PDF, image, QR, unit, JSON",
      all: "All",
      image: "Image & Design",
      doc: "Docs & Data",
      calc: "Calculators",
      web: "Web Sharing",
      creative: "Creative",
      count: "{count} tools",
      empty: "No matching tools. Try another keyword."
    }
  };

  function getLanguage() {
    if (window.NegiI18n && typeof window.NegiI18n.getLanguage === "function") {
      return window.NegiI18n.getLanguage() === "en" ? "en" : "ja";
    }
    return document.documentElement.lang === "en" ? "en" : "ja";
  }

  function normalizePath(href) {
    try {
      return new URL(href, location.origin).pathname;
    } catch (_) {
      return href;
    }
  }

  function initToolIndex() {
    if (location.pathname !== "/tools/" && location.pathname !== "/tools/index.html") return;
    if (document.querySelector("[data-tool-index-controls]")) return;

    const grid = document.querySelector("[data-tool-directory-grid]");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('a[href^="/tools/"], a[href^="tools/"]'))
      .filter((card) => TOOL_META.some((tool) => tool.href === normalizePath(card.getAttribute("href"))));
    if (!cards.length) return;

    cards.forEach((card) => {
      const path = normalizePath(card.getAttribute("href"));
      const meta = TOOL_META.find((tool) => tool.href === path);
      card.setAttribute("data-tool-card", "true");
      card.setAttribute("data-tool-category", meta.category);
      card.setAttribute("data-tool-search", `${card.textContent} ${meta.keywords}`.toLowerCase());
    });

    const controls = document.createElement("div");
    controls.setAttribute("data-tool-index-controls", "true");
    controls.className = "mb-6 border-y border-gray-200 py-5";
    grid.parentElement.insertBefore(controls, grid);

    const empty = document.createElement("p");
    empty.className = "hidden mt-6 rounded-lg border border-gray-200 bg-white p-5 text-center text-sm text-gray-600";
    empty.setAttribute("data-tool-index-empty", "true");
    grid.parentElement.insertBefore(empty, grid.nextSibling);

    let activeCategory = "all";
    let query = "";

    function renderControls() {
      const copy = COPY[getLanguage()];
      const categories = ["all", "image", "doc", "calc", "web", "creative"];
      controls.innerHTML = `
        <label class="block text-sm font-semibold text-gray-900" for="tool-search">${copy.label}</label>
        <div class="mt-2 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <input id="tool-search" type="search" value="${query.replace(/"/g, "&quot;")}" placeholder="${copy.placeholder}" class="w-full lg:max-w-md rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" />
          <div class="flex flex-wrap gap-2" role="list" aria-label="Tool categories">
            ${categories.map((category) => `
              <button type="button" data-tool-category-filter="${category}" class="rounded-full border px-3 py-2 text-sm font-semibold transition ${activeCategory === category ? "border-accent bg-accent text-white" : "border-gray-300 bg-white text-gray-700 hover:border-accent"}">
                ${copy[category]}
              </button>
            `).join("")}
          </div>
        </div>
        <p class="mt-3 text-xs text-gray-500" data-tool-index-count></p>
      `;

      const input = controls.querySelector("#tool-search");
      input.addEventListener("input", () => {
        query = input.value.toLowerCase().trim();
        applyFilter();
      });
      controls.querySelectorAll("[data-tool-category-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          activeCategory = button.getAttribute("data-tool-category-filter");
          renderControls();
          applyFilter();
        });
      });
    }

    function applyFilter() {
      const copy = COPY[getLanguage()];
      let visible = 0;
      cards.forEach((card) => {
        const categoryMatch = activeCategory === "all" || card.getAttribute("data-tool-category") === activeCategory;
        const queryMatch = !query || (card.getAttribute("data-tool-search") || "").includes(query);
        const show = categoryMatch && queryMatch;
        card.classList.toggle("hidden", !show);
        if (show) visible++;
      });
      const count = controls.querySelector("[data-tool-index-count]");
      if (count) count.textContent = copy.count.replace("{count}", visible);
      empty.textContent = copy.empty;
      empty.classList.toggle("hidden", visible !== 0);
    }

    renderControls();
    applyFilter();
    window.addEventListener("languageChanged", () => {
      renderControls();
      applyFilter();
    });
  }

  document.addEventListener("DOMContentLoaded", initToolIndex);
})();
