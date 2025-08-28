import json, os, datetime, re, pathlib
from html import escape

BASE = pathlib.Path(__file__).resolve().parent.parent
CHAR_JSON = BASE / 'character.json'
SITE_DIR = BASE / 'site'
CHARS_DIR = SITE_DIR / 'chars'
TPL_CHAR = BASE / 'generator' / 'template.html'
TPL_INDEX = BASE / 'generator' / 'index_template.html'
IMG_CHAR_ROOT = BASE / 'キャラ素材'
IMG_SKILL_ROOT = BASE / 'スキルアイコン'
ROM_IMG_ROOT = BASE / 'ロム素材'
EXPLORE_ICON_MAP = [
    ('交渉','icons/negotiation.png'),
    ('思考','icons/thinking.png'),
    ('情報','icons/info.png'),
    ('技術','icons/tech.png'),
    ('体力','icons/physical.png'),
]

# 簡易 Mustache 風 {{key}} 置換実装
pattern = re.compile(r'{{([^{}#\/]+?)}}')


def load_templates():
    return TPL_CHAR.read_text(encoding='utf-8'), TPL_INDEX.read_text(encoding='utf-8')


def read_characters():
    with CHAR_JSON.open(encoding='utf-8') as f:
        return json.load(f)


def rel_path(p: pathlib.Path):
    rel = os.path.relpath(p, SITE_DIR)
    return rel.replace('..\\', '../').replace('..//', '../')


def collect_image_tabs(char_kanji: str, char_name: str, char_id: str):
    # 立ち絵: {id}-fb.png 及び {id}-fb-<任意>.png など "fb" 基本形で _awake や skin を含まないもの
    # 認証絵: {id}-fb_awake*.png
    # スキン: {id}-skin*.png
    candidates = [c for c in [char_kanji, char_name] if c]
    folder = None
    for c in candidates:
        d = IMG_CHAR_ROOT / c
        if d.exists():
            folder = d
            break
    tabs = []
    if folder:
        # まず全pngを取得して分類フィルタ
        all_png = list(folder.glob(f'{char_id}-*.png'))
        tachi = [p for p in all_png if '-fb' in p.stem and '_awake' not in p.stem and '-skin' not in p.stem]
        ninsho = [p for p in all_png if '-fb_awake' in p.stem]
        skins = [p for p in all_png if '-skin' in p.stem]
        groups = [
            ('tachi','立ち絵', sorted(tachi)),
            ('ninsho','認証絵', sorted(ninsho)),
            ('skin','スキン', sorted(skins)),
        ]
        for tid, label, imgs in groups:
            if not imgs:
                continue
            tabs.append({
                'タブID': tid,
                'タブ名': label,
                '画像列': ['../' + rel_path(p) for p in imgs],
                '枚数': len(imgs)
            })
    return tabs


def expand(template: str, data: dict):
    # 繰り返しブロック {{#キー}} ... {{/キー}}
    def replace_section(text, key, items):
        sec_re = re.compile(r'{{#' + re.escape(key) + r'}}(.*?){{/' + re.escape(key) + r'}}', re.S)
        def repl(m):
            block = m.group(1)
            out_parts = []
            for it in items:
                if isinstance(it, dict):
                    out_parts.append(expand(block, {**data, **it}))
                else:  # primitive
                    out_parts.append(expand(block, {**data, '.': it}))
            return ''.join(out_parts)
        return sec_re.sub(repl, text)
    # 反転（存在しない/空の場合） {{^キー}} ... {{/キー}}
    def replace_inverted(text, key, items):
        inv_re = re.compile(r'{{\^' + re.escape(key) + r'}}(.*?){{/' + re.escape(key) + r'}}', re.S)
        def repl(m):
            if not items:
                return expand(m.group(1), data)
            return ''
        return inv_re.sub(repl, text)

    # 先に section を探す（深さ1想定）
    # Keys from data that are list
    for k, v in list(data.items()):
        if isinstance(v, list):
            template = replace_section(template, k, v)
            template = replace_inverted(template, k, v)

    # 単純置換
    def var_repl(m):
        k = m.group(1).strip()
        return escape(str(data.get(k, '')))
    return pattern.sub(var_repl, template)


def build():
    tpl_char, tpl_index = load_templates()
    raw_chars = read_characters()
    CHARS_DIR.mkdir(parents=True, exist_ok=True)

    index_items = []

    for cid, payload in raw_chars.items():
        if not payload or '基本情報' not in payload:
            continue
        basic = payload['基本情報']
        name = basic.get('名前', '')
        kanji = basic.get('漢字', '')
        tags = [t.strip() for t in basic.get('タグ', '').split('/') if t.strip()] if basic.get('タグ') else []
        skills_raw = payload.get('スキル情報', {})

        skills = []
        skill_file_map = {
            'パッシブスキル': 'ps',
            'スキル1': 'sk1',
            'スキル2': 'sk2',
            'スキル3': 'sk3',
            'サポートスキル': 'ss',
        }
        # スキルアイコンフォルダ特定（漢字/名前候補）
        skill_folder = None
        for c in [kanji, name]:
            if c and (IMG_SKILL_ROOT / c).exists():
                skill_folder = IMG_SKILL_ROOT / c
                break
        for sk_key in ['スキル1','スキル2','スキル3','パッシブスキル','サポートスキル']:
            sk = skills_raw.get(sk_key)
            if not sk:
                continue
            bonus = sk.get('スキルボーナス', {})
            bonus_list = []
            for stage_name, text in bonus.items():
                if text:
                    bonus_list.append({'段階': stage_name, '内容': text})
            icon_path = ''
            code = skill_file_map.get(sk_key)
            if code and skill_folder:
                png = skill_folder / f'{cid}-{code}.png'
                if png.exists():
                    icon_path = '../' + rel_path(png)
            sk_tags = [t.strip() for t in sk.get('スキルタグ','').split('/') if t.strip()]
            skills.append({
                'スキル名': sk.get('スキル名',''),
                'スキル': sk.get('スキル',''),
                'TPLv変化': sk.get('TPLv変化',''),
                'スキルタグ': sk.get('スキルタグ',''),
                'スキルタグ配列': sk_tags,
                'スキル効果': sk.get('スキル効果',''),
                'スキルアイコン': icon_path,
                'スキルボーナス行': bonus_list,
            })

        kaimon_raw = payload.get('階門', {})
        kaimon_list = []
        # 階門は上から順番に 1g..5g アイコンを対応付け
        for idx, (kname, text) in enumerate(kaimon_raw.items()):
            if not text:
                continue
            icon_filename = f'{idx+1}g.png'
            icon_path_full = SITE_DIR / 'assets' / 'icons' / icon_filename
            icon_rel = f'../assets/icons/{icon_filename}' if icon_path_full.exists() else ''
            kaimon_list.append({'名称': kname, '説明': text, 'アイコン': icon_rel})

        # 画像収集
        image_tabs = collect_image_tabs(kanji, name, cid)

        # 専門探索
        explore_init_raw = basic.get('専門探索(初期値)', '')
        explore_max_raw = basic.get('専門探索(最大値)', '')
        def split_five(v):
            arr = [s.strip() for s in v.split(',')] if v else []
            return (arr + ['']*5)[:5]
        explore_init = split_five(explore_init_raw)
        explore_max = split_five(explore_max_raw)
        explore_icons = [{'名称': nm, 'パス': f'../assets/{pth}'} for nm, pth in EXPLORE_ICON_MAP]

        # ロム情報 / 較正情報（任意）
        rom_raw = payload.get('ロム情報', {}) or {}
        cal_raw = payload.get('較正情報', {}) or {}
        def dict_to_rows(d):
            rows = []
            if isinstance(d, dict):
                for k, v in d.items():
                    if v is None or v == '':
                        continue
                    rows.append({'項目': k, '値': v})
            return rows
        rom_rows = dict_to_rows(rom_raw)
        cal_rows = dict_to_rows(cal_raw)

        # ロム候補画像の算出
        def rel_from_site(p: pathlib.Path):
            return '../' + rel_path(p)

        def find_rom_image(file_stem: str):
            # file_stem 例: 'シャドウC4セット' / 'リングR2セット12'
            p = ROM_IMG_ROOT / f'{file_stem}.png'
            if p.exists():
                return rel_from_site(p)
            # 特例: クロニクル -> ｸﾛﾆｸﾙ（2セット系で差異あり）
            alt_stem = file_stem.replace('クロニクル', 'ｸﾛﾆｸﾙ')
            if alt_stem != file_stem:
                p2 = ROM_IMG_ROOT / f'{alt_stem}.png'
                if p2.exists():
                    return rel_from_site(p2)
            return ''

        def parse_rom_candidates(rom_text: str):
            if not rom_text:
                return []
            # 正規化（全角数字やコロンを半角に）
            z2h = str.maketrans({'１':'1','２':'2','：':':'})
            text = rom_text.translate(z2h)
            # 候補1: xxx / 候補2: yyy のような行を抽出（行区切り対応）
            lines = [ln.strip() for ln in re.split('[\n\r]+', text) if ln.strip()]
            joined = ' '.join(lines)
            matches = re.findall(r'候補\s*(1|2)\s*:\s*([^\n\r]+?)(?=\s*候補\s*\d\s*:|$)', joined)
            results = []
            for num, body in matches:
                label = f'候補{num}'
                body = body.strip()
                display_text = body  # 表示用の原文
                imgs = []
                # 4セット: 単一名 + 4セット
                if '4セット' in body:
                    name = body.split('4セット')[0].strip()
                    src = find_rom_image(f'{name}4セット')
                    if src:
                        imgs.append({'src': src, 'alt': f'{name}4セット'})
                # 2セット: 「名前1、名前2 2セット」 or 「名前1、名前2」+明示2セット
                elif '2セット' in body or '、' in body:
                    # 末尾の「2セット」を取り除く
                    base = body.replace('2セット', '').strip()
                    parts = [p.strip() for p in base.split('、') if p.strip()]
                    if len(parts) >= 1:
                        name1 = parts[0]
                        src1 = find_rom_image(f'{name1}2セット12')
                        if src1:
                            imgs.append({'src': src1, 'alt': f'{name1}2セット12'})
                    if len(parts) >= 2:
                        name2 = parts[1]
                        src2 = find_rom_image(f'{name2}2セット34')
                        if src2:
                            imgs.append({'src': src2, 'alt': f'{name2}2セット34'})
                if imgs or display_text:
                    results.append({'ラベル': label, '候補表示': display_text, '画像列': imgs})
            return results

        rom_candidates = []
        if isinstance(rom_raw, dict):
            rom_candidates = parse_rom_candidates(rom_raw.get('推奨ロム', ''))

        char_data = {
            '生成日時': datetime.datetime.now().isoformat(timespec='seconds'),
            **{k: basic.get(k,'') for k in basic.keys()},
            'タグ': tags,
            'スキル': skills,
            '階門': kaimon_list,
            '画像タブ': image_tabs,
            '専門探索初期': explore_init,
            '専門探索最大': explore_max,
            '専門探索アイコン': explore_icons,
            # 追加セクション（ロムは候補画像＋テキストに統一）
            'ロム候補': rom_candidates,
            'ロム候補セクション': [1] if rom_candidates else [],
            '較正配列': cal_rows,
            '較正セクション': [1] if cal_rows else [],
        }
        html = expand(tpl_char, char_data)
        (CHARS_DIR / f'{cid}.html').write_text(html, encoding='utf-8')

        index_items.append({
            **{k: basic.get(k,'') for k in basic.keys()},
            'タグ': tags,
            'タグCSV': ' '.join(tags),
        })

    # index を chars/ ディレクトリに配置（ホームは build_home.py が生成）
    (SITE_DIR / 'chars').mkdir(parents=True, exist_ok=True)
    idx_html = expand(tpl_index, {'一覧': index_items})
    (SITE_DIR / 'chars' / 'index.html').write_text(idx_html, encoding='utf-8')
    print(f'Generated {len(index_items)} characters (chars list).')

if __name__ == '__main__':
    build()
