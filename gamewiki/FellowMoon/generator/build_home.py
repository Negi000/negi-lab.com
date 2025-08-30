import json, datetime, pathlib, os, re
from html import escape

BASE = pathlib.Path(__file__).resolve().parent.parent
CHAR_JSON = BASE / 'character.json'
SITE_DIR = BASE / 'site'
TPL_HOME = BASE / 'generator' / 'home_template.html'
SRC_WALL_DIR = BASE / '素材' / '壁紙'
SRC_DISPLAY_DIR = BASE / '素材' / 'ディスプレイ'
DEST_WALL_DIR = SITE_DIR / 'assets' / 'wallpapers'
DEST_DISPLAY_DIR = SITE_DIR / 'assets' / 'displays'

pattern = re.compile(r'{{([^{}#\/]+?)}}')

# 単純プレースホルダ置換（セクション不要）
def expand(template: str, data: dict):
    def repl(m):
        k = m.group(1).strip()
        return data.get(k, '')
    return pattern.sub(repl, template)

def read_characters():
    with CHAR_JSON.open(encoding='utf-8') as f:
        return json.load(f)


def collect_birthdays(raw_chars):
    out = []
    for cid, payload in raw_chars.items():
        basic = payload.get('基本情報') or {}
        bd = basic.get('誕生日')
        name = basic.get('名前')
        if not bd or not name:
            continue
        # 想定フォーマット: MM-DD など
        m = re.match(r'(\d{1,2})[-/](\d{1,2})', bd)
        if not m:
            continue
        mm = int(m.group(1)); dd = int(m.group(2))
        out.append({'ID': cid, 'name': name, 'm': mm, 'd': dd, 'md': f'{mm:02d}-{dd:02d}'})
    return sorted(out, key=lambda x: (x['m'], x['d']))


def stats_from_chars(raw_chars):
    attr_counts = {}
    type_counts = {}
    recent = []
    now = datetime.datetime.now()
    for cid, payload in raw_chars.items():
        basic = payload.get('基本情報') or {}
        attr = basic.get('属性') or ''
        typ = basic.get('タイプ') or ''
        attr_counts[attr] = attr_counts.get(attr, 0) + 1
        type_counts[typ] = type_counts.get(typ, 0) + 1
        recent.append({'ID': cid, '名前': basic.get('名前','')})
    attr_stats = [{'name': k, 'count': v} for k, v in sorted(attr_counts.items(), key=lambda x: -x[1]) if k]
    type_stats = [{'name': k, 'count': v} for k, v in sorted(type_counts.items(), key=lambda x: -x[1]) if k]
    recent_sorted = recent[:]
    # ひとまずID降順（実装時は更新日時など）
    recent_sorted.sort(key=lambda x: x['ID'], reverse=True)
    return attr_stats, type_stats, recent_sorted[:12]


def build_home():
    SITE_DIR.mkdir(parents=True, exist_ok=True)
    raw_chars = read_characters()
    tpl = TPL_HOME.read_text(encoding='utf-8')

    birthdays = collect_birthdays(raw_chars)
    attr_stats, type_stats, recent_chars = stats_from_chars(raw_chars)

    # 壁紙 & ディスプレイ画像収集 + コピー
    def gather_images(src_dir: pathlib.Path, dest_dir: pathlib.Path):
        exts = {'.jpg','.jpeg','.png','.webp','.gif'}
        if not src_dir.exists():
            return []
        dest_dir.mkdir(parents=True, exist_ok=True)
        out = []
        for p in sorted(src_dir.iterdir()):
            if p.is_file() and p.suffix.lower() in exts:
                target = dest_dir / p.name
                try:
                    if not target.exists() or target.stat().st_mtime < p.stat().st_mtime:
                        target.write_bytes(p.read_bytes())
                except Exception:
                    pass
                rel = os.path.relpath(target, SITE_DIR).replace('\\','/')
                out.append(rel)
        return out

    wallpapers = gather_images(SRC_WALL_DIR, DEST_WALL_DIR)
    displays = gather_images(SRC_DISPLAY_DIR, DEST_DISPLAY_DIR)

    data = {
        'ビルド日時': datetime.datetime.now().isoformat(timespec='seconds'),
        'キャラ誕生日JSON': json.dumps(birthdays, ensure_ascii=False),
        '属性統計JSON': json.dumps(attr_stats, ensure_ascii=False),
        'タイプ統計JSON': json.dumps(type_stats, ensure_ascii=False),
        '最近キャラJSON': json.dumps(recent_chars, ensure_ascii=False),
        '壁紙JSON': json.dumps(wallpapers, ensure_ascii=False),
        'ディスプレイJSON': json.dumps(displays, ensure_ascii=False),
    }
    html = expand(tpl, data)
    (SITE_DIR / 'index.html').write_text(html, encoding='utf-8')
    print('Home generated.')
    # ===== 検索インデックス生成 =====
    try:
        build_search_index(raw_chars, html)
    except Exception as e:
        print('Search index build failed:', e)

def strip_html(raw: str) -> str:
    # script/style除去 → タグ除去 → 空白整理
    raw = re.sub(r'<script[\s\S]*?</script>', ' ', raw, flags=re.IGNORECASE)
    raw = re.sub(r'<style[\s\S]*?</style>', ' ', raw, flags=re.IGNORECASE)
    raw = re.sub(r'<!--.*?-->', ' ', raw, flags=re.DOTALL)
    raw = re.sub(r'<[^>]+>', ' ', raw)
    raw = re.sub(r'&nbsp;?', ' ', raw)
    raw = re.sub(r'&amp;', '&', raw)
    raw = re.sub(r'\s+', ' ', raw).strip()
    return raw

def flatten_character_payload(payload: dict) -> str:
    parts = []
    def rec(v):
        if v is None:
            return
        if isinstance(v, dict):
            for vv in v.values():
                rec(vv)
        elif isinstance(v, list):
            for vv in v:
                rec(vv)
        else:
            s = str(v).strip()
            if s:
                parts.append(s)
    rec(payload)
    return '\n'.join(parts)

def build_search_index(raw_chars: dict, home_html: str):
    docs = []
    # トップページ
    docs.append({
        'id': 'home',
        'title': 'トップ',
        'url': '/gamewiki/FellowMoon/',
        'tags': ['home'],
        'body': strip_html(home_html)[:6000]
    })
    # キャラ
    for cid, payload in raw_chars.items():
        basic = (payload.get('基本情報') or {})
        name = basic.get('名前') or cid
        eng = basic.get('英名') or ''
        attr = basic.get('属性') or ''
        typ = basic.get('タイプ') or ''
        body = flatten_character_payload(payload)[:6000]
        docs.append({
            'id': f'char-{cid}',
            'title': name + (f' / {eng}' if eng else ''),
            'url': f'/gamewiki/FellowMoon/site/chars/{cid}.html',
            'tags': [t for t in [attr, typ, 'character'] if t],
            'body': body
        })
    out = {
        'generated': datetime.datetime.now().isoformat(timespec='seconds'),
        'count': len(docs),
        'docs': docs
    }
    # search.html と同階層 (BASE) に配置 → fetch('search-index.json') で取得可能
    target = BASE / 'search-index.json'
    target.write_text(json.dumps(out, ensure_ascii=False), encoding='utf-8')
    print('Search index generated. docs:', len(docs), '->', target)

if __name__ == '__main__':
    build_home()
