// UI関連の初期化とイベントハンドリング
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM読み込み完了 - QRGeneratorインスタンス確認');
    
    // QRGeneratorInstanceが初期化されるまで待機（最大10秒、50回まで）
    let attempts = 0;
    const maxAttempts = 50;
    
    const checkQRGenerator = () => {
        attempts++;
        if (window.qrGeneratorInstance) {
            console.log('✅ QRGeneratorインスタンス確認成功');
            // 必要に応じて追加のUI初期化処理をここに記述
        } else if (attempts < maxAttempts) {
            console.log(`⏳ QRGeneratorインスタンス待機中... (${attempts}/${maxAttempts})`);
            setTimeout(checkQRGenerator, 200); // 200ms後に再チェック
        } else {
            console.error('❌ QRGeneratorインスタンス初期化タイムアウト');
            // フォールバック処理：強制的にインスタンスを作成
            try {
                window.qrGeneratorInstance = new QRGenerator();
                console.log('✅ フォールバック: QRGeneratorインスタンス作成成功');
            } catch (error) {
                console.error('❌ フォールバック: QRGeneratorインスタンス作成失敗:', error);
            }
        }
    };
    
    checkQRGenerator();
});
