import json, pathlib, os, re, datetime
from html import escape

BASE = pathlib.Path(__file__).resolve().parent.parent
SITE_DIR = BASE / 'site'
SRC_ROM_IMG = BASE / 'ロム素材'
DEST_ROM_IMG = SITE_DIR / 'assets' / 'roms'
ROM_JSON = BASE / 'rom.json'
TPL = BASE / 'generator' / 'roms_index_template.html'

pattern = re.compile(r'{{([^{}#\/]+?)}}')

def expand(template: str, data: dict):
    def repl(m):
        k = m.group(1).strip()
        return data.get(k, '')
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

def extract_stats(rom):
    # 各ロムの最大値: 攻撃/HP それぞれの最大、攻撃側の物理/特殊、HP側の物理/特殊
    atk_max = 0; hp_max = 0
    pdef1 = 0; pdef2 = 0; sdef1 = 0; sdef2 = 0
    for part in (rom.get('部位') or []):
        base1 = part.get('基本ステータス1'); max1 = int(part.get('ステータス(最大値)1') or 0)
        base2 = part.get('基本ステータス2'); max2 = int(part.get('ステータス(最大値)2') or 0)
        if base1 == '攻撃':
            atk_max = max(atk_max, max1)
            if base2 == '物理防御': pdef1 = max(pdef1, max2)
            if base2 == '特殊防御': sdef1 = max(sdef1, max2)
        if base1 == 'HP':
            hp_max = max(hp_max, max1)
            if base2 == '物理防御': pdef2 = max(pdef2, max2)
            if base2 == '特殊防御': sdef2 = max(sdef2, max2)
    return atk_max, hp_max, pdef1, pdef2, sdef1, sdef2

def build_roms_index():
    SITE_DIR.mkdir(parents=True, exist_ok=True)
    roms = read_roms()
    copy_rom_images()

    # 図鑑用: ID数値、画像パス（名前.png）
    grid = []
    sets = []
    stats = []
    for rom in roms:
        rid = str(rom.get('ID') or '').strip()
        try:
            rid_num = int(rid)
        except Exception:
            try:
                rid_num = int(re.sub(r'\D+', '', rid) or 0)
            except Exception:
                rid_num = 0
        name = str(rom.get('名前') or '').strip()
        # roms/index.html からの相対パスで assets を参照
        img_rel = f"../assets/roms/{name}.png"
        grid.append({
            'ID': rid,
            'ID_num': rid_num,
            '名前': name,
            '画像': img_rel,
        })
        sets.append({
            'ID': rid,
            'ID_num': rid_num,
            '名前': name,
            '2セット効果': rom.get('2セット効果') or '',
            '4セット効果': rom.get('4セット効果') or '',
        })
        atk, hp, pdef1, pdef2, sdef1, sdef2 = extract_stats(rom)
        stats.append({
            'ID': rid,
            'ID_num': rid_num,
            '名前': name,
            '攻撃': atk,
            'HP': hp,
            '物理防御1': pdef1,
            '物理防御2': pdef2,
            '特殊防御1': sdef1,
            '特殊防御2': sdef2,
        })

    tpl = TPL.read_text(encoding='utf-8')
    data = {
        'ビルド日時': datetime.datetime.now().isoformat(timespec='seconds'),
        'ロム一覧JSON': json.dumps(grid, ensure_ascii=False),
        'ロムセット効果JSON': json.dumps(sets, ensure_ascii=False),
        'ロムステータスJSON': json.dumps(stats, ensure_ascii=False),
    }
    html = expand(tpl, data)
    target_dir = SITE_DIR / 'roms'
    target_dir.mkdir(parents=True, exist_ok=True)
    (target_dir / 'index.html').write_text(html, encoding='utf-8')
    print('Roms index generated ->', target_dir / 'index.html')

if __name__ == '__main__':
    build_roms_index()
