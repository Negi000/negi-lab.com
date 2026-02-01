
// Mock Data and Constants simulating build_calculator.js environment

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

const FIXED_STATS = {
    physWeapon: { patk: 304 },
    magWeapon: { matk: 304 },
    armor: { def: 189, hp: 1079 }
};

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

const EQUIPMENT_NAMES = {
    physWeapon: '輝くドラゴンスレイヤー',
    magWeapon: '輝くドラゴンロッド',
    armor: '輝くドラゴンアーマー'
};

let selectedCharacter = { 基本情報: { ID: '1' } };
let algorithmMode = 'realistic';

// Mock function for getSubOptionValue (missing in my prev edit copypaste, but needed)
function getSubOptionValue(subOption, enhanceCount) {
    const rawValue = subOption.base + subOption.base * enhanceCount;
    return subOption.isRate ? rawValue / 10 : rawValue;
}

// ---------------------------------------------------------
// Insert the New Algorithm Functions Here
// ---------------------------------------------------------

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

function getValidSetConfigs(gaps, targets) {
    const configs = [];
    const setKeys = Object.keys(SET_EFFECTS);

    // Generate ALL 4-set configs (9 total)
    setKeys.forEach(k => {
        configs.push({
            type: '4set',
            sets: [k, k, k, k],
            display: `${SET_EFFECTS[k].name}4`,
            description: SET_EFFECTS[k].desc[4],
            priority: calculate4SetPriority(k, gaps, targets)
        });
    });

    // Generate ALL 2+2 set configs (C(9,2) = 36 total)
    for (let i = 0; i < setKeys.length; i++) {
        for (let j = i + 1; j < setKeys.length; j++) {
            const set1 = setKeys[i];
            const set2 = setKeys[j];
            const desc1 = SET_EFFECTS[set1].desc[2];
            const desc2 = SET_EFFECTS[set2].desc[2];
            configs.push({
                type: '2+2',
                sets: [set1, set1, set2, set2],
                display: `${SET_EFFECTS[set1].name}2 + ${SET_EFFECTS[set2].name}2`,
                description: `${desc1} / ${desc2}`,
                priority: calculate2SetPriority(set1, gaps, targets) + calculate2SetPriority(set2, gaps, targets)
            });
        }
    }

    // Sort by priority and take top 20 for performance
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

function optimizeSubOptionsV2(remainingGaps, slotType) {
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

    // Sort by weight
    priorities.sort((a, b) => b.weight - a.weight);

    // Take top 4 unique stats
    const dist = [];
    const used = new Set();

    priorities.forEach(p => {
        if (used.size < 4 && !used.has(p.id)) {
            dist.push({ id: p.id, enhanceCount: 0, weight: p.weight });
            used.add(p.id);
        }
    });

    // Fill remaining slots with defaults
    const defaults = ['allAtkRate', 'critDmg', 'crit', 'hpRate'];
    defaults.forEach(id => {
        if (used.size < 4 && !used.has(id)) {
            dist.push({ id, enhanceCount: 0, weight: 0 });
            used.add(id);
        }
    });

    // Distribute 5 enhancements based on mode
    if (algorithmMode === 'max') {
        // All 5 into highest priority
        if (dist.length > 0) dist[0].enhanceCount = 5;
    } else {
        // Distribute proportionally based on weights
        const totalWeight = dist.reduce((sum, d) => sum + d.weight, 0);
        if (totalWeight > 0) {
            let remaining = 5;
            dist.forEach((d, i) => {
                if (i < dist.length - 1) {
                    const share = Math.min(remaining, Math.round(5 * d.weight / totalWeight));
                    d.enhanceCount = share;
                    remaining -= share;
                } else {
                    d.enhanceCount = remaining;
                }
            });
        } else {
            // Default: 2-2-1-0
            dist[0].enhanceCount = 2;
            dist[1].enhanceCount = 2;
            dist[2].enhanceCount = 1;
            dist[3].enhanceCount = 0;
        }
    }

    return dist;
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

function generateFullCombination(setConfig, weaponMain, armorMain, subPattern, charBase) {
    const pieces = [];
    const slotNames = ['武器1', '武器2', '防具1', '防具2'];

    for (let i = 0; i < 4; i++) {
        const slotType = i < 2 ? 'weapon' : 'armor';
        const mainOp = i < 2 ? weaponMain : armorMain;
        const subDist = i < 2 ? subPattern.weapon : subPattern.armor;

        const piece = generateEquipmentPiece(slotType, slotNames[i], setConfig.sets[i], mainOp, subDist, charBase.isPhysical);
        pieces.push(piece);
    }
    const totalStats = calculateTotalStats(pieces, setConfig, charBase);
    return { setConfig, pieces, totalStats, weaponMain, armorMain };
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

    subDistribution.forEach(sub => {
        const subData = SUB_OPTIONS.find(s => s.id === sub.id);
        if (subData) {
            const value = getSubOptionValue(subData, sub.enhanceCount);
            piece.subOptions.push({
                id: sub.id, name: subData.name,
                baseValue: subData.isRate ? subData.base / 10 : subData.base,
                enhanceCount: sub.enhanceCount, totalValue: value, isRate: subData.isRate
            });
            piece.stats[sub.id] = (piece.stats[sub.id] || 0) + value;
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
        [setConfig.sets[0], setConfig.sets[2]].forEach(key => {
            const eff = SET_EFFECTS[key].effects[2];
            if (eff) Object.entries(eff).forEach(([k, v]) => { if (stats[k] !== undefined) stats[k] += v; });
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


// --- RUN TEST ---
// Mock Character
const mockCharBase = {
    rawPatk: 1800, rawMatk: 0, rawDef: 600, rawHp: 5000,
    patk: 1800, matk: 0, def: 600, hp: 5000,
    speed: 60, crit: 20, critDmg: 150, weakpoint: 5, block: 0,
    debuffHit: 0, debuffResist: 0,
    isPhysical: true,
    transBonus: { allAtkRate: 0, defRate: 0, hpRate: 00 }
};

const mockTargets = {
    patk: 7000,
    speed: 98,
    crit: 80,
    critDmg: 200,
    weakpoint: 0,
    hp: 0, def: 0
};

console.log('--- STARTING DEBUG ---');
console.log('Calculating gaps...');
const gaps = calculateStatGaps(mockTargets, mockCharBase);
console.log('Gaps:', gaps);

console.log('Selecting main options...');
const wCands = selectMainOptionCandidates('weapon', gaps, mockTargets);
console.log('Weapon Candidates:', wCands);
const aCands = selectMainOptionCandidates('armor', gaps, mockTargets);
console.log('Armor Candidates:', aCands);

console.log('Generating configs...');
const configs = getValidSetConfigs(gaps, mockTargets);
console.log('Number of configs:', configs.length);
console.log('Top Config:', configs[0]);

console.log('Generating sub options...');
const remainingGaps = calculateRemainingGaps(gaps, wCands[0], aCands[0], configs[0], mockCharBase);
console.log('Remaining Gaps:', remainingGaps);
const subDist = optimizeSubOptionsV2(remainingGaps, 'weapon');
console.log('Sub option dist (weapon):', subDist);

console.log('Completed check.');
