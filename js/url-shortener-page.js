(function () {
  "use strict";

  const copy = {
    ja: {
      title: "URL短縮・共有リンク整形ツールの使い方",
      sections: [
        {
          title: "基本操作",
          items: [
            "元URLを入力し、必要に応じて追跡パラメータ削除とクエリ整理を選びます。",
            "「短縮・整形する」を押すと、整理済みURL、Markdownリンク、HTMLリンクを作成します。",
            "短縮URLの作成には外部APIを使うため、失敗した場合も整理済みURLを利用できます。"
          ]
        },
        {
          title: "共有前の確認",
          items: [
            "ログイン状態、検索条件、商品オプションなどに必要なクエリは削除しないでください。",
            "短縮URLはリンク先が見えにくくなるため、重要な案内では元URLのドメインも確認してください。",
            "印刷物やイベント導線には、整理済みURLをQRコード作成ツールへ渡すと扱いやすくなります。"
          ]
        }
      ]
    },
    en: {
      title: "How to use the URL shortener",
      sections: [
        {
          title: "Basic workflow",
          items: [
            "Enter the original URL, then choose whether to remove tracking parameters and sort query parameters.",
            "Click Shorten and Format to create a clean URL, Markdown link, and HTML link.",
            "Short URL creation uses an external API, so the cleaned URL remains usable even if shortening fails."
          ]
        },
        {
          title: "Before sharing",
          items: [
            "Do not remove query parameters required for login state, search filters, product options, or similar behavior.",
            "Short URLs hide the destination, so confirm the original domain when sharing important links.",
            "For print or event flows, send the cleaned URL to the QR code generator."
          ]
        }
      ]
    }
  };

  function language() {
    const selector = document.getElementById("lang-switch");
    if (selector && (selector.value === "ja" || selector.value === "en")) return selector.value;
    return document.documentElement.lang === "en" ? "en" : "ja";
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function renderGuide(content) {
    const data = copy[language()];
    const fragment = document.createDocumentFragment();
    const title = el("h2", "text-xl font-bold mb-4 text-accent", data.title);
    title.id = "guide-modal-title";
    fragment.appendChild(title);

    data.sections.forEach((section) => {
      fragment.appendChild(el("h3", "font-bold text-base mt-5 mb-2 text-gray-800", section.title));
      const list = el("ul", "list-disc ml-5 text-sm leading-6 text-gray-700 space-y-2");
      section.items.forEach((item) => {
        list.appendChild(el("li", "", item));
      });
      fragment.appendChild(list);
    });

    content.replaceChildren(fragment);
  }

  function bindGuide() {
    const button = document.getElementById("guide-btn");
    const modal = document.getElementById("guide-modal");
    const close = document.getElementById("guide-close");
    const content = document.getElementById("guide-modal-content");
    if (!button || !modal || !close || !content) return;
    let previousFocus = null;

    function focusableNodes() {
      return modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
    }

    function open() {
      previousFocus = document.activeElement;
      renderGuide(content);
      modal.setAttribute("aria-hidden", "false");
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      close.focus();
    }

    function hide() {
      modal.setAttribute("aria-hidden", "true");
      modal.classList.add("hidden");
      document.body.style.overflow = "";
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      } else {
        button.focus();
      }
    }

    button.addEventListener("click", open);
    close.addEventListener("click", hide);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) hide();
    });
    document.addEventListener("keydown", (event) => {
      if (modal.classList.contains("hidden")) return;
      if (event.key === "Escape") {
        hide();
        return;
      }
      if (event.key === "Tab") {
        const nodes = Array.from(focusableNodes()).filter((node) => !node.hasAttribute("disabled"));
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    window.addEventListener("languageChanged", () => {
      if (!modal.classList.contains("hidden")) renderGuide(content);
    });
  }

  function init() {
    bindGuide();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
