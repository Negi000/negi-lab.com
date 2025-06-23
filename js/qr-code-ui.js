// UI関連の初期化とイベントハンドリング
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM読み込み完了 - QRGenerator初期化開始');
    
    // QRGeneratorのインスタンスを生成
    try {
        const qrGenerator = new QRGenerator();
        window.qrGenerator = qrGenerator; // デバッグ用にグローバルに公開
        console.log('✅ QRGenerator初期化成功');
    } catch (error) {
        console.error('❌ QRGenerator初期化失敗:', error);
    }
});
