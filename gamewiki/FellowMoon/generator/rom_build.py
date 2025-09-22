import json, pathlib, os, re, datetime
from html import escape

BASE = pathlib.Path(__file__).resolve().parent.parent
SITE_DIR = BASE / 'site'
SRC_ROM_IMG = BASE / 'ロム素材'
DEST_ROM_IMG = SITE_DIR / 'assets' / 'roms'
ROM_JSON = BASE / 'rom.json'
TPL = BASE / 'generator' / 'rom_template.html'

def expand(template: str, data: dict):
    pattern = re.compile(r'{{([^{}#\/]+?)}}')
    def repl(m):
        k = m.group(1).strip()
        return str(data.get(k, ''))
    return pattern.sub(repl, template)

def read_roms():
    with ROM_JSON.open(encoding='utf-8') as f:
        raw = json.load(f)
    return raw.get('roms', [])

def copy_rom_images():
    out = []
    exts = {'.png','.jpg','.jpeg','.webp','.gif'}
    if not SRC_ROM_IMG.exists():
        return out
    DEST_ROM_IMG.mkdir(parents=True, exist_ok=True)
    for p in SRC_ROM_IMG.iterdir():
        if p.is_file() and p.suffix.lower() in exts:
            target = DEST_ROM_IMG / p.name
            try:
                if not target.exists() or target.stat().st_mtime < p.stat().st_mtime:
                    target.write_bytes(p.read_bytes())
            except Exception:
                pass
            rel = os.path.relpath(target, SITE_DIR).replace('\\','/')
            out.append(rel)
    return out

def choose_asset_rel(name_base: str) -> str:
    """
    roms ページ（SITE_DIR/'roms'）からの相対パスで、与えられたベース名の
    画像ファイルを優先順 (.webp, .png, .jpg, .jpeg, .gif) で探し、
    見つかったものへのパスを返す。見つからない場合は rom_nan.png を返す。
    """
    roms_dir = SITE_DIR / 'roms'
    for ext in ('.webp', '.png', '.jpg', '.jpeg', '.gif'):
        p = DEST_ROM_IMG / f"{name_base}{ext}"
        if p.exists():
            return os.path.relpath(p, roms_dir).replace('\\','/')
    # 最終フォールバック
    fallback = DEST_ROM_IMG / 'rom_nan.png'
    return os.path.relpath(fallback, roms_dir).replace('\\','/')

def build_stat_card(part):
    # part: { 名称, 基本ステータス1, ステータス(初期値)1, ステータス(最大値)1, 基本ステータス2, ... }
    base1 = escape(str(part.get('基本ステータス1') or ''))
    base2 = escape(str(part.get('基本ステータス2') or ''))
    s1_i = escape(str(part.get('ステータス(初期値)1') or ''))
    s1_m = escape(str(part.get('ステータス(最大値)1') or ''))
    s2_i = escape(str(part.get('ステータス(初期値)2') or ''))
    s2_m = escape(str(part.get('ステータス(最大値)2') or ''))
    # ヘッダー3列 + 2行（ステータス1/2） = 合計3行構成
    return f'''
    <div class="stat-card">
      <h3>{escape(str(part.get('名称') or ''))}</h3>
      <table class="stat">
        <thead>
          <tr><th>基本ステータス</th><th>ステータス(初期値)</th><th>ステータス(最大値)</th></tr>
        </thead>
        <tbody>
          <tr><td>{base1}</td><td>{s1_i}</td><td>{s1_m}</td></tr>
          <tr><td>{base2}</td><td>{s2_i}</td><td>{s2_m}</td></tr>
        </tbody>
      </table>
    </div>
    '''

def build_traits_rows(traits):
    rows = []
    for t in (traits or []):
        name = escape(str(t.get('名称') or ''))
        eff = escape(str(t.get('効果') or ''))
        rows.append(f'<tr><td style="width:22%">{name}</td><td>{eff}</td></tr>')
    return '\n'.join(rows)

def build_rom_pages():
    SITE_DIR.mkdir(parents=True, exist_ok=True)
    (SITE_DIR / 'roms').mkdir(parents=True, exist_ok=True)
    copy_rom_images()

    roms = read_roms()
    tpl = TPL.read_text(encoding='utf-8')
    now = datetime.datetime.now().isoformat(timespec='seconds')

    for rom in roms:
        rid = str(rom.get('ID') or '').strip()
        name = str(rom.get('名前') or '').strip()
        parts = rom.get('部位') or []
        # 各部位の画像は「名称.webp/名称.png」対応（webp 優先）
        part_imgs = []
        part_names = []
        for i in range(4):
            if i < len(parts):
                pn = str(parts[i].get('名称') or '').strip()
                part_names.append(pn)
                part_imgs.append(choose_asset_rel(pn))
            else:
                part_names.append('')
                part_imgs.append(choose_asset_rel('rom_nan'))

        stat_cards = '\n'.join(build_stat_card(p) for p in parts[:4])
        traits_rows = build_traits_rows(rom.get('固有特性'))

        data = {
            'タイトル': f'{rid} {name} | ロム詳細 | 新月同行 Wiki',
            'ビルド日時': now,
            'ID': rid,
            '名前': name,
            '2セット効果': rom.get('2セット効果') or '',
            '4セット効果': rom.get('4セット効果') or '',
            '実装バージョン': rom.get('実装バージョン') or '',
            '部位名1': part_names[0],
            '部位名2': part_names[1],
            '部位名3': part_names[2],
            '部位名4': part_names[3],
            '部位画像1': part_imgs[0],
            '部位画像2': part_imgs[1],
            '部位画像3': part_imgs[2],
            '部位画像4': part_imgs[3],
            'ステータスカードHTML': stat_cards,
            '固有特性行HTML': traits_rows,
        }

        html = expand(tpl, data)
        out = SITE_DIR / 'roms' / f'{rid}.html'
        out.write_text(html, encoding='utf-8')
        print('Generated ->', out)

if __name__ == '__main__':
    build_rom_pages()
