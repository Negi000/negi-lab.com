// Raid Page JavaScript

// 画像フォーマット対応: pngで失敗したらwebpを試す
function handleImageError(img) {
    const src = img.src;
    if (src.endsWith('.png')) {
        img.src = src.replace(/\.png$/, '.webp');
    } else if (src.endsWith('.jpg') || src.endsWith('.jpeg')) {
        img.src = src.replace(/\.(jpg|jpeg)$/, '.webp');
    }
}
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') handleImageError(e.target);
}, true);

let raidData = null;
let currentBoss = 1;
let currentDifficulty = 1;
let currentRaidType = 'normal';
let currentWorldBoss = null;

// 数値フォーマット（普通の数字表記）
function formatNumber(num) {
    return num.toLocaleString();
}

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    if (!document.querySelector('.raid-main')) return;
    
    try {
        raidData = await fetchJson('data/raid.json');
        
        initRaidTypeTabs();
        initBossCards();
        initDifficultyButtons();
        
        // 初期表示
        selectBoss(1);
        
    } catch (error) {
        console.error('Error loading raid data:', error);
    }
});

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
    document.getElementById('world-raid-section').classList.toggle('hidden', type !== 'world');
    
    if (type === 'world') {
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
                 onerror="handleImageError(this)">
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
        'Briliant': 'images/icon/Raid/Atl_Account_Contents_BG_Briliant.png',
        'Devourer': 'images/icon/Raid/Atl_Account_Contents_BG_Devourer.png',
        'NiuMowang': 'images/icon/Raid/Atl_Account_Contents_BG_NiuMowang.png'
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
    
    const skillTypeNames = {
        1: '通常攻撃',
        2: 'スキル1',
        3: 'スキル2',
        4: 'スキル3',
        5: 'スキル4'
    };
    
    skillsContainer.innerHTML = boss.skills.map(skill => {
        const iconUrl = skill.icon ? `images/icon/SkillIcon_PC/${skill.icon}.png` : '';
        const iconHtml = iconUrl ? `<img class="skill-icon" src="${iconUrl}" alt="${skill.name}" onerror="handleImageError(this)">` : '';
        const descHtml = skill.desc ? `<span class="skill-desc">${skill.desc}</span>` : '';
        const coolHtml = skill.cooltime > 0 ? `<span class="skill-cooltime">CT: ${skill.cooltime}秒</span>` : '';
        
        return `
        <div class="boss-skill-item">
            ${iconHtml}
            <div class="skill-info">
                <div class="skill-header">
                    <span class="skill-type">${skillTypeNames[skill.type] || 'スキル'}</span>
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
    document.getElementById('stage-title').textContent = `難易度 ${currentDifficulty}`;
    
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
        subOptProbs.innerHTML = stage.sub_options.map(opt => `
            <div class="sub-option-item">
                <span class="sub-option-count">${opt.count}オプション</span>
                <span class="sub-option-prob">${opt.probability.toFixed(1)}%</span>
            </div>
        `).join('');
    } else {
        subOptSection.style.display = 'block';
        subOptProbs.innerHTML = '<span class="sub-option-none">サブオプション確定なし（基本値）</span>';
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
    
    // ボス情報
    const boss = stage.boss;
    if (!boss || !boss.stats) {
        container.innerHTML = '<p class="no-data">敵情報なし</p>';
        return;
    }
    
    const bossStats = boss.stats;
    const attackType = bossStats.magical_attack > bossStats.physical_attack ? '魔法' : '物理';
    const mainAttack = Math.max(bossStats.physical_attack, bossStats.magical_attack);
    
    let html = `
        <div class="enemy-section">
            <h4 class="enemy-title">ボス: ${boss.name}</h4>
            <div class="enemy-level">Lv.${boss.level}</div>
            <div class="enemy-stats-grid">
                <div class="stat-item">
                    <span class="stat-label">HP</span>
                    <span class="stat-value">${formatNumber(bossStats.hp)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">攻撃力 (${attackType})</span>
                    <span class="stat-value">${formatNumber(mainAttack)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">防御力</span>
                    <span class="stat-value">${formatNumber(bossStats.defence)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">攻撃速度</span>
                    <span class="stat-value">${bossStats.attack_speed}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">クリティカル</span>
                    <span class="stat-value">${bossStats.critical}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">命中率</span>
                    <span class="stat-value">${bossStats.accuracy_rate}</span>
                </div>
            </div>
        </div>
    `;
    
    // 取り巻き情報
    if (stage.minions && stage.minions.length > 0) {
        html += '<div class="minions-section"><h4 class="minions-title">取り巻き</h4>';
        
        stage.minions.forEach(minion => {
            const minionStats = minion.stats;
            const minionAttackType = minionStats.magical_attack > minionStats.physical_attack ? '魔法' : '物理';
            const minionMainAttack = Math.max(minionStats.physical_attack, minionStats.magical_attack);
            
            html += `
                <div class="minion-item">
                    <div class="minion-name">${minion.name}</div>
                    <div class="minion-level">Lv.${minion.level}</div>
                    <div class="minion-stats">
                        HP: ${formatNumber(minionStats.hp)} / 
                        攻撃: ${formatNumber(minionMainAttack)} (${minionAttackType}) / 
                        防御: ${formatNumber(minionStats.defence)}
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
                ${isFixed ? '<span class="reward-fixed-badge">確定</span>' : ''}
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
    
    // 装備タイプ別
    if (reward.item_type === '武器') return '⚔️';
    if (reward.item_type === '防具') return '🛡️';
    if (reward.item_type === '素材') return '📦';
    
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
                消費スタミナ: ${worldRaid.stamina} | 経験値: ${worldRaid.account_exp}
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
    
    // スキル情報
    let skillsHtml = '';
    if (worldRaid.skills && worldRaid.skills.length > 0) {
        skillsHtml = `
            <div class="world-raid-skills">
                <h4>スキル</h4>
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
                const attackType = bossStats.magical_attack > bossStats.physical_attack ? '魔法' : '物理';
                const mainAttack = Math.max(bossStats.physical_attack, bossStats.magical_attack);
                statsHtml = `
                    <div class="round-stats">
                        <span>HP: ${formatNumber(bossStats.hp)}</span>
                        <span>攻撃(${attackType}): ${formatNumber(mainAttack)}</span>
                        <span>防御: ${formatNumber(bossStats.defence)}</span>
                    </div>
                `;
            }
            
            return `
                <div class="world-round">
                    <h4>ラウンド ${round.round}</h4>
                    <p>ターン制限: ${round.turn_limit}ターン</p>
                    <p>敵数: ${round.enemies.length}体</p>
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
                <h4>クリア報酬</h4>
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
                <h4>ランク報酬</h4>
                ${worldRaid.rank_rewards.map(rankData => `
                    <div class="rank-reward-group">
                        <span class="rank-label">ランク${rankNames[rankData.rank] || rankData.rank}:</span>
                        ${rankData.rewards.map(r => `
                            <span class="reward-tag">${r.name} ×${formatNumber(r.amount)}</span>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // 攻撃タイプ表示
    const attackTypeText = worldRaid.attack_type === 'magical' ? '魔法攻撃' : '物理攻撃';
    
    container.innerHTML = `
        <div class="world-raid-info">
            <h3>${worldRaid.name}</h3>
            <div class="world-raid-type">${attackTypeText}</div>
            <div class="world-raid-stats">
                <span>消費スタミナ: ${worldRaid.stamina}</span>
                <span>アカウント経験値: ${worldRaid.account_exp}</span>
            </div>
            ${skillsHtml}
            <div class="world-rounds">
                ${roundsHtml}
            </div>
            ${rewardsHtml}
        </div>
    `;
}
