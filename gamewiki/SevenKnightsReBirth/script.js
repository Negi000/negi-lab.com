// Global config
const DATA_BASE_PATH = 'data/';

// 用語辞書（ツールチップ表示用）
const SKILL_GLOSSARY = {
    '権能': 'HPが0になるダメージを受けた時、HPが1の状態で1回のみ生存。ラウンドごとに1回のみ発動。',
    'シールド': 'ダメージを受ける時、シールド耐久力がHPより優先して減少し、ダメージを吸収する。',
    '不死': '戦闘不能時にHP1で復活。バフが続く限り戦闘不能にならない。ただしHP回復不可。',
    'HP交換': '自分と対象の現在HPを入れ替える。シールドやダメージ遮断の影響を受けない。',
    'HP転換': '対象のHPを指定割合で即時変換。シールドやダメージ遮断の影響を受けない。',
    '祝福': '戦闘不能時、HPを回復して復活する効果。',
    '防御無視': '対象の防御力を無視してダメージを与える。',
    '貫通': '対象の防御力を一部無視してダメージを与える。固定割合の防御力を無視。',
    '挟撃': '味方が攻撃した時、一定確率で追加攻撃を行う。',
    '反撃': '攻撃を受けた時、一定確率で反撃を行う。',
    'マーカー：エネルゲイアの砲火': '<div class="tt-title">マーカー効果（2スタック発動）</div><div class="tt-effect"><span class="tt-target">対象</span>バフ持続1ターン減少</div><div class="tt-effect"><span class="tt-target">自身</span>最大HPの10%回復</div>',
    'マーカー': '対象に付与される特殊な印。重複回数に応じて追加効果が発動する。',
    '行動不能遮断': '気絶・石化・麻痺・睡眠・凍結などの行動不能状態を無効化。',
    '行動不能': '気絶・石化・麻痺・睡眠・凍結など、キャラが行動できない状態の総称。',
    'ダメージ遮断': '指定ターン数の間、受けるダメージを0にする。',
    'ダメージ無効化': '指定回数の攻撃によるダメージを0にする。',
    'デバフ回避妨害率': 'デバフの命中率を上昇させるステータス。高いほどデバフが通りやすい。',
    'デバフ回避率': 'デバフを回避する確率。高いほどデバフを受けにくい。',
    'フェイタルヒット': '残りHP割合が低い敵を優先攻撃し、ダメージが30%上昇する効果。',
    '出血': '毎ターン、スキル使用者の攻撃力60%の貫通ダメージ。最大5重複で効果上昇。',
    '火傷': '毎ターン、スキル使用者の攻撃力80%のダメージを受ける。',
    '毒': '毎ターン、対象の最大HPの6%のダメージを受ける（上限：攻撃力の150%）。',
    '即死': '3ターン後に戦闘不能。重複付与で即時戦闘不能。',
    '気絶': '行動不能になる状態異常。',
    '石化': '行動不能になる状態異常。',
    '麻痺': '行動不能になり、ブロック率が0%になる。',
    '感電': '行動不能になり、攻撃を受けると追加ダメージ（攻撃力40%）を受ける。',
    '睡眠': '行動不能になる状態異常。攻撃を受けると解除される。',
    '沈黙': 'アクティブスキルを使用できなくなる。',
    '暗闇': '命中率が減少する状態異常。',
    '挑発': '敵の攻撃対象に自分が常に含まれるようになる。',
    'バフ継続ターン短縮': '対象のバフの残りターン数を減少させる。',
    'デバフ解除': '対象のデバフを指定個数解除する。',
    'バフ解除': '対象のバフを指定個数解除する。',
    'クールタイム短縮': 'スキルのクールタイムを減少させる。',
    '継続回復': '毎ターンHPを回復する効果。',
    '吸血': '与えたダメージの一定割合をHPとして回復する。',
    '復活': '戦闘不能になった時、HPを回復して復活する。',
    '被回復量減少': '回復効果で受けるHP回復量を減少させるデバフ。',
    '与ダメージ減少': '与えるダメージを減少させるデバフ。',
    '物理衰弱': '受ける物理ダメージが増加するデバフ。',
    '魔法衰弱': '受ける魔法ダメージが増加するデバフ。'
};

// Portrait index cache
let PORTRAIT_INDEX = null;

async function loadPortraitIndex() {
    if (PORTRAIT_INDEX) return PORTRAIT_INDEX;
    try {
        const idx = await fetchJson(`${DATA_BASE_PATH}portrait_index.json`);
        PORTRAIT_INDEX = idx;
        return PORTRAIT_INDEX;
    } catch (e) {
        // portrait_index.json が無くてもページ自体は動くようにする
        PORTRAIT_INDEX = { by_id: {} };
        return PORTRAIT_INDEX;
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
    
    // 用語を長い順にソート（部分マッチを避けるため）
    const sortedTerms = Object.keys(SKILL_GLOSSARY).sort((a, b) => b.length - a.length);
    
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
                    tooltip: SKILL_GLOSSARY[term]
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
        const meta = await fetchJson(`${DATA_BASE_PATH}meta.json`);
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
    const characterList = await fetchJson(`${DATA_BASE_PATH}character_list.json`);
    
    // State for pagination/filtering
    let currentFilteredList = [];
    let displayedCount = 0;
    const BATCH_SIZE = 20; // Reduced to improve initial load speed

    function getRarityAssets(char) {
        let bgNum = '01'; // Default Normal
        let badge = null;

        // 背景色の決定（伝説系は全て同じ背景）
        if (char.rarity === '一般') bgNum = '01';
        else if (char.rarity === '上級') bgNum = '02';
        else if (char.rarity === '希少') bgNum = '03';
        else if (char.rarity === '伝説' || char.rarity === '伝説+' || char.rarity === '伝説++') bgNum = '04';
        
        // バッジの決定（伝説系のみ）
        // 伝説: バッジなし
        // 伝説+: 通常の伝説バッジ (SPBG01)
        // 伝説++: 特別な伝説バッジ (SPBG03)
        if (char.rarity === '伝説++') {
            badge = 'Atl_UI-List_SPBG03.png';
        } else if (char.rarity === '伝説+') {
            badge = 'Atl_UI-List_SPBG01.png';
        }
        // 伝説（無印）はバッジなし

        return {
            bg: `images/icon/Atl_UI-List_GradeBG${bgNum}.png`,
            badge: badge ? `images/icon/${badge}` : null
        };
    }

    function createCard(char) {
        const card = document.createElement('div');
        card.className = 'character-card-container';
        if (char.unreleased) {
            card.classList.add('unreleased');
        }
        card.onclick = () => window.location.href = `character_detail.html?id=${char.id}`;
        
        const assets = getRarityAssets(char);
        const iconPath = `images/icon/Card/Tex_HeroIcon_${char.id}Card.png`;
        
        // タイプアイコン (RoleIcon_{roleId}.png)
        const roleId = char.roleId || '0';
        const typeIconPath = `images/icon/CharacterRoleType/RoleIcon_${roleId.padStart(2, '0')}.png`;
        
        // 星アイコン (Atl_Symbol_Star_M{star}.png) - 3～6のみ
        const maxStar = char.star || '3';
        const starIconPath = `images/icon/Stars/Atl_Symbol_Star_M${maxStar}.png`;
        
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
            ? '<div class="unreleased-badge">未実装</div>' 
            : '';

        card.innerHTML = `
            <div class="character-card-visual">
                <img src="${assets.bg}" class="card-bg-frame" alt="frame" loading="lazy" decoding="async">
                <div class="card-icon-mask">
                    <img src="${iconPath}" onerror="this.src='https://placehold.co/150x150/1a1a1a/e60012?text=No+Image'" class="card-icon" alt="${char.name}" loading="lazy" decoding="async">
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
            const roleMatch = filterRole === '' || char.role === filterRole;
            const rarityMatch = filterRarity === '' || char.rarity === filterRarity;
            return nameMatch && roleMatch && rarityMatch;
        });

        // Update results count
        const resultsInfo = document.getElementById('results-count');
        if (resultsInfo) {
            resultsInfo.textContent = `${currentFilteredList.length} 件のキャラクター`;
        }

        // Reset display
        grid.innerHTML = '';
        displayedCount = 0;
        
        // Append sentinel for infinite scroll
        grid.appendChild(sentinel);
        
        // Load first batch
        appendItems();
    }

    // Infinite Scroll Sentinel
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '20px';
    sentinel.style.width = '100%';

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
        const versions = await fetchJson(`${DATA_BASE_PATH}details/${charId}.json`);
        
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
    // Update Page Title
    document.title = `${char.基本情報.名前} - セブンナイツ リバース Wiki`;
    document.getElementById('char-name-title').textContent = char.基本情報.名前;
    document.getElementById('char-subname').textContent = char.基本情報.サブネーム || '';

    // Rarity Selector
    const rarityContainer = document.getElementById('rarity-selector');
    rarityContainer.innerHTML = '';
    versions.forEach(v => {
        const btn = document.createElement('button');
        const isCurrent = v.基本情報.ID === char.基本情報.ID;
        btn.className = `rarity-btn ${isCurrent ? 'active' : ''}`;
        btn.textContent = `★${v.基本情報.星} ${v.基本情報.レアリティ}`;
        btn.onclick = () => renderDetail(v, versions);
        rarityContainer.appendChild(btn);
    });

    // Portrait (switchable)
    updatePortrait(char, versions).catch(err => console.warn('Portrait update failed:', err));

    // Basic Info
    const basicInfoGrid = document.getElementById('basic-info-grid');
    const basicInfoItems = [
        { label: 'ID', value: char.基本情報.ID ?? '' },
        { label: 'レアリティ', value: char.基本情報.レアリティ ?? '' },
        { label: '星', value: `★${char.基本情報.星 ?? ''} / ★${char.基本情報.最大星 ?? ''}` },
        { label: '所属', value: char.基本情報.所属 ?? '' },
        { label: 'タイプ', value: char.基本情報.タイプ ?? '' },
        { label: '射程', value: char.基本情報.射程 ?? '' },
        { label: '武器', value: char.基本情報.武器タイプ ?? '' },
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

    const STAT_ORDER = [
        '物理攻撃力',
        '魔法攻撃力',
        '防御力',
        'HP',
        '敏捷性',
        'クリティカル率',
        '与クリティカルダメージ',
        'フェイタルヒット率',
        'ブロック率',
        '被ダメージ減少',
        'デバフ回避妨害率',
        'デバフ回避率'
    ];

    const PERCENT_KEYS = new Set([
        'クリティカル率',
        '与クリティカルダメージ',
        'フェイタルヒット率',
        'ブロック率',
        '被ダメージ減少',
        'デバフ回避妨害率',
        'デバフ回避率'
    ]);

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

    const stats = char.ステータス || {};
    STAT_ORDER.forEach(key => {
        const raw = stats[key];
        const valueText = formatStatValue(key, raw);
        statsGrid.innerHTML += `
            <div class="stat-item">
                <span class="label">${key}</span>
                <span class="value">${valueText}</span>
            </div>
        `;
    });

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    
    const skillOrder = [
        '通常攻撃', '通常攻撃（変化）',
        'スキル1', 'スキル1（変化）',
        'スキル2', 'スキル2（変化）',
        'パッシブ', 'パッシブ（変化）'
    ];
    skillOrder.forEach(skillType => {
        const skill = char.スキル情報[skillType];
        if (skill && (skill.name || skill.desc)) {
            const descHtml = skill.desc ? applyGlossaryTooltips(skill.desc) : 'No description';
            const isTransformed = skillType.includes('（変化）');
            const displayType = isTransformed ? skillType.replace('（変化）', '') : skillType;
            const transformClass = isTransformed ? ' transformed' : '';
            const titleText = skill.name ? skill.name : displayType;
            
            skillsContainer.innerHTML += `
                <div class="skill-card-new${transformClass}">
                    <div class="skill-icon-wrapper">
                        ${skill.icon ? `<img src="${skill.icon}" class="skill-icon-new" onerror="this.style.display='none'" alt="${skill.name}">` : '<div class="skill-icon-new"></div>'}
                    </div>
                    <div class="skill-info">
                        <div class="skill-header-new">
                            <span class="skill-name-new">${titleText}</span>
                            <span class="skill-type-badge${isTransformed ? ' transform' : ''}">${displayType}${isTransformed ? ' (変化)' : ''}</span>
                            ${skill.cooltime ? `<span class="skill-ct-badge">${skill.cooltime}</span>` : ''}
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
        const transcendence = char.超越解放効果;
        if (transcendence && Object.keys(transcendence).length > 0) {
            let transcendenceHtml = '';
            for (const [key, value] of Object.entries(transcendence)) {
                if (value) {
                    const stageMatch = key.match(/(\d+)/);
                    const stageNum = stageMatch ? stageMatch[1] : '';
                    transcendenceHtml += `
                        <div class="trans-item">
                            <span class="trans-stage">超越${stageNum}段階</span>
                            <span class="trans-effect">${value}</span>
                        </div>
                    `;
                }
            }
            transcendenceContainer.innerHTML = transcendenceHtml || '<p class="no-data">超越解放効果はありません</p>';
        } else {
            transcendenceContainer.innerHTML = '<p class="no-data">超越解放効果はありません</p>';
        }
    }

    // Profile / Flavor Text
    const flavorTextEl = document.getElementById('flavor-text');
    const storyTextEl = document.getElementById('story-text');
    
    if (flavorTextEl) {
        flavorTextEl.textContent = char.基本情報?.フレーバーテキスト ? char.基本情報.フレーバーテキスト.replace(/\\n/g, '\n') : 'フレーバーテキストはありません。';
    }
    if (storyTextEl) {
        const story = char.プロフィール?.ストーリー;
        storyTextEl.textContent = story && story !== '-' ? story.replace(/\\n/g, '\n') : 'ストーリーはありません。';
    }
    
    // Growth Data (成長データ)
    renderGrowthData(char);
    
    // Reinforcement Data (強化段階) - 新デザイン
    renderReinforcementDataNew(char);
    
    // Potential Data (潜在能力解放) - 新デザイン
    renderPotentialDataNew(char);
    
    // タブの初期化
    initCombatTabs();
    initProfileTabs();
}

// 成長データ表示
function renderGrowthData(char) {
    const growthData = char.成長データ;
    if (!growthData) return;
    
    const lv1Stats = document.getElementById('lv1-stats');
    const lv30Stats = document.getElementById('lv30-stats');
    const totalExpEl = document.getElementById('total-exp');
    
    if (lv1Stats && growthData.レベル1) {
        const attackType = growthData.攻撃力タイプ;
        lv1Stats.innerHTML = `
            <div class="growth-stat-row">
                <span class="name">${attackType}</span>
                <span class="val">${growthData.レベル1[attackType]?.toLocaleString() ?? 0}</span>
            </div>
            <div class="growth-stat-row">
                <span class="name">防御力</span>
                <span class="val">${growthData.レベル1['防御力']?.toLocaleString() ?? 0}</span>
            </div>
            <div class="growth-stat-row">
                <span class="name">HP</span>
                <span class="val">${growthData.レベル1['HP']?.toLocaleString() ?? 0}</span>
            </div>
        `;
    }
    
    if (lv30Stats && growthData.レベル30) {
        const attackType = growthData.攻撃力タイプ;
        lv30Stats.innerHTML = `
            <div class="growth-stat-row">
                <span class="name">${attackType}</span>
                <span class="val">${growthData.レベル30[attackType]?.toLocaleString() ?? 0}</span>
            </div>
            <div class="growth-stat-row">
                <span class="name">防御力</span>
                <span class="val">${growthData.レベル30['防御力']?.toLocaleString() ?? 0}</span>
            </div>
            <div class="growth-stat-row">
                <span class="name">HP</span>
                <span class="val">${growthData.レベル30['HP']?.toLocaleString() ?? 0}</span>
            </div>
        `;
    }
    
    // 経験値
    if (totalExpEl && char.経験値) {
        totalExpEl.textContent = char.経験値.最大レベル累計?.toLocaleString() ?? '—';
    }
}

// 強化段階データ表示 - 新デザイン
function renderReinforcementDataNew(char) {
    const growthData = char.成長データ;
    if (!growthData) return;
    
    const reinforceStats = document.getElementById('reinforce-stats');
    const reinforceCost = document.getElementById('reinforce-cost');
    const buttons = document.querySelectorAll('.reinforce-btn');
    
    if (!reinforceStats || buttons.length === 0) return;
    
    const attackType = growthData.攻撃力タイプ;
    const reinforceData = growthData.強化段階別;
    const costData = growthData.強化コスト || [];
    
    function updateReinforceDisplay(level) {
        const levelKey = `+${level}`;
        const stats = reinforceData?.[levelKey];
        
        if (stats) {
            reinforceStats.innerHTML = `
                <div class="reinforce-stat-card">
                    <div class="reinforce-stat-name">${attackType}</div>
                    <div class="reinforce-stat-value">${stats[attackType]?.toLocaleString() ?? 0}</div>
                </div>
                <div class="reinforce-stat-card">
                    <div class="reinforce-stat-name">防御力</div>
                    <div class="reinforce-stat-value">${stats['防御力']?.toLocaleString() ?? 0}</div>
                </div>
                <div class="reinforce-stat-card">
                    <div class="reinforce-stat-name">HP</div>
                    <div class="reinforce-stat-value">${stats['HP']?.toLocaleString() ?? 0}</div>
                </div>
            `;
        }
        
        // 強化コスト表示
        if (reinforceCost && costData.length > 0) {
            const levelNum = parseInt(level, 10);
            const cost = costData.find(c => c.段階 === levelNum);
            if (cost) {
                reinforceCost.innerHTML = `
                    <span class="cost-icon">💰</span>
                    <span>+${levelNum} → +${levelNum + 1}:</span>
                    <span class="cost-val">${cost.コスト?.toLocaleString() ?? 0} ゴールド</span>
                `;
            } else {
                reinforceCost.innerHTML = `<span class="cost-val">最大強化</span>`;
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

function renderPotentialDataNew(char) {
    const potentialContainer = document.getElementById('potential-container');
    if (!potentialContainer) return;
    
    const potentialData = char.潜在能力解放;
    
    if (!potentialData || !potentialData.available || !potentialData.タイプ別 || Object.keys(potentialData.タイプ別).length === 0) {
        potentialContainer.innerHTML = `
            <p class="potential-placeholder">
                ${potentialData?.message || '潜在能力解放データは現在利用できません'}
            </p>
        `;
        return;
    }
    
    potentialStateNew.data = potentialData;
    potentialStateNew.level = 0;
    
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

    const fallback = () => {
        // 旧仕様のファイル名にも一応フォールバック
        portraitImg.src = `images/portrait/${char.基本情報.ID}.png`;
        portraitImg.onerror = () => {
            portraitImg.src = 'https://placehold.co/400x600/1a1a1a/e60012?text=No+Portrait';
        };
    };

    const idx = await loadPortraitIndex();
    const byId = idx?.by_id || {};

    // 同名キャラのバリエーションIDも含めて候補を集める
    const candidateIds = Array.from(new Set(
        [char?.基本情報?.ID, ...(versions || []).map(v => v?.基本情報?.ID)].filter(Boolean)
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

    // 表示名マッピング
    const SOURCE_LABELS = {
        'SKRE': 'セブンナイツ RE',
        'SK1': 'セブンナイツ 初代',
        'SKRV': 'セブンナイツ RV',
        'SKTW': 'セブンナイツ TW',
        'Costume': 'コスチューム',
        'spine': 'デフォルト',
        'ROOT': 'その他'
    };
    const KIND_LABELS = {
        'HeroIcon': 'イラスト',
        'CostumeIcon': 'コスチューム',
        'Spine': 'Spine'
    };

    for (const g of sortedGroups) {
        const optgroup = document.createElement('optgroup');
        const sourceLabel = SOURCE_LABELS[g.source] || g.source;
        const kindLabel = KIND_LABELS[g.kind] || g.kind;
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
                    displayName = 'デフォルト';
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
