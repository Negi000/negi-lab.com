// Global config
// 多言語対応: i18n.jsが読み込まれている場合は動的パスを使用
function getDataBasePath() {
    // i18n.js がロードされていて、getLang() が使える場合
    if (typeof getLang === 'function') {
        const lang = getLang();
        console.log('[script.js] getDataBasePath: lang =', lang);
        return `data/${lang}/`;
    }
    // フォールバック: 日本語データ
    console.log('[script.js] getDataBasePath: fallback to ja');
    return 'data/ja/';
}

// 多言語対応: 詳細データへのアクセサ（日本語/英語キー名の違いを吸収）
function getCharAccessor(char) {
    const lang = typeof getLang === 'function' ? getLang() : 'ja';
    const isJa = lang === 'ja';
    
    // データセクションへのアクセス
    const basicInfo = char.基本情報 || char.basicInfo || {};
    const stats = char.ステータス || char.stats || {};
    const growth = char.成長データ || char.growth || {};
    const skills = char.スキル情報 || char.skills || {};
    const transcendence = char.超越解放効果 || char.transcendence || {};
    const profile = char.プロフィール || char.profile || {};
    const experience = char.経験値 || char.experience || {};
    const potential = char.潜在能力解放 || char.potential || {};
    
    // 役割ID→役割名のマッピング
    const roleMap = {
        '1': isJa ? '攻撃型' : 'Attack',
        '2': isJa ? '魔法型' : 'Magic',
        '3': isJa ? '防御型' : 'Defense',
        '4': isJa ? '支援型' : 'Support',
        '5': isJa ? '万能型' : 'Universal'
    };
    
    // 射程マッピング
    const rangeMap = {
        '1': isJa ? '近距離' : 'Melee',
        '2': isJa ? '遠距離' : 'Ranged'
    };
    
    // レアリティ名の翻訳（multilangデータは全言語で英語キーを使用）
    const rarityTranslate = (val) => {
        if (!val) return '';
        const valLower = val.toLowerCase();
        if (isJa) {
            // 日本語表示用
            const jaMap = {
                'common': '一般', 'rare': '上級', 'epic': '希少',
                'legendary': '伝説', 'legendary+': '伝説+', 'legendary++': '伝説++'
            };
            return jaMap[valLower] || val;
        }
        // 英語表示用（キャピタライズ）
        const enMap = {
            'common': 'Common', 'rare': 'Rare', 'epic': 'Epic',
            'legendary': 'Legendary', 'legendary+': 'Legendary+', 'legendary++': 'Legendary++'
        };
        return enMap[valLower] || val;
    };
    
    // 武器タイプのマッピング
    const weaponTypeMap = {
        '101': isJa ? '物理武器' : 'Physical Weapon',
        '201': isJa ? '魔法武器' : 'Magical Weapon'
    };
    
    // 武器タイプの翻訳
    const getWeaponType = () => {
        const raw = basicInfo.武器タイプ || basicInfo.weaponType || '';
        return weaponTypeMap[raw] || raw;
    };
    
    return {
        // 基本情報
        id: basicInfo.ID || basicInfo.id || '',
        name: basicInfo.名前 || basicInfo.name || '',
        subname: basicInfo.サブネーム || basicInfo.subname || '',
        affiliation: basicInfo.所属 || basicInfo.affiliation || '',
        flavor: basicInfo.フレーバーテキスト || basicInfo.flavor || '',
        rarity: rarityTranslate(basicInfo.レアリティ || basicInfo.rarity) || '',
        star: basicInfo.星 || basicInfo.star || '',
        maxStar: basicInfo.最大星 || basicInfo.maxStar || '',
        role: basicInfo.タイプ || roleMap[basicInfo.role] || basicInfo.role || '',
        roleId: basicInfo.タイプID || basicInfo.role || '',
        range: basicInfo.射程 || rangeMap[basicInfo.range] || basicInfo.range || '',
        weaponType: getWeaponType(),
        
        // ステータス（日本語は日本語キー、その他は英語キー）
        stats,
        getStatKeys: () => isJa 
            ? ['物理攻撃力', '魔法攻撃力', '防御力', 'HP', '敏捷性', 'クリティカル率', '与クリティカルダメージ', 'フェイタルヒット率', 'ブロック率', '被ダメージ減少', 'デバフ回避妨害率', 'デバフ回避率']
            : ['Physical Attack', 'Magical Attack', 'Defense', 'HP', 'Speed', 'Critical Rate'],
        getPercentKeys: () => isJa
            ? new Set(['クリティカル率', '与クリティカルダメージ', 'フェイタルヒット率', 'ブロック率', '被ダメージ減少', 'デバフ回避妨害率', 'デバフ回避率'])
            : new Set(['Critical Rate']),
        
        // スタッツラベルの翻訳マップ（JSONキー→表示ラベル）
        getStatLabel: (key) => {
            if (typeof t !== 'function') return key;
            const statKeyMap = {
                'Physical Attack': 'stats.physicalAttack',
                'Magical Attack': 'stats.magicalAttack',
                'Defense': 'stats.defense',
                'HP': 'stats.hp',
                'Speed': 'stats.speed',
                'Critical Rate': 'stats.critRate',
                '物理攻撃力': 'stats.physicalAttack',
                '魔法攻撃力': 'stats.magicalAttack',
                '防御力': 'stats.defense',
                '敏捷性': 'stats.speed',
                'クリティカル率': 'stats.critRate'
            };
            const i18nKey = statKeyMap[key];
            return i18nKey ? t(i18nKey) : key;
        },
        
        // 成長データ
        growth,
        attackType: growth.攻撃力タイプ || growth.attackType || '',
        level1: growth.レベル1 || growth.level1 || {},
        level30: growth.レベル30 || growth.level30 || {},
        levelUpBonus: growth.レベルアップ上昇値 || growth.levelUpBonus || {},
        reinforceBonus: growth.強化上昇値 || growth.reinforceBonus || {},
        reinforceStages: growth.強化段階別 || growth.reinforceStages || {},
        
        // 経験値
        maxLevelExp: experience.最大レベル累計 || experience.maxLevelTotal || 0,
        
        // 潜在能力
        potential,
        
        // スキル（multilangデータは全言語で (Trans) サフィックスを使用）
        skills,
        getSkillOrder: () => {
            // JSONデータのスキルキーはjaは日本語、それ以外は全て英語で統一されている
            const skillOrders = {
                'ja': ['通常攻撃', '通常攻撃 (Trans)', 'スキル1', 'スキル1 (Trans)', 'スキル2', 'スキル2 (Trans)', 'パッシブ', 'パッシブ (Trans)'],
            };
            // ja以外は全て英語キー
            const enOrder = ['Normal Attack', 'Normal Attack (Trans)', 'Skill 1', 'Skill 1 (Trans)', 'Skill 2', 'Skill 2 (Trans)', 'Passive', 'Passive (Trans)'];
            return skillOrders[lang] || enOrder;
        },
        isTransformedSkill: (skillType) => skillType.includes('(Trans)'),
        // スキルタイプラベルの翻訳（JSONキー→表示ラベル）
        getSkillTypeLabel: (type) => {
            // Trans付きの場合は分離
            const isTrans = type.includes('(Trans)');
            const baseType = type.replace(' (Trans)', '');
            
            // i18nキーマップ
            const skillKeyMap = {
                'Normal Attack': 'skill.normalAttack',
                'Skill 1': 'skill.skill1',
                'Skill 2': 'skill.skill2',
                'Passive': 'skill.passive',
                '通常攻撃': 'skill.normalAttack',
                'スキル1': 'skill.skill1',
                'スキル2': 'skill.skill2',
                'パッシブ': 'skill.passive'
            };
            
            let label = baseType;
            if (typeof t === 'function') {
                const i18nKey = skillKeyMap[baseType];
                if (i18nKey) {
                    label = t(i18nKey);
                }
            }
            
            return isTrans ? label + ' (Trans)' : label;
        },
        
        // 超越解放効果
        transcendence,
        
        // プロフィール
        story: profile.ストーリー || profile.story || '',
        
        // ラベル翻訳用（t関数が使える場合は使用、なければフォールバック）
        labels: {
            id: 'ID',
            rarity: typeof t === 'function' ? t('detail.rarity') : (isJa ? 'レアリティ' : 'Rarity'),
            star: typeof t === 'function' ? t('detail.star') : (isJa ? '星' : 'Star'),
            affiliation: typeof t === 'function' ? t('detail.affiliation') : (isJa ? '所属' : 'Affiliation'),
            role: typeof t === 'function' ? t('detail.type') : (isJa ? 'タイプ' : 'Type'),
            range: typeof t === 'function' ? t('detail.range') : (isJa ? '射程' : 'Range'),
            weapon: typeof t === 'function' ? t('detail.weapon') : (isJa ? '武器' : 'Weapon'),
            noFlavor: typeof t === 'function' ? t('skill.noFlavor') : (isJa ? 'フレーバーテキストはありません。' : 'No flavor text available.'),
            noStory: typeof t === 'function' ? t('skill.noStory') : (isJa ? 'ストーリーはありません。' : 'No story available.'),
            noTranscendence: typeof t === 'function' ? t('skill.noTranscendence') : (isJa ? '超越解放効果はありません' : 'No transcendence effects.'),
        },
        
        // 原データへのアクセス
        raw: char,
        isJa
    };
}

// i18n初期化を待つPromise（シンプルなポーリング方式）
function waitForI18n() {
    return new Promise((resolve) => {
        const checkReady = () => {
            // I18N_READY が true になるまで待つ
            if (typeof I18N_READY !== 'undefined' && I18N_READY === true) {
                const lang = typeof getLang === 'function' ? getLang() : 'unknown';
                console.log('[script.js] i18n ready! lang =', lang);
                resolve();
            } else {
                // 50ms後に再チェック
                setTimeout(checkReady, 50);
            }
        };
        checkReady();
    });
}

// 後方互換性のため、定数も残す（ただし関数を優先）
const DATA_BASE_PATH = 'data/ja/';

// 用語辞書（ツールチップ表示用）
// Multilingual Skill Glossary - loaded from i18n/glossary.json
let SKILL_GLOSSARY_DATA = null;

async function loadSkillGlossary() {
    if (SKILL_GLOSSARY_DATA) return SKILL_GLOSSARY_DATA;
    try {
        SKILL_GLOSSARY_DATA = await fetchJson('i18n/glossary.json');
        return SKILL_GLOSSARY_DATA;
    } catch (e) {
        console.warn('Failed to load glossary:', e);
        SKILL_GLOSSARY_DATA = { terms: [] };
        return SKILL_GLOSSARY_DATA;
    }
}

// Get glossary for current language
// Returns { keyword: description } for current language
function getGlossary() {
    if (!SKILL_GLOSSARY_DATA || !SKILL_GLOSSARY_DATA.terms) return {};
    const lang = (typeof getLang === 'function') ? getLang() : 'ja';
    const result = {};
    for (const term of SKILL_GLOSSARY_DATA.terms) {
        // 日本語以外は英語にフォールバック
        const fallbackLang = lang === 'ja' ? 'ja' : 'en';
        const keyword = term.keywords?.[lang] || term.keywords?.[fallbackLang];
        const description = term.descriptions?.[lang] || term.descriptions?.[fallbackLang];
        if (keyword && description) {
            result[keyword] = description;
        }
    }
    return result;
}

// Portrait index cache (言語ごとにキャッシュ)
let PORTRAIT_INDEX = null;
let PORTRAIT_INDEX_LANG = null;

async function loadPortraitIndex() {
    const currentLang = (typeof getLang === 'function') ? getLang() : 'ja';
    
    // 言語が変わった場合はキャッシュをクリア
    if (PORTRAIT_INDEX && PORTRAIT_INDEX_LANG === currentLang) {
        return PORTRAIT_INDEX;
    }
    
    try {
        // 言語別のportrait_index.jsonを読み込む
        const idx = await fetchJson(`data/${currentLang}/portrait_index.json`);
        PORTRAIT_INDEX = idx;
        PORTRAIT_INDEX_LANG = currentLang;
        return PORTRAIT_INDEX;
    } catch (e) {
        // フォールバック: ルートのportrait_index.json
        try {
            const idx = await fetchJson('data/portrait_index.json');
            PORTRAIT_INDEX = idx;
            PORTRAIT_INDEX_LANG = currentLang;
            return PORTRAIT_INDEX;
        } catch (e2) {
            // portrait_index.json が無くてもページ自体は動くようにする
            PORTRAIT_INDEX = { by_id: {} };
            PORTRAIT_INDEX_LANG = currentLang;
            return PORTRAIT_INDEX;
        }
    }
}

// Page load time for synchronized animations
const PAGE_LOAD_TIME = Date.now();

// Fetch helper
async function fetchJson(path) {
    // Removed cache busting for production performance
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
}

/**
 * スキル説明テキストに用語ツールチップを適用
 * @param {string} text - スキル説明テキスト
 * @returns {string} - ツールチップ付きのHTML
 */
function applyGlossaryTooltips(text) {
    if (!text) return '';
    
    // Get glossary for current language
    const glossary = getGlossary();
    if (Object.keys(glossary).length === 0) {
        // Glossary not loaded yet, return text as-is with line breaks
        return text.replace(/\n/g, '<br>');
    }
    
    // 用語を長い順にソート（部分マッチを避けるため）
    const sortedTerms = Object.keys(glossary).sort((a, b) => b.length - a.length);
    
    // 各用語の出現位置を検出
    const matches = [];
    let workText = text;
    
    for (const term of sortedTerms) {
        let searchStart = 0;
        while (true) {
            const idx = workText.indexOf(term, searchStart);
            if (idx === -1) break;
            
            // この位置が既にマッチ済みの範囲内かチェック
            const overlaps = matches.some(m => 
                (idx >= m.start && idx < m.end) || 
                (idx + term.length > m.start && idx + term.length <= m.end) ||
                (idx <= m.start && idx + term.length >= m.end)
            );
            
            if (!overlaps) {
                matches.push({
                    start: idx,
                    end: idx + term.length,
                    term: term,
                    tooltip: glossary[term]
                });
            }
            searchStart = idx + 1;
        }
    }
    
    // 位置順にソート（後ろから置換するため降順）
    matches.sort((a, b) => b.start - a.start);
    
    // 後ろから順に置換（改行は<br>に変換してdata属性に保存）
    let result = text;
    for (const match of matches) {
        // data-tooltipには改行を&#10;としてエンコード
        const tooltip = match.tooltip.replace(/"/g, '&quot;').replace(/\n/g, '&#10;');
        const replacement = `<span class="glossary-term" data-tooltip="${tooltip}">${match.term}</span>`;
        result = result.substring(0, match.start) + replacement + result.substring(match.end);
    }
    
    // 改行をHTMLに変換
    result = result.replace(/\n/g, '<br>');
    
    return result;
}

// 動的ツールチップの初期化
function initGlossaryTooltips() {
    // ツールチップ用のコンテナを作成
    let tooltipContainer = document.getElementById('glossary-tooltip-container');
    if (!tooltipContainer) {
        tooltipContainer = document.createElement('div');
        tooltipContainer.id = 'glossary-tooltip-container';
        tooltipContainer.className = 'glossary-tooltip-dynamic';
        document.body.appendChild(tooltipContainer);
    }
    
    // イベント委譲でホバーを検出
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('.glossary-term');
        if (!target) return;
        
        const tooltipText = target.getAttribute('data-tooltip');
        if (!tooltipText) return;
        
        // &#10;を改行に戻してHTMLとして表示
        tooltipContainer.innerHTML = tooltipText.replace(/&#10;/g, '<br>');
        tooltipContainer.style.display = 'block';
        
        // 位置を計算
        const rect = target.getBoundingClientRect();
        const tooltipRect = tooltipContainer.getBoundingClientRect();
        
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 10;
        
        // 画面外にはみ出さないよう調整
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10; // 下に表示
        }
        
        tooltipContainer.style.left = left + window.scrollX + 'px';
        tooltipContainer.style.top = top + window.scrollY + 'px';
    });
    
    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('.glossary-term');
        if (!target) return;
        tooltipContainer.style.display = 'none';
    });
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', initGlossaryTooltips);

// Hero Slideshow
function initHeroSlideshow() {
    const slideshow = document.querySelector('.hero-slideshow');
    if (!slideshow) return;
    
    const slides = slideshow.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    const interval = 6000; // 6秒ごとに切り替え
    
    function nextSlide() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }
    
    // 自動切り替え
    setInterval(nextSlide, interval);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    
    if (menuBtn && navUl) {
        menuBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !navUl.contains(e.target)) {
                navUl.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize mobile menu on all pages
    initMobileMenu();
    
    // Initialize hero slideshow
    initHeroSlideshow();
    
    // i18n初期化を待つ（多言語対応）
    await waitForI18n();
    
    // Load skill glossary for tooltips
    await loadSkillGlossary();
    
    try {
        // Determine current page and run appropriate logic
        const path = window.location.pathname;
        
        if (path.endsWith('characters.html')) {
            await initCharacterList();
        } else if (path.endsWith('character_detail.html')) {
            await initCharacterDetail();
        } else if (path.endsWith('index.html') || path.endsWith('/')) {
            // Optional: Load meta data or featured chars
            loadMetaData();
        }
    } catch (error) {
        console.error('Error:', error);
        document.body.innerHTML = `<div class="container"><h1 style="color:red">Error</h1><p>${error.message}</p></div>`;
    }
});

async function loadMetaData() {
    try {
        const meta = await fetchJson(`${getDataBasePath()}meta.json`);
        console.log('Data last updated:', meta.last_updated);
    } catch (e) {
        console.warn('Meta data not found');
    }
}

// --- Character List Page Logic ---
async function initCharacterList() {
    const grid = document.getElementById('character-grid');
    const searchInput = document.getElementById('search-input');
    const roleFilter = document.getElementById('role-filter');
    
    if (!grid) return;

    // Load lightweight list
    let characterList = await fetchJson(`${getDataBasePath()}character_list.json`);
    
    // 言語別リストから未実装フラグを直接取得（各言語のcharacter_list.jsonにunreleasedフラグが含まれている場合）
    // マージ処理は不要になったためコメントアウト
    // 未実装キャラは generate_wiki_data.py および generate_wiki_data_multilang.py で
    // character_list.json 生成時に unreleased: true が設定される
    
    // State for pagination/filtering
    let currentFilteredList = [];
    let displayedCount = 0;
    const BATCH_SIZE = 20; // Reduced to improve initial load speed

    function getRarityAssets(char) {
        let bgNum = '01'; // Default Normal
        let badge = null;

        // 背景色の決定（英語キー対応）
        // common=一般(01), rare=上級(02), epic=希少(03), legendary/legendary+/legendary++=伝説系(04)
        const rarity = (char.rarity || '').toLowerCase();
        if (rarity === 'common' || rarity === '一般') {
            bgNum = '01';
        } else if (rarity === 'rare' || rarity === '上級') {
            bgNum = '02';
        } else if (rarity === 'epic' || rarity === '希少') {
            bgNum = '03';
        } else if (rarity === 'legendary' || rarity === 'legendary+' || rarity === 'legendary++' ||
                   rarity === '伝説' || rarity === '伝説+' || rarity === '伝説++') {
            bgNum = '04';
        }
        
        // バッジの決定（伝説+系のみ）
        if (rarity === 'legendary++' || rarity === '伝説++') {
            badge = 'Atl_UI-List_SPBG03.webp';
        } else if (rarity === 'legendary+' || rarity === '伝説+') {
            badge = 'Atl_UI-List_SPBG01.webp';
        }
        // epic/legendary（無印）はバッジなし

        return {
            bg: `images/icon/Atl_UI-List_GradeBG${bgNum}.webp`,
            badge: badge ? `images/icon/${badge}` : null
        };
    }

    function createCard(char) {
        const card = document.createElement('div');
        card.className = 'character-card-container';
        if (char.unreleased) {
            card.classList.add('unreleased');
        }
        // 言語パラメータを引き継ぐ（現在のURLパラメータを保持）
        const currentParams = new URLSearchParams(window.location.search);
        const langParam = currentParams.get('lang');
        const detailUrl = langParam 
            ? `character_detail.html?id=${char.id}&lang=${langParam}`
            : `character_detail.html?id=${char.id}`;
        card.onclick = () => window.location.href = detailUrl;
        
        const assets = getRarityAssets(char);
        const iconPath = `images/icon/Card/Tex_HeroIcon_${char.id}Card.webp`;
        // Big版フォールバック（未実装キャラ等、Cardが無い場合）
        const bigIconPath = `images/icon/Big/Tex_HeroIcon_${char.id}Big.webp`;
        
        // タイプアイコン (RoleIcon_{roleId}.webp) - roleIdがない場合はroleを使用
        const roleId = String(char.roleId || char.role || '0');
        const typeIconPath = `images/icon/CharacterRoleType/RoleIcon_${roleId.padStart(2, '0')}.webp`;
        
        // 星アイコン (Atl_Symbol_Star_M{star}.webp) - 3～6のみ
        const maxStar = char.star || '3';
        const starIconPath = `images/icon/Stars/Atl_Symbol_Star_M${maxStar}.webp`;
        
        let badgeHtml = '';
        if (assets.badge) {
            // Calculate synchronized animation delay based on page load time
            const elapsed = (Date.now() - PAGE_LOAD_TIME) / 1000; // seconds since page load
            const cyclePosition = elapsed % 10; // position in 10s cycle
            const delay = ((5 - cyclePosition + 10) % 10).toFixed(2);
            
            badgeHtml = `
                <div class="card-badge-container">
                    <img src="${assets.badge}" class="card-badge" alt="badge" loading="lazy" decoding="async">
                    <div class="badge-glow" style="animation-delay: ${delay}s"></div>
                </div>
            `;
        }
        
        // 未実装バッジ
        const unreleasedBadgeHtml = char.unreleased 
            ? `<div class="unreleased-badge" data-i18n="char.unreleased">${t('char.unreleased')}</div>` 
            : '';

        card.innerHTML = `
            <div class="character-card-visual">
                <img src="${assets.bg}" class="card-bg-frame" alt="frame" loading="lazy" decoding="async">
                <div class="card-icon-mask">
                    <img src="${iconPath}" class="card-icon" alt="${char.name}" loading="lazy" decoding="async" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='${bigIconPath}';}else{this.src='https://placehold.co/150x150/1a1a1a/e60012?text=No+Image';}">
                </div>
                ${badgeHtml}
                ${unreleasedBadgeHtml}
                <img src="${typeIconPath}" class="card-type-icon" alt="${char.role}" loading="lazy" decoding="async" onerror="this.style.display='none'">
                <img src="${starIconPath}" class="card-star-icon" alt="${maxStar}星" loading="lazy" decoding="async" onerror="this.style.display='none'">
                <div class="card-name-overlay">
                    <span class="card-name-text">${char.name}</span>
                </div>
            </div>
        `;
        return card;
    }

    function appendItems() {
        const fragment = document.createDocumentFragment();
        const nextBatch = currentFilteredList.slice(displayedCount, displayedCount + BATCH_SIZE);
        
        nextBatch.forEach(char => {
            fragment.appendChild(createCard(char));
        });
        
        grid.appendChild(fragment);
        displayedCount += nextBatch.length;

        // If there are more items, ensure the sentinel is at the end
        if (displayedCount < currentFilteredList.length) {
            observer.observe(sentinel);
        } else {
            observer.unobserve(sentinel);
        }
    }

    // 日本語レアリティ名から英語キーへのマッピング
    const rarityKeyMap = {
        '一般': 'common',
        '上級': 'rare',
        '希少': 'epic',
        '伝説': 'legendary',
        '伝説+': 'legendary+',
        '伝説++': 'legendary++',
        '不明': 'unknown'
    };

    function updateFilter() {
        const filterText = searchInput.value.toLowerCase();
        const filterRole = roleFilter.value;
        const rarityFilter = document.getElementById('rarity-filter');
        const filterRarity = rarityFilter ? rarityFilter.value : '';
        
        // 未実装を表示するかどうか
        const showUnreleasedCheckbox = document.getElementById('show-unreleased');
        const showUnreleased = showUnreleasedCheckbox ? showUnreleasedCheckbox.checked : false;

        currentFilteredList = characterList.filter(char => {
            // 除外ID
            if (char.id === '100500') return false;
            
            // 未実装キャラのフィルター（デフォルトで非表示）
            if (char.unreleased && !showUnreleased) return false;
            
            const nameMatch = char.name.toLowerCase().includes(filterText);
            // roleは日本語データではroleId（数値）、多言語データではrole（数値）を使用
            const charRoleId = char.roleId || char.role;
            const roleMatch = filterRole === '' || charRoleId === filterRole;
            // rarityは日本語データでは日本語名なのでマッピングが必要
            const charRarityKey = rarityKeyMap[char.rarity] || char.rarity;
            const rarityMatch = filterRarity === '' || charRarityKey === filterRarity;
            return nameMatch && roleMatch && rarityMatch;
        });

        // Update results count with i18n
        const resultsInfo = document.getElementById('results-count');
        if (resultsInfo) {
            if (typeof t === 'function') {
                resultsInfo.textContent = t('characters.resultsCount', { count: currentFilteredList.length });
            } else {
                resultsInfo.textContent = `${currentFilteredList.length} 件のキャラクター`;
            }
        }

        // Reset display
        grid.innerHTML = '';
        displayedCount = 0;
        
        // Load first batch
        appendItems();
        
        // Append sentinel for infinite scroll (after items)
        grid.appendChild(sentinel);
    }

    // Infinite Scroll Sentinel
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '20px';
    sentinel.style.width = '100%';
    sentinel.style.gridColumn = '1 / -1'; // スパンして全幅を使用（グリッドセルを占有しない）

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && displayedCount < currentFilteredList.length) {
            appendItems();
            // Move sentinel to bottom
            grid.appendChild(sentinel);
        }
    });

    // Initial render
    updateFilter();

    // Event listeners
    searchInput.addEventListener('input', updateFilter);
    roleFilter.addEventListener('change', updateFilter);
    
    // Rarity filter if exists
    const rarityFilter = document.getElementById('rarity-filter');
    if (rarityFilter) {
        rarityFilter.addEventListener('change', updateFilter);
    }
    
    // 未実装表示チェックボックス
    const showUnreleasedCheckbox = document.getElementById('show-unreleased');
    if (showUnreleasedCheckbox) {
        showUnreleasedCheckbox.addEventListener('change', updateFilter);
    }
    
    // Reset filters function
    window.resetFilters = () => {
        searchInput.value = '';
        roleFilter.value = '';
        if (rarityFilter) rarityFilter.value = '';
        if (showUnreleasedCheckbox) showUnreleasedCheckbox.checked = false;
        updateFilter();
    };
}

// --- Character Detail Page Logic ---
async function initCharacterDetail() {
    const params = new URLSearchParams(window.location.search);
    const charId = params.get('id');
    
    if (!charId) {
        document.querySelector('.detail-container').innerHTML = '<h1>Character ID not specified</h1>';
        return;
    }

    try {
        // Load specific character data
        const versions = await fetchJson(`${getDataBasePath()}details/${charId}.json`);
        
        if (!versions || versions.length === 0) {
            throw new Error('Character data is empty');
        }

        // Default to the first one (highest rarity as sorted by generator)
        renderDetail(versions[0], versions);

    } catch (error) {
        document.querySelector('.detail-container').innerHTML = `<h1>Character not found</h1><p>${error.message}</p>`;
    }
}

function renderDetail(char, versions) {
    // アクセサを使用（日本語/英語キー名の違いを吸収）
    const a = getCharAccessor(char);
    
    // Update Page Title
    document.title = `${a.name} - セブンナイツ リバース Wiki`;
    document.getElementById('char-name-title').textContent = a.name;
    document.getElementById('char-subname').textContent = a.subname || '';

    // Rarity Selector
    const rarityContainer = document.getElementById('rarity-selector');
    rarityContainer.innerHTML = '';
    versions.forEach(v => {
        const va = getCharAccessor(v);
        const btn = document.createElement('button');
        const isCurrent = va.id === a.id;
        btn.className = `rarity-btn ${isCurrent ? 'active' : ''}`;
        btn.textContent = `★${va.star} ${va.rarity}`;
        btn.onclick = () => renderDetail(v, versions);
        rarityContainer.appendChild(btn);
    });

    // Portrait (switchable)
    updatePortrait(char, versions).catch(err => console.warn('Portrait update failed:', err));

    // Basic Info
    const basicInfoGrid = document.getElementById('basic-info-grid');
    const basicInfoItems = [
        { label: a.labels.id, value: a.id },
        { label: a.labels.rarity, value: a.rarity },
        { label: a.labels.star, value: `★${a.star} / ★${a.maxStar}` },
        { label: a.labels.affiliation, value: a.affiliation },
        { label: a.labels.role, value: a.role },
        { label: a.labels.range, value: a.range },
        { label: a.labels.weapon, value: a.weaponType },
    ];
    basicInfoGrid.innerHTML = basicInfoItems.map(item => `
        <div class="basic-info-item">
            <div class="basic-info-label">${item.label}</div>
            <div class="basic-info-value">${item.value}</div>
        </div>
    `).join('');

    // Stats - 基礎値
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = '';

    const STAT_ORDER = a.getStatKeys();
    const PERCENT_KEYS = a.getPercentKeys();

    function toNumber(v) {
        if (v === null || v === undefined || v === '') return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    }

    function formatPercentFromTenth(v) {
        const scaled = v / 10;
        const rounded = Math.round(scaled * 10) / 10;
        const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/, '');
        return `${text}%`;
    }

    function formatStatValue(key, rawValue) {
        const n = toNumber(rawValue);
        if (n === null) return '—';
        if (PERCENT_KEYS.has(key)) return formatPercentFromTenth(n);
        return String(n);
    }

    const stats = a.stats;
    STAT_ORDER.forEach(key => {
        const raw = stats[key];
        const valueText = formatStatValue(key, raw);
        const label = a.getStatLabel ? a.getStatLabel(key) : key;
        statsGrid.innerHTML += `
            <div class="stat-item">
                <span class="label">${label}</span>
                <span class="value">${valueText}</span>
            </div>
        `;
    });

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    
    // スキル説明文からスキル強化効果・超越効果を分離してフォーマット
    function formatSkillDesc(desc) {
        if (!desc) return 'No description';
        
        // 各セクションを分離
        const lines = desc.split('\n');
        let mainDesc = [];
        let enhanceEffect = [];
        let transcendEffects = []; // {stage: number, lines: []}
        let currentSection = 'main';
        let currentTranscendStage = null;
        
        for (const line of lines) {
            if (line.includes('スキル強化効果') || line.includes('Skill Enhancement')) {
                currentSection = 'enhance';
                continue;
            }
            
            // 超越段階達成効果をパース（例：超越2段階達成効果、超越6段階達成効果）
            // 日本語パターン: 超越2段階達成効果
            // 英語パターン: Transcend Lv.2 Effect
            const transcendMatch = line.match(/超越(\d+)段階達成効果/) || line.match(/Transcend\s+Lv\.?\s*(\d+)\s*Effect/i);
            if (transcendMatch) {
                currentSection = 'transcend';
                currentTranscendStage = parseInt(transcendMatch[1]);
                transcendEffects.push({ stage: currentTranscendStage, lines: [] });
                continue;
            }
            
            if (currentSection === 'main') {
                mainDesc.push(line);
            } else if (currentSection === 'enhance') {
                enhanceEffect.push(line);
            } else if (currentSection === 'transcend' && transcendEffects.length > 0) {
                transcendEffects[transcendEffects.length - 1].lines.push(line);
            }
        }
        
        let html = applyGlossaryTooltips(mainDesc.join('\n'));
        
        // 翻訳ヘルパー
        const enhanceLabel = typeof t === 'function' ? t('skill.enhanceEffect') : 'スキル強化効果';
        
        // スキル強化効果ボックス
        if (enhanceEffect.length > 0) {
            const enhanceHtml = applyGlossaryTooltips(enhanceEffect.join('\n'));
            html += `<div class="skill-effect-box enhance">
                <img src="images/icon/Tooltip_TargetIcon_04.webp" class="skill-effect-icon" alt="">
                <span class="skill-effect-label">${enhanceLabel}</span>
                <span class="skill-effect-content">${enhanceHtml}</span>
            </div>`;
        }
        
        // 超越達成効果ボックス（各段階ごと）
        for (const te of transcendEffects) {
            if (te.lines.length > 0) {
                const teHtml = applyGlossaryTooltips(te.lines.join('\n'));
                const iconNum = String(te.stage).padStart(2, '0');
                const transcendLabel = typeof t === 'function' 
                    ? t('skill.transcendEffect', { stage: te.stage }) 
                    : `超越${te.stage}段階達成効果`;
                html += `<div class="skill-effect-box transcend">
                    <img src="images/icon/Tex_Transcendence_${iconNum}.webp" class="skill-effect-icon" alt="">
                    <span class="skill-effect-label">${transcendLabel}</span>
                    <span class="skill-effect-content">${teHtml}</span>
                </div>`;
            }
        }
        
        return html;
    }
    
    // 変化スキルが有効かどうかをチェック（通常スキルと内容が大きく異なる場合のみ表示）
    function isValidTransformSkill(skillType, skill, skillsData) {
        if (!skillType.includes('(Trans)') && !skillType.includes('（変化）')) return true;
        
        // 対応する通常スキルを取得
        const normalType = skillType.replace(' (Trans)', '').replace('（変化）', '');
        const normalSkill = skillsData[normalType];
        
        if (!normalSkill) return true; // 通常スキルがない場合は表示
        
        // 変化スキルの説明が極端に短い場合（ダミーデータの可能性）はスキップ
        const transDescLength = (skill.desc || '').length;
        const normalDescLength = (normalSkill.desc || '').length;
        
        // 変化スキルの説明が通常スキルの25%未満の場合はダミーとみなす
        if (transDescLength < normalDescLength * 0.25 && transDescLength < 100) {
            return false;
        }
        
        return true;
    }
    
    const skillOrder = a.getSkillOrder();
    const skillsData = a.skills;
    skillOrder.forEach(skillType => {
        const skill = skillsData[skillType];
        if (skill && (skill.name || skill.desc)) {
            // 変化スキルが有効かチェック
            if (!isValidTransformSkill(skillType, skill, skillsData)) {
                return; // 無効な変化スキルはスキップ
            }
            
            const descHtml = formatSkillDesc(skill.desc);
            const isTransformed = a.isTransformedSkill(skillType);
            // 表示用タイプ名（変化マーカーを除去）
            const displayType = a.isJa 
                ? (isTransformed ? skillType.replace('（変化）', '') : skillType)
                : (isTransformed ? skillType.replace(' (Trans)', '') : skillType);
            const transformClass = isTransformed ? ' transformed' : '';
            const titleText = skill.name ? skill.name : displayType;
            const transformLabel = a.isJa ? ' (変化)' : ' (Trans)';
            
            // クールタイム表示の多言語対応
            const ctLabel = skill.cooltime 
                ? (typeof t === 'function' ? t('skill.cooltime', { value: skill.cooltime.replace(/[^0-9]/g, '') }) : skill.cooltime)
                : '';
            
            skillsContainer.innerHTML += `
                <div class="skill-card-new${transformClass}">
                    <div class="skill-icon-wrapper">
                        ${skill.icon ? `<img src="${skill.icon}" class="skill-icon-new" onerror="this.style.display='none'" alt="${skill.name}">` : '<div class="skill-icon-new"></div>'}
                    </div>
                    <div class="skill-info">
                        <div class="skill-header-new">
                            <span class="skill-name-new">${titleText}</span>
                            <div class="skill-header-badges">
                                <span class="skill-type-badge${isTransformed ? ' transform' : ''}">${displayType}${isTransformed ? transformLabel : ''}</span>
                                ${ctLabel ? `<span class="skill-ct-badge">${ctLabel}</span>` : ''}
                            </div>
                        </div>
                        <div class="skill-desc-new">${descHtml}</div>
                    </div>
                </div>
            `;
        }
    });

    // Transcendence Effects (超越解放効果)
    const transcendenceContainer = document.getElementById('transcendence-container');
    if (transcendenceContainer) {
        transcendenceContainer.innerHTML = '';
        const transcendence = a.transcendence;
        if (transcendence && Object.keys(transcendence).length > 0) {
            let transcendenceHtml = '';
            for (const [key, value] of Object.entries(transcendence)) {
                if (value) {
                    const stageMatch = key.match(/(\d+)/);
                    const stageNum = stageMatch ? stageMatch[1] : '1';
                    // 2桁の数字にパディング（01〜12）
                    const iconNum = stageNum.padStart(2, '0');
                    const iconPath = `images/icon/Tex_Transcendence_${iconNum}.webp`;
                    transcendenceHtml += `
                        <div class="trans-item">
                            <img src="${iconPath}" class="trans-icon" alt="超越${stageNum}" onerror="this.style.display='none'">
                            <span class="trans-effect">${value}</span>
                        </div>
                    `;
                }
            }
            transcendenceContainer.innerHTML = transcendenceHtml || '<p class="no-data">超越解放効果はありません</p>';
        } else {
            transcendenceContainer.innerHTML = `<p class="no-data">${a.labels.noTranscendence}</p>`;
        }
    }

    // Profile / Flavor Text
    const flavorTextEl = document.getElementById('flavor-text');
    const storyTextEl = document.getElementById('story-text');
    
    if (flavorTextEl) {
        flavorTextEl.textContent = a.flavor ? a.flavor.replace(/\\n/g, '\n') : a.labels.noFlavor;
    }
    if (storyTextEl) {
        storyTextEl.textContent = a.story && a.story !== '-' ? a.story.replace(/\\n/g, '\n') : a.labels.noStory;
    }
    
    // Growth Data (成長データ) - アクセサを渡す
    renderGrowthData(char, a);
    
    // Reinforcement Data (強化段階) - 新デザイン
    renderReinforcementDataNew(char, a);
    
    // Potential Data (潜在能力解放) - 新デザイン
    renderPotentialDataNew(char, a);
    
    // タブの初期化
    initCombatTabs();
    initProfileTabs();
}

// 成長データ表示
function renderGrowthData(char, accessor) {
    const a = accessor || getCharAccessor(char);
    const growthData = a.growth;
    if (!growthData || Object.keys(growthData).length === 0) return;
    
    const lv1Stats = document.getElementById('lv1-stats');
    const lv30Stats = document.getElementById('lv30-stats');
    const totalExpEl = document.getElementById('total-exp');
    
    const attackType = a.attackType;
    const defenseKey = a.isJa ? '防御力' : 'Defense';
    const hpKey = 'HP';
    
    // 表示用ラベル（i18n対応）
    const attackLabel = a.getStatLabel ? a.getStatLabel(attackType) : attackType;
    const defenseLabel = a.getStatLabel ? a.getStatLabel(defenseKey) : defenseKey;
    const hpLabel = a.getStatLabel ? a.getStatLabel(hpKey) : hpKey;
    
    if (lv1Stats && a.level1) {
        const lv1Data = a.level1;
        lv1Stats.innerHTML = `
            <div class="growth-stat-row">
                <span class="name">${attackLabel}</span>
                <span class="val">${lv1Data[attackType]?.toLocaleString() ?? 0}</span>
            </div>
            <div class="growth-stat-row">
                <span class="name">${defenseLabel}</span>
                <span class="val">${lv1Data[defenseKey]?.toLocaleString() ?? 0}</span>
            </div>
            <div class="growth-stat-row">
                <span class="name">${hpLabel}</span>
                <span class="val">${lv1Data[hpKey]?.toLocaleString() ?? 0}</span>
            </div>
        `;
    }
    
    if (lv30Stats && a.level30) {
        const lv30Data = a.level30;
        lv30Stats.innerHTML = `
            <div class="growth-stat-row">
                <span class="name">${attackLabel}</span>
                <span class="val">${lv30Data[attackType]?.toLocaleString() ?? 0}</span>
            </div>
            <div class="growth-stat-row">
                <span class="name">${defenseLabel}</span>
                <span class="val">${lv30Data[defenseKey]?.toLocaleString() ?? 0}</span>
            </div>
            <div class="growth-stat-row">
                <span class="name">${hpLabel}</span>
                <span class="val">${lv30Data[hpKey]?.toLocaleString() ?? 0}</span>
            </div>
        `;
    }
    
    // 経験値
    if (totalExpEl && a.maxLevelExp) {
        totalExpEl.textContent = a.maxLevelExp?.toLocaleString() ?? '—';
    }
}

// 強化段階データ表示 - 新デザイン
function renderReinforcementDataNew(char, accessor) {
    const a = accessor || getCharAccessor(char);
    const growthData = a.growth;
    if (!growthData || Object.keys(growthData).length === 0) return;
    
    const reinforceStats = document.getElementById('reinforce-stats');
    const reinforceCost = document.getElementById('reinforce-cost');
    const buttons = document.querySelectorAll('.reinforce-btn');
    
    if (!reinforceStats || buttons.length === 0) return;
    
    const attackType = a.attackType;
    const defenseKey = a.isJa ? '防御力' : 'Defense';
    const hpKey = 'HP';
    const reinforceData = a.reinforceStages;
    const costData = (a.isJa ? growthData.強化コスト : growthData.reinforceCosts) || [];
    
    // 表示用ラベル（i18n対応）
    const attackLabel = a.getStatLabel ? a.getStatLabel(attackType) : attackType;
    const defenseLabel = a.getStatLabel ? a.getStatLabel(defenseKey) : defenseKey;
    const hpLabel = a.getStatLabel ? a.getStatLabel(hpKey) : hpKey;
    
    function updateReinforceDisplay(level) {
        const levelKey = `+${level}`;
        const stats = reinforceData?.[levelKey];
        
        if (stats) {
            reinforceStats.innerHTML = `
                <div class="reinforce-stat-card">
                    <div class="reinforce-stat-name">${attackLabel}</div>
                    <div class="reinforce-stat-value">${stats[attackType]?.toLocaleString() ?? 0}</div>
                </div>
                <div class="reinforce-stat-card">
                    <div class="reinforce-stat-name">${defenseLabel}</div>
                    <div class="reinforce-stat-value">${stats[defenseKey]?.toLocaleString() ?? 0}</div>
                </div>
                <div class="reinforce-stat-card">
                    <div class="reinforce-stat-name">${hpLabel}</div>
                    <div class="reinforce-stat-value">${stats[hpKey]?.toLocaleString() ?? 0}</div>
                </div>
            `;
        }
        
        // 強化コスト表示
        if (reinforceCost && costData.length > 0) {
            const levelNum = parseInt(level, 10);
            const stageKey = a.isJa ? '段階' : 'stage';
            const costKey = a.isJa ? 'コスト' : 'cost';
            const goldLabel = a.isJa ? 'ゴールド' : 'Gold';
            const maxLabel = a.isJa ? '最大強化' : 'Max Level';
            const cost = costData.find(c => c[stageKey] === levelNum);
            if (cost) {
                reinforceCost.innerHTML = `
                    <span class="cost-icon">💰</span>
                    <span>+${levelNum} → +${levelNum + 1}:</span>
                    <span class="cost-val">${cost[costKey]?.toLocaleString() ?? 0} ${goldLabel}</span>
                `;
            } else {
                reinforceCost.innerHTML = `<span class="cost-val">${maxLabel}</span>`;
            }
        }
        
        // ボタンのアクティブ状態を更新
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === String(level));
        });
    }
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateReinforceDisplay(btn.dataset.level);
        });
    });
    
    // 初期表示（+5）
    updateReinforceDisplay(5);
}

// 潜在能力解放 - 新デザイン
let potentialStateNew = {
    level: 0,
    data: null
};

function renderPotentialDataNew(char, accessor) {
    const a = accessor || getCharAccessor(char);
    const potentialContainer = document.getElementById('potential-container');
    if (!potentialContainer) return;
    
    const potentialData = a.potential;
    const typesData = a.isJa ? potentialData?.タイプ別 : potentialData?.types;
    
    const noDataMsg = a.isJa ? '潜在能力解放データは現在利用できません' : 'Potential release data is not available';
    
    if (!potentialData || !potentialData.available || !typesData || Object.keys(typesData).length === 0) {
        potentialContainer.innerHTML = `
            <p class="potential-placeholder">
                ${potentialData?.message || noDataMsg}
            </p>
        `;
        return;
    }
    
    potentialStateNew.data = potentialData;
    potentialStateNew.level = 0;
    potentialStateNew.isJa = a.isJa;
    
    renderPotentialUINew();
}

function renderPotentialUINew() {
    const potentialContainer = document.getElementById('potential-container');
    if (!potentialContainer || !potentialStateNew.data) return;
    
    const potentialData = potentialStateNew.data;
    const level = potentialStateNew.level;
    const typeData = potentialData.タイプ別 || {};
    
    // 現在の段階 (0-9: 段階1, 10-19: 段階2, 20-30: 段階3)
    const currentStage = level < 10 ? 1 : level < 20 ? 2 : 3;
    const stageLevel = level < 10 ? level : level < 20 ? level - 10 : level - 20;
    
    // 各タイプのステータス計算
    function calculateStatValue(typeName, targetLevel) {
        const stages = typeData[typeName] || {};
        let totalValue = 0;
        const targetStage = targetLevel < 10 ? 1 : targetLevel < 20 ? 2 : 3;
        const targetStageLevel = targetLevel < 10 ? targetLevel : targetLevel < 20 ? targetLevel - 10 : targetLevel - 20;
        
        for (let s = 1; s <= 3; s++) {
            const stage = stages[`段階${s}`];
            if (!stage) continue;
            
            if (s < targetStage) {
                totalValue += stage.最終値 - stage.開始値;
            } else if (s === targetStage) {
                totalValue += stage.上昇値 * targetStageLevel;
            }
        }
        return totalValue;
    }
    
    // コスト計算
    let totalGold = 0;
    let totalMaterial = 0;
    ['攻撃力', '防御力', 'HP'].forEach(type => {
        const stages = typeData[type] || {};
        const stage = stages[`段階${currentStage}`];
        if (stage) {
            totalGold += Math.round(stage.ゴールド / 10);
            totalMaterial += Math.round(stage.素材数 / 10);
        }
    });
    
    const attackValue = calculateStatValue('攻撃力', level);
    const defenseValue = calculateStatValue('防御力', level);
    const hpValue = calculateStatValue('HP', level);
    
    const attackNext = level < 30 ? calculateStatValue('攻撃力', level + 1) : attackValue;
    const defenseNext = level < 30 ? calculateStatValue('防御力', level + 1) : defenseValue;
    const hpNext = level < 30 ? calculateStatValue('HP', level + 1) : hpValue;
    
    let html = `
        <div class="potential-header">
            <div class="potential-level-ctrl">
                <button class="pot-btn" onclick="changePotentialLevelNew(-1)" ${level <= 0 ? 'disabled' : ''}>−</button>
                <div class="pot-level-display">
                    <div class="pot-level-num">Lv.${level}</div>
                    <div class="pot-stage-label">段階${currentStage}</div>
                </div>
                <button class="pot-btn" onclick="changePotentialLevelNew(1)" ${level >= 30 ? 'disabled' : ''}>＋</button>
            </div>
        </div>
        
        <div class="potential-gauge-bar">
            ${Array(30).fill(0).map((_, i) => `
                <div class="gauge-segment${i < level ? ' filled' : ''}${(i === 9 || i === 19) ? ' stage-marker' : ''}"></div>
            `).join('')}
        </div>
        
        <div class="potential-stats-grid">
            <div class="pot-stat-card attack">
                <div class="pot-stat-icon">⚔️</div>
                <div class="pot-stat-name">攻撃力</div>
                <div class="pot-stat-value">+${attackValue.toLocaleString()}</div>
                ${level < 30 
                    ? `<div class="pot-stat-next">→ +${attackNext.toLocaleString()}</div>` 
                    : `<div class="pot-stat-max">MAX</div>`}
            </div>
            <div class="pot-stat-card defense">
                <div class="pot-stat-icon">🛡️</div>
                <div class="pot-stat-name">防御力</div>
                <div class="pot-stat-value">+${defenseValue.toLocaleString()}</div>
                ${level < 30 
                    ? `<div class="pot-stat-next">→ +${defenseNext.toLocaleString()}</div>` 
                    : `<div class="pot-stat-max">MAX</div>`}
            </div>
            <div class="pot-stat-card hp">
                <div class="pot-stat-icon">❤️</div>
                <div class="pot-stat-name">HP</div>
                <div class="pot-stat-value">+${hpValue.toLocaleString()}</div>
                ${level < 30 
                    ? `<div class="pot-stat-next">→ +${hpNext.toLocaleString()}</div>` 
                    : `<div class="pot-stat-max">MAX</div>`}
            </div>
        </div>
    `;
    
    if (level < 30) {
        html += `
            <div class="potential-cost-box">
                <div class="pot-cost-item">
                    <span class="pot-cost-icon">💰</span>
                    <span class="pot-cost-label">ゴールド</span>
                    <span class="pot-cost-val gold">${totalGold.toLocaleString()}</span>
                </div>
                <div class="pot-cost-item">
                    <span class="pot-cost-icon">📦</span>
                    <span class="pot-cost-label">潜在素材</span>
                    <span class="pot-cost-val material">${totalMaterial.toLocaleString()}</span>
                </div>
            </div>
        `;
    } else {
        html += `<div class="pot-complete-msg">✓ 完全解放済み</div>`;
    }
    
    potentialContainer.innerHTML = html;
}

function changePotentialLevelNew(delta) {
    const newLevel = Math.max(0, Math.min(30, potentialStateNew.level + delta));
    if (newLevel !== potentialStateNew.level) {
        potentialStateNew.level = newLevel;
        renderPotentialUINew();
    }
}

// タブ初期化
function initCombatTabs() {
    const tabs = document.querySelectorAll('.combat-tab');
    const panels = document.querySelectorAll('.combat-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`panel-${targetTab}`)?.classList.add('active');
        });
    });
}

function initProfileTabs() {
    const tabs = document.querySelectorAll('.profile-tab');
    const panels = document.querySelectorAll('.profile-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`profile-${targetTab}`)?.classList.add('active');
        });
    });
}

// ポートレートフルスクリーン
let currentPortraitIndex = 0;
let portraitOptions = [];

function openFullscreen() {
    const fullscreen = document.getElementById('portrait-fullscreen');
    const fullscreenImg = document.getElementById('portrait-fullscreen-img');
    const portraitImg = document.getElementById('portrait-img');
    
    if (fullscreen && fullscreenImg && portraitImg) {
        fullscreenImg.src = portraitImg.src;
        fullscreen.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeFullscreen() {
    const fullscreen = document.getElementById('portrait-fullscreen');
    if (fullscreen) {
        fullscreen.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigatePortrait(direction) {
    const select = document.getElementById('portrait-variant-select');
    if (!select || select.options.length === 0) return;
    
    let newIndex = select.selectedIndex + direction;
    if (newIndex < 0) newIndex = select.options.length - 1;
    if (newIndex >= select.options.length) newIndex = 0;
    
    select.selectedIndex = newIndex;
    select.dispatchEvent(new Event('change'));
    
    const fullscreenImg = document.getElementById('portrait-fullscreen-img');
    if (fullscreenImg) {
        fullscreenImg.src = select.value;
    }
}

// ESCキーでフルスクリーンを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
    if (e.key === 'ArrowLeft') {
        navigatePortrait(-1);
    }
    if (e.key === 'ArrowRight') {
        navigatePortrait(1);
    }
});

async function updatePortrait(char, versions) {
    const portraitImg = document.getElementById('portrait-img');
    const select = document.getElementById('portrait-variant-select');
    if (!portraitImg || !select) return;
    
    // アクセサを使用してIDを取得
    const a = getCharAccessor(char);
    const charId = a.id;

    const fallback = () => {
        // Big版にフォールバック（未実装キャラ等）
        portraitImg.src = `images/icon/Big/Tex_HeroIcon_${charId}Big.webp`;
        portraitImg.onerror = () => {
            // 旧仕様のファイル名にも一応フォールバック
            portraitImg.src = `images/portrait/${charId}.webp`;
            portraitImg.onerror = () => {
                portraitImg.src = 'https://placehold.co/400x600/1a1a1a/e60012?text=No+Portrait';
            };
        };
    };

    const idx = await loadPortraitIndex();
    const byId = idx?.by_id || {};

    // 同名キャラのバリエーションIDも含めて候補を集める
    const candidateIds = Array.from(new Set(
        [charId, ...(versions || []).map(v => {
            const va = getCharAccessor(v);
            return va.id;
        })].filter(Boolean)
    ));

    const entries = [];
    candidateIds.forEach(id => {
        const list = byId[String(id)];
        if (Array.isArray(list)) {
            list.forEach(e => entries.push({ ...e, _baseId: String(id) }));
        }
    });

    // 重複パスを除去
    const uniq = [];
    const seen = new Set();
    for (const e of entries) {
        if (!e?.path) continue;
        if (seen.has(e.path)) continue;
        seen.add(e.path);
        uniq.push(e);
    }

    if (uniq.length === 0) {
        // インデックスに無ければ従来パスを試す
        select.innerHTML = '';
        select.style.display = 'none';
        fallback();
        return;
    }

    // 表示優先度: Spine(デフォルト) -> SKRE/HeroIcon -> その他
    const score = (e) => {
        let s = 0;
        // Spineは最優先（デフォルトの姿）
        if (String(e.kind).toLowerCase() === 'spine') s += 200;
        if (String(e.kind).toLowerCase().includes('hero')) s += 100;
        if (String(e.source).toUpperCase() === 'SKRE') s += 50;
        if (e.variant === null || e.variant === undefined || e.variant === '') s += 10;
        return -s;
    };

    uniq.sort((a, b) => {
        const da = score(a);
        const db = score(b);
        if (da !== db) return da - db;
        return String(a.path).localeCompare(String(b.path));
    });

    // optgroup（source/kind）で分類
    const groups = new Map();
    for (const e of uniq) {
        const source = e.source || 'Other';
        const kind = e.kind || 'Portrait';
        const key = `${source}__${kind}`;
        if (!groups.has(key)) groups.set(key, { source, kind, items: [] });
        groups.get(key).items.push(e);
    }

    select.innerHTML = '';
    const sortedGroups = Array.from(groups.values()).sort((a, b) => {
        // Spine を先頭に、次に SKRE
        const spineA = a.kind.toLowerCase() === 'spine' ? 0 : 1;
        const spineB = b.kind.toLowerCase() === 'spine' ? 0 : 1;
        if (spineA !== spineB) return spineA - spineB;
        const sa = a.source.toUpperCase() === 'SKRE' ? 0 : 1;
        const sb = b.source.toUpperCase() === 'SKRE' ? 0 : 1;
        if (sa !== sb) return sa - sb;
        return `${a.source} ${a.kind}`.localeCompare(`${b.source} ${b.kind}`);
    });

    // 表示名マッピング（多言語対応）
    const getSourceLabel = (source) => {
        const keyMap = {
            'SKRE': 'portrait.source.skre',
            'SK1': 'portrait.source.sk1',
            'SK2': 'portrait.source.sk2',
            'SKRV': 'portrait.source.skre',
            'SKTW': 'portrait.source.skre',
            'Costume': 'portrait.kind.costumeIcon',
            'spine': 'portrait.source.spine',
            'ROOT': 'portrait.source.spine'
        };
        const key = keyMap[source];
        if (key && typeof t === 'function') {
            return t(key);
        }
        return source;
    };
    const getKindLabel = (kind) => {
        const keyMap = {
            'HeroIcon': 'portrait.kind.heroIcon',
            'CostumeIcon': 'portrait.kind.costumeIcon',
            'Spine': 'portrait.kind.default'
        };
        const key = keyMap[kind];
        if (key && typeof t === 'function') {
            return t(key);
        }
        return kind;
    };

    for (const g of sortedGroups) {
        const optgroup = document.createElement('optgroup');
        const sourceLabel = getSourceLabel(g.source);
        const kindLabel = getKindLabel(g.kind);
        optgroup.label = `${sourceLabel} / ${kindLabel}`;
        g.items.forEach((e) => {
            const opt = document.createElement('option');
            opt.value = e.path;
            
            // 表示名を決定
            let displayName = '';
            const hasNamedVariant = e.variant && !/^\d+$/.test(String(e.variant));
            const obtainMethod = e.obtain_method || '';
            
            if (String(e.kind).toLowerCase() === 'spine') {
                // Spine: コスチューム名または「デフォルト」
                if (e.variant === null || e.variant === undefined || e.variant === '') {
                    displayName = typeof t === 'function' ? t('portrait.kind.default') : 'デフォルト';
                } else {
                    displayName = e.variant;
                }
            } else if (hasNamedVariant) {
                // 名前付きバリエーション（コスチューム名がある場合）
                displayName = e.variant;
                if (obtainMethod) {
                    displayName += ` [${obtainMethod}]`;
                }
            } else if (e.variant) {
                // 数字バリエーション
                displayName = `${kindLabel} (${e.variant})`;
            } else {
                // デフォルト
                displayName = kindLabel;
            }
            
            opt.textContent = displayName;
            // データ属性に追加情報を保存
            opt.dataset.obtainMethod = obtainMethod || '';
            opt.dataset.variant = e.variant || '';
            optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
    }

    // 1件しかないならセレクタを隠す
    const optionCount = select.querySelectorAll('option').length;
    select.style.display = optionCount > 1 ? '' : 'none';

    // 取得方法表示エリア
    const obtainMethodDiv = document.getElementById('portrait-obtain-method');
    
    const updateObtainMethod = () => {
        if (!obtainMethodDiv) return;
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption) {
            const method = selectedOption.dataset.obtainMethod || '';
            const variant = selectedOption.dataset.variant || '';
            if (method) {
                obtainMethodDiv.innerHTML = `<span class="obtain-label">取得方法:</span> ${method}`;
            } else if (variant && !/^\d+$/.test(variant)) {
                // 名前付きバリエーションだが取得方法がない場合
                obtainMethodDiv.innerHTML = '';
            } else {
                obtainMethodDiv.innerHTML = '';
            }
        } else {
            obtainMethodDiv.innerHTML = '';
        }
    };

    const setImage = (path) => {
        portraitImg.src = path;
        portraitImg.onerror = () => {
            portraitImg.src = 'https://placehold.co/400x600/1a1a1a/e60012?text=No+Portrait';
        };
        updateObtainMethod();
    };

    // 初期表示（先頭）
    const firstOpt = select.querySelector('option');
    if (firstOpt) {
        select.value = firstOpt.value;
        setImage(firstOpt.value);
    } else {
        fallback();
    }

    select.onchange = () => setImage(select.value);
}

// Click Effect Handler
document.addEventListener('click', (e) => {
    const container = document.createElement('div');
    container.className = 'click-effect-container';
    container.style.left = `${e.clientX}px`;
    container.style.top = `${e.clientY}px`;
    
    // Helper to create SVG Arcs
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        const d = [
            "M", start.x, start.y, 
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    }

    // Create 3 rings with SVG
    // Gap is 20% (72deg). Visible is 288deg. Half visible is 144deg.
    // We want to draw from the "back" (180deg from gap) towards the gap.
    // Gap is at 0deg (Top) relative to the SVG rotation.
    // So we start at 180deg (Bottom).
    // Right Arc: 180 -> 180 + 144 = 324 (Clockwise)
    // Left Arc: 180 -> 180 - 144 = 36 (Counter-Clockwise)
    
    const ringConfigs = [
        { r: 8, rot: -135 }, // Inner: Gap at Bottom-Left (225deg) -> Rot -135 (or 225)
        { r: 14, rot: -45 }, // Middle: Gap at Top-Left (315deg) -> Rot -45
        { r: 20, rot: 45 }   // Outer: Gap at Top-Right (45deg) -> Rot 45
    ];

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.classList.add("click-svg-ring");

    ringConfigs.forEach((conf, index) => {
        const group = document.createElementNS(ns, "g");
        group.classList.add("ring-group");
        group.style.transformOrigin = "50px 50px";
        
        // Rotation Animation: Alternating directions
        // Index 0 (Inner): Offset -45 (Starts at rot-45, rotates CW to rot)
        // Index 1 (Middle): Offset +45 (Starts at rot+45, rotates CCW to rot)
        // Index 2 (Outer): Offset -45 (Starts at rot-45, rotates CW to rot)
        const offset = (index % 2 === 0) ? -45 : 45;
        const startRot = conf.rot + offset;
        const endRot = conf.rot;
        
        group.style.setProperty('--rot-from', `${startRot}deg`);
        group.style.setProperty('--rot-to', `${endRot}deg`);
        
        // Right Arc (Clockwise from bottom)
        // Arc 1 (Right side): 180 to 324
        const path1 = document.createElementNS(ns, "path");
        path1.setAttribute("d", describeArc(50, 50, conf.r, 180, 324)); 
        path1.classList.add("ring-path");
        
        // Arc 2 (Left side): 36 to 180
        const path2 = document.createElementNS(ns, "path");
        path2.setAttribute("d", describeArc(50, 50, conf.r, 36, 180));
        path2.classList.add("ring-path");

        group.appendChild(path1);
        group.appendChild(path2);
        svg.appendChild(group);
    });
    
    container.appendChild(svg);

    // Create particles
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        
        // Randomize
        const angle = Math.random() * 360;
        const dist = 15 + Math.random() * 20; // Distance from center
        const size = 2 + Math.random() * 3; // 2px to 5px
        const delay = Math.random() * 0.2; // 0 to 0.2s delay
        
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.setProperty('--angle', `${angle}deg`);
        p.style.setProperty('--dist', `${dist}px`);
        p.style.animationDelay = `${delay}s`;
        
        container.appendChild(p);
    }
    
    document.body.appendChild(container);
    
    // Cleanup
    setTimeout(() => {
        container.remove();
    }, 1200); // Slightly longer for fade out
});

// ===== Lazy Load Image Fade-in =====
document.addEventListener('DOMContentLoaded', function() {
    // Add loaded class to images when they finish loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.classList.add('loaded'); // Still show even on error
            });
        }
    });
    
    // Observe new images added dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    const imgs = node.querySelectorAll ? 
                        node.querySelectorAll('img[loading="lazy"]') : [];
                    imgs.forEach(img => {
                        if (img.complete) {
                            img.classList.add('loaded');
                        } else {
                            img.addEventListener('load', () => img.classList.add('loaded'));
                            img.addEventListener('error', () => img.classList.add('loaded'));
                        }
                    });
                    // Check if node itself is an image
                    if (node.tagName === 'IMG' && node.loading === 'lazy') {
                        if (node.complete) {
                            node.classList.add('loaded');
                        } else {
                            node.addEventListener('load', () => node.classList.add('loaded'));
                            node.addEventListener('error', () => node.classList.add('loaded'));
                        }
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});
