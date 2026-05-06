(function () {
  "use strict";

  const TOOL_META = [
    {
      href: "/tools/image-converter.html",
      category: "image",
      priority: 1,
      keywords: {
        ja: "画像 変換 jpeg png webp リサイズ 圧縮 最適化 sns サムネイル",
        en: "image convert jpeg png webp resize compress optimize social thumbnail"
      }
    },
    {
      href: "/tools/image-size-compare.html",
      category: "image",
      priority: 2,
      keywords: {
        ja: "画像 サイズ x instagram youtube facebook line 比率 sns",
        en: "image size x instagram youtube facebook line ratio social"
      }
    },
    {
      href: "/tools/bg-remover.html",
      category: "image",
      priority: 3,
      keywords: {
        ja: "背景 透過 png 切り抜き 素材",
        en: "background transparent png cutout asset"
      }
    },
    {
      href: "/tools/color-code-tool.html",
      category: "image",
      priority: 4,
      keywords: {
        ja: "色 カラー hex rgb hsl パレット 抽出 デザイン",
        en: "color hex rgb hsl palette extract design"
      }
    },
    {
      href: "/tools/pdf-tool.html",
      category: "doc",
      priority: 5,
      keywords: {
        ja: "pdf 結合 分割 圧縮 再保存 書類 文書",
        en: "pdf merge split compress resave file document"
      }
    },
    {
      href: "/tools/json-csv-yaml-excel.html",
      category: "doc",
      priority: 6,
      keywords: {
        ja: "json csv yaml excel 変換 データ api 表 整形",
        en: "json csv yaml excel convert data api table normalize"
      }
    },
    {
      href: "/tools/text-converter.html",
      category: "doc",
      priority: 7,
      keywords: {
        ja: "テキスト 文字数 大文字 小文字 全角 半角 camel snake 整形",
        en: "text count uppercase lowercase width camel snake normalize"
      }
    },
    {
      href: "/tools/unit-converter.html",
      category: "calc",
      priority: 8,
      keywords: {
        ja: "単位 長さ 重さ 温度 面積 体積 換算",
        en: "unit length weight temperature area volume convert"
      }
    },
    {
      href: "/tools/date-calculator.html",
      category: "calc",
      priority: 9,
      keywords: {
        ja: "日付 期間 営業日 年齢 加算 減算",
        en: "date period business days age add subtract"
      }
    },
    {
      href: "/tools/qr-code-generator.html",
      category: "share",
      priority: 10,
      keywords: {
        ja: "qr qrコード url wifi 共有 配布 案内",
        en: "qr qr-code url wifi sharing distribution guide"
      }
    },
    {
      href: "/tools/url-shortener.html",
      category: "share",
      priority: 11,
      keywords: {
        ja: "url 短縮 整形 トラッキング markdown html リンク",
        en: "url shortener cleanup tracking markdown html link"
      }
    },
    {
      href: "/tools/favicon-og-generator.html",
      category: "share",
      priority: 12,
      keywords: {
        ja: "og ogp favicon ファビコン プレビュー sns web",
        en: "og ogp favicon preview social web"
      }
    },
    {
      href: "/tools/music-generator.html",
      category: "creative",
      priority: 13,
      keywords: {
        ja: "音楽 bgm テンポ 生成 作曲 クリエイティブ",
        en: "music bgm tempo compose generator creative"
      }
    }
  ];

  const CATEGORY_ORDER = ["all", "image", "doc", "calc", "share", "creative"];
  const HOMEPAGE_PATHS = new Set(["/", "/index.html"]);
  const TOOLS_INDEX_PATHS = new Set(["/tools/", "/tools/index.html"]);

  const UI_COPY = {
    ja: {
      searchLabel: "ツールを探す",
      searchPlaceholder: "例: PDF、画像、QR、単位、JSON",
      all: "すべて",
      image: "画像・デザイン",
      doc: "文書・データ",
      calc: "計算・変換",
      share: "共有・配布",
      creative: "作成・音",
      count: "{count}件を表示中",
      empty: "一致するツールがありません。別のキーワードやカテゴリで試してください。",
      sortLabel: "並び順",
      sortFeatured: "おすすめ順",
      sortAZ: "名前順",
      resultSummary: "用途に近いカテゴリから探せるように並べています。"
    },
    en: {
      searchLabel: "Find a tool",
      searchPlaceholder: "Try PDF, image, QR, unit, JSON",
      all: "All",
      image: "Image & Design",
      doc: "Docs & Data",
      calc: "Calculators",
      share: "Sharing",
      creative: "Creative",
      count: "{count} tools shown",
      empty: "No matching tools. Try another keyword or category.",
      sortLabel: "Sort",
      sortFeatured: "Recommended",
      sortAZ: "Name",
      resultSummary: "Cards are grouped to help you move through a workflow, not just a flat list."
    }
  };

  const STATIC_COPY = {
    ja: {
      heroPrimaryCta: "一覧から選ぶ",
      heroSecondaryCta: "組み合わせを見る",
      trustFastLabel: "Start fast",
      trustFastBody: "登録なしで、必要な作業からすぐ始められます。",
      trustWorkflowLabel: "Workflows",
      trustWorkflowBody: "画像整理、共有準備、文書整形まで関連ツールを横断しやすくしました。",
      trustBrowserLabel: "Browser based",
      trustBrowserBody: "多くの処理をブラウザ中心で進められるので、軽い確認や前処理に向いています。",
      heroPanelTitle: "よくある入口",
      listSupport: "カテゴリとキーワードで絞り込んで、いまの作業に近い入口をすぐ見つけられます。",
      categoryImage: "画像・デザイン",
      categoryDocs: "文書・データ",
      categoryCalc: "計算・確認",
      categoryShare: "共有・Web",
      categoryCreative: "クリエイティブ",
      badgeFeatured: "主力",
      badgeWorkflow: "作業向け",
      badgePopular: "人気",
      tagResize: "リサイズ",
      tagMergeSplit: "結合・分割",
      tagCompress: "圧縮",
      tagTransparent: "透過",
      tagBusinessDays: "営業日",
      tagAge: "年齢",
      pathwayTitle: "組み合わせで使う",
      pathwayLead: "1つずつ開くより、前処理から共有までの流れで見ると必要なツールが選びやすくなります。よくある導線を並べました。",
      pathwayVisualTitle: "SNS画像と共有素材を整える",
      pathwayVisualBody: "画像変換で容量を整え、画像サイズ変換で比率を合わせ、必要に応じて背景リムーバーやOG画像生成へ進む流れです。",
      pathwayDocsTitle: "文書とデータを公開前に整える",
      pathwayDocsBody: "PDF整理、データ形式の統一、表記や文字数の確認を順番に行うと、提出前や掲載前の手戻りを減らせます。",
      pathwayShareTitle: "リンク配布と案内をまとめる",
      pathwayShareBody: "URLを整形してからQRコード化すると、資料配布、店舗案内、イベント共有の導線を短く保てます。",
      pathwayOpsTitle: "日常の小さな確認をまとめる",
      pathwayOpsBody: "単位換算、日付確認、PDF処理をブラウザ内で済ませたいときの定番セットです。見積もりや資料準備の前段に向いています。",
      homepageLeadEyebrow: "用途から選ぶ",
      homepageLeadTitle: "作業の流れに沿って探しやすくする",
      homepageLeadBody: "画像、文書、共有、計算のまとまりから入れるようにして、使い終わった後の次のツールにもつながりやすくします。",
      homepageClusterImageTitle: "画像・SNS素材",
      homepageClusterImageText: "画像変換、背景除去、色抽出、OGP作成までをまとめて進められます。",
      homepageClusterDocTitle: "文書・データ整形",
      homepageClusterDocText: "PDF、JSON、CSV、YAML、Excel、テキスト整形をまとめて扱えます。",
      homepageClusterCalcTitle: "日常計算・業務計算",
      homepageClusterCalcText: "単位変換、日付計算、サイズ確認など、迷いやすい換算作業をすばやく片付けられます。",
      homepageQuickTitle: "よく使われる入口"
    },
    en: {
      heroPrimaryCta: "Browse tools",
      heroSecondaryCta: "See pathways",
      trustFastLabel: "Start fast",
      trustFastBody: "Open the tool you need right away without account setup in front of it.",
      trustWorkflowLabel: "Workflows",
      trustWorkflowBody: "Related tools are arranged so you can move from prep to cleanup to sharing.",
      trustBrowserLabel: "Browser based",
      trustBrowserBody: "Most tasks stay in the browser, which makes the set useful for quick checks and light prep work.",
      heroPanelTitle: "Popular starting points",
      listSupport: "Filter by category and keyword to jump straight to the closest tool for the job.",
      categoryImage: "Image & Design",
      categoryDocs: "Docs & Data",
      categoryCalc: "Calculators",
      categoryShare: "Sharing & Web",
      categoryCreative: "Creative",
      badgeFeatured: "Core pick",
      badgeWorkflow: "Work ready",
      badgePopular: "Popular",
      tagResize: "Resize",
      tagMergeSplit: "Merge & split",
      tagCompress: "Compress",
      tagTransparent: "Transparent",
      tagBusinessDays: "Business days",
      tagAge: "Age",
      pathwayTitle: "Use tools in sequence",
      pathwayLead: "It is often easier to pick the right tool when you look at the full flow from prep to publishing. These are common paths.",
      pathwayVisualTitle: "Prepare social images and web assets",
      pathwayVisualBody: "Start with image conversion, match the output ratio, then move into background cleanup or OG image work only when needed.",
      pathwayDocsTitle: "Clean up documents and data before publishing",
      pathwayDocsBody: "Handle PDF cleanup, normalize data formats, and finish with text checks to reduce rework before delivery.",
      pathwayShareTitle: "Package links for distribution",
      pathwayShareBody: "Clean the URL first, then turn it into a QR code for handouts, location guides, or event sharing.",
      pathwayOpsTitle: "Bundle small office checks",
      pathwayOpsBody: "Use unit conversion, date calculation, and PDF processing together before estimates, forms, or internal documents.",
      homepageLeadEyebrow: "Browse by workflow",
      homepageLeadTitle: "Pick tools by the job you are trying to finish",
      homepageLeadBody: "The hub groups tools by image work, document cleanup, sharing, and calculation so the next useful tool is easier to find.",
      homepageClusterImageTitle: "Image and social assets",
      homepageClusterImageText: "Move from conversion to background cleanup, color checks, and OGP asset prep in one path.",
      homepageClusterDocTitle: "Documents and structured data",
      homepageClusterDocText: "Handle PDF work, JSON, CSV, YAML, Excel, and text cleanup together.",
      homepageClusterCalcTitle: "Everyday and business calculations",
      homepageClusterCalcText: "Quickly finish unit conversion, date math, and size checks without jumping between sites.",
      homepageQuickTitle: "Popular starting points"
    }
  };

  function getLanguage() {
    if (window.NegiI18n && typeof window.NegiI18n.getLanguage === "function") {
      return window.NegiI18n.getLanguage() === "en" ? "en" : "ja";
    }
    try {
      const lang = new URLSearchParams(window.location.search).get("lang");
      if (lang === "en") return "en";
    } catch (_) {}
    return document.documentElement.lang === "en" ? "en" : "ja";
  }

  function normalizePath(href) {
    try {
      return new URL(href, window.location.origin).pathname;
    } catch (_) {
      return href;
    }
  }

  function compareByName(left, right) {
    const leftName = (left.querySelector("h3") || left).textContent.trim();
    const rightName = (right.querySelector("h3") || right).textContent.trim();
    return leftName.localeCompare(rightName, getLanguage());
  }

  function getToolMeta(card) {
    const href = card.getAttribute("href") || card.getAttribute("data-tool-url") || "";
    const path = normalizePath(href);
    return TOOL_META.find((tool) => tool.href === path) || null;
  }

  function initializeCards(cards) {
    return cards.filter((card) => {
      const meta = getToolMeta(card);
      if (!meta) return false;

      const titleNode = card.querySelector("h3");
      const descriptionNode = card.querySelector("p");
      const existingText = [titleNode, descriptionNode]
        .filter(Boolean)
        .map((node) => node.textContent.trim())
        .join(" ");

      card.setAttribute("data-tool-card", "true");
      card.setAttribute("data-tool-category", meta.category);
      card.setAttribute("data-tool-priority", String(meta.priority));
      card.setAttribute(
        "data-tool-search",
        (existingText + " " + meta.keywords.ja + " " + meta.keywords.en).toLowerCase()
      );
      return true;
    });
  }

  function applyStaticCopy(lang) {
    const copy = STATIC_COPY[lang];
    document.querySelectorAll("[data-tool-index-static]").forEach((node) => {
      const key = node.getAttribute("data-tool-index-static");
      if (copy[key]) {
        node.textContent = copy[key];
      }
    });
  }

  function createFilterButton(category, activeCategory, copy) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.toolCategoryFilter = category;
    button.className = [
      "rounded-full",
      "border",
      "px-3",
      "py-2",
      "text-sm",
      "font-semibold",
      "transition",
      activeCategory === category
        ? "border-accent bg-accent text-white"
        : "border-gray-300 bg-white text-gray-700 hover:border-accent hover:bg-accent/10"
    ].join(" ");
    button.textContent = copy[category];
    return button;
  }

  function createControlsContainer(parent, className, beforeNode) {
    const container = document.createElement("section");
    container.dataset.toolIndexControls = "true";
    container.className = className;
    if (beforeNode) {
      parent.insertBefore(container, beforeNode);
    } else {
      parent.insertBefore(container, parent.firstChild);
    }
    return container;
  }

  function mountHomepageLead(section, lang) {
    var inner = section.querySelector(".max-w-7xl") || section;
    if (inner.querySelector("[data-homepage-tool-lead]")) return;

    const copy = STATIC_COPY[lang];
    const wrapper = document.createElement("section");
    wrapper.dataset.homepageToolLead = "true";
    wrapper.className = "mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)] lg:items-start";

    const intro = document.createElement("div");
    intro.className = "rounded-2xl border border-gray-200 bg-gray-50 p-6";
    intro.innerHTML = [
      '<p class="text-sm font-semibold text-accent"></p>',
      '<h3 class="mt-3 text-2xl font-bold text-gray-950"></h3>',
      '<p class="mt-3 text-sm leading-7 text-gray-600"></p>'
    ].join("");
    intro.children[0].textContent = copy.homepageLeadEyebrow;
    intro.children[1].textContent = copy.homepageLeadTitle;
    intro.children[2].textContent = copy.homepageLeadBody;

    const clusters = document.createElement("div");
    clusters.className = "grid gap-4 sm:grid-cols-3 lg:grid-cols-1";

    [
      {
        keyTitle: "homepageClusterImageTitle",
        keyText: "homepageClusterImageText",
        href: "/tools/image-converter.html"
      },
      {
        keyTitle: "homepageClusterDocTitle",
        keyText: "homepageClusterDocText",
        href: "/tools/pdf-tool.html"
      },
      {
        keyTitle: "homepageClusterCalcTitle",
        keyText: "homepageClusterCalcText",
        href: "/tools/unit-converter.html"
      }
    ].forEach((item) => {
      const link = document.createElement("a");
      link.href = item.href;
      link.className = "block rounded-xl border border-gray-200 bg-white p-5 transition hover:border-accent hover:shadow-sm";

      const title = document.createElement("p");
      title.className = "text-sm font-bold text-gray-950";
      title.textContent = copy[item.keyTitle];

      const text = document.createElement("p");
      text.className = "mt-2 text-sm leading-6 text-gray-600";
      text.textContent = copy[item.keyText];

      link.append(title, text);
      clusters.appendChild(link);
    });

    wrapper.append(intro, clusters);

    const header = inner.querySelector("header");
    if (header && header.parentElement === inner) {
      inner.insertBefore(wrapper, header.nextSibling);
    } else {
      inner.insertBefore(wrapper, inner.firstChild);
    }
  }

  function initDirectory(options) {
    const {
      cards,
      parent,
      beforeNode,
      controlsClassName,
      emptyClassName,
      allowSort,
      onLanguageChange
    } = options;

    if (!cards.length || parent.querySelector("[data-tool-index-controls]")) return;

    const liveCards = initializeCards(cards);
    if (!liveCards.length) return;

    const controls = createControlsContainer(parent, controlsClassName, beforeNode || null);
    const empty = document.createElement("p");
    empty.dataset.toolIndexEmpty = "true";
    empty.className = emptyClassName;
    parent.appendChild(empty);

    let activeCategory = "all";
    let query = "";
    let sortMode = "featured";

    function sortCards(visibleCards) {
      const sorted = visibleCards.slice().sort((left, right) => {
        if (sortMode === "az") return compareByName(left, right);
        const leftPriority = Number(left.getAttribute("data-tool-priority") || "999");
        const rightPriority = Number(right.getAttribute("data-tool-priority") || "999");
        if (leftPriority !== rightPriority) return leftPriority - rightPriority;
        return compareByName(left, right);
      });

      sorted.forEach((card) => {
        card.parentElement.appendChild(card);
      });
    }

    function applyFilter() {
      const copy = UI_COPY[getLanguage()];
      const visibleCards = [];

      liveCards.forEach((card) => {
        const categoryMatch = activeCategory === "all" || card.getAttribute("data-tool-category") === activeCategory;
        const queryMatch = !query || (card.getAttribute("data-tool-search") || "").includes(query);
        const visible = categoryMatch && queryMatch;
        card.classList.toggle("hidden", !visible);
        if (visible) visibleCards.push(card);
      });

      sortCards(visibleCards);

      const count = controls.querySelector("[data-tool-index-count]");
      if (count) count.textContent = copy.count.replace("{count}", String(visibleCards.length));

      empty.textContent = copy.empty;
      empty.classList.toggle("hidden", visibleCards.length !== 0);
    }

    function renderControls() {
      const lang = getLanguage();
      const copy = UI_COPY[lang];

      const label = document.createElement("label");
      label.className = "block text-sm font-semibold text-gray-900";
      label.setAttribute("for", parent.getAttribute("id") === "tools" ? "home-tool-search" : "tool-search");
      label.textContent = copy.searchLabel;

      const intro = document.createElement("p");
      intro.className = "mt-1 text-sm text-gray-600";
      intro.textContent = copy.resultSummary;

      const topRow = document.createElement("div");
      topRow.className = "mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]";

      const input = document.createElement("input");
      input.id = label.getAttribute("for");
      input.type = "search";
      input.value = query;
      input.placeholder = copy.searchPlaceholder;
      input.className = "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
      input.addEventListener("input", () => {
        query = input.value.toLowerCase().trim();
        applyFilter();
      });
      topRow.appendChild(input);

      if (allowSort) {
        const sortWrap = document.createElement("div");
        sortWrap.className = "flex items-center gap-3";

        const sortLabel = document.createElement("label");
        sortLabel.className = "text-sm font-semibold text-gray-700";
        sortLabel.setAttribute("for", "tool-sort");
        sortLabel.textContent = copy.sortLabel;

        const sortSelect = document.createElement("select");
        sortSelect.id = "tool-sort";
        sortSelect.className = "rounded-lg border border-gray-300 px-3 py-3 text-sm text-gray-700 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

        [
          { value: "featured", label: copy.sortFeatured },
          { value: "az", label: copy.sortAZ }
        ].forEach((optionMeta) => {
          const option = document.createElement("option");
          option.value = optionMeta.value;
          option.textContent = optionMeta.label;
          option.selected = sortMode === optionMeta.value;
          sortSelect.appendChild(option);
        });

        sortSelect.addEventListener("change", () => {
          sortMode = sortSelect.value;
          applyFilter();
        });

        sortWrap.append(sortLabel, sortSelect);
        topRow.appendChild(sortWrap);
      }

      const filters = document.createElement("div");
      filters.className = "mt-4 flex flex-wrap gap-2";
      filters.setAttribute("role", "list");
      filters.setAttribute("aria-label", lang === "ja" ? "ツールカテゴリ" : "Tool categories");

      CATEGORY_ORDER.forEach((category) => {
        const button = createFilterButton(category, activeCategory, copy);
        button.addEventListener("click", () => {
          activeCategory = category;
          renderControls();
          applyFilter();
        });
        filters.appendChild(button);
      });

      const count = document.createElement("p");
      count.className = "mt-4 text-xs text-gray-500";
      count.dataset.toolIndexCount = "true";

      controls.replaceChildren(label, intro, topRow, filters, count);
    }

    renderControls();
    applyFilter();

    window.addEventListener("languageChanged", () => {
      renderControls();
      applyFilter();
      if (typeof onLanguageChange === "function") onLanguageChange();
    });
  }

  function initHomepageHub() {
    if (!HOMEPAGE_PATHS.has(window.location.pathname)) return;

    applyStaticCopy(getLanguage());
    const toolsSection = document.getElementById("tools");
    if (!toolsSection) return;

    mountHomepageLead(toolsSection, getLanguage());

    const cardGrid = toolsSection.querySelector("article[role='list']");
    if (!cardGrid) return;

    const cards = Array.from(cardGrid.querySelectorAll(".tool-card[data-tool-url]"));
    initDirectory({
      cards,
      parent: toolsSection.querySelector(".max-w-7xl") || toolsSection,
      beforeNode: cardGrid,
      controlsClassName: "mb-8 rounded-xl border border-gray-200 bg-white p-5",
      emptyClassName: "hidden mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-5 text-center text-sm text-gray-600",
      allowSort: false,
      onLanguageChange: function () {
        applyStaticCopy(getLanguage());
      }
    });
  }

  function initToolsIndexHub() {
    if (!TOOLS_INDEX_PATHS.has(window.location.pathname)) return;

    applyStaticCopy(getLanguage());
    const grid = document.querySelector("[data-tool-directory-grid]");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('a[href^="/tools/"], a[href^="tools/"]'));
    initDirectory({
      cards,
      parent: grid.parentElement,
      beforeNode: grid,
      controlsClassName: "mt-8 rounded-xl border border-gray-200 bg-white p-5",
      emptyClassName: "hidden mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-5 text-center text-sm text-gray-600",
      allowSort: true,
      onLanguageChange: function () {
        applyStaticCopy(getLanguage());
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHomepageHub();
    initToolsIndexHub();
  });
})();
