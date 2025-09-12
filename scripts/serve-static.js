#!/usr/bin/env node
/**
 * 超軽量ローカル静的サーバー
 * Usage: node scripts/serve-static.js [port]
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const exts = new Map([
  ['.html','text/html; charset=UTF-8'],
  ['.js','text/javascript; charset=UTF-8'],
  ['.css','text/css; charset=UTF-8'],
  ['.json','application/json; charset=UTF-8'],
  ['.png','image/png'],
  ['.jpg','image/jpeg'],
  ['.jpeg','image/jpeg'],
  ['.gif','image/gif'],
  ['.svg','image/svg+xml'],
  ['.webp','image/webp'],
  ['.ico','image/x-icon'],
  ['.txt','text/plain; charset=UTF-8'],
  ['.xml','application/xml; charset=UTF-8']
]);

const port = Number(process.argv[2]) || 5173;
const root = path.resolve(__dirname, '..');

function send(res, status, body, headers={}) {
  res.writeHead(status, { 'Content-Length': Buffer.byteLength(body), ...headers });
  res.end(body);
}

const server = http.createServer((req,res)=>{
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  // VSCodeなどで /negi-lab.com/ をルートに含めた仮想パスで開こうとした時の互換プレフィックス除去
  if(urlPath.startsWith('/negi-lab.com/')){
    urlPath = urlPath.replace('/negi-lab.com','');
  }
  let filePath = path.join(root, urlPath);
  if (urlPath.endsWith('/')) filePath = path.join(root, urlPath, 'index.html');
  // ルートマッピング (トップドメインの /gamewiki/... に対応)
  if (!fs.existsSync(filePath)) {
    // 先頭スラッシュを除去して探す
    const alt = path.join(root, urlPath.replace(/^\//,''));
    if (fs.existsSync(alt)) filePath = alt;
  }
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const indexHtml = path.join(filePath,'index.html');
      if (fs.existsSync(indexHtml)) filePath = indexHtml; else {
        const list = fs.readdirSync(filePath).map(f=>`<li><a href="${path.posix.join(urlPath, f)}">${f}</a></li>`).join('');
        return send(res,200,`<h1>Index of ${urlPath}</h1><ul>${list}</ul>`);
      }
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = exts.get(ext) || 'application/octet-stream';
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': data.length, 'Cache-Control':'no-cache' });
    res.end(data);
  } catch(e) {
    if (e.code === 'ENOENT') return send(res,404,'Not Found');
    console.error(e);
    return send(res,500,'Internal Error');
  }
});

server.listen(port,()=>{
  console.log(`[serve-static] http://localhost:${port}/  (root=${root})`);
  console.log('例: キャラページ => http://localhost:'+port+'/gamewiki/FellowMoon/site/chars/001.html');
});
