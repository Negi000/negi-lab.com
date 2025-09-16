#!/usr/bin/env node
/**
 * build-wiki-search-index.js
 * Wiki内検索用インデックスJSONを生成。
 * - キャラデータなど既存の埋め込みJSONソース(ビルド済みファイル)を統合
 * - HTML/JSON/Markdown を走査 (最低限: FellowMoon 配下)
 * 出力: gamewiki/FellowMoon/search-index.json
 *
 * 仕様:
 * { docs:[{id,title,url,tags,body}], generated: ISO8601 }
 * body はサイズ削減のため最大長を制限 (現状 6KB/ドキュメント)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname,'..');
const WIKI_ROOT = path.join(ROOT,'gamewiki','FellowMoon');
// 生成物は search.html と同階層 (site/) に配置する
const WIKI_SITE = path.join(WIKI_ROOT,'site');
const OUT_PATH = path.join(WIKI_SITE,'search-index.json');
const MAX_BODY = 6000; // bytes (approx chars)

function walk(dir, exts, files=[]) {
  if(!fs.existsSync(dir)) return files;
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const full = path.join(dir, ent.name);
    if(ent.isDirectory()) walk(full, exts, files); else {
      const ext = path.extname(ent.name).toLowerCase();
      if(exts.includes(ext)) files.push(full);
    }
  }
  return files;
}

function stripHtml(html){
  return html
    .replace(/<script[\s\S]*?<\/script>/gi,'')
    .replace(/<style[\s\S]*?<\/style>/gi,'')
    .replace(/<!--.*?-->/g,'')
    .replace(/<[^>]+>/g,' ') // タグ除去
    .replace(/&nbsp;/g,' ')
    .replace(/&amp;/g,'&')
    .replace(/\s+/g,' ') // 連続空白
    .trim();
}

function loadCharJsonSources(){
  // 既にテンプレで使っている埋め込みJSONをファイル経由で拾うならここで拡張
  // ここでは仮に data/chars.json が存在する想定 (なければスキップ)
  const guess = path.join(WIKI_ROOT,'data','chars.json');
  if(fs.existsSync(guess)){
    try{ return JSON.parse(fs.readFileSync(guess,'utf8')); }catch(e){ console.warn('[warn] chars.json parse fail',e.message); }
  }
  return [];
}

function main(){
  const docs = [];
  // 1. HTML ページ走査
  // site/ 配下のみを対象とする（公開されるパスと一致させる）
  const htmlFiles = walk(WIKI_SITE, ['.html']);
  htmlFiles.forEach(f=>{
    if(path.basename(f).toLowerCase()==='search.html') return; // 検索ページ自身は除外
    const rel = path.relative(WIKI_SITE, f).replace(/\\/g,'/');
    const url = '/gamewiki/FellowMoon/site/'+rel;
    let raw='';
    try{ raw = fs.readFileSync(f,'utf8'); }catch(e){ return; }
    const titleMatch = raw.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch?titleMatch[1].trim() : rel;
    const body = stripHtml(raw).slice(0,MAX_BODY);
    docs.push({ id:'html-'+rel, title, url, tags:[], body });
  });
  // 2. キャラ JSON (存在すれば)
  const chars = loadCharJsonSources();
  chars.forEach(c=>{
    const url = '/gamewiki/FellowMoon/chars/'+c.ID+'.html'; // 生成される想定のURL形式
    const pieces = [c.名前,c.英名,c.略称,c.説明,c.パッシブ,c.スキル1,c.スキル2,c.ULT].filter(Boolean).join('\n');
    docs.push({
      id:'char-'+c.ID,
      title: c.名前 + (c.英名?(' / '+c.英名):''),
      url,
      tags: [c.属性,c.タイプ].filter(Boolean),
      body: pieces.slice(0,MAX_BODY)
    });
  });
  const out = { generated:new Date().toISOString(), count:docs.length, docs };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out), 'utf8');
  console.log('[wiki-search] generated', OUT_PATH, 'docs:', docs.length);
}

main();
