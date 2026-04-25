const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const failures = [];
const primaryToolPages = [
  'tools/bg-remover.html',
  'tools/color-code-tool.html',
  'tools/date-calculator.html',
  'tools/favicon-og-generator.html',
  'tools/image-converter.html',
  'tools/image-size-compare.html',
  'tools/json-csv-yaml-excel.html',
  'tools/music-generator.html',
  'tools/pdf-tool.html',
  'tools/qr-code-generator.html',
  'tools/text-converter.html',
  'tools/unit-converter.html',
  'tools/url-shortener.html',
];

const seoPages = [
  'index.html',
  'about.html',
  'privacy-policy.html',
  'privacy-policy-en.html',
  'privacy-policy-unified.html',
  'terms.html',
  'wiki-redirect.html',
  'tools/index.html',
  ...primaryToolPages,
];

const retiredToolRedirects = [
  {
    rel: 'tools/color-code-tool-clean.html',
    canonical: 'https://negi-lab.com/tools/color-code-tool.html',
    localTarget: '/tools/color-code-tool.html',
  },
  {
    rel: 'tools/next-gen-ai-music-composer.html',
    canonical: 'https://negi-lab.com/tools/music-generator.html',
    localTarget: '/tools/music-generator.html',
  },
  {
    rel: 'tools/text-converter-new.html',
    canonical: 'https://negi-lab.com/tools/text-converter.html',
    localTarget: '/tools/text-converter.html',
  },
];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function fail(message) {
  failures.push(message);
}

function walk(dir, matcher, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'gamewiki') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, matcher, out);
    else if (matcher(full)) out.push(full);
  }
  return out;
}

function validateJavaScriptSyntax() {
  const files = walk(root, (file) => file.endsWith('.js') && !/backup/i.test(path.basename(file)));
  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    try {
      new vm.Script(fs.readFileSync(file, 'utf8'), { filename: rel });
    } catch (error) {
      fail(`${rel}: JavaScript syntax error: ${error.message}`);
    }
  }
}

function validatePortalTranslations() {
  const html = read('index.html');
  const translations = read('js/portal-translations.js');
  const htmlKeys = [...html.matchAll(/data-translate(?:-html)?-key="([^"]+)"/g)].map((match) => match[1]);
  const dictKeys = new Set([...translations.matchAll(/"([^"]+)"\s*:/g)].map((match) => match[1]));
  const missing = [...new Set(htmlKeys.filter((key) => !dictKeys.has(key)))].sort();
  if (missing.length) {
    fail(`index.html: missing portal translation keys: ${missing.join(', ')}`);
  }
}

function validateLayoutGuardrails() {
  const files = walk(root, (file) => file.endsWith('.html'));
  const stripAllowedFooterTail = (html) => {
    let output = html;
    const modalStart = /<div\b[^>]*id=["'](?:guide-modal|guideModal)["'][^>]*>/gi;
    let match;
    while ((match = modalStart.exec(output))) {
      let depth = 1;
      let cursor = match.index + match[0].length;
      const divTag = /<\/?div\b[^>]*>/gi;
      divTag.lastIndex = cursor;
      let tag;
      while ((tag = divTag.exec(output))) {
        if (tag[0][1] === '/') depth -= 1;
        else depth += 1;
        if (depth === 0) {
          output = output.slice(0, match.index) + output.slice(divTag.lastIndex);
          modalStart.lastIndex = match.index;
          break;
        }
      }
      if (depth !== 0) break;
    }
    return output
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<template[\s\S]*?<\/template>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<link\b[^>]*>/gi, '')
      .replace(/<meta\b[^>]*>/gi, '')
      .replace(/<\/?(?:body|html)\b[^>]*>/gi, '')
      .trim();
  };

  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    if (/^(gamewiki|tools\/debug-test\.html|tools\/translation-test\.html|test-)/.test(rel)) continue;
    const text = fs.readFileSync(file, 'utf8');
    const footerCount = (text.match(/<footer\b/gi) || []).length;
    if (footerCount > 1) {
      fail(`${rel}: contains ${footerCount} footer elements`);
    }
    if (/id=["']dynamic-ad-template["']/i.test(text) || /document\.body\.appendChild\(clone\)/i.test(text)) {
      fail(`${rel}: contains legacy dynamic ad insertion that can create footer-tail whitespace`);
    }
    const footerEnd = text.toLowerCase().lastIndexOf('</footer>');
    if (footerEnd >= 0) {
      const visibleTail = stripAllowedFooterTail(text.slice(footerEnd + '</footer>'.length));
      if (/<(?:div|section|main|aside|nav|header|footer|p|h[1-6]|a|button|form|canvas|textarea|select)\b/i.test(visibleTail)) {
        fail(`${rel}: contains visible content after footer`);
      }
    }
  }
}

function validateCriticalTextIsReadable() {
  const criticalFiles = [
    'index.html',
    'index.js',
    'js/portal-translations.js',
    'js/tool-page-enhancements.js',
    'tools/unit-converter.html',
    'tools/index.html',
    'js/unit-converter-data.js',
    'js/unit-converter-translations.js',
    'js/unit-converter-core.js',
    ...primaryToolPages,
    'about.html',
    'privacy-policy.html',
    'privacy-policy-en.html',
    'privacy-policy-unified.html',
    'terms.html',
    'wiki-redirect.html',
  ];
  const mojibakePattern = /繝|縺|蜊|譁|螟|髮|隱|邨|荳|逕/;
  for (const rel of criticalFiles) {
    const file = path.join(root, rel);
    if (fs.existsSync(file)) {
      const text = fs.readFileSync(file, 'utf8');
      if (mojibakePattern.test(text)) fail(`${rel}: contains likely mojibake text`);
      if (/\?{4,}/.test(text)) fail(`${rel}: contains likely replacement-character text`);
    }
  }
}

function validateSeoMetadata() {
  const required = [
    { pattern: /<title\b[^>]*>[\s\S]*?<\/title>/i, label: 'title' },
    { pattern: /<meta\s+name=["']description["'][^>]*content=["'][^"']{40,}/i, label: 'meta description' },
    { pattern: /<link\s+rel=["']canonical["'][^>]*href=["']https:\/\/negi-lab\.com\//i, label: 'canonical URL' },
    { pattern: /<meta\s+property=["']og:title["'][^>]*content=["'][^"']+/i, label: 'og:title' },
    { pattern: /<meta\s+property=["']og:description["'][^>]*content=["'][^"']+/i, label: 'og:description' },
    { pattern: /<meta\s+property=["']og:url["'][^>]*content=["']https:\/\/negi-lab\.com\//i, label: 'og:url' },
    { pattern: /<meta\s+property=["']og:site_name["'][^>]*content=["']negi-lab\.com["']/i, label: 'og:site_name' },
    { pattern: /<meta\s+name=["']twitter:card["'][^>]*content=["']summary/i, label: 'twitter:card' },
    { pattern: /<meta\s+name=["']twitter:title["'][^>]*content=["'][^"']+/i, label: 'twitter:title' },
    { pattern: /<meta\s+name=["']twitter:description["'][^>]*content=["'][^"']+/i, label: 'twitter:description' },
    { pattern: /<meta\s+name=["']theme-color["'][^>]*content=["']#65c155["']/i, label: 'theme-color' },
    { pattern: /<link\s+rel=["']icon["'][^>]*href=["']\/favicon\.ico["']/i, label: 'favicon link' },
    { pattern: /<link\s+rel=["']manifest["'][^>]*href=["']\/site\.webmanifest["']/i, label: 'web manifest link' },
  ];

  for (const rel of seoPages) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) {
      fail(`${rel}: expected SEO page is missing`);
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    for (const item of required) {
      if (!item.pattern.test(text)) fail(`${rel}: missing ${item.label}`);
    }
  }
}

function validateWebAppManifest() {
  const manifestPath = path.join(root, 'site.webmanifest');
  if (!fs.existsSync(manifestPath)) {
    fail('site.webmanifest: missing');
    return;
  }
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.start_url !== '/') fail('site.webmanifest: start_url should be /');
    if (manifest.theme_color !== '#65c155') fail('site.webmanifest: unexpected theme_color');
    if (!Array.isArray(manifest.icons) || !manifest.icons.some((icon) => icon.src === '/favicon.ico')) {
      fail('site.webmanifest: missing favicon icon entry');
    }
  } catch (error) {
    fail(`site.webmanifest: invalid JSON: ${error.message}`);
  }
}

function validateTailwindProductionCss() {
  const cssPath = path.join(root, 'assets/css/negi-tailwind.css');
  if (!fs.existsSync(cssPath)) {
    fail('assets/css/negi-tailwind.css: missing generated Tailwind CSS bundle');
    return;
  }
  const css = fs.readFileSync(cssPath, 'utf8');
  if (css.length < 20000) fail('assets/css/negi-tailwind.css: generated CSS bundle looks too small');
  const files = [
    ...seoPages,
    '404.html',
    'test-responsive-ads.html',
  ];
  for (const rel of files) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (/<script\s+src=["']https:\/\/cdn\.tailwindcss\.com["']><\/script>/i.test(html)) {
      fail(`${rel}: must use local Tailwind CSS bundle instead of the CDN runtime`);
    }
    if (html.includes('tailwind.config') && !html.includes('window.tailwind = window.tailwind || {};')) {
      fail(`${rel}: tailwind.config must be guarded now that the CDN runtime is not loaded`);
    }
  }
}

function validateToolEnhancements() {
  for (const rel of primaryToolPages) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (!/tool-page-enhancements\.js/.test(text)) {
      fail(`${rel}: missing shared tool-page-enhancements.js`);
    }
    const jsonMatch = text.match(/<script type="application\/ld\+json" id="tool-structured-data">([\s\S]*?)<\/script>/i);
    if (!jsonMatch) {
      fail(`${rel}: missing tool structured data`);
      continue;
    }
    try {
      const graph = JSON.parse(jsonMatch[1]);
      const types = new Set((Array.isArray(graph) ? graph : [graph]).map((item) => item && item['@type']));
      for (const type of ['WebApplication', 'BreadcrumbList', 'FAQPage']) {
        if (!types.has(type)) fail(`${rel}: structured data missing ${type}`);
      }
    } catch (error) {
      fail(`${rel}: invalid tool structured data JSON: ${error.message}`);
    }
  }
}

function validateToolsIndex() {
  const rel = 'tools/index.html';
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(`${rel}: missing`);
    return;
  }
  const text = fs.readFileSync(file, 'utf8');
  if (!/tool-index-enhancements\.js/.test(text)) {
    fail(`${rel}: missing tool-index-enhancements.js`);
  }
  const jsonMatch = text.match(/<script type="application\/ld\+json" id="tool-index-structured-data">([\s\S]*?)<\/script>/i);
  if (!jsonMatch) {
    fail(`${rel}: missing tool index structured data`);
    return;
  }
  try {
    const data = JSON.parse(jsonMatch[1]);
    const urls = new Set((data.itemListElement || []).map((item) => String(item.url || '').replace('https://negi-lab.com/', '')));
    for (const toolPage of primaryToolPages.filter((page) => page !== 'tools/text-converter-new.html')) {
      if (!urls.has(toolPage)) fail(`${rel}: structured data missing ${toolPage}`);
    }
  } catch (error) {
    fail(`${rel}: invalid tool index structured data JSON: ${error.message}`);
  }
}

function validateCopyrightYear() {
  const files = [
    ...seoPages,
    'js/common-translations.js',
    'js/image-converter-translations.js',
    'js/music-generator-translations.js',
  ];
  for (const rel of files) {
    const file = path.join(root, rel);
    if (fs.existsSync(file) && /(?:&copy;|©|Copyright &copy;) 2025 negi-lab\.com/.test(fs.readFileSync(file, 'utf8'))) {
      fail(`${rel}: contains stale 2025 negi-lab.com copyright`);
    }
  }
}

function validateLlmsTxt() {
  const file = path.join(root, 'llms.txt');
  if (!fs.existsSync(file)) {
    fail('llms.txt: missing');
    return;
  }
  const text = fs.readFileSync(file, 'utf8');
  for (const toolPage of primaryToolPages.filter((page) => page !== 'tools/text-converter-new.html')) {
    if (!text.includes(`https://negi-lab.com/${toolPage}`)) {
      fail(`llms.txt: missing ${toolPage}`);
    }
  }
}

function validateConsentAndAffiliateSafety() {
  const files = walk(root, (file) => /\.(html|js)$/.test(file) && path.relative(root, file).replace(/\\/g, '/') !== 'scripts/validate-site.js');
  const banned = [
    { pattern: /assoc-redirect/i, message: 'hidden Amazon cookie redirect reference' },
    { pattern: /hbb\.afl\.rakuten\.co\.jp\/hgb/i, message: 'hidden Rakuten cookie pixel reference' },
    { pattern: /function\s+embedAffiliateCookies/i, message: 'implicit affiliate cookie embed function' },
    { pattern: /var\s+CONSENT_OK\s*=\s*true/i, message: 'ads consent defaults to true' },
    { pattern: /forceAds=1/i, message: 'ad consent URL override' },
  ];
  for (const file of files) {
    const rel = path.relative(root, file).replace(/\\/g, '/');
    const text = fs.readFileSync(file, 'utf8');
    for (const item of banned) {
      if (item.pattern.test(text)) fail(`${rel}: found ${item.message}`);
    }
  }
}

function validateSitemapLocalUrls() {
  const sitemap = read('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>https:\/\/negi-lab\.com\/([^<]*)<\/loc>/g)]
    .map((match) => match[1]);
  const seen = new Set();
  for (const urlPath of urls) {
    if (seen.has(urlPath)) fail(`sitemap.xml: duplicate URL: /${urlPath}`);
    seen.add(urlPath);
    if (!urlPath || urlPath.startsWith('gamewiki/')) continue;
    const local = path.join(root, decodeURI(urlPath));
    if (!fs.existsSync(local)) {
      fail(`sitemap.xml: local URL does not exist: /${urlPath}`);
    }
  }
}

function validateRobotsAndAdsTxt() {
  const robotsPath = path.join(root, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    fail('robots.txt: missing');
  } else {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (!/Sitemap:\s*https:\/\/negi-lab\.com\/sitemap\.xml/i.test(robots)) {
      fail('robots.txt: missing sitemap directive');
    }
    if (!/Allow:\s*\/llms\.txt/i.test(robots)) {
      fail('robots.txt: missing llms.txt allow directive');
    }
    if (/Disallow:\s*\/js\/?\s*(?:\r?\n|$)/i.test(robots)) {
      fail('robots.txt: must not block /js/ because public pages need render assets');
    }
    for (const page of retiredToolRedirects) {
      if (new RegExp(`Disallow:\\s*/${page.rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(robots)) {
        fail(`robots.txt: must not block /${page.rel} because crawlers need to see the noindex/canonical redirect page`);
      }
    }
  }

  const adsPath = path.join(root, 'ads.txt');
  if (!fs.existsSync(adsPath)) {
    fail('ads.txt: missing');
  } else {
    const ads = fs.readFileSync(adsPath, 'utf8');
    if (!/google\.com,\s*pub-1835873052239386,\s*DIRECT,\s*f08c47fec0942fa0/i.test(ads)) {
      fail('ads.txt: missing expected Google AdSense publisher declaration');
    }
  }
}

function validateRetiredToolRedirects() {
  for (const page of retiredToolRedirects) {
    const file = path.join(root, page.rel);
    if (!fs.existsSync(file)) {
      fail(`${page.rel}: retired redirect page is missing`);
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    if (html.length < 300) fail(`${page.rel}: retired redirect page looks unexpectedly empty`);
    if (!/<meta\s+name=["']robots["'][^>]*content=["']noindex,follow["']/i.test(html)) {
      fail(`${page.rel}: retired redirect page must be noindex,follow`);
    }
    if (!new RegExp(`<link\\s+rel=["']canonical["'][^>]*href=["']${page.canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(html)) {
      fail(`${page.rel}: retired redirect page has wrong canonical`);
    }
    if (!html.includes(`url=${page.localTarget}`) || !html.includes(`window.location.replace("${page.localTarget}")`)) {
      fail(`${page.rel}: retired redirect page must redirect to ${page.localTarget}`);
    }
  }
}

try {
  JSON.parse(read('package.json'));
} catch (error) {
  fail(`package.json: invalid JSON: ${error.message}`);
}

validateJavaScriptSyntax();
validatePortalTranslations();
validateLayoutGuardrails();
validateCriticalTextIsReadable();
validateSeoMetadata();
validateToolEnhancements();
validateToolsIndex();
validateWebAppManifest();
validateTailwindProductionCss();
validateCopyrightYear();
validateLlmsTxt();
validateConsentAndAffiliateSafety();
validateSitemapLocalUrls();
validateRobotsAndAdsTxt();
validateRetiredToolRedirects();

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Site validation passed.');
