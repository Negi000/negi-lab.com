// Adventure Page JavaScript
let adventureData = null;
let currentDifficulty = 0;
let currentContinent = 1;

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
    // 冒険ページのみで実行
    if (!document.querySelector('.adventure-main')) return;
    
    try {
        // データ読み込み
        adventureData = await fetchJson('data/adventure.json');
        
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
            '<p style="color: red; text-align: center;">データの読み込みに失敗しました</p>';
    }
});

// 大陸セレクター初期化
function initContinentSelector() {
    const container = document.getElementById('continent-buttons');
    if (!container || !adventureData) return;
    
    container.innerHTML = '';
    
    // 大陸データを取得（将来の拡張に対応）
    const continents = adventureData.continents || {};
    
    // 大陸1, 2, 3の順で表示（データがなくても3つ表示）
    for (let i = 1; i <= 3; i++) {
        const continent = continents[i] || {
            id: i,
            name: i === 3 ? '???大陸' : `大陸${i}`,
            icon: `Atl_WorldArea_01_Area0${i}.png`
        };
        
        // この大陸にランドマークがあるかチェック
        const hasLandmarks = Object.values(adventureData.landmarks || {})
            .some(lm => lm.continent_id === i);
        
        const btn = document.createElement('button');
        btn.className = 'continent-btn' + (i === currentContinent ? ' active' : '') + (!hasLandmarks ? ' disabled' : '');
        btn.dataset.continentId = i;
        
        // アクティブな大陸かどうかで背景画像を切り替え
        const bgImage = i === currentContinent 
            ? 'Atl_Worldmap_01_Sprite_21.png' 
            : 'Atl_Worldmap_02_Sprite_4.png';
        
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
                ? 'images/icon/LandMarks/Atl_Worldmap_01_Sprite_21.png'
                : 'images/icon/LandMarks/Atl_Worldmap_02_Sprite_4.png';
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
    
    const continent = adventureData.continents[currentContinent];
    titleEl.textContent = continent ? continent.name : `大陸${currentContinent}`;
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
    
    // 現在の大陸と難易度でフィルタリング
    const landmarks = Object.values(adventureData.landmarks)
        .filter(lm => lm.continent_id === currentContinent && lm.difficulty === currentDifficulty)
        .sort((a, b) => a.id - b.id);
    
    if (landmarks.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-sub); text-align: center; grid-column: 1/-1;">この大陸にはまだステージがありません</p>';
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
                 onerror="this.src='https://placehold.co/200x200/1a1a1a/ffd700?text=${landmark.id}'">
            <div class="landmark-card-overlay">
                <span class="landmark-card-name">${landmark.name}</span>
                <span class="landmark-card-stages">${landmark.stages.length}ステージ</span>
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
    
    // タイトル
    const difficultyLabel = currentDifficulty === 0 ? '' : 'ナイトメア ';
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
            enemyCard.innerHTML = `
                <div class="enemy-icon">${monster.is_boss ? '👹' : '👾'}</div>
                <div class="enemy-info">
                    <span class="enemy-name">モンスター #${monster.id}</span>
                    <span class="enemy-level">Lv.${monster.level}</span>
                </div>
            `;
            enemiesGrid.appendChild(enemyCard);
        });
    } else {
        enemiesGrid.innerHTML = '<p style="color: var(--text-sub);">敵データなし</p>';
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
        // 報酬アイテム表示
        stage.rewards.forEach(reward => {
            if (reward.probability > 0) {
                const rewardItem = document.createElement('div');
                rewardItem.className = 'reward-item';
                
                const rewardName = getRewardName(reward.reward_id, reward.detail_group_id);
                rewardItem.innerHTML = `
                    <span>${rewardName}</span>
                    <span style="color: var(--text-sub);">(${reward.probability.toFixed(2)}%)</span>
                `;
                rewardsGrid.appendChild(rewardItem);
            }
        });
        
        // 詳細報酬（ドロップ率）
        let hasDetails = false;
        stage.rewards.forEach(reward => {
            if (reward.detail_group_id && adventureData.reward_details[reward.detail_group_id]) {
                hasDetails = true;
                const details = adventureData.reward_details[reward.detail_group_id];
                
                const groupDiv = document.createElement('div');
                groupDiv.innerHTML = `<h4>グループ ${reward.detail_group_id} (${reward.probability.toFixed(2)}%)</h4>`;
                
                details.forEach(detail => {
                    const detailItem = document.createElement('div');
                    detailItem.className = 'reward-detail-item';
                    detailItem.innerHTML = `
                        <span class="reward-detail-name">アイテム #${detail.reward_id}</span>
                        <span class="reward-detail-rate">${detail.ratio.toFixed(2)}%</span>
                    `;
                    groupDiv.appendChild(detailItem);
                });
                
                rewardsDetail.appendChild(groupDiv);
            }
        });
        
        // 詳細がある場合のみボタンを有効化
        if (!hasDetails) {
            toggleBtn.style.display = 'none';
        } else {
            toggleBtn.style.display = 'inline-block';
        }
    } else {
        rewardsGrid.innerHTML = '<p style="color: var(--text-sub);">報酬データなし</p>';
        toggleBtn.style.display = 'none';
    }
    
    // トグルボタンイベント
    toggleBtn.onclick = () => {
        toggleBtn.classList.toggle('active');
        rewardsDetail.classList.toggle('hidden');
        toggleBtn.textContent = toggleBtn.classList.contains('active') 
            ? 'ドロップ率を隠す' 
            : 'ドロップ率を表示';
    };
    
    modal.classList.add('active');
}

// 報酬名取得（仮）
function getRewardName(rewardId, detailGroupId) {
    // 既知のIDをマッピング
    const rewardNames = {
        502: 'ゴールド',
        // 他のIDを追加可能
    };
    
    if (rewardId && rewardNames[rewardId]) {
        return rewardNames[rewardId];
    }
    
    if (detailGroupId) {
        return `報酬グループ ${detailGroupId}`;
    }
    
    return `アイテム #${rewardId || '?'}`;
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
