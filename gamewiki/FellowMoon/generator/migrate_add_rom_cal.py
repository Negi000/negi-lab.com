import json
import pathlib
import shutil
from datetime import datetime
import argparse

BASE = pathlib.Path(__file__).resolve().parent.parent
CHAR_JSON = BASE / 'character.json'


def main():
    parser = argparse.ArgumentParser(description='Add/clean ROM & Calibration fields for all characters')
    parser.add_argument('--reset-old-defaults', action='store_true', help='Also replace values that match previously injected defaults')
    args = parser.parse_args()
    data = json.loads(CHAR_JSON.read_text(encoding='utf-8'))
    changed = 0

    ROM_DEFAULT = "候補1：\n候補2："
    CAL_DEFAULTS = {
        '基本較正': '',
        '特定較正1': '未実装',
        '特定較正2': '未実装',
    }

    # Previously injected defaults that should now be cleared/replaced
    ROM_DEFAULT_OLD = "候補1：シャドウC4セット\n候補2：シャドウC2セット、ブラッドV2セット"
    CAL_DEFAULTS_OLD = {
        '基本較正': '定点合意：会心率15.0％上昇',
        '特定較正1': 'レイトメダル：【追加効果】クロウがオーバードライブ技を使用することで敵に追加される〈群鸦乱噪〉の効果を、〈群鸦乱噪〉に変更する。\n各ターンの終了時、クロウの攻撃力の30％の追加ダメージを宿主に与え、その効果はこのバトル終了まで持続する。',
        '特定較正2': '未実装',
    }

    # Keys we don't want to keep anymore
    ROM_REMOVE_KEYS = ['サブOP優先度', '備考']
    CAL_REMOVE_KEYS = ['武器較正', '防具較正', '備考']

    for cid, payload in data.items():
        if not isinstance(payload, dict):
            continue

        # ロム情報
        rom = payload.get('ロム情報')
        if rom is None or not isinstance(rom, dict):
            payload['ロム情報'] = {'推奨ロム': ROM_DEFAULT}
            changed += 1
        else:
            current = rom.get('推奨ロム')
            if (
                '推奨ロム' not in rom
                or (isinstance(current, str) and current.strip() == '')
                or (args.reset_old_defaults and current == ROM_DEFAULT_OLD)
            ):
                rom['推奨ロム'] = ROM_DEFAULT
                changed += 1
            # remove unwanted keys if exist
            for k in ROM_REMOVE_KEYS:
                if k in rom:
                    del rom[k]
                    changed += 1

        # 較正情報
        cal = payload.get('較正情報')
        if cal is None or not isinstance(cal, dict):
            payload['較正情報'] = dict(CAL_DEFAULTS)
            changed += 1
        else:
            for k, v in CAL_DEFAULTS.items():
                cur = cal.get(k)
                if (
                    k not in cal
                    or (isinstance(cur, str) and cur.strip() == '')
                    or (args.reset_old_defaults and k in CAL_DEFAULTS_OLD and cur == CAL_DEFAULTS_OLD[k])
                ):
                    cal[k] = v
                    changed += 1
            # remove unwanted keys if exist
            for k in CAL_REMOVE_KEYS:
                if k in cal:
                    del cal[k]
                    changed += 1

    flag = ' with reset-old-defaults' if args.reset_old_defaults else ''
    if changed:
        ts = datetime.now().strftime('%Y%m%d-%H%M%S')
        backup = CHAR_JSON.with_name(f'character.backup-{ts}.json')
        shutil.copy2(CHAR_JSON, backup)
        CHAR_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'Updated {changed} entries{flag}. Backup created: {backup.name}')
    else:
        print(f'No changes needed{flag}.')


if __name__ == '__main__':
    main()
