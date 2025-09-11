import os, re
from bs4 import BeautifulSoup

def analyze_wiki_text_content(file_path):
    """HTMLファイルから実際のコンテンツテキストを抽出して分析"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # 不要な要素を除去
        for element in soup(['script', 'style', 'nav', 'header', 'aside']):
            element.decompose()
        
        # data-wiki-content属性を持つ要素からテキストを抽出
        wiki_content_elements = soup.find_all(attrs={'data-wiki-content': True})
        wiki_text = ' '.join([elem.get_text(strip=True) for elem in wiki_content_elements])
        
        # メインコンテンツからテキストを抽出
        main_content = soup.find('main') or soup.find('body')
        if main_content:
            # 広告ブロックを除去
            for ad in main_content.find_all(attrs={'class': re.compile(r'ad-')}):
                ad.decompose()
            
            main_text = main_content.get_text(separator=' ', strip=True)
            # 余分な空白を削除
            main_text = re.sub(r'\s+', ' ', main_text)
        else:
            main_text = ""
        
        # 統計計算
        file_size = os.path.getsize(file_path)
        main_text_len = len(main_text)
        wiki_text_len = len(wiki_text)
        
        return {
            'file_name': os.path.basename(file_path),
            'file_size': file_size,
            'main_text_length': main_text_len,
            'wiki_content_length': wiki_text_len,
            'text_ratio': main_text_len / file_size if file_size > 0 else 0
        }
    except Exception as e:
        return {
            'file_name': os.path.basename(file_path),
            'error': str(e)
        }

# 分析実行
chars_dir = r"c:\Users\241822\Desktop\新しいフォルダー (2)\negi-lab.com\gamewiki\FellowMoon\site\chars"
results = []

for file_name in os.listdir(chars_dir):
    if file_name.endswith('.html') and file_name not in ['index.html', 'character.html']:
        file_path = os.path.join(chars_dir, file_name)
        result = analyze_wiki_text_content(file_path)
        results.append(result)

# 結果をソート
results.sort(key=lambda x: x.get('main_text_length', 0))

# 統計出力
valid_results = [r for r in results if 'error' not in r]
if valid_results:
    text_lengths = [r['main_text_length'] for r in valid_results]
    avg_text = sum(text_lengths) / len(text_lengths)
    min_text = min(text_lengths)
    max_text = max(text_lengths)
    
    print("=== Wikiキャラクターページ テキスト分析結果 ===")
    print(f"分析ファイル数: {len(valid_results)}")
    print(f"テキスト長 - 最小: {min_text:,}文字, 最大: {max_text:,}文字, 平均: {avg_text:,.0f}文字")
    print()
    
    # 詳細結果（上位・下位各5件）
    print("【テキスト量 少ない順 TOP5】")
    for r in valid_results[:5]:
        print(f"{r['file_name']}: {r['main_text_length']:,}文字 (ファイル{r['file_size']:,}bytes, 比率{r['text_ratio']:.1%})")
    
    print("\n【テキスト量 多い順 TOP5】")
    for r in valid_results[-5:]:
        print(f"{r['file_name']}: {r['main_text_length']:,}文字 (ファイル{r['file_size']:,}bytes, 比率{r['text_ratio']:.1%})")
    
    # 推奨CONFIG値
    print(f"\n=== 推奨CONFIG設定 ===")
    print(f"平均テキスト長: {avg_text:.0f}文字")
    
    # 理想的には1画面に1-2個の広告が適切として
    recommended_slot_interval = avg_text / 3  # 3分割で平均3個の広告
    print(f"推奨 textLengthPerExtraSlot: {recommended_slot_interval:.0f} (現在: 1400)")
    
    # キャップ計算例
    base_desktop = 6  # 基本数を少し下げる
    base_mobile = 4
    extra_slots_avg = avg_text / recommended_slot_interval
    total_desktop = base_desktop + extra_slots_avg
    total_mobile = base_mobile + extra_slots_avg
    
    print(f"平均ページでの予想広告数:")
    print(f"  デスクトップ: {base_desktop} + {extra_slots_avg:.1f} = {total_desktop:.1f}個")
    print(f"  モバイル: {base_mobile} + {extra_slots_avg:.1f} = {total_mobile:.1f}個")

else:
    print("有効な結果が得られませんでした")
