/**
 * 神経衰弱 攻略ツール - memory.js (v3)
 *
 * v3 変更点:
 *   - requestVideoFrameCallback で超低遅延 (フレーム到着同期)
 *   - dirty flag 方式オーバーレイ (状態変化時のみ再描画)
 *   - 導線最適化ペア順序 (TSP Nearest-Neighbor)
 *     前ペアの相方 → 次ペアの1枚目 の移動距離を最小化
 */
(function () {
    'use strict';

    /* ====== 定数 ====== */
    const ROWS = 3, COLS = 8, TOTAL = 24;
    const S = { FACE_DOWN: 0, FACE_UP: 1 };
    const BACK_IMG = 'images/MiniGame/MemoryGame/Atl_UI_SummonCard_01_Sprite_03.webp';
    const DESC_ROWS = 4, DESC_COLS = 6;

    /* ====== グローバル状態 ====== */
    let refImg = null;
    let refDesc = null;
    let refAspect = 1.39;

    let grid = null;
    let cards = [];
    let baselines = [];
    let baselineSet = false;

    // PC
    let stream = null;
    let loopRunning = false;
    let detectAttempts = 0;
    let pairMap = new Array(TOTAL).fill(0);
    let lastAnalysisTime = 0;

    // オフスクリーン
    let offCanvas = null, offCtx = null;

    // Mobile
    let mobCalibPts = [];

    // 設定
    let cfg = {
        fps: 20,
        changeThresh: 20,
        stabilityThresh: 8,
        stableNeeded: 1
    };

    // DOM cache
    let $ = {};

    /* ====== 初期化 ====== */
    document.addEventListener('DOMContentLoaded', () => {
        cacheDom();
        loadRef();
        initSettings();
        buildGrid($.resGrid);
        buildGrid($.mobGrid);
        resetCards();
        bind();
    });

    function cacheDom() {
        $ = {
            tabPC: el('tabPC'), tabMob: el('tabMobile'),
            panelPC: el('panelPC'), panelMob: el('panelMobile'),
            video: el('captureVideo'), canvas: el('captureOverlay'),
            placeholder: el('capturePlaceholder'),
            btnStart: el('btnStartCapture'), btnStop: el('btnStopCapture'),
            calibBar: el('calibrationBar'), calibStat: el('calibrationStatus'),
            btnAutoDetect: el('btnAutoDetect'), btnManualCalib: el('btnManualCalibrate'),
            resGrid: el('resultGrid'), detCount: el('detectionCount'),
            btnReset: el('btnResetGrid'),
            matchHelper: el('matchHelper'),
            fileInput: el('videoFileInput'), uploadInfo: el('uploadInfo'),
            fileName: el('uploadFileName'), fileSize: el('uploadFileSize'),
            stepUpload: el('stepUpload'), stepCalib: el('stepCalibrate'),
            stepAnalyze: el('stepAnalyze'), stepResult: el('stepResult'),
            calibCanvas: el('calibrateCanvas'), calibWrapper: el('calibrateWrapper'),
            calibMarkers: el('calibrateMarkers'),
            btnResetCalib: el('btnResetCalibrate'), btnConfirmCalib: el('btnConfirmCalibrate'),
            analyzeProgress: el('analyzeProgress'), analyzeProgressText: el('analyzeProgressText'),
            analyzeDetected: el('analyzeDetected'), analyzeFrames: el('analyzeFrames'),
            mobGrid: el('mobileResultGrid'),
            btnPiP: el('btnStartPiP'), btnMobReset: el('btnMobileReset'),
            hiddenVideo: el('hiddenVideo'), analysisCanvas: el('analysisCanvas'),
            pipCanvas: el('pipCanvas'), pipVideo: el('pipVideo'),
            modal: el('manualCalibModal'), modalCanvas: el('manualCalibCanvas'),
            btnCloseModal: el('btnCloseCalibModal'),
            btnCalibReset: el('btnCalibReset'), btnCalibApply: el('btnCalibApply'),
            calibCorner1: el('calibCorner1'), calibCorner2: el('calibCorner2'),
            settingFPS: el('settingFPS'), settingThresh: el('settingThreshold'),
            threshVal: el('thresholdValue'), settingStableTime: el('settingStableTime'),
            seekBar: el('videoSeekBar'), seekTime: el('videoSeekTime'),
        };
    }

    function el(id) { return document.getElementById(id); }

    /* ====== 裏面画像読み込み ====== */
    function loadRef() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            refImg = img;
            refAspect = img.height / img.width;
            const c = document.createElement('canvas');
            c.width = img.width; c.height = img.height;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
            refDesc = computeDesc(ctx.getImageData(0, 0, c.width, c.height).data, c.width, 0, 0, c.width, c.height);
        };
        img.src = BACK_IMG;
    }

    /* ====== 記述子 (4×6ブロック平均色 = 72値) ====== */
    function computeDesc(data, imgW, rx, ry, rw, rh) {
        const desc = new Float32Array(DESC_ROWS * DESC_COLS * 3);
        const bw = rw / DESC_COLS, bh = rh / DESC_ROWS;
        let idx = 0;
        for (let br = 0; br < DESC_ROWS; br++) {
            for (let bc = 0; bc < DESC_COLS; bc++) {
                let rr = 0, gg = 0, bb = 0, cnt = 0;
                const x0 = Math.round(rx + bc * bw), x1 = Math.round(rx + (bc + 1) * bw);
                const y0 = Math.round(ry + br * bh), y1 = Math.round(ry + (br + 1) * bh);
                for (let y = y0; y < y1; y++) {
                    for (let x = x0; x < x1; x++) {
                        const p = (y * imgW + x) * 4;
                        rr += data[p]; gg += data[p + 1]; bb += data[p + 2];
                        cnt++;
                    }
                }
                if (cnt) { desc[idx++] = rr / cnt; desc[idx++] = gg / cnt; desc[idx++] = bb / cnt; }
                else idx += 3;
            }
        }
        return desc;
    }

    function descRMSE(a, b) {
        if (!a || !b || a.length !== b.length) return Infinity;
        let sum = 0;
        for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; sum += d * d; }
        return Math.sqrt(sum / a.length);
    }

    function descDist(a, b) { return descRMSE(a, b); }

    /* ====== 設定 ====== */
    function initSettings() {
        if (!$.settingFPS) return;
        $.settingFPS.addEventListener('change', () => { cfg.fps = +$.settingFPS.value; });
        $.settingThresh.addEventListener('input', () => {
            cfg.changeThresh = +$.settingThresh.value;
            $.threshVal.textContent = $.settingThresh.value;
        });
        $.settingStableTime.addEventListener('change', () => {
            const ms = +$.settingStableTime.value;
            cfg.stableNeeded = Math.max(1, Math.round(ms / (1000 / cfg.fps)));
        });
    }

    /* ====== イベントバインド ====== */
    function bind() {
        $.tabPC.addEventListener('click', () => switchTab('pc'));
        $.tabMob.addEventListener('click', () => switchTab('mobile'));
        $.btnStart.addEventListener('click', startCapture);
        $.btnStop.addEventListener('click', stopCapture);
        if ($.btnAutoDetect) $.btnAutoDetect.addEventListener('click', () => {
            grid = null; detectAttempts = 0; resetCards();
            $.calibStat.textContent = '⏳ 再検出中...'; $.calibStat.classList.remove('detected');
        });
        if ($.btnManualCalib) $.btnManualCalib.addEventListener('click', openModal);
        if ($.btnReset) $.btnReset.addEventListener('click', fullReset);
        [$.resGrid, $.mobGrid].forEach(g => {
            if (!g) return;
            g.addEventListener('click', e => {
                const card = e.target.closest('.memory-card');
                if (card) onCardClick(+card.dataset.idx);
            });
        });
        if ($.fileInput) $.fileInput.addEventListener('change', onFileSelect);
        if ($.btnResetCalib) $.btnResetCalib.addEventListener('click', () => { mobCalibPts = []; updateCalibUI(); });
        if ($.btnConfirmCalib) $.btnConfirmCalib.addEventListener('click', startMobileAnalysis);
        if ($.btnPiP) $.btnPiP.addEventListener('click', startPiP);
        if ($.btnMobReset) $.btnMobReset.addEventListener('click', mobileReset);
        if ($.btnCloseModal) $.btnCloseModal.addEventListener('click', closeModal);
        if ($.btnCalibReset) $.btnCalibReset.addEventListener('click', () => { modalCorners = []; updateModalUI(); });
        if ($.btnCalibApply) $.btnCalibApply.addEventListener('click', applyManualCalib);
    }

    function switchTab(mode) {
        const isPC = mode === 'pc';
        $.tabPC.classList.toggle('active', isPC);
        $.tabMob.classList.toggle('active', !isPC);
        $.panelPC.classList.toggle('active', isPC);
        $.panelMob.classList.toggle('active', !isPC);
    }

    /* ====== テンプレートマッチング (NCC) ====== */
    function autoDetectGrid(canvas) {
        if (!refImg || !refDesc) {
            console.warn('[Memory] refImg/refDesc not loaded');
            return null;
        }
        const W = 480;
        const scale = W / canvas.width;
        const H = Math.round(canvas.height * scale);
        const tmp = document.createElement('canvas');
        tmp.width = W; tmp.height = H;
        const tctx = tmp.getContext('2d', { willReadFrequently: true });
        tctx.drawImage(canvas, 0, 0, W, H);
        const imgData = tctx.getImageData(0, 0, W, H).data;

        // --- Step 1: NCC全探索で最もマッチするカード1枚を発見 ---
        const sizes = [40, 35, 45, 30, 50];
        let bestNCC = 0, bestX = 0, bestY = 0, bestCW = 40;

        for (const cw of sizes) {
            const ch = Math.round(cw * refAspect);
            if (ch > H / 2 || cw > W / 2) continue;
            const step = Math.max(2, Math.round(cw / 6));
            for (let y = 0; y <= H - ch; y += step) {
                for (let x = 0; x <= W - cw; x += step) {
                    const d = computeDesc(imgData, W, x, y, cw, ch);
                    const ncc = nccScore(refDesc, d);
                    if (ncc > bestNCC) {
                        bestNCC = ncc; bestX = x; bestY = y; bestCW = cw;
                    }
                }
            }
            if (bestNCC > 0.7) break;
        }

        console.log('[Memory] Step1: bestNCC=' + bestNCC.toFixed(3) +
            ' pos=(' + bestX + ',' + bestY + ') cw=' + bestCW +
            ' refAspect=' + refAspect.toFixed(3) + ' W=' + W + ' H=' + H);

        if (bestNCC < 0.3) return null;

        const cardW = bestCW;
        const cardH = Math.round(cardW * refAspect);

        // --- Step 2: 隣接カードの実測でセル間隔を決定 ---
        // bestX,bestYから右方向に1px刻みでNCCピークを探す → 隣カードとの距離 = cellW
        let cellW = cardW * 1.15;   // フォールバック
        let cellH = cardH * 1.15;
        const nccTh = 0.35;

        // 水平: bestX + cardW*1.01 ~ cardW*1.6 の範囲で右隣カードを探す
        let peakNCCw = nccTh, peakDw = Math.round(cardW * 1.15);
        for (let d = Math.round(cardW * 1.01); d <= Math.round(cardW * 1.6); d++) {
            const rx = bestX + d;
            if (rx + cardW > W) break;
            const desc = computeDesc(imgData, W, rx, bestY, cardW, cardH);
            const ncc = nccScore(refDesc, desc);
            if (ncc > peakNCCw) { peakNCCw = ncc; peakDw = d; }
            // 左方向も試す
            const lx = bestX - d;
            if (lx >= 0) {
                const descL = computeDesc(imgData, W, lx, bestY, cardW, cardH);
                const nccL = nccScore(refDesc, descL);
                if (nccL > peakNCCw) { peakNCCw = nccL; peakDw = d; }
            }
        }
        cellW = peakDw;

        // 垂直: 同様に下隣カードを探す
        let peakNCCh = nccTh, peakDh = Math.round(cardH * 1.15);
        for (let d = Math.round(cardH * 1.01); d <= Math.round(cardH * 1.6); d++) {
            const dy2 = bestY + d;
            if (dy2 + cardH > H) break;
            const desc = computeDesc(imgData, W, bestX, dy2, cardW, cardH);
            const ncc = nccScore(refDesc, desc);
            if (ncc > peakNCCh) { peakNCCh = ncc; peakDh = d; }
            const uy = bestY - d;
            if (uy >= 0) {
                const descU = computeDesc(imgData, W, bestX, uy, cardW, cardH);
                const nccU = nccScore(refDesc, descU);
                if (nccU > peakNCCh) { peakNCCh = nccU; peakDh = d; }
            }
        }
        cellH = peakDh;

        console.log('[Memory] Step2: cellW=' + cellW + '(NCC=' + peakNCCw.toFixed(3) +
            ') cellH=' + cellH + '(NCC=' + peakNCCh.toFixed(3) + ')' +
            ' ratio_w=' + (cellW / cardW).toFixed(3) + ' ratio_h=' + (cellH / cardH).toFixed(3));

        // --- Step 3: 見つかったカードがグリッド内の何番目かを特定 ---
        // 全(row,col)パターンを試し、4隅セルのNCC合計が最大の原点を採用
        let bestOX = bestX, bestOY = bestY, bestScore = -1, bestRC = '?';

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const ox = bestX - col * cellW;
                const oy = bestY - row * cellH;

                // グリッドが画面内に収まるか
                if (ox < -cardW * 0.5 || oy < -cardH * 0.5) continue;
                const lastX = ox + (COLS - 1) * cellW + cardW;
                const lastY = oy + (ROWS - 1) * cellH + cardH;
                if (lastX > W + cardW * 0.5 || lastY > H + cardH * 0.5) continue;

                // 4隅 + 中央2枚のNCCを検証
                let score = 0, cnt = 0;
                const checks = [[0, 0], [0, COLS - 1], [ROWS - 1, 0], [ROWS - 1, COLS - 1], [1, 3], [1, 4]];
                for (const [r, c] of checks) {
                    const cx = Math.round(ox + c * cellW);
                    const cy = Math.round(oy + r * cellH);
                    if (cx < 0 || cy < 0 || cx + cardW > W || cy + cardH > H) { score -= 0.5; cnt++; continue; }
                    const d = computeDesc(imgData, W, cx, cy, cardW, cardH);
                    score += nccScore(refDesc, d);
                    cnt++;
                }
                if (cnt < 4) continue;
                const avg = score / cnt;
                if (avg > bestScore) {
                    bestScore = avg; bestOX = ox; bestOY = oy;
                    bestRC = 'r' + row + 'c' + col;
                }
            }
        }

        console.log('[Memory] Step3: bestOrigin=(' + bestOX.toFixed(1) + ',' + bestOY.toFixed(1) +
            ') score=' + bestScore.toFixed(3) + ' found_at=' + bestRC +
            ' cellW=' + cellW.toFixed(1) + ' cellH=' + cellH.toFixed(1));

        if (bestScore < 0.15) return null;

        // 原点 = 左上カード左上 → セルグリッド左上角に変換
        const gx = bestOX - (cellW - cardW) / 2;
        const gy = bestOY - (cellH - cardH) / 2;

        return {
            x: gx / scale, y: gy / scale,
            cellW: cellW / scale, cellH: cellH / scale,
            cardW: cardW / scale, cardH: cardH / scale
        };
    }

    function nccScore(a, b) {
        if (!a || !b || a.length !== b.length) return 0;
        let ma = 0, mb = 0;
        for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; }
        ma /= a.length; mb /= b.length;
        let num = 0, da = 0, db = 0;
        for (let i = 0; i < a.length; i++) {
            const va = a[i] - ma, vb = b[i] - mb;
            num += va * vb; da += va * va; db += vb * vb;
        }
        const denom = Math.sqrt(da * db);
        return denom > 0 ? num / denom : 0;
    }

    /* ====== カード記述子 & ベースライン ====== */
    function getCardDesc(data, imgW, g, row, col) {
        const cx = g.x + col * g.cellW + (g.cellW - g.cardW) / 2;
        const cy = g.y + row * g.cellH + (g.cellH - g.cardH) / 2;
        if (cx < 0 || cy < 0 || cx + g.cardW > imgW) return null;
        return computeDesc(data, imgW, cx, cy, g.cardW, g.cardH);
    }

    function captureBaselines(data, imgW, g) {
        baselines = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                baselines.push(getCardDesc(data, imgW, g, r, c));
            }
        }
        baselineSet = true;
    }

    function resetCards() {
        cards = [];
        baselines = [];
        baselineSet = false;
        pairMap.fill(0);
        for (let i = 0; i < TOTAL; i++) {
            cards.push({ state: S.FACE_DOWN, faceURL: null, desc: null, prevDesc: null, stableCount: 0 });
        }
    }

    /* ====== グリッドUI構築 ====== */
    function buildGrid(container) {
        if (!container) return;
        container.innerHTML = '';
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const idx = r * COLS + c;
                const div = document.createElement('div');
                div.className = 'memory-card';
                div.dataset.idx = idx;
                const back = document.createElement('img');
                back.className = 'card-back'; back.src = BACK_IMG; back.alt = '裏'; back.draggable = false;
                const face = document.createElement('img');
                face.className = 'card-face'; face.alt = '表'; face.draggable = false;
                div.appendChild(back); div.appendChild(face);
                const label = document.createElement('span');
                label.className = 'card-label';
                label.textContent = `${r + 1}-${c + 1}`;
                div.appendChild(label);
                container.appendChild(div);
            }
        }
    }

    /* ====== PC: キャプチャ開始/停止 ====== */
    async function startCapture() {
        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: 'never', frameRate: { ideal: 30 } },
                audio: false
            });
        } catch { return; }

        $.video.srcObject = stream;
        $.video.style.display = 'block';
        $.canvas.style.display = 'block';
        $.placeholder.style.display = 'none';
        $.calibBar.style.display = 'flex';
        $.btnStart.disabled = true;
        $.btnStop.disabled = false;

        fullReset();
        stream.getVideoTracks()[0].addEventListener('ended', stopCapture);
        $.video.addEventListener('loadedmetadata', () => startLoop(), { once: true });
    }

    function stopCapture() {
        stopLoop();
        if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
        $.video.style.display = 'none';
        $.canvas.style.display = 'none';
        $.placeholder.style.display = 'flex';
        $.calibBar.style.display = 'none';
        $.btnStart.disabled = false;
        $.btnStop.disabled = true;
        offCanvas = null; offCtx = null;
    }

    /* ====== 超低遅延ループ ======
     *
     * ● requestVideoFrameCallback (RVFC)
     *   ブラウザが新しいビデオフレームをデコードした瞬間にコールバック
     *   → 不要なdrawImageを完全に排除、フレーム到着と解析が同期
     *
     * ● オーバーレイ毎フレーム描画
     *   rAF ループで毎フレームoverlayを再描画 (軽量処理)
     *   → ジオメトリ変更に即座追従、知覚不可能な遅延
     */
    function startLoop() {
        stopLoop();
        loopRunning = true;
        lastAnalysisTime = 0;
        scheduleAnalysis();
        requestAnimationFrame(overlayTick);
    }

    function stopLoop() { loopRunning = false; }

    function scheduleAnalysis() {
        if (!loopRunning) return;
        if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
            $.video.requestVideoFrameCallback(onVideoFrame);
        } else {
            requestAnimationFrame(fallbackTick);
        }
    }

    // RVFC: 新フレーム到着ごとに呼ばれる (GPU同期済み、drawImage最速)
    function onVideoFrame(now, _metadata) {
        if (!loopRunning) return;
        $.video.requestVideoFrameCallback(onVideoFrame);
        const interval = 1000 / cfg.fps;
        if (now - lastAnalysisTime < interval) return;
        lastAnalysisTime = now;
        analyzeFrame();
    }

    // フォールバック (RVFC非対応ブラウザ用)
    function fallbackTick(ts) {
        if (!loopRunning) return;
        requestAnimationFrame(fallbackTick);
        const interval = 1000 / cfg.fps;
        if (ts - lastAnalysisTime < interval) return;
        lastAnalysisTime = ts;
        analyzeFrame();
    }

    // オーバーレイ描画ループ: 毎フレーム再描画 (グリッド線+番号のみの軽量処理)
    function overlayTick() {
        if (!loopRunning) return;
        requestAnimationFrame(overlayTick);
        drawOverlay();
    }

    /* ====== video表示領域 (object-fit:contain) ====== */
    function getVideoRect() {
        const v = $.video;
        const vw = v.videoWidth, vh = v.videoHeight;
        const ew = v.clientWidth, eh = v.clientHeight;
        if (!vw || !vh || !ew || !eh) return null;
        const va = vw / vh, ea = ew / eh;
        let rw, rh, ox, oy;
        if (va > ea) { rw = ew; rh = ew / va; ox = 0; oy = (eh - rh) / 2; }
        else { rh = eh; rw = eh * va; ox = (ew - rw) / 2; oy = 0; }
        return { ox, oy, rw, rh, sx: rw / vw, sy: rh / vh };
    }

    /* ====== 解析処理本体 ====== */
    function analyzeFrame() {
        const v = $.video;
        if (!v || v.readyState < 2) return;
        const vw = v.videoWidth, vh = v.videoHeight;
        if (!vw || !vh) return;

        if (!offCanvas || offCanvas.width !== vw || offCanvas.height !== vh) {
            offCanvas = document.createElement('canvas');
            offCanvas.width = vw; offCanvas.height = vh;
            offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
        }
        offCtx.drawImage(v, 0, 0, vw, vh);

        /* Step 1: グリッド未検出 */
        if (!grid) {
            detectAttempts++;
            if (detectAttempts % 5 === 1) {
                grid = autoDetectGrid(offCanvas);
                if (grid) {
                    $.calibStat.textContent = '✅ カード位置を検出 → ベースライン取得中...';
                    $.calibStat.classList.add('detected');
                    resetCards();
                } else if (detectAttempts > 60) {
                    $.calibStat.textContent = '⚠️ 自動検出失敗 - 「手動調整」をお試しください';
                } else {
                    $.calibStat.textContent = `⏳ カード位置を検出中... (${detectAttempts})`;
                }
            }
            if (!grid) return;
        }

        const imgData = offCtx.getImageData(0, 0, vw, vh);

        /* Step 2: ベースライン取得 */
        if (!baselineSet) {
            captureBaselines(imgData.data, vw, grid);
            $.calibStat.textContent = '✅ ベースライン取得完了 - カードをめくると検出されます';
            return;
        }

        /* Step 3: 各カード比較 */
        let stateChanged = false;
        for (let r = 0; r < ROWS; r++) {
            for (let c2 = 0; c2 < COLS; c2++) {
                const idx = r * COLS + c2;
                if (cards[idx].state === S.FACE_UP) continue;
                const desc = getCardDesc(imgData.data, vw, grid, r, c2);
                if (!desc) continue;
                const bl = baselines[idx];
                if (!bl) continue;
                const change = descRMSE(bl, desc);
                const isChanged = change > cfg.changeThresh;
                const card = cards[idx];
                const frameDiff = card.prevDesc ? descRMSE(card.prevDesc, desc) : Infinity;
                const isStable = frameDiff < cfg.stabilityThresh;
                card.prevDesc = desc;
                if (!isChanged) { card.stableCount = 0; continue; }
                if (isStable) {
                    card.stableCount++;
                    if (card.stableCount >= cfg.stableNeeded) {
                        const cx = grid.x + c2 * grid.cellW + (grid.cellW - grid.cardW) / 2;
                        const cy = grid.y + r * grid.cellH + (grid.cellH - grid.cardH) / 2;
                        captureFace(idx, offCtx, cx, cy, grid.cardW, grid.cardH);
                        stateChanged = true;
                    }
                } else {
                    card.stableCount = 0;
                }
            }
        }

        updateDetectionUI();
    }

    /* ====== 表面キャプチャ ====== */
    function captureFace(idx, srcCtx, cx, cy, cw, ch) {
        const fc = document.createElement('canvas');
        const w = Math.round(cw), h = Math.round(ch);
        fc.width = w; fc.height = h;
        const fctx = fc.getContext('2d');
        fctx.drawImage(srcCtx.canvas, Math.round(cx), Math.round(cy), w, h, 0, 0, w, h);
        cards[idx].state = S.FACE_UP;
        cards[idx].faceURL = fc.toDataURL('image/png');
        cards[idx].desc = computeDesc(fctx.getImageData(0, 0, w, h).data, w, 0, 0, w, h);
        updateCardUI(idx, $.resGrid);
        updateCardUI(idx, $.mobGrid);
        console.log(`[Memory] Card ${Math.floor(idx / COLS) + 1}-${(idx % COLS) + 1} captured!`);
        // 検出2枚以上でペア + 導線最適化を更新
        const detCnt = cards.filter(c => c.state === S.FACE_UP).length;
        if (detCnt >= 2) computePairGuide();
    }

    /* ====== オーバーレイ描画 ====== */
    function drawOverlay() {
        if (!grid) return;
        const vr = getVideoRect();
        if (!vr) return;
        const c = $.canvas;
        const dpr = window.devicePixelRatio || 1;
        const cw = $.video.clientWidth, ch = $.video.clientHeight;
        if (c.width !== cw * dpr || c.height !== ch * dpr) {
            c.width = cw * dpr; c.height = ch * dpr;
        }
        const ctx = c.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, cw, ch);
        const tx = vx => vr.ox + vx * vr.sx;
        const ty = vy => vr.oy + vy * vr.sy;
        const tw = w => w * vr.sx;
        const th = h => h * vr.sy;
        const gx = tx(grid.x), gy = ty(grid.y);
        const gw = tw(grid.cellW * COLS), gh = th(grid.cellH * ROWS);
        // 外枠
        ctx.strokeStyle = 'rgba(255,215,0,0.6)'; ctx.lineWidth = 2;
        ctx.strokeRect(gx, gy, gw, gh);
        // 罫線
        ctx.strokeStyle = 'rgba(255,215,0,0.25)'; ctx.lineWidth = 1;
        for (let r = 1; r < ROWS; r++) {
            const y = ty(grid.y + r * grid.cellH);
            ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx + gw, y); ctx.stroke();
        }
        for (let c2 = 1; c2 < COLS; c2++) {
            const x = tx(grid.x + c2 * grid.cellW);
            ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + gh); ctx.stroke();
        }
        // カード状態 + ペア番号
        const cellW = tw(grid.cellW), cellH = th(grid.cellH);
        for (let r = 0; r < ROWS; r++) {
            for (let cc = 0; cc < COLS; cc++) {
                const idx = r * COLS + cc;
                const cx = tx(grid.x + cc * grid.cellW);
                const cy = ty(grid.y + r * grid.cellH);
                if (cards[idx].state === S.FACE_UP) {
                    ctx.fillStyle = 'rgba(76,175,80,0.25)';
                    ctx.fillRect(cx + 2, cy + 2, cellW - 4, cellH - 4);
                }
                if (pairMap[idx] > 0) {
                    const num = String(pairMap[idx]);
                    const fs = Math.max(14, Math.min(cellW, cellH) * 0.38);
                    ctx.font = `bold ${fs}px sans-serif`;
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    const nx = cx + cellW / 2, ny = cy + cellH / 2;
                    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
                    ctx.lineWidth = Math.max(3, fs * 0.12);
                    ctx.lineJoin = 'round';
                    ctx.strokeText(num, nx, ny);
                    ctx.fillStyle = '#fff';
                    ctx.fillText(num, nx, ny);
                } else if (cards[idx].state === S.FACE_UP) {
                    ctx.fillStyle = '#4caf50';
                    ctx.font = `bold ${Math.max(12, cellW * 0.25)}px sans-serif`;
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText('✓', cx + cellW / 2, cy + cellH / 2);
                }
            }
        }
    }

    /* ==========================================================
     *  導線最適化ペアガイド
     *  ─────────────────────────────────────────
     *  Step 1: 類似記述子でペアを検出 (貪欲法)
     *  Step 2: グリッド座標上の巡回コストを最小化
     *        cost = Σ dist(前ペア出口, 次ペア入口)
     *        各ペアの入口/出口を自由に入れ替え可
     *  Step 3: 2-opt 改善で局所最適化
     * ========================================================== */
    function computePairGuide() {
        const detected = [];
        for (let i = 0; i < TOTAL; i++) {
            if (cards[i].state === S.FACE_UP && cards[i].desc) detected.push(i);
        }
        if (detected.length < 2) return;

        // --- ペア検出 (貪欲法: 距離が近い順、閾値あり) ---
        const dists = [];
        for (let i = 0; i < detected.length; i++) {
            for (let j = i + 1; j < detected.length; j++) {
                const d = descDist(cards[detected[i]].desc, cards[detected[j]].desc);
                dists.push({ a: detected[i], b: detected[j], d });
            }
        }
        dists.sort((x, y) => x.d - y.d);
        const used = new Set();
        const rawPairs = [];
        for (const { a, b, d } of dists) {
            if (used.has(a) || used.has(b)) continue;
            if (d > 30) break;   // 類似度閾値: 30以上はペアとみなさない
            rawPairs.push([a, b]);
            used.add(a); used.add(b);
        }
        if (rawPairs.length === 0) return;

        // --- 導線最適化 (Nearest Neighbor + 2-opt) ---
        const optimized = optimizePairPath(rawPairs);

        // --- 結果反映 ---
        pairMap.fill(0);
        for (let i = 0; i < optimized.length; i++) {
            const num = i + 1;
            pairMap[optimized[i][0]] = num;
            pairMap[optimized[i][1]] = num;
        }
        updatePairGuideUI(optimized);
        console.log('[Memory] Pair guide:', optimized.map((p, i) =>
            `${i + 1}:(${Math.floor(p[0] / COLS)},${p[0] % COLS})→(${Math.floor(p[1] / COLS)},${p[1] % COLS})`
        ).join(' '));
    }

    /* ====== 導線最適化 (グリッド座標マンハッタン距離 + 2-opt) ====== */
    function optimizePairPath(rawPairs) {
        if (rawPairs.length <= 1) return rawPairs;
        const N = rawPairs.length;

        // idx → (row, col)
        const rowOf = idx => Math.floor(idx / COLS);
        const colOf = idx => idx % COLS;
        const dist = (i, j) => Math.abs(rowOf(i) - rowOf(j)) + Math.abs(colOf(i) - colOf(j));

        // --- Nearest Neighbor ---
        // 開始ペア: (0,0)に最も近いカードを持つペアを選ぶ
        const remaining = new Set(rawPairs.map((_, i) => i));
        let bestFirstIdx = -1, bestFirstDist = Infinity;
        for (const pi of remaining) {
            const d0 = rowOf(rawPairs[pi][0]) + colOf(rawPairs[pi][0]);
            const d1 = rowOf(rawPairs[pi][1]) + colOf(rawPairs[pi][1]);
            const md = Math.min(d0, d1);
            if (md < bestFirstDist) { bestFirstDist = md; bestFirstIdx = pi; }
        }
        remaining.delete(bestFirstIdx);

        // 最初のペア: 左上に近い方を先にめくる
        const route = [];
        {
            let [a, b] = rawPairs[bestFirstIdx];
            if (rowOf(b) + colOf(b) < rowOf(a) + colOf(a)) [a, b] = [b, a];
            route.push([a, b]);
        }

        // 残りを Nearest Neighbor で追加
        // コスト = dist(前ペア出口B, 候補ペアの近い方のカード)
        while (remaining.size > 0) {
            const exitPos = route[route.length - 1][1];
            let bestPI = -1, bestCost = Infinity, bestFlip = false;

            for (const pi of remaining) {
                const [a, b] = rawPairs[pi];
                const dA = dist(exitPos, a);
                const dB = dist(exitPos, b);
                // 入口は exitPos に近い方を選ぶ
                if (dA <= dB) {
                    if (dA < bestCost) { bestCost = dA; bestPI = pi; bestFlip = false; }
                } else {
                    if (dB < bestCost) { bestCost = dB; bestPI = pi; bestFlip = true; }
                }
            }

            remaining.delete(bestPI);
            let [na, nb] = rawPairs[bestPI];
            if (bestFlip) [na, nb] = [nb, na];
            route.push([na, nb]);
        }

        // --- 2-opt 改善 ---
        twoOptImprove(route, dist);

        return route;
    }

    /* ====== 2-opt 局所探索 ====== */
    function twoOptImprove(route, distFn) {
        const N = route.length;
        if (N < 3) return;

        // 全ルートの遷移コスト合計
        const totalCost = () => {
            let c = 0;
            for (let i = 0; i < N - 1; i++) c += distFn(route[i][1], route[i + 1][0]);
            return c;
        };

        // 各ペアの向きを前ペア出口に合わせて再最適化
        const orientPair = (idx) => {
            if (idx < 1 || idx >= N) return;
            const prevExit = route[idx - 1][1];
            const [a, b] = route[idx];
            if (distFn(prevExit, b) < distFn(prevExit, a)) route[idx] = [b, a];
        };

        let improved = true;
        let iter = 0;
        while (improved && iter < 100) {
            improved = false;
            iter++;
            for (let i = 0; i < N - 1; i++) {
                for (let j = i + 2; j < N; j++) {
                    const before = totalCost();

                    // route[i+1..j] を反転
                    const saved = route.slice(i + 1, j + 1);
                    const seg = saved.slice().reverse();
                    // 反転 → 各ペアの入口/出口も逆転
                    for (let k = 0; k < seg.length; k++) seg[k] = [seg[k][1], seg[k][0]];
                    for (let k = 0; k < seg.length; k++) route[i + 1 + k] = seg[k];

                    // 各ペアの向きを再最適化
                    for (let k = i + 1; k <= Math.min(j + 1, N - 1); k++) orientPair(k);

                    const after = totalCost();
                    if (after < before - 0.001) {
                        improved = true;
                    } else {
                        // 元に戻す
                        for (let k = 0; k < saved.length; k++) route[i + 1 + k] = saved[k];
                    }
                }
            }
        }
        // 最終向き最適化
        for (let i = 1; i < N; i++) orientPair(i);
    }

    /* ====== ペアガイドUI (攻略グリッド側) ====== */
    function updatePairGuideUI(orderedPairs) {
        [$.resGrid, $.mobGrid].forEach(g => {
            if (!g) return;
            Array.from(g.children).forEach(el2 => {
                const old = el2.querySelector('.pair-badge');
                if (old) old.remove();
            });
            for (let i = 0; i < orderedPairs.length; i++) {
                const num = i + 1;
                for (const idx of orderedPairs[i]) {
                    const el2 = g.children[idx];
                    if (!el2) continue;
                    const badge = document.createElement('span');
                    badge.className = 'pair-badge';
                    badge.textContent = num;
                    el2.appendChild(badge);
                }
            }
        });
    }

    /* ====== UI更新 ====== */
    function updateCardUI(idx, container) {
        if (!container) return;
        const el2 = container.children[idx];
        if (!el2 || !cards[idx].faceURL) return;
        el2.querySelector('.card-face').src = cards[idx].faceURL;
        el2.classList.add('revealed');
    }

    function updateDetectionUI() {
        const n = cards.filter(c => c.state === S.FACE_UP).length;
        if ($.detCount) $.detCount.textContent = `検出: ${n}/${TOTAL}`;
        if (n > 0 && $.matchHelper) $.matchHelper.style.display = 'block';
        if (n >= TOTAL && $.calibStat) $.calibStat.textContent = '🎉 全カード検出完了！';
    }

    /* ====== カードクリック → ペアハイライト ====== */
    function onCardClick(idx) {
        if (cards[idx].state !== S.FACE_UP) return;
        clearHighlights();
        highlight($.resGrid, idx, 'selected');
        highlight($.mobGrid, idx, 'selected');
        const myDesc = cards[idx].desc;
        if (!myDesc) return;
        for (let i = 0; i < TOTAL; i++) {
            if (i === idx || cards[i].state !== S.FACE_UP) continue;
            if (descDist(myDesc, cards[i].desc) < 20) {
                highlight($.resGrid, i, 'highlighted');
                highlight($.mobGrid, i, 'highlighted');
            }
        }
    }

    function highlight(container, idx, cls) {
        if (!container) return;
        const e = container.children[idx];
        if (e) e.classList.add(cls);
    }

    function clearHighlights() {
        document.querySelectorAll('.memory-card').forEach(e => e.classList.remove('highlighted', 'selected'));
    }

    /* ====== フルリセット ====== */
    function fullReset() {
        resetCards();
        grid = null;
        detectAttempts = 0;
        pairMap.fill(0);
        [$.resGrid, $.mobGrid].forEach(g => {
            if (!g) return;
            Array.from(g.children).forEach(e => {
                e.classList.remove('revealed', 'highlighted', 'selected');
                const f = e.querySelector('.card-face');
                if (f) f.src = '';
                const b = e.querySelector('.pair-badge');
                if (b) b.remove();
            });
        });
        if ($.detCount) $.detCount.textContent = `検出: 0/${TOTAL}`;
        if ($.matchHelper) $.matchHelper.style.display = 'none';
        clearHighlights();
        if ($.calibStat) {
            $.calibStat.textContent = '⏳ カード位置を検出中...';
            $.calibStat.classList.remove('detected');
        }
    }

    /* ====== 手動キャリブレーション モーダル ====== */
    let modalCorners = [];

    function openModal() {
        $.modal.style.display = 'flex';
        modalCorners = [];
        updateModalUI();
        const v = $.video;
        if (v && v.readyState >= 2) {
            const mc = $.modalCanvas;
            mc.width = v.videoWidth; mc.height = v.videoHeight;
            const mctx = mc.getContext('2d');
            if (offCanvas && offCanvas.width > 0) mctx.drawImage(offCanvas, 0, 0);
            else mctx.drawImage(v, 0, 0);
        }
        $.modalCanvas.removeEventListener('click', onModalClick);
        $.modalCanvas.addEventListener('click', onModalClick);
    }

    function closeModal() {
        $.modal.style.display = 'none';
        $.modalCanvas.removeEventListener('click', onModalClick);
    }

    function onModalClick(e) {
        if (modalCorners.length >= 2) return;
        const rect = $.modalCanvas.getBoundingClientRect();
        const sx = $.modalCanvas.width / rect.width;
        const sy = $.modalCanvas.height / rect.height;
        modalCorners.push({ x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy });
        updateModalUI();
    }

    function updateModalUI() {
        const mc = $.modalCanvas, mctx = mc.getContext('2d');
        const v = $.video;
        if (v && v.readyState >= 2) {
            if (offCanvas && offCanvas.width > 0) mctx.drawImage(offCanvas, 0, 0);
            else mctx.drawImage(v, 0, 0);
        }
        modalCorners.forEach((pt, i) => {
            mctx.fillStyle = i === 0 ? '#ff4444' : '#4caf50';
            mctx.beginPath(); mctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2); mctx.fill();
            mctx.strokeStyle = '#fff'; mctx.lineWidth = 2; mctx.stroke();
        });
        if (modalCorners.length === 2) {
            mctx.strokeStyle = 'rgba(255,215,0,0.5)'; mctx.lineWidth = 2;
            mctx.strokeRect(modalCorners[0].x, modalCorners[0].y,
                modalCorners[1].x - modalCorners[0].x, modalCorners[1].y - modalCorners[0].y);
        }
        $.calibCorner1.textContent = modalCorners[0] ? `左上: (${Math.round(modalCorners[0].x)}, ${Math.round(modalCorners[0].y)})` : '左上: 未設定';
        $.calibCorner2.textContent = modalCorners[1] ? `右下: (${Math.round(modalCorners[1].x)}, ${Math.round(modalCorners[1].y)})` : '右下: 未設定';
        $.btnCalibApply.disabled = modalCorners.length < 2;
    }

    function applyManualCalib() {
        if (modalCorners.length < 2) return;
        const x0 = Math.min(modalCorners[0].x, modalCorners[1].x);
        const y0 = Math.min(modalCorners[0].y, modalCorners[1].y);
        const w = Math.abs(modalCorners[1].x - modalCorners[0].x);
        const h = Math.abs(modalCorners[1].y - modalCorners[0].y);
        const cellW = w / COLS, cellH = h / ROWS;
        grid = { x: x0, y: y0, cellW, cellH, cardW: cellW * 0.88, cardH: cellH * 0.9 };
        resetCards();
        $.calibStat.textContent = '✅ 手動設定完了 → ベースライン取得中...';
        $.calibStat.classList.add('detected');
        closeModal();
    }

    /* ====== スマホモード ====== */
    function onFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        $.fileName.textContent = file.name;
        $.fileSize.textContent = `(${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
        $.uploadInfo.style.display = 'flex';
        const url = URL.createObjectURL(file);
        $.hiddenVideo.src = url;
        $.hiddenVideo.onloadedmetadata = () => { showStep('stepCalibrate'); drawCalibFrame(); };
    }

    function showStep(stepId) {
        ['stepUpload', 'stepCalibrate', 'stepAnalyze', 'stepResult'].forEach(id => {
            const e = document.getElementById(id);
            if (!e) return;
            if (id === stepId) { e.classList.add('active'); e.classList.remove('completed'); }
            else if (e.classList.contains('active')) { e.classList.remove('active'); e.classList.add('completed'); }
        });
    }

    let calibStartTime = 0; // ベースライン取得＆解析開始する時刻

    function drawCalibFrame() {
        const v = $.hiddenVideo;
        // 動画の最初のフレームを表示
        v.currentTime = 0;
        v.onseeked = () => {
            const cc = $.calibCanvas;
            cc.width = v.videoWidth; cc.height = v.videoHeight;
            cc.getContext('2d').drawImage(v, 0, 0);
            setupCalibClick();
            setupSeekBar();
        };
    }

    function setupSeekBar() {
        if (!$.seekBar) return;
        const v = $.hiddenVideo;
        $.seekBar.value = 0;
        updateSeekTimeDisplay(0);
        $.seekBar.oninput = async () => {
            const t = ($.seekBar.value / 1000) * v.duration;
            calibStartTime = t;
            await seekTo(v, t);
            const cc = $.calibCanvas;
            const ctx = cc.getContext('2d');
            ctx.drawImage(v, 0, 0);
            // キャリブ点があれば再描画
            mobCalibPts.forEach((pt, i) => {
                ctx.fillStyle = i === 0 ? '#ff4444' : '#4caf50';
                ctx.beginPath(); ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
            });
            if (mobCalibPts.length === 2) {
                ctx.strokeStyle = 'rgba(255,215,0,0.5)'; ctx.lineWidth = 2;
                ctx.strokeRect(mobCalibPts[0].x, mobCalibPts[0].y,
                    mobCalibPts[1].x - mobCalibPts[0].x, mobCalibPts[1].y - mobCalibPts[0].y);
            }
            updateSeekTimeDisplay(t);
        };
    }

    function updateSeekTimeDisplay(t) {
        const v = $.hiddenVideo;
        if (!$.seekTime || !v.duration) return;
        const fmt = s => {
            const m = Math.floor(s / 60);
            const sec = (s % 60).toFixed(1);
            return `${m}:${sec.padStart(4, '0')}`;
        };
        $.seekTime.textContent = `${fmt(t)} / ${fmt(v.duration)}`;
    }

    function setupCalibClick() {
        mobCalibPts = [];
        $.calibCanvas.removeEventListener('click', onCalibClick);
        $.calibCanvas.addEventListener('click', onCalibClick);
    }

    function onCalibClick(e) {
        if (mobCalibPts.length >= 2) return;
        const rect = $.calibCanvas.getBoundingClientRect();
        mobCalibPts.push({
            x: (e.clientX - rect.left) * ($.calibCanvas.width / rect.width),
            y: (e.clientY - rect.top) * ($.calibCanvas.height / rect.height)
        });
        updateCalibUI();
    }

    function updateCalibUI() {
        const ctx = $.calibCanvas.getContext('2d');
        ctx.drawImage($.hiddenVideo, 0, 0);
        mobCalibPts.forEach((pt, i) => {
            ctx.fillStyle = i === 0 ? '#ff4444' : '#4caf50';
            ctx.beginPath(); ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        });
        if (mobCalibPts.length === 2) {
            ctx.strokeStyle = 'rgba(255,215,0,0.5)'; ctx.lineWidth = 2;
            ctx.strokeRect(mobCalibPts[0].x, mobCalibPts[0].y,
                mobCalibPts[1].x - mobCalibPts[0].x, mobCalibPts[1].y - mobCalibPts[0].y);
        }
        $.btnConfirmCalib.disabled = mobCalibPts.length < 2;
    }

    function startMobileAnalysis() {
        if (mobCalibPts.length < 2) return;
        const x0 = Math.min(mobCalibPts[0].x, mobCalibPts[1].x);
        const y0 = Math.min(mobCalibPts[0].y, mobCalibPts[1].y);
        const w = Math.abs(mobCalibPts[1].x - mobCalibPts[0].x);
        const h = Math.abs(mobCalibPts[1].y - mobCalibPts[0].y);
        const cellW = w / COLS, cellH = h / ROWS;
        grid = { x: x0, y: y0, cellW, cellH, cardW: cellW * 0.88, cardH: cellH * 0.9 };
        resetCards();
        showStep('stepAnalyze');
        startVideoAnalysis();
    }

    async function startVideoAnalysis() {
        const v = $.hiddenVideo;
        const ac = $.analysisCanvas;
        const dur = v.duration;
        const startT = calibStartTime || 0;
        const interval = 0.1;            // 100ms間隔 (安定フレーム取得用)
        const totalFrames = Math.ceil((dur - startT) / interval);
        let frameIdx = 0, firstFrame = true;
        ac.width = v.videoWidth; ac.height = v.videoHeight;
        const actx = ac.getContext('2d', { willReadFrequently: true });

        for (let t = startT; t < dur; t += interval) {
            await seekTo(v, t);
            actx.drawImage(v, 0, 0);
            const imgData = actx.getImageData(0, 0, ac.width, ac.height);
            if (firstFrame) {
                captureBaselines(imgData.data, ac.width, grid);
                firstFrame = false;
            } else {
                for (let r = 0; r < ROWS; r++) {
                    for (let c2 = 0; c2 < COLS; c2++) {
                        const idx = r * COLS + c2;
                        if (cards[idx].state === S.FACE_UP) continue;
                        const desc = getCardDesc(imgData.data, ac.width, grid, r, c2);
                        if (!desc) continue;
                        const bl = baselines[idx];
                        if (!bl) continue;
                        const change = descRMSE(bl, desc);
                        if (change < cfg.changeThresh) {
                            // ベースラインに戻った → もし候補があれば確定 (保存済みの表面画像を使用)
                            if (cards[idx]._candidate) {
                                const cn = cards[idx]._candidate;
                                cards[idx].state = S.FACE_UP;
                                cards[idx].faceURL = cn.dataURL;
                                cards[idx].desc = cn.desc;
                                updateCardUI(idx, $.resGrid);
                                updateCardUI(idx, $.mobGrid);
                                cards[idx]._candidate = null;
                                console.log(`[Memory] Card ${r + 1}-${c2 + 1} confirmed (baseline returned)`);
                            }
                            cards[idx].stableCount = 0;
                            continue;
                        }
                        // ベースラインから変化 → フレーム間安定性を確認
                        const frameDiff = cards[idx].prevDesc ? descRMSE(cards[idx].prevDesc, desc) : Infinity;
                        cards[idx].prevDesc = desc;
                        if (frameDiff < cfg.stabilityThresh * 2) {
                            cards[idx].stableCount++;
                            if (cards[idx].stableCount >= 2) {
                                // 安定した表面 → 候補として記録 (最も安定したフレームを使う)
                                const cx = grid.x + c2 * grid.cellW + (grid.cellW - grid.cardW) / 2;
                                const cy = grid.y + r * grid.cellH + (grid.cellH - grid.cardH) / 2;
                                if (!cards[idx]._candidate || frameDiff < cards[idx]._candidate.diff) {
                                    // このフレームのキャプチャを候補に保存
                                    const fc = document.createElement('canvas');
                                    const fw = Math.round(grid.cardW), fh = Math.round(grid.cardH);
                                    fc.width = fw; fc.height = fh;
                                    fc.getContext('2d').drawImage(actx.canvas,
                                        Math.round(cx), Math.round(cy), fw, fh, 0, 0, fw, fh);
                                    cards[idx]._candidate = { cx, cy, cw: grid.cardW, ch: grid.cardH,
                                        diff: frameDiff, dataURL: fc.toDataURL('image/png'),
                                        desc: computeDesc(fc.getContext('2d').getImageData(0, 0, fw, fh).data, fw, 0, 0, fw, fh) };
                                }
                            }
                        } else { cards[idx].stableCount = 0; }
                    }
                }
            }
            frameIdx++;
            const pct = Math.round((frameIdx / totalFrames) * 100);
            $.analyzeProgress.style.width = pct + '%';
            $.analyzeProgressText.textContent = pct + '%';
            $.analyzeDetected.textContent = cards.filter(c => c.state === S.FACE_UP).length;
            $.analyzeFrames.textContent = frameIdx;
            if (cards.filter(c => c.state === S.FACE_UP).length >= TOTAL) break;
            await new Promise(r => setTimeout(r, 0));
        }

        // 動画終了時に残っている候補を確定
        for (let idx = 0; idx < TOTAL; idx++) {
            if (cards[idx].state !== S.FACE_UP && cards[idx]._candidate) {
                const cn = cards[idx]._candidate;
                cards[idx].state = S.FACE_UP;
                cards[idx].faceURL = cn.dataURL;
                cards[idx].desc = cn.desc;
                updateCardUI(idx, $.resGrid);
                updateCardUI(idx, $.mobGrid);
                cards[idx]._candidate = null;
            }
        }
        // ペアガイド計算
        const detectedCount = cards.filter(c => c.state === S.FACE_UP).length;
        if (detectedCount >= 2) computePairGuide();
        updateDetectionUI();

        // 進捗を100%に
        $.analyzeProgress.style.width = '100%';
        $.analyzeProgressText.textContent = '100%';

        showStep('stepResult');
    }

    function seekTo(v, t) {
        return new Promise(resolve => { v.currentTime = t; v.onseeked = resolve; });
    }

    /* ====== PiP ====== */
    function startPiP() {
        const pc = $.pipCanvas, pctx = pc.getContext('2d');
        drawPiPGrid(pctx, pc.width, pc.height);
        const pipStream = pc.captureStream(1);
        $.pipVideo.srcObject = pipStream;
        $.pipVideo.play().then(() => {
            if ($.pipVideo.requestPictureInPicture) $.pipVideo.requestPictureInPicture().catch(console.warn);
        });
    }

    function drawPiPGrid(ctx, w, h) {
        ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
        const pad = 10;
        const cellW = (w - pad * 2) / COLS, cellH = (h - pad * 2) / ROWS;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const idx = r * COLS + c;
                const x = pad + c * cellW, y = pad + r * cellH;
                ctx.strokeStyle = '#3a3555'; ctx.lineWidth = 1;
                ctx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);
                if (cards[idx].state === S.FACE_UP && cards[idx].faceURL) {
                    const img = new Image(); img.src = cards[idx].faceURL;
                    try { ctx.drawImage(img, x + 2, y + 2, cellW - 4, cellH - 4); } catch {}
                }
                if (pairMap[idx] > 0) {
                    const fs = Math.max(12, Math.min(cellW, cellH) * 0.35);
                    ctx.font = `bold ${fs}px sans-serif`;
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.strokeStyle = 'rgba(0,0,0,0.8)'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
                    ctx.strokeText(pairMap[idx], x + cellW / 2, y + cellH / 2);
                    ctx.fillStyle = '#ffd700';
                    ctx.fillText(pairMap[idx], x + cellW / 2, y + cellH / 2);
                }
            }
        }
    }

    function mobileReset() {
        fullReset();
        showStep('stepUpload');
        $.uploadInfo.style.display = 'none';
        $.btnConfirmCalib.disabled = true;
        mobCalibPts = [];
        calibStartTime = 0;
    }

})();
