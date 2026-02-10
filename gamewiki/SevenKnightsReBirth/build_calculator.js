/**
 * Reverse Equipment Calculator for Seven Knights Re:Birth Wiki
 * 逆算装備計算機 - 目標ステータスから装備組み合わせを提案
 * 
 * v3.1: 修正版（UI改修、超越表記修正、理論値モード追加）
 */

// ========================================
// Equipment Names (★6 Raid Equipment)
// ========================================
const EQUIPMENT_NAMES = {
    physWeapon: '輝くドラゴンスレイヤー',
    magWeapon: '輝くドラゴンロッド',
    armor: '輝くドラゴンアーマー'
};

// ========================================
// Localized Set Effects (from Game.json)
// ========================================
const SET_EFFECTS = {
    atk: {
        id: 1, name: '一番槍',
        effects: { 2: { allAtkRate: 15 }, 4: { allAtkRate: 45, debuffHit: 20 } },
        desc: { 2: 'すべての攻撃力15%', 4: 'すべての攻撃力45% + デバフ命中20%' }
    },
    weak: {
        id: 2, name: '呪術師',
        effects: { 2: { weakpoint: 15 }, 4: { weakpoint: 35, weakpointDmg: 35 } },
        desc: { 2: 'フェイタルヒット率15%', 4: 'フェイタル35% + フェイタルダメ35%' }
    },
    def: {
        id: 3, name: '守護者',
        effects: { 2: { defRate: 15 }, 4: { defRate: 35, debuffResist: 20 } },
        desc: { 2: '防御力15%', 4: '防御力35% + デバフ回避20%' }
    },
    life: {
        id: 4, name: '聖騎士',
        effects: { 2: { hpRate: 17 }, 4: { hpRate: 40 } },
        desc: { 2: 'HP17%', 4: 'HP40% + 毎ターンHP回復' }
    },
    crit: {
        id: 5, name: '暗殺者',
        effects: { 2: { crit: 15 }, 4: { crit: 30 } },
        desc: { 2: 'クリティカル率15%', 4: 'クリ率30% + 貫通ダメ' }
    },
    cdmg: {
        id: 6, name: '追跡者',
        effects: { 2: { skillDmg: 6 }, 4: { skillDmg: 12 } },
        desc: { 2: 'スキルダメ6%', 4: 'スキルダメ12%' }
    },
    block: {
        id: 7, name: '衛士',
        effects: { 2: { block: 15 }, 4: { block: 30, blockDmgReduce: 10 } },
        desc: { 2: 'ブロック率15%', 4: 'ブロック30% + 被ダメ減10%' }
    },
    debuffHit: {
        id: 8, name: '調律者',
        effects: { 2: { debuffHit: 17 }, 4: { debuffHit: 35 } },
        desc: { 2: 'デバフ命中17%', 4: 'デバフ命中35% + バフ延長' }
    },
    debuffResist: {
        id: 9, name: '復讐者',
        effects: { 2: { debuffResist: 17 }, 4: { debuffResist: 35 } },
        desc: { 2: 'デバフ回避17%', 4: 'デバフ回避35% + デバフ短縮' }
    }
};

// ========================================
// Equipment Stats (★6 +15 強化)
// ========================================
const FIXED_STATS = {
    physWeapon: { patk: 304 },
    magWeapon: { matk: 304 },
    armor: { def: 189, hp: 1079 }
};

// ========================================
// メインオプション (★6装備 +15) - 1つのみ
// Corrected based on TID 20162/20262 (Base value * 4)
// ========================================
const MAIN_OPTIONS = {
    weapon: [
        { id: 'allAtkRate', name: 'すべての攻撃力%', value: 28 },
        { id: 'critDmg', name: '与クリティカルダメージ', value: 36 },
        { id: 'crit', name: 'クリティカル率', value: 24 },
        { id: 'weakpoint', name: 'フェイタルヒット率', value: 28 },
        { id: 'defRate', name: '防御力%', value: 28 },
        { id: 'hpRate', name: 'HP%', value: 28 },
        { id: 'debuffHit', name: 'デバフ回避妨害率', value: 36 }
    ],
    armor: [
        { id: 'hpRate', name: 'HP%', value: 28 },
        { id: 'defRate', name: '防御力%', value: 28 },
        { id: 'allAtkRate', name: 'すべての攻撃力%', value: 28 },
        { id: 'block', name: 'ブロック率', value: 24 },
        { id: 'dmgReduction', name: '被ダメージ減少', value: 16 },
        { id: 'debuffResist', name: 'デバフ回避率', value: 36 }
    ]
};

// ========================================
// サブオプション (★6装備) - 4つ、合計5回の強化配分
// EquipSubOptionTID: 30061
// ========================================
const SUB_OPTIONS = [
    { id: 'allAtkRate', name: 'すべての攻撃力%', base: 50, isRate: true },
    { id: 'defRate', name: '防御力%', base: 50, isRate: true },
    { id: 'hpRate', name: 'HP%', base: 50, isRate: true },
    { id: 'crit', name: 'クリティカル率', base: 40, isRate: true },
    { id: 'weakpoint', name: 'フェイタルヒット率', base: 50, isRate: true },
    { id: 'block', name: 'ブロック率', base: 40, isRate: true },
    { id: 'critDmg', name: '与クリティカルダメージ', base: 60, isRate: true },
    { id: 'debuffHit', name: 'デバフ回避妨害率', base: 50, isRate: true },
    { id: 'debuffResist', name: 'デバフ回避率', base: 50, isRate: true },
    { id: 'allAtk', name: 'すべての攻撃力', base: 50, isRate: false },
    { id: 'def', name: '防御力', base: 30, isRate: false },
    { id: 'hp', name: 'HP', base: 180, isRate: false },
    { id: 'speed', name: '敏捷性', base: 4, isRate: false }
];

// ========================================
// Global State
// ========================================
let characterData = [];
let transcendenceData = {};
let selectedCharacter = null;
let selectedTranscendenceLevel = 0;

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadCharacterData();
    await loadTranscendenceData();
    setupEventListeners();
    populateCharacterSelect();
    populateSetSelectors();
    populateEquipmentOptions();
    populateTranscendenceSelector();
});

async function loadCharacterData() {
    try {
        const response = await fetch('wiki_character_data.json');
        const data = await response.json();

        // deduplicate characters by max star
        const maxStarChars = {};
        data.forEach(char => {
            const baseId = char.基本情報.ID.substring(0, 5);
            const star = parseInt(char.基本情報.星);
            if (!maxStarChars[baseId] || star > parseInt(maxStarChars[baseId].基本情報.星)) {
                maxStarChars[baseId] = char;
            }
        });

        characterData = Object.values(maxStarChars).filter(char => {
            return char.基本情報.星 === char.基本情報.最大星;
        }).sort((a, b) => {
            const rarityOrder = { '伝説+': 0, '伝説': 1, '希少': 2, '上級': 3, '一般': 4 };
            const rarityDiff = (rarityOrder[a.基本情報.レアリティ] || 5) - (rarityOrder[b.基本情報.レアリティ] || 5);
            if (rarityDiff !== 0) return rarityDiff;
            return a.基本情報.名前.localeCompare(b.基本情報.名前, 'ja');
        });
    } catch (error) {
        console.error('Failed to load character data:', error);
    }
}

async function loadTranscendenceData() {
    try {
        const response = await fetch('wiki_transcendence_data.json');
        transcendenceData = await response.json();
    } catch (error) {
        console.warn('Transcendence data not found');
        transcendenceData = {};
    }
}

// ========================================
// UI Population
// ========================================
function populateCharacterSelect() {
    const select = document.getElementById('character-select');
    if (!select) return;

    const groups = {};
    characterData.forEach(char => {
        const rarity = char.基本情報.レアリティ;
        if (!groups[rarity]) groups[rarity] = [];
        groups[rarity].push(char);
    });

    ['伝説+', '伝説', '希少', '上級', '一般'].forEach(rarity => {
        if (!groups[rarity]) return;
        const optgroup = document.createElement('optgroup');
        optgroup.label = `★ ${rarity}`;
        groups[rarity].forEach(char => {
            const option = document.createElement('option');
            option.value = char.基本情報.ID;
            option.textContent = `${char.基本情報.名前} (${char.基本情報.タイプ})`;
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    });
}

function populateSetSelectors() {
    document.querySelectorAll('.set-select').forEach(select => {
        select.innerHTML = '<option value="">セット選択</option>';
        Object.entries(SET_EFFECTS).forEach(([key, set]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = set.name;
            select.appendChild(opt);
        });
    });
}

function populateEquipmentOptions() {
    // Populate Main Options
    document.querySelectorAll('.main-option-select').forEach(select => {
        // Skip Accessory slot or special slots if any
        if (select.dataset.slot === 'accessory') return;

        const type = select.dataset.type; // weapon or armor
        if (!type) return;

        const options = MAIN_OPTIONS[type];
        // Keep the default option
        const defaultOpt = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (defaultOpt) select.appendChild(defaultOpt);

        if (options) {
            options.forEach(opt => {
                const el = document.createElement('option');
                el.value = opt.id;
                el.textContent = opt.name;
                select.appendChild(el);
            });
        }
    });

    // Populate Sub Options
    document.querySelectorAll('.sub-option-select').forEach(select => {
        // Keep default
        const defaultOpt = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (defaultOpt) select.appendChild(defaultOpt);

        SUB_OPTIONS.forEach(opt => {
            const el = document.createElement('option');
            el.value = opt.id;
            el.textContent = opt.name;
            select.appendChild(el);
        });
    });
}

function populateTranscendenceSelector() {
    const select = document.getElementById('transcendence-level');
    if (!select) return;

    for (let i = 0; i <= 12; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i === 0 ? '超越なし' : `${i}段階`;
        select.appendChild(opt);
    }
}

// ========================================
// Event Listeners
// ========================================
function setupEventListeners() {
    const charSelect = document.getElementById('character-select');
    const searchInput = document.getElementById('search-input');
    const rarityFilter = document.getElementById('rarity-filter');
    const typeFilter = document.getElementById('type-filter');

    if (charSelect) {
        charSelect.addEventListener('change', onCharacterSelect);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterCharacters);
    }

    if (rarityFilter) {
        rarityFilter.addEventListener('change', filterCharacters);
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', filterCharacters);
    }

    document.getElementById('transcendence-level')?.addEventListener('change', onTranscendenceChange);
    document.getElementById('enhancement-limit')?.addEventListener('change', calculateOptimalCombinations);
    document.getElementById('calculate-btn')?.addEventListener('click', calculateOptimalCombinations);

    // Sub Option Value Limit Logic
    document.querySelectorAll('.sub-value-select').forEach(select => {
        select.addEventListener('change', handleSubValueChange);
    });
}

function handleSubValueChange(e) {
    const changedSelect = e.target;
    const container = changedSelect.closest('.sub-options-container');
    const allSelects = container.querySelectorAll('.sub-value-select');
    const totalDisplay = container.querySelector('.sub-total-display span');
    const totalLabel = container.querySelector('.sub-total-display');

    let total = 0;
    allSelects.forEach(s => total += parseInt(s.value || 0));

    // Update display
    totalDisplay.textContent = total;

    if (total > 5) {
        totalLabel.classList.add('invalid');
        totalLabel.classList.remove('valid');
        // Revert change if strict? Or just warn. User asked for control.
        // Let's enforce strictly: if > 5, reduce the current one
        const excess = total - 5;
        const currentVal = parseInt(changedSelect.value);
        if (currentVal >= excess) {
            changedSelect.value = currentVal - excess;
            total = 5;
            totalDisplay.textContent = total;
            totalLabel.classList.remove('invalid');
            totalLabel.classList.add('valid');
        } else {
            // Edge case, just reset to 0 or leave invalid
            // If we can't subtract effortlessly, just invalid state
            alert('サブオプションの合計強化値は+5までです');
            changedSelect.value = 0;
            // re-calc logic...
            let newTotal = 0;
            allSelects.forEach(s => newTotal += parseInt(s.value || 0));
            totalDisplay.textContent = newTotal;
            totalLabel.classList.remove('invalid');
        }
    } else {
        totalLabel.classList.remove('invalid');
        totalLabel.classList.add('valid');
    }
}

function onCharacterSelect(e) {
    const charId = e.target.value;
    if (!charId) {
        selectedCharacter = null;
        document.getElementById('selected-character-info')?.classList.add('hidden');
        clearBaseStats();
        return;
    }

    selectedCharacter = characterData.find(c => c.基本情報.ID === charId);
    if (!selectedCharacter) return;

    updateCharacterInfo();
    updateBaseStats();
}

function onTranscendenceChange(e) {
    selectedTranscendenceLevel = parseInt(e.target.value) || 0;
    if (selectedCharacter) {
        updateBaseStats();
    }
}

function updateCharacterInfo() {
    if (!selectedCharacter) return;
    const info = selectedCharacter.基本情報;
    const infoDiv = document.getElementById('selected-character-info');

    const portrait = document.getElementById('char-portrait');
    if (portrait) {
        const id = info.ID;
        // Updated Priority: Card Icon -> SKRE -> SK1 -> Costume -> Fallback
        const paths = [
            `images/icon/Card/Tex_HeroIcon_${id}Card.webp`,
            `images/icon/Big/Tex_HeroIcon_${id}Big.webp`,
            `images/portrait/SKRE/Tex_HeroIcon_${id}.webp`,
            `images/portrait/SK1/Tex_HeroIcon_${id}1.webp`,
            `images/portrait/SKRE/Tex_CostumeIcon_${id}1.webp`,
            `images/portrait/${id}/0.webp`
        ];

        tryLoadImage(portrait, paths, 'images/icon/rogo.webp');
        portrait.alt = info.名前;
    }

    document.getElementById('char-name').textContent = info.名前;
    document.getElementById('char-subname').textContent = info.サブネーム;
    document.getElementById('char-meta').textContent = `★${info.星} ${info.レアリティ} | ${info.タイプ} | ${info.武器タイプ}`;
    infoDiv?.classList.remove('hidden');
}

function tryLoadImage(imgElement, paths, fallback) {
    if (paths.length === 0) {
        imgElement.src = fallback;
        return;
    }
    const current = paths.shift();
    imgElement.src = current;
    imgElement.onerror = () => tryLoadImage(imgElement, paths, fallback);
}

function updateBaseStats() {
    if (!selectedCharacter) return;
    const growth = selectedCharacter.成長データ;
    const stats5 = growth.強化段階別['+5'];
    const baseStats = selectedCharacter.ステータス;
    const atkType = growth.攻撃力タイプ;

    const rawPatk = atkType === '物理攻撃力' ? stats5.物理攻撃力 : 0;
    const rawMatk = atkType === '魔法攻撃力' ? stats5.魔法攻撃力 : 0;
    const rawDef = stats5.防御力;
    const rawHp = stats5.HP;

    const transBonus = getTranscendenceBonus();

    // Helper to format flat stats with bonus
    const fmtFlat = (raw, rate) => {
        if (!raw) return '-';
        const bonus = Math.floor(raw * rate / 100);
        const total = raw + bonus;
        // If bonus exists, show (+Bonus)
        return bonus > 0
            ? `${total} <small class="trans-val">(+${bonus})</small>`
            : `${total}`;
    };

    document.getElementById('base-patk').innerHTML = fmtFlat(rawPatk, transBonus.allAtkRate);
    document.getElementById('base-matk').innerHTML = fmtFlat(rawMatk, transBonus.allAtkRate);
    document.getElementById('base-def').innerHTML = fmtFlat(rawDef, transBonus.defRate);
    document.getElementById('base-hp').innerHTML = fmtFlat(rawHp, transBonus.hpRate);
    document.getElementById('base-speed').textContent = baseStats.敏捷性 || '-';

    // Add bonus display for rates without the generic (+Trans) label
    const displayRate = (baseId, bonus) => {
        const raw = parseInt(baseStats[baseId] || 0) / 10;
        const total = (raw + bonus).toFixed(1);
        if (bonus > 0) return `${total}% <small class="trans-val">(+${bonus}%)</small>`;
        return `${total}%`;
    };

    document.getElementById('base-crit').innerHTML = displayRate('クリティカル率', transBonus.crit);
    document.getElementById('base-critdmg').innerHTML = displayRate('与クリティカルダメージ', transBonus.critDmg);
    document.getElementById('base-weakpoint').innerHTML = displayRate('フェイタルヒット率', transBonus.weakpoint);
    document.getElementById('base-block').innerHTML = displayRate('ブロック率', transBonus.block);

    document.getElementById('base-debuffhit').textContent = (parseInt(baseStats.デバフ回避妨害率 || 0) / 10).toFixed(1) + '%';
    document.getElementById('base-debuffresist').textContent = (parseInt(baseStats.デバフ回避率 || 0) / 10).toFixed(1) + '%';

    if (selectedTranscendenceLevel > 0 && document.getElementById('transcendence-bonus')) {
        const bon = [];
        if (transBonus.allAtkRate) bon.push(`攻${transBonus.allAtkRate}%`);
        if (transBonus.defRate) bon.push(`防${transBonus.defRate}%`);
        if (transBonus.hpRate) bon.push(`HP${transBonus.hpRate}%`);
        if (transBonus.crit) bon.push(`クリ${transBonus.crit}%`);
        document.getElementById('transcendence-bonus').textContent = 'ボーナス: ' + bon.join(', ');
    } else {
        document.getElementById('transcendence-bonus').textContent = '';
    }
}

function getTranscendenceBonus() {
    const default_bonus = { allAtkRate: 0, defRate: 0, hpRate: 0, crit: 0, critDmg: 0, weakpoint: 0, block: 0 };
    if (!selectedCharacter || selectedTranscendenceLevel === 0) return default_bonus;

    const charId = selectedCharacter.基本情報.ID;
    const prefix = charId.substring(0, 5);

    if (transcendenceData[prefix] && transcendenceData[prefix][selectedTranscendenceLevel]) {
        return transcendenceData[prefix][selectedTranscendenceLevel];
    }
    return default_bonus;
}

function clearBaseStats() {
}

// ========================================
// Character Base Stats with Transcendence
// ========================================
function getCharacterBaseStats() {
    const growth = selectedCharacter.成長データ;
    const stats5 = growth.強化段階別['+5'];
    const baseStats = selectedCharacter.ステータス;
    const atkType = growth.攻撃力タイプ;
    const transBonus = getTranscendenceBonus();

    const rawPatk = atkType === '物理攻撃力' ? stats5.物理攻撃力 : 0;
    const rawMatk = atkType === '魔法攻撃力' ? stats5.魔法攻撃力 : 0;
    const rawDef = stats5.防御力;
    const rawHp = stats5.HP;

    const patk = rawPatk + Math.floor(rawPatk * transBonus.allAtkRate / 100);
    const matk = rawMatk + Math.floor(rawMatk * transBonus.allAtkRate / 100);
    const def = rawDef + Math.floor(rawDef * transBonus.defRate / 100);
    const hp = rawHp + Math.floor(rawHp * transBonus.hpRate / 100);

    return {
        rawPatk, rawMatk, rawDef, rawHp,
        patk, matk, def, hp,
        speed: parseInt(baseStats.敏捷性 || 0),
        crit: parseInt(baseStats.クリティカル率) / 10 + transBonus.crit,
        critDmg: parseInt(baseStats.与クリティカルダメージ) / 10 + transBonus.critDmg,
        weakpoint: parseInt(baseStats.フェイタルヒット率 || 0) / 10 + transBonus.weakpoint,
        block: parseInt(baseStats.ブロック率 || 0) / 10 + transBonus.block,
        dmgReduction: parseInt(baseStats.被ダメージ減少 || 0) / 10,
        debuffHit: parseInt(baseStats.デバフ回避妨害率 || 0) / 10,
        debuffResist: parseInt(baseStats.デバフ回避率 || 0) / 10,
        isPhysical: atkType === '物理攻撃力',
        transBonus
    };
}

function getTargetStats() {
    return {
        patk: parseFloat(document.getElementById('target-patk')?.value) || 0,
        matk: parseFloat(document.getElementById('target-matk')?.value) || 0,
        def: parseFloat(document.getElementById('target-def')?.value) || 0,
        hp: parseFloat(document.getElementById('target-hp')?.value) || 0,
        speed: parseFloat(document.getElementById('target-speed')?.value) || 0,
        crit: parseFloat(document.getElementById('target-crit')?.value) || 0,
        critDmg: parseFloat(document.getElementById('target-critdmg')?.value) || 0,
        weakpoint: parseFloat(document.getElementById('target-weakpoint')?.value) || 0,
        debuffHit: parseFloat(document.getElementById('target-debuffhit')?.value) || 0
    };
}

function getSubOptionValue(subOption, enhanceCount) {
    const rawValue = subOption.base + subOption.base * enhanceCount;
    return subOption.isRate ? rawValue / 10 : rawValue;
}

// ========================================
// Calculation & Optimization
// ========================================

// Updated signature to accept object of main options AND individual sub patterns
function generateFullCombination(setConfig, mains, subPatterns, charBase) {
    const pieces = [];
    const slotNames = ['武器1', '武器2', '防具1', '防具2'];
    const mainOps = [mains.w1, mains.w2, mains.a1, mains.a2];
    const subDists = [subPatterns.w1, subPatterns.w2, subPatterns.a1, subPatterns.a2];

    for (let i = 0; i < 4; i++) {
        const slotType = i < 2 ? 'weapon' : 'armor';
        const mainOp = mainOps[i];
        const subDist = subDists[i];

        const piece = generateEquipmentPiece(slotType, slotNames[i], setConfig.sets[i], mainOp, subDist, charBase.isPhysical);
        pieces.push(piece);
    }
    const totalStats = calculateTotalStats(pieces, setConfig, charBase);
    // Return detailed main info for display
    return { setConfig, pieces, totalStats, weaponMain: mains.w1, armorMain: mains.a1 };
}

function generateEquipmentPiece(slotType, slotName, setKey, mainOpId, subDistribution, isPhysical) {
    const piece = {
        slot: slotType, slotName: slotName, set: setKey,
        equipName: '', mainOption: null, subOptions: [], stats: {}
    };

    if (slotType === 'weapon') {
        if (isPhysical) {
            piece.equipName = EQUIPMENT_NAMES.physWeapon;
            piece.stats.patk = FIXED_STATS.physWeapon.patk;
        } else {
            piece.equipName = EQUIPMENT_NAMES.magWeapon;
            piece.stats.matk = FIXED_STATS.magWeapon.matk;
        }
    } else {
        piece.equipName = EQUIPMENT_NAMES.armor;
        piece.stats.def = FIXED_STATS.armor.def;
        piece.stats.hp = FIXED_STATS.armor.hp;
    }

    const mainList = slotType === 'weapon' ? MAIN_OPTIONS.weapon : MAIN_OPTIONS.armor;
    const mainData = mainList.find(m => m.id === mainOpId);
    if (mainData) {
        piece.mainOption = { id: mainOpId, name: mainData.name, value: mainData.value };
        piece.stats[mainOpId] = (piece.stats[mainOpId] || 0) + mainData.value;
    }

    // subDistribution is now a Map-like object { statId: count }
    Object.entries(subDistribution).forEach(([subId, enhanceCount]) => {
        const subData = SUB_OPTIONS.find(s => s.id === subId);
        if (subData) {
            const value = getSubOptionValue(subData, enhanceCount);
            piece.subOptions.push({
                id: subId, name: subData.name,
                baseValue: subData.isRate ? subData.base / 10 : subData.base,
                enhanceCount: enhanceCount, totalValue: value, isRate: subData.isRate
            });
            piece.stats[subId] = (piece.stats[subId] || 0) + value;
        }
    });

    return piece;
}

function calculateTotalStats(pieces, setConfig, charBase) {
    const stats = {
        patk: 0, matk: 0, def: 0, hp: 0, allAtk: 0,
        allAtkRate: 0, defRate: 0, hpRate: 0,
        crit: 0, critDmg: 0, weakpoint: 0, block: 0,
        dmgReduction: 0, debuffHit: 0, debuffResist: 0, speed: 0
    };

    pieces.forEach(p => {
        Object.entries(p.stats).forEach(([k, v]) => {
            if (stats[k] !== undefined) stats[k] += v;
        });
    });

    if (setConfig.type === '4set') {
        const eff = SET_EFFECTS[setConfig.sets[0]].effects[4];
        if (eff) Object.entries(eff).forEach(([k, v]) => { if (stats[k] !== undefined) stats[k] += v; });
    } else if (setConfig.type === '2+2') {
        // For 2+2, setConfig.sets is [w1_set, w2_set, a1_set, a2_set]
        // We need to count how many of each set are present to apply 2-set bonuses
        const setCounts = {};
        setConfig.sets.forEach(s => {
            setCounts[s] = (setCounts[s] || 0) + 1;
        });

        Object.entries(setCounts).forEach(([setKey, count]) => {
            if (count >= 2) { // Apply 2-set bonus if at least two pieces have this set
                const eff = SET_EFFECTS[setKey].effects[2];
                if (eff) Object.entries(eff).forEach(([k, v]) => { if (stats[k] !== undefined) stats[k] += v; });
            }
        });
    }

    const totalAtkRate = charBase.transBonus.allAtkRate + stats.allAtkRate;
    const totalDefRate = charBase.transBonus.defRate + stats.defRate;
    const totalHpRate = charBase.transBonus.hpRate + stats.hpRate;

    const finalPatk = charBase.rawPatk + stats.patk + stats.allAtk + Math.floor(charBase.rawPatk * totalAtkRate / 100);
    const finalMatk = charBase.rawMatk + stats.matk + stats.allAtk + Math.floor(charBase.rawMatk * totalAtkRate / 100);
    const finalDef = charBase.rawDef + stats.def + Math.floor(charBase.rawDef * totalDefRate / 100);
    const finalHp = charBase.rawHp + stats.hp + Math.floor(charBase.rawHp * totalHpRate / 100);

    return {
        equipment: stats,
        final: {
            patk: finalPatk, matk: finalMatk, def: finalDef, hp: finalHp,
            speed: charBase.speed + stats.speed,
            crit: charBase.crit + stats.crit,
            critDmg: charBase.critDmg + stats.critDmg,
            weakpoint: charBase.weakpoint + stats.weakpoint,
            block: charBase.block + stats.block,
            dmgReduction: charBase.dmgReduction + stats.dmgReduction,
            debuffHit: charBase.debuffHit + stats.debuffHit,
            debuffResist: charBase.debuffResist + stats.debuffResist
        }
    };
}

// ========================================
// Optimal Combination Search (Optimized v4)
// ========================================
function calculateOptimalCombinations() {
    if (!selectedCharacter) {
        alert('キャラクターを選択してください');
        return;
    }

    const charBase = getCharacterBaseStats();
    const targets = getTargetStats();

    // Get Locked State
    // slots: [{locked:bool, set:str, main:str, subDist:Map}, ...]
    const slotsState = getLockedSlots();

    // Calculate initial gaps to determine priorities for UNLOCKED slots
    const gaps = calculateStatGaps(targets, charBase);

    // 1. Generate Candidates for Main Options
    const wMainCandidates = selectMainOptionCandidates('weapon', gaps, targets);
    const aMainCandidates = selectMainOptionCandidates('armor', gaps, targets);

    const w1Opts = slotsState[0].locked && slotsState[0].main ? [slotsState[0].main] : wMainCandidates;
    const w2Opts = slotsState[1].locked && slotsState[1].main ? [slotsState[1].main] : wMainCandidates;
    const a1Opts = slotsState[2].locked && slotsState[2].main ? [slotsState[2].main] : aMainCandidates;
    const a2Opts = slotsState[3].locked && slotsState[3].main ? [slotsState[3].main] : aMainCandidates;

    // 2. Generate Candidate Distributions for Sub Options
    // Note: generateSubOptionVariations returns generic optimal distributions.
    // If locked, we use the user's specific distribution.
    const standardWVars = generateSubOptionVariations(gaps, 'weapon');
    const standardAVars = generateSubOptionVariations(gaps, 'armor');

    const w1Vars = slotsState[0].locked ? [slotsState[0].subDist] : standardWVars;
    const w2Vars = slotsState[1].locked ? [slotsState[1].subDist] : standardWVars;
    const a1Vars = slotsState[2].locked ? [slotsState[2].subDist] : standardAVars;
    const a2Vars = slotsState[3].locked ? [slotsState[3].subDist] : standardAVars;

    // Get valid sets respecting locks
    const allConfigs = getValidSetConfigs(gaps, targets, slotsState);
    const candidates = [];

    // Generate all combinations with nested loops for individual slots
    allConfigs.forEach(setConfig => {
        w1Opts.forEach(w1Main => {
            w2Opts.forEach(w2Main => {
                a1Opts.forEach(a1Main => {
                    a2Opts.forEach(a2Main => {
                        w1Vars.forEach(w1Sub => {
                            w2Vars.forEach(w2Sub => {
                                a1Vars.forEach(a1Sub => {
                                    a2Vars.forEach(a2Sub => {

                                        const combo = generateFullCombination(
                                            setConfig,
                                            { w1: w1Main, w2: w2Main, a1: a1Main, a2: a2Main },
                                            { w1: w1Sub, w2: w2Sub, a1: a1Sub, a2: a2Sub },
                                            charBase
                                        );
                                        candidates.push(combo);

                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    const results = scoreCombinationsV2(candidates, targets, charBase);
    displayCombinationResults(results.slice(0, 10), charBase, targets);
}

function getLockedSlots() {
    const slots = [];
    // IDs: #equip-0 (weapon1), 1 (weapon2), 2 (armor1), 3 (armor2)
    // Structure: .equipment-slot[data-slot="weapon1"]
    const slotKeys = ['weapon1', 'weapon2', 'armor1', 'armor2'];

    slotKeys.forEach(key => {
        const container = document.querySelector(`.equipment-slot[data-slot="${key}"]`);
        if (!container) return;

        const lockEl = container.querySelector('.slot-lock-toggle');
        const setEl = container.querySelector('.set-select');
        const mainEl = container.querySelector('.main-option-select');

        const isLocked = lockEl && lockEl.checked;

        // Build sub distribution map { statId: count }
        const subDist = {};
        if (isLocked) {
            const subRows = container.querySelectorAll('.sub-option-row');
            subRows.forEach(row => {
                const typeSel = row.querySelector('.sub-option-select');
                const valSel = row.querySelector('.sub-value-select');
                if (typeSel && typeSel.value && valSel) {
                    const count = parseInt(valSel.value) || 0;
                    // Include all selected options, even if count is 0
                    subDist[typeSel.value] = (subDist[typeSel.value] || 0) + count;
                }
            });
        }

        slots.push({
            locked: isLocked,
            set: isLocked && setEl && setEl.value ? setEl.value : null,
            main: isLocked && mainEl && mainEl.value ? mainEl.value : null,
            subDist: subDist // For locked slots this is fixed. For open slots it's ignored/replaced.
        });
    });
    return slots;
}

function calculateStatGaps(targets, charBase) {
    const atkVal = charBase.isPhysical ? charBase.patk : charBase.matk;
    const atkTarget = charBase.isPhysical ? targets.patk : targets.matk;

    return {
        atk: Math.max(0, atkTarget - atkVal),
        hp: Math.max(0, targets.hp - charBase.hp),
        def: Math.max(0, targets.def - charBase.def),
        speed: Math.max(0, targets.speed - charBase.speed),
        crit: Math.max(0, targets.crit - charBase.crit),
        critDmg: Math.max(0, targets.critDmg - charBase.critDmg),
        weakpoint: Math.max(0, targets.weakpoint - charBase.weakpoint),
        debuffHit: Math.max(0, targets.debuffHit - charBase.debuffHit),
        // Normalized weights for prioritization
        atkWeight: atkTarget > 0 ? (atkTarget - atkVal) / atkTarget : 0,
        hpWeight: targets.hp > 0 ? (targets.hp - charBase.hp) / targets.hp : 0,
        critWeight: targets.crit > 0 ? (targets.crit - charBase.crit) / 100 : 0,
        critDmgWeight: targets.critDmg > 0 ? (targets.critDmg - charBase.critDmg) / 300 : 0,
        speedWeight: targets.speed > 0 ? (targets.speed - charBase.speed) / 50 : 0,
        isPhysical: charBase.isPhysical
    };
}

function selectMainOptionCandidates(slotType, gaps, targets) {
    const candidates = new Set();
    const options = MAIN_OPTIONS[slotType];

    // Always include top priority options based on gaps
    if (slotType === 'weapon') {
        // Attack power is almost always needed
        candidates.add('allAtkRate');

        // Add based on gap severity
        if (gaps.critDmg > 50 || targets.critDmg > 200) candidates.add('critDmg');
        if (gaps.crit > 20 || targets.crit > 60) candidates.add('crit');
        if (gaps.weakpoint > 20 || targets.weakpoint > 30) candidates.add('weakpoint');
        if (targets.debuffHit > 30) candidates.add('debuffHit');
    } else {
        // Armor options
        if (gaps.hp > 2000 || targets.hp > 5000) candidates.add('hpRate');
        if (gaps.def > 300 || targets.def > 800) candidates.add('defRate');
        if (gaps.atk > 1000) candidates.add('allAtkRate');

        // Default fallbacks
        candidates.add('hpRate');
        candidates.add('allAtkRate');
    }

    return [...candidates].slice(0, 4); // Limit to top 4 for performance
}

function getValidSetConfigs(gaps, targets, lockedState) {
    const configs = [];
    const setKeys = Object.keys(SET_EFFECTS);

    // Generate ALL 4-set configs (9 total)
    setKeys.forEach(k => {
        // Filter if locks restrict this
        // In 4-set, all 4 slots must match 'k' (or be unlocked)
        let valid = true;
        if (lockedState) {
            for (let i = 0; i < 4; i++) {
                if (lockedState[i].set && lockedState[i].set !== k) {
                    valid = false;
                    break;
                }
            }
        }

        if (valid) {
            configs.push({
                type: '4set',
                sets: [k, k, k, k],
                display: `${SET_EFFECTS[k].name}4`,
                description: SET_EFFECTS[k].desc[4],
                priority: calculate4SetPriority(k, gaps, targets)
            });
        }
    });

    // Generate ALL 2+2 set configs (C(9,2) = 36 total)
    for (let i = 0; i < setKeys.length; i++) {
        for (let j = i + 1; j < setKeys.length; j++) {
            const set1 = setKeys[i];
            const set2 = setKeys[j];

            // Try permutations: [S1, S1, S2, S2], [S2, S2, S1, S1]
            // Standard calc usually assumes weapon=S1, armor=S2. 
            // Better to just try common pairings if locking isn't complex.
            // With locks, we must ensure logical consistency.
            // Since 2+2 usually means (W1,W2) same and (A1,A2) same? 
            // No, 2+2 can be W1=S1, A1=S1, W2=S2, A2=S2 (mixed).
            // But typical meta is weapon set + armor set.
            // Let's simplify: 2 weapons share set, 2 armors share set?
            // User request implies individual slot locking.
            // To be robust, we treat {S1, S2} pair.
            // We check: can {S1, S2} satisfy the 4 locks?
            // Count counts of required sets in locks.

            const requiredCounts = {};
            if (lockedState) {
                lockedState.forEach(s => {
                    if (s.set) requiredCounts[s.set] = (requiredCounts[s.set] || 0) + 1;
                });
            }

            // Check if set1 + set2 can satisfy requiredCounts
            // In a 2+2, we have 2 of S1 and 2 of S2.
            let possible = true;
            Object.entries(requiredCounts).forEach(([setKey, count]) => {
                let available = 0;
                if (setKey === set1) available += 2;
                if (setKey === set2) available += 2;
                if (available < count) possible = false;
            });

            // Check specific slot mismatch if key is neither S1 nor S2
            if (lockedState) {
                lockedState.forEach(s => {
                    if (s.set && s.set !== set1 && s.set !== set2) possible = false;
                });
            }

            if (possible) {
                // If specific slots are locked to specific sets, we must respect that assignment
                // Construct the sets array [w1, w2, a1, a2]
                // Default prioritization: Align with locks if present, else default
                const sets = [null, null, null, null];
                let s1Count = 2; // remaining allocations
                let s2Count = 2;

                // 1. Fill locked slots
                if (lockedState) {
                    lockedState.forEach((state, idx) => {
                        if (state.set) {
                            sets[idx] = state.set;
                            if (state.set === set1) s1Count--;
                            if (state.set === set2) s2Count--;
                        }
                    });
                }

                // 2. Fill unlocked slots
                for (let idx = 0; idx < 4; idx++) {
                    if (!sets[idx]) {
                        if (s1Count > 0) { sets[idx] = set1; s1Count--; }
                        else { sets[idx] = set2; s2Count--; }
                    }
                }

                const desc1 = SET_EFFECTS[set1].desc[2];
                const desc2 = SET_EFFECTS[set2].desc[2];
                configs.push({
                    type: '2+2',
                    sets: sets,
                    display: `${SET_EFFECTS[set1].name}2 + ${SET_EFFECTS[set2].name}2`,
                    description: `${desc1} / ${desc2}`,
                    priority: calculate2SetPriority(set1, gaps, targets) + calculate2SetPriority(set2, gaps, targets)
                });
            }
        }
    }

    // Sort by priority and take top 25 for performance, unless heavily locked (locks reduce count anyway)
    configs.sort((a, b) => b.priority - a.priority);
    return configs.slice(0, 25);
}

function calculate4SetPriority(setKey, gaps, targets) {
    let priority = 0;
    const effects = SET_EFFECTS[setKey].effects[4];

    if (effects.allAtkRate && gaps.atk > 0) priority += gaps.atkWeight * effects.allAtkRate;
    if (effects.crit && gaps.crit > 0) priority += gaps.critWeight * effects.crit * 3;
    if (effects.hpRate && gaps.hp > 0) priority += gaps.hpWeight * effects.hpRate;
    if (effects.defRate && gaps.def > 0) priority += effects.defRate * 0.5;
    if (effects.weakpoint && gaps.weakpoint > 0) priority += effects.weakpoint * 2;
    if (effects.debuffHit && gaps.debuffHit > 0) priority += effects.debuffHit;

    return priority;
}

function calculate2SetPriority(setKey, gaps, targets) {
    let priority = 0;
    const effects = SET_EFFECTS[setKey].effects[2];

    if (effects.allAtkRate && gaps.atk > 0) priority += gaps.atkWeight * effects.allAtkRate;
    if (effects.crit && gaps.crit > 0) priority += gaps.critWeight * effects.crit * 3;
    if (effects.hpRate && gaps.hp > 0) priority += gaps.hpWeight * effects.hpRate;
    if (effects.defRate && gaps.def > 0) priority += effects.defRate * 0.5;
    if (effects.weakpoint && gaps.weakpoint > 0) priority += effects.weakpoint * 2;
    if (effects.debuffHit && gaps.debuffHit > 0) priority += effects.debuffHit;

    return priority;
}

function calculateRemainingGaps(gaps, weaponMain, armorMain, setConfig, charBase) {
    // Start with original gaps
    const remaining = { ...gaps };

    // Subtract main option contributions (x2 for 2 weapons, x2 for 2 armors)
    const wMainData = MAIN_OPTIONS.weapon.find(m => m.id === weaponMain);
    const aMainData = MAIN_OPTIONS.armor.find(m => m.id === armorMain);

    if (wMainData) {
        const contribution = wMainData.value * 2; // 2 weapons
        applyStatReduction(remaining, wMainData.id, contribution, charBase);
    }
    if (aMainData) {
        const contribution = aMainData.value * 2; // 2 armors
        applyStatReduction(remaining, aMainData.id, contribution, charBase);
    }

    // Subtract set bonus contributions
    if (setConfig.type === '4set') {
        const effects = SET_EFFECTS[setConfig.sets[0]].effects[4];
        Object.entries(effects).forEach(([k, v]) => {
            applyStatReduction(remaining, k, v, charBase);
        });
    } else {
        [setConfig.sets[0], setConfig.sets[2]].forEach(key => {
            const effects = SET_EFFECTS[key].effects[2];
            Object.entries(effects).forEach(([k, v]) => {
                applyStatReduction(remaining, k, v, charBase);
            });
        });
    }

    return remaining;
}

function applyStatReduction(gaps, statId, value, charBase) {
    // Map stat IDs to gap keys and apply reductions
    const mapping = {
        'allAtkRate': 'atk',
        'crit': 'crit',
        'critDmg': 'critDmg',
        'weakpoint': 'weakpoint',
        'hpRate': 'hp',
        'defRate': 'def',
        'debuffHit': 'debuffHit',
        'speed': 'speed'
    };

    const gapKey = mapping[statId];
    if (gapKey && gaps[gapKey] !== undefined) {
        if (statId === 'allAtkRate') {
            // Convert % to flat value using base stats
            const base = gaps.isPhysical ? charBase.rawPatk : charBase.rawMatk;
            gaps.atk = Math.max(0, gaps.atk - Math.floor(base * value / 100));
        } else if (statId === 'hpRate') {
            gaps.hp = Math.max(0, gaps.hp - Math.floor(charBase.rawHp * value / 100));
        } else if (statId === 'defRate') {
            gaps.def = Math.max(0, gaps.def - Math.floor(charBase.rawDef * value / 100));
        } else {
            gaps[gapKey] = Math.max(0, gaps[gapKey] - value);
        }
    }
}

function generateSubOptionVariations(remainingGaps, slotType) {
    const limit = parseInt(document.getElementById('enhancement-limit')?.value) || 3;

    // Build priority list based on remaining gaps
    const priorities = [];

    if (remainingGaps.speed > 0) priorities.push({ id: 'speed', weight: remainingGaps.speed * 5 });
    if (remainingGaps.crit > 0) priorities.push({ id: 'crit', weight: remainingGaps.crit * 2 });
    if (remainingGaps.critDmg > 0) priorities.push({ id: 'critDmg', weight: remainingGaps.critDmg * 1.5 });
    if (remainingGaps.atk > 0) priorities.push({ id: 'allAtkRate', weight: remainingGaps.atk / 50 });
    if (remainingGaps.weakpoint > 0) priorities.push({ id: 'weakpoint', weight: remainingGaps.weakpoint * 1.5 });
    if (remainingGaps.hp > 0) priorities.push({ id: 'hpRate', weight: remainingGaps.hp / 200 });
    if (remainingGaps.def > 0) priorities.push({ id: 'defRate', weight: remainingGaps.def / 30 });
    if (remainingGaps.debuffHit > 0) priorities.push({ id: 'debuffHit', weight: remainingGaps.debuffHit });

    // Fallbacks
    const defaults = ['allAtkRate', 'critDmg', 'crit', 'hpRate'];
    defaults.forEach(id => {
        if (!priorities.find(p => p.id === id)) {
            priorities.push({ id, weight: 0.1 }); // Low weight but present
        }
    });

    // Sort by weight
    priorities.sort((a, b) => b.weight - a.weight);

    // Select top 4 stats to distribute enhancements
    const selectedStats = [];
    const used = new Set();

    priorities.forEach(p => {
        if (used.size < 4 && !used.has(p.id)) {
            selectedStats.push(p.id);
            used.add(p.id);
        }
    });

    // Helper to create a distribution object (Map-like)
    const createDist = (pattern) => {
        const dist = {};
        selectedStats.forEach((statId, idx) => {
            if (pattern[idx] !== undefined) {
                dist[statId] = pattern[idx];
            }
        });
        return dist;
    };

    const variations = [];
    const patterns = [
        // pattern, max_enhance_level
        { p: [5, 0, 0, 0], max: 5 },
        { p: [4, 1, 0, 0], max: 4 },
        { p: [3, 2, 0, 0], max: 3 },
        { p: [3, 1, 1, 0], max: 3 },
        { p: [2, 2, 1, 0], max: 2 },
        { p: [2, 1, 1, 1], max: 2 }
    ];

    patterns.forEach(pt => {
        if (pt.max <= limit) {
            variations.push(createDist(pt.p));
        }
    });

    return variations;
}

function scoreCombinationsV2(combos, targets, charBase) {
    return combos.map(c => {
        const f = c.totalStats.final;
        let score = 0;
        let targetsMetCount = 0;
        let totalGapPenalty = 0;

        const atkVal = charBase.isPhysical ? f.patk : f.matk;
        const atkTarget = charBase.isPhysical ? targets.patk : targets.matk;

        // Check each target and calculate gaps
        const checks = [
            { name: 'atk', val: atkVal, target: atkTarget, weight: 1 },
            { name: 'hp', val: f.hp, target: targets.hp, weight: 0.1 },
            { name: 'speed', val: f.speed, target: targets.speed, weight: 100 },
            { name: 'crit', val: f.crit, target: targets.crit, weight: 50 },
            { name: 'critDmg', val: f.critDmg, target: targets.critDmg, weight: 30 },
            { name: 'weakpoint', val: f.weakpoint, target: targets.weakpoint, weight: 40 },
            { name: 'debuffHit', val: f.debuffHit, target: targets.debuffHit, weight: 20 }
        ];

        checks.forEach(check => {
            if (check.target > 0) {
                if (check.val >= check.target) {
                    targetsMetCount++;
                    score += check.weight * 100; // Bonus for meeting target
                } else {
                    const gap = check.target - check.val;
                    totalGapPenalty += gap * check.weight / 10;
                }
            }
        });

        // Base score from raw stats
        score += atkVal * 0.5;
        score += f.crit * 20;
        score += f.critDmg * 10;
        score += f.hp * 0.01;
        score += f.speed * 50;

        // Major bonus for meeting all targets
        const allTargetsMet = checks.every(c => c.target === 0 || c.val >= c.target);
        if (allTargetsMet) {
            score += 100000;
        }

        // Penalty for gaps
        score -= totalGapPenalty;

        return { ...c, score, meetsAll: allTargetsMet, targetsMetCount };
    }).sort((a, b) => {
        // Primary: all targets met
        if (a.meetsAll !== b.meetsAll) return b.meetsAll ? 1 : -1;
        // Secondary: number of targets met
        if (a.targetsMetCount !== b.targetsMetCount) return b.targetsMetCount - a.targetsMetCount;
        // Tertiary: score
        return b.score - a.score;
    });
}

// ========================================
// Display
// ========================================
function displayCombinationResults(combinations, charBase, targets) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    if (!resultsSection || !resultsContent) return;

    if (combinations.length === 0) {
        resultsContent.innerHTML = '<p class="no-results">条件を満たす組み合わせが見つかりませんでした。</p>';
        resultsSection.classList.remove('hidden');
        return;
    }

    let html = '<div class="combinations-grid">';

    combinations.forEach((combo, idx) => {
        const f = combo.totalStats.final;

        html += `
            <div class="combo-card ${combo.meetsAll ? 'meets-all' : ''}">
                <div class="combo-header">
                    <h4>組み合わせ #${idx + 1}</h4>
                    <span class="combo-score ${combo.meetsAll ? 'success' : 'partial'}">
                        ${combo.meetsAll ? '✓ 目標達成' : '△ 未達成'}
                    </span>
                </div>
                
                <div class="combo-sets">
                    <span class="set-badge">${combo.setConfig.display}</span>
                    <p class="set-desc" style="font-size: 0.8rem; margin-top: 4px; color: rgba(255,255,255,0.7);">${combo.setConfig.description}</p>
                </div>
                
                <div class="combo-stats-full">
                    <h5>最終ステータス</h5>
                    <div class="stats-grid-compact">
                        ${generateStatRow('物理攻撃力', f.patk, targets.patk, charBase.isPhysical)}
                        ${generateStatRow('魔法攻撃力', f.matk, targets.matk, !charBase.isPhysical)}
                        ${generateStatRow('防御力', f.def, targets.def, false)}
                        ${generateStatRow('HP', f.hp, targets.hp, true)}
                        ${generateStatRow('敏捷性', f.speed, targets.speed, true)}
                        ${generateStatRow('クリティカル率', f.crit.toFixed(1) + '%', targets.crit, true)}
                        ${generateStatRow('与クリダメージ', f.critDmg.toFixed(1) + '%', targets.critDmg, true)}
                        ${generateStatRow('フェイタル', f.weakpoint.toFixed(1) + '%', targets.weakpoint, true)}
                    </div>
                </div>
                
                <details class="combo-details">
                    <summary>装備詳細を表示 (▼)</summary>
                    <div class="details-content">
                        ${generatePieceDetailsHTML(combo.pieces, charBase.isPhysical)}
                    </div>
                </details>
            </div>
        `;
    });

    html += '</div>';
    resultsContent.innerHTML = html;
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateStatRow(label, value, target, show) {
    if (!show) return '';
    const numValue = parseFloat(value);
    const isMet = !target || numValue >= target;
    const targetDisplay = target ? ` / ${target}` : '';

    return `
        <div class="stat-row ${target ? (isMet ? 'met' : 'unmet') : ''}">
            <span>${label}</span>
            <span>${value}${targetDisplay}</span>
        </div>
    `;
}

function generatePieceDetailsHTML(pieces, isPhysical) {
    let html = ''; // details-content container is already in outer html
    pieces.forEach(p => {
        let subRows = '';
        p.subOptions.forEach(s => {
            const enhClass = s.enhanceCount > 0 ? 'active' : '';
            subRows += `
                <div class="sub-op-row">
                    <span class="sub-op-name">${s.name}</span>
                    <div>
                        <span class="sub-op-val">+${s.isRate ? s.totalValue.toFixed(1) + '%' : s.totalValue}</span>
                        <span class="enhance-count ${enhClass}">+${s.enhanceCount}</span>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="slot-detail">
                <div class="slot-detail-header">
                    <span class="slot-name">${p.slotName}</span>
                    <span class="slot-main-op">${p.mainOption.name} +${p.mainOption.value}%</span>
                </div>
                <div class="slot-body">
                    ${subRows}
                </div>
            </div>
        `;
    });
    return html;
}
