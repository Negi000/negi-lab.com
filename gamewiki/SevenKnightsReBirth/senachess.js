/**
 * セナチェス確率計算ツール
 * ゲームと同じデザイン + スクリーンショット解析機能
 */
(function() {
    'use strict';
    
    const TOTAL_TILES = 80;
    const COLS = 10;
    const ROWS = 8;
    const STORAGE_KEY = 'senachess_v2';
    
    // 安全な翻訳関数（i18n初期化前でも動作）
    function safeT(key, params = {}) {
        // グローバルのt関数が利用可能かつI18N_UIがロード済みの場合
        if (typeof t === 'function' && typeof I18N_UI !== 'undefined' && I18N_UI && I18N_UI[key]) {
            return t(key, params);
        }
        // フォールバック: キーから日本語テキストを推測（ハードコード）
        const fallbacks = {
            'senachess.achieved': '達成！',
            'senachess.moreDraws': `あと${params.n || 0}回`,
            'senachess.found': '発見済み！🎉',
            'senachess.searching': '探索中...',
            'senachess.advice.wishFound': 'おめでとうございます！ウィッシュキャラを発見しました！',
            'senachess.advice.allEqual': '内部的には全マス均等確率。期待値モードで「残りやすい場所」を確認できます。',
            'senachess.advice.almostThere': `あと少し！確率 ${params.prob || 0}% まで上昇中！`,
            'senachess.advice.probRising': `確率上昇中！各マス ${params.prob || 0}% です。`,
            'senachess.advice.bonus60Achieved': `60回報酬獲得済み！80回まであと ${params.n || 0} 回で追加報酬！`,
            'senachess.advice.halfway': `折り返し地点通過！60回報酬まであと ${params.n || 0} 回。`,
            'senachess.efficiency.complete': '全マス開封済み、またはウィッシュ発見済み',
            'senachess.efficiency.goldOnly': '毎日1回（ゴールドのみ）で間に合う',
            'senachess.efficiency.perDay': `毎日${params.n || 0}回（${params.ruby || 0}ルビー/日）`,
            'senachess.efficiency.perDayNeeded': `毎日${params.n || 0}回（${params.ruby || 0}ルビー/日）が必要`,
            'senachess.efficiency.detailNoRuby': `残り<strong>${params.remaining || 0}マス</strong>を${params.days || 0}日で開封 → ルビー不要`,
            'senachess.efficiency.detailCalc': `残り<strong>${params.remaining || 0}マス</strong> ÷ ${params.days || 0}日 = 約${params.n || 0}回/日<br>総コスト: 約<strong>${params.total || 0}ルビー</strong>`,
            'senachess.efficiency.detailShort': `残り<strong>${params.remaining || 0}マス</strong>に対して日数が少なめ<br>総コスト: 約<strong>${params.total || 0}ルビー</strong>`,
            'senachess.efficiency.saved': `（毎日ゴールド活用で<strong>${params.saved || 0}</strong>節約）`
        };
        return fallbacks[key] || key;
    }
    
    // 状態
    let state = {
        opened: new Set(),
        wishIndex: null,
        wishFound: false
    };
    
    // モード: 'equal' = 均等確率, 'expectation' = 期待値表示
    let displayMode = 'equal';
    
    // セナチェス期間データ
    let periodData = null;
    
    // DOM要素
    let $grid, $drawCount, $progressBar, $nextProb, $remaining, $expected, $cost;
    let $need60, $need80, $bonus60, $bonus80, $adviceText, $wishStatus, $wishPortrait;
    
    document.addEventListener('DOMContentLoaded', init);
    
    async function init() {
        // DOM取得
        $grid = document.getElementById('tilesGrid');
        $drawCount = document.getElementById('drawCount');
        $progressBar = document.getElementById('progressBar');
        $nextProb = document.getElementById('nextProb');
        $remaining = document.getElementById('remaining');
        $expected = document.getElementById('expected');
        $cost = document.getElementById('cost');
        $need60 = document.getElementById('need60');
        $need80 = document.getElementById('need80');
        $bonus60 = document.getElementById('bonus60');
        $bonus80 = document.getElementById('bonus80');
        $adviceText = document.getElementById('adviceText');
        $wishStatus = document.getElementById('wishStatus');
        $wishPortrait = document.getElementById('wishPortrait');
        
        // 期間データ読み込み
        try {
            const res = await fetch('data/senachess.json');
            if (res.ok) {
                periodData = await res.json();
                console.log('期間データ読み込み成功:', periodData);
            }
        } catch (e) {
            console.warn('期間データ読み込み失敗:', e);
        }
        
        // チェス盤生成
        createGrid();
        
        // イベント
        document.getElementById('resetBtn').addEventListener('click', resetBoard);
        document.getElementById('screenshotInput').addEventListener('change', handleScreenshot);
        document.getElementById('modeToggle').addEventListener('change', toggleDisplayMode);
        
        // ボード範囲選択モーダルのイベント
        const cancelBtn = document.getElementById('boardSelectCancel');
        const confirmBtn = document.getElementById('boardSelectConfirm');
        if (cancelBtn) cancelBtn.addEventListener('click', closeBoardSelectModal);
        if (confirmBtn) confirmBtn.addEventListener('click', confirmBoardSelection);
        
        // 残り日数変更時の再計算
        const daysInput = document.getElementById('daysLeft');
        if (daysInput) {
            daysInput.addEventListener('input', () => {
                const draws = state.opened.size;
                const remaining = TOTAL_TILES - draws;
                updateEfficiencyAdvice(draws, remaining);
            });
        }
        
        // 初期モードラベル設定
        document.getElementById('labelEqual').classList.add('active');
        
        // 復元
        loadState();
        
        // i18n準備完了後に統計を更新（翻訳キーを正しく表示するため）
        if (typeof onI18nReady === 'function') {
            onI18nReady(() => updateStats());
        } else if (window.i18n && typeof window.i18n.onReady === 'function') {
            window.i18n.onReady(() => updateStats());
        } else {
            // i18nが利用できない場合は遅延実行
            setTimeout(() => updateStats(), 100);
        }
    }
    
    function createGrid() {
        console.log('createGrid called, $grid:', $grid);
        if (!$grid) {
            console.error('tilesGrid element not found!');
            return;
        }
        $grid.innerHTML = '';
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const idx = row * COLS + col;
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.idx = idx;
                
                // チェス盤パターン（左上が白）
                const isWhite = (row + col) % 2 === 0;
                tile.classList.add(isWhite ? 'white' : 'red');
                
                // 確率オーバーレイ
                const overlay = document.createElement('div');
                overlay.className = 'prob-overlay';
                tile.appendChild(overlay);
                
                // クリックイベント
                tile.addEventListener('click', () => toggleTile(idx));
                
                $grid.appendChild(tile);
            }
        }
        console.log('Grid created with', $grid.children.length, 'tiles');
    }
    
    function toggleTile(idx) {
        const tile = $grid.children[idx];
        
        if (state.wishIndex === idx) {
            // ウィッシュ解除
            state.wishIndex = null;
            state.wishFound = false;
            state.opened.delete(idx);
            tile.classList.remove('wish', 'opened');
        } else if (state.opened.has(idx)) {
            // 開封済み→ウィッシュ
            state.wishIndex = idx;
            state.wishFound = true;
            tile.classList.remove('opened');
            tile.classList.add('wish');
        } else {
            // 未開封→開封済み
            state.opened.add(idx);
            tile.classList.add('opened');
        }
        
        saveState();
        updateStats();
    }
    
    function resetBoard() {
        if (!confirm('ボードをリセットしますか？')) return;
        
        state.opened.clear();
        state.wishIndex = null;
        state.wishFound = false;
        
        Array.from($grid.children).forEach(tile => {
            tile.classList.remove('opened', 'wish');
        });
        
        localStorage.removeItem(STORAGE_KEY);
        updateStats();
    }
    
    function updateStats() {
        const draws = state.opened.size;
        const remaining = TOTAL_TILES - draws;
        
        // 進捗
        $drawCount.textContent = draws;
        $progressBar.style.width = (draws / TOTAL_TILES * 100) + '%';
        
        // 確率
        if (state.wishFound) {
            $nextProb.textContent = safeT('senachess.found').replace('🎉', '').trim();
            $nextProb.style.color = '#27ae60';
            $wishStatus.textContent = safeT('senachess.found');
            $wishStatus.classList.add('found');
            $wishPortrait.innerHTML = '✓';
            $wishPortrait.classList.add('found');
        } else if (remaining > 0) {
            const prob = (1 / remaining * 100);
            $nextProb.textContent = prob.toFixed(2) + '%';
            $nextProb.style.color = prob >= 10 ? '#27ae60' : prob >= 5 ? '#f39c12' : '#ffd700';
            $wishStatus.textContent = safeT('senachess.searching');
            $wishStatus.classList.remove('found');
            $wishPortrait.innerHTML = '?';
            $wishPortrait.classList.remove('found');
        } else {
            $nextProb.textContent = '--';
        }
        
        $remaining.textContent = remaining;
        
        // 期待値
        if (state.wishFound || remaining === 0) {
            $expected.textContent = '--';
        } else {
            $expected.textContent = ((remaining + 1) / 2).toFixed(1);
        }
        
        // コスト計算
        $cost.textContent = calculateCost(draws, remaining);
        
        // ボーナス
        updateBonus(draws);
        
        // ヒートマップ更新
        updateHeatmap(remaining);
        
        // アドバイス
        updateAdvice(draws, remaining);
        
        // 効率アドバイス更新
        updateEfficiencyAdvice(draws, remaining);
    }
    
    function calculateCost(draws, remaining) {
        let ruby = 0;
        for (let i = draws + 1; i <= TOTAL_TILES; i++) {
            if (i === 1) continue; // ゴールド
            else if (i === 2) ruby += 50;
            else if (i === 3) ruby += 100;
            else ruby += 150;
        }
        return ruby.toLocaleString();
    }
    
    function updateBonus(draws) {
        if (draws >= 60) {
            $bonus60.classList.add('achieved');
            $need60.textContent = safeT('senachess.achieved');
        } else {
            $bonus60.classList.remove('achieved');
            $need60.textContent = safeT('senachess.moreDraws', { n: 60 - draws });
        }
        
        if (draws >= 80) {
            $bonus80.classList.add('achieved');
            $need80.textContent = safeT('senachess.achieved');
        } else {
            $bonus80.classList.remove('achieved');
            $need80.textContent = safeT('senachess.moreDraws', { n: 80 - draws });
        }
    }
    
    function updateHeatmap(remaining) {
        if (displayMode === 'equal') {
            updateHeatmapEqual(remaining);
        } else {
            updateHeatmapExpectation(remaining);
        }
    }
    
    function updateHeatmapEqual(remaining) {
        const prob = remaining > 0 && !state.wishFound ? (1 / remaining * 100) : 0;
        const probText = prob > 0 ? prob.toFixed(1) + '%' : '';
        
        Array.from($grid.children).forEach((tile, idx) => {
            const overlay = tile.querySelector('.prob-overlay');
            tile.style.removeProperty('--heat-color');
            
            if (!state.opened.has(idx) && state.wishIndex !== idx && !state.wishFound) {
                overlay.textContent = probText;
            } else {
                overlay.textContent = '';
            }
        });
    }
    
    function updateHeatmapExpectation(remaining) {
        if (state.wishFound || remaining === 0) {
            updateHeatmapEqual(remaining);
            return;
        }
        
        // ===== 高度な期待値計算アルゴリズム =====
        // 数学的には全マス均等だが、心理的・戦略的観点から
        // 「残りやすいマス」を推定する
        
        const scores = [];
        const openedSet = state.opened;
        
        // 1. 開封済みマスの重心を計算
        let centroidRow = 0, centroidCol = 0, openCount = 0;
        for (let i = 0; i < TOTAL_TILES; i++) {
            if (openedSet.has(i)) {
                centroidRow += Math.floor(i / COLS);
                centroidCol += i % COLS;
                openCount++;
            }
        }
        if (openCount > 0) {
            centroidRow /= openCount;
            centroidCol /= openCount;
        } else {
            centroidRow = ROWS / 2;
            centroidCol = COLS / 2;
        }
        
        // 2. 未開封マスの連結成分（クラスター）を検出
        const visited = new Set();
        const clusters = [];
        
        function floodFill(startIdx) {
            const cluster = [];
            const stack = [startIdx];
            while (stack.length > 0) {
                const idx = stack.pop();
                if (visited.has(idx) || openedSet.has(idx)) continue;
                visited.add(idx);
                cluster.push(idx);
                
                const row = Math.floor(idx / COLS);
                const col = idx % COLS;
                // 4方向の隣接マス
                if (row > 0) stack.push((row-1) * COLS + col);
                if (row < ROWS-1) stack.push((row+1) * COLS + col);
                if (col > 0) stack.push(row * COLS + (col-1));
                if (col < COLS-1) stack.push(row * COLS + (col+1));
            }
            return cluster;
        }
        
        for (let i = 0; i < TOTAL_TILES; i++) {
            if (!visited.has(i) && !openedSet.has(i)) {
                const cluster = floodFill(i);
                if (cluster.length > 0) {
                    clusters.push(cluster);
                }
            }
        }
        
        // クラスターサイズマップを作成
        const clusterSizeMap = new Map();
        clusters.forEach(cluster => {
            cluster.forEach(idx => clusterSizeMap.set(idx, cluster.length));
        });
        
        // 3. 各マスのスコアを計算
        let minScore = Infinity, maxScore = -Infinity;
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const idx = row * COLS + col;
                
                if (openedSet.has(idx) || state.wishIndex === idx) {
                    scores[idx] = null;
                    continue;
                }
                
                let score = 0;
                
                // === スコア要素 ===
                
                // A. 孤立度（周囲8マスの開封率）- 重み: 30%
                let openedNeighbors = 0, totalNeighbors = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = row + dr, nc = col + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                            totalNeighbors++;
                            if (openedSet.has(nr * COLS + nc)) openedNeighbors++;
                        }
                    }
                }
                const isolationScore = totalNeighbors > 0 ? (openedNeighbors / totalNeighbors) : 0;
                score += isolationScore * 30;
                
                // B. クラスターサイズ（小さいほど高スコア）- 重み: 25%
                const clusterSize = clusterSizeMap.get(idx) || 1;
                const clusterScore = 1 - (clusterSize / remaining);
                score += clusterScore * 25;
                
                // C. 重心からの距離（遠いほど高スコア）- 重み: 15%
                const distFromCentroid = Math.sqrt(
                    Math.pow(row - centroidRow, 2) + 
                    Math.pow(col - centroidCol, 2)
                );
                const maxDist = Math.sqrt(Math.pow(ROWS, 2) + Math.pow(COLS, 2));
                const distScore = distFromCentroid / maxDist;
                score += distScore * 15;
                
                // D. エッジ・コーナーボーナス（端は残りやすい）- 重み: 15%
                const isCorner = (row === 0 || row === ROWS-1) && (col === 0 || col === COLS-1);
                const isEdge = row === 0 || row === ROWS-1 || col === 0 || col === COLS-1;
                let edgeScore = 0;
                if (isCorner) edgeScore = 1.0;
                else if (isEdge) edgeScore = 0.6;
                score += edgeScore * 15;
                
                // E. 局所密度（5x5エリアの開封率）- 重み: 15%
                let areaOpen = 0, areaTotal = 0;
                for (let dr = -2; dr <= 2; dr++) {
                    for (let dc = -2; dc <= 2; dc++) {
                        const nr = row + dr, nc = col + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                            areaTotal++;
                            if (openedSet.has(nr * COLS + nc)) areaOpen++;
                        }
                    }
                }
                const densityScore = areaTotal > 0 ? (areaOpen / areaTotal) : 0;
                score += densityScore * 15;
                
                scores[idx] = score;
                if (score < minScore) minScore = score;
                if (score > maxScore) maxScore = score;
            }
        }
        
        // スコアを正規化して確率に変換（ソフトマックス風）
        const range = maxScore - minScore || 1;
        let totalWeight = 0;
        const weights = [];
        
        for (let i = 0; i < TOTAL_TILES; i++) {
            if (scores[i] === null) {
                weights[i] = 0;
            } else {
                // スコアを指数関数で重み付け（差を強調）
                const normalized = (scores[i] - minScore) / range;
                const weight = Math.exp(normalized * 2); // 温度パラメータ=0.5
                weights[i] = weight;
                totalWeight += weight;
            }
        }
        
        // UIを更新
        Array.from($grid.children).forEach((tile, idx) => {
            const overlay = tile.querySelector('.prob-overlay');
            
            if (scores[idx] === null) {
                overlay.textContent = '';
                tile.style.removeProperty('--heat-color');
                return;
            }
            
            const prob = (weights[idx] / totalWeight) * 100;
            overlay.textContent = prob.toFixed(1) + '%';
            
            // ヒートマップカラー（緑→黄→赤のグラデーション）
            const heat = (scores[idx] - minScore) / range;
            let hue, sat, light;
            if (heat < 0.5) {
                // 緑→黄
                hue = 120 - heat * 120;
                sat = 50 + heat * 30;
                light = 40;
            } else {
                // 黄→赤
                hue = 60 - (heat - 0.5) * 120;
                sat = 65 + (heat - 0.5) * 35;
                light = 45;
            }
            tile.style.setProperty('--heat-color', `hsla(${hue}, ${sat}%, ${light}%, 0.4)`);
        });
    }
    
    function toggleDisplayMode() {
        const checkbox = document.getElementById('modeToggle');
        const labelEqual = document.getElementById('labelEqual');
        const labelExpect = document.getElementById('labelExpect');
        
        if (checkbox.checked) {
            displayMode = 'expectation';
            labelEqual.classList.remove('active');
            labelExpect.classList.add('active');
        } else {
            displayMode = 'equal';
            labelEqual.classList.add('active');
            labelExpect.classList.remove('active');
        }
        
        const remaining = TOTAL_TILES - state.opened.size;
        updateHeatmap(remaining);
    }
    
    function updateAdvice(draws, remaining) {
        let advice = '';
        
        if (state.wishFound) {
            advice = safeT('senachess.advice.wishFound');
        } else if (remaining === TOTAL_TILES) {
            advice = safeT('senachess.advice.allEqual');
        } else if (remaining <= 5) {
            advice = safeT('senachess.advice.almostThere', { prob: (1/remaining*100).toFixed(1) });
        } else if (remaining <= 20) {
            advice = safeT('senachess.advice.probRising', { prob: (1/remaining*100).toFixed(1) });
        } else if (draws >= 60 && draws < 80) {
            advice = safeT('senachess.advice.bonus60Achieved', { n: 80 - draws });
        } else if (draws >= 40) {
            advice = safeT('senachess.advice.halfway', { n: 60 - draws });
        } else {
            advice = safeT('senachess.advice.allEqual');
        }
        
        $adviceText.textContent = advice;
    }
    
    // ===== 効率アドバイス計算 =====
    function updateEfficiencyAdvice(draws, remaining) {
        const $daysLeft = document.getElementById('daysLeft');
        const $advice = document.getElementById('efficiencyAdvice');
        const $detail = document.getElementById('efficiencyDetail');
        
        if (!$daysLeft || !$advice || !$detail) return;
        
        // 期間データから現在の期間を取得して残り日数を自動計算
        let autoCalcDays = null;
        const $periodInfo = document.getElementById('periodInfo');
        
        if (periodData && periodData.periods) {
            const now = new Date();
            const currentPeriod = periodData.periods.find(p => {
                // ゲームのリセット時間はJST 9:00 (UTC+9)
                const start = new Date(p.startDate + 'T00:00:00+09:00');
                const end = new Date(p.endDate + 'T09:00:00+09:00');
                return now >= start && now < end;
            });
            if (currentPeriod) {
                const endDate = new Date(currentPeriod.endDate + 'T09:00:00+09:00');
                const diffMs = endDate.getTime() - now.getTime();
                // 残り日数は切り上げ（当日を含む）
                autoCalcDays = Math.max(1, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
                // 自動計算された値をinputに反映
                $daysLeft.value = autoCalcDays;
                // 期間情報を表示（ユーザーのローカル時間で終了日時を表示）
                if ($periodInfo) {
                    const localEndStr = endDate.toLocaleString(undefined, {
                        month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    });
                    $periodInfo.textContent = `${currentPeriod.startDate} 〜 ${localEndStr}`;
                }
            } else if ($periodInfo) {
                $periodInfo.textContent = '';
            }
        } else if ($periodInfo) {
            $periodInfo.textContent = '';
        }
        
        // ユーザーが入力した日数を取得（自動計算できなかった場合はデフォルト21）
        const daysLeft = Math.max(1, parseInt($daysLeft.value) || 21);
        
        if (remaining === 0 || state.wishFound) {
            $advice.textContent = safeT('senachess.efficiency.complete');
            $detail.innerHTML = '';
            return;
        }
        
        // 1日あたり何マス開ける必要があるか
        const tilesPerDay = Math.ceil(remaining / daysLeft);
        
        // 1日のコスト計算（1回目はゴールド）
        // 1回: 0ルビー, 2回: 50, 3回: 150, 4回: 300, 5回: 450...
        function dailyCost(n) {
            if (n <= 1) return 0;
            if (n === 2) return 50;
            if (n === 3) return 150;
            return 150 + (n - 3) * 150; // 4回以降は+150ずつ
        }
        
        const dailyRuby = dailyCost(tilesPerDay);
        const totalRuby = dailyRuby * daysLeft;
        
        // アドバイス生成
        let adviceText = '';
        let detailText = '';
        
        if (tilesPerDay <= 1) {
            adviceText = safeT('senachess.efficiency.goldOnly');
            detailText = safeT('senachess.efficiency.detailNoRuby', { remaining: remaining, days: daysLeft });
        } else if (tilesPerDay <= 3) {
            adviceText = safeT('senachess.efficiency.perDay', { n: tilesPerDay, ruby: dailyRuby.toLocaleString() });
            detailText = safeT('senachess.efficiency.detailCalc', { remaining: remaining, days: daysLeft, n: tilesPerDay, total: totalRuby.toLocaleString() });
        } else {
            adviceText = safeT('senachess.efficiency.perDayNeeded', { n: tilesPerDay, ruby: dailyRuby.toLocaleString() });
            detailText = safeT('senachess.efficiency.detailShort', { remaining: remaining, total: totalRuby.toLocaleString() });
        }
        
        // 全部ルビーで開けた場合との比較
        let allRubyCost = 0;
        for (let i = 1; i <= remaining; i++) {
            if (i === 1) allRubyCost += 50;
            else if (i === 2) allRubyCost += 100;
            else allRubyCost += 150;
        }
        
        if (tilesPerDay > 1 && totalRuby < allRubyCost) {
            const saved = allRubyCost - totalRuby;
            detailText += '<br>' + safeT('senachess.efficiency.saved', { saved: saved.toLocaleString() });
        }
        
        $advice.textContent = adviceText;
        $detail.innerHTML = detailText;
    }
    
    // ===== スクリーンショット解析 =====
    let pendingImage = null;
    let boardSelectPoints = [];
    let canvasScale = 1;
    
    function handleScreenshot(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(ev) {
            const img = new Image();
            img.onload = function() {
                showBoardSelectModal(img);
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
        
        // リセット（同じファイルを再選択可能に）
        e.target.value = '';
    }
    
    function showBoardSelectModal(img) {
        pendingImage = img;
        boardSelectPoints = [];
        
        const modal = document.getElementById('boardSelectModal');
        const canvas = document.getElementById('boardSelectCanvas');
        const overlay = document.getElementById('boardSelectOverlay');
        const confirmBtn = document.getElementById('boardSelectConfirm');
        const statusEl = document.getElementById('boardSelectStatus');
        
        // 画像をキャンバスに描画（画面に収まるようにスケール）
        const maxW = window.innerWidth * 0.9;
        const maxH = window.innerHeight * 0.7;
        canvasScale = Math.min(maxW / img.width, maxH / img.height, 1);
        
        canvas.width = img.width * canvasScale;
        canvas.height = img.height * canvasScale;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // オーバーレイのサイズをキャンバスに合わせる
        overlay.style.width = canvas.width + 'px';
        overlay.style.height = canvas.height + 'px';
        overlay.innerHTML = '';
        
        confirmBtn.disabled = true;
        statusEl.textContent = safeT('senachess.selectPoint1') || '① ボードの左上をクリック';
        
        modal.style.display = 'flex';
        
        // クリックイベント
        canvas.onclick = function(e) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / canvasScale;
            const y = (e.clientY - rect.top) / canvasScale;
            
            if (boardSelectPoints.length < 2) {
                boardSelectPoints.push({ x, y });
                addMarker(overlay, e.clientX - rect.left, e.clientY - rect.top);
                
                if (boardSelectPoints.length === 1) {
                    statusEl.textContent = safeT('senachess.selectPoint2') || '② ボードの右下をクリック';
                } else if (boardSelectPoints.length === 2) {
                    // 選択範囲を描画
                    drawSelectionRect(overlay);
                    confirmBtn.disabled = false;
                    statusEl.textContent = safeT('senachess.selectionComplete') || '選択完了！解析ボタンを押してください';
                }
            }
        };
    }
    
    function addMarker(overlay, x, y) {
        const marker = document.createElement('div');
        marker.className = 'board-select-marker';
        marker.style.left = x + 'px';
        marker.style.top = y + 'px';
        overlay.appendChild(marker);
    }
    
    function drawSelectionRect(overlay) {
        const p1 = boardSelectPoints[0];
        const p2 = boardSelectPoints[1];
        
        const left = Math.min(p1.x, p2.x) * canvasScale;
        const top = Math.min(p1.y, p2.y) * canvasScale;
        const width = Math.abs(p2.x - p1.x) * canvasScale;
        const height = Math.abs(p2.y - p1.y) * canvasScale;
        
        const rect = document.createElement('div');
        rect.className = 'board-select-rect';
        rect.style.left = left + 'px';
        rect.style.top = top + 'px';
        rect.style.width = width + 'px';
        rect.style.height = height + 'px';
        overlay.appendChild(rect);
    }
    
    function closeBoardSelectModal() {
        const modal = document.getElementById('boardSelectModal');
        modal.style.display = 'none';
        pendingImage = null;
        boardSelectPoints = [];
    }
    
    function confirmBoardSelection() {
        if (!pendingImage || boardSelectPoints.length !== 2) return;
        
        const p1 = boardSelectPoints[0];
        const p2 = boardSelectPoints[1];
        
        const boardRect = {
            x: Math.min(p1.x, p2.x),
            y: Math.min(p1.y, p2.y),
            w: Math.abs(p2.x - p1.x),
            h: Math.abs(p2.y - p1.y)
        };
        
        // pendingImageを保存してからモーダルを閉じる
        const img = pendingImage;
        closeBoardSelectModal();
        analyzeWithBoardRect(img, boardRect);
    }
    
    function analyzeWithBoardRect(img, boardRect) {
        const canvas = document.getElementById('analysisCanvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        console.log('Image:', img.width, 'x', img.height);
        console.log('User selected board:', boardRect);
        
        const tileW = boardRect.w / COLS;
        const tileH = boardRect.h / ROWS;
        
        console.log('Tile:', tileW.toFixed(1), 'x', tileH.toFixed(1));
        
        const closedTiles = new Set();
        
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const idx = row * COLS + col;
                const isWhiteTile = (row + col) % 2 === 0;
                
                // マスの左上座標
                const tileX = boardRect.x + col * tileW;
                const tileY = boardRect.y + row * tileH;
                
                // マスの4つの角をサンプリング（キャラアイコンを避ける）
                const cornerOffset = 0.12;
                const cornerSamples = [
                    getPixel(ctx, tileX + tileW * cornerOffset, tileY + tileH * cornerOffset),
                    getPixel(ctx, tileX + tileW * (1 - cornerOffset), tileY + tileH * cornerOffset),
                    getPixel(ctx, tileX + tileW * cornerOffset, tileY + tileH * (1 - cornerOffset)),
                    getPixel(ctx, tileX + tileW * (1 - cornerOffset), tileY + tileH * (1 - cornerOffset))
                ];
                
                const cornerAvg = averageColor(cornerSamples);
                const brightness = getBrightness(cornerAvg);
                
                let isClosed = false;
                
                if (isWhiteTile) {
                    // 白マス（未開封）: クリーム/ベージュ色
                    // RGB(213,207,189)など、明るい暖色系
                    const isCreamy = 
                        brightness >= 150 &&
                        cornerAvg.r >= 170 &&
                        cornerAvg.r >= cornerAvg.g - 5 &&
                        cornerAvg.g >= cornerAvg.b - 5 &&
                        (cornerAvg.r - cornerAvg.b) >= 15;
                    
                    isClosed = isCreamy;
                } else {
                    // 赤マス（未開封）: ワインレッド
                    const isWineRed = 
                        cornerAvg.r >= 100 &&
                        cornerAvg.r >= cornerAvg.g * 1.5 &&
                        cornerAvg.r >= cornerAvg.b * 1.5 &&
                        Math.abs(cornerAvg.g - cornerAvg.b) <= 25;
                    
                    isClosed = isWineRed;
                }
                
                if (isClosed) {
                    closedTiles.add(idx);
                }
                
                // デバッグ
                if (idx < 10 || idx >= 70) {
                    console.log(`Tile ${idx} (${isWhiteTile ? 'W' : 'R'}): RGB(${cornerAvg.r.toFixed(0)},${cornerAvg.g.toFixed(0)},${cornerAvg.b.toFixed(0)}) -> ${isClosed ? 'CLOSED' : 'OPEN'}`);
                }
            }
        }
        
        console.log('Closed tiles:', Array.from(closedTiles).join(','));
        
        // 開封済み = 全マス - 未開封
        const openedTiles = new Set();
        for (let i = 0; i < TOTAL_TILES; i++) {
            if (!closedTiles.has(i)) {
                openedTiles.add(i);
            }
        }
        
        // 状態を更新
        state.opened = openedTiles;
        state.wishIndex = null;
        state.wishFound = false;
        
        // UIを更新
        Array.from($grid.children).forEach((tile, idx) => {
            tile.classList.remove('opened', 'wish');
            if (openedTiles.has(idx)) {
                tile.classList.add('opened');
            }
        });
        
        saveState();
        updateStats();
        
        alert(safeT('senachess.analyzeComplete', { opened: openedTiles.size, closed: closedTiles.size }) || 
              `解析完了！\n開封済み: ${openedTiles.size}マス\n未開封: ${closedTiles.size}マス\n\n※ 誤検出はマスをクリックして修正できます。`);
    }
    
    function getPixel(ctx, x, y) {
        const data = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        return { r: data[0], g: data[1], b: data[2] };
    }
    
    function averageColor(samples) {
        const sum = samples.reduce((acc, c) => ({
            r: acc.r + c.r,
            g: acc.g + c.g,
            b: acc.b + c.b
        }), { r: 0, g: 0, b: 0 });
        return {
            r: sum.r / samples.length,
            g: sum.g / samples.length,
            b: sum.b / samples.length
        };
    }
    
    function getSaturation(color) {
        const max = Math.max(color.r, color.g, color.b);
        const min = Math.min(color.r, color.g, color.b);
        if (max === 0) return 0;
        return (max - min) / max * 100;
    }
    
    function getBrightness(color) {
        return (color.r + color.g + color.b) / 3;
    }
    
    // ===== ローカルストレージ =====
    function getCurrentPeriodId() {
        if (!periodData || !periodData.periods) return null;
        const now = new Date();
        const currentPeriod = periodData.periods.find(p => {
            const start = new Date(p.startDate + 'T00:00:00+09:00');
            const end = new Date(p.endDate + 'T09:00:00+09:00');
            return now >= start && now < end;
        });
        return currentPeriod ? currentPeriod.tid : null;
    }
    
    function saveState() {
        try {
            const currentTid = getCurrentPeriodId();
            const data = {
                opened: Array.from(state.opened),
                wishIndex: state.wishIndex,
                savedAt: new Date().toISOString(),
                periodTid: currentTid
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('保存失敗:', e);
        }
    }
    
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return;
            
            const data = JSON.parse(saved);
            const currentTid = getCurrentPeriodId();
            
            // 期間が変わったらリセット
            if (currentTid !== null && data.periodTid !== currentTid) {
                localStorage.removeItem(STORAGE_KEY);
                console.log('新しい期間のためデータリセット');
                return;
            }
            
            // 日次リセットチェック（JST 9時 = UTC 0時）
            const savedDate = new Date(data.savedAt);
            const now = new Date();
            if (shouldReset(savedDate, now)) {
                // 日次リセットでも期間内なら開封済みは保持、ウィッシュのみリセットしない
                // セナチェスは期間中データを保持する仕様
            }
            
            state.opened = new Set(data.opened || []);
            state.wishIndex = data.wishIndex;
            state.wishFound = data.wishIndex !== null;
            
            // UI復元
            Array.from($grid.children).forEach((tile, idx) => {
                if (state.opened.has(idx)) {
                    tile.classList.add('opened');
                }
                if (state.wishIndex === idx) {
                    tile.classList.remove('opened');
                    tile.classList.add('wish');
                }
            });
        } catch (e) {
            console.warn('復元失敗:', e);
        }
    }
    
    function shouldReset(savedDate, now) {
        // 期間ベースリセットに移行したため、日次リセットは無効化
        return false;
    }
    
})();
