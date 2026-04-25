(function () {
  "use strict";

  const TOOLS = [
    { href: "/tools/unit-converter.html", ja: "単位変換", en: "Unit Converter", noteJa: "長さ・重さ・坪・電子レンジ時間", noteEn: "Units, tsubo, microwave time", group: "calc" },
    { href: "/tools/image-converter.html", ja: "画像変換", en: "Image Converter", noteJa: "JPEG・PNG・WebP変換", noteEn: "JPEG, PNG, WebP conversion", group: "image" },
    { href: "/tools/image-size-compare.html", ja: "画像サイズ変換", en: "Image Size Converter", noteJa: "SNS・YouTube・Web用サイズ", noteEn: "Social and web image sizes", group: "image" },
    { href: "/tools/bg-remover.html", ja: "背景リムーバ", en: "Background Remover", noteJa: "透過PNG素材づくり", noteEn: "Transparent PNG assets", group: "image" },
    { href: "/tools/color-code-tool.html", ja: "カラーコード", en: "Color Code Tool", noteJa: "HEX・RGB・画像色抽出", noteEn: "HEX, RGB, image colors", group: "image" },
    { href: "/tools/favicon-og-generator.html", ja: "Favicon・OG画像", en: "Favicon & OG Image", noteJa: "サイト表示素材を生成", noteEn: "Website preview assets", group: "image" },
    { href: "/tools/pdf-tool.html", ja: "PDFツール", en: "PDF Tool", noteJa: "結合・分割・圧縮", noteEn: "Merge, split, compress", group: "doc" },
    { href: "/tools/text-converter.html", ja: "テキスト変換", en: "Text Converter", noteJa: "表記ゆれ・文字数・ケース変換", noteEn: "Case, width, character count", group: "doc" },
    { href: "/tools/json-csv-yaml-excel.html", ja: "データ形式変換", en: "Data Converter", noteJa: "JSON・CSV・YAML・Excel", noteEn: "JSON, CSV, YAML, Excel", group: "doc" },
    { href: "/tools/qr-code-generator.html", ja: "QRコード作成", en: "QR Code Generator", noteJa: "URL・Wi-Fi・テキスト", noteEn: "URL, Wi-Fi, text", group: "web" },
    { href: "/tools/url-shortener.html", ja: "URL短縮", en: "URL Shortener", noteJa: "共有しやすいリンク整形", noteEn: "Cleaner links for sharing", group: "web" },
    { href: "/tools/date-calculator.html", ja: "日付計算", en: "Date Calculator", noteJa: "期間・年齢・営業日", noteEn: "Ranges, age, business days", group: "calc" },
    { href: "/tools/music-generator.html", ja: "音楽生成", en: "Music Generator", noteJa: "BGM・制作メモ", noteEn: "BGM and creative sketches", group: "creative" }
  ];

  const COPY = {
    ja: {
      skip: "本文へ移動",
      supportTitle: "安心して使えるブラウザ完結ツール",
      supportLead: "入力した内容は、原則としてこのブラウザ内で処理されます。作業を止めず、必要な変換だけをすぐ実行できます。",
      point1: "登録不要",
      point1Note: "アカウント作成なしで、その場で使えます。",
      point2: "スマホ対応",
      point2Note: "小さな画面でも操作しやすい余白と入力欄に整えます。",
      point3: "次の作業へつながる",
      point3Note: "関連ツールを近くに置き、検索し直す手間を減らします。",
      faqTitle: "よくある確認",
      faq1: "ファイルはアップロードされますか？",
      faq1Answer: "多くの処理はブラウザ内で完結します。外部APIや広告配信が関わる場合は、プライバシーポリシーで用途を確認できます。",
      faq2: "無料で使えますか？",
      faq2Answer: "無料で利用できます。運営維持のため、広告やアフィリエイトを配置する場合があります。",
      faq3: "商用作業に使えますか？",
      faq3Answer: "業務や制作の下処理にも使えますが、最終成果物の確認と利用判断はご自身で行ってください。",
      relatedTitle: "関連ツール",
      relatedLead: "次の小さな作業も、同じブラウザ内で続けられます。",
      allTools: "ツール一覧",
      guideTitle: "使い方ガイド",
      guideLead: "入力、設定、実行、結果確認の順に進めると迷わず使えます。",
      guideStep1: "必要なテキストやファイルを入力します。",
      guideStep2: "変換形式や出力条件を選びます。",
      guideStep3: "結果を確認し、コピーまたはダウンロードします。",
      close: "閉じる"
    },
    en: {
      skip: "Skip to content",
      supportTitle: "Browser-based tools built for quick work",
      supportLead: "Most inputs are processed inside this browser, so you can run the conversion you need without a signup flow.",
      point1: "No signup",
      point1Note: "Open the page and use the tool right away.",
      point2: "Mobile-ready",
      point2Note: "Controls and spacing stay usable on smaller screens.",
      point3: "Clear next steps",
      point3Note: "Related tools are close by so you do not need to search again.",
      faqTitle: "Quick checks",
      faq1: "Are files uploaded?",
      faq1Answer: "Many workflows run in the browser. If external APIs or ads are involved, the privacy policy explains their role.",
      faq2: "Is it free?",
      faq2Answer: "Yes. Ads or affiliate placements may be used to support operation.",
      faq3: "Can I use it for production work?",
      faq3Answer: "You can use it for preparation and cleanup work, but please verify final output yourself.",
      relatedTitle: "Related tools",
      relatedLead: "Continue the next small task without leaving the browser.",
      allTools: "All tools",
      guideTitle: "How to use",
      guideLead: "Move through input, settings, run, and result check in that order.",
      guideStep1: "Enter the text or file you want to process.",
      guideStep2: "Choose the conversion mode or output settings.",
      guideStep3: "Check the result, then copy or download it.",
      close: "Close"
    }
  };

  function getLanguage() {
    if (window.NegiI18n && typeof window.NegiI18n.getLanguage === "function") {
      return window.NegiI18n.getLanguage() === "en" ? "en" : "ja";
    }
    try {
      const stored = localStorage.getItem("selectedLanguage") || localStorage.getItem("negi-lab-language");
      return stored === "en" ? "en" : "ja";
    } catch (_) {
      return document.documentElement.lang === "en" ? "en" : "ja";
    }
  }

  function isToolPage() {
    return /^\/tools\/.+\.html$/.test(location.pathname)
      && !/\/(index|debug-test|translation-test|color-code-tool-clean|next-gen-ai-music-composer)\.html$/.test(location.pathname);
  }

  function currentTool() {
    return TOOLS.find((tool) => tool.href === location.pathname) || null;
  }

  function insertSkipLink() {
    if (!isToolPage() || document.querySelector("[data-negi-skip-link]")) return;
    const main = document.querySelector("main");
    if (!main) return;
    if (!main.id) main.id = "main-content";

    const link = document.createElement("a");
    link.href = `#${main.id}`;
    link.setAttribute("data-negi-skip-link", "true");
    link.className = "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded focus:bg-gray-950 focus:px-4 focus:py-2 focus:text-white";
    link.textContent = COPY[getLanguage()].skip;
    document.body.insertBefore(link, document.body.firstChild);
  }

  function cleanupEmptyAdShells() {
    document.querySelectorAll("aside, .ad-block, .dynamic-ad-container").forEach((element) => {
      if (element.querySelector("ins.adsbygoogle, iframe, .rakuten-widget-placeholder")) return;
      if (!/スポンサー|Sponsored|広告|ad/i.test(element.textContent || "")) return;
      const rect = element.getBoundingClientRect();
      if (rect.height > 0 && rect.height < 140) element.style.display = "none";
    });
  }

  function removeVisibleFooterTail() {
    const footer = document.querySelector("footer");
    if (!footer || !footer.parentElement) return;
    const siblings = Array.from(document.body.children);
    const footerIndex = siblings.indexOf(footer);
    if (footerIndex < 0) return;
    siblings.slice(footerIndex + 1).forEach((element) => {
      if (["SCRIPT", "STYLE", "LINK", "TEMPLATE"].includes(element.tagName)) return;
      if (element.id === "guide-modal" && element.classList.contains("hidden")) return;
      const style = getComputedStyle(element);
      if (style.display === "none" || style.position === "fixed" || style.position === "sticky") return;
      if (!element.querySelector("input, button, a, canvas, textarea, select, iframe")) {
        element.style.display = "none";
      }
    });
  }

  function chooseRelatedTools() {
    const current = currentTool();
    const pool = TOOLS.filter((tool) => tool.href !== location.pathname);
    if (!current) return pool.slice(0, 4);
    const sameGroup = pool.filter((tool) => tool.group === current.group);
    const fallback = pool.filter((tool) => tool.group !== current.group);
    return sameGroup.concat(fallback).slice(0, 4);
  }

  function renderSupportSection() {
    if (!isToolPage() || document.querySelector("[data-negi-tool-support]")) return;
    const footer = document.querySelector("footer");
    if (!footer || !footer.parentElement) return;

    const section = document.createElement("section");
    section.setAttribute("data-negi-tool-support", "true");
    section.className = "max-w-6xl mx-auto px-4 my-10";
    footer.parentElement.insertBefore(section, footer);

    function update() {
      const copy = COPY[getLanguage()];
      section.innerHTML = `
        <div class="border-y border-gray-200 py-8">
          <div class="grid lg:grid-cols-[1.15fr_1fr] gap-8 items-start">
            <div>
              <h2 class="text-2xl font-bold text-gray-950">${copy.supportTitle}</h2>
              <p class="mt-3 text-sm leading-7 text-gray-600">${copy.supportLead}</p>
              <div class="mt-6 grid sm:grid-cols-3 gap-4">
                <div>
                  <p class="font-semibold text-gray-950">${copy.point1}</p>
                  <p class="mt-1 text-xs leading-6 text-gray-600">${copy.point1Note}</p>
                </div>
                <div>
                  <p class="font-semibold text-gray-950">${copy.point2}</p>
                  <p class="mt-1 text-xs leading-6 text-gray-600">${copy.point2Note}</p>
                </div>
                <div>
                  <p class="font-semibold text-gray-950">${copy.point3}</p>
                  <p class="mt-1 text-xs leading-6 text-gray-600">${copy.point3Note}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-950">${copy.faqTitle}</h3>
              <div class="mt-3 divide-y divide-gray-200 border-y border-gray-200">
                ${[
                  [copy.faq1, copy.faq1Answer],
                  [copy.faq2, copy.faq2Answer],
                  [copy.faq3, copy.faq3Answer]
                ].map(([question, answer]) => `
                  <details class="group py-3">
                    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900">
                      <span>${question}</span>
                      <span class="text-accent transition group-open:rotate-45">+</span>
                    </summary>
                    <p class="mt-2 text-xs leading-6 text-gray-600">${answer}</p>
                  </details>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    update();
    window.addEventListener("languageChanged", update);
  }

  function renderRelatedTools() {
    if (!isToolPage()) return;
    if (document.querySelector("[data-negi-related-tools]") || document.getElementById("relatedTools")) return;

    const footer = document.querySelector("footer");
    if (!footer || !footer.parentElement) return;

    const section = document.createElement("section");
    section.setAttribute("data-negi-related-tools", "true");
    section.className = "max-w-6xl mx-auto px-4 mb-12";
    footer.parentElement.insertBefore(section, footer);

    function update() {
      const lang = getLanguage();
      const copy = COPY[lang];
      const tools = chooseRelatedTools();
      section.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-950">${copy.relatedTitle}</h2>
            <p class="text-sm text-gray-600 mt-1">${copy.relatedLead}</p>
          </div>
          <a href="/tools/" class="text-sm font-semibold text-accent hover:underline">${copy.allTools}</a>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          ${tools.map((tool) => `
            <a href="${tool.href}" class="block rounded-lg border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent">
              <span class="block font-semibold text-gray-950">${lang === "en" ? tool.en : tool.ja}</span>
              <span class="block text-xs leading-5 text-gray-600 mt-1">${lang === "en" ? tool.noteEn : tool.noteJa}</span>
            </a>
          `).join("")}
        </div>
      `;
    }

    update();
    window.addEventListener("languageChanged", update);
  }

  function ensureGuideModal() {
    const button = document.getElementById("guide-btn");
    if (!isToolPage() || !button) return;

    let modal = document.getElementById("guide-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "guide-modal";
      modal.className = "hidden fixed inset-0 z-[9998] bg-gray-950/60 px-4 py-6";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "guide-modal-title");
      document.body.appendChild(modal);
    }

    function update() {
      const copy = COPY[getLanguage()];
      modal.innerHTML = `
        <div class="mx-auto mt-16 max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 id="guide-modal-title" class="text-xl font-bold text-gray-950">${copy.guideTitle}</h2>
              <p class="mt-2 text-sm leading-6 text-gray-600">${copy.guideLead}</p>
            </div>
            <button type="button" class="rounded border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50" data-guide-close>${copy.close}</button>
          </div>
          <ol class="mt-5 space-y-3 text-sm text-gray-700">
            <li class="flex gap-3"><span class="font-bold text-accent">1</span><span>${copy.guideStep1}</span></li>
            <li class="flex gap-3"><span class="font-bold text-accent">2</span><span>${copy.guideStep2}</span></li>
            <li class="flex gap-3"><span class="font-bold text-accent">3</span><span>${copy.guideStep3}</span></li>
          </ol>
        </div>
      `;
    }

    function open() {
      modal.classList.remove("hidden");
      const closeButton = modal.querySelector("[data-guide-close]");
      if (closeButton) closeButton.focus();
    }

    function close() {
      modal.classList.add("hidden");
      button.focus();
    }

    update();
    if (button.getAttribute("data-negi-guide-bound") !== "1") {
      button.setAttribute("data-negi-guide-bound", "1");
      button.addEventListener("click", open);
      modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.closest("[data-guide-close]")) close();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.classList.contains("hidden")) close();
      });
    }
    window.addEventListener("languageChanged", update);
  }

  document.addEventListener("DOMContentLoaded", () => {
    insertSkipLink();
    ensureGuideModal();
    renderSupportSection();
    renderRelatedTools();
    cleanupEmptyAdShells();
    removeVisibleFooterTail();
    setTimeout(cleanupEmptyAdShells, 800);
    setTimeout(removeVisibleFooterTail, 800);
  });
})();
