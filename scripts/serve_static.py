#!/usr/bin/env python3
"""軽量ローカル静的サーバー (Python版)
Usage:
  python scripts/serve_static.py            # デフォルトポート 5173
  python scripts/serve_static.py 8000       # ポート指定

特徴:
- /negi-lab.com/ プレフィックスを自動除去 (ブラウザや設定都合で付いた場合の互換)
- ディレクトリアクセス時は index.html を返す
- 見つからなければ簡易ディレクトリリスト
- 一部主要MIMEタイプを付与
"""
from __future__ import annotations
import http.server, socketserver, sys, os, urllib.parse, posixpath, mimetypes, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent  # リポジトリルート
PORT = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else 5173

# 追加MIME (未登録拡張子)
EXTRA_MIME = {
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
}
for ext, mt in EXTRA_MIME.items():
    mimetypes.add_type(mt, ext)

class StaticHandler(http.server.SimpleHTTPRequestHandler):
    # ルートを固定
    def translate_path(self, path: str) -> str:
        # クエリ除去 & デコード
        path = path.split('?',1)[0]
        path = path.split('#',1)[0]
        path = urllib.parse.unquote(path)
        # /negi-lab.com/ プレフィックス除去
        if path.startswith('/negi-lab.com/'):
            path = path[len('/negi-lab.com'):]  # 先頭 / は残す
        # セキュリティ: 絶対パス化前に正規化
        parts = [p for p in path.split('/') if p and p not in ('.','..')]
        full = ROOT.joinpath(*parts)
        if full.is_dir():
            # ディレクトリなら index.html 優先
            index = full / 'index.html'
            if index.exists():
                return str(index)
        return str(full)

    def list_directory(self, path: str):  # ディレクトリリスト (簡易)
        try:
            entries = os.listdir(path)
        except OSError:
            self.send_error(404, 'No permission to list directory')
            return None
        entries.sort()
        rpath = pathlib.Path(path)
        display = '/' + rpath.relative_to(ROOT).as_posix()
        items = []
        for name in entries:
            p = rpath / name
            slash = '/' if p.is_dir() else ''
            items.append(f'<li><a href="{urllib.parse.quote(name)}{slash}">{name}{slash}</a></li>')
        html = f"<html><head><meta charset='utf-8'><title>Index of {display}</title></head><body><h1>Index of {display}</h1><ul>{''.join(items)}</ul></body></html>"
        encoded = html.encode('utf-8', 'surrogateescape')
        self.send_response(200)
        self.send_header('Content-Type','text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(encoded)))
        self.send_header('Cache-Control','no-cache')
        self.end_headers()
        self.wfile.write(encoded)
        return None

    def end_headers(self):
        # 共通ヘッダ
        self.send_header('Cache-Control','no-cache')
        super().end_headers()

    def log_message(self, format: str, *args) -> None:
        sys.stderr.write(f"[static] {self.address_string()} - {format % args}\n")

if __name__ == '__main__':
    os.chdir(ROOT)  # ルート固定
    with socketserver.ThreadingTCPServer(('0.0.0.0', PORT), StaticHandler) as httpd:
        print(f"[serve_static.py] Serving {ROOT} at http://localhost:{PORT}/")
        print(f"例: http://localhost:{PORT}/gamewiki/FellowMoon/site/  (index 自動) ")
        print(f"例(プレフィックス互換): http://localhost:{PORT}/negi-lab.com/gamewiki/FellowMoon/site/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n[serve_static.py] stop')
