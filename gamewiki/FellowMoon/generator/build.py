import json, os, datetime, re, pathlib
from html import escape

BASE = pathlib.Path(__file__).resolve().parent.parent
CHAR_JSON = BASE / 'character.json'
SITE_DIR = BASE / 'site'
CHARS_DIR = SITE_DIR / 'chars'
TPL_CHAR = BASE / 'generator' / 'template.html'
TPL_INDEX = BASE / 'generator' / 'index_template.html'
TPL_CHAR_INDEX = BASE / 'generator' / 'character_index_template.html'
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
    return (
        TPL_CHAR.read_text(encoding='utf-8'),
        TPL_INDEX.read_text(encoding='utf-8'),
        TPL_CHAR_INDEX.read_text(encoding='utf-8') if TPL_CHAR_INDEX.exists() else ''
    )


def read_characters():
    with CHAR_JSON.open(encoding='utf-8') as f:
        return json.load(f)


def rel_path(p: pathlib.Path):
    rel = os.path.relpath(p, SITE_DIR)
    # URL 用に区切りをスラッシュへ正規化
    rel = rel.replace('\\', '/').replace('..//', '../')
    if rel.startswith('../'):
        return rel
    # 念のため先頭に ../ を補正するケースはここでは不要（呼び出し側で '../' を付与）
    return rel


def collect_image_tabs(char_kanji: str, char_name: str, char_id: str):
    """キャラ画像タブを収集。
    並び: 立ち絵(tachi) / 認証絵(ninsho) / 後ろ姿(bg) / スキン(skin)
    後ろ姿パターン:
      {id}-bg.png (単一)
      {id}-bg_1.png, {id}-bg_2.png ... (形態別)
      スキンあり複合: {id}-bg_skin1.png または {id}-bg_1_skin1.png のような派生
    スキンパターン既存: {id}-skin*.png
    表示は 1 枚切替 UI （テンプレ側で実装）を想定し、ここでは列配列をそのまま返す。
    """
    candidates = [c for c in [char_kanji, char_name] if c]
    folder = None
    for c in candidates:
        d = IMG_CHAR_ROOT / c
        if d.exists():
            folder = d
            break
    tabs = []
    if not folder:
        return tabs

    all_png = list(folder.glob(f'{char_id}-*.png'))
    # 基本分類
    tachi = [p for p in all_png if '-fb' in p.stem and '_awake' not in p.stem and '-skin' not in p.stem and '-bg' not in p.stem]
    ninsho = [p for p in all_png if '-fb_awake' in p.stem]

    # 後ろ姿: -bg*.png を抽出 (スキン複合含む)
    back_raw = [p for p in all_png if '-bg' in p.stem]
    # スキン (既存): -skin で fb / bg を含まない純スキン (ただし複合型 {id}-bg_skin1.png などは back_raw に含まれるため除外)
    skins = [p for p in all_png if '-skin' in p.stem and '-bg' not in p.stem]

    # 後ろ姿の並びを安定化: 数字や skin の番号順
    def sort_key_bg(p: pathlib.Path):
        # 例: id-bg_2_skin1 -> (2,1) / id-bg_skin1 -> (0,1) / id-bg -> (0,0)
        stem = p.stem
        m = re.findall(r'_?(\d+)', stem.split('-bg')[-1])  # -bg 以降の数字列
        nums = tuple(int(x) for x in m) if m else (0,)
        return nums, stem
    back_sorted = sorted(back_raw, key=sort_key_bg)

    groups = [
        ('tachi','立ち絵', sorted(tachi)),
        ('ninsho','認証絵', sorted(ninsho)),
        ('back','後ろ姿', back_sorted),
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
    tpl_char, tpl_index, tpl_char_index = load_templates()
    raw_chars = read_characters()
    CHARS_DIR.mkdir(parents=True, exist_ok=True)

    index_items = []
    list_items = []  # character.html 用
    # フィルター候補の集合
    rares, attrs, types, factions, tags_all, attack_types_all, skill_tags_all, versions = (
        set(), set(), set(), set(), set(), set(), set(), set()
    )

    for cid, payload in raw_chars.items():
        if not payload or '基本情報' not in payload:
            continue
        basic = payload['基本情報']
        name = basic.get('名前', '')
        kanji = basic.get('漢字', '')
        tags = [t.strip() for t in basic.get('タグ', '').split('/') if t.strip()] if basic.get('タグ') else []
        # 攻撃タイプ（タグと同様に / 区切りで複数想定）
        attack_types = [t.strip() for t in basic.get('攻撃タイプ', '').split('/') if t.strip()] if basic.get('攻撃タイプ') else []
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
            '攻撃タイプ': attack_types,
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
            # 一覧ページ（同一 chars ディレクトリ内の character.html への相対リンク）
            '一覧ページURL': 'character.html',
        }
        html = expand(tpl_char, char_data)
        (CHARS_DIR / f'{cid}.html').write_text(html, encoding='utf-8')

        # 一覧用アイコン探索: キャラ素材/<漢字 or 名前>/<ID>-icon.png と 覚醒アイコン
        icon_rel = ''
        icon_awake_rel = ''
        icon_path = None
        for c in [kanji, name]:
            if not c:
                continue
            p = IMG_CHAR_ROOT / c / f'{cid}-icon.png'
            if p.exists():
                icon_path = p
                icon_rel = '../' + rel_path(p)
                # 覚醒アイコン
                icon_awake_path = p.with_name(f'{cid}-icon_awake.png')
                if icon_awake_path.exists():
                    icon_awake_rel = '../' + rel_path(icon_awake_path)
                break

        basic_info_map = {k: basic.get(k,'') for k in basic.keys()}

        index_items.append({
            **basic_info_map,
            'タグ': tags,
            'タグCSV': ' '.join(tags),
            'アイコン': icon_rel,
            'ID': cid,
        })

        # キャラ一覧（カード）用のレコード
        # レア度画像
        star_img = SITE_DIR / 'assets' / 'icons' / f"star{basic.get('レア度','').strip()}.png"
        star_rel = f"../assets/icons/star{basic.get('レア度','').strip()}.png" if star_img.exists() else ''
        # 属性-タイプ 画像
        attr = basic.get('属性','').strip()
        typ = basic.get('タイプ','').strip()
        attr_type_img = SITE_DIR / 'assets' / 'icons' / f"{attr}-{typ}.png"
        attr_type_rel = f"../assets/icons/{attr}-{typ}.png" if attr_type_img.exists() else ''

        # スキルタグ集約（/ 区切り -> 空白区切り CSV）
        skill_tags = []
        for sk in skills:
            if sk.get('スキルタグ配列'):
                skill_tags.extend(sk['スキルタグ配列'])
        skill_tags = [t for t in (t.strip() for t in skill_tags) if t]
        skill_tags_csv = ' '.join(sorted(set(skill_tags)))

        list_items.append({
            'ID': cid,
            '名前': name,
            'レア度': basic.get('レア度',''),
            '属性': attr,
            'タイプ': typ,
            '陣営': basic.get('陣営',''),
            '実装バージョン': basic.get('実装バージョン',''),
            'タグCSV': ' '.join(tags),
            '攻撃タイプCSV': ' '.join(attack_types),
            'スキルタグCSV': skill_tags_csv,
            'アイコン': icon_rel,
            'アイコン覚醒': icon_awake_rel or icon_rel,
            'レア度画像': star_rel,
            '属性タイプ画像': attr_type_rel,
        })

        # フィルター候補の収集
        if basic.get('レア度'): rares.add(basic.get('レア度'))
        if attr: attrs.add(attr)
        if typ: types.add(typ)
        if basic.get('陣営'): factions.add(basic.get('陣営'))
        for t in tags:
            tags_all.add(t)
        for t in skill_tags:
            skill_tags_all.add(t)
        for t in attack_types:
            attack_types_all.add(t)
        if basic.get('実装バージョン'):
            versions.add(basic.get('実装バージョン'))

    # index を chars/ ディレクトリに配置（ホームは build_home.py が生成）
    (SITE_DIR / 'chars').mkdir(parents=True, exist_ok=True)
    idx_html = expand(tpl_index, {'一覧': index_items})
    (SITE_DIR / 'chars' / 'index.html').write_text(idx_html, encoding='utf-8')
    print(f'Generated {len(index_items)} characters (chars list).')

    # character.html（カード + フィルター）
    if tpl_char_index:
        def sort_num_str(vals):
            try:
                return sorted(vals, key=lambda v: int(str(v)))
            except Exception:
                return sorted(vals)
        # 一覧表示順: レア度(数値) 降順 → 実装バージョン 降順（数値抽出してタプル比較）→ ID 降順
        def parse_version(v):
            if not v:
                return (0,)
            nums = re.findall(r'\d+', str(v))
            if not nums:
                return (0,)
            return tuple(int(n) for n in nums)
        def rarity_int(d):
            try:
                return int(str(d.get('レア度') or 0))
            except Exception:
                return 0
        def id_int(d):
            cid = d.get('ID') or ''
            # 数字を抽出（複数あれば最後を採用）。なければ数値化を試行。
            nums = re.findall(r'\d+', str(cid))
            if nums:
                try:
                    return int(nums[-1])
                except Exception:
                    return 0
            try:
                return int(str(cid))
            except Exception:
                return 0
        sorted_list_items = sorted(
            list_items,
            key=lambda d: (
                rarity_int(d),
                parse_version(d.get('実装バージョン')),
                id_int(d)
            ),
            reverse=True
        )
        # 表示順カスタマイズ
        def ordered(seq, desired):
            seq_set = set(seq)
            out = [x for x in desired if x in seq_set]
            # 残りは元の並び(ソート)で
            rest = [x for x in sorted(seq) if x not in desired]
            return out + rest
        attr_order = ['情','理','信','正','奇']
        type_order = ['強攻型','特攻型','突撃型','補助型','防御型']
        faction_order = ['新月','超管局','全聯堂','燭火教','光耀会','和祥義','単独勢力','超自然セブン']
        attack_type_order = ['物理','特殊','単体','範囲','単発','多段']
        ctx = {
            '一覧': sorted_list_items,
            'レア度一覧': sort_num_str(rares),
            '属性一覧': ordered(attrs, attr_order),
            'タイプ一覧': ordered(types, type_order),
            '陣営一覧': ordered(factions, faction_order),
            'タグ一覧': sorted(tags_all),
            '攻撃タイプ一覧': ordered(attack_types_all, attack_type_order),
            'スキルタグ一覧': sorted(skill_tags_all),
            '実装バージョン一覧': sorted(versions),
        }
        html2 = expand(tpl_char_index, ctx)
        (SITE_DIR / 'chars' / 'character.html').write_text(html2, encoding='utf-8')
        print('Generated character.html (card view).')

if __name__ == '__main__':
    build()
