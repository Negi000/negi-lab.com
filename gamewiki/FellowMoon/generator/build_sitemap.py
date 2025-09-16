import os, pathlib, datetime, re

BASE = pathlib.Path(__file__).resolve().parent.parent
SITE = BASE / 'site'
OUT = BASE.parent.parent / 'sitemap.xml'  # repo root sitemap.xml
BASE_URL = 'https://negi-lab.com'
WIKI_BASE = BASE_URL + '/gamewiki/FellowMoon/site'

def find_html(root: pathlib.Path):
    for p in root.rglob('*.html'):
        # 除外: ローカルテンプレート or 非公開？（なし）
        yield p

def url_from_path(p: pathlib.Path) -> str:
    # SITE 配下の相対パスにしてから結合（site/site の重複防止）
    rel = p.relative_to(SITE)
    rel = str(rel).replace('\\','/')
    return f"{WIKI_BASE}/{rel}"

def main():
    urls = []
    def lastmod_for(p: pathlib.Path) -> str:
        try:
            ts = p.stat().st_mtime
            return datetime.date.fromtimestamp(ts).isoformat()
        except Exception:
            return datetime.date.today().isoformat()
    # 既存のサイトトップなどは保持するために、既存sitemap.xmlの先頭固定部分はこのスクリプトでは扱わない
    # FellowMoon配下のみ上書き生成
    for p in find_html(SITE):
        loc = url_from_path(p)
        urls.append((loc, lastmod_for(p)))
    # 既存のsitemap.xmlを読み、FellowMoonセクションを除去 → 末尾に新規セクションを追記
    if not OUT.exists():
        # 最低限のヘッダで作成
        content = ['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    else:
        text = OUT.read_text(encoding='utf-8')
        # FellowMoon セクションを雑に除去（locに /gamewiki/FellowMoon/site/ を含むもの）
        text = re.sub(r'\s*<url>\s*<loc>https://negi-lab.com/gamewiki/FellowMoon/site/.*?</url>','', text, flags=re.S)
        # 末尾の </urlset> を削除
        text = re.sub(r'</urlset>\s*$', '', text)
        content = [text]
    # 追加
    for loc, lastmod in sorted(set(urls)):
        content.append('  <url>')
        content.append(f'    <loc>{loc}</loc>')
        content.append(f'    <lastmod>{lastmod}</lastmod>')
        content.append('    <changefreq>weekly</changefreq>')
        content.append('    <priority>0.5</priority>')
        content.append('  </url>')
    content.append('</urlset>')
    OUT.write_text('\n'.join(content), encoding='utf-8')
    print(f'Wrote sitemap with {len(urls)} FellowMoon URLs into {OUT}')

if __name__ == '__main__':
    main()
