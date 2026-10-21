# Converter libraries and Node security update - 2026-10-22

The public JSON/CSV/YAML/Excel converter used SheetJS 0.18.5 and js-yaml 4.1.0. Replace them with official SheetJS 0.20.3 and js-yaml 4.3.2, using new versioned local URLs. Remove the unreferenced old copies. Source URLs, versions and SHA-256 values are recorded in `js/vendor/converter-libraries.json`; upstream licenses are included beside the scripts. js-yaml's npm archive integrity was verified before extracting the browser build. SheetJS came from its official CDN archive with its package version checked.

The site's two Node workflows and `.node-version` now select Node 24.22.1, the security release announced on October 21. No unrelated tool markup, existing portal-refresh change, wiki images or other dirty work is part of this security change.

Validation completed locally using the official Node 24.22.1 Windows zip, checked against its official SHA-256 list and OpenJS Authenticode signature:

- `node scripts/validate-site.js`: passed, including JavaScript syntax and referenced assets.
- Read-only npm advisory bulk lookup for xlsx 0.20.3 and js-yaml 4.3.2: no matching advisories at verification time.
- Playwright Chromium, `http://127.0.0.1:5186/tools/json-csv-yaml-excel.html`, desktop 1280x800 and mobile 375x812: 13 checks passed. Browser plugin was unavailable, so the existing Playwright installation was used. The checks covered loaded library version/URLs, JSON to JSON/CSV/YAML, pasted CSV/YAML, Excel download and file re-import, JSON/YAML/CSV file input, English sample conversion, two viewport layouts and no application runtime errors.
- Normal data included Japanese text, commas and HTML-looking strings preserved as text. External font/ad requests were blocked during local functional QA; third-party ad integration was not revalidated.

QA evidence is in `E:\Meket_Night_Chronicle\tmp\security-remediation-20261022\converter-results.json` and the adjacent screenshots. Initial test-only expectation of a success message was corrected to assert the actual converted output: successful conversion deliberately clears the message box.

Status at the security commit: local implementation and automated QA complete; the user explicitly approved publishing only this converter and site Node configuration change. The existing dirty HTML body class remains in the worktree and is excluded from the security commit. Only the two library URL lines belong to this change in that file. Deployment and live verification are recorded after publication in the parent project's security remediation record.

Sources: [SheetJS installation](https://docs.sheetjs.com/docs/getting-started/installation/standalone/), [SheetJS CVE-2024-22363](https://cdn.sheetjs.com/advisories/CVE-2024-22363), [js-yaml advisory](https://github.com/nodeca/js-yaml/security/advisories/GHSA-2883-xcg3-v3hh), [Node security release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).
