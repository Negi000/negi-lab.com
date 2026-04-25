#!/usr/bin/env node
/**
 * Responsive ads migration script.
 *
 * Keeps legacy HTML pages aligned with the current AdSense client and shared
 * responsive-ad assets. The script intentionally uses only Node's standard
 * library so it can run in this repository without installing dependencies.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const config = {
  adClient: 'ca-pub-1835873052239386',
  oldClients: [
    'ca-pub-6234639838467127',
  ],
  headMarkers: [
    '<link rel="stylesheet" href="/assets/css/negi-tailwind.css" />',
    '<link rel="stylesheet" href="/js/responsive-ads.css">',
    '</head>',
  ],
  excludePatterns: [
    `${path.sep}.git${path.sep}`,
    `${path.sep}gamewiki${path.sep}`,
    `${path.sep}node_modules${path.sep}`,
  ],
};

function shouldSkip(filePath) {
  return config.excludePatterns.some((pattern) => filePath.includes(pattern))
    || filePath.endsWith('.backup')
    || filePath.endsWith('.min.html');
}

function walkHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!shouldSkip(`${full}${path.sep}`)) walkHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html') && !shouldSkip(full)) {
      out.push(full);
    }
  }
  return out;
}

function processHtmlFile(filePath) {
  try {
    console.log(`Processing: ${path.relative(root, filePath)}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    for (const oldClient of config.oldClients) {
      if (content.includes(oldClient)) {
        content = content.replace(new RegExp(oldClient, 'g'), config.adClient);
        hasChanges = true;
        console.log(`  Updated AdSense client: ${oldClient} -> ${config.adClient}`);
      }
    }

    const requiredAssets = [
      '<link rel="stylesheet" href="/js/responsive-ads.css">',
      '<script src="/js/responsive-ads-controller.js"></script>',
    ];
    const missingAssets = requiredAssets.filter((asset) => !content.includes(asset));

    if (missingAssets.length) {
      const marker = config.headMarkers.find((candidate) => content.includes(candidate));
      if (marker) {
        const insertAfter = content.indexOf(marker) + marker.length;
        content = `${content.slice(0, insertAfter)}\n${missingAssets.join('\n')}${content.slice(insertAfter)}`;
        hasChanges = true;
        console.log(`  Added responsive ad assets after: ${marker}`);
      }
    }

    content = content.replace(/<ins\s+class="adsbygoogle"([^>]*?)data-ad-slot="([^"]*?)"([^>]*?)>/g, (match, beforeSlot, slotId) => {
      if (match.includes(' ad-pc') || match.includes(' ad-sp')) return match;

      const deviceClass = isPhoneSlot(slotId) ? ' ad-sp' : ' ad-pc';
      hasChanges = true;
      console.log(`  Added ${deviceClass.trim()} class to ad slot ${slotId}`);
      return match.replace('class="adsbygoogle"', `class="adsbygoogle${deviceClass}"`);
    });

    if (!hasChanges) {
      console.log('  No changes needed');
      return false;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  File updated');
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

function isPhoneSlot(slotId) {
  return ['8916646342', '3205934910', '6430083800'].includes(slotId);
}

function main() {
  console.log('Starting responsive ads migration...\n');

  const htmlFiles = walkHtmlFiles(root);
  let updatedCount = 0;

  for (const filePath of htmlFiles) {
    if (processHtmlFile(filePath)) updatedCount += 1;
    console.log('');
  }

  console.log('Migration summary:');
  console.log(`  Total files processed: ${htmlFiles.length}`);
  console.log(`  Files updated: ${updatedCount}`);
  console.log(`  Files unchanged: ${htmlFiles.length - updatedCount}`);
}

if (require.main === module) {
  main();
}

module.exports = { processHtmlFile, isPhoneSlot, walkHtmlFiles };
