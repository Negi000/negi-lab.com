# GameWiki outside scope: monetization refactor plan

Date: 2026-05-09 JST
Repository: `E:\negi-lab.com\negi-lab.com`
Scope: all public pages and tools except generated GameWiki content under `gamewiki/`.

## Executive Summary

The site is stable enough to plan the next monetization pass, but the current architecture still mixes SEO, ads, affiliate fallback, translation, and tool UI concerns in page-level HTML. The biggest revenue risk is not simply "more ads"; it is that the current AdSense/Rakuten runtime is complex enough to break rendering again and weak enough that affiliate widgets may not match page intent.

The next refactor should make the site feel like a coherent tool product first, then monetize that product with restrained, testable placements.

Primary goals:

1. Keep the whiteout fix permanent with automated browser checks before every ad change.
2. Centralize SEO, CSP, AdSense, and affiliate configuration so pages do not drift.
3. Convert article-like SEO expansion into compact, tool-native help blocks that do not clash with the portal style.
4. Replace generic Rakuten fallback behavior with official-source, page-intent affiliate components.
5. Upgrade the highest-intent tools to competitor-level quality using workers, WASM/WebGPU only where they actually improve client-side capability.

## Current Evidence

Commands run during this audit:

- `npm run validate` -> passed.
- Git-file audit excluding `gamewiki/` via `git ls-files -z`.
- HTML metadata and sitemap scan.
- Tool feature surface scan.
- Chrome headless screenshots:
  - `C:\Users\vocal\AppData\Local\Temp\negi-lab-audit\home-desktop.png`
  - `C:\Users\vocal\AppData\Local\Temp\negi-lab-audit\image-mobile.png`

Key local findings:

- 29 non-GameWiki HTML files are tracked.
- `sitemap.xml` has 132 URLs, but only 18 non-GameWiki URLs.
- Non-GameWiki pages missing from the sitemap include `tools/color-code-tool-clean.html`, `tools/text-converter-new.html`, `tools/next-gen-ai-music-composer.html`, `combat_mechanics.html`, and test pages.
- `npm run validate` passes, but the validator does not yet catch all revenue-critical issues.
- 17 non-GameWiki pages still have metadata or indexing issues, mostly weak descriptions, missing OGP images, utility pages, or redirect/test pages.
- Several major tools use manual AdSense slots inconsistently; `tools/pdf-tool.html`, `tools/bg-remover.html`, and `tools/favicon-og-generator.html` currently have no manual slot in the page HTML.
- `js/ads-consent-loader.js` is doing too many jobs: consent state, AdSense loading, dynamic slot injection, whiteout/overlay guarding, Google Analytics, and Rakuten fallback rendering.
- Rakuten fallback uses a generic Motion Widget assembled from variables in an iframe `srcdoc`; this is likely less reliable for contextual relevance than an official generated source pasted with page-specific target text.
- No tracked `.wasm` file is currently present, despite prior product direction around WASM/WebGPU. WebGPU is only detected in the image converter HTML surface and does not yet appear to be a real acceleration path.
- Mobile screenshot of `tools/image-converter.html` shows the page title overflows/crops at 390px width. This is a direct UX issue and also a sign that the shared tool header is not responsive enough.

## External Best-Practice Constraints

Use these as hard constraints for implementation:

- AdSense Auto ads should be configured from the AdSense UI and the code should be present across the site; Google recommends using preview, experiments, excluded areas, page exclusions, and ad-load controls before applying broadly. Source: https://support.google.com/adsense/answer/9261307
- AdSense placements must avoid accidental clicks, misleading headings, unnatural attention, and tight proximity to interactive controls. Google allows ad labels such as "Advertisements" or "Sponsored Links". Source: https://support.google.com/adsense/answer/1346295
- Paid or affiliate links should use `rel="sponsored"`; `nofollow` is still acceptable, but `sponsored` is preferred for paid relationships. Source: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links
- SEO titles should be unique, concise, and accurately describe each page; snippets are influenced by real page content and meta descriptions. Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Amazon Associates links must use the special link formats/tools provided by Amazon. Source: https://affiliate-program.amazon.com/help/operating/agreement/ and Japanese program overview https://affiliate.amazon.co.jp/
- Rakuten Affiliate's official guide emphasizes copying generated link/widget source and supports target text for Motion Widget context via `rakuten_ad_target_begin` / `rakuten_ad_target_end`. Source: https://affiliate.rakuten.co.jp/guides/link/

## Main Problems

### 1. Monetization runtime is too fragile

`js/ads-consent-loader.js` currently owns consent, GA, AdSense, overlay guards, dynamic slots, and Rakuten fallback. This caused the recent whiteout debugging to be hard because one runtime had too many side effects.

Fix direction:

- Split into:
  - `js/consent-runtime.js`
  - `js/adsense-runtime.js`
  - `js/ad-overlay-guardian.js`
  - `js/affiliate-runtime.js`
  - `js/revenue-config.js`
- Keep the current whiteout/overlay guardian but isolate it and test it on every page type.
- Make AdSense loading idempotent and observable with explicit state attributes.
- No dynamic ad insertion near upload areas, buttons, forms, canvas controls, or music playback controls.

### 2. Manual and Auto AdSense are not inventory-managed

The site mixes manual slots per page and Auto ads through the consent loader. Some tools have 2 slots, some 1, some 0. The layout does not yet have a single slot map tied to page type.

Fix direction:

- Define a page-type slot map:
  - Home: one mid-page display slot after the purpose section, one lower display slot after tool cards.
  - Tool landing: one display slot after intro/help cards, one lower slot after the tool result area or before FAQ.
  - Heavy interactive tools: no ad immediately adjacent to upload/drop zone, generate/download buttons, media playback, QR download buttons, or file output controls.
  - Legal/utility/noindex pages: no ads.
- Use Auto ads for in-page discovery but set account-level exclusions for header, first viewport hero, interactive panels, and any area that has caused whiteout or accidental-click risk.
- Keep manual slots as stable revenue anchors; use Auto ads as supplemental, not as the main source of layout control.
- Change ad labels to a consistent Japanese/English-safe pattern: `広告` for Japanese UI and `Advertisements` for English UI, or keep `Sponsored Links` only where the page language is English.

### 3. Rakuten affiliate integration is probably not best practice

The current Rakuten fallback constructs a generic widget using:

- `rakuten_affiliateId`
- `rakuten_items='ctsmatch'`
- `rakuten_auto_mode='on'`
- a shared timestamp
- an iframe `srcdoc`

This avoids the earlier `document.write` page break risk, but it also removes or weakens page context unless the iframe contains page-specific target text. Official Rakuten guidance points toward copying the generated source and optionally surrounding target text with the Rakuten target comments.

Fix direction:

- Create `config/affiliate-map.json` with page-specific categories, search intent, and approved Rakuten/Amazon placements.
- Use official generated Rakuten source snippets or generated static wrappers that preserve the official variables exactly.
- For Motion Widget fallback, include page-specific target text inside the iframe:
  - `<!-- rakuten_ad_target_begin -->`
  - keyword-rich Japanese text for the tool's user intent
  - `<!-- rakuten_ad_target_end -->`
- Prefer native affiliate cards for high-intent pages over generic widgets:
  - image tools: storage, SD cards, photo printers, design software books
  - PDF/document tools: scanners, document organizers, PDF/editing software books
  - music tool: MIDI keyboards, headphones, audio interfaces, DTM books
  - QR/favicon/OGP tools: small-business design/printing items
- Every affiliate link gets `rel="sponsored nofollow noopener"` and clear affiliate disclosure near the first affiliate block.
- Do not use hidden cookie pixels, invisible redirects, or auto-open affiliate windows.

### 4. SEO structure is partially strong but inconsistent

The newer tool pages have JSON-LD, canonical URLs, OGP, and FAQ/HowTo structure. Older utility pages, redirects, and legal pages are inconsistent. Some pages use `favicon.ico` as OGP image, which is weak for sharing and search presentation.

Fix direction:

- Add a centralized metadata generator or data file:
  - page title
  - meta description
  - canonical URL
  - OGP image
  - Twitter image
  - robots
  - JSON-LD types
  - ad policy for the page
  - affiliate policy for the page
- Generate or maintain one 1200x630 OGP image per major tool category, not `favicon.ico`.
- Decide indexability:
  - Index: home, tools index, mature tool pages, about.
  - Noindex: test pages, redirect shims, verification pages, legal pages, old moved pages.
  - Remove from sitemap: noindex/test/redirect pages.
- Convert article-style expansion into compact tool-native sections:
  - "使いどころ"
  - "よくある失敗"
  - "おすすめ設定"
  - "形式別の選び方"
  - "FAQ"
- Keep these sections below the tool, not above it, so the first screen remains usable.

### 5. Visual and usability consistency still needs a product shell

The top page is cleaner now, but tool pages still vary in density, heading behavior, card style, ad spacing, and control layout. The mobile image-converter title crop is a concrete responsive defect.

Fix direction:

- Build a shared tool shell pattern:
  - breadcrumb
  - compact tool hero
  - three trust/usage hints
  - safe ad slot
  - primary tool panel
  - result panel
  - related tools
  - FAQ/help
- Add global rules:
  - `overflow-wrap:anywhere` or `text-wrap:balance` for long H1s.
  - maximum H1 sizes per viewport.
  - `max-width:100vw` and no horizontal overflow checks.
  - consistent spacing around ad slots.
- Replace emoji-heavy feature cards with small icons or text badges where visual style feels inconsistent.
- Keep cards to actual repeated items and tool panels; avoid nested card-on-card layouts.

### 6. Tools need targeted upgrades, not scattered complexity

Priority ranking by revenue/search intent:

1. Image converter and background remover
2. PDF tool
3. QR code generator and favicon/OGP generator
4. JSON/CSV/YAML/Excel converter
5. Unit/date/text converters
6. Music generator

Upgrade plan by tool:

- Image converter:
  - Web Worker pipeline for batch conversions.
  - Better queue, progress, cancel, zip download, before/after compare.
  - WebGPU only for preview filters or segmentation when a real fallback exists.
  - Fix mobile heading overflow first.
- Background remover:
  - Decide whether to ship a real WASM/ONNX segmentation path or position it as a simple browser mask tool.
  - Add clear quality levels and processing limits.
- PDF tool:
  - Add manual ad slot after intro or after output, not near file controls.
  - Add merge/split/reorder/rotate/compress metadata states.
  - Use workers for large files if feasible.
- QR code generator:
  - Already feature-rich; polish presets, export quality, templates, accessibility labels, and bulk export.
- Favicon/OGP generator:
  - Add template gallery and direct OGP preview.
  - Cross-link with Amazon/Rakuten affiliate cards for design/printing/software only below core tool flow.
- JSON/CSV/YAML/Excel:
  - Load `xlsx` lazily because it is 881 KB.
  - Add validation diagnostics and row/column preview.
- Music generator:
  - Lazy-load Tone.js.
  - Make it a true composition scratchpad: patterns, export MIDI/WAV, presets, explain controls.
  - Affiliate fit: headphones, MIDI keyboard, DTM books/software below tool.

### 7. Translation needs a single source of truth

Translation is spread across many files and some pages encode Japanese as HTML entities. This works but makes quality and consistency hard to review.

Fix direction:

- Move copy into a structured `config/i18n/*.json` or build-time manifest.
- Validate missing keys and fallback text.
- Keep static title/meta server-visible in HTML; do not depend on runtime translation for critical SEO text.
- Add Japanese/English style rules:
  - no machine-translated awkward copy
  - consistent tool names
  - consistent ad/affiliate disclosure labels
  - consistent privacy wording

## Implementation Phases

### Phase 0: Guardrails before revenue changes

Files:

- `scripts/validate-site.js`
- new `scripts/audit-render.js`
- new `scripts/audit-monetization.js`

Tasks:

1. Add validation for no horizontal overflow on key pages.
2. Add validation for blank body/main after a delay.
3. Add validation for ad script presence and page-type ad caps.
4. Add validation for affiliate `rel` attributes.
5. Add validation that noindex pages are excluded from sitemap.
6. Add validation that every indexed page has title, description, canonical, OGP, and Twitter image.

Exit criteria:

- `npm run validate` catches the issues listed in this plan.
- A browser smoke script checks desktop and mobile for home plus all tools.

### Phase 1: SEO and routing cleanup

Files:

- `sitemap.xml`
- `robots.txt`
- all non-GameWiki HTML heads
- `config/site-config.json`

Tasks:

1. Remove test, redirect, verification, and moved pages from sitemap.
2. Add `noindex`/canonical discipline for utility pages.
3. Add category OGP images and stop using `favicon.ico` for major tools.
4. Fix weak descriptions for date, unit, music, legal, and redirect pages.
5. Resolve whether `combat_mechanics.html` belongs to GameWiki flow; if yes, noindex or move out of this repo's public SEO surface.

### Phase 2: AdSense architecture refactor

Files:

- `js/ads-consent-loader.js`
- new split runtime files
- `config/revenue-config.json`
- all tool HTML pages with manual ad slots

Tasks:

1. Split the current ad runtime into focused modules.
2. Define per-page ad slot inventory.
3. Add page-level `data-page-type` and `data-ad-policy` attributes.
4. Keep manual slots stable and outside interactive controls.
5. Use Auto ads with account-side excluded areas and experiments.
6. Keep the overlay/whiteout guardian active but isolated.
7. Add a rollback flag that disables overlays without disabling all display ads.

### Phase 3: Affiliate architecture

Files:

- new `config/affiliate-map.json`
- new `js/affiliate-runtime.js`
- new shared affiliate disclosure component
- privacy/terms/about pages

Tasks:

1. Add a site-wide affiliate disclosure and page-level disclosure near affiliate blocks.
2. Build native affiliate card components with page-specific copy.
3. Use Amazon links only from Amazon's official tools/link formats.
4. Use Rakuten links/widgets only from official source or preserved variable templates.
5. Add Rakuten target text per page for Motion Widget placements.
6. Validate `rel="sponsored nofollow noopener"` and `target="_blank"` for outbound affiliate links.
7. Track placements with simple UTM-like internal labels where allowed, without cloaking.

### Phase 4: Shared visual system

Files:

- `assets/css/negi-tailwind.css` source/build flow
- shared header/footer/tool shell snippets or generator
- all tool pages

Tasks:

1. Fix mobile H1 wrapping and horizontal overflow across all pages.
2. Normalize tool hero, trust hints, ad spacing, panel spacing, and FAQ layout.
3. Ensure consent banner does not cover primary CTAs or output controls on mobile.
4. Standardize buttons, inputs, file drop areas, result states, and loading/progress states.
5. Add related-tool blocks that feel like product navigation, not blog cards.

### Phase 5: Tool upgrades

Tasks:

1. Image converter: worker queue, batch zip, cancel, better compare.
2. Background remover: real client-side segmentation plan or honest simpler positioning.
3. PDF tool: reorder/rotate/merge/split polish, output preview, safe ad slot.
4. QR generator: template polish and bulk export.
5. JSON/CSV/YAML/Excel: lazy libraries and diagnostics.
6. Favicon/OGP: templates and real social preview.
7. Music generator: lazy audio stack, MIDI export, better presets.

### Phase 6: Revenue experiments

Tasks:

1. Create a placement experiment matrix:
  - home mid-page vs lower-page
  - tool intro slot vs post-result slot
  - affiliate native cards vs Rakuten widget fallback
2. Track by page type and placement ID.
3. Review revenue, CLS, bounce, and tool-completion signals together.
4. Keep a one-click rollback for any placement that risks whiteout, accidental clicks, or bad UX.

## Execution Order

Recommended first implementation batch:

1. Add monetization/render validator gates.
2. Fix mobile overflow and shared tool heading rules.
3. Clean noindex/sitemap/OGP/title-description issues.
4. Split ad runtime enough to isolate whiteout guard from ad loading.
5. Replace Rakuten fallback with page-specific official-source wrapper.
6. Add affiliate disclosure and validation.
7. Upgrade image converter and PDF tool first because they have the strongest utility/search intent.

## Definition of Done

- `npm run validate` passes and catches the new monetization/SEO rules.
- Chrome/browser smoke checks pass for desktop and mobile on every non-GameWiki public page.
- No page whites out after 30 seconds with consent accepted.
- Indexed pages have complete title, description, canonical, OGP, Twitter image, and structured data where appropriate.
- Manual AdSense slots are visible as reserved space and never adjacent to high-risk controls.
- Auto ads are enabled in AdSense UI but constrained with excluded areas/page exclusions.
- Rakuten/Amazon affiliate links use official source/link formats and `rel="sponsored nofollow noopener"`.
- Affiliate disclosure is visible before or near monetized links.
- Tool pages share one coherent product UI system.
