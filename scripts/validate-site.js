const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const failures = [];

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
  for (const urlPath of urls) {
    if (!urlPath || urlPath.startsWith('gamewiki/')) continue;
    const local = path.join(root, decodeURI(urlPath));
    if (!fs.existsSync(local)) {
      fail(`sitemap.xml: local URL does not exist: /${urlPath}`);
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
validateConsentAndAffiliateSafety();
validateSitemapLocalUrls();

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Site validation passed.');
