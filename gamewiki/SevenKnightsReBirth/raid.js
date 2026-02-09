// Raid Page JavaScript
let raidData = null;
let currentBoss = 1;
let currentDifficulty = 1;
let currentRaidType = 'normal';
let currentWorldBoss = null;

// 言語別データ読み込み（フォールバック対応）
async function loadLocalizedData(filename) {
    const lang = typeof getLang === 'function' ? getLang() : 'ja';
    try {
        // まず言語別ディレクトリを試す
        const res = await fetch(`data/${lang}/${filename}`);
        if (res.ok) return await res.json();
    } catch (e) {
        console.log(`[raid] Fallback to root data for ${filename}`);
    }
    // フォールバック: ルートディレクトリ
    return await fetchJson(`data/${filename}`);
}

// 数値フォーマット（普通の数字表記）
function formatNumber(num) {
    return num.toLocaleString();
}

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    if (!document.querySelector('.raid-main')) return;
    
    // i18nの準備完了を待つ
    if (typeof onI18nReady === 'function') {
        onI18nReady(initRaidPage);
    } else {
        initRaidPage();
    }
});

async function initRaidPage() {
    try {
        raidData = await loadLocalizedData('raid.json');
        
        initRaidTypeTabs();
        initBossCards();
        initDifficultyButtons();
        
        // 初期表示
        selectBoss(1);
        
    } catch (error) {
        console.error('Error loading raid data:', error);
    }
}

// レイドタイプタブ初期化
function initRaidTypeTabs() {
    const tabs = document.querySelectorAll('.raid-type-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.type;
            switchRaidType(type);
        });
    });
}

// レイドタイプ切り替え
function switchRaidType(type) {
    currentRaidType = type;
    
    // タブのアクティブ状態更新
    document.querySelectorAll('.raid-type-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === type);
    });
    
    // セクション表示切り替え
    document.getElementById('normal-raid-section').classList.toggle('hidden', type !== 'normal');
    document.getElementById('unexpected-raid-section').classList.toggle('hidden', type !== 'unexpected');
    document.getElementById('world-raid-section').classList.toggle('hidden', type !== 'world');
    
    if (type === 'unexpected') {
        initUnexpectedRaid();
    } else if (type === 'world') {
        initWorldBossCards();
    }
}

// ボスカード初期化
function initBossCards() {
    const container = document.getElementById('boss-cards');
    if (!container || !raidData) return;
    
    container.innerHTML = '';
    
    const raids = raidData.raids;
    for (const [bossId, boss] of Object.entries(raids)) {
        const card = document.createElement('div');
        card.className = 'boss-card' + (parseInt(bossId) === currentBoss ? ' active' : '');
        card.dataset.bossId = bossId;
        
        // ボス画像（プレースホルダー）
        const imageUrl = getBossImageUrl(boss.key);
        
        card.innerHTML = `
            <img class="boss-card-image" src="${imageUrl}" alt="${boss.name}" 
                 onerror="this.style.display='none'">
            <div class="boss-card-name">${boss.name}</div>
        `;
        
        card.addEventListener('click', () => selectBoss(parseInt(bossId)));
        container.appendChild(card);
    }
}

// ボス画像URL取得
function getBossImageUrl(bossKey) {
    // 実際のボス画像があればそのパスを返す
    // なければプレースホルダー
    const imageMap = {
        'Briliant': 'images/icon/Raid/Atl_Account_Contents_BG_Briliant.webp',
        'Devourer': 'images/icon/Raid/Atl_Account_Contents_BG_Devourer.webp',
        'NiuMowang': 'images/icon/Raid/Atl_Account_Contents_BG_NiuMowang.webp'
    };
    return imageMap[bossKey] || `https://placehold.co/200x120/1a1a1a/ffd700?text=${bossKey}`;
}

// ボス選択
function selectBoss(bossId) {
    currentBoss = bossId;
    currentDifficulty = 1;
    
    // カードのアクティブ状態更新
    document.querySelectorAll('.boss-card').forEach(card => {
        card.classList.toggle('active', parseInt(card.dataset.bossId) === bossId);
    });
    
    // ボス詳細更新
    updateBossDetail();
    updateDifficultyButtons();
    updateStageDetail();
}

// ボス詳細更新
function updateBossDetail() {
    const boss = raidData.raids[currentBoss];
    if (!boss) return;
    
    document.getElementById('boss-name').textContent = boss.name;
    document.getElementById('boss-story').textContent = boss.story;
    
    // 攻略ヒントのHTMLタグを除去してテキスト化
    const solutionText = boss.solution
        .replace(/<Help_Red>/g, '')
        .replace(/<\/>/g, '')
        .replace(/\\n/g, '\n');
    document.getElementById('boss-solution-text').textContent = solutionText;
    
    // ボス画像
    const portraitImg = document.getElementById('boss-portrait-img');
    portraitImg.src = getBossImageUrl(boss.key);
    portraitImg.onerror = function() {
        this.src = `https://placehold.co/200x200/1a1a1a/ffd700?text=${encodeURIComponent(boss.name)}`;
    };
    
    // ボススキル表示
    updateBossSkills(boss);
}

// ボススキル更新
function updateBossSkills(boss) {
    const skillsContainer = document.getElementById('boss-skills');
    if (!skillsContainer || !boss.skills) return;
    
    // 翻訳関数（i18n.jsのt関数を使用）
    const tr = typeof t === 'function' ? t : (k) => k;
    
    const getSkillTypeName = (type) => {
        const typeMap = {
            1: tr('skill.normalAttack'),
            2: tr('skill.skill1'),
            3: tr('skill.skill2'),
            4: tr('skill.skill3'),
            5: tr('skill.skill4')
        };
        return typeMap[type] || tr('skill.unknown');
    };
    
    skillsContainer.innerHTML = boss.skills.map(skill => {
        const iconUrl = skill.icon ? `images/icon/SkillIcon_PC/${skill.icon}.webp` : '';
        const iconHtml = iconUrl ? `<img class="skill-icon" src="${iconUrl}" alt="${skill.name}" onerror="this.style.display='none'">` : '';
        const descHtml = skill.desc ? `<span class="skill-desc">${skill.desc}</span>` : '';
        const coolHtml = skill.cooltime > 0 ? `<span class="skill-cooltime">${tr('raid.ctSeconds').replace('{value}', skill.cooltime)}</span>` : '';
        
        return `
        <div class="boss-skill-item">
            ${iconHtml}
            <div class="skill-info">
                <div class="skill-header">
                    <span class="skill-type">${getSkillTypeName(skill.type)}</span>
                    <span class="skill-name">${skill.name}</span>
                    ${coolHtml}
                </div>
                ${descHtml}
            </div>
        </div>
    `;
    }).join('');
}

// 難易度ボタン初期化
function initDifficultyButtons() {
    // 初期生成（selectBossで更新される）
}

// 難易度ボタン更新
function updateDifficultyButtons() {
    const container = document.getElementById('difficulty-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= 15; i++) {
        const btn = document.createElement('button');
        btn.className = 'difficulty-btn' + 
                       (i === currentDifficulty ? ' active' : '') +
                       (i >= 11 ? ' high-tier' : '');
        btn.textContent = i;
        btn.dataset.difficulty = i;
        
        btn.addEventListener('click', () => {
            currentDifficulty = i;
            updateDifficultyButtons();
            updateStageDetail();
        });
        
        container.appendChild(btn);
    }
}

// ステージ詳細更新
function updateStageDetail() {
    const boss = raidData.raids[currentBoss];
    if (!boss) return;
    
    const stage = boss.stages.find(s => s.difficulty === currentDifficulty);
    if (!stage) return;
    
    // タイトル
    const tr = typeof t === 'function' ? t : (k) => k;
    document.getElementById('stage-title').textContent = `${tr('raid.difficultyLevel')} ${currentDifficulty}`;
    
    // 基本情報
    document.getElementById('stage-stamina').textContent = stage.stamina;
    document.getElementById('stage-account-exp').textContent = stage.account_exp;
    document.getElementById('stage-hero-exp').textContent = stage.hero_exp;
    
    // 敵ステータス表示
    updateEnemyStats(stage);
    
    // サブオプション確率
    const subOptSection = document.getElementById('sub-option-section');
    const subOptProbs = document.getElementById('sub-option-probs');
    
    if (stage.sub_options && stage.sub_options.length > 0) {
        subOptSection.style.display = 'block';
        const tr = typeof t === 'function' ? t : (k) => k;
        subOptProbs.innerHTML = stage.sub_options.map(opt => `
            <div class="sub-option-item">
                <span class="sub-option-count">${tr('raid.optionCount').replace('{count}', opt.count)}</span>
                <span class="sub-option-prob">${opt.probability.toFixed(1)}%</span>
            </div>
        `).join('');
    } else {
        subOptSection.style.display = 'block';
        const tr = typeof t === 'function' ? t : (k) => k;
        subOptProbs.innerHTML = `<span class="sub-option-none">${tr('raid.noSubOptions')}</span>`;
    }
    
    // 報酬
    const rewardsGrid = document.getElementById('rewards-grid');
    rewardsGrid.innerHTML = '';
    
    // 報酬をグループ化（確定/確率）
    const fixedRewards = stage.rewards.filter(r => r.fixed && !r.first_clear);
    const randomRewards = stage.rewards.filter(r => !r.fixed && !r.first_clear);
    const firstClearRewards = stage.rewards.filter(r => r.first_clear);
    
    // 確定報酬
    fixedRewards.forEach(reward => {
        rewardsGrid.appendChild(createRewardItem(reward, true));
    });
    
    // 確率報酬（装備など）- 重複を排除
    const uniqueRandomRewards = getUniqueRewards(randomRewards);
    uniqueRandomRewards.forEach(reward => {
        rewardsGrid.appendChild(createRewardItem(reward, false));
    });
}

// 敵ステータス更新
function updateEnemyStats(stage) {
    const container = document.getElementById('enemy-stats');
    if (!container) return;
    
    // 翻訳関数
    const tr = typeof t === 'function' ? t : (k) => k;
    
    // ボス情報
    const boss = stage.boss;
    if (!boss || !boss.stats) {
        container.innerHTML = `<p class="no-data">${tr('raid.noEnemyInfo')}</p>`;
        return;
    }
    
    const bossStats = boss.stats;
    const attackType = bossStats.magical_attack > bossStats.physical_attack ? tr('raid.magical') : tr('raid.physical');
    const mainAttack = Math.max(bossStats.physical_attack, bossStats.magical_attack);
    
    let html = `
        <div class="enemy-section">
            <h4 class="enemy-title">${tr('raid.boss')}: ${boss.name}</h4>
            <div class="enemy-level">Lv.${boss.level}</div>
            <div class="enemy-stats-grid">
                <div class="stat-item">
                    <span class="stat-label">${tr('stats.hp')}</span>
                    <span class="stat-value">${formatNumber(bossStats.hp)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${tr('raid.attackPower')} (${attackType})</span>
                    <span class="stat-value">${formatNumber(mainAttack)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${tr('stats.defense')}</span>
                    <span class="stat-value">${formatNumber(bossStats.defence)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${tr('raid.attackSpeed')}</span>
                    <span class="stat-value">${bossStats.attack_speed}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${tr('raid.critical')}</span>
                    <span class="stat-value">${bossStats.critical}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">${tr('raid.accuracy')}</span>
                    <span class="stat-value">${bossStats.accuracy_rate}</span>
                </div>
            </div>
        </div>
    `;
    
    // 取り巻き情報
    if (stage.minions && stage.minions.length > 0) {
        html += `<div class="minions-section"><h4 class="minions-title">${tr('raid.minions')}</h4>`;
        
        stage.minions.forEach(minion => {
            const minionStats = minion.stats;
            const minionAttackType = minionStats.magical_attack > minionStats.physical_attack ? tr('raid.magical') : tr('raid.physical');
            const minionMainAttack = Math.max(minionStats.physical_attack, minionStats.magical_attack);
            
            html += `
                <div class="minion-item">
                    <div class="minion-name">${minion.name}</div>
                    <div class="minion-level">Lv.${minion.level}</div>
                    <div class="minion-stats">
                        ${tr('stats.hp')}: ${formatNumber(minionStats.hp)} / 
                        ${tr('raid.attack')}: ${formatNumber(minionMainAttack)} (${minionAttackType}) / 
                        ${tr('raid.defense')}: ${formatNumber(minionStats.defence)}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    container.innerHTML = html;
}

// 重複報酬を排除してユニークな報酬リストを作成
function getUniqueRewards(rewards) {
    const uniqueMap = new Map();
    
    rewards.forEach(reward => {
        const key = reward.name;
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
                ...reward,
                totalProbability: reward.probability,
                count: 1
            });
        } else {
            const existing = uniqueMap.get(key);
            existing.totalProbability += reward.probability;
            existing.count += 1;
        }
    });
    
    return Array.from(uniqueMap.values());
}

// 報酬アイテム作成
function createRewardItem(reward, isFixed) {
    const div = document.createElement('div');
    div.className = 'reward-item' + (isFixed ? ' reward-fixed' : '');
    
    // 翻訳関数
    const tr = typeof t === 'function' ? t : (k) => k;
    
    // 星レーティングによる装飾クラス
    if (reward.star >= 6) {
        div.classList.add('reward-star-6');
    } else if (reward.star >= 5) {
        div.classList.add('reward-star-5');
    } else if (reward.star >= 4) {
        div.classList.add('reward-star-4');
    }
    
    // アイコン取得
    const icon = getRewardIcon(reward);
    
    // 確率表示
    let probText = '';
    if (!isFixed && reward.probability) {
        const prob = reward.totalProbability || reward.probability;
        probText = prob >= 1 ? `${prob.toFixed(1)}%` : `${(prob).toFixed(2)}%`;
    }
    
    // 数量表示
    let amountText = '';
    if (reward.min_drop === reward.max_drop) {
        amountText = reward.min_drop > 1 ? `×${formatNumber(reward.min_drop)}` : '';
    } else {
        amountText = `×${reward.min_drop}~${reward.max_drop}`;
    }
    
    div.innerHTML = `
        <div class="reward-icon">${icon}</div>
        <div class="reward-info">
            <div class="reward-name">${reward.name}${reward.star > 0 ? ` <span class="reward-star">★${reward.star}</span>` : ''}</div>
            <div class="reward-detail">
                ${amountText ? `<span class="reward-amount">${amountText}</span>` : ''}
                ${probText ? `<span class="reward-prob">${probText}</span>` : ''}
                ${isFixed ? `<span class="reward-fixed-badge">${tr('raid.fixed')}</span>` : ''}
            </div>
        </div>
    `;
    
    return div;
}

// 報酬アイコン取得
function getRewardIcon(reward) {
    // 通貨
    if (reward.reward_id === 502) return '💰';
    if (reward.reward_id === 501) return '💎';
    
    // エッセンス
    if (reward.reward_id === 310000001) return '🔮'; // 混沌のエッセンス
    if (reward.reward_id === 311000001) return '💜'; // 忘却のエッセンス
    
    // 装備タイプ別（item_typeは言語依存しないようにする）
    const itemType = reward.item_type;
    // 武器
    if (['武器', 'Weapon', '무기', '武器', 'อาวุธ'].includes(itemType)) return '⚔️';
    // 防具
    if (['防具', 'Armor', '방어구', '盔甲', '护甲', '護甲', 'เกราะ'].includes(itemType)) return '🛡️';
    // 素材
    if (['素材', 'Material', '소재', '素材', '材料', 'วัสดุ'].includes(itemType)) return '📦';
    
    return '📦';
}

// ワールドボスカード初期化
function initWorldBossCards() {
    const container = document.getElementById('world-boss-cards');
    if (!container || !raidData || !raidData.world_raids) return;
    
    container.innerHTML = '';
    
    for (const [stageId, worldRaid] of Object.entries(raidData.world_raids)) {
        const card = document.createElement('div');
        card.className = 'world-boss-card' + (currentWorldBoss === stageId ? ' active' : '');
        card.dataset.stageId = stageId;
        
        card.innerHTML = `
            <div class="world-boss-name">${worldRaid.name}</div>
            <div class="world-boss-info">
                ${(typeof t === 'function' ? t : (k) => k)('raid.staminaCost').replace('{value}', worldRaid.stamina)} | ${(typeof t === 'function' ? t : (k) => k)('raid.accountExp')}: ${worldRaid.account_exp}
            </div>
        `;
        
        card.addEventListener('click', () => {
            currentWorldBoss = stageId;
            document.querySelectorAll('.world-boss-card').forEach(c => {
                c.classList.toggle('active', c.dataset.stageId === stageId);
            });
            updateWorldRaidDetail(stageId);
        });
        
        container.appendChild(card);
    }
    
    // 最初のワールドボスを選択（毎回初期化）
    if (Object.keys(raidData.world_raids).length > 0) {
        const firstKey = currentWorldBoss || Object.keys(raidData.world_raids)[0];
        currentWorldBoss = firstKey;
        document.querySelectorAll('.world-boss-card').forEach(c => {
            c.classList.toggle('active', c.dataset.stageId === firstKey);
        });
        updateWorldRaidDetail(firstKey);
    }
}

// ワールドレイド詳細更新
function updateWorldRaidDetail(stageId) {
    const container = document.getElementById('world-raid-detail');
    const worldRaid = raidData.world_raids[stageId];
    
    if (!container || !worldRaid) return;
    
    // 翻訳関数
    const tr = typeof t === 'function' ? t : (k) => k;
    
    // スキル情報
    let skillsHtml = '';
    if (worldRaid.skills && worldRaid.skills.length > 0) {
        skillsHtml = `
            <div class="world-raid-skills">
                <h4>${tr('raid.skills')}</h4>
                <div class="skill-list">
                    ${worldRaid.skills.map(skill => `
                        <span class="skill-tag">${skill.name}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // ラウンド情報
    let roundsHtml = '';
    if (worldRaid.rounds && worldRaid.rounds.length > 0) {
        roundsHtml = worldRaid.rounds.map(round => {
            const bossEnemy = round.enemies.find(e => e.is_boss);
            const bossStats = bossEnemy?.stats;
            
            let statsHtml = '';
            if (bossStats) {
                const attackType = bossStats.magical_attack > bossStats.physical_attack ? tr('raid.magical') : tr('raid.physical');
                const mainAttack = Math.max(bossStats.physical_attack, bossStats.magical_attack);
                statsHtml = `
                    <div class="round-stats">
                        <span>${tr('stats.hp')}: ${formatNumber(bossStats.hp)}</span>
                        <span>${tr('raid.attack')}(${attackType}): ${formatNumber(mainAttack)}</span>
                        <span>${tr('raid.defense')}: ${formatNumber(bossStats.defence)}</span>
                    </div>
                `;
            }
            
            return `
                <div class="world-round">
                    <h4>${tr('raid.round').replace('{value}', round.round)}</h4>
                    <p>${tr('raid.turnLimit').replace('{value}', round.turn_limit)}</p>
                    <p>${tr('raid.enemyCount').replace('{value}', round.enemies.length)}</p>
                    ${statsHtml}
                </div>
            `;
        }).join('');
    }
    
    // 報酬情報
    let rewardsHtml = '';
    // クリア報酬
    if (worldRaid.clear_rewards && worldRaid.clear_rewards.length > 0) {
        rewardsHtml += `
            <div class="world-raid-rewards">
                <h4>${tr('raid.clearRewards')}</h4>
                <div class="rewards-list">
                    ${worldRaid.clear_rewards.map(r => `
                        <div class="reward-tag">
                            ${r.name} ×${formatNumber(r.amount)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    // ランク別報酬
    if (worldRaid.rank_rewards && worldRaid.rank_rewards.length > 0) {
        const rankNames = {1: 'S', 2: 'A', 3: 'B', 4: 'C', 5: 'D'};
        rewardsHtml += `
            <div class="world-raid-rewards">
                <h4>${tr('raid.rankRewards')}</h4>
                ${worldRaid.rank_rewards.map(rankData => `
                    <div class="rank-reward-group">
                        <span class="rank-label">${tr('raid.rank').replace('{value}', rankNames[rankData.rank] || rankData.rank)}:</span>
                        ${rankData.rewards.map(r => `
                            <span class="reward-tag">${r.name} ×${formatNumber(r.amount)}</span>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // 攻撃タイプ表示
    const attackTypeText = worldRaid.attack_type === 'magical' ? tr('raid.magicalAttack') : tr('raid.physicalAttack');
    
    container.innerHTML = `
        <div class="world-raid-info">
            <h3>${worldRaid.name}</h3>
            <div class="world-raid-type">${attackTypeText}</div>
            <div class="world-raid-stats">
                <span>${tr('raid.staminaCost').replace('{value}', worldRaid.stamina)}</span>
                <span>${tr('raid.accountExpValue').replace('{value}', worldRaid.account_exp)}</span>
            </div>
            ${skillsHtml}
            <div class="world-rounds">
                ${roundsHtml}
            </div>
            ${rewardsHtml}
        </div>
    `;
}

// ====================================
// 突発レイド（Unexpected Raid）
// ====================================

let unexpectedRaidInitialized = false;
let currentUnexpectedBoss = 0;

function initUnexpectedRaid() {
    if (!raidData || !raidData.unexpected_raids) return;
    
    const data = raidData.unexpected_raids;
    const tr = typeof t === 'function' ? t : (k) => k;
    const lang = typeof getLang === 'function' ? getLang() : 'ja';
    
    // テキスト選択ヘルパー（日本語版をデフォルト、韓国語はko版を使用）
    const getText = (obj, key) => {
        if (lang === 'ko' && obj[key + '_ko']) return obj[key + '_ko'];
        return obj[key] || obj[key + '_ko'] || '';
    };
    
    // システム概要
    renderSystemOverview(data, tr, getText);
    
    // ボスカード
    renderUnexpectedBossCards(data, tr, getText);
    
    // 最初のボスを選択
    if (!unexpectedRaidInitialized && data.boss_info.length > 0) {
        selectUnexpectedBoss(0, data, tr, getText);
        unexpectedRaidInitialized = true;
    } else {
        selectUnexpectedBoss(currentUnexpectedBoss, data, tr, getText);
    }
    
    // 報酬システム
    renderRewardSystem(data, tr, getText);
}

function renderSystemOverview(data, tr, getText) {
    const container = document.getElementById('unexpected-system-overview');
    if (!container || !data.system_info) return;
    
    const sys = data.system_info;
    
    // フロー図
    const flowHtml = sys.flow.map((step, i) => {
        const phase = getText(step, 'phase');
        const desc = getText(step, 'desc');
        return `<div class="flow-step">
            <div class="flow-step-number">${i + 1}</div>
            <div class="flow-step-content">
                <div class="flow-step-phase">${phase}</div>
                <div class="flow-step-desc">${desc}</div>
            </div>
        </div>`;
    }).join('<div class="flow-arrow">→</div>');

    // 発生確率レベル
    let triggerProbHtml = '';
    if (sys.trigger_probability && sys.trigger_probability.levels) {
        const probLevels = sys.trigger_probability.levels.map(lv => 
            `<span class="prob-level-tag">${getText(lv, 'label')}</span>`
        ).join('');
        triggerProbHtml = `
            <div class="trigger-probability-section">
                <div class="trigger-prob-desc">${getText(sys.trigger_probability, 'desc')}</div>
                <div class="trigger-prob-levels">${probLevels}</div>
            </div>
        `;
    }

    // ボスHP段階
    let bossHpLevelsHtml = '';
    if (sys.boss_hp_levels) {
        const hpTags = sys.boss_hp_levels.map(lv =>
            `<span class="hp-level-tag">${getText(lv, 'label')}</span>`
        ).join('');
        bossHpLevelsHtml = `<div class="boss-hp-levels">${hpTags}</div>`;
    }
    
    container.innerHTML = `
        <div class="system-overview-card">
            <h3>${tr('raid.unexpectedOverview')}</h3>
            <div class="system-info-grid">
                <div class="system-info-item">
                    <span class="system-info-icon">🔓</span>
                    <div>
                        <div class="system-info-label">${tr('raid.unlockCondition')}</div>
                        <div class="system-info-value">${getText(sys, 'unlock_condition')}</div>
                    </div>
                </div>
                <div class="system-info-item">
                    <span class="system-info-icon">🎟️</span>
                    <div>
                        <div class="system-info-label">${tr('raid.entryCost')}</div>
                        <div class="system-info-value">${getText(sys, 'entry_cost')}</div>
                        <div class="system-info-sub">${tr('raid.ticketSource')}: ${getText(sys, 'ticket_source')}</div>
                    </div>
                </div>
                <div class="system-info-item full-width">
                    <span class="system-info-icon">⚡</span>
                    <div>
                        <div class="system-info-label">${tr('raid.triggerCondition')}</div>
                        <div class="system-info-value">${getText(sys, 'trigger')}</div>
                        ${triggerProbHtml}
                    </div>
                </div>
                <div class="system-info-item">
                    <span class="system-info-icon">⏱️</span>
                    <div>
                        <div class="system-info-label">${tr('raid.battleDuration')}</div>
                        <div class="system-info-value">${getText(sys, 'duration')}</div>
                    </div>
                </div>
                <div class="system-info-item">
                    <span class="system-info-icon">🌐</span>
                    <div>
                        <div class="system-info-label">${tr('raid.sharedHP')}</div>
                        <div class="system-info-value">${getText(sys, 'boss_hp')}</div>
                        ${bossHpLevelsHtml}
                    </div>
                </div>
            </div>
            <div class="system-flow">
                <h4>${tr('raid.progressFlow')}</h4>
                <div class="flow-steps">${flowHtml}</div>
            </div>
        </div>
    `;
}

function renderUnexpectedBossCards(data, tr, getText) {
    const container = document.getElementById('unexpected-boss-cards');
    if (!container) return;
    
    container.innerHTML = '';
    
    data.boss_info.forEach((boss, index) => {
        const card = document.createElement('div');
        card.className = 'boss-card unexpected-boss-card' + (index === currentUnexpectedBoss ? ' active' : '');
        card.dataset.bossIndex = index;
        
        card.innerHTML = `
            <img class="boss-card-image" src="${boss.image}" alt="${getText(boss, 'name')}" 
                 onerror="this.style.display='none'">
            <div class="boss-card-name">${getText(boss, 'name')}</div>
            <div class="boss-card-subname">${getText(boss, 'subname')}</div>
        `;
        
        card.addEventListener('click', () => {
            currentUnexpectedBoss = index;
            selectUnexpectedBoss(index, data, tr, getText);
        });
        container.appendChild(card);
    });
}

function selectUnexpectedBoss(index, data, tr, getText) {
    currentUnexpectedBoss = index;
    
    // カードのアクティブ状態更新
    document.querySelectorAll('.unexpected-boss-card').forEach(card => {
        card.classList.toggle('active', parseInt(card.dataset.bossIndex) === index);
    });
    
    renderUnexpectedBossDetail(data.boss_info[index], tr, getText);
}

function renderUnexpectedBossDetail(boss, tr, getText) {
    const container = document.getElementById('unexpected-boss-detail');
    if (!container || !boss) return;
    
    // デバフ・バフ タグ
    const debuffTags = boss.debuffs.map(d => `<span class="debuff-tag">${d}</span>`).join('');
    const buffTags = boss.boss_buffs.map(b => `<span class="buff-tag">${b}</span>`).join('');
    
    // 攻撃タイプの表示
    let attackTypeText = '';
    if (boss.attack_type === 'physical_recommended') {
        attackTypeText = `<span class="type-badge physical">${tr('raid.physicalRecommended')}</span>`;
    } else if (boss.attack_type === 'magical_recommended') {
        attackTypeText = `<span class="type-badge magical">${tr('raid.magicalRecommended')}</span>`;
    } else {
        attackTypeText = `<span class="type-badge any">${tr('raid.anyType')}</span>`;
    }
    
    const storyText = getText(boss, 'story').replace(/\n/g, '<br>');
    const solutionText = getText(boss, 'solution').replace(/\n/g, '<br>');

    // スキル一覧
    let skillsHtml = '';
    if (boss.skills && boss.skills.length > 0) {
        const skillTypeIcons = {
            'normal': '⚔️',
            'active': '🔥',
            'ultimate': '💥',
            'summon': '👹',
            'passive': '🛡️'
        };
        const skillItems = boss.skills.map(skill => {
            const icon = skillTypeIcons[skill.type] || '⚔️';
            return `<div class="unexpected-skill-item">
                <span class="unexpected-skill-icon">${icon}</span>
                <div class="unexpected-skill-info">
                    <span class="unexpected-skill-name">${getText(skill, 'name')}</span>
                    <span class="unexpected-skill-desc">${getText(skill, 'desc')}</span>
                </div>
            </div>`;
        }).join('');
        skillsHtml = `
            <div class="unexpected-boss-skills">
                <h3>${tr('raid.bossSkills')}</h3>
                <div class="unexpected-skill-list">${skillItems}</div>
            </div>
        `;
    }

    // キーメカニクス
    let mechanicsHtml = '';
    if (boss.key_mechanics && boss.key_mechanics.length > 0) {
        const mechItems = boss.key_mechanics.map(mech => `
            <div class="key-mechanic-item">
                <div class="key-mechanic-name">${getText(mech, 'name')}</div>
                <div class="key-mechanic-desc">${getText(mech, 'desc')}</div>
            </div>
        `).join('');
        mechanicsHtml = `
            <div class="unexpected-key-mechanics">
                <h3>${tr('raid.keyMechanics')}</h3>
                <div class="key-mechanics-grid">${mechItems}</div>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="unexpected-boss-info">
            <div class="unexpected-boss-header">
                <div class="unexpected-boss-portrait">
                    <img src="${boss.image}" alt="${getText(boss, 'name')}" 
                         onerror="this.src='https://placehold.co/200x200/1a1a1a/ffd700?text=${encodeURIComponent(getText(boss, 'name'))}'">
                </div>
                <div class="unexpected-boss-title">
                    <h2>${getText(boss, 'name')}</h2>
                    <div class="unexpected-boss-subname">${getText(boss, 'subname')}</div>
                    ${attackTypeText}
                </div>
            </div>
            
            <div class="unexpected-boss-story">
                <h3>${tr('raid.bossStory')}</h3>
                <p>${storyText}</p>
            </div>
            
            ${skillsHtml}
            ${mechanicsHtml}
            
            <div class="unexpected-boss-mechanics">
                <h3>${tr('raid.hint')}</h3>
                <p>${solutionText}</p>
                
                <div class="mechanics-tags">
                    <div class="tags-group">
                        <span class="tags-label">${tr('raid.bossDebuffs')}:</span>
                        ${debuffTags}
                    </div>
                    <div class="tags-group">
                        <span class="tags-label">${tr('raid.bossBuffs')}:</span>
                        ${buffTags}
                    </div>
                </div>
                
                <div class="recommendation-box">
                    <h4>${tr('raid.recommendedStrategy')}</h4>
                    <p>${getText(boss, 'recommendation')}</p>
                </div>
            </div>
        </div>
    `;
}

function renderRewardSystem(data, tr, getText) {
    const container = document.getElementById('unexpected-reward-system');
    if (!container || !data.reward_info) return;
    
    const rewardIcons = {
        'equipment_custom': '⚔️',
        'grade': '🏆',
        'ranking': '📊',
        'discoverer': '🔍',
        'subjugation': '💀'
    };
    
    const rewardsHtml = data.reward_info.map(reward => {
        let extraHtml = '';

        // 装備カスタム詳細
        if (reward.type === 'equipment_custom' && reward.details) {
            const d = reward.details;
            extraHtml = `
                <div class="reward-details equip-custom-details">
                    <div class="equip-custom-grid">
                        <div class="equip-custom-item">
                            <span class="equip-custom-label">${tr('raid.equipSets')}</span>
                            <span class="equip-custom-value">${d.sets}</span>
                        </div>
                        <div class="equip-custom-item">
                            <span class="equip-custom-label">${tr('raid.equipMainOptions')}</span>
                            <span class="equip-custom-value">${d.main_options}</span>
                        </div>
                        <div class="equip-custom-item">
                            <span class="equip-custom-label">${tr('raid.equipWeapon')}</span>
                            <span class="equip-custom-value">${d.weapon_slots}</span>
                        </div>
                        <div class="equip-custom-item">
                            <span class="equip-custom-label">${tr('raid.equipArmor')}</span>
                            <span class="equip-custom-value">${d.armor_slots}</span>
                        </div>
                    </div>
                    <div class="equip-custom-note">${getText(d, 'note')}</div>
                </div>
            `;
        }

        // 等級報酬詳細
        if (reward.type === 'grade' && reward.grades) {
            const gradeItems = reward.grades.map(g => `
                <div class="grade-item grade-${g.grade.toLowerCase()}">
                    <span class="grade-label">${g.grade}</span>
                    <span class="grade-desc">${getText(g, 'desc')}</span>
                </div>
            `).join('');
            extraHtml = `
                <div class="reward-details grade-details">
                    <div class="grade-list">${gradeItems}</div>
                </div>
            `;
        }

        return `
            <div class="unexpected-reward-card ${reward.type === 'equipment_custom' || reward.type === 'grade' ? 'expanded' : ''}">
                <div class="reward-card-header">
                    <span class="reward-card-icon">${rewardIcons[reward.type] || '📦'}</span>
                    <span class="reward-card-name">${getText(reward, 'name')}</span>
                </div>
                <p class="reward-card-desc">${getText(reward, 'desc')}</p>
                ${extraHtml}
            </div>
        `;
    }).join('');
    
    // 覚醒ボス情報
    let awakenedHtml = '';
    if (data.awakened_bosses && data.awakened_bosses.length > 0) {
        const bossTags = data.awakened_bosses.map(b => 
            `<span class="awakened-boss-tag">${getText(b, 'name')}</span>`
        ).join('');
        awakenedHtml = `
            <div class="awakened-bosses-section">
                <h4>${tr('raid.awakenedBosses')}</h4>
                <div class="awakened-boss-tags">${bossTags}</div>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="unexpected-rewards">
            <h3>${tr('raid.rewardSystem')}</h3>
            <div class="reward-cards-grid">
                ${rewardsHtml}
            </div>
            ${awakenedHtml}
        </div>
    `;
}
