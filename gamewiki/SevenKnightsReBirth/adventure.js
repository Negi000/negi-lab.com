// Adventure Page JavaScript
let adventureData = null;
let currentDifficulty = 0;
let currentContinent = 1;

// 言語別データ読み込み（フォールバック対応）
async function loadLocalizedData(filename) {
    const lang = typeof getLang === 'function' ? getLang() : 'ja';
    try {
        // まず言語別ディレクトリを試す
        const res = await fetch(`data/${lang}/${filename}`);
        if (res.ok) return await res.json();
    } catch (e) {
        console.log(`[adventure] Fallback to root data for ${filename}`);
    }
    // フォールバック: ルートディレクトリ
    return await fetchJson(`data/${filename}`);
}

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    // 冒険ページのみで実行
    if (!document.querySelector('.adventure-main')) return;
    
    // i18nの準備完了を待つ
    if (typeof onI18nReady === 'function') {
        onI18nReady(initAdventurePage);
    } else {
        initAdventurePage();
    }
});

async function initAdventurePage() {
    try {
        // データ読み込み
        adventureData = await loadLocalizedData('adventure.json');
        
        // 大陸ボタンの初期化
        initContinentSelector();
        
        // 難易度ボタンの初期化
        initDifficultyToggle();
        
        // ランドマーク表示
        renderLandmarks();
        
        // モーダルイベント
        initModals();
        
    } catch (error) {
        console.error('Error loading adventure data:', error);
        document.getElementById('landmarks-grid').innerHTML = 
            '<p style="color: red; text-align: center;">'+
            (typeof t === 'function' ? t('common.error') : 'データの読み込みに失敗しました') +'</p>';
    }
}

// 大陸セレクター初期化
function initContinentSelector() {
    const container = document.getElementById('continent-buttons');
    if (!container || !adventureData) return;
    
    container.innerHTML = '';
    
    // 翻訳関数
    const tr = typeof t === 'function' ? t : (k) => k;
    
    // 大陸データを取得（将来の拡張に対応）
    const continents = adventureData.continents || {};
    
    // 大陸1, 2, 3の順で表示（データがなくても3つ表示）
    for (let i = 1; i <= 3; i++) {
        const continent = continents[i] || {
            id: i,
            name: i === 3 ? tr('adventure.unknownContinent') : tr('adventure.continent').replace('{id}', i),
            icon: `Atl_WorldArea_01_Area0${i}.webp`
        };
        
        // この大陸にランドマークがあるかチェック
        const hasLandmarks = Object.values(adventureData.landmarks || {})
            .some(lm => lm.continent_id === i);
        
        const btn = document.createElement('button');
        btn.className = 'continent-btn' + (i === currentContinent ? ' active' : '') + (!hasLandmarks ? ' disabled' : '');
        btn.dataset.continentId = i;
        
        // アクティブな大陸かどうかで背景画像を切り替え
        const bgImage = i === currentContinent 
            ? 'Atl_Worldmap_01_Sprite_21.webp' 
            : 'Atl_Worldmap_02_Sprite_4.webp';
        
        btn.innerHTML = `
            <img class="continent-btn-bg" src="images/icon/LandMarks/${bgImage}" alt="">
            <img class="continent-btn-icon" src="images/icon/LandMarks/${continent.icon}" alt="${continent.name}">
            <span class="continent-btn-label">${continent.name}</span>
        `;
        
        if (hasLandmarks) {
            btn.addEventListener('click', () => selectContinent(i));
        }
        
        container.appendChild(btn);
    }
    
    // 初期大陸名を設定
    updateContinentTitle();
}

// 大陸選択
function selectContinent(continentId) {
    currentContinent = continentId;
    
    // ボタンの状態更新
    document.querySelectorAll('.continent-btn').forEach(btn => {
        const isActive = parseInt(btn.dataset.continentId) === continentId;
        btn.classList.toggle('active', isActive);
        
        // 背景画像を切り替え
        const bgImg = btn.querySelector('.continent-btn-bg');
        if (bgImg) {
            bgImg.src = isActive 
                ? 'images/icon/LandMarks/Atl_Worldmap_01_Sprite_21.webp'
                : 'images/icon/LandMarks/Atl_Worldmap_02_Sprite_4.webp';
        }
    });
    
    // タイトル更新
    updateContinentTitle();
    
    // ランドマーク再表示
    renderLandmarks();
}

// 大陸タイトル更新
function updateContinentTitle() {
    const titleEl = document.getElementById('continent-name');
    if (!titleEl || !adventureData) return;
    
    // 翻訳関数
    const tr = typeof t === 'function' ? t : (k) => k;
    
    const continent = adventureData.continents[currentContinent];
    titleEl.textContent = continent ? continent.name : tr('adventure.continent').replace('{id}', currentContinent);
}

// 難易度トグル初期化
function initDifficultyToggle() {
    const btns = document.querySelectorAll('.difficulty-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = parseInt(btn.dataset.difficulty);
            updateNightmareMode();
            renderLandmarks();
        });
    });
}

// ナイトメアモードの切り替え
function updateNightmareMode() {
    const main = document.querySelector('.adventure-main');
    if (main) {
        main.classList.toggle('nightmare-mode', currentDifficulty === 1);
    }
}

// ランドマーク表示
function renderLandmarks() {
    const grid = document.getElementById('landmarks-grid');
    if (!grid || !adventureData) return;
    
    grid.innerHTML = '';
    
    // 翻訳関数
    const tr = typeof t === 'function' ? t : (k) => k;
    
    // 現在の大陸と難易度でフィルタリング
    const landmarks = Object.values(adventureData.landmarks)
        .filter(lm => lm.continent_id === currentContinent && lm.difficulty === currentDifficulty)
        .sort((a, b) => a.id - b.id);
    
    if (landmarks.length === 0) {
        grid.innerHTML = `<p style="color: var(--text-sub); text-align: center; grid-column: 1/-1;">${tr('adventure.noStages')}</p>`;
        return;
    }
    
    landmarks.forEach(landmark => {
        const card = document.createElement('div');
        card.className = 'landmark-card';
        card.dataset.landmarkKey = `${landmark.id}_${landmark.difficulty}`;
        
        card.innerHTML = `
            <span class="landmark-card-number">${landmark.id}</span>
            <img class="landmark-card-image" 
                 src="images/icon/LandMarks/${landmark.image}" 
                 alt="${landmark.name}"
                 onerror="this.style.display='none'">
            <div class="landmark-card-overlay">
                <span class="landmark-card-name">${landmark.name}</span>
                <span class="landmark-card-stages">${tr('adventure.stageCount').replace('{count}', landmark.stages.length)}</span>
            </div>
        `;
        
        card.addEventListener('click', () => openLandmarkModal(landmark));
        grid.appendChild(card);
    });
}

// ランドマークモーダルを開く
function openLandmarkModal(landmark) {
    const modal = document.getElementById('stage-modal');
    
    document.getElementById('modal-landmark-img').src = `images/icon/LandMarks/${landmark.image}`;
    document.getElementById('modal-landmark-name').textContent = landmark.name;
    document.getElementById('modal-landmark-info').textContent = landmark.info || '';
    
    // ステージボタン生成
    const stagesList = document.getElementById('modal-stages-list');
    stagesList.innerHTML = '';
    
    landmark.stages.forEach(stage => {
        const btn = document.createElement('button');
        btn.className = 'stage-btn' + (stage.boss_mark ? ' boss' : '');
        
        // ステージ番号表示（例：1-1, 1-2 など）
        const stageLabel = `${landmark.id}-${stage.sequence}`;
        
        btn.innerHTML = `
            <span class="stage-number">${stage.sequence}</span>
            <span class="stage-label">${stage.boss_mark ? 'BOSS' : ''}</span>
        `;
        
        btn.addEventListener('click', () => openStageDetailModal(stage, landmark));
        stagesList.appendChild(btn);
    });
    
    modal.classList.add('active');
}

// ステージ詳細モーダルを開く
function openStageDetailModal(stage, landmark) {
    const modal = document.getElementById('stage-detail-modal');
    
    // 翻訳関数
    const tr = typeof t === 'function' ? t : (k) => k;
    
    // タイトル
    const difficultyLabel = currentDifficulty === 0 ? '' : tr('adventure.nightmare') + ' ';
    document.getElementById('stage-detail-title').textContent = 
        `${difficultyLabel}${landmark.name} ${landmark.id}-${stage.sequence}`;
    
    // 基本情報
    document.getElementById('stage-stamina').textContent = stage.stamina || '-';
    document.getElementById('stage-exp').textContent = stage.hero_exp || '-';
    document.getElementById('stage-star-turn').textContent = stage.star_turn || '-';
    
    // 敵情報
    const enemiesGrid = document.getElementById('stage-enemies');
    enemiesGrid.innerHTML = '';
    
    if (stage.monsters && stage.monsters.length > 0) {
        stage.monsters.forEach(monster => {
            const enemyCard = document.createElement('div');
            enemyCard.className = 'enemy-card' + (monster.is_boss ? ' boss' : '');
            const monsterName = getMonsterName(monster.id);
            const iconPath = getMonsterIconPath(monster.id);
            enemyCard.innerHTML = `
                <div class="enemy-icon">
                    <img class="enemy-icon-img" src="${iconPath}" alt="${monsterName}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <span class="enemy-icon-fallback" style="display:none;">${monster.is_boss ? '👹' : '👾'}</span>
                </div>
                <div class="enemy-info">
                    <span class="enemy-name">${monsterName}</span>
                    <span class="enemy-level">Lv.${monster.level}</span>
                </div>
            `;
            enemiesGrid.appendChild(enemyCard);
        });
    } else {
        enemiesGrid.innerHTML = `<p style="color: var(--text-sub);">${tr('adventure.noEnemyData')}</p>`;
    }
    
    // 報酬情報
    const rewardsGrid = document.getElementById('stage-rewards');
    const rewardsDetail = document.getElementById('rewards-detail');
    const toggleBtn = document.getElementById('toggle-rewards-btn');
    
    rewardsGrid.innerHTML = '';
    rewardsDetail.innerHTML = '';
    rewardsDetail.classList.add('hidden');
    toggleBtn.classList.remove('active');
    
    if (stage.rewards && stage.rewards.length > 0) {
        // 同名グループの重複を判定（まず「人間が読む表示名」で数える）
        const groupNameCount = new Map();
        stage.rewards.forEach(r => {
            const isFirst = !!r.first_reward;
            const isGroup = !isFirst && !r.reward_id && r.detail_group_id;
            if (!isGroup) return;
            const name = getRewardGroupDisplayNameRaw(r.stage_show_reward_group_id, r.detail_group_id);
            groupNameCount.set(name, (groupNameCount.get(name) || 0) + 1);
        });

        // 報酬アイテム表示
        stage.rewards.forEach(reward => {
            const isFirst = !!reward.first_reward;
            if (isFirst || reward.probability > 0) {
                const rewardItem = document.createElement('div');
                rewardItem.className = 'reward-item';
                
                const isGroup = !isFirst && !reward.reward_id && reward.detail_group_id;
                let rewardName;
                if (isFirst) {
                    rewardName = `${tr('adventure.firstReward')}: ${getFirstRewardDisplayName(reward)}`;
                } else if (isGroup) {
                    rewardName = getRewardGroupDisplayName(reward.stage_show_reward_group_id, reward.detail_group_id, groupNameCount);
                } else {
                    rewardName = getRewardName(reward.reward_id, reward.detail_group_id, reward.stage_show_reward_group_id);
                }

                const probLabel = isFirst ? tr('adventure.firstClear') : formatPercent(reward.probability);
                rewardItem.innerHTML = `
                    <span>${rewardName}</span>
                    <span style="color: var(--text-sub);">(${probLabel})</span>
                `;
                rewardsGrid.appendChild(rewardItem);
            }
        });
        
        // 詳細報酬（ドロップ率）
        let hasDetails = false;
        // 先頭にコントロール（全開/全閉）を作る
        const controls = document.createElement('div');
        controls.className = 'reward-detail-controls';
        controls.innerHTML = `
            <button type="button" class="reward-detail-control" data-action="open">${tr('adventure.openAll')}</button>
            <button type="button" class="reward-detail-control" data-action="close">${tr('adventure.closeAll')}</button>
            <span class="reward-detail-note">${tr('adventure.dropNote')}</span>
        `;
        rewardsDetail.appendChild(controls);

        stage.rewards.forEach(reward => {
            const detailKey = String(reward.detail_group_id || '');
            if (reward.detail_group_id && adventureData.reward_details[detailKey]) {
                hasDetails = true;
                const details = adventureData.reward_details[detailKey];
                const isFirst = !!reward.first_reward;
                
                const groupDetails = document.createElement('details');
                groupDetails.className = 'reward-detail-group';
                groupDetails.dataset.detailGroupId = String(reward.detail_group_id);

                const groupName = isFirst
                    ? tr('adventure.firstReward')
                    : getRewardGroupDisplayName(reward.stage_show_reward_group_id, reward.detail_group_id, groupNameCount);
                const probLabel = isFirst ? tr('adventure.firstClear') : formatPercent(reward.probability);

                const sumWithin = details.reduce((acc, d) => acc + (Number(d.ratio) || 0), 0);
                const sumDiff = Math.abs(sumWithin - 100);
                const sumClass = sumDiff <= 0.05 ? 'ok' : 'warn';

                // デバッグ用の参照情報は画面に出さず、titleに閉じ込める
                const rawName = getRewardGroupName(reward.stage_show_reward_group_id, reward.detail_group_id);
                const metaName = getDetailGroupLabel(reward.detail_group_id);
                const titleLines = [];
                if (rawName && metaName && rawName !== metaName) titleLines.push(`${tr('adventure.displayCategory')}: ${rawName}`);
                titleLines.push(`${tr('adventure.referenceId')}: ${tr('adventure.displayId')}${reward.stage_show_reward_group_id || 0} / ${tr('adventure.detailId')}${reward.detail_group_id}`);

                const summary = document.createElement('summary');
                summary.className = 'reward-detail-summary';
                if (titleLines.length) summary.setAttribute('title', titleLines.join('\n'));

                const sumHtml = (sumDiff <= 0.05)
                    ? ''
                    : `<span class="reward-detail-summary-sum ${sumClass}">${tr('adventure.internalSum')} ${formatPercent(sumWithin)}</span>`;
                summary.innerHTML = `
                    <span class="reward-detail-summary-title">${groupName}</span>
                    <span class="reward-detail-summary-meta">
                        <span class="reward-detail-summary-prob">${tr('adventure.inStageLabel')} ${probLabel}</span>
                        ${sumHtml}
                    </span>
                `;
                groupDetails.appendChild(summary);

                // ヘッダ行
                const header = document.createElement('div');
                header.className = 'reward-detail-header';
                header.innerHTML = `
                    <span class="reward-detail-name">${tr('adventure.item')}</span>
                    <span class="reward-detail-overall">${tr('adventure.inStage')}</span>
                    <span class="reward-detail-within">${tr('adventure.inGroup')}</span>
                `;
                groupDetails.appendChild(header);

                // 詳細行（内訳降順）
                const sorted = [...details].sort((a, b) => (Number(b.ratio) || 0) - (Number(a.ratio) || 0));
                sorted.forEach(detail => {
                    const detailItem = document.createElement('div');
                    detailItem.className = 'reward-detail-item';
                    const itemName = getItemName(detail.reward_id);
                    const withinLabel = formatPercent(detail.ratio);
                    const overallPct = isFirst ? null : (reward.probability * (Number(detail.ratio) || 0) / 100);
                    const overallLabel = isFirst ? tr('adventure.firstClear') : formatPercent(overallPct);
                    detailItem.innerHTML = `
                        <span class="reward-detail-name">${itemName}</span>
                        <span class="reward-detail-overall">${overallLabel}</span>
                        <span class="reward-detail-within">${withinLabel}</span>
                    `;
                    groupDetails.appendChild(detailItem);
                });

                rewardsDetail.appendChild(groupDetails);
            }
        });

        // コントロールのイベント
        controls.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const list = rewardsDetail.querySelectorAll('details.reward-detail-group');
            list.forEach(d => d.open = (action === 'open'));
        });
        
        // 詳細がある場合のみボタンを有効化
        if (!hasDetails) {
            toggleBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'inline-block';
        }
    } else {
        rewardsGrid.innerHTML = `<p style="color: var(--text-sub);">${tr('adventure.noRewardData')}</p>`;
        toggleBtn.style.display = 'none';
    }
    
    // トグルボタンイベント
    toggleBtn.onclick = () => {
        toggleBtn.classList.toggle('active');
        rewardsDetail.classList.toggle('hidden');
        toggleBtn.textContent = toggleBtn.classList.contains('active') 
            ? tr('adventure.hideDropRates') 
            : tr('adventure.showDropRate');
    };
    
    modal.classList.add('active');
}

function formatPercent(pct) {
    const n = Number(pct);
    if (!Number.isFinite(n)) return '-';

    const abs = Math.abs(n);
    if (abs === 0) return '0%';
    if (abs < 0.01) return `${n.toFixed(4)}%`;
    if (abs < 0.1) return `${n.toFixed(3)}%`;
    return `${n.toFixed(2)}%`;
}

function getFirstRewardDisplayName(reward) {
    const detailKey = String(reward?.detail_group_id || '');
    const details = adventureData?.reward_details?.[detailKey];
    if (Array.isArray(details) && details.length === 1 && details[0]?.reward_id) {
        return getItemName(details[0].reward_id);
    }
    // どうしても分からない場合は従来の表示にフォールバック
    return getRewardName(reward.reward_id, reward.detail_group_id, reward.stage_show_reward_group_id);
}

function lookupDict(dict, id) {
    if (!dict) return null;
    const key = String(id);
    return dict[key] ?? null;
}

function resolveItemIdVariants(itemId) {
    const n = Number(itemId);
    if (!Number.isFinite(n)) return [itemId];
    // 例: 10111001 -> 10111000（末尾のバリエーションを吸収）
    const base100 = Math.floor(n / 100) * 100;
    const base10 = Math.floor(n / 10) * 10;
    const variants = [n];
    if (base100 !== n) variants.push(base100);
    if (base10 !== n && base10 !== base100) variants.push(base10);
    return variants;
}

function getRewardGroupName(stageShowRewardGroupId, detailGroupId) {
    const g = lookupDict(adventureData?.stage_show_reward_groups, stageShowRewardGroupId);
    if (g && typeof g === 'object' && g.name) return g.name;
    // stage_show_reward_groupsは {id:{name,desc,icon}} の形だが、JSONから読むとキーは文字列
    const g2 = adventureData?.stage_show_reward_groups?.[String(stageShowRewardGroupId)];
    if (g2?.name) return g2.name;
    const tr = typeof t === 'function' ? t : (k) => k;
    return tr('adventure.rewardGroup').replace('{id}', detailGroupId);
}

function getDetailGroupMeta(detailGroupId) {
    return adventureData?.reward_detail_group_meta?.[String(detailGroupId)] ?? null;
}

function getDetailGroupLabel(detailGroupId) {
    const meta = getDetailGroupMeta(detailGroupId);
    if (!meta) return null;
    if (meta.suggested_name) return meta.suggested_name;
    
    // 翻訳関数
    const tr = typeof t === 'function' ? t : (k) => k;

    const kind = meta.kind;
    const hasStarRaw = meta.star_min !== null && meta.star_min !== undefined && meta.star_max !== null && meta.star_max !== undefined;
    const min = hasStarRaw ? Number(meta.star_min) : Number.NaN;
    const max = hasStarRaw ? Number(meta.star_max) : Number.NaN;
    const hasStar = Number.isFinite(min) && Number.isFinite(max);

    if (kind === 'pc' && hasStar) {
        if (min === max) return tr('adventure.star').replace('{value}', min) + tr('adventure.character');
        return tr('adventure.starRange').replace('{min}', min).replace('{max}', max) + tr('adventure.character');
    }
    if (kind === 'equip' && hasStar) {
        const types = Array.isArray(meta.equip_item_types) ? meta.equip_item_types : [];
        const isAccessory = types.includes(104);
        const suffix = isAccessory ? tr('adventure.accessory') : tr('adventure.equipment');
        if (min === max) return tr('adventure.star').replace('{value}', min) + suffix;
        return tr('adventure.starRange').replace('{min}', min).replace('{max}', max) + suffix;
    }
    return null;
}

function getRewardGroupDisplayNameRaw(stageShowRewardGroupId, detailGroupId) {
    // まずはデータ内容から推定（★別など）
    const metaName = getDetailGroupLabel(detailGroupId);
    if (metaName) return metaName;
    // 推定できない場合はゲーム側の「表示用グループ名」を使う
    return getRewardGroupName(stageShowRewardGroupId, detailGroupId);
}

function getRewardGroupDisplayName(stageShowRewardGroupId, detailGroupId, nameCountMap) {
    const base = getRewardGroupDisplayNameRaw(stageShowRewardGroupId, detailGroupId);
    const n = nameCountMap ? (nameCountMap.get(base) || 0) : 0;
    if (n > 1) {
        // どうしても同名になる場合だけ、最小限に識別子を付ける
        const tr = typeof t === 'function' ? t : (k) => k;
        return base + tr('adventure.groupId').replace('{id}', detailGroupId);
    }
    return base;
}

// 報酬名取得
function getRewardName(rewardId, detailGroupId, stageShowRewardGroupId) {
    // RewardID=0 かつ detailGroupId がある場合は「報酬グループ（表示名）」
    if (!rewardId && detailGroupId) {
        return getRewardGroupName(stageShowRewardGroupId, detailGroupId);
    }

    // 通貨IDの場合
    const currencyName = lookupDict(adventureData?.currency_names, rewardId);
    if (currencyName) return currencyName;

    // アイテムIDの場合（末尾違いの吸収あり）
    const variants = resolveItemIdVariants(rewardId);
    for (const v of variants) {
        const itemName = lookupDict(adventureData?.item_names, v);
        if (itemName) return itemName;
    }

    // モンスター/キャラクターIDの場合（報酬としてキャラがドロップする場合）
    const monsterName = lookupDict(adventureData?.monster_names, rewardId);
    if (monsterName) return monsterName;

    const tr = typeof t === 'function' ? t : (k) => k;
    return tr('adventure.itemId').replace('{id}', rewardId || '?');
}

// アイテム名取得
function getItemName(itemId) {
    // 通貨
    const currencyName = lookupDict(adventureData?.currency_names, itemId);
    if (currencyName) return currencyName;

    // アイテム（末尾違いの吸収あり）
    const variants = resolveItemIdVariants(itemId);
    for (const v of variants) {
        const itemName = lookupDict(adventureData?.item_names, v);
        if (itemName) return itemName;
    }

    // モンスター/キャラクター
    const monsterName = lookupDict(adventureData?.monster_names, itemId);
    if (monsterName) return monsterName;

    const tr = typeof t === 'function' ? t : (k) => k;
    return tr('adventure.itemId').replace('{id}', itemId);
}

// モンスター名取得
function getMonsterName(monsterId) {
    const name = lookupDict(adventureData?.monster_names, monsterId);
    if (name) return name;
    const tr = typeof t === 'function' ? t : (k) => k;
    return tr('adventure.monsterId').replace('{id}', monsterId);
}

function getMonsterIconPath(monsterId) {
    const file = lookupDict(adventureData?.monster_icons, monsterId) || `Tex_HeroIcon_${monsterId}Card.webp`;
    return `images/icon/Card/${file}`;
}

// モーダル初期化
function initModals() {
    // 閉じるボタン
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    // 背景クリックで閉じる
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}
