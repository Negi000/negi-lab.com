// UI関連の初期化とイベントハンドリング
document.addEventListener('DOMContentLoaded', () => {
    // QRGeneratorのインスタンスを生成
    const qrGenerator = new QRGenerator();
    window.qrGenerator = qrGenerator; // デバッグや他のスクリプトからのアクセスのためにグローバルに公開

    // --- UI要素の参照 ---
    const singleModeBtn = document.getElementById('singleModeBtn');
    const batchModeBtn = document.getElementById('batchModeBtn');
    const singleGenerationSection = document.getElementById('singleGenerationSection');
    const batchGenerationSection = document.getElementById('batchGenerationSection');
    const inputSection = document.getElementById('inputSection');
    const templateButtons = document.querySelectorAll('.qr-template-btn');
    const templateInputs = document.querySelectorAll('.template-input');
    const generateBtn = document.getElementById('generateBtn');
    const qrResult = document.getElementById('qrResult');
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const standardModeBtn = document.getElementById('standardModeBtn');
    const creativeModeBtn = document.getElementById('creativeModeBtn');
    const creativeOptions = document.getElementById('creativeOptions');
    const creativeDownloadSection = document.getElementById('creativeDownloadSection');
    const shapeButtons = document.querySelectorAll('.shape-btn[data-shape]');
    const colorModeSelect = document.getElementById('colorMode');
    const gradientSettings = document.getElementById('gradientSettings');
    const downloadSVGBtn = document.getElementById('downloadSVG');
    const downloadPNGBtn = document.getElementById('downloadPNG');

    // --- ヘルパー関数 ---
    const updateActiveButton = (buttons, activeButton) => {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    };

    // --- イベントリスナー ---

    // 1. 生成モード切替 (単体/バッチ)
    singleModeBtn.addEventListener('click', () => {
        qrGenerator.setMode('single');
        updateActiveButton([singleModeBtn, batchModeBtn], singleModeBtn);
        singleGenerationSection.style.display = 'block';
        inputSection.style.display = 'block';
        batchGenerationSection.style.display = 'none';
    });

    batchModeBtn.addEventListener('click', () => {
        qrGenerator.setMode('batch');
        updateActiveButton([singleModeBtn, batchModeBtn], batchModeBtn);
        singleGenerationSection.style.display = 'none';
        inputSection.style.display = 'none';
        batchGenerationSection.style.display = 'block';
    });

    // 2. テンプレート選択
    templateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const template = btn.dataset.template;
            qrGenerator.setTemplate(template);
            updateActiveButton(templateButtons, btn);

            templateInputs.forEach(input => {
                input.style.display = input.id === `${template}Input` ? 'block' : 'none';
            });
        });
    });

    // 3. デザインモード切替 (標準/クリエイティブ)
    standardModeBtn.addEventListener('click', () => {
        qrGenerator.setDesignMode('standard');
        updateActiveButton([standardModeBtn, creativeModeBtn], standardModeBtn);
        creativeOptions.style.display = 'none';
        downloadBtn.style.display = 'block'; // 標準DLボタンを表示
        creativeDownloadSection.style.display = 'none';
        qrGenerator.generate(); // モード変更時に再生成
    });

    creativeModeBtn.addEventListener('click', () => {
        qrGenerator.setDesignMode('creative');
        updateActiveButton([standardModeBtn, creativeModeBtn], creativeModeBtn);
        creativeOptions.style.display = 'block';
        downloadBtn.style.display = 'none'; // 標準DLボタンを非表示
        creativeDownloadSection.style.display = 'block';
        qrGenerator.generate(); // モード変更時に再生成
    });

    // 4. クリエイティブ設定
    // セルの形状
    shapeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.dataset.shape;
            qrGenerator.currentShape = shape;
            updateActiveButton(shapeButtons, btn);
            qrGenerator.generate();
        });
    });

    // カラーモード
    colorModeSelect.addEventListener('change', (e) => {
        const mode = e.target.value;
        qrGenerator.currentColorMode = mode;
        gradientSettings.style.display = mode === 'gradient' ? 'block' : 'none';
        qrGenerator.generate();
    });
    
    // グラデーション設定など、他のクリエイティブUIのイベントリスナーもここに追加...
    document.getElementById('gradientStart').addEventListener('input', () => qrGenerator.generate());
    document.getElementById('gradientEnd').addEventListener('input', () => qrGenerator.generate());
    document.getElementById('gradientDirection').addEventListener('change', () => qrGenerator.generate());


    // 5. 生成ボタン
    generateBtn.addEventListener('click', () => {
        qrGenerator.generate();
    });

    // 6. ダウンロードボタン
    downloadSVGBtn.addEventListener('click', () => qrGenerator.download('svg'));
    downloadPNGBtn.addEventListener('click', () => qrGenerator.download('png'));
    downloadBtn.addEventListener('click', () => qrGenerator.download()); // 標準ダウンロード
    
    // --- 初期化 ---
    // 初期状態で単体モードのUIを表示
    singleModeBtn.click();
    // 初期状態でテキストテンプレートを選択
    document.querySelector('.qr-template-btn[data-template="text"]').click();
    // 初期状態で標準デザインモードを選択
    standardModeBtn.click();
});
