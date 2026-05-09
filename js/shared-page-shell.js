(function () {
  "use strict";

  function ensureMainId(root) {
    const main = root.querySelector("main");
    if (main && !main.id) {
      main.id = "main-content";
    }
  }

  function markAdFrames(root) {
    root.querySelectorAll(".portal-ad-frame, .tool-ad-frame").forEach((frame) => {
      if (!frame.hasAttribute("data-ad-frame")) {
        frame.setAttribute("data-ad-frame", "true");
      }
    });
  }

  function syncStickyOffset(root) {
    const header = root.querySelector("header.sticky");
    const offset = header ? Math.round(header.getBoundingClientRect().height + 24) : 96;
    root.documentElement.style.setProperty("--portal-sticky-offset", offset + "px");
  }

  function applyShell() {
    const body = document.body;
    if (!body) return;

    if (body.hasAttribute("data-portal-refresh") || document.querySelector("[data-portal-shell]")) {
      body.classList.add("portal-refresh");
    }

    ensureMainId(document);
    markAdFrames(document);
    syncStickyOffset(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyShell, { once: true });
  } else {
    applyShell();
  }

  window.addEventListener("resize", function () {
    syncStickyOffset(document);
  });

  window.NegiSharedPageShell = {
    apply: applyShell
  };
})();
